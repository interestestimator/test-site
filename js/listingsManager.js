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
        { value: 'relevance', name: 'Relevancia', sortFunction: (a, b) => a.carId.localeCompare(b.carId) },
        { value: 'price-asc', name: 'Precio Ascendente', sortFunction: (a, b) => a.rawPrice - b.rawPrice },
        { value: 'price-desc', name: 'Precio Descendente', sortFunction: (a, b) => b.rawPrice - a.rawPrice },
        { value: 'kilometers-asc', name: 'Kilómetros Ascendente', sortFunction: (a, b) => a.rawKilometres - b.rawKilometres },
        { value: 'kilometers-desc', name: 'Kilómetros Descendente', sortFunction: (a, b) => b.rawKilometres - a.rawKilometres },
        { value: 'year-asc', name: 'Año Ascendente', sortFunction: (a, b) => a.year - b.year },
        { value: 'year-desc', name: 'Año Descendente', sortFunction: (a, b) => b.year - a.year },
        { value: 'cc-asc', name: 'Cilindrada Ascendente', sortFunction: (a, b) => a.displacementCC - b.displacementCC },
        { value: 'cc-desc', name: 'Cilindrada Descendente', sortFunction: (a, b) => b.displacementCC - a.displacementCC }
    ],
    filterOptions: [
        { type: 'car-manufacturers', title: 'Marcas Disponibles', getUniqueValues: car => car.brand },
        { type: 'car-bodies', title: 'Tipos de Carrocería', getUniqueValues: car => car.bodyType },
        { type: 'fuel-types', title: 'Tipos de Combustible', getUniqueValues: car => car.fuelType },
        { type: 'emission-levels', title: 'Etiquetas de Emisión', getUniqueValues: car => car.emissionLabel }
    ]
};

// Utility function to generate HTML for options with an optional group title
const generateOptionsHtml = (containerId, options, iconFolder, carsData = []) => {
    // Create the title only once if not a sort options container
    const optionTitle = containerId === 'sortOptionsContainer' 
        ? '' 
        : optionsConfig.filterOptions.find(option => option.type === containerId)?.title || ''; // Get the title for the current filter type

    const optionsHtml = options.map(option => {
        const count = carsData.filter(car => option.getUniqueValues(car) === option.value).length;
        const displayValue = containerId === 'sortOptionsContainer' ? option.name : option.value; // Conditional Check

        return `
            <p class="popup-option btn-inv flex ai-center" data-value="${option.value}">
                <img class="img-24" src="${iconFolder}/${option.value}.svg" alt="${option.value} icon"/>
                <span class="mx-sm light capital" style="margin-right: auto;">${displayValue}</span>
                ${count ? `<span>(${count})</span>` : ''}
            </p>`;
    }).join('');

    // Include the title for the option group
    return `
        <div class="option-group">
            ${optionTitle ? `<h4 class="b1 upper">${optionTitle}</h4>` : ''}
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
        renderOptions('sortOptionsContainer', optionsConfig.sortOptions, 'icons/sort-options');
    }

    const filterOptionsToRender = filterType
        ? optionsConfig.filterOptions.filter(option => option.type === filterType)
        : optionsConfig.filterOptions;

    filterOptionsToRender.forEach(config => {
        const uniqueValues = [...new Set(carsData.map(config.getUniqueValues))]
            .filter(value => value !== "")
            .map(value => ({ value, getUniqueValues: config.getUniqueValues }));

        renderOptions(config.type, uniqueValues, `icons/filter-options/${config.type}`, carsData);
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
    // Filter the cars based on the selected value directly
    filteredCars = carsData.filter(car => filterOption.getUniqueValues(car) === selectedValue);
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
    updateLabel('filterLabelText', 'Todos los Filtros'); // Reset filter label to "Todos los Filtros"

    // Only reset sort label if it's not a new car
    if (!isNewCar) {
        updateLabel('sortLabelText', 'Relevancia'); // Reset sort label to "Relevancia"
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
        button.style.display = anyFiltersApplied ? 'block' : 'none';
    });
};

function removeBracketedNumber(text) {
    return text.replace(/\(\d+\)/g, '').trim();
}

// Generalized option click handler
const handleOptionClick = (event, labelId, popupId, action) => {
    const target = event.target.closest('.popup-option');
    if (!target) return; // Exit early if no target is found

    const selectedValue = target.getAttribute('data-value');
    const cleanedLabelText = removeBracketedNumber(target.textContent);

    updateLabel(labelId, cleanedLabelText);
    togglePopup(popupId, false);
    action(selectedValue);
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
            updateLabel('sortLabelText', 'Relevancia');
            applyFilterToURL(type, selectedValue);
        }));

    document.querySelectorAll('.resetFilterButton').forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevents opening the filter label when reset button is clicked
            resetFilters(carsData, isNewCar); // Pass carsData and other arguments as needed
        });
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
    const pageOptions = isNewCar ? { filterType: 'brand-types', sortEnabled: false } : { filterType: null, sortEnabled: true };

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

