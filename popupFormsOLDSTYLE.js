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
    [FORM_TYPES.REQUEST_FINANCE]: 'fc184b2a-7c0d-4071-a665-e807c3f4e679'  // Access key for the new form
}

// Function to check if all required fields in the form are filled out
function checkFormValidity(form) {
    const requiredInputs = form.querySelectorAll('input[required]');
    const requiredTextareas = form.querySelectorAll('textarea[required]');
    const radioGroups = form.querySelectorAll('input[type="radio"][required]');

    // Ensure all non-radio inputs have content
    const allInputsFilled = Array.from(requiredInputs).every(input => input.value.trim() !== '');
    
    // Ensure required textareas have content (if any)
    const allTextareasFilled = Array.from(requiredTextareas).every(textarea => textarea.value.trim() !== '');

    // Ensure each radio group has a selection
    const allRadioSelected = Array.from(radioGroups).reduce((acc, radio) => {
        if (acc.includes(radio.name)) return acc; // Skip if already checked
        const groupChecked = form.querySelector(`input[name="${radio.name}"]:checked`);
        return groupChecked ? [...acc, radio.name] : acc;
    }, []).length === new Set([...radioGroups].map(radio => radio.name)).size;

    // Update the submit button state
    const submitButton = form.querySelector('.form-submit-button');
    submitButton.disabled = !(allInputsFilled && allTextareasFilled && allRadioSelected);
}

// Function to check if an input field has content (result is to hide placeholder and replace with offset span above)
function checkInputHasContent(input) {
    if (input.value.trim() !== '') {
        input.classList.add('input-has-content');
    } else {
        input.classList.remove('input-has-content');
    }
}

// Event listener to monitor input changes and update input styles
function addInputListeners(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            // Check if input field has content
            checkInputHasContent(input);
            // Check form validity to enable/disable submit button
            checkFormValidity(form);
        });
        input.addEventListener('change', () => {
            // Check form validity to enable/disable submit button
            checkFormValidity(form);
        });
    });
}

