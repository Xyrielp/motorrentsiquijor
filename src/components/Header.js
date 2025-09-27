import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import AuthModal from './AuthModal';

const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, isAuthenticated } = useAuth();
  const { favoritesCount } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="header">
        <div className="header-top">
          <div className="container">
            <div className="header-content">
              <div className="logo">
                <Link to="/">
                  <h1>🏍️ MotorRent Siquijor</h1>
                </Link>
              </div>
              
              <form className="search-container" onSubmit={handleSearch}>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search motorcycles, shops, or locations in Siquijor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-btn">
                  🔍
                </button>
              </form>

              <div className="header-actions">
                {isAuthenticated ? (
                  <>
                    <Link to="/favorites" className="btn btn-secondary">
                      ❤️ Favorites {favoritesCount > 0 && `(${favoritesCount})`}
                    </Link>
                    <div className="user-menu">
                      <span>Hi, {user?.name || 'User'}</span>
                      <button onClick={handleLogout} className="btn btn-secondary">
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <button 
                    onClick={() => setShowAuthModal(true)} 
                    className="btn btn-success"
                  >
                    Login / Register
                  </button>
                )}
                <Link to="/dashboard" className="btn btn-primary">
                  Dashboard
                </Link>
                {isAuthenticated && user?.role === 'admin' && (
                  <Link to="/admin" className="btn" style={{ background: '#dc3545', color: 'white' }}>
                    Admin
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <nav className="nav-bar">
          <div className="container">
            <div className="nav-links">
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                All Motorcycles
              </Link>
              <Link 
                to="/shops" 
                className={`nav-link ${isActive('/shops') ? 'active' : ''}`}
              >
                All Shops
              </Link>
              <Link 
                to="/?category=scooter" 
                className={`nav-link ${location.search.includes('category=scooter') ? 'active' : ''}`}
              >
                Scooters
              </Link>
              <Link 
                to="/?category=sport" 
                className={`nav-link ${location.search.includes('category=sport') ? 'active' : ''}`}
              >
                Sport Bikes
              </Link>
              <Link 
                to="/?category=cruiser" 
                className={`nav-link ${location.search.includes('category=cruiser') ? 'active' : ''}`}
              >
                Cruisers
              </Link>
              <Link 
                to="/blog" 
                className={`nav-link ${isActive('/blog') ? 'active' : ''}`}
              >
                Travel Guide
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
};

export default Header;