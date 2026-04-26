/* =========================================
   NATURA COCOA - MAIN JAVASCRIPT (FIXED)
   ========================================= */

document.addEventListener('DOMContentLoaded', function () {
    
    // ====================
    // 1. DEKLARASI VARIABEL DI AWAL
    // ====================
    const navbar = document.querySelector('.navbar');
    const hamburgerBtn = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const getHeaderHeight = () => navbar ? navbar.offsetHeight : 80;

    // ====================
    // 2. CUSTOM SMOOTH SCROLL
    // Dibuat manual agar efek scroll benar-benar terasa saat menu diklik.
    // ====================
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    function easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function smoothScrollTo(targetY, duration = 900) {
        const startY = window.pageYOffset;
        const distance = targetY - startY;
        const startTime = performance.now();

        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeInOutCubic(progress);

            window.scrollTo(0, startY + distance * eased);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        }

        window.requestAnimationFrame(step);
    }

    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();

            const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetTop = Math.max(targetTop - getHeaderHeight() - 8, 0);

            smoothScrollTo(offsetTop, 1000);

            if (navMenu) navMenu.classList.remove('active');
            if (hamburgerBtn) hamburgerBtn.classList.remove('active');

            if (window.location.hash !== targetId) {
                history.pushState(null, '', targetId);
            }
        });
    });

    // ====================
    // 3. MOBILE MENU TOGGLE
    // ====================
    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', function () {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Tutup menu saat klik di luar
        document.addEventListener('click', function (e) {
            if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburgerBtn.classList.remove('active');
            }
        });
    }

    // ====================
    // 4. NAVBAR SCROLL EFFECT
    // ====================
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                navbar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            }
        });
    }

    // ====================
    // 5. FADE-IN ANIMATION ON SCROLL
    // ====================
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if ('IntersectionObserver' in window && fadeElements.length > 0) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        fadeElements.forEach(el => fadeObserver.observe(el));
    }

    // ====================
    // 6. COUNTER ANIMATION
    // ====================
    const statsSection = document.querySelector('.statistics');
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    if (statsSection && statNumbers.length > 0 && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    animateCounters();
                    statsAnimated = true;
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    function animateCounters() {
        statNumbers.forEach(stat => {
            const finalText = stat.innerText;
            const numericValue = parseInt(finalText.replace(/\D/g, ''));
            const suffix = finalText.replace(/[0-9]/g, '');
            const duration = 2000;
            const frameRate = 60;
            const totalFrames = duration / (1000 / frameRate);
            let currentFrame = 0;

            const timer = setInterval(() => {
                currentFrame++;
                const progress = currentFrame / totalFrames;
                const easeProgress = 1 - Math.pow(1 - progress, 2);
                const currentValue = Math.floor(easeProgress * numericValue);
                
                stat.innerText = currentValue + suffix;

                if (currentFrame >= totalFrames) {
                    stat.innerText = finalText;
                    clearInterval(timer);
                }
            }, 1000 / frameRate);
        });
    }

    // ====================
    // 7. DYNAMIC FOOTER YEAR
    // ====================
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

});