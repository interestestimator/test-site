// popupForms.js

import { initializePopup, createPopupHeader } from './js/popupUtils.js';

// Define the formTypes
export const FORM_TYPES = {
    TEST_DRIVE: 'testDrive',
    PRICE_ALERT: 'priceAlert',
    CONTACT_US: 'contactUs',
    REQUEST_EMAIL: 'requestEmail',
    REQUEST_FINANCE: 'requestFinance'
};

// Define the access keys for each form type
const FORM_ACCESS_KEYS = {
    [FORM_TYPES.TEST_DRIVE]: 'fc184b2a-7c0d-4071-a665-e807c3f4e679',
    [FORM_TYPES.PRICE_ALERT]: 'fc184b2a-7c0d-4071-a665-e807c3f4e679',
    [FORM_TYPES.CONTACT_US]: 'fc184b2a-7c0d-4071-a665-e807c3f4e679',
    [FORM_TYPES.REQUEST_EMAIL]: 'fc184b2a-7c0d-4071-a665-e807c3f4e679',
    [FORM_TYPES.REQUEST_FINANCE]: 'fc184b2a-7c0d-4071-a665-e807c3f4e679'
};

// Helper function to generate form fields based on form type
function getFormFields(formType, carId, carReference, financeDetails) {
    const baseFields = `
        <input type="hidden" id="car_id" name="car_id" value="${carId}" />
        <div class="input-box">
            <input type="text" id="name" placeholder="Nombre *" aria-required="true" maxlength="30" autocapitalize="none" autocorrect="off" name="name" required>
            <span for="name">Nombre *</span>
        </div>
        <div class="input-box">
            <input type="email" id="email" placeholder="Correo electrónico *" aria-required="true" maxlength="30" autocapitalize="none" autocorrect="off" name="email" required>
            <span for="email">Correo electrónico *</span>
        </div>
    `;

    const phoneField = `
        <div class="input-box">
            <input type="tel" id="phone" placeholder="Teléfono *" aria-required="true" maxlength="9" autocapitalize="none" autocorrect="off" name="phone" inputmode="numeric" pattern="[0-9]*" title="Por favor, ingresa un número de teléfono válido (solo números)" required>
            <span for="phone">Teléfono *</span>
        </div>
    `;

    const additionalFields = {
        [FORM_TYPES.TEST_DRIVE]: `
            ${baseFields}
            ${phoneField}
            <div class="input-box">
                <label for="days" class="form-label">¿Qué día prefieres para la prueba?</label>
                <div class="form-options">
                    <input type="radio" id="weekday" name="days" value="Weekday" required>
                    <label for="weekday" class="button-like">Días de semana</label>
                    
                    <input type="radio" id="weekend" name="days" value="Weekend" required>
                    <label for="weekend" class="button-like">Fin de semana</label>
                    
                    <input type="radio" id="any-day" name="days" value="Any Day" required checked>
                    <label for="any-day" class="button-like">Cualquier día</label>
                </div>
            </div>
            <div class="input-box">
                <label for="time" class="form-label">¿Cuál es tu horario preferido?</label>
                <div class="form-options">
                    <input type="radio" id="morning" name="time" value="Morning" required>
                    <label for="morning" class="button-like">Por la mañana</label>
                    
                    <input type="radio" id="afternoon" name="time" value="Afternoon" required>
                    <label for="afternoon" class="button-like">Por la tarde</label>
                    
                    <input type="radio" id="any-time" name="time" value="Any Time" required checked>
                    <label for="any-time" class="button-like">Cualquier hora</label>
                </div>
            </div>
        `,
        [FORM_TYPES.PRICE_ALERT]: `
            ${baseFields}
            ${phoneField}
            <div class="input-box">
                <label for="price-alert" class="form-label">¿Qué tipo de alerta prefieres?</label>
                <div class="form-options">
                    <input type="radio" id="finance-drop" name="price-alert" value="Finance Drop" required>
                    <label for="finance-drop" class="button-like">Financiación</label>
                    
                    <input type="radio" id="cash-drop" name="price-alert" value="Cash Drop" required>
                    <label for="cash-drop" class="button-like">Al contado</label>
                    
                    <input type="radio" id="either" name="price-alert" value="Either" required checked>
                    <label for="either" class="button-like">Cualquier</label>
                </div>
            </div>
        `,
        [FORM_TYPES.CONTACT_US]: `
            ${baseFields}
            ${phoneField}
            <div class="input-box">
                <label id="char-count" for="message" class="form-label">Motivo del contacto (máx. 350 caracteres)</label>
                <textarea id="message" name="message" class="form-textarea" placeholder="Tu mensaje" rows="4" maxlength="350" required></textarea>
            </div>
        `,
        [FORM_TYPES.REQUEST_EMAIL]: `
            ${baseFields}
            <input type="hidden" id="message" name="message" class="form-input" value="I'm interested in more details about <strong>${carReference}</strong>." />
        `,
        [FORM_TYPES.REQUEST_FINANCE]: `
            ${baseFields}
            <input type="hidden" id="message" name="message" class="form-input" value="${financeDetails}" />
            ${phoneField}
            <div class="input-box">
                <label id="finance-char-count" for="finance-message" class="form-label">Comentarios sobre la financiación (máx. 350 caracteres)</label>
                <textarea id="finance-message" name="finance-message" class="form-textarea" placeholder="Tus comentarios" rows="4" maxlength="350"></textarea>
            </div>
        `
    };

    return additionalFields[formType] || '';
}

