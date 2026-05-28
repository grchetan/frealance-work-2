import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { ShoppingBag, User as UserIcon, LogOut, Shield, Moon, Sun, Menu, X, Home, Compass, ChefHat, LogIn, Search } from 'lucide-react';

interface NavbarProps {
  onCartToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCartToggle }) => {
  const { user, logout, activeView, navigateTo, cart } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const toggleTheme = () => {
    const nextTheme = !darkTheme;
    setDarkTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme ? 'dark' : 'light');
  };

  const handleNavClick = (view: string) => {
    navigateTo(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="header glass">
      <div className="container navbar">
        
        {/* Brand Logo & Editorial Typography */}
        <div 
          className="logo-container" 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }} 
          onClick={() => handleNavClick('home')}
        >
          <BrandLogo size={36} />
          <span style={{ fontWeight: '800', fontSize: '1.35rem', fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' }}>
            MAHESVARI
          </span>
        </div>

        {/* Desktop Navigation Menu Links - Redesigned to match the Mockup */}
        <nav className="nav-links">
          <span 
            className={`nav-link ${activeView === 'home' ? 'nav-link-active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            Home
          </span>
          <span 
            className={`nav-link ${activeView === 'shop' ? 'nav-link-active' : ''}`}
            onClick={() => handleNavClick('shop')}
          >
            Shop
          </span>
          <span 
            className="nav-link"
            onClick={() => {
              navigateTo('shop');
              sessionStorage.setItem('preferred_category', 'Masalas');
            }}
          >
            Kachori Masala
          </span>
          <span 
            className={`nav-link ${activeView === 'our-story' ? 'nav-link-active' : ''}`}
            onClick={() => handleNavClick('our-story')}
          >
            Our Story
          </span>
          <span 
            className="nav-link"
            onClick={() => {
              navigateTo('home');
              setTimeout(() => {
                const el = document.getElementById('heritage-story');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          >
            Bulk Orders
          </span>
          <span 
            className="nav-link"
            onClick={() => {
              navigateTo('home');
              setTimeout(() => {
                const el = document.getElementById('testimonials');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          >
            Reviews
          </span>
        </nav>

        {/* Actions Controls (Search, Cart, Profiles, Capsule Order Now Button) */}
        <div className="nav-actions">
          
          {/* Catalog search inspection button - Hidden on mobile, accessible in side panel */}
          <button 
            className="icon-btn hide-on-mobile" 
            onClick={() => navigateTo('shop')} 
            aria-label="Search catalog products"
          >
            <Search size={18} />
          </button>

          {/* Cart Icon Badge - Always visible */}
          <button className="icon-btn" onClick={onCartToggle} aria-label="Open shopping cart drawer">
            <ShoppingBag size={18} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {/* Profile Auth hooks - Hidden on mobile, fully styled inside sliding drawer */}
          {user ? (
            <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span 
                className="icon-btn" 
                style={{ cursor: 'pointer' }}
                onClick={() => handleNavClick('account')}
                title={`My Profile (${user.name})`}
              >
                <UserIcon size={18} />
              </span>
              <button 
                className="icon-btn" 
                onClick={logout} 
                title="Log Out Session" 
                style={{ color: 'var(--color-secondary)' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              className="icon-btn hide-on-mobile" 
              onClick={() => handleNavClick('account')}
              title="Sign In to Account"
            >
              <UserIcon size={18} />
            </button>
          )}

          {/* Premium "Order Now" rounded capsule button in deep forest green - Hidden on mobile, accessible in drawer */}
          <button 
            className="btn btn-primary hide-on-mobile" 
            onClick={() => handleNavClick('shop')}
            style={{ 
              padding: '10px 22px', 
              borderRadius: 'var(--radius-full)', 
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              fontWeight: '700',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <ShoppingBag size={14} />
            <span>Order Now</span>
          </button>

          {/* Mobile burger toggle */}
          <button 
            className="icon-btn mobile-menu-toggle" 
            style={{ display: 'none' }} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={20} />
          </button>

        </div>

      </div>

      {/* Mobile Drawer Overlay Backing Backdrop with premium smooth fade-in */}
      {mobileMenuOpen && (
        <div 
          className="mobile-menu-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Slide-Over Drawer panel */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          
          {/* Header row in mobile menu */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BrandLogo size={32} />
              <span style={{ fontWeight: '800', fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                MAHESVARI
              </span>
            </div>
            <button 
              className="mobile-close-btn" 
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          {/* Links stack in mobile menu */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            
            <div 
              className={`mobile-nav-link ${activeView === 'home' ? 'active' : ''}`}
              onClick={() => handleNavClick('home')}
            >
              <Home size={18} style={{ color: activeView === 'home' ? 'var(--color-primary)' : 'var(--text-muted)' }} />
              <span>Home</span>
            </div>

            <div 
              className={`mobile-nav-link ${activeView === 'shop' ? 'active' : ''}`}
              onClick={() => handleNavClick('shop')}
            >
              <ChefHat size={18} style={{ color: activeView === 'shop' ? 'var(--color-primary)' : 'var(--text-muted)' }} />
              <span>Menu</span>
            </div>

            <div 
              className={`mobile-nav-link ${activeView === 'our-story' ? 'active' : ''}`}
              onClick={() => handleNavClick('our-story')}
            >
              <Compass size={18} style={{ color: activeView === 'our-story' ? 'var(--color-primary)' : 'var(--text-muted)' }} />
              <span>Our Story</span>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '12px 0' }} />

            {user ? (
              <>
                <div 
                  className={`mobile-nav-link ${activeView === 'account' ? 'active' : ''}`}
                  onClick={() => handleNavClick('account')}
                >
                  <UserIcon size={18} style={{ color: activeView === 'account' ? 'var(--color-primary)' : 'var(--text-muted)' }} />
                  <span>My Profile</span>
                </div>
                <div 
                  className="mobile-nav-link"
                  onClick={() => { setMobileMenuOpen(false); logout(); }}
                  style={{ color: 'var(--color-secondary)' }}
                >
                  <LogOut size={18} style={{ color: 'var(--color-secondary)' }} />
                  <span>Log Out</span>
                </div>
              </>
            ) : (
              <button 
                className="btn btn-primary"
                onClick={() => handleNavClick('account')}
                style={{ 
                  width: '100%', 
                  borderRadius: '10px', 
                  padding: '14px', 
                  marginTop: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 20px rgba(10, 36, 18, 0.1)'
                }}
              >
                <LogIn size={16} />
                <span>Sign In to Account</span>
              </button>
            )}
          </nav>

          {/* Premium pure vegetarian credential tags */}
          <div style={{ marginTop: 'auto', textAlign: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--color-success)', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }}></span>
              Strictly Pure Vegetarian
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: '1.4' }}>
              Mahesvari Kachori © 2026<br />Handcrafted Taste of Jhabua
            </p>
          </div>

        </div>
      )}

      {/* Inline styles for Mobile Hamburger Menu Overrides & Premium Transitions */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(4px); }
        }

        .mobile-menu-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          backgroundColor: rgba(10, 20, 14, 0.45);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 999;
          animation: fadeIn 0.3s ease-out forwards;
        }

        .mobile-menu-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 290px;
          height: 100vh;
          background-color: var(--bg-card);
          boxShadow: var(--shadow-lg);
          padding: 30px 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          z-index: 1000;
          animation: slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          border-left: 1px solid var(--border-light);
        }

        .mobile-close-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid var(--border-light);
          background-color: var(--bg-card);
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .mobile-close-btn:hover {
          color: var(--text-main);
          background-color: var(--border-light);
          transform: rotate(90deg);
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          font-family: var(--font-display);
          color: var(--text-muted);
          padding: 12px 16px;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .mobile-nav-link:hover {
          color: var(--color-primary);
          background-color: var(--border-light);
          padding-left: 20px;
        }
        .mobile-nav-link.active {
          color: var(--color-primary);
          background-color: rgba(21, 128, 61, 0.08);
          font-weight: 700;
          border-left: 3.5px solid var(--color-primary);
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          padding-left: 12.5px;
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: flex !important;
          }
          .nav-user-name {
            display: none !important;
          }
          .hide-on-mobile {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
