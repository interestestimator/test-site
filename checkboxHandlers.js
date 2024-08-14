import { fetchResource } from './js/httpUtils.js';  // Update the import path and function names
import { formatCurrency } from './js/formatCarData.js';  // Importing the initializer function

// Constants
const REGION_AMOUNT_DEFAULT_TEXT = 'Seleccionar:';
const DELIVERY_TITLE_DEFAULT_TEXT = 'Entrega a domicilio';
const DELIVERY_AMOUNT_DEFAULT_TEXT = 'Activar';
const DELIVERY_REGIONS_URL = 'data/deliveryRegions.json';

/**
 * Populates a dropdown with options.
 * @param {HTMLSelectElement} dropdown - The dropdown element to populate.
 * @param {Array<Object>} regions - The list of region objects with `value` and `label` properties.
 */
function populateRegionDropdown(dropdown, regions) {
    dropdown.innerHTML = regions.map(region => 
        `<option value="${region.value}">${region.label}</option>`
    ).join('');

    updateRegionAmount('', regions, document.getElementById('regionAmount'), {}); // Ensure default text is set
}

/**
 * Updates the displayed amount and the state based on the selected value.
 * @param {string} selectedValue - The value of the selected region.
 * @param {Array<Object>} regions - The list of region objects.
 * @param {HTMLElement} regionAmountLabel - The element to update with the selected region's amount.
 * @param {Object} state - The state object to update with the delivery cost.
 */
function updateRegionAmount(selectedValue, regions, regionAmountLabel, state) {
    const selectedRegion = regions.find(region => region.value == selectedValue);

    if (selectedRegion) {
        if (selectedRegion.value === "CONSULTAR") {
            regionAmountLabel.textContent = 'Consultar';
            state.deliveryCharge = 0;
        } else {
            regionAmountLabel.textContent = `${formatCurrency(selectedRegion.value)}`;
            state.deliveryCharge = parseFloat(selectedRegion.value) || 0;
        }
    } else {
        regionAmountLabel.textContent = '0';
        state.deliveryCharge = 0;
    }
}

/**
 * Handles changes to the delivery checkbox, including updating the dropdown and rawPrices.
 * @param {Event} event - The change event triggered by the delivery checkbox.
 * @param {Object} state - The state object to update with delivery costs.
 * @param {Object} elements - An object containing references to DOM elements for rawPrice updates.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
async function handleDeliveryCheckboxChange(event, state, elements) {
    const regionDropdown = document.getElementById('regionDropdown');
    const regionAmountLabel = document.getElementById('regionAmount');
    const regionTitle = document.getElementById('deliveryLabel_title');

    if (!regionDropdown || !regionAmountLabel || !regionTitle) {
        console.error('Required DOM elements are missing.');
        return;
    }

    if (event.target.checked) {
        regionDropdown.style.display = 'block';
        regionTitle.textContent = REGION_AMOUNT_DEFAULT_TEXT;

        try {
            const deliveryRegions = await fetchResource(DELIVERY_REGIONS_URL);
            populateRegionDropdown(regionDropdown, deliveryRegions);

            if (deliveryRegions.length > 0) {
                const firstRegion = deliveryRegions[0];
                regionDropdown.value = firstRegion.value;
                updateRegionAmount(firstRegion.value, deliveryRegions, regionAmountLabel, state);
                updatePrices(state, elements, state.currentCarData.rawPrice);
            }

            // Attach event listener once
            regionDropdown.removeEventListener('change', onDropdownChange);
            regionDropdown.addEventListener('change', onDropdownChange);

            function onDropdownChange(event) {
                const selectedValue = event.target.value;
                updateRegionAmount(selectedValue, deliveryRegions, regionAmountLabel, state);
                updatePrices(state, elements, state.currentCarData.rawPrice);
            }

        } catch (error) {
            console.error('Error fetching delivery regions:', error);
        }
    } else {
        regionDropdown.style.display = 'none';
        regionTitle.textContent = DELIVERY_TITLE_DEFAULT_TEXT;
        regionAmountLabel.textContent = DELIVERY_AMOUNT_DEFAULT_TEXT;
        regionDropdown.value = '';
        state.deliveryCharge = 0;
        updatePrices(state, elements, state.currentCarData.rawPrice);
    }
}

/**
 * Handles changes to the finance checkbox and updates the rawPrices.
 * @param {Event} event - The change event triggered by the finance checkbox.
 * @param {Object} state - The state object to update with finance costs.
 * @param {Object} elements - An object containing references to DOM elements for rawPrice updates.
 * @param {number} rawPrice - The base rawPrice used to calculate finance costs.
 */
function handleFinanceCheckboxChange(event, state, elements, rawPrice) {
    state.financeCharge = event.target.checked ? 0 : state.undisclosedFinanceCost;
    updatePrices(state, elements, rawPrice);
}

/**
 * Updates the displayed rawPrices based on the current state.
 * @param {Object} state - The state object containing delivery and finance costs.
 * @param {Object} elements - An object containing references to DOM elements for rawPrice updates.
 * @param {number} rawPrice - The base rawPrice used for calculations.
 */
function updatePrices(state, elements, rawPrice) {
    if (!state.currentCarData) return;

    state.undisclosedFinanceCost = rawPrice * 0.1;
    const deliveryCharge = state.deliveryCharge || 0;
    const financeCharge = state.financeCharge || 0;
    const finalPrice = (rawPrice - state.undisclosedFinanceCost) + deliveryCharge + financeCharge;

    if (elements.newPriceLabel && elements.finalPriceLabel) {
        elements.newPriceLabel.textContent = `${formatCurrency(rawPrice)}*`;
        elements.finalPriceLabel.textContent = `${formatCurrency(finalPrice)}*`;
    }
}

// Export functions
export { 
    handleDeliveryCheckboxChange, 
    handleFinanceCheckboxChange 
};