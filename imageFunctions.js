// Function to preload images
/**
 * Preloads images by setting their `src` attribute and renders thumbnails.
 * @param {string[]} imageUrls - The list of image URLs to preload.
 * @param {Object} state - The state object to update with image URLs.
 * @param {HTMLElement} thumbnailContainer - The container element for thumbnails.
 */
function preloadImages(imageUrls, state, thumbnailContainer) {
    // Preload images
    imageUrls.forEach(url => new Image().src = url);
    state.imageUrls = imageUrls;  // Ensure state is updated
    renderThumbnails(state, thumbnailContainer);
}

// Function to update the image and related UI elements
/**
 * Updates the main image and photo count label, and adjusts thumbnails if needed.
 * @param {Object} state - The state object with current image index and data.
 * @param {HTMLImageElement} carImage - The main image element.
 * @param {HTMLElement} photoCountLabel - The element showing the photo count.
 */
function updateImage(state, carImage, photoCountLabel) {
    if (!carImage || !photoCountLabel) return;

    const { currentImageIndex, imageUrls, carData, thumbnailStartIndex, thumbnailCount } = state;

    carImage.src = imageUrls[currentImageIndex];
    carImage.alt = `${carData.CaracteristicasGenerales.Marca} ${carData.CaracteristicasGenerales.Modelo} ${carData.CaracteristicasGenerales.Año}`;

    photoCountLabel.innerHTML = `<img src="icons/photo-count.svg" alt="Info Icon" width="16" height="16">${currentImageIndex + 1} of ${imageUrls.length}`;

    // Update thumbnail start index if necessary
    const maxIndex = thumbnailStartIndex + thumbnailCount;
    if (currentImageIndex < thumbnailStartIndex) {
        state.thumbnailStartIndex = currentImageIndex;
    } else if (currentImageIndex >= maxIndex) {
        state.thumbnailStartIndex = Math.max(currentImageIndex - thumbnailCount + 1, 0);
    }

    renderThumbnails(state, document.getElementById('thumbnailContainer'));
}

// Function to show a specific image
/**
 * Shows the image at the specified index.
 * @param {number} index - The index of the image to show.
 * @param {Object} state - The state object to update with the new image index.
 * @param {HTMLImageElement} carImage - The main image element.
 * @param {HTMLElement} photoCountLabel - The element showing the photo count.
 */
function showImage(index, state, carImage, photoCountLabel) {
    if (index >= 0 && index < state.imageUrls.length) {
        state.currentImageIndex = index;
        updateImage(state, carImage, photoCountLabel);
    }
}

// Function to show the previous image
/**
 * Shows the previous image in the sequence, wrapping around to the end if needed.
 * @param {Object} state - The state object to update with the new image index.
 * @param {HTMLImageElement} carImage - The main image element.
 * @param {HTMLElement} photoCountLabel - The element showing the photo count.
 */
function showPrevImage(state, carImage, photoCountLabel) {
    const { currentImageIndex, imageUrls } = state;
    showImage((currentImageIndex - 1 + imageUrls.length) % imageUrls.length, state, carImage, photoCountLabel);
}

// Function to show the next image
/**
 * Shows the next image in the sequence, wrapping around to the start if needed.
 * @param {Object} state - The state object to update with the new image index.
 * @param {HTMLImageElement} carImage - The main image element.
 * @param {HTMLElement} photoCountLabel - The element showing the photo count.
 */
function showNextImage(state, carImage, photoCountLabel) {
    const { currentImageIndex, imageUrls } = state;
    showImage((currentImageIndex + 1) % imageUrls.length, state, carImage, photoCountLabel);
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
function handleTouchEnd(event, state, carImage, photoCountLabel) {
    const touch = event.changedTouches[0];
    const deltaX = touch.pageX - state.startX;
    const deltaY = touch.pageY - state.startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        deltaX > 0 ? showPrevImage(state, carImage, photoCountLabel) : showNextImage(state, carImage, photoCountLabel);
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

    const { imageUrls, carData, currentImageIndex, thumbnailStartIndex, thumbnailCount } = state;

    // Create and append thumbnails
    thumbnailContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();

    for (let i = thumbnailStartIndex; i < Math.min(thumbnailStartIndex + thumbnailCount, imageUrls.length); i++) {
        const thumbnail = document.createElement('img');
        thumbnail.src = imageUrls[i];
        thumbnail.alt = `${carData.CaracteristicasGenerales.Marca} ${carData.CaracteristicasGenerales.Modelo} ${carData.CaracteristicasGenerales.Año} Thumbnail ${i + 1}`;
        thumbnail.className = 'thumbnail' + (i === currentImageIndex ? ' active' : '');

        // Preserve state with closure
        thumbnail.addEventListener('click', () => showImage(i, state, document.getElementById('carImage'), document.getElementById('photoCountLabel')));

        fragment.appendChild(thumbnail);
    }

    thumbnailContainer.appendChild(fragment);
}

// Setup Image URLs
/**
 * Sets up image URLs in the state based on the number of images.
 * @param {Object} state - The state object to update with image URLs.
 * @param {number} imageCount - The total number of images.
 */
function setupStateImages(state, imageCount) {
    state.imageUrls = Array.from({ length: imageCount }, (_, i) => `listings/${state.carReference}/images/${i + 1}.webp`);
}

// Setup Event Listeners
/**
 * Sets up event listeners for image navigation and touch interactions.
 * @param {Object} state - The state object used in event handlers.
 * @param {Object} elements - An object containing DOM elements for event binding.
 */
function setupImageEventListeners(state, elements) {
    const { prevImage, nextImage, carImageContainer, carImage, photoCountLabel } = elements;

    prevImage?.addEventListener('click', () => showPrevImage(state, carImage, photoCountLabel));
    nextImage?.addEventListener('click', () => showNextImage(state, carImage, photoCountLabel));

    carImageContainer?.addEventListener('touchstart', event => handleTouchStart(event, state));
    carImageContainer?.addEventListener('touchend', event => handleTouchEnd(event, state, carImage, photoCountLabel));

    document.querySelectorAll('.navButton').forEach(button => {
        button.addEventListener('mouseenter', () => button.style.opacity = 0.8);
        button.addEventListener('mouseleave', () => button.style.opacity = 0.4);
    });
}

// Export functions
export { 
    preloadImages, 
    setupStateImages, 
    setupImageEventListeners 
};