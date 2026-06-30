// Interactive Scripts for blackmarket.soplugged.com

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFAQs();
  initWaitlistModal();
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
   3. Waitlist Modal & Formspree AJAX Submission
   ========================================================================== */
function initWaitlistModal() {
  const btnRegister = document.getElementById('btn-register');
  const btnRegisterMobile = document.getElementById('btn-register-mobile');
  const modal = document.getElementById('waitlist-modal');
  const form = document.getElementById('waitlist-form');
  const successView = document.getElementById('waitlist-success');
  const closeBtn = document.getElementById('close-waitlist-modal');
  const cancelBtn = document.getElementById('btn-cancel-waitlist');
  const successCloseBtn = document.getElementById('btn-success-close');
  const submitBtn = document.getElementById('btn-submit-waitlist');

  const openModal = (e) => {
    if (e) e.preventDefault();
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = (e) => {
    if (e) e.preventDefault();
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
      
      // Reset form view with slight delay to avoid layout flashing during exit transition
      setTimeout(() => {
        if (form) {
          form.reset();
          form.style.display = 'block';
        }
        if (successView) {
          successView.style.display = 'none';
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Waitlist Request';
        }
      }, 300);
    }
  };

  if (btnRegister) btnRegister.addEventListener('click', openModal);
  if (btnRegisterMobile) btnRegisterMobile.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (successCloseBtn) successCloseBtn.addEventListener('click', closeModal);

  // Close modal on click background
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Formspree AJAX Submit
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
      }

      const data = new FormData(form);
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          form.style.display = 'none';
          if (successView) {
            successView.style.display = 'flex';
          }
        } else {
          const result = await response.json();
          let errorMsg = 'Oops! There was a problem submitting your form. Please try again.';
          if (result && result.errors) {
            errorMsg = result.errors.map(err => err.message).join(', ');
          }
          alert(errorMsg);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Waitlist Request';
          }
        }
      } catch (error) {
        console.error('Waitlist submission error:', error);
        alert('Oops! There was a connectivity issue. Please check your internet connection and try again.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Waitlist Request';
        }
      }
    });
  }
}

