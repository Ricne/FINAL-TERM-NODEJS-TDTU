import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CartPage from './pages/Cart/CartPage';
import ProductPage from './pages/Product/ProductPage';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import AuthRoute from './components/AuthRoute/AuthRoute';
import CheckoutPage from './pages/Checkout/CheckoutPage';
import PaymentPage from './pages/Payment/PaymentPage';
import OrderTrackPage from './pages/OrderTrack/OrderTrackPage';
import ProfilePage from './pages/Profile/ProfilePage';
import OrdersPage from './pages/Orders/OrdersPage';
import Dashboard from './pages/Dashboard/Dashboard';
import AdminRoute from './components/AdminRoute/AdminRoute';
import ProductsAdminPage from './pages/ProductsAdmin/ProductsAdminPage';
import ProductEditPage from './pages/ProductEdit/ProductEditPage';
import UsersPage from './pages/UsersPage/UsersPage';
import UserEditPage from './pages/UserEdit/UserEditPage';
import EditVoucherPage from './pages/VoucherEdit/VoucherEditPage';
import AdminVoucherPage from './pages/VouchersAdmin/VouchersAdminPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search/:searchTerm" element={<HomePage />} />
      <Route path="/tag/:tag" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/checkout"
        element={
          <AuthRoute>
            <CheckoutPage />
          </AuthRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <AuthRoute>
            <PaymentPage />
          </AuthRoute>
        }
      />
      <Route
        path="/track/:orderId"
        element={
          <AuthRoute>
            <OrderTrackPage />
          </AuthRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthRoute>
            <ProfilePage />
          </AuthRoute>
        }
      />
      <Route
        path="/orders/:filter?"
        element={
          <AuthRoute>
            <OrdersPage />
          </AuthRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <AuthRoute>
            <Dashboard />
          </AuthRoute>
        }
      />
      <Route
        path="/admin/products/:searchTerm?"
        element={
          <AdminRoute>
            <ProductsAdminPage />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/addProduct"
        element={
          <AdminRoute>
            <ProductEditPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/editProduct/:productId"
        element={
          <AdminRoute>
            <ProductEditPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users/:searchTerm?"
        element={
          <AdminRoute>
            <UsersPage />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/editUser/:userId"
        element={
          <AdminRoute>
            <UserEditPage />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/vouchers"
        element={
          <AdminRoute>
            <AdminVoucherPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/voucher/new"
        element={
          <AdminRoute>
            <EditVoucherPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/voucher/:id"
        element={
          <AdminRoute>
            <EditVoucherPage />
          </AdminRoute>
        }
      />
    </Routes>
  );
}