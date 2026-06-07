"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Badge,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
} from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import LocationModal from "../Modals/LocationModal";
import LoginModal from "../Modals/LoginModal";
import Logout from "../Modals/Logout";
import SearchHeader from "../Modals/SearchProductsModal";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import { useTranslation } from "react-i18next";

import {
  RiArrowRightLine,
  RiArrowDownSLine,
  RiContactsLine,
  RiFileList3Line,
  RiHeart2Line,
  RiHome2Line,
  RiLogoutBoxLine,
  RiMapPinLine,
  RiMenuLine,
  RiNotification3Line,
  RiPercentLine,
  RiShoppingBagLine,
  RiShoppingCartLine,
  RiUserLine,
  RiWalletLine,
  RiCloseLine,
} from "@remixicon/react";

const Header = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  const settings = useSelector((state) => state.settings.value);
  const logoSrc = settings?.web_settings?.[0]?.logo || "/assets/images/urkitchen-logo.png";
  const cartStoreData = useSelector((state) => state.cart);
  const selectedCity = useSelector((state) => state.selectedCity);
  const homeStoreData = useSelector((state) => state.homepage);
  const categories = homeStoreData.categories;
  const authStoreData = useSelector((state) => state.authentication);
  const imageFromRedux = useSelector((state) => state.authentication.userData.image);

  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const catTimeoutRef = useRef(null);

  const { isOpen: isLogoutOpen, onOpen: onLogoutOpen, onOpenChange: onLogoutOpenChange } = useDisclosure();

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router.pathname]);

  const isActive = (route) => router.pathname === route;

  const navLinks = [
    { label: t("home"), route: "/home", icon: <RiHome2Line size={18} /> },
    { label: t("offer"), route: "/offer", icon: <RiPercentLine size={18} /> },
    { label: t("products"), route: "/products", icon: <RiShoppingBagLine size={18} /> },
    { label: t("contact"), route: "/contact-us", icon: <RiContactsLine size={18} /> },
  ];

  const handleCatEnter = () => {
    clearTimeout(catTimeoutRef.current);
    setIsCatOpen(true);
  };
  const handleCatLeave = () => {
    catTimeoutRef.current = setTimeout(() => setIsCatOpen(false), 250);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
          scrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        {/* ── Top bar ── */}
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <div className="flex items-center h-20 gap-3">

            {/* Hamburger (mobile) */}
            <button
              className="sm:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <RiMenuLine size={22} />
            </button>

            {/* Logo */}
            <Link href="/home" className="flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoSrc}
                alt="urkitchen"
                className="h-16 w-auto object-contain"
                onError={(e) => { e.target.src = "/assets/images/urkitchen-logo.png"; }}
              />
            </Link>

            {/* Location pill */}
            <button
              onClick={() => setIsLocationOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full
                         border border-primary/30 bg-primary/5
                         text-sm font-medium text-primary hover:bg-primary/10
                         transition-all duration-200 max-w-[200px] truncate"
            >
              <RiMapPinLine size={15} className="flex-shrink-0" />
              <span className="truncate">
                {selectedCity?.value?.city || t("select_location")}
              </span>
              <RiArrowDownSLine size={15} className="flex-shrink-0 opacity-60" />
            </button>

            {/* Search — grows to fill space */}
            <div className="flex-1 hidden sm:block max-w-md">
              <SearchHeader />
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1 ml-auto sm:ml-0">

              {/* Language */}
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              {/* Notifications (logged in) */}
              {authStoreData.isLogged && (
                <button
                  onClick={() => router.push("/notifications")}
                  className="hidden sm:flex p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-primary transition"
                  aria-label="Notifications"
                >
                  <RiNotification3Line size={21} />
                </button>
              )}

              {/* Cart */}
              {authStoreData.isLogged && (
                <button
                  onClick={() => router.push("/user/cart")}
                  className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-primary transition"
                  aria-label="Cart"
                >
                  <RiShoppingCartLine size={21} />
                  {cartStoreData.data.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                      {cartStoreData.data.length}
                    </span>
                  )}
                </button>
              )}

              {/* Location (mobile) */}
              <button
                onClick={() => setIsLocationOpen(true)}
                className="sm:hidden p-2 rounded-full text-primary hover:bg-primary/10 transition"
                aria-label="Location"
              >
                <RiMapPinLine size={20} />
              </button>

              {/* Login / Avatar */}
              {!authStoreData.isLogged ? (
                <Button
                  onPress={() => setIsLoginOpen(true)}
                  className="bg-primary text-white font-bold rounded-full px-5 h-9 text-sm"
                >
                  {t("login")}
                </Button>
              ) : (
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Avatar
                      src={imageFromRedux}
                      size="sm"
                      radius="full"
                      className="cursor-pointer ring-2 ring-primary/30 hover:ring-primary transition"
                    />
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Profile" variant="flat" className="w-52">
                    <DropdownItem key="info" className="h-12 gap-2 opacity-100" isReadOnly>
                      <p className="text-xs text-gray-400">{t("signed_in_as")}</p>
                      <p className="font-semibold text-sm truncate">
                        {authStoreData?.userData?.email || authStoreData?.userData?.username}
                      </p>
                    </DropdownItem>
                    <DropdownItem key="profile" startContent={<RiUserLine size={16} />} onPress={() => router.push("/user/profile")}>
                      {t("my_profile")}
                    </DropdownItem>
                    <DropdownItem key="orders" startContent={<RiFileList3Line size={16} />} onPress={() => router.push("/user/my-orders")}>
                      {t("my_orders")}
                    </DropdownItem>
                    <DropdownItem key="favorites" startContent={<RiHeart2Line size={16} />} onPress={() => router.push("/user/favorites")}>
                      {t("favorites")}
                    </DropdownItem>
                    <DropdownItem key="wallet" startContent={<RiWalletLine size={16} />} onPress={() => router.push("/user/wallet")}>
                      {t("wallet")}
                    </DropdownItem>
                    <DropdownItem key="logout" color="danger" className="text-danger" startContent={<RiLogoutBoxLine size={16} />} onPress={onLogoutOpen}>
                      {t("log_out")}
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )}
            </div>
          </div>
        </div>

        {/* ── Bottom nav bar (desktop) ── */}
        <div className="hidden sm:block border-t border-gray-100 bg-white">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
            <div className="flex items-center h-11 gap-1">
              {navLinks.map((item) => (
                <button
                  key={item.route}
                  onClick={() => router.push(item.route)}
                  className={`flex items-center gap-1.5 px-4 h-full text-sm font-semibold
                    border-b-2 transition-all duration-150
                    ${isActive(item.route)
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-600 hover:text-primary hover:border-primary/40"
                    }`}
                >
                  {item.label}
                </button>
              ))}

              {/* Categories mega dropdown */}
              <div
                className="relative h-full"
                onMouseEnter={handleCatEnter}
                onMouseLeave={handleCatLeave}
              >
                <button
                  className={`flex items-center gap-1.5 px-4 h-full text-sm font-semibold
                    border-b-2 transition-all duration-150
                    ${isCatOpen ? "border-primary text-primary" : "border-transparent text-gray-600 hover:text-primary"}`}
                >
                  {t("categories")}
                  <RiArrowDownSLine
                    size={16}
                    className={`transition-transform duration-200 ${isCatOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isCatOpen && (
                  <div
                    className="absolute top-full left-0 w-[560px] bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-5"
                    onMouseEnter={handleCatEnter}
                    onMouseLeave={handleCatLeave}
                  >
                    <div className="grid grid-cols-4 gap-3">
                      {categories.slice(0, 12).map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => { router.push(`/categories/${cat.slug}`); setIsCatOpen(false); }}
                          className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-primary/5 group transition"
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-contain p-1" />
                          </div>
                          <span className="text-xs font-medium text-gray-700 group-hover:text-primary text-center line-clamp-1">
                            {cat.name}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => { router.push("/categories"); setIsCatOpen(false); }}
                        className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                      >
                        <RiArrowRightLine size={16} />
                        {t("see_all")} {t("categories")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile slide-in drawer ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex sm:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="relative w-72 max-w-[85vw] bg-white h-full flex flex-col shadow-2xl">
            {/* Drawer header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoSrc} alt="urkitchen" className="h-8 w-auto object-contain" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            {/* Location (mobile drawer) */}
            <button
              onClick={() => { setIsLocationOpen(true); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-2 mx-4 mt-4 px-4 py-3 rounded-xl border border-primary/30 bg-primary/5 text-primary text-sm font-medium"
            >
              <RiMapPinLine size={16} />
              <span className="truncate">{selectedCity?.value?.city || t("select_location")}</span>
            </button>

            {/* Search */}
            <div className="mx-4 mt-3">
              <SearchHeader />
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto mt-4 px-3 space-y-1">
              {navLinks.map((item) => (
                <button
                  key={item.route}
                  onClick={() => { router.push(item.route); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition
                    ${isActive(item.route)
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => { router.push("/categories"); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                <RiShoppingBagLine size={18} />
                {t("categories")}
              </button>
              {authStoreData.isLogged && (
                <button
                  onClick={() => { router.push("/notifications"); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  <RiNotification3Line size={18} />
                  {t("notifications") || "Notifications"}
                </button>
              )}
            </nav>

            {/* Bottom: Language + Login/Logout */}
            <div className="p-4 border-t border-gray-100 space-y-3">
              <LanguageSwitcher />
              {!authStoreData.isLogged ? (
                <Button
                  className="w-full bg-primary text-white font-bold rounded-xl"
                  onPress={() => { setIsLoginOpen(true); setIsMobileMenuOpen(false); }}
                >
                  {t("login")}
                </Button>
              ) : (
                <button
                  onClick={() => { onLogoutOpen(); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-danger hover:bg-danger/10 transition"
                >
                  <RiLogoutBoxLine size={16} />
                  {t("log_out")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <LocationModal isOpen={isLocationOpen} onClose={() => setIsLocationOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <Logout isOpen={isLogoutOpen} onOpenChange={onLogoutOpenChange} />
    </>
  );
};

export default Header;
