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
  const { activeView, toasts, loading, navigateTo } = useApp();
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
