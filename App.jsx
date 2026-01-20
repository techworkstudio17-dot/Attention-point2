// ============================================
// SLICE & CODE - MAIN APP COMPONENT
// jsx/App.jsx
// ============================================

const { useState, useEffect } = React;

// ==========================================
// MAIN APP COMPONENT
// ==========================================
const App = () => {
    const { currentRoute, loading } = useRouter();
    
    // Render current page based on route
    const renderPage = () => {
        if (loading) {
            return <PageLoader />;
        }
        
        switch (currentRoute) {
            case ROUTES.HOME:
                return <HomePage />;
            case ROUTES.PROFILE:
                return <ProfilePage />;
            case ROUTES.CHECKOUT:
                return <CheckoutPage />;
            case ROUTES.TRACK:
                return <TrackOrderPage />;
            case ROUTES.CONTACT:
                return <ContactPage />;
            case ROUTES.ADMIN:
                return <AdminPage />;
            default:
                return <HomePage />;
        }
    };
    
    // Check if we should show navbar and footer
    const showNavbar = currentRoute !== ROUTES.ADMIN;
    const showFooter = currentRoute !== ROUTES.ADMIN;
    
    return (
        <div className="min-h-screen flex flex-col">
            {showNavbar && <Navbar />}
            <main className="flex-grow">
                {renderPage()}
            </main>
            {showFooter && <Footer />}
            <CartSidebar />
        </div>
    );
};

// ==========================================
// APP WITH PROVIDERS
// ==========================================
const AppWithProviders = () => {
    return (
        <RouterProvider>
            <AuthProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </AuthProvider>
        </RouterProvider>
    );
};

// ==========================================
// RENDER APPLICATION
// ==========================================
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AppWithProviders />);

console.log('🚀 Slice & Code App Initialized!');
console.log('📁 JSX File Structure:');
console.log('   ├── index.html');
console.log('   ├── styles.css');
console.log('   └── jsx/');
console.log('       ├── config.jsx');
console.log('       ├── utils.jsx');
console.log('       ├── models.jsx');
console.log('       ├── contexts.jsx');
console.log('       ├── components.jsx');
console.log('       ├── pages.jsx');
console.log('       └── App.jsx');
