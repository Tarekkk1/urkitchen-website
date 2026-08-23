import React, { useEffect, useState } from "react";

const APP_STORE_URL = "https://apps.apple.com/app/id6738699122";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.eatsegypt.urkitchen&hl=en";

const DISMISS_KEY = "appBannerDismissed";

const getSmartLink = () => {
  if (typeof navigator === "undefined") return PLAY_STORE_URL;
  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/i.test(ua)) return APP_STORE_URL;
  if (/Android/i.test(ua)) return PLAY_STORE_URL;
  return PLAY_STORE_URL;
};

const AppDownloadBanner = () => {
  const [visible, setVisible] = useState(false);
  const [link, setLink] = useState(PLAY_STORE_URL);

  useEffect(() => {
    setLink(getSmartLink());
    if (typeof window !== "undefined" && !window.localStorage.getItem(DISMISS_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(DISMISS_KEY, "1");
    }
  };

  if (!visible) return null;

  return (
    <div className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-3 text-center relative">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm sm:text-base font-medium hover:underline"
        >
          📲 Download the app and get <span className="text-accent font-bold">10% off</span> your first order
        </a>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute right-2 sm:right-4 text-white/80 hover:text-white text-lg leading-none px-1"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default AppDownloadBanner;
