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
 * @param {boolean} isNewCar - Indicates whether to fetch data for new cars (true) or used cars (false).
 * @returns {Promise<Object[]>} - A promise that resolves to an array of car data objects.
 */
async function getAllCarData(isNewCar = false) {
    const filePath = isNewCar ? 'data/listings-new.json' : 'data/listings.json'; 

    console.log(isNewCar)

    const carFolderNames = await getCarFolderNames(filePath);
    
    if (carFolderNames.length === 0) return [];

    // Load car details for the specified folder names with the isNewCar flag
    const carDetailsPromises = carFolderNames.map(folderName => loadCarDetails(folderName, isNewCar));
    const carDetails = await Promise.all(carDetailsPromises);

    return carDetails.filter(Boolean);
}

/**
 * Fetches and initializes detailed data for a specific car folder.
 * @param {string} folderName - The name of the car folder to fetch.
 * @param {boolean} isNewCar - Indicates whether the car is new (true) or used (false).
 * @returns {Promise<Object|null>} - A promise that resolves to the initialized car data if successful, otherwise null.
 */
async function loadCarDetails(folderName, isNewCar) {
    const carData = await fetchResource(`${folderName}/data.json`);
    return carData ? formatCarData(carData, isNewCar) : null;
}

// Export functions
export { 
    getAllCarData,
    loadCarDetails
};