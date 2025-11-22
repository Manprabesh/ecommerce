import { useState } from 'react'
import './App.css'
import { Authentication } from "../pages/auth"
import Product from '../pages/admin/product'
import Category from '../pages/admin/category'
import AddressPage from '../pages/user/address'
import UserProduct from '../pages/user/product'
import { BrowserRouter, Routes, Route } from "react-router";
import ProtectedRoutes from './utils/ProtectedRoutes'
import  Home  from '../pages/admin/home'
import UserHome from '../pages/user/home'
import Cart from '../pages/user/cart'
import Payment from '../pages/user/payment'
import { AddressCard } from '../pages/user/address'
import Order from '../pages/user/order'
function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Authentication />} />
        <Route path="/admin/products" element={<Product />} />
        <Route path="/admin/home" element={<Home />} />
        <Route path="/admin/create/products" element={<Category />} />
        <Route path="/user/address" element={<AddressPage />} />
        <Route path="/user/product" element={<UserProduct />} />
        <Route path="/user/home" element={<UserHome />} />
        <Route path="/user/cart" element={<Cart />} />
        <Route path="/user/payment" element={<Payment />} />
        <Route path="/user/orders" element={<Order />} />
        {/* <Route path="" element={<AddressCard />} /> */}

      
      </Routes>

    </BrowserRouter>
  )
}

export default App
