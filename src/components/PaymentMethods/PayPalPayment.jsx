import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { placeOrder, addTransaction } from "@/interceptor/routes";
import { getUserData } from "@/events/getters";
import { clearDeliveryAddress } from "@/store/reducers/selectedDeliverySlice";
import {
  deleteOrderHandler,
  updateUserCart,
  updateWalletBalance,
} from "@/events/actions";
import { generateOrderId } from "@/helpers/functionHelper";
import { Button } from "@heroui/button";

const PayPalPayment = ({
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
  amount,
  message,
  isWalletUsed,
  walletAmountUsed,
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const initialOptions = {
    "client-id": paymentMethodDetails.clientId,
    currency: paymentMethodDetails.currencyCode || "USD",
    intent: "capture",
    "data-client-token": paymentMethodDetails.clientToken,
  };

  const handlePayment = async () => {
    if (type === "placeOrder") {
      if (deliveryType === "Delivery" && !selectedDeliveryAddress) {
        toast.error("Please select a delivery address before proceeding!");
        return;
      }
    } else if (type === "wallet") {
      if (!amount || amount <= 0) {
        toast.error("Please enter a valid recharge amount!");
        return;
      }
    }

    setLoading(true);
    document.getElementById("paypal-button")?.click();
  };

  const createOrder = async (data, actions) => {
    let order_id;
    let transactionData;

    try {
      if (type === "wallet") {
        order_id = generateOrderId();

        transactionData = {
          transaction_type: "wallet",
          order_id,
          type: "credit",
          payment_method: "paypal",
          txn_id: null,
          amount,
          status: "pending",
          message: "Wallet Recharge",
          skip_verify_transaction: true,
        };

        // Store transaction data for later use
        window.paypalTransactionData = transactionData;
        window.paypalOrderId = order_id;

        return actions.order.create({
          purchase_units: [
            {
              amount: {
                currency_code: paymentMethodDetails.currencyCode || "USD",
                value: amount.toString(),
              },
              description: "Wallet Recharge",
            },
          ],
        });
      } else {
        order_id = generateOrderId();
        window.paypalOrderId = order_id;

        return actions.order.create({
          purchase_units: [
            {
              amount: {
                currency_code: paymentMethodDetails.currencyCode || "USD",
                value: finalTotal.toString(),
              },
              description: "Product Purchase",
              custom_id: order_id,
            },
          ],
        });
      }
    } catch (error) {
      console.error("PayPal Create Order Error:", error);
      toast.error(error.message || "Failed to create PayPal order");
      throw error;
    }
  };

  const onApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();

      if (type === "wallet") {
        const transactionData = window.paypalTransactionData;
        const order_id = window.paypalOrderId;

        await addTransaction({
          ...transactionData,
          txn_id: details.id,
          status: "Success",
          message: message,
        });

        updateWalletBalance();
        toast.success("Wallet recharge successful!");

        delete window.paypalTransactionData;
        delete window.paypalOrderId;
      } else {
        
        const orderData = {
          branch_id,
          mobile: getUserData().mobile,
          product_variant_id: cartStoreData.variant_id.join(", "),
          quantity: cartStoreData.data
            .map((document) => document.qty)
            .join(", "),
          total: cartStoreData.overall_amount,
          final_total: finalTotal,
          latitude: selectedDeliveryAddress?.city_latitude,
          longitude: selectedDeliveryAddress?.city_longitude,
          payment_method: "paypal",
          address_id:
            deliveryType === "Pick Up" ? 0 : selectedDeliveryAddress?.id,
          is_self_pick_up,
          delivery_charge: deliveryChargesResponse.delivery_charge,
          is_wallet_used: isWalletUsed ? 1 : 0,
          wallet_balance_used: walletAmountUsed || 0,
        };

        const placeOrderResponse = await placeOrder(orderData);

        if (placeOrderResponse.error) {
          toast.error(placeOrderResponse.message);
          if (placeOrderResponse.order_id) {
            await deleteOrderHandler(placeOrderResponse.order_id);
          }
          throw new Error(placeOrderResponse.message);
        }

        if (isWalletUsed) {
          updateWalletBalance();
        }
        dispatch(clearDeliveryAddress());
        updateUserCart();
        toast.success("Payment Successful!");

        delete window.paypalOrderId;
      }

      onClose();
    } catch (error) {
      console.error("PayPal Approval Error:", error);
      toast.error(error.message || "Payment failed");

      const order_id = window.paypalOrderId;
      if (order_id) {
        await deleteOrderHandler(order_id);
      }

      delete window.paypalTransactionData;
      delete window.paypalOrderId;
    } finally {
      setLoading(false);
    }
  };

  const onError = async (err) => {
    console.error("PayPal Error:", err);
    toast.error("PayPal payment failed");

    const order_id = window.paypalOrderId;
    if (order_id && type === "placeOrder") {
      await deleteOrderHandler(order_id, true);
    } else if (type === "wallet") {
      toast.error("Payment Failed for Wallet!");
    }

    // Clean up
    delete window.paypalTransactionData;
    delete window.paypalOrderId;

    setLoading(false);
  };

  const onCancel = async (data) => {
    console.log("PayPal payment cancelled:", data);
    toast.error("Payment was cancelled");

    const order_id = window.paypalOrderId;
    if (order_id && type === "placeOrder") {
      await deleteOrderHandler(order_id, true);
    }

    // Clean up
    delete window.paypalTransactionData;
    delete window.paypalOrderId;

    setLoading(false);
  };

  return (
    <div className="w-full">
      <Button
        id="paypal-button"
        onPress={handlePayment}
        disabled={loading}
        className="w-full py-2 rounded disabled:opacity-50 hidden"
      >
        {loading
          ? "Processing..."
          : type === "wallet"
            ? "Recharge Wallet"
            : "Pay with PayPal"}
      </Button>

      {loading && (
        <div className="mt-4">
          <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
              createOrder={createOrder}
              onApprove={onApprove}
              onError={onError}
              onCancel={onCancel}
              style={{ layout: "horizontal" }}
            />
          </PayPalScriptProvider>
        </div>
      )}
    </div>
  );
};

export default PayPalPayment;
