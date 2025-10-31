import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Authentication } from "../pages/auth"
import Product from '../pages/admin/product'
import Category from '../pages/admin/category'
import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Authentication />} />
        <Route path="/admin/products" element={<Product />} />
        <Route path="/admin/create/products" element={<Category />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
