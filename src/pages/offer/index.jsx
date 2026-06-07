import React from "react";
import { HeadTitle } from "@/components/HeadTitle";
import { useTranslation } from "react-i18next";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb";
import OfferView from "@/views/OfferView";

const Index = () => {
  const { t } = useTranslation();
  return (
    <div>
      <HeadTitle title={t("offer")}/>
      <BreadCrumb />
      <OfferView />
    </div>
  );
};

export default Index;
