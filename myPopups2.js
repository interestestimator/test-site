// myPopups2.js



function hidePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = 'none';
        hideOverlay();
        // Remove no-scroll class from body
        document.body.classList.remove('no-scroll');
    } else {
        console.error(`Popup with ID "${popupId}" not found.`);
    }
}

function hideIndexPopups() {
    ['filterPopup', 'sortPopup', 'loanPopup'].forEach(hidePopup);
}

function hideCarDetailsPopups() {
    ['consumptionPopup', 'emissionsPopup', 'documentsPopup', 'contactPopup'].forEach(hidePopup);
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

function showLoanInfo(event, loanLengthMonths, vehiclePrice, vehicleDeposit, annualRateTIN, commissionRate, pmt, annualRateTAE) {
    event.preventDefault();
    const popup = document.getElementById('loanPopup');

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
            <h2 class="legal-conditions-title">Condiciones de financiación</h2>
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
                <div class="popup-buttons">
                    <button id="acknowledgeButton" class="acknowledge-button">Entendido</button>
                </div>
            </div>

        </div>
    `;

    popup.innerHTML = content;
    showPopup('loanPopup');

    // Add event listeners to buttons
    document.getElementById('closeFinancePopup').addEventListener('click', () => hidePopup('loanPopup'));
    document.getElementById('acknowledgeButton').addEventListener('click', () => hidePopup('loanPopup'));
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
















const FORM_TYPES = {
    TEST_DRIVE: 'testDrive',
    PRICE_ALERT: 'priceAlert',
    CONTACT_US: 'contactUs',
    REQUEST_EMAIL: 'requestEmail',
    REQUEST_FINANCE: 'requestFinance'  // New form type
};

// Define the access keys for each form type
const FORM_ACCESS_KEYS = {
    [FORM_TYPES.TEST_DRIVE]: 'fc184b2a-7c0d-4071-a665-e807c3f4e679',
    [FORM_TYPES.PRICE_ALERT]: 'fc184b2a-7c0d-4071-a665-e807c3f4e679',
    [FORM_TYPES.CONTACT_US]: 'fc184b2a-7c0d-4071-a665-e807c3f4e679',
    [FORM_TYPES.REQUEST_EMAIL]: 'fc184b2a-7c0d-4071-a665-e807c3f4e679',
    [FORM_TYPES.REQUEST_FINANCE]: 'fc184b2a-7c0d-4071-a665-e807c3f4e679'  // Access key for the new form
};

function showContactForm(event, formType, carId = '', financeDetails = '') {
    event.preventDefault();

    const popup = document.getElementById('contactPopup');
    const accessKey = FORM_ACCESS_KEYS[formType];

    let formTitle, formDescription, additionalFields = '', submitText;
    
    switch (formType) {
        case FORM_TYPES.TEST_DRIVE:
            formTitle = `Test Drive Request - ${carId}`;
            formDescription = "Fill out the form below to schedule a test drive. We'll confirm the details with you as soon as possible.";
            submitText = 'Schedule Test Drive';
            additionalFields = `
                <div class="form-group">
                    <label for="days" class="form-label">Preferred Days</label>
                    <select id="days" name="days" class="form-input" required>
                        <option value="Any">Any</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="time" class="form-label">Preferred Time</label>
                    <select id="time" name="time" class="form-input" required>
                        <option value="Any">Any</option>
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                    </select>
                </div>
            `;
            break;

        case FORM_TYPES.PRICE_ALERT:
            formTitle = `Price Drop Alert - ${carId}`;
            formDescription = "Fill out the form below to be notified if the car's price is ever lowered.";
            submitText = 'Notify Me';
            break;

        case FORM_TYPES.CONTACT_US:
            formTitle = 'Contact Us';
            formDescription = "Fill out the form below to get in touch with us. We value your feedback and will get back to you as soon as possible.";
            submitText = 'Send Message';
            additionalFields = `
                <div class="form-group">
                    <label for="message" class="form-label">Message</label>
                    <textarea id="message" name="message" class="form-textarea" placeholder="Your message" rows="4" required></textarea>
                </div>
            `;
            break;

        case FORM_TYPES.REQUEST_EMAIL:
            formTitle = `Request More Info - ${carId}`;
            formDescription = "Provide your name and email, and we'll send you more information about this car.";
            submitText = 'Request Info';
            additionalFields = `
                <input type="hidden" id="message" name="message" class="form-input" value="I'm interested in more details about ${carId}." />
            `;
            break;
        
        case FORM_TYPES.REQUEST_FINANCE:  // New form type case
            formTitle = `Request Finance Information - ${carId}`;
            formDescription = "Provide your name, email, phone number, and any comments. We'll send you more information about financing options for this car.";
            submitText = 'Request Finance Info';
            additionalFields = `
                <input type="hidden" id="message" name="message" class="form-input" value="Interested in financing options for ${carId}. Details: ${financeDetails}" />
                <div class="form-group">
                    <label for="phone" class="form-label">Phone</label>
                    <input id="phone" name="phone" class="form-input" placeholder="Your phone number" type="tel" required />
                </div>
                <div class="form-group">
                    <label for="comments" class="form-label">Comments</label>
                    <textarea id="comments" name="comments" class="form-textarea" placeholder="Any additional comments or questions" rows="4"></textarea>
                </div>
            `;
            break;

        default:
            console.error('Unknown form type:', formType);
            return;
    }

const content = `
    <div class="popup-title">
        <div class="Contact-text">${formTitle}</div>
        <button id="closeContactPopup" class="close-button">
            <img src="icons/close-icon.svg" alt="Close" width="20" height="20">
        </button>
    </div>
    <section class="contact-section">
        <div class="contact-intro">
            <h2 class="contact-title">${formTitle}</h2>
            <p class="contact-description">${formDescription}</p>
        </div>

        <form id="${formType}Form">
            <input type="hidden" name="access_key" value="${accessKey}" />
            <input type="hidden" name="subject" value="${formTitle}" />
            <input type="hidden" name="from_name" value="Car Dealership" />
            ${carId ? `<input type="hidden" id="car_reference" name="car_reference" class="form-input" value="${carId}" />` : ''}
            
            <div class="form-group">
                <label for="name" class="form-label">Name</label>
                <input id="name" name="name" class="form-input" placeholder="Your name" type="text" required />
            </div>
            
            <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input id="email" name="email" class="form-input" placeholder="Your email" type="email" required />
            </div>

            ${additionalFields}

            <div class="vehicle-send-to-friend-legal-checks">
                <div class="form-check form-check--required">
                    <input type="checkbox" id="vehicle_send_to_friend_legal_policy_accept" name="vehicle_send_to_friend[legal][policy_accept]" required class="form-check-input" value="1">
                    <label for="vehicle_send_to_friend_legal_policy_accept" class="required">
                        Acepto la <a href="/privacy-policy.html" target="_blank">política de privacidad</a>.
                    </label>
                </div>
                <div class="form-check form-check--optional">
                    <input type="checkbox" id="vehicle_send_to_friend_legal_ads_accept" name="vehicle_send_to_friend[legal][ads_accept]" class="form-check-input" value="1">
                    <label for="vehicle_send_to_friend_legal_ads_accept">
                        Acepto recibir información comercial sobre ofertas y promociones de Automóviles PROVOS S.L.
                    </label>
                </div>
            </div>

            <button class="form-submit" type="submit">${submitText}</button>
            <div class="result-message" id="${formType}Result"></div>
        </form>
    </section>
`;

    popup.innerHTML = content;
    showPopup('contactPopup');

    // Add event listeners to buttons and form submission
    document.getElementById('closeContactPopup').addEventListener('click', () => hidePopup('contactPopup'));
    document.getElementById(`${formType}Form`).addEventListener('submit', handleFormSubmission);
}



function handleFormSubmission(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formType = event.target.id.replace('Form', '');

    let message = `Name: ${formData.get('name')}\nEmail: ${formData.get('email')}\nPhone: ${formData.get('phone')}\nComments: ${formData.get('comments')}`;
    if (formType !== FORM_TYPES.CONTACT_US && formType !== FORM_TYPES.REQUEST_EMAIL) {
        message += `\nCar Reference: ${formData.get('car_reference')}`;
    }
    if (formType === FORM_TYPES.TEST_DRIVE) {
        message += `\nPreferred Days: ${formData.get('days')}\nPreferred Time: ${formData.get('time')}`;
    }
    if (formType === FORM_TYPES.CONTACT_US || formType === FORM_TYPES.REQUEST_EMAIL) {
        message += `\nMessage: ${formData.get('message')}`;
    }
    if (formType === FORM_TYPES.REQUEST_FINANCE) {
        message += `\nFinance Details: ${formData.get('message')}`; // Including finance details in the message
    }

    const data = {
        access_key: formData.get('access_key'),
        subject: formData.get('subject'),
        from_name: formData.get('from_name'),
        message: message
    };

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(async (response) => {
            let json = await response.json();
            const resultDiv = document.getElementById(`${formType}Result`);
            if (response.status == 200) {
                resultDiv.innerHTML = json.message;
            } else {
                resultDiv.innerHTML = "Submission failed: " + json.message;
            }
        })
        .catch(error => {
            console.log(error);
            const resultDiv = document.getElementById(`${formType}Result`);
            resultDiv.innerHTML = "Something went wrong!";
        });
}



/**
 * Formats a number as currency.
 *
 * @param {number} amount - The amount to format.
 * @return {string} The formatted currency string.
 */
function formatCurrency(amount) {
    const formatter = new Intl.NumberFormat('eu', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
    return formatter.format(amount);
}
