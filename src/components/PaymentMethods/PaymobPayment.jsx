import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Spinner,
} from "@heroui/react";
import { toast } from "sonner";
import {
  paymob_generate_payment_key,
  paymob_verify_transaction,
  addTransaction,
  placeOrder,
} from "@/interceptor/routes";
import { updateUserCart, updateWalletBalance } from "@/events/actions";
import { getUserData } from "@/events/getters";
import { useSelector, useDispatch } from "react-redux";
import { clearDeliveryAddress } from "@/store/reducers/selectedDeliverySlice";
import { useTranslation } from "react-i18next";

const PaymobPayment = ({
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
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [iframeUrl, setIframeUrl] = useState(null);
  const [merchantOrderId, setMerchantOrderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const iframeRef = useRef(null);

  const handlePaymobPay = async () => {
    try {
      const amountInCents = Math.round(finalTotal * 100);
      const orderId =
        type === "placeOrder"
          ? `order-${Date.now()}-${getUserData()?.id}`
          : `wallet-${Date.now()}-${getUserData()?.id}`;

      const result = await paymob_generate_payment_key({
        amount: amountInCents,
        merchant_order_id: orderId,
        payment_method: "card",
      });

      if (result.error) {
        toast.error(result.message || "Failed to initiate payment");
        return;
      }

      const paymentKey = result.data?.payment_key;
      const iframeId = paymentMethodDetails?.iframeId;

      if (!paymentKey) {
        toast.error("Invalid payment key received");
        return;
      }

      setMerchantOrderId(orderId);

      const url = iframeId
        ? `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentKey}`
        : `https://accept.paymob.com/api/acceptance/payments/pay?token=${paymentKey}`;

      setIframeUrl(url);
      setIsModalOpen(true);
    } catch (error) {
      toast.error(error.message || "Payment initiation failed");
    }
  };

  // Listen for Paymob postMessage callback
  useEffect(() => {
    const handleMessage = async (event) => {
      if (!event.origin.includes("paymob.com")) return;

      const data = event.data;
      if (data?.type === "paymob" || data?.transaction_id || data?.success !== undefined) {
        await handleVerification(data?.transaction_id, data?.success);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [merchantOrderId]);

  const handleVerification = async (transactionId, successFlag) => {
    if (isVerifying) return;
    setIsVerifying(true);

    try {
      if (transactionId) {
        const verifyResult = await paymob_verify_transaction({ transaction_id: transactionId });

        if (!verifyResult.error && verifyResult.data?.success) {
          await onPaymentSuccess(transactionId);
        } else {
          toast.error("Payment verification failed");
          setIsModalOpen(false);
        }
      } else if (successFlag) {
        await onPaymentSuccess(transactionId || "paymob");
      } else {
        toast.error("Payment was not completed");
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error("Payment verification error");
    } finally {
      setIsVerifying(false);
    }
  };

  const onPaymentSuccess = async (transactionId) => {
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
          payment_method: "paymob",
          address_id: deliveryType === "Pick Up" ? 0 : selectedDeliveryAddress?.id,
          is_self_pick_up,
          is_wallet_used: isWalletUsed ? 1 : 0,
          wallet_balance_used: walletAmountUsed,
        };

        const orderResponse = await placeOrder(orderData);
        if (orderResponse.error) throw new Error(orderResponse.message);

        await addTransaction({
          transaction_type: "transaction",
          order_id: orderResponse.data?.order_id,
          type: "paymob",
          payment_method: "paymob",
          txn_id: transactionId,
          amount: finalTotal,
          status: "success",
          message: "Paymob payment successful",
        });

        if (isWalletUsed) updateWalletBalance();
        dispatch(clearDeliveryAddress());
        updateUserCart();
        toast.success(orderResponse.message || "Order placed successfully!");
      } else {
        await addTransaction({
          transaction_type: "wallet",
          type: "paymob",
          payment_method: "paymob",
          txn_id: transactionId,
          amount: finalTotal,
          status: "success",
          message: "Wallet recharge via Paymob",
        });
        updateWalletBalance();
        toast.success("Wallet recharged successfully!");
      }

      setIsModalOpen(false);
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to complete order");
    }
  };

  const handleIframeLoad = () => {
    try {
      const iframeLocation = iframeRef.current?.contentWindow?.location?.href;
      if (
        iframeLocation &&
        (iframeLocation.includes("success") || iframeLocation.includes("transaction_id"))
      ) {
        const url = new URL(iframeLocation);
        const txnId = url.searchParams.get("transaction_id") || url.searchParams.get("id");
        const success = url.searchParams.get("success") === "true";
        handleVerification(txnId, success);
      }
    } catch {
      // Cross-origin access blocked — handled via postMessage instead
    }
  };

  return (
    <>
      <button
        id="paymob-button"
        className="hidden"
        onClick={handlePaymobPay}
      />

      <Modal
        isOpen={isModalOpen}
        onOpenChange={(open) => {
          if (!open && !isVerifying) setIsModalOpen(false);
        }}
        size="3xl"
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex justify-between items-center">
            <span>Pay with Paymob</span>
            {!isVerifying && (
              <Button
                size="sm"
                variant="light"
                color="danger"
                onPress={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
            )}
          </ModalHeader>
          <ModalBody className="p-0 min-h-[500px] relative">
            {isVerifying && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 gap-4">
                <Spinner size="lg" color="primary" />
                <p className="text-gray-600">Verifying payment...</p>
              </div>
            )}
            {iframeUrl && (
              <iframe
                ref={iframeRef}
                src={iframeUrl}
                className="w-full min-h-[500px] border-0"
                title="Paymob Payment"
                onLoad={handleIframeLoad}
                allow="payment"
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PaymobPayment;
