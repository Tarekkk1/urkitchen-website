import React from "react";
import UserLayout from "../UserLayout";

import useRequireLogin from "@/components/IsLogged/IsLogged";
import { HeadTitle } from "@/components/HeadTitle";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb";
import ProfileView from "@/views/ProfileView";
import { useTranslation } from "react-i18next";

const Index = () => {
  const isLogged = useRequireLogin();
  const { t } = useTranslation();

  if (!isLogged) return null;

  return (
    <div>
      <HeadTitle title={t("profile")} />
      <BreadCrumb />
      <UserLayout>
        <ProfileView />
      </UserLayout>
    </div>
  );
};

export default Index;
