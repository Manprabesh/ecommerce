import React, { useState, useEffect, useContext } from 'react';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import { useNavigate } from 'react-router';
import UserLayout from '../../components/UserLayout';
import { AuthContext } from '../../components/AuthContext';
import Loader from '../../components/Loader';
import { ProductCard } from '../../components/ProductCard';
import { usePopup } from '../../components/popUpContext';
import {SearchBar,FilterSection} from "../../components/SearchBar"
const UserHome = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState(["shirt","pants"])
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: null,
    minRating: 0,
    inStock: null
  });

  useEffect(() => {
    (async () => {
      try {
        const response = await api.getAllProduct();
        console.log("response ", response.data);
        setProducts(response.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Extract unique categories from products
  // const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      priceRange: null,
      minRating: 0,
      inStock: null
    });
  };

  // Apply filters to products
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filters.categories.length === 0 || 
      filters.categories.includes(product.category);

    const matchesPrice = !filters.priceRange || 
      (product.price >= filters.priceRange.min && product.price <= filters.priceRange.max);

    const matchesRating = filters.minRating === 0 || 
      (product.rating && product.rating >= filters.minRating);

    const matchesStock = filters.inStock === null || 
      product.inStock === filters.inStock;

    return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock;
  });

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
   <UserLayout>
  <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 mt-10 sm:mt-12 lg:mt-10">
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
          Our Products
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Browse our collection of quality items
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 sm:mb-8">
        <SearchBar onSearch={handleSearch} placeholder="Search for products..." />
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Sidebar Filter - Hidden on mobile (handled by FilterSection component) */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <FilterSection 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            categories={categories}
          />
        </div>

        {/* Mobile Filter - Visible only on mobile (handled by FilterSection component) */}
        <div className="lg:hidden">
          <FilterSection 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            categories={categories}
          />
        </div>

        {/* Products Grid */}
        <div className="flex-1 w-full">
          {filteredProducts.length > 0 ? (
            <>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                Showing {filteredProducts.length} of {products.length} products
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.product_id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 sm:py-12 bg-white rounded-lg">
              <p className="text-base sm:text-lg text-gray-500">No products found</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-2">
                Try adjusting your filters or search
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</UserLayout>
  );
};

// export default UserHome;

  export default UserHome;