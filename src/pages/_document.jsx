import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
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

        {/* Manifest */}
        <meta name="application-name" content="urkitchen" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="urkitchen" />
        <meta
          name="description"
          content="Home in every bite! Order your favourite food online from urkitchen."
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0C382C" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/manifest/logo_192.png" />
        <link rel="shortcut icon" href="/manifest/logo_192.png" />

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
