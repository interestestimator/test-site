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
    const {
        JavaScriptInfo: { 
            id: carId, 
            imágenesVehículo: vehicleImages,
            imágenesExterior: exteriorImages,  // NEW VEHICLES ONLY
            imágenesInterior: interiorImages,  // NEW VEHICLES ONLY
            coloresExteriores: exteriorColours, // NEW VEHICLES ONLY // NEEDS TO BE IMPLEMENTED IN GALLERY COUNT
            coloresInteriores: interiorColours, // NEW VEHICLES ONLY // NEEDS TO BE IMPLEMENTED IN GALLERY COUNT
            estado: availability,               // *** USED VEHICLES ONLY ***
            intercambioPosible: isExchangeAvailable,
            entregaDisponible: isDeliveryAvailable,
            paqueteMantenimiento: hasMaintenancePackage,  // Includes a complimentary or discounted maintenance package
            chequeoSaludVehículo: hasVehicleHealthCheck,  // Offers a complimentary vehicle inspection and health check
            políticasDeDevoluciónFlexible: hasFlexibleReturnPolicies  // Implements a satisfaction guarantee or flexible return policy
        },
        CaracteristicasGenerales: {
            PrecioNuevo: rawPrice,
            PrecioAnterior: rawPreviousPrice,
            PrecioFinanciado: rawFinancePrice,
            Año: year, 
            Matriculación: registration,                         // *** USED VEHICLES ONLY ***
            Kilometraje: rawKilometres,        // *** USED VEHICLES ONLY ***
            Marca: brand,
            Modelo: model,
            Versión: version,
            Color: color                       // *** USED VEHICLES ONLY ***
        },
        MotorYTransmision: {
            Combustible: { Tipo: fuelType, Tecnología: engineTechnology },
            Transmision: { Caja: transmissionType, Marchas: gears },
            Cilindrada: { Cilindros: cylinders, CC: displacementCC },
            Potencia: { KW: rawKw, CV: rawCv },
            Par: torque,
            Rendimiento: { Aceleración: acceleration, VelocidadMáxima: topSpeed }
        },
        Carroceria: {
            Tipo: bodyType,
            Puertas: doors,
            Plazas: seats,
            PesoMaximo: weight,
            Dimensiones: { Largo: length, Ancho: width, Alto: height, Batalla: wheelbase, Vía: trackWidth }
        },
        ConsumoYEmisiones: {
            Etiqueta: emissionLabel,
            EmisionesCO2: co2Emissions,
            Depósito: fuelTankCapacity,
            Consumo: { Medio: rawAverageConsumption, Urbano: rawUrbanConsumption, Carretera: rawHighwayConsumption }
        },
        GarantíaMeses: {
            Coche: standardWarranty,
            Motor: engineWarranty,
            Batería: batteryWarranty
        },
        Financiando: financingDetails,
        Descripción: carDescription,
        Características: features,    // NEW VEHICLES ONLY
        Especificaciones: specs
    } = carData;

    // Format numbers and currency
    const formatValue = (value) => value ? formatNumber(value) : null;
    const formatCurrencyValue = (value) => value ? formatCurrency(value) : null;

    // Common formatted data
    const formattedData = {
        carId,
                        isExchangeAvailable,
                        isDeliveryAvailable,
                        hasMaintenancePackage,
                        hasVehicleHealthCheck,
                        hasFlexibleReturnPolicies,
        brand,
        model,
        version,
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
        bodyType,
        doors,
        seats,
        weight,
        length,
        width,
        height,
        wheelbase,
        trackWidth,
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
        financingDetails,
        carDescription,
        rawPrice,
        price: formatCurrencyValue(rawPrice),
        rawPreviousPrice,
        previousPrice: formatCurrencyValue(rawPreviousPrice),
        financePrice: formatCurrencyValue(rawFinancePrice),
        rawFinancePrice,
        rawFinanceSavings: rawPrice - rawFinancePrice,
        financeSavings: formatCurrencyValue(rawPrice - rawFinancePrice),
        vehicleImages
    };

    // Additional new car-specific data
    if (isNewCar) {
        return {
            ...formattedData,
            features,        // New cars only
            exteriorImages,  // New cars only
            interiorImages,   // New cars only
            exteriorColours,  // New cars only
            interiorColours   // New cars only
        };
    }

    // Additional used car-specific data
    return {
        ...formattedData,
        availability,    // Used cars only
        year,            // Used cars only //////////////////// MAYBE ADD YEARS TO NEW CAR ALSO
        registration,            // Used cars only
        rawKilometres,    // Used cars only
        kilometres: `${formatValue(rawKilometres)} km`, // Used cars only
        color            // Used cars only
    };
}

// Export functions
export {
    formatNumber,
    formatCurrency,
    formatCarData
};