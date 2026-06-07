import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

const CategoryCard = ({ category }) => {
  const router = useRouter();

  return (
    <div
      className="group flex flex-col items-center cursor-pointer"
      onClick={() => router.push(`/categories/${category.slug}`)}
      aria-label={`View category: ${category.name}`}
    >
      {/* Card image — rounded square, full image visible */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden
                      border border-gray-100 bg-white
                      shadow-sm group-hover:shadow-md
                      transition-all duration-300 group-hover:-translate-y-1">
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 90px, 130px"
          className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
        />
        {/* brand-color bottom bar on hover */}
        <div className="absolute bottom-0 inset-x-0 h-[3px] bg-primary
                        scale-x-0 group-hover:scale-x-100
                        transition-transform duration-300 origin-left" />
      </div>

      {/* Category Name */}
      <p className="mt-2 text-xs sm:text-sm font-semibold text-center
                    text-gray-700 group-hover:text-primary
                    transition-colors duration-200
                    line-clamp-2 leading-tight w-full"
         title={category.name}>
        {category.name}
      </p>
    </div>
  );
};

export default CategoryCard;
