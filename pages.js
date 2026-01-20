// ============================================
// SLICE & CODE - PAGE COMPONENTS
// js/pages.js
// Simulates src/pages/ folder
// ============================================

// ==========================================
// HOME PAGE (src/pages/Home.jsx)
// ==========================================
const HomePage = () => {
    const pizzas = PizzaModel.getAll();
    const [filter, setFilter] = useState('All');
    
    const categories = ['All', ...new Set(pizzas.map(p => p.category))];
    const filteredPizzas = filter === 'All' ? pizzas : pizzas.filter(p => p.category === filter);
    
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-10 animate-fade-in">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Our Menu</h1>
                <p className="text-gray-500 text-lg">Handcrafted pizzas baked to perfection</p>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center mb-8 animate-fade-in">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            filter === cat 
                                ? 'bg-orange-500 text-white shadow-lg' 
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            
            {/* Pizza Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPizzas.map((pizza, idx) => (
                    <div key={pizza.id} style={{ animationDelay: `${idx * 50}ms` }}>
                        <PizzaCard pizza={pizza} />
                    </div>
                ))}
            </div>
        </div>
    );
};

// ==========================================
// PROFILE PAGE (src/pages/Profile.jsx)
// Flipkart-Style Design
// ==========================================
const ProfilePage = () => {
    const { user, login, updateUser, logout, setUser } = useAuth();
    const { navigate } = useRouter();
    const [activeTab, setActiveTab] = useState('orders');
    
    // Login Modal
    const showLoginModal = async () => {
        const { value: formValues } = await Swal.fire({
            title: '<span class="text-gray-800">Welcome</span>',
            html: `
                <div class="space-y-4 text-left">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input id="swal-name" class="input" placeholder="John Doe">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input id="swal-email" type="email" class="input" placeholder="john@example.com">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input id="swal-phone" type="tel" class="input" placeholder="+1 234 567 8900">
                    </div>
                </div>
            `,
            confirmButtonText: 'Continue',
            confirmButtonColor: '#2874f0',
            showCancelButton: true,
            preConfirm: () => {
                const name = document.getElementById('swal-name').value;
                const email = document.getElementById('swal-email').value;
                const phone = document.getElementById('swal-phone').value;
                if (!name || !email) {
                    Swal.showValidationMessage('Please enter name and email');
                    return false;
                }
                return { name, email, phone };
            }
        });
        
        if (formValues) {
            await login(formValues);
            showToast('Welcome back!');
        }
    };
    
    // Edit Profile Modal
    const showEditProfileModal = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Edit Profile',
            html: `
                <div class="space-y-3 text-left">
                    <input id="edit-name" class="input" value="${user.name}" placeholder="Full Name">
                    <input id="edit-phone" class="input" value="${user.phone || ''}" placeholder="Phone">
                    <select id="edit-gender" class="input">
                        <option value="">Select Gender</option>
                        <option value="Male" ${user.gender === 'Male' ? 'selected' : ''}>Male</option>
                        <option value="Female" ${user.gender === 'Female' ? 'selected' : ''}>Female</option>
                        <option value="Other" ${user.gender === 'Other' ? 'selected' : ''}>Other</option>
                    </select>
                    <input id="edit-dob" type="date" class="input" value="${user.dob || ''}">
                </div>
            `,
            confirmButtonText: 'Save',
            confirmButtonColor: '#2874f0',
            showCancelButton: true,
            preConfirm: () => ({
                name: document.getElementById('edit-name').value,
                phone: document.getElementById('edit-phone').value,
                gender: document.getElementById('edit-gender').value,
                dob: document.getElementById('edit-dob').value
            })
        });
        
        if (formValues) {
            const updated = updateUser(formValues);
            setUser({ ...updated });
            showToast('Profile updated!');
        }
    };
    
    // Add Address Modal
    const showAddAddressModal = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Add New Address',
            html: `
                <div class="space-y-3 text-left">
                    <select id="addr-type" class="input">
                        <option value="home">Home</option>
                        <option value="work">Work</option>
                        <option value="other">Other</option>
                    </select>
                    <input id="addr-street" class="input" placeholder="Street Address">
                    <div class="grid grid-cols-2 gap-3">
                        <input id="addr-city" class="input" placeholder="City">
                        <input id="addr-state" class="input" placeholder="State">
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <input id="addr-zip" class="input" placeholder="ZIP Code">
                        <input id="addr-phone" class="input" placeholder="Phone">
                    </div>
                </div>
            `,
            confirmButtonText: 'Save Address',
            confirmButtonColor: '#2874f0',
            showCancelButton: true,
            preConfirm: () => {
                const street = document.getElementById('addr-street').value;
                if (!street) {
                    Swal.showValidationMessage('Please enter street address');
                    return false;
                }
                return {
                    type: document.getElementById('addr-type').value,
                    street,
                    city: document.getElementById('addr-city').value,
                    state: document.getElementById('addr-state').value,
                    zip: document.getElementById('addr-zip').value,
                    phone: document.getElementById('addr-phone').value
                };
            }
        });
        
        if (formValues) {
            UserModel.addAddress(formValues);
            setUser({ ...UserModel.get() });
            showToast('Address added!');
        }
    };
    
    // Delete Address
    const deleteAddress = async (id) => {
        const confirmed = await showConfirm('Delete Address?', 'This cannot be undone.');
        if (confirmed) {
            UserModel.deleteAddress(id);
            setUser({ ...UserModel.get() });
            showToast('Address deleted');
        }
    };
    
    // Handle Logout
    const handleLogout = async () => {
        const confirmed = await showConfirm('Logout?', 'Are you sure you want to logout?');
        if (confirmed) {
            logout();
            navigate(ROUTES.HOME);
        }
    };
    
    // If not logged in, show login prompt
    if (!user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center animate-fade-in">
                    <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="fas fa-user text-4xl text-blue-400"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Slice & Code</h2>
                    <p className="text-gray-500 mb-6">Login to view your profile, orders, and more</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button onClick={showLoginModal} className="btn btn-blue">
                            <i className="fas fa-sign-in-alt mr-2"></i>
                            Login / Sign Up
                        </button>
                        <button onClick={() => navigate(ROUTES.HOME)} className="btn btn-outline">
                            <i className="fas fa-home mr-2"></i>
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    // Get user orders and wishlist
    const orders = OrderModel.getByUser(user.email);
    const wishlistIds = WishlistModel.get();
    const wishlistPizzas = PizzaModel.getAll().filter(p => wishlistIds.includes(p.id));
    const addresses = user.addresses || [];
    
    // Tab Content
    const renderTabContent = () => {
        switch (activeTab) {
            case 'orders':
                return (
                    <div className="profile-section animate-fade-in">
                        <div className="profile-section-header">
                            <h2 className="profile-section-title">
                                <i className="fas fa-box text-blue-600"></i>
                                My Orders
                            </h2>
                        </div>
                        
                        {orders.length === 0 ? (
                            <EmptyState 
                                icon="fa-box-open"
                                bgColor="bg-blue-50"
                                iconColor="text-blue-300"
                                title="No orders yet"
                                text="Place your first order and it will appear here"
                                action={() => navigate(ROUTES.HOME)}
                                actionText="Browse Menu"
                            />
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {orders.map(order => (
                                    <div key={order.id} className="order-card">
                                        <div className="flex items-start space-x-4">
                                            <div className="h-16 w-16 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <i className="fas fa-pizza-slice text-2xl text-orange-400"></i>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{order.id}</h4>
                                                <p className="text-sm text-gray-500">
                                                    {order.items.length} item(s) • {Utils.formatDate(order.date)}
                                                </p>
                                                <Badge status={order.status} />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                                            <span className="font-bold text-lg text-gray-900">
                                                {Utils.formatCurrency(order.total)}
                                            </span>
                                            <button 
                                                onClick={() => navigate(ROUTES.TRACK, { orderId: order.id })}
                                                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                                            >
                                                Track Order
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
                
            case 'wishlist':
                return (
                    <div className="profile-section animate-fade-in">
                        <div className="profile-section-header">
                            <h2 className="profile-section-title">
                                <i className="fas fa-heart text-pink-600"></i>
                                My Wishlist
                                {wishlistPizzas.length > 0 && (
                                    <span className="text-sm font-normal text-gray-400">({wishlistPizzas.length})</span>
                                )}
                            </h2>
                        </div>
                        
                        {wishlistPizzas.length === 0 ? (
                            <EmptyState 
                                icon="fa-heart"
                                bgColor="bg-pink-50"
                                iconColor="text-pink-300"
                                title="Your wishlist is empty"
                                text="Save items you love by clicking the heart icon"
                                action={() => navigate(ROUTES.HOME)}
                                actionText="Browse Menu"
                            />
                        ) : (
                            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {wishlistPizzas.map(pizza => (
                                    <WishlistCard key={pizza.id} pizza={pizza} />
                                ))}
                            </div>
                        )}
                    </div>
                );
                
            case 'addresses':
                return (
                    <div className="profile-section animate-fade-in">
                        <div className="profile-section-header">
                            <h2 className="profile-section-title">
                                <i className="fas fa-map-marker-alt text-green-600"></i>
                                Manage Addresses
                            </h2>
                            <button onClick={showAddAddressModal} className="btn btn-blue text-sm">
                                <i className="fas fa-plus mr-2"></i>Add New
                            </button>
                        </div>
                        
                        {addresses.length === 0 ? (
                            <EmptyState 
                                icon="fa-map-marked-alt"
                                bgColor="bg-green-50"
                                iconColor="text-green-300"
                                title="No saved addresses"
                                text="Add an address for faster checkout"
                                action={showAddAddressModal}
                                actionText="Add Address"
                            />
                        ) : (
                            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {addresses.map(addr => (
                                    <div key={addr.id} className="address-card">
                                        <div className="flex items-start space-x-3">
                                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                <i className={`fas fa-${addr.type === 'work' ? 'building' : 'home'} text-gray-500`}></i>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-900 capitalize">{addr.type || 'Home'}</h4>
                                                <p className="text-sm text-gray-600 mt-1">{addr.street}</p>
                                                <p className="text-sm text-gray-500">{addr.city}, {addr.state} {addr.zip}</p>
                                                {addr.phone && (
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        <i className="fas fa-phone mr-1"></i>{addr.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex space-x-3 mt-4 pt-4 border-t border-gray-100">
                                            <button className="text-sm text-blue-600 hover:underline font-medium">Edit</button>
                                            <button 
                                                onClick={() => deleteAddress(addr.id)}
                                                className="text-sm text-red-600 hover:underline font-medium"
                                            >Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
                
            case 'payments':
                return (
                    <div className="profile-section animate-fade-in">
                        <div className="profile-section-header">
                            <h2 className="profile-section-title">
                                <i className="fas fa-credit-card text-purple-600"></i>
                                Payment Methods
                            </h2>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Saved Cards</h3>
                                <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-300 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-12 w-16 gradient-blue rounded-lg flex items-center justify-center">
                                            <i className="fab fa-cc-visa text-white text-2xl"></i>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                                            <p className="text-sm text-gray-500">Expires 12/26</p>
                                        </div>
                                    </div>
                                    <button className="text-red-500 hover:text-red-600">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors font-medium">
                                <i className="fas fa-plus mr-2"></i>Add New Payment Method
                            </button>
                        </div>
                    </div>
                );
                
            case 'settings':
                return (
                    <div className="space-y-4 animate-fade-in">
                        <div className="profile-section">
                            <div className="profile-section-header">
                                <h2 className="profile-section-title">
                                    <i className="fas fa-bell text-yellow-500"></i>
                                    Notifications
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-900">Order Updates</p>
                                        <p className="text-sm text-gray-500">Get notified about your order status</p>
                                    </div>
                                    <label className="toggle">
                                        <input type="checkbox" defaultChecked />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-900">Promotional Emails</p>
                                        <p className="text-sm text-gray-500">Receive offers and discounts</p>
                                    </div>
                                    <label className="toggle">
                                        <input type="checkbox" />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="font-medium text-gray-900">SMS Alerts</p>
                                        <p className="text-sm text-gray-500">Delivery notifications via SMS</p>
                                    </div>
                                    <label className="toggle">
                                        <input type="checkbox" defaultChecked />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div className="profile-section">
                            <div className="profile-section-header">
                                <h2 className="profile-section-title">
                                    <i className="fas fa-shield-alt text-green-600"></i>
                                    Privacy & Security
                                </h2>
                            </div>
                            <div className="p-6 space-y-3">
                                <button className="w-full flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <span className="font-medium text-gray-700">Change Password</span>
                                    <i className="fas fa-chevron-right text-gray-400"></i>
                                </button>
                                <button className="w-full flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <span className="font-medium text-gray-700">Two-Factor Authentication</span>
                                    <i className="fas fa-chevron-right text-gray-400"></i>
                                </button>
                                <button className="w-full flex items-center justify-between py-3 px-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-red-600">
                                    <span className="font-medium">Delete Account</span>
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                );
                
            default:
                return null;
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="profile-container">
                {/* Back to Home */}
                <BackToHomeButton />
                
                <div className="profile-layout">
                    {/* Sidebar */}
                    <div className="profile-sidebar">
                        {/* Profile Header Card */}
                        <div className="profile-header-card">
                            <div className="profile-header-banner">
                                <div className="flex items-center space-x-4">
                                    <div className="profile-avatar">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.name} />
                                        ) : (
                                            user.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-blue-100 text-xs">Hello,</p>
                                        <h2 className="font-bold text-lg truncate">{user.name}</h2>
                                        <p className="text-blue-200 text-xs truncate">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={showEditProfileModal}
                                className="w-full py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors border-t border-gray-100"
                            >
                                <i className="fas fa-edit mr-2"></i>Edit Profile
                            </button>
                        </div>
                        
                        {/* Navigation Menu */}
                        <div className="profile-menu">
                            <button 
                                onClick={() => setActiveTab('orders')}
                                className={`profile-menu-item ${activeTab === 'orders' ? 'active' : ''}`}
                            >
                                <div className="profile-menu-icon bg-blue-50">
                                    <i className="fas fa-box text-blue-600"></i>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm">My Orders</p>
                                    <p className="text-xs text-gray-400">Track, return, or buy again</p>
                                </div>
                                <i className="fas fa-chevron-right text-gray-300 text-xs"></i>
                            </button>
                            
                            <button 
                                onClick={() => setActiveTab('wishlist')}
                                className={`profile-menu-item ${activeTab === 'wishlist' ? 'active' : ''}`}
                            >
                                <div className="profile-menu-icon bg-pink-50">
                                    <i className="fas fa-heart text-pink-600"></i>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm">Wishlist</p>
                                    <p className="text-xs text-gray-400">Your saved items</p>
                                </div>
                                <i className="fas fa-chevron-right text-gray-300 text-xs"></i>
                            </button>
                            
                            <button 
                                onClick={() => setActiveTab('addresses')}
                                className={`profile-menu-item ${activeTab === 'addresses' ? 'active' : ''}`}
                            >
                                <div className="profile-menu-icon bg-green-50">
                                    <i className="fas fa-map-marker-alt text-green-600"></i>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm">Manage Addresses</p>
                                    <p className="text-xs text-gray-400">Saved delivery addresses</p>
                                </div>
                                <i className="fas fa-chevron-right text-gray-300 text-xs"></i>
                            </button>
                            
                            <button 
                                onClick={() => setActiveTab('payments')}
                                className={`profile-menu-item ${activeTab === 'payments' ? 'active' : ''}`}
                            >
                                <div className="profile-menu-icon bg-purple-50">
                                    <i className="fas fa-credit-card text-purple-600"></i>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm">Payments</p>
                                    <p className="text-xs text-gray-400">Cards, UPI & more</p>
                                </div>
                                <i className="fas fa-chevron-right text-gray-300 text-xs"></i>
                            </button>
                            
                            <button 
                                onClick={() => setActiveTab('settings')}
                                className={`profile-menu-item ${activeTab === 'settings' ? 'active' : ''}`}
                            >
                                <div className="profile-menu-icon bg-gray-100">
                                    <i className="fas fa-cog text-gray-600"></i>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm">Settings</p>
                                    <p className="text-xs text-gray-400">Notifications & privacy</p>
                                </div>
                                <i className="fas fa-chevron-right text-gray-300 text-xs"></i>
                            </button>
                            
                            <div className="border-t border-gray-100">
                                <button onClick={handleLogout} className="profile-menu-item logout">
                                    <div className="profile-menu-icon bg-red-50">
                                        <i className="fas fa-sign-out-alt text-red-500"></i>
                                    </div>
                                    <span className="font-medium text-sm">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Main Content */}
                    <div className="profile-content">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// CHECKOUT PAGE (src/pages/Checkout.jsx)
