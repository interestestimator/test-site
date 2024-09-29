// imageNavigation.js

/**
 * Preloads images by setting their `src` attribute and renders thumbnails.
 * @param {string[]} imageUrlList - The list of image URLs to preload.
 * @param {Object} state - The state object to update with image URLs.
 * @param {HTMLElement} thumbnailContainer - The container element for thumbnails.
 */
function preloadImages(imageUrlList, state, thumbnailContainer) {
    // Preload images
    imageUrlList.forEach(url => new Image().src = url);
    state.imageUrlList = imageUrlList;  // Ensure state is updated
    renderThumbnails(state, thumbnailContainer);
}

// Function to update the image and related UI elements
/**
 * Updates the main image and photo count label, and adjusts thumbnails if needed.
 * @param {Object} state - The state object with current image index and data.
 * @param {HTMLImageElement} carImage - The main image element.
 * @param {HTMLElement} photoCountLabel - The element showing the photo count.
 */
function updateImage(state, carImage, photoCountLabel, thumbnailContainer) {
    if (!carImage || !photoCountLabel) return;

    const { currentImageIdx, imageUrlList, currentCarData, thumbnailStartIdx, thumbnailLimit } = state;

    carImage.src = imageUrlList[currentImageIdx];
    carImage.alt = `${currentCarData.brand} ${currentCarData.model} ${currentCarData.year}`;

    photoCountLabel.innerHTML = `<img src="icons/ui/actions/photo-count.svg" alt="Info Icon" width="16" height="16">${currentImageIdx + 1} of ${imageUrlList.length}`;

    // Update thumbnail start index if necessary
    const maxIndex = thumbnailStartIdx + thumbnailLimit;
    if (currentImageIdx < thumbnailStartIdx) {
        state.thumbnailStartIdx = currentImageIdx;
    } else if (currentImageIdx >= maxIndex) {
        state.thumbnailStartIdx = Math.max(currentImageIdx - thumbnailLimit + 1, 0);
    }

    renderThumbnails(state, thumbnailContainer);
}

// Function to show a specific image
/**
 * Shows the image at the specified index.
 * @param {number} index - The index of the image to show.
 * @param {Object} state - The state object to update with the new image index.
 * @param {HTMLImageElement} carImage - The main image element.
 * @param {HTMLElement} photoCountLabel - The element showing the photo count.
 */
function showImage(index, state, carImage, photoCountLabel, thumbnailContainer) {
    if (index >= 0 && index < state.imageUrlList.length) {
        state.currentImageIdx = index;
        
        updateImage(state, carImage, photoCountLabel, thumbnailContainer);
    }
}

// Function to show the previous image
/**
 * Shows the previous image in the sequence, wrapping around to the end if needed.
 * @param {Object} state - The state object to update with the new image index.
 * @param {HTMLImageElement} carImage - The main image element.
 * @param {HTMLElement} photoCountLabel - The element showing the photo count.
 */
function showPrevImage(state, carImage, photoCountLabel, thumbnailContainer) {
    const { currentImageIdx, imageUrlList } = state;
    showImage((currentImageIdx - 1 + imageUrlList.length) % imageUrlList.length, state, carImage, photoCountLabel, thumbnailContainer);
}

// Function to show the next image
/**
 * Shows the next image in the sequence, wrapping around to the start if needed.
 * @param {Object} state - The state object to update with the new image index.
 * @param {HTMLImageElement} carImage - The main image element.
 * @param {HTMLElement} photoCountLabel - The element showing the photo count.
 */
function showNextImage(state, carImage, photoCountLabel, thumbnailContainer) {
    const { currentImageIdx, imageUrlList } = state;
    showImage((currentImageIdx + 1) % imageUrlList.length, state, carImage, photoCountLabel, thumbnailContainer);
}

// Function to handle touch start
/**
 * Records the starting point of a touch event.
 * @param {TouchEvent} event - The touch start event.
 * @param {Object} state - The state object to store touch start coordinates.
 */
function handleTouchStart(event, state) {
    const touch = event.touches[0];
    state.startX = touch.pageX;
    state.startY = touch.pageY;
}

// Function to handle touch end
/**
 * Handles the end of a touch event to determine swipe direction.
 * @param {TouchEvent} event - The touch end event.
 * @param {Object} state - The state object to use for touch coordinates.
 * @param {HTMLImageElement} carImage - The main image element.
 * @param {HTMLElement} photoCountLabel - The element showing the photo count.
 */
function handleTouchEnd(event, state, carImage, photoCountLabel, thumbnailContainer) {

    const touch = event.changedTouches[0];
    const deltaX = touch.pageX - state.startX;
    const deltaY = touch.pageY - state.startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        deltaX > 0 ? showPrevImage(state, carImage, photoCountLabel, thumbnailContainer) : showNextImage(state, carImage, photoCountLabel, thumbnailContainer);
    }
}

// Function to render the thumbnails
/**
 * Renders thumbnail images in the given container.
 * @param {Object} state - The state object containing image URLs and data.
 * @param {HTMLElement} thumbnailContainer - The container to render thumbnails into.
 */
function renderThumbnails(state, thumbnailContainer) {
    if (!thumbnailContainer) return;

    const { imageUrlList, currentCarData, currentImageIdx, thumbnailStartIdx, thumbnailLimit } = state;

    // Create and append thumbnails
    thumbnailContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();

    for (let i = thumbnailStartIdx; i < Math.min(thumbnailStartIdx + thumbnailLimit, imageUrlList.length); i++) {
        const thumbnail = document.createElement('img');
        thumbnail.src = imageUrlList[i];
        thumbnail.alt = `${currentCarData.brand} ${currentCarData.model} ${currentCarData.year} Thumbnail ${i + 1}`;
        thumbnail.className = 'thumbnail' + (i === currentImageIdx ? ' active' : '');

        fragment.appendChild(thumbnail);
    }

    thumbnailContainer.appendChild(fragment);
}

// Setup Event Listeners
/**
 * Sets up event listeners for image navigation and touch interactions.
 * @param {Object} state - The state object used in event handlers.
 * @param {HTMLElement} prevImageButton - The button to show the previous image.
 * @param {HTMLElement} nextImageButton - The button to show the next image.
 * @param {HTMLElement} carImageContainer - The container for the main image.
 * @param {HTMLImageElement} carImageElement - The main image element.
 * @param {HTMLElement} photoCountLabel - The element showing the photo count.
 */
function setupImageEventListeners(state, prevImageButton, nextImageButton, carImageContainer, carImageElement, photoCountLabel, thumbnailContainer) {
    prevImageButton?.addEventListener('click', () => showPrevImage(state, carImageElement, photoCountLabel, thumbnailContainer));
    nextImageButton?.addEventListener('click', () => showNextImage(state, carImageElement, photoCountLabel, thumbnailContainer));

    carImageContainer?.addEventListener('touchstart', event => handleTouchStart(event, state));
    carImageContainer?.addEventListener('touchend', event => handleTouchEnd(event, state, carImageElement, photoCountLabel, thumbnailContainer));

    // Stop touch events from propagating when interacting with navigation buttons
    // This prevents touch events on the navigation buttons from being interpreted as swipe gestures
    document.querySelectorAll('.navButton').forEach(button => {
        button.addEventListener('touchstart', event => event.stopPropagation());
        button.addEventListener('touchend', event => event.stopPropagation());

        button.addEventListener('mouseenter', () => button.style.opacity = 0.8);
        button.addEventListener('mouseleave', () => button.style.opacity = 0.4);
    });
}

// Export functions
export { 
    preloadImages, 
    setupImageEventListeners 
};

