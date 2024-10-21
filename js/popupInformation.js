import { initializePopup, createPopupHeader, formatDetail } from './popupUtils.js';
import { generateLoanContent } from './financeCalcUpdater.js';

import { formatCurrency } from './formatCarData.js';  // Importing the initializer function

/**
 * Shows the filter options popup.
 * @param {Event} event - The event object from the event listener.
 */
export function showFilterOptions(event) {
    initializePopup('filterPopup', 'closeFilterPopup', null, event);
}

/**
 * Shows the sort options popup.
 * @param {Event} event - The event object from the event listener.
 */
export function showSortOptions(event) {
    initializePopup('sortPopup', 'closeSortPopup', null, event);
}

/**
 * Shows the loan information popup with detailed loan offer information.
 * @param {Event} event - The event object from the event listener.
 * @param {number} loanTermMonths - The length of the loan in months.
 * @param {number} totalLoanAmount - The price of the vehicle.
 * @param {number} vehicleDeposit - The deposit amount for the vehicle.
 * @param {number} annualRateTIN - The annual percentage rate (TIN) in percentage.
 * @param {number} initialFeePercent - The commission rate in percentage.
 * @param {number} formattedPmt - The monthly payment amount.
 * @param {number} annualRateTAE - The annual equivalent rate (TAE) in percentage.
 * @param {number} installmentAmount - The annual equivalent rate (TAE) in percentage.
 */
// Refactored showLoanInfo function
export function showLoanInfo(event, formattedPmt, totalLoanAmount, deposit, loanTermMonths, installmentAmount, initialFeePercent, annualRateTIN, annualRateTAE) {
    const getContent = () => `
        ${createPopupHeader('Offer details', 'finance')}
        ${generateLoanContent({
        formattedPmt,
        totalLoanAmount,
        deposit,
        loanTermMonths,
        installmentAmount,
        initialFeePercent,
        annualRateTIN,
        annualRateTAE,
        includeDocumentsButton: false,
        includeAcknowledgeButton: true
    })}
    `;
    initializePopup('loanPopup', 'closeFinancePopup', getContent, event, true);
}

/**
 * Shows the consumption information popup with detailed vehicle consumption data.
 * @param {Event} event - The event object from the event listener.
 * @param {Object} currentCarData - An object containing vehicle consumption data.
 */
export function showConsumptionInfo(event, currentCarData) {
    const efficientConsumptionThreshold = 5.0; // Fuel consumption threshold for efficiency
    const longRangeThreshold = 1000; // Driving distance threshold for long range

    // Calculate maximum driving distance
    const maxDistance = (currentCarData.fuelTankCapacity / currentCarData.rawAverageConsumption) * 100;

    console.log(maxDistance)

    // Base content template
    const contentTemplate = (message) => `<p>El <strong>${currentCarData.brand} ${currentCarData.model}</strong> ${message}</p>`;

    // Determine variation-specific content
    const variationContent = (() => {
        if (currentCarData.averageConsumption < efficientConsumptionThreshold) {
            return contentTemplate('destaca por su excepcional eficiencia de combustible, ideal para quienes buscan un menor consumo.');
        }
        if (maxDistance > longRangeThreshold) {
            return contentTemplate('se destaca por su gran capacidad de depósito, ideal para quienes buscan un mayor rango de conducción.');
        }
        return contentTemplate('ofrece un rendimiento equilibrado y confiable, adecuado para diversas necesidades de conducción.');
    })();

    // Generate popup content
    const getContent = () => `
        ${createPopupHeader('Detalles de consumo', 'consumption')}
        <div class="horsepower-container">
            <span>A continuación se presentan las especificaciones detalladas de potencia del vehículo:</span>
            
            <div id="carOverviewPopupContainer" class="details-container">
                ${formatDetailWithIcon("range-average", `${currentCarData.averageConsumption}`, "Consumo medio")}
                ${formatDetailWithIcon("range-urban", `${currentCarData.urbanConsumption}`, "Consumo ciudad")}
                ${formatDetailWithIcon("range-highway", `${currentCarData.highwayConsumption}`, "Consumo carretera")}
                ${formatDetailWithIcon("range-tank", `${currentCarData.fuelTankCapacity}`, "Capacidad del Depósito")}
            </div>

            <span>
                Si tiene alguna pregunta o desea más información, no dude en ponerse en contacto con nosotros a través de uno de nuestros formularios de contacto, 
                o llámenos directamente o visítenos en persona.
            </span><br><br>
            
            <strong>Teléfono:</strong> <span>982 21 74 03</span><br>
            <strong>Dirección:</strong> <span>Estrada de A Coruna, 50, 27003 Lugo</span><br>
    `;

    // Initialize popup with the generated content
    initializePopup('consumptionPopup', 'closeConsumptionPopup', getContent, event);
}

