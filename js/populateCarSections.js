// populateCarSections.js

import { insertDropdownSections, renderFeatureItems, renderSpecsItems } from './dropdown.js';
//import { formatCurrency } from './formatCarData.js';  // Importing the initializer function

import { getCarTitleContent } from './listingsDisplay.js'

import { showDiscountInfo } from './popupInformation.js';  ///////////// ADDED IMPORT RECENTLY

/**
 * Populates various sections with data from the car object.
 * @param {Object} elements - The DOM elements to populate.
 * @param {Object} currentCarData - The car data object.
 * @param {boolean} isNewCar - Indicates if the car is new.
 */
function populateCarSections(elements, currentCarData, isNewCar) {
    insertCarTitle(elements.carTitleContainer, currentCarData, isNewCar);
    insertDiscountSection(
        currentCarData.rawPreviousPrice, 
        currentCarData.rawSavingsAmount, 
        currentCarData.price, 
        currentCarData.previousPrice, 
        currentCarData.savingsAmount
    );
    initializeFinanceSection(elements.financeSectionContainer, currentCarData.financePrice, currentCarData.price);
    insertWarrantyData(elements.warrantyContainer, currentCarData.standardWarranty);
    insertPrintDetailsButton(elements.printDetailsContainer, currentCarData.carId);

    // Call featuresContainer only if isNewCar is true
    if (isNewCar) {
        insertDropdownSections(document.getElementById('featuresContainer'), currentCarData, {
            title: 'Características Especiales',
            dataKey: 'features',
            itemRenderer: renderFeatureItems
        });
    }

    insertDropdownSections(document.getElementById('specsContainer'), currentCarData, {
        title: 'Especificaciones Técnicas',
        dataKey: 'specs',
        itemRenderer: renderSpecsItems
    });
}

/**
 * Inserts a formatted car title into the specified container element.
 * @param {HTMLElement} carTitleContainer - The container element where the car title will be inserted.
 * @param {Object} currentCarData - An object containing the car data to display.
 */
function insertCarTitle(carTitleContainer, currentCarData, isNewCar) {
    if (!carTitleContainer) return; // Early return if the element is not found

    carTitleContainer.innerHTML = ` ${getCarTitleContent(currentCarData, isNewCar)} `;
}

/**
 * Inserts a discount section into a specified container element.
 * @param {number} rawPreviousPrice - The original price before the discount.
 * @param {number} rawSavingsAmount - The amount of savings due to the discount.
 * @param {number} price - The formatted current price after the discount.
 * @param {number} previousPrice - The formatted previous price before the discount.
 * @param {number} savingsAmount - The formatted amount saved due to the discount.
 */
function insertDiscountSection(rawPreviousPrice, rawSavingsAmount, price, previousPrice, savingsAmount) {
    const discountContainer = document.getElementById('sidebarDiscountDiv');
    if (!discountContainer) return; // Early return if the element is not found

    // Calculate the percentage savings
    const discountPercentage = ((rawSavingsAmount / rawPreviousPrice) * 100).toFixed(0);

    if (discountPercentage <= 0) {
        discountContainer.style.visibility = 'hidden';
    } else {
        discountContainer.innerHTML = `
            <div class="flex jc-end pb-sm">
                <div class="show-discount-button btn round-xlg px-lg pblk-sm bg-accent center">
                    <span class="txt-light h4 italic">¡Te ahorras! ${discountPercentage}%</span>
                </div>
            </div>
        `;
        discountContainer.style.visibility = 'visible'; // Set visibility to visible

        // Adding event listener to the show-discount-button
        const showDiscountButton = document.querySelector('.show-discount-button');
        if (showDiscountButton) {
            // Pass only the relevant data to the event listener
            showDiscountButton.addEventListener('click', (event) => showDiscountInfo(
                event, 
                price,          // Current price after discount
                previousPrice,  // Previous price before discount
                savingsAmount   // Amount saved
            ));
        }
    }
}


/**
 * Initialize a finance section into a specified container element.
 * @param {HTMLElement} financeSectionContainer - The container element to initialize the finance section.
 * @param {number} financePrice - The financed price of the vehicle.
 * @param {number} price - The price of the vehicle without financing.
 */
