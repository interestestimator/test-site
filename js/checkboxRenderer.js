// checkboxRenderer.js

import { formatCurrency } from './formatCarData.js'; 
import { handleDeliveryCheckboxChange, handleFinanceCheckboxChange, handleExtrasPackageCheckboxChange } from './checkboxHandlers.js';

const priceEntryClasses = 'flex jc-between ai-center px-lg pblk-sm bl-sdw';
const checkboxWrapperClass = 'checkbox-wrapper';

/**
 * Generates a class string for price entries.
 * @param {boolean} [includeCheckbox=false] - Whether to include the checkbox wrapper class.
 * @param {boolean} [isButton=false] - Whether to remove 'px-lg' if it's a button.
 * @returns {string} - The complete class string.
 */
function getPriceEntryClasses(includeCheckbox = false, isButton = false) {
    const baseClasses = isButton ? priceEntryClasses.replace('px-lg', '').trim() : priceEntryClasses;
    return `${baseClasses}${includeCheckbox ? ` ${checkboxWrapperClass}` : ''}`;
}

/**
 * Helper function to append a div with specific class and content.
 * @param {string} className - The class name for the div.
 * @param {string} innerHTML - The HTML content to append.
 * @param {HTMLElement} container - The container where the div is appended.
 */
function appendDiv(className, innerHTML, container) {
    const div = document.createElement('div');
    div.className = className;
    div.innerHTML = innerHTML;
    div.style.minHeight = '2.2rem'; // Set minimum height
    container.appendChild(div);
}

/**
 * Adds event listener for a checkbox and logs its state.
 * @param {HTMLElement} checkbox - The checkbox element.
 * @param {function} handler - The function to handle the change event.
 * @param {Object} state - The state object.
 * @param {number} [cost] - The cost associated with the checkbox (optional).
 */
function addCheckboxListener(checkbox, handler, state, cost) {
    if (checkbox) {
        checkbox.addEventListener('change', async (event) => {
            console.log(`${checkbox.id} checkbox changed:`, event.target.checked);
            await handler(event, state, cost);
        });
    }
}

/**
 * Sets up event listeners for finance and delivery checkboxes.
 * @param {Object} state - The state object to track the application state.
 * @param {number} rawPrice - The raw price of the car.
 * @param {number} rawFinancePrice - The raw finance price of the car.
 */
function setupCheckboxEventListeners(state, rawPrice, rawFinancePrice) {
    const financeCheckbox = document.getElementById('financeCheckbox');
    const deliveryCheckbox = document.getElementById('deliveryCheckbox');

    state.undisclosedFinanceCost = rawPrice - rawFinancePrice;
    state.extraCharges = 0;

    addCheckboxListener(financeCheckbox, handleFinanceCheckboxChange, state, rawPrice);
    addCheckboxListener(deliveryCheckbox, handleDeliveryCheckboxChange, state);

    const extras = [
        { id: 'maintenance', cost: 200 },
        { id: 'healthCheck', cost: 340 }
    ];

    extras.forEach(({ id, cost }) => {
        addCheckboxListener(document.getElementById(`${id}Checkbox`), handleExtrasPackageCheckboxChange, state, cost);
    });
}

/**
 * Appends warranties and flexible return policies to the container.
 * @param {Object} currentCarData - The car data containing warranties and policies.
 * @param {HTMLElement} container - The container where entries are appended.
 */
function appendItems(items, container) {
    items.forEach(({ name, description, condition }) => {
        if (condition) {
            appendDiv(
                getPriceEntryClasses(),
                `<span class="b2 light txt-darker">${name}</span>
                 <span class="entry__amount b1 bold upper">${description}</span>`,
                container
            );
        }
    });
}

/**
 * Appends warranties based on the current car data.
 * @param {Object} currentCarData - The car data containing warranties.
 * @param {HTMLElement} container - The container where entries are appended.
 */
function appendWarranties(currentCarData, container) {
    const warranties = [
        { name: 'Garantía nacional', description: `${currentCarData.standardWarranty} meses<span class="b2 light txt-darker">${name}</span>`, condition: currentCarData.standardWarranty > 0 },
        { name: 'Garantía motor', description: `${currentCarData.engineWarranty} meses`, condition: currentCarData.engineWarranty > 0 },
        { name: 'Garantía batería', description: `${currentCarData.batteryWarranty} meses`, condition: currentCarData.batteryWarranty > 0 },
        { name: '14 días o 1000 km para probarlo', description: 'GRATIS', condition: currentCarData.hasFlexibleReturnPolicies }
    ];
    appendItems(warranties, container);
}

