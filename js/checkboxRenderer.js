// checkboxRenderer.js

import { formatCurrency } from './formatCarData.js';  // Importing the initializer function
import { handleDeliveryCheckboxChange, handleFinanceCheckboxChange, handleExtrasPackageCheckboxChange } from './checkboxHandlers.js';

/**
     * Adds event listeners to the finance and delivery checkboxes.
     * @param {Object} state - The state object.
     * @param {number} rawPrice - The raw price of the car.
     * @param {number} rawFinancePrice - The raw finance price of the car.
     */
    function setupCheckboxEventListeners(state, rawPrice, rawFinancePrice) {
        const financeCheckbox = document.getElementById('financeCheckbox');
        const deliveryCheckbox = document.getElementById('deliveryCheckbox');

        // Initialize undisclosedFinanceCost once
        state.undisclosedFinanceCost = rawPrice - rawFinancePrice;

        // Initialize undisclosedFinanceCost once
        state.extraCharges = 0;

        // Add event listeners if checkboxes exist
        if (financeCheckbox) {
            financeCheckbox.addEventListener('change', (event) => {
                console.log('Finance checkbox changed:', event.target.checked);
                handleFinanceCheckboxChange(event, state, rawPrice);
            });
        }

        if (deliveryCheckbox) {
            deliveryCheckbox.addEventListener('change', async (event) => {
                console.log('Delivery checkbox changed:', event.target.checked);
                await handleDeliveryCheckboxChange(event, state);
            });
        }

        // Add event listeners for extra packages
        const extras = [
            { id: 'maintenance', cost: 200 },
            { id: 'healthCheck', cost: 340 }
        ];


        extras.forEach(({ id, cost }) => {
            const extrasCheckbox = document.getElementById(`${id}Checkbox`);
            if (extrasCheckbox) {
                extrasCheckbox.addEventListener('change', async (event) => {
                    console.log(`${id} checkbox changed:`, event.target.checked);
                    await handleExtrasPackageCheckboxChange(event, state, cost);
                });
            }
        });
    }

    /**
     * Helper function to append a div with specific class and content
     * @param {string} className - The class name for the div.
     * @param {string} innerHTML - The HTML content to append.
     * @param {HTMLElement} container - The container where the div is appended.
     */
    function appendDiv(className, innerHTML, container) {
        const div = document.createElement('div');
        div.className = className;
        div.innerHTML = innerHTML;
        container.appendChild(div);
    }

    /**
     * Appends a free package entry (like warranties or policies).
     * @param {string} description - The description of the free package.
     * @param {HTMLElement} container - The container where the entry is appended.
     */
    function appendFreePackage(description, container) {
        appendDiv(
            'price-group__entry',
            `<span class="b1">${description}</span>
         <span class="entry__amount h3">GRATIS</span>`,
            container
        );
    }

    /**
     * Appends warranties and flexible return policies.
     * @param {Object} currentCarData - The car data containing warranties and policies.
     * @param {HTMLElement} container - The container where entries are appended.
     */
    function appendWarrantiesAndPolicies(currentCarData, container) {
        const warranties = [
            { description: `Garantía nacional de ${currentCarData.standardWarranty} meses`, condition: currentCarData.standardWarranty > 0 },
            { description: `Garantía del motor de ${currentCarData.engineWarranty} meses`, condition: currentCarData.engineWarranty > 0 },
            { description: `Garantía de la batería de ${currentCarData.batteryWarranty} meses`, condition: currentCarData.batteryWarranty > 0 },
            { description: '14 días o 1000 km para probarlo', condition: currentCarData.hasFlexibleReturnPolicies }
        ];

        warranties.forEach(({ description, condition }) => {
            if (condition) {
                appendFreePackage(description, container);
            }
        });
    }


    /**
     * Appends warranties and flexible return policies.
     * @param {Object} currentCarData - The car data containing warranties and policies.
     * @param {HTMLElement} container - The container where entries are appended.
     */
    function appendExtrasAvailable(currentCarData, container) {
        // Extras packages: Maintenance and Vehicle health check
        const extras = [
            { id: 'maintenance', title: 'Paquete de mantenimiento gratuito', cost: 200, condition: currentCarData.hasMaintenancePackage },
            { id: 'healthCheck', title: 'Chequeo de salud gratuito', cost: 340, condition: currentCarData.hasVehicleHealthCheck }
        ];

        extras.forEach(({ id, title, cost, condition }) => {
            if (condition) {
                appendExtrasPackage(id, title, formatCurrency(cost), container); // Use 'container' instead of 'financeOptionsContainer'
            }
        });
    }

    /**
     * Appends an entry for a free extra package with a checkbox.
     * @param {string} id - The checkbox id.
     * @param {string} title - The title for the extra package.
     * @param {string} value - The value or cost of the extra package.
     * @param {HTMLElement} container - The container where the entry is appended.
     */
    function appendExtrasPackage(id, title, value, container) {
        appendDiv(
            'price-group__entry checkbox-wrapper',
            `<input type="checkbox" id="${id}Checkbox">
         <label for="${id}Checkbox"></label>
         <span class="b1">${title}</span>
         <span class="entry__amount h3 font-fade">${value}</span>`,
            container
        );
    }

    /**
     * Initializes the finance, warranties, delivery, and extras checkboxes.
     * @param {Object} currentCarData - The car data containing all relevant information.
     */
    function initializeCheckboxes(currentCarData) {
        const financeOptionsContainer = document.getElementById('carFinanceOptionsContainer');

        // Finance discount
        const financeDiscount = currentCarData.rawPrice - currentCarData.rawFinancePrice;
        if (financeDiscount > 0) {
            appendDiv(
                'price-group__entry checkbox-wrapper',
                `<input type="checkbox" id="financeCheckbox" checked>
             <label for="financeCheckbox"></label>
             <span id="financeAmount_title" class="b1">Descuento por financiación</span>
             <span class="entry__amount h3" id="financeAmount">-${formatCurrency(financeDiscount)}*</span>`,
                financeOptionsContainer
            );
        }

        // Add warranties and return policies
        appendWarrantiesAndPolicies(currentCarData, financeOptionsContainer);

        // Exchange option
        if (currentCarData.isExchangeAvailable) {
            appendDiv(
                'price-group__entry',
                `<span id="exchangeAmount_title" class="b1">Entrega vehículo a cambio</span>
             <a href="/vender-mi-vehiculo.html?id=${currentCarData.carId}" class="rounded-container rounded-left bg-black h3 italic">Valorar coche</a>`,
                financeOptionsContainer
            );
        }

        appendExtrasAvailable(currentCarData, financeOptionsContainer);

        // Delivery option
        if (currentCarData.isDeliveryAvailable) {
            appendDiv(
                'price-group__entry checkbox-wrapper',
                `<input type="checkbox" id="deliveryCheckbox">
             <label for="deliveryCheckbox"></label>
             <span id="deliveryLabel_title" class="b1">Entrega a domicilio</span>
             <select id="regionDropdown" style="display: none;"></select>
             <div class="entry__amount h3" id="regionAmount">Activate</div>`,
                financeOptionsContainer
            );
        }
    }


    export {initializeCheckboxes, setupCheckboxEventListeners}