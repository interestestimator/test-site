import { formatCurrency } from './formatCarData.js';  // Importing the initializer function
import { formatDetail } from './popupUtils.js';
import { showDocumentsInfo } from './popupInformation.js';

import { calculateRate, getFinanceDetails, calculateRoundedDeposit } from './financeCalc.js';




/**
 * Generates the loan content HTML.
 * @param {Object} params - The parameters for the loan content.
 * @returns {string} The generated HTML content.
 */
function generateLoanContent({ formattedPmt, totalLoanAmount, deposit, loanTermMonths, installmentAmount, initialFeePercent, annualRateTIN, annualRateTAE, includeDocumentsButton, includeAcknowledgeButton }) {
    return ` 
        <div class="pt-sm mx-lg b1">
            ${formatDetail("Cuota mensual*", formattedPmt)}
            ${formatDetail("Precio financiando", formatCurrency(totalLoanAmount))} 
            ${formatDetail("Entrada", formatCurrency(deposit))}
            ${formatDetail("Meses", loanTermMonths)}
            ${formatDetail("Importe a plazos", installmentAmount)}
            ${formatDetail("Comisión de apertura", formatCurrency(totalLoanAmount * initialFeePercent))}
            ${formatDetail("TIN", `${annualRateTIN} %`)}
            ${formatDetail("TAE", `${annualRateTAE} %`)}
            ${formatDetail("Financiación provista por", "Santander")}
        </div>
        ${includeDocumentsButton ? `
        <div class="vehicle-price-result__action">
            <button class="show-documents-button rounded-container rounded-both bg-orange h3">Documentación necesaria</button>
        </div>` : ''}    
        <div class="pt-sm mx-lg b1">
            <h4 class="upper">Condiciones de financiación</h4>
            <span class="light">Condiciones legales Adevinta</span>
            <p class="light italic b3">
                La información, precios, cuotas de financiación, imágenes y otros contenidos relativos a los vehículos incluidos en el Portal son proporcionados por terceros por lo que pueden no ser 
                exactos, precisos y completos o estar actualizados en cada momento. Por ello, Coches.net no asume responsabilidad respecto de los contenidos proporcionados por los concesionarios, 
                las entidades de financiación, los intermediarios de estas, por terceros o aquellos incluidos por los propios usuarios y que puedan ser incorrectos, erróneos, falsos, incompletos o 
                contrarios a la ley o al orden público, <strong>salvo que el error sea imputable a una acción u omisión de coches.net</strong>.
            </p>
            <p class="light italic b3">
                En particular, las cuotas de financiación reflejadas en los anuncios se basan en las campañas de financiación de la entidad bancaria de acuerdo con sus propios términos y condiciones 
                de concesión de créditos al consumo o de protección de datos de carácter personal. Dichas entidades aplicarán sus propias condiciones de financiación.
            </p>
            <span class="light">Condiciones legales Santander Consumer Bank</span>
            <p class="light italic b3">
                <strong>Ejemplo con Seguro de Vida Opcional Financiado [OPTIONAL LIFE INSURANCE FINANCED]. Precio al contado [CASH PRICE]. Precio financiando [FINANCING PRICE]. Entrada ${formatCurrency(deposit)}. 
                Plazo ${loanTermMonths}, 1 cuota de [FIRST PAYMENT] y 119 cuotas de ${formattedPmt}. Tipo Deudor Fijo ${annualRateTIN} %, T.A.E. ${annualRateTAE} % (Coste del seguro opcional incluido. La T.A.E., así como 
                la primera cuota podrán variar ligeramente en función del día de la firma del contrato y de la fecha de pago de las cuotas). Comisión de Apertura ${initialFeePercent * 100} %, ${formatCurrency(totalLoanAmount * initialFeePercent)} financiada. 
                Intereses [INTEREST], Importe Total del Crédito [TOTAL LOAN AMOUNT], Coste Total del Crédito [TOTAL COST OF CREDIT], Importe Total Adeudado [TOTAL AMOUNT OWED], Precio Total a Plazos 
                [TOTAL PRICE IN INSTALLMENTS]. Siendo el día de contratación [CONTRACT DATE] y primer pago el [FIRST PAYMENT DATE].</strong> Oferta válida hasta 


                fin de mes. Sistema de amortización Francés. Financiación ofrecida, sujeta a estudio y aprobación por parte de Santander Consumer Finance, S.A. Seguro de vida suscrito con las Compañías 
                de seguros CNP Santander Insurance Life DAC y CNP Santander Insurance Europe DAC, Seguros mediados por Santander Consumer Finance, Operador de Banca Seguros Vinculado, S.A.” , 
                C.I.F A-28122570, inscrito en el Registro Especial de Dirección General de Seguros y Fondos de Pensiones con nº OV0089.Responsabilidad civil y capacidad financiera cubiertas según 
                legislación vigente. Consulta las Compañías Aseguradoras con las que el Operador mantiene un Contrato de Agencia para la distribución de productos de seguro en <strong>www.santanderconsumer.es/obsv</strong>.
            </p>
            ${includeAcknowledgeButton ? `
            <div class="pt-sm" style="width: 33%;margin-left: auto;">
                <div id="acknowledgeButton" class="btn round-xlg p-sm bg-darker center txt-light b1">Entendido</div>
            </div>` : ''}
        </div>
    `;
}

