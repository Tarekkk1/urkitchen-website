"use client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb";
import ProductsSkeleton from "@/components/Skeleton/ProductsSkeleton";
import ProductDetail from "@/views/ProductDetail";

const ProductDetailPage = () => {
  const [productId, setProductId] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (router.query.slug) {
      setProductId(router.query.slug);
      setLoading(false);
    }
  }, [router.query.slug]);

  if (loading) {
    return <ProductsSkeleton className="p-6" count={1} />;
  }

  return productId == null ? (
    <></>
  ) : (
    <>
      <BreadCrumb />
      <ProductDetail productId={productId} />
    </>
  );
};

export default ProductDetailPage;
