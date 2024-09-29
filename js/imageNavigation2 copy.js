// imageNavigation.js

/**
 * Preloads images and renders thumbnails for a gallery.
 * @param {string[]} imageUrlList - List of image URLs to preload.
 * @param {Object} galleryState - The state object for the gallery.
 * @param {HTMLElement} thumbnailContainer - Container for thumbnails.
 */
function preloadImages(imageUrlList, galleryState, thumbnailContainer) {
    imageUrlList.forEach(url => new Image().src = url); // Preload images
    galleryState.imageUrlList = imageUrlList;
    renderThumbnails(galleryState, thumbnailContainer);
}

/**
 * Updates the main image, photo count label, and thumbnails for a gallery.
 * @param {Object} galleryState - The state object for the gallery.
 * @param {HTMLImageElement} mainImage - Main image element.
 * @param {HTMLElement} photoCountLabel - Element showing the photo count.
 * @param {HTMLElement} thumbnailContainer - Container for thumbnails.
 */
function updateImage(galleryState, mainImage, photoCountLabel, thumbnailContainer) {
    const { currentImageIdx, imageUrlList, currentCarData, thumbnailStartIdx, thumbnailLimit } = galleryState;
    if (!mainImage || !photoCountLabel) return;

    mainImage.src = imageUrlList[currentImageIdx];
    mainImage.alt = `${currentCarData.brand} ${currentCarData.model} ${currentCarData.year}`;
    photoCountLabel.innerHTML = `<img src="icons/ui/actions/photo-count.svg" alt="Info Icon" width="16" height="16">${currentImageIdx + 1} of ${imageUrlList.length}`;

    if (currentImageIdx < thumbnailStartIdx || currentImageIdx >= thumbnailStartIdx + thumbnailLimit) {
        galleryState.thumbnailStartIdx = Math.max(currentImageIdx - thumbnailLimit + 1, 0);
    }

    renderThumbnails(galleryState, thumbnailContainer);
}

/**
 * Shows the image at the specified index in a gallery.
 * @param {number} index - The index of the image to show.
 * @param {Object} galleryState - The state object for the gallery.
 */
function showImage(index, galleryState, mainImage, photoCountLabel, thumbnailContainer) {
    if (index >= 0 && index < galleryState.imageUrlList.length) {
        galleryState.currentImageIdx = index;
        updateImage(galleryState, mainImage, photoCountLabel, thumbnailContainer);
    }
}

/**
 * Shows the next or previous image in a gallery.
 * @param {number} direction - 1 for next, -1 for previous.
 * @param {Object} galleryState - The state object for the gallery.
 */
function showAdjacentImage(direction, galleryState, mainImage, photoCountLabel, thumbnailContainer) {
    const newIndex = (galleryState.currentImageIdx + direction + galleryState.imageUrlList.length) % galleryState.imageUrlList.length;
    showImage(newIndex, galleryState, mainImage, photoCountLabel, thumbnailContainer);
}

/**
 * Handles touch events for swipe gestures in a gallery.
 * @param {TouchEvent} event - The touch event.
 * @param {Object} galleryState - The state object for the gallery.
 * @param {string} action - 'start' or 'end' for touch phase.
 */
function handleTouch(event, galleryState, action) {
    const touch = event.touches[0] || event.changedTouches[0];
    if (action === 'start') {
        galleryState.startX = touch.pageX;
    } else {
        const deltaX = touch.pageX - galleryState.startX;
        if (Math.abs(deltaX) > Math.abs(touch.pageY - galleryState.startY)) {
            showAdjacentImage(deltaX > 0 ? -1 : 1, galleryState, event.target, event.target.nextElementSibling, event.target.parentElement);
        }
    }
}

/**
 * Renders thumbnail images for a gallery.
 * @param {Object} galleryState - The state object for the gallery.
 * @param {HTMLElement} thumbnailContainer - Container for thumbnails.
 */
function renderThumbnails(galleryState, thumbnailContainer) {
    if (!thumbnailContainer) return;

    const { imageUrlList, currentCarData, currentImageIdx, thumbnailStartIdx, thumbnailLimit } = galleryState;
    thumbnailContainer.innerHTML = '';

    const fragment = document.createDocumentFragment();
    imageUrlList.slice(thumbnailStartIdx, thumbnailStartIdx + thumbnailLimit).forEach((url, i) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = url;
        thumbnail.alt = `${currentCarData.brand} ${currentCarData.model} ${currentCarData.year} Thumbnail ${i + 1}`;
        thumbnail.className = `thumbnail${i === currentImageIdx ? ' active' : ''}`;
        fragment.appendChild(thumbnail);
    });

    thumbnailContainer.appendChild(fragment);
}

/**
 * Sets up event listeners for navigation and touch interactions for a gallery.
 * @param {Object} galleryState - The state object for the gallery.
 * @param {HTMLElement} prevImageButton - Button for showing the previous image.
 * @param {HTMLElement} nextImageButton - Button for showing the next image.
 * @param {HTMLElement} mainImageContainer - Container for the main image.
 * @param {HTMLImageElement} mainImage - The main image element.
 * @param {HTMLElement} photoCountLabel - Element showing the photo count.
 * @param {HTMLElement} thumbnailContainer - Container for thumbnails.
 */
function setupImageEventListeners(galleryState, prevImageButton, nextImageButton, mainImageContainer, mainImage, photoCountLabel, thumbnailContainer) {
    prevImageButton?.addEventListener('click', () => showAdjacentImage(-1, galleryState, mainImage, photoCountLabel, thumbnailContainer));
    nextImageButton?.addEventListener('click', () => showAdjacentImage(1, galleryState, mainImage, photoCountLabel, thumbnailContainer));

    mainImageContainer?.addEventListener('touchstart', event => handleTouch(event, galleryState, 'start'));
    mainImageContainer?.addEventListener('touchend', event => handleTouch(event, galleryState, 'end'));

    document.querySelectorAll('.navButton').forEach(button => {
        button.addEventListener('touchstart', e => e.stopPropagation());
        button.addEventListener('touchend', e => e.stopPropagation());
        button.addEventListener('mouseenter', () => button.style.opacity = 0.8);
        button.addEventListener('mouseleave', () => button.style.opacity = 0.4);
    });
}

/**
 * Initializes a gallery with given elements and data.
 * @param {Object} galleryState - The initial state object for the gallery.
 * @param {string[]} imageUrlList - List of image URLs for the gallery.
 * @param {HTMLElement} thumbnailContainer - Container for the thumbnails.
 * @param {HTMLImageElement} mainImage - The main image element.
 * @param {HTMLElement} photoCountLabel - Element showing the photo count.
 * @param {HTMLElement} prevImageButton - Button for the previous image.
 * @param {HTMLElement} nextImageButton - Button for the next image.
 * @param {HTMLElement} mainImageContainer - Container for the main image.
 */
function initGallery(galleryState, imageUrlList, thumbnailContainer, mainImage, photoCountLabel, prevImageButton, nextImageButton, mainImageContainer) {
    preloadImages(imageUrlList, galleryState, thumbnailContainer);
    setupImageEventListeners(galleryState, prevImageButton, nextImageButton, mainImageContainer, mainImage, photoCountLabel, thumbnailContainer);
    updateImage(galleryState, mainImage, photoCountLabel, thumbnailContainer); // Initialize with the first image
}

export { initGallery };