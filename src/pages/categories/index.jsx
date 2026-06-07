"use client";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb";
import { HeadTitle } from "@/components/HeadTitle";
import Categories from "@/views/categories";
import dynamic from "next/dynamic";
import React from "react";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();
  return (
    <>
      <HeadTitle title={t("categories")} />
      <BreadCrumb />
      <Categories />
    </>
  );
};

export default Index;
