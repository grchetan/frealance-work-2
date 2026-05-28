import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight, Flame, Leaf, Award, ShieldCheck, Heart, Sparkles, ChevronRight, Check } from 'lucide-react';

interface HomeProps {
  onQuickView: (productId: number) => void;
}

export const Home: React.FC<HomeProps> = ({ onQuickView }) => {
  const { products, fetchProductsList, navigateTo } = useApp();
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const loadStorefront = async () => {
      setFetching(true);
      await fetchProductsList();
      setFetching(false);
    };
    loadStorefront();
  }, []);

  const bestsellerProducts = products.filter(p => p.is_featured).slice(0, 3);

  const handleCategoryClick = (category: string) => {
    // Navigate to Shop and trigger filter logic
    navigateTo('shop');
    // Save category filter in session so Shop reads it on mount
    sessionStorage.setItem('preferred_category', category);
  };

  const categoriesList = [
    { label: 'Artisan Kachoris', value: 'Kachoris', desc: 'Crispy, hot puffed pastries ground from heritage secret spices.', icon: <Award size={24} /> },
    { label: 'Woodfire Masalas', value: 'Masalas', desc: 'Low coal-fire roasted dry spices, hand-ground to lock in rich aromas.', icon: <Flame size={24} /> },
    { label: 'Traditional Snacks', value: 'Snacks', desc: 'Savory namkeen bites cooked in strict pure vegetarian double-refined oil.', icon: <Leaf size={24} /> },
    { label: 'Gourmet Combos', value: 'Combos', desc: 'Connoisseur gifting boxes with fresh kachoris, spice jars, and dipping tamarind.', icon: <Heart size={24} /> }
  ];

  return (
    <main style={{ position: 'relative', overflow: 'hidden', backgroundColor: 'var(--bg-body)' }}>
      
      {/* Floating Spices Background Layer - Luxury Vector Icons */}
      <div className="spice-float spice-1" style={{ color: 'var(--color-success)', opacity: 0.05 }}><Leaf size={52} /></div>
      <div className="spice-float spice-2" style={{ color: 'var(--color-secondary)', opacity: 0.05 }}><Flame size={44} /></div>
      <div className="spice-float spice-3" style={{ color: 'var(--color-primary)', opacity: 0.05 }}><Award size={40} /></div>
      <div className="spice-float spice-4" style={{ color: 'var(--color-success)', opacity: 0.05 }}><Sparkles size={48} /></div>

      {/* Redesigned Premium Mockup Hero Section using the new Generated Background Graphic */}
      <section className="luxury-hero-section">
        
        {/* Full View container for left-side texts aligning */}
        <div className="container" style={{ position: 'relative', zIndex: 3, height: '100%', display: 'flex', alignItems: 'center' }}>
          
          {/* Left Column content card block */}
          <div style={{ maxWidth: '580px', animation: 'fadeInCard 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            
            {/* Tagline Leaf Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(21, 128, 61, 0.08)',
              border: '1px solid rgba(21, 128, 61, 0.15)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              color: 'var(--color-success)',
              fontWeight: '700',
              fontFamily: 'var(--font-display)',
              fontSize: '0.72rem',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '20px'
            }}>
              <Leaf size={12} style={{ color: 'var(--color-success)' }} />
              <span>Jhabua's Pride Since 1984</span>
            </div>

            {/* Slogan */}
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '4.5rem',
              lineHeight: '1.05',
              fontWeight: '700',
              letterSpacing: '-1.5px',
              marginBottom: '18px'
            }}>
              <span style={{ color: 'var(--color-primary)', display: 'block' }}>Authentic Taste.</span>
              <span style={{ color: 'var(--color-secondary)', display: 'block' }}>Mahesvari Kachori.</span>
            </h1>

            {/* Subtext */}
            <p style={{
              fontSize: '1.02rem',
              color: 'var(--text-muted)',
              lineHeight: '1.6',
              marginBottom: '30px',
              maxWidth: '500px'
            }}>
              Traditional recipes, handpicked ingredients and the perfect crunch - delivered fresh to your door.
            </p>

            {/* 2x2 Badges Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '14px',
              marginBottom: '36px',
              maxWidth: '485px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>
                <div className="hero-badge-icon"><Leaf size={14} /></div>
                <span>100% Pure Ingredients</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>
                <div className="hero-badge-icon"><Flame size={14} /></div>
                <span>Traditional Recipes</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>
                <div className="hero-badge-icon"><ShieldCheck size={14} /></div>
                <span>Hygienic Preparation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>
                <div className="hero-badge-icon"><Sparkles size={14} /></div>
                <span>Fast Delivery</span>
              </div>
            </div>

            {/* Buttons Row */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-primary"
                onClick={() => navigateTo('shop')}
                style={{
                  borderRadius: 'var(--radius-full)',
                  padding: '16px 36px',
                  backgroundColor: 'var(--color-primary)',
                  boxShadow: '0 10px 24px rgba(5, 51, 22, 0.2)',
                  fontSize: '0.92rem',
                  fontWeight: '700'
                }}
              >
                <span>Order Now</span>
                <ArrowRight size={16} />
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  const el = document.getElementById('heritage-story');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  borderRadius: 'var(--radius-full)',
                  padding: '16px 30px',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'white',
                  fontWeight: '700',
                  color: 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.92rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Simulated play button */}
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.5rem',
                  paddingLeft: '2.5px'
                }}>▶</div>
                <span>Our Story</span>
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* Floating 4-Features Capsule Row overlapping the Hero section */}
      <section className="container" style={{ position: 'relative', zIndex: 10, marginTop: '-50px', marginBottom: '50px' }}>
        <div className="floating-features-row">
          
          <div className="feature-item-col">
            <div className="feature-circle-icon"><Award size={18} /></div>
            <div>
              <h4 style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-main)', fontFamily: 'var(--font-display)', lineHeight: '1.2' }}>Since 1984</h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Trusted in Jhabua</span>
            </div>
          </div>

          <div className="feature-item-col">
            <div className="feature-circle-icon"><Flame size={18} /></div>
            <div>
              <h4 style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-main)', fontFamily: 'var(--font-display)', lineHeight: '1.2' }}>12+ Spices</h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Secret Family Recipe</span>
            </div>
          </div>

          <div className="feature-item-col">
            <div className="feature-circle-icon"><Leaf size={18} /></div>
            <div>
              <h4 style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-main)', fontFamily: 'var(--font-display)', lineHeight: '1.2' }}>Fresh & Crispy</h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Made Daily</span>
            </div>
          </div>

          <div className="feature-item-col">
            <div className="feature-circle-icon"><Sparkles size={18} /></div>
            <div>
              <h4 style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-main)', fontFamily: 'var(--font-display)', lineHeight: '1.2' }}>Fast Delivery</h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>At Your Doorstep</span>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Luxury Categories Grid */}
      <section style={{ padding: '80px 0', backgroundColor: 'white', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ color: 'var(--color-success)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Leaf size={12} />
              <span>Explore Menu</span>
              <Leaf size={12} />
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', marginTop: '8px', color: 'var(--color-primary)', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <span>Shop by Category</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '10px auto 0', fontSize: '0.95rem' }}>
              Choose from fresh crispy kachoris or roasted ground pantry masalas, shipped securely.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            {categoriesList.map((cat, idx) => (
              <div 
                key={cat.value}
                onClick={() => handleCategoryClick(cat.value)}
                style={{
                  backgroundColor: 'var(--bg-body)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '30px 24px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  boxShadow: 'var(--shadow-sm)'
                }}
                className="category-card-hover"
              >
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '12px',
                  backgroundColor: idx === 0 ? 'rgba(217,119,6,0.1)' : idx === 1 ? 'rgba(185,28,28,0.1)' : idx === 2 ? 'rgba(21,128,61,0.1)' : 'rgba(59,130,246,0.1)',
                  color: idx === 0 ? 'var(--color-secondary)' : idx === 1 ? 'hsl(12, 76%, 42%)' : idx === 2 ? 'var(--color-success)' : '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
                }}>
                  {cat.icon}
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{cat.label}</span>
                    <ChevronRight size={16} />
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    {cat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Jhabua's Famous Heritage Pride & Trust Banner */}
      <section style={{ 
        padding: '80px 0', 
        backgroundColor: 'var(--color-primary)', 
        color: 'white',
        backgroundImage: 'linear-gradient(135deg, var(--color-primary), #03220e)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', opacity: 0.05, color: 'white' }}><Leaf size={260} /></div>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '50px', alignItems: 'center' }} className="heritage-grid">
            
            <div>
              <span style={{ color: 'var(--color-secondary)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} />
                <span>The Pride of Central India</span>
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.2rem', marginTop: '12px', marginBottom: '24px', fontWeight: '700', lineHeight: '1.1' }}>
                Jhabua Ki World-Famous Kachori
              </h2>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.7', opacity: 0.9, marginBottom: '20px' }}>
                What makes Jhabua's kachori world-famous? Unlike normal street snacks, our Jhabua kachori features a biscuit-like **thin flaky Puri crust** stuffed with highly aromatic **coal-fire roasted lentils** and signature **pure Hing (Asafoetida)**. This slow woodfire process locks in natural spice oils and extends shelf life up to 7 days naturally, with absolutely zero artificial preservatives!
              </p>
              <p style={{ fontSize: '0.98rem', lineHeight: '1.65', opacity: 0.85, marginBottom: '30px' }}>
                Every single pack is crafted in Jhabua with traditional recipes, keeping 100% pure vegetarian hygiene standards. Shipped fresh in security-sealed vacuum packs directly to your door.
              </p>
              
              {/* Call to Actions inside Trust Section */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigateTo('shop')}
                  style={{
                    backgroundColor: 'var(--color-secondary)',
                    borderRadius: 'var(--radius-full)',
                    padding: '14px 32px',
                    fontWeight: '700',
                    border: 'none',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 20px rgba(194, 80, 16, 0.25)'
                  }}
                >
                  <span>Order Famous Jhabua Kachori</span>
                  <ArrowRight size={16} />
                </button>
                <button 
                  className="btn"
                  onClick={() => navigateTo('our-story')}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--radius-full)',
                    padding: '14px 28px',
                    fontWeight: '700',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>Our Heritage Story</span>
                </button>
              </div>
            </div>

            {/* Right Graphic inside Trust Section (Mockup Platter Overlay) */}
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                maxHeight: '340px',
                maxWidth: '340px',
                border: '2px dashed rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                top: '-10px',
                left: '-10px',
                animation: 'spin-slow 20s linear infinite'
              }}></div>
              <img 
                src="/images/dal_kachori_mix.png" 
                alt="Signature Jhabua Puffed Pastry" 
                style={{
                  width: '100%',
                  maxWidth: '340px',
                  height: '340px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  border: '6px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: 'var(--shadow-lg)'
                }}
              />
            </div>

          </div>
        </div>
      </section>

      {/* Featured Bestsellers Section */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }} className="bestseller-title-row">
            <div>
              <span style={{ color: 'var(--color-secondary)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Signature Selection</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginTop: '8px', color: 'var(--color-primary)', fontWeight: '700' }}>
                Jhabua's Bestselling Recipes
              </h2>
            </div>
            <button 
              className="btn btn-outline" 
              onClick={() => navigateTo('shop')}
              style={{ borderRadius: '8px', padding: '12px 24px', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}
            >
              Explore Full Menu <ChevronRight size={16} />
            </button>
          </div>

          {fetching ? (
            
            /* High-end Skeleton loading card deck placeholder */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
              {[1, 2, 3].map((n) => (
                <div key={n} style={{ height: '440px', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="skeleton" style={{ height: '220px', width: '100%', borderRadius: '12px' }}></div>
                  <div className="skeleton" style={{ height: '20px', width: '40%' }}></div>
                  <div className="skeleton" style={{ height: '28px', width: '80%' }}></div>
                  <div className="skeleton" style={{ height: '40px', width: '100%', marginTop: 'auto' }}></div>
                </div>
              ))}
            </div>

          ) : bestsellerProducts.length === 0 ? (
            
            <div className="empty-state" style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', padding: '60px 40px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '800' }}>No featured items seeded</h3>
              <p>Please check your database connection or seed products catalog in admin dashboard.</p>
            </div>

          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', animation: 'fadeInCard 0.6s ease-out' }}>
              {bestsellerProducts.map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* D2C Brand Coordinates Trust Section */}
      <section style={{
        padding: '60px 0',
        backgroundColor: 'var(--color-primary)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* Soft background gradient mask */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.15) 100%)',
          pointerEvents: 'none'
        }}></div>

        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '40px', position: 'relative', zIndex: 2 }}>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.12)',
              color: 'var(--color-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Leaf size={24} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: '700', marginBottom: '6px', color: 'white' }}>
                100% Pure Vegetarian
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>
                Seeded under strict pure-veg kitchen audits using high-quality double-refined oil with zero animal traces.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.12)',
              color: 'var(--color-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Flame size={24} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: '700', marginBottom: '6px', color: 'white' }}>
                Woodfire Coal Oven Roast
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>
                Our signature 12-spice kachori masala is gently coal-roasted on low fires for maximum aroma retention.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.12)',
              color: 'var(--color-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: '700', marginBottom: '6px', color: 'white' }}>
                FSSAI Certified Shipping
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>
                Sealed dry masalas and quick cooking mixes vacuum-packaged to retain freshness during 3-4 days dispatch.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Heritage Story Section */}
      <section id="heritage-story" style={{ padding: '100px 0', backgroundColor: 'white', position: 'relative' }}>
        <div className="container heritage-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '60px', alignItems: 'center' }}>
          
          {/* Graphic Side */}
          <div style={{ position: 'relative' }}>
            <img 
              src="/images/kachori_masala.jpg" 
              alt="Premium Raw Indian Spices" 
              style={{
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                width: '100%',
                height: '440px',
                objectFit: 'cover',
                border: '1px solid var(--border-light)'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '-20px',
              right: '-20px',
              backgroundColor: 'var(--color-secondary)',
              color: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-md)',
              fontFamily: 'var(--font-serif)',
              textAlign: 'center',
              zIndex: 2,
              border: '2px solid white'
            }} className="experience-badge">
              <span style={{ fontSize: '2.5rem', fontWeight: '800', display: 'block', lineHeight: '1' }}>42+</span>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Years of Culinary Craft</span>
            </div>
          </div>

          {/* Text Side */}
          <div>
            <span style={{ color: 'var(--color-success)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Family Heritage Legacy
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginTop: '8px', marginBottom: '20px', color: 'var(--color-primary)', fontWeight: '700' }}>
              Born in Jhabua, Ground for Connoisseurs
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.98rem', lineHeight: '1.6' }}>
              For over four decades, Mahesvari Kachori has stood as the culinary heartbeat of Rajwada Chowk in Jhabua, serving a legendary recipe that has defined the flavor profile of street snacks in Central India. Founded by Shri Mahesvari, our brand started on a simple clay coal burner.
            </p>
            <p style={{ color: 'var(--text-muted)', marginBottom: '28px', fontSize: '0.98rem', lineHeight: '1.6' }}>
              The magic lies in our core stuffing masala: a balanced combination of 12 distinct dry whole spices, roasted gently over a woodfire and ground manually. Today, we bring this same heritage to kitchens across the nation, offering ready-made masalas and quick cooking mixes shipped straight from Jhabua under sterile vacuum-seals.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                'Time-Honored Heirloom Recipe',
                'Coal-Oven Charcoal Roasting',
                '100% Preservative Free',
                'Loved by 10k+ Families'
              ].map((point) => (
                <div key={point} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(21, 128, 61, 0.1)',
                    color: 'var(--color-success)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check size={12} />
                  </div>
                  <span style={{ fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-main)' }}>{point}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Premium Customer Testimonials Section */}
      <section style={{ padding: '80px 0', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ color: 'var(--color-success)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Verified Reviews</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginTop: '8px', color: 'var(--color-primary)', fontWeight: '700' }}>
              What Food Lovers Say
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            
            {[
              {
                name: 'Ananya Hegde',
                initial: 'A',
                city: 'Bangalore',
                text: '"The crispiness of their golden kachori is unbelievable. But the real star is the 12-spice kachori masala! I ordered two jars shipped to Bangalore, and it has elevated our weekend breakfast. Absolute authentic taste!"'
              },
              {
                name: 'Sandeep Rathore',
                initial: 'S',
                city: 'Delhi',
                text: '"As a Jhabua native living in Delhi, I missed street food terribly. Finding Mahesvari Kachori online was a blessing. The easy-cook Dal mix is fantastic. Just add warm water, roll and fry. Tastes exactly like home!"'
              },
              {
                name: 'Meera Deshmukh',
                initial: 'M',
                city: 'Mumbai',
                text: '"Their Sweet Mawa Kachori dipped in saffron syrup is pure heaven. Truly royal taste! Delivery was surprisingly fast, and the packaging kept the sweets fresh and intact. Recommended to all gourmet foodies!"'
              }
            ].map((test, idx) => (
              <div 
                key={idx}
                style={{
                  backgroundColor: 'white',
                  padding: '36px 30px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className="testimonial-card-hover"
              >
                <div style={{ color: 'var(--color-secondary)', fontSize: '1.25rem', display: 'flex', gap: '2px', marginBottom: '20px' }}>
                  {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                </div>
                
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.92rem', marginBottom: '24px', lineHeight: '1.6' }}>
                  {test.text}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.95rem'
                  }}>
                    {test.initial}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--text-main)', margin: 0 }}>{test.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Customer ({test.city})</span>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Responsive adjustments styles */}
      <style>{`
        .hero-luxury-image:hover {
          transform: rotate(0deg) scale(1.02) !important;
        }
        .category-card-hover:hover {
          transform: translateY(-4px) !important;
          box-shadow: var(--shadow-md) !important;
          border-color: var(--color-success) !important;
          background-color: white !important;
        }
        .testimonial-card-hover:hover {
          transform: translateY(-4px) !important;
          box-shadow: var(--shadow-md) !important;
          border-color: var(--color-success) !important;
        }
        @media (max-width: 992px) {
          .heritage-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .experience-badge {
            bottom: 10px !important;
            right: 10px !important;
            padding: 12px 18px !important;
          }
          .hero-luxury-image {
            max-width: 360px !important;
            height: 380px !important;
          }
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center !important;
            gap: 50px !important;
          }
          .hero-buttons {
            justify-content: center !important;
          }
        }
        @media (max-width: 580px) {
          .bestseller-title-row {
            text-align: center !important;
            justify-content: center !important;
            flex-direction: column !important;
          }
          .hero-float-card {
            display: none !important; /* Hide floating overlays on very small mobile to prevent text overlaps */
          }
        }
      `}</style>

    </main>
  );
};
