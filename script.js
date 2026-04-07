/* ═══════════════════════════════════════════════════
   GOWTHAM R — PORTFOLIO  |  script.js
   Enhanced JS: IntersectionObserver reveals,
   navbar scroll class, hamburger menu,
   scroll-driven overlay.
═══════════════════════════════════════════════════ */

/* ── Wait for DOM ─────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

    /* ══════════════════════════════
       1. SCROLL REVEAL (IntersectionObserver)
       Targets: .reveal-up, .reveal-left, .reveal-right
    ══════════════════════════════ */
    const revealSelectors = '.reveal-up, .reveal-left, .reveal-right';
    const revealEls = document.querySelectorAll(revealSelectors);

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    /* Keep visible once shown (no re-hide on scroll back) */
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    revealEls.forEach(el => revealObserver.observe(el));


    /* ══════════════════════════════
       2. NAVBAR — scrolled class + blur
    ══════════════════════════════ */
    const navbar = document.querySelector('.navbar');

    const updateNavbar = () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar(); /* Run once on load */


    /* ══════════════════════════════
       3. HERO DARK OVERLAY — deepens as user scrolls
    ══════════════════════════════ */
    const overlay = document.getElementById('overlay');

    if (overlay) {
        const updateOverlay = () => {
            let o = window.scrollY / 600;
            overlay.style.opacity = Math.min(o, 0.75);
        };
        window.addEventListener('scroll', updateOverlay, { passive: true });
    }


    /* ══════════════════════════════
       4. HAMBURGER MENU (mobile)
    ══════════════════════════════ */
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            hamburger.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen);
        });

        /* Close menu when a link is tapped */
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', false);
            });
        });
    }


    /* ══════════════════════════════
       5. SMOOTH ACTIVE NAV HIGHLIGHT
       Highlights the nav link whose section is in view
    ══════════════════════════════ */
    const sections  = document.querySelectorAll('section[id], div[id]');
    const navItems  = document.querySelectorAll('.nav-links a');

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navItems.forEach(a => {
                        const href = a.getAttribute('href').replace('#', '');
                        a.style.color = (href === id) ? 'var(--gold)' : '';
                    });
                }
            });
        },
        { threshold: 0.35 }
    );

    sections.forEach(s => sectionObserver.observe(s));


    /* ══════════════════════════════
       6. SKILL WHEEL — touch support
       On mobile (no hover), tap to toggle expand
    ══════════════════════════════ */
    const wheel = document.getElementById('skillWheel');
    if (wheel) {
        let expanded = false;
        wheel.addEventListener('click', () => {
            expanded = !expanded;
            /* On touch devices, simulate hover by toggling a class */
            wheel.classList.toggle('touch-expanded', expanded);
        });
    }


    /* ══════════════════════════════
       7. MICRO-INTERACTION — button ripple
       Lightweight ripple on .btn and .action-btn clicks
    ══════════════════════════════ */
    document.querySelectorAll('.btn, .action-btn, .project-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect   = this.getBoundingClientRect();
            const size   = Math.max(rect.width, rect.height);
            ripple.style.cssText = `
                position:absolute;
                width:${size}px; height:${size}px;
                left:${e.clientX - rect.left - size/2}px;
                top:${e.clientY - rect.top - size/2}px;
                background:rgba(255,255,255,0.18);
                border-radius:50%;
                transform:scale(0);
                animation:rippleAnim 0.55s ease-out forwards;
                pointer-events:none;
            `;
            /* Need position relative on button */
            if (getComputedStyle(this).position === 'static') {
                this.style.position = 'relative';
            }
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });

    /* Inject ripple keyframe once */
    if (!document.getElementById('ripple-style')) {
        const s = document.createElement('style');
        s.id = 'ripple-style';
        s.textContent = `
            @keyframes rippleAnim {
                to { transform: scale(2.5); opacity: 0; }
            }
        `;
        document.head.appendChild(s);
    }


    /* ══════════════════════════════
       8. SKILL WHEEL — touch-expanded CSS
       Inject helper class so mobile users can tap to expand
    ══════════════════════════════ */
    const touchStyle = document.createElement('style');
    touchStyle.textContent = `
        #skillWheel.touch-expanded .gx-s1 { transform: translate(-50%,-50%) translate(155px,0) !important; }
        #skillWheel.touch-expanded .gx-s2 { transform: translate(-50%,-50%) translate(105px,105px) !important; }
        #skillWheel.touch-expanded .gx-s3 { transform: translate(-50%,-50%) translate(0,155px) !important; }
        #skillWheel.touch-expanded .gx-s4 { transform: translate(-50%,-50%) translate(-105px,105px) !important; }
        #skillWheel.touch-expanded .gx-s5 { transform: translate(-50%,-50%) translate(-155px,0) !important; }
        #skillWheel.touch-expanded .gx-s6 { transform: translate(-50%,-50%) translate(-105px,-105px) !important; }
    `;
    document.head.appendChild(touchStyle);

});
