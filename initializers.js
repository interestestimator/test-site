// Initialize State

/**
 * Initializes and returns the application state.
 * @returns {Object} The initial state of the application.
 */
export function initializeState() {
    return {
        currentImageIndex: 0,
        thumbnailStartIndex: 0,
        thumbnailCount: 4,
        imageUrls: [],
        carReference: getQueryParameter('id'),
        carData: null,
        deliveryCost: 0,
        financeCost: 0,
        FINANCIO_DESCUBIENTO: 0,
    };
}

/**
 * Retrieves the value of a query parameter from the URL.
 * @param {string} name - The name of the query parameter.
 * @returns {string|null} The value of the query parameter or null if not found.
 */
function getQueryParameter(name) {
    return new URLSearchParams(window.location.search).get(name);
}

// Initialize Elements

/**
 * Initializes and returns references to DOM elements used in the application.
 * @returns {Object} An object containing references to various DOM elements.
 */
export function initializeElements() {
    return {
        carDetailsContainer: document.getElementById('carDetailsContainer'),
        headerContainer: document.getElementById('header-container'),
        carImageContainer: document.getElementById('carImageContainer'),
        prevImage: document.getElementById('prevImage'),
        nextImage: document.getElementById('nextImage'),
        regionDropdown: document.getElementById('regionDropdown'),
        regionAmount: document.getElementById('regionAmount'),
        deliveryLabelTitle: document.getElementById('deliveryLabel_title'),
        carFinanceOptionsContainer: document.getElementById('carFinanceOptionsContainer'),
        precioNuevo: document.getElementById('precioNuevo'),
        PrecioFinal: document.getElementById('PrecioFinal'),
        carTitle: document.getElementById('carTitle'),
        carImage: document.getElementById('carImage'),
        photoCountLabel: document.getElementById('photoCountLabel'),
        overview: document.getElementById('overview'),
        garantiaContainer: document.getElementById('garantiaContainer'),
        equipamiento: document.getElementById('equipamiento'),
        pmtValue: document.getElementById('pmtValue'),
        financeAmount: document.getElementById('financeAmount'),
        precioFinacio: document.getElementById('precioFinacio'),
        thumbnailContainer: document.getElementById('thumbnailContainer'),


        financeCalcDepositInput: document.getElementById('deposit-input'),
        financeCalcDepositSlider: document.getElementById('deposit-slider'),
        financeCalcMaxDepositText: document.getElementById('max-deposit-text'),
        financeCalcTermSelect: document.getElementById('term-select'),
        financeCalcTermSlider: document.getElementById('term-slider')
    };
}

// Initialize Car Data

/**
 * Initializes and formats car data based on the state.
 * @param {Object} state - The state object containing car data.
 * @returns {Object} The formatted car data.
 */
export function initializeCarData(state) {
    const {
        JavaScriptInfo: { id: carId, cantidadImágenes: imageCount, estado: availability },
        CaracteristicasGenerales: { PrecioNuevo: price, Año: year, Kilometraje: rawKilometres, Marca: brand, Modelo: model, Versión: version, Color: color, PrecioAnterior: previousPrice },
        MotorYTransmision: { Combustible: { Tipo: fuelType }, Transmision: { Caja: transmissionType, Marchas: gears }, Potencia: { KW: powerKW, CV: powerCV }, Rendimiento: { Aceleración: acceleration, VelocidadMáxima: topSpeed } },
        Carroceria: { Tipo: bodyType, Puertas: doors, Plazas: seats, Dimensiones: { Largo: length, Ancho: width, Alto: height } },
        ConsumoYEmisiones: { Etiqueta: emissionLabel, EmisionesCO2: co2Emissions, Depósito: fuelTankCapacity, Consumo: { Medio: rawAverageConsumption, Urbano: urbanConsumption, Carretera: highwayConsumption } },
        Garantía: { Descripción: warrantyDescription, GarantíaEstándar: standardWarranty, GarantíaVIP: vipWarranty },
        Financiando: financingDetails,
        Descripción: carDescription,
        Equipamiento: { Exterior: exteriorEquipment, Interior: interiorEquipment },
        Multimedia: multimediaFeatures,
        Seguridad: safetyFeatures,
        Otros: otherFeatures
    } = state.carData;

    // Format numbers
    const kilometres = formatNumber(rawKilometres);
    const averageConsumption = formatNumber(rawAverageConsumption);

    return {
        carId,
        imageCount,
        availability,
        price,
        year,
        kilometres,
        brand,
        model,
        version,
        color,
        previousPrice,
        fuelType,
        transmissionType,
        gears,
        powerKW,
        powerCV,
        acceleration,
        topSpeed,
        bodyType,
        doors,
        seats,
        length,
        width,
        height,
        emissionLabel,
        co2Emissions,
        fuelTankCapacity,
        averageConsumption,
        urbanConsumption,
        highwayConsumption,
        warrantyDescription,
        standardWarranty,
        vipWarranty,
        financingDetails,
        carDescription,
        exteriorEquipment,
        interiorEquipment,
        multimediaFeatures,
        safetyFeatures,
        otherFeatures
    };
}

/**
 * Formats a number using the specified locale.
 * @param {number} number - The number to format.
 * @param {string} [locale='es-ES'] - The locale to use for formatting.
 * @returns {string} The formatted number.
 */
function formatNumber(number, locale = 'es-ES') {
    if (number == null) return '0';
    return new Intl.NumberFormat(locale).format(number);
}