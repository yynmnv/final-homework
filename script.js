// ========================================
// GA4 EVENT TRACKING
// ========================================

/**
 * Send event to Google Analytics 4
 * @param {string} eventName - The name of the event
 * @param {object} parameters - Additional event parameters
 */
function trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    } else {
        console.log('GA4 Event:', eventName, parameters);
    }
}

// ========================================
// HAMBURGER MENU FUNCTIONALITY
// ========================================

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const element = document.querySelector(href);
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// BACK TO TOP BUTTON
// ========================================

const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// FAQ ACCORDION
// ========================================

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // Close other open items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current item
        item.classList.toggle('active');
        
        // Track FAQ click
        trackEvent('faq_click', {
            'faq_question': question.textContent.trim()
        });
    });
});

// ========================================
// FORM VALIDATION & SUBMISSION
// ========================================

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9\-\+\(\)\s]{10,}$/;

/**
 * Validate form fields
 */
function validateForm() {
    let isValid = true;
    
    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(msg => msg.textContent = '');
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.classList.remove('error');
    });

    // Validate Name
    const name = document.getElementById('name');
    if (!name.value.trim()) {
        showError('nameError', '請輸入姓名');
        name.classList.add('error');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        showError('nameError', '姓名至少需要 2 個字');
        name.classList.add('error');
        isValid = false;
    }

    // Validate Email
    const email = document.getElementById('email');
    if (!email.value.trim()) {
        showError('emailError', '請輸入電子郵件');
        email.classList.add('error');
        isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
        showError('emailError', '請輸入有效的電子郵件格式');
        email.classList.add('error');
        isValid = false;
    }

    // Validate Phone
    const phone = document.getElementById('phone');
    if (!phone.value.trim()) {
        showError('phoneError', '請輸入電話號碼');
        phone.classList.add('error');
        isValid = false;
    } else if (!phoneRegex.test(phone.value.trim())) {
        showError('phoneError', '請輸入有效的電話格式');
        phone.classList.add('error');
        isValid = false;
    }

    // Validate Address
    const address = document.getElementById('address');
    if (!address.value.trim()) {
        showError('addressError', '請輸入完整地址');
        address.classList.add('error');
        isValid = false;
    } else if (address.value.trim().length < 5) {
        showError('addressError', '地址至少需要 5 個字');
        address.classList.add('error');
        isValid = false;
    }

    // Validate Product
    const product = document.getElementById('product');
    if (!product.value) {
        showError('productError', '請選擇商品');
        product.classList.add('error');
        isValid = false;
    }

    // Validate Quantity
    const quantity = document.getElementById('quantity');
    if (!quantity.value || quantity.value < 1) {
        showError('quantityError', '請輸入有效的數量');
        quantity.classList.add('error');
        isValid = false;
    }

    // Validate Privacy Agreement
    const privacy = document.getElementById('privacy');
    if (!privacy.checked) {
        showError('privacyError', '請同意隱私政策和服務條款');
        isValid = false;
    }

    return isValid;
}

/**
 * Display error message
 */
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

/**
 * Handle form submission
 */
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        trackEvent('form_submission_error', {
            'error_type': 'validation_failed'
        });
        return;
    }

    // Collect form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        product: document.getElementById('product').value,
        quantity: document.getElementById('quantity').value,
        message: document.getElementById('message').value.trim(),
        newsletter: document.getElementById('newsletter').checked,
        timestamp: new Date().toISOString()
    };

    // Track form submission
    trackEvent('form_submit', {
        'product_selected': formData.product,
        'quantity': formData.quantity,
        'newsletter_opt_in': formData.newsletter
    });

    // Simulate form submission (in production, send to server)
    console.log('Form Data:', formData);

    // Show success message
    contactForm.style.display = 'none';
    formSuccess.style.display = 'block';

    // Reset form for next attempt
    contactForm.reset();
    document.getElementById('newsletter').checked = false;

    // Scroll to success message
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Optional: Reset form display after 5 seconds
    setTimeout(() => {
        contactForm.style.display = 'block';
        formSuccess.style.display = 'none';
    }, 5000);
});

// ========================================
// PRODUCT SELECTION TRACKING
// ========================================

