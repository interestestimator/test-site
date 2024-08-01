// imageFunctions.js

// Function to preload images and update thumbnails
export function preloadImages(imageUrls, state) {
    imageUrls.forEach(url => new Image().src = url);

    // Immediately render thumbnails after preloading
    renderThumbnails(state);
}

// Function to show a specific image
export function showImage(index, state) {
    state.currentImageIndex = index;
    updateImage(state);
}

// Function to show the previous image
export function showPrevImage(state) {
    state.currentImageIndex = (state.currentImageIndex > 0) 
        ? state.currentImageIndex - 1 
        : state.imageUrls.length - 1;
    updateImage(state);
}

// Function to show the next image
export function showNextImage(state) {
    state.currentImageIndex = (state.currentImageIndex < state.imageUrls.length - 1) 
        ? state.currentImageIndex + 1 
        : 0;
    updateImage(state);
}

// Function to handle touch start
export function handleTouchStart(event, state) {
    const touch = event.touches[0];
    state.startX = touch.pageX;
    state.startY = touch.pageY;
}

// Function to handle touch end
export function handleTouchEnd(event, state) {
    const touch = event.changedTouches[0];
    const deltaX = touch.pageX - state.startX;
    const deltaY = touch.pageY - state.startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        deltaX > 0 ? showPrevImage(state) : showNextImage(state);
    }
}

// Function to update the image and related UI elements
function updateImage(state) {
    const carImage = document.getElementById('carImage');
    const photoCountLabel = document.getElementById('photoCountLabel');

    carImage.src = state.imageUrls[state.currentImageIndex];
    carImage.alt = `${state.carData.CaracteristicasGenerales.Marca} ${state.carData.CaracteristicasGenerales.Modelo} ${state.carData.CaracteristicasGenerales.Año}`;
    
    photoCountLabel.innerHTML = `<img src="icons/photo-count.svg" alt="Info Icon" width="16" height="16">${state.currentImageIndex + 1} of ${state.imageUrls.length}`;

    // Update thumbnail start index if necessary
    if (state.currentImageIndex < state.thumbnailStartIndex) {
        // Shift the thumbnail window to the left if going backwards
        state.thumbnailStartIndex = state.currentImageIndex;
    } else if (state.currentImageIndex >= state.thumbnailStartIndex + state.thumbnailCount) {
        // Shift the thumbnail window to the right if going forward
        state.thumbnailStartIndex = state.currentImageIndex - state.thumbnailCount + 1;
    }

    // Re-render thumbnails to reflect changes
    renderThumbnails(state);
}

// Function to render the thumbnails
export function renderThumbnails(state) {
    const { imageUrls, carData, currentImageIndex, thumbnailStartIndex, thumbnailCount } = state;
    const thumbnailContainer = document.getElementById('thumbnailContainer');
    thumbnailContainer.innerHTML = '';

    const fragment = document.createDocumentFragment();

    for (let i = thumbnailStartIndex; i < thumbnailStartIndex + thumbnailCount; i++) {
        if (i < imageUrls.length) {
            const thumbnail = document.createElement('img');
            thumbnail.src = imageUrls[i];
            thumbnail.alt = `${carData.CaracteristicasGenerales.Marca} ${carData.CaracteristicasGenerales.Modelo} ${carData.CaracteristicasGenerales.Año} Thumbnail ${i + 1}`;
            thumbnail.classList.add('thumbnail');
            if (i === currentImageIndex) thumbnail.classList.add('active');

            // Pass state into the showImage function
            thumbnail.addEventListener('click', () => showImage(i, state));

            fragment.appendChild(thumbnail);
        }
    }

    thumbnailContainer.appendChild(fragment);
}
