import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { shopsAPI } from '../services/api';

const Shops = () => {
  const { data: shopsData, isLoading } = useQuery({
    queryKey: ['shops'],
    queryFn: () => shopsAPI.getAll({ location: 'Siquijor' }),
  });

  const shops = shopsData?.data || [];

  const getVerificationBadge = (shop) => {
    if (shop.verificationBadge === 'premium') {
      return (
        <span style={{
          background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
          color: '#333',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}>
          ✨ Premium
        </span>
      );
    }
    if (shop.verificationBadge === 'verified') {
      return (
        <span style={{
          background: '#d4edda',
          color: '#155724',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}>
          ✓ Verified
        </span>
      );
    }
    return null;
  };

  const renderStars = (rating) => {
    const stars = Math.round(rating);
    return '⭐'.repeat(stars);
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">Loading shops...</div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #ee4d2d, #ff6b35)',
        color: 'white',
        padding: '40px 20px',
        borderRadius: '12px',
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>
          🏪 Trusted Motor Rental Shops in Siquijor
        </h1>
        <p style={{ fontSize: '18px', opacity: 0.9 }}>
          Choose from verified local shops with quality motorcycles and excellent service
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ee4d2d' }}>
            {shops.length}
          </div>
          <div style={{ color: '#666' }}>Active Shops</div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
            {shops.filter(shop => shop.isVerified).length}
          </div>
          <div style={{ color: '#666' }}>Verified Shops</div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffd700' }}>
            {shops.filter(shop => shop.verificationBadge === 'premium').length}
          </div>
          <div style={{ color: '#666' }}>Premium Shops</div>
        </div>
      </div>

      {/* Shops Grid */}
      {shops.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {shops.map(shop => (
            <Link 
              key={shop._id} 
              to={`/shops/${shop._id}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.2s',
                cursor: 'pointer',
                border: shop.featured ? '2px solid #ffd700' : '1px solid #f0f0f0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}>
                
                {/* Shop Banner */}
                <div style={{
                  height: '120px',
                  background: 'linear-gradient(135deg, #ee4d2d, #ff6b35)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    border: '4px solid white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    {shop.logo || '🏪'}
                  </div>
                  
                  {shop.featured && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
                      color: '#333',
                      padding: '6px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      ⭐ FEATURED
                    </div>
                  )}
                </div>

                {/* Shop Info */}
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h3 style={{ 
                      color: '#333', 
                      margin: 0, 
                      fontSize: '20px',
                      fontWeight: '600'
                    }}>
                      {shop.name}
                    </h3>
                    {getVerificationBadge(shop)}
                  </div>

                  <div style={{ 
                    color: '#666', 
                    fontSize: '14px', 
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    📍 {shop.address || shop.location}
                  </div>

                  <p style={{ 
                    color: '#666', 
                    fontSize: '14px', 
                    lineHeight: 1.5,
                    marginBottom: '16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {shop.description}
                  </p>

                  {/* Shop Stats */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '16px',
                    marginBottom: '16px',
                    padding: '16px',
                    background: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 'bold', color: '#333' }}>
                        {shop.motorcycleCount || 0}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        Motorcycles
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 'bold', color: '#333' }}>
                        {renderStars(shop.rating || 0)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {shop.rating || 0} Rating
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 'bold', color: '#333' }}>
                        {shop.totalReviews || 0}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        Reviews
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  {shop.paymentMethods && shop.paymentMethods.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                        Payment Methods:
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {shop.paymentMethods.map((method, index) => (
                          <span key={index} style={{
                            background: '#e3f2fd',
                            color: '#1976d2',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '500'
                          }}>
                            {method.type === 'gcash' && '💳 GCash'}
                            {method.type === 'paymaya' && '💳 PayMaya'}
                            {method.type === 'bank' && '🏦 Bank'}
                            {method.type === 'cash' && '💵 Cash'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Operating Hours */}
                  {shop.operatingHours && (
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#666',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      🕒 {shop.operatingHours.open} - {shop.operatingHours.close}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>🏪 No shops found</h3>
          <p>Check back later for new shops in Siquijor</p>
        </div>
      )}

      {/* Call to Action */}
      <div style={{
        background: 'white',
        padding: '32px',
        borderRadius: '12px',
        textAlign: 'center',
        marginTop: '48px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '16px', color: '#333' }}>
          Want to list your motorcycle rental business?
        </h3>
        <p style={{ color: '#666', marginBottom: '24px' }}>
          Join our platform and reach thousands of tourists visiting Siquijor Island
        </p>
        <Link to="/dashboard" className="btn btn-primary">
          Start Your Shop Today
        </Link>
      </div>
    </div>
  );
};

export default Shops;