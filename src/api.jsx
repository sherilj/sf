import { API_ENDPOINTS, BASE_URL } from "./apiConfig";

export const API_BASE_URL = BASE_URL;

const normalizeToken = (token) => (token || "").replace(/^(Bearer|Token|JWT)\s+/i, "").trim();
const authHeader = (token) => ({ "Authorization": `Bearer ${normalizeToken(token)}` });

const fetchJson = async (url, options = {}) => {
	const res = await fetch(url, options);
	const text = await res.text();
	let data = null;

	try {
		data = text ? JSON.parse(text) : null;
	} catch {
		data = text;
	}

	if (!res.ok) {
		const error = new Error((data && data.message) || text || `HTTP ${res.status}`);
		error.response = { data, status: res.status };
		throw error;
	}

	return { data, status: res.status, headers: res.headers };
};

// Fetches profile details for the logged-in user.
export const getUserProfile = (token) => fetch(API_ENDPOINTS.GET_USER_PROFILE, {
	headers: authHeader(token),
});

// Fetches user account details (like user_id) for the logged-in user.
export const getUserInfo = (token) => fetch(API_ENDPOINTS.GET_USER_INFO, {
	headers: authHeader(token),
});

// Fetches all saved addresses for the logged-in user.
export const getAddresses = (token) => fetch(API_ENDPOINTS.GET_ADDRESSES, {
	headers: authHeader(token),
});

// Updates profile details for the logged-in user.
export const updateUserProfile = (token, payload) => fetch(API_ENDPOINTS.GET_USER_PROFILE, {
	method: "PUT",
	headers: { "Content-Type": "application/json", ...authHeader(token) },
	body: JSON.stringify(payload),
});

// Creates a new address for the logged-in user.
export const createAddress = (token, payload) => fetch(API_ENDPOINTS.CREATE_ADDRESS, {
	method: "POST",
	headers: { "Content-Type": "application/json", ...authHeader(token) },
	body: JSON.stringify(payload),
});

// Updates an existing address for the logged-in user.
export const editAddress = (token, addressId, payload) => fetch(API_ENDPOINTS.UPDATE_ADDRESS(addressId), {
	method: "PUT",
	headers: { "Content-Type": "application/json", ...authHeader(token) },
	body: JSON.stringify(payload),
});

// Deletes an address for the logged-in user.
export const removeAddress = (token, addressId) => fetch(API_ENDPOINTS.DELETE_ADDRESS(addressId), {
	method: "DELETE",
	headers: authHeader(token),
});

// Fetches the current cart for the logged-in user.
export const getCart = (token) => fetchJson(API_ENDPOINTS.GET_CART, {
	headers: authHeader(token),
});

// Adds an item to cart using variant id and quantity.
export const addCartItem = (token, payload) => {
	const normalizedPayload = {
		// Try camelCase first (what backend likely expects)
		variantId: payload.variantId || payload.variant_id,
		quantity: payload.quantity || 1,
		// Also include snake_case as fallback
		variant_id: payload.variantId || payload.variant_id,
	};
	
	console.log("🔧 Normalized cart payload to send:", normalizedPayload);
	
	return fetchJson(API_ENDPOINTS.ADD_CART_ITEM, {
		method: "POST",
		headers: { 
			"Content-Type": "application/json",
			...authHeader(token) 
		},
		body: JSON.stringify(normalizedPayload),
	});
};

// Increases cart item quantity for a specific variant.
export const incrementCartItem = (token, variantId) => fetchJson(API_ENDPOINTS.INCREMENT_CART_ITEM(variantId), {
	method: "POST",
	headers: authHeader(token),
});

// Decreases cart item quantity for a specific variant.
export const decrementCartItem = (token, variantId) => fetchJson(API_ENDPOINTS.DECREMENT_CART_ITEM(variantId), {
	method: "POST",
	headers: authHeader(token),
});

// Removes a specific item from the cart using variant id.
export const removeCartItem = (token, variantId) => fetchJson(API_ENDPOINTS.REMOVE_CART_ITEM(variantId), {
	method: "DELETE",
	headers: authHeader(token),
});

// Clears all items from the cart.
export const clearCart = (token) => fetchJson(API_ENDPOINTS.CLEAR_CART, {
	method: "DELETE",
	headers: authHeader(token),
});

// Sends OTP to a mobile number during auth.
export const sendOtp = (payload) => fetchJson(API_ENDPOINTS.SEND_OTP, {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify(payload),
});

// Verifies OTP and returns auth/user response.
export const verifyOtp = (payload) => fetchJson(API_ENDPOINTS.VERIFY_OTP, {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify(payload),
});

// Creates an order using checkout flow.
export const createCheckout = (token, payload) => fetchJson(API_ENDPOINTS.CREATE_CHECKOUT, {
	method: "POST",
	headers: { "Content-Type": "application/json", ...(token ? authHeader(token) : {}) },
	body: JSON.stringify(payload),
});

// Fetches available coupons.
export const getCoupons = (token) => fetchJson(API_ENDPOINTS.GET_COUPONS, {
	headers: token ? authHeader(token) : undefined,
});

// Verifies coupon code and returns coupon applicability/discount details.
export const verifyCoupon = (token, payload) => fetchJson(API_ENDPOINTS.VERIFY_COUPON, {
	method: "POST",
	headers: { "Content-Type": "application/json", ...(token ? authHeader(token) : {}) },
	body: JSON.stringify(payload),
});

// Fetches all orders for the logged-in user.
export const getOrders = (token) => fetchJson(API_ENDPOINTS.GET_ORDERS, {
	headers: authHeader(token),
});

// Fetches a single order by id for the logged-in user.
export const getOrderDetails = (token, id) => fetchJson(API_ENDPOINTS.GET_ORDER_DETAILS(id), {
	headers: authHeader(token),
});

// Fetches all categories.
export const getCategories = () => fetchJson(API_ENDPOINTS.GET_CATEGORIES);

// Fetches a specific category.
export const getCategory = (id) => fetchJson(API_ENDPOINTS.GET_CATEGORY(id));

// Fetches all products.
export const getProducts = () => fetchJson(API_ENDPOINTS.GET_PRODUCTS);

// Fetches a specific product.
export const getProduct = (id) => fetchJson(API_ENDPOINTS.GET_PRODUCT(id));
