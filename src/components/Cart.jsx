import React from 'react';
import { ArrowRight, X, Plus, Minus } from 'lucide-react';

const Cart = ({ cart, onClose, onUpdateQuantity, onRemove }) => {
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h3>Your cart is empty</h3>
        <p>Add some delicious products to get started!</p>
        <button className="continue-shopping-btn" onClick={onClose}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Shopping Cart ({getTotalItems()} items)</h2>
        <button className="close-cart-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="cart-items">
        {cart.map((item) => (
          <div key={item.cartItemId} className="cart-item">
            <div className="cart-item-image">
              <img src={item.img} alt={item.name} />
            </div>
            <div className="cart-item-details">
              <h4>{item.name}</h4>
              <p className="cart-item-category">
                {item.category} {item.selectedVariant && `(${item.selectedVariant})`}
              </p>
              {item.availabilityStatus === 'OUT_OF_STOCK' ? (
                <p className="cart-item-oos" style={{ color: '#7C3225', fontSize: '11px', fontWeight: 'bold' }}>OUT OF STOCK</p>
              ) : (
                <p className="cart-item-price">₹{item.price}</p>
              )}
            </div>
            <div className="cart-item-quantity">
              {!item.availabilityStatus || item.availabilityStatus !== 'OUT_OF_STOCK' ? (
                <>
                  <button
                    className="quantity-btn"
                    onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </>
              ) : (
                <span className="quantity-disabled" style={{ opacity: 0.5 }}>-</span>
              )}
            </div>
            <div className="cart-item-total">
              {item.availabilityStatus === 'OUT_OF_STOCK' ? '-' : `₹${item.price * item.quantity}`}
            </div>
            <button className="remove-item-btn" onClick={() => onRemove(item.cartItemId)}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-total">
          <span>Total:</span>
          <span className="total-amount">₹{getTotalPrice()}</span>
        </div>
        <button className="checkout-btn">
          Proceed to Checkout <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Cart;
