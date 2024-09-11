let scrollPosition = 0;
let overlay = null;

/**
 * Utility function for logging errors.
 * @param {string} message - The error message to log to the console.
 */
const logError = (message) => console.error(message);

/**
 * Gets the overlay element, caching it for future access.
 * @returns {HTMLElement|null} - The overlay element if found, otherwise `null`.
 */
const getOverlay = () => {
    if (!overlay) {
        overlay = document.getElementById('overlay');
        if (!overlay) logError('Overlay element not found.');
    }
    return overlay;
};

/**
 * Toggles the visibility of an element by its ID.
 * @param {string} elementId - The ID of the HTML element to toggle.
 * @param {boolean} shouldShow - Whether to show (`true`) or hide (`false`) the element.
 */
const toggleElementVisibilityById = (elementId, shouldShow) => {
    const element = document.getElementById(elementId);
    if (!element) {
        logError(`Element with ID "${elementId}" not found.`);
        return;
    }
    element.style.display = shouldShow ? 'block' : 'none';
};

/**
 * Toggles the visibility of the overlay element.
 * @param {boolean} shouldShow - Whether to show (`true`) or hide (`false`) the overlay.
 */
const toggleOverlay = (shouldShow) => {
    const overlayElement = getOverlay();
    if (overlayElement) {
        toggleElementVisibilityById('overlay', shouldShow);
    }
};

/**
 * Captures the current scroll position and prevents the body from scrolling.
 */
const captureScrollPosition = () => {
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    document.body.classList.add('no-scroll');
    document.body.style.top = `-${scrollPosition}px`;
};

/**
 * Restores the body's scroll position and re-enables scrolling.
 */
const restoreScrollPosition = () => {
    document.body.classList.remove('no-scroll');
    window.scrollTo(0, scrollPosition);
    document.body.style.top = '';
};

/**
 * Scrolls an element to the top.
 * @param {string} elementId - The ID of the HTML element to scroll to the top.
 */
const scrollToTop = (elementId) => {
    document.getElementById(elementId)?.scrollTo(0, 0);
};

/**
 * Toggles the visibility of a popup and manages the overlay and scroll position.
 * @param {string} popupId - The ID of the popup element to show or hide.
 * @param {boolean} shouldShow - Whether to show (`true`) or hide (`false`) the popup.
 */
const togglePopup = (popupId, shouldShow) => {
    toggleElementVisibilityById(popupId, shouldShow);
    toggleOverlay(shouldShow);
    if (shouldShow) {
        captureScrollPosition();
        scrollToTop(popupId);
    } else {
        restoreScrollPosition();
    }
};

/**
 * Initializes the popup with content and event listeners.
 * @param {string} popupId - The ID of the popup element to initialize.
 * @param {string} closeButtonId - The ID of the close button element within the popup.
 * @param {function} getContent - A function that returns the HTML content to be injected into the popup.
 * @param {Event} event - The event object from the triggering event listener, typically a click event.
 * @param {boolean} [addAcknowledgeListener=false] - An optional boolean flag indicating whether to add an acknowledgment button listener.
 */
const initializePopup = (popupId, closeButtonId, getContent, event, addAcknowledgeListener = false) => {
    event.preventDefault();

    const popup = document.getElementById(popupId);
    if (popup && getContent) {
        popup.innerHTML = getContent();
    }

    togglePopup(popupId, true);

    // Define handlers
    const handlePopupClose = () => togglePopup(popupId, false);
    const handleOverlayClick = handlePopupClose;

    const closeButton = document.getElementById(closeButtonId);
    if (closeButton) {
        closeButton.removeEventListener('click', handlePopupClose);
        closeButton.addEventListener('click', handlePopupClose);
    }

    const overlayElement = getOverlay();
    if (overlayElement) {
        overlayElement.removeEventListener('click', handleOverlayClick);
        overlayElement.addEventListener('click', handleOverlayClick);
    }

    if (addAcknowledgeListener) {
        const acknowledgeButton = document.getElementById('acknowledgeButton');
        if (acknowledgeButton) {
            acknowledgeButton.removeEventListener('click', handlePopupClose);
            acknowledgeButton.addEventListener('click', handlePopupClose);
        }
    }
};

/**
 * Creates a header for a popup with a title and a close button.
 * @param {string} title - The title to display in the popup header.
 * @param {string} idPrefix - The prefix to use for generating the popup ID and related classes.
 * @returns {string} - The HTML string for the popup header.
 */
const createPopupHeader = (title, idPrefix) => {
    const idCapitalized = `${idPrefix.charAt(0).toUpperCase()}${idPrefix.slice(1)}`;
    return `
        <div class="popup-title">
            <div class="${idPrefix}-text">${title}</div>
            <button id="close${idCapitalized}Popup" class="close-button">
                <img src="icons/ui/navigation/close.svg" alt="Close" width="20" height="20">
            </button>
        </div>
    `;
};

/**
 * Formats a detail item with a label and value.
 * @param {string} label - The label for the detail item.
 * @param {string} value - The value corresponding to the detail label.
 * @returns {string} - The HTML string representing the formatted detail item.
 */
const formatDetail = (label, value) => `
    <div class="finance-details-item">
        <span class="detail-label">${label}:</span>
        <span class="detail-value">${value}</span>
    </div>
`;

// Export functions
export { 
    togglePopup,
    initializePopup,
    createPopupHeader,
    formatDetail
};