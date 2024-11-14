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
        classList.toggle('bg-darkist', isOpen);
        classList.toggle('bg-dark', !isOpen);

        // Close other dropdowns within the same container
        dropdownContainer.querySelectorAll('.dropdown-content.show').forEach(content => {
            if (content !== targetElement) {
                content.classList.remove('show');
                const otherTitle = content.previousElementSibling;
                otherTitle.classList.replace('bg-darkist', 'bg-dark');
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
        firstTitle.classList.replace('bg-dark', 'bg-darkist'); // Apply bg-darkist here
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
        <div class="pb-sm h3">${title}</div>
        ${sectionKeys.map((category, index) => `
            <div class="dropdown pb-sm b2">
                <label class="dropdown-title btn-op flex rr-lg jc-between italic bg-dark ai-center" data-target="content-${dataKey}-${index}">
                    <span class="px-lg h4 txt-light">
                        ${category}
                    </span>
                    <img class="img-32 p-xsm" src="${ICONS.closed}" alt="Dropdown Icon" class="dropdown-icon">
                </label>
                <div id="content-${dataKey}-${index}" class="dropdown-content ${dataKey}-dropdown-content mr-md">
                    ${itemRenderer(sections[category], carData.carId).join('')}
                </div>
            </div>
        `).join('')}
    `;

    // Initialize the dropdown interactions
    setupDropdowns(container);
}   

function renderFeatureItems(items = [], carId) {
    const baseImageUrl = `listings-nuevos/${carId}/images/features/`;
    return items.map(item => `
        <img class="feature-image" alt="Feature Image" src="${baseImageUrl}${item.image}.webp">
        <div class="pblk-sm light italic">${item.value}</div>
    `);
}

function renderSpecsItems(items = []) {
    return items.map(item => `
        <li class="spec-item flex jc-between pblk-sm px-lg b-sdw">
            <span class="spec-name light">${item.name}:</span>
            <span class="spec-value">${item.value}</span>
        </li>
    `);
}
// Export functions
export { 
    insertDropdownSections, 
    renderSpecsItems,
    renderFeatureItems
};

