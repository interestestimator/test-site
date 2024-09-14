// popupForms.js

import { initializePopup, createPopupHeader } from './js/popupUtils.js';

// Define the formTypes
export const FORM_TYPES = {
    TEST_DRIVE: 'testDrive',
    PRICE_ALERT: 'priceAlert',
    CONTACT_US: 'contactUs',
    REQUEST_FINANCE: 'requestFinance'
};

// Define the access keys for each form type
const FORM_ACCESS_KEYS = {
    [FORM_TYPES.TEST_DRIVE]: 'fc184b2a-7c0d-4071-a665-e807c3f4e679',
    [FORM_TYPES.PRICE_ALERT]: 'fc184b2a-7c0d-4071-a665-e807c3f4e679',
    [FORM_TYPES.CONTACT_US]: 'fc184b2a-7c0d-4071-a665-e807c3f4e679',
    [FORM_TYPES.REQUEST_FINANCE]: 'fc184b2a-7c0d-4071-a665-e807c3f4e679'
};

// Helper function to generate form fields based on form type
function getFormFields(formType, carId, financeDetails) {
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
        <div class="input-box">
            <input type="tel" id="phone" placeholder="Teléfono *" aria-required="true" maxlength="9" autocapitalize="none" autocorrect="off" name="phone" inputmode="numeric" pattern="[0-9]*" title="Por favor, ingresa un número de teléfono válido (solo números)" required>
            <span for="phone">Teléfono *</span>
        </div>
    `;

    const radioOptions = (name, options) => options.map(option => `
        <input type="radio" id="${option.id}" name="${name}" value="${option.value}" required${option.checked ? ' checked' : ''}>
        <label for="${option.id}" class="button-like">${option.label}</label>
    `).join('');

    const additionalFields = {
        [FORM_TYPES.TEST_DRIVE]: `
            ${baseFields}
            <div class="input-box">
                <label for="days" class="form-label">¿Qué día prefieres para la prueba?</label>
                <div class="form-options">
                    ${radioOptions('days', [
                        { id: 'weekday', value: 'Weekday', label: 'Días de semana' },
                        { id: 'weekend', value: 'Weekend', label: 'Fin de semana' },
                        { id: 'any-day', value: 'Any Day', label: 'Cualquier día', checked: true }
                    ])}
                </div>
            </div>
            <div class="input-box">
                <label for="time" class="form-label">¿Cuál es tu horario preferido?</label>
                <div class="form-options">
                    ${radioOptions('time', [
                        { id: 'morning', value: 'Morning', label: 'Por la mañana' },
                        { id: 'afternoon', value: 'Afternoon', label: 'Por la tarde' },
                        { id: 'any-time', value: 'Any Time', label: 'Cualquier hora', checked: true }
                    ])}
                </div>
            </div>
        `,
        [FORM_TYPES.PRICE_ALERT]: `
            ${baseFields}
            <div class="input-box">
                <label for="price-alert" class="form-label">¿Qué tipo de alerta prefieres?</label>
                <div class="form-options">
                    ${radioOptions('price-alert', [
                        { id: 'finance-drop', value: 'Finance Drop', label: 'Financiación' },
                        { id: 'cash-drop', value: 'Cash Drop', label: 'Al contado' },
                        { id: 'either', value: 'Either', label: 'Cualquier', checked: true }
                    ])}
                </div>
            </div>
        `,
        [FORM_TYPES.CONTACT_US]: `
            ${baseFields}
            <div class="input-box">
                <label id="char-count" for="message" class="form-label">Motivo del contacto (máx. 350 caracteres)</label>
                <textarea id="message" name="message" class="form-textarea" placeholder="Tu mensaje" rows="4" maxlength="350" required></textarea>
            </div>
        `,
        [FORM_TYPES.REQUEST_FINANCE]: `
            ${baseFields}
            <input type="hidden" id="finance-details" name="finance-details" class="form-input" value="${financeDetails}" />
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
    const radioGroups = Array.from(requiredInputs)
        .filter(input => input.type === 'radio')
        .map(input => input.name);

    const allInputsFilled = Array.from(requiredInputs).every(input => input.value.trim() !== '');
    const allRadioSelected = radioGroups.every(name => form.querySelector(`input[name="${name}"]:checked`));

    const submitButton = form.querySelector('.form-submit-button');
    if (submitButton) {
        submitButton.disabled = !(allInputsFilled && allRadioSelected);
    }
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

// Function to convert HTML to plain text
function htmlToPlainText(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
}

// Function to handle form submission
async function handleFormSubmission(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const formType = form.id.replace('Form', '');

    // Build the message based on form type
    const messageParts = [
        `Name: ${formData.get('name')}`,
        `Email: ${formData.get('email')}`,
        `Car ID: ${formData.get('car_id')}`,
        `Phone: ${formData.get('phone')}`
    ];

    if (formType === FORM_TYPES.PRICE_ALERT) {
        messageParts.push(`Preferred Price Alert: ${formData.get('price-alert')}`);
    }
    if (formType === FORM_TYPES.TEST_DRIVE) {
        messageParts.push(`Preferred Days: ${formData.get('days')}`);
        messageParts.push(`Preferred Time: ${formData.get('time')}`);
    }
    if (formType === FORM_TYPES.CONTACT_US) {
        messageParts.push(`Message: ${formData.get('message')}`);
    }
    if (formType === FORM_TYPES.REQUEST_FINANCE) {
        // Clean HTML content from finance details
        const financeDetailsHtml = formData.get('finance-details');
        const financeDetailsPlain = htmlToPlainText(financeDetailsHtml);
        messageParts.push(`Finance Details:\n${financeDetailsPlain}`);
        messageParts.push(`Aditional Comments: ${formData.get('finance-message')}`);
    }
    if (formData.get('ads_accept') === '1') {
        messageParts.push(`Please add this person to the subscription list at info@martinezdelugo.com`);
    }

    const data = {
        access_key: formData.get('access_key'),
        subject: formData.get('subject'),
        from_name: formData.get('from_name'),
        message: messageParts.join('\n')
    };

    const submitButton = form.querySelector('.form-submit-button');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        submitButton.style.backgroundColor = '#007bff'; // Change to your desired color for submitting state
    }

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
            if (submitButton) {
                submitButton.textContent = '¡Enviado!';
                submitButton.style.backgroundColor = '#28a745'; // Green color for success
            }
            setTimeout(() => document.getElementById('closeContactPopup')?.click(), 2000);
        } else {
            if (submitButton) {
                submitButton.textContent = `La presentación falló: ${json.message}`;
                submitButton.style.backgroundColor = '#dc3545'; // Red color for error
            }
            setTimeout(() => {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Enviar';
                    submitButton.style.backgroundColor = ''; // Reset to original color
                }
            }, 2000);
        }
    } catch (error) {
        console.error('Form submission error:', error); // Log the error
        if (submitButton) {
            submitButton.textContent = '¡Algo salió mal!';
            submitButton.style.backgroundColor = '#dc3545'; // Red color for error
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Enviar';
                submitButton.style.backgroundColor = ''; // Reset to original color
            }, 2000);
        }
    }
}

