import React, { useCallback, useEffect, useState } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { RadioGroup, Radio, Chip, Image } from "@heroui/react";
import { Button } from "@heroui/button";
import { RiAddLine, RiStarFill, RiSubtractLine } from "@remixicon/react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { HeadTitle } from "@/components/HeadTitle";
import { get_products } from "@/interceptor/routes";
import { add_to_cart } from "@/events/actions";
import { isLogged } from "@/events/getters";
import { formatPrice } from "@/helpers/functionHelper";
import ProductsSkeleton from "@/components/Skeleton/ProductsSkeleton";

const ProductDetail = ({ productId }) => {
  const { t } = useTranslation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await get_products({ id: productId });
        const item = response?.data?.[0] || null;
        if (cancelled) return;

        setProduct(item);

        const variants = item?.variants || [];
        setSelectedVariant(variants.length > 0 ? variants[0] : null);
        setSelectedAddOns(
          item?.product_add_ons?.map((addon) => ({ ...addon, quantity: 0 })) ||
            []
        );
        setQuantity(1);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (productId) fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const variants = product?.variants || [];
  const addOns = product?.product_add_ons;

  const price = variants[0]?.price;
  const discountedPrice =
    variants[0]?.special_price != 0 ? variants[0]?.special_price : variants[0]?.price;
  const discount = product?.min_max_price?.discount_in_percentage;

  const shouldShowVariants =
    variants.length > 1 || (variants.length === 1 && variants[0].variant_values);

  const handleQuantityChange = (increment) => {
    setQuantity((prev) => Math.max(1, prev + increment));
  };

  const handleVariantChange = (value) => {
    const variant = variants.find((v) => v.id === value);
    setSelectedVariant(variant);
  };

  const handleAddonToggle = (addonId) => {
    setSelectedAddOns((prev) =>
      prev.map((addon) =>
        addon.id === addonId
          ? { ...addon, quantity: addon.quantity === 0 ? 1 : 0 }
          : addon
      )
    );
  };

  const calculateTotalPrice = () => {
    let basePrice;

    if (selectedVariant) {
      basePrice =
        selectedVariant.special_price &&
        parseFloat(selectedVariant.special_price) !== 0
          ? parseFloat(selectedVariant.special_price)
          : parseFloat(selectedVariant.price);
    } else {
      basePrice = discountedPrice !== 0 ? discountedPrice : price;
    }

    const addOnsTotalForSingleItem = selectedAddOns.reduce(
      (sum, addon) => sum + addon.price * addon.quantity,
      0
    );

    return (basePrice + addOnsTotalForSingleItem) * quantity;
  };

  const getSubtotals = () => {
    const basePrice = selectedVariant
      ? selectedVariant.special_price &&
        parseFloat(selectedVariant.special_price) !== 0
        ? parseFloat(selectedVariant.special_price)
        : parseFloat(selectedVariant.price)
      : discountedPrice !== 0
        ? discountedPrice
        : price;

    const basePriceTotal = basePrice * quantity;

    const addOnsTotal = selectedAddOns.reduce(
      (sum, addon) => sum + addon.price * addon.quantity * quantity,
      0
    );

    return { basePriceTotal, addOnsTotal };
  };

  const renderPrice = () => {
    if (!selectedVariant) return null;

    const originalPrice = parseFloat(selectedVariant.price);
    const specialPrice = parseFloat(selectedVariant.special_price || 0);
    const hasSpecialPrice = specialPrice > 0;

    let discountPercentage = hasSpecialPrice
      ? Math.round(((originalPrice - specialPrice) / originalPrice) * 100)
      : 0;

    if (variants.length > 0 && selectedVariant.id === variants[0].id && discount) {
      discountPercentage = discount;
    }

    return (
      <div className="flex items-center space-x-2 mt-2">
        <span className="text-xl font-bold text-primary">
          {formatPrice(hasSpecialPrice ? specialPrice : originalPrice)}
        </span>

        {hasSpecialPrice && (
          <span className="text-sm text-gray-500 line-through">
            {formatPrice(originalPrice)}
          </span>
        )}

        {hasSpecialPrice && discountPercentage > 0 && discountPercentage !== 100 && (
          <span className="text-sm text-green-600 font-medium">
            {discountPercentage}% off
          </span>
        )}
      </div>
    );
  };

  const addToCart = async () => {
    if (!isLogged()) {
      return toast.error("Please login to continue");
    }

    setSubmitting(true);

    try {
      await add_to_cart({
        product_variant_id: selectedVariant.id,
        qty: quantity,
        addons: selectedAddOns.filter((addon) => addon.quantity > 0),
      });
    } catch (error) {
      console.error("Error in addToCart:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <ProductsSkeleton className="p-6" count={1} />;
  }

  if (!product) {
    return (
      <div className="p-6 text-center text-gray-500">Product not found</div>
    );
  }

  return (
    <div className="mx-auto max-w-[1000px] px-4 sm:px-6 md:px-8 py-4">
      <HeadTitle title={product.name} />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <div className="w-full aspect-square rounded-lg overflow-hidden">
            <Image
              src={product.image_sm}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">{product.name}</h1>
            <Chip
              as="div"
              size="sm"
              classNames={{
                base: "font-semibold text-xs text-primary-500 mb-1 rounded",
                content: "truncate overflow-hidden whitespace-nowrap max-w-[150px]",
              }}
              title={product.category_name}
            >
              <span className="truncate block">{product.category_name}</span>
            </Chip>
            {product.rating > 0 && (
              <div className="flex justify-start my-2">
                {[...Array(5)].map((_, i) => (
                  <RiStarFill
                    key={i}
                    className={`w-4 h-4 ${
                      i < product.rating ? "text-yellow-400" : "text-gray-300"
                    } duration-500`}
                  />
                ))}
              </div>
            )}
            {renderPrice()}
          </div>

          {(product.description || product.short_description) && (
            <p className="text-sm">
              {product.description || product.short_description}
            </p>
          )}

          {shouldShowVariants && (
            <Card className="rounded-lg shadow-lg border border-gray-200 dark:border-gray-500">
              <CardHeader className="font-semibold text-base md:text-lg">
                {t("variants")}
              </CardHeader>
              <CardBody className="px-3 md:px-6">
                <RadioGroup
                  value={selectedVariant?.id || ""}
                  onValueChange={handleVariantChange}
                  className="space-y-2"
                >
                  {variants.map((variant) => {
                    const hasSpecialPrice =
                      variant.special_price && parseFloat(variant.special_price) !== 0;
                    const displayPrice = hasSpecialPrice
                      ? variant.special_price
                      : variant.price;

                    return (
                      <Radio
                        key={variant.id}
                        value={variant.id}
                        label={`Option ${variant.id}`}
                        description={`${formatPrice(displayPrice)}${
                          variant.variant_values ? ` - ${variant.variant_values}` : ""
                        }`}
                        className="w-full"
                      />
                    );
                  })}
                </RadioGroup>
              </CardBody>
            </Card>
          )}

          {addOns?.length > 0 && (
            <Card className="rounded-lg shadow-lg border border-gray-200 dark:border-gray-500">
              <CardHeader className="font-semibold text-lg">
                {t("extra_add_ons")}
              </CardHeader>

              <CardBody>
                <div className="flex flex-wrap gap-3">
                  {selectedAddOns.map((addon) => (
                    <Chip
                      key={addon.id}
                      variant="flat"
                      color={addon.quantity > 0 ? "primary" : "default"}
                      onClick={() => handleAddonToggle(addon.id)}
                      className="cursor-pointer rounded px-4 py-2 transition-all"
                      startContent={
                        addon.quantity > 0 ? (
                          <span className="text-primary-500 text-lg">
                            <RiSubtractLine />
                          </span>
                        ) : (
                          <span className="text-gray-500 text-lg">
                            <RiAddLine />
                          </span>
                        )
                      }
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{addon.title}</span>
                        <span className="text-sm">{formatPrice(addon.price)}</span>
                      </div>
                    </Chip>
                  ))}
                </div>
              </CardBody>

              {selectedAddOns.some((addon) => addon.quantity > 0) && (
                <CardFooter className="border-t border-gray-200 dark:border-gray-500 py-2">
                  <div className="text-sm text-primary-600 font-medium">
                    {t("selected_add_ons_total")}:
                    {formatPrice(
                      selectedAddOns.reduce(
                        (sum, addon) => sum + addon.price * addon.quantity,
                        0
                      )
                    )}
                  </div>
                </CardFooter>
              )}
            </Card>
          )}

          <Card className="rounded-lg shadow-lg border border-gray-200 dark:border-gray-500">
            <CardBody className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span>
                  {t("base_price")} ({quantity} items)
                </span>
                <span>{formatPrice(getSubtotals().basePriceTotal)}</span>
              </div>

              {getSubtotals().addOnsTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span>{t("add_ons_total")}</span>
                  <span>{formatPrice(getSubtotals().addOnsTotal)}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-base md:text-lg pt-2 border-t dark:border-t-gray-500">
                <span>{t("total")}</span>
                <span className="text-primary">{formatPrice(calculateTotalPrice())}</span>
              </div>
            </CardBody>

            <CardFooter className="flex flex-row justify-between gap-2">
              <div className="flex justify-center items-center gap-1 rounded px-2 border border-gray-200 dark:border-gray-500 w-full max-w-[150px]">
                <Button
                  size="sm"
                  variant="light"
                  onPress={() => handleQuantityChange(-1)}
                  className="w-6 h-6 flex items-center justify-center p-0"
                >
                  <RiSubtractLine className="h-4 w-4" />
                </Button>

                <span className="w-6 text-center font-medium text-sm">{quantity}</span>

                <Button
                  size="sm"
                  variant="light"
                  onPress={() => handleQuantityChange(1)}
                  className="w-6 h-6 flex items-center justify-center p-0"
                >
                  <RiAddLine className="h-4 w-4" />
                </Button>
              </div>

              <Button
                color="primary"
                onPress={addToCart}
                isLoading={submitting}
                className="bg-primary-500 font-bold rounded"
              >
                {t("add_to_cart")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
