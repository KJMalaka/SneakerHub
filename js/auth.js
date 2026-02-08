// ========================================
// AUTHENTICATION SYSTEM
// ========================================

// Initialize EmailJS
(function() {
    emailjs.init("8LGSCnVLhg71hqRSy");
})();

// Get user from localStorage
function getLoggedInUser() {
    const user = localStorage.getItem('sneakerhub-user');
    return user ? JSON.parse(user) : null;
}

// Save user to localStorage
function setLoggedInUser(user) {
    localStorage.setItem('sneakerhub-user', JSON.stringify(user));
}

// Logout user
function logoutUser() {
    localStorage.removeItem('sneakerhub-user');
    window.location.href = 'index.html';
}

// Check if user is logged in
function isUserLoggedIn() {
    return getLoggedInUser() !== null;
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password strength
function isValidPassword(password) {
    return password.length >= 6;
}

// Sign up function
function signUp(fullName, email, password) {
    // Basic validation
    if (!fullName.trim()) {
        return { success: false, message: 'Full name is required' };
    }
    if (!isValidEmail(email)) {
        return { success: false, message: 'Invalid email address' };
    }
    if (!isValidPassword(password)) {
        return { success: false, message: 'Password must be at least 6 characters' };
    }

    // Check if user already exists
    const allUsers = JSON.parse(localStorage.getItem('sneakerhub-users') || '[]');
    if (allUsers.some(u => u.email === email)) {
        return { success: false, message: 'Email already registered' };
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        fullName: fullName.trim(),
        email: email.toLowerCase(),
        password: btoa(password), // Simple encoding (not for production!)
        createdAt: new Date().toISOString()
    };

    // Save user
    allUsers.push(newUser);
    localStorage.setItem('sneakerhub-users', JSON.stringify(allUsers));

    // Log them in
    const { password, ...userWithoutPassword } = newUser;
    setLoggedInUser(userWithoutPassword);

    return { success: true, message: 'Account created successfully!' };
}

// Login function
function login(email, password) {
    if (!email || !password) {
        return { success: false, message: 'Email and password are required' };
    }

    const allUsers = JSON.parse(localStorage.getItem('sneakerhub-users') || '[]');
    const user = allUsers.find(u => u.email === email.toLowerCase() && atob(u.password) === password);

    if (!user) {
        return { success: false, message: 'Invalid email or password' };
    }

    // Log them in
    const { password: pwd, ...userWithoutPassword } = user;
    setLoggedInUser(userWithoutPassword);

    return { success: true, message: 'Logged in successfully!' };
}

// Initialize navbar with user info
function updateNavbarWithUser() {
    const loggedInUser = getLoggedInUser();
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (!navLinksContainer) return;
    
    // Remove existing user menu if present
    const existingUserMenu = navLinksContainer.querySelector('.user-menu');
    if (existingUserMenu) {
        existingUserMenu.remove();
    }

    if (loggedInUser) {
        // Create user menu
        const userMenuHTML = `
            <li class="user-menu" style="position: relative;">
                <span style="cursor: pointer; font-weight: bold; color: #FF8C00;" id="user-dropdown-toggle">👤 ${loggedInUser.fullName}</span>
                <ul style="display: none; position: absolute; top: 100%; right: 0; background: white; border: 1px solid #ddd; border-radius: 5px; min-width: 150px; z-index: 1000; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" id="user-dropdown-menu">
                    <li style="padding: 0.5rem 1rem; border-bottom: 1px solid #ddd;"><strong>${loggedInUser.email}</strong></li>
                    <li style="padding: 0.5rem 1rem;"><a href="#" id="logout-btn" style="color: #8B4513; text-decoration: none;">Logout</a></li>
                </ul>
            </li>
        `;
        navLinksContainer.insertAdjacentHTML('beforeend', userMenuHTML);

        // Add toggle functionality
        const dropdownToggle = document.getElementById('user-dropdown-toggle');
        const dropdownMenu = document.getElementById('user-dropdown-menu');
        
        if (dropdownToggle && dropdownMenu) {
            dropdownToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
            });

            document.addEventListener('click', function() {
                dropdownMenu.style.display = 'none';
            });
        }

        // Add logout functionality
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                logoutUser();
            });
        }
    }
}

// Protect checkout - redirect to auth if not logged in
function protectCheckout() {
    if (!isUserLoggedIn()) {
        localStorage.setItem('redirect-to-checkout', 'true');
        window.location.href = 'auth.html';
    }
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', function() {
    updateNavbarWithUser();
});
