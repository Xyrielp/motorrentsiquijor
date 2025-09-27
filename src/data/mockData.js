// Mock data for frontend-only application

export const mockMotorcycles = [
  {
    id: 1,
    name: "Honda Click 150i",
    brand: "Honda",
    model: "Click 150i",
    year: 2023,
    category: "Scooter",
    pricePerDay: 800,
    location: "San Juan, Siquijor",
    images: ["/api/placeholder/400/300"],
    description: "Perfect for island touring with automatic transmission",
    features: ["Automatic", "Fuel Efficient", "Under Seat Storage"],
    shopId: 1,
    shopName: "Island Riders",
    available: true,
    rating: 4.8,
    reviewCount: 24
  },
  {
    id: 2,
    name: "Yamaha NMAX 155",
    brand: "Yamaha",
    model: "NMAX 155",
    year: 2023,
    category: "Scooter",
    pricePerDay: 1000,
    location: "Larena, Siquijor",
    images: ["/api/placeholder/400/300"],
    description: "Premium scooter with advanced features",
    features: ["Automatic", "ABS", "Smart Key"],
    shopId: 2,
    shopName: "Siquijor Motors",
    available: true,
    rating: 4.9,
    reviewCount: 18
  },
  {
    id: 3,
    name: "Honda TMX 155",
    brand: "Honda",
    model: "TMX 155",
    year: 2022,
    category: "Underbone",
    pricePerDay: 700,
    location: "Lazi, Siquijor",
    images: ["/api/placeholder/400/300"],
    description: "Reliable underbone motorcycle for all terrains",
    features: ["Manual", "Fuel Efficient", "Durable"],
    shopId: 3,
    shopName: "Mystical Rides",
    available: true,
    rating: 4.7,
    reviewCount: 31
  }
];

export const mockShops = [
  {
    id: 1,
    name: "Island Riders",
    description: "Premier motorcycle rental service in Siquijor",
    location: "San Juan, Siquijor",
    phone: "+639123456789",
    email: "info@islandriders.ph",
    verified: true,
    premium: true,
    rating: 4.8,
    reviewCount: 45,
    motorcycles: [1],
    operatingHours: "8:00 AM - 6:00 PM",
    socialMedia: {
      facebook: "IslandRidersSiquijor",
      instagram: "@islandriders"
    }
  },
  {
    id: 2,
    name: "Siquijor Motors",
    description: "Quality motorcycles for your island adventure",
    location: "Larena, Siquijor",
    phone: "+639987654321",
    email: "contact@siquijormotors.ph",
    verified: true,
    premium: false,
    rating: 4.9,
    reviewCount: 32,
    motorcycles: [2],
    operatingHours: "7:00 AM - 7:00 PM",
    socialMedia: {
      facebook: "SiquijorMotors"
    }
  },
  {
    id: 3,
    name: "Mystical Rides",
    description: "Explore the mystical island with our reliable bikes",
    location: "Lazi, Siquijor",
    phone: "+639555123456",
    email: "hello@mysticalrides.ph",
    verified: false,
    premium: false,
    rating: 4.7,
    reviewCount: 28,
    motorcycles: [3],
    operatingHours: "8:00 AM - 5:00 PM",
    socialMedia: {}
  }
];

export const mockBlogPosts = [
  {
    id: 1,
    title: "Ultimate Guide to Exploring Siquijor Island",
    slug: "ultimate-guide-siquijor-island",
    excerpt: "Discover the mystical beauty of Siquijor with our comprehensive travel guide",
    content: "Siquijor Island, known as the 'Island of Fire', offers breathtaking landscapes...",
    author: "Travel Team",
    publishedAt: "2024-01-15",
    category: "Travel Guide",
    featured: true,
    image: "/api/placeholder/600/400",
    tags: ["travel", "siquijor", "guide"]
  },
  {
    id: 2,
    title: "Best Motorcycle Routes in Siquijor",
    slug: "best-motorcycle-routes-siquijor",
    excerpt: "Discover the most scenic and exciting motorcycle routes around the island",
    content: "Riding around Siquijor offers stunning coastal views and mountain adventures...",
    author: "Rider's Guide",
    publishedAt: "2024-01-10",
    category: "Riding Tips",
    featured: true,
    image: "/api/placeholder/600/400",
    tags: ["motorcycle", "routes", "adventure"]
  }
];

export const mockReviews = [
  {
    id: 1,
    motorcycleId: 1,
    userName: "Juan Dela Cruz",
    rating: 5,
    comment: "Excellent bike! Very reliable and fuel efficient.",
    date: "2024-01-20",
    helpful: 8
  },
  {
    id: 2,
    motorcycleId: 1,
    userName: "Maria Santos",
    rating: 4,
    comment: "Good condition motorcycle, perfect for island touring.",
    date: "2024-01-18",
    helpful: 5
  }
];

export const mockUsers = [
  {
    id: 1,
    email: "demo@example.com",
    password: "password123",
    name: "Demo User",
    role: "customer",
    phone: "+639123456789"
  }
];