// Function to update display text of an element by its ID
function updateDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

// Function to initialize event listeners
function resetPmtButtonEventListeners() {
    const showDocumentsButton = document.querySelector('.show-documents-button');
    if (showDocumentsButton) {
        showDocumentsButton.addEventListener('click', showDocumentsInfo);
    }
}

/**
 * Adjusts the loan information displayed in the popup.
 * @param {number} formattedPmt - The formatted payment amount.
 * @param {number} totalLoanAmount - The total loan amount.
 * @param {number} deposit - The deposit amount.
 * @param {number} loanTermMonths - The loan term in months.
 * @param {number} installmentAmount - The total installment amount.
 * @param {number} initialFeePercent - The initial fee percentage.
 * @param {number} annualRateTIN - The annual rate TIN.
 * @param {number} annualRateTAE - The annual rate TAE.
 */
export function adjustLoanInfo(formattedPmt, totalLoanAmount, deposit, loanTermMonths, installmentAmount, initialFeePercent, annualRateTIN, annualRateTAE) {
    const loanDetails = document.getElementById('loanPopup');

    const content = generateLoanContent({
        formattedPmt,
        totalLoanAmount,
        deposit,
        loanTermMonths,
        installmentAmount,
        initialFeePercent,
        annualRateTIN,
        annualRateTAE,
        includeDocumentsButton: true,
        includeAcknowledgeButton: false
    });

    loanDetails.innerHTML = content;

    // Update displays
    updateDisplay('financeDepositDisplay', formatCurrency(deposit));
    updateDisplay('financeTermDisplay', `${loanTermMonths / 12} anos`);
    updateDisplay('requestFinanceBtnPmtDisplay', `${formattedPmt}/mes`);

    // Reset PMT button event listener after updating
    resetPmtButtonEventListeners();
}

/**
 * Updates the step value of the deposit slider based on the deposit amount.
 * @param {number} deposit - The current deposit amount.
 * @param {Object} depositSlider - The deposit slider DOM element.
 */
function updateDepositSliderStep(deposit, depositSlider) {
    if (deposit % 500 === 0) {
        depositSlider.step = 500; // Set step to 500 if deposit is a multiple of 500
    } else {
        depositSlider.step = 100; // Set step to 100 if deposit is not a multiple of 500
    }
}

/**
 * Sets initial values for the finance calculator sliders.
 * @param {number} rawFinancePrice - The raw finance price of the vehicle.
 * @param {number} deposit - The initial deposit amount.
 * @param {number} loanTermMonths - The loan term in months.
 * @param {Object} elements - The UI elements to update.
 */
function setInitialValues(rawFinancePrice, deposit, loanTermMonths, elements) {

    const roundedDeposit = calculateRoundedDeposit(rawFinancePrice); // Uses default depositPercentage of 0.25
    const maxDeposit = roundedDeposit * 2

    // Set deposit slider
    elements.depositSlider.max = maxDeposit;
    elements.depositSlider.value = deposit;
    elements.maxDepositTextLabel.textContent = `Máxima: ${formatCurrency(maxDeposit)}`;

    // Update step value of the deposit slider
    updateDepositSliderStep(deposit, elements.depositSlider);

    // Set term slider
    const termValue = loanTermMonths / 12 || elements.termSlider.min;
    elements.termSlider.value = termValue;
}

/**
 * Updates loan information based on user input from sliders.
 * @param {number} rawFinancePrice - The raw finance price.
 * @param {number} annualRateTIN - The annual TIN rate.
 * @param {number} initialFeePercent - The initial fee percentage.
 * @param {Object} elements - The UI elements to retrieve values from.
 */
function updateLoanInfo(rawFinancePrice, annualRateTIN, initialFeePercent, elements) {
    // Calculate the new deposit, term, and loan amounts
    const newDepositValue = parseFloat(elements.depositSlider.value);
    const newLoanTermMonths = Number(elements.termSlider.value) * 12;
    const newLoanAmount = rawFinancePrice - newDepositValue;

    // Additional repayment fee (set to 0.0)
    const additionalRepaymentFee = 0.0;

    // Calculate payment details using the provided function
    const { pmt, annualRateTAE } = calculateRate(
        rawFinancePrice,
        newDepositValue,
        initialFeePercent,
        newLoanTermMonths,
        additionalRepaymentFee,
        annualRateTIN / 100
    );

    // Calculate the total installment amount
    const installmentAmount = newLoanTermMonths * pmt;

    // Update loan information in the UI
    adjustLoanInfo(
        formatCurrency(Math.abs(pmt)),
        newLoanAmount,
        newDepositValue,
        newLoanTermMonths,
        formatCurrency(Math.abs(installmentAmount)),
        initialFeePercent,
        annualRateTIN,
        annualRateTAE
    );
}

