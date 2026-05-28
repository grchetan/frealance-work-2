import React from 'react';
import { useApp } from '../context/AppContext';
import { Leaf, Flame, Award, Sparkles, ArrowRight, Heart, Star, ShieldCheck } from 'lucide-react';

export const OurStory: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <main style={{ padding: '40px 0', minHeight: '80vh', backgroundColor: 'var(--bg-body)' }}>
      <div className="container" style={{ animation: 'fadeInCard 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>

        {/* Page Editorial Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ color: 'var(--color-success)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Leaf size={12} />
            <span>Since 1984</span>
            <Leaf size={12} />
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.6rem', marginTop: '12px', color: 'var(--color-primary)', fontWeight: '700' }}>
            Our Heritage Story
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '14px auto 0', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Discover the legacy of Shri Kanhaiyalal Mahesvari and the legendary crisp golden puffed pastries of Jhabua.
          </p>
        </div>

        {/* Founder Split Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '50px',
          alignItems: 'center',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '50px 40px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '60px'
        }} className="founder-split-grid">
          
          {/* Left Column: Founder Portrait */}
          <div style={{ position: 'relative' }}>
            {/* Background decorative gold frame */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              border: '2px solid var(--color-secondary)',
              borderRadius: 'var(--radius-lg)',
              top: '12px',
              left: '12px',
              zIndex: 1
            }}></div>
            
            <img 
              src="/images/founder_portrait.png" 
              alt="Shri Kanhaiyalal Mahesvari - Founder of Mahesvari Kachori" 
              style={{
                width: '100%',
                height: '480px',
                objectFit: 'cover',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                position: 'relative',
                zIndex: 2,
                border: '4px solid white'
              }}
            />
          </div>

          {/* Right Column: Narrative */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <span style={{ 
              color: 'var(--color-secondary)', 
              fontWeight: '700', 
              fontFamily: 'var(--font-display)', 
              fontSize: '0.85rem',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              The Visionary Founder
            </span>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-primary)', fontWeight: '700', lineHeight: '1.2' }}>
              Shri Kanhaiyalal Mahesvari
            </h2>

            <p style={{ color: 'var(--text-main)', fontSize: '1.02rem', lineHeight: '1.7', fontWeight: '500' }}>
              In 1984, in the bustling Rajwada Chowk of Jhabua, Shri Kanhaiyalal Mahesvari started handcrafting crisp puffed kachoris from a small cart. Armed with a secret family-blend of 12 hand-ground spices and a commitment to strict pure vegetarian double-refined oil cooking, he created a legacy.
            </p>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.65' }}>
              "A customer's trust is built one crisp bite at a time," he would often say. Every single morning, he would hand-select whole spices, coal-roast them on slow woodfire, and grind them in the family kitchen to preserve the rich, woodsy aroma of hing, roasted cumin, and black pepper.
            </p>

            {/* Core Values Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(21, 128, 61, 0.08)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShieldCheck size={14} /></div>
                <span>Strict Pure Veg Kitchen (No Onion/Garlic option on requests)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(194, 80, 16, 0.08)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Flame size={14} /></div>
                <span>100% Charcoal Woodfire Slow-Roasted Dry Spices</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(21, 128, 61, 0.08)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Heart size={14} /></div>
                <span>Authentic Taste of Jhabua Shipped Fresh Daily</span>
              </div>
            </div>

          </div>

        </div>

        {/* Jhabua Famous Kachori Legacy info section */}
        <div style={{
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: '60px 50px',
          marginBottom: '60px',
          backgroundImage: 'linear-gradient(135deg, var(--color-primary), #03220e)',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Vector overlays */}
          <div style={{ position: 'absolute', right: '-30px', bottom: '-30px', opacity: 0.04, color: 'white' }}><Leaf size={280} /></div>

          <div style={{ maxWidth: '800px', position: 'relative', zIndex: 2 }}>
            <span style={{ color: 'var(--color-secondary)', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Why Jhabua Kachori is World Famous?</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.6rem', fontWeight: '700', marginTop: '10px', marginBottom: '20px', lineHeight: '1.2' }}>
              The Secret Behind Jhabua's Golden Pride
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.7', opacity: 0.9, marginBottom: '20px' }}>
              Unlike standard street kachoris, Jhabua's traditional kachori is famous for its **flaky, thin, biscuit-like crust (Puri)** and its extremely aromatic, spiced lentil-masala stuffing. The secret lies in the quality of **Asafoetida (Hing)** sourced directly and slow woodfire dry-roasting which locks in flavor oils without adding moisture, extending shelf life naturally up to 7 days!
            </p>
            <p style={{ fontSize: '1rem', lineHeight: '1.7', opacity: 0.85 }}>
              Today, food connoisseurs and travelers from all across India make a stop at Jhabua just to experience this legendary crunch, served traditionally with hot spicy sev namkeens and raw whole green chilies.
            </p>
          </div>
        </div>

        {/* History Timeline */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-primary)', textAlign: 'center', fontWeight: '700', marginBottom: '40px' }}>
            Our Growth Timeline
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
            maxWidth: '800px',
            margin: '0 auto',
            position: 'relative',
            paddingLeft: '32px',
            borderLeft: '2px solid var(--border-light)'
          }} className="story-timeline-container">
            
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-41px', top: '4px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--color-secondary)', border: '4px solid var(--bg-body)' }}></div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '1.2rem', color: 'var(--text-main)' }}>1984 - The Beginning</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px', lineHeight: '1.5' }}>
                Shri Kanhaiyalal Mahesvari set up the tiny wooden cart. The local residents instantly fell in love with the unmatched crispy texture and the lingering spicy aroma of dry-roasted lentil stuffing.
              </p>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-41px', top: '4px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', border: '4px solid var(--bg-body)' }}></div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '1.2rem', color: 'var(--text-main)' }}>1996 - Rajwada Chowk Shop</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px', lineHeight: '1.5' }}>
                Mahesvari Kachori moved into its first permanent brick shop in Jhabua. Word-of-mouth spread, and it became a landmark spot for morning breakfast crowds and visiting administrative officers.
              </p>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-41px', top: '4px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', border: '4px solid var(--bg-body)' }}></div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '1.2rem', color: 'var(--text-main)' }}>2010 - Launch of Woodfire Masala Jars</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px', lineHeight: '1.5' }}>
                To fulfill travelers' requests to recreate Jhabua's authentic kachori taste at home, the family began packaging slow coal-roasted dry spice mixes in heritage packaging pouches.
              </p>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-41px', top: '4px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--color-secondary)', border: '4px solid var(--bg-body)' }}></div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '1.2rem', color: 'var(--text-main)' }}>2026 - Digital D2C E-commerce</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px', lineHeight: '1.5' }}>
                Under dual-cloud Supabase database fulfillment, Mahesvari Kachori now ships fresh handcrafted kachori packs and spice jars directly to dinner tables all across Central India online.
              </p>
            </div>

          </div>
        </div>

        {/* Centered Final CTA */}
        <div style={{
          textAlign: 'center',
          backgroundColor: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: '50px 30px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--color-primary)', fontWeight: '700', marginBottom: '14px' }}>
            Bring Jhabua's Finest Taste to Your Table
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 30px', fontSize: '0.95rem' }}>
            Experience 100% fresh, strictly pure veg crispy puffed kachoris and hand-ground spice mixes online today.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => navigateTo('shop')}
            style={{
              borderRadius: 'var(--radius-full)',
              padding: '16px 40px',
              backgroundColor: 'var(--color-primary)',
              fontWeight: '700',
              fontSize: '0.95rem',
              boxShadow: '0 8px 24px rgba(5, 51, 22, 0.15)'
            }}
          >
            <span>Order Fresh Online Now</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>

      <style>{`
        @media (max-width: 868px) {
          .founder-split-grid {
            grid-template-columns: 1fr !important;
            padding: 30px 24px !important;
          }
        }
      `}</style>

    </main>
  );
};
