import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  XMarkIcon,
  TruckIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export default function Cart() {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    cartTotal,
    user,
    placeOrder,
  } = useAppContext();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Reset confirmation dialog when cart changes
    setShowRemoveConfirm(null);
  }, [cart]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      setShowRemoveConfirm(productId);
    } else {
      updateCartQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    setShowRemoveConfirm(null);
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);

    setTimeout(() => {
      if (!user) {
        setIsCheckingOut(false);
        navigate("/login");
        return;
      }

      const success = placeOrder();
      setIsCheckingOut(false);

      if (success) {
        navigate("/dashboard");
      }
    }, 1000);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBagIcon className="h-10 w-10 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet. Start
              shopping to find amazing furniture for your home!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shopping Cart
          </h1>
          <p className="text-lg text-gray-600">
            {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-100 hover:border-primary-100 transition-colors"
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Product Image */}
                      <div className="relative w-full sm:w-48 h-48 bg-gray-50 rounded-lg overflow-hidden group">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                        {item.modelUrl && (
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                              to={`/product/${item.id}`}
                              className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
                            >
                              View in 3D
                            </Link>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link
                              to={`/product/${item.id}`}
                              className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors"
                            >
                              {item.name}
                            </Link>
                            <p className="text-gray-500 mt-1">{item.brand}</p>
                          </div>
                          <button
                            onClick={() => setShowRemoveConfirm(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-gray-50 rounded-full"
                          >
                            <XMarkIcon className="h-6 w-6" />
                          </button>
                        </div>

                        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center border-2 border-gray-200 rounded-lg">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                className="p-2 hover:bg-gray-50 text-gray-600 rounded-l-lg"
                              >
                                <MinusIcon className="h-5 w-5" />
                              </button>
                              <span className="w-12 text-center font-medium text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                className="p-2 hover:bg-gray-50 text-gray-600 rounded-r-lg"
                              >
                                <PlusIcon className="h-5 w-5" />
                              </button>
                            </div>
                            <p className="text-sm text-gray-500">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary-600">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Remove Confirmation */}
                        <AnimatePresence>
                          {showRemoveConfirm === item.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 bg-red-50 rounded-lg p-4"
                            >
                              <p className="text-red-800 mb-3">
                                Remove this item from your cart?
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                  Remove
                                </button>
                                <button
                                  onClick={() => setShowRemoveConfirm(null)}
                                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-primary-600">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Including VAT</p>
                </div>

                {/* Benefits */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <TruckIcon className="h-5 w-5 text-primary-600" />
                    <span>Free shipping on all orders</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <ShieldCheckIcon className="h-5 w-5 text-primary-600" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <CreditCardIcon className="h-5 w-5 text-primary-600" />
                    <span>Multiple payment options</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-medium"
                >
                  {isCheckingOut ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                      Processing...
                    </div>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </button>

                <Link
                  to="/products"
                  className="block text-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
