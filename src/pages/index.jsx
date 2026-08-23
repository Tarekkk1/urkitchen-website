"use client";
import React, { useEffect } from "react";
import CoverPage from "../views/CoverPage";
import { HeadTitle } from "@/components/HeadTitle";
import { useSelector } from "react-redux";
import Head from "next/head";
import { get_settings } from "@/interceptor/routes";

export default function Home() {
  const settings = useSelector((state) => state.settings.value);
  const [setting, setSettings] = React.useState(null); // Use `null` for the initial state

  useEffect(() => {
    // get_settings();
    if (settings && settings?.web_settings?.length > 0) {
      setSettings(settings.web_settings[0]);
    }
  }, [settings]);

  return (
    <>
      {setting && (
        <Head>
          <title>{setting.site_title}</title>

          <meta name="keywords" content={setting.meta_keywords} />
          <meta name="description" content={setting.meta_description} />
          <link rel="icon" href={setting.favicon} type="image/*" sizes="any" />
        </Head>
      )}
      <HeadTitle
        title="urkitchen | أكل بيتي — Homemade Food Delivery Egypt"
        description="urkitchen (your kitchen) — اطلب أكل بيتي أصيل من شيفات منزليين في مصر. Order authentic homemade food from local home chefs in Cairo, Alexandria & all Egypt. كل بيتي, أكل منزلي, طبخ بيتي بالتوصيل."
        keywords="ur kitchen, urkitchen, your kitchen, your kitchen egypt, homemade food egypt, home cooked food delivery, home chef egypt, أكل بيتي, اكل بيتي, كل بيتي, أكل منزلي, طبخ بيتي, مطبخ بيتي, توصيل أكل بيتي, توصيل طعام منزلي, طعام منزلي مصر, food delivery egypt, authentic egyptian food, local home chefs cairo"
      />
      <CoverPage />
    </>
  );
}
