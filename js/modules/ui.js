import { getStreamingSources } from './api.js';

const resultsContainer = document.getElementById('results-container');
const watchlistContainer = document.getElementById('watchlist-container');
const loader = document.getElementById('loader');
const featuredContainer = document.getElementById('featured-container');

/**
 * Creates a movie card element with lazy loading for the poster.
 * @param {Object} movie - The movie data object.
 * @returns {HTMLElement} The movie card element.
 */
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.setAttribute('data-imdb-id', movie.imdbID);

    const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster';
    
    card.innerHTML = `
        <div class="movie-poster">
            <img class="lazy-image" 
                 data-src="${posterUrl}" 
                 alt="${movie.Title} poster"
                 loading="lazy">
        </div>
        <div class="movie-info">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
            <p>${movie.Type}</p>
        </div>
    `;

    // Initialize lazy loading
    const img = card.querySelector('img');
    if ('loading' in HTMLImageElement.prototype) {
        img.src = img.dataset.src;
        img.classList.add('loaded');
    } else {
        // Fallback for browsers that don't support native lazy loading
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        observer.observe(img);
    }

    return card;
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
 * Renders an array of movies in the specified container.
 * @param {Array} movies - Array of movie objects to render.
 * @param {HTMLElement} container - The container element to render movies in.
 * @param {boolean} isWatchlist - Whether this is the watchlist container.
 */
function renderMovies(movies, container, isWatchlist = false) {
    if (!movies || movies.length === 0) {
        container.innerHTML = '<p class="no-results">No movies found.</p>';
        return;
    }

    container.innerHTML = '';
    movies.forEach(movie => {
        const card = createMovieCard(movie);
        container.appendChild(card);
    });
}

/**
 * Toggles the visibility of the loader element.
 * @param {boolean} show - Whether to show or hide the loader.
 */
function toggleLoader(show) {
    if (show) {
        loader.classList.remove('hidden');
    } else {
        loader.classList.add('hidden');
    }
}

export { renderMovies, toggleLoader, resultsContainer, watchlistContainer, featuredContainer }; 