import { useState, Suspense } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import FurnitureModel from "../components/3d/FurnitureModel";
import { products } from "../data/products";
import {
  HeartIcon,
  ShieldCheckIcon,
  TruckIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, addToFavorites, removeFromFavorites, favorites } =
    useAppContext();
  const [quantity, setQuantity] = useState(1);
  const [activeView, setActiveView] = useState("image"); // 'image' or '3d'
  const product = products.find((p) => p.id === parseInt(id));
  const isFavorite = favorites.some((item) => item.id === product.id);

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-4 h-4 ${
              index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // 3D Cube Icon Component
  const Cube3DIcon = ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05" />
      <path d="M12 22.08V12" />
    </svg>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Product Images and 3D View */}
        <div className="space-y-6">
          {/* View Toggle Buttons */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setActiveView("image")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 ${
                activeView === "image"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Product Image
            </button>
            <button
              onClick={() => setActiveView("3d")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 ${
                activeView === "3d"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Cube3DIcon className="w-5 h-5" />
              3D View
            </button>
          </div>

          {/* Main Display Area */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-md">
            {/* Product Image */}
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                activeView === "image"
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 3D Model Viewer */}
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                activeView === "3d"
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <Canvas>
                <Suspense fallback={null}>
                  <PerspectiveCamera makeDefault position={[0, 1, 5]} />
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  <FurnitureModel
                    modelPath={product.modelUrl}
                    scale={1}
                    autoRotate
                  />
                  <OrbitControls />
                  <Environment preset="apartment" />
                </Suspense>
              </Canvas>
            </div>
          </div>

          {/* View Indicator */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            {activeView === "3d" && (
              <>
                <Cube3DIcon className="w-4 h-4" />
                <span>Drag to rotate • Scroll to zoom</span>
              </>
            )}
          </div>
        </div>

        {/* Right Column - Product Information */}
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                By{" "}
                <Link to="/" className="text-primary-600 hover:underline">
                  {product.brand}
                </Link>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">
                {product.name}
              </h1>
            </div>
            <button
              onClick={handleToggleFavorite}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <HeartIcon
                className={`w-6 h-6 ${
                  isFavorite ? "text-red-500 fill-current" : "text-gray-400"
                }`}
              />
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            {renderStars(product.rating)}
            <Link
              to="#reviews"
              className="text-sm text-primary-600 hover:underline"
            >
              {product.reviewCount} Reviews
            </Link>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary-600">
                £{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-gray-500 line-through">
                    was £{product.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-sm font-medium text-red-600">
                    {product.salePercentage}% Off
                  </span>
                </>
              )}
            </div>
            <div className="text-sm text-gray-500">incl. VAT</div>
            {product.financing && (
              <div className="flex items-center gap-2 text-sm">
                <span>
                  or £
                  {(product.price / product.financing.monthlyPayments).toFixed(
                    2
                  )}{" "}
                  × {product.financing.monthlyPayments} with{" "}
                  {product.financing.provider}
                </span>
                <Link
                  to="/financing"
                  className="text-primary-600 hover:underline text-sm"
                >
                  Learn More
                </Link>
              </div>
            )}
          </div>

          {/* Delivery Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 text-gray-900">
              <TruckIcon className="w-5 h-5" />
              <span className="font-medium">Free Delivery</span>
            </div>
            {product.delivery?.deliveryDate && (
              <div className="mt-2 text-sm text-gray-600">
                Get it by {product.delivery.deliveryDate} to{" "}
                <button className="text-primary-600 hover:underline">
                  {product.delivery.deliveryCode}
                </button>
              </div>
            )}
          </div>

          {/* Services */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-4">Services</h3>
            <div className="space-y-3">
              {product.protection && (
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="protection-plan"
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="protection-plan"
                      className="flex items-center gap-2 text-sm text-gray-900"
                    >
                      <ShieldCheckIcon className="w-4 h-4" />
                      {product.protection.years} Year Protection Plan
                      <span className="text-primary-600">
                        - £{product.protection.price.toFixed(2)}
                      </span>
                    </label>
                    <Link
                      to="/protection"
                      className="text-primary-600 hover:underline text-sm"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Add to Cart Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border rounded-lg hover:bg-gray-50"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-16 text-center border rounded-lg p-2"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 border rounded-lg hover:bg-gray-50"
              >
                +
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
              >
                Add to Basket
              </button>
            </div>

            <button
              onClick={() => navigate("/room-designer", { state: { product } })}
              className="w-full border border-primary-600 text-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 flex items-center justify-center gap-2"
            >
              <Cube3DIcon className="w-5 h-5" />
              View in 3D Room
            </button>
          </div>

          {/* Product Details */}
          <div className="border-t pt-6">
            <h3 className="font-medium text-gray-900 mb-4">Product Details</h3>
            <p className="text-gray-600">{product.description}</p>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key}>
                  <dt className="font-medium text-gray-900 capitalize">
                    {key}
                  </dt>
                  <dd className="mt-1 text-gray-600">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
