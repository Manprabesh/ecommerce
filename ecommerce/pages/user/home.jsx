import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import api from "../../services/api";
import { Loader2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import UserLayout from "../../components/UserLayout";

const UserHome = () => {
  const [products, setProducts] = useState([]);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await api.getAllProduct();

        //Combinng the product data & product images
        if (response.success) {
          console.log("reaading response data", response.data)
          const combined = response.data.map((product, index) => ({
            ...product,
            images: response.images[index] || [],
          }));
          setProducts(combined);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoader(false);
      }
    }

    fetchProduct();
  }, []);

  const grouped = products.reduce((acc, item) => {
    const category = item.category_name || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});


  if (loader) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-gray-600 w-8 h-8" />
      </div>
    );
  }

  return (
    <UserLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 mt-10">
          🛍 Product Catalog
        </h1>

        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600 border-b pb-2">
              {category}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((product) => (
                <div
                  key={product.product_id}
                  className="bg-white border rounded-xl shadow-md hover:shadow-lg transition p-4 cursor-pointer"
                  onClick={() => navigate(`/product/${product.product_id}`, { state: product })}
                >
                  {/* Image Carousel */}
                  {product.images?.length > 0 ? (
                    <Swiper
                      modules={[Navigation, Pagination, Autoplay]}
                      autoplay={{ delay: 1000 }}
                      spaceBetween={10}
                      slidesPerView={1}
                      navigation
                      pagination={{ clickable: true }}
                      className="rounded-lg mb-3"
                    >
                      {product.images.map((img, idx) => (
                        <SwiperSlide key={idx}>
                          <img
                            src={img}
                            alt={`${product.product_name}-${idx}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}

                  {/* Product Info */}
                  <h3 className="font-bold text-lg text-gray-800 mb-1">
                    {product.product_name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {product.product_description}
                  </p>
                  <p className="font-semibold text-gray-900">
                    ₹{product.product_price || 0}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </UserLayout>
  );
};

export default UserHome;
