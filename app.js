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
   3. Checkout Flow & Eventbrite Trigger Bindings
   ========================================================================== */
function initCheckoutFlow() {
  const btnRegister = document.getElementById('btn-register');
  const btnRegisterMobile = document.getElementById('btn-register-mobile');
  const ebTrigger = document.getElementById('eventbrite-widget-modal-trigger-1992326269504');

  const triggerEventbrite = (e) => {
    if (e) e.preventDefault();
    if (ebTrigger) {
      ebTrigger.click();
    }
  };

  if (btnRegister) {
    btnRegister.addEventListener('click', triggerEventbrite);
  }
  if (btnRegisterMobile) {
    btnRegisterMobile.addEventListener('click', triggerEventbrite);
  }
}
