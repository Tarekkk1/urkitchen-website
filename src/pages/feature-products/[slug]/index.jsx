import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb";
import { HeadTitle } from "@/components/HeadTitle";
import FeatureProducts from "@/views/FeatureProducts";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();
  


  return (
    <div>

      <HeadTitle title={t("feature_products")}/>
      <BreadCrumb />
      
      <FeatureProducts  />
    </div>
  );
};

export default Index;
