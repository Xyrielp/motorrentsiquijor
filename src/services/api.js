import { mockMotorcycles, mockShops, mockBlogPosts, mockReviews, mockUsers } from '../data/mockData';

// Mock API responses
const mockResponse = (data) => Promise.resolve({ data });
const mockError = (message) => Promise.reject({ response: { data: { message } } });

// Auth API
export const authAPI = {
  login: (email, password) => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      const token = 'mock-jwt-token';
      localStorage.setItem('token', token);
      return mockResponse({ token, user: { ...user, password: undefined } });
    }
    return mockError('Invalid credentials');
  },
  register: (userData) => {
    const newUser = { ...userData, id: Date.now(), role: 'customer' };
    return mockResponse({ token: 'mock-jwt-token', user: newUser });
  },
  getMe: () => {
    const token = localStorage.getItem('token');
    if (token) {
      return mockResponse(mockUsers[0]);
    }
    return mockError('Not authenticated');
  },
};

// Motorcycles API
export const motorcyclesAPI = {
  getAll: (params) => {
    let filtered = [...mockMotorcycles];
    if (params?.category) filtered = filtered.filter(m => m.category === params.category);
    if (params?.location) filtered = filtered.filter(m => m.location.includes(params.location));
    if (params?.minPrice) filtered = filtered.filter(m => m.pricePerDay >= params.minPrice);
    if (params?.maxPrice) filtered = filtered.filter(m => m.pricePerDay <= params.maxPrice);
    return mockResponse(filtered);
  },
  getById: (id) => {
    const motorcycle = mockMotorcycles.find(m => m.id === parseInt(id));
    return motorcycle ? mockResponse(motorcycle) : mockError('Motorcycle not found');
  },
  search: (query) => {
    const results = mockMotorcycles.filter(m => 
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.brand.toLowerCase().includes(query.toLowerCase())
    );
    return mockResponse(results);
  },
};

// Shops API
export const shopsAPI = {
  getAll: (params) => mockResponse(mockShops),
  getById: (id) => {
    const shop = mockShops.find(s => s.id === parseInt(id));
    if (shop) {
      const shopMotorcycles = mockMotorcycles.filter(m => shop.motorcycles.includes(m.id));
      return mockResponse({ ...shop, motorcycles: shopMotorcycles });
    }
    return mockError('Shop not found');
  },
  getFeatured: () => mockResponse(mockShops.filter(s => s.premium)),
};

// Bookings API
export const bookingsAPI = {
  create: (bookingData) => {
    const booking = { ...bookingData, id: Date.now(), confirmationCode: 'BOOK' + Date.now() };
    return mockResponse(booking);
  },
  checkAvailability: (data) => mockResponse({ available: true }),
  getByConfirmationCode: (code) => {
    const booking = { id: 1, confirmationCode: code, status: 'confirmed' };
    return mockResponse(booking);
  },
};

// Reviews API
export const reviewsAPI = {
  getByMotorcycle: (motorcycleId) => {
    const reviews = mockReviews.filter(r => r.motorcycleId === parseInt(motorcycleId));
    return mockResponse(reviews);
  },
  create: (reviewData) => {
    const review = { ...reviewData, id: Date.now(), date: new Date().toISOString() };
    return mockResponse(review);
  },
  markHelpful: (reviewId) => mockResponse({ success: true }),
};

// Blog API
export const blogAPI = {
  getAll: (params) => mockResponse(mockBlogPosts),
  getBySlug: (slug) => {
    const post = mockBlogPosts.find(p => p.slug === slug);
    return post ? mockResponse(post) : mockError('Post not found');
  },
  getFeatured: () => mockResponse(mockBlogPosts.filter(p => p.featured)),
  search: (query) => {
    const results = mockBlogPosts.filter(p => 
      p.title.toLowerCase().includes(query.toLowerCase())
    );
    return mockResponse(results);
  },
};