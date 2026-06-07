import Head from "next/head";

const SITE_URL = process.env.NEXT_PUBLIC_THEME_URL || "https://www.urkitchenegypt.com";

// Restaurant / LocalBusiness schema — used on homepage
export const RestaurantJsonLd = ({ settings }) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE_URL}/#restaurant`,
    name: settings?.site_title || "urkitchen",
    description: settings?.app_short_description || "Home in every bite! Order food online.",
    url: SITE_URL,
    logo: settings?.logo || `${SITE_URL}/manifest/logo_192.png`,
    image: settings?.logo || `${SITE_URL}/assets/images/og-image.png`,
    telephone: settings?.support_number || "",
    email: settings?.support_email || "",
    servesCuisine: ["Egyptian", "Fast Food", "Various"],
    priceRange: "$$",
    hasMenu: `${SITE_URL}/categories`,
    acceptsReservations: false,
    address: {
      "@type": "PostalAddress",
      addressCountry: "EG",
    },
    sameAs: [
      settings?.facebook_link,
      settings?.instagram_link,
    ].filter(Boolean),
    potentialAction: {
      "@type": "OrderAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/home`,
        actionPlatform: [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform",
        ],
      },
      deliveryMethod: "http://purl.org/goodrelations/v1#DeliveryModeDirectDownload",
    },
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </Head>
  );
};

// WebSite schema with SearchAction — used on homepage/cover
export const WebSiteJsonLd = ({ siteName = "urkitchen" }) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </Head>
  );
};

// Product schema — used on product detail pages
export const ProductJsonLd = ({ product, currency = "EGP" }) => {
  if (!product) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name || product.product_name,
    image: product.image,
    description: product.short_description || product.description,
    offers: {
      "@type": "Offer",
      priceCurrency: currency,
      price: product.min_max_price?.special_price || product.min_max_price?.min_price || 0,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "urkitchen" },
    },
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </Head>
  );
};

// BreadcrumbList schema — used on interior pages
export const BreadcrumbJsonLd = ({ items }) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/home` },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.name,
        item: item.href ? `${SITE_URL}${item.href}` : undefined,
      })),
    ],
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </Head>
  );
};
