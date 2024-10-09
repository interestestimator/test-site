// pageSetup.js

import { getPrimaryDOMElements } from './siteSetup.js';
import { loadHtml } from './httpUtils.js';

// Function to initialize header-related functionality
function initializeHeader() {
    const toggleMenu = () => {
        document.getElementById('navList').classList.toggle('active');
    };

    document.querySelector('.menu-toggle').addEventListener('click', toggleMenu);
}

// Function to initialize banner functionality
function initializeBanner() {
    const container = document.querySelector('.message-container');
    const messages = document.querySelectorAll('.message1');
    let currentMessageIndex = 0;

    const showNext = () => {
        currentMessageIndex = (currentMessageIndex + 1) % messages.length;
        const newTranslateX = -currentMessageIndex * 100;
        container.style.transform = `translateX(${newTranslateX}%)`;

        messages.forEach((message, index) => {
            message.setAttribute('aria-hidden', index !== currentMessageIndex);
        });
    };

    setInterval(showNext, 5000);
}

/**
 * Loads header and footer HTML content into specified DOM elements and initializes them.
 */
async function loadHeaderAndFooter() {
    const primaryElements = getPrimaryDOMElements();

    try {
        // Load HTML content for the header and footer in parallel
        await Promise.all([
            loadHtml(primaryElements.headerContact, 'header-contact.html'),
            loadHtml(primaryElements.headerMain, 'header.html'),
            loadHtml(primaryElements.headerBanner, 'header-banner.html'),
            loadHtml(primaryElements.footer, 'footer.html')
        ]);

        // Initialize components after loading
        initializeHeader();
        initializeBanner();
    } catch (error) {
        console.error("Error loading header and footer:", error);
        // Optionally, handle errors by displaying a message or fallback content
    }
}

// Export functions
export { loadHeaderAndFooter };