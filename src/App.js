import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import Header from './components/Header';
import Home from './pages/Home';
import Shops from './pages/Shops';
import ShopDetails from './pages/ShopDetails';
import MotorcycleDetails from './pages/MotorcycleDetails';
import Booking from './pages/Booking';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminRoute from './admin/components/AdminRoute';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FavoritesProvider>
          <Router>
            <div className="App">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shops" element={<Shops />} />
                  <Route path="/shops/:id" element={<ShopDetails />} />
                  <Route path="/motorcycles/:id" element={<MotorcycleDetails />} />
                  <Route path="/booking/:id" element={<Booking />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                </Routes>
              </main>
            </div>
          </Router>
        </FavoritesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;