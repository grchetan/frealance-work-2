import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Checkout } from './pages/Checkout';
import { Account } from './pages/Account';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLogin } from './pages/AdminLogin';
import { OurStory } from './pages/OurStory';
import { Reviews } from './pages/Reviews';
import { ContactUs } from './pages/ContactUs';
import { Sparkles, Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

function App() {
  const { activeView, toasts, loading, navigateTo, activeBanners } = useApp();
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewProductId, setQuickViewProductId] = useState<number | null>(null);

  // Secret direct URL parameters router monitor
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const adminParam = params.get('admin');
    if (viewParam === 'admin-portal' || adminParam === 'true') {
      // Direct router shift to hidden admin sign-in portal!
      navigateTo('admin-login');
      // Clean query parameters from address bar to preserve secrecy
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Custom Router Switcher
  const renderActivePage = () => {
    switch (activeView) {
      case 'home':
        return <Home onQuickView={(id) => setQuickViewProductId(id)} />;
      case 'shop':
        return <Shop onQuickView={(id) => setQuickViewProductId(id)} />;
      case 'product-detail':
        return <ProductDetail />;
      case 'checkout':
        return <Checkout />;
      case 'account':
        return <Account />;
      case 'order-confirmation':
        return <OrderConfirmation />;
      case 'admin-login':
        return <AdminLogin />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'our-story':
        return <OurStory />;
      case 'reviews':
        return <Reviews />;
      case 'contact':
        return <ContactUs />;
      default:
        return <Home onQuickView={(id) => setQuickViewProductId(id)} />;
    }
  };

  const getToastIcon = (type: string) => {
    if (type === 'success') return <CheckCircle size={18} />;
    if (type === 'error') return <AlertCircle size={18} />;
    if (type === 'warning') return <AlertTriangle size={18} />;
    return <Info size={18} />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      
      {/* Global Cloud announcement banner */}
      {activeBanners && activeBanners.length > 0 && (
        <div style={{
          backgroundColor: activeBanners[0].bg_color || 'var(--color-primary)',
          color: activeBanners[0].text_color || 'white',
          padding: '10px 24px',
          textAlign: 'center',
          fontSize: '0.82rem',
          fontWeight: '700',
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.5px',
          zIndex: 1002,
          width: '100%',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
        }}>
          {activeBanners[0].text}
        </div>
      )}

      {/* Premium Dark Utility Top Bar (Mockup Style) */}
      <div className="utility-bar">
        <div className="container utility-container">
          <div className="utility-left">
            <span>🌿 Jhabua's Most Loved Kachori & Masale Since 1984</span>
          </div>
          <div className="utility-center">
            <span>🍳 100% Hygienic</span>
            <span>🔥 Traditional Recipes</span>
            <span>❤️ Made with Love</span>
          </div>
          <div className="utility-right">
            <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('account')}>Track Order</span>
            <span>Help & Support</span>
            <span style={{ fontWeight: '700' }}>+91 99887 76655</span>
          </div>
        </div>
      </div>

      {/* Navbar Header */}
      <Navbar onCartToggle={() => setCartOpen(true)} />

      {/* Main Page Layout Wrapper */}
      <div style={{ flexGrow: 1 }}>
        {renderActivePage()}
      </div>

      {/* Global Footer */}
      <Footer />

      {/* Cart Slider Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Catalog Quick Inspection Modal */}
      {quickViewProductId && (
        <QuickViewModal 
          productId={quickViewProductId} 
          onClose={() => setQuickViewProductId(null)} 
        />
      )}

      {/* Premium Floating WhatsApp Support Button */}
      <a 
        href="https://wa.me/919988776655?text=Hello%20Mahesvari%20Kachori%20Support!%20I%20have%20an%20inquiry%20about%20my%20order."
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#25D366',
          color: 'white',
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.3)',
          border: '2px solid white',
          zIndex: 999,
          cursor: 'pointer'
        }}
        className="whatsapp-float-btn"
        title="Chat on WhatsApp Support"
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.713-1.464L0 24zm6.59-4.846c1.666.988 3.311 1.493 5.351 1.494 5.541 0 10.054-4.513 10.057-10.057.002-2.685-1.042-5.21-2.945-7.114-1.903-1.903-4.43-2.947-7.113-2.949-5.545 0-10.059 4.514-10.062 10.059-.001 2.072.548 4.095 1.59 5.891L1.47 22.56l4.177-1.094zm12.915-7.42c-.29-.145-1.716-.847-1.98-.943-.263-.097-.455-.145-.646.145-.19.29-.738.943-.905 1.136-.168.193-.336.217-.626.072-2.825-1.413-3.882-2.52-5.187-4.75-.29-.5-.073-.772.172-1.017.22-.22.455-.53.682-.796.226-.266.3-.456.45-.76.15-.303.076-.569-.038-.813-.114-.243-.9-.217-1.24-2.502-.33-.314-.64-.263-.88-.263h-.76c-.266 0-.7.1-.966.393-.266.29-1.02.997-1.02 2.43 0 1.433 1.04 2.822 1.185 3.018.145.195 2.05 3.13 4.96 4.39.69.3 1.23.47 1.65.6.69.22 1.32.19 1.82.11.557-.08 1.716-.7 1.96-1.37.24-.67.24-1.24.17-1.37-.07-.13-.263-.22-.553-.365z"/>
        </svg>
      </a>

      {/* Dynamic Toast Alerts Container */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {getToastIcon(t.type)}
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{t.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;
