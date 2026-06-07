import { getBranchId } from "../events/getters";
import { store } from "../store/store";
import api from "./api";

export const verify_user_firebase = async ({ mobile } = {}) => {
  const formData = new FormData();

  formData.append("mobile", mobile);

  let response = await api.post("/verify_user", formData);
  return response.data;
};

export const verify_user = async ({ mobile } = {}) => {
  const formData = new FormData();

  formData.append("mobile", mobile);

  let response = await api.post("/verify_user", formData);

  return response.data;
};

export const verify_otp = async ({ mobile, otp } = {}) => {
  const formData = new FormData();

  formData.append("mobile", mobile);
  formData.append("otp", otp);

  let response = await api.post("/verify_otp", formData);

  return response.data;
};

export const resend_otp = async ({ mobile } = {}) => {
  const formData = new FormData();

  formData.append("mobile", mobile);

  let response = await api.post("/resend_otp", formData);

  return response.data;
};

export const get_categories = async (limit, offset, id) => {
  const formData = new FormData();
  formData.append("limit", limit ?? 100);
  formData.append("offset", offset ?? 0);
  formData.append("branch_id", getBranchId());

  if (id) {
    formData.append("id", id);
  }

  let response = await api.post("/get_categories", formData);
  return response.data;
};

export const get_settings = async ({ type, user_id } = {}) => {
  const formData = new FormData();

  if (type) {
    formData.append("type", type);
  }
  if (user_id) {
    formData.append("user_id", user_id);
  }

  let response = await api.post("/get_settings", formData);
  return response.data;
};

export const get_product_rating = async ({ id, limit, offset }) => {
  const formData = new FormData();

  if (id) formData.append("product_id", id);
  if (limit) formData.append("limit", limit ?? 10);
  if (offset) formData.append("offset", offset ?? 0);

  let response = await api.post("/get_product_rating", formData);
  return response.data;
};

export const get_products = async ({
  id,
  category_id,
  search,
  tags,
  attribute_value_ids,
  limit,
  offset,
  sort = "pv.price",
  order = "DESC",
  top_rated_foods = 0,
  discount,
  min_price,
  max_price,
  partner_id,
  product_variant_ids,
  type = 3,
  vegetarian,

  filter_by,
  is_search_modal = false,
}) => {
  const formData = new FormData();

  const user_id = store.getState()?.authentication?.userData.id;

  formData.append("branch_id", getBranchId());
  if (id) formData.append("id", id);
  if (category_id) formData.append("category_id", category_id);
  if (user_id) formData.append("user_id", user_id);
  if (search) formData.append("search", search);
  if (tags) formData.append("tags", tags);
  if (attribute_value_ids)
    formData.append("attribute_value_ids", attribute_value_ids);

  if (limit) formData.append("limit", limit ?? 20);
  if (offset) formData.append("offset", offset ?? 0);
  // if (sort) formData.append("sort", sort ?? "name");
  if (sort) formData.append("sort", is_search_modal ? "" : sort);
  if (order) formData.append("order", order);
  if (top_rated_foods) formData.append("top_rated_foods", top_rated_foods);
  if (discount) formData.append("discount", discount);
  if (min_price) formData.append("min_price", min_price);
  if (max_price) formData.append("max_price", max_price);
  if (partner_id) formData.append("partner_id", partner_id);
  if (product_variant_ids)
    formData.append("product_variant_ids", product_variant_ids);
  if (vegetarian) formData.append("vegetarian", vegetarian);
  if (filter_by) formData.append("filter_by", filter_by);

  let response = await api.post("/get_products", formData);
  return response.data;
};

export const getOfferImages = async () => {
  const formData = new FormData();

  formData.append("branch_id", getBranchId());
  let response = await api.post("/get_offer_images", formData);

  return response.data;
};

export const is_city_deliverable = async ({ name, latitude, longitude }) => {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("latitude", latitude);
  formData.append("longitude", longitude);

  let response = await api.post("/is_city_deliverable", formData);
  return response.data;
};

export const getOrders = async ({ id } = {}) => {
  const formData = new FormData();

  formData.append("id", id);

  let response = await api.post("/get_orders", formData);
  return response.data;
};

