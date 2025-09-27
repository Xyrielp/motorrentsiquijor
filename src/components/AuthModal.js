import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthModal = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'customer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        result = await register(formData);
      }

      if (result.success) {
        onClose();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <h3>{isLogin ? 'Welcome Back to Siquijor!' : 'Join MotorRent Siquijor'}</h3>
          
          {error && (
            <div className="error-message" style={{
              background: '#f8d7da',
              color: '#721c24',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number (e.g., +639123456789)"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="customer">Customer</option>
                <option value="shop_owner">Shop Owner</option>
              </select>
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '16px' }}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
          </button>
        </form>

        {isLogin && (
          <p style={{ textAlign: 'center', marginTop: '16px', color: '#666' }}>
            New to Siquijor? 
            <button 
              onClick={() => setIsLogin(false)}
              style={{ background: 'none', border: 'none', color: '#ee4d2d', cursor: 'pointer', marginLeft: '4px' }}
            >
              Create an account
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthModal;