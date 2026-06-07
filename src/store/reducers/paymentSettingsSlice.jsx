import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  availablePaymentMethods: [],
  currencyCodes: {},
  error: null,
  userData: null,
};

const paymentSettingsSlice = createSlice({
  name: "paymentSettings",
  initialState,
  reducers: {
    setPaymentSettings: (state, action) => {
      const { payment_method } = action.payload;

      const availablePaymentMethods = [
        {
          id: "stripe",
          name: "Stripe",
          isEnabled: payment_method.stripe_payment_method === "1",
          icon: "/stripe.svg",
          description: "Pay securely with Stripe",
          mode: payment_method.stripe_payment_mode,
          currencyCode: payment_method.stripe_currency_code,
          publishableKey: payment_method.stripe_publishable_key,
        },
        {
          id: "razorpay",
          name: "Razorpay",
          isEnabled: payment_method.razorpay_payment_method === "1",
          icon: "/razorpay.png",
          description: "Quick payments with Razorpay",
          keyId: payment_method.razorpay_key_id,
        },
        {
          id: "paystack",
          name: "Paystack",
          isEnabled: payment_method.paystack_payment_method === "1",
          icon: "/paystack.svg",
          description: "Secure payments via Paystack",
          keyId: payment_method.paystack_key_id,
        },
        {
          id: "paypal",
          name: "PayPal",
          isEnabled: payment_method.paypal_payment_method === "1",
          icon: "/paypal.png",
          description: "Pay with PayPal",
          clientId: payment_method.paypal_client_id,
          clientSecret: payment_method.paypal_client_secret,
          mode: payment_method.paypal_payment_mode,
          currencyCode: payment_method.paypal_currency_code || "USD",
        },
        {
          id: "flutterwave",
          name: "Flutterwave",
          isEnabled: payment_method.flutterwave_payment_method === "1",
          icon: "/flutterwave.svg", // Add your Flutterwave icon path
          description: "Secure payments with Flutterwave",
          publicKey: payment_method.flutterwave_public_key,
          currencyCode: payment_method.flutterwave_currency_code || "NGN", // Default to NGN, adjust as needed
        },
        {
          id: "phonepe",
          name: "PhonePe",
          isEnabled: payment_method.phonepe_payment_method === "1",
          icon: "/phonepe-logo-icon.jpg", 
          description: "Pay securely with PhonePe",
        },
        {
          id: "paymob",
          name: "Paymob",
          isEnabled: payment_method.paymob_payment_method === "1",
          icon: "/assets/images/instapay.png",
          description: "Pay securely with Paymob",
          iframeId: payment_method.paymob_iframe_id,
        },
        {
          id: "instapay",
          name: "InstaPay",
          isEnabled: payment_method.instapay_payment_method === "1",
          icon: "/assets/images/instapay.png",
          description: "Transfer via InstaPay",
          phoneNumber: payment_method.instapay_phone_number,
        },
        {
          id: "cod",
          name: "Cash on Delivery",
          isEnabled: payment_method.cod_method === "1",
          description: "Pay when you receive",
        },
      ].filter((method) => method.isEnabled);

      state.availablePaymentMethods = availablePaymentMethods;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    updateWalletBalanceInStore: (state, action) => {
      if (state.userData) {
        state.userData.balance = action.payload;
      }
    },
    resetPaymentState: (state) => {
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setPaymentSettings,
  setError,
  setUserData,
  resetPaymentState,
  updateWalletBalanceInStore,
} = paymentSettingsSlice.actions;

export default paymentSettingsSlice.reducer;