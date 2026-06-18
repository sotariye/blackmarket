// Interactive Scripts for blackmarket.soplugged.com

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFAQs();
  initCheckoutFlow();
});

/* ==========================================================================
   1. Navbar Scroll Effect
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  });
}

/* ==========================================================================
   2. FAQ Accordion Logic
   ========================================================================== */
function initFAQs() {
  const faqHeaders = document.querySelectorAll('.faq-header');
  
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.faq-body');
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      
      // Close all other FAQs
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-body').style.maxHeight = '0';
          otherItem.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
        }
      });
      
      // Toggle current FAQ
      if (isExpanded) {
        item.classList.remove('active');
        body.style.maxHeight = '0';
        header.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   3. Checkout Flow & Form Validation
   ========================================================================== */
function initCheckoutFlow() {
  // DOM Elements
  const modal = document.getElementById('checkout-modal');
  const btnRegister = document.getElementById('btn-register');
  const btnRegisterMobile = document.getElementById('btn-register-mobile');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnBack = document.getElementById('btn-back');
  const btnNext = document.getElementById('btn-next');
  const btnNextText = document.getElementById('btn-next-text');
  const footer = document.getElementById('modal-footer');
  
  // Step Panels
  const panel1 = document.getElementById('step-panel-1');
  const panel2 = document.getElementById('step-panel-2');
  const panel3 = document.getElementById('step-panel-3');
  
  // Step Indicators
  const indicator1 = document.getElementById('step-indicator-1');
  const indicator2 = document.getElementById('step-indicator-2');
  const indicator3 = document.getElementById('step-indicator-3');
  
  // Sharing details toggle
  const sharingRadios = document.querySelectorAll('input[name="vendor-sharing"]');
  const sharingDetailsContainer = document.getElementById('sharing-details-container');
  const sharingInfoTextarea = document.getElementById('vendor-sharing-info');
  
  const btnStripeLink = document.getElementById('btn-stripe-link');
  let isSubmitting = false;
  let currentStep = 1;

  // Open Modal
  const openModal = () => {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    resetCheckout();
  };

  btnRegister.addEventListener('click', openModal);
  btnRegisterMobile.addEventListener('click', openModal);

  // Close Modal
  const closeModal = () => {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  };
  
  btnCloseModal.addEventListener('click', closeModal);
  
  // Close modal clicking outside container
  modal.addEventListener('click', (e) => {
    if (e.target === modal && currentStep !== 3) {
      closeModal();
    }
  });

  // Table sharing radio change
  sharingRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'yes') {
        sharingDetailsContainer.style.display = 'flex';
        sharingInfoTextarea.setAttribute('required', 'true');
      } else {
        sharingDetailsContainer.style.display = 'none';
        sharingInfoTextarea.removeAttribute('required');
        sharingInfoTextarea.value = '';
        clearError(sharingInfoTextarea);
      }
    });
  });

  // Clear errors when user types or edits inputs
  const allInputs = document.querySelectorAll('.form-input');
  allInputs.forEach(input => {
    input.addEventListener('input', () => clearError(input));
    input.addEventListener('change', () => clearError(input));
  });

  // Back Button Navigation
  btnBack.addEventListener('click', () => {
    if (currentStep === 2) {
      currentStep = 1;
      updateStepUI();
    }
  });

  // Next/Register Button Navigation
  btnNext.addEventListener('click', () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        currentStep = 2;
        updateStepUI();
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        processPayment();
      }
    } else if (currentStep === 3) {
      closeModal();
    }
  });

  // Form submit listener to prevent page reloads if user hits enter
  const formElement = document.getElementById('step-panel-1');
  if (formElement) {
    formElement.addEventListener('submit', (e) => {
      e.preventDefault();
      if (currentStep === 1) {
        if (validateStep1()) {
          currentStep = 2;
          updateStepUI();
        }
      }
    });
  }

  // Intercept inline Stripe link to trigger form submission first
  if (btnStripeLink) {
    btnStripeLink.addEventListener('click', (e) => {
      e.preventDefault();
      processPayment();
    });
  }

  /* ==========================================
     Validation Helpers
     ========================================== */
  function validateStep1() {
    let isValid = true;
    
    const bizName = document.getElementById('vendor-business-name');
    const category = document.getElementById('vendor-category');
    const name = document.getElementById('vendor-name');
    const email = document.getElementById('vendor-email');
    const phone = document.getElementById('vendor-phone');
    const social = document.getElementById('vendor-social');
    const desc = document.getElementById('vendor-desc');
    const sharingRadio = document.querySelector('input[name="vendor-sharing"]:checked');
    
    // Business Name
    if (!bizName.value.trim()) {
      showError(bizName, 'err-business-name');
      isValid = false;
    }
    
    // Category
    if (!category.value) {
      showError(category, 'err-category');
      isValid = false;
    }
    
    // Name
    if (!name.value.trim()) {
      showError(name, 'err-name');
      isValid = false;
    }
    
    // Email regex validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
      showError(email, 'err-email');
      isValid = false;
    }
    
    // Phone
    if (!phone.value.trim() || phone.value.replace(/\D/g, '').length < 7) {
      showError(phone, 'err-phone');
      isValid = false;
    }
    
    // Social Handle
    if (!social.value.trim()) {
      showError(social, 'err-social');
      isValid = false;
    }
    
    // Description
    if (!desc.value.trim()) {
      showError(desc, 'err-desc');
      isValid = false;
    }
    
    // Sharing table extra info
    if (sharingRadio.value === 'yes') {
      if (!sharingInfoTextarea.value.trim()) {
        showError(sharingInfoTextarea, 'err-sharing-info');
        isValid = false;
      }
    }
    
    return isValid;
  }

  function validateStep2() {
    return true;
  }

  function showError(inputElement, errorId) {
    inputElement.classList.add('invalid');
    const errSpan = document.getElementById(errorId);
    if (errSpan) {
      errSpan.style.display = 'block';
    }
  }

  function clearError(inputElement) {
    inputElement.classList.remove('invalid');
    // Find associated error span
    const formGroup = inputElement.closest('.form-group');
    if (formGroup) {
      const errSpan = formGroup.querySelector('.error-msg');
      if (errSpan) {
        errSpan.style.display = 'none';
      }
    }
  }

  /* ==========================================
     UI Step Syncing
     ========================================== */
  function updateStepUI() {
    // Hide all panels
    panel1.classList.remove('active');
    panel2.classList.remove('active');
    panel3.classList.remove('active');
    
    // Reset Indicator States
    indicator1.className = 'step-indicator';
    indicator2.className = 'step-indicator';
    indicator3.className = 'step-indicator';
    
    if (currentStep === 1) {
      panel1.classList.add('active');
      indicator1.classList.add('active');
      btnBack.style.display = 'none';
      btnNextText.textContent = 'Continue';
    } else if (currentStep === 2) {
      panel2.classList.add('active');
      indicator1.classList.add('completed');
      indicator2.classList.add('active');
      btnBack.style.display = 'block';
      btnNextText.textContent = 'Proceed to Stripe Checkout';
    } else if (currentStep === 3) {
      panel3.classList.add('active');
      indicator1.classList.add('completed');
      indicator2.classList.add('completed');
      indicator3.classList.add('active');
      
      // Hide back/next footer controls
      footer.style.display = 'none';
      btnCloseModal.style.display = 'none'; // Lock modal close to only the "Done" button or reload
    }
  }

  /* ==========================================
     Stripe Checkout Redirection & Formspree Submission
     ========================================== */
  function processPayment() {
    if (isSubmitting) return;
    isSubmitting = true;

    // Generate random Ticket ID immediately
    const randomId = '#BM2026-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    // Add loading class to button
    btnNext.classList.add('btn-loading');
    btnNext.setAttribute('disabled', 'true');
    btnBack.setAttribute('disabled', 'true');
    if (btnStripeLink) {
      btnStripeLink.style.pointerEvents = 'none';
      btnStripeLink.style.opacity = '0.6';
    }

    // Compile registration data
    const registrationData = {
      'Ticket ID': randomId,
      'Business Name': document.getElementById('vendor-business-name').value.trim(),
      'Category': document.getElementById('vendor-category').value,
      'Contact Name': document.getElementById('vendor-name').value.trim(),
      'Email': document.getElementById('vendor-email').value.trim(),
      '_replyto': document.getElementById('vendor-email').value.trim(),
      'Phone': document.getElementById('vendor-phone').value.trim(),
      'Website or Social': document.getElementById('vendor-social').value.trim(),
      'Product Description': document.getElementById('vendor-desc').value.trim(),
      'Sharing Table?': document.querySelector('input[name="vendor-sharing"]:checked').value,
      'Partner Details': document.getElementById('vendor-sharing-info').value.trim(),
      'Requires Electrical Power?': document.getElementById('vendor-power').checked ? 'Yes' : 'No',
      'Payment Status': 'Pending (Redirected to Stripe)'
    };
    
    // Save to localStorage so we can retrieve it upon successful redirection
    localStorage.setItem('pending_registration', JSON.stringify(registrationData));

    // Submit initial registration to Formspree
    fetch('https://formspree.io/f/xzdqagpa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(registrationData)
    })
    .then(response => {
      // Once submitted to Formspree, redirect current page to Stripe Checkout
      window.location.href = 'https://buy.stripe.com/8x27sMb4mbL4cTa3YtgnK02';
    })
    .catch(error => {
      console.error('Formspree initial submission error:', error);
      // Still redirect to Stripe Checkout so customer can pay
      window.location.href = 'https://buy.stripe.com/8x27sMb4mbL4cTa3YtgnK02';
    });
  }

  function confirmPaymentFormspree(pendingData) {
    const payload = {
      'Ticket ID': pendingData['Ticket ID'],
      'Business Name': pendingData['Business Name'],
      'Contact Name': pendingData['Contact Name'],
      'Email': pendingData['Email'],
      '_replyto': pendingData['Email'],
      'Payment Status': 'Confirmed (Stripe Successful)'
    };
    
    fetch('https://formspree.io/f/xzdqagpa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      console.log('Payment confirmation successfully sent to Formspree');
    })
    .catch(error => {
      console.error('Error sending payment confirmation to Formspree:', error);
    });
  }

  function sendConfirmationEmail(pendingData) {
    fetch('/api/send-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pendingData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Confirmation email successfully triggered via Resend API.');
      } else {
        console.error('Failed to send confirmation email:', data.error);
      }
    })
    .catch(error => {
      console.error('Error calling /api/send-confirmation:', error);
    });
  }

  function openModalDirectStep3() {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    currentStep = 3;
    updateStepUI();
    startConfetti();
  }

  function checkPaymentSuccessRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      const pendingDataStr = localStorage.getItem('pending_registration');
      if (pendingDataStr) {
        localStorage.removeItem('pending_registration'); // Clean up immediately to prevent duplicate requests
        try {
          const pendingData = JSON.parse(pendingDataStr);
          
          document.getElementById('receipt-biz').textContent = pendingData['Business Name'] || 'Your Business';
          document.getElementById('receipt-id').textContent = pendingData['Ticket ID'] || '#BM2026-UNKNOWN';
          
          openModalDirectStep3();
          confirmPaymentFormspree(pendingData);
          sendConfirmationEmail(pendingData);
        } catch (e) {
          console.error('Error parsing pending registration:', e);
        }
      } else {
        // Fallback if localStorage is cleared or they are on a different device but redirected here
        document.getElementById('receipt-biz').textContent = 'Your Business';
        document.getElementById('receipt-id').textContent = 'Confirmed';
        openModalDirectStep3();
      }
      
      // Clean up URL query parameters so reload doesn't trigger the modal again
      const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }

  /* ==========================================
     Reset Form on Open
     ========================================== */
  function resetCheckout() {
    currentStep = 1;
    isSubmitting = false;
    updateStepUI();
    footer.style.display = 'flex';
    btnCloseModal.style.display = 'flex';
    
    // Clear inputs and error borders
    const forms = document.querySelectorAll('.modal-body form');
    forms.forEach(form => form.reset());
    
    allInputs.forEach(input => clearError(input));
    
    btnNext.classList.remove('btn-loading');
    btnNext.removeAttribute('disabled');
    btnBack.removeAttribute('disabled');
    if (btnStripeLink) {
      btnStripeLink.style.pointerEvents = '';
      btnStripeLink.style.opacity = '';
    }
    
    // Default table share elements
    sharingDetailsContainer.style.display = 'none';
    sharingInfoTextarea.removeAttribute('required');
    
    // Stop any confetti
    stopConfetti();
  }

  // Check for successful redirection from Stripe
  checkPaymentSuccessRedirect();
}

