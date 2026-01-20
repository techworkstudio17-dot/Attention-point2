// ============================================
// SLICE & CODE - REACT CONTEXTS
// js/contexts.js
// Simulates src/context/ folder
// ============================================

const { useState, useEffect, useContext, createContext, useMemo } = React;

// ==========================================
// AUTH CONTEXT (src/context/AuthContext.jsx)
// ==========================================
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Load user on mount
    useEffect(() => {
        const savedUser = UserModel.get();
        if (savedUser) {
            setUser(savedUser);
        }
        setLoading(false);
    }, []);
    
    // Login function
    const login = async (userData) => {
        const newUser = { ...UserModel.getDefault(), ...userData };
        UserModel.save(newUser);
        setUser(newUser);
        return newUser;
    };
    
    // Update user function
    const updateUser = (updates) => {
        const updated = UserModel.update(updates);
        setUser(updated);
        return updated;
    };
    
    // Logout function
    const logout = () => {
        UserModel.logout();
        setUser(null);
    };
    
    return (
        <AuthContext.Provider value={{ user, loading, login, updateUser, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for auth
const useAuth = () => useContext(AuthContext);

// ==========================================
// CART CONTEXT (src/context/CartContext.jsx)
// ==========================================
const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    
    // Load cart on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.CART);
        if (saved) {
            setItems(JSON.parse(saved));
        }
    }, []);
    
    // Save cart on change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
    }, [items]);
    
    // Add item to cart
    const addItem = (pizza) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === pizza.id);
            if (existing) {
                return prev.map(i => i.id === pizza.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...pizza, qty: 1 }];
        });
        showToast('Added to cart!', 'success');
    };
    
    // Remove item from cart
    const removeItem = (id) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };
    
    // Update item quantity
    const updateQty = (id, delta) => {
        setItems(prev => {
            return prev.map(item => {
                if (item.id === id) {
                    const newQty = item.qty + delta;
                    return newQty > 0 ? { ...item, qty: newQty } : null;
                }
                return item;
            }).filter(Boolean);
        });
    };
    
    // Clear cart
    const clearCart = () => {
        setItems([]);
    };
    
    // Calculate total
    const total = useMemo(() => {
        return items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }, [items]);
    
    // Calculate count
    const count = useMemo(() => {
        return items.reduce((sum, item) => sum + item.qty, 0);
    }, [items]);
    
    return (
        <CartContext.Provider value={{ 
            items, addItem, removeItem, updateQty, clearCart, 
            total, count, isOpen, setIsOpen 
        }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook for cart
const useCart = () => useContext(CartContext);

// ==========================================
// ROUTER CONTEXT (Simulates React Router)
// ==========================================
const RouterContext = createContext();

const RouterProvider = ({ children }) => {
    const [currentRoute, setCurrentRoute] = useState(ROUTES.HOME);
    const [routeParams, setRouteParams] = useState({});
    const [loading, setLoading] = useState(false);
    
    // Navigate function
    const navigate = async (route, params = {}) => {
        setLoading(true);
        await Utils.delay(200); // Simulate route loading
        setCurrentRoute(route);
        setRouteParams(params);
        setLoading(false);
        window.scrollTo(0, 0);
    };
    
    return (
        <RouterContext.Provider value={{ currentRoute, routeParams, navigate, loading }}>
            {children}
        </RouterContext.Provider>
    );
};

// Custom hook for router
const useRouter = () => useContext(RouterContext);

console.log('✅ Contexts loaded');
