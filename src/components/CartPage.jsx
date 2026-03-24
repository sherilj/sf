import React, { useEffect, useState } from "react";
import { ShoppingBag, Plus, Minus, X, ArrowRight, Truck, ShieldCheck, Tag, Check } from "lucide-react";
import { getCoupons, verifyCoupon } from "../api";

const FREE_SHIPPING_THRESHOLD = 999;

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const normalizeCoupon = (coupon) => {
  const code = String(
    coupon?.code || coupon?.couponCode || coupon?.coupon_code || coupon?.name || ""
  ).trim();
  if (!code) return null;

  const typeRaw = String(coupon?.discountType || coupon?.type || "fixed").toLowerCase();
  const type = typeRaw.includes("percent") ? "percentage" : "fixed";

  return {
    code,
    description: coupon?.description || coupon?.title || "Discount coupon",
    type,
    discount: toNumber(coupon?.discount ?? coupon?.discountValue ?? coupon?.discountAmount ?? coupon?.value),
    minOrderAmount: toNumber(coupon?.minOrderAmount ?? coupon?.minimumOrderAmount ?? coupon?.minimumPurchase ?? coupon?.minCartValue),
  };
};

const extractCoupons = (responseData) => {
  const raw = Array.isArray(responseData)
    ? responseData
    : (Array.isArray(responseData?.data) ? responseData.data : (Array.isArray(responseData?.coupons) ? responseData.coupons : []));

  return raw.map(normalizeCoupon).filter(Boolean);
};

const getDiscountFromCoupon = (coupon, subtotal) => {
  if (!coupon) return 0;

  const directDiscount = toNumber(coupon.discountAmount);
  if (directDiscount > 0) return Math.min(directDiscount, subtotal);

  if (coupon.type === "percentage") {
    return Math.min((subtotal * toNumber(coupon.discount)) / 100, subtotal);
  }
  return Math.min(toNumber(coupon.discount), subtotal);
};

