import { handleFormSubmission, addInputListeners, updateCharCount } from './formUtils.js'; // Importing the necessary functions

function initializeContactForm() {
    // Configuration for the contact form
    const contactFormConfig = {
        apiEndpoint: 'https://api.web3forms.com/submit',
        additionalData: (formData) => ({
            access_key: formData.get('access_key'),
            subject: formData.get('subject'),
            from_name: formData.get('from_name'),
        }),
        formatMessage: (formData) => `
        **Datos de contacto**
        - Nombre: ${formData.get('name')}
        - Correo electrónico: ${formData.get('email')}
        - Teléfono: ${formData.get('phone')}
        - Comentarios: ${formData.get('contact_us_comments')}
    `,
        successCallback: () => window.history.back(), // Change as needed
    };

    // Add event listeners to form submission
    const form = document.getElementById('contactUsForm');
    form.addEventListener('submit', (event) => handleFormSubmission(event, contactFormConfig));

    // Add input listeners to enable/disable the submit button
    addInputListeners(form);

    // Check if elements exist before adding event listeners for dynamic text updates
    const formTextarea = document.getElementById('contact_us_comments');
    const formCharCount = document.getElementById('contact_us_char_count');

    const charCountMessage = 'Motivo del contacto' // Custom message for character count

    if (formTextarea && formCharCount) {
        formTextarea.addEventListener('input', () => updateCharCount(formTextarea, formCharCount, 350, charCountMessage));
    }
}





function initializeSubscriptionForm() {
    // Configuration for the subscription form
    const subscriptionFormConfig = {
        apiEndpoint: 'https://api.web3forms.com/submit',
        additionalData: (formData) => ({
            access_key: formData.get('access_key'),
            subject: formData.get('subject'),
        }),
        formatMessage: (formData) => `**Suscripción a Newsletter**\n- Correo electrónico: ${formData.get('email')}`,
        successCallback: () => alert('¡Suscripción exitosa!'), // Change as needed
    };

    // Add event listeners to form submission
    const form = document.getElementById('subscribeNewsletterForm');
    form.addEventListener('submit', (event) => {
        // Prevent default submission
        event.preventDefault();

        // Check if the subscribe checkbox is checked
        const subscribeCheckbox = form.querySelector('input[name="ads_accept"]');
        if (!subscribeCheckbox.checked) {
            alert('You must agree to receive offers to subscribe.'); // Alert message
            return; // Prevent form submission
        }

        // Proceed with form submission
        handleFormSubmission(event, subscriptionFormConfig);
    });

    // Add input listeners to enable/disable the submit button
    addInputListeners(form);
}


export {
    initializeContactForm,


    initializeSubscriptionForm
}