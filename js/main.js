import { initEventListeners, refreshWatchlistUI } from './modules/events.js';

/**
 * The main entry point for the application.
 * This function is called once the DOM is fully loaded.
 */
function main() {
    initEventListeners();
    refreshWatchlistUI();
    console.log("CineStream App Initialized Successfully.");
}

// Initialize the app
main(); 