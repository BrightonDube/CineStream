const WATCHLIST_KEY = 'cineStreamWatchlist';

/**
 * Retrieves the user's watchlist from localStorage.
 * @returns {Array} An array of movie objects, or an empty array if none exists.
 */
function getWatchlist() {
    try {
        const watchlistJSON = localStorage.getItem(WATCHLIST_KEY);
        return watchlistJSON ? JSON.parse(watchlistJSON) : [];
    } catch (error) {
        console.error("Could not retrieve watchlist:", error);
        return [];
    }
}

/**
 * Saves the entire watchlist to localStorage.
 * @param {Array} watchlist - The array of movie objects to save.
 */
function saveWatchlist(watchlist) {
    try {
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    } catch (error) {
        console.error("Could not save watchlist:", error);
    }
}

/**
 * Adds a single movie to the watchlist if it's not already present.
 * @param {object} movie - The movie object to add.
 * @returns {boolean} Returns true if the movie was added, false if it was already in the list.
 */
function addMovieToWatchlist(movie) {
    const watchlist = getWatchlist();
    const isAlreadyInList = watchlist.some(item => item.imdbID === movie.imdbID);
    if (isAlreadyInList) {
        return false;
    }
    watchlist.push(movie);
    saveWatchlist(watchlist);
    return true;
}

/**
 * Removes a movie from the watchlist by its IMDb ID.
 * @param {string} imdbId - The IMDb ID of the movie to remove.
 */
function removeMovieFromWatchlist(imdbId) {
    let watchlist = getWatchlist();
    watchlist = watchlist.filter(movie => movie.imdbID !== imdbId);
    saveWatchlist(watchlist);
}

export { getWatchlist, addMovieToWatchlist, removeMovieFromWatchlist }; 