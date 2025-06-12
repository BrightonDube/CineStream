import { searchOMDb, getStreamingSources, getMovieById } from './api.js';
import { renderMovies, toggleLoader, resultsContainer, watchlistContainer, featuredContainer } from './ui.js';
import { getWatchlist, addMovieToWatchlist, removeMovieFromWatchlist } from './storage.js';
import { validateSearchForm, validateContactForm } from './form-utils.js';

const searchForm = document.getElementById('search-form');
const surpriseBtn = document.getElementById('surprise-btn');
const contactForm = document.getElementById('contact-form');
const navLinks = document.querySelectorAll('.nav-link');

// A pre-defined list of high-quality movie IMDb IDs for new features
const featuredMovieIds = ['tt0111161', 'tt0068646', 'tt0468569', 'tt0108052', 'tt1375666', 'tt0137523'];
const surpriseMovieIds = ['tt0110912', 'tt0167260', 'tt0133093', 'tt0080684', 'tt6751668', 'tt0076759', 'tt0109830', 'tt0050083'];

/**
 * Displays form validation errors to the user.
 * @param {Array} errors - Array of error messages.
 * @param {HTMLElement} container - The container to display errors in.
 */
function displayErrors(errors, container) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-messages';
    errorContainer.innerHTML = errors.map(error => `<p class="error">${error}</p>`).join('');
    
    // Remove any existing error messages
    const existingErrors = container.querySelector('.error-messages');
    if (existingErrors) {
        existingErrors.remove();
    }
    
    container.insertBefore(errorContainer, container.firstChild);
}

/**
 * Handles the search form submission with validation.
 * @param {Event} event - The form submission event.
 */
async function handleSearch(event) {
    event.preventDefault();
    
    const formData = {
        searchTerm: document.getElementById('search-input').value,
        type: document.getElementById('type-filter').value,
        year: document.getElementById('year-filter').value
    };

    const validation = validateSearchForm(formData);
    
    if (!validation.isValid) {
        displayErrors(validation.errors, searchForm);
        return;
    }

    toggleLoader(true);
    resultsContainer.innerHTML = '<h2>Search Results</h2>';

    const movies = await searchOMDb(
        validation.data.searchTerm,
        validation.data.type,
        validation.data.year
    );
    
    toggleLoader(false);
    renderMovies(movies, resultsContainer, false);
}

/**
 * Handles the "Surprise Me" button click.
 */
async function handleSurprise() {
    toggleLoader(true);
    resultsContainer.innerHTML = '<h2>Your Surprise Movie</h2>';

    const randomId = surpriseMovieIds[Math.floor(Math.random() * surpriseMovieIds.length)];
    const movie = await getMovieById(randomId);
    
    toggleLoader(false);
    if (movie) {
        renderMovies([movie], resultsContainer, false);
    } else {
        resultsContainer.innerHTML += '<p>Could not find a surprise movie. Please try again!</p>';
    }
}

/**
 * Loads and displays featured movies on page startup.
 */
async function loadFeaturedMovies() {
    featuredContainer.innerHTML = '<div class="loader"></div>';
    
    const moviePromises = featuredMovieIds.map(id => getMovieById(id));
    const movies = await Promise.all(moviePromises);
    
    renderMovies(movies.filter(movie => movie), featuredContainer, false);
}

/**
 * Handles the contact form submission with validation.
 * @param {Event} event - The form submission event.
 */
function handleContactSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    const validation = validateContactForm(data);
    
    if (!validation.isValid) {
        displayErrors(validation.errors, contactForm);
        return;
    }

    // Here you would typically send the sanitized data to a server
    // For now, we'll just show a success message
    alert('Thank you for your message! We will get back to you soon.');
    event.target.reset();
}

/**
 * Handles clicks on movie cards in the results and watchlist containers.
 * @param {Event} event - The click event.
 */
function handleContainerClick(event) {
    const card = event.target.closest('.movie-card');
    if (!card) return;

    const imdbId = card.dataset.imdbId;
    if (!imdbId) return;

    const isInWatchlist = getWatchlist().some(movie => movie.imdbID === imdbId);
    
    if (isInWatchlist) {
        removeMovieFromWatchlist(imdbId);
    } else {
        const movie = {
            imdbID: imdbId,
            Title: card.querySelector('h3').textContent,
            Year: card.querySelector('p').textContent,
            Poster: card.querySelector('img').src
        };
        addMovieToWatchlist(movie);
    }
    
    refreshWatchlistUI();
}

/**
 * Refreshes the watchlist UI with current watchlist data.
 */
function refreshWatchlistUI() {
    const watchlist = getWatchlist();
    renderMovies(watchlist, watchlistContainer, true);
}

/**
 * Handles smooth navigation to sections.
 * @param {Event} event - The click event.
 */
function handleNavigation(event) {
    const link = event.target.closest('.nav-link');
    if (!link) return;

    const targetId = link.getAttribute('href').substring(1); // Remove the # from href
    const targetSection = document.getElementById(targetId);
    
    if (targetSection) {
        event.preventDefault();
        
        // Close mobile menu if open
        const hamburger = document.querySelector('.hamburger');
        const navbarMenu = document.querySelector('.navbar-menu');
        if (hamburger && navbarMenu) {
            hamburger.classList.remove('active');
            navbarMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }

        // Scroll to section with smooth behavior
        targetSection.scrollIntoView({ behavior: 'smooth' });

        // Update active state of nav links
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        link.classList.add('active');
    }
}

/**
 * Initializes all necessary event listeners for the application.
 */
function initEventListeners() {
    searchForm.addEventListener('submit', handleSearch);
    surpriseBtn.addEventListener('click', handleSurprise);
    contactForm.addEventListener('submit', handleContactSubmit);
    resultsContainer.addEventListener('click', handleContainerClick);
    watchlistContainer.addEventListener('click', handleContainerClick);
    
    // Add navigation event listeners
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
}

export { initEventListeners, refreshWatchlistUI, loadFeaturedMovies }; 