/**
 * Appends available extras based on the current car data.
 * @param {Object} currentCarData - The car data containing information about extras.
 * @param {HTMLElement} container - The container where the extra entries are appended.
 */
function appendExtrasAvailable(currentCarData, container) {
    const extras = [
        { id: 'maintenance', title: 'Paquete de mantenimiento gratuito', cost: 200, condition: currentCarData.hasMaintenancePackage },
        { id: 'healthCheck', title: 'Chequeo de salud gratuito', cost: 340, condition: currentCarData.hasVehicleHealthCheck }
    ];

    extras.forEach(({ id, title, cost, condition }) => {
        if (condition) appendExtrasPackage(id, title, formatCurrency(cost), container);
    });
}

/**
 * Appends an entry for an extra package with a checkbox.
 * @param {string} id - The checkbox id.
 * @param {string} title - The title for the extra package.
 * @param {string} value - The value or cost of the extra package.
 * @param {HTMLElement} container - The container where the entry is appended.
 */
function appendExtrasPackage(id, title, value, container) {
    appendDiv(
        getPriceEntryClasses(true),
        `<input type="checkbox" id="${id}Checkbox">
         <label for="${id}Checkbox" class="btn mr-sm"></label>
         <span class="b2 light txt-darker" style="margin-right: auto;">${title}</span>
         <span class="entry__amount b1 bold upper txt-medium">${value}</span>`,
        container
    );
}

/**
 * Appends a checkbox entry with a title and value.
 * @param {string} title - The title for the checkbox.
 * @param {string} id - The id for the checkbox.
 * @param {string} value - The value or cost associated with the checkbox.
 * @param {HTMLElement} container - The container where the entry is appended.
 * @param {boolean} [isChecked=false] - Whether the checkbox should be checked by default.
 */
function appendCheckboxEntry(title, id, value, container, isChecked = false) {
    appendDiv(
        getPriceEntryClasses(true),
        `<input type="checkbox" id="${id}" ${isChecked ? 'checked' : ''}>
         <label for="${id}" class="btn mr-sm"></label>
         <span class="b2 light txt-darker" style="margin-right: auto;">${title}</span>
         <span class="entry__amount b1 upper bold" id="${id}_amount">${value}</span>`,
        container
    );
}

/**
 * Initializes the finance, warranties, delivery, and extras checkboxes.
 * @param {Object} currentCarData - The car data containing all relevant information.
 */
function initializeCheckboxes(currentCarData) {
    const financeOptionsContainer = document.getElementById('carFinanceOptionsContainer');
    const financeDiscount = currentCarData.rawPrice - currentCarData.rawFinancePrice;

    if (financeDiscount > 0) {
        appendCheckboxEntry('Descuento por financiación', 'financeCheckbox', `-${formatCurrency(financeDiscount)}*`, financeOptionsContainer, true);
    }

    appendWarranties(currentCarData, financeOptionsContainer);

    if (currentCarData.isExchangeAvailable) {
        appendDiv(
            getPriceEntryClasses(false, true),
            `<span id="exchangeAmount_title" class="px-lg b2 light txt-darker">Entrega vehículo a cambio</span>
            <a href="/vender-mi-vehiculo.html?id=${currentCarData.carId}" class="btn-op rl-lg px-lg pblk-sm bg-darkist">
                <span class="center txt-light h4 italic">Valorar coche</span>
            </a>`,
            financeOptionsContainer
        );
    }

    appendExtrasAvailable(currentCarData, financeOptionsContainer);

    if (currentCarData.isDeliveryAvailable) {
        appendDiv(
            getPriceEntryClasses(true),
            `<input type="checkbox" id="deliveryCheckbox">
             <label for="deliveryCheckbox" class="btn mr-sm"></label>
             <span id="deliveryLabel_title" class="b2 light txt-darker" style="margin-right: auto;">Entrega a domicilio</span>
             <select id="regionDropdown" class="mx-sm p-sm round-lg" style="display: none; margin-right: auto;"></select>
             <div class="entry__amount b1 bold upper" id="regionAmount">Activate</div>`,
            financeOptionsContainer
        );
    }
}

export { initializeCheckboxes, setupCheckboxEventListeners };