// Function to check if all required fields in the form are filled out
function checkFormValidity(form) {
    const requiredInputs = form.querySelectorAll('input[required], textarea[required]');
    const radioGroups = new Set(Array.from(requiredInputs).map(input => input.name).filter(name => name.includes('radio')));

    const allInputsFilled = Array.from(requiredInputs).every(input => input.value.trim() !== '');
    const allRadioSelected = Array.from(radioGroups).every(name => form.querySelector(`input[name="${name}"]:checked`));

    const submitButton = form.querySelector('.form-submit-button');
    submitButton.disabled = !(allInputsFilled && allRadioSelected);
}

// Function to check if an input field has content
function checkInputHasContent(input) {
    input.classList.toggle('input-has-content', input.value.trim() !== '');
}

// Event listener to monitor input changes and update input styles
function addInputListeners(form) {
    form.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('input', () => {
            checkInputHasContent(input);
            checkFormValidity(form);
        });
        input.addEventListener('change', () => checkFormValidity(form));
    });
}

// Function to handle form submission
async function handleFormSubmission(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const formType = event.target.id.replace('Form', '');

    let message = `Name: ${formData.get('name')}\nEmail: ${formData.get('email')}\nCar ID: ${formData.get('car_id')}\nPhone: ${formData.get('phone')}\nComments: ${formData.get('comments')}`;
    
    if (formType === FORM_TYPES.PRICE_ALERT) {
        message += `\nPreferred Price Alert: ${formData.get('price-alert')}`;
    }
    if (formType !== FORM_TYPES.CONTACT_US && formType !== FORM_TYPES.REQUEST_EMAIL) {
        message += `\nCar Reference: ${formData.get('car_reference')}`;
    }
    if (formType === FORM_TYPES.TEST_DRIVE) {
        message += `\nPreferred Days: ${formData.get('days')}\nPreferred Time: ${formData.get('time')}`;
    }
    if ([FORM_TYPES.CONTACT_US, FORM_TYPES.REQUEST_EMAIL].includes(formType)) {
        message += `\nMessage: ${formData.get('message')}`;
    }
    if (formType === FORM_TYPES.REQUEST_FINANCE) {
        message += `\nFinance Details: ${formData.get('message')}`;
    }
    if (formData.get('ads_accept') === '1') {
        message += `\nPlease add this person to the subscription list at info@martinezdelugo.com`;
    }

    const data = {
        access_key: formData.get('access_key'),
        subject: formData.get('subject'),
        from_name: formData.get('from_name'),
        message: message
    };

    const submitButton = event.target.querySelector('.form-submit-button');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const json = await response.json();
        if (response.ok) {
            submitButton.textContent = '¡Enviado!';
            setTimeout(() => document.getElementById('closeContactPopup')?.click(), 2000);
        } else {
            submitButton.textContent = `La presentación falló: ${json.message}`;
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Enviar';
            }, 2000);
        }
    } catch (error) {
        console.error('Form submission error:', error); // Log the error
        submitButton.textContent = '¡Algo salió mal!';
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar';
        }, 2000);
    }
}

