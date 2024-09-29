// carDataFetcher.js

import { fetchResource } from './httpUtils.js';
import { formatCarData } from './formatCarData.js';  // Importing the initializer function

/**
 * Fetches the list of car folder names from the JSON file.
 * @param {string} filePath - The path to the JSON file.
 * @returns {Promise<string[]>} - A promise that resolves to an array of car folder names.
 */
async function getCarFolderNames(filePath) {
    const data = await fetchResource(filePath);
    return data?.carFolders || [];
}

/**
 * Fetches detailed data for cars listed in the specified JSON file (new or old).
 * @param {'new' | 'old'} carType - The type of cars to fetch data for ('new' or 'old').
 * @returns {Promise<Object[]>} - A promise that resolves to an array of car data objects.
 */
async function getAllCarData(carType) {
    let filePath;
    
    // Determine the file path based on the car type
    if (carType === 'new') {
        filePath = 'data/listings-new.json';
    } else if (carType === 'used') {
        filePath = 'data/listings.json';
    } else {
        throw new Error('Invalid car type. Please specify "new" or "old".');
    }

    const carFolderNames = await getCarFolderNames(filePath);
    
    if (carFolderNames.length === 0) return [];

    // Load car details for the specified folder names
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
