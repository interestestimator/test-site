// popupForms.js

import { initializePopup, createPopupHeader } from './popupUtils.js';
import { addInputListeners, updateCharCount, handleFormSubmission } from './formUtils.js';

import { generateFinanceMessage } from './financeCalcUpdater.js';

// Define the form types and their associated access keys
const FORM_TYPES = {
    TEST_DRIVE: 'testDrive',
    PRICE_ALERT: 'priceAlert',
    REQUEST_FINANCE: 'requestFinance'
};

const COMMON_ACCESS_KEY = 'fc184b2a-7c0d-4071-a665-e807c3f4e679';
const FORM_ACCESS_KEYS = {
    [FORM_TYPES.TEST_DRIVE]: COMMON_ACCESS_KEY,
    [FORM_TYPES.PRICE_ALERT]: COMMON_ACCESS_KEY,
    [FORM_TYPES.REQUEST_FINANCE]: COMMON_ACCESS_KEY
};

// Define form titles and descriptions for easier access
const FORM_TITLE_MAP = {
    [FORM_TYPES.TEST_DRIVE]: 'Solicita una prueba de conducción',
    [FORM_TYPES.PRICE_ALERT]: 'Alerta de Rebaja de Precio',
    [FORM_TYPES.REQUEST_FINANCE]: 'Solicitar Información de Financiación'
};

const FORM_DESCRIPTION_MAP = {
    [FORM_TYPES.TEST_DRIVE]: carReference =>
        `Para solicitar una prueba de conducción del <strong>${carReference}</strong>, completa el formulario a continuación. Nuestro equipo revisará tu solicitud y se pondrá en contacto contigo para coordinar una cita. Ten en cuenta que esta solicitud no es vinculante y no te compromete a realizar una compra.`,
    [FORM_TYPES.PRICE_ALERT]: (carReference, cashPrice, financePrice) =>
        `Para recibir una notificación si el precio del <strong>${carReference}</strong> baja de <strong>${cashPrice}</strong> al contado o <strong>${financePrice}</strong> en financiación, completa el formulario a continuación. Puedes elegir recibir alertas si el precio baja en financiación, al contado, o en cualquiera de las dos opciones.`,
    [FORM_TYPES.REQUEST_FINANCE]: (carReference, cashPrice, financePrice, financeDetails) =>
        `Detalles de financiación: <strong>${financeDetails}</strong>. Para solicitar información adicional, completa el formulario a continuación.`
};

// Common input field creation logic
function createInputField(type, name, placeholder, required = false, extraAttributes = '') {
    return `
        <div class="input-box">
            <input type="${type}" id="${name}" placeholder="${placeholder}" ${required ? 'aria-required="true"' : ''} maxlength="30" autocapitalize="none" autocorrect="off" name="${name}" ${required ? 'required' : ''} ${extraAttributes}>
            <span for="${name}">${placeholder}</span>
        </div>
    `;
}

// Common radio field creation logic
function createRadioField(name, label, options) {
    return `
        <div class="input-box">
            <label class="form-label">${label}</label>
            <div class="form-options">
                ${options.map(option => `
                    <input type="radio" id="${option.id}" name="${name}" value="${option.value}" required${option.checked ? ' checked' : ''}>
                    <label for="${option.id}" class="button-like">${option.label}</label>
                `).join('')}
            </div>
        </div>
    `;
}

// Helper function to generate form fields based on form type
function getFormFields(formType, carId, financeDetails) {
    const baseFields = `
        <input type="hidden" id="car_id" name="car_id" value="${carId}" />
        ${createInputField('text', 'name', 'Nombre *', true)}
        ${createInputField('email', 'email', 'Correo electrónico *', true)}
        ${createInputField('tel', 'phone', 'Teléfono *', true, 'pattern="[0-9]*" title="Por favor, ingresa un número de teléfono válido (solo números)"')}
    `;

    const additionalFields = {
        [FORM_TYPES.TEST_DRIVE]: `
            ${baseFields}
            ${createRadioField('days', '¿Qué día prefieres para la prueba?', [
            { id: 'weekday', value: 'Weekday', label: 'Días de semana' },
            { id: 'weekend', value: 'Weekend', label: 'Fin de semana' },
            { id: 'any-day', value: 'Any Day', label: 'Cualquier día', checked: true }
        ])}
            ${createRadioField('time', '¿Cuál es tu horario preferido?', [
            { id: 'morning', value: 'Morning', label: 'Por la mañana' },
            { id: 'afternoon', value: 'Afternoon', label: 'Por la tarde' },
            { id: 'any-time', value: 'Any Time', label: 'Cualquier hora', checked: true }
        ])}
        `,
        [FORM_TYPES.PRICE_ALERT]: `
            ${baseFields}
            ${createRadioField('price-alert', '¿Qué tipo de alerta prefieres?', [
            { id: 'finance-drop', value: 'Finance Drop', label: 'Financiación' },
            { id: 'cash-drop', value: 'Cash Drop', label: 'Al contado' },
            { id: 'either', value: 'Either', label: 'Cualquier', checked: true }
        ])}
        `,
        [FORM_TYPES.REQUEST_FINANCE]: `
            ${baseFields}
            <input type="hidden" id="finance-details" name="finance-details" class="form-input" value="${financeDetails}" />
            <div class="input-box">
                <label id="finance_char_count" for="finance_comments" class="form-label">Comentarios sobre la financiación (máx. 350 caracteres)</label>
                <textarea id="finance_comments" name="finance_comments" class="form-textarea" placeholder="Tus comentarios" rows="4" maxlength="350"></textarea>
            </div>
        `
    };

    return additionalFields[formType] || '';
}

