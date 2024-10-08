// dropdown.js

// Constants
const ICONS = {
    open: 'icons/ui/navigation/dropdown-open.svg',
    closed: 'icons/ui/navigation/dropdown-closed.svg'
};

/**
 * Sets up dropdown functionality by attaching click events to titles and handling toggle behavior.
 * @param {HTMLElement} dropdownContainer - The parent container of the dropdowns.
 */
function setupDropdowns(dropdownContainer) {
    const toggleDropdown = (title) => {
        const targetElement = document.getElementById(title.dataset.target);
        const isOpen = targetElement.classList.toggle('show');
        const img = title.querySelector('img');
        const classList = title.classList;

        // Update icon and background color
        img.src = isOpen ? ICONS.open : ICONS.closed;
        classList.toggle('bg-black', isOpen);
        classList.toggle('bg-light-grey', !isOpen);

        // Close other dropdowns within the same container
        dropdownContainer.querySelectorAll('.dropdown-content.show').forEach(content => {
            if (content !== targetElement) {
                content.classList.remove('show');
                const otherTitle = content.previousElementSibling;
                otherTitle.classList.replace('bg-black', 'bg-light-grey');
                otherTitle.querySelector('img').src = ICONS.closed;
            }
        });
    };

    // Attach click event listeners to all dropdown titles
    dropdownContainer.querySelectorAll('.dropdown-title').forEach(title => {
        title.addEventListener('click', () => toggleDropdown(title));
    });

    // Optionally open the first dropdown by default
    const firstDropdown = dropdownContainer.querySelector('.dropdown-content');
    if (firstDropdown) {
        const firstTitle = firstDropdown.previousElementSibling;
        firstDropdown.classList.add('show');
        firstTitle.querySelector('img').src = ICONS.open;
        firstTitle.classList.replace('bg-light-grey', 'bg-black'); // Apply bg-black here
    }
}

/**
 * Generates and inserts car sections (dropdowns) based on the current car data.
 * @param {HTMLElement} container - The container to insert the dropdowns into.
 * @param {Object} carData - The car equipment data object.
 * @param {Object} options - Options for customizing the function.
 * @param {string} options.title - The title for the dropdown container.
 * @param {string} options.dataKey - The key to access the data in carData.
 * @param {function} options.itemRenderer - A function to render each item in the dropdown.
 */
function insertDropdownSections(container, carData, { title, dataKey, itemRenderer }) {
    const sections = carData[dataKey] || {}; // Default to empty object if sections not found
    if (!container || !Object.keys(sections).length) return; // Simplified check

    const sectionKeys = Object.keys(sections); // Dynamically get all categories

    // Generate the inner HTML
    container.innerHTML = `
        <div class="container-title h2">${title}</div>
        ${sectionKeys.map((category, index) => `
            <div class="dropdown">
                <label class="dropdown-title rounded-container rounded-right bg-light-grey h3 italic" data-target="content-${dataKey}-${index}">
                    ${category}
                    <img src="${ICONS.closed}" alt="Dropdown Icon" class="dropdown-icon">
                </label>
                <div id="content-${dataKey}-${index}" class="dropdown-content ${dataKey}-dropdown-content">
                    ${itemRenderer(sections[category], carData.carId).join('')}
                </div>
            </div>
        `).join('')}
    `;

    // Initialize the dropdown interactions
    setupDropdowns(container);
}

/**
 * Renders the items for car specs.
 * @param {Array} [items=[]] - The items to render.
 * @returns {Array} - Rendered HTML for the items.
 */
function renderSpecsItems(items = []) {
    return items.map(item => `
        <li class="spec-item">
            <span class="spec-name">${item.name}:</span>
            <span class="spec-value">${item.value}</span>
        </li>
    `);
}

/**
 * Renders the items for car features.
 * @param {Array} [items=[]] - The items to render.
 * @param {string} carId - The car ID used in the image path.
 * @returns {Array} - Rendered HTML for the items.
 */
function renderFeatureItems(items = [], carId) {
    const baseImageUrl = `listings-nuevos/${carId}/images/features/`;

    return items.map(item => `
        <img id="featureImage" class="feature-image" alt="Feature Image" src="${baseImageUrl}${item.image}.webp">
        <span class="italic">${item.value}</span>
    `);
}

// Export functions
export { 
    insertDropdownSections, 
    renderSpecsItems,
    renderFeatureItems
};

