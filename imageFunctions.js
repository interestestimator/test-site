// imageFunctions.js

// Function to preload images
export function preloadImages(imageUrls) {
    imageUrls.forEach(url => new Image().src = url);
}

// Function to show a specific image
export function showImage(index, state) {
    state.currentImageIndex = index;
    updateImage(state);
}

// Function to show previous image
export function showPrevImage(state) {
    state.currentImageIndex = (state.currentImageIndex > 0) ? state.currentImageIndex - 1 : state.imageUrls.length - 1;
    updateImage(state);
}

// Function to show next image
export function showNextImage(state) {
    state.currentImageIndex = (state.currentImageIndex < state.imageUrls.length - 1) ? state.currentImageIndex + 1 : 0;
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

// Function to update the image
function updateImage(state) {
    const carImage = document.getElementById('carImage');
    carImage.src = state.imageUrls[state.currentImageIndex];
    carImage.alt = `${state.carData.CaracteristicasGenerales.Marca} ${state.carData.CaracteristicasGenerales.Modelo} ${state.carData.CaracteristicasGenerales.Año}`;

    // Update thumbnails
    renderThumbnails(
        'thumbnailContainer',
        state.imageUrls,
        state.carData,
        state.currentImageIndex,
        state.thumbnailStartIndex,
        state.thumbnailCount,
        (index) => showImage(index, state)
    );

    // Update the photo count display
    const photoCountLabel = document.getElementById('photoCountLabel');
    photoCountLabel.innerHTML = `<img src="icons/photo-count.svg" alt="Info Icon" width="16" height="16">${state.currentImageIndex + 1} of ${state.imageUrls.length}`;

    // Update thumbnail start index if necessary
    if (state.currentImageIndex < state.thumbnailStartIndex) {
        state.thumbnailStartIndex = state.currentImageIndex;
    } else if (state.currentImageIndex >= state.thumbnailStartIndex + state.thumbnailCount) {
        state.thumbnailStartIndex = state.currentImageIndex - state.thumbnailCount + 1;
    }
}

// Function to render the thumbnails
export function renderThumbnails(containerId, imageUrls, car, currentImageIndex, thumbnailStartIndex, thumbnailCount, showImage) {
    const thumbnailContainer = document.getElementById(containerId);
    thumbnailContainer.innerHTML = '';

    for (let i = thumbnailStartIndex; i < thumbnailStartIndex + thumbnailCount; i++) {
        if (i < imageUrls.length) {
            const thumbnail = document.createElement('img');
            thumbnail.src = imageUrls[i];
            thumbnail.alt = `${car.CaracteristicasGenerales.Marca} ${car.CaracteristicasGenerales.Modelo} ${car.CaracteristicasGenerales.Año} Thumbnail ${i + 1}`;
            thumbnail.classList.add('thumbnail', ...(i === currentImageIndex ? ['active'] : []));
            thumbnail.addEventListener('click', () => showImage(i));
            thumbnailContainer.appendChild(thumbnail);
        }
    }
}