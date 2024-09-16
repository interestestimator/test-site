// carDataFetcher.js

import { fetchResource } from './httpUtils.js';
import { formatCarData } from './formatCarData.js';  // Importing the initializer function

/**
 * Fetches the list of car folder names from the JSON file.
 * @returns {Promise<string[]>} - A promise that resolves to an array of car folder names.
 */
async function getCarFolderNames() {
    const data = await fetchResource('../data/listings.json');
    return data?.carFolders || [];
}

/**
 * Fetches detailed data for all cars listed in the JSON file.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of car data objects.
 */
async function getAllCarData() {
    const carFolderNames = await getCarFolderNames();
    if (carFolderNames.length === 0) return [];

    const carDetailsPromises = carFolderNames.map(loadCarDetails);
    const carDetails = await Promise.all(carDetailsPromises);

    return carDetails.filter(Boolean);
}

/**
 * Fetches and initializes detailed data for a specific car folder.
 * @param {string} folderName - The name of the car folder to fetch.
 * @returns {Promise<Object|null>} - A promise that resolves to the initialized car data if successful, otherwise null.
 */
async function loadCarDetails(folderName) {
    const carData = await fetchResource(`${folderName}/data.json`);
    return carData ? formatCarData(carData) : null;
}

// Export functions
export { 
    getAllCarData,
    loadCarDetails
};