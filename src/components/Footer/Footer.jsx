import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { siteConfig } from "@/config/site";
import {
  RiFacebookBoxFill,
  RiInstagramFill,
  RiMailLine,
  RiPhoneLine,
} from "@remixicon/react";

const Footer = () => {
  const { t } = useTranslation();
  const settings = useSelector(
    (state) => state?.settings?.value?.web_settings?.[0]
  );

  const phoneNumber = settings?.support_number || siteConfig.contact.phone;

  const socialLinks = [
    settings?.facebook_link && {
      href: settings.facebook_link,
      icon: <RiFacebookBoxFill size={20} />,
      label: "Facebook",
    },
    settings?.instagram_link && {
      href: settings.instagram_link,
      icon: <RiInstagramFill size={20} />,
      label: "Instagram",
    },
  ].filter(Boolean);

  return (
    <footer className="relative mt-16 bg-background-footer text-white">
      {/* Curved top edge */}
      <svg
        className="absolute top-0 w-full h-6 -mt-5 sm:-mt-10 sm:h-16 text-background-footer"
        preserveAspectRatio="none"
        viewBox="0 0 1440 54"
      >
        <path
          fill="currentColor"
          d="M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 1.00001 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z"
        />
      </svg>

      <div className="px-6 pt-16 pb-8 mx-auto max-w-[1400px] lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/images/urkitchen-logo.png"
              alt="urkitchen"
              className="h-14 w-auto object-contain mb-4 bg-white rounded-xl px-3 py-1"
            />
            <p className="text-sm text-white/70 leading-relaxed max-w-xs">
              {settings?.app_short_description || "Home in every bite! Order your favourite food online."}
            </p>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 mt-5">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                    aria-label={s.label}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <p className="font-bold text-base mb-4 tracking-wide">
              {t("quick_links")}
            </p>
            <ul className="space-y-2 text-sm text-white/80">
              {[
                { href: "/home", label: t("home") },
                { href: "/categories", label: t("categories") },
                { href: "/offer", label: t("offer") },
                { href: "/faq", label: t("faqs") || "FAQs" },
                { href: "/about-us", label: t("about") },
                { href: "/contact-us", label: t("contact") },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-bold text-base mb-4 tracking-wide">
              {t("contact")}
            </p>
            <ul className="space-y-3 text-sm text-white/80">
              {settings?.support_email && (
                <li className="flex items-center gap-2">
                  <RiMailLine size={16} className="flex-shrink-0 text-accent" />
                  <a href={`mailto:${settings.support_email}`} className="hover:text-white transition">
                    {settings.support_email}
                  </a>
                </li>
              )}
              {phoneNumber && (
                <li className="flex items-center gap-2">
                  <RiPhoneLine size={16} className="flex-shrink-0 text-accent" />
                  <a href={`tel:${phoneNumber}`} className="hover:text-white transition">
                    {phoneNumber}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Download App */}
          <div>
            <p className="font-bold text-base mb-4 tracking-wide">
              {t("download_app") || "Download App"}
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={siteConfig.links.playStore}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:opacity-80 hover:scale-105 duration-200"
              >
                <Image
                  src="/google-play-store.webp"
                  alt="Get it on Google Play"
                  width={160}
                  height={48}
                  className="rounded-lg object-contain"
                />
              </a>
              <a
                href={siteConfig.links.appStore}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:opacity-80 hover:scale-105 duration-200"
              >
                <Image
                  src="/app-store.webp"
                  alt="Download on the App Store"
                  width={160}
                  height={48}
                  className="rounded-lg object-contain"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <span>
            {settings?.copyright_details || `© ${new Date().getFullYear()} urkitchen. All rights reserved.`}
          </span>
          <div className="flex items-center gap-4">
            <Link href="/terms-conditions" className="hover:text-white transition">
              {t("terms_conditions")}
            </Link>
            <Link href="/privacy-policy" className="hover:text-white transition">
              {t("privacy_policy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
