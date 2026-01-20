// ============================================
// SLICE & CODE - CONFIGURATION
// jsx/config.jsx
// ============================================

// App Configuration
const CONFIG = {
    APP_NAME: 'Slice & Code',
    CURRENCY: 'USD',
    ADMIN_PASSWORD: 'admin123',
    COUPON_CODES: {
        'PRO20': 0.20,
        'SAVE20': 0.20,
        'FIRST10': 0.10
    }
};

// Route Constants
const ROUTES = {
    HOME: 'home',
    PROFILE: 'profile',
    CART: 'cart',
    CHECKOUT: 'checkout',
    TRACK: 'track',
    CONTACT: 'contact',
    ADMIN: 'admin'
};

// Order Status Constants
const ORDER_STATUS = {
    PENDING: 'Pending',
    PREPARING: 'Preparing',
    OUT_FOR_DELIVERY: 'Out for Delivery',
    COMPLETED: 'Completed'
};

// Local Storage Keys
const STORAGE_KEYS = {
    USER: 'sc_user',
    CART: 'sc_cart',
    ORDERS: 'sc_orders',
    WISHLIST: 'sc_wishlist'
};

// Pizza Categories
const CATEGORIES = {
    ALL: 'All',
    VEGETARIAN: 'Vegetarian',
    MEAT: 'Meat',
    GOURMET: 'Gourmet',
    CHICKEN: 'Chicken'
};

console.log('✅ Config loaded');
