// ============================================
// SLICE & CODE - UTILITIES
// jsx/utils.jsx
// ============================================

// Utility Functions
const Utils = {
    // Format currency
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: CONFIG.CURRENCY
        }).format(amount);
    },
    
    // Generate unique ID
    generateId: (prefix = 'ORD') => {
        return `${prefix}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    },
    
    // Format date
    formatDate: (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },
    
    // Format date and time
    formatDateTime: (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    // Delay function for simulating API calls
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    
    // Get initials from name
    getInitials: (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    },
    
    // Validate email (supports Gmail, Yahoo, Outlook, etc.)
    validateEmail: (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com|mail\.com|protonmail\.com|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/i;
        return re.test(email);
    },
    
    // Validate phone number (10 digits, can start with +91 or 0)
    validatePhone: (phone) => {
        const cleaned = phone.replace(/[\s\-\(\)]/g, '');
        const re = /^(\+91|91|0)?[6-9]\d{9}$/;
        return re.test(cleaned);
    },
    
    // Validate PIN code (6 digits for India)
    validatePinCode: (pin) => {
        const re = /^[1-9][0-9]{5}$/;
        return re.test(pin);
    },
    
    // Truncate text
    truncate: (text, length = 50) => {
        if (text.length <= length) return text;
        return text.slice(0, length) + '...';
    },
    
    // Fetch city from PIN code (Indian PIN codes)
    fetchCityFromPinCode: async (pinCode) => {
        if (!Utils.validatePinCode(pinCode)) {
            return null;
        }
        
        try {
            // Using Indian Postal API
            const response = await fetch(`https://api.postalpincode.in/pincode/${pinCode}`);
            const data = await response.json();
            
            if (data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
                const postOffice = data[0].PostOffice[0];
                return {
                    city: postOffice.District,
                    state: postOffice.State,
                    country: 'India',
                    area: postOffice.Name
                };
            }
            return null;
        } catch (error) {
            console.error('Error fetching PIN code data:', error);
            // Fallback to simulated data for common PIN codes
            return Utils.getSimulatedPinData(pinCode);
        }
    },
    
    // Simulated PIN code data (fallback)
    getSimulatedPinData: (pinCode) => {
        const pinData = {
            '110001': { city: 'New Delhi', state: 'Delhi', country: 'India', area: 'Connaught Place' },
            '110002': { city: 'New Delhi', state: 'Delhi', country: 'India', area: 'Darya Ganj' },
            '400001': { city: 'Mumbai', state: 'Maharashtra', country: 'India', area: 'Fort' },
            '400002': { city: 'Mumbai', state: 'Maharashtra', country: 'India', area: 'Kalbadevi' },
            '560001': { city: 'Bangalore', state: 'Karnataka', country: 'India', area: 'GPO' },
            '560002': { city: 'Bangalore', state: 'Karnataka', country: 'India', area: 'Domlur' },
            '600001': { city: 'Chennai', state: 'Tamil Nadu', country: 'India', area: 'GPO' },
            '700001': { city: 'Kolkata', state: 'West Bengal', country: 'India', area: 'BBD Bag' },
            '500001': { city: 'Hyderabad', state: 'Telangana', country: 'India', area: 'GPO' },
            '380001': { city: 'Ahmedabad', state: 'Gujarat', country: 'India', area: 'GPO' },
            '411001': { city: 'Pune', state: 'Maharashtra', country: 'India', area: 'GPO' },
            '302001': { city: 'Jaipur', state: 'Rajasthan', country: 'India', area: 'GPO' },
            '226001': { city: 'Lucknow', state: 'Uttar Pradesh', country: 'India', area: 'GPO' },
            '208001': { city: 'Kanpur', state: 'Uttar Pradesh', country: 'India', area: 'GPO' },
            '201301': { city: 'Noida', state: 'Uttar Pradesh', country: 'India', area: 'Sector 1' },
            '122001': { city: 'Gurgaon', state: 'Haryana', country: 'India', area: 'Sector 1' },
            '144001': { city: 'Jalandhar', state: 'Punjab', country: 'India', area: 'GPO' },
            '160001': { city: 'Chandigarh', state: 'Chandigarh', country: 'India', area: 'Sector 1' },
        };
        return pinData[pinCode] || null;
    }
};

// Toast Notifications using SweetAlert2
const showToast = (message, type = 'success') => {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: type,
        title: message,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
    });
};

// Confirmation Dialog
const showConfirm = async (title, text) => {
    const result = await Swal.fire({
        title,
        text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#2874f0',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes'
    });
    return result.isConfirmed;
};

// Show Alert
const showAlert = async (title, html, icon = 'info') => {
    return Swal.fire({
        title,
        html,
        icon,
        confirmButtonColor: '#2874f0'
    });
};

console.log('✅ Utils loaded');
