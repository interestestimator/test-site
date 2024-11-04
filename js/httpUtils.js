// httpUtils.js

/**
 * General fetch function that handles different content types and errors.
 * @param {string} url - The URL or file path to fetch.
 * @param {string} [responseType='json'] - The type of response expected ('json', 'text').
 * @returns {Promise<any|null>} - The parsed response (JSON or text) if successful, otherwise null.
 */
async function fetchResource(url, responseType = 'json') {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch from ${url}: ${response.status} ${response.statusText}`);
        }

        // Return response based on the expected type
        return responseType === 'text' ? await response.text() : await response.json();
    } catch (error) {
        console.error(`Error fetching resource from ${url}:`, error);
        return null;
    }
}

/**
 * Loads HTML content from a file and inserts it into a specified container.
 * @param {HTMLElement} container - The DOM element where the HTML content will be inserted.
 * @param {string} url - The URL or file path of the HTML file to load.
 * @returns {Promise<void>} - Resolves when the HTML content has been successfully loaded and inserted.
 */
async function loadHtml(container, url) {
    const htmlContent = await fetchResource(url, 'text');
    if (htmlContent) container.innerHTML = htmlContent;
}

// Export functions
export {
    fetchResource,
    loadHtml
};