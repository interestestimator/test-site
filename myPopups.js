function hidePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
    hideOverlay();
    // Remove no-scroll class from body
    document.body.classList.remove('no-scroll');
}

function hideAllPopups() {
    ['consumptionPopup', 'emissionsPopup', 'documentsPopup'].forEach(hidePopup);
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

function formatDetail(label, value) {
    return `
        <div class="finance-details-item">
            <span class="detail-label">${label}:</span>
            <span class="detail-value">${value}</span>
        </div>
    `;
}

function showConsumptionInfo(event, serializedData) {
    event.preventDefault();

    // Parse the serialized JSON string back to an object
    const additionalData = serializedData ? JSON.parse(decodeURIComponent(serializedData)) : {};

    const popup = document.getElementById('consumptionPopup');

    const content = `
        <div class="popup-title">
            <div class="consumption-text">Consumos del ${additionalData.brand ?? ''} ${additionalData.model ?? ''}</div>
            <button id="closeConsumptionPopup" class="close-button">
                <img src="icons/close-icon.svg" alt="Close" width="20" height="20">
            </button>
        </div>
        <div class="vehical-consumption-container">
            ${formatDetail("Consumo medio", additionalData.averageConsumption + ' l/100')}
            ${formatDetail("Consumo ciudad", additionalData.urbanConsumption + ' l/100')}
            ${formatDetail("Consumo carretera", additionalData.highwayConsumption + ' l/100')}
        </div>
        <div>
            Consumos según el fabricante
        </div>
    `;

    popup.innerHTML = content;
    showPopup('consumptionPopup');

    // Add event listeners to buttons
    document.getElementById('closeConsumptionPopup').addEventListener('click', () => hidePopup('consumptionPopup'));
}




function showEmissionsInfo(event, serializedData) {
    event.preventDefault();

    // Parse the serialized JSON string back to an object
    const additionalData = serializedData ? JSON.parse(decodeURIComponent(serializedData)) : {};

    const popup = document.getElementById('emissionsPopup');

    // Determine the emission label content
    let emissionContent = '';

    if (additionalData.emissionLabel === '0') {
        emissionContent = `
            <div class="vehical-emissions-container">
                La etiqueta CERO identifica a los vehículos menos contaminantes. Tales como vehículos eléctricos de batería, 
                vehículos eléctricos de autonomía extendida, híbridos enchufables con autonomía mínima eléctrica de 40 kilómetros 
                o vehículos de pila de combustible.

                <ul>
                    <li>Pueden circular por el BUS VAO de la A6 en Madrid y C-58 en Barcelona con un solo ocupante.</li>
                    <li>No se ven afectados por restricciones a la circulación como ‘Madrid Central’.</li>
                    <li>Bonificación del 75% en el Impuesto de Circulación en Madrid y Barcelona.</li>
                    <li>Aparcamiento gratuito y sin límite de tiempo en zona SER de Madrid y zona AREA de Barcelona.</li>
                    <li>Acceso a peajes Ecoviat en Barcelona solicitando el distintivo Ecoviat.</li>
                </ul>
            </div>
        `;
    } else if (additionalData.emissionLabel === 'C') {
        emissionContent = `
            <div class="vehical-emissions-container">
                La etiqueta C distingue a los vehículos con motor de gasolina que cumplan las normativas Euro4, Euro5 y Euro6 
                (matriculados a partir del año 2006) y vehículos diésel que cumplan la normativa Euro6 (matriculados a partir del año 2014).

                <ul>
                    <li>Acceso a la M30 de Madrid hasta el escenario 4 por alta contaminación.</li>
                    <li>Acceso a la ‘almendra central’ de Madrid hasta el escenario 4 por alta contaminación.</li>
                    <li>Impedimento para circular por el centro de Madrid en escenario 5 de alta contaminación (nunca se ha producido).</li>
                    <li>Estacionamiento en zona regulada hasta escenario 1 por alta contaminación.</li>
                </ul>
            </div>
        `;
    } else if (additionalData.emissionLabel === 'ECO') {
        emissionContent = `
            <div class="vehical-emissions-container">
                La etiqueta ECO está reservada para vehículos híbridos enchufables con menos de 40 kilómetros de autonomía eléctrica, 
                híbridos convencionales no enchufables, vehículos con motor de GNC (gas natural comprimido) y GLP (gas licuado de petróleo).

                <ul>
                    <li>Bonificación de hasta el 75% en el Impuesto de Circulación en Madrid y Barcelona.</li>
                    <li>Pueden circular por el carril bus VAO en Madrid y Barcelona con un solo ocupante en función de las indicaciones.</li>
                    <li>Descuento del 50% en zona de estacionamiento regulado en Madrid.</li>
                    <li>Descuento del 30% en los peajes de Cataluña.</li>
                    <li>Permitido el acceso a las grandes ciudades con restricciones de circulación por alta contaminación.</li>
                </ul>
            </div>
        `;
    } else if (additionalData.emissionLabel === 'B') {
        emissionContent = `
            <div class="vehical-emissions-container">
                La etiqueta B corresponde a los vehículos con motor de gasolina que cumplan la normativa Euro3 
                (matriculados a partir del año 2000) y a los vehículos con motor diésel que cumplan las normativas Euro4 y/o Euro5 
                (matriculados a partir del año 2006).

                <ul>
                    <li>Acceso a la M30 de Madrid hasta el escenario 3 por alta contaminación.</li>
                    <li>Acceso a la ‘almendra central’ de Madrid hasta escenario 3 por alta contaminación.</li>
                    <li>Impedimento para circular por el centro de Madrid en escenario 5 de alta contaminación (nunca se ha producido).</li>
                    <li>Estacionamiento en zona regulada hasta escenario 1 por alta contaminación.</li>
                </ul>
            </div>
        `;
    }

    // Define styles for centering and padding
    const imageStyles = `
        display: block;
        margin: 0 auto;
        padding: 1rem;
    `;

    // Update popup content
    const content = `
        <div class="popup-title">
            <div class="emissions-text">Distintivo de emisiones</div>
            <button id="closeEmissionsPopup" class="close-button">
                <img src="icons/close-icon.svg" alt="Close" width="20" height="20">
            </button>
        </div>
        <img src="icons/emissions/${additionalData.emissionLabel}.svg" alt="Emission Label" width="120" height="120" style="${imageStyles}">
        ${emissionContent} <!-- Insert the emission content here -->
        <div>
            Consumos según el fabricante
        </div>
    `;

    popup.innerHTML = content;
    showPopup('emissionsPopup');

    // Add event listener to the close button
    document.getElementById('closeEmissionsPopup').addEventListener('click', () => hidePopup('emissionsPopup'));
}








function showDocumentsInfo(event) {
    event.preventDefault();


    const popup = document.getElementById('documentsPopup');

    const content = `
        <div class="popup-title">
            <div class="documents-text">Documentos necesarios</div>
            <button id="closeDocumentsPopup" class="close-button">
                <img src="icons/close-icon.svg" alt="Close" width="20" height="20">
            </button>
        </div>
        <div class="documents-container">
                <h3>Documentos necesarios</h3>
                <p>Para la financiación del  es necesario presentar los siguientes documentos:</p>
                <h2>Si eres particular: </h2>
                <ul>
                    <li>DNI</li>
                    <li>Última nómina</li>
                    <li>Cuenta bancaria</li>
                </ul>
                <h2>Si eres autónomo:</h2>
                <ul>
                    <li>DNI</li>
                    <li>Cuenta bancaria</li>
                    <li>Declaración de la renta</li>
                    <li>IVA anual y trimestral</li>
                    <li>Recibo autónomo</li>
                </ul>
                <h2>Si eres empresa:</h2>
                <ul>
                    <li>Cuenta bancaria</li>
                    <li>DNI apoderado</li>
                    <li>IVA anual y trimestral</li>
                    <li>CIF</li>
                    <li>Escritura</li>
                    <li>Balance</li>
                    <li>Impuesto de sociedad</li>
                </ul>
            </div>
    `;

    popup.innerHTML = content;
    showPopup('documentsPopup');

    // Add event listeners to buttons
    document.getElementById('closeDocumentsPopup').addEventListener('click', () => hidePopup('documentsPopup'));
}