function initializeFinanceSection(financeSectionContainer, financePrice, price) {
    if (!financeSectionContainer) return; // Early return if the element is not found

    financeSectionContainer.innerHTML = `
        <div id="priceItems" class="price-items flex">
            <div class="box flex fd-col px-lg pblk-sm txt-right contrast">
                <span class="pt-xsm h4 italic">Financiando</span>
                <span class="b2">sujeto a financiación</span>
                <span id="precioFinacio" class="h2">${financePrice}*</span>
            </div>
            <div class="box flex fd-col px-lg pblk-sm txt-right">
                <span class="pt-xsm h4 italic">Al contado</span>
                <span class="b2">sin financiación</span>
                <span id="precioNuevo" class="h2">${price}*</span>
            </div>
        </div>
        <div id="initalFinanceValue" class="px-lg pblk-md flex jc-between ai-center bg-light"></div>
        <div id="carFinanceOptionsContainer" class="price-group"></div>
        <div class="pb-md bg-darkist">
            <div id="vehicle-price-result" class="flex jc-between px-lg pblk-md">
                <span class="b1 txt-light">
                    <span class="h3">Precio Final</span><br>
                    <span>Todo incluido. Llave en mano.</span>
                </span>
                <span id="PrecioFinal" class="h2 txt-light">${financePrice}*</span>
            </div>
            <div class="vehicle-price-result__action flex fd-col px-lg">
                <div id="priceAlertBtn" class="btn round-xlg px-lg pblk-sm bg-accent center">
                    <span class="txt-light h4 italic">Avísame si baja de precio</span>
                </div>
                <div id="testDriveBtn" class="btn round-xlg mblk-sm px-lg pblk-sm bg-accent center">
                    <span class="txt-light h4 italic">Pruébalo sin compromiso</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Inserts a print details button into a specified container element.
 * @param {HTMLElement} printDetailsContainer - The container element to insert the print details button into.
 * @param {string} carID - The car reference ID to be included in the button URL.
*/
function insertPrintDetailsButton(printDetailsContainer, carID) {
    if (!printDetailsContainer) return; // Early return if the element is not found

    printDetailsContainer.innerHTML = `
        <span class="col-6 text-center">
            <a href="/print-car-data.html?id=${carID}" rel="nofollow"> Imprimir ficha</a>
        </span>
    `;
}

/**
 * Inserts a warranty section into a specified container element.
 * @param {HTMLElement} warrantyContainer - The container element to insert the warranty section into.
 * @param {number} guaranteePeriod - The length of the warranty in months.
 */
function insertWarrantyData(warrantyContainer, guaranteePeriod) {
    if (!warrantyContainer) return; // Early return if the element is not found

    // Define VIP and standard guarantee periods
    const vipGuaranteeMonths = 24; // VIP guarantee in months
    const standardGuaranteeMonths = 12; // Standard guarantee in months

    // Generate the warranty message based on the guarantee period
    const warrantyMessage = guaranteePeriod === vipGuaranteeMonths
    ? `En Martínez de Lugo, tu satisfacción es nuestra prioridad. Tu coche ya incluye una garantía VIP de 
        ${vipGuaranteeMonths} meses, asegurando una protección completa y tranquilidad durante todo este tiempo.`
    : `En Martínez de Lugo, tu satisfacción es nuestra prioridad. Ofrecemos una garantía estándar de ${standardGuaranteeMonths} meses, 
        para que disfrutes de tu coche con total confianza. Además, tienes la opción de mejorar a nuestra garantía 
        VIP, extendiendo la cobertura a ${vipGuaranteeMonths} meses por un coste adicional.`;

    // Insert the HTML structure into the container
    warrantyContainer.innerHTML = `
        <div class="benefits-message__title">
            Incluido <u>GRATIS</u>
        </div>
        <ul class="list-vertical list-vertical--check pl-1 mb-0">
            <li>${guaranteePeriod} meses de garantía</li>
            <li>Costes de gestión y transferencia</li>
        </ul>
        
        <h3>Garantía</h3>
        <p>${warrantyMessage}</p>
        <p class="mt-3 mb-0 color--neutral-300">
            <small>* La garantía está sujeta a disponibilidad y a los términos y condiciones aplicables.</small>
        </p>
    `;
}

// Export functions
export {
    populateCarSections
};