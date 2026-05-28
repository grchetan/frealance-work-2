import React from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MapPin, MessageSquare, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="footer">
      <div className="container">
        
        {/* Foot Grids */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.8fr 1fr 1fr 1.4fr',
          gap: '40px',
          marginBottom: '48px'
        }} className="footer-grid">
          
          {/* Brand Info */}
          <div className="footer-about">
            <h3 
              style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: '800', color: 'var(--bg-card)', marginBottom: '16px', letterSpacing: '-0.5px', cursor: 'default' }}
              onDoubleClick={() => navigateTo('admin-login')}
            >
              MAHESVARI
            </h3>
            <p style={{ color: 'hsl(24, 10%, 70%)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '24px' }}>
              Crafting Jhabua's legendary golden kachoris and signature hand-roasted spice mixes since 1984. Shipped securely across major states under certified hygiene logistics.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-success)', fontWeight: '600', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} /> 
              <span>FSSAI Standard Certified | 100% Vegetarian</span>
            </div>
          </div>

          {/* Catalog Columns */}
          <div>
            <h4 className="footer-heading" style={{ color: 'white', fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Gourmet Menu
            </h4>
            <ul className="footer-links" style={{ listStyle: 'none' }}>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('shop'); }}>Artisan Kachoris</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('shop'); }}>Heritage Masalas</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('shop'); }}>Glazed Sweets</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('shop'); }}>Gifting Combos</a></li>
            </ul>
          </div>

          {/* Corporate Columns */}
          <div>
            <h4 className="footer-heading" style={{ color: 'white', fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Brand Story
            </h4>
            <ul className="footer-links" style={{ listStyle: 'none' }}>
              <li><a href="#" onClick={(e) => {
                e.preventDefault();
                navigateTo('home');
                setTimeout(() => {
                  const el = document.getElementById('heritage');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}>Family Legacy</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Testimonials</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('account'); }}>Track Delivery</a></li>
            </ul>
          </div>

          {/* Jhabua Pride Coordinates */}
          <div>
            <h4 className="footer-heading" style={{ color: 'white', fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Jhabua Rajwada
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.88rem', color: 'hsl(24, 10%, 70%)' }}>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <MapPin size={16} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '3px' }} />
                <span>12, Main Rajwada Chowk, Palace Gates, Jhabua, Madhya Pradesh - 457661</span>
              </li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                <span>+91 94254 78201</span>
              </li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                <span>orders@mahesvarikachori.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Lower copyright bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '32px',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'hsl(24, 10%, 55%)'
        }}>
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            © {new Date().getFullYear()} Mahesvari Gourmet Indian Heritage. Made with <Heart size={13} style={{ color: 'var(--color-secondary)' }} /> for authentic culinary lovers.
          </p>
        </div>

      </div>

      {/* Floating WhatsApp support shortcut */}
      <a
        href="https://wa.me/919425478201?text=Hello%20Mahesvari%20Kachori,%20I%20have%20an%20inquiry%20regarding%20my%20order!"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '30px',
          left: '30px',
          width: '54px',
          height: '54px',
          backgroundColor: '#25D366',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.35)',
          zIndex: 999,
          transition: 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        className="whatsapp-btn"
        aria-label="Chat support on WhatsApp"
      >
        <MessageSquare size={24} />
      </a>

      <style dangerouslySetInnerHTML={{ __html: `
        .whatsapp-btn:hover {
          transform: scale(1.08) rotate(3deg);
          box-shadow: 0 10px 28px rgba(37, 211, 102, 0.5);
        }
        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 30px !important;
          }
        }
        @media (max-width: 580px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      ` }} />

    </footer>
  );
};
