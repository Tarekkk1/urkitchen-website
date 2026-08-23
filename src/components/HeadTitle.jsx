import Head from "next/head";
import { useRouter } from "next/router";
import { store } from "../store/store";
import { getHeaderTitle } from "@/helpers/functionHelper";

const SITE_URL = process.env.NEXT_PUBLIC_THEME_URL || "https://www.urkitchenegypt.com";
const OG_IMAGE = `${SITE_URL}/assets/images/urkitchen-logo.png`;

export const HeadTitle = ({ title, description, keywords, ogImage, noIndex = false }) => {
  const router = useRouter();
  const settings = store.getState().settings.value?.web_settings?.[0] || {};

  const metaDescription = description || settings.meta_description || "urkitchen (your kitchen) — اطلب أكل بيتي أصيل من شيفات منزليين في مصر. Order authentic homemade food from local home chefs. Fast delivery in Cairo, Alexandria & all Egypt.";
  const metaKeywords = keywords || settings.meta_keywords || "ur kitchen, urkitchen, your kitchen egypt, homemade food egypt, home cooked food delivery cairo, home chef egypt, أكل بيتي, اكل بيتي, كل بيتي, أكل منزلي, طبخ بيتي, مطبخ بيتي, توصيل أكل بيتي, توصيل طعام منزلي, طعام منزلي مصر, food delivery egypt, authentic egyptian food, local home chefs";
  const pageTitle = getHeaderTitle(title);
  const canonical = `${SITE_URL}${router.asPath.split("?")[0]}`;
  const image = ogImage || OG_IMAGE;

  return (
    <Head>
      <title>{pageTitle}</title>

      {/* Core SEO */}
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonical} />

      {/* Language alternates */}
      <link rel="alternate" hrefLang="en" href={canonical} />
      <link rel="alternate" hrefLang="ar" href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="urkitchen" />
      <meta property="og:locale" content="ar_EG" />
      <meta property="og:locale:alternate" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />

      {/* Geo targeting */}
      <meta name="geo.region" content="EG" />
      <meta name="geo.placename" content="Cairo, Egypt" />
      <meta httpEquiv="content-language" content="ar, en" />
    </Head>
  );
};
