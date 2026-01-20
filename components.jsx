// ============================================
// SLICE & CODE - REACT COMPONENTS
// jsx/components.jsx
// ============================================

const { useState, useEffect, useMemo } = React;

// ==========================================
// LOADER COMPONENT
// ==========================================
const Loader = ({ size = 'default', color = 'blue', text = '' }) => (
    <div className="flex flex-col items-center justify-center gap-3">
        <div className={`loader ${size === 'small' ? 'loader-small' : ''} ${color === 'blue' ? 'loader-blue' : ''}`} />
        {text && <p className="text-gray-500 text-sm">{text}</p>}
    </div>
);

// Page Loader
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <Loader text="Loading..." />
    </div>
);

// ==========================================
// STAR RATING COMPONENT
// ==========================================
const StarRating = ({ rating, reviews, showReviews = true }) => (
    <div className="flex items-center gap-1">
        <div className="flex items-center bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-bold">
            <span>{rating}</span>
            <i className="fas fa-star text-[8px] ml-0.5" />
        </div>
        {showReviews && reviews && (
            <span className="text-gray-500 text-xs">({reviews})</span>
        )}
    </div>
);

// ==========================================
// BADGE COMPONENT
// ==========================================
const Badge = ({ status, size = 'default' }) => {
    const styles = {
        'Pending': 'badge-pending',
        'Preparing': 'badge-preparing',
        'Out for Delivery': 'badge-delivery',
        'Completed': 'badge-completed'
    };
    
    return (
        <span className={`badge ${styles[status] || 'badge-pending'} ${size === 'small' ? 'text-xs' : ''}`}>
            <span className="badge-dot" />
            {status}
        </span>
    );
};

