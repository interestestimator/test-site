// Global variable to track the current index of reviews
let currentReviewIndex = 0;
let reviewsPerPage = 2; // Default value for mobile
let reviews = []; // Declare the reviews array globally
let averageRatingCache = null; // Cache for average rating

const MOBILE_THRESHOLD = 480;
const REVIEWS_PER_PAGE = {
    mobile: 2,
    tabletDesktop: 3 // Combined for tablet and desktop
};

/**
 * Initializes the Google Reviews section with total reviews and average rating.
 * @param {number} totalReviews - The total number of reviews.
 * @param {number} averageRating - The average rating calculated from the reviews.
 */
function initializeGoogleReviews(totalReviews, averageRating) {
    const googleReviewsContainer = document.getElementById('googleReviewsContainer');
    googleReviewsContainer.innerHTML = `
        <div>
            <img src="google-logo.svg" alt="Reseñas Google">
            <p>Reseñas de Google</p>
        </div>
        <div>
            <p>${averageRating.toFixed(1)}</p>
            <div class="rating-score">${generateRatingStars(averageRating, true)}</div>
        </div>
        <div class="d-flex justify-content-center">
            <p>Puntuación basada en ${totalReviews} reseñas</p>
        </div>
    `;
}

/**
 * Counts total reviews.
 * @returns {number} - The total number of reviews.
 */
const countTotalReviews = () => reviews.length;

/**
 * Calculates the average rating from reviews.
 * @returns {number} - The average rating value rounded to 1 decimal place.
 */
const calculateAverageRating = () => {
    if (averageRatingCache !== null) return averageRatingCache; // Return cached average if available
    const totalStars = reviews.reduce((sum, review) => sum + review.rating, 0);
    averageRatingCache = parseFloat((totalStars / countTotalReviews()).toFixed(1)); // Round to 1 decimal place
    return averageRatingCache;
};

/**
 * Fetches reviews from a JSON file and loads them into the carousel.
 */
async function fetchReviews() {
    try {
        const response = await fetch('data/reviews.json');
        if (!response.ok) throw new Error('Network response was not ok');

        reviews = await response.json(); // Assign fetched reviews to the global variable
        const totalReviews = countTotalReviews();
        const averageRating = calculateAverageRating();

        initializeGoogleReviews(totalReviews, averageRating);
        loadReviews(); // Load reviews for the first page
        updateReviewsPerPage(); // Set reviews per page based on initial load
        attachReviewEventListeners();
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}

/**
 * Generates star ratings as SVG for the given rating (decimal or whole number).
 * @param {number} rating - The rating value (can be a decimal between 1 and 5 for average ratings or a whole number for individual ratings).
 * @param {boolean} isDecimal - Indicates if the rating is a decimal (for average ratings).
 * @returns {string} - HTML string of SVG stars with correct filled amount.
 */
const generateRatingStars = (rating, isDecimal = false) => {
    return Array.from({ length: 5 }, (_, i) => {
        const fillPercent = isDecimal ? Math.max(0, Math.min(1, rating - i)) * 100 : (i < rating ? 100 : 0);
        return `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 23.44 19'>
                <polygon fill='#dadce0' points='10,15.27 16.18,19 14.54,11.97 20,7.24 12.81,6.63 10,0 7.19,6.63 0,7.24 5.46,11.97 3.82,19'/>
                <polygon fill='#fbbc04' points='10,15.27 16.18,19 14.54,11.97 20,7.24 12.81,6.63 10,0 7.19,6.63 0,7.24 5.46,11.97 3.82,19' style='clip-path: inset(0 ${100 - fillPercent}% 0 0);'/>
            </svg>
        `;
    }).join('');
};

/**
 * Loads reviews into the review carousel.
 */
function loadReviews() {
    const reviewWrapper = document.getElementById('reviewWrapper');
    const reviewsToDisplay = reviews.slice(currentReviewIndex, currentReviewIndex + reviewsPerPage);

    const fragment = document.createDocumentFragment();
    reviewsToDisplay.forEach(review => {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = "review-item";
        reviewDiv.innerHTML = `
            <div class="b1 font-bold uppercase">${review.name}</div>
            <div class="rating">${generateRatingStars(review.rating, false)}</div>
            <div class="b2 font-bold">${review.date}</div>
            <div class="b2 font-book">${review.text}</div>
        `;
        fragment.appendChild(reviewDiv);
    });

    reviewWrapper.innerHTML = ''; // Clear previous reviews
    reviewWrapper.appendChild(fragment); // Append new reviews all at once

    console.log('Loaded Reviews:', reviewsToDisplay); // Log loaded reviews
    updateButtonStates();
}

/**
 * Updates the visibility and state of the navigation buttons.
 */
function updateButtonStates() {
    const reviewPrevBtn = document.getElementById('reviewPrevBtn');
    const reviewNextBtn = document.getElementById('reviewNextBtn');

    reviewPrevBtn.classList.toggle('disabled', currentReviewIndex === 0);
    reviewNextBtn.classList.toggle('disabled', currentReviewIndex >= reviews.length - reviewsPerPage);
}

/**
 * Attaches event listeners to the navigation buttons.
 */
function attachReviewEventListeners() {
    const reviewNextBtn = document.getElementById('reviewNextBtn');
    const reviewPrevBtn = document.getElementById('reviewPrevBtn');

    reviewNextBtn?.addEventListener('click', () => navigateReviews('next'));
    reviewPrevBtn?.addEventListener('click', () => navigateReviews('prev'));
}

/**
 * Navigates through the reviews.
 * @param {string} direction - Direction to navigate (next or prev).
 */
function navigateReviews(direction) {
    const totalReviews = countTotalReviews();
    const canNavigateNext = direction === 'next' ? currentReviewIndex < totalReviews - reviewsPerPage : currentReviewIndex > 0;

    if (canNavigateNext) {
        currentReviewIndex += direction === 'next' ? 1 : -1;
        loadReviews();
        console.log(`Current Review Index: ${currentReviewIndex}`);
    }
}

/**
 * Adjusts the number of reviews per page based on window size.
 */
function updateReviewsPerPage() {
    const screenWidth = window.innerWidth; // Get the current screen width
    const newReviewsPerPage =
        screenWidth <= MOBILE_THRESHOLD ? REVIEWS_PER_PAGE.mobile :
        REVIEWS_PER_PAGE.tabletDesktop; // Mobile, Tablet, Desktop

    if (newReviewsPerPage !== reviewsPerPage) {
        reviewsPerPage = newReviewsPerPage; // Update reviews per page
        console.log(`Screen width: ${screenWidth}px - Setting to ${reviewsPerPage} reviews per page.`);
        loadReviews(); // Reload reviews to reflect new pagination
    }
}

/**
 * Debounce function to limit how often a function can fire.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The time to wait before executing the function.
 * @returns {Function} - A debounced version of the function.
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// Debounced version of updateReviewsPerPage
const debouncedUpdateReviewsPerPage = debounce(updateReviewsPerPage, 200);

// Event listener for window resize
window.addEventListener('resize', debouncedUpdateReviewsPerPage);

export { fetchReviews };



