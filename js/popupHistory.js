// popupInformation.js

import { initializePopup, createPopupHeader } from './popupUtils.js';



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// MUST BE ADDED TO UTILS AND REPEATS REMOVED FROMOTHER POPUP FILES ///////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Returns contact information HTML with customizable phone number and address.
 * @param {string} [phone='982 21 74 03'] - The phone number to display in the contact info.
 * @param {string} [address='Estrada de A Coruna, 50, 27003 Lugo'] - The address to display in the contact info.
 * @returns {string} - The HTML string containing the contact information.
 */
function getContactInfo(phone = '982 21 74 03', address = 'Estrada de A Coruna, 50, 27003 Lugo') {
    return `
        <span class="b2 light">
            Si tiene alguna pregunta o desea más información, no dude en ponerse en contacto con nosotros a 
            través de uno de nuestros formularios de contacto, o llámenos directamente o visítenos en persona.
        </span><br>
        <br>
        <div class="b2">Teléfono: <span class="light">${phone}</span></div>
        <div class="b2">Dirección: <span class="light">${address}</span></div>
    `;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Shows the warranty details popup with specific warranty period information.
 * @param {Event} event - The event object from the event listener.
 * @param {number} guaranteePeriod - The warranty period of the car listing in months.
 */
function showWarrantyDetails(event, guaranteePeriod) {
    // Define the warranty periods
    const warrantyPeriods = { vip: 24, standard: 12 };

    // Generate the warranty message based on the guarantee period
    const warrantyMessage = guaranteePeriod === warrantyPeriods.vip
        ? `Tu coche incluye una garantía VIP de ${warrantyPeriods.vip} meses, asegurando protección completa y tranquilidad.`
        : `Ofrecemos una garantía estándar de ${warrantyPeriods.standard} meses, con la opción de mejorar a nuestra garantía VIP de ${warrantyPeriods.vip} meses por un coste adicional.`;

    // Define the content for the popup
    const getContent = () => `
        ${createPopupHeader('Garantía del Vehículo', 'information')}
        <div class="px-lg pblk-md">
            <span class="b2 light">Detalles completos de la garantía para tu tranquilidad y seguridad:</span>
            <span class="b2 light">${warrantyMessage}</span>
            <span class="b2 light">* La garantía está sujeta a disponibilidad y a los términos y condiciones aplicables.</span><br><br>
            ${getContactInfo()}
        </div>
    `;

    // Initialize the popup
    initializePopup('informationPopup', 'closeInformationPopup', getContent, event);
}



/**
 * Shows the warranty details popup for a given warranty type (battery or motor).
 * @param {Event} event - The event object from the event listener.
 * @param {number} warrantyPeriod - The warranty period in months (for battery or motor).
 * @param {string} warrantyType - The type of warranty ("batería" or "motor").
 */
function showManufacturerWarranty(event, warrantyPeriod, warrantyType) {
    // Determine the correct phrasing for "de la" or "del" based on the warrantyType
    const article = warrantyType === 'batería' ? 'de la' : 'del';

    // Define the warranty message
    const warrantyMessage = `El fabricante ofrece una garantía de ${warrantyPeriod} meses para ${article} ${warrantyType}, asegurando su buen funcionamiento y tu tranquilidad.`;

    // Popup content
    const getContent = () => `
        ${createPopupHeader(`Garantía ${article} ${warrantyType}`, 'information')}
        <div class="px-lg pblk-md">
            <span class="b2 light">${warrantyMessage}</span>
            <span class="b2 light">* La garantía está sujeta a disponibilidad y a los términos y condiciones aplicables.</span>
            ${getContactInfo()}
        </div>
    `;

    // Initialize the popup
    initializePopup('informationPopup', 'closeInformationPopup', getContent, event);
}



export {
    showWarrantyDetails,
    showManufacturerWarranty
};