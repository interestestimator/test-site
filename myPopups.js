function setupEventListeners() {
    const popupConfigs = [
        { labelId: 'filterLabel', popupId: 'filterPopup', closeId: 'closeFilterPopup', action: null },
        { labelId: 'sortLabel', popupId: 'sortPopup', closeId: 'closeSortPopup', action: applySort }
    ];

    popupConfigs.forEach(config => {
        setupPopupToggle(config.labelId, config.popupId);
        document.getElementById(config.closeId).onclick = () => hidePopup(config.popupId);
    });

    // Event listener for filter options (manufacturer, fuel, body, emissions)
    document.getElementById('makeOptions').onclick = event => handleOptionClick(event, 'filterLabel', 'filterPopup', 'filter-icon', value => filterCars('make', value));
    document.getElementById('fuelOptions').onclick = event => handleOptionClick(event, 'filterLabel', 'filterPopup', 'filter-icon', value => filterCars('fuel', value));
    document.getElementById('bodyOptions').onclick = event => handleOptionClick(event, 'filterLabel', 'filterPopup', 'filter-icon', value => filterCars('body', value));
    document.getElementById('emissionsOptions').onclick = event => handleOptionClick(event, 'filterLabel', 'filterPopup', 'filter-icon', value => filterCars('emissions', value));

    // Event listener for sort options
    document.getElementById('sortPopup').onclick = event => handleOptionClick(event, 'sortLabel', 'sortPopup', 'sort-icon', applySort);

    // Event listener for overlay click
    document.getElementById('overlay').addEventListener('click', () => hideAllPopups());
}

function setupPopupToggle(labelId, popupId) {
    const label = document.getElementById(labelId);
    const popup = document.getElementById(popupId);

    label.addEventListener('click', () => {
        const isVisible = popup.style.display === 'block';
        popup.style.display = isVisible ? 'none' : 'block';
        const overlay = document.getElementById('overlay');
        overlay.style.display = isVisible ? 'none' : 'block';

        if (!isVisible) {
            showOverlay();
        } else {
            hideOverlay();
        }

        // Reset scroll position to the top when opening
        if (!isVisible) {
            popup.scrollTop = 0;
        }
    });
}

function hidePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
    hideOverlay();
    // Remove no-scroll class from body
    document.body.classList.remove('no-scroll');
}

function hideAllPopups() {
    ['filterPopup', 'sortPopup', 'loanPopup'].forEach(hidePopup);
}

function handleOptionClick(event, labelId, popupId, icon, action) {
    if (event.target.classList.contains('popup-option')) {
        const selectedValue = event.target.getAttribute('data-value');
        document.getElementById(labelId).innerHTML = `<img src="icons/${icon}.svg" alt="${event.target.textContent} Icon" width="20" height="20"> ${event.target.textContent}`;
        hidePopup(popupId);
        action(selectedValue);
    }
}

function showOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'block';
    // Add no-scroll class to body
    document.body.classList.add('no-scroll');
}

function hideOverlay() {
    document.getElementById('overlay').style.display = 'none';
    // Remove no-scroll class from body
    document.body.classList.remove('no-scroll');
}

function showPopup(popupId) {
    const popup = document.getElementById(popupId);
    popup.style.display = 'block';
    showOverlay();
    
    // Reset scroll position to the top
    popup.scrollTop = 0;
}

function showLoanInfo(event, loanLengthMonths, vehiclePrice, vehicleDeposit, annualRateTIN, commissionRate, pmt, annualRateTAE) {
    event.preventDefault();
    const popup = document.getElementById('loanPopup');

    const formatDetail = (label, value) => `
        <div class="finance-details-item">
            <span class="detail-label">${label}:</span>
            <span class="detail-value">${value}</span>
        </div>
    `;

    const content = `
        <div class="popup-title">
            <div class="finance-text">Offer details</div>
            <button id="closeFinancePopup" class="close-button">
                <img src="icons/close-icon.svg" alt="Close" width="20" height="20">
            </button>
        </div>
        <div class="finance-details-container">
            ${formatDetail("Cuota mensual*", formatCurrency(pmt))}
            ${formatDetail("Precio financiando", formatCurrency(vehiclePrice))}
            ${formatDetail("Entrada", formatCurrency(vehicleDeposit))}
            ${formatDetail("Meses", loanLengthMonths)}
            ${formatDetail("Importe a plazos", formatCurrency(loanLengthMonths * pmt))}
            ${formatDetail("Comisión de apertura", formatCurrency(vehiclePrice * commissionRate / 100))}
            ${formatDetail("TIN", annualRateTIN + '%')}
            ${formatDetail("TAE", annualRateTAE + '%')}
            ${formatDetail("Primera cuota", formatCurrency(pmt))}
            ${formatDetail("Financiación provista por", "Santander")}
        </div>
        <div class="finance-conditions">
            <h2>Condiciones de financiación</h2>
            <div class="legal-conditions">
                <h3>Condiciones legales Adevinta</h3>
                <p>
                    La información, precios, cuotas de financiación, imágenes y otros contenidos relativos a los vehículos incluidos en el 
                    Portal son proporcionados por terceros por lo que pueden no ser exactos, precisos y completos o estar actualizados en 
                    cada momento. Por ello, Coches.net no asume responsabilidad respecto de los contenidos proporcionados por los 
                    concesionarios, las entidades de financiación, los intermediarios de estas, por terceros o aquellos incluidos por los 
                    propios usuarios y que puedan ser incorrectos, erróneos, falsos, incompletos o contrarios a la ley o al orden público, 
                    salvo que el error sea imputable a una acción u omisión de coches.net.
                </p>
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
                    y ${loanLengthMonths - 1} cuotas de ${formatCurrency(pmt)}. Tipo Deudor Fijo ${annualRateTIN}%, T.A.E. ${annualRateTAE}% (La T.A.E., así como la primera cuota podrán variar 
                    ligeramente en función del día de la firma del contrato y de la fecha de pago de las cuotas). Comisión de Apertura ${commissionRate}%, 
                    ${formatCurrency(vehiclePrice * commissionRate / 100)} financiada. Intereses //4.816,36 €, Importe Total del Crédito 14.449,05 €, Coste Total del Crédito //5.365,41 €, 
                    Importe Total Adeudado //19.265,41 €, Precio Total a Plazos //19.265,41 €. Siendo el día de contratación ADD DATE HERE y primer 
                    pago el ADD DATE HERE. Importe mínimo a financiar //10.000 €. Oferta válida hasta el //31/12/2023.
                </p>
                <p>
                    ***Financiación ofrecida por Santander Consumer, S.A. sujeto a estudio y aprobación por parte de la entidad financiera. 
                    Oferta válida hasta el //31/12/2023 para vehículos ofertados por concesionarios que publiquen en Coches.net.
                </p>
            </div>
        </div>
    `;

    popup.innerHTML = content;
    showPopup('loanPopup');

    document.getElementById('closeFinancePopup').addEventListener('click', () => hidePopup('loanPopup'));
}
