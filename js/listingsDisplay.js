// listingsDisplay.js

import { getFinanceDetails } from './financeCalc.js';
import { showLoanInfo } from './popupInformation.js';

// Helper function to create emissions label HTML
function createEmissionsLabelHTML(emissionLabel, isNewCar) {
    if (!emissionLabel) return '';
    const className = isNewCar ? 'emissions-label-new' : 'emissions-label';
    return `
        <label class="${className}">
            <img src="icons/car/emissions/${emissionLabel.toLowerCase()}.svg" alt="Emissions Icon" width="25" height="25">
        </label>
    `;
}

// Helper function to create previous price HTML if available
function createPreviousPriceHTML(previousPrice, price) {
    return previousPrice !== price ? `
        <div class="price">
            Precio al contado: <span class="previous-price">${previousPrice}</span>
        </div>
    ` : '<div class="price">Precio al contado: </div>';
}

// Function to create car image container HTML
function createCarImageContainerHTML(carData, imageUrl, isNewCar) {
    const { availability } = carData;
    return `
        <div class="car-image-container">
            ${!isNewCar ? `
                <div class="car-status b3 font-bold uppercase reservado ${availability.toLowerCase()}">
                    ${availability}
                </div>
            ` : ''}
            <img class="car-image" src="${imageUrl}" alt="${carData.brand} ${carData.model}" loading="lazy">
            ${createEmissionsLabelHTML(carData.emissionLabel, isNewCar)}
            ${!isNewCar ? `
                <label id="imageCountLabel" class="photo-count-label">
                    <img src="icons/ui/actions/photo-count.svg" alt="Photo Count Icon" width="16" height="16">${carData.vehicleImages}
                </label>
            ` : ''}
        </div>
    `;
}

// Function to create car title HTML
function createCarTitleHTML(carData, isNewCar) {
    const { brand, model, version, displacementLiters, EngineTechnology, color, bodyType, doors } = carData;
    return `
        <div class="car-title h4 uppercase font-bold">
            ${brand} ${model} ${version} ${!isNewCar ? `${displacementLiters} ${EngineTechnology} ${color} ${bodyType} (${doors}p)` : ''}
        </div>
    `;
}

// Function to create car details HTML (only for used cars)
function createCarDetailsHTML(carData, isNewCar) {
    if (isNewCar) return ''; // No details needed for new cars

    const { registration, transmissionType, kilometres, fuelType, kw, cv } = carData;
    return `
        <div class="car-details-container b2">
            ${registration} | ${transmissionType} | ${kilometres} | ${fuelType} | ${kw} (${cv})
        </div>
    `;
}

// Function to create price details HTML
function createPriceDetailsHTML(carData, financeData, index) {
    const previousPriceHtml = createPreviousPriceHTML(carData.previousPrice, carData.price);
    return `
        <div class="bg-vl-grey">
            <div class="price-details-container b3">
                ${previousPriceHtml}
                <div class="finance-price-full">Precio financiado: ${carData.financePrice}</div>
            </div>
            <div class="price-container">
                <div class="price h3">${carData.price}</div>
                <span class="finance-price h4 uppercase font-bold">
                    <span class="h3">${financeData.formattedPmt}</span>/mes
                </span>
            </div>
            <div class="finance-details b4 font-book">
                *Sin entrada ${financeData.loanTermMonths} meses
                <span class="apr-example apr-example-${index} font-book">
                    Ver ejemplo TAE ${financeData.annualRateTAE}%
                </span> con Santander
            </div>
        </div>
    `;
}

// Function to add event listener for loan info
function addLoanInfoEventListener(index, financeData) {
    document.querySelector(`.apr-example-${index}`).addEventListener('click', (event) => {
        showLoanInfo(event, financeData.formattedPmt, financeData.totalLoanAmount, financeData.deposit, financeData.loanTermMonths, financeData.installmentAmount, financeData.initialFeePercent, financeData.annualRateTIN, financeData.annualRateTAE);
    });
}

// Combined function to process and render car listings
function renderCarsList(carList, carBasePath, isNewCar, container) {
    carList.forEach((carData, index) => {
        const imageUrl = `${carBasePath}/${carData.carId.toUpperCase()}/images/vehicle/1.webp`;
        const financeData = getFinanceDetails(carData.year, carData.rawKilometres, carData.rawFinancePrice);

        const html = `
            <a href="${isNewCar ? `detalles-vehiculos-nuevos.html?id=${carData.carId}` : `detalles-vehiculo-ocasion.html?id=${carData.carId}`}" class="car-container" id="car-${carData.brand}-${index}">
                ${createCarImageContainerHTML(carData, imageUrl, isNewCar)}
                ${createCarTitleHTML(carData, isNewCar)}
                ${createCarDetailsHTML(carData, isNewCar)}
                ${createPriceDetailsHTML(carData, financeData, index)}
            </a>
        `;

        container.insertAdjacentHTML('beforeend', html);
        addLoanInfoEventListener(index, financeData);
    });
}

// Main function to show car listings
function showCarListings(filteredCars, isNewCar) {
    const container = document.getElementById('carListings');
    container.innerHTML = ''; // Clear existing content

    const carBasePath = isNewCar ? 'listings-nuevos' : 'listings';

    if (isNewCar) {
        const carsByBrand = filteredCars.reduce((acc, car) => {
            acc[car.brand] = acc[car.brand] || [];
            acc[car.brand].push(car);
            return acc;
        }, {});

        Object.entries(carsByBrand).forEach(([brand, cars]) => {
            container.insertAdjacentHTML('beforeend', `<span class="brand-title h2">${brand}</span>`);
            renderCarsList(cars, carBasePath, isNewCar, container);
        });
    } else {
        renderCarsList(filteredCars, carBasePath, isNewCar, container);
        document.getElementById('listingCount').textContent = `${filteredCars.length} listings`;
    }
}

export { 
    createCarTitleHTML,
    showCarListings 
};
