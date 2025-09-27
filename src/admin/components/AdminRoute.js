import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8f9fa'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#ee4d2d', marginBottom: '16px' }}>🛡️ Admin Access Required</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            Please login with admin credentials to access this area.
          </p>
          <a href="/" className="btn btn-primary">Go to Home</a>
        </div>
      </div>
    );
  }

  // Demo: Show admin access warning for non-admin users
  if (user?.role !== 'admin') {
    return (
      <div style={{ padding: '20px', textAlign: 'center', background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px', margin: '20px' }}>
        <h3>⚠️ Demo Admin Access</h3>
        <p>In production, this would require admin privileges.</p>
        <p>Current user role: {user?.role || 'customer'}</p>
        <div style={{ marginTop: '20px' }}>
          {children}
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;