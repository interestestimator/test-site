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
 * Formats and organizes car data into a structured object.
 * @param {Object} carData - The raw car data object.
 * @returns {Object} The formatted car data.
 */
function formatCarData(carData) {
    const {
        JavaScriptInfo: { id: carId, cantidadImágenes: imageCount, estado: availability },
        CaracteristicasGenerales: {
            PrecioNuevo: rawPrice,
            PrecioAnterior: rawPreviousPrice,
            PrecioFinanciado: rawFinancePrice,
            Año: year,
            Kilometraje: rawKilometres,
            Marca: brand,
            Modelo: model,
            Versión: version,
            Color: color,
        },
        MotorYTransmision: {
            Combustible: { Tipo: fuelType, Tecnología: EngineTechnology },
            Transmision: { Caja: transmissionType, Marchas: gears },
            Cilindrada: { Cilindros: cylinders, CC: displacementCC },
            Potencia: { KW: powerKW, CV: powerCV },
            Par: torque,
            Rendimiento: { Aceleración: acceleration, VelocidadMáxima: topSpeed },
        },
        Carroceria: {
            Tipo: bodyType,
            Puertas: doors,
            Plazas: seats,
            PesoMaximo: weight,
            Dimensiones: { Largo: length, Ancho: width, Alto: height, Batalla: wheelbase, Vía: trackWidth},
        },
        ConsumoYEmisiones: {
            Etiqueta: emissionLabel,
            EmisionesCO2: co2Emissions,
            Depósito: fuelTankCapacity,
            Consumo: { Medio: rawAverageConsumption, Urbano: rawUrbanConsumption, Carretera: rawHighwayConsumption },
        },
        GarantíaMeses: standardWarranty,
        Financiando: financingDetails,
        Descripción: carDescription,
        Equipamiento: { Exterior: exteriorEquipment, Interior: interiorEquipment },
        Multimedia: multimediaFeatures,
        Seguridad: safetyFeatures,
        Otros: otherFeatures
    } = carData;

    // Format numbers and currency
    const price = formatCurrency(rawPrice);
    const previousPrice = formatCurrency(rawPreviousPrice);
    const financePrice = formatCurrency(rawFinancePrice);
    const kilometres = formatNumber(rawKilometres);
    const averageConsumption = formatNumber(rawAverageConsumption);
    const urbanConsumption = formatNumber(rawUrbanConsumption);
    const highwayConsumption = formatNumber(rawHighwayConsumption);
    const displacementLiters = convertCCtoLiters(displacementCC); // New rounded liter value

    return {
        carId,
        imageCount,
        availability,
        price,
        rawPrice, // Include raw price
        rawPreviousPrice, // Include raw previous price
        rawFinancePrice,
        financePrice,
        rawKilometres, // Include raw kilometres
        previousPrice,
        year,
        kilometres,
        brand,
        model,
        version,
        color,
        fuelType,
        EngineTechnology,
        transmissionType,
        cylinders,
        displacementCC,
        displacementLiters, 
        gears,
        powerKW,
        powerCV,
        torque,
        acceleration,
        topSpeed,
        bodyType,
        doors,
        seats,
        weight,
        length,
        width,
        wheelbase,
        trackWidth,
        height,
        emissionLabel,
        co2Emissions,
        fuelTankCapacity,
        rawAverageConsumption,
        averageConsumption,
        urbanConsumption,
        highwayConsumption,
        standardWarranty,
        financingDetails,
        carDescription,
        exteriorEquipment,
        interiorEquipment,
        multimediaFeatures,
        safetyFeatures,
        otherFeatures
    };
}

// Export functions
export {
    formatNumber,
    formatCurrency,
    formatCarData
};

