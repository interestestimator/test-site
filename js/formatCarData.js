// formatCarData.js

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

/**
 * Formats a number as currency.
 * @param {number} amount - The amount to format.
 * @param {string} [locale='eu'] - The locale to use for formatting.
 * @param {string} [currency='EUR'] - The currency code.
 * @returns {string} The formatted currency string.
 */
function formatCurrency(amount, locale = 'eu', currency = 'EUR') {
    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
    return formatter.format(amount);
}

// Utility function to convert cubic centimeters to rounded liters
function convertCCtoLiters(cc) {
    return (cc / 1000).toFixed(1); // Adjust the number of decimal places as needed
}

/**
 * Formats and organizes car data into a structured object, with variations for new and used cars.
 * @param {Object} carData - The raw car data object.
 * @param {boolean} isNewCar - Flag to indicate whether the car is new or used.
 * @returns {Object} The formatted car data.
 */
function formatCarData(carData, isNewCar = false) {
    // Destructuring common fields with default values
    const {
        id: carId = '',
        informacion: {
            marca: brand = '',
            modelo: model = '',
            version: version = '',
            precio: { actual: rawPrice = 0, anterior: rawPreviousPrice = 0, financiado: rawFinancePrice = 0 } = {}
        } = {},
        carroceria: {
            tipo: bodyType = '',
            plazas: seats = 0,
            puertas: doors = 0,
            peso: weight = 0,
            dimensiones: { longitud: length = 0, anchura: width = 0, altura: height = 0, ejes: wheelbase = 0, via: trackWidth = 0 } = {}
        } = {},
        motor: {
            combustible: fuelType = '',
            tecnologia: engineTechnology = '',
            cilindrada: displacementCC = 0,
            potencia: { cv: rawCv = 0, kw: rawKw = 0, par: torque = 0 } = {},
            cilindros: { numero: cylinders = 0 } = {},
            transmision: { tipo: transmissionType = '', marchas: gears = 0 } = {},
            rendimiento: { aceleracion: acceleration = 0, velocidadMax: topSpeed = 0 } = {}
        } = {},
        emisiones: {
            etiqueta: emissionLabel = '',
            co2: co2Emissions = 0
        } = {},
        consumo: {
            tanque: fuelTankCapacity = 0,
            combinado: rawAverageConsumption = 0,
            urbano: rawUrbanConsumption = 0,
            autopista: rawHighwayConsumption = 0
        } = {},
        galerias = {},
        extras: {
            intercambio: isExchangeAvailable = false,
            entrega: isDeliveryAvailable = false,
            mantenimiento: hasMaintenancePackage = false,
            revision: hasVehicleHealthCheck = false,
            devolucion: hasFlexibleReturnPolicies = false
        } = {},
        garantia: {
            general: standardWarranty = '',
            motor: engineWarranty = '',
            bateria: batteryWarranty = ''
        } = {},
        Especificaciones: specs = ''
    } = carData;

    // Helper functions to avoid repetition and fallback to empty string or 0 if undefined
    const formatValue = (value) => (value || value === 0 ? formatNumber(value) : '');
    const formatCurrencyValue = (value) => (value || value === 0 ? formatCurrency(value) : '');

    // Common formatted data for both new and used cars
    const formattedData = {
        carId,
        brand,
        model,
        version,
        isExchangeAvailable,
        isDeliveryAvailable,
        hasMaintenancePackage,
        hasVehicleHealthCheck,
        hasFlexibleReturnPolicies,
        fuelType,
        engineTechnology,
        transmissionType,
        cylinders,
        displacementCC,
        displacementLiters: convertCCtoLiters(displacementCC),
        gears,
        kw: `${formatValue(rawKw)} kW`,
        cv: `${formatValue(rawCv)} CV`,
        torque,
        acceleration,
        topSpeed,
        emissionLabel,
        co2Emissions,
        fuelTankCapacity,
        rawAverageConsumption,
        averageConsumption: `${formatValue(rawAverageConsumption)} L/100 km`,
        urbanConsumption: `${formatValue(rawUrbanConsumption)} L/100 km`,
        highwayConsumption: `${formatValue(rawHighwayConsumption)} L/100 km`,
        specs,
        standardWarranty,
        engineWarranty,
        batteryWarranty,
        bodyType,
        doors,
        seats,
        weight,
        length,
        width,
        height,
        wheelbase,
        trackWidth,
        rawPrice,
        price: formatCurrencyValue(rawPrice),
        rawPreviousPrice,
        rawSavingsAmount: rawPreviousPrice - rawPrice,
        savingsAmount: formatCurrencyValue(rawPreviousPrice - rawPrice),
        previousPrice: formatCurrencyValue(rawPreviousPrice),
        financePrice: formatCurrencyValue(rawFinancePrice),
        rawFinancePrice,
        rawFinanceSavings: rawPrice - rawFinancePrice,
        financeSavings: formatCurrencyValue(rawPrice - rawFinancePrice),
    };

    // Vehicle images for all cars (common field)
    const { general: { cantidad: vehicleImages = 0 } = {} } = galerias || {};

    // If it's a new car, add new car-specific data
    if (isNewCar) {
        const { Caracteristicas: features = {} } = carData || {};
        const {
            exterior: { cantidad: exteriorImages = 0, descripciones: exteriorColours = [] } = {},
            interior: { cantidad: interiorImages = 0, descripciones: interiorColours = [] } = {}
        } = galerias || {};

        return {
            ...formattedData,
            features,
            vehicleImages,
            exteriorImages,
            interiorImages,
            exteriorColours,
            interiorColours
        };
    }

    // If it's a used car, add used car-specific data
    const {
        estado: availability = '',
        informacion: {
            color = '',
            ano: { fabricacion: year = 0, matriculacion: registration = '' } = {},
            kilometros: rawKilometres = 0
        } = {},
        historial: { propietarios: owners = [] } = {}
    } = carData;

    const usedCarData = {
        availability,
        color,
        year,
        registration,
        rawKilometres,
        kilometres: `${formatValue(rawKilometres)} km`, // Used cars only
        owners
    };

    return {
        ...formattedData,
        vehicleImages, // Shared by all cars
        ...usedCarData
    };
}


// Export functions
export {
    formatNumber,
    formatCurrency,
    formatCarData
};