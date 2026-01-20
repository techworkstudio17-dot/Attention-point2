// ============================================
// SLICE & CODE - REACT CONTEXTS
// jsx/contexts.jsx
// ============================================

const { useState, useEffect, useContext, createContext, useMemo, useCallback } = React;

// ==========================================
// AUTH CONTEXT
// ==========================================
const AuthContext = createContext(null);

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
    const login = useCallback(async (userData) => {
        const newUser = { ...UserModel.getDefault(), ...userData };
        UserModel.save(newUser);
        setUser(newUser);
        return newUser;
    }, []);
    
    // Update user function
    const updateUser = useCallback((updates) => {
        const updated = UserModel.update(updates);
        setUser(updated);
        return updated;
    }, []);
    
    // Logout function
    const logout = useCallback(() => {
        UserModel.logout();
        setUser(null);
    }, []);
    
    // Refresh user from storage
    const refreshUser = useCallback(() => {
        const savedUser = UserModel.get();
        setUser(savedUser);
        return savedUser;
    }, []);
    
    const value = useMemo(() => ({
        user,
        loading,
        login,
        updateUser,
        logout,
        setUser,
        refreshUser,
        isAuthenticated: !!user
    }), [user, loading, login, updateUser, logout, refreshUser]);
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for auth
const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// ==========================================
// CART CONTEXT
// ==========================================
const CartContext = createContext(null);

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
    const addItem = useCallback((pizza) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === pizza.id);
            if (existing) {
                return prev.map(i => 
                    i.id === pizza.id ? { ...i, qty: i.qty + 1 } : i
                );
            }
            return [...prev, { ...pizza, qty: 1 }];
        });
        showToast('Added to cart!', 'success');
    }, []);
    
    // Remove item from cart
    const removeItem = useCallback((id) => {
        setItems(prev => prev.filter(i => i.id !== id));
        showToast('Removed from cart', 'info');
    }, []);
    
    // Update item quantity
    const updateQty = useCallback((id, delta) => {
        setItems(prev => {
            return prev.map(item => {
                if (item.id === id) {
                    const newQty = item.qty + delta;
                    return newQty > 0 ? { ...item, qty: newQty } : null;
                }
                return item;
            }).filter(Boolean);
        });
    }, []);
    
    // Clear cart
    const clearCart = useCallback(() => {
        setItems([]);
    }, []);
    
    // Calculate total
    const total = useMemo(() => {
        return items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }, [items]);
    
    // Calculate count
    const count = useMemo(() => {
        return items.reduce((sum, item) => sum + item.qty, 0);
    }, [items]);
    
    // Open cart
    const openCart = useCallback(() => setIsOpen(true), []);
    
    // Close cart
    const closeCart = useCallback(() => setIsOpen(false), []);
    
    const value = useMemo(() => ({
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        total,
        count,
        isOpen,
        setIsOpen,
        openCart,
        closeCart
    }), [items, addItem, removeItem, updateQty, clearCart, total, count, isOpen, openCart, closeCart]);
    
    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook for cart
const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

// ==========================================
// ROUTER CONTEXT
// ==========================================
const RouterContext = createContext(null);

const RouterProvider = ({ children }) => {
    const [currentRoute, setCurrentRoute] = useState(ROUTES.HOME);
    const [routeParams, setRouteParams] = useState({});
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([ROUTES.HOME]);
    
    // Navigate function
    const navigate = useCallback(async (route, params = {}) => {
        setLoading(true);
        await Utils.delay(150); // Simulate route loading
        setCurrentRoute(route);
        setRouteParams(params);
        setHistory(prev => [...prev, route]);
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);
    
    // Go back function
    const goBack = useCallback(() => {
        if (history.length > 1) {
            const newHistory = [...history];
            newHistory.pop();
            const previousRoute = newHistory[newHistory.length - 1];
            setCurrentRoute(previousRoute);
            setHistory(newHistory);
        } else {
            navigate(ROUTES.HOME);
        }
    }, [history, navigate]);
    
    // Go home
    const goHome = useCallback(() => {
        navigate(ROUTES.HOME);
    }, [navigate]);
    
    const value = useMemo(() => ({
        currentRoute,
        routeParams,
        navigate,
        loading,
        goBack,
        goHome,
        isRoute: (route) => currentRoute === route
    }), [currentRoute, routeParams, navigate, loading, goBack, goHome]);
    
    return (
        <RouterContext.Provider value={value}>
            {children}
        </RouterContext.Provider>
    );
};

// Custom hook for router
const useRouter = () => {
    const context = useContext(RouterContext);
    if (!context) {
        throw new Error('useRouter must be used within a RouterProvider');
    }
    return context;
};

console.log('✅ Contexts loaded');
