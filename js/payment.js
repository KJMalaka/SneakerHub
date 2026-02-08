// ========================================
// SNEAKER HUB SA - PAYMENT SYSTEM
// Complete Payment Processing with EmailJS
// ========================================

// Initialize EmailJS with your public key
(function() {
    emailjs.init("8LGSCnVLhg71hqRSy");
})();

// ========================================
// CART DATA & CONFIGURATION
// ========================================

// Sample cart data - In production, load from localStorage
let cartItems = [
    {
        id: 1,
        name: "Converse All Star Classic",
        price: 1400,
        quantity: 1,
        size: "9",
        color: "Black",
        image: "images/All Star.jpg"
    },
    {
        id: 2,
        name: "Nike Air Force 1",
        price: 2000,
        quantity: 1,
        size: "10",
        color: "Blue",
        image: "images/Nike Air force.jpg"
    }
];

// Configuration
const SHIPPING_COST = 99;
const TAX_RATE = 0.10; // 10% tax
const FREE_SHIPPING_THRESHOLD = 2000; // Free shipping on orders over R2000

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Payment system initialized');
    loadCartFromStorage();
    loadCartItems();
    calculateTotals();
    setupFormValidation();
    setupCardFormatting();
    setupShippingOptions();
});

// ========================================
// CART MANAGEMENT
// ========================================

// Load cart items from localStorage (if available)
function loadCartFromStorage() {
    try {
        const storedCart = localStorage.getItem('sneakerHubCart');
        if (storedCart) {
            const parsedCart = JSON.parse(storedCart);
            if (Array.isArray(parsedCart) && parsedCart.length > 0) {
                cartItems = parsedCart;
                console.log('Cart loaded from localStorage:', cartItems);
            }
        }
    } catch (error) {
        console.warn('Could not load cart from localStorage:', error);
    }
}

// Load cart items into the order summary
function loadCartItems() {
    const orderItemsContainer = document.getElementById('orderItems');
    
    if (!cartItems || cartItems.length === 0) {
        orderItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #6B4423;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🛒</div>
                <p style="margin-bottom: 1rem;">Your cart is empty</p>
                <a href="products.html" style="color: #FF8C00; text-decoration: none; font-weight: bold;">Continue Shopping</a>
            </div>
        `;
        document.getElementById('placeOrderBtn').disabled = true;
        return;
    }

    let itemsHTML = '';
    cartItems.forEach(item => {
        const itemTotal = (item.price * item.quantity).toLocaleString();
        itemsHTML += `
            <div class="order-item">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect fill=%22%23f5f5f5%22 width=%22100%22 height=%22100%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%238B4513%22>👟</text></svg>'">
                <div class="order-item-details">
                    <div style="font-weight: bold; color: #8B4513;">${item.name}</div>
                    <div style="font-size: 0.9rem; color: #6B4423;">${item.color} / Size ${item.size}</div>
                    <div style="font-size: 0.9rem; color: #6B4423;">Qty: ${item.quantity}</div>
                </div>
                <div style="font-weight: bold; color: #FF8C00;">R${itemTotal}</div>
            </div>
        `;
    });
    
    orderItemsContainer.innerHTML = itemsHTML;
}

// ========================================
// CALCULATION FUNCTIONS
// ========================================

// Calculate order totals
function calculateTotals() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = calculateShipping(subtotal);
    const tax = (subtotal + shipping) * TAX_RATE;
    const total = subtotal + shipping + tax;

    // Update display
    document.getElementById('subtotal').textContent = `R${subtotal.toLocaleString()}`;
    
    const shippingDisplay = shipping === 0 ? 'FREE' : `R${shipping.toLocaleString()}`;
    document.getElementById('shipping').textContent = shippingDisplay;
    
    document.getElementById('tax').textContent = `R${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `R${total.toFixed(2)}`;

    return { subtotal, shipping, tax, total };
}

// Calculate shipping cost
function calculateShipping(subtotal) {
    if (cartItems.length === 0) return 0;
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
}

// ========================================
// FORM VALIDATION
// ========================================

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('checkoutForm');
    const inputs = form.querySelectorAll('input[required], select[required]');

    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(220, 53, 69)') {
                validateField(this);
            }
        });
    });
}

// Validate individual field
function validateField(field) {
    let isValid = true;
    const value = field.value.trim();

    if (!value) {
        isValid = false;
    } else {
        // Special validation rules
        switch(field.id) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                break;
            case 'phone':
                const phoneRegex = /^[\d\s+\-()]+$/;
                isValid = phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
                break;
            case 'postalCode':
                isValid = value.length >= 4;
                break;
            case 'cardNumber':
                const cardDigits = value.replace(/\s/g, '');
                isValid = cardDigits.length >= 13 && cardDigits.length <= 19 && /^\d+$/.test(cardDigits);
                break;
            case 'expiryDate':
                isValid = /^\d{2}\/\d{2}$/.test(value);
                if (isValid) {
                    const [month, year] = value.split('/');
                    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
                    const now = new Date();
                    isValid = expiry > now;
                }
                break;
            case 'cvv':
                isValid = /^\d{3,4}$/.test(value);
                break;
        }
    }

    // Update field styling
    if (isValid) {
        field.style.borderColor = '#28a745';
    } else {
        field.style.borderColor = '#dc3545';
    }

    return isValid;
}

