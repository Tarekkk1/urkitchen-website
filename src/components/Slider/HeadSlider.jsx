"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";

const HeadSlider = ({ images = [] }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        slidesPerView={1}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        loop={images.length > 1}
        className="w-full"
      >
        {images.map((image, index) => {
          let link = "#";
          if (image?.type === "categories" && image?.data?.length > 0) {
            link = `/categories/${image?.data[0]?.slug}`;
          } else if (image?.type === "products" && image?.data?.length > 0) {
            link = `/products`;
          }

          return (
            <SwiperSlide key={index}>
              <Link href={link} className="block">
                <div className="w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.image}
                    alt={`Banner ${index + 1}`}
                    className="w-full object-contain max-h-[520px]"
                    style={{ display: "block" }}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  {/* subtle gradient overlay at bottom for dot visibility */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <style jsx global>{`
        .swiper-pagination-bullet {
          background: #fff;
          opacity: 0.6;
          width: 8px;
          height: 8px;
        }
        .swiper-pagination-bullet-active {
          background: #fff;
          opacity: 1;
          width: 24px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default HeadSlider;
