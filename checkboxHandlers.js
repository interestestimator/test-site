import { fetchJson } from './fetchUtils.js';
import { formatCurrency } from './loanCalculator.js';

// Constants
const REGION_AMOUNT_DEFAULT_TEXT = 'Seleccionar:';
const DELIVERY_TITLE_DEFAULT_TEXT = 'Entrega a domicilio';
const DELIVERY_AMOUNT_DEFAULT_TEXT = 'Activar';
const DELIVERY_REGIONS_URL = 'deliveryRegions.json';

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
 * @param {HTMLElement} regionAmount - The element to update with the selected region's amount.
 * @param {Object} state - The state object to update with the delivery cost.
 */
function updateRegionAmount(selectedValue, regions, regionAmount, state) {
    const selectedRegion = regions.find(region => region.value == selectedValue);

    if (selectedRegion) {
        if (selectedRegion.value === "CONSULTAR") {
            regionAmount.textContent = 'Consultar';
            state.deliveryCost = 0;
        } else {
            regionAmount.textContent = `${formatCurrency(selectedRegion.value)}`;
            state.deliveryCost = parseFloat(selectedRegion.value) || 0;
        }
    } else {
        regionAmount.textContent = '0';
        state.deliveryCost = 0;
    }
}

/**
 * Handles changes to the delivery checkbox, including updating the dropdown and prices.
 * @param {Event} event - The change event triggered by the delivery checkbox.
 * @param {Object} state - The state object to update with delivery costs.
 * @param {Object} elements - An object containing references to DOM elements for price updates.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
async function handleDeliveryCheckboxChange(event, state, elements) {
    const regionDropdown = document.getElementById('regionDropdown');
    const regionAmount = document.getElementById('regionAmount');
    const regionTitle = document.getElementById('deliveryLabel_title');

    if (!regionDropdown || !regionAmount || !regionTitle) {
        console.error('Required DOM elements are missing.');
        return;
    }

    if (event.target.checked) {
        regionDropdown.style.display = 'block';
        regionTitle.textContent = REGION_AMOUNT_DEFAULT_TEXT;

        try {
            const deliveryRegions = await fetchJson(DELIVERY_REGIONS_URL);
            populateRegionDropdown(regionDropdown, deliveryRegions);

            if (deliveryRegions.length > 0) {
                const firstRegion = deliveryRegions[0];
                regionDropdown.value = firstRegion.value;
                updateRegionAmount(firstRegion.value, deliveryRegions, regionAmount, state);
                updatePrices(state, elements, state.carData.CaracteristicasGenerales.PrecioNuevo);
            }

            // Attach event listener once
            regionDropdown.removeEventListener('change', onDropdownChange);
            regionDropdown.addEventListener('change', onDropdownChange);

            function onDropdownChange(event) {
                const selectedValue = event.target.value;
                updateRegionAmount(selectedValue, deliveryRegions, regionAmount, state);
                updatePrices(state, elements, state.carData.CaracteristicasGenerales.PrecioNuevo);
            }

        } catch (error) {
            console.error('Error fetching delivery regions:', error);
        }
    } else {
        regionDropdown.style.display = 'none';
        regionTitle.textContent = DELIVERY_TITLE_DEFAULT_TEXT;
        regionAmount.textContent = DELIVERY_AMOUNT_DEFAULT_TEXT;
        regionDropdown.value = '';
        state.deliveryCost = 0;
        updatePrices(state, elements, state.carData.CaracteristicasGenerales.PrecioNuevo);
    }
}

/**
 * Handles changes to the finance checkbox and updates the prices.
 * @param {Event} event - The change event triggered by the finance checkbox.
 * @param {Object} state - The state object to update with finance costs.
 * @param {Object} elements - An object containing references to DOM elements for price updates.
 * @param {number} price - The base price used to calculate finance costs.
 */
function handleFinanceCheckboxChange(event, state, elements, price) {
    state.financeCost = event.target.checked ? 0 : state.FINANCIO_DESCUBIENTO;
    updatePrices(state, elements, price);
}

/**
 * Updates the displayed prices based on the current state.
 * @param {Object} state - The state object containing delivery and finance costs.
 * @param {Object} elements - An object containing references to DOM elements for price updates.
 * @param {number} price - The base price used for calculations.
 */
function updatePrices(state, elements, price) {
    if (!state.carData) return;

    state.FINANCIO_DESCUBIENTO = price * 0.1;
    const deliveryCost = state.deliveryCost || 0;
    const financeCost = state.financeCost || 0;
    const PrecioFinal = (price - state.FINANCIO_DESCUBIENTO) + deliveryCost + financeCost;

    if (elements.precioNuevo && elements.PrecioFinal) {
        elements.precioNuevo.textContent = `${formatCurrency(price)}*`;
        elements.PrecioFinal.textContent = `${formatCurrency(PrecioFinal)}*`;
    }
}

// Export functions
export { 
    handleDeliveryCheckboxChange, 
    handleFinanceCheckboxChange 
};