/**
 * Shows the emissions information popup with details about the vehicle's emission label.
 * @param {Event} event - The event object from the event listener.
 * @param {Object} currentCarData - An object containing emission data.
 */
export function showEmissionsInfo(event, currentCarData) {

    const getEmissionContent = (label) => {
        const emissionData = {
            'emission-zero': `
                La etiqueta CERO identifica a los vehículos menos contaminantes...
                <ul>
                    <li>Pueden circular por el BUS VAO de la A6 en Madrid...</li>
                    <li>No se ven afectados por restricciones a la circulación...</li>
                    <li>Bonificación del 75% en el Impuesto de Circulación en Madrid...</li>
                    <li>Aparcamiento gratuito y sin límite de tiempo en zona SER de Madrid...</li>
                    <li>Acceso a peajes Ecoviat en Barcelona solicitando el distintivo Ecoviat.</li>
                </ul>
            `,
            'emission-c': `
                La etiqueta C distingue a los vehículos con motor de gasolina que cumplan las normativas Euro4...
                <ul>
                    <li>Acceso a la M30 de Madrid hasta el escenario 4 por alta contaminación.</li>
                    <li>Acceso a la ‘almendra central’ de Madrid hasta el escenario 4 por alta contaminación.</li>
                    <li>Impedimento para circular por el centro de Madrid en escenario 5...</li>
                    <li>Estacionamiento en zona regulada hasta escenario 1 por alta contaminación.</li>
                </ul>
            `,
            'emission-eco': `
                La etiqueta ECO está reservada para vehículos híbridos enchufables con menos de 40 kilómetros de autonomía eléctrica...
                <ul>
                    <li>Bonificación de hasta el 75% en el Impuesto de Circulación en Madrid y Barcelona.</li>
                    <li>Pueden circular por el carril bus VAO en Madrid y Barcelona con un solo ocupante...</li>
                    <li>Descuento del 50% en zona de estacionamiento regulado en Madrid.</li>
                    <li>Descuento del 30% en los peajes de Cataluña.</li>
                    <li>Permitido el acceso a las grandes ciudades con restricciones de circulación por alta contaminación.</li>
                </ul>
            `,
            'emission-b': `
                La etiqueta B corresponde a los vehículos con motor de gasolina que cumplan la normativa Euro3...
                <ul>
                    <li>Acceso a la M30 de Madrid hasta el escenario 3 por alta contaminación.</li>
                    <li>Acceso a la ‘almendra central’ de Madrid hasta escenario 3 por alta contaminación.</li>
                    <li>Impedimento para circular por el centro de Madrid en escenario 5...</li>
                    <li>Estacionamiento en zona regulada hasta escenario 1 por alta contaminación.</li>
                </ul>
            `
        };
        return emissionData[label] || '';
    };

    const getContent = () => `
        ${createPopupHeader('Distintivo de emisiones', 'emissions')}
        <img src="icons/car-details/emissionLabel-${currentCarData.emissionLabel}.svg" alt="Emission Label" width="120" height="120" style="display: block; margin: 0 auto; padding: 1rem;">
        ${getEmissionContent(currentCarData.emissionLabel)}
        <div>Consumos según el fabricante</div>
    `;
    initializePopup('emissionsPopup', 'closeEmissionsPopup', getContent, event);
}

