// carListingOptions.js

import { togglePopup } from './popupUtils.js';
import { showSortOptions, showFilterOptions } from './popupInformation.js';
import { showCarListings } from './listingsDisplay.js'; // Import the function
import { initializeFiltersFromURL, applyFilterToURL } from './listingsFilter.js'; // Import the function

// Declare filteredCars at the top of your file
let filteredCars = []; // Initialize as an empty array or with default data

// Consolidated config for sort and filter options
const optionsConfig = {
    sortOptions: [
        { value: 'relevance', sortFunction: (a, b) => a.carId.localeCompare(b.carId) },
        { value: 'price-asc', sortFunction: (a, b) => a.rawPrice - b.rawPrice },
        { value: 'price-desc', sortFunction: (a, b) => b.rawPrice - a.rawPrice },
        { value: 'kilometers-asc', sortFunction: (a, b) => a.rawKilometres - b.rawKilometres },
        { value: 'kilometers-desc', sortFunction: (a, b) => b.rawKilometres - a.rawKilometres },
        { value: 'year-asc', sortFunction: (a, b) => b.year - a.year },
        { value: 'year-desc', sortFunction: (a, b) => a.year - b.year },
        { value: 'cc-asc', sortFunction: (a, b) => a.displacementCC - b.displacementCC },
        { value: 'cc-desc', sortFunction: (a, b) => b.displacementCC - a.displacementCC }
    ],
    filterOptions: [
        { type: 'brand', getUniqueValues: car => car.brand },
        { type: 'fuel', getUniqueValues: car => car.fuelType },
        { type: 'body', getUniqueValues: car => car.bodyType },
        { type: 'emissions', getUniqueValues: car => car.emissionLabel }
    ]
};

// Utility function to generate HTML for an option group title
const generateOptionsTitle = (containerId) => {
    // Return an empty string if containerId is 'sortOptionsContainer'
    if (containerId === 'sortOptionsContainer') return '';

    // Create title by formatting containerId
    return `
        <h4 class="option-group-title">${containerId} options</h4>
    `;
};

// Utility function to generate HTML for options with an optional group title
const generateOptionsHtml = (containerId, options, iconFolder, carsData = []) => {
    const optionsHtml = options.map(option => {
        const count = carsData.filter(car => option.getUniqueValues(car) === option.value).length;
        return `
            <div class="popup-option" data-value="${option.value}">
                <img src="${iconFolder}/${option.value}.svg" alt="${option.value} icon"/>
                <span class="option-label">${option.value}</span>
                ${count ? `<span class="option-value">(${count})</span>` : ''}
            </div>`;
    }).join('');

    // Include the title for the option group
    return `
        <div class="option-group">
            ${generateOptionsTitle(containerId)}
            ${optionsHtml}
        </div>`;
};

// Render options dynamically based on provided config
const renderOptions = (containerId, options, iconFolder, carsData = []) => {
    const optionsContainer = document.getElementById(containerId);
    if (optionsContainer) {
        optionsContainer.innerHTML = generateOptionsHtml(containerId, options, iconFolder, carsData);
    }
};

// Render options dynamically based on provided config
const renderPageSpecificOptions = (carsData, { filterType = null, sortEnabled = true }) => {
    if (sortEnabled) {
        renderOptions('sortOptionsContainer', optionsConfig.sortOptions, 'icons/ui/actions/sort-options');
    }

    const filterOptionsToRender = filterType
        ? optionsConfig.filterOptions.filter(option => option.type === filterType)
        : optionsConfig.filterOptions;

    filterOptionsToRender.forEach(config => {
        const uniqueValues = [...new Set(carsData.map(config.getUniqueValues))]
            .filter(value => value !== "")
            .map(value => ({ value, getUniqueValues: config.getUniqueValues }));

        renderOptions(config.type, uniqueValues, `icons/car/${config.type}`, carsData);
    });
};

// Apply sorting based on selected option
const applySort = (sortOption, isNewCar) => {
    const option = optionsConfig.sortOptions.find(opt => opt.value === sortOption) || optionsConfig.sortOptions[0];
    filteredCars = [...filteredCars].sort(option.sortFunction);
    showCarListings(filteredCars, isNewCar);
};

