import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motorcyclesAPI, bookingsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    customerInfo: {
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      address: ''
    },
    paymentMethod: 'gcash',
    specialRequests: '',
    pickupLocation: 'shop'
  });
  
  const [totalDays, setTotalDays] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [errors, setErrors] = useState({});

  const { data: motorcycle, isLoading } = useQuery({
    queryKey: ['motorcycle', id],
    queryFn: () => motorcyclesAPI.getById(id),
  });

  const createBookingMutation = useMutation({
    mutationFn: (data) => bookingsAPI.create(data),
    onSuccess: (response) => {
      const booking = response.data;
      alert(`Booking confirmed! Your confirmation code is: ${booking.confirmationCode}`);
      navigate('/');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Booking failed');
    }
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (bookingData.startDate && bookingData.endDate) {
      const start = new Date(bookingData.startDate);
      const end = new Date(bookingData.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      
      if (days > 0) {
        setTotalDays(days);
        const bike = motorcycle?.data;
        if (bike) {
          const baseCost = days * bike.price;
          const deliveryFee = bike.deliveryAvailable && bookingData.pickupLocation !== 'shop' ? bike.deliveryFee : 0;
          setTotalCost(baseCost + deliveryFee);
        }
      } else {
        setTotalDays(0);
        setTotalCost(0);
      }
    }
  }, [bookingData.startDate, bookingData.endDate, bookingData.pickupLocation, motorcycle]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('customerInfo.')) {
      const field = name.split('.')[1];
      setBookingData(prev => ({
        ...prev,
        customerInfo: {
          ...prev.customerInfo,
          [field]: value
        }
      }));
    } else {
      setBookingData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!bookingData.startDate) newErrors.startDate = 'Start date is required';
    if (!bookingData.endDate) newErrors.endDate = 'End date is required';
    if (!bookingData.customerInfo.name) newErrors['customerInfo.name'] = 'Name is required';
    if (!bookingData.customerInfo.phone) newErrors['customerInfo.phone'] = 'Phone is required';
    if (!bookingData.customerInfo.email) newErrors['customerInfo.email'] = 'Email is required';
    if (!bookingData.paymentMethod) newErrors.paymentMethod = 'Payment method is required';
    
    if (bookingData.startDate && bookingData.endDate) {
      const start = new Date(bookingData.startDate);
      const end = new Date(bookingData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (start < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
      
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const submissionData = {
      motorcycleId: id,
      ...bookingData
    };
    
    createBookingMutation.mutate(submissionData);
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">Loading booking details...</div>
      </div>
    );
  }

  if (!motorcycle?.data) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>Motorcycle not found</h3>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const bike = motorcycle.data;
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container">
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-secondary"
        style={{ marginBottom: '20px' }}
      >
        ← Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
        {/* Booking Form */}
        <div style={{ 
          background: 'white', 
          padding: '32px', 
          borderRadius: '12px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
        }}>
          <h2 style={{ marginBottom: '24px' }}>Book Your Motorcycle</h2>
          
          <form onSubmit={handleSubmit}>
            {/* Rental Dates */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={bookingData.startDate}
                  onChange={handleInputChange}
                  min={today}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: errors.startDate ? '1px solid #dc3545' : '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
                {errors.startDate && (
                  <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                    {errors.startDate}
                  </div>
                )}
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={bookingData.endDate}
                  onChange={handleInputChange}
                  min={bookingData.startDate || today}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: errors.endDate ? '1px solid #dc3545' : '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
                {errors.endDate && (
                  <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                    {errors.endDate}
                  </div>
                )}
              </div>
            </div>

            {/* Customer Information */}
            <h3 style={{ marginBottom: '16px' }}>Contact Information</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customerInfo.name"
                  value={bookingData.customerInfo.name}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: errors['customerInfo.name'] ? '1px solid #dc3545' : '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
                {errors['customerInfo.name'] && (
                  <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                    {errors['customerInfo.name']}
                  </div>
                )}
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="customerInfo.phone"
                  value={bookingData.customerInfo.phone}
                  onChange={handleInputChange}
                  placeholder="+639123456789"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: errors['customerInfo.phone'] ? '1px solid #dc3545' : '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
                {errors['customerInfo.phone'] && (
                  <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                    {errors['customerInfo.phone']}
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Email Address *
              </label>
              <input
                type="email"
                name="customerInfo.email"
                value={bookingData.customerInfo.email}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: errors['customerInfo.email'] ? '1px solid #dc3545' : '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
              {errors['customerInfo.email'] && (
                <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                  {errors['customerInfo.email']}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Address in Siquijor
              </label>
              <input
                type="text"
                name="customerInfo.address"
                value={bookingData.customerInfo.address}
                onChange={handleInputChange}
                placeholder="Hotel name or address where you're staying"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>

            {/* Pickup/Delivery */}
            <h3 style={{ marginBottom: '16px' }}>Pickup & Delivery</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Pickup Location
              </label>
              <select
                name="pickupLocation"
                value={bookingData.pickupLocation}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <option value="shop">Pick up at shop</option>
                {bike.deliveryAvailable && (
                  <option value="delivery">Delivery to my location (₱{bike.deliveryFee || 0})</option>
                )}
              </select>
            </div>

            {/* Payment Method */}
            <h3 style={{ marginBottom: '16px' }}>Payment Method</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <select
                name="paymentMethod"
                value={bookingData.paymentMethod}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: errors.paymentMethod ? '1px solid #dc3545' : '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <option value="gcash">💳 GCash</option>
                <option value="paymaya">💳 PayMaya</option>
                <option value="bank">🏦 Bank Transfer</option>
                <option value="cash">💵 Cash (Pay at pickup)</option>
              </select>
              {errors.paymentMethod && (
                <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                  {errors.paymentMethod}
                </div>
              )}
            </div>

            {/* Special Requests */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Special Requests
              </label>
              <textarea
                name="specialRequests"
                value={bookingData.specialRequests}
                onChange={handleInputChange}
                placeholder="Any special requests or requirements..."
                rows="3"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  resize: 'vertical'
                }}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={createBookingMutation.isLoading}
              style={{ 
                width: '100%', 
                padding: '16px', 
                fontSize: '18px', 
                fontWeight: 'bold' 
              }}
            >
              {createBookingMutation.isLoading ? 'Processing...' : `Confirm Booking - ₱${totalCost}`}
            </button>
          </form>
        </div>

        {/* Booking Summary */}
        <div style={{ 
          background: 'white', 
          padding: '24px', 
          borderRadius: '12px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          height: 'fit-content'
        }}>
          <h3 style={{ marginBottom: '20px' }}>Booking Summary</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <img
              src={bike.images?.[0] || 'https://via.placeholder.com/200x150?text=Motorcycle'}
              alt={bike.name}
              style={{
                width: '100%',
                height: '150px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '12px'
              }}
            />
            <h4 style={{ marginBottom: '8px' }}>{bike.name}</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>by {bike.shop?.name}</p>
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Daily Rate:</span>
              <span>₱{bike.price}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Duration:</span>
              <span>{totalDays} day{totalDays !== 1 ? 's' : ''}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Subtotal:</span>
              <span>₱{totalDays * bike.price}</span>
            </div>

            {bike.deliveryAvailable && bookingData.pickupLocation === 'delivery' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Delivery Fee:</span>
                <span>₱{bike.deliveryFee || 0}</span>
              </div>
            )}

            {bike.deposit > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#666', fontSize: '14px' }}>
                <span>Security Deposit:</span>
                <span>₱{bike.deposit}</span>
              </div>
            )}

            <div style={{ 
              borderTop: '1px solid #eee', 
              paddingTop: '12px', 
              display: 'flex', 
              justifyContent: 'space-between',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#ee4d2d'
            }}>
              <span>Total:</span>
              <span>₱{totalCost}</span>
            </div>

            {bike.deposit > 0 && (
              <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                * Security deposit of ₱{bike.deposit} will be collected separately and refunded after return.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;