import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Star, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView: (productId: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, navigateTo } = useApp();
  const [selectedWeight, setSelectedWeight] = useState(product.weight_options[0] || 'Standard');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, selectedWeight);
  };

  const getSpiceLabel = (level: number) => {
    if (level <= 1) return 'Mild';
    if (level === 2) return 'Medium';
    if (level === 3) return 'Spicy';
    if (level === 4) return 'Hot';
    return 'Extra Hot';
  };

  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <article className="food-card" onClick={() => navigateTo('product-detail', { productId: product.id })}>
      
      {/* Vegetable Indicator */}
      <div className="veg-tag">
        <span className="veg-icon"></span>
        <span>VEG</span>
      </div>

      {/* Spice Level Indicator */}
      <div className="spice-rating-tag" title={`Spice Level: ${product.spice_level}/5`}>
        <span>{getSpiceLabel(product.spice_level).toUpperCase()} ({product.spice_level})</span>
      </div>

      {/* Product Image */}
      <div className="food-card-img-container">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="food-card-img"
          loading="lazy" // Lazy loading for performance optimization
        />
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
            fontSize: '1.2rem',
            fontFamily: 'var(--font-display)',
            zIndex: 3
          }}>
            OUT OF STOCK
          </div>
        )}
      </div>

      {/* Content */}
      <div className="food-card-content">
        <span className="food-card-category">{product.category}</span>
        <h3 className="food-card-title">{product.name}</h3>
        <p className="food-card-desc">{product.description}</p>
        
        {/* Rating and Reviews */}
        <div className="food-card-rating">
          {product.review_count > 0 ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', color: '#fbbf24', gap: '2px' }}>
                <Star size={14} fill="#fbbf24" />
                <span>{product.average_rating}</span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                ({product.review_count} reviews)
              </span>
            </>
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No reviews yet</span>
          )}
        </div>

        {/* Size Selection */}
        {product.weight_options.length > 1 && (
          <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>Select Pack Weight:</label>
            <select 
              value={selectedWeight} 
              onChange={(e) => setSelectedWeight(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-body)',
                fontSize: '0.8rem',
                outline: 'none',
                fontWeight: '600'
              }}
            >
              {product.weight_options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}

        {/* Footer */}
        <div className="food-card-footer">
          <div className="food-card-price">₹{product.price.toFixed(0)}</div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Quick View */}
            <button 
              className="icon-btn" 
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product.id);
              }}
              title="Quick Inspection"
              style={{ border: '1px solid var(--border-light)' }}
            >
              <Eye size={16} />
            </button>

            {/* Cart Trigger */}
            <button 
              className="btn btn-primary btn-sm"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              style={{ 
                borderRadius: '8px', 
                padding: '8px 12px',
                opacity: isOutOfStock ? 0.6 : 1,
                cursor: isOutOfStock ? 'not-allowed' : 'pointer'
              }}
            >
              <ShoppingCart size={16} /> Add
            </button>
          </div>
        </div>

      </div>

    </article>
  );
};