/**
 * Initializes event listeners for the finance calculator.
 * @param {number} rawFinancePrice - The raw finance price of the vehicle.
 * @param {number} rawAnnualRateTIN - The raw annual TIN rate.
 * @param {number} initialFeePercent - The initial fee percentage.
 * @param {number} deposit - The deposit amount.
 * @param {number} loanTermMonths - The loan term in months.
 * @param {Object} elements - The UI elements.
 */
function initializeFinanceCalcEventListeners(rawFinancePrice, rawAnnualRateTIN, initialFeePercent, deposit, loanTermMonths, elements) {
    const { depositSlider, termSlider } = elements;

    // Set initial values and update loan info
    setInitialValues(rawFinancePrice, deposit, loanTermMonths, elements);
    updateLoanInfo(rawFinancePrice, rawAnnualRateTIN, initialFeePercent, elements);

    // Common function to update loan info and remove greyscale
    const handleSliderInput = (iconId) => {
        updateLoanInfo(rawFinancePrice, rawAnnualRateTIN, initialFeePercent, elements);
        const resetIcon = document.getElementById(iconId);
        if (resetIcon) {
            resetIcon.classList.remove('greyscale');
        }
    };

    // Event listener for deposit slider
    depositSlider.addEventListener('input', () => handleSliderInput('resetDepositIcon'));

    // Event listener for term slider
    termSlider.addEventListener('input', () => handleSliderInput('resetTermIcon'));

    // Function to reset values and add greyscale
    const resetButtonHandler = (buttonId, slider, resetValue, iconId) => {
        const resetButton = document.getElementById(buttonId);
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                slider.value = resetValue; // Reset to original value
                updateLoanInfo(rawFinancePrice, rawAnnualRateTIN, initialFeePercent, elements);

                // Add greyscale filter to the icon
                const resetIcon = document.getElementById(iconId);
                if (resetIcon) {
                    resetIcon.classList.add('greyscale'); // Add greyscale
                }
            });
        } else {
            console.error(`${buttonId} not found`);
        }
    };

    // Event listener for reset buttons
    resetButtonHandler('resetTermButton', elements.termSlider, loanTermMonths / 12, 'resetTermIcon');
    resetButtonHandler('resetDepositButton', elements.depositSlider, deposit, 'resetDepositIcon');
}









////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////// IF isNewCar THEN rawKilometres AND year DO NOT EXIST ///////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Renders car details into the designated elements.
 * @param {Object} elements - The DOM elements.
 * @param {Object} currentCarData - The car data object.
 */
function fetchFinanceData(elements, currentCarData) {
    try {
        const { year, rawKilometres, rawFinancePrice } = currentCarData;
        const financeData = getFinanceDetails(year, rawKilometres, rawFinancePrice);

        // Initialize the PMT container with the formatted payment data
        initializePmtContainer(financeData.formattedPmt);

        // Initialize finance calculation event listeners
        initializeFinanceCalcEventListeners(
            rawFinancePrice,
            financeData.annualRateTIN,
            financeData.initialFeePercent,
            financeData.deposit,
            financeData.loanTermMonths,
            elements
        );

    } catch (error) {
        console.error("Error fetching finance data:", error);
    }
}

/**
 * Initialize a finance section into a specified container element.
 * @param {HTMLElement} financePmtContainer - The container element to initialize the finance section.
 */
function initializePmtContainer(pmtValue) {
    const financePmtContainer = document.getElementById('initalFinanceValue');
    if (!financePmtContainer) return; // Early return if the element is not found

    financePmtContainer.innerHTML = `
        <span id="pmtValue" class="b1">
            <span class="font-bold">Llévatelo financiado</span><br>
            Desde <span class="h3">${pmtValue}*</span>/mes
        </span>
        <a href="#vehicle-financing" class="btn round-xlg px-lg pblk-sm bg-accent ">
            <span class="center txt-light h4 italic">Recalcular cuota</span>
        </a>
    `;
}

/**
 * Generates a finance message for a car.
 * @param {string} carReference - The reference of the car.
 * @param {number} financePrice - The finance price of the car.
 * @returns {string} The generated finance message.
 */
function generateFinanceMessage(carReference, financePrice) {
    const financeDeposit = document.getElementById('financeDepositDisplay').textContent;
    const financeTerm = document.getElementById('financeTermDisplay').textContent;
    const financePMT = document.getElementById('requestFinanceBtn').querySelector('.amount').textContent;

    return `
        <p>Por favor, completa el formulario para recibir más información sobre las opciones de financiación para el <strong>${carReference}</strong>. Ya hemos registrado tus preferencias:</p>
        <ul>
            <li>Entrada: <strong>${financeDeposit}</strong></li>
            <li>Duración del préstamo: <strong>${financeTerm}</strong></li>
            <li>Pago mensual: <strong>${financePMT}</strong></li>
            <li>Importe financiado: <strong>${financePrice}</strong> (esto es un valor a añadir o modificar en caso de calcularlo en base al input)</li>
        </ul>
        <p>Si deseas añadir un comentario adicional, puedes hacerlo a continuación.</p>
    `;
}


// Export functions
export {
    generateLoanContent,
    initializeFinanceCalcEventListeners,

    generateFinanceMessage,
    fetchFinanceData
};

