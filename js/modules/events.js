import { searchOMDb, getStreamingSources, getMovieById } from './api.js';
import { 
    renderMovies, 
    toggleLoader, 
    resultsContainer, 
    watchlistContainer, 
    featuredContainer,
    genreContainer,
    paginationContainer,
    renderPagination 
} from './ui.js';
import { getWatchlist, addMovieToWatchlist, removeMovieFromWatchlist } from './storage.js';
import { validateSearchForm, validateContactForm } from './form-utils.js';

const searchForm = document.getElementById('search-form');
const surpriseBtn = document.getElementById('surprise-btn');
const contactForm = document.getElementById('contact-form');
const navLinks = document.querySelectorAll('.nav-link');
const contactModal = document.getElementById('contact-modal');
const movieModal = document.getElementById('movie-modal');
const modalOverlay = document.querySelector('.modal-overlay');

// A pre-defined list of high-quality movie IMDb IDs for new features
const featuredMovieIds = ['tt0111161', 'tt0068646', 'tt0468569', 'tt0108052', 'tt1375666', 'tt0137523'];
const surpriseMovieIds = ['tt0110912', 'tt0167260', 'tt0133093', 'tt0080684', 'tt6751668', 'tt0076759', 'tt0109830', 'tt0050083'];

// Add state management object
const state = {
    currentPage: 1,
    lastSearchTerm: '',
    lastSearchType: '',
    lastSearchYear: '',
    totalResults: 0,
};

// Add genre list
const genres = [
    { name: 'Action', term: 'action' },
    { name: 'Comedy', term: 'comedy' },
    { name: 'Sci-Fi', term: 'sci-fi' },
    { name: 'Horror', term: 'horror' },
    { name: 'Romance', term: 'romance' }
];

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
 * Performs a search and updates the UI and state.
 * @param {string} term - The search term.
 * @param {string} type - The search type filter.
 * @param {string} year - The search year filter.
 * @param {number} page - The page number.
 * @returns {Promise<void>}
 */
async function performSearch(term, type, year, page) {
    toggleLoader(true);
    resultsContainer.innerHTML = '';
    
    const response = await searchOMDb(term, type, year, page);
    
    toggleLoader(false);
    if (response) {
        renderMovies(response.Search, resultsContainer, false);
        renderPagination(state.currentPage, response.totalResults);
        state.totalResults = response.totalResults;
    } else {
        renderMovies(null, resultsContainer, false);
        renderPagination(0, 0); // Clear pagination
    }
}

/**
 * Handles the search form submission and displays results.
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>}
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

    // Update state for pagination
    state.currentPage = 1;
    state.lastSearchTerm = validation.data.searchTerm;
    state.lastSearchType = validation.data.type;
    state.lastSearchYear = validation.data.year;

    await performSearch(validation.data.searchTerm, validation.data.type, validation.data.year, 1);

    // Scroll to results section after rendering
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Handles the "Surprise Me" button click to show a random movie.
 * @param {Event} event - The click event.
 * @returns {Promise<void>}
 */
async function handleSurprise(event) {
    event.preventDefault();
    toggleLoader(true);
    
    const randomId = surpriseMovieIds[Math.floor(Math.random() * surpriseMovieIds.length)];
    const movie = await getMovieById(randomId);
    
    toggleLoader(false);
    if (movie) {
        showMovieDetails(movie);
    }
}

/**
 * Loads and displays featured movies.
 */
async function loadFeaturedMovies() {
    const featuredContainer = document.getElementById('featured-container');
    if (!featuredContainer) return;

    try {
        toggleLoader(true);
        const movies = await Promise.all(
            featuredMovieIds.map(id => getMovieById(id))
        );
        
        const validMovies = movies.filter(movie => movie !== null);
        if (validMovies.length > 0) {
            renderMovies(validMovies, featuredContainer);
        } else {
            featuredContainer.innerHTML = '<p>No featured movies available at the moment.</p>';
        }
    } catch (error) {
        console.error('Error loading featured movies:', error);
        featuredContainer.innerHTML = '<p>Error loading featured movies. Please try again later.</p>';
    } finally {
        toggleLoader(false);
    }
}

/**
 * Refreshes the watchlist UI with current data.
 */
function refreshWatchlistUI() {
    const watchlist = getWatchlist();
    renderMovies(watchlist, watchlistContainer, true);
}

/**
 * Shows a modal by adding the 'active' class.
 * @param {HTMLElement} modal - The modal element to show.
 */
