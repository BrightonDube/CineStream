const LAST_MODIFIED_KEY = 'cineStreamLastModified';

/**
 * Toggles the mobile navigation menu.
 */
function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    
    hamburger.classList.toggle('active');
    navbarMenu.classList.toggle('active');
}

/**
 * Updates the last modified date in localStorage and the footer.
 */
function updateLastModified() {
    const lastModified = new Date().toLocaleDateString();
    localStorage.setItem(LAST_MODIFIED_KEY, lastModified);
    document.getElementById('last-modified').textContent = lastModified;
}

/**
 * Updates the current year in the footer.
 */
function updateCurrentYear() {
    document.getElementById('current-year').textContent = new Date().getFullYear();
}

/**
 * Initializes the navbar and footer functionality.
 */
function initLayout() {
    // Initialize hamburger menu
    const hamburger = document.querySelector('.hamburger');
    hamburger.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
        const navbarMenu = document.querySelector('.navbar-menu');
        const hamburger = document.querySelector('.hamburger');
        
        if (!event.target.closest('.navbar') && navbarMenu.classList.contains('active')) {
            navbarMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });

    // Update last modified date
    const storedLastModified = localStorage.getItem(LAST_MODIFIED_KEY);
    if (storedLastModified) {
        document.getElementById('last-modified').textContent = storedLastModified;
    } else {
        updateLastModified();
    }

    // Update current year
    updateCurrentYear();

    // Handle active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

export { initLayout, updateLastModified }; 