import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingBagIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  TruckIcon,
  UserCircleIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const { user, getUserOrders, updateOrderStatus, products } = useAppContext();
  const navigate = useNavigate();

  // Redirect if not logged in
  if (!user) {
    navigate("/login");
    return null;
  }

  const orders = getUserOrders();

  const handleUpdateStatus = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleProductClick = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      navigate(`/product/${productId}`, { state: { product } });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "Cancelled":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case "Processing":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case "Shipping":
        return <TruckIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      case "Processing":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Shipping":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* User Welcome Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <UserCircleIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600">
                Manage your orders and track your purchases
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary-50 rounded-xl p-4 flex items-center gap-3">
              <div className="bg-primary-100 rounded-lg p-2">
                <ShoppingBagIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-xl font-bold text-primary-900">
                  {orders.length}
                </p>
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 flex items-center gap-3">
              <div className="bg-green-100 rounded-lg p-2">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-xl font-bold text-green-900">
                  {
                    orders.filter((order) => order.status === "Completed")
                      .length
                  }
                </p>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 flex items-center gap-3">
              <div className="bg-yellow-100 rounded-lg p-2">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-xl font-bold text-yellow-900">
                  {
                    orders.filter(
                      (order) =>
                        order.status === "Processing" ||
                        order.status === "Shipping"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link
              to="/products"
              className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              Browse Products
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCartIcon className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-600 mb-8">
                Start shopping to begin your furniture journey!
              </p>
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Start Shopping
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-100 rounded-xl overflow-hidden hover:border-primary-100 transition-colors"
                >
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="hidden sm:block border-l border-gray-200 h-6 mx-4" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Order #{order.id}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-primary-600">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0"
                        >
                          <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <button
                              onClick={() => handleProductClick(item.id)}
                              className="text-lg font-medium text-gray-900 hover:text-primary-600 transition-colors truncate block text-left"
                            >
                              {item.name}
                            </button>
                            <p className="text-gray-500">
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <p className="font-bold text-gray-900">
                            ${(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Order Actions */}
                    {order.status === "Pending" && (
                      <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
                        <button
                          onClick={() =>
                            handleUpdateStatus(order.id, "Cancelled")
                          }
                          className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
