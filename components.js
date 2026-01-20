// ============================================
// SLICE & CODE - REACT COMPONENTS
// js/components.js
// Simulates src/components/ folder
// ============================================

// ==========================================
// LOADER COMPONENT (src/components/Loader.jsx)
// ==========================================
const Loader = ({ size = 'default', color = 'blue' }) => (
    <div className={`loader ${size === 'small' ? 'loader-small' : ''} ${color === 'blue' ? 'loader-blue' : ''}`}></div>
);

// Page Loader
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
    </div>
);

// ==========================================
// STAR RATING COMPONENT
// ==========================================
const StarRating = ({ rating, reviews }) => (
    <div className="flex items-center gap-1">
        <div className="flex items-center bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-bold">
            <span>{rating}</span>
            <i className="fas fa-star text-[8px] ml-0.5"></i>
        </div>
        {reviews && <span className="text-gray-500 text-xs">({reviews})</span>}
    </div>
);

// ==========================================
// BADGE COMPONENT
// ==========================================
const Badge = ({ status }) => {
    const styles = {
        'Pending': 'badge-pending',
        'Preparing': 'badge-preparing',
        'Out for Delivery': 'badge-delivery',
        'Completed': 'badge-completed'
    };
    
    return (
        <span className={`badge ${styles[status] || 'badge-pending'}`}>
            <span className="badge-dot"></span>
            {status}
        </span>
    );
};

// ==========================================
// EMPTY STATE COMPONENT
// ==========================================
const EmptyState = ({ icon, title, text, action, actionText, bgColor = 'bg-gray-100', iconColor = 'text-gray-300' }) => (
    <div className="empty-state">
        <div className={`empty-state-icon ${bgColor}`}>
            <i className={`fas ${icon} ${iconColor}`}></i>
        </div>
        <h3 className="empty-state-title">{title}</h3>
        <p className="empty-state-text">{text}</p>
        {action && (
            <button onClick={action} className="btn btn-primary">
                {actionText}
            </button>
        )}
    </div>
);

// ==========================================
// BACK TO HOME BUTTON COMPONENT
// ==========================================
const BackToHomeButton = () => {
    const { navigate } = useRouter();
    
    return (
        <button 
            onClick={() => navigate(ROUTES.HOME)}
            className="flex items-center text-gray-500 hover:text-orange-600 mb-4 transition-colors animate-fade-in group"
        >
            <i className="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
            <span>Back to Home</span>
        </button>
    );
};

// ==========================================
// PIZZA CARD COMPONENT (src/components/PizzaCard.jsx)
// ==========================================
const PizzaCard = ({ pizza }) => {
    const { addItem } = useCart();
    const [isWishlisted, setIsWishlisted] = useState(WishlistModel.includes(pizza.id));
    
    const toggleWishlist = () => {
        WishlistModel.toggle(pizza.id);
        setIsWishlisted(!isWishlisted);
        showToast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    };
    
    return (
        <div className={`pizza-card animate-fade-in ${!pizza.isAvailable ? 'pizza-card-sold-out' : ''}`}>
            <div className="pizza-card-image">
                <img src={pizza.image} alt={pizza.name} loading="lazy" />
                
                {/* Rating Badge */}
                <div className="pizza-card-badge">
                    <i className="fas fa-star text-yellow-500"></i>
                    <span>{pizza.rating}</span>
                </div>
                
                {/* Wishlist Button */}
                <button 
                    onClick={toggleWishlist}
                    className={`pizza-card-wishlist ${isWishlisted ? 'active' : ''}`}
                >
                    <i className={`${isWishlisted ? 'fas' : 'far'} fa-heart ${isWishlisted ? '' : 'text-gray-400'}`}></i>
                </button>
                
                {/* Sold Out Overlay */}
                {!pizza.isAvailable && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase">
                            Sold Out
                        </span>
                    </div>
                )}
            </div>
            
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold text-gray-900">{pizza.name}</h3>
                        <span className="text-xs text-gray-500 uppercase">{pizza.category}</span>
                    </div>
                    <span className="text-lg font-bold text-orange-600">
                        {Utils.formatCurrency(pizza.price)}
                    </span>
                </div>
                
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{pizza.description}</p>
                
                <button 
                    onClick={() => addItem(pizza)}
                    disabled={!pizza.isAvailable}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${
                        pizza.isAvailable 
                            ? 'btn-primary' 
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {pizza.isAvailable ? (
                        <>
                            <i className="fas fa-plus mr-2"></i>
                            Add to Cart
                        </>
                    ) : 'Unavailable'}
                </button>
            </div>
        </div>
    );
};

