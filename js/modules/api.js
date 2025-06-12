// IMPORTANT: Replace placeholders with your actual API keys
const OMDb_API_KEY = 'YOUR_OMDB_API_KEY_HERE';
const WATCHMODE_API_KEY = 'YOUR_WATCHMODE_API_KEY_HERE';

/**
 * Searches the OMDb API for movies.
 * @param {string} searchTerm - The title of the movie to search for.
 * @returns {Promise<Array|null>} A promise that resolves to an array of movie results or null on error/no results.
 */
async function searchOMDb(searchTerm) {
    const url = `https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&type=movie&apikey=${OMDb_API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`OMDb API request failed with status: ${response.status}`);
        const data = await response.json();
        return data.Response === "True" ? data.Search : null;
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
    const url = `https://api.watchmode.com/v1/title/${imdbId}/sources/?apiKey=${WATCHMODE_API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Watchmode API request failed with status: ${response.status}`);
        const data = await response.json();
        // Filter for unique subscription-based services only
        const uniqueSources = data.filter(
            (source, index, self) =>
            source.type === 'sub' && self.findIndex(s => s.source_id === source.source_id) === index
        );
        return uniqueSources;
    } catch (error) {
        console.error(`Error fetching sources for IMDb ID ${imdbId}:`, error);
        return [];
    }
}

export { searchOMDb, getStreamingSources }; 