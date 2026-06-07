import React, { useEffect, useState } from "react";
import { Accordion, AccordionItem, Spinner } from "@heroui/react";
import { RiQuestionLine } from "@remixicon/react";
import { get_faqs } from "@/interceptor/routes";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb";
import { HeadTitle } from "@/components/HeadTitle";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const FaqPage = () => {
  const { t } = useTranslation();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 20;

  const fetchFaqs = async (reset = false) => {
    try {
      setLoading(true);
      const currentOffset = reset ? 0 : offset;
      const res = await get_faqs({ limit: LIMIT, offset: currentOffset });
      if (!res.error) {
        const newFaqs = res.data || [];
        setFaqs((prev) => (reset ? newFaqs : [...prev, ...newFaqs]));
        setOffset(currentOffset + LIMIT);
        setHasMore(newFaqs.length === LIMIT);
      } else {
        toast.error(res.message || "Failed to load FAQs");
      }
    } catch {
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs(true);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <HeadTitle title={t("faqs") || "FAQs"} />
      <BreadCrumb />

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <RiQuestionLine size={24} className="text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t("faqs") || "FAQs"}</h1>
          <p className="text-sm text-gray-500">{t("faq_subtitle") || "Frequently asked questions"}</p>
        </div>
      </div>

      {loading && faqs.length === 0 ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" color="primary" />
        </div>
      ) : faqs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <RiQuestionLine size={48} className="mb-3 opacity-40" />
          <p className="text-lg font-medium">{t("no_faqs") || "No FAQs available"}</p>
        </div>
      ) : (
        <Accordion variant="splitted" className="px-0 gap-3">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              aria-label={faq.question}
              title={
                <span className="font-semibold text-base">{faq.question}</span>
              }
              className="rounded-xl border dark:border-gray-700 shadow-sm"
            >
              <p className="text-gray-600 dark:text-gray-300 pb-2 leading-relaxed">
                {faq.answer}
              </p>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {hasMore && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => fetchFaqs()}
            className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition font-semibold"
          >
            {t("load_more") || "Load More"}
          </button>
        </div>
      )}

      {loading && faqs.length > 0 && (
        <div className="flex justify-center mt-6">
          <Spinner color="primary" size="sm" />
        </div>
      )}
    </div>
  );
};

export default FaqPage;
