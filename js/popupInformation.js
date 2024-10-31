// popupInformation.js

import { initializePopup, createPopupHeader } from './popupUtils.js';


//////////////// ******* PASS ONLY WHAT IS NEEDED AND NOT ALL currentCarData ******* ////////////////

/**
 * Formats a detail item with an icon, value, and label.
 * @param {string} icon - The icon name for the detail item.
 * @param {string} value - The value corresponding to the detail.
 * @param {string} label - The label describing the value.
 * @returns {string} - The HTML string representing the formatted detail item or an empty string if the value is blank.
 */
const formatDetailWithIcon = (icon, value, label) => {
    // Return early if the value is null, undefined, or an empty string
    if (value == null || value === '') return '';

    // Use a template literal for readability
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
 * Returns contact information HTML with customizable phone number and address.
 * @param {string} [phone='982 21 74 03'] - The phone number to display in the contact info.
 * @param {string} [address='Estrada de A Coruna, 50, 27003 Lugo'] - The address to display in the contact info.
 * @returns {string} - The HTML string containing the contact information.
 */
function getContactInfo(phone = '982 21 74 03', address = 'Estrada de A Coruna, 50, 27003 Lugo') {
    return `
        <span>
            Si tiene alguna pregunta o desea más información, no dude en ponerse en contacto con nosotros a través de uno de nuestros formularios de contacto, 
            o llámenos directamente o visítenos en persona.
        </span><br><br>
        <strong>Teléfono:</strong> <span>${phone}</span><br>
        <strong>Dirección:</strong> <span>${address}</span><br>
    `;
}

/**
 * Shows the horsepower information popup with detailed power specifications of the car.
 * @param {Event} event - The event object from the event listener.
 * @param {string} engineTechnology - The technology of the engine.
 * @param {number} displacementCC - The engine displacement in cc.
 * @param {number} cv - The power in CV.
 * @param {number} kw - The power in kW.
 * @param {number} torque - The torque in Nm.
 * @param {number} cylinders - The number of cylinders.
 */
function showHorsepowerInfo(event, engineTechnology, displacementCC, cv, kw, torque, cylinders) {
    const getContent = () => `
        ${createPopupHeader('Detalles del motor', 'information')}
        <div class="popup-information-container">
            <span>A continuación se presentan las especificaciones detalladas de potencia del vehículo:</span>
            
            <div id="carOverviewPopupContainer" class="details-container">
                ${formatDetailWithIcon("engine", engineTechnology, "Tecnología de motores")}
                ${formatDetailWithIcon("engine-capacity", displacementCC, "Cilindrada")}
                ${formatDetailWithIcon("engine-power", cv, "Potencia CV")}
                ${formatDetailWithIcon("engine-power", kw, "Potencia kW")}
                ${formatDetailWithIcon("engine-torque", `${torque} Nm`, "Par motor")}
                ${formatDetailWithIcon("engine-cylinders", cylinders, "Cilindros")}
            </div>
            ${getContactInfo()}
        </div>
    `;
    initializePopup('informationPopup', 'closeInformationPopup', getContent, event);
}

/**
 * Shows the horsepower information popup with detailed specifications of the car body type, dimensions, and weight.
 * @param {Event} event - The event object from the event listener.
 * @param {string} bodyType - The type of the car body.
 * @param {number} weight - The weight of the car in kg.
 * @param {number} length - The length of the car in mm.
 * @param {number} width - The width of the car in mm.
 * @param {number} height - The height of the car in mm.
 * @param {number} trackWidth - The track width of the car in mm.
 * @param {number} wheelbase - The wheelbase of the car in mm.
 */
function showBodyTypeInfo(event, bodyType, weight, length, width, height, trackWidth, wheelbase) {
    // Define the content for the popup
    const getContent = () => `
        ${createPopupHeader('Detalles de la carrocería', 'information')}
        <div class="popup-information-container">
            <span>A continuación se presentan las especificaciones detalladas de la carrocería del vehículo, incluyendo dimensiones y peso:</span>
            
            <div id="carOverviewPopupContainer" class="details-container">
                ${formatDetailWithIcon("bodyType", bodyType, "Carrocería")}
                ${formatDetailWithIcon("body-weight", `${weight} kg`, "Peso")}
                ${formatDetailWithIcon("body-length", `${length} mm`, "Longitud")}
                ${formatDetailWithIcon("body-width", `${width} mm`, "Ancho")}
                ${formatDetailWithIcon("body-height", `${height} mm`, "Altura")}
                ${formatDetailWithIcon("body-trackwidth", `${trackWidth} mm`, "Ancho de vía")}
                ${formatDetailWithIcon("body-wheelbase", `${wheelbase} mm`, "Distancia entre ejes")}
            </div>
            ${getContactInfo()}
        </div>
    `;

    // Initialize the popup with the content
    initializePopup('informationPopup', 'closeInformationPopup', getContent, event);
}

/**
 * Shows the consumption information popup with detailed vehicle consumption data.
 * @param {Event} event - The event object from the event listener.
 * @param {string} brand - The vehicle's brand.
 * @param {string} model - The vehicle's model.
 * @param {number} averageConsumption - The average consumption of the vehicle.
 * @param {number} urbanConsumption - The urban consumption of the vehicle.
 * @param {number} highwayConsumption - The highway consumption of the vehicle.
 * @param {number} fuelTankCapacity - The fuel tank capacity of the vehicle.
 * @param {number} rawAverageConsumption - The raw average consumption for distance calculation.
 */
function showConsumptionInfo(event, brand, model, averageConsumption, urbanConsumption, highwayConsumption, fuelTankCapacity, rawAverageConsumption) {
    const efficientConsumptionThreshold = 5.0; // Fuel consumption threshold for efficiency
    const longRangeThreshold = 1000; // Driving distance threshold for long range

    // Calculate maximum driving distance
    const maxDistance = (fuelTankCapacity / rawAverageConsumption) * 100;

    // Base content template
    const contentTemplate = (message) => `<p>El <strong>${brand} ${model}</strong> ${message}</p>`;

    // Determine variation-specific content using a helper function
    const getVariationContent = () => {
        if (averageConsumption < efficientConsumptionThreshold) {
            return contentTemplate('destaca por su excepcional eficiencia de combustible, ideal para quienes buscan un menor consumo.');
        }
        if (maxDistance > longRangeThreshold) {
            return contentTemplate('se destaca por su gran capacidad de depósito, ideal para quienes buscan un mayor rango de conducción.');
        }
        return contentTemplate('ofrece un rendimiento equilibrado y confiable, adecuado para diversas necesidades de conducción.');
    };

    // Generate popup content
    const getContent = () => `
        ${createPopupHeader('Detalles de consumo', 'information')}
        <div class="popup-information-container">
            <span>A continuación se presentan las especificaciones detalladas de potencia del vehículo:</span>
            <div id="carOverviewPopupContainer" class="details-container">
                ${formatDetailWithIcon("range-average", averageConsumption, "Consumo medio")}
                ${formatDetailWithIcon("range-urban", urbanConsumption, "Consumo ciudad")}
                ${formatDetailWithIcon("range-highway", highwayConsumption, "Consumo carretera")}
                ${formatDetailWithIcon("range-tank", fuelTankCapacity, "Capacidad del Depósito")}
            </div>
            <p>Con un depósito lleno, puedes esperar una autonomía de hasta <strong>${Math.round(maxDistance)}</strong> km.</p>
            ${getVariationContent()}
            ${getContactInfo()}
        `;

    // Initialize popup with the generated content
    initializePopup('informationPopup', 'closeInformationPopup', getContent, event);
}

/**
 * Shows the emissions information popup with details about the vehicle's emission label.
 * @param {Event} event - The event object from the event listener.
 * @param {string} emissionLabel - The emission label of the vehicle.
 * @param {number} co2Emissions - The CO2 emissions of the vehicle in g/km.
 */
function showEmissionsInfo(event, emissionLabel, co2Emissions) {
    // Helper function to create emission content
    const createEmissionContent = (description, benefits, range) => `
        <div class="popup-information-container">
            <span>${description}</span>
            <div id="carOverviewPopupContainer" class="details-container">
                ${formatDetailWithIcon(`emissionLabel-${emissionLabel}`, `${co2Emissions} g/km`, "Emisiones CO2")}
                ${formatDetailWithIcon("emission-range", range, "Rango de la Etiqueta")}
            </div>
            <span><strong>Los beneficios incluyen:</strong></span>
            <ul class="ulPopup">
                ${benefits.map(benefit => `<li>${benefit}</li>`).join('')}
            </ul>
            ${getContactInfo()}
        </div>
    `;

    // Emission data mapping with ranges ordered from best to worst
    const emissionData = {
        'zero': {
            description: 'La etiqueta 0 (Cero) se otorga a los vehículos eléctricos y a los híbridos enchufables que emiten cero emisiones contaminantes.',
            benefits: [
                'Acceso total a todas las áreas de bajas emisiones sin restricciones.',
                'Exenciones de peajes en muchas ciudades, como Madrid y Barcelona, y descuentos en impuestos de circulación.',
                'Posibilidad de recargar en estaciones de carga sin coste o a precios reducidos en muchos municipios.',
                'Beneficios adicionales en el estacionamiento, como el acceso a plazas reservadas y tarifas reducidas.',
                'Promoción de un transporte más limpio y sostenible, contribuyendo a un mejor medio ambiente.'
            ],
            range: '0 g/km'
        },
        'eco': {
            description: 'La etiqueta ECO se otorga a vehículos híbridos y de gas que cumplen con ciertos estándares de emisiones.',
            benefits: [
                'Acceso a zonas de bajas emisiones, facilitando la circulación en áreas restringidas.',
                'Descuentos en el estacionamiento y posibilidad de utilizar carriles bus-VAO en algunas localidades.',
                'Acceso a ayudas para la compra y subvenciones para vehículos sostenibles.',
                'Fomento de un estilo de vida más ecológico, contribuyendo a la mejora de la calidad del aire.'
            ],
            range: '> 120 g/km'
        },
        'b': {
            description: 'La etiqueta B se otorga a los vehículos de gasolina Euro 4 y Euro 5, y diésel Euro 6.',
            benefits: [
                'Acceso a zonas de bajas emisiones en muchas ciudades, facilitando la circulación sin restricciones.',
                'Beneficios en el estacionamiento en áreas reguladas, incluyendo tarifas reducidas o acceso a zonas reservadas.',
                'Posibilidad de participar en programas de incentivos y subvenciones para la compra de vehículos ecológicos.',
                'Menores tasas de impuestos de circulación en comparación con vehículos de etiquetas más contaminantes.',
                'Contribución a la mejora de la calidad del aire y reducción de la huella de carbono.'
            ],
            range: '0-120 g/km'
        },
        'c': {
            description: 'La etiqueta C se aplica a vehículos de gasolina Euro 4 y Euro 5, y diésel Euro 6.',
            benefits: [
                'Acceso a áreas de bajas emisiones, aunque con restricciones que pueden variar según el municipio.',
                'Tarifas reducidas en estacionamientos regulados y exenciones de algunas tasas de tráfico.',
                'Oportunidad de acceder a incentivos y subvenciones específicas para mejorar la eficiencia energética.',
                'Fomento de la sostenibilidad y reducción de emisiones en el transporte.'
            ],
            range: '121-180 g/km'
        }
    };

    const currentEmission = emissionData[emissionLabel] || {};

    const getContent = () => `
        ${createPopupHeader('Distintivo de emisiones', 'information')}
        ${createEmissionContent(currentEmission.description, currentEmission.benefits, currentEmission.range)}
    `;

    initializePopup('informationPopup', 'closeInformationPopup', getContent, event);
}

/**
 * Shows the discount information popup with current and previous prices.
 * @param {Event} event - The event object from the event listener.
 * @param {number} price - The formatted current price of the car.
 * @param {number} previousPrice - The formatted previous price of the car.
 * @param {number} savingsAmount - The formatted amount of money saved due to the discount.
 */
function showDiscountInfo(event, price, previousPrice, savingsAmount) {
    const getContent = () => `
        ${createPopupHeader('Detalles del Descuento', 'information')}
        <div class="popup-information-container">
            <span>Aprovecha este increíble descuento en nuestro vehículo seleccionado:</span>
            
            <div id="carOverviewPopupContainer" class="details-container">
                ${formatDetailWithIcon("price-new", price, "Precio actual")}
                ${formatDetailWithIcon("price-discount", savingsAmount, "¡Te ahorras!")}
                ${formatDetailWithIcon("price-previous", previousPrice, "Precio anterior")}
            </div>
            ${getContactInfo()}
        </div>
    `;

    initializePopup('informationPopup', 'closeInformationPopup', getContent, event);
}

export {
    showHorsepowerInfo,
    showBodyTypeInfo,
    showConsumptionInfo,
    showEmissionsInfo,
    showDiscountInfo
};



















//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////    FINALISE THIS SSECTION AND ICONS TO INCLUDE    /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 * Shows the documents information popup with a list of required documents for financing.
 * @param {Event} event - The event object from the event listener.
 */
export function showDocumentsInfo(event) {
    const getContent = () => `
        ${createPopupHeader('Documentos necesarios', 'information')}
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
    initializePopup('informationPopup', 'closeInformationPopup', getContent, event);
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////














////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////    ONLY USED ON LISTINGS PAGES NEW AND USED    ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { generateLoanContent } from './financeCalcUpdater.js';

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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////









