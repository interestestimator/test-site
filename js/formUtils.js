// formUtils.js

const API_ENDPOINT = 'https://api.web3forms.com/submit';
const SUCCESS_MESSAGE = '¡Enviado!';
const ERROR_MESSAGE = '¡Algo salió mal!';
const BUTTON_SUBMIT_TEXT = 'Submitting...';
const BUTTON_RESET_TEXT = 'Enviar';
const ERROR_COLOR = '#dc3545';
const SUCCESS_COLOR = '#28a745';
const SUBMIT_COLOR = '#007bff';

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

// Function to update character count
function updateCharCount(textarea, charCountElement, maxLength, customMessage) {
    const remaining = maxLength - textarea.value.length;
    charCountElement.textContent = `${customMessage} (${remaining} caracteres restantes)`;
}

// Generalized form submission handler
async function handleFormSubmission(event, config) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    // Prepare the data to send using config settings
    const data = {
        ...config.additionalData(formData), // Spread additional data
        message: config.formatMessage(formData), // Format the message based on form data
    };

    const submitButton = form.querySelector('.form-submit-button');
    setButtonState(submitButton, true, BUTTON_SUBMIT_TEXT, SUBMIT_COLOR); // Disable and change text

    try {
        const response = await fetch(config.apiEndpoint || API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const json = await response.json();
        if (response.ok) {
            setButtonState(submitButton, false, SUCCESS_MESSAGE, SUCCESS_COLOR); // Success
            setTimeout(config.successCallback, 2000); // Call the success callback
            form.reset(); // Optional: reset the form after submission
        } else {
            handleError(submitButton, `La presentación falló: ${json.message}`);
        }
    } catch (error) {
        console.error('Form submission error:', error);
        handleError(submitButton, ERROR_MESSAGE);
    }
}

// Helper function to handle errors
function handleError(submitButton, message) {
    setButtonState(submitButton, false, message, ERROR_COLOR); // Display error
}

// Helper function to manage button state
function setButtonState(button, isDisabled, text, backgroundColor) {
    if (button) {
        button.disabled = isDisabled;
        button.textContent = text;
        button.style.backgroundColor = backgroundColor; // Set button color
        if (!isDisabled) {
            setTimeout(() => {
                button.textContent = BUTTON_RESET_TEXT; // Reset text
                button.style.backgroundColor = ''; // Reset to original color
            }, 2000);
        }
    }
}

export {
    handleFormSubmission, 
    addInputListeners, 
    updateCharCount
};