// Validate all form fields
function validateForm() {
    const form = document.getElementById('checkoutForm');
    const requiredFields = form.querySelectorAll('input[required], select[required]');
    const paymentFields = ['cardName', 'cardNumber', 'expiryDate', 'cvv'];
    
    let isValid = true;
    let invalidFields = [];

    // Validate billing fields
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
            invalidFields.push(field.id);
        }
    });

    // Validate payment fields
    paymentFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !validateField(field)) {
            isValid = false;
            invalidFields.push(fieldId);
        }
    });

    if (!isValid) {
        console.warn('Invalid fields:', invalidFields);
    }

    return isValid;
}

// ========================================
// CARD FORMATTING
// ========================================

// Setup card number formatting
function setupCardFormatting() {
    const cardNumber = document.getElementById('cardNumber');
    const expiryDate = document.getElementById('expiryDate');
    const cvv = document.getElementById('cvv');
    const phone = document.getElementById('phone');

    // Format card number with spaces (4 digits per group)
    cardNumber.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
        
        // Auto-detect card type and show icon
        detectCardType(value);
    });

    // Format expiry date as MM/YY
    expiryDate.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });

    // Only allow numbers in CVV
    cvv.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    // Format phone number
    phone.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.startsWith('27')) {
            // Format as +27 XX XXX XXXX
            if (value.length > 2) value = '+' + value.substring(0, 2) + ' ' + value.substring(2);
            if (value.length > 6) value = value.substring(0, 6) + ' ' + value.substring(6);
            if (value.length > 10) value = value.substring(0, 10) + ' ' + value.substring(10, 14);
        } else if (value.startsWith('0')) {
            // Format as 0XX XXX XXXX
            if (value.length > 3) value = value.substring(0, 3) + ' ' + value.substring(3);
            if (value.length > 7) value = value.substring(0, 7) + ' ' + value.substring(7, 11);
        }
        e.target.value = value;
    });
}

// Detect card type (Visa, Mastercard, etc.)
function detectCardType(number) {
    const cardIcon = document.querySelector('.card-icon');
    if (!cardIcon) return;

    if (number.startsWith('4')) {
        cardIcon.textContent = '💳'; // Visa
    } else if (number.startsWith('5')) {
        cardIcon.textContent = '💳'; // Mastercard
    } else if (number.startsWith('3')) {
        cardIcon.textContent = '💳'; // Amex
    } else {
        cardIcon.textContent = '💳';
    }
}

// ========================================
// SHIPPING OPTIONS
// ========================================

// Setup shipping options (for future expansion)
function setupShippingOptions() {
    // Placeholder for shipping method selection
    // Can be expanded to include express shipping, etc.
}

// ========================================
// ORDER PROCESSING
// ========================================

// Main function: Process payment
async function processPayment() {
    console.log('Processing payment...');

    // Validate form
    if (!validateForm()) {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            html: '<p>Please fill in all required fields correctly.</p><p style="font-size: 0.9rem; color: #666;">Check that all fields are highlighted in green.</p>',
            confirmButtonColor: '#FF8C00',
            confirmButtonText: 'OK, I\'ll fix it'
        });
        return;
    }

    // Check if cart has items
    if (!cartItems || cartItems.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Empty Cart',
            text: 'Your cart is empty. Please add items before checking out.',
            confirmButtonColor: '#FF8C00'
        });
        return;
    }

    // Show loading overlay
    document.getElementById('loadingOverlay').style.display = 'flex';
    document.getElementById('placeOrderBtn').disabled = true;

    // Simulate payment processing delay (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
        // Prepare order data
        const orderData = prepareOrderData();
        
        // Send email notification
        console.log('Sending email confirmation...');
        await sendOrderEmail(orderData);
        console.log('Email sent successfully!');

        // Hide loading overlay
        document.getElementById('loadingOverlay').style.display = 'none';

        // Show success message
        await Swal.fire({
            icon: 'success',
            title: 'Order Placed Successfully!',
            html: `
                <div style="text-align: left; padding: 1rem;">
                    <p style="margin-bottom: 1rem;">Your order has been confirmed and is being processed.</p>
                    <div style="background: #f5f5f5; padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
                        <strong>Order Number:</strong> ${orderData.orderNumber}<br>
                        <strong>Total Amount:</strong> R${orderData.total.toFixed(2)}
                    </div>
                    <p style="font-size: 0.9rem; color: #666;">
                        A confirmation email has been sent to:<br>
                        <strong>${orderData.email}</strong>
                    </p>
                </div>
            `,
            confirmButtonColor: '#28a745',
            confirmButtonText: 'View Receipt',
            allowOutsideClick: false
        });

        // Clear cart and redirect to receipt page
        clearCart();
        
        // Store order data for receipt page
        localStorage.setItem('lastOrder', JSON.stringify(orderData));
        
        // Redirect to receipt page
        window.location.href = 'receipt.html?order=' + orderData.orderNumber;

    } catch (error) {
        // Hide loading overlay
        document.getElementById('loadingOverlay').style.display = 'none';
        document.getElementById('placeOrderBtn').disabled = false;

        console.error('Payment error:', error);

        // Show error message
        Swal.fire({
            icon: 'error',
            title: 'Order Processing Failed',
            html: `
                <p>We encountered an error processing your order.</p>
                <p style="font-size: 0.9rem; color: #666; margin-top: 1rem;">
                    Error: ${error.message || 'Unknown error'}
                </p>
                <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">
                    Please try again or contact our support team if the problem persists.
                </p>
            `,
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'Try Again'
        });
    }
}

