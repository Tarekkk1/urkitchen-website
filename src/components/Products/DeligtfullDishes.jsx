import React, { useCallback, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Autoplay, Pagination } from "swiper/modules";
import ProductCard from "../../components/Cards/ProductCards";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import SectionHeading from "../SectionHeading/SectionHeading";

const DelightfulDishes = ({ data, onFavoriteChange, isItemFavorited }) => {
  const { t } = useTranslation();

  const router = useRouter();

  const handleViewAllClick = () => {
    router.push(`/products`);
  };

  return (
    <div className="mx-auto px-0 py-2">
      <SectionHeading
        title={t("delightful_dishes")}
        shortDescription="Flavors to brighten your day."
        onShowMoreClick={handleViewAllClick}
      />

      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        speed={1200}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        effect="slide"
        pagination={true}
        breakpoints={{
          380: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 6 },
        }}
      >
        {data.map((item, index) => (
          <SwiperSlide key={index}>
            <ProductCard
              image={item.image_sm}
              title={item.name}
              categoryName={item.category_name}
              rating={item.rating}
              price={item.variants[0]?.price}
              specialPrice={item.variants[0]?.special_price}
              discount={item.min_max_price.discount_in_percentage}
              discountedPrice={
                item.variants[0]?.special_price != 0
                  ? item.variants[0]?.special_price
                  : item.variants[0]?.price
              }
              description={item.description}
              product={item}
              onFavoriteChange={onFavoriteChange}
              isFavorite={isItemFavorited(item.id)}
              indicator={item.indicator}
              is_spicy={item.is_spicy}
              best_seller={item.best_seller}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default DelightfulDishes;
