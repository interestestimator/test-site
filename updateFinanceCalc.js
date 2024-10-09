import { formatCurrency } from './js/formatCarData.js';  // Importing the initializer function
import { formatDetail } from './js/popupUtils.js';
import { showDocumentsInfo } from './popupInformation.js';

import { calculateRate } from './js/financeCalc.js';


/**
 * Generates a finance message for a car.
 * @param {string} carReference - The reference of the car.
 * @param {number} financePrice - The finance price of the car.
 * @returns {string} The generated finance message.
 */
function generateFinanceMessage(carReference, financePrice) {
    const financeDeposit = document.getElementById('deposit-input').value;
    const financeTerm = document.getElementById('term-select').value;
    const financePMT = document.getElementById('requestFinanceBtn').querySelector('.amount').textContent;

    return `
        <p>Por favor, completa el formulario para recibir más información sobre las opciones de financiación para el <strong>${carReference}</strong>. Ya hemos registrado tus preferencias:</p>
        <ul>
            <li>Entrada: <strong>${financeDeposit}</strong></li>
            <li>Duración del préstamo: <strong>${financeTerm}</strong> años</li>
            <li>Pago mensual: <strong>${financePMT}</strong></li>
            <li>Importe financiado: <strong>${financePrice}</strong> (esto es un valor a añadir o modificar en caso de calcularlo en base al input)</li>
        </ul>
        <p>Si deseas añadir un comentario adicional, puedes hacerlo a continuación.</p>
    `;
}

/**
 * Generates the loan content HTML.
 * @param {Object} params - The parameters for the loan content.
 * @returns {string} The generated HTML content.
 */
function generateLoanContent({ formattedPmt, totalLoanAmount, deposit, loanTermMonths, installmentAmount, initialFeePercent, annualRateTIN, annualRateTAE, includeDocumentsButton, includeAcknowledgeButton }) {
    return `
        <div class="title">
            <div class="finance-text">Detalles de la oferta</div>
        </div>
        <div class="finance-details-container">
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
        <div class="finance-conditions">
            <h2 class="legal-conditions-title">Condiciones de financiación</h2>
            <div class="legal-conditions">
                <h3>Condiciones legales Adevinta</h3>
                <p>
                    En particular, las cuotas de financiación reflejadas en los anuncios se basan en las campañas de financiación de la 
                    entidad bancaria de acuerdo con sus propios términos y condiciones de concesión de créditos al consumo o de protección 
                    de datos de carácter personal. Dichas entidades aplicarán sus propias condiciones de financiación.
                </p>
            </div>
            <div class="legal-conditions">
                <h3>Condiciones legales Santander Consumer Finance</h3>
                <p>
                    ***Precio al contado ${formatCurrency(totalLoanAmount)}. Precio financiando ${formatCurrency(totalLoanAmount)}. Entrada ${formatCurrency(deposit)}. Plazo ${loanTermMonths} meses, 1 cuota de ${formatCurrency(formattedPmt)} 
                    y ${loanTermMonths - 1} cuotas de ${formattedPmt}. Tipo Deudor Fijo ${annualRateTIN}%, T.A.E. ${annualRateTAE}% (La T.A.E., así como la primera cuota podrán variar 
                    ligeramente en función del día de la firma del contrato y de la fecha de pago de las cuotas). Comisión de Apertura ${initialFeePercent}%, 
                    ${formatCurrency(installmentAmount * initialFeePercent)} financiada. Intereses //4.816,36 €, Importe Total del Crédito 14.449,05 €, Coste Total del Crédito //5.365,41 €, 
                    Importe Total Adeudado //19.265,41 €, Precio Total a Plazos //19.265,41 €. Siendo el día de contratación ADD DATE HERE y primer 
                    pago el ADD DATE HERE. Importe mínimo a financiar //10.000 €. Oferta válida hasta el //31/12/2024.
                </p>
                <p>
                    ***Financiación ofrecida por Santander Consumer, S.A. sujeto a estudio y aprobación por parte de la entidad financiera. 
                    Oferta válida hasta el //31/12/2024 para vehículos ofertados por concesionarios que publiquen en Coches.net.
                </p>
                ${includeAcknowledgeButton ? `
                <div class="popup-buttons">
                    <button id="acknowledgeButton" class="acknowledge-button">Entendido</button>
                </div>` : ''}
            </div>
        </div>
    `;
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
    const quotaButton = document.getElementById('requestFinanceBtn');

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
        includeAcknowledgeButton: true
    });

    loanDetails.innerHTML = content;

    // Update the button text with the PMT value
    const amountElement = quotaButton.querySelector('.amount');
    if (amountElement) {
        amountElement.textContent = `${formattedPmt}/mes`;
    }

    // Adding event listener to the show-documents-button
    const showDocumentsButton = document.querySelector('.show-documents-button');
    if (showDocumentsButton) {
        showDocumentsButton.addEventListener('click', showDocumentsInfo);
    }
}

