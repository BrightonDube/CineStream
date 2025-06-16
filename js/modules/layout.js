const LAST_MODIFIED_KEY = 'cineStreamLastModified';

function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    
    hamburger.classList.toggle('active');
    navbarMenu.classList.toggle('active');
}

function updateLastModified() {
    const lastModified = new Date().toLocaleDateString();
    localStorage.setItem(LAST_MODIFIED_KEY, lastModified);
    document.getElementById('last-modified').textContent = lastModified;
}


function updateCurrentYear() {
    document.getElementById('current-year').textContent = new Date().getFullYear();
}

function initLayout() {
    const hamburger = document.querySelector('.hamburger');
    hamburger.addEventListener('click', toggleMobileMenu);

    document.addEventListener('click', (event) => {
        const navbarMenu = document.querySelector('.navbar-menu');
        const hamburger = document.querySelector('.hamburger');
        
        if (!event.target.closest('.navbar') && navbarMenu.classList.contains('active')) {
            navbarMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });

    const storedLastModified = localStorage.getItem(LAST_MODIFIED_KEY);
    if (storedLastModified) {
        document.getElementById('last-modified').textContent = storedLastModified;
    } else {
        updateLastModified();
    }

    updateCurrentYear();

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

export { initLayout, updateLastModified }; 