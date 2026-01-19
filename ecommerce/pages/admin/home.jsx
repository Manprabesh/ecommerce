import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Trash } from 'lucide-react';
import api from '../../services/api';
import AdminLayout from '../../components/AdminLayout';
import Loader from '../../components/Loader';
import { usePopup } from '../../components/popUpContext';
const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.url.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.url.length - 1 : prev - 1
    );
  };

  async function deleteProduct() {
    try {
      const response = await api.deleteProduct(product.product_id);
      console.log("Delete response:", response);
    } catch (error) {
      console.error("Error deleting product:", error);
    }

    console.log("product", product);
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative group">
        <img
          src={product.url[currentImageIndex]}
          alt={product.name}
          className="w-full h-64 object-cover"
        />

        {product.url.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {product.url.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 capitalize mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            ₹{product.price}
          </span>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors" onClick={() => deleteProduct()}>
            <Trash size={18} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};



const CategoryCard = ({ title, children }) => {
  return (
    <div className="mb-10 ">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 capitalize bg-blue-500">
        {title}
      </h2>
      {children}
    </div>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [categories, setCategory] = useState([]);
  const { showPopup } = usePopup();
  const [loader, setLoader] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState();
  const [visibleCount, setVisibleCount] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const response = await api.getAllProduct(6);
        console.log("response ", response.data);
        setProducts(response.data.productData || []);

      } catch (err) {
        console.error("Error fetching products:", err);
        showPopup({
          message: "error while fetching product",
          type: "error"
        })
      } finally {
        setLoader(false);
      }
    })();
  }, []);

  useEffect(() => {
    console.log("categories length", categories.length)
    setLoaderMessage("Fetching categories...")
    setLoader(true);
    async function fetchCategory() {
      try {

        const response = await api.getCategory();
        if (response.success) {
          setCategory(response.category);
        }

      } catch (error) {
        console.error("Failed to fetch category:", error);
      } finally {
        setLoader(false)
      }
    }

    fetchCategory();
  }, []);

  console.log("all categories ->", categories)



  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  const INITIAL_LIMIT = 6;
  const LOAD_MORE_STEP = 6;
  const loadMore = async (categoryId, category_name) => {
    // const total = (visibleCount[categoryId] || INITIAL_LIMIT) + INITIAL_LIMIT;
    // console.log("visible count", (visibleCount[categoryId] || INITIAL_LIMIT) + INITIAL_LIMIT)
    setVisibleCount((prev) => ({
      ...prev,
      [categoryId]: (prev[categoryId] || INITIAL_LIMIT) + LOAD_MORE_STEP,
    }));


    const cursorId = productsByCategory[categoryId].length - 1
    const cursor = productsByCategory[categoryId][cursorId]
    try {
      setLoader(true);
      setLoaderMessage("Fetching product")
      const response = await api.getNproducts(category_name, LOAD_MORE_STEP, cursor);
      // console.log("respone while fetching n products", response);
       setProducts((prev) => [
      ...prev,
      ...response.data.filter((newProduct) => {
        // console.log("Checking:", newProduct.product_id);
        return !prev.some(
          (p) => {
            // console.log("in some", p.product_id == newProduct.product_id)
            p.product_id == newProduct.product_id ? null : null
          }
        );
      }),
    ]);
    } catch (error) {
      showPopup({
        message: "error while fetching product",
        type: "error"
      })
    }
    finally {
      setLoader(false);
    }

  };


  const productsByCategory = categories.reduce((acc, category) => {
    acc[category.category_id] = products.filter(
      (p) => (p.category_id === category.category_id)
    );
    return acc;
  }, {});

  // console.log("product category", productsByCategory)
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-8 mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
            <p className="text-gray-600">Browse our collection of quality items</p>
          </div>
          {console.log("reading all products", products)}
          {loader && <Loader message={loaderMessage} />}

          {categories.map((cat) => {
            // console.log("categories", cat)
            const categoryProducts = productsByCategory[cat.category_id] || [];
            const visible =
              visibleCount[cat.category_id] || INITIAL_LIMIT;
            // console.log("visible  -->", visible)
            return (
              <CategoryCard
                key={cat.category_id}
                title={cat.category_name}
              >
                {categoryProducts.length === 0 ? (
                  <p className="text-gray-500">No products available</p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryProducts
                        .slice(0, visible)
                        .map((product) => (
                          <ProductCard
                            key={product.product_id}
                            product={product}
                          />
                        ))}
                    </div>

                  
                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={() => loadMore(cat.category_id, cat.category_name)}
                        className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                      >
                        Load More
                      </button>
                    </div>
                  </>
                )}
              </CategoryCard>
            );
          })}

        </div>
      </div>
    </AdminLayout>
  );
};


export default Home;

