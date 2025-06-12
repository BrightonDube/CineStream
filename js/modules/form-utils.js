/**
 * Sanitizes a string input by removing potentially harmful characters.
 * @param {string} input - The input string to sanitize.
 * @returns {string} The sanitized string.
 */
function sanitizeString(input) {
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove inline event handlers
        .replace(/[&]/g, '&amp;') // Encode ampersands
        .replace(/["]/g, '&quot;') // Encode quotes
        .replace(/[']/g, '&#x27;'); // Encode single quotes
}

/**
 * Validates an email address.
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

/**
 * Validates a year input.
 * @param {string} year - The year to validate.
 * @returns {boolean} True if the year is valid, false otherwise.
 */
function isValidYear(year) {
    if (!year) return true; // Empty year is valid (optional)
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(year, 10);
    return !isNaN(yearNum) && yearNum >= 1888 && yearNum <= currentYear;
}

/**
 * Validates the search form data.
 * @param {Object} data - The form data object.
 * @returns {Object} Object containing validation result and any error messages.
 */
function validateSearchForm(data) {
    const errors = [];
    const sanitizedData = {};

    // Sanitize and validate search term
    const searchTerm = sanitizeString(data.searchTerm);
    if (!searchTerm) {
        errors.push('Please enter a search term');
    } else if (searchTerm.length < 2) {
        errors.push('Search term must be at least 2 characters long');
    }
    sanitizedData.searchTerm = searchTerm;

    // Sanitize and validate type
    const type = sanitizeString(data.type);
    if (type && !['movie', 'series', 'episode'].includes(type)) {
        errors.push('Invalid type selected');
    }
    sanitizedData.type = type;

    // Sanitize and validate year
    const year = sanitizeString(data.year);
    if (year && !isValidYear(year)) {
        errors.push('Please enter a valid year between 1888 and current year');
    }
    sanitizedData.year = year;

    return {
        isValid: errors.length === 0,
        errors,
        data: sanitizedData
    };
}

/**
 * Validates the contact form data.
 * @param {Object} data - The form data object.
 * @returns {Object} Object containing validation result and any error messages.
 */
function validateContactForm(data) {
    const errors = [];
    const sanitizedData = {};

    // Sanitize and validate name
    const name = sanitizeString(data.name);
    if (!name) {
        errors.push('Please enter your name');
    } else if (name.length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    sanitizedData.name = name;

    // Sanitize and validate email
    const email = sanitizeString(data.email);
    if (!email) {
        errors.push('Please enter your email address');
    } else if (!isValidEmail(email)) {
        errors.push('Please enter a valid email address');
    }
    sanitizedData.email = email;

    // Sanitize and validate subject
    const subject = sanitizeString(data.subject);
    if (!subject) {
        errors.push('Please enter a subject');
    } else if (subject.length < 3) {
        errors.push('Subject must be at least 3 characters long');
    }
    sanitizedData.subject = subject;

    // Sanitize and validate message
    const message = sanitizeString(data.message);
    if (!message) {
        errors.push('Please enter a message');
    } else if (message.length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    sanitizedData.message = message;

    return {
        isValid: errors.length === 0,
        errors,
        data: sanitizedData
    };
}

export {
    sanitizeString,
    isValidEmail,
    isValidYear,
    validateSearchForm,
    validateContactForm
}; 