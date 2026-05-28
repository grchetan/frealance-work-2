import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, ShoppingCart, Users, Package, ShieldAlert, Plus, Edit, Trash2, Check, RefreshCw, X, ArrowUpRight } from 'lucide-react';
import { Order } from '../types';

export const AdminDashboard: React.FC = () => {
  const { 
    user, adminOrders, adminCustomers, adminAnalytics, 
    adminFetchOrdersList, adminUpdateOrderStatus, adminFetchAnalyticsData, 
    adminCreateProduct, adminUpdateProduct, adminDeleteProduct, adminFetchCustomersList,
    navigateTo, showToast
  } = useApp();

  const [adminTab, setAdminTab] = useState<'overview' | 'products' | 'orders' | 'customers'>('overview');

  const renderStatusBadge = (status: Order['status']) => {
    let color = 'var(--text-muted)';
    let bg = 'var(--border-light)';
    
    if (status === 'pending') { color = 'var(--color-primary)'; bg = 'rgba(217,119,6,0.1)'; }
    else if (status === 'preparing') { color = 'var(--color-secondary)'; bg = 'rgba(185,28,28,0.1)'; }
    else if (status === 'dispatched') { color = '#3b82f6'; bg = 'rgba(59,130,246,0.1)'; }
    else if (status === 'delivered') { color = 'var(--color-success)'; bg = 'rgba(21,128,61,0.1)'; }
    else if (status === 'cancelled') { color = 'gray'; bg = 'rgba(0,0,0,0.05)'; }

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
        {status}
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
          onClick={() => adminUpdateOrderStatus(order.id, 'preparing')}
          className="btn btn-success btn-sm"
          style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '6px' }}
        >
          Accept Order
        </button>
      );
    }
    if (order.status === 'preparing') {
      return (
        <button 
          onClick={() => adminUpdateOrderStatus(order.id, 'dispatched')}
          className="btn btn-primary btn-sm"
          style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '6px' }}
        >
          Dispatch Order
        </button>
      );
    }
    if (order.status === 'dispatched') {
      return (
        <button 
          onClick={() => adminUpdateOrderStatus(order.id, 'delivered')}
          className="btn btn-success btn-sm"
          style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '6px' }}
        >
          Complete Delivery
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
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-secondary)' }}>Admin Control</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Console Session Active</span>
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
            </nav>

          </div>

          {/* Tab Screen Display */}
          <div style={{ minHeight: '600px' }}>
            
            {/* OVERVIEW PANEL */}
            {adminTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                
                {/* KPI Metrics row */}
                {adminAnalytics ? (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px'
                  }} className="kpis-grid">
                    
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Sales Revenue</span>
                        <span style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-display)' }}>₹{adminAnalytics.summary.totalSales}</span>
                      </div>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(21,128,61,0.1)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        ₹
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Total Orders</span>
                        <span style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-display)' }}>{adminAnalytics.summary.totalOrders}</span>
                      </div>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(185,28,28,0.1)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShoppingCart size={22} />
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Customers Active</span>
                        <span style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-display)' }}>{adminAnalytics.summary.totalCustomers}</span>
                      </div>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(217,119,6,0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={22} />
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Low Stock Alerts</span>
                        <span style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: adminAnalytics.summary.lowStockAlerts > 0 ? 'var(--color-secondary)' : 'var(--text-main)' }}>{adminAnalytics.summary.lowStockAlerts}</span>
                      </div>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: adminAnalytics.summary.lowStockAlerts > 0 ? 'rgba(185,28,28,0.1)' : 'var(--border-light)', color: adminAnalytics.summary.lowStockAlerts > 0 ? 'var(--color-secondary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldAlert size={22} />
                      </div>
                    </div>

                  </div>
                ) : (
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
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px' }}>Sales Trend Analysis</h3>
                    
                    {/* SVG canvas */}
                    <div style={{ position: 'relative', height: '220px', width: '100%' }}>
                      <svg viewBox="0 0 500 200" style={{ width: '100%', height: '100%' }}>
                        {/* Grid lines */}
                        <line x1="50" y1="20" x2="480" y2="20" stroke="var(--border-light)" strokeWidth="1" />
                        <line x1="50" y1="70" x2="480" y2="70" stroke="var(--border-light)" strokeWidth="1" />
                        <line x1="50" y1="120" x2="480" y2="120" stroke="var(--border-light)" strokeWidth="1" />
                        <line x1="50" y1="170" x2="480" y2="170" stroke="var(--text-muted)" strokeWidth="1.5" />

                        {/* Trend path line */}
                        <path 
                          d="M 80 160 L 160 145 L 240 110 L 320 125 L 400 85" 
                          fill="none" 
                          stroke="var(--color-primary)" 
                          strokeWidth="3.5" 
                          strokeLinecap="round"
                        />

                        {/* Trend dot plots */}
                        <circle cx="80" cy="160" r="5" fill="var(--color-secondary)" />
                        <circle cx="160" cy="145" r="5" fill="var(--color-secondary)" />
                        <circle cx="240" cy="110" r="5" fill="var(--color-secondary)" />
                        <circle cx="320" cy="125" r="5" fill="var(--color-secondary)" />
                        <circle cx="400" cy="85" r="6" fill="var(--color-secondary)" />

                        {/* Labels */}
                        <text x="80" y="190" fontSize="10" fill="var(--text-muted)" textAnchor="middle">Jan</text>
                        <text x="160" y="190" fontSize="10" fill="var(--text-muted)" textAnchor="middle">Feb</text>
                        <text x="240" y="190" fontSize="10" fill="var(--text-muted)" textAnchor="middle">Mar</text>
                        <text x="320" y="190" fontSize="10" fill="var(--text-muted)" textAnchor="middle">Apr</text>
                        <text x="400" y="190" fontSize="10" fill="var(--text-muted)" textAnchor="middle">May</text>
                      </svg>
                    </div>
                  </div>

                  {/* Category Breakdown Bar block */}
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px' }}>Category Sales</h3>
                    
                    {adminAnalytics ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {adminAnalytics.categoryBreakdown.map((cat) => (
                          <div key={cat.category}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                              <span>{cat.category}</span>
                              <span style={{ color: 'var(--color-secondary)' }}>₹{cat.sales}</span>
                            </div>
                            
                            {/* Bar container */}
                            <div style={{ width: '100%', height: '8px', borderRadius: '4px', backgroundColor: 'var(--bg-body)', overflow: 'hidden' }}>
                              <div style={{
                                height: '100%',
                                borderRadius: '4px',
                                backgroundColor: cat.category === 'Kachoris' ? 'var(--color-primary)' : cat.category === 'Masalas' ? 'var(--color-secondary)' : 'var(--color-success)',
                                width: `${Math.min(100, (cat.sales / 30000) * 100)}%`
                              }}></div>
                            </div>
                          </div>
                        ))}
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
                                <span style={{ fontWeight: '700', color: o.status === 'delivered' ? 'var(--color-success)' : o.status === 'cancelled' ? 'gray' : 'var(--color-primary)' }}>
                                  {o.status.toUpperCase()}
                                </span>
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
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No orders placed on database ledger yet.</p>
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
                        {/* We use global context products catalog list */}
                        {adminAnalytics.lowStockProducts.concat(
                          // map products to fill gaps
                          []
                        ).length === 0 ? (
                          // Fallback to active catalog products
                          adminTab === 'products' && (
                            <>
                              {useApp().products.map((p) => (
                                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                  <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <img src={p.image_url} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                                    <span style={{ fontWeight: '700' }}>{p.name}</span>
                                  </td>
                                  <td style={{ padding: '12px' }}>{p.category}</td>
                                  <td style={{ padding: '12px', fontWeight: '700', color: 'var(--color-secondary)' }}>₹{p.price.toFixed(0)}</td>
                                  <td style={{ padding: '12px' }}>
                                    <span style={{
                                      fontWeight: '700',
                                      color: p.stock_quantity <= 15 ? 'var(--color-secondary)' : 'var(--text-main)',
                                      backgroundColor: p.stock_quantity <= 15 ? 'rgba(185,28,28,0.06)' : 'transparent',
                                      padding: p.stock_quantity <= 15 ? '2px 6px' : '0',
                                      borderRadius: '4px'
                                    }}>
                                      {p.stock_quantity}
                                    </span>
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
                            </>
                          )
                        ) : (
                          // Fallback spacer
                          null
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="spinner"></div>
                )}

              </div>
            )}

            {/* ORDERS TAB: STATE CONTROLS */}
            {adminTab === 'orders' && (
              <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '30px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: '800' }}>Order Processing Desk</h3>
                  <button className="icon-btn" onClick={() => adminFetchOrdersList()} title="Refresh Orders List">
                    <RefreshCw size={16} />
                  </button>
                </div>

                {adminOrders.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon"><ShoppingCart size={30} /></div>
                    <h4 style={{ fontWeight: '700' }}>No Active Orders</h4>
                    <p style={{ fontSize: '0.85rem' }}>No orders have been submitted to the database repository yet.</p>
                  </div>
                ) : (
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
            )}

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