export const removeFromCart = async ({
  user_id,
  product_variant_id,

  cart_id,
} = {}) => {
  const formData = new FormData();

  formData.append("branch_id", getBranchId());
  if (product_variant_id)
    formData.append("product_variant_id", product_variant_id);
  if (cart_id) formData.append("cart_id", cart_id);

  let response = await api.post("/remove_from_cart", formData);
  return response.data;
};

export const getFavorites = async ({
  type = "products",
  type_id,
  limit = 100,
  offset = 0,
} = {}) => {
  const formData = new FormData();

  formData.append("type", type);
  if (type_id) formData.append("type_id", type_id);
  formData.append("branch_id", getBranchId());
  formData.append("limit", limit);
  formData.append("offset", offset);

  let response = await api.post("/get_favorites", formData);
  return response.data;
};

export const getUserAddress = async ({ address_id, user_id }) => {
  const formData = new FormData();

  if (address_id) formData.append("address_id", address_id);
  if (user_id) formData.append("user_id", user_id);

  let response = await api.post("/get_address", formData);
  return response.data;
};

export const addAddress = async ({
  id,
  user_id,
  mobile,
  address,
  type,
  country_code,
  alternate_mobile,
  landmark,
  area,
  pincode,
  latitude,
  longitude,
  is_default,
  city,
} = {}) => {
  const formData = new FormData();

  if (id) formData.append("id", id);
  if (user_id) formData.append("user_id", user_id);
  if (mobile) formData.append("mobile", mobile);
  if (address) formData.append("address", address);
  if (city) formData.append("city", city);
  if (type) formData.append("type", type);
  if (country_code) formData.append("country_code", country_code);
  if (alternate_mobile) formData.append("alternate_mobile", alternate_mobile);
  if (landmark) formData.append("land_mark", landmark);
  if (area) formData.append("area", area);
  if (pincode) formData.append("pincode", pincode);
  if (latitude) formData.append("latitude", latitude);
  if (longitude) formData.append("longitude", longitude);
  if (is_default) formData.append("is_default", is_default);

  let response = await api.post("/add_address", formData);
  return response.data;
};

export const updateAddress = async ({
  id,
  user_id,
  mobile,
  address,
  type,
  country_code,
  alternate_mobile,
  land_mark,
  area,
  pincode,
  latitude,
  city,
  longitude,
  is_default,
} = {}) => {
  const formData = new FormData();

  formData.append("branch_id", getBranchId());

  if (id) formData.append("id", id);
  if (user_id) formData.append("user_id", user_id);
  if (mobile) formData.append("mobile", mobile);
  if (address) formData.append("address", address);
  if (type) formData.append("type", type);
  if (country_code) formData.append("country_code", country_code);
  if (alternate_mobile) formData.append("alternate_mobile", alternate_mobile);
  if (land_mark) formData.append("land_mark", land_mark);
  if (area) formData.append("area", area);
  if (pincode) formData.append("pincode", pincode);
  if (latitude) formData.append("latitude", latitude);
  if (longitude) formData.append("longitude", longitude);
  if (is_default) formData.append("is_default", is_default);
  if (city) formData.append("city", city);

  let response = await api.post("/update_address", formData);
  return response.data;
};

export const removeUserAddress = async ({ id }) => {
  const formData = new FormData();

  if (id) formData.append("id", id);

  let response = await api.post("/delete_address", formData);
  return response.data;
};

export const addToFavorite = async ({ type = "products", type_id } = {}) => {
  const formData = new FormData();

  formData.append("type", type);
  formData.append("type_id", type_id);
  formData.append("branch_id", getBranchId());

  let response = await api.post("/add_to_favorites", formData);
  return response.data;
};

export const removeFromFavorite = async ({
  type = "products",
  type_id,
} = {}) => {
  const formData = new FormData();

  formData.append("type", type);
  formData.append("type_id", type_id);
  formData.append("branch_id", getBranchId());

  let response = await api.post("/remove_from_favorites", formData);
  return response.data;
};

export const getPromoCodes = async () => {
  const formData = new FormData();

  formData.append("branch_id", getBranchId());

  let response = await api.post("/get_promo_codes", formData);
  return response.data;
};