/**
 * Sets initial values for the finance calculator sliders and inputs.
 * @param {number} rawFinancePrice - The raw finance price of the vehicle.
 * @param {number} deposit - The initial deposit amount.
 * @param {number} loanTermMonths - The loan term in months.
 * @param {Object} elements - The UI elements to update.
 */
function setInitialValues(rawFinancePrice, deposit, loanTermMonths, elements) {
    const maxDeposit = rawFinancePrice * 0.6;

    // Set deposit slider and input field
    elements.depositSlider.max = maxDeposit;
    elements.depositSlider.value = deposit;
    elements.depositInputField.value = formatCurrency(deposit);
    elements.maxDepositTextLabel.textContent = `Máxima: ${formatCurrency(maxDeposit)}`;

    // Set term slider and dropdown
    const termValue = loanTermMonths / 12 || elements.termSlider.min;
    elements.termSlider.value = termValue;
    elements.termSelectDropdown.value = termValue;
}

/**
 * Updates loan information based on user input.
 * @param {number} rawFinancePrice - The raw finance price.
 * @param {number} annualRateTIN - The annual TIN rate.
 * @param {number} initialFeePercent - The initial fee percentage.
 * @param {Object} elements - The UI elements to retrieve values from.
 */
function updateLoanInfo(rawFinancePrice, annualRateTIN, initialFeePercent, elements) {
    // Calculate the new deposit, term and loan amounts
    const newDepositValue = parseDepositValue(elements.depositInputField.value)

    const newLoanTermMonths = Number(elements.termSelectDropdown.value) * 12;
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

function parseDepositValue(value) {
    return parseFloat(
        value
            .replace(/[.\s]/g, '')   // Remove thousands separators (periods and spaces)
            .replace(',', '.')       // Replace comma with dot for decimals
    ) || 0;
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
    const { depositSlider, depositInputField, termSlider, termSelectDropdown } = elements;
    const maxDeposit = rawFinancePrice * 0.6;

    // Set initial values first
    setInitialValues(rawFinancePrice, deposit, loanTermMonths, elements);
    updateLoanInfo(rawFinancePrice, rawAnnualRateTIN, initialFeePercent, elements);

    // Update loan details function
    const updateLoanDetails = () => {
        updateLoanInfo(rawFinancePrice, rawAnnualRateTIN, initialFeePercent, elements);
    };

    // Common handler for deposit slider and input
    const handleDepositChange = () => {
        let numericValue = parseDepositValue(depositInputField.value) || 0;

        // If the input exceeds max deposit, adjust and notify the user
        if (numericValue > maxDeposit) {
            numericValue = maxDeposit;
            alert(`El depósito no puede exceder ${formatCurrency(maxDeposit)}.`);
        }

        // Update the slider and input field
        depositInputField.value = formatCurrency(numericValue);
        depositSlider.value = numericValue; // Update slider to the valid numeric value
        updateLoanDetails(); // Update details when value changes
    };

    // Event listeners for deposit slider and input field
    depositSlider.addEventListener('input', () => {
        depositInputField.value = formatCurrency(parseFloat(depositSlider.value));
        updateLoanDetails(); // Update details when slider changes
    });

    depositInputField.addEventListener('input', handleDepositChange);

    // Update term details
    const updateTermDetails = () => {
        termSelectDropdown.value = termSlider.value;
        updateLoanDetails(); // Update details when term slider changes
    };

    // Event listeners for term slider and dropdown
    termSlider.addEventListener('input', updateTermDetails);
    termSelectDropdown.addEventListener('change', () => {
        termSlider.value = termSelectDropdown.value;
        updateLoanDetails(); // Update details when dropdown value changes
    });
}

// Export functions
export {
    generateFinanceMessage,
    generateLoanContent,
    initializeFinanceCalcEventListeners
};