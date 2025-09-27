import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motorcyclesAPI, reviewsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';

const MotorcycleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: motorcycle, isLoading } = useQuery({
    queryKey: ['motorcycle', id],
    queryFn: () => motorcyclesAPI.getById(id),
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewsAPI.getByMotorcycle(id),
  });

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">Loading motorcycle details...</div>
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
  const reviewsList = reviews?.data || [];

  const handleBookNow = () => {
    if (!isAuthenticated) {
      alert('Please login to book a motorcycle');
      return;
    }
    navigate(`/booking/${bike.id}`);
  };

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      alert('Please login to add favorites');
      return;
    }
    toggleFavorite(bike.id);
  };

  const renderStars = (rating) => {
    const stars = Math.round(rating);
    return '⭐'.repeat(stars);
  };

  const getPaymentMethods = () => {
    const methods = bike.shop?.paymentMethods || [];
    return methods.map(method => {
      switch (method.type) {
        case 'gcash': return '💳 GCash';
        case 'paymaya': return '💳 PayMaya';
        case 'bank': return '🏦 Bank Transfer';
        case 'cash': return '💵 Cash';
        default: return method.type;
      }
    }).join(', ');
  };

  return (
    <div className="container">
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-secondary"
        style={{ marginBottom: '20px' }}
      >
        ← Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
        {/* Images */}
        <div>
          <div style={{ marginBottom: '16px' }}>
            <img
              src={bike.images?.[selectedImage] || 'https://via.placeholder.com/500x400?text=Motorcycle'}
              alt={bike.name}
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '12px'
              }}
            />
          </div>
          {bike.images && bike.images.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
              {bike.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${bike.name} ${index + 1}`}
                  onClick={() => setSelectedImage(index)}
                  style={{
                    width: '80px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    border: selectedImage === index ? '2px solid #ee4d2d' : '2px solid transparent'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h1 style={{ color: '#333', marginBottom: '8px' }}>{bike.name}</h1>
              <p style={{ color: '#666', marginBottom: '16px' }}>
                by <strong>{bike.shop?.name}</strong>
                {bike.shop?.verificationBadge === 'verified' && (
                  <span style={{ color: '#28a745', marginLeft: '8px' }}>✓ Verified</span>
                )}
                {bike.shop?.verificationBadge === 'premium' && (
                  <span style={{ color: '#ffd700', marginLeft: '8px' }}>✨ Premium</span>
                )}
              </p>
            </div>
            <button
              onClick={handleFavoriteClick}
              className={`favorite-btn ${isFavorite(bike.id) ? 'active' : ''}`}
              style={{ position: 'static', width: '48px', height: '48px', fontSize: '20px' }}
            >
              {isFavorite(bike.id) ? '❤️' : '🤍'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#ee4d2d' }}>
                ₱{bike.price}
              </span>
              <span style={{ color: '#666', marginLeft: '8px' }}>/day</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{renderStars(bike.rating || 4.5)}</span>
              <span style={{ color: '#666' }}>({bike.totalReviews || 0} reviews)</span>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '12px' }}>Description</h3>
            <p style={{ color: '#666', lineHeight: 1.6 }}>{bike.description}</p>
          </div>

          {/* Specifications */}
          {bike.specifications && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '12px' }}>Specifications</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {Object.entries(bike.specifications).map(([key, value]) => (
                  value && (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f8f9fa', borderRadius: '4px' }}>
                      <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>{key}:</span>
                      <span>{value}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {bike.features && bike.features.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '12px' }}>Features</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {bike.features.map((feature, index) => (
                  <span key={index} style={{
                    background: '#e3f2fd',
                    color: '#1976d2',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '14px'
                  }}>
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rental Info */}
          <div style={{ 
            background: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '24px' 
          }}>
            <h3 style={{ marginBottom: '16px' }}>Rental Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
              <div>📍 Location: {bike.location || 'Siquijor'}</div>
              <div>💰 Deposit: ₱{bike.deposit || 0}</div>
              <div>📅 Min Rental: {bike.minRentalDays || 1} day(s)</div>
              <div>📅 Max Rental: {bike.maxRentalDays || 30} day(s)</div>
              {bike.deliveryAvailable && (
                <>
                  <div>🚚 Delivery: Available</div>
                  <div>💵 Delivery Fee: ₱{bike.deliveryFee || 0}</div>
                </>
              )}
            </div>
            
            {getPaymentMethods() && (
              <div style={{ marginTop: '12px' }}>
                <strong>Payment Methods:</strong> {getPaymentMethods()}
              </div>
            )}
          </div>

          <button 
            onClick={handleBookNow}
            className="btn btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: '18px', fontWeight: 'bold' }}
          >
            Book Now - ₱{bike.price}/day
          </button>
        </div>
      </div>

      {/* Shop Info */}
      {bike.shop && (
        <div style={{ 
          background: 'white', 
          padding: '24px', 
          borderRadius: '12px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '32px'
        }}>
          <h3 style={{ marginBottom: '16px' }}>About {bike.shop.name}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '12px' }}>
                {bike.shop.logo || '🏪'}
              </div>
              <div style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
                ⭐ {bike.shop.rating || 0} rating
              </div>
            </div>
            <div>
              <p style={{ color: '#666', marginBottom: '16px' }}>{bike.shop.description}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                <div>📍 {bike.shop.address}</div>
                <div>📞 {bike.shop.phone}</div>
                {bike.shop.email && <div>✉️ {bike.shop.email}</div>}
                {bike.shop.operatingHours && (
                  <div>🕒 {bike.shop.operatingHours.open} - {bike.shop.operatingHours.close}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews */}
      <div style={{ 
        background: 'white', 
        padding: '24px', 
        borderRadius: '12px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '20px' }}>Reviews ({reviewsList.length})</h3>
        
        {reviewsList.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reviewsList.map(review => (
              <div key={review.id} style={{
                padding: '16px',
                border: '1px solid #eee',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <strong>{review.customer?.name || 'Anonymous'}</strong>
                    <div>{renderStars(review.rating)}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
                <p style={{ color: '#666' }}>{review.comment}</p>
                {review.helpful > 0 && (
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                    👍 {review.helpful} people found this helpful
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
            No reviews yet. Be the first to review this motorcycle!
          </p>
        )}
      </div>
    </div>
  );
};

export default MotorcycleDetails;