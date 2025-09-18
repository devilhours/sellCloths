// frontend/src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore.js';

// --- Components & Pages ---
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import Cart from './pages/Cart.jsx';
import AddProduct from './pages/AddProduct.jsx';
import Favorites from './pages/Favorites.jsx';
import EditProduct from './pages/EditProduct.jsx';

// --- Icons ---
import { TbLoader3 } from "react-icons/tb";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // CORRECTED: The initial loading state should only depend on `isCheckingAuth`.
  // This prevents content flashing and ensures auth state is confirmed before rendering any routes.
  if (isCheckingAuth) {
    return (
      <div className='flex justify-center items-center h-screen bg-gray-900'>
        <TbLoader3 className='animate-spin size-20 text-emerald-500' />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        {/* === Public Routes (Always Accessible) === */}
        <Route path="/" element={<HomePage />} />

        {/* === Protected Routes (Only for Authenticated Users) === */}
        <Route path="/addproduct" element={authUser ? <AddProduct /> : <Navigate to="/login" />} />
        <Route path="/favorites" element={authUser ? <Favorites /> : <Navigate to="/login" />} />
        {/* CORRECTED: The edit route now includes a dynamic parameter for the product ID */}
        <Route path="/edit/:productId" element={authUser ? <EditProduct /> : <Navigate to="/login" />} />
        <Route path="/cart" element={authUser ? <Cart /> : <Navigate to="/login" />} />
        <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />

        {/* === Auth Routes (Only for Unauthenticated Users) === */}
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />

        {/* === Catch-all Route (Redirects any unknown URL to the homepage) === */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;