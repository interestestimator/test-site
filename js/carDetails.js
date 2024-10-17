// carDetails.js

import { showConsumptionInfo, showEmissionsInfo, showHorsepowerInfo, showBodyTypeInfo } from './popupInformation.js';

/**
 * Creates a detail div with icon, value, and title.
 * @param {string} containerId - The ID of the container to append the detail div.
 * @param {string} iconPath - The icon URL.
 * @param {string} name - The icon name to display.
 * @param {string} value - The detail value to display.
 * @param {string} description - The detail description to display.
 * @param {string} [additionalInfo=''] - Optional additional info.
 */
const createDetailDiv = (containerId, iconPath, name, value, description, additionalInfo = '') => {
    const container = document.getElementById(containerId);
    const detailDiv = document.createElement('div');
    detailDiv.className = 'more-details';

    detailDiv.innerHTML = `
        <img src="${iconPath}" alt="${description}">
        <div class="detail-text b1">
            <span class="font-bold uppercase">${value}</span>
            <span class="txt-grey b2">${description}</span>
            ${additionalInfo ? `
                <label class="more-information ${name} b3">
                    <img src="icons/ui/actions/more-info.svg" alt="More information">
                    ${additionalInfo}
                </label>` : ''}
        </div>
    `;
    container.appendChild(detailDiv);
};

/**
 * Gets the icon path based on the detail name and its value.
 * @param {string} name - The detail name.
 * @param {string} iconPathExt - The detail value.
 * @param {boolean} iconFolder - Indicates if a custom icon folder should be used.
 * @param {string} defaultIconFolder - The default icon folder.
 * @returns {string} - The icon path.
 */
const getIconPath = (name, iconPathExt, iconFolder, defaultIconFolder) =>
    iconFolder ? `icons/car-details/${name}-${iconPathExt}.svg` : `${defaultIconFolder}/${name}.svg`;

/**
 * Initializes car overview details section with data.
 * @param {Object} currentCarData - Object containing car data.
 * @param {boolean} [isNewCar=false] - Indicates whether the car is new.
 */
const initializeOverviewDetails = (currentCarData, isNewCar = false) => {
    const defaultIconFolder = 'icons/car-details';

    // Define details array
    const overviewDetails = [
        { name: 'kilometres', description: 'Kilometraje' },
        { name: 'cv', description: 'Potencia CV', additionalInfo: true },
        { name: 'fuelType', description: 'Combustible' },
        { name: 'transmissionType', description: 'Transmisión', iconFolder: true },
        { name: 'gears', description: 'Nº Marchas' },
        { name: 'registration', description: 'Matriculación' },
        { name: 'bodyType', description: 'Carrocería', additionalInfo: true },
        { name: 'doors', description: 'Nº Puertas' },
        { name: 'seats', description: 'Nº Asientos' },
        { name: 'color', description: 'Color Exterior' },
        { name: 'averageConsumption', description: 'Consumo de Combustible', additionalInfo: true },
        { name: 'emissionLabel', description: 'Emisiones CO2', iconFolder: true, additionalInfo: true }
    ].filter(({ name }) => !(isNewCar && (name === 'kilometres' || name === 'registration')));

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////// RESOLVE ISSUE!!! emmissionslabel should be hidden if not defined ////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    // Create detail divs
    overviewDetails.forEach(({ name, description, value = currentCarData[name], iconFolder, additionalInfo }) => {
        if (!value) return; // Skip if no value is available

        // Special rule for 'emissionLabel'
        if (name === 'emissionLabel') {
            value = `${currentCarData.co2Emissions} g/km`; // Set the value to CO2 emissions
            if (!currentCarData.co2Emissions) return; // Skip if no emissions data is available
        }

        const iconPath = getIconPath(name, currentCarData[name], iconFolder, defaultIconFolder);

        // Set additionalInfo to 'Más Información' if it's true
        const infoText = additionalInfo === true ? 'Más Información' : '';

        createDetailDiv('carOverviewContainer', iconPath, name, value, description, infoText);
    });

    // Handlers for specific classes
    const handlers = {
        averageConsumption: showConsumptionInfo,
        emissionLabel: showEmissionsInfo,
        cv: showHorsepowerInfo,
        bodyType: showBodyTypeInfo
    };

    // Add event listeners for dynamically created elements
    document.querySelectorAll('.more-information').forEach(el => {
        const handler = handlers[el.classList[1]]; // Get the corresponding handler by class name
        if (handler) el.addEventListener('click', (event) => handler(event, currentCarData));
    });
};

/**
 * Initializes company advantages section with data.
 * @param {Object} currentCarData - Object containing car data.
 */
const initializeCompanyAdvantages = () => {
    const defaultIconFolder = 'icons/company/advantages';

    const companyAdvantages = [
        { name: 'documentation', value: 'Vehículos revisados', description: 'Revisión de 250 puntos revisados por nuestro equipo de profesionales.' },
        { name: 'mileage-guarantee', value: 'Kilometraje garantizado', description: 'Somos transparentes. Compra tu coche con certificado de kilómetros reales.' },
        { name: 'guarantee', value: 'Garantía de 12 meses', description: 'Este vehículo dispone de una garantía de 12 meses.' },
        { name: 'home-delivery', value: 'Envío a domicilio', description: 'Sin desplazamientos, te lo llevamos a casa. Antes de lo que crees, lo tendrás en tus manos.' },
        { name: 'part-exchange', value: 'Aceptamos tu coche como parte del pago', description: 'Te ofrecemos las tasaciones más competitivas del mercado.' },
        { name: 'test-drive', value: 'Pruébalo sin compromiso', description: 'Dispones de 15 días o 1.000 km para probar el vehículo. Si no te convence, cámbialo por otro.' }
    ];

    companyAdvantages.forEach(({ name, value, description }) => {
        createDetailDiv('companyAdvantagesContainer', `${defaultIconFolder}/${name}.svg`, name, value, description);
    });
};

// Export functions
export {
    initializeOverviewDetails,
    initializeCompanyAdvantages
};

