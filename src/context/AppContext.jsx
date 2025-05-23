import { createContext, useContext, useState, useEffect } from "react";
import { products as initialProducts } from "../data/products";

// Create the context
export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export function AppProvider({ children }) {
  // Auth State
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState(() => {
    // Initialize users from localStorage if available
    const savedUsers = localStorage.getItem("users");
    return savedUsers
      ? JSON.parse(savedUsers)
      : [
          {
            id: "admin",
            email: "admin@example.com",
            password: "admin",
            name: "Admin User",
          },
          {
            id: "user",
            email: "user@example.com",
            password: "user",
            name: "Regular User",
          },
        ];
  });

  // Shopping Cart State
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    // Initialize favorites from localStorage if available
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Orders State
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      localStorage.removeItem("orders"); // Clear existing orders
    }

    // Create sample orders using products
    const sampleOrders = [
      {
        id: "1",
        userId: "user",
        userEmail: "user@example.com",
        items: [
          {
            id: 11,
            name: "Modern TV Stand",
            price: 499.99,
            quantity: 2,
            image: "/images/entertainment_unit.png",
          },
        ],
        total: 999.98,
        status: "Completed",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      },
      {
        id: "2",
        userId: "user",
        userEmail: "user@example.com",
        items: [
          {
            id: 25,
            name: "Extendable Dining Table",
            price: 1499.99,
            quantity: 1,
            image: "/images/extendable_table.png",
          },
        ],
        total: 1499.99,
        status: "Processing",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      },
      {
        id: "3",
        userId: "user",
        userEmail: "user@example.com",
        items: [
          {
            id: 28,
            name: "Smart Wardrobe",
            price: 1299.99,
            quantity: 1,
            image: "/images/smart_wardrobe.png",
          },
          {
            id: 29,
            name: "Premium Mattress",
            price: 899.99,
            quantity: 2,
            image: "/images/premium_mattress.png",
          },
        ],
        total: 3099.97,
        status: "Shipping",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      },
    ];

    return sampleOrders;
  });

  // Product View State
  const [activeProduct, setActiveProduct] = useState(null);
  const [viewMode, setViewMode] = useState("2d"); // '2d' or '3d'

  // Product State
  const [products, setProducts] = useState(initialProducts);

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // Cart Functions
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          ...product,
          quantity,
          image: product.images ? product.images[0] : product.image,
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      )
    );
  };

  // Order Functions
  const placeOrder = () => {
    if (cart.length === 0 || !user) return false;

    const newOrder = {
      id: Date.now().toString(),
      userId: user.id,
      userEmail: user.email,
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      total: cartTotal,
      status: "Pending",
      date: new Date().toISOString(),
    };

    setOrders((prev) => [...prev, newOrder]);
    setCart([]); // Clear cart after order is placed
    return true;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // Get user's orders
  const getUserOrders = () => {
    if (!user) return [];
    return orders.filter((order) => order.userId === user.id);
  };

  // Get all orders (for admin)
  const getAllOrders = () => {
    if (!isAdmin) return [];
    return orders;
  };

  // Favorites Functions
  const addToFavorites = (product) => {
    setFavorites((prev) => {
      if (!prev.some((fav) => fav.id === product.id)) {
        const newFavorites = [...prev, product];
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
        return newFavorites;
      }
      return prev;
    });
  };

  const removeFromFavorites = (productId) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter((product) => product.id !== productId);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  // Auth Functions
  const register = (userData) => {
    // Check if email already exists
    if (users.some((user) => user.email === userData.email)) {
      return { success: false, message: "Email already exists" };
    }

    const newUser = {
      id: Date.now().toString(),
      email: userData.email,
      password: userData.password,
      name: userData.name,
    };

    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    setIsAdmin(false);
    return { success: true, message: "Registration successful" };
  };

  const login = (credentials) => {
    const foundUser = users.find(
      (u) =>
        u.email === credentials.email && u.password === credentials.password
    );

    if (foundUser) {
      setUser(foundUser);
      setIsAdmin(foundUser.email === "admin@example.com");
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    setCart([]);
  };

  // Calculate cart total
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Context value
  const contextValue = {
    user,
    isAdmin,
    cart,
    cartTotal,
    favorites,
    activeProduct,
    viewMode,
    orders,
    login,
    logout,
    register,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    addToFavorites,
    removeFromFavorites,
    setActiveProduct,
    setViewMode,
    products,
    setProducts,
    placeOrder,
    updateOrderStatus,
    getUserOrders,
    getAllOrders,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
