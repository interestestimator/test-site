import { fetchResource } from './httpUtils.js';  // Update the import path and function names
import { formatCurrency } from './formatCarData.js';  // Importing the initializer function

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

    console.log(state.deliveryCharge)
}

/**
 * Handles changes to the delivery checkbox, including updating the dropdown and rawPrices.
 * @param {Event} event - The change event triggered by the delivery checkbox.
 * @param {Object} state - The state object to update with delivery costs.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
async function handleDeliveryCheckboxChange(event, state) {
    const regionDropdown = document.getElementById('regionDropdown');
    const regionAmountLabel = document.getElementById('regionAmount');
    const regionTitle = document.getElementById('deliveryLabel_title'); // Get the delivery title element

    if (!regionDropdown || !regionAmountLabel || !regionTitle) {
        console.error('Required DOM elements are missing.');
        return;
    }

    // Adjust margin-right based on the delivery checkbox state
    if (event.target.checked) {
        // Show dropdown and set the title text
        regionDropdown.style.display = 'block';
        regionTitle.textContent = REGION_AMOUNT_DEFAULT_TEXT;

        // Remove margin-right from the delivery title element when displayed
        regionTitle.style.marginRight = ''; // Reset margin when checkbox is checked

        try {
            const deliveryRegions = await fetchResource(DELIVERY_REGIONS_URL);
            populateRegionDropdown(regionDropdown, deliveryRegions);

            if (deliveryRegions.length > 0) {
                const firstRegion = deliveryRegions[0];
                regionDropdown.value = firstRegion.value;
                updateRegionAmount(firstRegion.value, deliveryRegions, regionAmountLabel, state);
                updatePrices(state, state.currentCarData.rawPrice);
            }

            // Attach event listener once
            regionDropdown.removeEventListener('change', onDropdownChange);
            regionDropdown.addEventListener('change', onDropdownChange);

            function onDropdownChange(event) {
                const selectedValue = event.target.value;
                updateRegionAmount(selectedValue, deliveryRegions, regionAmountLabel, state);
                updatePrices(state, state.currentCarData.rawPrice);
            }

        } catch (error) {
            console.error('Error fetching delivery regions:', error);
        }
    } else {
        // Hide dropdown and reset values when checkbox is unchecked
        regionDropdown.style.display = 'none';
        regionTitle.textContent = DELIVERY_TITLE_DEFAULT_TEXT;
        regionAmountLabel.textContent = DELIVERY_AMOUNT_DEFAULT_TEXT;
        regionDropdown.value = '';
        state.deliveryCharge = 0;
        updatePrices(state, state.currentCarData.rawPrice);
        
        // Add margin-right auto back to the delivery title element when checkbox is unchecked
        regionTitle.style.marginRight = 'auto'; // Set margin back when checkbox is unchecked
    }
}

/**
 * Handles changes to the finance checkbox and updates the rawPrices.
 * @param {Event} event - The change event triggered by the finance checkbox.
 * @param {Object} state - The state object to update with finance costs.
 * @param {number} rawPrice - The base rawPrice used to calculate finance costs.
 */
function handleFinanceCheckboxChange(event, state, rawPrice) {
    // Update finance charges based on the checkbox state
    state.financeCharge = event.target.checked ? 0 : state.undisclosedFinanceCost;
    updatePrices(state, rawPrice);

    // Conditionally toggle the 'contrast' class based on the checkbox state
    if (event.target.checked) {
        togglePriceItemsContrast(true);  // When checked, indicate financing is selected
        // Remove the 'grey' class from entry amounts when checked
        toggleGreyClassOnEntryAmounts(event.target.closest('.checkbox-wrapper'), false); // Pass 'false' to remove
    } else {
        togglePriceItemsContrast(false); // When not checked, indicate cash is selected
        // Add the 'grey' class to entry amounts when unchecked
        toggleGreyClassOnEntryAmounts(event.target.closest('.checkbox-wrapper'), true); // Pass 'true' to add
    }
}

