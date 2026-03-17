import React from "react";
import { Package, ChevronRight, Calendar, MapPin, Truck } from "lucide-react";

const MyOrders = ({ orders, onContinueShopping, onViewProduct, onTrackOrder, onContactSupport }) => {
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
                {orders.map((order) => (
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
                                    <span style={{ fontWeight: '600', color: '#4A4A4A' }}>₹{order.total}</span>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.75rem', color: '#868889', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Ship To</span>
                                    <span style={{ fontWeight: '600', color: '#4A4A4A' }}>{order.customerName || "Valued Member"}</span>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.75rem', color: '#868889', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Payment</span>
                                    <span style={{ fontWeight: '600', color: '#7C3225' }}>{order.paymentMethod || "Not Specified"}</span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '0.75rem', color: '#868889', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Order ID</span>
                                <span style={{ fontWeight: '700', color: '#7C3225' }}>{order.id}</span>
                            </div>
                        </div>

                        {/* Order Content */}
                        <div className="order-content" style={{ padding: '24px' }}>
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
                                <span style={{ color: '#2E7D32', fontWeight: '700', fontSize: '0.9rem' }}>{order.status}</span>
                            </div>

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
                                        }} onClick={() => onViewProduct(item)}>
                                            <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: '0 0 5px 0', color: '#4A4A4A', fontSize: '1.1rem', cursor: 'pointer' }} onClick={() => onViewProduct(item)}>{item.name}</h4>
                                            <div style={{ display: 'flex', gap: '15px', color: '#868889', fontSize: '0.9rem' }}>
                                                {item.variant && <span>Qty: {item.variant}</span>}
                                                <span>Quantity: {item.quantity}</span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontWeight: '700', color: '#7C3225', fontSize: '1.1rem' }}>₹{item.price}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Actions */}
                        <div className="order-footer" style={{
                            padding: '16px 24px',
                            borderTop: '1px solid #F0F0F0',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '12px'
                        }}>
                            <button className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.85rem' }} onClick={() => onContactSupport(order)}>
                                Help & Support
                            </button>
                            <button className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.85rem' }} onClick={() => onViewProduct(order.items[0])}>
                                Buy it again
                            </button>
                            <button className="btn-product" style={{ padding: '8px 18px', fontSize: '0.85rem' }} onClick={() => onTrackOrder && onTrackOrder(order)}>
                                Track Package
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;
