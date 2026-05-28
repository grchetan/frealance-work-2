import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, CreditCard, Landmark, Check, ShoppingBag, Truck, CreditCard as CardIcon } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { cart, addresses, addAddress, placeOrder, loading, user, navigateTo } = useApp();
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Address, 2: Payment
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'COD'>('UPI');
  
  // Address Form States
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Madhya Pradesh');
  const [zipCode, setZipCode] = useState('');
  const [isDefault, setIsDefault] = useState(true);
  const [addressError, setAddressError] = useState('');

  // Payment Form States
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [simulatedGateway, setSimulatedGateway] = useState(false);
  const [gatewayMessage, setGatewayMessage] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (subtotal === 0) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="empty-state">
          <div className="empty-state-icon"><ShoppingBag size={38} /></div>
          <h2>Your Cart is Empty</h2>
          <p>You cannot checkout with an empty cart. Fill it with Jhabua kachoris first!</p>
          <button className="btn btn-primary" onClick={() => navigateTo('shop')}>Explore Menu</button>
        </div>
      </div>
    );
  }

  const defaultAddress = addresses.find(a => a.is_default === 1) || addresses[0];

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError('');

    if (!streetAddress || !city || !zipCode) {
      setAddressError('Please fill in all required address fields.');
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
      // Clear forms
      setStreetAddress('');
      setCity('');
      setZipCode('');
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');

    // Form Validations
    if (paymentMethod === 'CARD') {
      if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
        setPaymentError('Please fill in all credit card specifications.');
        return;
      }
      if (cardNumber.length < 15) {
        setPaymentError('Please enter a valid card number.');
        return;
      }
      if (cardCvv.length < 3) {
        setPaymentError('Please enter a valid CVV.');
        return;
      }
    } else if (paymentMethod === 'UPI') {
      if (!upiId || !upiId.includes('@')) {
        setPaymentError('Please enter a valid UPI address (e.g. name@okaxis).');
        return;
      }
    }

    // Trigger simulated premium payment gateway loader
    setSimulatedGateway(true);
    setGatewayMessage('Securing transaction tunnel...');

    setTimeout(() => {
      setGatewayMessage('Locking warehouse inventory stock...');
      
      setTimeout(() => {
        setGatewayMessage('Authorizing currency token debit...');
        
        setTimeout(async () => {
          setSimulatedGateway(false);
          const orderId = await placeOrder(paymentMethod);
          if (!orderId) {
            setPaymentError('Transaction rejected by issuing bank. Please try cash on delivery.');
          }
        }, 1500);

      }, 1500);

    }, 1200);
  };

  return (
    <main style={{ padding: '40px 0', minHeight: '80vh' }}>
      <div className="container">
        
        {/* Checkout Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--text-main)' }}>Secure Checkout</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fill in shipping records and complete payment logs.</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-success)', fontWeight: '600', fontSize: '0.85rem' }}>
            <ShieldCheck size={20} /> Encrypted SSL Gateway
          </div>
        </div>

        {/* Checkout Steps bar */}
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          marginBottom: '32px',
          backgroundColor: 'var(--bg-card)',
          padding: '12px 24px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          fontWeight: '700',
          fontFamily: 'var(--font-display)',
          fontSize: '0.9rem'
        }}>
          <span 
            onClick={() => setCheckoutStep(1)}
            style={{
              cursor: 'pointer',
              color: checkoutStep === 1 ? 'var(--color-primary)' : 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {checkoutStep > 1 ? <Check size={16} /> : '1.'} Shipping Address
          </span>
          <span style={{ color: 'var(--border-light)' }}>/</span>
          <span style={{ color: checkoutStep === 2 ? 'var(--color-primary)' : 'var(--text-muted)' }}>
            2. Payment Method
          </span>
        </div>

        {/* Lower Grid (Form Column vs Checkout invoice summary) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2.1fr 1fr',
          gap: '30px',
          alignItems: 'start'
        }} className="checkout-grid-split">
          
          {/* Active Step Form Column */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            padding: '30px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)'
          }}>

            {/* STEP 1: Address select or addition */}
            {checkoutStep === 1 && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Truck size={20} style={{ color: 'var(--color-primary)' }} />
                  <span>Delivery Destination</span>
                </h3>

                {user ? (
                  defaultAddress ? (
                    
                    /* Saved Address inspect card */
                    <div style={{ marginBottom: '30px' }}>
                      <div style={{
                        padding: '20px',
                        borderRadius: 'var(--radius-md)',
                        border: '2px solid var(--color-primary)',
                        backgroundColor: 'rgba(217,119,6,0.03)',
                        position: 'relative'
                      }}>
                        <span style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          backgroundColor: 'var(--color-primary)',
                          color: 'white',
                          fontSize: '0.65rem',
                          fontWeight: '700',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontFamily: 'var(--font-display)'
                        }}>
                          ACTIVE ADDRESS
                        </span>

                        <h4 style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '8px' }}>{user.name}</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '6px' }}>{defaultAddress.street_address}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '6px' }}>{defaultAddress.city}, {defaultAddress.state} - {defaultAddress.zip_code}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Phone: {user.phone || '+91 94254 78201'}</p>
                      </div>

                      <button 
                        className="btn btn-primary" 
                        onClick={() => setCheckoutStep(2)}
                        style={{ marginTop: '24px', width: '100%', borderRadius: '10px' }}
                      >
                        Confirm Address & Continue
                      </button>
                    </div>

                  ) : (
                    
                    /* Address Register form */
                    <form onSubmit={handleAddressSubmit}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                        You have no registered addresses. Please register a shipping address to fulfill delivery.
                      </p>

                      {addressError && <div style={{ marginBottom: '16px' }} className="form-error">{addressError}</div>}

                      <div className="form-group">
                        <label className="form-label">Street Address / House Number:</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 12, Rajwada Chowk, Near Palace Gates" 
                          value={streetAddress}
                          onChange={(e) => setStreetAddress(e.target.value)}
                          className="form-input"
                          required
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }} className="address-triple-row">
                        <div className="form-group">
                          <label className="form-label">City:</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Jhabua" 
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="form-input"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">State:</label>
                          <select 
                            value={stateName}
                            onChange={(e) => setStateName(e.target.value)}
                            className="form-input"
                          >
                            <option value="Madhya Pradesh">Madhya Pradesh</option>
                            <option value="Gujarat">Gujarat</option>
                            <option value="Rajasthan">Rajasthan</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Karnataka">Karnataka</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="form-label">ZIP Code (6 digits):</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 457661" 
                            maxLength={6}
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            className="form-input"
                            required
                          />
                        </div>
                      </div>

                      <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: '10px', marginTop: '16px' }}>
                        Register Shipping Destination
                      </button>
                    </form>

                  )
                ) : (
                  
                  /* Animate Auth login reminder */
                  <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                    <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
                      Please sign in to register your shipping details and complete your purchase.
                    </p>
                    <button className="btn btn-primary" onClick={() => navigateTo('account')}>
                      Sign In / Sign Up
                    </button>
                  </div>

                )}

              </div>
            )}

            {/* STEP 2: Payment Selector & Inputs */}
            {checkoutStep === 2 && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CardIcon size={20} style={{ color: 'var(--color-secondary)' }} />
                  <span>Choose Billing Gateway</span>
                </h3>

                <form onSubmit={handlePaymentSubmit}>
                  
                  {/* Payment method selector tabs */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '12px',
                    marginBottom: '24px'
                  }} className="payment-tabs-grid">
                    
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        border: '2px solid',
                        borderColor: paymentMethod === 'UPI' ? 'var(--color-primary)' : 'var(--border-light)',
                        backgroundColor: paymentMethod === 'UPI' ? 'rgba(217,119,6,0.03)' : 'var(--bg-card)',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        color: paymentMethod === 'UPI' ? 'var(--color-primary)' : 'var(--text-main)'
                      }}
                    >
                      <Landmark size={20} /> Instant UPI
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CARD')}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        border: '2px solid',
                        borderColor: paymentMethod === 'CARD' ? 'var(--color-primary)' : 'var(--border-light)',
                        backgroundColor: paymentMethod === 'CARD' ? 'rgba(217,119,6,0.03)' : 'var(--bg-card)',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        color: paymentMethod === 'CARD' ? 'var(--color-primary)' : 'var(--text-main)'
                      }}
                    >
                      <CreditCard size={20} /> Credit/Debit Card
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('COD')}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        border: '2px solid',
                        borderColor: paymentMethod === 'COD' ? 'var(--color-primary)' : 'var(--border-light)',
                        backgroundColor: paymentMethod === 'COD' ? 'rgba(217,119,6,0.03)' : 'var(--bg-card)',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        color: paymentMethod === 'COD' ? 'var(--color-primary)' : 'var(--text-main)'
                      }}
                    >
                      Cash on Delivery
                    </button>

                  </div>

                  {paymentError && <div style={{ marginBottom: '16px' }} className="form-error">{paymentError}</div>}

                  {/* UPI Inputs Form */}
                  {paymentMethod === 'UPI' && (
                    <div style={{ animation: 'slideInUp 0.3s ease-out' }}>
                      <div className="form-group">
                        <label className="form-label">Enter UPI Virtual Address (VPA):</label>
                        <input 
                          type="text" 
                          placeholder="e.g. sharma@okaxis" 
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="form-input"
                          required
                        />
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                        An alert push notification will be sent to your mobile UPI application to complete pay authorization.
                      </p>
                    </div>
                  )}

                  {/* Card Inputs Form */}
                  {paymentMethod === 'CARD' && (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      animation: 'slideInUp 0.3s ease-out'
                    }}>
                      <div className="form-group">
                        <label className="form-label">Cardholder Name:</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Rohan Sharma" 
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Card Number (16 Digits):</label>
                        <input 
                          type="text" 
                          placeholder="4111 2222 3333 4444" 
                          maxLength={16}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="form-input"
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                          <label className="form-label">Expiry (MM/YY):</label>
                          <input 
                            type="text" 
                            placeholder="12/28" 
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">CVV Code:</label>
                          <input 
                            type="password" 
                            placeholder="***" 
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="form-input"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* COD layout */}
                  {paymentMethod === 'COD' && (
                    <div style={{
                      padding: '16px',
                      backgroundColor: 'rgba(217,119,6,0.06)',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      border: '1px dashed var(--color-primary)',
                      animation: 'slideInUp 0.3s ease-out'
                    }}>
                      Fulfill with Cash. Please keep exact change of ₹{(subtotal * 1.05 + 40).toFixed(0)} ready on food dispatch handovers. A standard verification phone call will be made prior to cooking.
                    </div>
                  )}

                  {/* Fulfill actions */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                    <button 
                      type="button" 
                      onClick={() => setCheckoutStep(1)}
                      className="btn btn-secondary" 
                      style={{ borderRadius: '10px' }}
                    >
                      Back
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      style={{ flexGrow: 1, borderRadius: '10px' }}
                    >
                      Authorize Payment & Fulfill
                    </button>
                  </div>

                </form>
              </div>
            )}

          </div>

          {/* Checkout Invoice Summary sidebar */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: '800', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
              Checkout Invoice
            </h3>

            {/* List items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {cart.map((item) => (
                <div key={`${item.product_id}-${item.weight}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <div style={{ maxWidth: '70%' }}>
                    <span style={{ fontWeight: '600' }}>{item.quantity} x </span>
                    <span style={{ color: 'var(--text-main)' }}>{item.name}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>({item.weight})</span>
                  </div>
                  <span style={{ fontWeight: '700', color: 'var(--color-secondary)' }}>₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', marginBottom: '16px' }} />

            {/* Totals */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                <span style={{ fontWeight: '600' }}>₹{subtotal.toFixed(0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tax (5% GST):</span>
                <span style={{ fontWeight: '600' }}>₹{(subtotal * 0.05).toFixed(0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shipping Fee:</span>
                <span style={{ fontWeight: '600' }}>{subtotal > 300 ? 'FREE' : '₹40'}</span>
              </div>
              
              <hr style={{ border: 'none', borderTop: '1px dashed var(--border-light)', margin: '4px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: '800' }}>
                <span>Grand Total:</span>
                <span style={{ color: 'var(--color-secondary)' }}>₹{(subtotal * 1.05 + (subtotal > 300 ? 0 : 40)).toFixed(0)}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Simulated Premium Payment Gateway Modal Loader overlay */}
      {simulatedGateway && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          zIndex: 3000
        }}>
          <div className="spinner" style={{ width: '60px', height: '60px', borderTopColor: 'var(--color-primary)' }}></div>
          
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: '800', marginTop: '24px', letterSpacing: '1px' }}>
            Processing Transaction
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', marginTop: '8px', animation: 'float 3s ease-in-out infinite' }}>
            {gatewayMessage}
          </p>

          <div style={{
            marginTop: '30px',
            fontSize: '0.75rem',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: '600'
          }}>
            <ShieldCheck size={16} /> 256-Bit SSL Standard Encrypted Channel
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 992px) {
          .checkout-grid-split {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 580px) {
          .payment-tabs-grid {
            grid-template-columns: 1fr !important;
          }
          .address-triple-row {
            grid-template-columns: 1fr !important;
            gap: 0px !important;
          }
        }
      `}</style>

    </main>
  );
};
