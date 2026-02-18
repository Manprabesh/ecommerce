import { useState, createContext } from 'react'
import './App.css'
import { Authentication } from "../pages/auth"
import Product from '../pages/admin/product'
import Category from '../pages/admin/category'
import AddressPage from '../pages/user/address'
import UserProduct from '../pages/user/product'
import { BrowserRouter, Routes, Route } from "react-router";
import ProtectedRoutes from './utils/ProtectedRoutes'
import Home from '../pages/admin/home'
import UserHome from '../pages/user/home'
import Cart from '../pages/user/cart'
import Payment from '../pages/user/payment'
import { AddressCard } from '../pages/user/address'
import Order from '../pages/user/order'
import { PopupProvider } from "../context/popUpContext"
import Popup from '../components/PopUp'
import { AuthProvider } from '../components/AuthContext'
import { CartProvider } from '../components/CartContext'
import {Hero} from '../pages/admin/heor'
export const MinContext = createContext();
import SalesDashboard from '../pages/admin/sales'

//testing routes
import Dashboard from './Dashboard'
import Setting from './Setting'

function App() {
  const count = 90;
  return (
    <BrowserRouter>
      <AuthProvider>
        <PopupProvider>
          <CartProvider>
            <Popup />
            <Routes >
              <Route path="/" element={<Authentication />} />
              <Route path="/user/address" element={<AddressPage />} />
              <Route path="/user/product" element={<UserProduct />} />
              <Route path="/user/home" element={<UserHome />} />
              <Route path="/user/cart" element={<Cart />} />
              <Route path="/user/payment" element={<Payment />} />
              <Route path="/user/orders" element={<Order />} />
            </Routes>

            {/* Admin Route */}
            <Routes>
              <Route path="admin" element={<Dashboard />}>
                <Route path="products" element={<Product />} />
                <Route path="create/products" element={<Category />} />
                <Route path="home" element={<Home />} />
                <Route path="dashboard" element={<Hero />} />
                <Route path="sales" element={<SalesDashboard />} />
                
              </Route>
            </Routes>

          </CartProvider>
        </PopupProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