// ==========================================
// NAVBAR COMPONENT (src/components/Navbar.jsx)
// ==========================================
const Navbar = () => {
    const { navigate, currentRoute } = useRouter();
    const { count, setIsOpen } = useCart();
    const { user } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    return (
        <nav className="navbar">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div 
                        className="flex items-center cursor-pointer group"
                        onClick={() => navigate(ROUTES.HOME)}
                    >
                        <div className="gradient-orange text-white p-2 rounded-xl mr-2 shadow-lg group-hover:scale-105 transition-transform">
                            <i className="fas fa-pizza-slice text-lg"></i>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-extrabold text-gray-900 tracking-tight leading-none">
                                Slice<span className="text-orange-500">&</span>Code
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase hidden sm:block">
                                Premium Delivery
                            </span>
                        </div>
                    </div>
                    
                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button 
                            onClick={() => navigate(ROUTES.HOME)}
                            className={`nav-link ${currentRoute === ROUTES.HOME ? 'active' : ''}`}
                        >
                            <i className="fas fa-home mr-1"></i>
                            Home
                        </button>
                        <button 
                            onClick={() => navigate(ROUTES.CONTACT)}
                            className={`nav-link ${currentRoute === ROUTES.CONTACT ? 'active' : ''}`}
                        >
                            Contact
                        </button>
                        <button 
                            onClick={() => navigate(ROUTES.TRACK)}
                            className={`nav-link ${currentRoute === ROUTES.TRACK ? 'active' : ''}`}
                        >
                            Track Order
                        </button>
                    </div>
                    
                    {/* Action Icons */}
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
                        </button>
                        
                        {/* Cart */}
                        <button 
                            onClick={() => setIsOpen(true)}
                            className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors"
                        >
                            {count > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow">
                                    {count}
                                </span>
                            )}
                            <i className="fas fa-shopping-cart text-lg"></i>
                        </button>
                        
                        {/* Profile */}
                        <button 
                            onClick={() => navigate(ROUTES.PROFILE)}
                            className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            <i className="fas fa-user text-lg"></i>
                            {user && (
                                <span className="absolute bottom-1 right-1 h-2.5 w-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                            )}
                        </button>
                        
                        {/* Admin */}
                        <button 
                            onClick={() => {
                                Swal.fire({
                                    title: 'Admin Login',
                                    input: 'password',
                                    inputPlaceholder: 'Enter admin password',
                                    showCancelButton: true,
                                    confirmButtonColor: '#2874f0',
                                    preConfirm: (pass) => {
                                        if (pass !== CONFIG.ADMIN_PASSWORD) {
                                            Swal.showValidationMessage('Invalid password');
                                            return false;
                                        }
                                        return true;
                                    }
                                }).then((res) => {
                                    if (res.isConfirmed) navigate(ROUTES.ADMIN);
                                });
                            }}
                            className="p-2 text-gray-400 hover:text-gray-700 transition-colors"
                            title="Admin"
                        >
                            <i className="fas fa-shield-alt text-sm"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-fade-in">
                    <div className="px-4 py-3 space-y-1">
                        <button 
                            onClick={() => { navigate(ROUTES.HOME); setMobileMenuOpen(false); }}
                            className="w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-medium flex items-center"
                        >
                            <i className="fas fa-home w-6"></i> Home
                        </button>
                        <button 
                            onClick={() => { navigate(ROUTES.CONTACT); setMobileMenuOpen(false); }}
                            className="w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-medium flex items-center"
                        >
                            <i className="fas fa-phone w-6"></i> Contact
                        </button>
                        <button 
                            onClick={() => { navigate(ROUTES.TRACK); setMobileMenuOpen(false); }}
                            className="w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-medium flex items-center"
                        >
                            <i className="fas fa-truck w-6"></i> Track Order
                        </button>
                        <div className="border-t border-gray-100 pt-2 mt-2">
                            <button 
                                onClick={() => { navigate(ROUTES.PROFILE); setMobileMenuOpen(false); }}
                                className="w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium flex items-center"
                            >
                                <i className="fas fa-user w-6"></i> My Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

// ==========================================
// CART SIDEBAR COMPONENT
// ==========================================
const CartSidebar = () => {
    const { items, removeItem, updateQty, total, isOpen, setIsOpen } = useCart();
    const { navigate } = useRouter();
    
    if (!isOpen) return null;
    
    return (
        <div className="cart-sidebar">
            <div className="cart-overlay" onClick={() => setIsOpen(false)}></div>
            <div className="cart-panel animate-slide-in-right">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">
                        Shopping Cart
                        {items.length > 0 && <span className="text-gray-400 font-normal ml-2">({items.length})</span>}
                    </h2>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <i className="fas fa-times text-gray-500"></i>
                    </button>
                </div>
                
                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
                    {items.length === 0 ? (
                        <EmptyState 
                            icon="fa-shopping-cart"
                            title="Your cart is empty"
                            text="Add some delicious pizzas!"
                            action={() => { setIsOpen(false); navigate(ROUTES.HOME); }}
                            actionText="Browse Menu"
                        />
                    ) : (
                        <div className="space-y-3">
                            {items.map(item => (
                                <div key={item.id} className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3">
                                    <img 
                                        src={item.image} 
                                        alt={item.name}
                                        className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-800 text-sm truncate">{item.name}</h4>
                                        <p className="text-orange-600 font-bold text-sm">{Utils.formatCurrency(item.price)}</p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <button 
                                                onClick={() => updateQty(item.id, -1)}
                                                className="h-6 w-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs font-bold"
                                            >-</button>
                                            <span className="text-sm font-bold w-6 text-center">{item.qty}</span>
                                            <button 
                                                onClick={() => updateQty(item.id, 1)}
                                                className="h-6 w-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs font-bold"
                                            >+</button>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">{Utils.formatCurrency(item.price * item.qty)}</p>
                                        <button 
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-500 text-xs hover:underline mt-1"
                                        >Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-gray-100 p-4 bg-gray-50">
                        <div className="flex justify-between text-lg font-bold text-gray-900 mb-4">
                            <span>Total</span>
                            <span>{Utils.formatCurrency(total)}</span>
                        </div>
                        <button 
                            onClick={() => { setIsOpen(false); navigate(ROUTES.CHECKOUT); }}
                            className="btn btn-primary w-full"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ==========================================
// FOOTER COMPONENT (src/components/Footer.jsx)
// ==========================================
const Footer = () => {
    const { navigate } = useRouter();
    
    return (
        <footer className="footer">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center mb-4">
                            <div className="bg-orange-500 text-white p-2 rounded-lg mr-2">
                                <i className="fas fa-pizza-slice"></i>
                            </div>
                            <span className="text-xl font-bold">Slice & Code</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Premium pizza delivery. Fresh ingredients, fast service, unforgettable taste.
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-300">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><button onClick={() => navigate(ROUTES.HOME)} className="footer-link">Menu</button></li>
                            <li><button onClick={() => navigate(ROUTES.PROFILE)} className="footer-link">My Account</button></li>
                            <li><button onClick={() => navigate(ROUTES.TRACK)} className="footer-link">Track Order</button></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-300">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li><button onClick={() => navigate(ROUTES.CONTACT)} className="footer-link">Contact Us</button></li>
                            <li><a href="#" className="footer-link">FAQ</a></li>
                            <li><a href="#" className="footer-link">Privacy Policy</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-300">Connect</h4>
                        <div className="flex space-x-3">
                            <a href="#" className="footer-social hover:bg-blue-600"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="footer-social hover:bg-pink-600"><i className="fab fa-instagram"></i></a>
                            <a href="#" className="footer-social hover:bg-blue-400"><i className="fab fa-twitter"></i></a>
                        </div>
                    </div>
                </div>
                
                <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
                    © 2024 Slice & Code Pizzeria. All rights reserved. | 
                    <button 
                        onClick={() => {
                            Swal.fire({
                                title: 'Tech Stack',
                                html: `
                                    <div class="text-left text-sm space-y-2">
                                        <p><strong>Frontend:</strong> React 18 + JSX</p>
                                        <p><strong>Styling:</strong> Tailwind CSS + Custom CSS</p>
                                        <p><strong>State:</strong> Context API (Auth, Cart, Router)</p>
                                        <p><strong>Backend:</strong> Simulated with LocalStorage</p>
                                        <hr class="my-3">
                                        <p class="text-gray-500">Production: React/Vite + Node.js/Express + MongoDB</p>
                                    </div>
                                `,
                                confirmButtonColor: '#2874f0'
                            });
                        }}
                        className="text-orange-400 hover:underline ml-1"
                    >
                        View Tech Stack
                    </button>
                </div>
            </div>
        </footer>
    );
};

// ==========================================
// WISHLIST CARD COMPONENT
// ==========================================
const WishlistCard = ({ pizza }) => {
    const { addItem } = useCart();
    
    const handleRemove = () => {
        WishlistModel.toggle(pizza.id);
        showToast('Removed from wishlist');
        window.location.reload();
    };
    
    return (
        <div className="flex items-center bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors">
            <img src={pizza.image} alt={pizza.name} className="h-20 w-20 rounded-lg object-cover flex-shrink-0" />
            <div className="ml-4 flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 truncate">{pizza.name}</h4>
                <p className="text-orange-600 font-bold">{Utils.formatCurrency(pizza.price)}</p>
                <div className="flex space-x-2 mt-2">
                    <button 
                        onClick={() => addItem(pizza)}
                        className="px-3 py-1 bg-orange-500 text-white text-xs rounded-lg font-medium hover:bg-orange-600"
                    >
                        Add to Cart
                    </button>
                    <button 
                        onClick={handleRemove}
                        className="px-3 py-1 bg-white border border-gray-200 text-gray-600 text-xs rounded-lg font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
};

console.log('✅ Components loaded');