export function showContactForm(event, formType, carId = '', carReference = '', financePrice = '', cashPrice = '', financeDetails = '') {
    const formTitleMap = {
        [FORM_TYPES.TEST_DRIVE]: 'Solicita una prueba de conducción',
        [FORM_TYPES.PRICE_ALERT]: 'Alerta de Rebaja de Precio',
        [FORM_TYPES.CONTACT_US]: 'Contacto',
        [FORM_TYPES.REQUEST_FINANCE]: 'Solicitar Información de Financiación'
    };

    const formDescriptionMap = {
        [FORM_TYPES.TEST_DRIVE]: `Para solicitar una prueba de conducción del <strong>${carReference}</strong>, completa el formulario a continuación. Nuestro equipo revisará tu solicitud y se pondrá en contacto contigo para coordinar una cita. Ten en cuenta que esta solicitud no es vinculante y no te compromete a realizar una compra.`,
        [FORM_TYPES.PRICE_ALERT]: `Para recibir una notificación si el precio del <strong>${carReference}</strong> baja de <strong>${cashPrice}</strong> al contado o <strong>${financePrice}</strong> en financiación, completa el formulario a continuación. Puedes elegir recibir alertas si el precio baja en financiación, al contado, o en cualquiera de las dos opciones.`,
        [FORM_TYPES.CONTACT_US]: "Completa el formulario a continuación para comunicarte con nosotros. Agradecemos tus comentarios y te responderemos lo antes posible.",
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
                ${getFormFields(formType, carId, financeDetails)}
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
                    <button class="form-submit-button" type="submit" name="submit" disabled>
                        ${formType === FORM_TYPES.TEST_DRIVE ? 'Solicitar Prueba de Conducción' :
                        formType === FORM_TYPES.PRICE_ALERT ? 'Recibir Alerta de Precio' :
                        formType === FORM_TYPES.CONTACT_US ? 'Enviar Mensaje' :
                        formType === FORM_TYPES.REQUEST_FINANCE ? 'Solicitar Información de Financiación' :
                        'Enviar'}
                    </button>
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

