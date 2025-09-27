import { mockMotorcycles, mockShops, mockBlogPosts, mockReviews, mockUsers, DEMO_CREDENTIALS } from '../data/mockData';

// Mock API responses
const mockResponse = (data) => Promise.resolve({ data });
const mockError = (message) => Promise.reject({ response: { data: { message } } });

// Generate unique ID safely
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Auth API
export const authAPI = {
  login: (email, password) => {
    // Simple demo authentication - only for frontend demo
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      const token = `demo-token-${generateId()}`;
      const user = mockUsers[0];
      sessionStorage.setItem('token', token); // Use sessionStorage instead of localStorage
      return mockResponse({ token, user: { ...user, password: undefined } });
    }
    return mockError('Invalid credentials');
  },
  register: (userData) => {
    const newUser = { ...userData, id: generateId(), role: 'customer' };
    const token = `demo-token-${generateId()}`;
    sessionStorage.setItem('token', token);
    return mockResponse({ token, user: newUser });
  },
  getMe: () => {
    const token = sessionStorage.getItem('token');
    if (token && token.startsWith('demo-token-')) {
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
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return mockError('Invalid motorcycle ID');
    const motorcycle = mockMotorcycles.find(m => m.id === parsedId);
    return motorcycle ? mockResponse(motorcycle) : mockError('Motorcycle not found');
  },
  search: (query) => {
    const results = mockMotorcycles.filter(m => 
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.brand.toLowerCase().includes(query.toLowerCase())
    );
    return mockResponse(results);
  },
  create: (data) => mockResponse({ id: generateId(), ...data })
};

// Shops API
export const shopsAPI = {
  getAll: (params) => mockResponse(mockShops),
  getById: (id) => {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return mockError('Invalid shop ID');
    const shop = mockShops.find(s => s.id === parsedId);
    if (shop) {
      const shopMotorcycles = mockMotorcycles.filter(m => shop.motorcycles.includes(m.id));
      return mockResponse({ ...shop, motorcycles: shopMotorcycles });
    }
    return mockError('Shop not found');
  },
  getFeatured: () => mockResponse(mockShops.filter(s => s.premium)),
  approve: (id) => mockResponse({ success: true }),
  reject: (id) => mockResponse({ success: true }),
  verify: (id) => mockResponse({ success: true }),
  suspend: (id) => mockResponse({ success: true }),
  update: (data) => mockResponse({ success: true })
};

// Bookings API
export const bookingsAPI = {
  create: (bookingData) => {
    const id = generateId();
    const booking = { ...bookingData, id, confirmationCode: `BOOK${id.slice(-8).toUpperCase()}` };
    return mockResponse(booking);
  },
  checkAvailability: (data) => mockResponse({ available: true }),
  getByConfirmationCode: (code) => {
    const booking = { id: 1, confirmationCode: code, status: 'confirmed' };
    return mockResponse(booking);
  },
  getMyBookings: () => mockResponse([])
};

// Reviews API
export const reviewsAPI = {
  getByMotorcycle: (motorcycleId) => {
    const parsedId = parseInt(motorcycleId);
    if (isNaN(parsedId)) return mockError('Invalid motorcycle ID');
    const reviews = mockReviews.filter(r => r.motorcycleId === parsedId);
    return mockResponse(reviews);
  },
  create: (reviewData) => {
    const review = { ...reviewData, id: generateId(), date: new Date().toISOString() };
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
  create: (data) => mockResponse({ id: generateId(), ...data }),
  update: (id, data) => mockResponse({ success: true }),
  delete: (id) => mockResponse({ success: true })
};

