// fetchUtils.js

/**
 * Fetches a resource from the given file path and handles errors.
 * @param {string} filePath - The URL or file path to fetch.
 * @returns {Promise<Response|null>} - The response object if successful, otherwise null.
 */
async function fetchWithHandling(filePath) {
    try {
        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(`Failed to fetch from ${filePath}: ${response.status} ${response.statusText}`);
        }

        return response;
    } catch (error) {
        console.error(`Error fetching resource from ${filePath}:`, error);
        return null;
    }
}

/**
 * Loads HTML content from a file and inserts it into a specified container.
 * @param {HTMLElement} container - The DOM element where the HTML content will be inserted.
 * @param {string} filePath - The URL or file path of the HTML file to load.
 * @returns {Promise<void>} - Resolves when the HTML content has been successfully loaded and inserted.
 */
export async function loadHtml(container, filePath) {
    const response = await fetchWithHandling(filePath);
    
    if (response) {
        container.innerHTML = await response.text();
    }
}

/**
 * Fetches JSON data from a file.
 * @param {string} filePath - The URL or file path of the JSON file to fetch.
 * @returns {Promise<Object|null>} - The JSON data if successful, otherwise null.
 */
export async function fetchJson(filePath) {
    const response = await fetchWithHandling(filePath);

    if (response) {
        return response.json(); // Directly return the promise from .json()
    }

    return null;
}