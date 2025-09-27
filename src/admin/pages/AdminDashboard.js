import React, { useState, useEffect } from 'react';
import { motorcyclesAPI, shopsAPI, bookingsAPI, reviewsAPI, blogAPI } from '../../services/api';

const BlogManagement = () => {
  const [posts, setPosts] = useState([]);
  const [showAddPost, setShowAddPost] = useState(false);
  const [postForm, setPostForm] = useState({ title: '', content: '', excerpt: '', category: '', tags: '', published: false });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await blogAPI.getAll();
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const createPost = async (e) => {
    e.preventDefault();
    try {
      await blogAPI.create({
        ...postForm,
        tags: postForm.tags.split(',').map(t => t.trim()).filter(t => t),
        slug: postForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      });
      setShowAddPost(false);
      setPostForm({ title: '', content: '', excerpt: '', category: '', tags: '', published: false });
      fetchPosts();
    } catch (error) {
      alert('Error creating post: ' + error.response?.data?.message);
    }
  };

  const togglePublish = async (postId, currentStatus) => {
    try {
      await blogAPI.update(postId, { published: !currentStatus });
      fetchPosts();
    } catch (error) {
      alert('Error updating post');
    }
  };

  const deletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await blogAPI.delete(postId);
        fetchPosts();
      } catch (error) {
        alert('Error deleting post');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Blog Management</h3>
        <button className="btn btn-primary" onClick={() => setShowAddPost(true)}>Add New Post</button>
      </div>
      
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {posts.map(post => (
          <div key={post.id} style={{
            padding: '16px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{post.title}</div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                Category: {post.category} • {new Date(post.created_at).toLocaleDateString()}
              </div>
              <div style={{ fontSize: '12px', color: '#999' }}>
                {post.excerpt?.substring(0, 100)}...
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{
                background: post.published ? '#d4edda' : '#fff3cd',
                color: post.published ? '#155724' : '#856404',
                padding: '4px 8px', borderRadius: '12px', fontSize: '12px'
              }}>
                {post.published ? 'Published' : 'Draft'}
              </span>
              <button className="btn btn-sm btn-secondary" onClick={() => togglePublish(post.id, post.published)}>
                {post.published ? 'Unpublish' : 'Publish'}
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => deletePost(post.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showAddPost && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'white', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto'
          }}>
            <h3 style={{ marginBottom: '20px' }}>Add New Blog Post</h3>
            <form onSubmit={createPost}>
              <input type="text" placeholder="Post Title" value={postForm.title} onChange={(e) => setPostForm({...postForm, title: e.target.value})} required style={{ width: '100%', padding: '8px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
              <input type="text" placeholder="Category" value={postForm.category} onChange={(e) => setPostForm({...postForm, category: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
              <textarea placeholder="Excerpt" value={postForm.excerpt} onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '60px' }} />
              <textarea placeholder="Content" value={postForm.content} onChange={(e) => setPostForm({...postForm, content: e.target.value})} required style={{ width: '100%', padding: '8px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '120px' }} />
              <input type="text" placeholder="Tags (comma separated)" value={postForm.tags} onChange={(e) => setPostForm({...postForm, tags: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <input type="checkbox" checked={postForm.published} onChange={(e) => setPostForm({...postForm, published: e.target.checked})} style={{ marginRight: '8px' }} />
                Publish immediately
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-primary">Create Post</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddPost(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalShops: 0, totalMotorcycles: 0, totalBookings: 0, totalRevenue: 0 });
  const [shops, setShops] = useState([]);
  const [motorcycles, setMotorcycles] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchStats();
    fetchShops();
    fetchMotorcycles();
  }, []);

  const fetchStats = async () => {
    try {
      const response = { data: { totalShops: 3, totalMotorcycles: 3, totalBookings: 0 } };
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchShops = async () => {
    try {
      const response = await shopsAPI.getAll();
      setShops(response.data);
    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  };

  const fetchMotorcycles = async () => {
    try {
      const response = await motorcyclesAPI.getAll();
      setMotorcycles(response.data.motorcycles || []);
    } catch (error) {
      console.error('Error fetching motorcycles:', error);
    }
  };

  const approveShop = async (shopId) => {
    try {
      await shopsAPI.approve(shopId);
      setShops(shops.map(s => s.id === shopId ? {...s, status: 'approved'} : s));
    } catch (error) {
      alert('Error approving shop');
    }
  };

  const rejectShop = async (shopId) => {
    if (window.confirm('Are you sure you want to reject this shop application?')) {
      try {
        await shopsAPI.reject(shopId);
        setShops(shops.filter(s => s.id !== shopId));
      } catch (error) {
        alert('Error rejecting shop');
      }
    }
  };

  const verifyShop = async (shopId) => {
    try {
      await shopsAPI.verify(shopId);
      setShops(shops.map(s => s.id === shopId ? {...s, is_verified: true, verification_badge: 'verified'} : s));
    } catch (error) {
      alert('Error verifying shop');
    }
  };

  const suspendShop = async (shopId) => {
    if (window.confirm('Are you sure you want to suspend this shop?')) {
      try {
        await shopsAPI.suspend(shopId);
        setShops(shops.map(s => s.id === shopId ? {...s, status: 'suspended'} : s));
      } catch (error) {
        alert('Error suspending shop');
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #ee4d2d, #ff6b35)',
        color: 'white',
        padding: '24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div className="container">
          <h1 style={{ margin: 0, fontSize: '28px' }}>🛡️ Admin Panel</h1>
          <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>MotorRent Siquijor Management</p>
        </div>
      </div>

      <div className="container" style={{ padding: '24px' }}>
        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #28a745, #20c997)',
            color: 'white',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>₱{stats.totalRevenue.toLocaleString()}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Revenue</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #007bff, #0056b3)',
            color: 'white',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalShops}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Shops</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #ffc107, #e0a800)',
            color: 'white',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalMotorcycles}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Motorcycles</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #17a2b8, #138496)',
            color: 'white',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalBookings}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Bookings</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #eee'
          }}>
            {['overview', 'shops', 'motorcycles', 'blog', 'users'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '16px 24px',
                  border: 'none',
                  background: activeTab === tab ? '#ee4d2d' : 'transparent',
                  color: activeTab === tab ? 'white' : '#666',
                  borderRadius: activeTab === tab ? '12px 12px 0 0' : '0',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  fontWeight: activeTab === tab ? 'bold' : 'normal'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ padding: '24px' }}>
            {activeTab === 'overview' && (
              <div>
                <h3>Platform Overview</h3>
                <p>Welcome to the MotorRent Siquijor admin panel. Use the tabs above to manage different aspects of the platform.</p>
              </div>
            )}

{activeTab === 'shops' && (
              <div>
                <h3>Shop Applications & Management</h3>
                
                {/* Pending Applications */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ color: '#ee4d2d', marginBottom: '12px' }}>Pending Applications ({shops.filter(s => s.status === 'pending').length})</h4>
                  <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '8px' }}>
                    {shops.filter(shop => shop.status === 'pending').map(shop => (
                      <div key={shop.id} style={{
                        padding: '16px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        background: '#fff9e6'
                      }}>
                        <div>
                          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{shop.name}</div>
                          <div style={{ fontSize: '14px', color: '#666' }}>
                            Owner: {shop.owner_name} • {shop.email} • {shop.phone}
                          </div>
                          <div style={{ fontSize: '12px', color: '#999' }}>
                            Applied: {new Date(shop.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-sm btn-success" onClick={() => approveShop(shop.id)}>Approve</button>
                          <button className="btn btn-sm btn-danger" onClick={() => rejectShop(shop.id)}>Reject</button>
                        </div>
                      </div>
                    ))}
                    {shops.filter(s => s.status === 'pending').length === 0 && (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No pending applications</div>
                    )}
                  </div>
                </div>

                {/* Approved Shops */}
                <div>
                  <h4 style={{ color: '#28a745', marginBottom: '12px' }}>Approved Shops ({shops.filter(s => s.status === 'approved').length})</h4>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {shops.filter(shop => shop.status === 'approved').map(shop => (
                      <div key={shop.id} style={{
                        padding: '16px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                      }}>
                        <div>
                          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{shop.name}</div>
                          <div style={{ fontSize: '14px', color: '#666' }}>
                            Owner: {shop.owner_name} • Location: {shop.location}
                          </div>
                          <div style={{ fontSize: '12px', color: '#999' }}>
                            {shop.motorcycleCount || 0} motorcycles • Rating: {shop.rating}/5
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{
                            background: shop.is_verified ? '#d4edda' : '#fff3cd',
                            color: shop.is_verified ? '#155724' : '#856404',
                            padding: '4px 8px', borderRadius: '12px', fontSize: '12px'
                          }}>
                            {shop.is_verified ? 'Verified' : 'Unverified'}
                          </span>
                          {!shop.is_verified && (
                            <button className="btn btn-sm btn-success" onClick={() => verifyShop(shop.id)}>Verify</button>
                          )}
                          <button className="btn btn-sm btn-warning" onClick={() => suspendShop(shop.id)}>Suspend</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'motorcycles' && (
              <div>
                <h3>Motorcycle Management</h3>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {motorcycles.map(motorcycle => (
                    <div key={motorcycle.id} style={{
                      padding: '16px',
                      borderBottom: '1px solid #eee',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{motorcycle.name}</div>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          Shop: {motorcycle.shop_name} • ₱{motorcycle.price}/day
                        </div>
                        <div style={{ fontSize: '12px', color: '#999' }}>
                          {motorcycle.category} • Rating: {motorcycle.rating}/5 • {motorcycle.total_reviews} reviews
                        </div>
                      </div>
                      <div style={{
                        background: motorcycle.available ? '#d4edda' : '#f8d7da',
                        color: motorcycle.available ? '#155724' : '#721c24',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}>
                        {motorcycle.available ? 'Available' : 'Unavailable'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

{activeTab === 'users' && (
              <div>
                <h3>User Management</h3>
                <p>User management features coming soon...</p>
              </div>
            )}

            {activeTab === 'blog' && (
              <BlogManagement />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;