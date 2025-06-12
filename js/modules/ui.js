import { getStreamingSources } from './api.js';

const resultsContainer = document.getElementById('results-container');
const watchlistContainer = document.getElementById('watchlist-container');
const loader = document.getElementById('loader');

/**
 * Creates a movie card element from a movie object.
 * @param {object} movie - A movie data object (must contain imdbID, Title, Year, Poster).
 * @param {boolean} isInWatchlist - Indicates if the card is for the watchlist (changes button text).
 * @returns {HTMLElement} The created movie card element.
 */
function createMovieCard(movie, isInWatchlist = false) {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';
    movieCard.dataset.imdbId = movie.imdbID;
    movieCard.dataset.title = movie.Title;
    movieCard.dataset.year = movie.Year;
    movieCard.dataset.poster = movie.Poster;

    const buttonText = isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist';
    const buttonClass = isInWatchlist ? 'remove-from-watchlist-btn' : 'add-to-watchlist-btn';

    movieCard.innerHTML = `
        <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450.png?text=No+Image+Available'}" alt="Poster for ${movie.Title}">
        <div class="movie-info">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
            <div class="streaming-sources" id="sources-${movie.imdbID}"><p>Loading sources...</p></div>
            <button class="${buttonClass} action-btn" aria-label="${buttonText}">${buttonText}</button>
        </div>
    `;
    return movieCard;
}

/**
 * Updates a specific movie card with its streaming source information.
 * @param {string} imdbId - The IMDb ID of the movie card to update.
 * @param {Array} sources - An array of streaming source objects from Watchmode.
 */
function updateCardWithSources(imdbId, sources) {
    const sourcesContainer = document.getElementById(`sources-${imdbId}`);
    if (!sourcesContainer) return;

    if (sources.length === 0) {
        sourcesContainer.innerHTML = '<p>Not available on any subscription services.</p>';
    } else {
        sourcesContainer.innerHTML = sources.map(source => 
            `<a href="${source.web_url}" target="_blank" rel="noopener noreferrer">${source.name}</a>`
        ).join('');
    }
}

/**
 * Renders an array of movies to the specified container.
 * @param {Array} movies - An array of movie objects.
 * @param {HTMLElement} container - The DOM element to render into.
 * @param {boolean} isWatchlist - Flag to determine button text/class.
 */
function renderMovies(movies, container, isWatchlist = false) {
    container.innerHTML = '';
    if (!movies || movies.length === 0) {
        const message = isWatchlist ? 'Your watchlist is empty.' : 'No movies found.';
        container.innerHTML = `<p>${message}</p>`;
        return;
    }
    movies.forEach(movie => {
        const movieCard = createMovieCard(movie, isWatchlist);
        container.appendChild(movieCard);
        getStreamingSources(movie.imdbID).then(sources => updateCardWithSources(movie.imdbID, sources));
    });
}

/**
 * Toggles the visibility of the loading spinner.
 * @param {boolean} isVisible - If true, the loader is shown.
 */
function toggleLoader(isVisible) {
    loader.classList.toggle('hidden', !isVisible);
}

export { renderMovies, toggleLoader, resultsContainer, watchlistContainer }; 