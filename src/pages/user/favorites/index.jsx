import BreadCrumb from "@/components/BreadCrumb/BreadCrumb";
import React from "react";
import UserLayout from "../UserLayout";
import Favorites from "@/views/Favorites";
import useRequireLogin from "@/components/IsLogged/IsLogged";
import { HeadTitle } from "@/components/HeadTitle";
import { useTranslation } from "react-i18next";

const Index = () => {
  const isLogged = useRequireLogin();
  const { t } = useTranslation();

  if (!isLogged) return null;

  return (
    <div>
      <HeadTitle title={t("favorites")} />
      <BreadCrumb />

      <UserLayout>
        <Favorites />
      </UserLayout>
    </div>
  );
};

export default Index;
