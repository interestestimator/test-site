// siteSetup.js

/**
 * Retrieves the value of a query parameter from the URL.
 * @param {string} paramName - The name of the query parameter.
 * @returns {string|null} The value of the query parameter or null if not found.
 */
function getQueryParam(paramName) { 
    return new URLSearchParams(window.location.search).get(paramName);
}

/**
 * Initializes and returns references to DOM elements based on the provided element IDs.
 * @param {Object} elementIdMap - An object mapping variable names to element IDs.
 * @returns {Object} An object containing references to the DOM elements.
 */
function initializeDOMElements(elementIdMap) { 
    const elements = {};
    for (const [key, id] of Object.entries(elementIdMap)) {
        elements[key] = document.getElementById(id);
    }
    return elements;
}



////////////////////// UPDATES STATE INITALIZATION //////////////////////
function createInitialSiteState() {
    const carId = getQueryParam('id') || null;

    const createGalleryState = () => ({ currentImageIdx: 0, imagesUrlList: [] });

    return {
        carId,
        thumbnailStartIdx: 0,
        thumbnailLimit: 4,
        galleries: {
            vehicle: createGalleryState(),
            exterior: createGalleryState(),
            interior: createGalleryState(),
        },
        currentCarData: null,
        charges: {
            delivery: 0,
            finance: 0,
            undisclosedFinanceCost: 0,
        },

        deliveryCharge: 0, //// REMOVE AND PASS TO NEW CHARGES ABOVE
        financeCharge: 0, //// REMOVE AND PASS TO NEW CHARGES ABOVE
        undisclosedFinanceCost: 0, //// REMOVE AND PASS TO NEW CHARGES ABOVE
    };
}

/**
 * Initializes and returns references to primary DOM elements used across pages.
 * @returns {Object} An object containing references to primary DOM elements.
 */
function getPrimaryDOMElements() {
    return initializeDOMElements({ 
        headerContact: 'header-contact-container',
        headerMain: 'header-container',
        headerBanner: 'header-banner-container',
        footer: 'footer-container'
    });
}


/**
 * Initializes and returns references to global DOM elements used across pages.
 * @returns {Object} An object containing references to global DOM elements.
 */
function getGlobalDOMElements() { 
    return initializeDOMElements({ 
        headerContactContainer: 'header-contact-container',
        headerContainer: 'header-container',
        headerBannerContainer: 'header-banner-container',


        bannerContainer:'banner-container',
        footerContainer: 'footer-container'
    });
}

/**
 * Initializes and returns references to common DOM elements used on the page.
 * @returns {Object} An object containing references to common DOM elements.
 */
function getIndexDOMElements() { 
    return initializeDOMElements({ 
        filterButton: 'filterLabel',
        sortButton: 'sortLabel',
        sortMenu: 'sortPopup',
        carListingContainer: 'carListings',
        listingCountDisplay: 'listingCount'
    });
}

/**
 * Initializes and returns references to DOM elements specific to the car-details page.
 * @returns {Object} An object containing references to car-details page specific DOM elements.
 */
function getCarDetailsDOMElements() { 
    return initializeDOMElements({ 
        carDetailsContainer: 'carDetailsContainer',
        carImageContainer: 'carImageContainer',
        prevImageButton: 'prevImage',
        nextImageButton: 'nextImage',
        carImageElement: 'carImage',
        photoCountLabel: 'photoCountLabel',
        thumbnailContainer: 'thumbnailContainer',

        
        
        regionDropdown: 'regionDropdown',
        regionAmountLabel: 'regionAmount',
        deliveryLabelTitle: 'deliveryLabel_title',
                                    financeOptionsContainer: 'carFinanceOptionsContainer',


        financeAmountLabel: 'financeAmount',

        depositInputField: 'deposit-input',
        depositSlider: 'deposit-slider',
        maxDepositTextLabel: 'max-deposit-text',
        termSelectDropdown: 'term-select',
        termSlider: 'term-slider',
        carTitleContainer: 'carTitle',
        carOverviewContainer: 'overview',
                                    financeSidebarContainer: 'initalFinanceValue',
                                    priceItemsContainer: 'priceItems',
                                    priceResultsContainer: 'vehicle-price-result',
        warrantyContainer: 'garantiaContainer',
                                    discountContainer: 'sidebarDiscountDiv',
        //benefitsContainer: 'inclusions-and-benefits',
        carReferenceContainer: 'carRefrenceID',
        printDetailsContainer: 'printDetailsDiv',




        financeSectionContainer: 'carFinanceContainer',

        
    });
}

// Export functions
export {
    createInitialSiteState,
    getPrimaryDOMElements,
    getGlobalDOMElements,
    getIndexDOMElements,
    getCarDetailsDOMElements
};
