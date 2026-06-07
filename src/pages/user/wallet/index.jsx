import BreadCrumb from "@/components/BreadCrumb/BreadCrumb";
import WalletView from "@/views/WalletView";
import React from "react";
import UserLayout from "../UserLayout";
import useRequireLogin from "@/components/IsLogged/IsLogged";
import { HeadTitle } from "@/components/HeadTitle";
import { useTranslation } from "react-i18next";

const Index = () => {
  const isLogged = useRequireLogin();
  const { t } = useTranslation();

  if (!isLogged) return null;

  return (
    <div>
      <HeadTitle title={t("wallet")} />
      <BreadCrumb />
      <UserLayout>
        <WalletView />
      </UserLayout>
    </div>
  );
};

export default Index;
