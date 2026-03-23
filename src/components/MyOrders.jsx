import React from "react";
import { Package, Truck, ShoppingBag, MapPin } from "lucide-react";

const MyOrders = ({ orders, user, onContinueShopping, onViewProduct, onTrackOrder, onContactSupport }) => {
    if (orders.length === 0) {
        return (
            <div className="empty-orders-container fade-in" style={{ padding: '80px 20px', textAlign: 'center', minHeight: '60vh' }}>
                <div className="empty-cart-icon" style={{ background: '#FEF8F0', padding: '30px', borderRadius: '50%', display: 'inline-block', marginBottom: '24px' }}>
                    <Package size={64} color="#7C3225" />
                </div>
                <h2 style={{ color: '#7C3225', fontSize: '2rem', marginBottom: '16px' }}>No orders yet</h2>
                <p style={{ color: '#868889', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
                    You haven't placed any orders yet. Start shopping to see your orders here!
                </p>
                <button
                    className="btn-product"
                    onClick={onContinueShopping}
                    style={{ minWidth: '200px' }}
                >
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="my-orders-page fade-in" style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
            <h1 style={{ color: '#7C3225', fontSize: '2.5rem', marginBottom: '10px', fontWeight: '700' }}>My Orders</h1>
            <p style={{ color: '#868889', marginBottom: '40px' }}>Track and manage your recent orders.</p>

            <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {orders.map((order) => {
                    // Use user name from order, fallback to logged-in user's name
                    const displayName = order.customerName && order.customerName !== 'Valued Member'
                        ? order.customerName
                        : (user?.name || 'Valued Member');

                    // Format payment method nicely
                    const displayPayment = order.paymentMethod && order.paymentMethod !== 'Not Specified'
                        ? order.paymentMethod
                        : 'Not Specified';

                    const hasItems = Array.isArray(order.items) && order.items.length > 0;

                    // Try to derive a human-friendly shipping address string
                    const shippingAddressObj = order.shippingAddress || order.deliveryAddress;
                    let shippingAddress =
                        order.address ||
                        order.deliveryAddress ||
                        order.location ||
                        (order.shippingAddress && (order.shippingAddress.addressLine || order.shippingAddress.fullAddress)) ||
                        "";

                    if (!shippingAddress && shippingAddressObj && typeof shippingAddressObj === 'object') {
                        const {
                            building_no,
                            buildingNo,
                            building_name,
                            buildingName,
                            street_no,
                            streetNo,
                            area_name,
                            areaName,
                            city,
                            state,
                            pincode,
                            pinCode,
                        } = shippingAddressObj;

                        const parts = [
                            building_no || buildingNo,
                            building_name || buildingName,
                            street_no || streetNo,
                            area_name || areaName,
                            city,
                            state,
                        ].filter(Boolean);

                        const pin = pincode || pinCode;
                        shippingAddress = parts.join(', ');
                        if (pin) shippingAddress = shippingAddress ? `${shippingAddress} - ${pin}` : String(pin);
                    }

                    return (
                        <div key={order.id} className="order-card" style={{
                            background: '#FFF',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            border: '1px solid #F0F0F0'
                        }}>
                            {/* Order Header */}
                            <div className="order-header" style={{
                                padding: '20px 24px',
                                background: '#FDFCFB',
                                borderBottom: '1px solid #F0F0F0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '15px'
                            }}>
                                <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                                    <div>
                                        <span style={{ fontSize: '0.75rem', color: '#868889', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Order Placed</span>
                                        <span style={{ fontWeight: '600', color: '#4A4A4A' }}>{order.date}</span>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '0.75rem', color: '#868889', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Total</span>
                                        <span style={{ fontWeight: '600', color: '#4A4A4A' }}>₹{order.total || order.finalAmount || order.totalAmount || '—'}</span>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '0.75rem', color: '#868889', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Customer</span>
                                        <span style={{ fontWeight: '600', color: '#4A4A4A' }}>{displayName}</span>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '0.75rem', color: '#868889', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Payment Method</span>
                                        <span style={{ fontWeight: '600', color: displayPayment !== 'Not Specified' ? '#1AA60B' : '#7C3225' }}>{displayPayment}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#868889', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Order ID</span>
                                    <span style={{ fontWeight: '700', color: '#7C3225' }}>{order.id}</span>
                                </div>
                            </div>

                            {/* Order Content */}
                            <div className="order-content" style={{ padding: '6px 24px 24px' }}>
                                {shippingAddress && (
                                    <div
                                        className="order-address"
                                        style={{
                                            display: 'flex',
                                            gap: '10px',
                                            alignItems: 'flex-start',
                                            marginBottom: '20px',
                                            padding: '14px 16px',
                                            background: '#FEF8F0',
                                            borderRadius: '10px',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '999px',
                                                background: '#F3E1DC',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <MapPin size={18} color="#7C3225" />
                                        </div>
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: '0.75rem',
                                                    color: '#868889',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px',
                                                    marginBottom: 4,
                                                }}
                                            >
                                                Deliver to
                                            </div>
                                            <div style={{ color: '#4A4A4A', fontSize: '0.9rem', lineHeight: 1.45 }}>
                                                {shippingAddress}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="order-status-bar" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    marginBottom: '24px',
                                    padding: '12px 16px',
                                    background: '#F4F9F4',
                                    borderRadius: '8px',
                                    width: 'fit-content'
                                }}>
                                    <Truck size={18} color="#2E7D32" />
                                    <span style={{ color: '#2E7D32', fontWeight: '700', fontSize: '0.9rem' }}>{order.status || order.orderStatus || 'PROCESSING'}</span>
                                </div>

                                {/* Products */}
                                {hasItems ? (
                                    <div className="order-items" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="order-item" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                                <div style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    background: '#FEF8F0',
                                                    flexShrink: 0,
                                                    cursor: 'pointer'
                                                }} onClick={() => onViewProduct && onViewProduct(item)}>
                                                    <img
                                                        src={item.img || '/wild_honey.png'}
                                                        alt={item.name}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        onError={e => { e.target.src = '/wild_honey.png'; }}
                                                    />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <h4
                                                        style={{ margin: '0 0 5px 0', color: '#4A4A4A', fontSize: '1.1rem', cursor: 'pointer' }}
                                                        onClick={() => onViewProduct && onViewProduct(item)}
                                                    >
                                                        {item.name || 'Product'}
                                                    </h4>
                                                    <div style={{ display: 'flex', gap: '15px', color: '#868889', fontSize: '0.9rem' }}>
                                                        {item.variant && <span>Variant: {item.variant}</span>}
                                                        <span>Qty: {item.quantity}</span>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <span style={{ fontWeight: '700', color: '#7C3225', fontSize: '1.1rem' }}>₹{item.price}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '16px',
                                        background: '#FEF8F0',
                                        borderRadius: '10px',
                                        color: '#868889',
                                        fontSize: '0.9rem'
                                    }}>
                                        <ShoppingBag size={20} color="#7C3225" />
                                        <span>Product details not available for this order. The items were successfully ordered.</span>
                                    </div>
                                )}
                            </div>

                            {/* Order Actions */}
                            <div className="order-footer" style={{
                                padding: '16px 24px',
                                borderTop: '1px solid #F0F0F0',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '12px'
                            }}>
                                <button
                                    className="btn-secondary"
                                    style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                                    onClick={() => onContactSupport && onContactSupport(order)}
                                >
                                    Help & Support
                                </button>
                                {hasItems && (
                                    <button
                                        className="btn-secondary"
                                        style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                                        onClick={() => onViewProduct && onViewProduct(order.items[0])}
                                    >
                                        Buy it again
                                    </button>
                                )}
                                <button
                                    className="btn-product"
                                    style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                                    onClick={() => onTrackOrder && onTrackOrder(order)}
                                >
                                    Track Package
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyOrders;
