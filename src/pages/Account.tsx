import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order, Address } from '../types';
import { User as UserIcon, Lock, Mail, Phone, MapPin, Package, Clock, Eye, EyeOff, Trash2, ArrowRight, ShieldCheck, Truck, Check, Flame, CheckCircle } from 'lucide-react';

export const Account: React.FC = () => {
  const { 
    user, login, signup, logout, addresses, addAddress, deleteAddress, 
    myOrders, fetchMyOrdersList, cancelOrder, fetchOrderDetails, loading, navigateTo
  } = useApp();

  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  
  // Password Visibility States
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup Form States
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupError, setSignupError] = useState('');

  // Address Add Form States
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Madhya Pradesh');
  const [zipCode, setZipCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [addressError, setAddressError] = useState('');

  // Active tracking order state
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMyOrdersList();
    }
  }, [user]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail || !loginPassword) {
      setLoginError('Please fill in both email and password.');
      return;
    }
    const success = await login(loginEmail, loginPassword);
    if (!success) {
      setLoginError('Invalid credentials. Try customer@mahesvari.com / customer123');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    if (!signupName || !signupEmail || !signupPassword) {
      setSignupError('Please fill in all required fields.');
      return;
    }
    await signup(signupName, signupEmail, signupPassword, signupPhone);
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError('');
    if (!streetAddress || !city || !zipCode) {
      setAddressError('All address fields are required.');
      return;
    }
    if (zipCode.length !== 6 || isNaN(Number(zipCode))) {
      setAddressError('Please enter a valid 6-digit postal ZIP code.');
      return;
    }

    const success = await addAddress({
      street_address: streetAddress,
      city,
      state: stateName,
      zip_code: zipCode,
      is_default: isDefault ? 1 : 0
    });

    if (success) {
      setStreetAddress('');
      setCity('');
      setZipCode('');
      setIsDefault(false);
    }
  };

  const handleTrackOrder = async (orderId: number) => {
    setTrackingLoading(true);
    const orderDetails = await fetchOrderDetails(orderId);
    if (orderDetails) {
      setTrackingOrder(orderDetails);
      // Scroll smoothly to tracker
      setTimeout(() => {
        const el = document.getElementById('delivery-tracker');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    setTrackingLoading(false);
  };

  const handleCancelClick = async (orderId: number) => {
    if (window.confirm('Are you sure you want to cancel this order? An automatic refund will be credited back.')) {
      const success = await cancelOrder(orderId);
      if (success && trackingOrder?.id === orderId) {
        // Refresh tracker
        handleTrackOrder(orderId);
      }
    }
  };

  // Helper for tracking timeline steps
  const getTimelineProgress = (status: Order['status']) => {
    if (status === 'pending') return { fill: '0%', index: 0 };
    if (status === 'confirmed') return { fill: '20%', index: 1 };
    if (status === 'preparing') return { fill: '40%', index: 2 };
    if (status === 'packed') return { fill: '60%', index: 3 };
    if (status === 'out_for_delivery') return { fill: '80%', index: 4 };
    if (status === 'delivered') return { fill: '100%', index: 5 };
    return { fill: '0%', index: 0 }; // cancelled or fallback
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

  return (
    <main style={{ padding: '40px 0', minHeight: '80vh' }}>
      <div className="container">

        {/* Guest View: Redesigned Premium Auth Screen split layout */}
        {!user ? (
          <div className="auth-grid-container">
            
            {/* Left Column: Premium visual food brand graphics panel */}
            <div className="auth-image-panel">
              <div className="auth-image-content">
                <span style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  backgroundColor: 'rgba(245, 158, 11, 0.25)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '14px'
                }}>
                  Pure Veg Artisan Kitchen
                </span>
                <h2 className="auth-image-title">Taste of Heritage</h2>
                <p className="auth-image-desc">
                  Savor Jhabua's iconic recipe. Ground from a 12-spice secret signature blend and cooked to crispy golden perfection.
                </p>
              </div>
            </div>

            {/* Right Column: Secure Form Panel */}
            <div className="auth-form-panel">
              
              {/* Header Tabs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', textAlign: 'center', borderBottom: '1px solid var(--border-light)' }}>
                <button 
                  onClick={() => setAuthTab('login')}
                  style={{
                    padding: '18px',
                    background: authTab === 'login' ? 'transparent' : 'var(--bg-body)',
                    border: 'none',
                    fontWeight: '700',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.92rem',
                    color: authTab === 'login' ? 'var(--color-primary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    borderBottom: authTab === 'login' ? '3px solid var(--color-primary)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setAuthTab('signup')}
                  style={{
                    padding: '18px',
                    background: authTab === 'signup' ? 'transparent' : 'var(--bg-body)',
                    border: 'none',
                    fontWeight: '700',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.92rem',
                    color: authTab === 'signup' ? 'var(--color-primary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    borderBottom: authTab === 'signup' ? '3px solid var(--color-primary)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  Register
                </button>
              </div>

              {/* Form Box */}
              <div style={{ padding: '40px 30px' }}>
                {authTab === 'login' ? (
                  
                  /* Login Form with Premium Outfit font styles & custom inputs */
                  <form onSubmit={handleLoginSubmit}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '700' }}>
                      Welcome Back
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '28px', lineHeight: '1.4' }}>
                      Sign in to place active orders and track fresh hot kachoris.
                    </p>
                    
                    {loginError && <div style={{ marginBottom: '16px' }} className="form-error">{loginError}</div>}

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.72rem', letterSpacing: '0.8px' }}>Email Address:</label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                        <input 
                          type="email" 
                          placeholder="customer@mahesvari.com" 
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="form-input"
                          style={{ paddingLeft: '40px' }}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.72rem', letterSpacing: '0.8px' }}>Password:</label>
                      <div style={{ position: 'relative' }}>
                        <Lock size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                        <input 
                          type={showLoginPassword ? "text" : "password"} 
                          placeholder="customer123" 
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="form-input"
                          style={{ paddingLeft: '40px', paddingRight: '42px' }}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          style={{
                            position: 'absolute',
                            right: '14px',
                            top: '14px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2px'
                          }}
                          aria-label={showLoginPassword ? "Hide password" : "Show password"}
                        >
                          {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      style={{ 
                        width: '100%', 
                        borderRadius: '10px', 
                        marginTop: '20px', 
                        padding: '15px',
                        fontWeight: '700',
                        fontSize: '0.95rem',
                        boxShadow: '0 8px 24px rgba(10, 36, 18, 0.15)'
                      }}
                    >
                      Sign In to Account
                    </button>

                    <div style={{
                      marginTop: '24px',
                      fontSize: '0.75rem',
                      backgroundColor: 'rgba(217, 119, 6, 0.06)',
                      padding: '14px',
                      borderRadius: '8px',
                      border: '1px dashed rgba(217, 119, 6, 0.25)',
                      color: 'var(--color-secondary)',
                      lineHeight: '1.45'
                    }}>
                      <strong>Quick Demo Login Accounts:</strong><br />
                      • Customer: <span style={{ textDecoration: 'underline', fontWeight: '600' }}>customer@mahesvari.com</span> (Password: <span style={{ textDecoration: 'underline', fontWeight: '600' }}>customer123</span>)<br />
                      • Admin Control: <span style={{ textDecoration: 'underline', fontWeight: '600' }}>admin@mahesvari.com</span> (Password: <span style={{ textDecoration: 'underline', fontWeight: '600' }}>admin123</span>)
                    </div>
                  </form>

                ) : (
                  
                  /* Signup Form with Premium icons on all fields */
                  <form onSubmit={handleSignupSubmit}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '700' }}>
                      Create Account
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '28px', lineHeight: '1.4' }}>
                      Register today to unlock special 15% discount coupon checkouts.
                    </p>

                    {signupError && <div style={{ marginBottom: '16px' }} className="form-error">{signupError}</div>}

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.72rem', letterSpacing: '0.8px' }}>Full Name:</label>
                      <div style={{ position: 'relative' }}>
                        <UserIcon size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                        <input 
                          type="text" 
                          placeholder="e.g. Rohan Sharma" 
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          className="form-input"
                          style={{ paddingLeft: '40px' }}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.72rem', letterSpacing: '0.8px' }}>Email Address:</label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                        <input 
                          type="email" 
                          placeholder="e.g. rohan@gmail.com" 
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="form-input"
                          style={{ paddingLeft: '40px' }}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.72rem', letterSpacing: '0.8px' }}>Password:</label>
                      <div style={{ position: 'relative' }}>
                        <Lock size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                        <input 
                          type={showSignupPassword ? "text" : "password"} 
                          placeholder="Minimum 6 characters" 
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="form-input"
                          style={{ paddingLeft: '40px', paddingRight: '42px' }}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          style={{
                            position: 'absolute',
                            right: '14px',
                            top: '14px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2px'
                          }}
                          aria-label={showSignupPassword ? "Hide password" : "Show password"}
                        >
                          {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.72rem', letterSpacing: '0.8px' }}>Mobile Number:</label>
                      <div style={{ position: 'relative' }}>
                        <Phone size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                        <input 
                          type="tel" 
                          placeholder="e.g. +91 99887 76655" 
                          value={signupPhone}
                          onChange={(e) => setSignupPhone(e.target.value)}
                          className="form-input"
                          style={{ paddingLeft: '40px' }}
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      style={{ 
                        width: '100%', 
                        borderRadius: '10px', 
                        marginTop: '20px', 
                        padding: '15px',
                        fontWeight: '700',
                        fontSize: '0.95rem',
                        boxShadow: '0 8px 24px rgba(10, 36, 18, 0.15)'
                      }}
                    >
                      Create Secure Account
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        ) : (
          
          /* Authenticated Dashboard Panel */
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 2fr',
            gap: '40px',
            alignItems: 'start'
          }} className="account-split-grid">
            
            {/* Left Column (Profile & Address book) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              
              {/* Profile Card */}
              <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '30px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(185,28,28,0.1)',
                  color: 'var(--color-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <UserIcon size={32} />
                </div>

                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: '800', marginBottom: '4px' }}>{user.name}</h2>
                <span style={{
                  backgroundColor: user.role === 'admin' ? 'rgba(185,28,28,0.1)' : 'rgba(21,128,61,0.1)',
                  color: user.role === 'admin' ? 'var(--color-secondary)' : 'var(--color-success)',
                  fontSize: '0.7rem',
                  fontWeight: '800',
                  padding: '2px 10px',
                  borderRadius: 'var(--radius-full)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontFamily: 'var(--font-display)',
                  display: 'inline-block',
                  marginBottom: '16px'
                }}>
                  {user.role} ACCOUNT
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'left', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={14} /> <span>{user.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={14} /> <span>{user.phone || 'No phone registered'}</span>
                  </div>
                </div>

                {user.role === 'admin' && (
                  <button 
                    className="btn btn-primary" 
                    onClick={() => navigateTo('admin-dashboard')}
                    style={{ 
                      width: '100%', 
                      borderRadius: '8px', 
                      marginTop: '20px',
                      backgroundColor: 'var(--color-primary)',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(5, 51, 22, 0.2)',
                      cursor: 'pointer'
                    }}
                  >
                    🛠️ Open Admin Dashboard
                  </button>
                )}

                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={logout}
                  style={{ width: '100%', borderRadius: '8px', marginTop: '12px', color: 'var(--color-secondary)' }}
                >
                  Log Out Session
                </button>
              </div>

              {/* Address Book Manager */}
              <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '30px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={18} style={{ color: 'var(--color-primary)' }} />
                  <span>Address Book ({addresses.length})</span>
                </h3>

                {/* List saved addresses */}
                {addresses.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    {addresses.map((a) => (
                      <div key={a.id} style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: a.is_default === 1 ? 'var(--color-primary)' : 'var(--border-light)',
                        backgroundColor: a.is_default === 1 ? 'rgba(217,119,6,0.02)' : 'transparent',
                        position: 'relative'
                      }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>
                          {a.street_address} 
                          {a.is_default === 1 && (
                            <span style={{ color: 'var(--color-primary)', fontSize: '0.7rem', marginLeft: '6px' }}>[DEFAULT]</span>
                          )}
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.city}, {a.state} - {a.zip_code}</p>
                        
                        <button 
                          onClick={() => deleteAddress(a.id)}
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)'
                          }}
                          title="Remove Address"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>No shipping destinations registered.</p>
                )}

                {/* Add New address form */}
                <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', marginBottom: '20px' }} />
                
                <form onSubmit={handleAddressSubmit}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '12px' }}>Add New Shipping Address</h4>
                  
                  {addressError && <div style={{ marginBottom: '12px' }} className="form-error">{addressError}</div>}

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <input 
                      type="text" 
                      placeholder="Street Address / Area" 
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="form-input"
                      style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px', marginBottom: '12px' }}>
                    <input 
                      type="text" 
                      placeholder="City" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="form-input"
                      style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                      required
                    />
                    <input 
                      type="text" 
                      placeholder="ZIP Code" 
                      maxLength={6}
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="form-input"
                      style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '16px', flexDirection: 'row', alignItems: 'center' }}>
                    <input 
                      type="checkbox" 
                      id="make-default"
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    <label htmlFor="make-default" style={{ fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}>Make this my default shipping address</label>
                  </div>

                  <button type="submit" className="btn btn-secondary btn-sm" style={{ width: '100%', borderRadius: '8px' }}>
                    Save Address
                  </button>
                </form>

              </div>

            </div>

            {/* Right Column (Order history & tracking widgets) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              
              {/* Order History */}
              <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '30px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={20} style={{ color: 'var(--color-secondary)' }} />
                  <span>My Past Orders ({myOrders.length})</span>
                </h3>

                {loading && myOrders.length === 0 ? (
                  <div className="spinner"></div>
                ) : myOrders.length === 0 ? (
                  <div className="empty-state" style={{ padding: '30px 10px' }}>
                    <div className="empty-state-icon"><Package size={30} /></div>
                    <h4 style={{ fontWeight: '700' }}>No Orders Found</h4>
                    <p style={{ fontSize: '0.85rem' }}>You haven't placed any orders yet. Visit our hot menu to buy fresh food!</p>
                    <button className="btn btn-primary btn-sm" onClick={() => navigateTo('shop')} style={{ marginTop: '12px' }}>Explore Menu</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {myOrders.map((o) => (
                      <div key={o.id} style={{
                        padding: '16px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-light)',
                        backgroundColor: 'var(--bg-body)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}>
                        {/* Summary line */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                          <div>
                            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Order ID: </span>
                            <span style={{ fontSize: '0.8rem', fontWeight: '800', fontFamily: 'var(--font-display)' }}>#MC-2026-{o.id}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                              {new Date(o.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div>
                            {renderStatusBadge(o.status)}
                          </div>
                        </div>

                        {/* Items list */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', borderTop: '1px dashed var(--border-light)', borderBottom: '1px dashed var(--border-light)', paddingTop: '6px', paddingBottom: '6px' }}>
                          {o.items?.map((item) => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: 'var(--text-muted)' }}>{item.quantity} x {item.name} ({item.weight})</span>
                              <span style={{ fontWeight: '700' }}>₹{(item.price * item.quantity).toFixed(0)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Financial summary & Action row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Amount Paid ({o.payment_method}): </span>
                            <span style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--color-secondary)' }}>₹{o.total_amount.toFixed(0)}</span>
                          </div>

                          <div style={{ display: 'flex', gap: '8px' }}>
                            {/* Cancellation logic */}
                            {(o.status === 'pending' || o.status === 'preparing') && (
                              <button 
                                onClick={() => handleCancelClick(o.id)}
                                className="btn btn-outline btn-sm"
                                style={{ borderRadius: '6px', padding: '6px 12px', fontSize: '0.75rem', height: '32px' }}
                              >
                                Cancel Order
                              </button>
                            )}

                            {/* Tracking click */}
                            {o.status !== 'cancelled' && (
                              <button 
                                onClick={() => handleTrackOrder(o.id)}
                                className="btn btn-primary btn-sm"
                                style={{ borderRadius: '6px', padding: '6px 12px', fontSize: '0.75rem', height: '32px' }}
                              >
                                <Eye size={12} /> Track Order
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* LIVE DELIVERY TRACKING TIMELINE PANEL */}
              {trackingOrder && (
                <div id="delivery-tracker" style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '30px',
                  border: '2px solid var(--color-primary)',
                  boxShadow: 'var(--shadow-md)',
                  animation: 'slideInUp 0.4s ease-out',
                  position: 'relative'
                }}>
                  
                  {/* Close tracker cross */}
                  <button 
                    onClick={() => setTrackingOrder(null)}
                    style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'var(--bg-body)', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}
                  >
                    X
                  </button>

                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Truck size={20} style={{ color: 'var(--color-success)' }} />
                    <span>Live Fulfill Tracking</span>
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                    Order ID: MCS-2026-{trackingOrder.id} • Grand Total: ₹{trackingOrder.total_amount.toFixed(0)} • Method: {trackingOrder.payment_method}
                  </p>

                  {/* Status checklist condition */}
                  {trackingOrder.status === 'cancelled' || trackingOrder.status === 'refunded' ? (
                    <div style={{ textAlign: 'center', padding: '30px 24px', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px dashed #ef4444', borderRadius: '12px', marginBottom: '16px' }}>
                      <p style={{ fontWeight: '800', color: '#ef4444', fontSize: '1.2rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <span>Order {trackingOrder.status === 'refunded' ? 'Cancelled & Refunded' : 'Cancelled'}</span>
                      </p>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.5' }}>
                        {trackingOrder.status === 'refunded' 
                          ? 'This order has been cancelled and a full refund has been credited back to your original source of payment. Transaction ID: '
                          : 'This order was cancelled on our fulfillment database ledger. Refund details: '}
                        <strong>{trackingOrder.transaction_id || 'REF-TXN-UPI-MOCK'}</strong>.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Tracking timeline dots */}
                      <div className="timeline" style={{ margin: '40px 0', display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                        <div className="timeline-bar-fill" style={{ 
                          position: 'absolute', 
                          top: '18px', 
                          left: '0', 
                          height: '3px', 
                          backgroundColor: 'var(--color-success)', 
                          zIndex: 2, 
                          transition: 'width 0.4s ease',
                          width: getTimelineProgress(trackingOrder.status).fill 
                        }}></div>
                        
                        <div className={`timeline-step ${getTimelineProgress(trackingOrder.status).index >= 0 ? 'timeline-completed' : ''} ${trackingOrder.status === 'pending' ? 'timeline-active' : ''}`}>
                          <div className="timeline-dot"><Clock size={14} /></div>
                          <span className="timeline-label" style={{ fontSize: '0.65rem' }}>Received</span>
                        </div>

                        <div className={`timeline-step ${getTimelineProgress(trackingOrder.status).index >= 1 ? 'timeline-completed' : ''} ${trackingOrder.status === 'confirmed' ? 'timeline-active' : ''}`}>
                          <div className="timeline-dot"><CheckCircle size={14} /></div>
                          <span className="timeline-label" style={{ fontSize: '0.65rem' }}>Confirmed</span>
                        </div>

                        <div className={`timeline-step ${getTimelineProgress(trackingOrder.status).index >= 2 ? 'timeline-completed' : ''} ${trackingOrder.status === 'preparing' ? 'timeline-active' : ''}`}>
                          <div className="timeline-dot"><Flame size={14} /></div>
                          <span className="timeline-label" style={{ fontSize: '0.65rem' }}>Cooking</span>
                        </div>

                        <div className={`timeline-step ${getTimelineProgress(trackingOrder.status).index >= 3 ? 'timeline-completed' : ''} ${trackingOrder.status === 'packed' ? 'timeline-active' : ''}`}>
                          <div className="timeline-dot"><Package size={14} /></div>
                          <span className="timeline-label" style={{ fontSize: '0.65rem' }}>Packed</span>
                        </div>

                        <div className={`timeline-step ${getTimelineProgress(trackingOrder.status).index >= 4 ? 'timeline-completed' : ''} ${trackingOrder.status === 'out_for_delivery' ? 'timeline-active' : ''}`}>
                          <div className="timeline-dot"><Truck size={14} /></div>
                          <span className="timeline-label" style={{ fontSize: '0.65rem' }}>Out for Delivery</span>
                        </div>

                        <div className={`timeline-step ${trackingOrder.status === 'delivered' ? 'timeline-completed' : ''}`}>
                          <div className="timeline-dot"><Check size={14} /></div>
                          <span className="timeline-label" style={{ fontSize: '0.65rem' }}>Delivered</span>
                        </div>
                      </div>

                      {/* Descriptive logs */}
                      <div style={{
                        backgroundColor: 'var(--bg-body)',
                        padding: '18px 20px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-light)',
                        fontSize: '0.85rem'
                      }}>
                        <span style={{ fontWeight: '800', display: 'block', marginBottom: '10px', color: 'var(--text-main)', fontFamily: 'var(--font-display)', fontSize: '0.9rem' }}>Delivery Progress Specifications:</span>
                        
                        <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-muted)' }}>
                          {getTimelineProgress(trackingOrder.status).index >= 0 && (
                            <li>
                              <strong style={{ color: 'var(--text-main)' }}>Order Received:</strong> Transaction recorded on cloud ledger. Preparing raw materials in Jhabua kitchen.
                            </li>
                          )}
                          {getTimelineProgress(trackingOrder.status).index >= 1 && (
                            <li>
                              <strong style={{ color: 'var(--text-main)' }}>Confirmed:</strong> Kitchen master accepted order. Preparing slow woodfire burners.
                            </li>
                          )}
                          {getTimelineProgress(trackingOrder.status).index >= 2 && (
                            <li>
                              <strong style={{ color: 'var(--text-main)' }}>Preparing:</strong> Traditional frying pans loaded. Kachoris frying to crisp golden, chutneys packing fresh.
                            </li>
                          )}
                          {getTimelineProgress(trackingOrder.status).index >= 3 && (
                            <li>
                              <strong style={{ color: 'var(--text-main)' }}>Packed:</strong> Vacuum-packed immediately under FSSAI hygiene guidelines. Box sealed with brand tags.
                            </li>
                          )}
                          {getTimelineProgress(trackingOrder.status).index >= 4 && (
                            <li>
                              <strong style={{ color: 'var(--text-main)' }}>Out for Delivery:</strong> Dispatch rider handed box. Courier rider Suresh Kumar (+91 94254 78201) is transit-bound.
                            </li>
                          )}
                          {trackingOrder.status === 'delivered' && (
                            <li>
                              <strong style={{ color: 'var(--color-success)' }}>Delivered:</strong> Transaction completed successfully. Savor Jhabua's finest heritage gourmet food!
                            </li>
                          )}
                        </ul>
                      </div>
                    </>
                  )}

                </div>
              )}

            </div>

          </div>
        )}

      </div>
      
      <style>{`
        @media (max-width: 992px) {
          .account-split-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </main>
  );
};
