// listingsDisplay.js

import { getFinanceDetails } from './financeCalc.js';
import { showLoanInfo } from './popupInformation.js';

// Helper function to create emissions label HTML
function createEmissionsLabelHTML(emissionLabel, isNewCar) {
    if (!emissionLabel) return '';
    const className = isNewCar ? 'emissions-label-new' : 'emissions-label';
    return `
        <label class="label ${className} flex item-sdw">
            <img class="img-24" src="icons/filter-options/emission-levels/${emissionLabel.toLowerCase()}.svg" alt="Emissions Icon">
        </label>
    `;
}

// Helper function to create previous price HTML if available
function createPreviousPriceHTML(previousPrice, price) {
    return previousPrice !== price ? `
        <div class="price txt-grey">
            Precio al contado: <span class="previous-price">${previousPrice}</span>
        </div>
    ` : '<div class="price txt-grey">Precio al contado: </div>';
}

// Function to create car image container HTML
function createCarImageContainerHTML(carData, imageUrl, isNewCar) {
    const { availability } = carData;
    return `
        <div class="listing-image-container b3 rt-md">
            ${!isNewCar ? `
                <div class="status ${availability.toLowerCase()} item-sdw h4 center txt-light">
                    ${availability}
                </div>
            ` : ''}
            <img class="listing-image" src="${imageUrl}" alt="${carData.brand} ${carData.model}" loading="lazy">
            ${createEmissionsLabelHTML(carData.emissionLabel, isNewCar)}
            ${!isNewCar ? `
                <label id="imageCountLabel" class="label photo-count-label flex ai-center round-lg m-xsm px-sm item-sdw bg-darker txt-light">
                    <img class="img-24" src="icons/gallery-icons/camera.svg" alt="Photo Count Icon">${carData.vehicleImages}
                </label>
            ` : ''}
        </div>
    `;
}

// Function to get car title content
function getCarTitleContent(carData, isNewCar) {
    const { brand, model, version, displacementLiters, engineTechnology, color, bodyType, doors } = carData;
    
    // For new cars, return only brand, model, and version
    if (isNewCar) {
        return `${brand} ${model} ${version}`;
    }
    
    // For used cars, return additional details
    return `${brand} ${model} ${version} ${displacementLiters} ${engineTechnology} ${color} ${bodyType} (${doors}p)`;
}

// Function to create car title HTML
function createCarTitleHTML(carData, isNewCar) {
    const carTitleContent = getCarTitleContent(carData, isNewCar);
    
    return `
        <div class="mx-xsm p-xsm b1 upper bold">
            ${carTitleContent}
        </div>
    `;
}

// Function to create car details HTML (only for used cars)
function createCarDetailsHTML(carData, isNewCar) {
    if (isNewCar) return ''; // No details needed for new cars

    const { registration, transmissionType, kilometres, fuelType, kw, cv } = carData;
    return `
        <div class="mx-sm pb-xsm b2 upper italic txt-dark">
            ${registration} | ${transmissionType} | ${kilometres} | ${fuelType} | ${kw} (${cv})
        </div>
    `;
}

// Function to create price details HTML
function createPriceDetailsHTML(carData, financeData, index) {
    const previousPriceHtml = createPreviousPriceHTML(carData.previousPrice, carData.price);
    return `
        <div class="bg-light p-xsm">
            <div class="flex jc-between mx-xsm b3 txt-darker">
                ${previousPriceHtml}
                <div>Precio financiado: ${carData.financePrice}</div>
            </div>
            <div class="flex jc-between pb-xsm mx-xsm h3">
                <div>${carData.price}</div>
                <span class="txt-accent">
                    ${financeData.formattedPmt}<span class="b4"> /mes</span>
                </span>
            </div>
            <div class="pt-xsm mx-xsm t-sdw b4 center light txt-dark">
                *Sin entrada ${financeData.loanTermMonths} meses
                <u class="apr-example-${index} link medium">
                    Ver ejemplo TAE ${financeData.annualRateTAE}%
                </u> con Santander
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
            <a href="${isNewCar ? `detalles-vehiculos-nuevos.html?id=${carData.carId}` : `detalles-vehiculo-ocasion.html?id=${carData.carId}`}" class="car-container cont-sdw round-lg mblk-xsm" id="car-${carData.brand}-${index}">
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
        document.getElementById('listingCount').textContent = `${filteredCars.length} listados`;
    }
}

export { 
    getCarTitleContent,
    showCarListings 
};