function showModal(modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

/**
 * Hides a modal by removing the 'active' class.
 * @param {HTMLElement} modal - The modal element to hide.
 */
function hideModal(modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

/**
 * Handles the contact form submission with validation and modal.
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
    showModal(contactModal);
    event.target.reset();
}

/**
 * Shows movie details in a modal.
 * @param {Object} movie - The movie object to display.
 * @returns {Promise<void>}
 */
async function showMovieDetails(movie) {
    const modal = document.getElementById('movie-modal');
    const modalContent = modal.querySelector('.modal-content');
    
    // Get streaming sources
    const sources = await getStreamingSources(movie.imdbID);
    
    // Check if movie is in watchlist
    const watchlist = getWatchlist();
    const isInWatchlist = watchlist.some(item => item.imdbID === movie.imdbID);
    
    // Update modal content
    modalContent.innerHTML = `
        <button class="modal-close-btn" aria-label="Close modal">&times;</button>
        <div class="movie-modal-content">
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'images/no-poster.jpg'}" 
                 alt="${movie.Title} poster" 
                 class="movie-modal-poster">
            <div class="movie-modal-info">
                <h2>${movie.Title}</h2>
                <p><strong>Year:</strong> ${movie.Year}</p>
                <p><strong>Type:</strong> ${movie.Type}</p>
                <p><strong>IMDb ID:</strong> ${movie.imdbID}</p>
                ${sources ? `
                    <div class="movie-modal-streaming">
                        <h3>Available On:</h3>
                        <div class="streaming-sources">
                            ${sources.map(source => `
                                <a href="${source.web_url}" target="_blank" rel="noopener noreferrer">
                                    ${source.name}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                <button class="action-btn ${isInWatchlist ? 'remove-from-watchlist-btn' : 'add-to-watchlist-btn'}"
                        data-imdb-id="${movie.imdbID}">
                    ${isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </button>
            </div>
        </div>
    `;
    
    // Show modal
    modal.classList.add('active');
    
    // Add event listener for close button
    const closeBtn = modalContent.querySelector('.modal-close-btn');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
}

/**
 * Handles clicks on movie cards to show details.
 * @param {Event} event - The click event.
 * @returns {Promise<void>}
 */
async function handleContainerClick(event) {
    const movieCard = event.target.closest('.movie-card');
    if (!movieCard) return;
    
    const imdbId = movieCard.dataset.imdbId;
    if (!imdbId) return;
    
    const movie = await getMovieById(imdbId);
    if (movie) {
        showMovieDetails(movie);
    }
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
 * Handles genre button clicks.
 * @param {Event} event - The click event.
 * @returns {Promise<void>}
 */
function handleGenreClick(event) {
    if (!event.target.matches('.genre-btn')) return;
    const searchTerm = event.target.dataset.term;
    
    // Reset state and perform a search for the genre term
    state.currentPage = 1;
    state.lastSearchTerm = searchTerm;
    state.lastSearchType = 'movie'; // Default to movie for genre searches
    state.lastSearchYear = '';

    performSearch(searchTerm, 'movie', '', 1);
}

/**
 * Handles pagination button clicks.
 * @param {Event} event - The click event.
 * @returns {Promise<void>}
 */
async function handlePaginationClick(event) {
    const targetId = event.target.id;
    if (targetId === 'next-btn') {
        state.currentPage++;
    } else if (targetId === 'prev-btn') {
        state.currentPage--;
    } else {
        return; // Exit if not a pagination button
    }
    await performSearch(state.lastSearchTerm, state.lastSearchType, state.lastSearchYear, state.currentPage);
}

/**
 * Populates the genre buttons in the UI.
 */
function populateGenres() {
    genreContainer.innerHTML = genres.map(genre => 
        `<button class="genre-btn" data-term="${genre.term}">${genre.name}</button>`
    ).join('');
}

/**
 * Initializes all event listeners for the application.
 */
function initEventListeners() {
    searchForm.addEventListener('submit', handleSearch);
    surpriseBtn.addEventListener('click', handleSurprise);
    contactForm.addEventListener('submit', handleContactSubmit);
    resultsContainer.addEventListener('click', handleContainerClick);
    watchlistContainer.addEventListener('click', handleContainerClick);
    featuredContainer.addEventListener('click', handleContainerClick);
    genreContainer.addEventListener('click', handleGenreClick);
    paginationContainer.addEventListener('click', handlePaginationClick);
    
    // Add navigation event listeners
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Modal close buttons
    document.querySelectorAll('.modal-close, .modal-ok-btn').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            hideModal(modal);
        });
    });

    modalOverlay.addEventListener('click', () => {
        document.querySelectorAll('.modal.active').forEach(modal => {
            hideModal(modal);
        });
    });
}

export { initEventListeners, refreshWatchlistUI, loadFeaturedMovies, populateGenres }; 