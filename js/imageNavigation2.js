// imageNavigation.js

/**
 * Renders thumbnail images.
 * @param {Object} state - State object with additional data (thumbnail limits, etc.).
 * @param {HTMLElement} thumbnailContainer - Container for thumbnails.
 *  * @param {string} galleryType - The type of gallery (e.g., 'exterior', 'interior').
 */
function renderThumbnails(state, thumbnailContainer, galleryType) {
    if (!thumbnailContainer) return;
    
    thumbnailContainer.innerHTML = ''; // Clear existing thumbnails
    const fragment = document.createDocumentFragment();
    const gallery = state.galleries[galleryType]; // Store reference
    const thumbnails = gallery.imagesUrlList.slice(state.thumbnailStartIdx, state.thumbnailStartIdx + state.thumbnailLimit).map((url, i) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = url;
        thumbnail.alt = `Thumbnail ${state.thumbnailStartIdx + i + 1}`;
        thumbnail.className = `thumbnail${state.thumbnailStartIdx + i === gallery.currentImageIdx ? ' active' : ''}`;
        return thumbnail;
    });

    thumbnails.forEach(thumbnail => fragment.appendChild(thumbnail));
    thumbnailContainer.appendChild(fragment);
}

/**
 * Updates the main image, photo count label, and thumbnails.
 * @param {Object} state - State object with additional data (thumbnail limits, etc.).
 *  * @param {string} galleryType - The type of gallery (e.g., 'exterior', 'interior').
 * @param {number} currentIdx - Index of the currently active image for the current gallery.
 
 * @param {HTMLImageElement} carImage - Main image element.
 * @param {HTMLElement} photoCountLabel - Photo count element.
 * @param {HTMLElement} thumbnailContainer - Container for thumbnails.
 */
function updateImage(state, galleryType, carImage, photoCountLabel, thumbnailContainer) {
    if (!carImage || !photoCountLabel) return;
    
    const gallery = state.galleries[galleryType]; // Store reference

    // Update main image and photo count
    carImage.src = gallery.imagesUrlList[gallery.currentImageIdx];
    carImage.alt = `Image ${gallery.currentImageIdx + 1}`;
    photoCountLabel.innerHTML = `<img src="icons/ui/actions/photo-count.svg" alt="Info Icon" width="16" height="16">${gallery.currentImageIdx + 1} of ${gallery.imagesUrlList.length}`;

    // Update thumbnail index
    const thumbnailOutOfRange = gallery.currentImageIdx < state.thumbnailStartIdx || gallery.currentImageIdx >= state.thumbnailStartIdx + state.thumbnailLimit;
    if (thumbnailOutOfRange) {
        state.thumbnailStartIdx = Math.max(gallery.currentImageIdx - state.thumbnailLimit + 1, 0);
    }

    renderThumbnails(state, thumbnailContainer, galleryType);
}

/**
 * Shows the image at the specified index.
 * @param {Object} state - State object with additional data (thumbnail limits, etc.).
 * @param {string} galleryType - The type of gallery (e.g., 'exterior', 'interior').
 * @param {number} index - Index of the image to show.

 * @param {HTMLImageElement} carImage - Main image element.
 * @param {HTMLElement} photoCountLabel - Photo count element.
 * @param {HTMLElement} thumbnailContainer - Container for thumbnails.
 */
function showImage(state, galleryType, index, carImage, photoCountLabel, thumbnailContainer) {
    if (index >= 0 && index < state.galleries[galleryType].imagesUrlList.length) {
        // Update the specified index in the state object
        state.galleries[galleryType].currentImageIdx = index;
        
        updateImage(state, galleryType, carImage, photoCountLabel, thumbnailContainer);
    }
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
    const newIndex = (state.galleries[galleryType].currentImageIdx + direction + state.galleries[galleryType].imagesUrlList.length) % state.galleries[galleryType].imagesUrlList.length;
    showImage(state, galleryType, newIndex, carImage, photoCountLabel, thumbnailContainer);
    console.log(state.galleries[galleryType].currentImageIdx)
}

/**
 * Handles touch events for swipe gestures.
 * @param {TouchEvent} event - The touch event.
 * @param {Object} state - State object to use.
 * @param {string} action - 'start' or 'end' for touch phase.
 * @param {HTMLImageElement} carImage - Main image element.
 * @param {HTMLElement} photoCountLabel - Photo count element.
 * @param {HTMLElement} thumbnailContainer - Container for thumbnails.
 *  * @param {string} galleryType - The type of gallery (e.g., 'exterior', 'interior').
 */
function handleTouch(event, state, action, carImage, photoCountLabel, thumbnailContainer, galleryType) {
    const touch = event.touches[0] || event.changedTouches[0];
    if (action === 'start') {
        state.startX = touch.pageX;
        state.startY = touch.pageY; // Added to ensure vertical swipe detection
    } else {
        const deltaX = touch.pageX - state.startX;
        const deltaY = touch.pageY - state.startY;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
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
    renderThumbnails(
        state, 
        thumbnailContainer,
        galleryType
    );
}

/**
 * Sets up event listeners for navigation and touch interactions.
 * @param {Object} state - State object used in event handlers.
 * @param {HTMLElement} prevImageButton - Button for the previous image.
 * @param {HTMLElement} nextImageButton - Button for the next image.
 * @param {HTMLElement} carImageContainer - Container for the car image.
 * @param {HTMLImageElement} carImageElement - Main image element.
 * @param {HTMLElement} photoCountLabel - Photo count element.
 * @param {HTMLElement} thumbnailContainer - Container for thumbnails.
 * @param {string} galleryType - The type of gallery (e.g., 'exterior', 'interior').
 */
function setupImageEventListeners(state, prevImageButton, nextImageButton, carImageContainer, carImageElement, photoCountLabel, thumbnailContainer, galleryType) {
    const showImageHandler = direction => () => showAdjacentImage(direction, state, galleryType, carImageElement, photoCountLabel, thumbnailContainer);
    
    prevImageButton?.addEventListener('click', showImageHandler(-1));
    nextImageButton?.addEventListener('click', showImageHandler(1));

    const touchHandler = action => event => handleTouch(event, state, action, carImageElement, photoCountLabel, thumbnailContainer, galleryType);
    carImageContainer?.addEventListener('touchstart', touchHandler('start'));
    carImageContainer?.addEventListener('touchend', touchHandler('end'));

    document.querySelectorAll('.navButton').forEach(button => {
        button.addEventListener('touchstart', e => e.stopPropagation());
        button.addEventListener('touchend', e => e.stopPropagation());
        button.addEventListener('mouseenter', () => button.style.opacity = 0.8);
        button.addEventListener('mouseleave', () => button.style.opacity = 0.4);
    });
}

export { preloadImages, setupImageEventListeners };
