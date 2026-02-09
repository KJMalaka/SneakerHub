// ========================================
// UTILITY FUNCTIONS & INITIALIZATION
// ========================================

// Global initialization tracker
window.appReady = false;
window.requiredFunctions = [
    'getCart',
    'saveCart',
    'addToCart',
    'removeFromCart',
    'updateQuantity',
    'calculateTotals',
    'getLoggedInUser',
    'setLoggedInUser',
    'isUserLoggedIn',
    'login',
    'signUp',
    'logoutUser'
];

// Check if all required functions are available
function checkAllFunctionsAvailable() {
    return window.requiredFunctions.every(func => typeof window[func] === 'function');
}

// Wait for all functions to be available
function waitForAppReady(callback, maxAttempts = 50) {
    let attempts = 0;
    
    function check() {
        if (checkAllFunctionsAvailable()) {
            window.appReady = true;
            console.log('✓ App is ready - all functions available');
            if (callback) callback();
        } else {
            attempts++;
            if (attempts < maxAttempts) {
                setTimeout(check, 50);
            } else {
                console.error('✗ Timeout waiting for app functions to load');
                console.log('Available functions:', window.requiredFunctions.filter(f => typeof window[f] === 'function'));
            }
        }
    }
    
    check();
}

// Initialize all tracking
function initializeApp() {
    console.log('Initializing SneakerHub app...');
    
    // Wait for DOM to be fully ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            waitForAppReady(function() {
                console.log('App initialization complete');
            });
        });
    } else {
        waitForAppReady(function() {
            console.log('App initialization complete');
        });
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});

// Log when scripts load
console.log('Utility functions loaded');
