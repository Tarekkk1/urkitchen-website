import BreadCrumb from "@/components/BreadCrumb/BreadCrumb";
import { HeadTitle } from "@/components/HeadTitle";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Index = () => {
  const settings = useSelector((state) => state?.settings?.value);
  const [setting, setSettings] = useState();
  const { t } = useTranslation();

  useEffect(() => {
    if (settings && settings.web_settings.length != 0)
      setSettings(settings.terms_conditions[0]);
  }, [settings]);

  return (
    <div>
      <HeadTitle title={t("terms_conditions")}/>
      <BreadCrumb />
      <div>
        <div dangerouslySetInnerHTML={{ __html: setting ? setting : "" }} />
      </div>
    </div>
  );
};

export default Index;
