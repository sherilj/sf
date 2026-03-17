import React, { useState } from "react";
import { MessageSquare, Headset, ChevronRight, HelpCircle, Package, Send, CheckCircle2 } from "lucide-react";

const SupportCenter = ({ orders, products = [], onContinueShopping, initialOrder }) => {
    const [selectedType, setSelectedType] = useState(initialOrder ? 'order' : null);
    const [selectedItem, setSelectedItem] = useState(initialOrder || null);
    const [message, setMessage] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here we would typically send the ticket to a backend
        console.log("Support Ticket Submitted:", {
            type: selectedType,
            itemId: selectedItem?.id || selectedItem?.cartItemId,
            message: message
        });
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="support-success fade-in" style={{ padding: '80px 20px', textAlign: 'center', minHeight: '60vh' }}>
                <div style={{ background: '#F4F9F4', padding: '30px', borderRadius: '50%', display: 'inline-block', marginBottom: '24px' }}>
                    <CheckCircle2 size={64} color="#2E7D32" />
                </div>
                <h2 style={{ color: '#7C3225', fontSize: '2.5rem', marginBottom: '16px' }}>Request Received</h2>
                <p style={{ color: '#868889', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
                    Our support team has received your query regarding <strong>{selectedItem?.name || "your request"}</strong>.
                    We'll get back to you via email within 24 hours.
                </p>
                <button className="btn-product" onClick={onContinueShopping}>Back to Shopping</button>
            </div>
        );
    }

    return (
        <div className="support-center fade-in" style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1 style={{ color: '#7C3225', fontSize: '2.8rem', fontWeight: '800', marginBottom: '15px' }}>Help & Support</h1>
                <p style={{ color: '#868889', fontSize: '1.1rem' }}>How can we assist you today?</p>
            </div>

            {!selectedType ? (
                <div className="support-options" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                    <div className="support-card" onClick={() => setSelectedType('order')} style={cardStyle}>
                        <Package size={32} color="#7C3225" style={{ marginBottom: '15px' }} />
                        <h3>Order Related</h3>
                        <p>Issues with delivery, missing items, or status updates.</p>
                        <ChevronRight size={20} className="arrow" />
                    </div>
                    <div className="support-card" onClick={() => setSelectedType('product')} style={cardStyle}>
                        <HelpCircle size={32} color="#7C3225" style={{ marginBottom: '15px' }} />
                        <h3>Product Inquiry</h3>
                        <p>Questions about ingredients, usage, or shelf life.</p>
                        <ChevronRight size={20} className="arrow" />
                    </div>
                    <div className="support-card" onClick={() => setSelectedType('general')} style={cardStyle}>
                        <MessageSquare size={32} color="#7C3225" style={{ marginBottom: '15px' }} />
                        <h3>General Support</h3>
                        <p>Feedback, account issues, or other questions.</p>
                        <ChevronRight size={20} className="arrow" />
                    </div>
                </div>
            ) : (
                <div className="support-form-container fade-in">
                    <button
                        onClick={() => { setSelectedType(null); setSelectedItem(null); }}
                        style={{ color: '#7C3225', border: 'none', background: 'none', cursor: 'pointer', marginBottom: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                        &larr; Back to Options
                    </button>

                    <div style={{ background: '#FFF', borderRadius: '20px', padding: '35px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid #F0F0F0' }}>
                        <h2 style={{ color: '#7C3225', marginBottom: '25px' }}>
                            {selectedType === 'order' ? 'Select an Order' : selectedType === 'product' ? 'Select a Product' : 'Describe your issue'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            {selectedType === 'order' && (
                                <div className="item-selector" style={{ marginBottom: '25px' }}>
                                    {orders.length > 0 ? (
                                        <select
                                            required
                                            style={selectStyle}
                                            value={selectedItem?.id || ""}
                                            onChange={(e) => setSelectedItem(orders.find(o => o.id === e.target.value))}
                                        >
                                            <option value="">Choose an Order</option>
                                            {orders.map(o => (
                                                <option key={o.id} value={o.id}>Order {o.id} - {o.date} (₹{o.total})</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <p style={{ color: '#868889', fontStyle: 'italic' }}>No orders found. Please select 'Product Inquiry' if you have questions about our range.</p>
                                    )}
                                </div>
                            )}

                            {selectedType === 'product' && (
                                <div className="item-selector" style={{ marginBottom: '25px' }}>
                                    <select
                                        required
                                        style={selectStyle}
                                        onChange={(e) => setSelectedItem(products.find(p => p.id === parseInt(e.target.value)))}
                                    >
                                        <option value="">Select Product</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="message-area" style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#4A4A4A' }}>How can we help?</label>
                                <textarea
                                    required
                                    placeholder="Please provide as much detail as possible..."
                                    style={textareaStyle}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                ></textarea>
                            </div>

                            <button type="submit" className="btn-product" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '10px', padding: '12px' }}>
                                <Send size={20} /> Submit Request
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const cardStyle = {
    background: '#FFF',
    padding: '30px',
    borderRadius: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
    border: '1px solid #F0F0F0',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.3s ease'
};

const selectStyle = {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '10px',
    border: '1px solid #EBEBEB',
    fontSize: '1rem',
    color: '#4A4A4A',
    outline: 'none',
    background: '#FDFCFB'
};

const textareaStyle = {
    width: '100%',
    minHeight: '150px',
    padding: '15px',
    borderRadius: '12px',
    border: '1px solid #EBEBEB',
    fontSize: '1rem',
    color: '#4A4A4A',
    outline: 'none',
    resize: 'vertical',
    background: '#FDFCFB'
};

export default SupportCenter;
