// ========================================
// MOBILE NAVIGATION TOGGLE
// ========================================

function initializeMobileNav() {
    // Create hamburger menu button if not exists
    const nav = document.querySelector('nav');
    if (!nav) return;

    // Check if toggle already exists
    if (document.querySelector('.nav-toggle')) return;

    // Create toggle button
    const toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.innerHTML = '☰';
    toggle.setAttribute('aria-label', 'Toggle navigation');

    // Insert toggle after logo
    const logo = nav.querySelector('.logo');
    if (logo) {
        logo.parentNode.insertBefore(toggle, logo.nextSibling);
    } else {
        nav.insertBefore(toggle, nav.querySelector('.nav-links'));
    }

    // Get nav links
    const navLinks = nav.querySelector('.nav-links');
    if (!navLinks) return;

    // Toggle menu on button click
    toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            toggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
            toggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Add nav icons for mobile view
    addNavIcons();
}

function addNavIcons() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    // Icon mapping
    const iconMap = {
        'HOME': '🏠',
        'PRODUCTS': '👟',
        'CART': '🛒',
        'ABOUT': 'ℹ️',
        'CONTACT': '✉️'
    };

    navLinks.querySelectorAll('a').forEach(link => {
        const text = link.textContent.trim();
        const icon = iconMap[text] || '';
        if (icon && window.innerWidth <= 768) {
            // Store original text
            link.setAttribute('data-text', text);
            // Update text with icon
            link.innerHTML = `<span style="font-size: 1.2rem;">${icon}</span>`;
            // Show text on hover
            link.addEventListener('mouseenter', function() {
                if (window.innerWidth <= 768) {
                    this.innerHTML = `<span style="font-size: 1.2rem;">${icon}</span><span>${this.getAttribute('data-text')}</span>`;
                }
            });
            link.addEventListener('mouseleave', function() {
                if (window.innerWidth <= 768) {
                    this.innerHTML = `<span style="font-size: 1.2rem;">${icon}</span>`;
                }
            });
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeMobileNav);

// Re-initialize on window resize
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Reset nav for responsive layout
        const toggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (toggle && navLinks) {
            if (window.innerWidth > 768) {
                toggle.style.display = 'none';
                navLinks.classList.remove('active');
                toggle.classList.remove('active');
                // Reset nav links to show text
                navLinks.querySelectorAll('a').forEach(link => {
                    const text = link.getAttribute('data-text') || link.textContent;
                    link.textContent = text;
                });
            } else {
                toggle.style.display = 'block';
                addNavIcons();
            }
        }
    }, 250);
});