export function showContactForm(event, formType, carId = '', carReference = '', financePrice = '', cashPrice = '', financeDetails = '') {
    const formTitleMap = {
        [FORM_TYPES.TEST_DRIVE]: 'Solicita una prueba de conducción',
        [FORM_TYPES.PRICE_ALERT]: 'Alerta de Rebaja de Precio',
        [FORM_TYPES.CONTACT_US]: 'Contacto',
        [FORM_TYPES.REQUEST_EMAIL]: `Request More Info - ${carReference}`,
        [FORM_TYPES.REQUEST_FINANCE]: 'Solicitar Información de Financiación'
    };

    const formDescriptionMap = {
        [FORM_TYPES.TEST_DRIVE]: `Para solicitar una prueba de conducción del <strong>${carReference}</strong>, completa el formulario a continuación. Nuestro equipo revisará tu solicitud y se pondrá en contacto contigo para coordinar una cita. Ten en cuenta que esta solicitud no es vinculante y no te compromete a realizar una compra.`,
        [FORM_TYPES.PRICE_ALERT]: `Para recibir una notificación si el precio del <strong>${carReference}</strong> baja de <strong>${cashPrice}</strong> al contado o <strong>${financePrice}</strong> en financiación, completa el formulario a continuación. Puedes elegir recibir alertas si el precio baja en financiación, al contado, o en cualquiera de las dos opciones.`,
        [FORM_TYPES.CONTACT_US]: "Completa el formulario a continuación para comunicarte con nosotros. Agradecemos tus comentarios y te responderemos lo antes posible.",
        [FORM_TYPES.REQUEST_EMAIL]: "Provide your name and email, and we'll send you more information about this car.",
        [FORM_TYPES.REQUEST_FINANCE]: financeDetails
    };

    const formTitle = formTitleMap[formType] || 'Formulario';
    const formDescription = formDescriptionMap[formType] || '';

    const getContent = () => `
        ${createPopupHeader(formTitle, 'contact')}
        <section class="contact-section">
            <div class="contact-intro">
                <p class="contact-description">${formDescription}</p>
            </div>
            <form id="${formType}Form">
                <input type="hidden" name="access_key" value="${FORM_ACCESS_KEYS[formType]}" />
                <input type="hidden" name="subject" value="${formTitle}" />
                <input type="hidden" name="from_name" value="Car Dealership" />
                ${carReference ? `<input type="hidden" id="car_reference" name="car_reference" class="form-input" value="${carReference}" />` : ''}
                ${getFormFields(formType, carId, carReference, financeDetails)}
                <div class="contact-intro">
                    <div class="form-check form-check--required">
                        <input type="checkbox" id="vehicle_send_to_friend_legal_policy_accept" name="vehicle_send_to_friend[legal][policy_accept]" required class="form-check-input" value="1">
                        <label for="vehicle_send_to_friend_legal_policy_accept" class="required">
                            Acepto la <a href="/privacy-policy.html" target="_blank" class="blue-link">política de privacidad</a>.
                        </label>
                    </div>
                    <div class="form-check form-check--optional">
                        <input type="checkbox" id="ads_accept" name="ads_accept" class="form-check-input" value="1">
                        <label for="ads_accept">
                            Acepto recibir ofertas y promociones de Martínez De Lugo, S.L.U.
                        </label>
                    </div>
                </div>
                <span class="button-box">
                    <button class="form-submit-button" type="submit" name="submit" disabled>${formType === FORM_TYPES.REQUEST_EMAIL ? 'Request Info' : 'Enviar'}</button>
                </span>
            </form>
        </section>
    `;

    initializePopup('contactPopup', 'closeContactPopup', getContent, event);

    // Add event listeners to form submission
    const form = document.getElementById(`${formType}Form`);
    form.addEventListener('submit', handleFormSubmission);

    // Add input listeners to enable/disable the submit button
    addInputListeners(form);

    // Check if elements exist before adding event listeners for dynamic text updates
    const textarea = document.getElementById('message');
    const charCount = document.getElementById('char-count');
    const financeTextarea = document.getElementById('finance-message');
    const financeCharCount = document.getElementById('finance-char-count');

    if (textarea && charCount) {
        textarea.addEventListener('input', () => updateCharCount(textarea, charCount, 350));
    }

    if (financeTextarea && financeCharCount) {
        financeTextarea.addEventListener('input', () => updateCharCount(financeTextarea, financeCharCount, 350));
    }
}

// Function to update character count
function updateCharCount(textarea, charCountElement, maxLength) {
    const remaining = maxLength - textarea.value.length;
    charCountElement.textContent = `${charCountElement.getAttribute('for')} (${remaining} caracteres restantes)`;
}
