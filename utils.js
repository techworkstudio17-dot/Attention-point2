// ============================================
// SLICE & CODE - UTILITIES
// js/utils.js
// ============================================

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
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms))
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

console.log('✅ Utils loaded');
