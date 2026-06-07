import React, { useEffect, useState } from "react";
import { getOfferImages } from "../interceptor/routes";
import { Card, Image } from "@heroui/react";
import { useTranslation } from "react-i18next";
import NotFound from "@/components/NotFound/NotFound";
import Link from "next/link";

const OfferView = () => {
  const { t } = useTranslation();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOffers = async () => {
    try {
      const offers = await getOfferImages();
      if (!offers.error) {
        setOffers(offers.data);
      }
    } catch (error) {
      console.error("Error occurred while fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <div className="offers-grid">
      {loading ? (
        Array(6)
          .fill(0)
          .map((_, index) => (
            <Card key={index} className="offers-card">
              <div className="offers-skeleton"></div>
            </Card>
          ))
      ) : offers.length === 0 ? (
        <NotFound />
      ) : (
        offers.map((item, index) => {
          let link = "#";
          if (item?.type === "categories" && item?.data?.length > 0) {
            link = `/categories/${item?.data[0]?.slug}`;
          }
          return (
            <Link href={link} key={index}>
              <Card className="offers-card">
                <Image
                  src={item.image}
                  alt={item.title || "Offer"}
                  className="offers-image"
                />
              </Card>
            </Link>
          );
        })
      )}
    </div>
  );
};

export default OfferView;