// ==========================================
// EMPTY STATE COMPONENT
// ==========================================
const EmptyState = ({ 
    icon, 
    title, 
    text, 
    action, 
    actionText, 
    bgColor = 'bg-gray-100', 
    iconColor = 'text-gray-300' 
}) => (
    <div className="empty-state">
        <div className={`empty-state-icon ${bgColor}`}>
            <i className={`fas ${icon} ${iconColor}`} />
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
const BackToHomeButton = ({ className = '' }) => {
    const { goHome } = useRouter();
    
    return (
        <button 
            onClick={goHome}
            className={`flex items-center text-gray-500 hover:text-orange-600 mb-4 transition-colors animate-fade-in group ${className}`}
        >
            <i className="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
        </button>
    );
};

// ==========================================
// PIZZA CARD COMPONENT
// ==========================================
const PizzaCard = ({ pizza, index = 0 }) => {
    const { addItem } = useCart();
    const [isWishlisted, setIsWishlisted] = useState(WishlistModel.includes(pizza.id));
    const [isAdding, setIsAdding] = useState(false);
    const [showQuickView, setShowQuickView] = useState(false);
    
    const toggleWishlist = (e) => {
        e.stopPropagation();
        WishlistModel.toggle(pizza.id);
        setIsWishlisted(!isWishlisted);
        showToast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    };
    
    const handleAddToCart = async () => {
        if (pizza.isAvailable && !isAdding) {
            setIsAdding(true);
            await new Promise(resolve => setTimeout(resolve, 300));
            addItem(pizza);
            setIsAdding(false);
        }
    };
    
    const handleQuickView = async () => {
        await Swal.fire({
            title: '',
            html: `
                <div class="text-left">
                    <img src="${pizza.image}" class="w-full h-48 object-cover rounded-xl mb-4" alt="${pizza.name}">
                    <div class="flex items-start justify-between mb-3">
                        <div>
                            <h3 class="text-xl font-bold text-gray-900">${pizza.name}</h3>
                            <span class="text-sm text-gray-500 uppercase">${pizza.category}</span>
                        </div>
                        <div class="flex items-center bg-green-600 text-white px-2 py-1 rounded text-sm font-bold">
                            <span>${pizza.rating}</span>
                            <i class="fas fa-star text-xs ml-1"></i>
                        </div>
                    </div>
                    <p class="text-gray-600 mb-4">${pizza.description}</p>
                    <div class="flex items-center justify-between">
                        <span class="text-2xl font-bold text-orange-600">${Utils.formatCurrency(pizza.price)}</span>
                        <span class="text-sm text-gray-500">${pizza.reviews || 100}+ reviews</span>
                    </div>
                    ${!pizza.isAvailable ? '<p class="mt-3 text-red-600 font-medium"><i class="fas fa-times-circle mr-2"></i>Currently unavailable</p>' : ''}
                </div>
            `,
            showConfirmButton: pizza.isAvailable,
            confirmButtonText: '<i class="fas fa-cart-plus mr-2"></i> Add to Cart',
            confirmButtonColor: '#ff6b35',
            showCancelButton: true,
            cancelButtonText: 'Close',
            showClass: { popup: 'animate-zoom-in' },
            customClass: { popup: 'rounded-2xl' }
        }).then((result) => {
            if (result.isConfirmed) {
                addItem(pizza);
            }
        });
    };
    
    return (
        <div 
            className={`pizza-card hover-lift animate-fade-in ${!pizza.isAvailable ? 'pizza-card-sold-out' : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="pizza-card-image group cursor-pointer" onClick={handleQuickView}>
                <img 
                    src={pizza.image} 
                    alt={pizza.name} 
                    loading="lazy"
                    className="transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-800 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <i className="fas fa-eye mr-2" />Quick View
                    </span>
                </div>
                
                {/* Rating Badge */}
                <div className="pizza-card-badge animate-slide-in-down">
                    <i className="fas fa-star text-yellow-500" />
                    <span>{pizza.rating}</span>
                </div>
                
                {/* Wishlist Button */}
                <button 
                    onClick={toggleWishlist}
                    className={`pizza-card-wishlist wishlist-heart ${isWishlisted ? 'active animate-heartbeat' : ''}`}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <i className={`${isWishlisted ? 'fas' : 'far'} fa-heart ${isWishlisted ? '' : 'text-gray-400'}`} />
                </button>
                
                {/* Sold Out Overlay */}
                {!pizza.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                        <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold uppercase animate-pulse-slow">
                            <i className="fas fa-ban mr-2" />Sold Out
                        </span>
                    </div>
                )}
                
                {/* Popular Badge */}
                {pizza.isPopular && pizza.isAvailable && (
                    <div className="absolute top-12 left-3 animate-slide-in-left">
                        <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            🔥 Popular
                        </span>
                    </div>
                )}
                
                {/* Discount Badge (if applicable) */}
                {pizza.originalPrice && pizza.isAvailable && (
                    <div className="absolute bottom-3 left-3 animate-bounce">
                        <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                            {Math.round((1 - pizza.price / pizza.originalPrice) * 100)}% OFF
                        </span>
                    </div>
                )}
            </div>
            
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold text-gray-900 hover:text-orange-600 transition-colors cursor-pointer" onClick={handleQuickView}>
                            {pizza.name}
                        </h3>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">{pizza.category}</span>
                    </div>
                    <div className="text-right">
                        <span className="text-lg font-bold text-orange-600">
                            {Utils.formatCurrency(pizza.price)}
                        </span>
                        {pizza.originalPrice && (
                            <span className="text-sm text-gray-400 line-through block">
                                {Utils.formatCurrency(pizza.originalPrice)}
                            </span>
                        )}
                    </div>
                </div>
                
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{pizza.description}</p>
                
                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <i 
                            key={star}
                            className={`fas fa-star text-sm ${star <= Math.floor(pizza.rating) ? 'text-yellow-400' : 'text-gray-200'}`}
                        />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">({pizza.reviews || 100}+)</span>
                </div>
                
                <button 
                    onClick={handleAddToCart}
                    disabled={!pizza.isAvailable || isAdding}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all btn-ripple ${
                        pizza.isAvailable 
                            ? 'btn-primary hover-glow' 
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {isAdding ? (
                        <span className="flex items-center justify-center">
                            <i className="fas fa-spinner animate-rotate mr-2" />
                            Adding...
                        </span>
                    ) : pizza.isAvailable ? (
                        <>
                            <i className="fas fa-cart-plus mr-2" />
                            Add to Cart
                        </>
                    ) : (
                        <>
                            <i className="fas fa-ban mr-2" />
                            Unavailable
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

// ==========================================
// WISHLIST CARD COMPONENT
// ==========================================
const WishlistCard = ({ pizza, onRemove }) => {
    const { addItem } = useCart();
    
    const handleAddToCart = () => {
        addItem(pizza);
    };
    
    const handleRemove = () => {
        WishlistModel.toggle(pizza.id);
        showToast('Removed from wishlist');
        if (onRemove) onRemove();
    };
    
    return (
        <div className="flex items-center bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors">
            <img 
                src={pizza.image} 
                alt={pizza.name} 
                className="h-20 w-20 rounded-lg object-cover flex-shrink-0" 
            />
            <div className="ml-4 flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 truncate">{pizza.name}</h4>
                <p className="text-orange-600 font-bold">{Utils.formatCurrency(pizza.price)}</p>
                <div className="flex space-x-2 mt-2">
                    <button 
                        onClick={handleAddToCart}
                        disabled={!pizza.isAvailable}
                        className="px-3 py-1 bg-orange-500 text-white text-xs rounded-lg font-medium hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
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

// ==========================================
// NAVBAR COMPONENT
// ==========================================
const Navbar = () => {
    const { navigate, currentRoute, goHome } = useRouter();
    const { count, openCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const handleAdminLogin = () => {
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
            if (res.isConfirmed) {
                navigate(ROUTES.ADMIN);
                setMobileMenuOpen(false);
            }
        });
    };
    
    const navLinks = [
        { route: ROUTES.HOME, label: 'Home', icon: 'fa-home' },
        { route: ROUTES.CONTACT, label: 'Contact', icon: 'fa-phone' },
        { route: ROUTES.TRACK, label: 'Track Order', icon: 'fa-truck' }
    ];
    
    return (
        <nav className="navbar">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div 
                        className="flex items-center cursor-pointer group"
                        onClick={goHome}
                    >
                        <div className="gradient-orange text-white p-2 rounded-xl mr-2 shadow-lg group-hover:scale-105 transition-transform">
                            <i className="fas fa-pizza-slice text-lg" />
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
                        {navLinks.map(link => (
                            <button 
                                key={link.route}
                                onClick={() => navigate(link.route)}
                                className={`nav-link ${currentRoute === link.route ? 'active' : ''}`}
                            >
                                <i className={`fas ${link.icon} mr-1`} />
                                {link.label}
                            </button>
                        ))}
                    </div>
                    
                    {/* Action Icons */}
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            aria-label="Toggle menu"
                        >
                            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`} />
                        </button>
                        
                        {/* Cart */}
                        <button 
                            onClick={openCart}
                            className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors"
                            aria-label="Open cart"
                        >
                            {count > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow animate-scale-in">
                                    {count > 9 ? '9+' : count}
                                </span>
                            )}
                            <i className="fas fa-shopping-cart text-lg" />
                        </button>
                        
                        {/* Profile */}
                        <button 
                            onClick={() => navigate(ROUTES.PROFILE)}
                            className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
                            aria-label="Profile"
                        >
                            <i className="fas fa-user text-lg" />
                            {isAuthenticated && (
                                <span className="absolute bottom-1 right-1 h-2.5 w-2.5 bg-green-500 border-2 border-white rounded-full" />
                            )}
                        </button>
                        
                        {/* Admin */}
                        <button 
                            onClick={handleAdminLogin}
                            className="p-2 text-gray-400 hover:text-gray-700 transition-colors"
                            title="Admin"
                            aria-label="Admin login"
                        >
                            <i className="fas fa-shield-alt text-sm" />
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-fade-in">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map(link => (
                            <button 
                                key={link.route}
                                onClick={() => { 
                                    navigate(link.route); 
                                    setMobileMenuOpen(false); 
                                }}
                                className="w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-medium flex items-center"
                            >
                                <i className={`fas ${link.icon} w-6`} /> 
                                {link.label}
                            </button>
                        ))}
                        <div className="border-t border-gray-100 pt-2 mt-2">
                            <button 
                                onClick={() => { 
                                    navigate(ROUTES.PROFILE); 
                                    setMobileMenuOpen(false); 
                                }}
                                className="w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium flex items-center"
                            >
                                <i className="fas fa-user w-6" /> 
                                My Account
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
    const { items, removeItem, updateQty, total, isOpen, closeCart, clearCart } = useCart();
    const { navigate } = useRouter();
    const { isAuthenticated } = useAuth();
    
    if (!isOpen) return null;
    
    const handleCheckout = () => {
        closeCart();
        navigate(ROUTES.CHECKOUT);
    };
    
    return (
        <div className="cart-sidebar">
            <div className="cart-overlay" onClick={closeCart} />
            <div className="cart-panel animate-slide-in-right">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">
                        Shopping Cart
                        {items.length > 0 && (
                            <span className="text-gray-400 font-normal ml-2">({items.length})</span>
                        )}
                    </h2>
                    <button 
                        onClick={closeCart}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close cart"
                    >
                        <i className="fas fa-times text-gray-500" />
                    </button>
                </div>
                
                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
                    {items.length === 0 ? (
                        <EmptyState 
                            icon="fa-shopping-cart"
                            title="Your cart is empty"
                            text="Add some delicious pizzas!"
                            action={() => { closeCart(); navigate(ROUTES.HOME); }}
                            actionText="Browse Menu"
                        />
                    ) : (
                        <div className="space-y-3">
                            {items.map((item, idx) => (
                                <div 
                                    key={item.id} 
                                    className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-all animate-slide-in-right hover-lift"
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    <div className="relative">
                                        <img 
                                            src={item.image} 
                                            alt={item.name}
                                            className="h-16 w-16 rounded-lg object-cover flex-shrink-0 shadow-md"
                                        />
                                        <span className="absolute -top-2 -right-2 h-5 w-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
                                            {item.qty}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-800 text-sm truncate">{item.name}</h4>
                                        <p className="text-orange-600 font-bold text-sm">
                                            {Utils.formatCurrency(item.price)}
                                        </p>
                                        <div className="flex items-center space-x-1 mt-2">
                                            <button 
                                                onClick={() => updateQty(item.id, -1)}
                                                className="h-7 w-7 rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-sm font-bold transition-all active:scale-90"
                                                aria-label="Decrease quantity"
                                            >
                                                <i className="fas fa-minus text-xs" />
                                            </button>
                                            <span className="text-sm font-bold w-8 text-center">{item.qty}</span>
                                            <button 
                                                onClick={() => updateQty(item.id, 1)}
                                                className="h-7 w-7 rounded-full bg-gray-200 hover:bg-green-100 hover:text-green-600 flex items-center justify-center text-sm font-bold transition-all active:scale-90"
                                                aria-label="Increase quantity"
                                            >
                                                <i className="fas fa-plus text-xs" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900 text-lg">
                                            {Utils.formatCurrency(item.price * item.qty)}
                                        </p>
                                        <button 
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-500 text-xs hover:text-red-700 mt-1 flex items-center gap-1 transition-colors"
                                        >
                                            <i className="fas fa-trash-alt" />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Clear Cart Button */}
                            {items.length > 1 && (
                                <button 
                                    onClick={async () => {
                                        const confirmed = await showConfirm('Clear Cart?', 'Remove all items from your cart?');
                                        if (confirmed) {
                                            clearCart();
                                            showToast('Cart cleared');
                                        }
                                    }}
                                    className="w-full py-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <i className="fas fa-trash mr-2" />Clear All Items
                                </button>
                            )}
                        </div>
                    )}
                </div>
                
                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-gray-100 p-4 bg-gray-50">
                        <div className="flex justify-between text-lg font-bold text-gray-900 mb-2">
                            <span>Total</span>
                            <span className="text-orange-600">{Utils.formatCurrency(total)}</span>
                        </div>
                        
                        {!isAuthenticated && (
                            <p className="text-xs text-yellow-600 mb-3 bg-yellow-50 p-2 rounded-lg">
                                <i className="fas fa-info-circle mr-1" />
                                Login required to place order
                            </p>
                        )}
                        
                        <button 
                            onClick={handleCheckout}
                            className="btn btn-primary w-full py-3"
                        >
                            {isAuthenticated ? (
                                <>
                                    <i className="fas fa-lock mr-2" />
                                    Proceed to Checkout
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-sign-in-alt mr-2" />
                                    Login & Checkout
                                </>
                            )}
                        </button>
                        
                        <p className="text-xs text-center text-gray-400 mt-2">
                            <i className="fas fa-shield-alt mr-1" />
                            Secure payment
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// ==========================================
// FOOTER COMPONENT
// ==========================================
const Footer = () => {
    const { navigate } = useRouter();
    
    const showTechStack = () => {
        Swal.fire({
            title: 'Tech Stack',
            html: `
                <div class="text-left text-sm space-y-2">
                    <p><strong>Frontend:</strong> React 18 + JSX</p>
                    <p><strong>Styling:</strong> Tailwind CSS + Custom CSS</p>
                    <p><strong>State:</strong> Context API (Auth, Cart, Router)</p>
                    <p><strong>Storage:</strong> LocalStorage (simulated backend)</p>
                    <hr class="my-3">
                    <p class="text-gray-500">Production: React/Vite + Node.js/Express + MongoDB</p>
                </div>
            `,
            confirmButtonColor: '#2874f0'
        });
    };
    
    return (
        <footer className="footer">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center mb-4">
                            <div className="bg-orange-500 text-white p-2 rounded-lg mr-2">
                                <i className="fas fa-pizza-slice" />
                            </div>
                            <span className="text-xl font-bold">Slice & Code</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Premium pizza delivery. Fresh ingredients, fast service, unforgettable taste.
                        </p>
                    </div>
                    
                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-300">
                            Quick Links
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <button onClick={() => navigate(ROUTES.HOME)} className="footer-link">
                                    Menu
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate(ROUTES.PROFILE)} className="footer-link">
                                    My Account
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate(ROUTES.TRACK)} className="footer-link">
                                    Track Order
                                </button>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Support */}
                    <div>
                        <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-300">
                            Support
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <button onClick={() => navigate(ROUTES.CONTACT)} className="footer-link">
                                    Contact Us
                                </button>
                            </li>
                            <li><a href="#" className="footer-link">FAQ</a></li>
                            <li><a href="#" className="footer-link">Privacy Policy</a></li>
                        </ul>
                    </div>
                    
                    {/* Connect */}
                    <div>
                        <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-300">
                            Connect
                        </h4>
                        <div className="flex space-x-3">
                            <a href="#" className="footer-social hover:bg-blue-600" aria-label="Facebook">
                                <i className="fab fa-facebook-f" />
                            </a>
                            <a href="#" className="footer-social hover:bg-pink-600" aria-label="Instagram">
                                <i className="fab fa-instagram" />
                            </a>
                            <a href="#" className="footer-social hover:bg-blue-400" aria-label="Twitter">
                                <i className="fab fa-twitter" />
                            </a>
                        </div>
                    </div>
                </div>
                
                {/* Bottom */}
                <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
                    © 2024 Slice & Code Pizzeria. All rights reserved. | 
                    <button 
                        onClick={showTechStack}
                        className="text-orange-400 hover:underline ml-1"
                    >
                        View Tech Stack
                    </button>
                </div>
            </div>
        </footer>
    );
};

console.log('✅ Components loaded');
