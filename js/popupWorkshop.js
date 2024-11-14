import { initializePopup, createPopupHeader } from './popupUtils.js';

// Function to generate a booking button with a default link
function createBookingButton(bookingLink = "https://cita-taller.peugeot.es/es-ES/cita-taller-peugeot/spain/martinez-de-lugo/0000035040") {
    return `
        <div class="pt-sm" style="width: 33%; margin-left: auto;">
            <a href="${bookingLink}" target="_blank" rel="noopener noreferrer" id="acknowledgeButton" class="btn-op round-xlg p-sm bg-accent center txt-light b1" style="display: block; text-decoration: none;">
                Solicita una cita
            </a>
        </div>
    `;
}


// Function to create a list from an array of items
function createListItems(items) {
    return items.map(item => `<li>${item}</li>`).join('');
}

// Generic function to create popup content
function createPopupContent(title, introText, items = [], extraText = '', includeBookingButton = true) {
    const listSection = items.length > 0 ? `<ul class="px-md">${createListItems(items)}</ul>` : '';
    const bookingButton = includeBookingButton ? createBookingButton() : '';

    return `
        ${createPopupHeader(title, 'workshopItem')}
        <div class="px-lg pblk-md b2 light">
            <div>${introText}</div>
            ${listSection}
            ${extraText}
            ${bookingButton}
        </div>
    `;
}

// Specific popup functions using the generic popup creator
function showManufacturerReview(event) {
    const items = [
        "Cambio de aceite con un aceite adaptado a las especificidades de tu motor",
        "Sustitución del filtro de aceite",
        "Reposición de líquidos",
        "Comprobaciones y ajustes (funcionamiento, estado y estanqueidad), especialmente de los dispositivos de seguridad",
        "Lectura de la memoria de autodiagnóstico",
        "Piezas y mano de obra incluidas",
        "+ 15 comprobaciones por parte de los expertos Peugeot*"
    ];
    const introText = "La revisión del fabricante garantiza la aplicación de todos nuestros conocimientos y tecnología en el mantenimiento y la modernización de tu Peugeot. Te recomendamos que realices la revisión del fabricante anualmente.";
    const extraText = "<div>* La inspección visual de tu vehículo no es una revisión técnica obligatoria y no detecta defectos ocultos.</div>";

    initializePopup('workshopItemPopup', 'closeWorkshopItemPopup', () => createPopupContent('Revisión Del Fabricante', introText, items, extraText), event);
}

function showOilChange(event) {
    const introText = "Asegura la durabilidad de tu motor. El cambio de aceite elimina todas las impurezas del aceite de su motor. Te asegura un aceite que cumple las normas Peugeot adaptadas a tu motorización, así como el cambio del filtro de aceite. Se recomienda realizar este servicio anualmente para garantizar la integridad y el rendimiento de tu motor + 15 controles visuales*.";
    const extraText = "<br><div>* La inspección visual de tu vehículo no es una revisión técnica obligatoria y no detecta defectos ocultos. Lista de controles disponibles en tu punto de venta autorizado.</div>";

    initializePopup('workshopItemPopup', 'closeWorkshopItemPopup', () => createPopupContent('Cambio de Aceite', introText, [], extraText), event);
}

function showBrakes(event) {
    const items = [
        "Una revisión de frenos para el control de los elementos esenciales (tambores, pastillas, discos y pinzas) para tu seguridad",
        "Un Forfait frenado, precios todo incluido (piezas y mano de obra) de sustitución de distintos elementos, si el desgaste de las piezas lo requiere, que te garantice un sistema de frenado eficaz."
    ];
    const introText = "Poder confiar en los frenos no es un lujo. Viaja con seguridad y reduce el riesgo de accidentes haciendo que tu sistema de frenado sea revisado regularmente en nuestro Servicio. Los técnicos de Peugeot Service comprueban y sustituyen, si es necesario, las piezas defectuosas o dañadas de tu sistema de frenado.";
    const extraText = "<div><strong>Podrás elegir entre:</strong></div><div>* La inspección visual de tu vehículo no es una revisión técnica obligatoria y no detecta defectos ocultos. Lista de controles disponibles en tu punto de venta autorizado.</div>";

    initializePopup('workshopItemPopup', 'closeWorkshopItemPopup', () => createPopupContent('Revisión de Frenos', introText, items, extraText), event);
}






export {
    showManufacturerReview,
    showOilChange,
    showBrakes
}