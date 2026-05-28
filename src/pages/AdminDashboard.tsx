import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, ShoppingCart, Users, Package, ShieldAlert, Plus, Edit, Trash2, Check, RefreshCw, X, ArrowUpRight } from 'lucide-react';
import { Order } from '../types';

export const AdminDashboard: React.FC = () => {
  const { 
    user, adminOrders, adminCustomers, adminAnalytics, 
    adminFetchOrdersList, adminUpdateOrderStatus, adminFetchAnalyticsData, 
    adminCreateProduct, adminUpdateProduct, adminDeleteProduct, adminFetchCustomersList,
    activeBanners, adminBanners, fetchBannersList, adminCreateBanner, adminUpdateBanner, adminDeleteBanner,
    adminReviews, adminFetchReviewsList, adminDeleteReview,
    navigateTo, showToast
  } = useApp();

  const [adminTab, setAdminTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'banners' | 'reviews'>('overview');
  
  // Premium Admin Improvements States
  const [ordersViewMode, setOrdersViewMode] = useState<'kanban' | 'table'>('kanban');
  const [analyticsRange, setAnalyticsRange] = useState<'7d' | '30d' | 'ytd'>('30d');
  
  // Banner Form States
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [newBannerText, setNewBannerText] = useState('');
  const [newBannerBg, setNewBannerBg] = useState('var(--color-primary)');

  const seedDemoLedger = async () => {
    // Generate simulated orders
    const demoOrders: Order[] = [
      {
        id: 1001,
        user_id: 'customer-r1',
        total_amount: 380.0,
        discount_amount: 0,
        tax_amount: 15.0,
        shipping_amount: 40.0,
        status: 'pending',
        payment_status: 'paid',
        payment_method: 'UPI',
        transaction_id: 'TXN-UPI-987452140',
        shipping_address: {
          id: 101,
          user_id: 'customer-r1',
          street_address: 'Flat 402, Emerald Towers, Near City Center',
          city: 'Indore',
          state: 'Madhya Pradesh',
          zip_code: '452001',
          is_default: 1
        },
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        items: [
          { id: 1, order_id: 1001, product_id: 1, name: 'Heritage Golden Kachori (Pack of 4)', price: 120.0, quantity: 2, weight: 'Pack of 4' },
          { id: 3, order_id: 1001, product_id: 3, name: 'Jhabua Shahi Pyaz Kachori (Pack of 4)', price: 140.0, quantity: 1, weight: 'Pack of 4' }
        ],
        user_name: 'Ananya Hegde',
        user_email: 'ananya@gmail.com'
      },
      {
        id: 1002,
        user_id: 'customer-r2',
        total_amount: 540.0,
        discount_amount: 50.0,
        tax_amount: 25.0,
        shipping_amount: 0.0,
        status: 'preparing',
        payment_status: 'paid',
        payment_method: 'CARD',
        transaction_id: 'TXN-CRD-876123490',
        shipping_address: {
          id: 102,
          user_id: 'customer-r2',
          street_address: '15, Lotus Enclave, VIP Road',
          city: 'Bhopal',
          state: 'Madhya Pradesh',
          zip_code: '462001',
          is_default: 1
        },
        created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
        items: [
          { id: 3, order_id: 1002, product_id: 2, name: 'Signature 12-Spice Kachori Masala', price: 180.0, quantity: 3, weight: '250g' }
        ],
        user_name: 'Sandeep Rathore',
        user_email: 'sandeep.r@yahoo.com'
      },
      {
        id: 1003,
        user_id: 'customer-r3',
        total_amount: 270.0,
        discount_amount: 0,
        tax_amount: 10.0,
        shipping_amount: 40.0,
        status: 'out_for_delivery',
        payment_status: 'pending',
        payment_method: 'COD',
        shipping_address: {
          id: 103,
          user_id: 'customer-r3',
          street_address: 'B-12, Rajwada Residency, Near Town Hall',
          city: 'Jhabua',
          state: 'Madhya Pradesh',
          zip_code: '457661',
          is_default: 1
        },
        created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 11).toISOString(),
        items: [
          { id: 4, order_id: 1003, product_id: 5, name: 'Sweet Mawa Kachori (Pack of 2)', price: 150.0, quantity: 1, weight: 'Pack of 2' },
          { id: 5, order_id: 1003, product_id: 1, name: 'Heritage Golden Kachori (Pack of 4)', price: 120.0, quantity: 1, weight: 'Pack of 4' }
        ],
        user_name: 'Meera Deshmukh',
        user_email: 'meera.d@outlook.com'
      },
      {
        id: 1004,
        user_id: 'customer-r4',
        total_amount: 1080.0,
        discount_amount: 150.0,
        tax_amount: 50.0,
        shipping_amount: 0.0,
        status: 'delivered',
        payment_status: 'paid',
        payment_method: 'UPI',
        transaction_id: 'TXN-UPI-456789123',
        shipping_address: {
          id: 104,
          user_id: 'customer-r4',
          street_address: '304, Royal Palms, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          zip_code: '400050',
          is_default: 1
        },
        created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 46).toISOString(),
        items: [
          { id: 6, order_id: 1004, product_id: 6, name: 'Heritage Gourmet Gifting Box', price: 450.0, quantity: 2, weight: 'Standard Gift Box' },
          { id: 7, order_id: 1004, product_id: 2, name: 'Signature 12-Spice Kachori Masala', price: 180.0, quantity: 1, weight: '500g' }
        ],
        user_name: 'Praveen Patel',
        user_email: 'praveen.p@gmail.com'
      }
    ];

    const demoUsers = [
      { id: 'user-admin-uuid-2026', name: 'Mahesvari Admin', email: 'admin@mahesvari.com', role: 'admin', phone: '+91 94254 78201' },
      { id: 'user-customer-uuid-2026', name: 'Rohan Sharma', email: 'customer@mahesvari.com', role: 'customer', phone: '+91 99887 76655' },
      { id: 'customer-r1', name: 'Ananya Hegde', email: 'ananya@gmail.com', role: 'customer', phone: '+91 88776 65544' },
      { id: 'customer-r2', name: 'Sandeep Rathore', email: 'sandeep.r@yahoo.com', role: 'customer', phone: '+91 77665 54433' },
      { id: 'customer-r3', name: 'Meera Deshmukh', email: 'meera.d@outlook.com', role: 'customer', phone: '+91 96543 21098' },
      { id: 'customer-r4', name: 'Praveen Patel', email: 'praveen.p@gmail.com', role: 'customer', phone: '+91 91234 56789' }
    ];

    const demoReviews = [
      { id: 501, product_id: 1, user_id: 'customer-r1', user_name: 'Ananya Hegde', rating: 5, comment: 'Unbelievably crispy! Shipped quickly to Bangalore. Reminded me of Jhabua street food!', created_at: new Date(Date.now() - 3600000 * 20).toISOString() },
      { id: 502, product_id: 2, user_id: 'customer-r2', user_name: 'Sandeep Rathore', rating: 5, comment: 'The spice level is perfect. 12-spice kachori masala is a masterpiece.', created_at: new Date(Date.now() - 3600000 * 5).toISOString() },
      { id: 503, product_id: 3, user_id: 'customer-r3', user_name: 'Meera Deshmukh', rating: 4, comment: 'Loved the sweet-spicy onion stuffing. Very authentic Jhabua recipe.', created_at: new Date(Date.now() - 3600000 * 2).toISOString() }
    ];

    localStorage.setItem('sb_orders', JSON.stringify(demoOrders));
    localStorage.setItem('sb_users', JSON.stringify(demoUsers));
    localStorage.setItem('sb_reviews', JSON.stringify(demoReviews));
    
    // Refresh states
    await adminFetchAnalyticsData();
    await adminFetchOrdersList();
    await adminFetchCustomersList();
    await adminFetchReviewsList();
    
    showToast('Demo transactions & customer accounts seeded successfully!', 'success');
  };

  const renderStatusBadge = (status: Order['status']) => {
    let color = 'var(--text-muted)';
    let bg = 'var(--border-light)';
    
    if (status === 'pending') { color = 'var(--color-primary)'; bg = 'rgba(5,51,22,0.1)'; }
    else if (status === 'confirmed') { color = '#3b82f6'; bg = 'rgba(59,130,246,0.1)'; }
    else if (status === 'preparing') { color = 'var(--color-secondary)'; bg = 'rgba(194,80,16,0.1)'; }
    else if (status === 'packed') { color = '#8b5cf6'; bg = 'rgba(139,92,246,0.1)'; }
    else if (status === 'out_for_delivery') { color = '#06b6d4'; bg = 'rgba(6,182,212,0.1)'; }
    else if (status === 'delivered') { color = 'var(--color-success)'; bg = 'rgba(21,128,61,0.1)'; }
    else if (status === 'cancelled') { color = '#ef4444'; bg = 'rgba(239,68,68,0.1)'; }
    else if (status === 'refunded') { color = '#f97316'; bg = 'rgba(249,115,22,0.1)'; }

    return (
      <span style={{
        backgroundColor: bg,
        color,
        padding: '4px 10px',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-display)'
      }}>
        {status === 'pending' ? 'Order Received' : status === 'out_for_delivery' ? 'Out for Delivery' : status}
      </span>
    );
  };
  
  // Modals / Product Edit Forms
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  
  // Product Form states
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCategory, setProdCategory] = useState('Kachoris');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodSpice, setProdSpice] = useState(3);
  const [prodStock, setProdStock] = useState('');
  const [prodWeights, setProdWeights] = useState('["Pack of 4", "Pack of 8"]');
  const [prodIngredients, setProdIngredients] = useState('');
  const [prodFeatured, setProdFeatured] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      adminFetchAnalyticsData();
      adminFetchOrdersList();
      adminFetchCustomersList();
      adminFetchReviewsList();
    }
  }, [user]);

  // Route security shield
  if (!user || user.role !== 'admin') {
    return (
      <main style={{ padding: '80px 0', minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '520px', textAlign: 'center' }}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            padding: '40px 30px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <ShieldAlert size={56} style={{ color: 'var(--color-secondary)' }} />
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem' }}>Administrative Shield</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Access denied. You do not possess the required secure credentials to open the administrative panels.
            </p>
            <button className="btn btn-primary" onClick={() => navigateTo('admin-login')}>
              Authenticate Admin
            </button>
          </div>
        </div>
      </main>
    );
  }

  const handleEditProductClick = (product: any) => {
    setEditingProductId(product.id);
    setProdName(product.name);
    setProdPrice(product.price.toString());
    setProdCategory(product.category);
    setProdDesc(product.description);
    setProdImage(product.image_url);
    setProdSpice(product.spice_level);
    setProdStock(product.stock_quantity.toString());
    setProdWeights(JSON.stringify(product.weight_options));
    setProdIngredients(product.ingredients);
    setProdFeatured(product.is_featured);
    setProductModalOpen(true);
  };

  const handleCreateProductClick = () => {
    setEditingProductId(null);
    setProdName('');
    setProdPrice('');
    setProdCategory('Kachoris');
    setProdDesc('');
    setProdImage('/images/golden_kachori.jpg'); // default
    setProdSpice(3);
    setProdStock('100');
    setProdWeights('["Pack of 4", "Pack of 8"]');
    setProdIngredients('Refined Wheat Flour, Spices, Oil');
    setProdFeatured(false);
    setProductModalOpen(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prodName || !prodPrice || !prodStock || !prodIngredients) {
      showToast('Please fill in all required fields.', 'warning');
      return;
    }

    let parsedWeights = [];
    try {
      parsedWeights = JSON.parse(prodWeights);
      if (!Array.isArray(parsedWeights)) throw new Error();
    } catch (e) {
      showToast('Weights option must be a valid JSON array of strings e.g. ["250g", "500g"]', 'error');
      return;
    }

    const payload = {
      name: prodName,
      price: parseFloat(prodPrice),
      category: prodCategory,
      description: prodDesc,
      image_url: prodImage,
      spice_level: prodSpice,
      stock_quantity: parseInt(prodStock),
      weight_options: parsedWeights,
      ingredients: prodIngredients,
      is_featured: prodFeatured
    };

    let success = false;
    if (editingProductId) {
      success = await adminUpdateProduct(editingProductId, payload);
    } else {
      success = await adminCreateProduct(payload);
    }

    if (success) {
      setProductModalOpen(false);
      adminFetchAnalyticsData(); // refresh low stock
    }
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm('Are you sure you want to permanently delete this product from database inventory?')) {
      const success = await adminDeleteProduct(id);
      if (success) {
        adminFetchAnalyticsData();
      }
    }
  };

  const getStatusButton = (order: Order) => {
    if (order.status === 'pending') {
      return (
        <button 
          onClick={() => adminUpdateOrderStatus(order.id, 'confirmed')}
          className="btn btn-success btn-sm"
          style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '6px', backgroundColor: '#3b82f6', color: 'white' }}
        >
          Accept Order
        </button>
      );
    }
    if (order.status === 'confirmed') {
      return (
        <button 
          onClick={() => adminUpdateOrderStatus(order.id, 'preparing')}
          className="btn btn-primary btn-sm"
          style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '6px', backgroundColor: 'var(--color-secondary)', color: 'white' }}
        >
          Start Cooking
        </button>
      );
    }
    if (order.status === 'preparing') {
      return (
        <button 
          onClick={() => adminUpdateOrderStatus(order.id, 'packed')}
          className="btn btn-sm"
          style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '6px', backgroundColor: '#8b5cf6', color: 'white', border: 'none' }}
        >
          Pack Foods
        </button>
      );
    }
    if (order.status === 'packed') {
      return (
        <button 
          onClick={() => adminUpdateOrderStatus(order.id, 'out_for_delivery')}
          className="btn btn-primary btn-sm"
          style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '6px', backgroundColor: '#06b6d4', color: 'white', border: 'none' }}
        >
          Handover Rider
        </button>
      );
    }
    if (order.status === 'out_for_delivery') {
      return (
        <button 
          onClick={() => adminUpdateOrderStatus(order.id, 'delivered')}
          className="btn btn-success btn-sm"
          style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '6px', backgroundColor: 'var(--color-success)', color: 'white' }}
        >
          Confirm Delivery
        </button>
      );
    }
    return null;
  };

  return (
    <main style={{ padding: '30px 0', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Navigation Sidebar Drawer Tab links */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '30px' }} className="admin-split-grid">
          
          {/* Navigation Panel */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden',
            height: 'fit-content'
          }}>
            
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-body)' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-secondary)', marginBottom: '4px' }}>Admin Control</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '14px' }}>Console Session Active</span>
              
              {/* Sandbox Seeder Widget */}
              <button 
                onClick={seedDemoLedger}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1.5px dashed var(--color-secondary)',
                  color: 'var(--color-secondary)',
                  fontWeight: '750',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                  boxShadow: 'var(--shadow-sm)'
                }}
                className="sandbox-btn-hover"
              >
                <RefreshCw size={12} style={{ animation: 'spin-slow 15s linear infinite' }} />
                <span>Seed Demo Ledger</span>
              </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column' }}>
              <button 
                onClick={() => setAdminTab('overview')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  background: adminTab === 'overview' ? 'rgba(217,119,6,0.05)' : 'transparent',
                  border: 'none',
                  borderLeft: adminTab === 'overview' ? '4px solid var(--color-primary)' : '4px solid transparent',
                  cursor: 'pointer',
                  fontWeight: '700',
                  textAlign: 'left',
                  color: adminTab === 'overview' ? 'var(--color-primary)' : 'var(--text-main)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9rem'
                }}
              >
                <LayoutDashboard size={18} /> Analytics Overview
              </button>

              <button 
                onClick={() => setAdminTab('products')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  background: adminTab === 'products' ? 'rgba(217,119,6,0.05)' : 'transparent',
                  border: 'none',
                  borderLeft: adminTab === 'products' ? '4px solid var(--color-primary)' : '4px solid transparent',
                  cursor: 'pointer',
                  fontWeight: '700',
                  textAlign: 'left',
                  color: adminTab === 'products' ? 'var(--color-primary)' : 'var(--text-main)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9rem'
                }}
              >
                <Package size={18} /> Manage Inventory
              </button>

              <button 
                onClick={() => setAdminTab('orders')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  background: adminTab === 'orders' ? 'rgba(217,119,6,0.05)' : 'transparent',
                  border: 'none',
                  borderLeft: adminTab === 'orders' ? '4px solid var(--color-primary)' : '4px solid transparent',
                  cursor: 'pointer',
                  fontWeight: '700',
                  textAlign: 'left',
                  color: adminTab === 'orders' ? 'var(--color-primary)' : 'var(--text-main)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9rem'
                }}
              >
                <ShoppingCart size={18} /> Dispatch Orders
              </button>

              <button 
                onClick={() => setAdminTab('customers')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  background: adminTab === 'customers' ? 'rgba(217,119,6,0.05)' : 'transparent',
                  border: 'none',
                  borderLeft: adminTab === 'customers' ? '4px solid var(--color-primary)' : '4px solid transparent',
                  cursor: 'pointer',
                  fontWeight: '700',
                  textAlign: 'left',
                  color: adminTab === 'customers' ? 'var(--color-primary)' : 'var(--text-main)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9rem'
                }}
              >
                <Users size={18} /> Customer Logs
              </button>

              <button 
                onClick={() => setAdminTab('banners')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  background: adminTab === 'banners' ? 'rgba(217,119,6,0.05)' : 'transparent',
                  border: 'none',
                  borderLeft: adminTab === 'banners' ? '4px solid var(--color-primary)' : '4px solid transparent',
                  cursor: 'pointer',
                  fontWeight: '700',
                  textAlign: 'left',
                  color: adminTab === 'banners' ? 'var(--color-primary)' : 'var(--text-main)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9rem'
                }}
              >
                <RefreshCw size={18} /> Banner Manager
              </button>

              <button 
                onClick={() => setAdminTab('reviews')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  background: adminTab === 'reviews' ? 'rgba(217,119,6,0.05)' : 'transparent',
                  border: 'none',
                  borderLeft: adminTab === 'reviews' ? '4px solid var(--color-primary)' : '4px solid transparent',
                  cursor: 'pointer',
                  fontWeight: '700',
                  textAlign: 'left',
                  color: adminTab === 'reviews' ? 'var(--color-primary)' : 'var(--text-main)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9rem'
                }}
              >
                <ShieldAlert size={18} /> Review Moderation
              </button>
            </nav>

          </div>

          {/* Tab Screen Display */}
          <div style={{ minHeight: '600px' }}>
            
            {/* OVERVIEW PANEL */}
            {adminTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                
                {/* Header with Selector Range */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--color-primary)', fontWeight: '700' }}>Analytics Dashboard</h2>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Overview of business sales, orders, and logistics pipelines.</p>
                  </div>
                  
                  {/* Styled Filter Selector Capsule */}
                  <div style={{
                    display: 'flex',
                    backgroundColor: 'var(--bg-card)',
                    padding: '4px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    {(['7d', '30d', 'ytd'] as const).map((range) => (
                      <button
                        key={range}
                        onClick={() => setAnalyticsRange(range)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: analyticsRange === range ? 'var(--color-primary)' : 'transparent',
                          color: analyticsRange === range ? 'white' : 'var(--text-muted)',
                          fontWeight: '700',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Year-to-Date'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* KPI Metrics row */}
                {adminAnalytics ? (() => {
                  const summary = (() => {
                    const { totalSales, totalOrders, totalCustomers, lowStockAlerts } = adminAnalytics.summary;
                    if (analyticsRange === '7d') {
                      return {
                        totalSales: totalOrders > 0 ? Math.round(totalSales * 0.28) + 120 : 0,
                        totalOrders: Math.max(0, Math.round(totalOrders * 0.3)),
                        totalCustomers: Math.max(0, Math.round(totalCustomers * 0.4)),
                        lowStockAlerts
                      };
                    }
                    if (analyticsRange === 'ytd') {
                      return {
                        totalSales: totalSales + (totalOrders > 0 ? 184500 : 0),
                        totalOrders: totalOrders + (totalOrders > 0 ? 248 : 0),
                        totalCustomers: totalCustomers + (totalOrders > 0 ? 54 : 0),
                        lowStockAlerts
                      };
                    }
                    return { totalSales, totalOrders, totalCustomers, lowStockAlerts };
                  })();

                  return (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '20px'
                    }} className="kpis-grid">
                      
                      <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }} className="kpi-card">
                        <div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Sales Revenue</span>
                          <span style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>₹{summary.totalSales}</span>
                        </div>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(21,128,61,0.1)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.25rem' }}>
                          ₹
                        </div>
                      </div>

                      <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }} className="kpi-card">
                        <div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Total Orders</span>
                          <span style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-display)' }}>{summary.totalOrders}</span>
                        </div>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(194,80,16,0.1)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ShoppingCart size={20} />
                        </div>
                      </div>

                      <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }} className="kpi-card">
                        <div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Customers Active</span>
                          <span style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-display)' }}>{summary.totalCustomers}</span>
                        </div>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(217,119,6,0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Users size={20} />
                        </div>
                      </div>

                      <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }} className="kpi-card">
                        <div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Low Stock Alerts</span>
                          <span style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: summary.lowStockAlerts > 0 ? 'var(--color-secondary)' : 'var(--text-main)' }}>{summary.lowStockAlerts}</span>
                        </div>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: summary.lowStockAlerts > 0 ? 'rgba(185,28,28,0.1)' : 'var(--border-light)', color: summary.lowStockAlerts > 0 ? 'var(--color-secondary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ShieldAlert size={20} />
                        </div>
                      </div>

                    </div>
                  );
                })() : (
                  <div className="spinner"></div>
                )}

                {/* Relational SVG charts and graphs */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1.6fr 1fr',
                  gap: '30px'
                }} className="charts-split">
                  
                  {/* Custom SVG Trend Graph */}
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: '800' }}>Sales Trend Analysis</h3>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Monthly Growth Revenue (INR)
                      </span>
                    </div>
                    
                    {/* SVG canvas */}
                    <div style={{ position: 'relative', height: '220px', width: '100%' }}>
                      <svg viewBox="0 0 500 200" style={{ width: '100%', height: '100%' }}>
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-secondary)" stopOpacity="0.25"/>
                            <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="0"/>
                          </linearGradient>
                        </defs>

                        {/* Grid lines */}
                        <line x1="50" y1="20" x2="480" y2="20" stroke="var(--border-light)" strokeWidth="1" />
                        <line x1="50" y1="70" x2="480" y2="70" stroke="var(--border-light)" strokeWidth="1" />
                        <line x1="50" y1="120" x2="480" y2="120" stroke="var(--border-light)" strokeWidth="1" />
                        <line x1="50" y1="170" x2="480" y2="170" stroke="var(--text-muted)" strokeWidth="1.5" />

                        {/* Area Gradient fill */}
                        <path 
                          d="M 80 160 L 160 145 L 240 110 L 320 125 L 400 85 L 400 170 L 80 170 Z" 
                          fill="url(#chartGradient)"
                        />

                        {/* Trend path line */}
                        <path 
                          d="M 80 160 L 160 145 L 240 110 L 320 125 L 400 85" 
                          fill="none" 
                          stroke="var(--color-secondary)" 
                          strokeWidth="3.5" 
                          strokeLinecap="round"
                        />

                        {/* Trend dot plots */}
                        <circle cx="80" cy="160" r="5" fill="var(--color-primary)" stroke="white" strokeWidth="1.5" />
                        <circle cx="160" cy="145" r="5" fill="var(--color-primary)" stroke="white" strokeWidth="1.5" />
                        <circle cx="240" cy="110" r="5" fill="var(--color-primary)" stroke="white" strokeWidth="1.5" />
                        <circle cx="320" cy="125" r="5" fill="var(--color-primary)" stroke="white" strokeWidth="1.5" />
                        <circle cx="400" cy="85" r="6" fill="var(--color-secondary)" stroke="white" strokeWidth="2" />

                        {/* Labels */}
                        <text x="80" y="190" fontSize="10" fill="var(--text-muted)" textAnchor="middle" fontWeight="600">Jan</text>
                        <text x="160" y="190" fontSize="10" fill="var(--text-muted)" textAnchor="middle" fontWeight="600">Feb</text>
                        <text x="240" y="190" fontSize="10" fill="var(--text-muted)" textAnchor="middle" fontWeight="600">Mar</text>
                        <text x="320" y="190" fontSize="10" fill="var(--text-muted)" textAnchor="middle" fontWeight="600">Apr</text>
                        <text x="400" y="190" fontSize="10" fill="var(--text-muted)" textAnchor="middle" fontWeight="600">May</text>
                      </svg>
                    </div>
                  </div>

                  {/* Category Breakdown Bar block */}
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px' }}>Category Sales</h3>
                    
                    {adminAnalytics ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {adminAnalytics.categoryBreakdown.map((cat) => {
                          const baseSales = adminAnalytics.summary.totalOrders > 0 ? cat.sales : 0;
                          return (
                            <div key={cat.category}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                                <span>{cat.category}</span>
                                <span style={{ color: 'var(--color-secondary)' }}>₹{baseSales}</span>
                              </div>
                              
                              {/* Bar container */}
                              <div style={{ width: '100%', height: '8px', borderRadius: '4px', backgroundColor: 'var(--bg-body)', overflow: 'hidden' }}>
                                <div style={{
                                  height: '100%',
                                  borderRadius: '4px',
                                  backgroundColor: cat.category === 'Kachoris' ? 'var(--color-primary)' : cat.category === 'Masalas' ? 'var(--color-secondary)' : 'var(--color-success)',
                                  width: `${adminAnalytics.summary.totalOrders > 0 ? Math.min(100, (cat.sales / 12000) * 100) : 0}%`,
                                  transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="spinner"></div>
                    )}
                  </div>

                </div>

                {/* Recent orders */}
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px' }}>Recent Order Logs</h3>
                  
                  {adminAnalytics && adminAnalytics.recentOrders.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                            <th style={{ padding: '12px' }}>Order ID</th>
                            <th style={{ padding: '12px' }}>Customer</th>
                            <th style={{ padding: '12px' }}>Total Amount</th>
                            <th style={{ padding: '12px' }}>Billing</th>
                            <th style={{ padding: '12px' }}>Pipeline Status</th>
                            <th style={{ padding: '12px' }}>Fulfill Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminAnalytics.recentOrders.map((o) => (
                            <tr key={o.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                              <td style={{ padding: '12px', fontWeight: '700' }}>#MC-2026-{o.id}</td>
                              <td style={{ padding: '12px' }}>{o.user_name}</td>
                              <td style={{ padding: '12px', fontWeight: '700', color: 'var(--color-secondary)' }}>₹{o.total_amount.toFixed(0)}</td>
                              <td style={{ padding: '12px' }}>
                                <span style={{
                                  backgroundColor: o.payment_status === 'paid' ? 'rgba(21,128,61,0.1)' : 'rgba(217,119,6,0.1)',
                                  color: o.payment_status === 'paid' ? 'var(--color-success)' : 'var(--color-primary)',
                                  padding: '2px 8px',
                                  borderRadius: 'var(--radius-full)',
                                  fontSize: '0.7rem',
                                  fontWeight: '700'
                                }}>
                                  {o.payment_status}
                                </span>
                              </td>
                              <td style={{ padding: '12px' }}>
                                {renderStatusBadge(o.status as any)}
                              </td>
                              <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                                {new Date(o.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No orders placed on database ledger yet. Click <strong>"Seed Demo Ledger"</strong> in the sidebar to populate interactive charts!</p>
                  )}
                </div>

              </div>
            )}

            {/* PRODUCTS TAB: INVENTORY CRUD */}
            {adminTab === 'products' && (
              <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '30px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: '800' }}>Inventory Catalog Manager</h3>
                  <button className="btn btn-primary btn-sm" onClick={handleCreateProductClick}>
                    <Plus size={16} /> Add Product
                  </button>
                </div>

                {/* Table list */}
                {adminAnalytics ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                          <th style={{ padding: '12px' }}>Product</th>
                          <th style={{ padding: '12px' }}>Category</th>
                          <th style={{ padding: '12px' }}>Price Tag</th>
                          <th style={{ padding: '12px' }}>Stock Qty</th>
                          <th style={{ padding: '12px' }}>Spice</th>
                          <th style={{ padding: '12px' }}>Featured</th>
                          <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {useApp().products.map((p) => (
                          <tr key={p.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                            <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img src={p.image_url} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                              <span style={{ fontWeight: '700' }}>{p.name}</span>
                            </td>
                            <td style={{ padding: '12px' }}>{p.category}</td>
                            <td style={{ padding: '12px', fontWeight: '700', color: 'var(--color-secondary)' }}>₹{p.price.toFixed(0)}</td>
                            <td style={{ padding: '12px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{
                                  fontWeight: '700',
                                  color: p.stock_quantity <= 15 ? 'var(--color-secondary)' : 'var(--text-main)',
                                  backgroundColor: p.stock_quantity <= 15 ? 'rgba(185,28,28,0.06)' : 'transparent',
                                  padding: p.stock_quantity <= 15 ? '2px 6px' : '0',
                                  borderRadius: '4px',
                                  width: 'fit-content'
                                }}>
                                  {p.stock_quantity}
                                </span>
                                {p.stock_quantity <= 15 && (
                                  <button
                                    onClick={async () => {
                                      await adminUpdateProduct(p.id, { ...p, stock_quantity: p.stock_quantity + 50 });
                                      adminFetchAnalyticsData();
                                    }}
                                    style={{
                                      fontSize: '0.65rem',
                                      color: 'var(--color-primary)',
                                      backgroundColor: 'rgba(21,128,61,0.08)',
                                      border: '1px solid rgba(21,128,61,0.2)',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      fontWeight: '800',
                                      cursor: 'pointer',
                                      width: 'fit-content',
                                      transition: 'all 0.2s'
                                    }}
                                    className="sandbox-btn-hover"
                                  >
                                    ⚡ Restock +50
                                  </button>
                                )}
                              </div>
                            </td>
                            <td style={{ padding: '12px' }}>{p.spice_level}/5</td>
                            <td style={{ padding: '12px' }}>
                              <span style={{ color: p.is_featured ? 'var(--color-primary)' : 'var(--text-muted)', fontWeight: '700' }}>
                                {p.is_featured ? 'YES' : 'NO'}
                              </span>
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '8px' }}>
                                <button 
                                  className="icon-btn" 
                                  onClick={() => handleEditProductClick(p)} 
                                  title="Edit Product"
                                  style={{ padding: '6px', border: '1px solid var(--border-light)' }}
                                >
                                  <Edit size={14} />
                                </button>
                                <button 
                                  className="icon-btn" 
                                  onClick={() => handleDeleteClick(p.id)} 
                                  title="Delete"
                                  style={{ padding: '6px', color: 'var(--color-secondary)', border: '1px solid var(--border-light)' }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="spinner"></div>
                )}

              </div>
            )}

            {/* ORDERS TAB: STATE CONTROLS */}
            {adminTab === 'orders' && (() => {
              const ordersIncoming = adminOrders.filter(o => o.status === 'pending' || o.status === 'confirmed');
              const ordersPreparing = adminOrders.filter(o => o.status === 'preparing' || o.status === 'packed');
              const ordersTransit = adminOrders.filter(o => o.status === 'out_for_delivery');
              const ordersCompleted = adminOrders.filter(o => o.status === 'delivered' || o.status === 'cancelled' || o.status === 'refunded');

              const renderKanbanCard = (o: Order) => (
                <div 
                  key={o.id}
                  style={{
                    backgroundColor: 'white',
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--border-light)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    position: 'relative',
                    transition: 'all 0.2s'
                  }}
                  className="category-card-hover"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '800', fontSize: '0.82rem', color: 'var(--color-primary)' }}>#MC-2026-{o.id}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {o.payment_method}
                    </span>
                  </div>

                  <div>
                    <h4 style={{ fontWeight: '750', fontSize: '0.85rem', color: 'var(--text-main)', margin: '0 0 2px 0' }}>{o.user_name}</h4>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>City: {o.shipping_address.city}</span>
                  </div>

                  {/* Items list */}
                  <div style={{ backgroundColor: 'var(--bg-body)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.75rem' }}>
                    {o.items?.map((item) => (
                      <div key={item.id} style={{ color: 'var(--text-main)', fontWeight: '600', marginBottom: '2px' }}>
                        {item.quantity} x {item.name}
                      </div>
                    ))}
                  </div>

                  {/* Pricing and Fulfill Button actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', gap: '8px' }}>
                    <span style={{ fontWeight: '800', fontSize: '0.98rem', color: 'var(--color-secondary)' }}>₹{o.total_amount.toFixed(0)}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                      {getStatusButton(o)}
                      {(o.status === 'pending' || o.status === 'preparing') && (
                        <button 
                          onClick={() => adminUpdateOrderStatus(o.id, 'cancelled')}
                          style={{
                            padding: '4px 8px',
                            fontSize: '0.68rem',
                            borderRadius: '4px',
                            backgroundColor: 'transparent',
                            color: '#ef4444',
                            border: '1px solid #fee2e2',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );

              return (
                <div style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '30px',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  
                  {/* Title and View Switcher header controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: '800' }}>Order Processing Desk</h3>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Manage live fulfillment lifecycle stages and dispatch rider handovers.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {/* Visual Switcher capsule */}
                      <div style={{
                        display: 'flex',
                        backgroundColor: 'var(--bg-body)',
                        padding: '4px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-light)'
                      }}>
                        <button 
                          onClick={() => setOrdersViewMode('kanban')}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: ordersViewMode === 'kanban' ? 'var(--color-primary)' : 'transparent',
                            color: ordersViewMode === 'kanban' ? 'white' : 'var(--text-muted)',
                            fontWeight: '700',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          🍱 Pipeline Board
                        </button>
                        <button 
                          onClick={() => setOrdersViewMode('table')}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: ordersViewMode === 'table' ? 'var(--color-primary)' : 'transparent',
                            color: ordersViewMode === 'table' ? 'white' : 'var(--text-muted)',
                            fontWeight: '700',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          📋 Ledger Table
                        </button>
                      </div>

                      <button className="icon-btn" onClick={() => adminFetchOrdersList()} title="Refresh Active Leads" style={{ padding: '8px', borderRadius: '8px' }}>
                        <RefreshCw size={16} />
                      </button>
                    </div>
                  </div>

                  {adminOrders.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon"><ShoppingCart size={30} /></div>
                      <h4 style={{ fontWeight: '700' }}>No Active Orders</h4>
                      <p style={{ fontSize: '0.85rem' }}>No orders have been submitted to the database repository yet. Click <strong>"Seed Demo Ledger"</strong> in the sidebar to add sample leads!</p>
                    </div>
                  ) : ordersViewMode === 'kanban' ? (
                    
                    /* Pipeline board cols grid */
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '20px',
                      alignItems: 'flex-start'
                    }} className="kanban-pipeline-grid">
                      
                      {/* Incoming Column */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', backgroundColor: 'var(--bg-body)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)', minHeight: '350px' }}>
                        <div style={{ borderBottom: '2.5px solid #3b82f6', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: '800', fontSize: '0.82rem', color: '#1e3a8a' }}>📥 Incoming Leads ({ordersIncoming.length})</span>
                        </div>
                        {ordersIncoming.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)', fontSize: '0.75rem', border: '1px dashed var(--border-light)', borderRadius: '8px' }}>No pending tasks</div>
                        ) : ordersIncoming.map(renderKanbanCard)}
                      </div>

                      {/* Preparation Column */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', backgroundColor: 'var(--bg-body)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)', minHeight: '350px' }}>
                        <div style={{ borderBottom: '2.5px solid #8b5cf6', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: '800', fontSize: '0.82rem', color: '#581c87' }}>🍳 Kitchen / Packing ({ordersPreparing.length})</span>
                        </div>
                        {ordersPreparing.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)', fontSize: '0.75rem', border: '1px dashed var(--border-light)', borderRadius: '8px' }}>No active cooking logs</div>
                        ) : ordersPreparing.map(renderKanbanCard)}
                      </div>

                      {/* Transit Column */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', backgroundColor: 'var(--bg-body)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)', minHeight: '350px' }}>
                        <div style={{ borderBottom: '2.5px solid #06b6d4', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: '800', fontSize: '0.82rem', color: '#164e63' }}>🚚 Out for Delivery ({ordersTransit.length})</span>
                        </div>
                        {ordersTransit.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)', fontSize: '0.75rem', border: '1px dashed var(--border-light)', borderRadius: '8px' }}>No packages in transit</div>
                        ) : ordersTransit.map(renderKanbanCard)}
                      </div>

                      {/* History Column */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', backgroundColor: 'var(--bg-body)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)', minHeight: '350px' }}>
                        <div style={{ borderBottom: '2.5px solid var(--color-success)', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: '800', fontSize: '0.82rem', color: '#14532d' }}>✅ Completed ({ordersCompleted.length})</span>
                        </div>
                        {ordersCompleted.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)', fontSize: '0.75rem', border: '1px dashed var(--border-light)', borderRadius: '8px' }}>No logs closed</div>
                        ) : ordersCompleted.map(renderKanbanCard)}
                      </div>

                    </div>
                  ) : (
                    
                    /* Standard Ledger Table view */
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                            <th style={{ padding: '12px' }}>Order ID</th>
                            <th style={{ padding: '12px' }}>Customer Details</th>
                            <th style={{ padding: '12px' }}>Items Summary</th>
                            <th style={{ padding: '12px' }}>Grand Total</th>
                            <th style={{ padding: '12px' }}>Status</th>
                            <th style={{ padding: '12px' }}>Billing</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminOrders.map((o) => (
                            <tr key={o.id} style={{ borderBottom: '1px solid var(--border-light)', verticalAlign: 'top' }}>
                              <td style={{ padding: '12px', fontWeight: '700' }}>#MC-2026-{o.id}</td>
                              <td style={{ padding: '12px' }}>
                                <span style={{ fontWeight: '700', display: 'block' }}>{o.user_name}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{o.user_email}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Phone: {o.shipping_address.street_address}</span>
                              </td>
                              <td style={{ padding: '12px', fontSize: '0.75rem' }}>
                                <ul style={{ paddingLeft: '12px', listStyle: 'square' }}>
                                  {o.items?.map((item) => (
                                    <li key={item.id}>
                                      {item.quantity} x {item.name} ({item.weight})
                                    </li>
                                  ))}
                                </ul>
                              </td>
                              <td style={{ padding: '12px', fontWeight: '700', color: 'var(--color-secondary)' }}>₹{o.total_amount.toFixed(0)}</td>
                              <td style={{ padding: '12px' }}>{renderStatusBadge(o.status)}</td>
                              <td style={{ padding: '12px' }}>
                                <span style={{
                                  backgroundColor: o.payment_status === 'paid' ? 'rgba(21,128,61,0.1)' : 'rgba(217,119,6,0.1)',
                                  color: o.payment_status === 'paid' ? 'var(--color-success)' : 'var(--color-primary)',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  fontSize: '0.7rem',
                                  fontWeight: '700'
                                }}>
                                  {o.payment_status.toUpperCase()}
                                </span>
                              </td>
                              <td style={{ padding: '12px', textAlign: 'right' }}>
                                <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '6px' }}>
                                  {getStatusButton(o)}
                                  {(o.status === 'pending' || o.status === 'preparing') && (
                                    <button 
                                      onClick={() => adminUpdateOrderStatus(o.id, 'cancelled')}
                                      className="btn btn-outline btn-sm"
                                      style={{ padding: '4px 8px', fontSize: '0.7rem', borderRadius: '4px', height: '24px', borderColor: 'gray', color: 'gray' }}
                                    >
                                      Cancel & Refund
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                </div>
              );
            })()}

            {/* CUSTOMERS TAB: METRICS */}
            {adminTab === 'customers' && (
              <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '30px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: '800', marginBottom: '24px' }}>Customer Lifetimes</h3>

                {adminCustomers.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No customer accounts registered in SQL.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                          <th style={{ padding: '12px' }}>Name</th>
                          <th style={{ padding: '12px' }}>Email Address</th>
                          <th style={{ padding: '12px' }}>Mobile Phone</th>
                          <th style={{ padding: '12px' }}>Joined Date</th>
                          <th style={{ padding: '12px', textAlign: 'center' }}>Total Fulfill Orders</th>
                          <th style={{ padding: '12px', textAlign: 'right' }}>Lifetime Spend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminCustomers.map((c) => (
                          <tr key={c.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                            <td style={{ padding: '12px', fontWeight: '700' }}>{c.name}</td>
                            <td style={{ padding: '12px' }}>{c.email}</td>
                            <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{c.phone || '+91 94254 78201'}</td>
                            <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                              {new Date(c.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center', fontWeight: '700' }}>{c.total_orders}</td>
                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: '800', color: 'var(--color-success)' }}>
                              ₹{c.total_spent.toFixed(0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* BANNER MANAGEMENT TAB */}
            {adminTab === 'banners' && (
              <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '30px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: '800' }}>Announcement Banner Manager</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Customize promotional headers and active flash coupons globally.</p>
                  </div>
                  <button 
                    onClick={() => setShowBannerForm(!showBannerForm)}
                    className="btn btn-primary btn-sm"
                  >
                    {showBannerForm ? 'Cancel Creation' : <><Plus size={16} /> Add Banner</>}
                  </button>
                </div>

                {/* Styled Inline Creation Form */}
                {showBannerForm && (
                  <div style={{
                    backgroundColor: 'var(--bg-body)',
                    border: '1.5px dashed var(--border-light)',
                    borderRadius: '10px',
                    padding: '20px',
                    marginBottom: '24px',
                    animation: 'fadeInCard 0.3s ease-out'
                  }}>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: '750', fontSize: '0.9rem', marginBottom: '14px', color: 'var(--text-main)' }}>Create Dynamic Banner</h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Banner Text Announcement:</label>
                        <input 
                          type="text"
                          placeholder="e.g. 🌱 Flat 15% Off Your Entire Cart with Coupon Code JHABUA15!"
                          value={newBannerText}
                          onChange={(e) => setNewBannerText(e.target.value)}
                          className="form-input"
                          style={{ padding: '10px' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-double-row">
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Background Theme Color:</label>
                          <select
                            value={newBannerBg}
                            onChange={(e) => setNewBannerBg(e.target.value)}
                            className="form-input"
                            style={{ padding: '10px' }}
                          >
                            <option value="var(--color-primary)">Forest Green (Emerald)</option>
                            <option value="var(--color-secondary)">Saffron Orange (Gold)</option>
                            <option value="#b91c1c">Crimson Red (Urgent Notice)</option>
                            <option value="#3b82f6">Ocean Blue (Info Banner)</option>
                          </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                          <button
                            onClick={async () => {
                              if (!newBannerText.trim()) {
                                showToast('Please enter an announcement description.', 'warning');
                                return;
                              }
                              const success = await adminCreateBanner({
                                text: newBannerText,
                                bg_color: newBannerBg,
                                text_color: '#ffffff',
                                is_active: true
                              });
                              if (success) {
                                setNewBannerText('');
                                setShowBannerForm(false);
                              }
                            }}
                            className="btn btn-primary"
                            style={{ width: '100%', borderRadius: '8px', padding: '12px' }}
                          >
                            Activate Banner
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {adminBanners.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No promotional banners defined. Feel free to add one above!</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {adminBanners.map((b) => (
                      <div key={b.id} style={{
                        padding: '20px',
                        borderRadius: '10px',
                        border: '1px solid var(--border-light)',
                        backgroundColor: 'var(--bg-body)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '16px'
                      }}>
                        <div style={{ flexGrow: 1 }}>
                          {/* Visual Banner Preview */}
                          <div style={{
                            backgroundColor: b.bg_color || 'var(--color-primary)',
                            color: b.text_color || 'white',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            marginBottom: '10px',
                            width: 'fit-content',
                            boxShadow: 'var(--shadow-sm)'
                          }}>
                            {b.text}
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                            Status: <strong style={{ color: b.is_active ? 'var(--color-success)' : 'gray' }}>{b.is_active ? 'ACTIVE (DISPLAYED)' : 'INACTIVE (PAUSED)'}</strong>
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => adminUpdateBanner(b.id, { is_active: !b.is_active })}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '8px 14px', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                          >
                            Toggle Status
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm("Permanently delete this banner?")) {
                                adminDeleteBanner(b.id);
                              }
                            }}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '8px 14px', fontSize: '0.75rem', borderRadius: '6px', color: '#ef4444', borderColor: '#fecaca' }}
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* REVIEW MODERATION TAB */}
            {adminTab === 'reviews' && (
              <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '30px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: '800', marginBottom: '24px' }}>Review Moderation</h3>

                {adminReviews.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No product reviews submitted yet.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                          <th style={{ padding: '12px' }}>Reviewer</th>
                          <th style={{ padding: '12px' }}>Rating</th>
                          <th style={{ padding: '12px' }}>Comment</th>
                          <th style={{ padding: '12px' }}>Date</th>
                          <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminReviews.map((r) => (
                          <tr key={r.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                            <td style={{ padding: '12px', fontWeight: '700' }}>{r.user_name}</td>
                            <td style={{ padding: '12px' }}>
                              <span style={{ color: 'var(--color-secondary)', fontWeight: '700' }}>
                                {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                              </span>
                            </td>
                            <td style={{ padding: '12px', fontStyle: 'italic', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              "{r.comment}"
                            </td>
                            <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                              {new Date(r.created_at || new Date()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right' }}>
                              <button
                                onClick={() => {
                                  if (window.confirm("Permanently delete this customer review from catalog?")) {
                                    adminDeleteReview(r.id);
                                  }
                                }}
                                className="btn btn-outline btn-sm"
                                style={{ padding: '4px 8px', fontSize: '0.7rem', borderRadius: '4px', color: 'red', borderColor: 'red' }}
                              >
                                Delete Review
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* DYNAMIC PRODUCT ADD / EDIT MODAL OVERLAY */}
      {productModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1500,
          padding: '20px'
        }} onClick={() => setProductModalOpen(false)}>
          
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '620px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '30px',
            border: '1px solid var(--border-light)',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            
            <button 
              onClick={() => setProductModalOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'var(--bg-body)', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '20px', color: 'var(--text-main)' }}>
              {editingProductId ? 'Edit Culinary Specifications' : 'Introduce New Gourmet Product'}
            </h3>

            <form onSubmit={handleProductSubmit}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-double-row">
                <div className="form-group">
                  <label className="form-label">Product Name:</label>
                  <input 
                    type="text" 
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category Group:</label>
                  <select 
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="form-input"
                  >
                    <option value="Kachoris">Fresh Kachoris</option>
                    <option value="Masalas">Signature Masalas</option>
                    <option value="Snacks">Traditional Snacks</option>
                    <option value="Combos">Gourmet Combos</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }} className="form-triple-row">
                <div className="form-group">
                  <label className="form-label">Base Price (₹):</label>
                  <input 
                    type="number" 
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Stock Count:</label>
                  <input 
                    type="number" 
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Spice Level (1-5):</label>
                  <input 
                    type="number" 
                    min={1}
                    max={5}
                    value={prodSpice}
                    onChange={(e) => setProdSpice(parseInt(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Product Image Asset URL:</label>
                <input 
                  type="text" 
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Weight Packaging Options (JSON Array of strings):</label>
                <input 
                  type="text" 
                  value={prodWeights}
                  onChange={(e) => setProdWeights(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description / Tagline:</label>
                <textarea 
                  rows={3}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="form-input"
                  style={{ resize: 'none' }}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Ingredients Mix:</label>
                <input 
                  type="text" 
                  value={prodIngredients}
                  onChange={(e) => setProdIngredients(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center' }}>
                <input 
                  type="checkbox" 
                  id="prod-featured"
                  checked={prodFeatured}
                  onChange={(e) => setProdFeatured(e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="prod-featured" style={{ fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>Pin to Homepage Featured Carousel</label>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: '10px', padding: '12px', marginTop: '16px' }}>
                {editingProductId ? 'Save Changes' : 'Confirm Entry'}
              </button>

            </form>
          </div>

        </div>
      )}

      {/* Embedded inline responsive styles for admin page */}
      <style>{`
        @media (max-width: 992px) {
          .admin-split-grid {
            grid-template-columns: 1fr !important;
          }
          .charts-split {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .form-double-row, .form-triple-row {
            grid-template-columns: 1fr !important;
            gap: 0px !important;
          }
        }
      `}</style>

    </main>
  );
};
