import React, { useState } from "react";
import { Heart, ShoppingCart, Trash2, ArrowRight, ChevronLeft } from "lucide-react";

const WishlistPage = ({ wishlist, onAddToCart, onRemove, onViewProduct, onContinueShopping }) => {
    const [addedIds, setAddedIds] = useState([]);

    const handleAddToCart = (product) => {
        onAddToCart(product);
        setAddedIds(prev => prev.includes(product.id) ? prev : [...prev, product.id]);
    };
    if (wishlist.length === 0) {
        return (
            <div style={{ backgroundColor: '#FEF8F0', width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', padding: '60px 0 40px', minHeight: '100vh', display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
                    <div className="empty-cart-container fade-in" style={{ padding: '0', textAlign: 'center' }}>
                        <div className="empty-cart-icon" style={{ background: '#FEF8F0', padding: '30px', borderRadius: '50%', display: 'inline-block', marginBottom: '24px' }}>
                            <Heart size={64} color="#7C3225" />
                        </div>
                        <h2 style={{ color: '#7C3225', fontSize: '2rem', marginBottom: '16px' }}>Your wishlist is empty</h2>
                        <p style={{ color: '#868889', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
                            Save items you love to find them easily and purchase them later.
                        </p>
                        <button
                            className="btn-product"
                            onClick={onContinueShopping}
                            style={{ minWidth: '200px' }}
                        >
                            Start Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#FEF8F0', width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', padding: '60px 0' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }} className="wishlist-page fade-in">
                <div className="pd-breadcrumb" style={{ marginBottom: '30px' }}>
                    <button onClick={onContinueShopping} className="back-btn">
                        <ChevronLeft size={18} /> Back to Shopping
                    </button>
                </div>

                <h1 style={{ color: '#7C3225', fontSize: '2.5rem', marginBottom: '40px', fontWeight: '700' }}>My Wishlist</h1>

                <div className="wishlist-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                    {wishlist.map(product => (
                        <div key={product.id} className="p-card" style={{ cursor: 'default' }}>
                            <div className="p-card-image" onClick={() => onViewProduct(product)} style={{ cursor: 'pointer' }}>
                                <img src={product.img} alt={product.name} />
                                {/* Wishlist toggle (Heart) */}
                                <button
                                    className="p-wishlist-btn active"
                                    onClick={(e) => { e.stopPropagation(); onRemove(product); }}
                                    title="Remove from wishlist"
                                >
                                    <Heart size={18} fill="#7C3225" color="#7C3225" />
                                </button>
                                {/* Delete Option (Trash) - Newly Added near product */}
                                <button
                                    className="p-delete-btn"
                                    onClick={(e) => { e.stopPropagation(); onRemove(product); }}
                                    style={{
                                        position: 'absolute',
                                        top: '15px',
                                        left: '15px',
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '36px',
                                        height: '36px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        zIndex: 15
                                    }}
                                    title="Delete from wishlist"
                                >
                                    <Trash2 size={16} color="#7C3225" />
                                </button>
                            </div>
                            <div className="p-card-info">
                                <h3 onClick={() => onViewProduct(product)} style={{ cursor: 'pointer' }}>{product.name}</h3>
                                <div className="p-card-footer" style={{ marginTop: 'auto' }}>
                                    <div className="p-price-block">
                                        <div className="p-price-row">
                                            <span className="p-mrp">₹{Math.round(product.price * 1.2)}</span>
                                            <span className="p-price">₹{product.price}</span>
                                        </div>
                                    </div>
                                    <button
                                        className={`p-view-btn btn-product ${addedIds.includes(product.id) ? 'is-added' : ''}`}
                                        onClick={() => handleAddToCart(product)}
                                        style={{ display: 'flex', gap: '8px' }}
                                        disabled={addedIds.includes(product.id)}
                                    >
                                        <ShoppingCart size={16} /> {addedIds.includes(product.id) ? 'Added' : 'ADD'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;