/**
 * Toggles the 'txt-medium' class on all elements with the 'entry__amount' class within the specified parent element.
 * @param {HTMLElement} parentElement - The parent element to search within.
 * @param {boolean} add - If true, adds the 'txt-medium' class; if false, removes it.
 */
function toggleGreyClassOnEntryAmounts(parentElement, add) {
    // Select all elements with the class 'entry__amount' within the given parent element
    const entryAmountElements = parentElement.querySelectorAll('.entry__amount');

    // Loop through the selected elements and toggle the 'txt-medium' class based on the 'add' parameter
    entryAmountElements.forEach(element => {
        if (add) {
            element.classList.add('txt-medium'); // Add the class if 'add' is true
        } else {
            element.classList.remove('txt-medium'); // Remove the class if 'add' is false
        }
    });
}

/**
 * Handles changes to the extra costs checkbox and updates the extraCost. 
 * @param {Event} event - The change event triggered by the extraCost checkbox. 
 * @param {Object} state - The state object to update with finance costs.
 * @param {number} extraPrice - The base extraCost used to calculate full costs. 
 */
function handleExtrasPackageCheckboxChange(event, state, extraPrice) {
    // Ensure extraCharges is initialized
    if (typeof state.extraCharges !== 'number') {
        state.extraCharges = 0;
    }

    // Add or subtract the extraPrice based on the checkbox state
    if (event.target.checked) {
        state.extraCharges += extraPrice; // Add the extra cost
        // Remove the 'grey' class from entry amounts when checked
        toggleGreyClassOnEntryAmounts(event.target.closest('.checkbox-wrapper'), false); // Pass 'false' to remove
    } else {
        state.extraCharges = Math.max(0, state.extraCharges - extraPrice); // Subtract the extra cost, ensuring it doesn't go negative
        // Add the 'grey' class to entry amounts when unchecked
        toggleGreyClassOnEntryAmounts(event.target.closest('.checkbox-wrapper'), true); // Pass 'true' to add
    }

    console.log(`Updated extra charges: ${state.extraCharges}`);
    updatePrices(state, state.currentCarData.rawPrice); // Pass raw price to updatePrices
}


/**
 * Updates the displayed rawPrices based on the current state.
 * @param {Object} state - The state object containing delivery and finance costs.
 * @param {number} rawPrice - The base rawPrice used for calculations.
 */
function updatePrices(state, rawPrice) {
    if (!state.currentCarData) return;

    const newPriceLabel = document.getElementById('precioNuevo');
    const finalPriceLabel = document.getElementById('PrecioFinal');

    const deliveryCharge = state.deliveryCharge || 0;
    const financeCharge = state.financeCharge || 0;
    const extraCharges = state.extraCharges || 0; // Get extra charges

    // Calculate the final price
    const finalPrice = (rawPrice - state.undisclosedFinanceCost) + deliveryCharge + financeCharge + extraCharges;

    console.log(finalPrice);

    // Update the displayed prices
    if (newPriceLabel && finalPriceLabel) {
        newPriceLabel.textContent = `${formatCurrency(rawPrice)}*`;
        finalPriceLabel.textContent = `${formatCurrency(finalPrice)}*`;
    }
}


function togglePriceItemsContrast(isFinancing) {
    // Get the two boxes
    const financingBox = document.querySelector('.price-items .box:first-child');
    const cashBox = document.querySelector('.price-items .box:last-child');

    // If financing is selected, add contrast to the financing box
    // and remove it from the cash box
    if (isFinancing) {
        financingBox.classList.add('contrast');
        cashBox.classList.remove('contrast');
    } else {
        // Otherwise, add contrast to the cash box and remove it from the financing box
        financingBox.classList.remove('contrast');
        cashBox.classList.add('contrast');
    }
}

// Export functions
export { 
    handleDeliveryCheckboxChange, 
    handleFinanceCheckboxChange,
    handleExtrasPackageCheckboxChange
};