/**
 * Shows the documents information popup with a list of required documents for financing.
 * @param {Event} event - The event object from the event listener.
 */
export function showDocumentsInfo(event) {
    const getContent = () => `
        ${createPopupHeader('Documentos necesarios', 'documents')}
        <div class="documents-container">
            <p>Para la financiación es necesario presentar los siguientes documentos:</p>
            <h2>Si eres particular:</h2>
            <ul>
                <li>DNI</li>
                <li>Última nómina</li>
                <li>Cuenta bancaria</li>
            </ul>
            <h2>Si eres autónomo:</h2>
            <ul>
                <li>DNI</li>
                <li>Cuenta bancaria</li>
                <li>Declaración de la renta</li>
                <li>IVA anual y trimestral</li>
                <li>Recibo autónomo</li>
            </ul>
            <h2>Si eres empresa:</h2>
            <ul>
                <li>Cuenta bancaria</li>
                <li>DNI apoderado</li>
                <li>IVA anual y trimestral</li>
                <li>CIF</li>
                <li>Escritura</li>
                <li>Balance</li>
                <li>Impuesto de sociedad</li>
            </ul>
        </div>
    `;
    initializePopup('documentsPopup', 'closeDocumentsPopup', getContent, event);
}



/**
 * Formats a detail item with an icon, value, and label.
 * @param {string} icon - The icon name for the detail item.
 * @param {string} value - The value corresponding to the detail.
 * @param {string} label - The label describing the value.
 * @returns {string} - The HTML string representing the formatted detail item or an empty string if the value is blank.
 */
const formatDetailWithIcon = (icon, value, label) => {
    // Return an empty string if value is blank
    if (!value) {
        return '';
    }

    return `
        <div class="more-details">
            <img src="icons/car-details/${icon}.svg" alt="${label}">
            <div class="detail-text b1">
                <span class="font-bold uppercase">${value}</span>
                <span class="txt-grey b2">${label}</span>
            </div>
        </div>
    `;
};



/**
 * Shows the horsepower information popup with detailed power specifications of the car.
 * @param {Event} event - The event object from the event listener.
 * @param {Object} currentCarData - The data object containing car specifications.
 */
export function showHorsepowerInfo(event, currentCarData) {
    const getContent = () => `
        ${createPopupHeader('Detalles del motor', 'horsepower')}
        <div class="horsepower-container">
            <span>A continuación se presentan las especificaciones detalladas de potencia del vehículo:</span>
            
            <div id="carOverviewPopupContainer" class="details-container">
                ${formatDetailWithIcon("engine", `${currentCarData.engineTechnology}`, "Tecnología de motores")}
                ${formatDetailWithIcon("engine-capacity", `${currentCarData.displacementCC}`, "Cilindrada")}
                ${formatDetailWithIcon("cv", `${currentCarData.cv}`, "Potencia CV")}
                ${formatDetailWithIcon("cv", `${currentCarData.kw}`, "Potencia kW")}
                ${formatDetailWithIcon("engine-torque", `${currentCarData.torque} Nm`, "Par motor")}
                ${formatDetailWithIcon("engine-cylinders", `${currentCarData.cylinders}`, "Cilindros")}
            </div>

            <span>
                Si tiene alguna pregunta o desea más información, no dude en ponerse en contacto con nosotros a través de uno de nuestros formularios de contacto, 
                o llámenos directamente o visítenos en persona.
            </span><br><br>
            
            <strong>Teléfono:</strong> <span>982 21 74 03</span><br>
            <strong>Dirección:</strong> <span>Estrada de A Coruna, 50, 27003 Lugo</span><br>
            
        </div>
    `;
    initializePopup('horsepowerPopup', 'closeHorsepowerPopup', getContent, event);
}

