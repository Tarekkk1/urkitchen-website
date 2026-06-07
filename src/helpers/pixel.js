const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export const fbq = (...args) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq(...args);
  }
};

export const pageView = () => fbq("track", "PageView");

export const viewContent = ({ content_ids, content_name, content_type = "product", value, currency = "EGP" }) =>
  fbq("track", "ViewContent", { content_ids, content_name, content_type, value, currency });

export const addToCart = ({ content_ids, content_name, value, currency = "EGP" }) =>
  fbq("track", "AddToCart", { content_ids, content_name, value, currency });

export const initiateCheckout = ({ num_items, value, currency = "EGP" }) =>
  fbq("track", "InitiateCheckout", { num_items, value, currency });

export const purchase = ({ value, currency = "EGP", order_id }) =>
  fbq("track", "Purchase", { value, currency, order_id });

export const completeRegistration = () =>
  fbq("track", "CompleteRegistration", { status: true });

export const search = ({ search_string }) =>
  fbq("track", "Search", { search_string });
