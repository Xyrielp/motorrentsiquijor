import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';

const MotorcycleCard = ({ motorcycle }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('Please login to add favorites');
      return;
    }
    
    toggleFavorite(motorcycle._id);
  };

  const renderStars = (rating) => {
    const stars = Math.round(rating);
    return '⭐'.repeat(stars);
  };

  const getVerificationBadge = (shop) => {
    if (!shop || shop.verificationBadge === 'premium') {
      return <span className="verification-badge premium">✨ Premium</span>;
    }
    if (shop.verificationBadge === 'verified') {
      return <span className="verification-badge verified">✓ Verified</span>;
    }
    return null;
  };

  return (
    <Link to={`/motorcycles/${motorcycle._id}`} className="product-card">
      <div className="product-image">
        <img 
          src={motorcycle.images?.[0] || '/placeholder-motorcycle.jpg'} 
          alt={motorcycle.name}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Motorcycle';
          }}
        />
        <div className="product-badge">{motorcycle.category}</div>
        <button 
          className={`favorite-btn ${isFavorite(motorcycle._id) ? 'active' : ''}`}
          onClick={handleFavoriteClick}
        >
          {isFavorite(motorcycle._id) ? '❤️' : '🤍'}
        </button>
        {motorcycle.featured && (
          <div className="featured-badge" style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
            color: '#333',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '10px',
            fontWeight: 'bold'
          }}>
            FEATURED
          </div>
        )}
      </div>
      
      <div className="product-info">
        <div className="product-title">{motorcycle.name}</div>
        <div className="shop-name">
          by {motorcycle.shop?.name}
          {getVerificationBadge(motorcycle.shop)}
        </div>
        
        <div className="product-price">
          <span className="current-price">₱{motorcycle.price}</span>
          <span className="price-period">/day</span>
        </div>
        
        <div className="product-rating">
          <span className="stars">{renderStars(motorcycle.rating || 4.5)}</span>
          <span>({motorcycle.totalReviews || 0} reviews)</span>
        </div>

        {motorcycle.deliveryAvailable && (
          <div style={{ 
            fontSize: '12px', 
            color: '#28a745', 
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            🚚 Free delivery available
          </div>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '12px',
          fontSize: '12px',
          color: '#666'
        }}>
          <span>📍 {motorcycle.location || 'Siquijor'}</span>
          {motorcycle.deposit > 0 && (
            <span>💰 ₱{motorcycle.deposit} deposit</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MotorcycleCard;