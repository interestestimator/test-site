// formDropdownHandler.js

import { fetchResource } from './httpUtils.js';

/**
 * Populates a dropdown with options.
 * @param {HTMLSelectElement} dropdown - The dropdown element to populate with options.
 * @param {Array<string>} values - The list of values to use for the dropdown options.
 * @param {string} [placeholder='Select an option'] - Text for the default option when no value is selected.
 */
function populateDropdownWithOptions(dropdown, values = [], placeholder = 'Select an option') {
    dropdown.innerHTML = `<option value="" selected disabled>${placeholder}</option>` +
        values.map(value => `<option value="${value}">${value}</option>`).join('');
}

/**
 * Fetches the models based on the selected make and updates the model dropdown.
 * @param {string} selectedMake - The make selected by the user to filter the models.
 */
async function updateModelDropdownBasedOnMake(selectedMake) {
    const modelDropdown = document.getElementById('appraisal_model');

    if (!modelDropdown) {
        logError('Model dropdown element not found.');
        return;
    }

    try {
        const modelData = await fetchResource('data/appraisalModels.json');
        const models = modelData?.[selectedMake] || [];
        populateDropdownWithOptions(modelDropdown, models, 'Modelo *');
    } catch (error) {
        logError('Error updating model dropdown:', error);
    }
}

/**
 * Initializes dropdowns with options using the provided configuration.
 * @param {Object} optionsData - The data containing values for each dropdown.
 * @param {Array<Object>} dropdownConfig - Array of configurations for each dropdown.
 */
function initializeDropdownsWithConfig(optionsData, dropdownConfig) {
    dropdownConfig.forEach(({ elementId, dataKey, placeholder }) => {
        const dropdown = document.getElementById(elementId);
        dropdown 
            ? populateDropdownWithOptions(dropdown, optionsData[dataKey], placeholder)
            : console.warn(`Dropdown element with ID ${elementId} not found.`);
    });
}

/**
 * Logs error messages to the console for debugging purposes.
 * @param {string} message - The error message to log.
 * @param {Error} [error] - Optional error object for additional context.
 */
function logError(message, error) {
    console.error(message);
    if (error) console.error(error);
}

/**
 * Initializes the dropdowns for the appraisal form and sets up necessary event listeners.
 */
async function initializeAppraisalFormDropdowns() {
    try {
        const optionsData = await fetchResource('data/appraisalOptions.json');
        if (!optionsData) {
            logError('No data available to initialize dropdowns.');
            return;
        }

        const dropdownConfig = [
            { elementId: 'appraisal_make', dataKey: 'make', placeholder: 'Marca *' },
            { elementId: 'appraisal_year', dataKey: 'year', placeholder: 'Año *' },
            { elementId: 'appraisal_mileage', dataKey: 'mileage', placeholder: 'Kilometraje *' },
            { elementId: 'appraisal_transmission', dataKey: 'transmission', placeholder: 'Cambio *' },
            { elementId: 'appraisal_fuel', dataKey: 'fuel', placeholder: 'Combustible *' },
            { elementId: 'appraisal_bodystyle', dataKey: 'bodystyle', placeholder: 'Carrocería *' },
            { elementId: 'appraisal_color', dataKey: 'color', placeholder: 'Color *' }
        ];

        initializeDropdownsWithConfig(optionsData, dropdownConfig);
        setupMakeDropdownChangeListener();

    } catch (error) {
        logError('Error initializing dropdowns:', error);
    }
}

/**
 * Sets up the change event listener for the make dropdown to update the model dropdown accordingly.
 */
function setupMakeDropdownChangeListener() {
    const makeDropdown = document.getElementById('appraisal_make');
    if (makeDropdown) {
        makeDropdown.addEventListener('change', (event) => {
            updateModelDropdownBasedOnMake(event.target.value);
        });
    } else {
        logError('Make dropdown element not found.');
    }
}

export {
    initializeAppraisalFormDropdowns
};