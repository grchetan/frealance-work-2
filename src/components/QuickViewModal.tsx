import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { X, Star, ShoppingCart, ShieldCheck } from 'lucide-react';

interface QuickViewModalProps {
  productId: number | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ productId, onClose }) => {
  const { fetchProductDetails, addToCart } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedWeight, setSelectedWeight] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;
    const loadDetails = async () => {
      setLocalLoading(true);
      const data = await fetchProductDetails(productId);
      if (data) {
        setProduct(data);
        setSelectedWeight(data.weight_options[0] || 'Standard');
      }
      setLocalLoading(false);
    };
    loadDetails();
  }, [productId]);

  if (!productId) return null;

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, selectedWeight);
    onClose();
  };

  const isOutOfStock = product ? product.stock_quantity <= 0 : true;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '20px'
    }} onClick={onClose}>
      
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '780px',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        animation: 'slideInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'var(--bg-body)',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
          aria-label="Close Modal"
        >
          <X size={18} />
        </button>

        {localLoading ? (
          <div style={{ padding: '80px', textAlign: 'center' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Loading gourmet specifications...</p>
          </div>
        ) : product ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: '24px',
            padding: '30px'
          }} className="quickview-grid">
            
            {/* Left Column (Image & certifications) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                height: '320px',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-body)'
              }}>
                <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {isOutOfStock && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '1.4rem'
                  }}>
                    OUT OF STOCK
                  </div>
                )}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--bg-body)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                fontSize: '0.8rem',
                color: 'var(--color-success)',
                fontWeight: '600'
              }}>
                <ShieldCheck size={18} /> 
                <span>Certified FSSAI Standard | Pure Vegetarian</span>
              </div>
            </div>

            {/* Right Column (Product specs) */}
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-secondary)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                {product.category}
              </span>
              
              <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', fontWeight: '700', marginBottom: '10px', color: 'var(--text-main)' }}>
                {product.name}
              </h3>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', marginBottom: '16px' }}>
                <div style={{ display: 'flex', color: '#fbbf24', alignItems: 'center', gap: '2px' }}>
                  <Star size={14} fill="#fbbf24" />
                  <span style={{ fontWeight: '700' }}>{product.average_rating || '5.0'}</span>
                </div>
                <span style={{ color: 'var(--text-muted)' }}>({product.review_count || 0} customer reviews)</span>
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
                {product.description}
              </p>

              {/* Ingredients */}
              <div style={{ backgroundColor: 'var(--bg-body)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.8rem', border: '1px solid var(--border-light)' }}>
                <span style={{ fontWeight: '700', display: 'block', marginBottom: '4px' }}>Ingredients:</span>
                <span style={{ color: 'var(--text-muted)' }}>{product.ingredients}</span>
              </div>

              {/* Weight Options */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-muted)' }}>Select Pack Sizing:</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {product.weight_options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedWeight(opt)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid',
                        borderColor: selectedWeight === opt ? 'var(--color-primary)' : 'var(--border-light)',
                        backgroundColor: selectedWeight === opt ? 'rgba(217,119,6,0.1)' : 'var(--bg-card)',
                        color: selectedWeight === opt ? 'var(--color-primary)' : 'var(--text-main)',
                        fontWeight: '700',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer row with price & add action */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Gourmet Price:</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>₹{product.price.toFixed(0)}</span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {/* Quantity */}
                  {!isOutOfStock && (
                    <div className="quantity-controller">
                      <button className="quantity-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                      <span className="quantity-val">{quantity}</span>
                      <button className="quantity-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>
                  )}

                  <button 
                    className="btn btn-primary"
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                    style={{
                      borderRadius: '8px',
                      opacity: isOutOfStock ? 0.6 : 1,
                      cursor: isOutOfStock ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Product specifications missing.</div>
        )}

      </div>
      
      {/* Inline styles for responsive grid inside QuickView */}
      <style>{`
        @media (max-width: 768px) {
          .quickview-grid {
            grid-template-columns: 1fr !important;
            padding: 20px !important;
          }
        }
      `}</style>

    </div>
  );
};
