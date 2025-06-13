// IMPORTANT: Replace placeholders with your actual API keys
const OMDb_API_KEY = 'b02ef26f';
const WATCHMODE_API_KEY = '5QUiaWeDU2cPgQs6LF7S8uSmYkSaHvhPCeoGoebi'; // Add your Watchmode API key here

/**
 * Searches the OMDb API for movies. NOW WITH FILTERS AND PAGINATION.
 * @param {string} searchTerm - The title of the movie to search for.
 * @param {string} type - The type to filter by.
 * @param {string} year - The year to filter by.
 * @param {number} page - The page number of results to retrieve.
 * @returns {Promise<object|null>} A promise that resolves to the API response object (with Search and totalResults) or null.
 */
async function searchOMDb(searchTerm, type = '', year = '', page = 1) {
    let url = `https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=${OMDb_API_KEY}&page=${page}`;
    if (type) url += `&type=${type}`;
    if (year) url += `&y=${year}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`OMDb API request failed: ${response.status}`);
        const data = await response.json();
        // Return the whole object now, not just data.Search
        return data.Response === "True" ? data : null;
    } catch (error) {
        console.error("Error fetching from OMDb:", error);
        return null;
    }
}

/**
 * Fetches streaming sources for a movie from Watchmode using its IMDb ID.
 * @param {string} imdbId - The IMDb ID of the movie (e.g., 'tt0133093').
 * @returns {Promise<Array>} A promise that resolves to a filtered array of unique subscription sources.
 */
async function getStreamingSources(imdbId) {
    if (!WATCHMODE_API_KEY) {
        return [{
            name: 'Watchmode API key not configured',
            web_url: 'https://api.watchmode.com/',
            type: 'sub'
        }];
    }

    const url = `https://api.watchmode.com/v1/title/${imdbId}/sources/?apiKey=${WATCHMODE_API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Watchmode API request failed with status: ${response.status}`);
        const data = await response.json();
        // Filter for unique subscription-based services only
        const uniqueSources = data.filter((source, index, self) => 
            source.type === 'sub' && self.findIndex(s => s.source_id === source.source_id) === index
        );
        return uniqueSources;
    } catch (error) {
        console.error(`Error fetching sources for IMDb ID ${imdbId}:`, error);
        return [];
    }
}

/**
 * Get a single, detailed movie result by its ID.
 * @param {string} imdbId - The IMDb ID of the movie.
 * @returns {Promise<object|null>} A promise resolving to the detailed movie object.
 */
async function getMovieById(imdbId) {
    const url = `https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDb_API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`OMDb API by ID request failed: ${response.status}`);
        const data = await response.json();
        return data.Response === "True" ? data : null;
    } catch (error) {
        console.error("Error fetching movie by ID:", error);
        return null;
    }
}

export { searchOMDb, getStreamingSources, getMovieById }; 