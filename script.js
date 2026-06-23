// â”€â”€â”€ Improvement #6: Smart Loading Screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        (function () {
            const loader = document.getElementById('loader');
            const heroImg = document.querySelector('.hero__media img');

            // Wait for actual image load OR 800ms cap, whichever comes first
            const imageLoaded = new Promise(resolve => {
                if (heroImg.complete) { resolve(); return; }
                heroImg.addEventListener('load', resolve);
                heroImg.addEventListener('error', resolve);
            });

            const timeout = new Promise(resolve => setTimeout(resolve, 800));

            Promise.race([imageLoaded, timeout]).then(() => {
                // Small buffer to let CSS animation finish
                setTimeout(() => {
                    loader.classList.add('hidden');
                    document.querySelector('.hero').classList.add('loaded');
                    // Initialize char animation after loader hides
                    splitHeroTitle();
                }, 100);
            });
        })();

        // â”€â”€â”€ Improvement #2: Character Split Animation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        function splitHeroTitle() {
            const title = document.getElementById('heroTitle');
            if (!title) return;

            // Get the text node (first child, "Heritage")
            const textNodes = [];
            title.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                    textNodes.push(node);
                }
            });

            textNodes.forEach(textNode => {
                const text = textNode.textContent.trim();
                const wrapper = document.createElement('span');
                wrapper.style.display = 'inline-block';
                wrapper.style.perspective = '600px';

                text.split('').forEach((char, i) => {
                    const span = document.createElement('span');
                    span.className = 'char';
                    span.textContent = char === ' ' ? '\u00A0' : char;
                    span.style.animationDelay = `${0.5 + i * 0.06}s`;
                    wrapper.appendChild(span);
                });

                textNode.parentNode.replaceChild(wrapper, textNode);
            });
        }

        // â”€â”€â”€ Improvement #3: Lenis Smooth Scroll â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        let lenis;
        try {
            lenis = new Lenis({
                duration: 1.0,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 1.1,
                touchMultiplier: 1.8,
                infinite: false,
                lerp: 0.1,
                syncTouch: true,
                syncTouchLerp: 0.075,
            });
        } catch (e) {
            // Lenis CDN not loaded, fallback to native
            lenis = null;
        }

        // â”€â”€â”€ Improvement #5: Unified Scroll Handler â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        const scrollProgress = document.getElementById('scrollProgress');
        const navbar = document.getElementById('navbar');
        const parallaxBg = document.getElementById('parallaxBg');
        const quoteSection = document.getElementById('quote');
        const heroMedia = document.querySelector('.hero__media img');
        const heroContent = document.querySelector('.hero__content');
        const heroSection = document.querySelector('.hero');

        // Cache viewport dimensions â€” update on resize
        let cachedVH = window.innerHeight;
        let cachedDocHeight = document.documentElement.scrollHeight;
        let lastNavbarScrolled = false;
        let lastProgressWidth = '';

        window.addEventListener('resize', () => {
            cachedVH = window.innerHeight;
            cachedDocHeight = document.documentElement.scrollHeight;
        }, { passive: true });

        function onScroll(scrollData) {
            const scrollTop = scrollData ? scrollData.scroll : window.scrollY;
            const maxScroll = scrollData ? scrollData.limit : (cachedDocHeight - cachedVH);

            // 1. Scroll progress bar â€” only update if changed
            const progress = ((scrollTop / maxScroll) * 100).toFixed(1) + '%';
            if (progress !== lastProgressWidth) {
                scrollProgress.style.width = progress;
                lastProgressWidth = progress;
            }

            // 2. Navbar scroll effect â€” only toggle if state changed
            const shouldBeScrolled = scrollTop > 80;
            if (shouldBeScrolled !== lastNavbarScrolled) {
                navbar.classList.toggle('scrolled', shouldBeScrolled);
                lastNavbarScrolled = shouldBeScrolled;
            }

            // 3. Parallax on quote section â€” use translate3d for GPU acceleration
            if (quoteSection && parallaxBg) {
                const rect = quoteSection.getBoundingClientRect();
                // Only compute if section is near viewport
                if (rect.bottom > -200 && rect.top < cachedVH + 200) {
                    const sectionCenter = rect.top + rect.height * 0.5;
                    const offset = (sectionCenter - cachedVH * 0.5) * 0.15;
                    parallaxBg.style.transform = `translate3d(0, ${offset}px, 0)`;
                }
            }

            // 4. Hero parallax â€” only when hero is visible, use translate3d
            if (heroSection && heroMedia && heroContent) {
                const heroHeight = heroSection.offsetHeight;
                if (scrollTop < heroHeight) {
                    const parallaxVal = scrollTop * 0.12;
                    heroMedia.style.transform = `translate3d(0, ${parallaxVal}px, 0) scale(${1 + scrollTop * 0.0001})`;
                    heroContent.style.transform = `translate3d(0, ${scrollTop * 0.2}px, 0)`;
                    heroContent.style.opacity = Math.max(0, 1 - (scrollTop / heroHeight) * 1.2);
                }
            }

            // 5. Word reveal on quote (Improvement #10)
            handleWordReveal();
        }

        if (lenis) {
            lenis.on('scroll', (e) => {
                onScroll({ scroll: e.scroll, limit: e.limit });
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        } else {
            // Fallback: single scroll listener with rAF throttle
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        onScroll(null);
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        }

        // â”€â”€â”€ Custom Cursor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        const cursorDot = document.getElementById('cursorDot');
        const cursorRing = document.getElementById('cursorRing');
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;
        let cursorVisible = false;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            // Use transform instead of left/top for GPU-accelerated positioning
            cursorDot.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
            if (!cursorVisible) {
                cursorVisible = true;
                cursorDot.style.opacity = '1';
                cursorRing.style.opacity = '0.5';
            }
        }, { passive: true });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            // Use transform instead of left/top for GPU-accelerated positioning
            cursorRing.style.transform = `translate3d(${ringX - 20}px, ${ringY - 20}px, 0)`;
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover effect on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .origin__image-frame, .craft__product-image');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
        });

        // â”€â”€â”€ Improvement #11: Cursor Click Pulse â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        document.addEventListener('mousedown', () => {
            cursorDot.classList.add('clicking');
            cursorRing.classList.add('clicking');
        });
        document.addEventListener('mouseup', () => {
            cursorDot.classList.remove('clicking');
            cursorRing.classList.remove('clicking');
        });

        // â”€â”€â”€ Intersection Observer for Reveals â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));

        // â”€â”€â”€ Smooth Anchor Scrolling (uses Lenis) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                if (href === '#') return;
                const target = document.querySelector(href);
                if (target) {
                    if (lenis) {
                        lenis.scrollTo(target, { offset: 0, duration: 1.5 });
                    } else {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    // Close mobile menu if open
                    closeMobileMenu();
                }
            });
        });

        // â”€â”€â”€ Improvement #1: Magnetic Buttons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        class MagneticButton {
            constructor(el) {
                this.el = el;
                this.boundingRect = null;
                this.strength = 25; // Maximum pixel offset

                this.el.addEventListener('mouseenter', () => this.onEnter());
                this.el.addEventListener('mousemove', (e) => this.onMove(e));
                this.el.addEventListener('mouseleave', () => this.onLeave());
            }

            onEnter() {
                this.boundingRect = this.el.getBoundingClientRect();
            }

            onMove(e) {
                if (!this.boundingRect) return;
                const centerX = this.boundingRect.left + this.boundingRect.width / 2;
                const centerY = this.boundingRect.top + this.boundingRect.height / 2;
                const deltaX = (e.clientX - centerX) / (this.boundingRect.width / 2);
                const deltaY = (e.clientY - centerY) / (this.boundingRect.height / 2);

                const tx = deltaX * this.strength;
                const ty = deltaY * this.strength;

                this.el.style.transform = `translate(${tx}px, ${ty}px)`;
            }

            onLeave() {
                this.el.style.transform = 'translate(0, 0)';
                this.boundingRect = null;
            }
        }

        // Initialize magnetic buttons
        document.querySelectorAll('.magnetic-btn').forEach(btn => {
            new MagneticButton(btn);
        });

        // â”€â”€â”€ Improvement #9: Mobile Menu Logic â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        let menuOpen = false;

        function openMobileMenu() {
            menuOpen = true;
            hamburger.classList.add('active');
            mobileMenu.classList.add('open');
            document.body.style.overflow = 'hidden';
            if (lenis) lenis.stop();
        }

        function closeMobileMenu() {
            menuOpen = false;
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
            if (lenis) lenis.start();
        }

        hamburger.addEventListener('click', () => {
            if (menuOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    e.preventDefault();
                    closeMobileMenu();
                    setTimeout(() => {
                        const target = document.querySelector(href);
                        if (target) {
                            if (lenis) {
                                lenis.scrollTo(target, { offset: 0, duration: 1.5 });
                            } else {
                                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        }
                    }, 300);
                }
            });
        });

        // Close menu on outside click (on overlay background)
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) closeMobileMenu();
        });

        // â”€â”€â”€ Improvement #10: Scroll-triggered Word Reveal on Quote â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        (function () {
            const quoteText = document.getElementById('quoteText');
            if (!quoteText) return;

            const rawText = quoteText.textContent.trim();
            quoteText.innerHTML = '';

            rawText.split(/\s+/).forEach((word, i) => {
                const span = document.createElement('span');
                span.className = 'word';
                span.textContent = word;
                span.dataset.index = i;
                quoteText.appendChild(span);
                // Add space after each word
                quoteText.appendChild(document.createTextNode(' '));
            });
        })();

        const quoteWords = document.querySelectorAll('.parallax-quote__text .word');
        const totalWords = quoteWords.length;

        let lastWordsRevealed = -1;
        function handleWordReveal() {
            if (!quoteSection || !totalWords) return;
            const rect = quoteSection.getBoundingClientRect();

            // Skip if section is far from viewport
            if (rect.bottom < -100 || rect.top > cachedVH + 100) return;

            const sectionProgress = 1 - (rect.top / cachedVH);
            const revealStart = 0.2;
            const revealEnd = 1.0;
            const clampedProgress = Math.max(0, Math.min(1, (sectionProgress - revealStart) / (revealEnd - revealStart)));

            const wordsToReveal = Math.floor(clampedProgress * totalWords);

            // Only update DOM if the count actually changed
            if (wordsToReveal === lastWordsRevealed) return;
            lastWordsRevealed = wordsToReveal;

            quoteWords.forEach((word, i) => {
                if (i < wordsToReveal) {
                    word.classList.add('revealed');
                } else {
                    word.classList.remove('revealed');
                }
            });
        }

        // â”€â”€â”€ Improvement #8: Scroll-triggered Color Reveal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        const grayscaleImages = document.querySelectorAll('.grayscale-img');
        const colorRevealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Delay the reveal slightly for a "moment of delight"
                    setTimeout(() => {
                        entry.target.classList.add('color-revealed');
                    }, 400);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        });

        grayscaleImages.forEach(img => colorRevealObserver.observe(img));

        // â”€â”€â”€ Improvement #14: Animated Stat Counters â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        const counters = document.querySelectorAll('.counter');
        let countersAnimated = false;

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    animateCounters();
                }
            });
        }, {
            threshold: 0.3
        });

        counters.forEach(counter => counterObserver.observe(counter));

        function animateCounters() {
            counters.forEach(counter => {
                const target = parseInt(counter.dataset.target);
                const suffix = counter.dataset.suffix || '';
                const duration = 1800;
                const startTime = performance.now();

                function updateCounter(now) {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out quart
                    const eased = 1 - Math.pow(1 - progress, 4);
                    const current = Math.round(eased * target);

                    counter.textContent = current + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    }
                }

                requestAnimationFrame(updateCounter);
            });
        }