export const validatePromoCodes = async ({ final_total, promo_code } = {}) => {
  const formData = new FormData();

  formData.append("branch_id", getBranchId());
  formData.append("final_total", final_total);
  formData.append("promo_code", promo_code);

  let response = await api.post("/validate_promo_code", formData);
  return response.data;
};

export const get_delivery_charges = async ({
  address_id = 0,
  final_total = 0,
}) => {
  const formData = new FormData();

  let branch_id = getBranchId();

  if (address_id != 0) formData.append("address_id", address_id);
  formData.append("final_total", final_total);
  formData.append("branch_id", branch_id);

  let response = await api.post("/get_delivery_charges", formData);

  return response.data;
};

export const placeOrder = async ({
  mobile,
  product_variant_id,
  quantity,
  total,
  final_total,
  latitude,
  longitude,
  payment_method,
  address_id,
  is_wallet_used = 0,
  wallet_balance_used = 0,
  is_self_pick_up = 0,
  active_status = "awaiting",
  scheduled_time = "",
  scheduled_to_time = "",
  is_same_day = 0,
} = {}) => {
  let promoCode = store.getState().promoCodes.value;
  let cartState = store.getState().cart;
  let cartIds = cartState.data?.map((item) => item.cart_id).join(", ");
  const isGlobalTaxEnabled =
    cartState.data?.length > 0
      ? cartState.data[0].product_details?.[0]?.default_taxation_system === "1"
      : false;
      
  const formData = new FormData();

  formData.append("branch_id", getBranchId());
  formData.append("mobile", mobile);
  formData.append("product_variant_id", product_variant_id);
  formData.append("quantity", quantity);
  formData.append("total", total);
  formData.append("final_total", final_total);
  if (is_self_pick_up == 1) {
    formData.append("latitude", "");
    formData.append("longitude", "");
  } else {
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
  }
  formData.append("payment_method", payment_method);
  formData.append("is_wallet_used", is_wallet_used);
  formData.append("wallet_balance_used", wallet_balance_used);
  formData.append("is_self_pick_up", is_self_pick_up);

  formData.append(
    "promo_code",
    promoCode.length > 0 ? promoCode?.[0]?.promo_code : ""
  );
  if (payment_method == "flutterwave" || payment_method == "phonepe") { formData.append("active_status",active_status); }
  if (is_self_pick_up == 0) {
    (formData.append("delivery_tip", cartState.delivery_tip),
      formData.append("address_id", address_id));

    formData.append(
      "delivery_charge",
      cartState?.delivery_charges?.is_free_delivery == "1"
        ? ""
        : cartState?.delivery_charges?.delivery_charge
    );
  }
  if (isGlobalTaxEnabled) {
    formData.append("tax_amount", cartState.tax_amount);
    formData.append("tax_percentage", cartState.tax_percentage);
  }
  formData.append("order_note", cartState.orderNote);
  formData.append("cart_ids", cartIds);
  if (scheduled_time) formData.append("scheduled_time", scheduled_time);
  if (scheduled_to_time) formData.append("scheduled_to_time", scheduled_to_time);
  formData.append("is_same_day", is_same_day);

  let response = await api.post("/place_order", formData);
  return response.data;
};

export const razorpay_create_order = async ({ order_id } = {}) => {
  const formData = new FormData();

  formData.append("order_id", order_id);

  let response = await api.post("/razorpay_create_order", formData);
  return response.data;
};

export const paymentIntentGenerator = async ({
  order_id,
  type = "stripe",
  amount = 0,
} = {}) => {
  const formData = new FormData();

  formData.append("order_id", order_id);
  formData.append("type", type);
  if (amount > 0) formData.append("amount", amount);
  let response = await api.post("/payment_intent", formData);
  return response.data;
};

export const get_transactions = async ({
  limit,
  offset,
  transaction_type,
  type,
} = {}) => {
  const formData = new FormData();

  if (limit) {
    formData.append("limit", limit);
  }

  formData.append("offset", offset ?? 0);
  formData.append("transaction_type", transaction_type);
  if (type) formData.append("type", type);

  let response = await api.post("/transactions", formData);
  return response.data;
};

