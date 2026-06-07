import React from "react";
import UserLayout from "../UserLayout";
import useRequireLogin from "@/components/IsLogged/IsLogged";
import { HeadTitle } from "@/components/HeadTitle";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb";
import Refer from "@/views/Refer";
import { useTranslation } from "react-i18next";

const Index = () => {
  const isLogged = useRequireLogin();
  const { t } = useTranslation();

  if (!isLogged) return null;

  return (
    <div>
      <HeadTitle title={t("refer")} />
      <BreadCrumb />
      <UserLayout>
        <Refer />
      </UserLayout>
    </div>
  );
};

export default Index;
