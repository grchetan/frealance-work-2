import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login, user, logout, navigateTo, showToast, loading } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Administrative coordinates required.');
      return;
    }

    // Attempt sign-in via Firebase auth context broker
    const success = await login(email, password);
    
    if (success) {
      // Small timeout to allow state sync and role checks
      setTimeout(async () => {
        const session = localStorage.getItem('fb_session_user');
        if (session) {
          const parsed = JSON.parse(session);
          if (parsed.role === 'admin') {
            showToast('Console session authenticated.', 'success');
            navigateTo('admin-dashboard');
          } else {
            // Shopper account attempted admin panel login -> log them out immediately!
            await logout();
            setError('Access Denied. You do not possess secure administrative roles.');
            showToast('Access Denied. Shopper accounts are blocked from command console.', 'error');
          }
        }
      }, 200);
    } else {
      setError('Invalid administrative credentials.');
    }
  };

  return (
    <main style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '85vh',
      backgroundColor: 'var(--bg-body)',
      padding: '40px 20px'
    }}>
      
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: 'var(--color-primary)', // Luxury dark forest green card backing!
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        color: 'white',
        overflow: 'hidden',
        animation: 'fadeInCard 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        
        {/* Decorative Luxury Top border bar */}
        <div style={{ height: '5px', backgroundColor: 'var(--color-secondary)' }}></div>

        {/* Portal Header */}
        <div style={{ padding: '40px 40px 20px', textAlign: 'center' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'var(--color-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            border: '1px solid rgba(255,255,255,0.15)'
          }}>
            <Shield size={26} />
          </div>
          
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: '700', letterSpacing: '-0.5px', color: 'white' }}>
            Command Console
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '4px', letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: '600' }}>
            Secure Administrative Gateway
          </p>
        </div>

        {/* Form area */}
        <div style={{ padding: '20px 40px 40px' }}>
          
          <form onSubmit={handleAdminSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {error && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#fca5a5',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Shield size={14} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group" style={{ gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>
                Console ID (Email):
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'rgba(255,255,255,0.4)' }} />
                <input 
                  type="email" 
                  placeholder="admin@mahesvari.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 38px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    color: 'white',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  className="admin-input-focus"
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>
                Gateway Code (Password):
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'rgba(255,255,255,0.4)' }} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 38px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    color: 'white',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  className="admin-input-focus"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '12px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2px'
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn"
              disabled={loading}
              style={{
                width: '100%',
                borderRadius: '8px',
                padding: '14px',
                backgroundColor: 'var(--color-secondary)',
                color: 'white',
                marginTop: '10px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <span>{loading ? 'Securing Portal Session...' : 'Authenticate Coordinates'}</span>
              <ArrowRight size={16} />
            </button>

          </form>

          {/* Secure standard tags */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '0.7rem',
            marginTop: '30px',
            fontWeight: '600'
          }}>
            <ShieldCheck size={14} style={{ color: 'var(--color-secondary)' }} />
            <span>256-BIT CRYPTOGRAPHY STANDARD SHIELD</span>
          </div>

        </div>

      </div>

      <style>{`
        .admin-input-focus:focus {
          border-color: var(--color-secondary) !important;
          background-color: rgba(0,0,0,0.4) !important;
        }
      `}</style>

    </main>
  );
};