export const addTransaction = async ({
  transaction_type = "transaction",
  order_id = "",
  type = "",
  payment_method = "",
  txn_id = "",
  amount = "",
  status = "",
  message = "",
  skip_verify_transaction = false,
} = {}) => {
  const formData = new FormData();

  formData.append("branch_id", getBranchId());
  formData.append("transaction_type", transaction_type);
  formData.append("order_id", order_id);
  formData.append("type", type);
  formData.append("payment_method", payment_method);
  formData.append("txn_id", txn_id);
  formData.append("amount", amount);
  formData.append("status", status);
  formData.append("message", message);
  formData.append("skip_verify_transaction", skip_verify_transaction);

  let response = await api.post("/add_transaction", formData);
  return response.data;
};

export const send_withdraw_request = async ({
  payment_address,
  amount,
} = {}) => {
  const formData = new FormData();

  formData.append("payment_address", payment_address);
  formData.append("amount", amount);

  let response = await api.post("/send_withdrawal_request", formData);
  return response.data;
};

export const deleteOrder = async (order_id) => {
  const formData = new FormData();

  if (order_id) formData.append("order_id", order_id);

  let response = await api.post("/delete_order", formData);
  return response.data;
};

export const get_sections = async ({
  branch_id,
  limit = 25,
  offset = 0,
  user_id,
  section_id,
  section_slug,
  top_rated_foods = 0,
  p_limit = 10,
  p_offset = 0,
  p_sort = "pid",
  p_order = "desc",
  filter_by = "p.id",
  latitude,
  longitude,
}) => {
  try {
    const formData = new FormData();

    formData.append("branch_id", branch_id);
    formData.append("limit", limit);
    formData.append("offset", offset);

    if (user_id) formData.append("user_id", user_id);
    if (section_id) formData.append("section_id", section_id);
    if (section_slug) formData.append("section_slug", section_slug);
    if (top_rated_foods) formData.append("top_rated_foods", top_rated_foods);
    if (p_limit) formData.append("p_limit", p_limit);
    if (p_offset) formData.append("p_offset", p_offset);
    if (p_sort) formData.append("p_sort", p_sort);
    if (p_order) formData.append("p_order", p_order);
    if (filter_by) formData.append("filter_by", filter_by);
    if (latitude) formData.append("latitude", latitude);
    if (longitude) formData.append("longitude", longitude);

    const response = await api.post("/get_sections", formData);
    return response.data;
  } catch (error) {
    console.error("Error fetching sections:", error);
    throw error;
  }
};

export const deleteMyAccount = async ({ user_id }) => {
  const formData = new FormData();

  formData.append("user_id", user_id);
  let response = await api.post("/delete_my_account", formData);
  return response.data;
};

export const get_notifications = async ({ sort, order, limit, offset }) => {
  const formData = new FormData();

  if (sort) formData.append("sort", sort);
  if (order) formData.append("order", order);
  formData.append("limit", limit ?? 10);
  formData.append("offset", offset ?? 0);

  const response = await api.post("/get_notifications", formData);

  return response.data;
};

export const get_cities = async (sort, order, search, limit, offset) => {
  const formData = new FormData();

  if (sort) formData.append("sort", sort);

  if (order) formData.append("user_id", user_id);
  if (search) formData.append("search", search);
  formData.append("limit", limit ?? 10);
  formData.append("offset", offset ?? 0);

  let response = await api.post("/get_cities", formData);
  return response.data;
};

export const flutterwave_webview = async (data) => {
  const formData = new FormData();
  
  // Add reference (order_id) parameter
  if (data.reference) {
    formData.append('reference', data.reference);
  }
  
  // Add amount parameter (required by API)
  if (data.amount) {
    formData.append('amount', data.amount);
  }
  
  // Add user_id parameter (required by API)
  if (data.user_id) {
    formData.append('user_id', data.user_id);
  }
  

  // Add any other parameters that might be needed
  if (data.additional_params) {
    Object.keys(data.additional_params).forEach(key => {
      formData.append(key, data.additional_params[key]);
    });
  }

  let response = await api.post("/flutterwave_webview", formData);
  return response.data;
};

