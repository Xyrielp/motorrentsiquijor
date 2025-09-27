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

  const { data: motorcyclesData, isLoading } = useQuery({
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
      <div style={{
        background: 'linear-gradient(135deg, #ee4d2d, #ff6b35)',
        color: 'white',
        padding: '40px 20px',
        borderRadius: '12px',
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>
          🏍️ Explore Siquijor Island on Two Wheels
        </h1>
        <p style={{ fontSize: '18px', opacity: 0.9 }}>
          Rent premium motorcycles from verified local shops. 
          Discover the mystical beauty of Siquijor at your own pace.
        </p>
      </div>

      {/* Featured Shops */}
      {featuredShops?.data && featuredShops.data.length > 0 && (
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>
            ✨ Featured Verified Shops
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px'
          }}>
            {featuredShops.data.slice(0, 3).map((shop, index) => (
              <div key={shop.id || shop._id || index} style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                  {shop.logo || '🏪'}
                </div>
                <h3 style={{ color: '#333', marginBottom: '8px' }}>
                  {shop.name}
                </h3>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>
                  {shop.description?.substring(0, 100) || 'No description available'}...
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '12px', color: '#666' }}>
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

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '16px',
          borderTop: '1px solid #eee'
        }}>
          <span style={{ color: '#666' }}>
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
        <section style={{ 
          marginTop: '48px', 
          padding: '32px', 
          background: 'white', 
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>
            📖 Siquijor Travel Guide
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {featuredPosts.data.map((post, index) => (
              <div key={post.id || post._id || index} style={{
                padding: '20px',
                border: '1px solid #eee',
                borderRadius: '8px'
              }}>
                <h3 style={{ color: '#333', marginBottom: '12px' }}>
                  {post.title}
                </h3>
                <p style={{ color: '#666', fontSize: '14px' }}>
                  {post.excerpt}
                </p>
                <a 
                  href={`/blog/${post.slug}`}
                  style={{ color: '#ee4d2d', fontSize: '14px', fontWeight: '500' }}
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