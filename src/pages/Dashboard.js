import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { motorcyclesAPI, shopsAPI, bookingsAPI, reviewsAPI, blogAPI } from '../services/api';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '16px', color: '#333' }}>
            Access Dashboard
          </h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            Please login to access your dashboard
          </p>
          <Link to="/" className="btn btn-primary">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'shop_owner':
        return <ShopOwnerDashboard />;
      default:
        return <CustomerDashboard />;
    }
  };

  return (
    <div className="container">
      {getDashboardContent()}
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalShops: 0, totalMotorcycles: 0, totalBookings: 0, totalRevenue: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/admin-stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #ee4d2d, #ff6b35)',
        color: 'white',
        padding: '32px',
        borderRadius: '12px',
        marginBottom: '32px'
      }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>
          🛡️ Admin Dashboard
        </h1>
        <p style={{ opacity: 0.9 }}>
          Manage the MotorRent Siquijor platform
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #28a745, #20c997)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>₱{stats.totalRevenue.toLocaleString()}</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Revenue</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #007bff, #0056b3)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalShops}</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Shops</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #ffc107, #e0a800)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalMotorcycles}</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Motorcycles</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #17a2b8, #138496)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalBookings}</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Bookings</div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏪</div>
          <h3 style={{ color: '#333', marginBottom: '8px' }}>Manage Shops</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
            Verify and manage rental shops
          </p>
          <a href="/admin" className="btn btn-primary">Open Admin Panel</a>
        </div>

        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏍️</div>
          <h3 style={{ color: '#333', marginBottom: '8px' }}>Motorcycles</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
            Monitor all motorcycle listings
          </p>
          <button className="btn btn-primary">View Motorcycles</button>
        </div>

        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📊</div>
          <h3 style={{ color: '#333', marginBottom: '8px' }}>Analytics</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
            Platform statistics and insights
          </p>
          <button className="btn btn-primary">View Analytics</button>
        </div>

        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📝</div>
          <h3 style={{ color: '#333', marginBottom: '8px' }}>Blog Posts</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
            Manage travel guides and content
          </p>
          <button className="btn btn-primary">Manage Blog</button>
        </div>
      </div>
    </div>
  );
};

