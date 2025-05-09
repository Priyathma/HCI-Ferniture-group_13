import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function ProductCard({ product }) {
  const { addToFavorites, removeFromFavorites, favorites } =
    useContext(AppContext);

  const isFavorite = favorites?.some((fav) => fav.id === product.id);

  const toggleFavorite = (e) => {
    e.preventDefault(); // Prevent navigating to product details
    if (isFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="relative block overflow-hidden"
    >
      {/* Favorite Button */}
      <button
        onClick={toggleFavorite}
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
      >
        {isFavorite ? (
          <FaHeart className="text-red-500 text-xl" />
        ) : (
          <FaRegHeart className="text-gray-600 text-xl" />
        )}
      </button>

      {/* Card Container */}
      <div className="relative border border-primary-900 rounded-lg bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
        <div className="w-full h-64 overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-opacity duration-300"></div>
        {/* Details Panel */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white bg-opacity-90">
          <p className="font-serif font-semibold text-lg text-primary-900 truncate">
            {product.name}
          </p>
          <p className="text-primary-600 mt-1">${product.price.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  );
}
