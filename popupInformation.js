import { initializePopup, createPopupHeader, formatDetail } from './js/popupUtils.js';
import { formatCurrency } from './js/formatCarData.js';

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
 * 
 * Note: Updated to correctly calculate and display the financed price and
 *       adjusted detail labels.
 *
 * @param {Event} event - The event object from the event listener.
 * @param {number} loanLengthMonths - The length of the loan in months.
 * @param {number} rawFinancePrice - The price of the vehicle.
 * @param {number} vehicleDeposit - The deposit amount for the vehicle.
 * @param {number} annualRateTIN - The annual percentage rate (TIN) in percentage.
 * @param {number} commissionRate - The commission rate in percentage.
 * @param {number} pmt - The monthly payment amount.
 * @param {number} annualRateTAE - The annual equivalent rate (TAE) in percentage.
 */
export function showLoanInfo(event, loanLengthMonths, rawFinancePrice, vehicleDeposit, annualRateTIN, commissionRate, pmt, annualRateTAE) {
    const getContent = () => `
        ${createPopupHeader('Offer details', 'finance')}
        <div class="finance-details-container">
            ${formatDetail("Cuota mensual*", formatCurrency(pmt))}
            ${formatDetail("Precio financiando", formatCurrency(rawFinancePrice - vehicleDeposit))} 
            ${formatDetail("Entrada", formatCurrency(vehicleDeposit))}
            ${formatDetail("Meses", loanLengthMonths)}
            ${formatDetail("Importe a plazos", formatCurrency(loanLengthMonths * pmt))}
            ${formatDetail("Comisión de apertura", formatCurrency(rawFinancePrice * commissionRate / 100))}
            ${formatDetail("TIN", `${annualRateTIN} %`)}
            ${formatDetail("TAE", `${annualRateTAE} %`)}
            ${formatDetail("Primera cuota", formatCurrency(pmt))}
            ${formatDetail("Financiación provista por", "Santander")}
        </div>
        <div class="finance-conditions">
            <h2 class="legal-conditions-title">Condiciones de financiación</h2>
            <div class="legal-conditions">
                <h3>Condiciones legales Adevinta</h3>
                <p>La información, precios, cuotas de financiación, imágenes y otros contenidos relativos a los vehículos incluidos en el Portal son proporcionados por terceros...</p>
                <p>En particular, las cuotas de financiación reflejadas en los anuncios se basan en las campañas de financiación...</p>
            </div>
            <div class="legal-conditions">
                <h3>Condiciones legales Santander Consumer Finance</h3>
                <p>***Precio al contado ${formatCurrency(rawFinancePrice)}. Precio financiando ${formatCurrency(rawFinancePrice)}...</p>
                <p>***Financiación ofrecida por Santander Consumer, S.A. sujeto a estudio y aprobación...</p>
                <div class="popup-buttons">
                    <button id="acknowledgeButton" class="acknowledge-button">Entendido</button>
                </div>
            </div>
        </div>
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
        ${createPopupHeader('Eficiencia y Autonomía del Combustible', 'consumption')}
        <div class="fuel-efficiency contact-intro">
            <strong>Consumo de Combustible:</strong></li>
            <ul>
                <li>${formatDetail("Consumo medio", `${currentCarData.averageConsumption} l/100 km`)}</li>
                <li>${formatDetail("Consumo ciudad", `${currentCarData.urbanConsumption} l/100 km`)}</li>
                <li>${formatDetail("Consumo carretera", `${currentCarData.highwayConsumption} l/100 km`)}</li>
            </ul>
            <li>${formatDetail("Capacidad del Depósito", `${currentCarData.fuelTankCapacity} L`)}</li>
            <p>Con un depósito lleno, puedes esperar una autonomía de hasta <strong>${Math.round(maxDistance)}</strong> km.</p>
            ${variationContent}
        </div>
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
        <img src="icons/car/emission-types/${currentCarData.emissionLabel}.svg" alt="Emission Label" width="120" height="120" style="display: block; margin: 0 auto; padding: 1rem;">
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
            <h3>Documentos necesarios</h3>
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
 * Shows the horsepower information popup with detailed power specifications of the car.
 * @param {Event} event - The event object from the event listener.
 * @param {Object} currentCarData - The data object containing car specifications.
 */
export function showHorsepowerInfo(event, currentCarData) {
    const getContent = () => `
        ${createPopupHeader('Horsepower Details', 'horsepower')}
        <div class="horsepower-container">
            <h3>Engine Specifications</h3>
            <p>Here are the detailed power specifications for the vehicle:</p>
            <ul>
                <li>${formatDetail("Power (KW)", `${currentCarData.powerKW} kW`)}</li>
                <li>${formatDetail("Power (HP)", `${currentCarData.powerCV} HP`)}</li>
                <li>${formatDetail("Torque", `${currentCarData.torque} Nm`)}</li>
                <li>${formatDetail("Displacement", `${currentCarData.displacementCC} cc`)}</li>
                <li>${formatDetail("Cylinders", `${currentCarData.cylinders}`)}</li>
                <li>${formatDetail("Engine Type", `${currentCarData.EngineTechnology}`)}</li>
            </ul>
        </div>
    `;
    initializePopup('horsepowerPopup', 'closeHorsepowerPopup', getContent, event);
}

/**
 * Shows the body type information popup with detailed specifications of the car's body.
 * @param {Event} event - The event object from the event listener.
 * @param {Object} currentCarData - The data object containing car specifications.
 */
export function showBodyTypeInfo(event, currentCarData) {
    // Generate the SVG as a string with dynamic data
    const svgContent = `
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 700 250" style="enable-background:new 0 0 700 250;" xml:space="preserve">
            <image style="overflow:visible;" width="693" height="260" xlink:href="car-dimensions.webp" transform="matrix(1 0 0 1 3.0349 -4.9535)"></image>
            <text transform="matrix(1 0 0 1 219 205)" class="car-dimensions">${currentCarData.wheelbase}</text>
            <text transform="matrix(1 0 0 1 219 232)" class="car-dimensions">${currentCarData.length}</text>
            <text transform="matrix(-1.836970e-16 -1 1 -1.836970e-16 441 119)" class="car-dimensions">${currentCarData.height}</text>
            <text transform="matrix(1 0 0 1 562 205)" class="car-dimensions">${currentCarData.trackWidth}</text>
            <text transform="matrix(1 0 0 1 562 232)" class="car-dimensions">${currentCarData.width}</text>
        </svg>
    `;

    // Define the content for the popup
    const getContent = () => `
        ${createPopupHeader('Body Type Details', 'bodyType')}
        <div class="bodytype-container">
            <h3>Body Specifications</h3>
            <ul>
                <li>${formatDetail("Body Type", `${currentCarData.bodyType}`)}</li>
                <li>${formatDetail("Weight", `${currentCarData.weight} kg`)}</li>
            </ul>
            <div id="svgContainer">${svgContent}</div>
        </div>
    `;

    // Initialize the popup with the content
    initializePopup('bodyTypePopup', 'closeBodyTypePopup', getContent, event);
}


