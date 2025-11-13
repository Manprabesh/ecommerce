import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import api from '../../services/api';
import UserLayout from '../../components/UserLayout';

const Cart = () => {
  const user_id = localStorage.getItem('userId');
  console.log("user id --->", user_id);

  const [cartItems, setCartItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await api.getCart(user_id);
        console.log("response", response);
        if (response.success) {
          setCartItems(response.data);
          // Initialize index array for each product
          setCurrentIndex(new Array(response.data.length).fill(0));
        }
      } catch (error) {
        console.log("Error while fetching cart", error.message);
        alert("Error while fetching product");
      }
    })();
  }, []);

  const updateQuantity = (cartId, delta) => {
    const userId = localStorage.getItem('userId');
    console.log("user id-->", userId)
    setCartItems(items =>
      items.map(item =>
        item.cart_id === cartId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );

    (async () => {
      let product_id = null;
      const data = cartItems.map((item) => {
        if (item.cart_id === cartId) {
          product_id = item.product_id
        }
      })

      const cart_data = {
        user_id: localStorage.getItem('userId'),
        product_id
      }
      if (delta === 1) {
        const response = await api.addToCart(cart_data);
        console.log("response", response)
      }
      else{
        console.log("reduce carttt")
        const response = await api.reduceFromCart(cart_data);
        console.log("response", response)
      }
    })()

  };

  const removeItem = (cartId) => {
    setCartItems(items => items.filter(item => item.cart_id !== cartId));
    (async () => {
      const response = await api.deleteFromCart(cartId);
      console.log("deleted from cart", response)
    })()
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTax = () => calculateSubtotal() * 0.18;
  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const nextImage = (index) => {
    setCurrentIndex((prev) => {
      const updated = [...prev];
      const total = cartItems[index].product.length;
      updated[index] = (prev[index] + 1) % total;
      return updated;
    });
  };

  const prevImage = (index) => {
    setCurrentIndex((prev) => {
      const updated = [...prev];
      const total = cartItems[index].product.length;
      updated[index] = (prev[index] - 1 + total) % total;
      return updated;
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600">Add some products to get started</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <UserLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto mt-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <div key={item.cart_id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    <div className="relative">
                      <img
                        src={item.product[currentIndex[index]]}
                        alt=""
                        className="w-100 h-72 object-cover rounded-2xl shadow-lg border border-gray-700 transition-transform duration-300 hover:scale-105"
                      />

                      {/* Left Button */}
                      <button
                        onClick={() => prevImage(index)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800/70 hover:bg-gray-700 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold shadow-md transition-all duration-300"
                      >
                        ‹
                      </button>

                      {/* Right Button */}
                      <button
                        onClick={() => nextImage(index)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800/70 hover:bg-gray-700 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold shadow-md transition-all duration-300"
                      >
                        ›
                      </button>

                      {/* Dots */}
                      <div className="absolute bottom-3 w-full flex justify-center gap-2">
                        {item.product.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-2.5 h-2.5 rounded-full ${idx === currentIndex[index] ? "bg-red-500" : "bg-gray-600"
                              }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.category_name}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.cart_id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.cart_id, -1)}
                            className="p-2 hover:bg-gray-100 rounded-l-lg"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cart_id, 1)}
                            className="p-2 hover:bg-gray-100 rounded-r-lg"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-500">₹{item.price} each</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (18%)</span>
                    <span>₹{calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>₹{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-3">
                  Proceed to Checkout
                </button>

                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Continue Shopping
                </button>

                <div className="mt-6 text-sm text-gray-500">
                  <p className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Free shipping on orders over ₹500
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Cart;