const ShopOwnerDashboard = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, activeBookings: 0, motorcyclesListed: 0, totalReviews: 0 });
  const [bookings, setBookings] = useState([]);
  const [showAddMotorcycle, setShowAddMotorcycle] = useState(false);
  const [showUpdateShop, setShowUpdateShop] = useState(false);
  const [shopForm, setShopForm] = useState({ name: '', description: '', address: '', phone: '', email: '' });
  const [motorcycleForm, setMotorcycleForm] = useState({
    name: '', description: '', category: 'scooter', customCategory: '', price: '', deposit: '', 
    engine: '', fuel: 'Gasoline', transmission: 'Manual', year: new Date().getFullYear(),
    color: '', brand: '', model: '', features: '', deliveryAvailable: false, deliveryFee: 0,
    minRentalDays: 1, maxRentalDays: 30, images: []
  });
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, bookingsResponse] = await Promise.all([
          api.get('/dashboard/shop-stats'),
          api.get('/dashboard/shop-bookings')
        ]);
        setStats(statsResponse.data);
        setBookings(bookingsResponse.data);
      } catch (error) {
        console.error('Error fetching shop data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #ee4d2d, #ff6b35)',
        color: 'white',
        padding: '32px',
        borderRadius: '12px',
        marginBottom: '32px'
      }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>
          🏪 Shop Owner Dashboard
        </h1>
        <p style={{ opacity: 0.9 }}>
          Manage your motorcycle rental business in Siquijor
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #28a745, #20c997)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>₱{stats.totalRevenue.toLocaleString()}</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Revenue</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #007bff, #0056b3)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.activeBookings}</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Active Bookings</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #ffc107, #e0a800)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.motorcyclesListed}</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Motorcycles Listed</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #17a2b8, #138496)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalReviews}</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Reviews</div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '16px', color: '#333' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn btn-primary" onClick={() => setShowAddMotorcycle(true)}>Add New Motorcycle</button>
            <button className="btn btn-secondary" onClick={() => setShowUpdateShop(true)}>Update Shop Info</button>
            <button className="btn btn-secondary" onClick={() => {
              const bookingsList = bookings.map(b => 
                `${b.motorcycle_name} - ${b.customer_name} (${b.status})`
              ).join('\n');
              alert(bookings.length > 0 ? `Your Bookings:\n${bookingsList}` : 'No bookings yet');
            }}>View Bookings ({bookings.length})</button>
            <button className="btn btn-secondary" onClick={() => alert(`Total Reviews: ${stats.totalReviews}`)}>Manage Reviews</button>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '16px', color: '#333' }}>Shop Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Verification Status:</span>
              <span style={{ 
                background: '#fff3cd', 
                color: '#856404', 
                padding: '4px 8px', 
                borderRadius: '12px', 
                fontSize: '12px' 
              }}>
                Pending
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Shop Rating:</span>
              <span>⭐⭐⭐⭐⭐ (0 reviews)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Profile Completion:</span>
              <span style={{ color: '#ee4d2d', fontWeight: 'bold' }}>60%</span>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '16px', color: '#333' }}>Getting Started</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#28a745' }}>✓</span>
              <span>Create shop account</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#ffc107' }}>○</span>
              <span>Upload business permit</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#ffc107' }}>○</span>
              <span>Add your first motorcycle</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#ffc107' }}>○</span>
              <span>Set up payment methods</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#ffc107' }}>○</span>
              <span>Get verified</span>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '16px', color: '#333' }}>Recent Bookings</h3>
          {bookings.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
              No bookings yet. Start by adding motorcycles to your shop!
            </p>
          ) : (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {bookings.slice(0, 5).map(booking => (
                <div key={booking.id} style={{
                  padding: '12px',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#333' }}>
                      {booking.motorcycle_name}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      {booking.customer_name} • {new Date(booking.start_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{
                    background: booking.status === 'confirmed' ? '#d4edda' : '#fff3cd',
                    color: booking.status === 'confirmed' ? '#155724' : '#856404',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    textTransform: 'capitalize'
                  }}>
                    {booking.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Motorcycle Modal */}
      {showAddMotorcycle && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'white', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto'
          }}>
            <h3 style={{ marginBottom: '20px' }}>Add New Motorcycle</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const formData = new FormData();
                
                // Add all form fields
                Object.keys(motorcycleForm).forEach(key => {
                  if (key !== 'images') {
                    formData.append(key, motorcycleForm[key]);
                  }
                });
                
                // Add specifications
                formData.append('specifications', JSON.stringify({
                  engine: motorcycleForm.engine,
                  fuel: motorcycleForm.fuel,
                  transmission: motorcycleForm.transmission,
                  year: motorcycleForm.year,
                  color: motorcycleForm.color,
                  brand: motorcycleForm.brand,
                  model: motorcycleForm.model
                }));
                
                // Add features and requirements
                formData.append('features', JSON.stringify(motorcycleForm.features.split(',').map(f => f.trim()).filter(f => f)));
                formData.append('requirements', JSON.stringify(['Valid ID', 'Driver\'s License']));
                
                // Add category (use custom if provided)
                const finalCategory = motorcycleForm.customCategory || motorcycleForm.category;
                formData.append('category', finalCategory);
                
                // Add image files
                imageFiles.forEach((file, index) => {
                  formData.append('images', file);
                });
                
                await api.post('/motorcycles', formData, {
                  headers: { 'Content-Type': 'multipart/form-data' }
                });
                
                setShowAddMotorcycle(false);
                setMotorcycleForm({ name: '', description: '', category: 'scooter', customCategory: '', price: '', deposit: '', engine: '', fuel: 'Gasoline', transmission: 'Manual', year: new Date().getFullYear(), color: '', brand: '', model: '', features: '', deliveryAvailable: false, deliveryFee: 0, minRentalDays: 1, maxRentalDays: 30, images: [] });
                setImageFiles([]);
                window.location.reload();
              } catch (error) {
                alert('Error adding motorcycle: ' + error.response?.data?.message);
              }
            }}>
              {/* Basic Info */}
              <input type="text" placeholder="Motorcycle Name" value={motorcycleForm.name} onChange={(e) => setMotorcycleForm({...motorcycleForm, name: e.target.value})} required style={{ width: '100%', padding: '8px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <input type="text" placeholder="Brand (e.g., Honda)" value={motorcycleForm.brand} onChange={(e) => setMotorcycleForm({...motorcycleForm, brand: e.target.value})} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                <input type="text" placeholder="Model (e.g., Click 150i)" value={motorcycleForm.model} onChange={(e) => setMotorcycleForm({...motorcycleForm, model: e.target.value})} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              
              <textarea placeholder="Description" value={motorcycleForm.description} onChange={(e) => setMotorcycleForm({...motorcycleForm, description: e.target.value})} required style={{ width: '100%', padding: '8px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '60px' }} />
              
              {/* Category */}
              <div style={{ marginBottom: '12px' }}>
                <select value={motorcycleForm.category} onChange={(e) => setMotorcycleForm({...motorcycleForm, category: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <option value="scooter">Scooter</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="sport">Sport Bike</option>
                  <option value="touring">Touring</option>
                  <option value="cruiser">Cruiser</option>
                  <option value="custom">Custom Type</option>
                </select>
                {motorcycleForm.category === 'custom' && (
                  <input type="text" placeholder="Enter custom category" value={motorcycleForm.customCategory} onChange={(e) => setMotorcycleForm({...motorcycleForm, customCategory: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                )}
              </div>
              
              {/* Pricing */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <input type="number" placeholder="Price per day (₱)" value={motorcycleForm.price} onChange={(e) => setMotorcycleForm({...motorcycleForm, price: e.target.value})} required style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                <input type="number" placeholder="Deposit amount (₱)" value={motorcycleForm.deposit} onChange={(e) => setMotorcycleForm({...motorcycleForm, deposit: e.target.value})} required style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              
              {/* Specifications */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <input type="text" placeholder="Engine (e.g., 150cc)" value={motorcycleForm.engine} onChange={(e) => setMotorcycleForm({...motorcycleForm, engine: e.target.value})} required style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                <input type="text" placeholder="Color" value={motorcycleForm.color} onChange={(e) => setMotorcycleForm({...motorcycleForm, color: e.target.value})} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <select value={motorcycleForm.fuel} onChange={(e) => setMotorcycleForm({...motorcycleForm, fuel: e.target.value})} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <option value="Gasoline">Gasoline</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
                <select value={motorcycleForm.transmission} onChange={(e) => setMotorcycleForm({...motorcycleForm, transmission: e.target.value})} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                  <option value="CVT">CVT</option>
                </select>
              </div>
              
              <input type="number" placeholder="Year" value={motorcycleForm.year} onChange={(e) => setMotorcycleForm({...motorcycleForm, year: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
              
              {/* Features */}
              <input type="text" placeholder="Features (comma separated)" value={motorcycleForm.features} onChange={(e) => setMotorcycleForm({...motorcycleForm, features: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
              
              {/* Rental Terms */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <input type="number" placeholder="Min rental days" value={motorcycleForm.minRentalDays} onChange={(e) => setMotorcycleForm({...motorcycleForm, minRentalDays: e.target.value})} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                <input type="number" placeholder="Max rental days" value={motorcycleForm.maxRentalDays} onChange={(e) => setMotorcycleForm({...motorcycleForm, maxRentalDays: e.target.value})} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              
              {/* Delivery Options */}
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <input type="checkbox" checked={motorcycleForm.deliveryAvailable} onChange={(e) => setMotorcycleForm({...motorcycleForm, deliveryAvailable: e.target.checked})} style={{ marginRight: '8px' }} />
                Delivery Available
              </label>
              
              {motorcycleForm.deliveryAvailable && (
                <input type="number" placeholder="Delivery fee (₱)" value={motorcycleForm.deliveryFee} onChange={(e) => setMotorcycleForm({...motorcycleForm, deliveryFee: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
              )}
              
              {/* Image Upload */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Upload Photos</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setImageFiles(files);
                  }} 
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} 
                />
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>You can upload multiple images (max 5)</div>
                {imageFiles.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <strong>Selected files:</strong>
                    <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                      {imageFiles.map((file, index) => (
                        <li key={index} style={{ fontSize: '12px' }}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary">Add Motorcycle</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddMotorcycle(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Shop Modal */}
      {showUpdateShop && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'white', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '500px'
          }}>
            <h3 style={{ marginBottom: '20px' }}>Update Shop Information</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await api.put('/shops/update', shopForm);
                setShowUpdateShop(false);
                alert('Shop updated successfully!');
              } catch (error) {
                alert('Error updating shop: ' + error.response?.data?.message);
              }
            }}>
              <input type="text" placeholder="Shop Name" value={shopForm.name} onChange={(e) => setShopForm({...shopForm, name: e.target.value})} required style={{ width: '100%', padding: '8px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
              <textarea placeholder="Description" value={shopForm.description} onChange={(e) => setShopForm({...shopForm, description: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '60px' }} />
              <input type="text" placeholder="Address" value={shopForm.address} onChange={(e) => setShopForm({...shopForm, address: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
              <input type="tel" placeholder="Phone" value={shopForm.phone} onChange={(e) => setShopForm({...shopForm, phone: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
              <input type="email" placeholder="Email" value={shopForm.email} onChange={(e) => setShopForm({...shopForm, email: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary">Update Shop</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateShop(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/dashboard/my-bookings');
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #ee4d2d, #ff6b35)',
        color: 'white',
        padding: '32px',
        borderRadius: '12px',
        marginBottom: '32px'
      }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>
          🏍️ My Dashboard
        </h1>
        <p style={{ opacity: 0.9 }}>
          Manage your motorcycle rentals and bookings in Siquijor
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📅</div>
          <h3 style={{ color: '#333', marginBottom: '8px' }}>My Bookings</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
            View and manage your rentals
          </p>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ee4d2d', marginBottom: '8px' }}>
            {bookings.length}
          </div>
          <button className="btn btn-primary" onClick={() => {
            const bookingsList = bookings.map(b => 
              `${b.motorcycle_name} at ${b.shop_name}\n${new Date(b.start_date).toLocaleDateString()} - ${new Date(b.end_date).toLocaleDateString()}\nStatus: ${b.status}`
            ).join('\n\n');
            alert(bookings.length > 0 ? `Your Bookings:\n\n${bookingsList}` : 'No bookings yet');
          }}>View Bookings</button>
        </div>

        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>❤️</div>
          <h3 style={{ color: '#333', marginBottom: '8px' }}>Favorites</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
            Your saved motorcycles
          </p>
          <Link to="/favorites" className="btn btn-primary">View Favorites</Link>
        </div>

        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⭐</div>
          <h3 style={{ color: '#333', marginBottom: '8px' }}>Reviews</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
            Rate your rental experiences
          </p>
          <button className="btn btn-primary" onClick={() => alert('Reviews feature coming soon!')}>My Reviews</button>
        </div>

        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>👤</div>
          <h3 style={{ color: '#333', marginBottom: '8px' }}>Profile</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
            Update your information
          </p>
          <button className="btn btn-primary" onClick={() => alert('Profile editing coming soon!')}>Edit Profile</button>
        </div>
      </div>

      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '16px', color: '#333' }}>
          Want to start your own rental business?
        </h3>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Join hundreds of shop owners earning from motorcycle rentals in Siquijor
        </p>
        <button className="btn btn-success" onClick={() => {
          if (window.confirm('Ready to start your rental business? This will upgrade your account to shop owner.')) {
            api.put('/auth/upgrade-to-shop-owner').then(() => {
              alert('Account upgraded! Please refresh the page.');
              window.location.reload();
            }).catch(err => alert('Error: ' + err.response?.data?.message));
          }
        }}>Become a Shop Owner</button>
      </div>

      {bookings.length > 0 && (
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginTop: '24px'
        }}>
          <h3 style={{ marginBottom: '16px', color: '#333' }}>Recent Bookings</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {bookings.slice(0, 3).map(booking => (
              <div key={booking.id} style={{
                padding: '16px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                    {booking.motorcycle_name}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {booking.shop_name} • {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: '14px', color: '#ee4d2d', fontWeight: 'bold' }}>
                    ₱{parseFloat(booking.total_amount).toLocaleString()}
                  </div>
                </div>
                <div style={{
                  background: booking.status === 'confirmed' ? '#d4edda' : booking.status === 'completed' ? '#d1ecf1' : '#fff3cd',
                  color: booking.status === 'confirmed' ? '#155724' : booking.status === 'completed' ? '#0c5460' : '#856404',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  textTransform: 'capitalize'
                }}>
                  {booking.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;