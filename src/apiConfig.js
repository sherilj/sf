// API endpoint configuration for easy maintenance
export const BASE_URL = "http://15.206.163.52";

export const API_ENDPOINTS = {
  GET_USER_PROFILE: `${BASE_URL}/api/v1/users/profile`,
  GET_USER_INFO: `${BASE_URL}/api/v1/users`,
  GET_ADDRESSES: `${BASE_URL}/api/v1/addresses`,
  CREATE_ADDRESS: `${BASE_URL}/api/v1/addresses`,
  UPDATE_ADDRESS: (addressId) => `${BASE_URL}/api/v1/addresses/${addressId}`,
  DELETE_ADDRESS: (addressId) => `${BASE_URL}/api/v1/addresses/${addressId}`,
  GET_CART: `${BASE_URL}/api/v1/cart`,
  ADD_CART_ITEM: `${BASE_URL}/api/v1/cart/add`,
  INCREMENT_CART_ITEM: (variantId) => `${BASE_URL}/api/v1/cart/increment/${variantId}`,
  DECREMENT_CART_ITEM: (variantId) => `${BASE_URL}/api/v1/cart/decrement/${variantId}`,
  REMOVE_CART_ITEM: (variantId) => `${BASE_URL}/api/v1/cart/${variantId}`,
  CLEAR_CART: `${BASE_URL}/api/v1/cart/clear`,
  SEND_OTP: `${BASE_URL}/api/v1/auth/send-otp`,
  VERIFY_OTP: `${BASE_URL}/api/v1/auth/verify-otp`,
  CREATE_CHECKOUT: `${BASE_URL}/api/v1/checkout`,
  GET_ORDERS: `${BASE_URL}/api/v1/orders`,
  GET_ORDER_DETAILS: (id) => `${BASE_URL}/api/v1/orders/${id}`,
  // Wishlist
  GET_WISHLIST: `${BASE_URL}/api/v1/wishlist`,
  ADD_WISHLIST_ITEM: (productId) => `${BASE_URL}/api/v1/wishlist/add/${productId}`,
  REMOVE_WISHLIST_ITEM: (productId) => `${BASE_URL}/api/v1/wishlist/${productId}`,
  CLEAR_WISHLIST: `${BASE_URL}/api/v1/wishlist`,
  CHECK_WISHLIST_ITEM: (productId) => `${BASE_URL}/api/v1/wishlist/check/${productId}`,
  GET_COUPONS: `${BASE_URL}/api/v1/coupons`,
  VERIFY_COUPON: `${BASE_URL}/api/v1/coupons/verify`,
  GET_CATEGORIES: `${BASE_URL}/api/v1/categories`,
  GET_CATEGORY: (id) => `${BASE_URL}/api/v1/categories/${id}`,
  GET_PRODUCTS: `${BASE_URL}/api/v1/products`,
  GET_PRODUCT: (id) => `${BASE_URL}/api/v1/products/${id}`,
};
