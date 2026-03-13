// API endpoint configuration for easy maintenance
export const BASE_URL = "https://caroyln-nonoccupational-thoroughgoingly.ngrok-free.dev";

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
};
