// Interactive Scripts for blackmarket.soplugged.com

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFAQs();
  initCheckoutFlow();
  initVenueCarousel();
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

/* ==========================================================================
   4. Venue Image Carousel Logic
   ========================================================================== */
function initVenueCarousel() {
  const carousel = document.querySelector('.venue-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const nextButton = carousel.querySelector('.btn-right');
  const prevButton = carousel.querySelector('.btn-left');
  const dotsNav = carousel.querySelector('.carousel-nav');
  const dots = Array.from(dotsNav.children);

  let currentIndex = 0;
  let autoPlayTimer = null;

  const updateSlideUI = (targetIndex) => {
    // Loop around bounds
    if (targetIndex < 0) targetIndex = slides.length - 1;
    if (targetIndex >= slides.length) targetIndex = 0;

    // Toggle active slide
    slides[currentIndex].classList.remove('active');
    slides[targetIndex].classList.add('active');

    // Toggle active indicator dot
    dots[currentIndex].classList.remove('active');
    dots[targetIndex].classList.add('active');

    currentIndex = targetIndex;
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
      updateSlideUI(currentIndex + 1);
    }, 4000); // Auto-scroll every 4 seconds
  };

  const stopAutoPlay = () => {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  };

  // Event Listeners for Nav buttons
  nextButton.addEventListener('click', (e) => {
    e.stopPropagation();
    updateSlideUI(currentIndex + 1);
    startAutoPlay(); // Reset auto-scroll timer on manual click
  });

  prevButton.addEventListener('click', (e) => {
    e.stopPropagation();
    updateSlideUI(currentIndex - 1);
    startAutoPlay(); // Reset auto-scroll timer on manual click
  });

  // Event Listeners for indicators
  dotsNav.addEventListener('click', (e) => {
    const targetDot = e.target.closest('button');
    if (!targetDot) return;

    const targetIndex = dots.indexOf(targetDot);
    updateSlideUI(targetIndex);
    startAutoPlay(); // Reset timer
  });

  // Pause auto-play on mouse hover
  carousel.addEventListener('mouseenter', stopAutoPlay);
  carousel.addEventListener('mouseleave', startAutoPlay);

  // Initialize auto-play
  startAutoPlay();
}