document.querySelectorAll('[data-product]').forEach(button => {
    button.addEventListener('click', (e) => {
        const productId = e.target.getAttribute('data-product');
        const eventName = e.target.getAttribute('data-event') || 'button_click';
        
        trackEvent(eventName, {
            'product_id': productId,
            'button_text': e.target.textContent
        });

        // If not a form submit button, scroll to contact form
        if (!e.target.classList.contains('submit-btn')) {
            setTimeout(() => {
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    });
});

// ========================================
// CTA BUTTON TRACKING
// ========================================

document.querySelectorAll('[data-event]').forEach(element => {
    if (!element.hasAttribute('data-product')) {
        element.addEventListener('click', (e) => {
            const eventName = e.target.getAttribute('data-event');
            
            trackEvent(eventName, {
                'button_text': e.target.textContent,
                'button_class': e.target.className
            });
        });
    }
});

// ========================================
// SCROLL TRACKING (Optional)
// ========================================

const scrollTracked = {};

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionId = section.id;
        const rect = section.getBoundingClientRect();
        
        // Track when section comes into view
        if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= 0) {
            if (!scrollTracked[sectionId]) {
                scrollTracked[sectionId] = true;
                trackEvent('section_view', {
                    'section_name': sectionId
                });
            }
        }
    });
});

// ========================================
// LAZY LOADING FOR IMAGES (Optional Enhancement)
// ========================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img').forEach(img => imageObserver.observe(img));
}

// ========================================
// FORM INPUT VALIDATION (Real-time)
// ========================================

// Email validation
document.getElementById('email').addEventListener('blur', function() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.value && !emailRegex.test(this.value)) {
        this.classList.add('error');
        document.getElementById('emailError').textContent = '請輸入有效的電子郵件格式';
    } else {
        this.classList.remove('error');
        document.getElementById('emailError').textContent = '';
    }
});

// Phone validation
document.getElementById('phone').addEventListener('blur', function() {
    const phoneRegex = /^[0-9\-\+\(\)\s]{10,}$/;
    if (this.value && !phoneRegex.test(this.value)) {
        this.classList.add('error');
        document.getElementById('phoneError').textContent = '請輸入有效的電話格式';
    } else {
        this.classList.remove('error');
        document.getElementById('phoneError').textContent = '';
    }
});

// Name validation
document.getElementById('name').addEventListener('blur', function() {
    if (this.value && this.value.trim().length < 2) {
        this.classList.add('error');
        document.getElementById('nameError').textContent = '姓名至少需要 2 個字';
    } else {
        this.classList.remove('error');
        document.getElementById('nameError').textContent = '';
    }
});

// ========================================
// SCROLL TO TOP ANIMATION
// ========================================

// Add smooth behavior to all internal links
document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ========================================
// PAGE VISIBILITY TRACKING
// ========================================

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        trackEvent('page_hidden');
    } else {
        trackEvent('page_visible');
    }
});

// ========================================
// WINDOW UNLOAD TRACKING
// ========================================

window.addEventListener('beforeunload', () => {
    trackEvent('page_exit');
});

// ========================================
// INITIALIZATION
// ========================================

console.log('Dahu Strawberry Website - All scripts loaded successfully');

// Log initial page view (GA4 does this automatically, but you can add custom logic)
trackEvent('page_view', {
    'page_title': document.title,
    'page_location': window.location.href
});

// Track time on page
let timeOnPage = 0;
setInterval(() => {
    timeOnPage += 10;
    if (timeOnPage % 60000 === 0) {  // Every minute
        trackEvent('engagement', {
            'time_on_page_seconds': timeOnPage / 1000
        });
    }
}, 10000);

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

// Skip to main content link
const skipLink = document.createElement('a');
skipLink.href = '#hero';
skipLink.textContent = 'Skip to main content';
skipLink.className = 'skip-link';
skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: #e91e63;
    color: white;
    padding: 8px 16px;
    text-decoration: none;
    z-index: 100;
`;

skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
});

skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
});

document.body.insertBefore(skipLink, document.body.firstChild);

// Add ARIA labels to form fields
document.getElementById('name').setAttribute('aria-label', '姓名');
document.getElementById('email').setAttribute('aria-label', '電子郵件');
document.getElementById('phone').setAttribute('aria-label', '電話號碼');
document.getElementById('address').setAttribute('aria-label', '收貨地址');
document.getElementById('product').setAttribute('aria-label', '感興趣的商品');
document.getElementById('quantity').setAttribute('aria-label', '數量');
document.getElementById('message').setAttribute('aria-label', '備註');

// ========================================
// UTILITY FUNCTION: Query Parameter Tracking
// ========================================

/**
 * Get URL query parameters for campaign tracking
 */
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const utmParams = {
        utm_source: params.get('utm_source'),
        utm_medium: params.get('utm_medium'),
        utm_campaign: params.get('utm_campaign'),
        utm_content: params.get('utm_content'),
        utm_term: params.get('utm_term')
    };
    
    // Track campaign
    const hasCampaignParams = Object.values(utmParams).some(v => v !== null);
    if (hasCampaignParams) {
        trackEvent('campaign_visit', utmParams);
    }
    
    return utmParams;
}

// Call on page load
getQueryParams();
