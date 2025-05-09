import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  CubeIcon,
  XMarkIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  PhotoIcon,
  CurrencyDollarIcon,
  TagIcon,
  DocumentTextIcon,
  Cube3dIcon,
} from "@heroicons/react/24/outline";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const {
    user,
    isAdmin,
    getAllOrders,
    updateOrderStatus,
    products,
    setProducts,
  } = useAppContext();
  const [activeTab, setActiveTab] = useState("products");
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Redirect if not admin
  if (!user || !isAdmin) {
    navigate("/login");
    return null;
  }

  const orders = getAllOrders();

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== productId));
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          icon: <CheckCircleIcon className="h-5 w-5 text-green-600" />,
        };
      case "Cancelled":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          icon: <XCircleIcon className="h-5 w-5 text-red-600" />,
        };
      default:
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          icon: <ClockIcon className="h-5 w-5 text-yellow-600" />,
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Dashboard Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <ChartBarIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Manage your products and orders</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary-50 rounded-xl p-4 flex items-center gap-3">
              <div className="bg-primary-100 rounded-lg p-2">
                <CubeIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-xl font-bold text-primary-900">
                  {products.length}
                </p>
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 flex items-center gap-3">
              <div className="bg-green-100 rounded-lg p-2">
                <ShoppingBagIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-xl font-bold text-green-900">
                  {orders.length}
                </p>
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">
              <div className="bg-blue-100 rounded-lg p-2">
                <UserGroupIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-xl font-bold text-blue-900">24</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${
                activeTab === "products"
                  ? "bg-primary-50 text-primary-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <CubeIcon className="h-5 w-5" />
              <span>Products</span>
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${
                activeTab === "orders"
                  ? "bg-primary-50 text-primary-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <ArrowPathIcon className="h-5 w-5" />
              <span>Orders</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {activeTab === "products" && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Products</h2>
                <button
                  onClick={() => setIsAddingProduct(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span>Add Product</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:border-primary-100 hover:shadow-md transition-all duration-300 overflow-hidden"
                  >
                    <Link to={`/product/${product.id}`}>
                      <div className="aspect-square bg-gray-50 overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = "/images/placeholder.png";
                            e.target.onerror = null;
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-500">
                            {product.category}
                          </span>
                          {product.featured && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-primary-50 text-primary-600 rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="mt-2 space-y-1">
                          <p className="text-lg font-bold text-primary-600">
                            ${product.price.toFixed(2)}
                          </p>
                          {product.originalPrice && (
                            <p className="text-sm text-gray-500 line-through">
                              ${product.originalPrice.toFixed(2)}
                            </p>
                          )}
                        </div>
                        {!product.inStock && (
                          <p className="mt-2 text-sm font-medium text-red-600">
                            Out of Stock
                          </p>
                        )}
                      </div>
                    </Link>
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedProduct(product);
                        }}
                        className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                      >
                        <PencilIcon className="h-5 w-5 text-primary-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteProduct(product.id);
                        }}
                        className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                      >
                        <TrashIcon className="h-5 w-5 text-red-600" />
                      </button>
                    </div>
                    {product.salePercentage && (
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-lg">
                          {product.salePercentage}% OFF
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Orders</h2>
              <div className="space-y-4">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    layout
                    className="border border-gray-100 rounded-xl overflow-hidden hover:border-primary-100 transition-colors"
                  >
                    <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusStyle(order.status).icon}
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              getStatusStyle(order.status).bg
                            } ${getStatusStyle(order.status).text}`}
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

                    <div className="p-6">
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">
                          Customer:{" "}
                          <span className="font-medium text-gray-900">
                            {order.userEmail}
                          </span>
                        </p>
                      </div>

                      {order.status === "Pending" && (
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, "Completed")
                            }
                            className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            Complete Order
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, "Cancelled")
                            }
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            Cancel Order
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {(isAddingProduct || selectedProduct) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedProduct ? "Edit Product" : "Add New Product"}
                  </h2>
                  <button
                    onClick={() => {
                      setIsAddingProduct(false);
                      setSelectedProduct(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter product name"
                      />
                      <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <div className="relative">
                      <textarea
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        rows="3"
                        placeholder="Enter product description"
                      />
                      <DocumentTextIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="0.00"
                        />
                        <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        <option value="">Select category</option>
                        <option value="living-room">Living Room</option>
                        <option value="bedroom">Bedroom</option>
                        <option value="dining">Dining</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Images
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Drag and drop images here, or click to select files
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      3D Model URL
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter 3D model URL"
                      />
                      <CubeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        In Stock
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Featured Product
                      </span>
                    </label>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <button
                      type="submit"
                      className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      {selectedProduct ? "Update Product" : "Add Product"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