// Function to convert HTML to plain text
function htmlToPlainText(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
}

// Main function to show the contact form
function showContactForm(event, formType, carId = '', carReference = '', financePrice = '', cashPrice = '', financeDetails = '') {
    const formTitle = FORM_TITLE_MAP[formType] || 'Formulario';

    // Pass financeDetails to the description map
    const formDescription = FORM_DESCRIPTION_MAP[formType]
        ? FORM_DESCRIPTION_MAP[formType](carReference, cashPrice, financePrice, financeDetails) || ''
        : '';

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
                ${createPrivacyPolicyCheckbox()}
                <span class="button-box">
                    <button class="form-submit-button" type="submit" name="submit" disabled>
                        ${getSubmitButtonText(formType)}
                    </button>
                </span>
            </form>
        </section>
    `;

    initializePopup('contactPopup', 'closeContactPopup', getContent, event);

    const FORM_CONFIGS = createFormConfigs();

    // Add event listeners to form submission
    const form = document.getElementById(`${formType}Form`);
    form.addEventListener('submit', (event) => handleFormSubmission(event, FORM_CONFIGS[formType]));

    // Add input listeners to enable/disable the submit button
    addInputListeners(form);

    // Add event listener for character count in the finance comments textarea
    addCharCountListener();
}

// Helper function to create the privacy policy checkbox
function createPrivacyPolicyCheckbox() {
    return `
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
    `;
}

// Helper function to get the submit button text based on form type
function getSubmitButtonText(formType) {
    const buttonTextMap = {
        [FORM_TYPES.TEST_DRIVE]: 'Solicitar Prueba de Conducción',
        [FORM_TYPES.PRICE_ALERT]: 'Recibir Alerta de Precio',
        [FORM_TYPES.REQUEST_FINANCE]: 'Solicitar Información de Financiación'
    };
    return buttonTextMap[formType] || 'Enviar';
}

// Helper function to create form configs
function createFormConfigs() {
    const commonConfig = {
        apiEndpoint: 'https://api.web3forms.com/submit', // Can be changed if needed
        additionalData: (formData) => ({
            access_key: formData.get('access_key'),
            subject: formData.get('subject'),
            from_name: formData.get('from_name'),
        }),
        successCallback: () => {
            document.getElementById('closeContactPopup')?.click();
        }
    };

    return {
        [FORM_TYPES.TEST_DRIVE]: {
            ...commonConfig,
            formatMessage: formData => formatMessage(formData, [
                'name',
                'email',
                'car_id',
                'phone',
                'days',
                'time'
            ])
        },
        [FORM_TYPES.PRICE_ALERT]: {
            ...commonConfig,
            formatMessage: formData => formatMessage(formData, [
                'name',
                'email',
                'car_id',
                'phone',
                'price-alert'
            ])
        },
        [FORM_TYPES.REQUEST_FINANCE]: {
            ...commonConfig,
            formatMessage: formData => formatFinanceMessage(formData)
        }
    };
}

// Helper function to format messages for each form type
function formatMessage(formData, fields) {
    return fields.map(field => `${field.charAt(0).toUpperCase() + field.slice(1)}: ${formData.get(field)}`).join('\n');
}

function formatFinanceMessage(formData) {
    const financeDetailsHtml = formData.get('finance-details');
    const financeDetailsPlain = htmlToPlainText(financeDetailsHtml);
    return [
        `Name: ${formData.get('name')}`,
        `Email: ${formData.get('email')}`,
        `Car ID: ${formData.get('car_id')}`,
        `Phone: ${formData.get('phone')}`,
        `Finance Details:\n${financeDetailsPlain}`,
        `Additional Comments: ${formData.get('finance_comments')}`
    ].join('\n');
}

// Function to add character count listener for finance comments
function addCharCountListener() {
    const formTextarea = document.getElementById('finance_comments');
    const formCharCount = document.getElementById('finance_char_count');
    const charCountMessage = 'Comentarios sobre la financiación'; // Custom message for character count

    if (formTextarea && formCharCount) {
        formTextarea.addEventListener('input', () => updateCharCount(formTextarea, formCharCount, 350, charCountMessage));
    }
}


/**
 * Sets up event listeners for various buttons.
 * @param {string} carReference - The car reference string.
 * @param {Object} currentCarData - The current car data object.
 */
function setupButtonEventListener(carReference, currentCarData) {
    const priceAlertBtn = document.getElementById('priceAlertBtn');
    const testDriveBtn = document.getElementById('testDriveBtn');
    const requestFinanceBtn = document.getElementById('requestFinanceBtn');

    const { carId, financePrice, price } = currentCarData;

    // Add event listener if the button exists
    if (priceAlertBtn) {
        priceAlertBtn.addEventListener('click', (event) => {
            console.log('Price alert form button clicked:');
            showContactForm(event, FORM_TYPES.PRICE_ALERT, carId, carReference, financePrice, price);
        });
    }

    // Add event listener if the button exists
    if (testDriveBtn) {
        testDriveBtn.addEventListener('click', (event) => {
            console.log('Test drive form button clicked:');
            showContactForm(event, FORM_TYPES.TEST_DRIVE, carId, carReference);
        });
    }

    // Add event listener if the button exists  ////////////////////////// IMPROVE FINANCE MESSAGE ///////////////////////////
    if (requestFinanceBtn) {
        requestFinanceBtn.addEventListener('click', (event) => {
            console.log('Request finance form button clicked:');
            showContactForm(event, FORM_TYPES.REQUEST_FINANCE, carId, carReference, '', '', generateFinanceMessage(carReference, financePrice));
        });
    }
}

export {
    setupButtonEventListener
}