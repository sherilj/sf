import React, { useState } from "react";
import { ShieldCheck, ArrowRight, Plus, MapPin, Home, Briefcase, Edit3, Trash2, CheckCircle } from "lucide-react";
import ProgressStepper from "./ProgressStepper";
import AddressForm from "./AddressForm";

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

const formatCurrency = (value) => `₹${value.toLocaleString("en-IN")}`;

const Checkout = ({
  cart = [],
  onBackToCart = () => { },
  onContinue = () => { },
  details = {},
  addresses = [],
  selectedAddressId = null,
  onSelectAddress = () => { },
  onAddAddress = () => { },
  onUpdateAddress = () => { },
  onDeleteAddress = () => { },
  onDetailsChange = () => { },
}) => {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const items = cart.length ? cart : FALLBACK_ITEMS;
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const shippingLabel = "Free";
  const total = subtotal;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedAddressId) {
      alert("Please select or add a shipping address.");
      return;
    }
    onContinue();
  };

  const handleEditClick = (e, address) => {
    e.stopPropagation();
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this address?")) {
      onDeleteAddress(id);
    }
  };

  const handleSaveAddress = (address) => {
    if (editingAddress) {
      onUpdateAddress(address);
    } else {
      onAddAddress(address);
    }
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  return (
    <section className="checkout-page">
      <div className="checkout-container">
        <ProgressStepper
          currentStep={1}
          backLabel="← BACK TO CART"
          onBack={onBackToCart}
          showBackLink
        />

        <div className="checkout-grid">
          <div className="checkout-card">
            <div>
              <h2>Contact Information</h2>
              <p>Stay in the loop with order status and delivery updates.</p>
            </div>

            <form className="checkout-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="checkout-input-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={details.email}
                    onChange={(e) => onDetailsChange("email", e.target.value)}
                    required
                  />
                </div>
                <div className="checkout-input-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={details.phone}
                    onChange={(e) => onDetailsChange("phone", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="checkout-input-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={details.firstName}
                    onChange={(e) => onDetailsChange("firstName", e.target.value)}
                    required
                  />
                </div>
                <div className="checkout-input-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={details.lastName}
                    onChange={(e) => onDetailsChange("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="address-section">
                <p className="checkout-subtitle">Shipping Address</p>
                <div className="address-grid">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`address-card-item ${selectedAddressId === addr.id ? 'selected' : ''}`}
                      onClick={() => onSelectAddress(addr.id)}
                    >
                      <div className="address-card-header">
                        <div className="address-type-badge">
                          {addr.type === 'Home' && <Home size={14} />}
                          {addr.type === 'Office' && <Briefcase size={14} />}
                          {addr.type === 'Other' && <MapPin size={14} />}
                          {addr.type}
                          {addr.is_default && <span className="address-default-tag">DEFAULT</span>}
                          {selectedAddressId === addr.id && <CheckCircle size={16} className="selected-icon" color="#1AA60B" fill="#E7F5E5" />}
                        </div>
                        <div className="address-actions">
                          <button
                            type="button"
                            className="address-action-btn"
                            onClick={(e) => handleEditClick(e, addr)}
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            className="address-action-btn"
                            onClick={(e) => handleDeleteClick(e, addr.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="address-content">
                        {addr.building_no}, {addr.building_name}<br />
                        {addr.street_no}, {addr.area_name}<br />
                        {addr.city}, {addr.state} - {addr.pincode}
                      </div>

                      {selectedAddressId === addr.id && (
                        <div className="deliver-here-badge">
                          DELIVER HERE
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-address-btn-card"
                    onClick={() => {
                      setEditingAddress(null);
                      setShowAddressForm(true);
                    }}
                  >
                    <Plus size={24} />
                    <span>Add New Address</span>
                  </button>
                </div>
              </div>

              <label className="save-info-row">
                <input type="checkbox" defaultChecked />
                Save this information for next time
              </label>

              <button className="checkout-submit" type="submit">
                CONTINUE TO DELIVERY <ArrowRight size={18} />
              </button>
            </form>
          </div>

          <aside className="checkout-card summary-card">
            <div className="summary-header">
              <div>
                <h2>Order Summary</h2>
                <p>An overview of the items in your bag.</p>
              </div>
            </div>

            <div className="summary-items">
              {items.map((item) => {
                const quantity = item.quantity || 1;
                return (
                  <div key={item.id} className="summary-item">
                    <div className="summary-thumb">
                      <img src={item.img || "/wild_honey.png"} alt={item.name} />
                    </div>
                    <div>
                      <p className="summary-name">{item.name}</p>
                      <p className="summary-meta">
                        {(item.category || "Artisanal").toUpperCase()}
                      </p>
                    </div>
                    <div className="summary-price">
                      <strong>
                        {formatCurrency(item.price * quantity)}
                      </strong>
                      {quantity > 1 && (
                        <span className="summary-qty">Qty {quantity}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="summary-divider" />

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shippingLabel}</span>
            </div>
            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <div className="ssl-badge">
              <ShieldCheck size={18} /> Secure SSL Encryption
            </div>
          </aside>
        </div>
      </div>

      {showAddressForm && (
        <AddressForm
          initialAddress={editingAddress || {}}
          onSave={handleSaveAddress}
          onCancel={() => setShowAddressForm(false)}
        />
      )}
    </section>
  );
};

export default Checkout;
