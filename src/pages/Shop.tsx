import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, RefreshCcw, Sparkles, AlertCircle } from 'lucide-react';

interface ShopProps {
  onQuickView: (productId: number) => void;
}

export const Shop: React.FC<ShopProps> = ({ onQuickView }) => {
  const { products, fetchProductsList, loading } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

  // Grab preferred category from home session memory on mount
  useEffect(() => {
    const prefCat = sessionStorage.getItem('preferred_category');
    if (prefCat !== null) {
      setSelectedCategory(prefCat);
      sessionStorage.removeItem('preferred_category'); // clear memory
    }
  }, []);

  useEffect(() => {
    fetchProductsList({
      category: selectedCategory,
      search: searchQuery,
      sort: sortOption
    });
  }, [selectedCategory, sortOption]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProductsList({
      category: selectedCategory,
      search: searchQuery,
      sort: sortOption
    });
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setSortOption('');
    fetchProductsList({ category: '', search: '', sort: '' });
  };

  const categories = [
    { label: 'All Menu', value: '' },
    { label: 'Fresh Kachoris', value: 'Kachoris' },
    { label: 'Signature Masalas', value: 'Masalas' },
    { label: 'Traditional Snacks', value: 'Snacks' },
    { label: 'Gourmet Combos', value: 'Combos' }
  ];

  return (
    <main style={{ padding: '60px 0', minHeight: '85vh', backgroundColor: 'var(--bg-body)' }}>
      <div className="container">
        
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ color: 'var(--color-success)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Gourmet Catalog
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', color: 'var(--color-primary)', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
            <span>Explore Gourmet Menu</span>
            <Sparkles size={24} style={{ color: 'var(--color-secondary)' }} />
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', marginTop: '6px' }}>
            Secure authentic woodfire Jhabua flavors or order fresh puffed pastries online.
          </p>
        </div>

        {/* Filter Toolbar (Search, Sort & Filters) */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '32px'
        }}>
          
          <form onSubmit={handleSearchSubmit} style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.2fr 140px',
            gap: '16px',
            alignItems: 'center'
          }} className="filter-grid-row">
            
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search kachoris, masalas, spices..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 42px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-body)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                className="filter-search-input"
              />
            </div>

            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <select 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-body)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  fontWeight: '600',
                  color: 'var(--text-main)'
                }}
              >
                <option value="">Sort: Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Gourmet Ratings</option>
              </select>
            </div>

            {/* Submit Action Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                type="submit" 
                className="btn btn-primary btn-sm" 
                style={{ height: '45px', borderRadius: '8px', flexGrow: 1, backgroundColor: 'var(--color-primary)' }}
              >
                Search
              </button>
              <button 
                type="button" 
                onClick={handleResetFilters}
                className="btn btn-secondary btn-sm" 
                style={{ height: '45px', borderRadius: '8px', padding: '10px' }}
                title="Reset All Filters"
              >
                <RefreshCcw size={16} />
              </button>
            </div>

          </form>
        </div>

        {/* Category Pills Toolbar */}
        <div className="category-pills" style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {categories.map((c) => (
            <button
              key={c.value}
              className={`category-pill ${selectedCategory === c.value ? 'category-pill-active' : ''}`}
              onClick={() => setSelectedCategory(c.value)}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid var(--border-light)',
                backgroundColor: selectedCategory === c.value ? 'var(--color-primary)' : 'white',
                color: selectedCategory === c.value ? 'white' : 'var(--text-muted)',
                fontWeight: '700',
                fontFamily: 'var(--font-display)',
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Catalog Grid View */}
        {loading ? (
          
          /* Pulsing skeleton load grids */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} style={{ height: '440px', backgroundColor: 'white', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="skeleton" style={{ height: '220px', width: '100%', borderRadius: '12px' }}></div>
                <div className="skeleton" style={{ height: '20px', width: '40%' }}></div>
                <div className="skeleton" style={{ height: '28px', width: '80%' }}></div>
                <div className="skeleton" style={{ height: '40px', width: '100%', marginTop: 'auto' }}></div>
              </div>
            ))}
          </div>

        ) : products.length === 0 ? (
          
          /* Clean Empty state */
          <div className="empty-state" style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', padding: '80px 40px', border: '1px solid var(--border-light)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div className="empty-state-icon" style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(185, 28, 28, 0.08)',
              color: 'var(--color-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <AlertCircle size={30} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
              No Gourmet Products Found
            </h2>
            <p style={{ maxWidth: '420px', margin: '0 auto 24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              We couldn't find any products matching your search term or category filters. Try widening your filters or resetting the search bar.
            </p>
            <button className="btn btn-primary" onClick={handleResetFilters} style={{ backgroundColor: 'var(--color-primary)' }}>
              Reset Filters & Show All
            </button>
          </div>

        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '30px',
            animation: 'fadeInCard 0.5s ease-out'
          }}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
            ))}
          </div>
        )}

      </div>

      {/* Embedded inline styles to support filter layout responsive sizing */}
      <style>{`
        .filter-search-input:focus {
          border-color: var(--color-success) !important;
          background-color: white !important;
        }
        @media (max-width: 768px) {
          .filter-grid-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </main>
  );
};
