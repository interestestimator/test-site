// imageNavigation.js

/**
 * Renders thumbnail images.
 * @param {Object} state - State object with additional data (thumbnail limits, etc.).
 * @param {HTMLElement} thumbnailContainer - Container for thumbnails.
 * @param {string} galleryType - The type of gallery (e.g., 'exterior', 'interior').
 */
function renderThumbnails(state, thumbnailContainer, galleryType) {
    if (!thumbnailContainer) return;

    const { currentImageIdx, imagesUrlList } = state.galleries[galleryType];
    const { thumbnailStartIdx, thumbnailLimit } = state;

    // Clear existing thumbnails
    thumbnailContainer.innerHTML = ''; 
    const fragment = document.createDocumentFragment();

    // Calculate the maximum index for the start
    const maxStartIdx = Math.max(0, imagesUrlList.length - thumbnailLimit);
    state.thumbnailStartIdx = Math.min(thumbnailStartIdx, maxStartIdx);

    // Calculate the number of thumbnails to display
    const numThumbnails = Math.max(0, Math.min(thumbnailLimit, imagesUrlList.length - state.thumbnailStartIdx));

    // Create and append thumbnails
    for (let i = 0; i < numThumbnails; i++) {
        const index = state.thumbnailStartIdx + i;
        const thumbnail = document.createElement('img');
        thumbnail.src = imagesUrlList[index];
        thumbnail.alt = `Thumbnail ${index + 1}`;
        thumbnail.className = `thumbnail${index === currentImageIdx ? ' active' : ''}`;
        fragment.appendChild(thumbnail);
    }

    thumbnailContainer.appendChild(fragment); // Append fragment to container
}

// Constant for the photo count icon path
const PHOTO_COUNT_ICON_PATH = "icons/ui/actions/photo-count.svg";

/**
 * Updates the main image, photo count label, and thumbnails.
 * @param {Object} state - State object with additional data (thumbnail limits, etc.).
 * @param {HTMLImageElement} carImage - Main image element.
 * @param {HTMLElement} photoCountLabel - Photo count element.
 * @param {HTMLElement} thumbnailContainer - Container for thumbnails.
 * @param {string} galleryType - The type of gallery (e.g., 'exterior', 'interior').
 */
function updateImage(state, carImage, photoCountLabel, thumbnailContainer, galleryType) {
    const { currentImageIdx, imagesUrlList, colors } = state.galleries[galleryType]; // Destructure for clarity

    if (!carImage || !photoCountLabel) return; // Early return for invalid elements

    // Update main image and photo count
    carImage.src = imagesUrlList[currentImageIdx];
    carImage.alt = `Image ${currentImageIdx + 1}`;
    
    // Get the color for the current image
    const currentColor = colors?.[currentImageIdx] || ""; // Use colors associated with each image
    const imageColour = currentColor ? `: ${currentColor}` : ""; // Add colon only if there's a color

    photoCountLabel.innerHTML = `
        <img src="${PHOTO_COUNT_ICON_PATH}" alt="Info Icon" width="16" height="16">
        ${currentImageIdx + 1} of ${imagesUrlList.length}${imageColour}
    `;

    // Update thumbnail index if necessary
    const thumbnailLimit = state.thumbnailLimit;
    if (currentImageIdx < state.thumbnailStartIdx || currentImageIdx >= state.thumbnailStartIdx + thumbnailLimit) {
        state.thumbnailStartIdx = Math.max(currentImageIdx - thumbnailLimit + 1, 0); // Adjust start index
    }

    renderThumbnails(state, thumbnailContainer, galleryType); // Render thumbnails
}

/**
 * Shows the image at the specified newIndex.
 * @param {number} newIndex - New index of the image to show.
 * @param {Object} state - State object with additional data (thumbnail limits, etc.).
 * @param {string} galleryType - The type of gallery (e.g., 'exterior', 'interior').
 * @param {HTMLImageElement} carImage - Main image element.
 * @param {HTMLElement} photoCountLabel - Photo count element.
 * @param {HTMLElement} thumbnailContainer - Container for thumbnails.
 */
function showImage(newIndex, state, galleryType, carImage, photoCountLabel, thumbnailContainer) {
    const { imagesUrlList } = state.galleries[galleryType]; // Destructure for clarity
    if (newIndex < 0 || newIndex >= imagesUrlList.length) return; // Early return for invalid index

    // Update the current image index in state
    state.galleries[galleryType].currentImageIdx = newIndex;

    // Update the image and related elements
    updateImage(state, carImage, photoCountLabel, thumbnailContainer, galleryType);
}

