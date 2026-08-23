import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Card, CardBody, Chip } from "@heroui/react";
import { Button } from "@heroui/button";
import { RiStarFill, RiHeartFill, RiHeartLine } from "@remixicon/react";
import ProductRatingModal from "../../components/Modals/ProductRatingModal";
import { toast } from "sonner";
import { addToFavorite, removeFromFavorite } from "@/interceptor/routes";
import { setFavorites } from "@/store/reducers/favoritesSlice";
import { getUserData } from "@/events/getters";
import { formatPrice } from "@/helpers/functionHelper";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

const ProductCard = ({
  id,
  image,
  title,
  price,
  discount,
  categoryName,
  rating,
  discountedPrice,
  product,
  isFavorite,
  onFavoriteChange,
  indicator,
  data,
  is_spicy,
  best_seller,
}) => {
  const userData = getUserData();
  const branchData = useSelector((state) => state.branch);
  const [checkedItems, setCheckedItems] = useState({});
  const [showRatingModal, setShowRatingModal] = useState(false);

  const dispatch = useDispatch();

  const favorites = useSelector((state) => state.favorites.value);

  const authentication = userData === false ? false : true;

  const branch_id = branchData.id;

  const { t } = useTranslation();
  const router = useRouter();

  const handleFavChange = useCallback(
    async (value, id) => {
      if (!authentication) {
        return toast.error("Please Login First!");
      }
      try {
        if (value) {
          const add_fav = await addToFavorite({ type_id: id, branch_id });
          if (add_fav.error) {
            toast.error(add_fav.message);
          } else {
            toast.success(add_fav.message);
            onFavoriteChange(true, id);
          }
        } else {
          const removeFav = await removeFromFavorite({
            type_id: id,
            branch_id,
          });
          if (removeFav.error) {
            toast.error(removeFav.message);
          } else {
            toast.success(removeFav.message);
            onFavoriteChange(false, id);
          }
        }
      } catch (error) {
        console.error("Error updating favorite:", error);
      }
    },
    [authentication, branch_id, onFavoriteChange]
  );

  return (
    <Card
      className="relative group rounded-lg text-center overflow-hidden bg-transparent"
      shadow="sm"
    >
      {/* Favorite Button */}
      <button
        onClick={() => handleFavChange(!isFavorite, product.id)}
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-300"
      >
        {isFavorite ? (
          <RiHeartFill className="w-5 h-5 text-red-500" />
        ) : (
          <RiHeartLine className="w-5 h-5 text-gray-500 hover:text-red-500" />
        )}
      </button>

      {best_seller === "1" && (
        <div className="absolute top-0 left-0 z-10">
          <div className="bg-primary-500 text-white py-1 px-3 text-xs font-semibold shadow-md flex items-center gap-1 rounded-br-lg">
            <img
              src="/assets/icons/icon_bestseller.svg"
              alt="Best Seller"
              className="w-3 h-3"
            />
            {t("best_selling")}
          </div>
        </div>
      )}

      <CardBody className="pt-4 px-4 pb-4 flex flex-col items-center">
        <div className="relative w-full aspect-square mb-3 rounded-xl overflow-hidden bg-gray-50">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        <h2
          className="text-base font-semibold text-center mb-1
          w-full flex items-start justify-center gap-2 min-h-[48px]"
          title={title}
        >
          <span className="line-clamp-2 leading-tight">{title}</span>
          {is_spicy === "1" && (
            <img
              src="/assets/icons/icon_spicy.svg"
              alt="Spicy"
              className="w-3.5 h-3.5"
            />
          )}
        </h2>

        <Chip
          as="div"
          size="sm"
          classNames={{
            base: "font-semibold text-xs text-primary-500 mb-1",
            content: "truncate overflow-hidden whitespace-nowrap max-w-[150px]",
          }}
          title={categoryName}
        >
          <span className="truncate block">{categoryName}</span>
        </Chip>

        {rating > 0 && (
          <div
            className="flex justify-center mb-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setShowRatingModal(true)}
          >
            {[...Array(5)].map((_, i) => (
              <RiStarFill
                key={i}
                className={`w-4 h-4 ${
                  i < rating ? "text-yellow-400" : "text-gray-300"
                } duration-500`}
              />
            ))}
          </div>
        )}

        <div className="text-center mb-3 flex items-center justify-center space-x-2">
          {discountedPrice !== price && discountedPrice != 0 && (
            <span className="text-xs text-gray-500 line-through">
              {formatPrice(price)}
            </span>
          )}
          <span className="text-md text-primary-500 ml-2 transition-colors duration-500 font-bold">
            {formatPrice(discountedPrice !== 0 ? discountedPrice : price)}
          </span>
          {discount !== undefined &&
            discount !== null &&
            discount !== 0 &&
            discount !== 100 && (
              <span className="text-sm text-green-600 font-medium ml-2">
                {discount}% off
              </span>
            )}
        </div>

        <Button
          color="primary"
          onPress={() => router.push(`/products/${product?.id}`)}
          className="bg-primary-500 rounded px-2 py-2 font-semibold"
        >
          {t("add")}
        </Button>
        <ProductRatingModal
            isOpen={showRatingModal}
            onClose={() => setShowRatingModal(false)}
            productId={product?.id}
            productName={title}
        />
      </CardBody>
    </Card>
  );
};

export default ProductCard;