export function showContactForm(event, formType, carId = '', carPrice = '', financeDetails = '') {
    const getContent = () => {
        let formTitle, formDescription, additionalFields = '', submitText;

        switch (formType) {
            case FORM_TYPES.TEST_DRIVE:
                formTitle = `Solicita una prueba de conducción`;
                formDescription = `Para solicitar una prueba de conducción del <strong>${carId}</strong>, completa el formulario a continuación. Nuestro equipo revisará tu solicitud y se pondrá en contacto contigo para coordinar una cita. Ten en cuenta que esta solicitud no es vinculante y no te compromete a realizar una compra.`;
                submitText = 'Probar vehículo';
                additionalFields = `
                    <div class="input-box">
                        <input type="tel" id="phone" placeholder="Teléfono *" aria-required="true" maxlength="30" autocapitalize="none" autocorrect="off" name="phone" requiredinputmode="numeric" pattern="[0-9]*"title="Please enter a valid phone number (numbers only)">
                        <span for="phone">Teléfono *</span>
                    </div>
                    <!-- other fields -->
                `;
                break;

            case FORM_TYPES.PRICE_ALERT:
                formTitle = `Alerta de Rebaja de Precio`;
                formDescription = `Rellena el formulario para recibir una notificación si el precio del <strong>${carId}</strong> baja de <strong>${carPrice}</strong>.`;
                submitText = `Notificarme`;
                additionalFields = `
                        <div class="input-box">
                            <input type="tel" id="phone" placeholder="Teléfono *" aria-required="true" maxlength="30" autocapitalize="none" autocorrect="off" name="phone" requiredinputmode="numeric" pattern="[0-9]*"title="Please enter a valid phone number (numbers only)">
                            <span for="phone">Teléfono *</span>
                        </div>
                    `;
                break;

            case FORM_TYPES.CONTACT_US:
                formTitle = 'Contacto';
                formDescription = "Completa el formulario a continuación para comunicarte con nosotros. Agradecemos tus comentarios y te responderemos lo antes posible.";
                submitText = 'Enviar';
                additionalFields = `
                        <div class="input-box">
                            <input type="tel" id="phone" placeholder="Teléfono *" aria-required="true" maxlength="30" autocapitalize="none" autocorrect="off" name="phone" requiredinputmode="numeric" pattern="[0-9]*"title="Please enter a valid phone number (numbers only)">
                            <span for="phone">Teléfono *</span>
                        </div>
                        <div class="input-box">
                            <label id="char-count" for="message" class="form-label">Motivo del contacto (máx. 350 caracteres)</label>
                            <textarea id="message" name="message" class="form-textarea" placeholder="Tu mensaje" rows="4" maxlength="350" required></textarea>
                        </div>
                    `;
                break;

            case FORM_TYPES.REQUEST_EMAIL:
                formTitle = `Request More Info - ${carId}`;
                formDescription = "Provide your name and email, and we'll send you more information about this car.";
                submitText = 'Request Info';
                additionalFields = `
                        <input type="hidden" id="message" name="message" class="form-input" value="I'm interested in more details about <strong>${carId}</strong>." />
                    `;
                break;

            case FORM_TYPES.REQUEST_FINANCE:
                formTitle = `Solicitar Información de Financiación`;
                formDescription = `${financeDetails}`;
                submitText = 'Solicitar Información de Financiación';
                additionalFields = `
                        <input type="hidden" id="message" name="message" class="form-input" value="${financeDetails}" />
                        <div class="input-box">
                            <input type="tel" id="phone" placeholder="Teléfono *" aria-required="true" maxlength="30" autocapitalize="none" autocorrect="off" name="phone" requiredinputmode="numeric" pattern="[0-9]*"title="Please enter a valid phone number (numbers only)">
                            <span for="phone">Teléfono *</span>
                        </div>
                        <div class="input-box">
                            <label id="finance-char-count" for="finance-message" class="form-label">Comentarios sobre la financiación (máx. 350 caracteres)</label>
                            <textarea id="finance-message" name="finance-message" class="form-textarea" placeholder="Tus comentarios" rows="4" maxlength="350"></textarea>
                        </div>
                    `;
                break;

            default:
                console.error('Unknown form type:', formType);
                return '';
        }

        return `
            ${createPopupHeader(`${formTitle}`, 'contact')}
            <section class="contact-section">
                <div class="contact-intro">
                    <p class="contact-description">${formDescription}</p>
                </div>

                <form id="${formType}Form">
                    <input type="hidden" name="access_key" value="${FORM_ACCESS_KEYS[formType]}" />
                    <input type="hidden" name="subject" value="${formTitle}" />
                    <input type="hidden" name="from_name" value="Car Dealership" />
                    ${carId ? `<input type="hidden" id="car_reference" name="car_reference" class="form-input" value="${carId}" />` : ''}
                    
                    <div class="input-box">
                      <input type="text" id="name" placeholder="Nombre *" aria-required="true" maxlength="30" autocapitalize="none" autocorrect="off" name="name" required>
                      <span for="name">Nombre *</span>
                    </div>

                    <div class="input-box">
                      <input type="email" id="email" placeholder="Correo electrónico *" aria-required="true" maxlength="30" autocapitalize="none" autocorrect="off" name="email" required>
                      <span for="email">Correo electrónico *</span>
                    </div>

                    ${additionalFields}

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
                      <button class="form-submit-button" type="submit" name="submit" disabled>${submitText}</button>
                    </span>
                </form>
            </section>
        `;
    };

    initializePopup('contactPopup', 'closeContactPopup', getContent, event);

    // Add event listeners to form submission
    const form = document.getElementById(`${formType}Form`);
    form.addEventListener('submit', handleFormSubmission);

    // Add input listeners to enable/disable the submit button
    addInputListeners(form);

    // Check if elements exist before adding event listeners
    const textarea = document.getElementById('message');
    const charCount = document.getElementById('char-count');

    if (textarea && charCount) {
        textarea.addEventListener('input', function () {
            const maxLength = 350;
            const remaining = maxLength - textarea.value.length;
            charCount.textContent = `Motivo del contacto (${remaining} caracteres restantes)`;
        });
    }

    const financeTextarea = document.getElementById('finance-message');
    const financeCharCount = document.getElementById('finance-char-count');

    if (financeTextarea && financeCharCount) {
        financeTextarea.addEventListener('input', function () {
            const maxLength = 350;
            const remaining = maxLength - financeTextarea.value.length;
            financeCharCount.textContent = `Comentarios sobre la financiación (${remaining} caracteres restantes)`;
        });
    }
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
        const preferredDay = formData.get('days'); // Get selected radio button value for days
        const preferredTime = formData.get('time'); // Get selected radio button value for time
        message += `\nPreferred Days: ${preferredDay}\nPreferred Time: ${preferredTime}`;
    }
    if (formType === FORM_TYPES.CONTACT_US || formType === FORM_TYPES.REQUEST_EMAIL) {
        message += `\nMessage: ${formData.get('message')}`;
    }
    if (formType === FORM_TYPES.REQUEST_FINANCE) {
        message += `\nFinance Details: ${formData.get('message')}`; // Including finance details in the message
    }

    // Check if the checkbox is checked and add a note if it is
    const adsAccept = formData.get('ads_accept');
    if (adsAccept === '1') {
        message += `\nPlease add this person to the subscription list at info@martinezdelugo.com`;
    }

    const data = {
        access_key: formData.get('access_key'),
        subject: formData.get('subject'),
        from_name: formData.get('from_name'),
        message: message
    };

    // Disable the submit button and update its text
    const submitButton = event.target.querySelector('.form-submit-button');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...'; // Update button text to indicate submission

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
            if (response.status === 200) {
                submitButton.textContent = '¡Enviado!'; // Success message in Spanish
                // Automatically close the popup after 2 seconds
                setTimeout(() => {
                    const closePopupButton = document.getElementById('closeContactPopup');
                    if (closePopupButton) {
                        closePopupButton.click();
                    }
                }, 2000); // Adjust the duration as needed
            } else {
                submitButton.textContent = `La presentación falló: ${json.message}`; // Failure message in Spanish
                // Re-enable the submit button
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Enviar'; // Reset button text in Spanish
                }, 3000); // Adjust the duration as needed
            }
        })
        .catch(error => {
            console.log(error);
            submitButton.textContent = '¡Algo salió mal!'; // Error message in Spanish
            // Re-enable the submit button
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Enviar'; // Reset button text in Spanish
            }, 3000); // Adjust the duration as needed
        });
}