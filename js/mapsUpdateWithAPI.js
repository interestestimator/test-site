/**
 * Generates a Google Maps iframe and inserts it into the specified container.
 * @param {HTMLElement} container - The DOM element to insert the iframe into.
 * @param {number} latitude - The latitude for the map center.
 * @param {number} longitude - The longitude for the map center.
 * @param {number} zoom - The zoom level (default is 15).
 */
function initializeMap(containerId, latitude = 43.037083, longitude = -7.5762373, zoom = 15) {
    const mapUrl = `https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11664.826669712314!2d${longitude}!3d${latitude}!3m2!1i1024!2i768!4f${zoom}!3m3!1m2!1s0xd31ce5256c71689%3A0xc2eade902ecd0949!2sMart%C3%ADnez%20De%20Lugo%2C%20S.L.U.!5e0!3m2!1ses!2ses!4v1696847969220!5m2!1ses!2ses`;

    const iframe = document.createElement('iframe');
    iframe.src = mapUrl;
    iframe.width = "100%";
    iframe.height = "400"; // Height in pixels
    iframe.style.border = "0";
    iframe.allowFullscreen = true;
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.className = "round-md"; // Add the class to the iframe

    const googleMapsContainer = document.getElementById(containerId);

    if (googleMapsContainer) {
        // Clear any existing content and append the new iframe
        googleMapsContainer.innerHTML = ''; // Clear existing content
        googleMapsContainer.appendChild(iframe);
    } else {
        console.error(`Container with ID "${containerId}" not found.`);
    }
}

/**
 * Generates a static Google Maps image from a local file and inserts it into the specified container.
 * @param {HTMLElement} containerId - The DOM element to insert the image into.
 */
function initializeMapImage(containerId) {
    // Log reminder message to the console
    console.log("Reminder: Map image needs to be updated to use Google Maps API.");

    const img = document.createElement('img');
    img.src = 'MartinizDeLugoMap.png'; // Update with the correct path to your image
    img.alt = "Google Map Image";
    img.style.width = "100%";
    img.style.height = "400px"; // Height in pixels
    img.style.border = "0";
    img.className = "round-md"; // Add the class to the iframe


    const googleMapsContainer = document.getElementById(containerId);

    if (googleMapsContainer) {
        // Clear any existing content and append the new image
        googleMapsContainer.innerHTML = ''; // Clear existing content
        googleMapsContainer.appendChild(img);
    } else {
        console.error(`Container with ID "${containerId}" not found.`);
    }
}


// export { initializeMapImage as initializeMap };

export { 
    initializeMapImage as initializeMap 
}