// Apply filters based on selected value
const filterCars = (filterType, selectedValue, carsData, isNewCar) => {
    const filterOption = optionsConfig.filterOptions.find(opt => opt.type === filterType);
    filteredCars = selectedValue === 'All' ? [...carsData] : carsData.filter(car => filterOption.getUniqueValues(car) === selectedValue);
    showCarListings(filteredCars, isNewCar);
    updateResetButtonVisibility(carsData);
};

// Reset filters
const resetFilters = (carsData, isNewCar) => {
    filteredCars = [...carsData];
    showCarListings(filteredCars, isNewCar);
    resetUI(carsData, isNewCar);
};

// Reset UI to default state
function resetUI(carsData, isNewCar) {
    updateLabel('filterLabelText', 'All'); // Reset filter label to "All"

    // Only reset sort label if it's not a new car
    if (!isNewCar) {
        updateLabel('sortLabelText', 'Relevance'); // Reset sort label to "Relevance"
        togglePopup('sortPopup', false);   // Close the sort popup
    }

    togglePopup('filterPopup', false); // Close the filter popup
    updateResetButtonVisibility(carsData); // Update visibility of reset button
    applyFilterToURL(null, null);    // Clear filter-related query params in the URL
}

// Update reset button visibility based on filters
const updateResetButtonVisibility = (carsData) => {
    const anyFiltersApplied = filteredCars.length < carsData.length; // Use the carsData length to determine visibility
    document.querySelectorAll('.resetFilterButton').forEach(button => {
        button.style.display = anyFiltersApplied ? 'flex' : 'none';
    });
};

// Generalized option click handler
const handleOptionClick = (event, labelId, popupId, action) => {
    const target = event.target.closest('.popup-option');
    if (target) {
        const selectedValue = target.getAttribute('data-value');
        updateLabel(labelId, target.textContent);
        togglePopup(popupId, false);
        action(selectedValue);
    }
};

// Attach event listener to DOM element by ID
const attachEvent = (elementId, eventType, callback) => {
    const element = document.getElementById(elementId);
    if (element) element.addEventListener(eventType, callback);
};

// Setup event listeners for sorting and filtering
const setupEventListeners = ({ sortEnabled = true, filterEnabled = true, isNewCar, carsData }) => {
    if (sortEnabled) {
        attachEvent('sortLabel', 'click', showSortOptions);
        attachEvent('sortPopup', 'click', event => handleOptionClick(event, 'sortLabelText', 'sortPopup', sortOption => applySort(sortOption, isNewCar)));
    }

    if (filterEnabled) {
        attachEvent('filterLabel', 'click', showFilterOptions);
        attachEvent('filterPopup', 'click', event => handleOptionClick(event, 'filterLabelText', 'filterPopup', selectedValue => {
            const type = extractFilterType(event.target);
            filterCars(type, selectedValue, carsData, isNewCar); // Pass carsData here
            updateLabel('sortLabelText', 'Relevance');
            applyFilterToURL(type, selectedValue);
        }));

        document.querySelectorAll('.resetFilterButton').forEach(button => {
            button.addEventListener('click', () => resetFilters(carsData, isNewCar)); // Pass carsData here
        });
    }
};

// Extract filter type from DOM element
const extractFilterType = target => target.closest('[id]')?.id || null;

// Update label text
const updateLabel = (labelId, text) => {
    const labelElement = document.getElementById(labelId);
    if (labelElement) labelElement.innerHTML = `<span class="filter-text">${text}</span>`;
};

// Function to set filteredCars
const setFilteredCars = (cars) => {
    filteredCars = [...cars]; // Set filteredCars
};

// Render car listings
const renderCarListings = (isNewCar, carsData) => {
    const pageOptions = isNewCar ? { filterType: 'brand', sortEnabled: false } : { filterType: null, sortEnabled: true };

    renderPageSpecificOptions(carsData, pageOptions);  // Pass carsData
    setupEventListeners({ ...pageOptions, filterEnabled: true, isNewCar, carsData }); // Pass carsData

    initializeFiltersFromURL(filterCars, isNewCar, carsData); // Pass carsData
    showCarListings(filteredCars, isNewCar);
};

// Export functions for use in specific pages
export {
    renderCarListings,
    setFilteredCars // Export the setter function
};

