import { searchOMDb } from './api.js';
import { renderMovies, toggleLoader, resultsContainer, watchlistContainer } from './ui.js';
import { getWatchlist, addMovieToWatchlist, removeMovieFromWatchlist } from './storage.js';

const searchForm = document.getElementById('search-form');

/**
 * Handles the search form submission. Fetches and displays movie results.
 * @param {Event} event - The form submission event.
 */
async function handleSearch(event) {
    event.preventDefault();
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {
        alert('Please enter a movie title.');
        return;
    }

    toggleLoader(true);
    resultsContainer.innerHTML = ''; // Clear results immediately

    const movies = await searchOMDb(searchTerm);
    toggleLoader(false);
    renderMovies(movies, resultsContainer, false);
    searchInput.value = '';
}

/**
 * Handles click events on both results and watchlist containers using event delegation.
 * @param {Event} event - The click event.
 */
function handleContainerClick(event) {
    const target = event.target;
    const movieCard = target.closest('.movie-card');

    if (!movieCard) return;

    const movieData = {
        imdbID: movieCard.dataset.imdbId,
        Title: movieCard.dataset.title,
        Year: movieCard.dataset.year,
        Poster: movieCard.dataset.poster,
    };

    if (target.matches('.add-to-watchlist-btn')) {
        const wasAdded = addMovieToWatchlist(movieData);
        alert(wasAdded ? `${movieData.Title} added to watchlist.` : `${movieData.Title} is already in your watchlist.`);
        refreshWatchlistUI();
    } else if (target.matches('.remove-from-watchlist-btn')) {
        removeMovieFromWatchlist(movieData.imdbID);
        refreshWatchlistUI();
    }
}

/**
 * Refreshes the watchlist UI from localStorage data.
 */
function refreshWatchlistUI() {
    const watchlist = getWatchlist();
    renderMovies(watchlist, watchlistContainer, true);
}

/**
 * Initializes all necessary event listeners for the application.
 */
function initEventListeners() {
    searchForm.addEventListener('submit', handleSearch);
    resultsContainer.addEventListener('click', handleContainerClick);
    watchlistContainer.addEventListener('click', handleContainerClick);
}

export { initEventListeners, refreshWatchlistUI }; 