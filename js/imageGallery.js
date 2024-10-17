// imageGallery.js

import { preloadImages, setupImageEventListeners } from './imageNavigation.js';

/**
 * Initializes the image gallery for the specified vehicle and updates the UI.
 * @param {Object} currentCarData - The current car data containing image information.
 * @param {string} gallery - The type of gallery (e.g., 'exterior', 'interior').
 * @param {boolean} showTitle - Whether to show the gallery title.
 * @param {Object} state - The application state containing galleries and other info.
 * @param {string} [basePath='listings-nuevos'] - The base path for image URLs, defaults to 'listings-nuevos'.
 */
function initializeImageGallery(currentCarData, gallery, showTitle, state, basePath = 'listings-nuevos') {
    const imageCount = currentCarData[`${gallery}Images`];
    const colors = currentCarData[`${gallery}Colours`] || []; // Get colors array

    const galleryContainer = document.getElementById(`${gallery}GalleryContainer`);

    if (shouldRemoveGallery(imageCount, galleryContainer)) return;

    galleryContainer.innerHTML = createImageGallerySection(gallery, showTitle);

    // Generate image URLs using the provided base path
    const imagesUrlList = generateImageUrlList(state.carId, gallery, imageCount, basePath);
    state.galleries[gallery].imagesUrlList = imagesUrlList;
    state.galleries[gallery].colors = colors; // Add colors to state

    preloadImages(gallery, state, document.getElementById(`${gallery}ThumbnailContainer`));
    setupImageEventListeners(
        state,
        document.getElementById(`${gallery}PrevImage`),
        document.getElementById(`${gallery}NextImage`),
        document.getElementById(`${gallery}ImageContainer`),
        document.getElementById(`${gallery}Image`),
        document.getElementById(`${gallery}PhotoCountLabel`),
        document.getElementById(`${gallery}ThumbnailContainer`),
        gallery
    );

    // Pass only the first color to setInitialImageAndCount
    const firstColor = colors[0] || ''; // Default to empty string if no color
    setInitialImageAndCount(gallery, imagesUrlList, imageCount, state, firstColor);
}

/**
 * Creates the HTML structure for the image gallery section.
 * @param {string} gallery - The type of gallery (e.g., 'exterior', 'interior').
 * @param {boolean} [showTitle=false] - Whether to show the gallery title.
 * @returns {string} - The HTML structure for the gallery.
 */
function createImageGallerySection(gallery, showTitle = false) {
    const titleHtml = showTitle ? generateTitleHtml(gallery) : '';
    
    return `
        ${titleHtml}
        <div id="${gallery}ImageContainer" class="image-container">
            <img id="${gallery}Image" class="car-image" alt="${gallery} Image">
            <div class="nav-button-container">
                ${generateNavigationButtons(gallery)}
            </div>
            <label id="${gallery}PhotoCountLabel" class="photo-count-label"></label>
        </div>
        <div id="${gallery}ThumbnailContainer" class="thumbnail-container"></div>
    `;
}

/**
 * Generates the HTML for the gallery title.
 * @param {string} gallery - The type of gallery.
 * @returns {string} - The HTML string for the title.
 */
function generateTitleHtml(gallery) {
    return `<div class="container-title h2">${gallery} options</div>`;
}

/**
 * Generates the HTML for navigation buttons.
 * @param {string} gallery - The type of gallery.
 * @returns {string} - The HTML string for navigation buttons.
 */
function generateNavigationButtons(gallery) {
    return `
        <button id="${gallery}PrevImage" class="nav-button" aria-label="Previous image">&lt;</button>
        <button id="${gallery}NextImage" class="nav-button" aria-label="Next image">&gt;</button>
    `;
}

/**
 * Checks if the gallery should be removed based on image count.
 * @param {number} imageCount - The number of images in the gallery.
 * @param {HTMLElement} galleryContainer - The gallery container element.
 * @returns {boolean} - True if the gallery should be removed, otherwise false.
 */
function shouldRemoveGallery(imageCount, galleryContainer) {
    if (imageCount === 0) {
        galleryContainer?.remove(); // Optional chaining for safety
        return true; // Skip further initialization for this gallery
    }
    return false;
}

/**
 * Generates a list of image URLs based on the car ID and gallery type.
 * @param {string} carId - The ID of the car.
 * @param {string} gallery - The type of gallery (e.g., 'exterior', 'interior').
 * @param {number} imageCount - The number of images to generate URLs for.
 * @param {string} [basePath='listings-nuevos'] - The base path for image URLs, defaults to 'listings-nuevos'.
 * @returns {string[]} - An array of generated image URLs.
 */
function generateImageUrlList(carId, gallery, imageCount, basePath = 'listings-nuevos') {
    return Array.from({ length: imageCount }, (_, i) => 
        `${basePath}/${carId}/images/${gallery}/${i + 1}.webp`
    );
}

/**
 * Sets the initial image and photo count label in the gallery.
 * @param {string} gallery - The type of gallery.
 * @param {string[]} imagesUrlList - The list of image URLs.
 * @param {number} imageCount - The number of images.
 * @param {Object} state - The application state containing the current image index.
 * @param {string} imageColour - The first color of the vehicle.
 */
function setInitialImageAndCount(gallery, imagesUrlList, imageCount, state, imageColour) {
    const carImageElement = document.getElementById(`${gallery}Image`);
    carImageElement.src = imagesUrlList[0];

    const photoCountLabel = document.getElementById(`${gallery}PhotoCountLabel`);
    photoCountLabel.innerHTML = `
        <img src="icons/ui/actions/photo-count.svg" alt="Info Icon" width="16" height="16">
        ${state.galleries[gallery].currentImageIdx + 1} of ${imageCount}${imageColour ? `: ${imageColour}` : ''} 
    `;
}

// Export functions
export {
    initializeImageGallery
};

