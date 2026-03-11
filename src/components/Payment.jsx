import React, { useState } from "react";
import { ArrowRight, ShieldCheck, CreditCard, CalendarDays } from "lucide-react";
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

const DELIVERY_OPTIONS_MAP = {
    standard: "Standard Delivery",
    express: "Express Delivery",
};

const formatCurrency = (value) => `₹${value.toLocaleString("en-IN")}`;

const Payment = ({
    cart = [],
    details,
    selectedMethod = "standard",
    address,
    onBack = () => { },
    onPlaceOrder = () => { },
}) => {
    const [selectedPayment, setSelectedPayment] = useState("card");

    const items = cart.length ? cart : FALLBACK_ITEMS;
    const subtotal = items.reduce(
        (sum, item) => sum + item.price * (item.quantity || 1),
        0
    );
    const shippingCost = selectedMethod === "express" ? 150 : 0;
    const total = subtotal + shippingCost;
    const contactSummary = details?.email || "you@example.com";
    const shippingAddress = address
        ? `${address.building_no}, ${address.building_name}, ${address.street_no}, ${address.area_name}, ${address.city}, ${address.state} - ${address.pincode}`
        : (details?.address ? `${details.address}, ${details.city}, ${details.state} ${details.pincode}` : "#13, 11th Cross, Prakruti Township");

    const getMethodLabel = (id) => DELIVERY_OPTIONS_MAP[id] || "Standard Delivery";

    return (
        <section className="bg-[#FEF8F0] min-h-[calc(100vh-120px)] px-4 py-10 font-['Poppins',sans-serif]">
            <div className="mx-auto flex max-w-6xl flex-col gap-6">
                <ProgressStepper currentStep={3} backLabel="← BACK" onBack={onBack} />

                <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                    <div className="rounded-[32px] border border-[#EBEBEB] bg-[#FFFFFF] p-8 shadow-[0_30px_75px_rgba(124,50,37,0.12)]">
                        <div className="flex items-center gap-3 text-[#7C3225]">
                            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FEF8F0]">
                                <CreditCard size={20} strokeWidth={1.5} />
                            </span>
                            <div>
                                <h2 className="text-2xl font-semibold text-[#7C3225] font-['Poppins',sans-serif]">
                                    Payment Method
                                </h2>
                            </div>
                        </div>

                        <div className="mt-5 rounded-2xl border border-[#EBEBEB] bg-[#FEF8F0] px-6 py-4 text-sm text-[#7C3225]">
                            {[
                                { label: "Contact", value: contactSummary },
                                { label: "Ship to", value: shippingAddress },
                                { label: "Method", value: getMethodLabel(selectedMethod) },
                            ].map((row, idx) => (
                                <React.Fragment key={row.label}>
                                    {idx > 0 && <div className="h-px bg-[#FEF8F0] my-3"></div>}
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex-1 min-w-0">
                                            <span className="font-semibold text-[#7C3225]">{row.label}:</span>
                                            <span className="ml-[6px] truncate text-[#7C3225]">{row.value}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={onBack}
                                            className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#1AA60B]"
                                        >
                                            Change
                                        </button>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>

                        <div className="mt-8">
                            <h3 className="text-sm font-semibold text-[#7C3225] mb-4 uppercase tracking-[0.1em]">
                                Select Payment Method
                            </h3>

                            <div className="flex flex-col gap-4">
                                {/* Credit / Debit Card Option */}
                                <div
                                    onClick={() => setSelectedPayment("card")}
                                    className={`rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer ${selectedPayment === "card"
                                        ? "border-[#1AA60B] shadow-[0_12px_24px_rgba(26,166,11,0.12)]"
                                        : "border-[#EBEBEB]"
                                        }`}
                                >
                                    <div
                                        className={`flex w-full items-center gap-4 px-5 py-4 text-left ${selectedPayment === "card" ? "bg-[#E7F5E5]" : "bg-[#FEF8F0] hover:bg-[#E7F5E5]"
                                            }`}
                                    >
                                        <span
                                            className={`flex h-5 w-5 items-center justify-center rounded-full border ${selectedPayment === "card"
                                                ? "border-[#1AA60B] bg-[#1AA60B]"
                                                : "border-[#EBEBEB] bg-[#FFFFFF]"
                                                }`}
                                        >
                                            {selectedPayment === "card" && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
                                        </span>
                                        <span className="font-semibold text-[#7C3225]">Credit / Debit Card</span>
                                        <div className="ml-auto flex gap-2 opacity-60">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-5" />
                                        </div>
                                    </div>

                                    {selectedPayment === "card" && (
                                        <div className="border-t border-[#1AA60B]/20 bg-[#E7F5E5] px-6 pb-6 pt-4">
                                            <div className="grid gap-4">
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="Card Number"
                                                        className="w-full rounded-xl border border-[#E7F5E5] bg-white px-4 py-3 pl-11 text-sm text-[#7C3225] placeholder-[#868889] focus:border-[#1AA60B] focus:outline-none focus:ring-1 focus:ring-[#1AA60B]"
                                                    />
                                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-[#868889]" size={18} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="MM / YY"
                                                            className="w-full rounded-xl border border-[#E7F5E5] bg-white px-4 py-3 pl-11 text-sm text-[#7C3225] placeholder-[#868889] focus:border-[#1AA60B] focus:outline-none focus:ring-1 focus:ring-[#1AA60B]"
                                                        />
                                                        <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-[#868889]" size={18} />
                                                    </div>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="CVC"
                                                            className="w-full rounded-xl border border-[#E7F5E5] bg-white px-4 py-3 pl-11 text-sm text-[#7C3225] placeholder-[#868889] focus:border-[#1AA60B] focus:outline-none focus:ring-1 focus:ring-[#1AA60B]"
                                                        />
                                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-[#868889]" size={18} />
                                                    </div>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Cardholder Name"
                                                    className="w-full rounded-xl border border-[#E7F5E5] bg-white px-4 py-3 text-sm text-[#7C3225] placeholder-[#868889] focus:border-[#1AA60B] focus:outline-none focus:ring-1 focus:ring-[#1AA60B]"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* UPI Option */}
                                <div
                                    onClick={() => setSelectedPayment("upi")}
                                    className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-200 cursor-pointer ${selectedPayment === "upi"
                                        ? "border-[#1AA60B] bg-[#E7F5E5] shadow-[0_12px_24px_rgba(26,166,11,0.12)]"
                                        : "border-[#EBEBEB] bg-[#FEF8F0] hover:border-[#1AA60B]"
                                        }`}
                                >
                                    <span
                                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${selectedPayment === "upi"
                                            ? "border-[#1AA60B] bg-[#1AA60B]"
                                            : "border-[#EBEBEB] bg-[#FFFFFF]"
                                            }`}
                                    >
                                        {selectedPayment === "upi" && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
                                    </span>
                                    <span className="font-semibold text-[#7C3225]">UPI / Netbanking</span>
                                </div>

                                {/* COD Option */}
                                <div
                                    onClick={() => setSelectedPayment("cod")}
                                    className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-200 cursor-pointer ${selectedPayment === "cod"
                                        ? "border-[#1AA60B] bg-[#E7F5E5] shadow-[0_12px_24px_rgba(26,166,11,0.12)]"
                                        : "border-[#EBEBEB] bg-[#FEF8F0] hover:border-[#1AA60B]"
                                        }`}
                                >
                                    <span
                                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${selectedPayment === "cod"
                                            ? "border-[#1AA60B] bg-[#1AA60B]"
                                            : "border-[#EBEBEB] bg-[#FFFFFF]"
                                            }`}
                                    >
                                        {selectedPayment === "cod" && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
                                    </span>
                                    <span className="font-semibold text-[#7C3225]">Cash on Delivery</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#EBEBEB] pt-6">
                            <button
                                type="button"
                                onClick={onBack}
                                className="flex items-center gap-2 text-sm font-semibold text-[#7C3225]"
                            >
                                <span aria-hidden="true">&larr;</span> Back
                            </button>
                            <button
                                type="button"
                                onClick={() => onPlaceOrder(selectedPayment)}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#7C3225] px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_18px_30px_rgba(124,50,37,0.25)] lg:w-auto transition-transform hover:-translate-y-0.5"
                            >
                                Pay & Place Order <ArrowRight size={18} />
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

export default Payment;
