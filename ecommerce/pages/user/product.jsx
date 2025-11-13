import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import api from "../../services/api";
import Popup from "../../src/utils/popup";
import Loader from "../../components/Loader";
import UserLayout from "../../components/UserLayout";

export default function UserProduct() {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state || null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const role = localStorage.getItem('role');
  console.log("get role", role)
  console.log("all product----.", product);
  console.log("product_id", id)

  console.log("the locatio page", location)

  const nextImage = () =>
    setCurrentIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );

  const prevImage = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );

  async function addCart(data) {
    const cart_data = {
      user_id: localStorage.getItem('userId'),
      product_id: data.product_id
    }
    console.log("add to cart", cart_data);
    const response = await api.addToCart(cart_data);
    console.log("response from cart data", cart_data)
  }

  async function deleteProduct(product) {
    console.log("product--->", product)
    setShowPopup(true);
  }

  async function confirmfileDelete() {
    console.log("file deleted successfully")
    setShowPopup(false);
  }
  async function deleteCancel() {
    console.log("file cancel successfully")
    setShowPopup(false);
  }


  if (!product) return <Loader />;

  return (
    <UserLayout>
      <div className="bg-black min-h-screen flex items-start justify-center p-8">
        <div className="flex flex-col w-[22rem] mt-20 ">
          {/* Image Section */}
          <div className="relative">
            <img
              src={product.images[currentIndex]}
              alt=""
              className="w-full h-72 object-cover rounded-2xl shadow-lg border border-gray-700 transition-transform duration-300 hover:scale-105"
            />

            {/* Left Button */}
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800/70 hover:bg-gray-700 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold shadow-md transition-all duration-300"
            >
              ‹
            </button>

            {/* Right Button */}
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800/70 hover:bg-gray-700 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold shadow-md transition-all duration-300"
            >
              ›
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 w-full flex justify-center gap-2">
              {product.images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full ${idx === currentIndex ? "bg-red-500" : "bg-gray-600"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-4 space-y-2 text-white">
            <h2 className="text-xl font-semibold capitalize tracking-wide">
              {product.product_name}
            </h2>
            <p className="text-red-400 font-medium text-lg">
              ₹{product.product_price.toLocaleString()}
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {product.product_description}
            </p>
          </div>
          {/* Showing popup */}
          <Popup
            visible={showPopup}
            message="Are you sure you want to delete this product?"
            onConfirm={confirmfileDelete}
            onCancel={deleteCancel}
          />

          {
            role == 'admin' ? (<div className="flex justify-center mt-4 gap-4">
              <button className="bg-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-200" onClick={() => deleteProduct(product)}>
                Delete product
              </button>
              <button
                className="bg-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-200"
                onClick={() => addCart(product)}
              >
                Update product
              </button>
            </div>) : (<div className="flex justify-center mt-4 gap-4">
              <button className="bg-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-200">
                Buy
              </button>
              <button
                className="bg-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-200"
                onClick={() => addCart(product)}
              >
                Add to cart
              </button>
            </div>)
          }

        </div>
      </div>
    </UserLayout>
  );
}
