import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import {
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { cart, favorites, user, logout, isAdmin } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  // Close the user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/login");
  };

  const navigation = [
    { name: "New", href: "/", icon: HomeIcon },
    { name: "Shop All", href: "/products", icon: HomeIcon },
    { name: "Lounge & Living", href: "/category/living-room", icon: HomeIcon },
    { name: "Dining & Kitchen", href: "/category/dining-room", icon: HomeIcon },
    { name: "Sleep & Comfort", href: "/category/bedroom", icon: HomeIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Banner */}
      <div className="bg-primary-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2">
            <span>Fast Delivery on Styles You'll Love</span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/professional" className="hover:underline">
              Professional
            </Link>
            <span>|</span>
            <Link to="/app" className="hover:underline">
              App
            </Link>
          </div>
        </div>
      </div>

      <header className="bg-white shadow-sm">
        {/* Main Navigation */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/">
                <div className="flex items-center space-x-1">
                  <span className="text-2xl font-bold text-primary-600">
                    Purple
                  </span>
                  <span className="text-2xl font-bold text-black">Palace</span>
                </div>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-3xl mx-6">
              <div className="w-full relative">
                <input
                  type="text"
                  placeholder="Find anything home..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary-600">
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Desktop icons */}
            <div className="hidden lg:flex lg:items-center lg:space-x-6">
              {/* User / Login */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 focus:outline-none"
                  >
                    <UserIcon className="h-6 w-6" />
                    <span>Sign In</span>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-50">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        {user.name}
                      </div>
                      <Link
                        to={isAdmin ? "/admin" : "/dashboard"}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-1 text-gray-700 hover:text-gray-900"
                >
                  <UserIcon className="h-6 w-6" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Favorites */}
              <Link
                to="/favorites"
                className="relative text-gray-700 hover:text-gray-900"
              >
                <HeartIcon className="h-6 w-6" />
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {favorites.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
              >
                <div className="relative">
                  <ShoppingCartIcon className="h-6 w-6" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cart.length}
                    </span>
                  )}
                </div>
                <span>Basket</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center space-x-4 lg:hidden">
              <Link
                to="/cart"
                className="relative text-gray-700 hover:text-gray-900"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cart.length}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Category Navigation */}
          <div className="hidden lg:block border-t border-gray-200">
            <div className="flex space-x-8 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium ${
                    location.pathname === item.href
                      ? "text-primary-600"
                      : "text-gray-700 hover:text-primary-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile slide-out */}
          {isMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="px-2 py-3">
                  {/* Search in mobile */}
                  <div className="px-3 mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Find anything home..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                        <MagnifyingGlassIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <ChevronRightIcon className="h-5 w-5" />
                    </Link>
                  ))}

                  <div className="border-t border-gray-200 my-4" />

                  {/* User section */}
                  {!user ? (
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                    >
                      <UserIcon className="h-5 w-5" />
                      <span className="font-medium">Sign In</span>
                    </Link>
                  ) : (
                    <>
                      <div className="px-3 py-2 text-sm text-gray-500">
                        Signed in as {user.name}
                      </div>
                      <Link
                        to={isAdmin ? "/admin" : "/dashboard"}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                      >
                        <span className="font-medium">Dashboard</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <span className="font-medium">Logout</span>
                      </button>
                    </>
                  )}

                  <div className="border-t border-gray-200 my-4" />

                  {/* Favorites */}
                  <Link
                    to="/favorites"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                  >
                    <div className="flex items-center space-x-3">
                      <HeartIcon className="h-5 w-5" />
                      <span className="font-medium">Favorites</span>
                    </div>
                    {favorites.length > 0 && (
                      <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-sm">
                        {favorites.length}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-gradient-to-r from-primary-800 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-6">About Purple Palace</h3>
              <p className="text-primary-200 leading-relaxed">
                Discover the perfect blend of luxury and comfort with our
                curated collection of premium furniture, featuring immersive 3D
                visualization.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6">Shop By Room</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/category/living-room"
                    className="text-primary-200 hover:text-white transition-colors duration-200"
                  >
                    Living Room
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/dining-room"
                    className="text-primary-200 hover:text-white transition-colors duration-200"
                  >
                    Dining Room
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/bedroom"
                    className="text-primary-200 hover:text-white transition-colors duration-200"
                  >
                    Bedroom
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6">Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/contact"
                    className="text-primary-200 hover:text-white transition-colors duration-200"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shipping"
                    className="text-primary-200 hover:text-white transition-colors duration-200"
                  >
                    Shipping & Delivery
                  </Link>
                </li>
                <li>
                  <Link
                    to="/returns"
                    className="text-primary-200 hover:text-white transition-colors duration-200"
                  >
                    Returns & Exchanges
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6">Stay Connected</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-primary-200 hover:text-white transition-colors duration-200"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-primary-200 hover:text-white transition-colors duration-200"
                  >
                    Pinterest
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-primary-200 hover:text-white transition-colors duration-200"
                  >
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-primary-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-primary-300 text-sm">
                &copy; 2025 Purple Palace. All rights reserved.
              </p>
              <div className="mt-4 md:mt-0 space-x-6">
                <Link
                  to="/privacy"
                  className="text-primary-300 hover:text-white text-sm"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="text-primary-300 hover:text-white text-sm"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