const CartPage = ({ cart, apiToken, onUpdateQuantity, onRemove, onContinueShopping, appliedCoupon, onApplyCoupon = () => { }, onProceedToCheckout = () => { }, onShowToast }) => {
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const subtotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const shippingFree = subtotal >= FREE_SHIPPING_THRESHOLD;
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  useEffect(() => {
    let cancelled = false;

    const loadCoupons = async () => {
      setIsLoadingCoupons(true);
      try {
        const res = await getCoupons(apiToken);
        if (!cancelled) {
          setAvailableCoupons(extractCoupons(res?.data));
        }
      } catch (error) {
        if (!cancelled) {
          setAvailableCoupons([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingCoupons(false);
        }
      }
    };

    loadCoupons();
    return () => {
      cancelled = true;
    };
  }, [apiToken]);

  const handleApplyCoupon = async () => {
    setCouponError("");
    const normalizedCode = couponCode.trim().toUpperCase();
    if (!normalizedCode) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const verifyRes = await verifyCoupon(apiToken, {
        code: normalizedCode,
        couponCode: normalizedCode,
        subtotal,
        cartTotal: subtotal,
        orderAmount: subtotal,
      });

      const payload = verifyRes?.data || {};
      const details = payload?.data || payload;
      const valid = details?.valid ?? details?.isValid ?? payload?.valid ?? payload?.isValid ?? payload?.success ?? true;

      if (!valid) {
        setCouponError(details?.message || payload?.message || "Coupon is not valid for this order");
        onApplyCoupon(null);
        return;
      }

      const sourceCoupon = normalizeCoupon(details?.coupon || details) || normalizeCoupon({ code: normalizedCode, type: "fixed", discount: 0 });
      const verifiedCoupon = {
        ...sourceCoupon,
        code: sourceCoupon.code || normalizedCode,
        discountAmount: toNumber(details?.discountAmount ?? details?.discount_amount),
      };

      onApplyCoupon(verifiedCoupon);
      setCouponError("");
    } catch (error) {
      onApplyCoupon(null);
      setCouponError(error?.response?.data?.message || error?.message || "Failed to verify coupon");
      return;
    } finally {
      setIsApplyingCoupon(false);
    }

    setCouponCode("");
  };

  const handleRemoveCoupon = () => {
    onApplyCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const getDiscount = () => {
    return getDiscountFromCoupon(appliedCoupon, subtotal);
  };

  const discount = getDiscount();
  const finalSubtotal = subtotal - discount;
  const shipping = shippingFree ? 0 : 99;

  if (cart.length === 0) {
    return (
      <div className="cart-page-wrapper">
        <div className="cart-page-inner">
          <button className="cp-continue-link" onClick={onContinueShopping}>
            ← CONTINUE SHOPPING
          </button>
          <h1 className="cp-title">Your Cart</h1>
          <div className="cp-empty-card">
            <div className="cp-empty-icon">
              <ShoppingBag size={40} strokeWidth={1.2} />
            </div>
            <h2>Your cart feels a bit light</h2>
            <p>Fill it with nature's goodness. Our honey, ghee, and healthy snacks are waiting for you.</p>
            <button className="cp-start-btn" onClick={onContinueShopping}>
              START SHOPPING
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper">
      <div className="cart-page-inner">
        <button className="cp-continue-link" onClick={onContinueShopping}>
          ← CONTINUE SHOPPING
        </button>
        <h1 className="cp-title">Your Cart</h1>

        <div className="cp-layout">
          {/* Left column - items */}
          <div className="cp-left">
            {/* Free shipping banner */}
            <div className="cp-shipping-banner">
              {shippingFree ? (
                <p className="cp-ship-text cp-ship-unlocked">You've unlocked free shipping!</p>
              ) : (
                <p className="cp-ship-text">
                  Add <strong>₹{remaining}</strong> more to unlock <strong>Free Shipping</strong>
                </p>
              )}
              <div className="cp-progress-bar">
                <div className="cp-progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Cart items */}
            <div className="cp-items-list">
              {cart.map((item) => {
                const itemPrice = toNumber(item.price);
                const providedMrp = toNumber(item.mrp ?? item.originalPrice ?? item.compareAtPrice);
                const fallbackMrp = Math.round(itemPrice * 1.2);
                const itemMrp = providedMrp > 0 ? providedMrp : fallbackMrp;
                const showStrikedPrice = itemMrp > itemPrice;
                const isOutOfStock = item.availabilityStatus === "OUT_OF_STOCK";

                return (
                <div key={item.cartItemId} className={`cp-item ${isOutOfStock ? 'oos-item' : ''}`}>
                  <div className="cp-item-img">
                    <img src={item.img} alt={item.name} />
                  </div>
                  <div className="cp-item-details">
                    <h3 className="cp-item-name">{item.name}</h3>
                    <div className="cp-item-meta">
                      <span className="cp-item-badge">{item.category?.toUpperCase()}</span>
                      {item.selectedVariant && (
                        <span className="cp-item-variant">Quantity: {item.selectedVariant}</span>
                      )}
                    </div>
                    {isOutOfStock ? (
                      <p className="cp-item-oos-message">Sorry, this item is currently out of stock.</p>
                    ) : (
                      <div className="cp-item-price-row">
                        <p className="cp-item-price">₹{item.price}</p>
                        {showStrikedPrice && <p className="cp-item-mrp">₹{Math.round(itemMrp)}</p>}
                      </div>
                    )}
                  </div>
                  <div className="cp-item-right">
                    <button className="cp-remove-btn" onClick={() => onRemove(item.cartItemId)}>
                      <X size={13} /> REMOVE
                    </button>
                    {!isOutOfStock && (
                      <div className="cp-qty-row">
                        <button
                          className="cp-qty-btn"
                          onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="cp-qty-val">{item.quantity}</span>
                        <button
                          className="cp-qty-btn"
                          onClick={() => {
                            const maxStock = (item.stockQuantity > 0) ? item.stockQuantity : 999;
                            if (item.quantity >= maxStock) {
                              if (onShowToast) onShowToast(`Can't increase quantity — only ${maxStock} units available for this product.`, "error");
                              return;
                            }
                            onUpdateQuantity(item.cartItemId, item.quantity + 1);
                          }}
                          disabled={item.stockQuantity > 0 && item.quantity >= item.stockQuantity}
                          style={item.stockQuantity > 0 && item.quantity >= item.stockQuantity ? { opacity: 0.35, cursor: 'not-allowed' } : {}}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                );
              })}
            </div>

            <button className="cp-add-more-btn" onClick={onContinueShopping}>
              + Add more items
            </button>
          </div>

          {/* Right column - order summary */}
          <div className="cp-right">
            {/* Apply Coupons */}
            <div className="cp-coupons-section">
              <h3 className="cp-coupons-title"><Tag size={18} /> Apply Coupons</h3>

              <div className="cp-coupon-input-group">
                <input
                  type="text"
                  placeholder="Enter Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleApplyCoupon()}
                  className="cp-coupon-input"
                />
                <button
                  className="cp-coupon-apply-btn"
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon}
                >
                  {isApplyingCoupon ? "APPLYING..." : "APPLY"}
                </button>
              </div>
              {couponError && <p className="cp-coupon-error">{couponError}</p>}
              {appliedCoupon && (
                <div className="cp-coupon-applied-msg">
                  <p>✓ {appliedCoupon.code} applied successfully!</p>
                  <button
                    className="cp-coupon-remove"
                    onClick={handleRemoveCoupon}
                  >
                    Remove
                  </button>
                </div>
              )}

              <h4 className="cp-coupon-subtitle">Available Coupons</h4>
              <div className="cp-coupons-list">
                {isLoadingCoupons && <p className="cp-coupon-helper">Loading coupons...</p>}
                {!isLoadingCoupons && availableCoupons.length === 0 && <p className="cp-coupon-helper">No coupons available right now</p>}
                {!isLoadingCoupons && availableCoupons.map((coupon) => (
                  <div 
                    key={coupon.code} 
                    className={`cp-coupon-card ${appliedCoupon?.code === coupon.code ? "cp-coupon-applied" : ""}`}
                    onClick={() => {
                      setCouponCode(coupon.code);
                      setCouponError("");
                    }}
                  >
                    <div className="cp-coupon-content">
                      <p className="cp-coupon-code">{coupon.code}</p>
                      <p className="cp-coupon-desc">{coupon.description}</p>
                    </div>
                    {appliedCoupon?.code === coupon.code && <Check size={20} className="cp-coupon-check" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="cp-summary-card">
              <h2 className="cp-summary-title">Order Summary</h2>
              <div className="cp-summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {appliedCoupon && (
                <div className="cp-summary-row cp-discount-row">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span className="cp-discount-amount">-₹{discount.toFixed(0)}</span>
                </div>
              )}
              <div className="cp-summary-row">
                <span>Shipping Estimate</span>
                <span className={shippingFree ? "cp-free" : ""}>
                  {shippingFree ? "Free" : "₹99"}
                </span>
              </div>
              <div className="cp-summary-row">
                <span>Tax Estimate</span>
                <span>Included</span>
              </div>
              <div className="cp-summary-divider" />
              <div className="cp-summary-total">
                <span>Order Total</span>
                <span>₹{(finalSubtotal + shipping).toFixed(0)}</span>
              </div>
              {cart.some(item => item.availabilityStatus === "OUT_OF_STOCK") && (
                <p className="cp-oos-overall-warning" style={{ color: '#7C3225', fontSize: '13px', marginBottom: '10px', textAlign: 'center', fontWeight: '500' }}>
                  Please remove out of stock items to proceed.
                </p>
              )}
              <button 
                className={`cp-checkout-btn ${cart.some(item => item.availabilityStatus === "OUT_OF_STOCK") ? 'disabled' : ''}`} 
                onClick={onProceedToCheckout}
                disabled={cart.some(item => item.availabilityStatus === "OUT_OF_STOCK")}
                style={cart.some(item => item.availabilityStatus === "OUT_OF_STOCK") ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
              >
                PROCEED TO CHECKOUT <ArrowRight size={16} />
              </button>
              <div className="cp-trust-badges">
                <span className="cp-badge"><Truck size={16} /> FAST DELIVERY</span>
                <span className="cp-badge"><ShieldCheck size={16} /> SECURE CHECKOUT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
