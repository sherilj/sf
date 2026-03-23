import React from "react";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import ProgressStepper from "./ProgressStepper";

const FALLBACK_ITEMS = [
  {
    id: "honey",
    name: "Wild Forest Honey",
    category: "Honey",
    price: 450,
    quantity: 1,
    img: "/wild_honey.png",
  },
  {
    id: "chikki",
    name: "Peanut Chikki Bar",
    category: "Chikki",
    price: 300,
    quantity: 1,
    img: "/chikki_pic.png",
  },
];

const DELIVERY_OPTIONS = [
  {
    id: "standard",
    title: "Standard Delivery",
    description: "Expected by Sun Feb 22 2026",
    priceLabel: "Free",
    badge: null,
  },
  {
    id: "express",
    title: "Express Delivery",
    description: "Expected by Thu Feb 19 2026",
    priceLabel: "₹150",
    badge: "FAST",
  },
];

const formatCurrency = (value) => `₹${value.toLocaleString("en-IN")}`;

const getDiscountFromCoupon = (coupon, subtotal) => {
  if (!coupon) return 0;
  const toNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };
  const directDiscount = toNumber(coupon.discountAmount);
  if (directDiscount > 0) return Math.min(directDiscount, subtotal);

  if (coupon.type === "percentage") {
    return Math.min((subtotal * toNumber(coupon.discount)) / 100, subtotal);
  }
  return Math.min(toNumber(coupon.discount), subtotal);
};

const Delivery = ({
  cart = [],
  details,
  address,
  selectedMethod = "standard",
  appliedCoupon = null,
  onSelectMethod = () => { },
  onBack = () => { },
  onContinue = () => { },
}) => {
  const items = cart.length ? cart : FALLBACK_ITEMS;
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const discount = getDiscountFromCoupon(appliedCoupon, subtotal);
  const shippingCost = selectedMethod === "express" ? 150 : 0;
  const total = subtotal - discount + shippingCost;
  const contactSummary = details?.email || "you@example.com";
  const shippingSummary = address
    ? `${address.building_no}, ${address.building_name}, ${address.street_no}, ${address.area_name}, ${address.city}, ${address.state} - ${address.pincode}`
    : (details?.address ? `${details.address}, ${details.city}, ${details.state} ${details.pincode}` : "#13, 11th Cross, Prakruti Township");

  return (
    <section className="bg-[#FEF8F0] min-h-[calc(100vh-120px)] px-4 py-10 font-['Poppins',sans-serif]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <ProgressStepper currentStep={2} backLabel="← BACK" onBack={onBack} />

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-[32px] border border-[#EBEBEB] bg-[#FFFFFF] p-8 shadow-[0_30px_75px_rgba(124,50,37,0.12)]">
            <div className="flex items-center gap-3 text-[#7C3225]">
              <Truck size={24} strokeWidth={1.5} />
              <div>
                <h2 className="text-2xl font-semibold text-[#7C3225] font-['Poppins',sans-serif]">
                  Delivery Method
                </h2>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-[#EBEBEB] bg-[#FEF8F0] px-6 py-4 text-sm text-[#7C3225]">
              {[
                { label: "Contact", value: contactSummary },
                { label: "Ship to", value: shippingSummary },
              ].map((row) => (
                <div key={row.label} className="flex flex-wrap items-center gap-3 py-2">
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-[#7C3225]">{row.label}:</span>
                    <span className="ml-2 block truncate text-[#7C3225]">{row.value}</span>
                  </div>
                  <button
                    type="button"
                    onClick={onBack}
                    className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#1AA60B]"
                  >
                    Change
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-4">
              {DELIVERY_OPTIONS.map((option) => {
                const isSelected = option.id === selectedMethod;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => onSelectMethod(option.id)}
                    className={`flex w-full items-center gap-4 rounded-2xl border bg-[#FEF8F0] px-5 py-4 text-left transition-all duration-200 ${isSelected
                      ? "border-[#1AA60B] bg-[#E7F5E5] shadow-[0_18px_32px_rgba(26,166,11,0.15)]"
                      : "border-[#EBEBEB] hover:border-[#1AA60B]"
                      }`}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${isSelected
                        ? "border-[#1AA60B] bg-[#1AA60B]"
                        : "border-[#EBEBEB] bg-[#FFFFFF]"
                        }`}
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-white" />
                    </span>
                    <div className="flex flex-1 flex-col">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-[#7C3225]">{option.title}</p>
                        {option.badge && (
                          <span className="rounded-full bg-[#7C3225] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                            {option.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#868889]">{option.description}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#7C3225]">{option.priceLabel}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-2 text-sm font-semibold text-[#7C3225]"
              >
                <span aria-hidden="true">&larr;</span> Back
              </button>
              <button
                type="button"
                onClick={() => onContinue(selectedMethod)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#7C3225] px-10 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_18px_30px_rgba(124,50,37,0.25)] lg:w-auto"
              >
                Continue to Payment <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <aside className="sticky top-8 h-fit rounded-[28px] border border-[#EBEBEB] bg-[#FFFFFF] p-6 shadow-[0_25px_60px_rgba(124,50,37,0.1)]">
            <h3 className="text-xl font-semibold text-[#7C3225] font-['Poppins',sans-serif]">Order Summary</h3>

            <div className="mt-4 flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-[#FEF8F0] bg-[#FEF8F0]">
                    <img src={item.img} alt={item.name} className="h-full w-full object-cover" />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#7C3225] text-[10px] font-semibold text-white">
                      {item.quantity || 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#7C3225]">{item.name}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#868889]">
                      {(item.category || "").toString()}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-[#7C3225]">
                    {formatCurrency(item.price * (item.quantity || 1))}
                  </p>
                </div>
              ))}
            </div>

            <div className="my-5 h-px bg-[#FEF8F0]" />

            <div className="flex flex-col gap-1 text-sm text-[#7C3225]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between" style={{ color: '#2E7D32' }}>
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-[#1AA60B]">
                  {shippingCost === 0 ? "Free" : formatCurrency(shippingCost)}
                </span>
              </div>
            </div>

            <div className="my-4 h-px bg-[#FEF8F0]" />

            <div className="flex items-center justify-between text-lg font-semibold text-[#7C3225]">
              <span>Total</span>
              <span className="text-[#7C3225]">{formatCurrency(total)}</span>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[#E7F5E5] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1AA60B]">
              <ShieldCheck size={16} /> Secure SSL Encryption
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Delivery;
