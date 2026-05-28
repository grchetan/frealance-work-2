import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, updateCartQuantity, removeFromCart, applyPromo, promoDiscount, promoCodeApplied, navigateTo } = useApp();
  const [couponInput, setCouponInput] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Calculate discount based on active code
  let discount = 0;
  if (promoCodeApplied === 'JHABUA15') {
    discount = subtotal * 0.15;
  } else if (promoCodeApplied === 'GOLDENKACHORI') {
    discount = Math.min(subtotal * 0.10, 100);
  }

  const tax = (subtotal - discount) * 0.05; // 5% GST
  const shipping = subtotal > 300 || subtotal === 0 ? 0 : 40; // Free shipping above ₹300
  const grandTotal = subtotal - discount + tax + shipping;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    applyPromo(couponInput);
    setCouponInput('');
  };

  const handleCheckoutClick = () => {
    onClose();
    navigateTo('checkout');
  };

  return (
    <>
      {/* Overlay Backdrop */}
      <div className="drawer-overlay" onClick={onClose}></div>

      {/* Slide Drawer container */}
      <aside className="drawer glass">
        
        {/* Header */}
        <div className="drawer-header">
          <h2 className="drawer-title">
            <ShoppingBag size={20} className="text-secondary" /> 
            <span>Shopping Cart</span>
          </h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close Cart">
            <X size={20} />
          </button>
        </div>

        {/* Body (Scrollable items) */}
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-state" style={{ height: '80%' }}>
              <div className="empty-state-icon">
                <ShoppingBag size={42} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700' }}>Your cart is empty</h3>
              <p>Add some delicious fresh Jhabua kachoris or hot masalas to get started!</p>
              <button 
                className="btn btn-primary" 
                onClick={() => { onClose(); navigateTo('shop'); }}
                style={{ marginTop: '16px' }}
              >
                Explore Menu
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.product_id}-${item.weight}`} className="cart-item-row">
                <img src={item.image_url} alt={item.name} className="cart-item-img" />
                
                <div className="cart-item-details">
                  <h4 className="cart-item-name">{item.name}</h4>
                  <span className="cart-item-weight">{item.weight}</span>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    
                    {/* Quantity Selector */}
                    <div className="quantity-controller">
                      <button 
                        className="quantity-btn"
                        onClick={() => updateCartQuantity(item.product_id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="quantity-val">{item.quantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => updateCartQuantity(item.product_id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className="cart-item-price">₹{(item.price * item.quantity).toFixed(0)}</span>
                      <button 
                        className="icon-btn"
                        onClick={() => removeFromCart(item.product_id)}
                        style={{ color: 'var(--text-muted)', padding: '6px' }}
                        title="Delete Item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer (Aggregates + checkout) */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            
            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <div style={{ position: 'relative', flexGrow: 1 }}>
                <Tag size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Promo Code (e.g. JHABUA15)" 
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-card)',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>
              <button type="submit" className="btn btn-secondary btn-sm" style={{ borderRadius: '8px' }}>
                Apply
              </button>
            </form>

            {/* Coupons Hints */}
            {!promoCodeApplied && (
              <div style={{
                fontSize: '0.75rem',
                backgroundColor: 'rgba(217, 119, 6, 0.08)',
                padding: '8px 12px',
                borderRadius: '6px',
                marginBottom: '16px',
                color: 'var(--color-secondary)',
                fontWeight: '600',
                border: '1px dashed var(--color-primary)'
              }}>
                Try coupon <span style={{ textDecoration: 'underline' }}>JHABUA15</span> for 15% off your entire order!
              </div>
            )}

            {/* Calculation Lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                <span style={{ fontWeight: '600' }}>₹{subtotal.toFixed(0)}</span>
              </div>

              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Tag size={14} /> Coupon ({promoCodeApplied}):
                  </span>
                  <span>-₹{discount.toFixed(0)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tax (5% GST):</span>
                <span style={{ fontWeight: '600' }}>₹{tax.toFixed(0)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Delivery:</span>
                <span style={{ fontWeight: '600' }}>
                  {shipping === 0 ? <span style={{ color: 'var(--color-success)' }}>FREE</span> : `₹${shipping}`}
                </span>
              </div>

              {shipping > 0 && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                  Add ₹{Math.max(0, 301 - subtotal)} more for free delivery!
                </div>
              )}

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '4px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: '800' }}>
                <span>Grand Total:</span>
                <span style={{ color: 'var(--color-secondary)' }}>₹{grandTotal.toFixed(0)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button 
              className="btn btn-primary" 
              onClick={handleCheckoutClick}
              style={{ width: '100%', borderRadius: '12px', padding: '14px' }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

          </div>
        )}

      </aside>
    </>
  );
};
