// header.js

// Function to initialize header-related functionality
export function initializeHeader() {
    document.querySelector('.menu-toggle').addEventListener('click', () => {
        const navList = document.getElementById('navList');
        navList.classList.toggle('active');
    });
}

// Function to initialize banner functionality
export function initializeBanner() {
    let currentMessageIndex = 0;
    const container = document.querySelector('.message-container');
    const messages = document.querySelectorAll('.message1');
    const totalMessages = messages.length;

    function showNext() {
        currentMessageIndex = (currentMessageIndex + 1) % totalMessages;
        const newTranslateX = -(currentMessageIndex * 100);
        container.style.transform = `translateX(${newTranslateX}%)`;

        messages.forEach((message, index) => {
            message.setAttribute('aria-hidden', index !== currentMessageIndex);
        });
    }

    setInterval(showNext, 5000);
}