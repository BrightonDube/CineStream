import { initEventListeners, refreshWatchlistUI } from './modules/events.js';
import { initLayout } from './modules/layout.js';

/**
 * The main entry point for the application.
 * This function is called once the DOM is fully loaded.
 */
function main() {
    initEventListeners();
    initLayout();
    refreshWatchlistUI();
}

// Initialize the app
main(); 