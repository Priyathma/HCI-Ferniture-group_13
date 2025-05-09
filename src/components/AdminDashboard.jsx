import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import {
  PlusIcon,
  TrashIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowPathIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";

export default function AdminDashboard() {
  const { products, setProducts, orders, updateOrderStatus } = useAppContext();
  const [activeTab, setActiveTab] = useState("products");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
  });

  const handleAddProduct = () => {
    const productToAdd = {
      ...newProduct,
      id: Date.now().toString(),
      price: parseFloat(newProduct.price),
    };
    setProducts([...products, productToAdd]);
    setNewProduct({
      name: "",
      description: "",
      price: "",
      image: "",
      category: "",
    });
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  const formattedDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {activeTab === "products" && (
            <div className="space-y-8">
              {/* Add New Product Form */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Add New Product
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                  <textarea
                    rows={3}
                    placeholder="Description"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={newProduct.image}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, image: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>
                <button
                  onClick={handleAddProduct}
                  className="mt-6 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add Product
                </button>
              </div>

              {/* Existing Products Grid */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Existing Products
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-100 rounded-xl overflow-hidden hover:border-primary-100 transition-colors"
                    >
                      <div className="aspect-square bg-gray-50 overflow-hidden">
                        <img
                          src={product.image || product.images?.[0]}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="p-6 space-y-2">
                        <p className="font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {product.category}
                        </p>
                        <p className="text-primary-600 font-bold">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="p-4 border-t border-gray-100 flex justify-end">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Orders</h2>
              <div className="space-y-4">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-100 rounded-xl overflow-hidden hover:border-primary-100 transition-colors"
                  >
                    <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {order.status === "Completed" ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          ) : order.status === "Cancelled" ? (
                            <XCircleIcon className="h-5 w-5 text-red-500" />
                          ) : (
                            <ClockIcon className="h-5 w-5 text-yellow-500" />
                          )}
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === "Completed"
                                ? "bg-green-50 text-green-700"
                                : order.status === "Cancelled"
                                ? "bg-red-50 text-red-700"
                                : "bg-yellow-50 text-yellow-700"
                            }`}
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
                            {formattedDate(order.date)}
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
                              updateOrderStatus(order.id, "Completed")
                            }
                            className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            Complete Order
                          </button>
                          <button
                            onClick={() =>
                              updateOrderStatus(order.id, "Cancelled")
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
