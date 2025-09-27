import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { shopsAPI } from '../services/api';
import MotorcycleCard from '../components/MotorcycleCard';

const ShopDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: shopData, isLoading } = useQuery({
    queryKey: ['shop', id],
    queryFn: () => shopsAPI.getById(id),
  });

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">Loading shop details...</div>
      </div>
    );
  }

  if (!shopData?.data) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>Shop not found</h3>
          <button onClick={() => navigate('/shops')} className="btn btn-primary">
            Back to Shops
          </button>
        </div>
      </div>
    );
  }

  const shop = shopData.data;
  const motorcycles = shop.motorcycles || [];

  const getVerificationBadge = () => {
    if (shop.verificationBadge === 'premium') {
      return (
        <span style={{
          background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
          color: '#333',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}>
          ✨ Premium Verified Shop
        </span>
      );
    }
    if (shop.verificationBadge === 'verified') {
      return (
        <span style={{
          background: '#d4edda',
          color: '#155724',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}>
          ✓ Verified Shop
        </span>
      );
    }
    return null;
  };

  const renderStars = (rating) => {
    const stars = Math.round(rating);
    return '⭐'.repeat(stars);
  };

  const getPaymentMethods = () => {
    if (!shop.paymentMethods || shop.paymentMethods.length === 0) return null;
    
    return shop.paymentMethods.map(method => {
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
        onClick={() => navigate('/shops')} 
        className="btn btn-secondary"
        style={{ marginBottom: '20px' }}
      >
        ← Back to Shops
      </button>

      {/* Shop Header */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          gap: '24px',
          alignItems: 'center'
        }}>
          {/* Shop Logo */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ee4d2d, #ff6b35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            color: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            {shop.logo || '🏪'}
          </div>

          {/* Shop Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
              <h1 style={{ color: '#333', margin: 0, fontSize: '32px' }}>
                {shop.name}
              </h1>
              {getVerificationBadge()}
              {shop.featured && (
                <span style={{
                  background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
                  color: '#333',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  ⭐ FEATURED
                </span>
              )}
            </div>
            
            <p style={{ color: '#666', fontSize: '16px', marginBottom: '16px', lineHeight: 1.6 }}>
              {shop.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px', color: '#666' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                📍 {shop.address || shop.location}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {renderStars(shop.rating || 0)} ({shop.totalReviews || 0} reviews)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                🏍️ {motorcycles.length} motorcycles
              </div>
            </div>
          </div>

          {/* Contact Button */}
          <div style={{ textAlign: 'center' }}>
            <a 
              href={`tel:${shop.phone}`}
              className="btn btn-primary"
              style={{ marginBottom: '8px', display: 'block' }}
            >
              📞 Call Shop
            </a>
            {shop.socialMedia?.facebook && (
              <a 
                href={`https://facebook.com/${shop.socialMedia.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ fontSize: '12px' }}
              >
                📘 Facebook
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Shop Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginBottom: '32px' }}>
        {/* Main Content */}
        <div>
          {/* Motorcycles */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>
              Available Motorcycles ({motorcycles.length})
            </h2>
            
            {motorcycles.length > 0 ? (
              <div className="products-grid">
                {motorcycles.map(motorcycle => (
                  <MotorcycleCard key={motorcycle._id} motorcycle={motorcycle} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>🏍️ No motorcycles available</h3>
                <p>This shop hasn't listed any motorcycles yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Contact Info */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '16px', color: '#333' }}>Contact Information</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📞</span>
                <a href={`tel:${shop.phone}`} style={{ color: '#ee4d2d', textDecoration: 'none' }}>
                  {shop.phone}
                </a>
              </div>
              
              {shop.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>✉️</span>
                  <a href={`mailto:${shop.email}`} style={{ color: '#ee4d2d', textDecoration: 'none' }}>
                    {shop.email}
                  </a>
                </div>
              )}
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span>📍</span>
                <span style={{ color: '#666' }}>{shop.address || shop.location}</span>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          {shop.operatingHours && (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '16px', color: '#333' }}>Operating Hours</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span>🕒</span>
                <span>{shop.operatingHours.open} - {shop.operatingHours.close}</span>
              </div>
              {shop.operatingHours.days && (
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {shop.operatingHours.days.join(', ')}
                </div>
              )}
            </div>
          )}

          {/* Payment Methods */}
          {getPaymentMethods() && (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '16px', color: '#333' }}>Payment Methods</h3>
              <div style={{ color: '#666' }}>
                {getPaymentMethods()}
              </div>
            </div>
          )}

          {/* Social Media */}
          {(shop.socialMedia?.facebook || shop.socialMedia?.instagram) && (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '16px', color: '#333' }}>Follow Us</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {shop.socialMedia.facebook && (
                  <a 
                    href={`https://facebook.com/${shop.socialMedia.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      color: '#1877f2',
                      textDecoration: 'none'
                    }}
                  >
                    📘 Facebook
                  </a>
                )}
                {shop.socialMedia.instagram && (
                  <a 
                    href={`https://instagram.com/${shop.socialMedia.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      color: '#e4405f',
                      textDecoration: 'none'
                    }}
                  >
                    📷 Instagram
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;