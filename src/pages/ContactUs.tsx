import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MapPin, Clock, Send, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const ContactUs: React.FC = () => {
  const { navigateTo, showToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderId: '',
    subject: 'General Inquiry',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in all required fields.', 'warning');
      return;
    }

    setSubmitting(true);
    
    // Simulate API dispatch latency
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      showToast('Support ticket logged successfully!', 'success');
    }, 1200);
  };

  return (
    <main style={{ padding: '40px 0', minHeight: '80vh', backgroundColor: 'var(--bg-body)' }}>
      <div className="container" style={{ animation: 'fadeInCard 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        
        {/* Editorial Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ color: 'var(--color-success)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Sparkles size={12} />
            <span>24/7 Helpline & Support</span>
            <Sparkles size={12} />
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.5rem', marginTop: '12px', color: 'var(--color-primary)', fontWeight: '700' }}>
            Contact & Support Hub
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '14px auto 0', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Have a question about your kachori shipment, a bulk catering requirement, or need recipe guidance? Reach out instantly.
          </p>
        </div>

        {/* Dynamic Split Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.3fr',
          gap: '50px',
          alignItems: 'start',
          marginBottom: '60px'
        }} className="contact-split-grid">
          
          {/* Left Column: Direct Coordinates Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '40px 30px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--color-primary)', fontWeight: '700', marginBottom: '24px' }}>
                Our Coordinates
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Location */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(21, 128, 61, 0.08)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>Headquarters</h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      Mahesvari Heritage Complex,<br />
                      Rajwada Chowk, Jhabua,<br />
                      Madhya Pradesh - 457661
                    </p>
                  </div>
                </div>

                {/* Telephone */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(194, 80, 16, 0.08)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>Phone Hotline</h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      <a href="tel:+919425478201" style={{ fontWeight: '700', color: 'var(--text-main)' }}>+91 94254 78201</a><br />
                      <a href="tel:+919988776655" style={{ color: 'var(--text-muted)' }}>+91 99887 76655</a>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(21, 128, 61, 0.08)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>Support Email</h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      <a href="mailto:support@mahesvari.com" style={{ fontWeight: '700', color: 'var(--text-main)' }}>support@mahesvari.com</a><br />
                      <a href="mailto:orders@mahesvari.com" style={{ color: 'var(--text-muted)' }}>orders@mahesvari.com</a>
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(194, 80, 16, 0.08)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>Business Hours</h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      Monday – Saturday: 8:00 AM – 8:00 PM IST<br />
                      Sunday Support Desk: 9:00 AM – 2:00 PM IST
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Premium Pure-Veg Security Tag Card */}
            <div style={{
              backgroundColor: 'var(--color-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px 30px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: 'var(--shadow-sm)',
              backgroundImage: 'linear-gradient(135deg, var(--color-primary), #03220e)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--color-secondary)' }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: '700', fontSize: '0.95rem', color: 'white', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Strictly Pure Veg Delivery Audit</span>
                </h4>
                <p style={{ fontSize: '0.78rem', opacity: 0.8, marginTop: '2px', lineHeight: '1.4' }}>
                  All orders are prepared and vacuum-sealed under certified 100% vegetarian protocols, keeping spice levels locked in safely.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Support Ticket Form */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            padding: '40px'
          }}>
            
            {submitted ? (
              
              /* Elegant success checkmark visual container */
              <div style={{ textAlign: 'center', padding: '40px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', animation: 'fadeInCard 0.5s ease-out' }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(21, 128, 61, 0.1)',
                  color: 'var(--color-success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(21, 128, 61, 0.1)'
                }}>
                  <ShieldCheck size={36} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--color-primary)', fontWeight: '700', marginBottom: '8px' }}>
                    Support Ticket Logged!
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '400px', margin: '0 auto 24px', lineHeight: '1.6' }}>
                    Thank you, <strong>{formData.name}</strong>. Our culinary support team in Jhabua has received your inquiry. We will contact you at <strong>{formData.email}</strong> within 2-4 business hours.
                  </p>
                  
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => navigateTo('shop')}
                      style={{ borderRadius: '10px', padding: '12px 24px' }}
                    >
                      Shop Delicious Kachoris
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => {
                        setFormData({ name: '', email: '', phone: '', orderId: '', subject: 'General Inquiry', message: '' });
                        setSubmitted(false);
                      }}
                      style={{ borderRadius: '10px', padding: '12px 24px', backgroundColor: 'var(--color-primary)' }}
                    >
                      Submit Another Ticket
                    </button>
                  </div>
                </div>
              </div>

            ) : (

              /* Dynamic Inquiry Form */
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--color-primary)', fontWeight: '700', marginBottom: '8px' }}>
                  Write to Support
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="contact-form-row">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: '700', fontSize: '0.8rem' }}>Name <span style={{ color: 'var(--color-secondary)' }}>*</span></label>
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="Shreeji Mahesvari" 
                      value={formData.name} 
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-body)', fontSize: '0.85rem' }} 
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: '700', fontSize: '0.8rem' }}>Email Address <span style={{ color: 'var(--color-secondary)' }}>*</span></label>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="shreeji@gmail.com" 
                      value={formData.email} 
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-body)', fontSize: '0.85rem' }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="contact-form-row">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: '700', fontSize: '0.8rem' }}>Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      placeholder="+91 99887 76655" 
                      value={formData.phone} 
                      onChange={handleChange}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-body)', fontSize: '0.85rem' }} 
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: '700', fontSize: '0.8rem' }}>Order ID (If applicable)</label>
                    <input 
                      type="text" 
                      name="orderId" 
                      placeholder="e.g. TXN-78201" 
                      value={formData.orderId} 
                      onChange={handleChange}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-body)', fontSize: '0.85rem' }} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: '700', fontSize: '0.8rem' }}>Subject</label>
                  <select 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-body)', fontSize: '0.85rem', outline: 'none' }}
                  >
                    <option value="General Inquiry">General Taste/Store Inquiry</option>
                    <option value="Order Tracking">Order Fulfillment & Tracking</option>
                    <option value="Bulk/Catering">Bulk Gifting & Catering Orders</option>
                    <option value="Feedback">Customer Recipe Feedback</option>
                    <option value="Other">Other / Administrative Support</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: '700', fontSize: '0.8rem' }}>Message <span style={{ color: 'var(--color-secondary)' }}>*</span></label>
                  <textarea 
                    name="message" 
                    rows={5} 
                    placeholder="Please type your message details here. If inquiring about bulk catering boxes, please specify date and required pack sizes." 
                    value={formData.message} 
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-body)', fontSize: '0.85rem', resize: 'none', outline: 'none' }}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{
                    width: '100%',
                    borderRadius: '12px',
                    padding: '14px',
                    backgroundColor: 'var(--color-primary)',
                    boxShadow: '0 8px 24px rgba(5, 51, 22, 0.15)',
                    opacity: submitting ? 0.8 : 1,
                    cursor: submitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {submitting ? 'Submitting Inquiry Ticket...' : 'Send Message to Support'} 
                  {!submitting && <Send size={16} />}
                </button>

              </form>

            )}

          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 868px) {
          .contact-split-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .contact-form-row {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </main>
  );
};
