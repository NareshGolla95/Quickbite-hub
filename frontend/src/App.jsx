import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';

// Admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

// User
import UserAuth from './pages/user/UserAuth';
import UserDashboard from './pages/user/UserDashboard';
import Cart from './pages/user/Cart';

// Delivery
import DeliveryAuth from './pages/delivery/DeliveryAuth';
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';

const App = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<MainPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* User Routes */}
          <Route path="/user/auth" element={<UserAuth />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/cart" element={<Cart />} />

          {/* Delivery Routes */}
          <Route path="/delivery/auth" element={<DeliveryAuth />} />
          <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
