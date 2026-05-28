import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { Star, ShieldCheck, ShoppingCart, ArrowLeft, Send, Sparkles, MessageSquare } from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { selectedProductId, fetchProductDetails, addToCart, submitProductReview, user, navigateTo } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedWeight, setSelectedWeight] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [localLoading, setLocalLoading] = useState(false);

  // Review Form States
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [clickedStar, setClickedStar] = useState<number | null>(null);

  const loadProduct = async () => {
    if (!selectedProductId) return;
    setLocalLoading(true);
    const data = await fetchProductDetails(selectedProductId);
    if (data) {
      setProduct(data);
      setSelectedWeight(data.weight_options[0] || 'Standard');
    }
    setLocalLoading(false);
  };

  useEffect(() => {
    loadProduct();
  }, [selectedProductId]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, selectedWeight);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    const success = await submitProductReview(product.id, newRating, newComment);
    if (success) {
      setNewComment('');
      setNewRating(5);
      // Reload product details to show new review
      loadProduct();
    }
  };

  if (!selectedProductId) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <p>No product selected.</p>
        <button className="btn btn-primary" onClick={() => navigateTo('shop')}>Go to Menu</button>
      </div>
    );
  }

  const getSpiceLabel = (level: number) => {
    if (level <= 1) return 'Mild';
    if (level === 2) return 'Medium';
    if (level === 3) return 'Spicy';
    if (level === 4) return 'Hot';
    return 'Extra Hot';
  };

  const isOutOfStock = product ? product.stock_quantity <= 0 : true;

  return (
    <main style={{ padding: '40px 0', minHeight: '80vh' }}>
      <div className="container">
        
        {/* Back Link */}
        <button 
          onClick={() => navigateTo('shop')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            border: 'none',
            fontWeight: '600',
            fontFamily: 'var(--font-display)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            marginBottom: '30px',
            fontSize: '0.95rem'
          }}
        >
          <ArrowLeft size={16} /> Back to Gourmet Menu
        </button>

        {localLoading ? (
          <div style={{ padding: '80px 0', textAlign: 'center' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Preparing culinary layout...</p>
          </div>
        ) : product ? (
          <>
            {/* Upper Split (Image vs Specs) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '40px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '40px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '50px'
            }} className="detail-split-grid">
              
              {/* Product Visual */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  height: '420px',
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
                      fontSize: '1.6rem',
                      fontFamily: 'var(--font-display)'
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
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--color-success)',
                  fontWeight: '600',
                  fontSize: '0.85rem'
                }}>
                  <ShieldCheck size={20} />
                  <span>100% Pure Vegetarian | Prepared Under Deep-Fried Hygiene Audits</span>
                </div>
              </div>

              {/* Specs & Cart Controls */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--color-secondary)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  {product.category}
                </span>

                <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', fontWeight: '700', color: 'var(--text-main)', marginBottom: '12px', lineHeight: '1.2' }}>
                  {product.name}
                </h1>

                {/* Ratings */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', color: '#fbbf24', alignItems: 'center', gap: '2px' }}>
                    <Star size={16} fill="#fbbf24" />
                    <span style={{ fontWeight: '800' }}>{product.average_rating || '5.0'}</span>
                  </div>
                  <span style={{ color: 'var(--text-muted)' }}>({product.review_count || 0} customer reviews)</span>
                  <span style={{ margin: '0 8px', color: 'var(--border-light)' }}>|</span>
                  <span style={{ fontWeight: '600', color: 'var(--color-secondary)' }}>Spice Level: {getSpiceLabel(product.spice_level)} ({product.spice_level}/5)</span>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', marginBottom: '24px' }} />

                {/* Description */}
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
                  {product.description}
                </p>

                {/* Relational details */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  backgroundColor: 'var(--bg-body)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  fontSize: '0.8rem',
                  marginBottom: '24px'
                }} className="specs-grid-row">
                  <div>
                    <span style={{ fontWeight: '700', display: 'block', marginBottom: '4px' }}>Ingredients:</span>
                    <span style={{ color: 'var(--text-muted)' }}>{product.ingredients}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: '700', display: 'block', marginBottom: '4px' }}>Shelf Life:</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {product.category === 'Kachoris' ? '2-3 Days (Store in cool dry space)' : '6 Months (Signature Masala seal)'}
                    </span>
                  </div>
                </div>

                {/* Sizing Packs */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-muted)' }}>Select Packaging Option:</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {product.weight_options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedWeight(opt)}
                        style={{
                          padding: '8px 18px',
                          borderRadius: 'var(--radius-full)',
                          border: '1px solid',
                          borderColor: selectedWeight === opt ? 'var(--color-primary)' : 'var(--border-light)',
                          backgroundColor: selectedWeight === opt ? 'rgba(217,119,6,0.1)' : 'var(--bg-card)',
                          color: selectedWeight === opt ? 'var(--color-primary)' : 'var(--text-main)',
                          fontWeight: '700',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizing Price & Actions */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 'auto',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--border-light)'
                }} className="price-add-row">
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Price Tag:</span>
                    <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>₹{product.price.toFixed(0)}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    {/* Quantity controller */}
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
                        borderRadius: '12px',
                        padding: '12px 24px',
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

            {/* Lower Split (Reviews section & submission) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr',
              gap: '40px',
              alignItems: 'start'
            }} className="review-split-grid">
              
              {/* Reviews Display */}
              <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '30px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={20} style={{ color: 'var(--color-primary)' }} />
                  <span>Customer Reviews ({product.reviews?.length || 0})</span>
                </h3>

                {product.reviews && product.reviews.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {product.reviews.map((rev) => (
                      <div key={rev.id} style={{
                        paddingBottom: '20px',
                        borderBottom: '1px solid var(--border-light)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <h4 style={{ fontWeight: '700', fontSize: '0.9rem' }}>{rev.user_name}</h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {new Date(rev.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>

                        {/* Stars */}
                        <div style={{ display: 'flex', color: '#fbbf24', gap: '2px', marginBottom: '8px' }}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              fill={i < rev.rating ? "#fbbf24" : "none"} 
                              color={i < rev.rating ? "#fbbf24" : "var(--border-light)"} 
                            />
                          ))}
                        </div>

                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
                    <p>No verified reviews for this product yet.</p>
                    <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Be the first to share your crispy cooking experiences!</p>
                  </div>
                )}
              </div>

              {/* Review Submitter */}
              <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '30px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} style={{ color: 'var(--color-secondary)' }} />
                  <span>Submit Your Review</span>
                </h3>

                {user ? (
                  <form onSubmit={handleReviewSubmit}>
                    
                    {/* Star Choice */}
                    <div className="form-group">
                      <label className="form-label">How was the taste? (Star Rating):</label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {[1, 2, 3, 4, 5].map((stars) => (
                          <button
                            key={stars}
                            type="button"
                            onClick={() => {
                              setNewRating(stars);
                              setClickedStar(stars);
                              setTimeout(() => setClickedStar(null), 400);
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '2px'
                            }}
                          >
                            <Star 
                              size={28} 
                              fill={stars <= newRating ? "#fbbf24" : "none"} 
                              color={stars <= newRating ? "#fbbf24" : "var(--text-muted)"} 
                              className={`rating-input-star ${clickedStar === stars ? 'active-star' : ''}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment Area */}
                    <div className="form-group">
                      <label className="form-label">Comments / Recipe Feedback:</label>
                      <textarea
                        rows={4}
                        placeholder="Write your review here. Did you love the crispy golden crunch or our woodfire roasted masala flavor?"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-light)',
                          backgroundColor: 'var(--bg-body)',
                          fontSize: '0.85rem',
                          outline: 'none',
                          resize: 'none'
                        }}
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      style={{ width: '100%', borderRadius: '10px', padding: '12px' }}
                    >
                      Publish Review <Send size={16} />
                    </button>

                  </form>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px 10px', color: 'var(--text-muted)' }}>
                    <p style={{ marginBottom: '12px' }}>Please sign in to your customer account to submit rating reviews.</p>
                    <button 
                      className="btn btn-secondary btn-sm" 
                      onClick={() => navigateTo('account')}
                    >
                      Sign In Now
                    </button>
                  </div>
                )}
              </div>

            </div>

          </>
        ) : (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Product specifications missing from database.</div>
        )}

      </div>

      <style>{`
        @keyframes starPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.4) rotate(15deg); filter: drop-shadow(0 0 8px #fbbf24); }
          100% { transform: scale(1); }
        }
        
        .rating-input-star {
          transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.2s, fill 0.2s;
          cursor: pointer;
        }
        
        .rating-input-star:hover {
          transform: scale(1.3) rotate(-8deg);
          color: #fbbf24 !important;
        }
        
        .rating-input-star.active-star {
          animation: starPop 0.4s ease-out forwards;
        }
        @media (max-width: 992px) {
          .detail-split-grid {
            grid-template-columns: 1fr !important;
            padding: 24px !important;
          }
          .review-split-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .specs-grid-row {
            grid-template-columns: 1fr !important;
          }
          .price-add-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }
        }
      `}</style>
      
    </main>
  );
};
