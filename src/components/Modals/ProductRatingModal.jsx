import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Progress,
  User,
  Image,
} from "@heroui/react";
import { RiStarFill } from "@remixicon/react";
import { get_product_rating } from "../../interceptor/routes";
import { useTranslation } from "react-i18next";

const ProductRatingModal = ({ isOpen, onClose, productId, productName }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (isOpen && productId) {
      fetchRatings();
    }
  }, [isOpen, productId]);

  const fetchRatings = async () => {
    setLoading(true);
    try {
      const response = await get_product_rating({ id: productId });
      if (!response.error) {
        setData(response);
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <RiStarFill
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()} // Use onClose when closing
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent className="max-h-[90vh]">
        {(close) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <span className="text-xl font-bold">
                {t("ratings_and_reviews")}
              </span>
              <p className="text-sm font-normal text-gray-500">{productName}</p>
            </ModalHeader>
            <ModalBody className="p-6">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : data ? (
                <div className="flex flex-col gap-8">
                  {/* Summary Section */}
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-gray-50 dark:bg-zinc-800 p-6 rounded-xl">
                    <div className="flex flex-col items-center justify-center min-w-[120px]">
                      <span className="text-5xl font-bold text-primary-600">
                        {data.product_rating}
                      </span>
                      <div className="flex my-2">
                        {renderStars(Math.round(parseFloat(data.product_rating)))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {data.no_of_rating} {t("ratings")}
                      </span>
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = parseInt(data[`star_${star}`] || 0);
                        const total = parseInt(data.total || 1);
                        const percentage = total > 0 ? (count / total) * 100 : 0;
                        
                        return (
                          <div key={star} className="flex items-center gap-3">
                            <span className="text-sm font-medium w-3">{star}</span>
                            <RiStarFill className="w-4 h-4 text-gray-400" />
                            <Progress
                              value={percentage}
                              color="primary" // Changed from warning to primary for better visibility in some themes, or keep warning if gold is desired
                              className="max-w-md h-2"
                              aria-label={`${star} stars`}
                            />
                            <span className="text-xs text-gray-500 w-8 text-right">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      {t("user_reviews")} ({data.data?.length || 0})
                    </h3>
                    
                    {data.data && data.data.length > 0 ? (
                      data.data.map((review) => (
                        <div key={review.id} className="border-b last:border-0 pb-6">
                            <div className="flex justify-between items-start mb-2">
                                <User   
                                    name={review.user_name}
                                    avatarProps={{
                                        src: review.user_profile,
                                        size: "md"
                                    }}
                                />
                                <div className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded-md flex items-center gap-1">
                                    <span className="text-green-700 dark:text-green-300 font-bold text-sm">{review.rating}</span>
                                    <RiStarFill className="w-3 h-3 text-green-700 dark:text-green-300" />
                                </div>
                            </div>
                            
                            {review.comment && (
                                <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm leading-relaxed">
                                    {review.comment}
                                </p>
                            )}
                            
                            {review.images && review.images.length > 0 && (
                                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                                    {review.images.map((img, idx) => (
                                        <Image 
                                            key={idx}
                                            src={img}
                                            alt={`review-image-${idx}`}
                                            className="w-20 h-20 object-cover rounded-lg border"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        {t("no_reviews_yet")}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                 <div className="text-center py-10 text-gray-500">
                    {t("no_ratings_available")}
                 </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                {t("close")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ProductRatingModal;
