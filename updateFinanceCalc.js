import { calculateRate } from './js/financeCalc.js';
import { formatCurrency } from './js/formatCarData.js';  // Importing the initializer function



import { formatDetail } from './js/popupUtils.js';

import { showDocumentsInfo } from './popupInformation.js';


const loanDetails = document.getElementById('loanPopup');
const quotaButton = document.getElementById('requestFinanceBtn');

function adjustLoanInfo(loanLengthMonths, rawFinancePrice, vehicleDeposit, annualRateTIN, commissionRate, pmt, annualRateTAE) {
    const precioFinanciando = (rawFinancePrice - vehicleDeposit);
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
            ${formatDetail("TIN", annualRateTIN + ' %')}
            ${formatDetail("TAE", annualRateTAE + ' %')}

            <button class="show-documents-button rounded-container rounded-both bg-orange h3">
                <img class="btn-icon" src="icons/ui/lists/book.svg" alt="More information" width="12" height="12">
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
                    ***Precio al contado ${formatCurrency(rawFinancePrice)}. Precio financiando ${formatCurrency(rawFinancePrice)}. Entrada ${formatCurrency(vehicleDeposit)}. Plazo ${loanLengthMonths} meses, 1 cuota de ${formatCurrency(pmt)} 
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

    // Adding event listener to the apr-example span
    document.querySelector(`.show-documents-button`).addEventListener('click', (event) => {
        showDocumentsInfo(event);
    });
}



function setInitialValues(rawFinancePrice, vehicleDeposit, loanLengthMonths, elements) {

    const maxDeposit = rawFinancePrice * 0.6;
    const initialFinanceDeposit = vehicleDeposit;
    const initialFinanceTerm = loanLengthMonths / 12

    // Set initial values for sliders and inputs
    elements.depositSlider.max = maxDeposit || elements.depositSlider.min;
    elements.depositSlider.value = initialFinanceDeposit;
    elements.depositInputField.value = formatCurrency(elements.depositSlider.value);
    elements.maxDepositTextLabel.textContent = `Máxima: ${formatCurrency(maxDeposit)}`;

    // Set initial value for term slider and select
    elements.termSlider.value = initialFinanceTerm || elements.termSlider.min;
    elements.termSelectDropdown.value = elements.termSlider.value;
}

function updateLoanInfo(rawFinancePrice, annualRateTIN, commissionRate, elements) {
    const vehicleDeposit = parseInt(elements.depositInputField.value.replace(/[^\d]/g, ''));
    const termValue = parseInt(elements.termSelectDropdown.value);
    const additionalMonthlyRepaymentFeeAmount = 0;

    // Calculate new rates and payment amounts
    const result = calculateRate(termValue, rawFinancePrice, vehicleDeposit, annualRateTIN / 100, commissionRate / 100, additionalMonthlyRepaymentFeeAmount);

    const loanLengthMonths = termValue * 12;

    adjustLoanInfo(loanLengthMonths, rawFinancePrice, vehicleDeposit, annualRateTIN, commissionRate, result.pmt, result.annualRateTAE);
}

function initializeFinanceCalcEventListeners(rawFinancePrice, annualRateTIN, commissionRate, vehicleDeposit, loanLengthMonths, elements) {
    // Set initial values first
    setInitialValues(rawFinancePrice, vehicleDeposit, loanLengthMonths, elements);

    // Update loan info with initial values
    updateLoanInfo(rawFinancePrice, annualRateTIN, commissionRate, elements);

    // Initial Deposit Slider
    elements.depositSlider.addEventListener('input', function () {
        elements.depositInputField.value = formatCurrency(this.value);
        updateLoanInfo(rawFinancePrice, annualRateTIN, commissionRate, elements); // Update details when slider changes
    });

    elements.depositInputField.addEventListener('input', function () {
        const numericValue = parseInt(this.value.replace(/[^\d]/g, ''));
        if (!isNaN(numericValue) && numericValue <= elements.depositSlider.max) {
            elements.depositSlider.value = numericValue;
            updateLoanInfo(rawFinancePrice, annualRateTIN, commissionRate, elements); // Update details when input value changes
        }
    });

    elements.termSlider.addEventListener('input', function () {
        elements.termSelectDropdown.value = this.value;
        updateLoanInfo(rawFinancePrice, annualRateTIN, commissionRate, elements); // Update details when slider changes
    });

    elements.termSelectDropdown.addEventListener('change', function () {
        elements.termSlider.value = this.value;
        updateLoanInfo(rawFinancePrice, annualRateTIN, commissionRate, elements); // Update details when dropdown value changes
    });
}

function generateFinanceMessage(carReference, financePrice) {
    // Get elements by their IDs
    const financeDeposit = document.getElementById('deposit-input').value;
    const financeTerm = document.getElementById('term-select').value;
    const financePMT = document.getElementById('requestFinanceBtn').querySelector('.amount').textContent;

    // Construct the message with bullet points
    const carFinanceMessage = `
        <p>Por favor, completa el formulario para recibir más información sobre las opciones de financiación para el <strong>${carReference}</strong>. Ya hemos registrado tus preferencias:</p>
        <ul>
            <li>Entrada: <strong>${financeDeposit}</strong></li>
            <li>Duración del préstamo: <strong>${financeTerm}</strong> años</li>
            <li>Pago mensual: <strong>${financePMT}</strong></li>
            <li>Importe financiado: <strong>${financePrice}</strong> (esto es un valor a añadir o modificar en caso de calcularlo en base al input)</li>
        </ul>
        <p>Si deseas añadir un comentario adicional, puedes hacerlo a continuación.</p>
    `;

    return carFinanceMessage;
}


// Export functions
export {
    initializeFinanceCalcEventListeners,
    generateFinanceMessage
};


