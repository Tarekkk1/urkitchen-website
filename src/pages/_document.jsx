import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

const SITE_URL = "https://www.urkitchenegypt.com";
const OG_IMAGE = `${SITE_URL}/assets/images/urkitchen-logo.png`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      "name": "urkitchen",
      "alternateName": ["ur kitchen", "your kitchen", "urkitchen egypt", "أكل بيتي", "مطبخ بيتي", "كل بيتي"],
      "url": SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": OG_IMAGE
      },
      "description": "Egypt's #1 homemade food delivery platform. Order authentic home-cooked meals from local home chefs. أكل بيتي أصيل بالتوصيل في مصر.",
      "areaServed": { "@type": "Country", "name": "Egypt" },
      "sameAs": [
        "https://apps.apple.com/app/id6738699122",
        "https://play.google.com/store/apps/details?id=com.eatsegypt.urkitchen"
      ]
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": SITE_URL,
      "name": "urkitchen — أكل بيتي",
      "description": "Order homemade food from local home chefs in Egypt. توصيل أكل بيتي في مصر.",
      "publisher": { "@id": `${SITE_URL}/#organization` },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${SITE_URL}/products/?search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "FoodEstablishment",
      "@id": `${SITE_URL}/#food`,
      "name": "urkitchen — أكل بيتي | Your Kitchen",
      "description": "Authentic homemade food delivery from local home chefs across Egypt. أكل بيتي أصيل من شيفات منزليين بالتوصيل في القاهرة والإسكندرية وكل مصر.",
      "url": SITE_URL,
      "logo": OG_IMAGE,
      "image": OG_IMAGE,
      "servesCuisine": ["Egyptian", "Homemade", "Arabic", "Mediterranean", "أكل بيتي", "طبخ منزلي"],
      "priceRange": "$$",
      "openingHours": "Mo-Su 00:00-24:00",
      "hasDeliveryMethod": "http://schema.org/DeliveryModeOwnFleet",
      "areaServed": [
        { "@type": "City", "name": "Cairo", "addressCountry": "EG" },
        { "@type": "City", "name": "Alexandria", "addressCountry": "EG" },
        { "@type": "Country", "name": "Egypt" }
      ],
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "EG",
        "addressLocality": "Cairo"
      }
    },
    {
      "@type": "MobileApplication",
      "@id": `${SITE_URL}/#app`,
      "name": "urkitchen — أكل بيتي",
      "description": "Order authentic homemade food from local home chefs in Egypt. Download the urkitchen app.",
      "operatingSystem": "iOS, Android",
      "applicationCategory": "FoodDelivery",
      "downloadUrl": [
        "https://apps.apple.com/app/id6738699122",
        "https://play.google.com/store/apps/details?id=com.eatsegypt.urkitchen"
      ],
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EGP"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "500"
      }
    }
  ]
};

export default function Document() {
  return (
    <Html lang="ar" dir="ltr">
      <Head>
        {/* ── Google Search Console verification ── */}
        <meta name="google-site-verification" content="xwyWgNWI8bMmLBDnxWowd6JwidfsYar5bJOrGvgNa30" />

        {/* ── Core SEO ── */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="description" content="urkitchen (your kitchen) — اطلب أكل بيتي أصيل من شيفات منزليين في مصر. Order authentic homemade food from local home chefs. Fast delivery in Cairo, Alexandria & all Egypt. أكل بيتي, كل بيتي, طبخ منزلي بالتوصيل." />
        <meta name="keywords" content="ur kitchen, urkitchen, your kitchen, your kitchen egypt, urkitchen egypt, homemade food egypt, homemade food delivery, home cooked food cairo, home chef egypt, أكل بيتي, اكل بيتي, كل بيتي, أكل منزلي, طبخ بيتي, طبخ منزلي, مطبخ بيتي, توصيل أكل بيتي, توصيل طعام منزلي, طعام منزلي مصر, شيف منزلي, أكل بيتي بالتوصيل, food delivery egypt, homemade food cairo, authentic egyptian food, traditional homemade food, local home chefs, order food online egypt" />

        {/* ── Geo targeting ── */}
        <meta name="geo.region" content="EG" />
        <meta name="geo.placename" content="Cairo, Egypt" />
        <meta name="geo.position" content="30.0444;31.2357" />
        <meta name="ICBM" content="30.0444, 31.2357" />
        <meta httpEquiv="content-language" content="ar, en" />

        {/* ── Open Graph ── */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="urkitchen — أكل بيتي" />
        <meta property="og:title" content="urkitchen | أكل بيتي — Homemade Food Delivery Egypt" />
        <meta property="og:description" content="Order authentic homemade food from local home chefs in Egypt. أكل بيتي أصيل من شيفات منزليين بالتوصيل في القاهرة والإسكندرية وكل مصر." />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="urkitchen — أكل بيتي | Homemade Food Delivery Egypt" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:locale" content="ar_EG" />
        <meta property="og:locale:alternate" content="en_US" />

        {/* ── Twitter / X ── */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="urkitchen | أكل بيتي — Homemade Food Delivery Egypt" />
        <meta name="twitter:description" content="Order authentic homemade food from local home chefs in Egypt. أكل بيتي أصيل بالتوصيل." />
        <meta name="twitter:image" content={OG_IMAGE} />

        {/* ── App store smart banners ── */}
        <meta name="apple-itunes-app" content="app-id=6738699122" />
        <meta name="google-play-app" content="app-id=com.eatsegypt.urkitchen" />

        {/* ── JSON-LD Structured Data ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* ── Fonts & PWA ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        <meta name="application-name" content="urkitchen" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="urkitchen — أكل بيتي" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0C382C" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/manifest/logo_192.png" />
        <link rel="shortcut icon" href="/manifest/logo_192.png" />

        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAP_API_KEY}&libraries=places,marker&loading=async`}
          strategy="beforeInteractive"
        />
        <Script id="google-maps-bootstrap" strategy="beforeInteractive">
          {`
            (g => {
              var h, a, k, p = "The Google Maps JavaScript API", c = "google",
                  l = "importLibrary", q = "__ib__", m = document, b = window;
              b = b[c] || (b[c] = {});
              var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams,
                  u = () => h || (h = new Promise(async (f, n) => {
                    await (a = m.createElement("script"));
                    e.set("libraries", [...r] + "");
                    for (k in g) e.set(
                      k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()),
                      g[k]
                    );
                    e.set("callback", c + ".maps." + q);
                    a.src = \`https://maps.\${c}apis.com/maps/api/js?\` + e;
                    d[q] = f;
                    a.onerror = () => h = n(Error(p + " could not load."));
                    a.nonce = m.querySelector("script[nonce]")?.nonce || "";
                    m.head.append(a);
                  }));
              d[l] ? console.warn(p + " only loads once. Ignoring:", g)
                   : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n));
            })({
              key: "${process.env.NEXT_PUBLIC_MAP_API_KEY}",
              v: "weekly"
            });
          `}
        </Script>

        {/* Meta Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
