import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { CheckCircle, Truck, ShoppingBag, ArrowRight } from 'lucide-react';

export const OrderConfirmation: React.FC = () => {
  const { activeOrderId, fetchOrderDetails, navigateTo } = useApp();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeOrderId) return;
    const loadDetails = async () => {
      setLoading(true);
      const data = await fetchOrderDetails(activeOrderId);
      if (data) {
        setOrder(data);
      }
      setLoading(false);
    };
    loadDetails();
  }, [activeOrderId]);

  if (!activeOrderId) {
    return (
      <main style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <p>No active order found.</p>
          <button className="btn btn-primary" onClick={() => navigateTo('shop')}>Go to Menu</button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: '60px 0', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '620px', textAlign: 'center' }}>
        
        {loading ? (
          <div style={{ padding: '60px 0' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Confirming transactional ledger...</p>
          </div>
        ) : order ? (
          <div style={{
            backgroundColor: 'var(--bg-card)',
            padding: '40px 30px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            animation: 'slideInUp 0.4s ease-out'
          }}>
            
            {/* Success Icon */}
            <div style={{ color: 'var(--color-success)', animation: 'pulse-glow 2s infinite', borderRadius: '50%' }}>
              <CheckCircle size={64} fill="rgba(34, 197, 94, 0.1)" />
            </div>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--text-main)', marginTop: '8px' }}>
              Order Confirmed!
            </h1>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '460px', margin: '0 auto' }}>
              Thank you for shopping with us! Your order <strong style={{ color: 'var(--text-main)' }}>#MC-2026-{order.id}</strong> has been successfully recorded in our database ledger. We have locked down inventory, verified billing, and our heritage chefs are preparing your food.
            </p>

            <div style={{
              width: '100%',
              backgroundColor: 'var(--bg-body)',
              padding: '20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              textAlign: 'left',
              fontSize: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div>
                <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>Shipping Destination:</span>
                <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                  {order.shipping_address.street_address}, {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.zip_code}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-light)', paddingTop: '10px', marginTop: '4px' }}>
                <span style={{ fontWeight: '700' }}>Amount Charged ({order.payment_method}):</span>
                <strong style={{ color: 'var(--color-secondary)', fontSize: '1rem' }}>₹{order.total_amount.toFixed(0)}</strong>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '16px', width: '100%', marginTop: '10px' }} className="confirmation-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => navigateTo('shop')}
                style={{ flexGrow: 1, borderRadius: '10px' }}
              >
                <ShoppingBag size={16} /> Continue Shopping
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => navigateTo('account')} // redirects to profile to view tracker
                style={{ flexGrow: 1, borderRadius: '10px' }}
              >
                <Truck size={16} /> Track Delivery <ArrowRight size={16} />
              </button>
            </div>

          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>Fulfill data sync issue. Please check your account dashboard.</p>
        )}

      </div>

      <style>{`
        @media (max-width: 480px) {
          .confirmation-actions {
            flex-direction: column !important;
            gap: 12px !important;
          }
        }
      `}</style>
      
    </main>
  );
};
