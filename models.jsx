// ============================================
// SLICE & CODE - DATA MODELS
// jsx/models.jsx
// Simulates MongoDB/Mongoose Models
// ============================================

// ==========================================
// PIZZA MODEL
// ==========================================
const PizzaModel = {
    // Pizza Data (simulates MongoDB collection)
    data: [
        {
            id: 1,
            name: 'Margherita Classic',
            description: 'Fresh tomatoes, mozzarella, basil, extra virgin olive oil',
            price: 14.00,
            category: 'Vegetarian',
            rating: 4.8,
            reviews: 234,
            image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
            isAvailable: true,
            isPopular: true
        },
        {
            id: 2,
            name: 'Pepperoni Feast',
            description: 'Double pepperoni, mozzarella, signature tomato sauce',
            price: 16.50,
            category: 'Meat',
            rating: 4.9,
            reviews: 456,
            image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
            isAvailable: true,
            isPopular: true
        },
        {
            id: 3,
            name: 'Truffle Mushroom',
            description: 'Wild mushrooms, truffle oil, parmesan, cream sauce',
            price: 18.00,
            category: 'Gourmet',
            rating: 4.7,
            reviews: 189,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
            isAvailable: true,
            isPopular: false
        },
        {
            id: 4,
            name: 'BBQ Chicken',
            description: 'Grilled chicken, BBQ sauce, red onions, fresh cilantro',
            price: 17.00,
            category: 'Chicken',
            rating: 4.5,
            reviews: 312,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
            isAvailable: false,
            isPopular: true
        },
        {
            id: 5,
            name: 'Hawaiian Paradise',
            description: 'Premium ham, fresh pineapple, mozzarella blend',
            price: 16.00,
            category: 'Meat',
            rating: 4.2,
            reviews: 156,
            image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=800&q=80',
            isAvailable: true,
            isPopular: false
        },
        {
            id: 6,
            name: 'Veggie Supreme',
            description: 'Bell peppers, onions, olives, tomatoes, mushrooms',
            price: 15.50,
            category: 'Vegetarian',
            rating: 4.6,
            reviews: 203,
            image: 'https://images.unsplash.com/photo-1571407970349-bc16f6343378?auto=format&fit=crop&w=800&q=80',
            isAvailable: true,
            isPopular: false
        },
        {
            id: 7,
            name: 'Meat Lovers',
            description: 'Pepperoni, sausage, bacon, ham, ground beef',
            price: 19.00,
            category: 'Meat',
            rating: 4.8,
            reviews: 387,
            image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=800&q=80',
            isAvailable: true,
            isPopular: true
        },
        {
            id: 8,
            name: 'Quattro Formaggi',
            description: 'Mozzarella, gorgonzola, parmesan, ricotta',
            price: 17.50,
            category: 'Gourmet',
            rating: 4.7,
            reviews: 145,
            image: 'https://images.unsplash.com/photo-1548369937-47519962c11a?auto=format&fit=crop&w=800&q=80',
            isAvailable: true,
            isPopular: false
        }
    ],
    
    // Get all pizzas
    getAll() {
        return this.data;
    },
    
    // Get pizza by ID
    getById(id) {
        return this.data.find(p => p.id === id);
    },
    
    // Get available pizzas
    getAvailable() {
        return this.data.filter(p => p.isAvailable);
    },
    
    // Get popular pizzas
    getPopular() {
        return this.data.filter(p => p.isPopular);
    },
    
    // Get pizzas by category
    getByCategory(category) {
        if (category === CATEGORIES.ALL) return this.data;
        return this.data.filter(p => p.category === category);
    }
};

// ==========================================
// USER MODEL
// ==========================================
const UserModel = {
    // Get default user structure
    getDefault: () => ({
        id: Utils.generateId('USR'),
        name: '',
        email: '',
        phone: '',
        gender: '',
        dob: '',
        avatar: '',
        addresses: [],
        createdAt: new Date().toISOString()
    }),
    
    // Get user from localStorage
    get() {
        const data = localStorage.getItem(STORAGE_KEYS.USER);
        return data ? JSON.parse(data) : null;
    },
    
    // Save user to localStorage
    save(user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    },
    
    // Update user
    update(updates) {
        const user = this.get();
        if (user) {
            Object.assign(user, updates);
            this.save(user);
            return user;
        }
        return null;
    },
    
    // Add address
    addAddress(address) {
        const user = this.get();
        if (user) {
            address.id = Utils.generateId('ADDR');
            user.addresses = user.addresses || [];
            user.addresses.push(address);
            this.save(user);
            return user;
        }
        return null;
    },
    
    // Update address
    updateAddress(id, updates) {
        const user = this.get();
        if (user) {
            const idx = user.addresses.findIndex(a => a.id === id);
            if (idx !== -1) {
                Object.assign(user.addresses[idx], updates);
                this.save(user);
            }
            return user;
        }
        return null;
    },
    
    // Delete address
    deleteAddress(id) {
        const user = this.get();
        if (user) {
            user.addresses = user.addresses.filter(a => a.id !== id);
            this.save(user);
            return user;
        }
        return null;
    },
    
    // Logout
    logout() {
        localStorage.removeItem(STORAGE_KEYS.USER);
    }
};

// ==========================================
// ORDER MODEL
// ==========================================
const OrderModel = {
    // Get all orders
    getAll() {
        const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
        return data ? JSON.parse(data) : [];
    },
    
    // Create new order
    create(order) {
        const orders = this.getAll();
        orders.unshift(order);
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        return order;
    },
    
    // Get order by ID
    getById(id) {
        return this.getAll().find(o => o.id === id);
    },
    
    // Get orders by user email
    getByUser(email) {
        return this.getAll().filter(o => o.userEmail === email);
    },
    
    // Update order status
    updateStatus(id, status) {
        const orders = this.getAll();
        const idx = orders.findIndex(o => o.id === id);
        if (idx !== -1) {
            orders[idx].status = status;
            orders[idx].updatedAt = new Date().toISOString();
            localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
            return true;
        }
        return false;
    },
    
    // Delete order
    delete(id) {
        const orders = this.getAll().filter(o => o.id !== id);
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    }
};

// ==========================================
// WISHLIST MODEL
// ==========================================
const WishlistModel = {
    // Get wishlist
    get() {
        const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
        return data ? JSON.parse(data) : [];
    },
    
    // Toggle item in wishlist
    toggle(pizzaId) {
        let list = this.get();
        if (list.includes(pizzaId)) {
            list = list.filter(id => id !== pizzaId);
        } else {
            list.push(pizzaId);
        }
        localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
        return list;
    },
    
    // Check if item is in wishlist
    includes(pizzaId) {
        return this.get().includes(pizzaId);
    },
    
    // Clear wishlist
    clear() {
        localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify([]));
    }
};

console.log('✅ Models loaded');