/**
 * Shows the horsepower information popup with detailed specifications of the car body type, dimensions, and weight.
 * @param {Event} event - The event object from the event listener.
 * @param {Object} currentCarData - The data object containing car specifications.
 */
export function showBodyTypeInfo(event, currentCarData) {
    // Define the content for the popup
    const getContent = () => `
        ${createPopupHeader('Detalles de la carrocería', 'bodyType')}
        <div class="horsepower-container">
            <span>A continuación se presentan las especificaciones detalladas de la carrocería del vehículo, incluyendo dimensiones y peso:</span>
            
            <div id="carOverviewPopupContainer" class="details-container">
                ${formatDetailWithIcon("bodyType", `${currentCarData.bodyType}`, "Carrocería")}
                ${formatDetailWithIcon("body-weight", `${currentCarData.weight} kg`, "Peso")}
                ${formatDetailWithIcon("body-length", `${currentCarData.length} mm`, "Longitud")}
                ${formatDetailWithIcon("body-width", `${currentCarData.width} mm`, "Ancho")}
                ${formatDetailWithIcon("body-height", `${currentCarData.height} mm`, "Altura")}
                ${formatDetailWithIcon("body-trackwidth", `${currentCarData.trackWidth} mm`, "Ancho de vía")}
                ${formatDetailWithIcon("body-wheelbase", `${currentCarData.wheelbase} mm`, "Distancia entre ejes")}
            </div>

            <span>
                Si tiene alguna pregunta sobre las especificaciones o desea más información, no dude en contactarnos a través de nuestros formularios de contacto, 
                o llámenos directamente o visítenos en persona.
            </span>
            <span>
                Si tiene alguna pregunta o desea más información, no dude en ponerse en contacto con nosotros a través de uno de nuestros formularios de contacto, 
                o llámenos directamente o visítenos en persona.
            </span><br><br>
            
            <strong>Teléfono:</strong> <span>982 21 74 03</span><br>
            <strong>Dirección:</strong> <span>Estrada de A Coruna, 50, 27003 Lugo</span><br>
        </div>
    `;

    // Initialize the popup with the content
    initializePopup('bodyTypePopup', 'closeBodyTypePopup', getContent, event);
}





/**
 * Shows the discount information popup with current and previous prices.
 * @param {Event} event - The event object from the event listener.
 * @param {number} price - The current price of the car.
 * @param {number} previousPrice - The previous price of the car.
 * @param {number} savingsAmount - The amount of money saved due to the discount.
 */
export function showDiscountInfo(event, price, previousPrice, savingsAmount) {

    const getContent = () => `
        ${createPopupHeader('Detalles del Descuento', 'discount')}
        <div class="horsepower-container">
            <span> Aprovecha este increíble descuento en nuestro vehículo seleccionado:</span>
            
            <div id="carOverviewPopupContainer" class="details-container">
                ${formatDetailWithIcon("price-new", `${price}`, "Precio actual")}
                ${formatDetailWithIcon("price-discount", formatCurrency(savingsAmount), "¡Te ahorras!")}
                ${formatDetailWithIcon("price-previous", `${previousPrice}`, "Precio anterior")}
            </div>
            <span>
                Si tiene alguna pregunta sobre las especificaciones o desea más información, no dude en contactarnos a través de nuestros formularios de contacto, 
                o llámenos directamente o visítenos en persona.
            </span>
            <span>
                Si tiene alguna pregunta o desea más información, no dude en ponerse en contacto con nosotros a través de uno de nuestros formularios de contacto, 
                o llámenos directamente o visítenos en persona.
            </span><br><br>
            
            <strong>Teléfono:</strong> <span>982 21 74 03</span><br>
            <strong>Dirección:</strong> <span>Estrada de A Coruna, 50, 27003 Lugo</span><br>
        </div>
    `;

    initializePopup('discountPopup', 'closeDiscountPopup', getContent, event);
}