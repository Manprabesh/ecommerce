import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import api from "../../services/api";
import UserLayout from "../../components/UserLayout";
function Order() {
  const [orders, setOrders] = useState([]);
  const [currentIdx, setCurrentIdx] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const response = await api.getAllOrders(userId);
        
        if (response.success) {
          setOrders(response.data);
          setCurrentIdx(Array(response.data.length).fill(0));
        } else {
          setError("Failed to fetch orders");
        }
      } catch (err) {
        setError("An error occurred while fetching orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const navigateImage = (index, direction) => {
    setCurrentIdx((prev) => {
      const updated = [...prev];
      const total = orders[index].product.length;
      updated[index] = direction === 'left' 
        ? (prev[index] - 1 + total) % total
        : (prev[index] + 1) % total;
      return updated;
    });
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('delivered') || statusLower.includes('completed')) {
      return 'text-green-600 bg-green-50';
    }
    if (statusLower.includes('pending') || statusLower.includes('processing')) {
      return 'text-yellow-600 bg-yellow-50';
    }
    if (statusLower.includes('cancelled') || statusLower.includes('failed')) {
      return 'text-red-600 bg-red-50';
    }
    return 'text-blue-600 bg-blue-50';
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('delivered') || statusLower.includes('completed')) {
      return <CheckCircle className="w-5 h-5" />;
    }
    if (statusLower.includes('cancelled') || statusLower.includes('failed')) {
      return <XCircle className="w-5 h-5" />;
    }
    return <Clock className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Orders Yet</h2>
          <p className="text-gray-600">You haven't placed any orders. Start shopping to see your orders here!</p>
        </div>
      </div>
    );
  }

  return (
    <UserLayout>
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        <div className="space-y-6">
          {orders.map((order, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="md:flex">
                {/* Image Gallery Section */}
                <div className="md:w-1/3 relative bg-gray-100">
                  {order.product && order.product.length > 0 ? (
                    <>
                      <img 
                        src={order.product[currentIdx[index]]} 
                        alt={`Product ${currentIdx[index] + 1}`}
                        className="w-full h-64 md:h-full object-cover"
                      />
                      
                      {order.product.length > 1 && (
                        <>
                          <button
                            onClick={() => navigateImage(index, 'left')}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="w-5 h-5 text-gray-800" />
                          </button>
                          
                          <button
                            onClick={() => navigateImage(index, 'right')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                            aria-label="Next image"
                          >
                            <ChevronRight className="w-5 h-5 text-gray-800" />
                          </button>

                          {/* Image indicators */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {order.product.map((_, imgIdx) => (
                              <div
                                key={imgIdx}
                                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                  imgIdx === currentIdx[index]
                                    ? 'bg-white w-6'
                                    : 'bg-white/50'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-64 md:h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Order Details Section */}
                <div className="md:w-2/3 p-6">
                  <div className="flex flex-col h-full">
                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.order_status)}`}>
                        {getStatusIcon(order.order_status)}
                        {order.order_status || 'Pending'}
                      </span>
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.payment_status)}`}>
                        Payment: {order.payment_status || 'Pending'}
                      </span>
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {order.name || 'Product Name'}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {order.description || 'No description available'}
                      </p>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-2xl font-bold text-gray-900">
                          Rs{order.price ? order.price.toFixed(2) : '0.00'}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium">
                          View Details
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                          Track Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </UserLayout>
  );
}

export default Order;