/**
 * Shows the next or previous image.
 * @param {number} direction - 1 for next, -1 for previous.
 * @param {Object} state - State object to update.
 * @param {string} galleryType - The type of gallery (e.g., 'exterior', 'interior').
 * @param {HTMLImageElement} carImage - Main image element.
 * @param {HTMLElement} photoCountLabel - Photo count element.
 * @param {HTMLElement} thumbnailContainer - Container for thumbnails.
 */
function showAdjacentImage(direction, state, galleryType, carImage, photoCountLabel, thumbnailContainer) {
    const { currentImageIdx, imagesUrlList } = state.galleries[galleryType]; // Destructure for clarity
    const newIndex = (currentImageIdx + direction + imagesUrlList.length) % imagesUrlList.length; // Calculate new index

    showImage(newIndex, state, galleryType, carImage, photoCountLabel, thumbnailContainer); // Show the image
}

/**
 * Handles touch events for swipe gestures.
 * @param {TouchEvent} event - The touch event.
 * @param {Object} state - State object to use.
 * @param {string} action - 'start' or 'end' for touch phase.
 * @param {HTMLImageElement} carImage - Main image element.
 * @param {HTMLElement} photoCountLabel - Photo count element.
 * @param {HTMLElement} thumbnailContainer - Container for thumbnails.
 * @param {string} galleryType - The type of gallery (e.g., 'exterior', 'interior').
 */
function handleTouch(event, state, action, carImage, photoCountLabel, thumbnailContainer, galleryType) {
    const touch = event.touches[0] || event.changedTouches[0];
    const swipeThreshold = 50; // Minimum horizontal distance (in pixels) required to trigger the swipe

    if (action === 'start') {
        state.startX = touch.pageX;
        state.startY = touch.pageY; // Added to ensure vertical swipe detection
    } else {
        const deltaX = touch.pageX - state.startX;
        const deltaY = touch.pageY - state.startY;
        
        // Only trigger swipe if the horizontal distance exceeds the threshold and it's a horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
            showAdjacentImage(deltaX > 0 ? -1 : 1, state, galleryType, carImage, photoCountLabel, thumbnailContainer);
        }
    }
}

/**
 * Preloads images and renders thumbnails for a specific gallery.
 * @param {string} galleryType - The type of gallery (e.g., 'exterior', 'interior').
 * @param {Object} state - The state object containing gallery data.
 * @param {HTMLElement} thumbnailContainer - The container for rendering thumbnails.
 */
function preloadImages(galleryType, state, thumbnailContainer) {
    // Preload images by iterating over the URL list for the specified gallery
    state.galleries[galleryType].imagesUrlList.forEach(url => {
        const img = new Image();
        img.src = url;
    });

    // Call renderThumbnails with the relevant data for the specified gallery
    renderThumbnails(state, thumbnailContainer, galleryType);
}

/**
 * Sets up event listeners for navigation and touch interactions.
 * @param {Object} state - State object used in event handlers.
 * @param {HTMLElement} prevImageButton - Button for the previous image.
 * @param {HTMLElement} nextImageButton - Button for the next image.
 * @param {HTMLElement} carImageContainer - Container for the car image.
 * @param {HTMLImageElement} carImage - Main image element.
 * @param {HTMLElement} photoCountLabel - Photo count element.
 * @param {HTMLElement} thumbnailContainer - Container for thumbnails.
 * @param {string} galleryType - The type of gallery (e.g., 'exterior', 'interior').
 */
function setupImageEventListeners(state, prevImageButton, nextImageButton, carImageContainer, carImage, photoCountLabel, thumbnailContainer, galleryType) {
    const showImageHandler = direction => () => showAdjacentImage(direction, state, galleryType, carImage, photoCountLabel, thumbnailContainer);
    
    prevImageButton?.addEventListener('click', showImageHandler(-1));
    nextImageButton?.addEventListener('click', showImageHandler(1));

    const touchHandler = action => event => handleTouch(event, state, action, carImage, photoCountLabel, thumbnailContainer, galleryType);
    carImageContainer?.addEventListener('touchstart', touchHandler('start'));
    carImageContainer?.addEventListener('touchend', touchHandler('end'));

    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('touchstart', e => e.stopPropagation());
        button.addEventListener('touchend', e => e.stopPropagation());
        button.addEventListener('mouseenter', () => button.style.opacity = 0.8);
        button.addEventListener('mouseleave', () => button.style.opacity = 0.4);
    });
}

export { preloadImages, setupImageEventListeners };
