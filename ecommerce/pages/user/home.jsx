import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import UserLayout from '../../components/UserLayout';
import Loader from '../../components/Loader';
import { ProductCard } from '../../components/ProductCard';
import { usePopup } from '../../context/popUpContext';
import { SearchBar, FilterSection } from "../../components/SearchBar"

function useSentinel(onHit) {
  const ref = useRef(null);
  // console.log("reference",ref)
  // console.log("On hitt", onHit)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // console.log("entry",entry)
        if (entry.isIntersecting) {
          // console.log("entry--->", entry)
          onHit();
        }
        // console.log("on leave",entry.boundingClientRect.top)
      },
      {
        root: null,
        rootMargin:"0px 0px 70px 0px",
        // threshold: 1.0,
      }
    );

    // console.log("Observer", observer);


    if (ref.current) {observer.observe(ref.current)};
    // console.log("ref current",ref.current)

    return () => observer.disconnect();
  }, [onHit]);

  return ref;
}

const UserHome = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState(["shirt", "pants"])
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: null,
    minRating: 0,
    inStock: null
  });
  const [key,setKey]=useState('')
  // const [searchProducts,setSearchProducts] = useState([]);
  const elm = useRef(null)


  // const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreProducts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const cursorID = products[products.length - 1];

    // console.log("cursor difdddd -----------",cursorID)
    const res = await api.getNproducts(null,10, cursorID);

    console.log("response", res)
    setProducts(prev => [...prev, ...res.data]);
    // setCursor(res.nextCursor);

    if (res.data.length === 0) {
      setHasMore(false);
    }

    setLoading(false);
  };

  const sentinelRef = useSentinel(fetchMoreProducts);


  useEffect(() => {


    (async () => {
      try {
        let response = await api.getProducts();
        let categoryResponse = await api.getAllCategory()
        // console.log("fetching all product", response.data.productData);
        setProducts(response.data.productData || []);
        // console.log("get all category",categoryResponse)
        setCategories(categoryResponse.category)
        // setFilters(response.data || [])
      } catch (err) {
        // console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  const handleSearch = (query) => {
    // console.log("serchingw query", query);
    // setSearchQuery(query);
    setKey(query);
  };

  const handleFilterChange = (newFilters) => {
    // console.log("changing filter", newFilters)
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
      console.log("match search",matchesSearch)

    const matchesCategory = filters.categories.length === 0 ||
      filters.categories.includes(product.category);

    // console.log("filter pricce range", filters.priceRange)
    const matchesPrice = !filters.priceRange ||
      (product.price >= filters.priceRange.min && product.price <= filters.priceRange.max);
    // console.log("--------------", matchesPrice)

    const matchesRating = filters.minRating === 0 ||
      (product.rating && product.rating >= filters.minRating);

    const matchesStock = filters.inStock === null ||
      product.inStock === filters.inStock;

    return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock;
  });
  // console.log("filter products", filteredProducts)


  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  async function searchProduct(){
    const response =await api.searchProduct(key);
    // console.log("the incoming data is",response)
    // setSearchProducts(response.data)
    setProducts(response.data)
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
          <div className="mb-6 sm:mb-8 flex">

            <SearchBar onSearch={handleSearch} placeholder="Search for products..." />
            <button className='bg-blue-500 w-30 rounded-xl' onClick={()=>searchProduct()}>Search</button>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6" >
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.product_id} product={product} />
                    ))}
                  </div>
                   {loading && <Loader />}
                </>
              ) : (
                <div className="text-center py-8 sm:py-12 bg-white rounded-lg">
                  <p className="text-base sm:text-lg text-gray-500">No products found</p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-2">
                    Try adjusting your filters or search
                  </p>
                </div>
              )}
              <div ref={sentinelRef} className="h-4" />
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};
export default UserHome;
