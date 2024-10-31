// listingsFiltersManager.js

// Global active filters object
const activeFilters = {
    brand: null,
    fuel: null,
    body: null,
    emissions: null
};

// Helper function to update URL parameters
const updateURLParameter = (filterKey, filterValue) => {
    const urlParams = new URLSearchParams();
    if (filterValue && filterValue !== 'All') {
        urlParams.set(filterKey, filterValue);
    }
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState(null, '', newUrl);
};

// Function to apply the selected filter to the URL
function applyFilterToURL(filterKey, filterValue) {
    Object.keys(activeFilters).forEach(key => {
        activeFilters[key] = (key === filterKey) ? filterValue : null;
    });
    updateURLParameter(filterKey, activeFilters[filterKey]);
}

// Function to initialize filters from URL parameters
function initializeFiltersFromURL(filterCarsCallback, isNewCar, availableCarsData) {
    const urlParams = new URLSearchParams(window.location.search);

    Object.entries(activeFilters).forEach(([filterKey]) => {
        const filterValue = urlParams.get(filterKey);
        if (filterValue) {
            // Apply the filter using the provided callback
            filterCarsCallback(filterKey, filterValue, availableCarsData, isNewCar); // Pass availableCarsData here
        }
    });
}

// Exporting the active filters and related functions
export {
    applyFilterToURL,
    initializeFiltersFromURL
};