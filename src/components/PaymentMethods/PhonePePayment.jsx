import React, { useState } from "react";
import { toast } from "sonner";
import { placeOrder, phonepe_web, addTransaction } from "@/interceptor/routes";
import { getUserData } from "@/events/getters";
import { deleteOrderHandler } from "@/events/actions";
import { generateOrderId } from "@/helpers/functionHelper";
import { Button } from "@heroui/button";

const PhonePePayment = ({
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
  message,
}) => {
  const [loading, setLoading] = useState(false);

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
          payment_method: "phonepe",
          address_id:
            deliveryType === "Pick Up" ? 0 : selectedDeliveryAddress?.id,
          is_self_pick_up,
          delivery_charge: deliveryChargesResponse.delivery_charge,
          is_wallet_used: isWalletUsed ? 1 : 0,
          wallet_balance_used: walletAmountUsed || 0,
          active_status: "draft",
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

      // Construct redirect URL based on type
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      const redirectUrl = type === "placeOrder" 
        ? `${baseUrl}/user/my-orders` 
        : `${baseUrl}/user/wallet`;

      const payload = {
        user_id: user.id,
        amount: type === "wallet" ? amount : finalTotal,
        type: type === "wallet" ? "wallet" : "cart",
        order_id: order_id,
        mobile: user.mobile,
        redirect_url: redirectUrl,
      };

      const phonepeResponse = await phonepe_web(payload);

      if (phonepeResponse.error || !phonepeResponse.url) {
        toast.error(phonepeResponse.message || "Unable to initiate payment");
        if (type === "placeOrder" && order_id) {
          await deleteOrderHandler(order_id);
        }
        setLoading(false);
        return;
      }

      // For wallet, add transaction with amount 0
      if (type === "wallet") {
        await addTransaction({
          transaction_type: "wallet",
          order_id: order_id,
          type: "credit",
          payment_method: "phonepe",
          txn_id: order_id,
          amount: 0,
          status: "pending",
          message: message || "Wallet Recharge",
          skip_verify_transaction: true,
        });
      }

      // Redirect to PhonePe payment page
      window.location.href = phonepeResponse.url;
    } catch (err) {
      console.error("Payment Error:", err);
      toast.error(err.message || "Failed to initiate payment");
      if (type === "placeOrder" && order_id) {
        await deleteOrderHandler(order_id);
      }
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        id="phonepe-button"
        onPress={handlePayment}
        disabled={loading}
        className="w-full py-2 rounded disabled:opacity-50 hidden"
      >
        {loading
          ? "Processing..."
          : type === "wallet"
            ? "Recharge Wallet"
            : "Pay with PhonePe"}
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

export default PhonePePayment;