// ==========================================
const CheckoutPage = () => {
    const { items, total, clearCart } = useCart();
    const { user } = useAuth();
    const { navigate } = useRouter();
    const [loading, setLoading] = useState(false);
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);
    const [address, setAddress] = useState('');
    
    useEffect(() => {
        if (items.length === 0) {
            navigate(ROUTES.HOME);
        }
    }, [items]);
    
    const applyCoupon = () => {
        const discountRate = CONFIG.COUPON_CODES[coupon.toUpperCase()];
        if (discountRate) {
            setDiscount(total * discountRate);
            showToast(`Coupon applied! ${discountRate * 100}% off`);
        } else {
            showToast('Invalid coupon code', 'error');
        }
    };
    
    const handlePlaceOrder = async () => {
        if (!address && (!user?.addresses || user.addresses.length === 0)) {
            showToast('Please enter delivery address', 'error');
            return;
        }
        
        setLoading(true);
        await Utils.delay(1500);
        
        const order = {
            id: Utils.generateId(),
            userEmail: user?.email || 'guest@example.com',
            userName: user?.name || 'Guest',
            items: items,
            total: total - discount,
            discount,
            coupon: coupon.toUpperCase(),
            status: ORDER_STATUS.PENDING,
            address: address || (user?.addresses?.[0]?.street + ', ' + user?.addresses?.[0]?.city),
            date: new Date().toISOString()
        };
        
        OrderModel.create(order);
        clearCart();
        setLoading(false);
        
        await Swal.fire({
            icon: 'success',
            title: 'Order Placed!',
            html: `
                <p>Order ID: <strong>${order.id}</strong></p>
                <p>Total: <strong>${Utils.formatCurrency(order.total)}</strong></p>
                ${discount > 0 ? `<p class="text-green-600">You saved ${Utils.formatCurrency(discount)}!</p>` : ''}
            `,
            confirmButtonColor: '#2874f0'
        });
        
        navigate(ROUTES.TRACK, { orderId: order.id });
    };
    
    const finalTotal = total - discount;
    
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Back to Home */}
            <BackToHomeButton />
            
            <h1 className="text-2xl font-bold text-gray-900 mb-8 animate-fade-in">Checkout</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="card p-6 animate-fade-in">
                        <h2 className="font-bold text-lg mb-4">Order Summary</h2>
                        <div className="space-y-3">
                            {items.map(item => (
                                <div key={item.id} className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-0">
                                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                                        <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                                    </div>
                                    <span className="font-bold">{Utils.formatCurrency(item.price * item.qty)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Delivery Address */}
                    <div className="card p-6 animate-fade-in animate-delay-100">
                        <h2 className="font-bold text-lg mb-4">Delivery Address</h2>
                        {user?.addresses?.length > 0 ? (
                            <div className="space-y-3">
                                {user.addresses.map(addr => (
                                    <label key={addr.id} className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                                        <input 
                                            type="radio" 
                                            name="address" 
                                            className="mt-1"
                                            onChange={() => setAddress(`${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}`)}
                                        />
                                        <div>
                                            <p className="font-medium capitalize">{addr.type}</p>
                                            <p className="text-sm text-gray-600">{addr.street}</p>
                                            <p className="text-sm text-gray-500">{addr.city}, {addr.state} {addr.zip}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <textarea 
                                placeholder="Enter your full delivery address..."
                                className="input min-h-[100px]"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            ></textarea>
                        )}
                    </div>
                </div>
                
                {/* Order Total */}
                <div className="lg:col-span-1">
                    <div className="card p-6 sticky top-24 animate-fade-in animate-delay-200">
                        <h2 className="font-bold text-lg mb-4">Payment Details</h2>
                        
                        {/* Coupon */}
                        <div className="mb-4">
                            <label className="label">Coupon Code</label>
                            <div className="flex space-x-2">
                                <input 
                                    type="text" 
                                    placeholder="Enter code"
                                    className="input flex-1"
                                    value={coupon}
                                    onChange={(e) => setCoupon(e.target.value)}
                                />
                                <button onClick={applyCoupon} className="btn btn-outline">Apply</button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Try: PRO20, SAVE20, FIRST10</p>
                        </div>
                        
                        <div className="space-y-3 py-4 border-y border-gray-100">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>{Utils.formatCurrency(total)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-{Utils.formatCurrency(discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery</span>
                                <span className="text-green-600">Free</span>
                            </div>
                        </div>
                        
                        <div className="flex justify-between text-xl font-bold py-4">
                            <span>Total</span>
                            <span>{Utils.formatCurrency(finalTotal)}</span>
                        </div>
                        
                        <button 
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className="btn btn-primary w-full"
                        >
                            {loading ? (
                                <>
                                    <Loader size="small" color="white" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-lock mr-2"></i>
                                    Place Order
                                </>
                            )}
                        </button>
                        
                        <p className="text-xs text-center text-gray-500 mt-4">
                            <i className="fas fa-shield-alt mr-1"></i>
                            Secure payment powered by Stripe
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// TRACK ORDER PAGE (src/pages/TrackOrder.jsx)
// ==========================================
const TrackOrderPage = () => {
    const { routeParams, navigate } = useRouter();
    const [orderId, setOrderId] = useState(routeParams.orderId || '');
    const [order, setOrder] = useState(null);
    
    useEffect(() => {
        if (routeParams.orderId) {
            const found = OrderModel.getById(routeParams.orderId);
            setOrder(found);
        }
    }, [routeParams]);
    
    const searchOrder = () => {
        const found = OrderModel.getById(orderId);
        if (found) {
            setOrder(found);
        } else {
            showToast('Order not found', 'error');
        }
    };
    
    const statuses = [ORDER_STATUS.PENDING, ORDER_STATUS.PREPARING, ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.COMPLETED];
    const currentIdx = order ? statuses.indexOf(order.status) : -1;
    
    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Back to Home */}
            <BackToHomeButton />
            
            <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center animate-fade-in">Track Your Order</h1>
            
            {/* Search */}
            <div className="card p-6 mb-6 animate-fade-in">
                <div className="flex space-x-2">
                    <input 
                        type="text"
                        placeholder="Enter Order ID (e.g., ORD-XXXXXX)"
                        className="input flex-1"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                    />
                    <button onClick={searchOrder} className="btn btn-primary">
                        <i className="fas fa-search"></i>
                    </button>
                </div>
            </div>
            
            {order && (
                <div className="card p-6 animate-fade-in">
                    <div className="text-center mb-8">
                        <div className="h-20 w-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                            <i className="fas fa-motorcycle text-3xl text-orange-600"></i>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{order.id}</h2>
                        <p className="text-gray-500">{Utils.formatDateTime(order.date)}</p>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="relative mb-8">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="gradient-orange h-2 rounded-full transition-all duration-500"
                                style={{ width: `${((currentIdx + 1) / statuses.length) * 100}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-3">
                            {statuses.map((status, idx) => (
                                <div key={status} className={`text-center ${idx <= currentIdx ? 'text-orange-600' : 'text-gray-400'}`}>
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
                                        idx <= currentIdx ? 'bg-orange-500 text-white' : 'bg-gray-200'
                                    }`}>
                                        {idx < currentIdx ? (
                                            <i className="fas fa-check text-xs"></i>
                                        ) : (
                                            <span className="text-xs font-bold">{idx + 1}</span>
                                        )}
                                    </div>
                                    <span className="text-xs font-medium hidden sm:block">{status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Order Details */}
                    <div className="space-y-3 pt-6 border-t border-gray-100">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Status</span>
                            <Badge status={order.status} />
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Items</span>
                            <span className="font-medium">{order.items.length} pizza(s)</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Delivery</span>
                            <span className="font-medium text-right max-w-[200px] truncate">{order.address}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-100">
                            <span>Total</span>
                            <span>{Utils.formatCurrency(order.total)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ==========================================
// CONTACT PAGE (src/pages/Contact.jsx)
// ==========================================
const ContactPage = () => {
    const { navigate } = useRouter();
    
    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            {/* Back to Home */}
            <BackToHomeButton />
            
            <div className="card p-8 text-center animate-fade-in">
                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fab fa-whatsapp text-4xl text-green-600"></i>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">Order on WhatsApp</h1>
                <p className="text-gray-500 mb-8">Skip the queue and chat directly with us!</p>
                <a 
                    href="https://wa.me/?text=Hi!%20I%20want%20to%20order%20pizza" 
                    target="_blank"
                    className="btn btn-primary bg-green-500 hover:bg-green-600 inline-flex"
                >
                    <i className="fab fa-whatsapp text-xl mr-2"></i>
                    Start Chat
                </a>
                
                <div className="mt-12 pt-8 border-t border-gray-100">
                    <h2 className="font-bold text-lg mb-4">Other Ways to Reach Us</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <i className="fas fa-phone text-2xl text-blue-600 mb-2"></i>
                            <p className="font-medium">Call Us</p>
                            <p className="text-sm text-gray-500">+1 234 567 8900</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <i className="fas fa-envelope text-2xl text-red-600 mb-2"></i>
                            <p className="font-medium">Email</p>
                            <p className="text-sm text-gray-500">hello@slicecode.com</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <i className="fas fa-map-marker-alt text-2xl text-green-600 mb-2"></i>
                            <p className="font-medium">Visit</p>
                            <p className="text-sm text-gray-500">123 Pizza Street</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// ADMIN PAGE (src/pages/Admin.jsx)
// ==========================================
const AdminPage = () => {
    const { navigate } = useRouter();
    const [orders, setOrders] = useState(OrderModel.getAll());
    
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const activeOrders = orders.filter(o => o.status !== ORDER_STATUS.COMPLETED).length;
    const completedOrders = orders.filter(o => o.status === ORDER_STATUS.COMPLETED).length;
    
    const updateStatus = (id, status) => {
        OrderModel.updateStatus(id, status);
        setOrders(OrderModel.getAll());
        showToast('Status updated!');
    };
    
    return (
        <div className="admin-container">
            <div className="admin-layout">
                {/* Sidebar */}
                <div className="admin-sidebar">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="h-10 w-10 gradient-orange rounded-lg flex items-center justify-center">
                            <i className="fas fa-pizza-slice text-white"></i>
                        </div>
                        <span className="text-white font-bold text-lg">Admin Panel</span>
                    </div>
                    
                    <nav className="space-y-2">
                        <a className="admin-nav-item active">
                            <i className="fas fa-chart-line w-5"></i>
                            <span>Dashboard</span>
                        </a>
                        <a className="admin-nav-item">
                            <i className="fas fa-box w-5"></i>
                            <span>Orders</span>
                        </a>
                        <a className="admin-nav-item">
                            <i className="fas fa-pizza-slice w-5"></i>
                            <span>Menu Items</span>
                        </a>
                        <a className="admin-nav-item">
                            <i className="fas fa-users w-5"></i>
                            <span>Customers</span>
                        </a>
                    </nav>
                    
                    <div className="mt-8 pt-8 border-t border-gray-700">
                        <button onClick={() => navigate(ROUTES.HOME)} className="admin-nav-item w-full">
                            <i className="fas fa-home w-5"></i>
                            <span>Back to Home</span>
                        </button>
                        <button onClick={() => navigate(ROUTES.HOME)} className="admin-nav-item w-full text-red-400 hover:text-red-300">
                            <i className="fas fa-sign-out-alt w-5"></i>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
                
                {/* Main Content */}
                <div className="admin-content">
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
                            <p className="text-gray-400 mt-1">Welcome back, Admin</p>
                        </div>
                        <button onClick={() => navigate(ROUTES.HOME)} className="btn bg-gray-700 text-white hover:bg-gray-600 lg:hidden">
                            <i className="fas fa-home mr-2"></i>Back to Home
                        </button>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="admin-stat-card bg-gradient-to-br from-blue-500 to-blue-600">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Total Revenue</p>
                                    <p className="text-2xl font-bold mt-1">{Utils.formatCurrency(totalRevenue)}</p>
                                </div>
                                <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                                    <i className="fas fa-dollar-sign text-xl"></i>
                                </div>
                            </div>
                        </div>
                        
                        <div className="admin-stat-card bg-gradient-to-br from-orange-500 to-red-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-100 text-sm">Active Orders</p>
                                    <p className="text-2xl font-bold mt-1">{activeOrders}</p>
                                </div>
                                <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                                    <i className="fas fa-clock text-xl"></i>
                                </div>
                            </div>
                        </div>
                        
                        <div className="admin-stat-card bg-gradient-to-br from-green-500 to-emerald-600">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Completed</p>
                                    <p className="text-2xl font-bold mt-1">{completedOrders}</p>
                                </div>
                                <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                                    <i className="fas fa-check text-xl"></i>
                                </div>
                            </div>
                        </div>
                        
                        <div className="admin-stat-card bg-gradient-to-br from-purple-500 to-indigo-600">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm">Total Orders</p>
                                    <p className="text-2xl font-bold mt-1">{orders.length}</p>
                                </div>
                                <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                                    <i className="fas fa-shopping-bag text-xl"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Orders Table */}
                    <div className="bg-gray-800 rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h2 className="text-lg font-bold text-white">Recent Orders</h2>
                            <button 
                                onClick={() => setOrders(OrderModel.getAll())}
                                className="btn bg-gray-700 text-gray-300 hover:bg-gray-600"
                            >
                                <i className="fas fa-sync-alt mr-2"></i>Refresh
                            </button>
                        </div>
                        
                        {/* Desktop Table */}
                        <div className="overflow-x-auto hidden md:block">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Status</th>
                                        <th>Total</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center text-gray-500 py-12">
                                                No orders yet
                                            </td>
                                        </tr>
                                    ) : orders.map(order => (
                                        <tr key={order.id}>
                                            <td className="font-mono text-sm text-white">{order.id}</td>
                                            <td>
                                                <p className="text-white font-medium">{order.userName}</p>
                                                <p className="text-gray-500 text-sm truncate max-w-[150px]">{order.address}</p>
                                            </td>
                                            <td><Badge status={order.status} /></td>
                                            <td className="text-white font-bold">{Utils.formatCurrency(order.total)}</td>
                                            <td>
                                                <select 
                                                    value={order.status}
                                                    onChange={(e) => updateStatus(order.id, e.target.value)}
                                                    className="bg-gray-700 text-white text-sm rounded-lg px-3 py-2 border-0 focus:ring-2 focus:ring-orange-500"
                                                >
                                                    <option value={ORDER_STATUS.PENDING}>Pending</option>
                                                    <option value={ORDER_STATUS.PREPARING}>Preparing</option>
                                                    <option value={ORDER_STATUS.OUT_FOR_DELIVERY}>Out for Delivery</option>
                                                    <option value={ORDER_STATUS.COMPLETED}>Completed</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Mobile Cards */}
                        <div className="md:hidden p-4 space-y-4">
                            {orders.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No orders yet</p>
                            ) : orders.map(order => (
                                <div key={order.id} className="bg-gray-700 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-mono text-sm text-white">{order.id}</p>
                                            <p className="text-gray-400 text-sm">{order.userName}</p>
                                        </div>
                                        <Badge status={order.status} />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-bold">{Utils.formatCurrency(order.total)}</span>
                                        <select 
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            className="bg-gray-600 text-white text-sm rounded-lg px-3 py-2"
                                        >
                                            <option value={ORDER_STATUS.PENDING}>Pending</option>
                                            <option value={ORDER_STATUS.PREPARING}>Preparing</option>
                                            <option value={ORDER_STATUS.OUT_FOR_DELIVERY}>Out for Delivery</option>
                                            <option value={ORDER_STATUS.COMPLETED}>Completed</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

console.log('✅ Pages loaded');
