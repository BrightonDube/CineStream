import { searchOMDb, getStreamingSources, getMovieById } from './api.js';
import { renderMovies, toggleLoader, resultsContainer, watchlistContainer, featuredContainer } from './ui.js';
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

    // Scroll to the results section
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Handles the "Surprise Me" button click.
 * Picks a random movie from the list and ensures a valid result.
 */
async function handleSurprise() {
    toggleLoader(true);
    resultsContainer.innerHTML = '<h2>Your Surprise Movie</h2>';

    // Shuffle the surpriseMovieIds array
    const shuffled = [...surpriseMovieIds].sort(() => 0.5 - Math.random());
    let movie = null;
    for (let i = 0; i < shuffled.length; i++) {
        movie = await getMovieById(shuffled[i]);
        if (movie) break;
    }

    toggleLoader(false);
    if (movie) {
        renderMovies([movie], resultsContainer, false);
    } else {
        resultsContainer.innerHTML += '<p>Could not find a surprise movie. Please try again!</p>';
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
 * @param {string} imdbId - The IMDb ID of the movie.
 */
async function showMovieDetails(imdbId) {
    toggleLoader(true);
    const movie = await getMovieById(imdbId);
    const sources = await getStreamingSources(imdbId);
    toggleLoader(false);

    if (!movie) {
        alert('Could not load movie details. Please try again.');
        return;
    }

    // Update modal content
    const modalTitle = movieModal.querySelector('#movie-modal-title');
    const modalImg = movieModal.querySelector('.movie-modal-img');
    const yearEl = movieModal.querySelector('.movie-year');
    const ratingEl = movieModal.querySelector('.movie-rating');
    const runtimeEl = movieModal.querySelector('.movie-runtime');
    const genreEl = movieModal.querySelector('.movie-genre');
    const plotEl = movieModal.querySelector('.movie-plot');
    const sourcesEl = movieModal.querySelector('.streaming-sources');
    const watchlistBtn = movieModal.querySelector('.add-to-watchlist-btn');

    modalTitle.textContent = movie.Title;
    modalImg.src = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster';
    modalImg.alt = `Poster for ${movie.Title}`;
    yearEl.textContent = `Year: ${movie.Year}`;
    ratingEl.textContent = `IMDb Rating: ${movie.imdbRating || 'N/A'}`;
    runtimeEl.textContent = `Runtime: ${movie.Runtime || 'N/A'}`;
    genreEl.textContent = `Genre: ${movie.Genre || 'N/A'}`;
    plotEl.textContent = movie.Plot || 'No plot available.';

    // Update streaming sources
    sourcesEl.innerHTML = '';
    if (sources && sources.length > 0) {
        sources.forEach(source => {
            const link = document.createElement('a');
            link.href = source.web_url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = source.name;
            sourcesEl.appendChild(link);
        });
    } else {
        sourcesEl.innerHTML = '<p>No streaming sources found.</p>';
    }

    // Update watchlist button
    const isInWatchlist = getWatchlist().some(m => m.imdbID === imdbId);
    if (isInWatchlist) {
        watchlistBtn.textContent = '';
        watchlistBtn.className = 'remove-from-watchlist-btn';
        const icon = document.createElement('span');
        icon.className = 'icon-trash';
        icon.innerHTML = '🗑️';
        watchlistBtn.appendChild(icon);
        watchlistBtn.appendChild(document.createTextNode('Remove from Watchlist'));
    } else {
        watchlistBtn.textContent = 'Add to Watchlist';
        watchlistBtn.className = 'add-to-watchlist-btn';
    }
    watchlistBtn.onclick = () => {
        if (isInWatchlist) {
            removeMovieFromWatchlist(imdbId);
        } else {
            addMovieToWatchlist({
                imdbID: imdbId,
                Title: movie.Title,
                Year: movie.Year,
                Poster: movie.Poster
            });
        }
        refreshWatchlistUI();
        hideModal(movieModal);
    };

    showModal(movieModal);
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

    showMovieDetails(imdbId);
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
    featuredContainer.addEventListener('click', handleContainerClick);
    
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

    // Close modal when clicking overlay
    modalOverlay.addEventListener('click', () => {
        document.querySelectorAll('.modal.active').forEach(modal => {
            hideModal(modal);
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                hideModal(modal);
            });
        }
    });
}

export { initEventListeners, refreshWatchlistUI, loadFeaturedMovies }; 