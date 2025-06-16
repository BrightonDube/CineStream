import { initEventListeners, refreshWatchlistUI, loadFeaturedMovies, populateGenres } from './modules/events.js';
import { initLayout } from './modules/layout.js';

function main() {
    initEventListeners();
    refreshWatchlistUI();
    loadFeaturedMovies();
    initLayout();
    populateGenres();
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', main); 