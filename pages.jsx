// ============================================
// SLICE & CODE - PAGE COMPONENTS
// jsx/pages.jsx
// ============================================

const { useState, useEffect, useMemo, useCallback } = React;

// ==========================================
// HOME PAGE
// ==========================================
const HomePage = () => {
    const pizzas = PizzaModel.getAll();
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('default');
    
    const categories = ['All', ...new Set(pizzas.map(p => p.category))];
    
    const filteredPizzas = useMemo(() => {
        let result = filter === 'All' ? pizzas : pizzas.filter(p => p.category === filter);
        
        // Apply search
        if (searchQuery.trim()) {
            result = result.filter(p => 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        // Apply sorting
        switch (sortBy) {
            case 'price-low':
                result = [...result].sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result = [...result].sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result = [...result].sort((a, b) => b.rating - a.rating);
                break;
            case 'name':
                result = [...result].sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                break;
        }
        
        return result;
    }, [pizzas, filter, searchQuery, sortBy]);
    
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl p-8 mb-8 text-white relative overflow-hidden animate-fade-in">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-3 animate-slide-in-up">
                        🍕 Fresh & Hot Pizzas
                    </h1>
                    <p className="text-lg text-white/90 mb-4 animate-slide-in-up animate-delay-100">
                        Handcrafted with love, delivered to your door
                    </p>
                    <div className="flex flex-wrap gap-3 animate-slide-in-up animate-delay-200">
                        <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                            <i className="fas fa-truck mr-2" />Free Delivery
                        </span>
                        <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                            <i className="fas fa-clock mr-2" />30 min or less
                        </span>
                        <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                            <i className="fas fa-star mr-2" />4.8 Rating
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in animate-delay-100">
                {/* Search */}
                <div className="relative flex-1">
                    <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search pizzas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <i className="fas fa-times" />
                        </button>
                    )}
                </div>
                
                {/* Sort Dropdown */}
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all cursor-pointer"
                >
                    <option value="default">Sort by: Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="name">Name: A-Z</option>
                </select>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center mb-8 animate-fade-in animate-delay-150">
                {categories.map((cat, idx) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all transform hover:scale-105 active:scale-95 ${
                            filter === cat 
                                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30' 
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                        style={{ animationDelay: `${idx * 50}ms` }}
                    >
                        {cat === 'All' && <i className="fas fa-th-large mr-2" />}
                        {cat === 'Vegetarian' && <i className="fas fa-leaf mr-2 text-green-500" />}
                        {cat === 'Meat' && <i className="fas fa-drumstick-bite mr-2 text-red-500" />}
                        {cat === 'Gourmet' && <i className="fas fa-crown mr-2 text-yellow-500" />}
                        {cat === 'Chicken' && <i className="fas fa-feather mr-2 text-orange-500" />}
                        {cat}
                    </button>
                ))}
            </div>
            
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6 animate-fade-in">
                <p className="text-gray-500">
                    Showing <span className="font-bold text-gray-900">{filteredPizzas.length}</span> pizzas
                    {filter !== 'All' && <span> in <span className="font-medium text-orange-600">{filter}</span></span>}
                    {searchQuery && <span> matching "<span className="font-medium">{searchQuery}</span>"</span>}
                </p>
                {(filter !== 'All' || searchQuery) && (
                    <button 
                        onClick={() => { setFilter('All'); setSearchQuery(''); }}
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                        <i className="fas fa-times mr-1" />Clear filters
                    </button>
                )}
            </div>
            
            {/* Pizza Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPizzas.map((pizza, idx) => (
                    <PizzaCard key={pizza.id} pizza={pizza} index={idx} />
                ))}
            </div>
            
            {/* Empty State */}
            {filteredPizzas.length === 0 && (
                <EmptyState
                    icon="fa-search"
                    title="No pizzas found"
                    text={searchQuery ? `No results for "${searchQuery}"` : "Try selecting a different category"}
                    action={() => { setFilter('All'); setSearchQuery(''); }}
                    actionText="Clear Filters"
                    bgColor="bg-orange-50"
                    iconColor="text-orange-300"
                />
            )}
            
            {/* Special Offers Section */}
            <div className="mt-16 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <i className="fas fa-tags text-orange-500 mr-3" />
                    Special Offers
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white hover-lift cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm uppercase tracking-wide">Limited Time</p>
                                <h3 className="text-xl font-bold mt-1">20% OFF First Order</h3>
                                <p className="text-green-100 mt-2">Use code: <span className="font-mono bg-white/20 px-2 py-1 rounded">FIRST20</span></p>
                            </div>
                            <div className="text-5xl">🎉</div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white hover-lift cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm uppercase tracking-wide">Family Deal</p>
                                <h3 className="text-xl font-bold mt-1">Buy 2 Get 1 Free</h3>
                                <p className="text-purple-100 mt-2">On selected large pizzas</p>
                            </div>
                            <div className="text-5xl">🍕</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// PROFILE PAGE (Flipkart Style)
// ==========================================
const ProfilePage = () => {
    const { user, login, updateUser, logout, refreshUser, isAuthenticated } = useAuth();
    const { navigate, goHome } = useRouter();
    const [activeTab, setActiveTab] = useState('orders');
    const [refreshKey, setRefreshKey] = useState(0);
    
    // Force refresh wishlist
    const forceRefresh = useCallback(() => {
        setRefreshKey(prev => prev + 1);
        refreshUser();
    }, [refreshUser]);
    
    // Login Modal with proper validation
    const showLoginModal = async () => {
        const { value: formValues } = await Swal.fire({
            title: '',
            html: `
                <div class="space-y-5 text-left animate-fade-in">
                    <div class="text-center mb-6">
                        <div class="h-20 w-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
                            <i class="fas fa-user-plus text-white text-3xl"></i>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-900">Welcome Back!</h2>
                        <p class="text-gray-500 mt-1">Sign in to continue to Slice & Code</p>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            <i class="fas fa-user mr-2 text-gray-400"></i>Full Name <span class="text-red-500">*</span>
                        </label>
                        <input id="swal-name" class="input" placeholder="John Doe" required>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            <i class="fas fa-envelope mr-2 text-gray-400"></i>Email Address <span class="text-red-500">*</span>
                        </label>
                        <input id="swal-email" type="email" class="input" placeholder="john@gmail.com" required>
                        <p class="text-xs text-gray-400 mt-1">Supported: Gmail, Yahoo, Outlook, etc.</p>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            <i class="fas fa-phone mr-2 text-gray-400"></i>Phone Number <span class="text-red-500">*</span>
                        </label>
                        <input id="swal-phone" type="tel" class="input" placeholder="9876543210" maxlength="10" required>
                        <p class="text-xs text-gray-400 mt-1">Enter 10 digit mobile number</p>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            <i class="fas fa-lock mr-2 text-gray-400"></i>Password <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                            <input id="swal-password" type="password" class="input pr-10" placeholder="Min 6 characters" required>
                            <button type="button" onclick="
                                const input = document.getElementById('swal-password');
                                const icon = this.querySelector('i');
                                if (input.type === 'password') {
                                    input.type = 'text';
                                    icon.classList.replace('fa-eye', 'fa-eye-slash');
                                } else {
                                    input.type = 'password';
                                    icon.classList.replace('fa-eye-slash', 'fa-eye');
                                }
                            " class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between text-sm">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                            <span class="text-gray-600">Remember me</span>
                        </label>
                        <button type="button" onclick="Swal.close(); setTimeout(() => document.getElementById('forgot-password-trigger')?.click(), 300);" class="text-blue-600 hover:text-blue-700 font-medium">
                            Forgot Password?
                        </button>
                    </div>
                    
                    <div class="pt-2">
                        <div class="relative">
                            <div class="absolute inset-0 flex items-center">
                                <div class="w-full border-t border-gray-200"></div>
                            </div>
                            <div class="relative flex justify-center text-sm">
                                <span class="px-4 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>
                        <div class="flex gap-3 mt-4">
                            <button type="button" class="flex-1 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                <i class="fab fa-google text-red-500"></i>
                                <span class="text-sm font-medium text-gray-700">Google</span>
                            </button>
                            <button type="button" class="flex-1 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                <i class="fab fa-facebook text-blue-600"></i>
                                <span class="text-sm font-medium text-gray-700">Facebook</span>
                            </button>
                        </div>
                    </div>
                </div>
            `,
            confirmButtonText: '<i class="fas fa-sign-in-alt mr-2"></i> Sign In',
            confirmButtonColor: '#2874f0',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            showClass: { popup: 'animate-zoom-in' },
            hideClass: { popup: 'animate-fade-out' },
            preConfirm: () => {
                const name = document.getElementById('swal-name').value.trim();
                const email = document.getElementById('swal-email').value.trim();
                const phone = document.getElementById('swal-phone').value.trim();
                const password = document.getElementById('swal-password').value;
                
                // Name validation
                if (!name || name.length < 2) {
                    Swal.showValidationMessage('<i class="fas fa-exclamation-circle mr-2"></i>Please enter your full name (min 2 characters)');
                    return false;
                }
                
                // Email validation
                if (!Utils.validateEmail(email)) {
                    Swal.showValidationMessage('<i class="fas fa-exclamation-circle mr-2"></i>Please enter a valid email (e.g., name@gmail.com)');
                    return false;
                }
                
                // Phone validation
                if (!Utils.validatePhone(phone)) {
                    Swal.showValidationMessage('<i class="fas fa-exclamation-circle mr-2"></i>Please enter a valid 10-digit phone number');
                    return false;
                }
                
                // Password validation
                if (!password || password.length < 6) {
                    Swal.showValidationMessage('<i class="fas fa-exclamation-circle mr-2"></i>Password must be at least 6 characters');
                    return false;
                }
                
                return { name, email, phone };
            }
        });
        
        if (formValues) {
            await login(formValues);
            showToast('Welcome back, ' + formValues.name + '!', 'success');
        }
    };
    
    // Edit Profile Modal
    const showEditProfileModal = async () => {
        const { value: formValues } = await Swal.fire({
            title: '<i class="fas fa-user-edit text-blue-600 mr-2"></i> Edit Profile',
            html: `
                <div class="space-y-4 text-left animate-fade-in">
                    <div class="flex justify-center mb-4">
                        <div class="relative">
                            <div class="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                ${user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <button class="absolute bottom-0 right-0 h-8 w-8 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors">
                                <i class="fas fa-camera text-sm"></i>
                            </button>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input id="edit-name" class="input" value="${user.name}" placeholder="Enter your full name">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email (cannot be changed)</label>
                        <input class="input bg-gray-100" value="${user.email}" disabled>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input id="edit-phone" class="input" value="${user.phone || ''}" placeholder="+1 234 567 8900">
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <select id="edit-gender" class="input">
                                <option value="">Select</option>
                                <option value="Male" ${user.gender === 'Male' ? 'selected' : ''}>Male</option>
                                <option value="Female" ${user.gender === 'Female' ? 'selected' : ''}>Female</option>
                                <option value="Other" ${user.gender === 'Other' ? 'selected' : ''}>Other</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input id="edit-dob" type="date" class="input" value="${user.dob || ''}">
                        </div>
                    </div>
                </div>
            `,
            confirmButtonText: '<i class="fas fa-save mr-2"></i> Save Changes',
            confirmButtonColor: '#2874f0',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            showClass: { popup: 'animate-zoom-in' },
            hideClass: { popup: 'animate-fade-out' },
            preConfirm: () => {
                const name = document.getElementById('edit-name').value;
                if (!name.trim()) {
                    Swal.showValidationMessage('Name is required');
                    return false;
                }
                return {
                    name: name,
                    phone: document.getElementById('edit-phone').value,
                    gender: document.getElementById('edit-gender').value,
                    dob: document.getElementById('edit-dob').value
                };
            }
        });
        
        if (formValues) {
            updateUser(formValues);
            showToast('Profile updated successfully!');
        }
    };
    
    // Change Password Modal
    const showChangePasswordModal = async () => {
        const { value: formValues } = await Swal.fire({
            title: '<i class="fas fa-lock text-blue-600 mr-2"></i> Change Password',
            html: `
                <div class="space-y-4 text-left animate-fade-in">
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p class="text-sm text-blue-700">
                            <i class="fas fa-info-circle mr-2"></i>
                            Password must be at least 8 characters with letters and numbers.
                        </p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <div class="relative">
                            <input id="current-pass" type="password" class="input pr-10" placeholder="Enter current password">
                            <button type="button" onclick="togglePassword('current-pass')" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <div class="relative">
                            <input id="new-pass" type="password" class="input pr-10" placeholder="Enter new password">
                            <button type="button" onclick="togglePassword('new-pass')" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <div class="relative">
                            <input id="confirm-pass" type="password" class="input pr-10" placeholder="Confirm new password">
                            <button type="button" onclick="togglePassword('confirm-pass')" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    <div id="password-strength" class="hidden">
                        <div class="flex items-center gap-2">
                            <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div id="strength-bar" class="h-full bg-red-500 transition-all duration-300" style="width: 0%"></div>
                            </div>
                            <span id="strength-text" class="text-xs font-medium text-gray-500">Weak</span>
                        </div>
                    </div>
                </div>
                <script>
                    function togglePassword(id) {
                        const input = document.getElementById(id);
                        const icon = input.nextElementSibling.querySelector('i');
                        if (input.type === 'password') {
                            input.type = 'text';
                            icon.classList.replace('fa-eye', 'fa-eye-slash');
                        } else {
                            input.type = 'password';
                            icon.classList.replace('fa-eye-slash', 'fa-eye');
                        }
                    }
                </script>
            `,
            confirmButtonText: '<i class="fas fa-check mr-2"></i> Update Password',
            confirmButtonColor: '#2874f0',
            showCancelButton: true,
            showClass: { popup: 'animate-zoom-in' },
            preConfirm: () => {
                const currentPass = document.getElementById('current-pass').value;
                const newPass = document.getElementById('new-pass').value;
                const confirmPass = document.getElementById('confirm-pass').value;
                
                if (!currentPass || !newPass || !confirmPass) {
                    Swal.showValidationMessage('All fields are required');
                    return false;
                }
                if (newPass.length < 8) {
                    Swal.showValidationMessage('Password must be at least 8 characters');
                    return false;
                }
                if (newPass !== confirmPass) {
                    Swal.showValidationMessage('Passwords do not match');
                    return false;
                }
                return { currentPass, newPass };
            }
        });
        
        if (formValues) {
            // Simulate password change
            await Swal.fire({
                icon: 'success',
                title: 'Password Changed!',
                text: 'Your password has been updated successfully.',
                confirmButtonColor: '#2874f0',
                showClass: { popup: 'animate-zoom-in' }
            });
        }
    };
    
    // Forgot Password Modal
    const showForgotPasswordModal = async () => {
        const { value: email } = await Swal.fire({
            title: '<i class="fas fa-key text-orange-500 mr-2"></i> Forgot Password?',
            html: `
                <div class="space-y-4 text-left animate-fade-in">
                    <div class="text-center mb-4">
                        <div class="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i class="fas fa-envelope text-2xl text-orange-500"></i>
                        </div>
                        <p class="text-gray-600 text-sm">Enter your email address and we'll send you a link to reset your password.</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input id="reset-email" type="email" class="input" placeholder="Enter your email" value="${user?.email || ''}">
                    </div>
                </div>
            `,
            confirmButtonText: '<i class="fas fa-paper-plane mr-2"></i> Send Reset Link',
            confirmButtonColor: '#ff6b35',
            showCancelButton: true,
            showClass: { popup: 'animate-zoom-in' },
            preConfirm: () => {
                const email = document.getElementById('reset-email').value;
                if (!email || !email.includes('@')) {
                    Swal.showValidationMessage('Please enter a valid email');
                    return false;
                }
                return email;
            }
        });
        
        if (email) {
            // Simulate sending reset email
            await Swal.fire({
                icon: 'success',
                title: 'Reset Link Sent!',
                html: `
                    <div class="text-center">
                        <p class="text-gray-600 mb-2">We've sent a password reset link to:</p>
                        <p class="font-bold text-gray-800">${email}</p>
                        <p class="text-sm text-gray-500 mt-3">Please check your inbox and spam folder.</p>
                    </div>
                `,
                confirmButtonColor: '#2874f0',
                showClass: { popup: 'animate-zoom-in' }
            });
        }
    };
    
    // Edit Address Modal with PIN code lookup
    const showEditAddressModal = async (address) => {
        const { value: formValues } = await Swal.fire({
            title: '<i class="fas fa-edit text-green-600 mr-2"></i> Edit Address',
            html: `
                <div class="space-y-4 text-left animate-fade-in">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                        <div class="flex gap-3">
                            <label class="flex-1 cursor-pointer">
                                <input type="radio" name="edit-addr-type" value="home" class="hidden peer" ${address.type === 'home' || !address.type ? 'checked' : ''}>
                                <div class="border-2 rounded-lg p-3 text-center peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all hover:border-gray-300">
                                    <i class="fas fa-home text-xl mb-1 text-blue-600"></i>
                                    <p class="text-sm font-medium">Home</p>
                                </div>
                            </label>
                            <label class="flex-1 cursor-pointer">
                                <input type="radio" name="edit-addr-type" value="work" class="hidden peer" ${address.type === 'work' ? 'checked' : ''}>
                                <div class="border-2 rounded-lg p-3 text-center peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all hover:border-gray-300">
                                    <i class="fas fa-building text-xl mb-1 text-purple-600"></i>
                                    <p class="text-sm font-medium">Work</p>
                                </div>
                            </label>
                            <label class="flex-1 cursor-pointer">
                                <input type="radio" name="edit-addr-type" value="other" class="hidden peer" ${address.type === 'other' ? 'checked' : ''}>
                                <div class="border-2 rounded-lg p-3 text-center peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all hover:border-gray-300">
                                    <i class="fas fa-map-marker-alt text-xl mb-1 text-orange-600"></i>
                                    <p class="text-sm font-medium">Other</p>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            PIN Code <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                            <input id="edit-zip" class="input" value="${address.zip || ''}" placeholder="6-digit PIN code" maxlength="6"
                                oninput="
                                    const pin = this.value;
                                    const cityField = document.getElementById('edit-city');
                                    const stateField = document.getElementById('edit-state');
                                    const areaField = document.getElementById('edit-area');
                                    const pinStatus = document.getElementById('edit-pin-status');
                                    
                                    if (pin.length === 6 && /^[1-9][0-9]{5}$/.test(pin)) {
                                        pinStatus.innerHTML = '<span class=\\'text-blue-600\\'><i class=\\'fas fa-spinner fa-spin mr-1\\'></i>Looking up...</span>';
                                        
                                        fetch('https://api.postalpincode.in/pincode/' + pin)
                                            .then(res => res.json())
                                            .then(data => {
                                                if (data[0].Status === 'Success' && data[0].PostOffice) {
                                                    const po = data[0].PostOffice[0];
                                                    cityField.value = po.District;
                                                    stateField.value = po.State;
                                                    areaField.value = po.Name;
                                                    pinStatus.innerHTML = '<span class=\\'text-green-600\\'><i class=\\'fas fa-check-circle mr-1\\'></i>' + po.District + ', ' + po.State + '</span>';
                                                } else {
                                                    pinStatus.innerHTML = '<span class=\\'text-red-600\\'><i class=\\'fas fa-times-circle mr-1\\'></i>Invalid PIN</span>';
                                                }
                                            })
                                            .catch(() => {
                                                pinStatus.innerHTML = '<span class=\\'text-yellow-600\\'><i class=\\'fas fa-exclamation-circle mr-1\\'></i>Enter manually</span>';
                                                cityField.readOnly = false;
                                                stateField.readOnly = false;
                                            });
                                    }
                                ">
                        </div>
                        <p id="edit-pin-status" class="text-xs mt-1">${address.city ? `<span class='text-green-600'><i class='fas fa-check-circle mr-1'></i>${address.city}, ${address.state}</span>` : ''}</p>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Street Address <span class="text-red-500">*</span>
                        </label>
                        <input id="edit-street" class="input" value="${address.street || ''}" placeholder="House No., Building, Street">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Area/Locality</label>
                        <input id="edit-area" class="input" value="${address.area || ''}" placeholder="Area, Locality">
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">City <span class="text-red-500">*</span></label>
                            <input id="edit-city" class="input bg-gray-50" value="${address.city || ''}" placeholder="City" readonly>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">State <span class="text-red-500">*</span></label>
                            <input id="edit-state" class="input bg-gray-50" value="${address.state || ''}" placeholder="State" readonly>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number <span class="text-red-500">*</span>
                        </label>
                        <input id="edit-addr-phone" class="input" value="${address.phone || ''}" placeholder="10-digit mobile" maxlength="10">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
                        <input id="edit-landmark" class="input" value="${address.landmark || ''}" placeholder="Near landmark">
                    </div>
                </div>
            `,
            confirmButtonText: '<i class="fas fa-save mr-2"></i> Update Address',
            confirmButtonColor: '#10b981',
            showCancelButton: true,
            showClass: { popup: 'animate-zoom-in' },
            preConfirm: () => {
                const zip = document.getElementById('edit-zip').value.trim();
                const street = document.getElementById('edit-street').value.trim();
                const city = document.getElementById('edit-city').value.trim();
                const state = document.getElementById('edit-state').value.trim();
                const phone = document.getElementById('edit-addr-phone').value.trim();
                
                if (!Utils.validatePinCode(zip)) {
                    Swal.showValidationMessage('<i class="fas fa-exclamation-circle mr-2"></i>Please enter a valid 6-digit PIN code');
                    return false;
                }
                if (!street || street.length < 5) {
                    Swal.showValidationMessage('<i class="fas fa-exclamation-circle mr-2"></i>Please enter a complete street address');
                    return false;
                }
                if (!city) {
                    Swal.showValidationMessage('<i class="fas fa-exclamation-circle mr-2"></i>City is required');
                    return false;
                }
                if (!state) {
                    Swal.showValidationMessage('<i class="fas fa-exclamation-circle mr-2"></i>State is required');
                    return false;
                }
                if (phone && !Utils.validatePhone(phone)) {
                    Swal.showValidationMessage('<i class="fas fa-exclamation-circle mr-2"></i>Please enter a valid 10-digit phone number');
                    return false;
                }
                
                return {
                    type: document.querySelector('input[name="edit-addr-type"]:checked')?.value || 'home',
                    street,
                    area: document.getElementById('edit-area').value.trim(),
                    city,
                    state,
                    zip,
                    phone,
                    landmark: document.getElementById('edit-landmark').value.trim()
                };
            }
        });
        
        if (formValues) {
            UserModel.updateAddress(address.id, formValues);
            refreshUser();
            showToast('Address updated successfully!', 'success');
        }
    };
    
    // Add Address Modal with PIN code lookup
    const showAddAddressModal = async () => {
        const { value: formValues } = await Swal.fire({
            title: '<i class="fas fa-map-marker-alt text-green-600 mr-2"></i> Add New Address',
            html: `
                <div class="space-y-4 text-left animate-fade-in">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                        <div class="flex gap-3">
                            <label class="flex-1 cursor-pointer">
                                <input type="radio" name="addr-type" value="home" class="hidden peer" checked>
                                <div class="border-2 rounded-lg p-3 text-center peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all hover:border-gray-300">
                                    <i class="fas fa-home text-xl mb-1 text-blue-600"></i>
                                    <p class="text-sm font-medium">Home</p>
                                </div>
                            </label>
                            <label class="flex-1 cursor-pointer">
                                <input type="radio" name="addr-type" value="work" class="hidden peer">
                                <div class="border-2 rounded-lg p-3 text-center peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all hover:border-gray-300">
                                    <i class="fas fa-building text-xl mb-1 text-purple-600"></i>
                                    <p class="text-sm font-medium">Work</p>
                                </div>
                            </label>
                            <label class="flex-1 cursor-pointer">
                                <input type="radio" name="addr-type" value="other" class="hidden peer">
                                <div class="border-2 rounded-lg p-3 text-center peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all hover:border-gray-300">
                                    <i class="fas fa-map-marker-alt text-xl mb-1 text-orange-600"></i>
                                    <p class="text-sm font-medium">Other</p>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            PIN Code <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                            <input id="addr-zip" class="input" placeholder="Enter 6-digit PIN code" maxlength="6" 
                                oninput="
                                    const pin = this.value;
                                    const loader = document.getElementById('pin-loader');
                                    const cityField = document.getElementById('addr-city');
                                    const stateField = document.getElementById('addr-state');
                                    const areaField = document.getElementById('addr-area');
                                    const pinStatus = document.getElementById('pin-status');
                                    
                                    if (pin.length === 6 && /^[1-9][0-9]{5}$/.test(pin)) {
                                        loader.classList.remove('hidden');
                                        pinStatus.innerHTML = '';
                                        
                                        fetch('https://api.postalpincode.in/pincode/' + pin)
                                            .then(res => res.json())
                                            .then(data => {
                                                loader.classList.add('hidden');
                                                if (data[0].Status === 'Success' && data[0].PostOffice) {
                                                    const po = data[0].PostOffice[0];
                                                    cityField.value = po.District;
                                                    stateField.value = po.State;
                                                    areaField.value = po.Name;
                                                    pinStatus.innerHTML = '<span class=\\'text-green-600\\'><i class=\\'fas fa-check-circle mr-1\\'></i>' + po.Name + ', ' + po.District + '</span>';
                                                } else {
                                                    pinStatus.innerHTML = '<span class=\\'text-red-600\\'><i class=\\'fas fa-times-circle mr-1\\'></i>Invalid PIN code</span>';
                                                }
                                            })
                                            .catch(() => {
                                                loader.classList.add('hidden');
                                                pinStatus.innerHTML = '<span class=\\'text-yellow-600\\'><i class=\\'fas fa-exclamation-circle mr-1\\'></i>Enter city manually</span>';
                                            });
                                    }
                                ">
                            <div id="pin-loader" class="hidden absolute right-3 top-1/2 -translate-y-1/2">
                                <i class="fas fa-spinner fa-spin text-blue-600"></i>
                            </div>
                        </div>
                        <p id="pin-status" class="text-xs mt-1"></p>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Street Address <span class="text-red-500">*</span>
                        </label>
                        <input id="addr-street" class="input" placeholder="House No., Building, Street Name">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Area/Locality</label>
                        <input id="addr-area" class="input" placeholder="Area, Locality (auto-filled from PIN)">
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                City <span class="text-red-500">*</span>
                            </label>
                            <input id="addr-city" class="input bg-gray-50" placeholder="City (auto-filled)" readonly>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                State <span class="text-red-500">*</span>
                            </label>
                            <input id="addr-state" class="input bg-gray-50" placeholder="State (auto-filled)" readonly>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number <span class="text-red-500">*</span>
                        </label>
                        <input id="addr-phone" class="input" placeholder="10-digit mobile number" maxlength="10">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
                        <input id="addr-landmark" class="input" placeholder="Nearby landmark for easy delivery">
                    </div>
                </div>
            `,
            confirmButtonText: '<i class="fas fa-save mr-2"></i> Save Address',
            confirmButtonColor: '#10b981',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            showClass: { popup: 'animate-zoom-in' },
            preConfirm: () => {
                const zip = document.getElementById('addr-zip').value.trim();
                const street = document.getElementById('addr-street').value.trim();
                const city = document.getElementById('addr-city').value.trim();
                const state = document.getElementById('addr-state').value.trim();
                const phone = document.getElementById('addr-phone').value.trim();
                
                if (!Utils.validatePinCode(zip)) {
                    Swal.showValidationMessage('<i class="fas fa-exclamation-circle mr-2"></i>Please enter a valid 6-digit PIN code');
                    return false;
                }
                if (!street || street.length < 5) {
                    Swal.showValidationMessage('<i class="fas fa-exclamation-circle mr-2"></i>Please enter a complete street address');
                    return false;
                }
                if (!city) {
                    Swal.showValidationMessage('<i class="fas fa-exclamation-circle mr-2"></i>City is required - enter PIN code to auto-fill');
                    return false;
                }
                if (!state) {
                    Swal.showValidationMessage('<i class="fas fa-exclamation-circle mr-2"></i>State is required - enter PIN code to auto-fill');
                    return false;
                }
                if (!Utils.validatePhone(phone)) {
                    Swal.showValidationMessage('<i class="fas fa-exclamation-circle mr-2"></i>Please enter a valid 10-digit phone number');
                    return false;
                }
                
                return {
                    type: document.querySelector('input[name="addr-type"]:checked')?.value || 'home',
                    street,
                    area: document.getElementById('addr-area').value.trim(),
                    city,
                    state,
                    zip,
                    phone,
                    landmark: document.getElementById('addr-landmark').value.trim()
                };
            }
        });
        
        if (formValues) {
            UserModel.addAddress(formValues);
            refreshUser();
            showToast('Address added successfully!', 'success');
        }
    };
    
    // Delete Address
    const deleteAddress = async (id) => {
        const confirmed = await showConfirm('Delete Address?', 'This cannot be undone.');
        if (confirmed) {
            UserModel.deleteAddress(id);
            refreshUser();
            showToast('Address deleted');
        }
    };
    
    // Handle Logout
    const handleLogout = async () => {
        const confirmed = await showConfirm('Logout?', 'Are you sure you want to logout?');
        if (confirmed) {
            logout();
            goHome();
        }
    };
    
    // If not logged in, show login prompt
    if (!isAuthenticated) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center animate-fade-in">
                    <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="fas fa-user text-4xl text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Slice & Code</h2>
                    <p className="text-gray-500 mb-6">Login to view your profile, orders, and more</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button onClick={showLoginModal} className="btn btn-blue">
                            <i className="fas fa-sign-in-alt mr-2" />
                            Login / Sign Up
                        </button>
                        <button onClick={goHome} className="btn btn-outline">
                            <i className="fas fa-home mr-2" />
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    // Get user data
    const orders = OrderModel.getByUser(user.email);
    const wishlistIds = WishlistModel.get();
    const wishlistPizzas = PizzaModel.getAll().filter(p => wishlistIds.includes(p.id));
    const addresses = user.addresses || [];
    
    // Menu items
    const menuItems = [
        { id: 'orders', label: 'My Orders', icon: 'fa-box', color: 'blue', desc: 'Track, return, or buy again' },
        { id: 'wishlist', label: 'Wishlist', icon: 'fa-heart', color: 'pink', desc: 'Your saved items' },
        { id: 'addresses', label: 'Manage Addresses', icon: 'fa-map-marker-alt', color: 'green', desc: 'Saved delivery addresses' },
        { id: 'payments', label: 'Payments', icon: 'fa-credit-card', color: 'purple', desc: 'Cards, UPI & more' },
        { id: 'settings', label: 'Settings', icon: 'fa-cog', color: 'gray', desc: 'Notifications & privacy' }
    ];
    
    // Tab Content Renderer
    const renderTabContent = () => {
        switch (activeTab) {
            case 'orders':
                return (
                    <div className="profile-section animate-fade-in">
                        <div className="profile-section-header">
                            <h2 className="profile-section-title">
                                <i className="fas fa-box text-blue-600" />
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
                                action={goHome}
                                actionText="Browse Menu"
                            />
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {orders.map(order => (
                                    <div key={order.id} className="order-card">
                                        <div className="flex items-start space-x-4">
                                            <div className="h-16 w-16 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <i className="fas fa-pizza-slice text-2xl text-orange-400" />
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
                    <div className="profile-section animate-fade-in" key={refreshKey}>
                        <div className="profile-section-header">
                            <h2 className="profile-section-title">
                                <i className="fas fa-heart text-pink-600" />
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
                                action={goHome}
                                actionText="Browse Menu"
                            />
                        ) : (
                            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {wishlistPizzas.map(pizza => (
                                    <WishlistCard 
                                        key={pizza.id} 
                                        pizza={pizza} 
                                        onRemove={forceRefresh}
                                    />
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
                                <i className="fas fa-map-marker-alt text-green-600" />
                                Manage Addresses
                            </h2>
                            <button onClick={showAddAddressModal} className="btn btn-blue text-sm">
                                <i className="fas fa-plus mr-2" />Add New
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
                                {addresses.map((addr, idx) => (
                                    <div 
                                        key={addr.id} 
                                        className="address-card hover-lift animate-fade-in"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                addr.type === 'work' ? 'bg-purple-100' : addr.type === 'other' ? 'bg-orange-100' : 'bg-blue-100'
                                            }`}>
                                                <i className={`fas fa-${addr.type === 'work' ? 'building' : addr.type === 'other' ? 'map-marker-alt' : 'home'} ${
                                                    addr.type === 'work' ? 'text-purple-600' : addr.type === 'other' ? 'text-orange-600' : 'text-blue-600'
                                                }`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-gray-900 capitalize">{addr.type || 'Home'}</h4>
                                                    {idx === 0 && (
                                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">{addr.street}</p>
                                                <p className="text-sm text-gray-500">{addr.city}, {addr.state} {addr.zip}</p>
                                                {addr.landmark && (
                                                    <p className="text-sm text-gray-400 mt-1">
                                                        <i className="fas fa-landmark mr-1" />Near: {addr.landmark}
                                                    </p>
                                                )}
                                                {addr.phone && (
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        <i className="fas fa-phone mr-1" />{addr.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex space-x-3 mt-4 pt-4 border-t border-gray-100">
                                            <button 
                                                onClick={() => showEditAddressModal(addr)}
                                                className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                            >
                                                <i className="fas fa-edit mr-1" />
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => deleteAddress(addr.id)}
                                                className="flex items-center text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
                                            >
                                                <i className="fas fa-trash mr-1" />
                                                Delete
                                            </button>
                                            {idx !== 0 && (
                                                <button 
                                                    onClick={() => {
                                                        // Move to top (set as default)
                                                        const user = UserModel.get();
                                                        const newAddresses = [addr, ...user.addresses.filter(a => a.id !== addr.id)];
                                                        UserModel.update({ addresses: newAddresses });
                                                        refreshUser();
                                                        showToast('Set as default address!');
                                                    }}
                                                    className="flex items-center text-sm text-green-600 hover:text-green-800 font-medium transition-colors"
                                                >
                                                    <i className="fas fa-star mr-1" />
                                                    Set Default
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
                
            case 'payments':
                return (
                    <div className="space-y-4 animate-fade-in">
                        <div className="profile-section hover-lift">
                            <div className="profile-section-header">
                                <h2 className="profile-section-title">
                                    <i className="fas fa-credit-card text-purple-600" />
                                    Payment Methods
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
                                        <i className="fas fa-credit-card mr-2 text-gray-400" />
                                        Saved Cards
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { type: 'visa', last4: '4242', expiry: '12/26', color: 'from-blue-600 to-blue-800' },
                                            { type: 'mastercard', last4: '8888', expiry: '03/25', color: 'from-red-500 to-orange-500' }
                                        ].map((card, idx) => (
                                            <div 
                                                key={idx}
                                                className="border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-300 hover:shadow-md transition-all animate-fade-in"
                                                style={{ animationDelay: `${idx * 100}ms` }}
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className={`h-12 w-20 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center shadow-lg`}>
                                                        <i className={`fab fa-cc-${card.type} text-white text-2xl`} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">•••• •••• •••• {card.last4}</p>
                                                        <p className="text-sm text-gray-500">Expires {card.expiry}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => showToast('Card set as default', 'success')}
                                                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Set as default"
                                                    >
                                                        <i className="fas fa-star" />
                                                    </button>
                                                    <button 
                                                        onClick={async () => {
                                                            const confirmed = await showConfirm('Remove Card?', 'This card will be removed from your account.');
                                                            if (confirmed) showToast('Card removed successfully');
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <i className="fas fa-trash" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={async () => {
                                        await Swal.fire({
                                            title: '<i class="fas fa-credit-card text-blue-600 mr-2"></i> Add New Card',
                                            html: `
                                                <div class="space-y-4 text-left animate-fade-in">
                                                    <div>
                                                        <label class="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                                        <div class="relative">
                                                            <input id="card-number" class="input pl-12" placeholder="1234 5678 9012 3456" maxlength="19">
                                                            <i class="fab fa-cc-visa absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
                                                        </div>
                                                    </div>
                                                    <div class="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label class="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                                            <input id="card-expiry" class="input" placeholder="MM/YY" maxlength="5">
                                                        </div>
                                                        <div>
                                                            <label class="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                                            <input id="card-cvv" type="password" class="input" placeholder="•••" maxlength="4">
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label class="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                                                        <input id="card-name" class="input" placeholder="Name on card">
                                                    </div>
                                                    <div class="flex items-center gap-2 text-sm text-gray-500">
                                                        <i class="fas fa-lock text-green-600"></i>
                                                        <span>Your card details are encrypted and secure</span>
                                                    </div>
                                                </div>
                                            `,
                                            confirmButtonText: '<i class="fas fa-plus mr-2"></i> Add Card',
                                            confirmButtonColor: '#2874f0',
                                            showCancelButton: true,
                                            showClass: { popup: 'animate-zoom-in' }
                                        });
                                    }}
                                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium group"
                                >
                                    <i className="fas fa-plus mr-2 group-hover:rotate-90 transition-transform" />Add New Card
                                </button>
                            </div>
                        </div>
                        
                        <div className="profile-section hover-lift">
                            <div className="profile-section-header">
                                <h2 className="profile-section-title">
                                    <i className="fas fa-wallet text-green-600" />
                                    UPI
                                </h2>
                            </div>
                            <div className="p-6 space-y-3">
                                <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-green-300 transition-all">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                                            <i className="fas fa-mobile-alt text-green-600 text-xl" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">user@upi</p>
                                            <p className="text-sm text-gray-500">Primary UPI ID</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Default</span>
                                        <button 
                                            onClick={async () => {
                                                const confirmed = await showConfirm('Remove UPI?', 'This UPI ID will be removed.');
                                                if (confirmed) showToast('UPI removed');
                                            }}
                                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                                        >
                                            <i className="fas fa-trash" />
                                        </button>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={async () => {
                                        const { value: upiId } = await Swal.fire({
                                            title: '<i class="fas fa-wallet text-green-600 mr-2"></i> Add UPI ID',
                                            html: `
                                                <div class="space-y-4 text-left animate-fade-in">
                                                    <div class="flex justify-center gap-4 mb-4">
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" class="h-8" alt="UPI">
                                                    </div>
                                                    <div>
                                                        <label class="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                                                        <input id="upi-id" class="input" placeholder="yourname@upi">
                                                    </div>
                                                    <p class="text-xs text-gray-500">
                                                        <i class="fas fa-info-circle mr-1"></i>
                                                        Enter your UPI ID (e.g., name@paytm, name@gpay)
                                                    </p>
                                                </div>
                                            `,
                                            confirmButtonText: '<i class="fas fa-check mr-2"></i> Verify & Add',
                                            confirmButtonColor: '#10b981',
                                            showCancelButton: true,
                                            showClass: { popup: 'animate-zoom-in' }
                                        });
                                        
                                        if (upiId) showToast('UPI ID added successfully!');
                                    }}
                                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-green-400 hover:text-green-600 hover:bg-green-50 transition-all font-medium"
                                >
                                    <i className="fas fa-plus mr-2" />Add UPI ID
                                </button>
                            </div>
                        </div>
                        
                        <div className="profile-section hover-lift">
                            <div className="profile-section-header">
                                <h2 className="profile-section-title">
                                    <i className="fas fa-coins text-yellow-500" />
                                    Wallet & Rewards
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white shadow-lg">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-yellow-100 text-sm">Available Balance</p>
                                            <p className="text-3xl font-bold">$25.00</p>
                                        </div>
                                        <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center">
                                            <i className="fas fa-wallet text-3xl" />
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="flex-1 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors">
                                            <i className="fas fa-plus mr-2" />Add Money
                                        </button>
                                        <button className="flex-1 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors">
                                            <i className="fas fa-history mr-2" />History
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="mt-4 p-4 bg-purple-50 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                <i className="fas fa-star text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Loyalty Points</p>
                                                <p className="text-sm text-gray-500">150 points = $1.50 off</p>
                                            </div>
                                        </div>
                                        <span className="text-2xl font-bold text-purple-600">150</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
                
            case 'settings':
                return (
                    <div className="space-y-4 animate-fade-in">
                        <div className="profile-section hover-lift">
                            <div className="profile-section-header">
                                <h2 className="profile-section-title">
                                    <i className="fas fa-bell text-yellow-500" />
                                    Notifications
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                {[
                                    { id: 'order-updates', label: 'Order Updates', desc: 'Get notified about your order status', icon: 'fa-box', color: 'blue' },
                                    { id: 'promo-emails', label: 'Promotional Emails', desc: 'Receive offers and discounts', icon: 'fa-tags', color: 'green' },
                                    { id: 'sms-alerts', label: 'SMS Alerts', desc: 'Delivery notifications via SMS', icon: 'fa-sms', color: 'purple' },
                                    { id: 'push-notif', label: 'Push Notifications', desc: 'Real-time updates on your device', icon: 'fa-mobile-alt', color: 'orange' }
                                ].map((item, idx) => (
                                    <div 
                                        key={item.id} 
                                        className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 animate-fade-in"
                                        style={{ animationDelay: `${idx * 50}ms` }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-full bg-${item.color}-100 flex items-center justify-center`}>
                                                <i className={`fas ${item.icon} text-${item.color}-600`} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{item.label}</p>
                                                <p className="text-sm text-gray-500">{item.desc}</p>
                                            </div>
                                        </div>
                                        <label className="toggle">
                                            <input 
                                                type="checkbox" 
                                                defaultChecked={item.id === 'order-updates' || item.id === 'sms-alerts'}
                                                onChange={(e) => {
                                                    showToast(e.target.checked ? `${item.label} enabled` : `${item.label} disabled`, 'info');
                                                }}
                                            />
                                            <span className="toggle-slider" />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="profile-section hover-lift">
                            <div className="profile-section-header">
                                <h2 className="profile-section-title">
                                    <i className="fas fa-shield-alt text-green-600" />
                                    Privacy & Security
                                </h2>
                            </div>
                            <div className="p-6 space-y-3">
                                <button 
                                    onClick={showChangePasswordModal}
                                    className="w-full flex items-center justify-between py-4 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all hover:translate-x-1 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                            <i className="fas fa-lock text-blue-600" />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-medium text-gray-700 block">Change Password</span>
                                            <span className="text-xs text-gray-400">Last changed 30 days ago</span>
                                        </div>
                                    </div>
                                    <i className="fas fa-chevron-right text-gray-400 group-hover:text-blue-600 transition-colors" />
                                </button>
                                
                                <button 
                                    onClick={showForgotPasswordModal}
                                    className="w-full flex items-center justify-between py-4 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all hover:translate-x-1 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                                            <i className="fas fa-key text-orange-600" />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-medium text-gray-700 block">Forgot Password</span>
                                            <span className="text-xs text-gray-400">Reset via email link</span>
                                        </div>
                                    </div>
                                    <i className="fas fa-chevron-right text-gray-400 group-hover:text-orange-600 transition-colors" />
                                </button>
                                
                                <button 
                                    onClick={async () => {
                                        const { value: enable } = await Swal.fire({
                                            title: '<i class="fas fa-shield-alt text-purple-600 mr-2"></i> Two-Factor Authentication',
                                            html: `
                                                <div class="text-left space-y-4 animate-fade-in">
                                                    <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                                        <p class="text-sm text-purple-700">
                                                            <i class="fas fa-info-circle mr-2"></i>
                                                            Add an extra layer of security to your account by requiring a verification code in addition to your password.
                                                        </p>
                                                    </div>
                                                    <div class="space-y-3">
                                                        <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                                            <input type="radio" name="2fa-method" value="sms" checked>
                                                            <i class="fas fa-sms text-blue-600 text-xl"></i>
                                                            <div>
                                                                <p class="font-medium">SMS Verification</p>
                                                                <p class="text-xs text-gray-500">Receive code via text message</p>
                                                            </div>
                                                        </label>
                                                        <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                                            <input type="radio" name="2fa-method" value="app">
                                                            <i class="fas fa-mobile-alt text-green-600 text-xl"></i>
                                                            <div>
                                                                <p class="font-medium">Authenticator App</p>
                                                                <p class="text-xs text-gray-500">Use Google Authenticator or similar</p>
                                                            </div>
                                                        </label>
                                                    </div>
                                                </div>
                                            `,
                                            confirmButtonText: '<i class="fas fa-check mr-2"></i> Enable 2FA',
                                            confirmButtonColor: '#8b5cf6',
                                            showCancelButton: true,
                                            showClass: { popup: 'animate-zoom-in' }
                                        });
                                        
                                        if (enable) {
                                            showToast('Two-Factor Authentication enabled!', 'success');
                                        }
                                    }}
                                    className="w-full flex items-center justify-between py-4 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all hover:translate-x-1 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                            <i className="fas fa-shield-alt text-purple-600" />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-medium text-gray-700 block">Two-Factor Authentication</span>
                                            <span className="text-xs text-gray-400">Currently disabled</span>
                                        </div>
                                    </div>
                                    <i className="fas fa-chevron-right text-gray-400 group-hover:text-purple-600 transition-colors" />
                                </button>
                                
                                <button 
                                    onClick={async () => {
                                        const confirmed = await Swal.fire({
                                            title: '<i class="fas fa-exclamation-triangle text-red-600 mr-2"></i> Delete Account?',
                                            html: `
                                                <div class="text-left space-y-4 animate-fade-in">
                                                    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                                                        <p class="text-sm text-red-700 font-medium">
                                                            <i class="fas fa-warning mr-2"></i>
                                                            This action is permanent and cannot be undone!
                                                        </p>
                                                    </div>
                                                    <p class="text-gray-600">Deleting your account will:</p>
                                                    <ul class="text-sm text-gray-500 space-y-2 ml-4">
                                                        <li><i class="fas fa-times text-red-500 mr-2"></i>Remove all your personal data</li>
                                                        <li><i class="fas fa-times text-red-500 mr-2"></i>Delete your order history</li>
                                                        <li><i class="fas fa-times text-red-500 mr-2"></i>Cancel any pending orders</li>
                                                        <li><i class="fas fa-times text-red-500 mr-2"></i>Remove saved addresses & payment methods</li>
                                                    </ul>
                                                    <div class="mt-4">
                                                        <label class="block text-sm font-medium text-gray-700 mb-1">Type "DELETE" to confirm:</label>
                                                        <input id="delete-confirm" class="input" placeholder="Type DELETE">
                                                    </div>
                                                </div>
                                            `,
                                            confirmButtonText: '<i class="fas fa-trash mr-2"></i> Delete My Account',
                                            confirmButtonColor: '#ef4444',
                                            showCancelButton: true,
                                            cancelButtonText: 'Keep My Account',
                                            showClass: { popup: 'animate-zoom-in' },
                                            preConfirm: () => {
                                                const input = document.getElementById('delete-confirm').value;
                                                if (input !== 'DELETE') {
                                                    Swal.showValidationMessage('Please type DELETE to confirm');
                                                    return false;
                                                }
                                                return true;
                                            }
                                        });
                                        
                                        if (confirmed.isConfirmed) {
                                            logout();
                                            goHome();
                                            showToast('Account deleted successfully');
                                        }
                                    }}
                                    className="w-full flex items-center justify-between py-4 px-4 bg-red-50 rounded-lg hover:bg-red-100 transition-all hover:translate-x-1 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                                            <i className="fas fa-trash-alt text-red-600" />
                                        </div>
                                        <div className="text-left">
                                            <span className="font-medium text-red-600 block">Delete Account</span>
                                            <span className="text-xs text-red-400">Permanently remove your data</span>
                                        </div>
                                    </div>
                                    <i className="fas fa-chevron-right text-red-400 group-hover:text-red-600 transition-colors" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="profile-section hover-lift">
                            <div className="profile-section-header">
                                <h2 className="profile-section-title">
                                    <i className="fas fa-info-circle text-blue-500" />
                                    About
                                </h2>
                            </div>
                            <div className="p-6 space-y-3">
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-gray-600">App Version</span>
                                    <span className="font-medium text-gray-900">2.0.1</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-gray-600">Last Updated</span>
                                    <span className="font-medium text-gray-900">Jan 15, 2025</span>
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <button className="flex-1 py-2 px-4 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                                        <i className="fas fa-file-alt mr-2" />Terms of Service
                                    </button>
                                    <button className="flex-1 py-2 px-4 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                                        <i className="fas fa-user-shield mr-2" />Privacy Policy
                                    </button>
                                </div>
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
                    {/* Hidden trigger for forgot password */}
                    <button id="forgot-password-trigger" onClick={showForgotPasswordModal} className="hidden" />
                    
                    {/* Sidebar */}
                    <div className="profile-sidebar">
                        {/* Profile Header Card */}
                        <div className="profile-header-card hover-lift animate-fade-in">
                            <div className="profile-header-banner relative overflow-hidden">
                                {/* Animated background circles */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse-slow" />
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse-slow animate-delay-200" />
                                
                                <div className="flex items-center space-x-4 relative z-10">
                                    <div className="profile-avatar animate-float">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-2xl font-bold">{Utils.getInitials(user.name)}</span>
                                        )}
                                        {/* Online indicator */}
                                        <span className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-blue-100 text-xs flex items-center">
                                            <i className="fas fa-hand-wave mr-1 animate-bounce" /> Hello,
                                        </p>
                                        <h2 className="font-bold text-lg truncate">{user.name}</h2>
                                        <p className="text-blue-200 text-xs truncate flex items-center">
                                            <i className="fas fa-envelope mr-1" />{user.email}
                                        </p>
                                        {user.phone && (
                                            <p className="text-blue-200 text-xs truncate flex items-center mt-0.5">
                                                <i className="fas fa-phone mr-1" />{user.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Member badge */}
                                <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 animate-slide-in-right">
                                    <i className="fas fa-crown" />
                                    Member
                                </div>
                            </div>
                            <div className="flex border-t border-gray-100">
                                <button 
                                    onClick={showEditProfileModal}
                                    className="flex-1 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <i className="fas fa-edit" />Edit Profile
                                </button>
                                <div className="w-px bg-gray-100" />
                                <button 
                                    onClick={showChangePasswordModal}
                                    className="flex-1 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <i className="fas fa-lock" />Security
                                </button>
                            </div>
                        </div>
                        
                        {/* Navigation Menu */}
                        <div className="profile-menu">
                            {menuItems.map(item => (
                                <button 
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`profile-menu-item ${activeTab === item.id ? 'active' : ''}`}
                                >
                                    <div className={`profile-menu-icon bg-${item.color}-50`}>
                                        <i className={`fas ${item.icon} text-${item.color}-600`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{item.label}</p>
                                        <p className="text-xs text-gray-400">{item.desc}</p>
                                    </div>
                                    <i className="fas fa-chevron-right text-gray-300 text-xs" />
                                </button>
                            ))}
                            
                            <div className="border-t border-gray-100">
                                <button onClick={handleLogout} className="profile-menu-item logout">
                                    <div className="profile-menu-icon bg-red-50">
                                        <i className="fas fa-sign-out-alt text-red-500" />
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
// CHECKOUT PAGE
// ==========================================
const CheckoutPage = () => {
    const { items, total, clearCart } = useCart();
    const { user, isAuthenticated, login } = useAuth();
    const { navigate, goHome } = useRouter();
    const [loading, setLoading] = useState(false);
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);
    const [address, setAddress] = useState('');
    const [selectedAddressId, setSelectedAddressId] = useState('');
    
    // Redirect if cart is empty
    useEffect(() => {
        if (items.length === 0) {
            goHome();
        }
    }, [items, goHome]);
    
    // Show login modal if not authenticated
    const showLoginForCheckout = async () => {
        const { value: formValues } = await Swal.fire({
            title: '',
            html: `
                <div class="space-y-5 text-left animate-fade-in">
                    <div class="text-center mb-6">
                        <div class="h-20 w-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
                            <i class="fas fa-user-lock text-white text-3xl"></i>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-900">Login Required</h2>
                        <p class="text-gray-500 mt-1">Please login to place your order</p>
                    </div>
                    
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                        <p class="text-sm text-yellow-700">
                            <i class="fas fa-info-circle mr-2"></i>
                            We need your contact details to deliver your delicious pizza!
                        </p>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            <i class="fas fa-user mr-2 text-gray-400"></i>Full Name <span class="text-red-500">*</span>
                        </label>
                        <input id="checkout-name" class="input" placeholder="Enter your full name" required>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            <i class="fas fa-envelope mr-2 text-gray-400"></i>Email Address <span class="text-red-500">*</span>
                        </label>
                        <input id="checkout-email" type="email" class="input" placeholder="your.email@gmail.com" required>
                        <p class="text-xs text-gray-400 mt-1">Order confirmation will be sent here</p>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            <i class="fas fa-phone mr-2 text-gray-400"></i>Phone Number <span class="text-red-500">*</span>
                        </label>
                        <input id="checkout-phone" type="tel" class="input" placeholder="10-digit mobile number" maxlength="10" required>
                        <p class="text-xs text-gray-400 mt-1">Delivery updates will be sent via SMS</p>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            <i class="fas fa-lock mr-2 text-gray-400"></i>Create Password <span class="text-red-500">*</span>
                        </label>
                        <input id="checkout-password" type="password" class="input" placeholder="Min 6 characters" required>
                    </div>
                </div>
            `,
            confirmButtonText: '<i class="fas fa-sign-in-alt mr-2"></i> Login & Continue',
            confirmButtonColor: '#ff6b35',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            showClass: { popup: 'animate-zoom-in' },
            preConfirm: () => {
                const name = document.getElementById('checkout-name').value.trim();
                const email = document.getElementById('checkout-email').value.trim();
                const phone = document.getElementById('checkout-phone').value.trim();
                const password = document.getElementById('checkout-password').value;
                
                if (!name || name.length < 2) {
                    Swal.showValidationMessage('<i class="fas fa-exclamation-circle mr-2"></i>Please enter your full name');
                    return false;
                }
                if (!Utils.validateEmail(email)) {
                    Swal.showValidationMessage('<i class="fas fa-exclamation-circle mr-2"></i>Please enter a valid email (e.g., name@gmail.com)');
                    return false;
                }
                if (!Utils.validatePhone(phone)) {
                    Swal.showValidationMessage('<i class="fas fa-exclamation-circle mr-2"></i>Please enter a valid 10-digit phone number');
                    return false;
                }
                if (!password || password.length < 6) {
                    Swal.showValidationMessage('<i class="fas fa-exclamation-circle mr-2"></i>Password must be at least 6 characters');
                    return false;
                }
                
                return { name, email, phone };
            }
        });
        
        if (formValues) {
            await login(formValues);
            showToast('Welcome, ' + formValues.name + '! Please add your delivery address.', 'success');
        }
    };
    
    // Show add address modal for checkout
    const showAddAddressForCheckout = async () => {
        const { value: formValues } = await Swal.fire({
            title: '<i class="fas fa-map-marker-alt text-orange-500 mr-2"></i> Add Delivery Address',
            html: `
                <div class="space-y-4 text-left animate-fade-in">
                    <div class="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                        <p class="text-sm text-orange-700">
                            <i class="fas fa-truck mr-2"></i>
                            Add your delivery address to complete the order
                        </p>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            PIN Code <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                            <input id="new-addr-zip" class="input" placeholder="Enter 6-digit PIN code" maxlength="6" 
                                oninput="
                                    const pin = this.value;
                                    const loader = document.getElementById('new-pin-loader');
                                    const cityField = document.getElementById('new-addr-city');
                                    const stateField = document.getElementById('new-addr-state');
                                    const areaField = document.getElementById('new-addr-area');
                                    const pinStatus = document.getElementById('new-pin-status');
                                    
                                    if (pin.length === 6 && /^[1-9][0-9]{5}$/.test(pin)) {
                                        loader.classList.remove('hidden');
                                        pinStatus.innerHTML = '<span class=\\'text-blue-600\\'><i class=\\'fas fa-spinner fa-spin mr-1\\'></i>Fetching location...</span>';
                                        
                                        fetch('https://api.postalpincode.in/pincode/' + pin)
                                            .then(res => res.json())
                                            .then(data => {
                                                loader.classList.add('hidden');
                                                if (data[0].Status === 'Success' && data[0].PostOffice) {
                                                    const po = data[0].PostOffice[0];
                                                    cityField.value = po.District;
                                                    stateField.value = po.State;
                                                    areaField.value = po.Name;
                                                    pinStatus.innerHTML = '<span class=\\'text-green-600\\'><i class=\\'fas fa-check-circle mr-1\\'></i>Found: ' + po.Name + ', ' + po.District + ', ' + po.State + '</span>';
                                                } else {
                                                    pinStatus.innerHTML = '<span class=\\'text-red-600\\'><i class=\\'fas fa-times-circle mr-1\\'></i>Invalid PIN code. Please check and try again.</span>';
                                                    cityField.value = '';
                                                    stateField.value = '';
                                                }
                                            })
                                            .catch(() => {
                                                loader.classList.add('hidden');
                                                pinStatus.innerHTML = '<span class=\\'text-yellow-600\\'><i class=\\'fas fa-exclamation-circle mr-1\\'></i>Could not fetch. Please enter city manually.</span>';
                                                cityField.readOnly = false;
                                                stateField.readOnly = false;
                                            });
                                    }
                                ">
                            <div id="new-pin-loader" class="hidden absolute right-3 top-1/2 -translate-y-1/2">
                                <i class="fas fa-spinner fa-spin text-blue-600"></i>
                            </div>
                        </div>
                        <p id="new-pin-status" class="text-xs mt-1"></p>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Complete Address <span class="text-red-500">*</span>
                        </label>
                        <textarea id="new-addr-street" class="input min-h-[80px]" placeholder="House No., Building Name, Street, Area"></textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Area/Locality</label>
                        <input id="new-addr-area" class="input" placeholder="Area (auto-filled from PIN)">
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">City <span class="text-red-500">*</span></label>
                            <input id="new-addr-city" class="input bg-gray-50" placeholder="Auto-filled" readonly>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">State <span class="text-red-500">*</span></label>
                            <input id="new-addr-state" class="input bg-gray-50" placeholder="Auto-filled" readonly>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
                        <input id="new-addr-landmark" class="input" placeholder="Near temple, opposite mall, etc.">
                    </div>
                </div>
            `,
            confirmButtonText: '<i class="fas fa-check mr-2"></i> Save & Continue',
            confirmButtonColor: '#ff6b35',
            showCancelButton: true,
            showClass: { popup: 'animate-zoom-in' },
            preConfirm: () => {
                const zip = document.getElementById('new-addr-zip').value.trim();
                const street = document.getElementById('new-addr-street').value.trim();
                const city = document.getElementById('new-addr-city').value.trim();
                const state = document.getElementById('new-addr-state').value.trim();
                
                if (!Utils.validatePinCode(zip)) {
                    Swal.showValidationMessage('<i class="fas fa-exclamation-circle mr-2"></i>Please enter a valid 6-digit PIN code');
                    return false;
                }
                if (!street || street.length < 10) {
                    Swal.showValidationMessage('<i class="fas fa-exclamation-circle mr-2"></i>Please enter a complete address (min 10 characters)');
                    return false;
                }
                if (!city) {
                    Swal.showValidationMessage('<i class="fas fa-exclamation-circle mr-2"></i>City is required');
                    return false;
                }
                if (!state) {
                    Swal.showValidationMessage('<i class="fas fa-exclamation-circle mr-2"></i>State is required');
                    return false;
                }
                
                return {
                    type: 'home',
                    street,
                    area: document.getElementById('new-addr-area').value.trim(),
                    city,
                    state,
                    zip,
                    phone: user?.phone || '',
                    landmark: document.getElementById('new-addr-landmark').value.trim()
                };
            }
        });
        
        if (formValues) {
            UserModel.addAddress(formValues);
            const updatedUser = UserModel.get();
            setAddress(`${formValues.street}, ${formValues.area}, ${formValues.city}, ${formValues.state} - ${formValues.zip}`);
            setSelectedAddressId(formValues.id);
            showToast('Address saved! You can now place your order.', 'success');
        }
    };
    
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
        // Check if user is logged in
        if (!isAuthenticated) {
            showToast('Please login to place your order', 'error');
            showLoginForCheckout();
            return;
        }
        
        // Check if address is selected
        if (!address && (!user?.addresses || user.addresses.length === 0)) {
            showToast('Please add a delivery address', 'error');
            showAddAddressForCheckout();
            return;
        }
        
        // Get selected address or first address
        const deliveryAddress = address || 
            `${user.addresses[0].street}, ${user.addresses[0].area || ''}, ${user.addresses[0].city}, ${user.addresses[0].state} - ${user.addresses[0].zip}`;
        
        setLoading(true);
        await Utils.delay(1500);
        
        const order = {
            id: Utils.generateId(),
            userEmail: user.email,
            userName: user.name,
            userPhone: user.phone,
            items: items,
            total: total - discount,
            discount,
            coupon: coupon.toUpperCase(),
            status: ORDER_STATUS.PENDING,
            address: deliveryAddress,
            date: new Date().toISOString()
        };
        
        OrderModel.create(order);
        clearCart();
        setLoading(false);
        
        await Swal.fire({
            icon: 'success',
            title: '🎉 Order Placed Successfully!',
            html: `
                <div class="text-left space-y-3">
                    <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p class="text-sm text-green-700">
                            <i class="fas fa-check-circle mr-2"></i>
                            Your order has been confirmed!
                        </p>
                    </div>
                    <p><strong>Order ID:</strong> <span class="font-mono bg-gray-100 px-2 py-1 rounded">${order.id}</span></p>
                    <p><strong>Total Amount:</strong> <span class="text-green-600 font-bold">${Utils.formatCurrency(order.total)}</span></p>
                    ${discount > 0 ? `<p class="text-green-600"><i class="fas fa-tag mr-1"></i>You saved ${Utils.formatCurrency(discount)}!</p>` : ''}
                    <p class="text-sm text-gray-500"><i class="fas fa-sms mr-1"></i>Order updates will be sent to ${user.phone}</p>
                </div>
            `,
            confirmButtonText: '<i class="fas fa-truck mr-2"></i> Track Order',
            confirmButtonColor: '#10b981',
            showClass: { popup: 'animate-zoom-in' }
        });
        
        navigate(ROUTES.TRACK, { orderId: order.id });
    };
    
    const finalTotal = total - discount;
    
    if (items.length === 0) return null;
    
    // If not authenticated, show login required UI
    if (!isAuthenticated) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-12">
                <BackToHomeButton />
                
                <div className="card p-8 text-center animate-fade-in">
                    <div className="h-24 w-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <i className="fas fa-user-lock text-4xl text-orange-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">Login Required</h1>
                    <p className="text-gray-500 mb-6">Please login or create an account to place your order</p>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-left">
                        <h3 className="font-medium text-yellow-800 mb-2">
                            <i className="fas fa-shopping-cart mr-2" />Your Cart ({items.length} items)
                        </h3>
                        <p className="text-yellow-700">
                            Total: <span className="font-bold">{Utils.formatCurrency(total)}</span>
                        </p>
                        <p className="text-sm text-yellow-600 mt-1">
                            <i className="fas fa-info-circle mr-1" />
                            Your cart items will be saved after login
                        </p>
                    </div>
                    
                    <div className="space-y-3">
                        <button 
                            onClick={showLoginForCheckout}
                            className="btn btn-primary w-full py-4 text-lg"
                        >
                            <i className="fas fa-sign-in-alt mr-2" />
                            Login to Continue
                        </button>
                        <button 
                            onClick={goHome}
                            className="btn btn-outline w-full"
                        >
                            <i className="fas fa-arrow-left mr-2" />
                            Continue Shopping
                        </button>
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-6">
                        <i className="fas fa-shield-alt mr-1" />
                        Your information is secure with us
                    </p>
                </div>
            </div>
        );
    }
    
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
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-lg">
                                <i className="fas fa-map-marker-alt text-red-500 mr-2" />
                                Delivery Address
                            </h2>
                            {user?.addresses?.length > 0 && (
                                <button 
                                    onClick={showAddAddressForCheckout}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    <i className="fas fa-plus mr-1" />Add New
                                </button>
                            )}
                        </div>
                        
                        {user?.addresses?.length > 0 ? (
                            <div className="space-y-3">
                                {user.addresses.map((addr, idx) => (
                                    <label 
                                        key={addr.id} 
                                        className={`flex items-start space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-orange-400 ${
                                            selectedAddressId === addr.id || (idx === 0 && !selectedAddressId) 
                                                ? 'border-orange-500 bg-orange-50' 
                                                : 'border-gray-200'
                                        }`}
                                    >
                                        <input 
                                            type="radio" 
                                            name="address" 
                                            className="mt-1 text-orange-500 focus:ring-orange-500"
                                            checked={selectedAddressId === addr.id || (idx === 0 && !selectedAddressId)}
                                            onChange={() => {
                                                setSelectedAddressId(addr.id);
                                                setAddress(`${addr.street}, ${addr.area || ''}, ${addr.city}, ${addr.state} - ${addr.zip}`);
                                            }}
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                                    addr.type === 'home' ? 'bg-blue-100 text-blue-700' :
                                                    addr.type === 'work' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    <i className={`fas fa-${addr.type === 'work' ? 'building' : 'home'} mr-1`} />
                                                    {addr.type?.toUpperCase()}
                                                </span>
                                                {idx === 0 && (
                                                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-800 mt-1">{addr.street}</p>
                                            {addr.area && <p className="text-sm text-gray-600">{addr.area}</p>}
                                            <p className="text-sm text-gray-500">{addr.city}, {addr.state} - {addr.zip}</p>
                                            {addr.landmark && (
                                                <p className="text-xs text-gray-400 mt-1">
                                                    <i className="fas fa-landmark mr-1" />Landmark: {addr.landmark}
                                                </p>
                                            )}
                                            {addr.phone && (
                                                <p className="text-sm text-gray-500 mt-1">
                                                    <i className="fas fa-phone mr-1" />{addr.phone}
                                                </p>
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="fas fa-map-marker-alt text-2xl text-orange-500" />
                                </div>
                                <h3 className="font-medium text-gray-900 mb-2">No Saved Addresses</h3>
                                <p className="text-sm text-gray-500 mb-4">Add a delivery address to continue</p>
                                <button 
                                    onClick={showAddAddressForCheckout}
                                    className="btn btn-primary"
                                >
                                    <i className="fas fa-plus mr-2" />
                                    Add Delivery Address
                                </button>
                            </div>
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
                                    <i className="fas fa-lock mr-2" />
                                    Place Order
                                </>
                            )}
                        </button>
                        
                        <p className="text-xs text-center text-gray-500 mt-4">
                            <i className="fas fa-shield-alt mr-1" />
                            Secure payment powered by Stripe
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// TRACK ORDER PAGE
// ==========================================
const TrackOrderPage = () => {
    const { routeParams, navigate } = useRouter();
    const [orderId, setOrderId] = useState(routeParams.orderId || '');
    const [order, setOrder] = useState(null);
    
    useEffect(() => {
        if (routeParams.orderId) {
            const found = OrderModel.getById(routeParams.orderId);
            setOrder(found);
            setOrderId(routeParams.orderId);
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
    
    const statuses = [
        ORDER_STATUS.PENDING, 
        ORDER_STATUS.PREPARING, 
        ORDER_STATUS.OUT_FOR_DELIVERY, 
        ORDER_STATUS.COMPLETED
    ];
    const currentIdx = order ? statuses.indexOf(order.status) : -1;
    
    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Back to Home */}
            <BackToHomeButton />
            
            <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center animate-fade-in">
                Track Your Order
            </h1>
            
            {/* Search */}
            <div className="card p-6 mb-6 animate-fade-in">
                <div className="flex space-x-2">
                    <input 
                        type="text"
                        placeholder="Enter Order ID (e.g., ORD-XXXXXX)"
                        className="input flex-1"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && searchOrder()}
                    />
                    <button onClick={searchOrder} className="btn btn-primary">
                        <i className="fas fa-search" />
                    </button>
                </div>
            </div>
            
            {order && (
                <div className="card p-6 animate-fade-in">
                    <div className="text-center mb-8">
                        <div className="h-20 w-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                            <i className="fas fa-motorcycle text-3xl text-orange-600" />
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
                            />
                        </div>
                        <div className="flex justify-between mt-3">
                            {statuses.map((status, idx) => (
                                <div key={status} className={`text-center ${idx <= currentIdx ? 'text-orange-600' : 'text-gray-400'}`}>
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
                                        idx <= currentIdx ? 'bg-orange-500 text-white' : 'bg-gray-200'
                                    }`}>
                                        {idx < currentIdx ? (
                                            <i className="fas fa-check text-xs" />
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
// CONTACT PAGE
// ==========================================
const ContactPage = () => {
    const { goHome } = useRouter();
    
    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            {/* Back to Home */}
            <BackToHomeButton />
            
            <div className="card p-8 text-center animate-fade-in">
                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fab fa-whatsapp text-4xl text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">Order on WhatsApp</h1>
                <p className="text-gray-500 mb-8">Skip the queue and chat directly with us!</p>
                <a 
                    href="https://wa.me/?text=Hi!%20I%20want%20to%20order%20pizza" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary bg-green-500 hover:bg-green-600 inline-flex"
                >
                    <i className="fab fa-whatsapp text-xl mr-2" />
                    Start Chat
                </a>
                
                <div className="mt-12 pt-8 border-t border-gray-100">
                    <h2 className="font-bold text-lg mb-4">Other Ways to Reach Us</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <i className="fas fa-phone text-2xl text-blue-600 mb-2" />
                            <p className="font-medium">Call Us</p>
                            <p className="text-sm text-gray-500">+1 234 567 8900</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <i className="fas fa-envelope text-2xl text-red-600 mb-2" />
                            <p className="font-medium">Email</p>
                            <p className="text-sm text-gray-500">hello@slicecode.com</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <i className="fas fa-map-marker-alt text-2xl text-green-600 mb-2" />
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
// ADMIN PAGE
// ==========================================
const AdminPage = () => {
    const { navigate, goHome } = useRouter();
    const [orders, setOrders] = useState(OrderModel.getAll());
    const [activeTab, setActiveTab] = useState('dashboard');
    
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const activeOrders = orders.filter(o => o.status !== ORDER_STATUS.COMPLETED).length;
    const completedOrders = orders.filter(o => o.status === ORDER_STATUS.COMPLETED).length;
    
    const updateStatus = (id, status) => {
        OrderModel.updateStatus(id, status);
        setOrders(OrderModel.getAll());
        showToast('Status updated!');
    };
    
    const stats = [
        { label: 'Total Revenue', value: Utils.formatCurrency(totalRevenue), icon: 'fa-dollar-sign', gradient: 'from-blue-500 to-blue-600' },
        { label: 'Active Orders', value: activeOrders, icon: 'fa-clock', gradient: 'from-orange-500 to-red-500' },
        { label: 'Completed', value: completedOrders, icon: 'fa-check', gradient: 'from-green-500 to-emerald-600' },
        { label: 'Total Orders', value: orders.length, icon: 'fa-shopping-bag', gradient: 'from-purple-500 to-indigo-600' }
    ];
    
    return (
        <div className="admin-container">
            <div className="admin-layout">
                {/* Sidebar */}
                <div className="admin-sidebar">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="h-10 w-10 gradient-orange rounded-lg flex items-center justify-center">
                            <i className="fas fa-pizza-slice text-white" />
                        </div>
                        <span className="text-white font-bold text-lg">Admin Panel</span>
                    </div>
                    
                    <nav className="space-y-2">
                        {[
                            { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
                            { id: 'orders', label: 'Orders', icon: 'fa-box' },
                            { id: 'menu', label: 'Menu Items', icon: 'fa-pizza-slice' },
                            { id: 'customers', label: 'Customers', icon: 'fa-users' }
                        ].map(item => (
                            <button 
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`admin-nav-item w-full ${activeTab === item.id ? 'active' : ''}`}
                            >
                                <i className={`fas ${item.icon} w-5`} />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                    
                    <div className="mt-8 pt-8 border-t border-gray-700">
                        <button onClick={goHome} className="admin-nav-item w-full">
                            <i className="fas fa-home w-5" />
                            <span>Back to Home</span>
                        </button>
                        <button onClick={goHome} className="admin-nav-item w-full text-red-400 hover:text-red-300">
                            <i className="fas fa-sign-out-alt w-5" />
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
                        <button onClick={goHome} className="btn bg-gray-700 text-white hover:bg-gray-600 lg:hidden">
                            <i className="fas fa-home mr-2" />Back to Home
                        </button>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className={`admin-stat-card bg-gradient-to-br ${stat.gradient}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white/80 text-sm">{stat.label}</p>
                                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                    </div>
                                    <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                                        <i className={`fas ${stat.icon} text-xl`} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Orders Table */}
                    <div className="bg-gray-800 rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h2 className="text-lg font-bold text-white">Recent Orders</h2>
                            <button 
                                onClick={() => setOrders(OrderModel.getAll())}
                                className="btn bg-gray-700 text-gray-300 hover:bg-gray-600"
                            >
                                <i className="fas fa-sync-alt mr-2" />Refresh
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