export const flutterwave_payment_response = async (data) => {
  const formData = new FormData();

  // Append transaction_id if provided
  if (data.transaction_id) {
    formData.append('transaction_id', data.transaction_id);
  } else {
    throw new Error('transaction_id is required');
  }

  // Append reference if provided
  if (data.reference) {
    formData.append('reference', data.reference);
  } else {
    throw new Error('reference is required');
  }

  // Append status if provided
  if (data.status) {
    formData.append('status', data.status);
  } else {
    throw new Error('status is required');
  }

  // Append tx_ref if provided
  if (data.tx_ref) {
    formData.append('tx_ref', data.tx_ref);
  }

  try {
    const response = await api.post("/flutterwave_payment_response", formData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to verify payment: ${error.message}`);
  }
};

export const paymob_generate_payment_key = async ({
  amount,
  merchant_order_id,
  payment_method = "card",
} = {}) => {
  const formData = new FormData();
  formData.append("amount", amount);
  formData.append("merchant_order_id", merchant_order_id);
  formData.append("payment_method", payment_method);
  const response = await api.post("/paymob_generate_payment_key", formData);
  return response.data;
};

export const paymob_verify_transaction = async ({ transaction_id } = {}) => {
  const formData = new FormData();
  formData.append("transaction_id", transaction_id);
  const response = await api.post("/paymob_verify_transaction", formData);
  return response.data;
};

export const phonepe_web = async ({
  user_id,
  amount,
  type,
  order_id,
  mobile,
  redirect_url,
} = {}) => {
  const formData = new FormData();

  if (user_id) formData.append("user_id", user_id);
  if (amount) formData.append("amount", amount);
  if (type) formData.append("type", type);
  if (order_id) formData.append("order_id", order_id);
  if (mobile) formData.append("mobile", mobile);
  if (redirect_url) formData.append("redirect_url", redirect_url);

  let response = await api.post("/phonepe_web", formData);
  return response.data;
};

export const get_scheduled_times = async ({ branch_id } = {}) => {
  const formData = new FormData();
  formData.append("branch_id", branch_id || getBranchId());
  const response = await api.post("/get_scheduled_times", formData);
  return response.data;
};

export const get_faqs = async ({ limit = 20, offset = 0 } = {}) => {
  const formData = new FormData();
  formData.append("limit", limit);
  formData.append("offset", offset);
  const response = await api.post("/get_faqs", formData);
  return response.data;
};

export const get_ticket_types = async () => {
  const response = await api.post("/get_ticket_types", new FormData());
  return response.data;
};

export const get_tickets = async ({ limit = 20, offset = 0 } = {}) => {
  const formData = new FormData();
  formData.append("limit", limit);
  formData.append("offset", offset);
  const response = await api.post("/get_tickets", formData);
  return response.data;
};

export const add_ticket = async ({ ticket_type_id, subject, email, description } = {}) => {
  const formData = new FormData();
  formData.append("ticket_type_id", ticket_type_id);
  formData.append("subject", subject);
  formData.append("email", email);
  formData.append("description", description);
  const response = await api.post("/add_ticket", formData);
  return response.data;
};

export const edit_ticket = async ({ ticket_id, ticket_type_id, subject, email, description, status } = {}) => {
  const formData = new FormData();
  formData.append("ticket_id", ticket_id);
  if (ticket_type_id) formData.append("ticket_type_id", ticket_type_id);
  if (subject) formData.append("subject", subject);
  if (email) formData.append("email", email);
  if (description) formData.append("description", description);
  if (status) formData.append("status", status);
  const response = await api.post("/edit_ticket", formData);
  return response.data;
};

export const get_messages = async ({ ticket_id, limit = 50, offset = 0 } = {}) => {
  const formData = new FormData();
  formData.append("ticket_id", ticket_id);
  formData.append("limit", limit);
  formData.append("offset", offset);
  const response = await api.post("/get_messages", formData);
  return response.data;
};

export const send_message = async ({ ticket_id, message, attachment } = {}) => {
  const formData = new FormData();
  formData.append("ticket_id", ticket_id);
  formData.append("user_type", "user");
  formData.append("message", message);
  if (attachment) formData.append("attachments[]", attachment);
  const response = await api.post("/send_message", formData);
  return response.data;
};

export default api;
