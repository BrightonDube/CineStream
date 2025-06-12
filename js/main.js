import { initEventListeners, refreshWatchlistUI, loadFeaturedMovies } from './modules/events.js';
import { initLayout } from './modules/layout.js';

/**
 * The main entry point for the application.
 * This function is called once the DOM is fully loaded.
 */
function main() {
    initEventListeners();
    refreshWatchlistUI();
    loadFeaturedMovies();
    initLayout();
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', main); 