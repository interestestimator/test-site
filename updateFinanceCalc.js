import { calculateRate } from './js/financeCalc.js';
import { formatCurrency } from './js/formatCarData.js';  // Importing the initializer function


const loanDetails = document.getElementById('loanPopup');
const quotaButton = document.getElementById('requestFinanceBtn');

function adjustLoanInfo(loanLengthMonths, vehiclePrice, vehicleDeposit, annualRateTIN, commissionRate, pmt, annualRateTAE) {
    const precioFinanciando = (vehiclePrice - vehicleDeposit);
    const commissionAmount = (precioFinanciando) * commissionRate / 100;
    const pmtPositive = Math.abs(pmt);

    const content = `
        <div class="title">
            <div class="finance-text">Detalles de la oferta</div>
        </div>
        <div class="finance-details-container">
            ${formatDetail("Cuota mensual*", formatCurrency(pmtPositive))}
            ${formatDetail("Precio financiando", formatCurrency(precioFinanciando))}
            ${formatDetail("Entrada", formatCurrency(vehicleDeposit))}
            ${formatDetail("Meses", loanLengthMonths)}
            ${formatDetail("Importe a plazos", formatCurrency(loanLengthMonths * pmtPositive))}
            ${formatDetail("Comisión de apertura", formatCurrency(commissionAmount))}
            ${formatDetail("TIN", annualRateTIN + '%')}
            ${formatDetail("TAE", annualRateTAE + '%')}

            <button class="button1" onclick="showDocumentsInfo(event)">
                <img class="btn-icon" src="icons/book.svg" alt="More information" width="12" height="12">
                 Documentación necesaria
            </button>
        </div>
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
                    ***Precio al contado ${formatCurrency(vehiclePrice)}. Precio financiando ${formatCurrency(vehiclePrice)}. Entrada ${formatCurrency(vehicleDeposit)}. Plazo ${loanLengthMonths} meses, 1 cuota de ${formatCurrency(pmt)} 
                    y ${loanLengthMonths - 1} cuotas de ${formatCurrency(pmtPositive)}. Tipo Deudor Fijo ${annualRateTIN}%, T.A.E. ${annualRateTAE}% (La T.A.E., así como la primera cuota podrán variar 
                    ligeramente en función del día de la firma del contrato y de la fecha de pago de las cuotas). Comisión de Apertura ${commissionRate}%, 
                    ${formatCurrency(commissionAmount)} financiada. Intereses //4.816,36 €, Importe Total del Crédito 14.449,05 €, Coste Total del Crédito //5.365,41 €, 
                    Importe Total Adeudado //19.265,41 €, Precio Total a Plazos //19.265,41 €. Siendo el día de contratación ADD DATE HERE y primer 
                    pago el ADD DATE HERE. Importe mínimo a financiar //10.000 €. Oferta válida hasta el //31/12/2024.
                </p>
                <p>
                    ***Financiación ofrecida por Santander Consumer, S.A. sujeto a estudio y aprobación por parte de la entidad financiera. 
                    Oferta válida hasta el //31/12/2024 para vehículos ofertados por concesionarios que publiquen en Coches.net.
                </p>
            </div>
        </div>
    `;

    loanDetails.innerHTML = content;
    loanDetails.style.display = 'block'; // Ensure details are always visible

    // Update the button text with the PMT value
    quotaButton.querySelector('.amount').textContent = formatCurrency(pmtPositive) + '/mes';
}

function formatDetail(label, value) {
    return `
        <div class="finance-details-item">
            <span class="detail-label">${label}:</span>
            <span class="detail-value">${value}</span>
        </div>
    `;
}

function setInitialValues(vehiclePrice, elements) {

    const maxDeposit = vehiclePrice * 0.6;
    const financeTerm =  10

    // Set initial values for sliders and inputs
    elements.depositSlider.max = maxDeposit || elements.depositSlider.min;
    elements.depositSlider.value = maxDeposit / 2;
    elements.depositInputField.value = formatCurrency(elements.depositSlider.value);
    elements.maxDepositTextLabel.textContent = `Máxima: ${formatCurrency(maxDeposit)}`;

    // Set initial value for term slider and select
    elements.termSlider.value = financeTerm || elements.termSlider.min;
    elements.termSelectDropdown.value = elements.termSlider.value;
}

function updateLoanInfo(vehiclePrice, annualRateTIN, commissionRate, elements) {
    const vehicleDeposit = parseInt(elements.depositInputField.value.replace(/[^\d]/g, ''));
    const termValue = parseInt(elements.termSelectDropdown.value);
    const additionalMonthlyRepaymentFeeAmount = 0;

    // Calculate new rates and payment amounts
    const result = calculateRate(termValue, vehiclePrice, vehicleDeposit, annualRateTIN / 100, commissionRate / 100, additionalMonthlyRepaymentFeeAmount);

    const loanLengthMonths = termValue * 12;

    adjustLoanInfo(loanLengthMonths, vehiclePrice, vehicleDeposit, annualRateTIN, commissionRate, result.pmt, result.annualRateTAE);
}

function initializeFinanceCalcEventListeners(vehiclePrice, annualRateTIN, commissionRate, elements) {
    // Set initial values first
    setInitialValues(vehiclePrice, elements);

    // Update loan info with initial values
    updateLoanInfo(vehiclePrice, annualRateTIN, commissionRate, elements);

    // Initial Deposit Slider
    elements.depositSlider.addEventListener('input', function () {
        elements.depositInputField.value = formatCurrency(this.value);
        updateLoanInfo(vehiclePrice, annualRateTIN, commissionRate, elements); // Update details when slider changes
    });

    elements.depositInputField.addEventListener('input', function () {
        const numericValue = parseInt(this.value.replace(/[^\d]/g, ''));
        if (!isNaN(numericValue) && numericValue <= elements.depositSlider.max) {
            elements.depositSlider.value = numericValue;
            updateLoanInfo(vehiclePrice, annualRateTIN, commissionRate, elements); // Update details when input value changes
        }
    });

    elements.termSlider.addEventListener('input', function () {
        elements.termSelectDropdown.value = this.value;
        updateLoanInfo(vehiclePrice, annualRateTIN, commissionRate, elements); // Update details when slider changes
    });

    elements.termSelectDropdown.addEventListener('change', function () {
        elements.termSlider.value = this.value;
        updateLoanInfo(vehiclePrice, annualRateTIN, commissionRate, elements); // Update details when dropdown value changes
    });
}


// Export functions
export { 
    initializeFinanceCalcEventListeners
};
