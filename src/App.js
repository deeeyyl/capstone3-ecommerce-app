import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import ProductPage from './pages/Product';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserContext from './context/UserContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import AddProduct from './pages/AddProduct';
import AdminView from './components/AdminView';
import AdminSaleManager from './pages/AdminSaleManager';
import Cart from './pages/Cart';
import Home from './pages/Home';
import CheckoutPage from "./pages/CheckOutPage"; 
import Order from './pages/Order';
import MyLikes from './pages/MyLikes'
import SetUserAsAdmin from './pages/SetUserAsAdmin.js';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import CategoryPage from "./pages/Categories";
import CategoriesOverview from "./components/CategoriesOverview";

import './App.css';




const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error("Invalid token");
          }
          return res.json();
        })
        .then(data => {
          setUser({
            id: data._id,
            isAdmin: data.isAdmin
          });
          setLoading(false);
        })
        .catch(err => {
          console.error("Auto-login failed:", err.message);
          localStorage.removeItem("token");
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <UserProvider value={{ user, setUser }}>
      <Router>
        <AppNavbar />
          <Routes>
            <Route path="/" element={<Navigate to="/products" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/admin" element={<AdminView />} />
            <Route path="/categories" element={<CategoriesOverview />} /> 
            <Route path="/categories/:categoryName" element={<CategoryPage />} /> 
            <Route path="/products" element={<ProductPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/set-user-as-admin" element={<SetUserAsAdmin />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/admin-sale" element={<AdminSaleManager />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/mylikes" element={<MyLikes/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;