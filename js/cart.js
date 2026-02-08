// ========================================
// CART MANAGEMENT SYSTEM
// ========================================

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('sneakerhub-cart');
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('sneakerhub-cart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(product) {
    const cart = getCart();
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    
    saveCart(cart);
    showNotification(`${product.name} added to cart!`);
}

// Remove item from cart
function removeFromCart(productId) {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCart(updatedCart);
}

// Update item quantity
function updateQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(quantity, 1);
        saveCart(cart);
    }
}

// Get cart count
function getCartCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Calculate totals
function calculateTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal >= 2000 ? 0 : 99;
    const tax = subtotal * 0.10;
    const total = subtotal + shipping + tax;
    
    return {
        subtotal,
        shipping,
        tax,
        total
    };
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #8B4513, #FF8C00);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-weight: bold;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
if (!document.querySelector('style[data-cart-animations]')) {
    const style = document.createElement('style');
    style.setAttribute('data-cart-animations', '');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize cart functionality on page load
document.addEventListener('DOMContentLoaded', function() {
    // Handle add to cart buttons on products page
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Find the product card
            const productCard = this.closest('.product-card');
            if (!productCard) return;
            
            // Extract product information
            const productName = productCard.querySelector('.product-name')?.textContent || 'Unknown Product';
            const productPrice = productCard.querySelector('.product-price')?.textContent?.replace(/[^\d]/g, '') || '0';
            const productImage = productCard.querySelector('img')?.src || '';
            
            // Generate a simple ID based on product name
            const productId = productName.toLowerCase().replace(/\s+/g, '-');
            
            // Create product object
            const product = {
                id: productId,
                name: productName,
                price: parseInt(productPrice),
                image: productImage,
                color: 'Default',
                size: 'One Size'
            };
            
            // Add to cart
            addToCart(product);
        });
    });
});
