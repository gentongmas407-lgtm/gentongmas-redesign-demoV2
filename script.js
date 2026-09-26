document.addEventListener('DOMContentLoaded', function () {

  // --- Mobile menu ---
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.style.display === 'block';
      mobileMenu.style.display = isOpen ? 'none' : 'block';
      menuBtn.setAttribute('aria-expanded', String(!isOpen));
    });
  }

  // --- Hero slider (crossfade, preloaded, pause on hover) ---
  const heroSection = document.getElementById('hero-slider');
  if (heroSection) {
    const slides = Array.from(heroSection.querySelectorAll('.hero-slide'));
    const dotsContainer = document.getElementById('hero-dots');
    let current = 0;
    let timer = null;

    // Preload every slide image up front so switching never waits on the network.
    slides.forEach(slide => {
      const img = slide.querySelector('img');
      if (img && img.getAttribute('loading') !== 'eager') {
        const preload = new Image();
        preload.src = img.src;
      }
    });

    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === 0);
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
    const dots = Array.from(dotsContainer.children);

    function goTo(index) {
      if (index === current) return;
      slides[current].hidden = false;
      slides[current].style.opacity = '0';
      slides[index].hidden = false;
      slides[index].style.opacity = '1';
      window.setTimeout(() => { slides[current].hidden = true; }, 600);
      dots[current].classList.remove('active');
      dots[index].classList.add('active');
      current = index;
    }

    function next() { goTo((current + 1) % slides.length); }

    slides.forEach(s => {
      s.style.position = 'absolute';
      s.style.inset = '0';
      s.style.transition = 'opacity 0.6s ease';
    });
    slides[0].style.position = 'relative';
    slides[0].style.opacity = '1';

    function start() { timer = window.setInterval(next, 5000); }
    function stop() { window.clearInterval(timer); }
    start();
    heroSection.addEventListener('mouseenter', stop);
    heroSection.addEventListener('mouseleave', start);
  }

  // --- Testimonial carousel ---
  const testiCarousel = document.getElementById('testimonial-carousel');
  if (testiCarousel) {
    const slides = Array.from(testiCarousel.children);
    const dotsContainer = document.getElementById('testimonial-dots');
    let current = 0;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Testimoni ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => setSlide(i));
      dotsContainer.appendChild(dot);
    });
    const dots = Array.from(dotsContainer.children);

    function setSlide(index) {
      current = (index + slides.length) % slides.length;
      testiCarousel.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    window.setInterval(() => setSlide(current + 1), 4000);

    let startX = 0;
    testiCarousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
    testiCarousel.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (diff > 50) setSlide(current + 1);
      else if (diff < -50) setSlide(current - 1);
    });
  }

});
