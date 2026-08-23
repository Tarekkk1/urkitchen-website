import React from "react";
import Image from "next/image";
import { HeadTitle } from "@/components/HeadTitle";
import { fbq } from "@/helpers/pixel";

const APP_STORE_URL = "https://apps.apple.com/app/id6738699122";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.eatsegypt.urkitchen&hl=en";

const trackTryInstall = (platform) => {
  fbq("track", "Lead", { content_name: "app_install", content_category: platform });
};

const Index = () => {
  return (
    <div className="min-h-[75vh] bg-primary-50 flex flex-col items-center justify-center px-6 py-16">
      <HeadTitle
        title="Get the UrKitchen App"
        description="Order authentic homemade food from local chefs — right from your phone. Download the UrKitchen app for iOS and Android."
      />

      <Image
        src="/logo.png"
        alt="UrKitchen"
        width={200}
        height={80}
        className="mb-8 object-contain"
        priority
      />

      <h1 className="text-3xl font-bold text-primary text-center mb-3">
        Get the UrKitchen App
      </h1>
      <p className="text-gray-600 text-center max-w-sm mb-10">
        Order authentic homemade food from local chefs — right from your phone.
      </p>

      <div className="mb-10 relative">
        <div className="absolute w-72 h-72 rounded-full bg-accent/20 blur-3xl -top-8 -left-8 pointer-events-none" />
        <div className="absolute w-56 h-56 rounded-full bg-primary-300/20 blur-3xl -bottom-4 right-0 pointer-events-none" />
        <Image
          src="/app-screenshot.png"
          alt="UrKitchen app screenshot"
          width={280}
          height={560}
          className="relative z-10 drop-shadow-2xl"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackTryInstall("ios")}
          className="inline-block transform transition-all hover:scale-105"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/en-us?releaseDate=1722902400"
            alt="Download on the App Store"
            className="h-16 w-auto object-contain"
          />
        </a>

        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackTryInstall("android")}
          className="inline-block transform transition-all hover:scale-105"
        >
          <Image
            src="/GetItOnGooglePlay_Badge_Web_color_English.png"
            alt="Get it on Google Play"
            width={200}
            height={64}
            className="h-16 w-auto object-contain"
          />
        </a>
      </div>
    </div>
  );
};

export default Index;