/* ==========================================================================
   4. High-Performance Canvas Confetti System
   ========================================================================== */
let confettiAnimationId = null;

function startConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Fit canvas to modal size dynamically
  const modalBody = canvas.parentElement;
  canvas.width = modalBody.clientWidth;
  canvas.height = modalBody.clientHeight;
  
  const colors = [
    '#eab308', // Gold
    '#fef08a', // Light yellow
    '#ffffff', // White
    '#a3a3a3', // Silver Gray
    '#ca8a04', // Dark Gold
    '#10b981'  // Success Green highlight
  ];
  
  const particles = [];
  const particleCount = 120;
  
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      // Start slightly above the top of the canvas panel
      this.y = Math.random() * -100 - 20;
      this.size = Math.random() * 8 + 4;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      
      this.speedX = Math.random() * 4 - 2;
      this.speedY = Math.random() * 5 + 3;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 4 - 2;
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
      
      // Wind oscillation
      this.speedX += Math.sin(this.y / 30) * 0.05;
    }
    
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      
      ctx.fillStyle = this.color;
      // Draw rectangular confetti piece
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size / 1.5);
      
      ctx.restore();
    }
  }
  
  // Populate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  function animLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let activeParticles = 0;
    
    particles.forEach(p => {
      if (p.y < canvas.height) {
        p.update();
        p.draw();
        activeParticles++;
      }
    });
    
    if (activeParticles > 0) {
      confettiAnimationId = requestAnimationFrame(animLoop);
    }
  }
  
  // Cancel previous running loops if any
  if (confettiAnimationId) {
    cancelAnimationFrame(confettiAnimationId);
  }
  
  animLoop();
}

function stopConfetti() {
  if (confettiAnimationId) {
    cancelAnimationFrame(confettiAnimationId);
    confettiAnimationId = null;
  }
  const canvas = document.getElementById('confetti-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
