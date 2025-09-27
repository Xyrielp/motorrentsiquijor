import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { blogAPI } from '../services/api';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: postData, isLoading } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: () => blogAPI.getBySlug(slug),
  });

  const { data: relatedPosts } = useQuery({
    queryKey: ['relatedPosts'],
    queryFn: () => blogAPI.getFeatured(),
  });

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">Loading article...</div>
      </div>
    );
  }

  if (!postData?.data) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>Article not found</h3>
          <button onClick={() => navigate('/blog')} className="btn btn-primary">
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  const post = postData.data;
  const related = relatedPosts?.data?.filter(p => p._id !== post._id).slice(0, 3) || [];

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

  return (
    <div className="container">
      <button 
        onClick={() => navigate('/blog')} 
        className="btn btn-secondary"
        style={{ marginBottom: '20px' }}
      >
        ← Back to Blog
      </button>

      <article style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        marginBottom: '40px'
      }}>
        {/* Featured Image */}
        {post.featuredImage && (
          <div style={{ height: '400px', overflow: 'hidden' }}>
            <img
              src={post.featuredImage}
              alt={post.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x400?text=Siquijor+Guide';
              }}
            />
          </div>
        )}

        <div style={{ padding: '40px' }}>
          {/* Article Header */}
          <header style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{
                background: getCategoryColor(post.category),
                color: 'white',
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}>
                {getCategoryIcon(post.category)} {post.category.replace('-', ' ')}
              </span>
              <span style={{ fontSize: '14px', color: '#666' }}>
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span style={{ fontSize: '14px', color: '#666' }}>
                👁️ {post.views || 0} views
              </span>
            </div>

            <h1 style={{ 
              color: '#333', 
              fontSize: '36px',
              lineHeight: 1.2,
              marginBottom: '16px'
            }}>
              {post.title}
            </h1>

            <p style={{ 
              color: '#666', 
              fontSize: '18px', 
              lineHeight: 1.6,
              marginBottom: '20px'
            }}>
              {post.excerpt}
            </p>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #eee'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ee4d2d, #ff6b35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  {(post.author?.name || 'MT')[0]}
                </div>
                <div>
                  <div style={{ fontWeight: '500', color: '#333' }}>
                    {post.author?.name || 'MotorRent Team'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Travel Expert
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div style={{
            color: '#333',
            fontSize: '16px',
            lineHeight: 1.8,
            marginBottom: '40px'
          }}>
            {/* This would normally render markdown or rich text */}
            <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br><br>') }} />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ marginBottom: '12px', color: '#333' }}>Tags</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {post.tags.map((tag, index) => (
                  <span key={index} style={{
                    background: '#f8f9fa',
                    color: '#666',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    border: '1px solid #e9ecef'
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Motorcycles */}
          {post.relatedMotorcycles && post.relatedMotorcycles.length > 0 && (
            <div style={{
              background: '#f8f9fa',
              padding: '24px',
              borderRadius: '8px',
              marginBottom: '32px'
            }}>
              <h4 style={{ marginBottom: '16px', color: '#333' }}>
                🏍️ Recommended Motorcycles for This Trip
              </h4>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {post.relatedMotorcycles.map(motorcycle => (
                  <Link 
                    key={motorcycle._id}
                    to={`/motorcycles/${motorcycle._id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: 'white',
                      padding: '12px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: '#333',
                      border: '1px solid #e9ecef',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <img
                      src={motorcycle.images?.[0] || 'https://via.placeholder.com/60x40?text=Bike'}
                      alt={motorcycle.name}
                      style={{
                        width: '60px',
                        height: '40px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '14px' }}>
                        {motorcycle.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        ₱{motorcycle.price}/day
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Share & Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '24px',
            borderTop: '1px solid #eee'
          }}>
            <div>
              <span style={{ color: '#666', marginRight: '16px' }}>Share this article:</span>
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: post.title,
                      text: post.excerpt,
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
                style={{
                  background: '#1877f2',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                📤 Share
              </button>
            </div>
            
            <Link to="/" className="btn btn-primary">
              🏍️ Rent a Motorcycle
            </Link>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {related.length > 0 && (
        <section>
          <h3 style={{ marginBottom: '24px', color: '#333' }}>
            📚 More Travel Guides
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {related.map(relatedPost => (
              <Link 
                key={relatedPost._id}
                to={`/blog/${relatedPost.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <article style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}>
                  
                  {relatedPost.featuredImage && (
                    <div style={{ height: '150px', overflow: 'hidden' }}>
                      <img
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  )}
                  
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{
                        background: getCategoryColor(relatedPost.category),
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {getCategoryIcon(relatedPost.category)} {relatedPost.category.replace('-', ' ')}
                      </span>
                    </div>
                    
                    <h4 style={{ 
                      color: '#333', 
                      marginBottom: '8px',
                      fontSize: '16px',
                      lineHeight: 1.3
                    }}>
                      {relatedPost.title}
                    </h4>
                    
                    <p style={{ 
                      color: '#666', 
                      fontSize: '13px', 
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPost;