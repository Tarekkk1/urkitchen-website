import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { placeOrder, flutterwave_webview } from "@/interceptor/routes";
import { getUserData } from "@/events/getters";
import { clearDeliveryAddress } from "@/store/reducers/selectedDeliverySlice";
import { deleteOrderHandler, updateUserCart } from "@/events/actions";
import { generateOrderId } from "@/helpers/functionHelper";
import { Button } from "@heroui/button";

const FlutterwavePayment = ({
  finalTotal,
  cartStoreData,
  deliveryType,
  selectedDeliveryAddress,
  deliveryChargesResponse,
  branch_id,
  is_self_pick_up,
  onClose,
  type = "placeOrder",
  amount,
  isWalletUsed,
  walletAmountUsed,
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const openPopup = (url) => {
    return new Promise((resolve, reject) => {
      console.log("[Popup] Attempting to open popup with URL:", url);

      const width = 500;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        url,
        "Flutterwave Payment",
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        console.error(
          "[Popup] Blocked by browser or popup could not be opened."
        );
        reject("Popup blocked. Please allow popups.");
        return;
      }

      console.log("[Popup] Popup opened successfully.");

      const expectedRedirectPrefix = `${process.env.NEXT_PUBLIC_BASE_URL}/flutterwave_payment_response`;
      console.log(
        "[Popup] Expected redirect URL prefix:",
        expectedRedirectPrefix
      );

      const popupChecker = setInterval(() => {
        try {
          if (!popup || popup.closed) {
            console.warn("[Popup] Popup was closed manually or by browser.");
            clearInterval(popupChecker);
            reject("closed");
            return;
          }

          const currentUrl = popup.location.href;
          console.log("[Popup] Current popup URL:", currentUrl);

          // Match your redirect URL
          if (currentUrl.startsWith(expectedRedirectPrefix)) {
            console.log("[Popup] Detected redirect to expected URL.");

            const urlObj = new URL(currentUrl);
            const status = urlObj.searchParams.get("status");
            const tx_ref = urlObj.searchParams.get("tx_ref");
            const transaction_id = urlObj.searchParams.get("transaction_id");

            console.log("[Popup] Parsed response from URL:", {
              status,
              tx_ref,
              transaction_id,
            });

            popup.close();
            clearInterval(popupChecker);

            const paymentData = {
              status,
              tx_ref,
              transaction_id,
            };

            resolve(paymentData);
          }
        } catch (e) {
          if (e.message && e.message.includes("cross-origin")) {
            console.log(
              "[Popup] Cross-origin restriction, waiting for redirect back."
            );
          } else {
            console.error(
              "[Popup] Unexpected error while checking popup URL:",
              e.message
            );
          }
        }
      }, 500);

      // Timeout fallback
      setTimeout(() => {
        if (!popup.closed) {
          console.warn("[Popup] Popup timeout reached. Closing popup.");
          popup.close();
          clearInterval(popupChecker);
          reject("timeout");
        }
      }, 300000); // 5 minutes
    });
  };

  const handlePayment = async () => {
    if (
      type === "placeOrder" &&
      deliveryType === "Delivery" &&
      !selectedDeliveryAddress
    ) {
      toast.error("Please select a delivery address before proceeding!");
      return;
    }

    if (type === "wallet" && (!amount || amount <= 0)) {
      toast.error("Please enter a valid recharge amount!");
      return;
    }

    setLoading(true);

    let order_id;

    try {
      if (type === "wallet") {
        order_id = generateOrderId();
      } else {
        const orderData = {
          branch_id,
          mobile: getUserData().mobile,
          product_variant_id: cartStoreData.variant_id.join(", "),
          quantity: cartStoreData.data.map((doc) => doc.qty).join(", "),
          total: cartStoreData.overall_amount,
          final_total: finalTotal,
          latitude: selectedDeliveryAddress?.city_latitude,
          longitude: selectedDeliveryAddress?.city_longitude,
          payment_method: "flutterwave",
          address_id:
            deliveryType === "Pick Up" ? 0 : selectedDeliveryAddress?.id,
          is_self_pick_up,
          delivery_charge: deliveryChargesResponse.delivery_charge,
          is_wallet_used: isWalletUsed ? 1 : 0,
          wallet_balance_used: walletAmountUsed || 0,
        };

        const res = await placeOrder(orderData);

        if (res.error) {
          toast.error(res.message);
          if (res.order_id) {
            await deleteOrderHandler(res.order_id);
          }
          setLoading(false);
          return;
        }

        order_id = res.order_id;
      }

      const user = getUserData();

      const payload = {
        reference: order_id,
        user_id: user.id,
      };

      if (type === "wallet") payload.amount = amount;

      const webviewRes = await flutterwave_webview(payload);

      if (webviewRes.error || !webviewRes.link) {
        toast.error("Unable to initiate payment");
        if (type === "placeOrder" && order_id) {
          await deleteOrderHandler(order_id);
        }
        setLoading(false);
        return;
      }

      toast.success("Opening payment window...");

      try {
        const result = await openPopup(webviewRes.link);
        console.log("Payment result:", result);

        if (result.status === "successful") {
          toast.success("Payment successful!");
          dispatch(clearDeliveryAddress());
          await updateUserCart();
          if (onClose) onClose();
          window.location.href = "/user/cart";
        } else {
          toast.error("Payment failed!");
          if (type === "placeOrder") {
            await deleteOrderHandler(order_id);
          }
        }
      } catch (popupError) {
        console.error("Popup error:", popupError);
        if (popupError === "closed") {
          toast.error("Payment popup was closed.");
          if (type === "placeOrder") {
            await deleteOrderHandler(order_id);
          }
        } else {
          toast.error("Payment process failed. Please try again.");
          if (type === "placeOrder") {
            await deleteOrderHandler(order_id);
          }
        }
      }

      setLoading(false);
    } catch (err) {
      console.error("Payment Error:", err);
      toast.error("Failed to initiate payment");
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        id="flutterwave-button"
        onPress={handlePayment}
        disabled={loading}
        className="w-full py-2 rounded disabled:opacity-50 hidden"
      >
        {loading
          ? "Processing..."
          : type === "wallet"
            ? "Recharge Wallet"
            : "Pay with Flutterwave"}
      </Button>

      {loading && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="text-white bg-black px-4 py-2 rounded">
            Processing Payment...
          </div>
        </div>
      )}
    </>
  );
};

export default FlutterwavePayment;
