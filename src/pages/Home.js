import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { motorcyclesAPI, shopsAPI, blogAPI } from '../services/api';
import MotorcycleCard from '../components/MotorcycleCard';

const Home = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: 0,
    maxPrice: 5000,
    location: 'Siquijor',
    sort: 'featured',
    search: searchParams.get('search') || ''
  });

  const { data: motorcyclesData, isLoading, error } = useQuery({
    queryKey: ['motorcycles', filters],
    queryFn: () => motorcyclesAPI.getAll(filters),
  });

  const { data: featuredShops } = useQuery({
    queryKey: ['featuredShops'],
    queryFn: () => shopsAPI.getFeatured(),
  });

  const { data: featuredPosts } = useQuery({
    queryKey: ['featuredPosts'],
    queryFn: () => blogAPI.getFeatured(),
  });
  
  if (error) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>Error loading motorcycles</h3>
          <p>Please try again later.</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: searchParams.get('category') || '',
      search: searchParams.get('search') || ''
    }));
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: 0,
      maxPrice: 5000,
      location: 'Siquijor',
      sort: 'featured',
      search: ''
    });
  };

  const motorcycles = motorcyclesData?.data || [];
  const totalResults = motorcycles.length || 0;

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">
          🏍️ Explore Siquijor Island on Two Wheels
        </h1>
        <p className="hero-subtitle">
          Rent premium motorcycles from verified local shops. 
          Discover the mystical beauty of Siquijor at your own pace.
        </p>
      </div>

      {/* Featured Shops */}
      {featuredShops?.data && featuredShops.data.length > 0 && (
        <section className="featured-shops">
          <h2>
            ✨ Featured Verified Shops
          </h2>
          <div className="shops-grid">
            {featuredShops.data.slice(0, 3).map((shop, index) => (
              <div key={shop.id || shop._id || index} className="shop-card">
                <div className="shop-logo">
                  {shop.logo || '🏪'}
                </div>
                <h3 className="shop-name">
                  {shop.name}
                </h3>
                <p className="shop-description">
                  {shop.description?.substring(0, 100) || 'No description available'}...
                </p>
                <div className="shop-meta">
                  <span>⭐ {shop.rating}</span>
                  <span>📍 {shop.location}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Advanced Filters */}
      <div className="filters">
        <div className="filter-row">
          <div className="filter-group">
            <label>Category</label>
            <select 
              value={filters.category} 
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="scooter">Scooters</option>
              <option value="sport">Sport Bikes</option>
              <option value="cruiser">Cruisers</option>
              <option value="touring">Touring</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="range"
                min="0"
                max="5000"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value) || 0)}
              />
              <span>₱{filters.minPrice} - ₱{filters.maxPrice}</span>
              <input
                type="range"
                min="0"
                max="5000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value) || 5000)}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select 
              value={filters.sort} 
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          <div className="filter-group">
            <label>&nbsp;</label>
            <button onClick={clearFilters} className="btn btn-secondary">
              Clear Filters
            </button>
          </div>
        </div>

        <div className="filters-summary">
          <span>
            {totalResults} motorcycles found in Siquijor
          </span>
        </div>
      </div>

      {/* Motorcycles Grid */}
      {isLoading ? (
        <div className="loading">
          <div>Loading motorcycles...</div>
        </div>
      ) : motorcycles.length > 0 ? (
        <div className="products-grid">
          {motorcycles.map((motorcycle, index) => (
            <MotorcycleCard key={motorcycle.id || motorcycle._id || index} motorcycle={motorcycle} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>🔍 No motorcycles found</h3>
          <p>Try adjusting your filters or search terms</p>
          <button onClick={clearFilters} className="btn btn-primary">
            Show All Motorcycles
          </button>
        </div>
      )}

      {/* Travel Tips Section */}
      {featuredPosts?.data && featuredPosts.data.length > 0 && (
        <section className="travel-guide">
          <h2>
            📖 Siquijor Travel Guide
          </h2>
          <div className="guide-grid">
            {featuredPosts.data.map((post, index) => (
              <div key={post.id || post._id || index} className="guide-card">
                <h3 className="guide-title">
                  {post.title}
                </h3>
                <p className="guide-excerpt">
                  {post.excerpt}
                </p>
                <a 
                  href={`/blog/${post.slug}`}
                  className="guide-link"
                >
                  Read More →
                </a>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;