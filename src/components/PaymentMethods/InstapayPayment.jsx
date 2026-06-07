import React, { useState } from "react";
import { Button, ModalFooter } from "@heroui/react";
import { RiFileCopyLine, RiCheckLine, RiInformationLine } from "@remixicon/react";
import { toast } from "sonner";
import { placeOrder, addTransaction } from "@/interceptor/routes";
import { updateUserCart, updateWalletBalance } from "@/events/actions";
import { getUserData } from "@/events/getters";
import { useSelector, useDispatch } from "react-redux";
import { clearDeliveryAddress } from "@/store/reducers/selectedDeliverySlice";
import { purchase as pixelPurchase } from "@/helpers/pixel";
import { useTranslation } from "react-i18next";

const InstapayPayment = ({
  finalTotal,
  cartStoreData,
  deliveryType,
  selectedDeliveryAddress,
  deliveryChargesResponse,
  branch_id,
  is_self_pick_up,
  onClose,
  paymentMethodDetails,
  type = "placeOrder",
  isWalletUsed = false,
  walletAmountUsed = 0,
  scheduleData = {},
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const phoneNumber = paymentMethodDetails?.phoneNumber || "";

  const handleCopy = () => {
    if (phoneNumber) {
      navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      toast.success("InstaPay number copied!");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleConfirmOrder = async () => {
    setLoading(true);
    try {
      if (type === "placeOrder") {
        const orderData = {
          branch_id,
          mobile: getUserData().mobile,
          product_variant_id: cartStoreData.variant_id.join(", "),
          quantity: cartStoreData.data.map((item) => item.qty).join(", "),
          total: cartStoreData.overall_amount,
          final_total: finalTotal,
          latitude: selectedDeliveryAddress?.city_latitude,
          longitude: selectedDeliveryAddress?.city_longitude,
          payment_method: "instapay",
          address_id: deliveryType === "Pick Up" ? 0 : selectedDeliveryAddress?.id,
          is_self_pick_up,
          is_wallet_used: isWalletUsed ? 1 : 0,
          wallet_balance_used: walletAmountUsed,
          scheduled_time: scheduleData?.scheduled_time || "",
          scheduled_to_time: scheduleData?.scheduled_to_time || "",
          is_same_day: scheduleData?.is_same_day || 0,
        };

        const response = await placeOrder(orderData);
        if (response.error) throw new Error(response.message);

        pixelPurchase({ value: finalTotal, order_id: response?.data?.order_id });
        if (isWalletUsed) updateWalletBalance();
        dispatch(clearDeliveryAddress());
        updateUserCart();
        toast.success(response.message || "Order placed successfully!");
        onClose();
      } else {
        // Wallet recharge via InstaPay — admin credits manually
        toast.success("Recharge request submitted. Wallet will be credited after InstaPay transfer is confirmed.");
        onClose();
      }
    } catch (error) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* InstaPay info box — shown inline in PaymentModal body */}
      {phoneNumber && (
        <div className="mx-6 mb-2 p-4 rounded-xl border border-primary/30 bg-primary/5 flex items-center gap-3">
          <RiInformationLine size={20} className="text-primary flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary">InstaPay Transfer</p>
            <p className="text-xs text-gray-600 mt-0.5">
              Transfer the amount to:{" "}
              <span className="font-bold text-gray-800">{phoneNumber}</span>
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 p-2 rounded-lg hover:bg-primary/10 text-primary transition"
            title="Copy number"
          >
            {copied ? <RiCheckLine size={18} /> : <RiFileCopyLine size={18} />}
          </button>
        </div>
      )}

      <ModalFooter>
        <Button variant="light" onPress={onClose} className="rounded-lg">
          {t("cancel")}
        </Button>
        <Button
          id="instapay-button"
          className="bg-primary text-white font-bold rounded-lg"
          isLoading={loading}
          onPress={handleConfirmOrder}
        >
          {loading ? "Placing Order..." : "I've Transferred — Place Order"}
        </Button>
      </ModalFooter>
    </>
  );
};

export default InstapayPayment;