// Prepare order data
function prepareOrderData() {
    const totals = calculateTotals();
    const now = new Date();
    
    // Generate unique order number
    const orderNumber = 'SH' + now.getFullYear() + '-' + 
                       String(now.getMonth() + 1).padStart(2, '0') +
                       String(now.getDate()).padStart(2, '0') +
                       '-' + 
                       Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    
    const orderDate = now.toLocaleDateString('en-ZA', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Get form values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const postalCode = document.getElementById('postalCode').value.trim();
    const province = document.getElementById('province').value;
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    
    return {
        // Order Info
        orderNumber: orderNumber,
        orderDate: orderDate,
        
        // Customer Info
        firstName: firstName,
        lastName: lastName,
        fullName: `${firstName} ${lastName}`,
        email: email,
        phone: phone,
        
        // Shipping Address
        address: address,
        city: city,
        postalCode: postalCode,
        province: province,
        fullAddress: `${address}, ${city}, ${province} ${postalCode}`,
        
        // Order Items
        items: cartItems,
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        
        // Totals
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        tax: totals.tax,
        total: totals.total,
        
        // Payment Info (masked)
        cardLast4: cardNumber.slice(-4),
        
        // Timestamps
        timestamp: now.toISOString(),
        orderDateRaw: now
    };
}

// ========================================
// EMAIL FUNCTIONS
// ========================================

// Send order confirmation email using EmailJS
async function sendOrderEmail(orderData) {
    // Prepare items list for email
    const itemsList = orderData.items.map(item => {
        const itemTotal = (item.price * item.quantity).toLocaleString();
        return `${item.name} (${item.color}, Size ${item.size}) x${item.quantity} - R${itemTotal}`;
    }).join('\n');

    // Prepare items HTML for better email formatting
    const itemsHTML = orderData.items.map(item => {
        const itemTotal = (item.price * item.quantity).toLocaleString();
        return `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    ${item.name}<br>
                    <small style="color: #666;">${item.color} / Size ${item.size}</small>
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">R${item.price.toLocaleString()}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">R${itemTotal}</td>
            </tr>
        `;
    }).join('');

    // Email parameters
    const templateParams = {
        // Recipient
        to_email: orderData.email,
        to_name: orderData.fullName,
        
        // Order Details
        order_number: orderData.orderNumber,
        order_date: orderData.orderDate,
        
        // Customer Information
        customer_name: orderData.fullName,
        customer_email: orderData.email,
        customer_phone: orderData.phone,
        
        // Shipping Address
        shipping_address: orderData.fullAddress,
        
        // Items
        items_list: itemsList,
        items_html: itemsHTML,
        item_count: orderData.itemCount,
        
        // Totals
        subtotal: `R${orderData.subtotal.toLocaleString()}`,
        shipping: orderData.shipping === 0 ? 'FREE' : `R${orderData.shipping.toLocaleString()}`,
        tax: `R${orderData.tax.toFixed(2)}`,
        total: `R${orderData.total.toFixed(2)}`,
        
        // Payment
        card_last4: orderData.cardLast4,
        
        // Additional Info
        current_year: new Date().getFullYear()
    };

    console.log('Sending email with params:', templateParams);

    // Send email using EmailJS
    return emailjs.send(
        'service_nsjqi96',      // Your service ID
        'template_muxx4yg',     // Your template ID
        templateParams
    ).then(
        function(response) {
            console.log('Email sent successfully!', response.status, response.text);
            return response;
        },
        function(error) {
            console.error('Email sending failed:', error);
            throw new Error('Failed to send confirmation email: ' + error.text);
        }
    );
}

// ========================================
// CART MANAGEMENT
// ========================================

// Clear the cart
function clearCart() {
    cartItems = [];
    try {
        localStorage.removeItem('sneakerHubCart');
        localStorage.removeItem('cart');
        console.log('Cart cleared successfully');
    } catch (error) {
        console.warn('Could not clear cart from localStorage:', error);
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Format currency
function formatCurrency(amount) {
    return `R${amount.toLocaleString('en-ZA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

// Generate random order number
function generateOrderNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `SH${year}-${random}`;
}

// ========================================
// EXPORT FOR GLOBAL ACCESS
// ========================================

// Make processPayment available globally
window.processPayment = processPayment;

// Log initialization
console.log('✅ Sneaker Hub SA Payment System Loaded');
console.log('📧 EmailJS configured and ready');
console.log('🛒 Cart items:', cartItems.length);