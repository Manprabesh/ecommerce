import { useNavigate } from "react-router";
import { useState, useEffect, useContext } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePopup } from "../context/popUpContext";
import { UseAuth } from "./AuthContext";
import api from "../services/api";
export const ProductCard = ({ product }) => {
    // console.log("getting products", product)
    const navigate = useNavigate();
    const { showPopup } = usePopup();
    const {userID} = UseAuth()
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    //   const authData = useContext(AuthContext)

// console.log("auth data",)
    const nextImage = () => {
        setCurrentImageIndex((prev) => (
            // console.log("setting current Index",prev)
            prev === product.url.length - 1 ? 0 : prev + 1)
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? product.url.length - 1 : prev - 1
        );
    };

    async function addCart(data) {
        const cart_data = {
            user_id: userID,
            product_id: data.product_id
        }
        console.log("add to cart",cart_data );
        const response = await api.addToCart(cart_data);
        console.log("response from cart data", cart_data)
        setTimeout(() => {
            showPopup({
                message: "Product added to cart",
                type: "Cart",
                duration: 4000,
            });
        }, 1000 / 2)
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative group" x>
                <img
                    src={product.url[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                    onClick={() => navigate("/user/product", { state: product })}

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
                                    className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-red-500' : 'bg-yellow-300'
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
                    <button
                        className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 active:scale-95 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-150"
                        onClick={() => addCart(product)}
                    >
                        <ShoppingCart size={18} />
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};