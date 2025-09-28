import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { blogAPI } from '../services/api';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const { data: blogData, isLoading, error } = useQuery({
    queryKey: ['blog', selectedCategory],
    queryFn: () => blogAPI.getAll({ category: selectedCategory }),
  });
  
  if (error) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>Error loading blog posts</h3>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  const posts = blogData?.data?.posts || [];

  const categories = [
    { value: '', label: 'All Posts' },
    { value: 'travel-tips', label: 'Travel Tips' },
    { value: 'motorcycle-guides', label: 'Motorcycle Guides' },
    { value: 'siquijor-attractions', label: 'Siquijor Attractions' },
    { value: 'safety', label: 'Safety Tips' },
    { value: 'news', label: 'News & Updates' }
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'travel-tips': return '🧳';
      case 'motorcycle-guides': return '🏍️';
      case 'siquijor-attractions': return '🏝️';
      case 'safety': return '🛡️';
      case 'news': return '📰';
      default: return '📖';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'travel-tips': return '#17a2b8';
      case 'motorcycle-guides': return '#ee4d2d';
      case 'siquijor-attractions': return '#28a745';
      case 'safety': return '#ffc107';
      case 'news': return '#6f42c1';
      default: return '#6c757d';
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">Loading blog posts...</div>
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
          📖 Siquijor Travel Guide & Tips
        </h1>
        <p style={{ fontSize: '18px', opacity: 0.9 }}>
          Your complete guide to exploring Siquijor Island by motorcycle. 
          Discover hidden gems, safety tips, and local insights.
        </p>
      </div>

      {/* Category Filter */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              style={{
                background: selectedCategory === category.value ? '#ee4d2d' : 'transparent',
                color: selectedCategory === category.value ? 'white' : '#666',
                border: selectedCategory === category.value ? '1px solid #ee4d2d' : '1px solid #ddd',
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              {getCategoryIcon(category.value)} {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Posts */}
      {!selectedCategory && posts.length > 0 && (
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ marginBottom: '24px', color: '#333' }}>
            ⭐ Featured Articles
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {posts.slice(0, 3).map(post => (
              <Link 
                key={post._id} 
                to={`/blog/${post.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <article style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}>
                  
                  {post.featuredImage && (
                    <div style={{ height: '200px', overflow: 'hidden' }}>
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x200?text=Siquijor+Guide';
                        }}
                      />
                    </div>
                  )}
                  
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span style={{
                        background: getCategoryColor(post.category),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {getCategoryIcon(post.category)} {post.category.replace('-', ' ')}
                      </span>
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 style={{ 
                      color: '#333', 
                      marginBottom: '12px',
                      fontSize: '18px',
                      lineHeight: 1.4
                    }}>
                      {post.title}
                    </h3>
                    
                    <p style={{ 
                      color: '#666', 
                      fontSize: '14px', 
                      lineHeight: 1.5,
                      marginBottom: '16px'
                    }}>
                      {post.excerpt}
                    </p>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      <span>By {post.author?.name || 'MotorRent Team'}</span>
                      <span>👁️ {post.views || 0} views</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Posts */}
      <section>
        <h2 style={{ marginBottom: '24px', color: '#333' }}>
          {selectedCategory ? 
            `${getCategoryIcon(selectedCategory)} ${categories.find(c => c.value === selectedCategory)?.label}` : 
            '📚 All Articles'
          }
        </h2>
        
        {posts.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {posts.map(post => (
              <Link 
                key={post._id} 
                to={`/blog/${post.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <article style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}>
                  
                  {post.featuredImage && (
                    <div style={{ height: '160px', overflow: 'hidden' }}>
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/320x160?text=Siquijor+Guide';
                        }}
                      />
                    </div>
                  )}
                  
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{
                        background: getCategoryColor(post.category),
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {getCategoryIcon(post.category)} {post.category.replace('-', ' ')}
                      </span>
                      <span style={{ fontSize: '11px', color: '#666' }}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 style={{ 
                      color: '#333', 
                      marginBottom: '8px',
                      fontSize: '16px',
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {post.title}
                    </h3>
                    
                    <p style={{ 
                      color: '#666', 
                      fontSize: '13px', 
                      lineHeight: 1.4,
                      marginBottom: '12px',
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {post.excerpt}
                    </p>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      fontSize: '11px',
                      color: '#666',
                      marginTop: 'auto'
                    }}>
                      <span>By {post.author?.name || 'MotorRent Team'}</span>
                      <span>👁️ {post.views || 0}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>📝 No articles found</h3>
            <p>Check back later for new travel guides and tips</p>
          </div>
        )}
      </section>

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
          Ready to explore Siquijor?
        </h3>
        <p style={{ color: '#666', marginBottom: '24px' }}>
          Rent a motorcycle and discover the mystical beauty of Siquijor Island
        </p>
        <Link to="/" className="btn btn-primary">
          Browse Motorcycles
        </Link>
      </div>
    </div>
  );
};

export default Blog;