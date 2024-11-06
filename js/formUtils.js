// formUtils.js

const API_ENDPOINT = 'https://api.web3forms.com/submit';
const SUCCESS_MESSAGE = '¡Enviado!';
const ERROR_MESSAGE = '¡Algo salió mal!';
const BUTTON_SUBMIT_TEXT = 'Submitting...';
const BUTTON_RESET_TEXT = 'Enviar';
const ERROR_COLOR = '#f22f2f';
const SUCCESS_COLOR = '#0058a3';
const SUBMIT_COLOR = '#969696';

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
        const isFormValid = allInputsFilled && allRadioSelected;
        submitButton.disabled = !isFormValid;

        if (isFormValid) {
            submitButton.classList.add('btn'); // Add active class when enabled
        } else {
            submitButton.classList.remove('btn'); // Remove active class when disabled
        }
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

    // Check if the ads_accept checkbox is checked
    const adsAcceptCheckbox = formData.get('ads_accept');
    if (adsAcceptCheckbox) {
        data.message += '\n\n***NOTE***: Please add this email address to the list for offers and promotions.'; // Add promotional subscription message
    }
    
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

            // After successful submission, reset the form and remove 'input-has-content' class
            form.reset(); // Optional: reset the form after submission
            removeInputHasContentClass(form); // Remove 'input-has-content' class from all inputs

            // Disable the button after reset to return to initial state
            submitButton.classList.remove('btn'); // Remove the 'btn' class
            setButtonState(submitButton, true, BUTTON_RESET_TEXT, SUBMIT_COLOR); // Disable and reset the button
        } else {
            handleError(submitButton, `La presentación falló: ${json.message}`);
        }
    } catch (error) {
        console.error('Form submission error:', error);
        handleError(submitButton, ERROR_MESSAGE);
    }
}

// Function to remove the 'input-has-content' class from all inputs
function removeInputHasContentClass(form) {
    form.querySelectorAll('input, textarea, select').forEach(input => {
        input.classList.remove('input-has-content');
    });
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

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////// Reset Message need to be unique to form type           //////
////// or mak form disable complety to avoid multiple entries //////
////// would have to refresh page to sent again               //////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////