import React from "react";
import UserLayout from "../UserLayout";
import useRequireLogin from "@/components/IsLogged/IsLogged";
import { HeadTitle } from "@/components/HeadTitle";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb";
import MyOrders from "@/views/MyOrders";
import { useTranslation } from "react-i18next";

const Index = () => {
  const isLogged = useRequireLogin();
  const { t } = useTranslation();

  if (!isLogged) return null;

  return (
    <div>
      <HeadTitle title={t("my_orders")} />
      <BreadCrumb />
      <UserLayout>
        <MyOrders />
      </UserLayout>
    </div>
  );
};

export default Index;
