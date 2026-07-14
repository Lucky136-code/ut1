document.addEventListener("DOMContentLoaded", () => {
    // === PRELOADER ===
    const preloader = document.getElementById('preloader');
    if (sessionStorage.getItem('preloader_shown')) {
        if (preloader) preloader.style.display = 'none';
    } else {
        sessionStorage.setItem('preloader_shown', 'true');
        const preloaderTl = gsap.timeline();
        preloaderTl
            .to('.preloader-logo', { opacity: 1, duration: 0.8, ease: "power2.out" })
            .to('.preloader-tagline', { opacity: 1, duration: 0.6 }, "-=0.3")
            .to('.preloader-progress', { width: '100%', duration: 1.5, ease: "power2.inOut" }, "-=0.5")
            .to(preloader, { yPercent: -100, duration: 0.8, ease: "power3.inOut", delay: 0.2, onComplete: () => { if (preloader) preloader.style.display = 'none'; } });
    }


    gsap.registerPlugin(ScrollTrigger);

    // === LENIS SMOOTH SCROLL ===
    const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), direction: 'vertical', gestureDirection: 'vertical', smooth: true, mouseMultiplier: 1, smoothTouch: false, touchMultiplier: 2, infinite: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0, 0);

    // === THREE.JS HERO ===
    const canvas = document.getElementById('hero-canvas');
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.015);
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 20;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputEncoding = THREE.sRGBEncoding;

    const textureLoader = new THREE.TextureLoader();
    function setupTexture(path) {
        const tex = textureLoader.load(path);
        tex.encoding = THREE.sRGBEncoding; tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter;
        if (renderer.capabilities.getMaxAnisotropy() > 0) tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }
    const texHero = setupTexture('assets/marble_hero.png');
    const texDark = setupTexture('assets/marble_dark_texture.png');
    const texGold = setupTexture('assets/marble_gold.png');

    const geometry = new THREE.BoxGeometry(8, 12, 1, 4, 4, 4);
    const baseMatParams = { bumpScale: 0.05, roughness: 0.1, metalness: 0.15, clearcoat: 1.0, clearcoatRoughness: 0.05 };
    const mat1 = new THREE.MeshPhysicalMaterial({ map: texHero, bumpMap: texHero, ...baseMatParams });
    const mat2 = new THREE.MeshPhysicalMaterial({ map: texDark, bumpMap: texDark, transparent: true, opacity: 0, depthWrite: false, ...baseMatParams });
    const mat3 = new THREE.MeshPhysicalMaterial({ map: texGold, bumpMap: texGold, transparent: true, opacity: 0, depthWrite: false, ...baseMatParams });

    const slab1 = new THREE.Mesh(geometry, mat1);
    const slab2 = new THREE.Mesh(geometry, mat2); slab2.scale.setScalar(1.001);
    const slab3 = new THREE.Mesh(geometry, mat3); slab3.scale.setScalar(1.002);
    const slabGroup = new THREE.Group();
    slabGroup.add(slab1, slab2, slab3);
    scene.add(slabGroup);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5); dirLight.position.set(5, 10, 10); scene.add(dirLight);
    const pl1 = new THREE.PointLight(0xffeedd, 2, 50); pl1.position.set(-10, 5, 10); scene.add(pl1);
    const pl2 = new THREE.PointLight(0xaaccff, 2.5, 50); pl2.position.set(10, -5, -5); scene.add(pl2);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    let isHeroVisible = true;
    const heroObserver = new IntersectionObserver(e => { isHeroVisible = e[0].isIntersecting; });
    const heroEl = document.getElementById('hero-container');
    if (heroEl) heroObserver.observe(heroEl);
    gsap.ticker.add(() => { if (isHeroVisible) renderer.render(scene, camera); });

    // === HERO SCROLL ANIMATION ===
    slabGroup.position.set(0, -2.5, -5);
    slabGroup.rotation.set(0.15, 0.4, 0.05);
    // Comment out vertical shift as our grid is absolute fullscreen 100vh
    // gsap.set('.hero-text-overlay', { yPercent: -50 });
    gsap.set('.hero-text-overlay', { transform: 'none' });

    const tl = gsap.timeline({ scrollTrigger: { trigger: ".hero-container", start: "top top", end: "bottom bottom", scrub: 0.5 } });
    tl.to(slabGroup.position, { y: 0, z: 0, ease: "power1.inOut", duration: 0.3 }, 0)
        .to(slabGroup.rotation, { x: 0, y: Math.PI * 1.2, z: 0.1, ease: "none", duration: 0.3 }, 0)
        .to(".scroll-indicator", { opacity: 0, duration: 0.05 }, 0.05)
        .fromTo(".sequence-1, .sequence-1-bg", { opacity: 1, scale: 1, filter: "blur(0px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", ease: "none", duration: 0.1 }, 0)
        .to(".sequence-1, .sequence-1-bg", { opacity: 0, scale: 1.1, filter: "blur(10px)", ease: "power2.in", duration: 0.1 }, 0.2)
        .to(slabGroup.position, { z: 8, x: -2, ease: "power1.inOut", duration: 0.3 }, 0.35)
        .to(slabGroup.rotation, { y: Math.PI * 2.5, x: -0.2, z: -0.1, ease: "none", duration: 0.3 }, 0.35)
        .to(mat2, { opacity: 1, ease: "none", duration: 0.15 }, 0.425)
        .fromTo(".sequence-2, .sequence-2-bg", { opacity: 0, scale: 0.9, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", ease: "power2.out", duration: 0.1 }, 0.4)
        .to(".sequence-2, .sequence-2-bg", { opacity: 0, scale: 1.1, filter: "blur(10px)", ease: "power2.in", duration: 0.1 }, 0.55)
        .to(slabGroup.position, { z: 12, x: 0, y: 1, ease: "power1.inOut", duration: 0.3 }, 0.7)
        .to(slabGroup.rotation, { y: Math.PI * 3.5, x: 0, z: 0, ease: "none", duration: 0.3 }, 0.7)
        .to(mat3, { opacity: 1, ease: "none", duration: 0.15 }, 0.775)
        .fromTo(".sequence-3, .sequence-3-bg", { opacity: 0, scale: 0.9, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", ease: "power2.out", duration: 0.1 }, 0.75)
        .to(".sequence-3, .sequence-3-bg", { opacity: 0, scale: 1.1, filter: "blur(10px)", ease: "power2.in", duration: 0.1 }, 0.9)
        .to(canvas, { opacity: 0, ease: "power1.in", duration: 0.1 }, 0.95);

    // === SPLIT TEXT REVEAL & SCROLL ANIMATIONS ===
    document.querySelectorAll('.reveal-text').forEach(el => {
        const text = el.innerText;
        el.innerHTML = '';
        text.split(' ').forEach((word, index) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;margin-right:0.1em;';
            const innerSpan = document.createElement('span');
            innerSpan.innerText = word;
            innerSpan.style.cssText = 'display:inline-block;transform:translateY(100%);opacity:0;will-change:transform,opacity;';
            wordSpan.appendChild(innerSpan);
            el.appendChild(wordSpan);
            gsap.to(innerSpan, { scrollTrigger: { trigger: el, start: "top 85%" }, y: 0, opacity: 1, duration: 1.2, ease: "power4.out", delay: index * 0.06 });
        });
    });

    gsap.utils.toArray('.section-header').forEach(h => {
        const eyebrow = h.querySelector('.section-eyebrow');
        const desc = h.querySelector('.section-description');
        if (eyebrow) gsap.from(eyebrow, { scrollTrigger: { trigger: h, start: "top 85%" }, y: 20, opacity: 0, duration: 1, ease: "power3.out" });
        if (desc) gsap.from(desc, { scrollTrigger: { trigger: h, start: "top 85%" }, y: 30, opacity: 0, duration: 1, ease: "power3.out", delay: 0.2 });
    });

    gsap.utils.toArray('.bento-item').forEach((b, i) => {
        gsap.from(b, { scrollTrigger: { trigger: b, start: "top 85%" }, y: 60, opacity: 0, scale: 0.95, duration: 1.2, ease: "power3.out", delay: i * 0.1 });
    });

    // === COLLECTIONS V3 — TABBED FILTER + ARROW SLIDER ===
    (function() {
        const tabs       = document.querySelectorAll('.col-tab');
        const indicator  = document.getElementById('col-tab-indicator');
        const track      = document.getElementById('col-track');
        const prevBtn    = document.getElementById('col-prev');
        const nextBtn    = document.getElementById('col-next');
        const currEl     = document.getElementById('col-curr');
        const totalEl    = document.getElementById('col-total');
        const fillEl     = document.getElementById('col-progress-fill');
        const viewport   = document.getElementById('col-viewport');

        if (!track || !prevBtn || !nextBtn) return;

        let allCards     = Array.from(track.querySelectorAll('.col-card'));
        let visibleCards = [...allCards];   // filtered subset
        let currentIndex = 0;              // index into visibleCards of leftmost visible card
        let cardsPerView = 3;              // how many cards shown at once

        /* ---- Compute cards per view based on viewport width ---- */
        function getCardsPerView() {
            const w = window.innerWidth;
            if (w <= 600) return 1;
            if (w <= 900) return 2;
            return 3;
        }

        /* ---- Move the indicator pill under the active tab ---- */
        function moveIndicator(btn) {
            if (!indicator || !btn) return;
            const tabsBox = btn.closest('.col-tabs');
            if (!tabsBox) return;
            const br = btn.getBoundingClientRect();
            const pr = tabsBox.getBoundingClientRect();
            indicator.style.width  = br.width + 'px';
            indicator.style.transform = `translateX(${br.left - pr.left - 5}px)`;
        }

        /* ---- Show / hide cards based on category filter ---- */
        function filterCards(cat) {
            allCards.forEach(c => {
                if (cat === 'all' || c.dataset.cat === cat) {
                    c.classList.remove('hidden');
                } else {
                    c.classList.add('hidden');
                }
            });
            visibleCards = allCards.filter(c => !c.classList.contains('hidden'));

            // Reset slider state
            currentIndex = 0;
            updateSlider(false);
        }

        /* ---- Translate the track so the right cards are in view ---- */
        function updateSlider(animate = true) {
            cardsPerView = getCardsPerView();

            if (!visibleCards.length) {
                track.style.transform = 'translateX(0)';
                updateUI();
                return;
            }

            // Clamp index
            const maxIndex = Math.max(0, visibleCards.length - cardsPerView);
            currentIndex   = Math.max(0, Math.min(currentIndex, maxIndex));

            // Calculate card width (including gap) from the visible cards
            const gapPx  = 24;
            const card   = visibleCards[0];
            const vw     = viewport.offsetWidth;
            // Each card's flex-basis = (vw - gaps) / cardsPerView
            const cardW  = (vw - gapPx * (cardsPerView - 1)) / cardsPerView;
            const offset = currentIndex * (cardW + gapPx);

            track.style.transition = animate
                ? 'transform 0.55s cubic-bezier(0.25, 1, 0.5, 1)'
                : 'none';
            track.style.transform  = `translateX(-${offset}px)`;

            updateUI();
        }

        /* ---- Update counter, progress bar, arrow states ---- */
        function updateUI() {
            cardsPerView = getCardsPerView();
            const total  = visibleCards.length;
            const maxIdx = Math.max(0, total - cardsPerView);

            if (currEl) currEl.textContent = total === 0 ? 0 : currentIndex + 1;
            if (totalEl) totalEl.textContent = total;

            const progress = maxIdx === 0 ? 100 : (currentIndex / maxIdx) * 100;
            if (fillEl) fillEl.style.width = progress + '%';

            if (prevBtn) prevBtn.disabled = currentIndex <= 0;
            if (nextBtn) nextBtn.disabled = currentIndex >= maxIdx || total === 0;
        }

        /* ---- Arrow button clicks ---- */
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) { currentIndex--; updateSlider(); }
        });
        nextBtn.addEventListener('click', () => {
            cardsPerView = getCardsPerView();
            const maxIdx = Math.max(0, visibleCards.length - cardsPerView);
            if (currentIndex < maxIdx) { currentIndex++; updateSlider(); }
        });

        /* ---- Tab clicks ---- */
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                moveIndicator(tab);
                filterCards(tab.dataset.cat);
            });
        });

        /* ---- 3D tilt on hover ---- */
        allCards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const r  = card.getBoundingClientRect();
                const x  = (e.clientX - r.left) / r.width  - 0.5;
                const y  = (e.clientY - r.top)  / r.height - 0.5;
                gsap.to(card, { rotateY: x * 10, rotateX: -y * 10, transformPerspective: 900, duration: 0.35, ease: 'power2.out' });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' });
            });
        });

        /* ---- Keyboard navigation ---- */
        document.addEventListener('keydown', e => {
            const colSection = document.getElementById('collections');
            if (!colSection) return;
            const rect = colSection.getBoundingClientRect();
            if (rect.top > window.innerHeight || rect.bottom < 0) return;
            if (e.key === 'ArrowLeft')  prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        });

        /* ---- Touch / swipe support ---- */
        let touchStartX = 0;
        viewport.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        viewport.addEventListener('touchend',   e => {
            const dx = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(dx) > 40) { dx > 0 ? nextBtn.click() : prevBtn.click(); }
        }, { passive: true });

        /* ---- Recalculate on resize ---- */
        window.addEventListener('resize', () => {
            updateSlider(false);
            const activeTab = document.querySelector('.col-tab.active');
            if (activeTab) moveIndicator(activeTab);
        });

        /* ---- Initial render ---- */
        setTimeout(() => {
            const firstActive = document.querySelector('.col-tab.active');
            if (firstActive) moveIndicator(firstActive);
            updateSlider(false);
        }, 120);
    })();

    // === Z-DEPTH TUNNEL (Projects — Sticky-Pin) ===
    const tunnelCards = document.querySelectorAll('.tunnel-card');
    const tDots       = document.querySelectorAll('.t-dot');
    let currentTunnel = -1;

    function showTunnelCard(idx) {
        if (idx === currentTunnel) return;
        tunnelCards.forEach((c, i) => {
            c.style.transition = 'opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1), filter 0.75s ease';
            if (i === idx) {
                c.classList.add('is-active');
                c.classList.remove('is-exit');
            } else if (i === currentTunnel) {
                c.classList.remove('is-active');
                c.classList.add('is-exit');
                setTimeout(() => c.classList.remove('is-exit'), 900);
            } else {
                c.classList.remove('is-active', 'is-exit');
            }
        });
        tDots.forEach((d, i) => d.classList.toggle('active', i === idx));
        currentTunnel = idx;
    }
    showTunnelCard(0);

    // Drive card changes from scroll through the TALL pin-wrap container
    const tunnelPinWrap = document.querySelector('.tunnel-pin-wrap');
    if (tunnelPinWrap && tunnelCards.length) {
        ScrollTrigger.create({
            trigger: tunnelPinWrap,
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => {
                // Each card occupies an equal fraction of the scroll range
                const rawIdx = self.progress * tunnelCards.length;
                const idx    = Math.min(Math.floor(rawIdx), tunnelCards.length - 1);
                showTunnelCard(idx);
            }
        });
    }

    // === ABOUT SPLIT CURTAIN ===
    const curtainTop = document.querySelector('.about-curtain--top');
    const curtainBot = document.querySelector('.about-curtain--bot');
    if (curtainTop && curtainBot) {
        gsap.to(curtainTop, {
            yPercent: -100,
            ease: "power2.inOut",
            scrollTrigger: { trigger: '#about', start: 'top 70%', end: 'top 20%', scrub: 1.5 }
        });
        gsap.to(curtainBot, {
            yPercent: 100,
            ease: "power2.inOut",
            scrollTrigger: { trigger: '#about', start: 'top 70%', end: 'top 20%', scrub: 1.5 }
        });
        gsap.from('.about-content', {
            x: -60, opacity: 0, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: '#about', start: 'top 30%' }
        });
        gsap.from('.about-map', {
            x: 60, opacity: 0, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: '#about', start: 'top 30%' }
        });
    }

    // === ANIMATED STAT COUNTER (Odometer-style) ===
    document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        ScrollTrigger.create({
            trigger: el, start: "top 85%",
            onEnter: () => {
                let obj = { val: 0 };
                gsap.to(obj, {
                    val: target, duration: 2.5, ease: "power3.out",
                    onUpdate: () => { el.textContent = Math.floor(obj.val) + '+'; }
                });
            },
            once: true
        });
    });



    // === TAB SEGMENTED CONTROL ===
    const segmentBtns = document.querySelectorAll('.segment-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const segmentIndicator = document.querySelector('.segment-indicator');
    function updateIndicator(btn) {
        if (!btn || !segmentIndicator) return;
        const r = btn.getBoundingClientRect(), p = btn.parentElement.getBoundingClientRect();
        segmentIndicator.style.width = r.width + 'px';
        segmentIndicator.style.transform = `translateX(${r.left - p.left}px)`;
    }
    const activeBtn = document.querySelector('.segment-btn.active');
    if (activeBtn) setTimeout(() => updateIndicator(activeBtn), 100);
    segmentBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            segmentBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.target).classList.add('active');
            updateIndicator(btn);
            ScrollTrigger.refresh();
        });
    });
    window.addEventListener('resize', () => { const a = document.querySelector('.segment-btn.active'); if (a) updateIndicator(a); });

    // === SLIDER CONTROLS ===
    document.querySelectorAll('.slider-container').forEach(c => {
        const g = c.querySelector('.product-grid'), p = c.querySelector('.prev-btn'), n = c.querySelector('.next-btn');
        if (p && n && g) {
            p.addEventListener('click', () => g.scrollBy({ left: -340, behavior: 'smooth' }));
            n.addEventListener('click', () => g.scrollBy({ left: 340, behavior: 'smooth' }));
        }
    });

    // === HEADER & FLOATING CTA VISIBILITY ===
    const mainHeader = document.querySelector('.main-header');
    const floatingCta = document.querySelector('.floating-cta-bar');
    if (floatingCta) {
        ScrollTrigger.create({
            trigger: "#hero-container",
            start: "bottom top",
            onEnter: () => {
                if (mainHeader) mainHeader.classList.add('header-visible');
                floatingCta.classList.add('cta-visible');
            },
            onLeaveBack: () => {
                if (mainHeader) mainHeader.classList.remove('header-visible');
                floatingCta.classList.remove('cta-visible');
            }
        });
    }

    // === SECTION OBSERVER & LINK SCROLLING ===
    const headerLinks = document.querySelectorAll('.header-nav-link');
    const sections = ['collections', 'projects', 'how-we-work', 'about'].map(id => document.getElementById(id));

    const sectionObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const id = e.target.id;
                headerLinks.forEach(l => {
                    if (!l.classList.contains('search-btn')) {
                        l.classList.remove('active');
                        if (l.getAttribute('href') === '#'+id) l.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: "-20% 0px -70% 0px" });
    sections.forEach(s => { if (s) sectionObs.observe(s); });

    headerLinks.forEach(link => {
        if (!link.classList.contains('search-btn')) {
            link.addEventListener('click', e => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const t = document.querySelector(targetId);
                if (t) lenis.scrollTo(t, { offset: -100, duration: 1.5 });
            });
        }
    });

    // === SEARCH MODAL ===
    const searchTrigger = document.getElementById('search-trigger'), searchModal = document.getElementById('search-modal');
    const searchClose = document.getElementById('search-close'), searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (searchTrigger && searchModal && searchClose && searchInput && searchResults) {
        const products = [];
        document.querySelectorAll('.product-card').forEach(card => {
            const t = card.querySelector('h3'), d = card.querySelector('p'), img = card.querySelector('img');
            if (t && d) products.push({ title: t.textContent, desc: d.textContent, imgSrc: img ? img.src : null, element: card });
        });

        function renderResults(q) {
            searchResults.innerHTML = '';
            if (!q.trim()) return;
            const lq = q.toLowerCase();
            const filtered = products.filter(p => p.title.toLowerCase().includes(lq) || p.desc.toLowerCase().includes(lq));
            if (!filtered.length) { searchResults.innerHTML = '<div class="no-results">No matches found for "' + q + '"</div>'; return; }
            filtered.forEach(p => {
                const item = document.createElement('a');
                item.href = '#collections'; item.className = 'search-result-item';
                item.innerHTML = `${p.imgSrc ? `<img src="${p.imgSrc}" alt="${p.title}" class="search-result-img">` : '<div class="search-result-img"></div>'}<div class="search-result-info"><h4>${p.title}</h4><p>${p.desc}</p></div>`;
                item.addEventListener('click', () => { searchModal.classList.remove('active'); const tab = p.element.closest('.tab-content'); if (tab) { const btn = document.querySelector(`.segment-btn[data-target="${tab.id}"]`); if (btn) btn.click(); } });
                searchResults.appendChild(item);
            });
        }
        searchInput.addEventListener('input', e => renderResults(e.target.value));
        searchTrigger.addEventListener('click', e => { e.preventDefault(); searchModal.classList.add('active'); setTimeout(() => searchInput.focus(), 100); });
        searchClose.addEventListener('click', () => { searchModal.classList.remove('active'); searchInput.value = ''; searchResults.innerHTML = ''; });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && searchModal.classList.contains('active')) { searchModal.classList.remove('active'); searchInput.value = ''; searchResults.innerHTML = ''; } });
    }

    // === STACKED PROJECT CARDS ===
    const projectCards = document.querySelectorAll('.project-card-stack');
    projectCards.forEach((card, i) => {
        if (i === projectCards.length - 1) return;
        gsap.to(card, { scale: 0.85, opacity: 0.3, scrollTrigger: { trigger: projectCards[i + 1], start: "top bottom", end: "top top+=150", scrub: true } });
    });

    // === MAGNETIC BUTTONS ===
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width/2) * 0.3, y = (e.clientY - r.top - r.height/2) * 0.3;
            btn.style.transform = `translate(${x}px, ${y}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
    });

    // === PARALLAX ON ABOUT MAP ===
    const mapImg = document.querySelector('.map-image');
    if (mapImg) {
        gsap.to(mapImg, { y: -30, scrollTrigger: { trigger: '.about-section', start: 'top bottom', end: 'bottom top', scrub: true } });
    }

    // === FOOTER CTA ANIMATION ===
    const footerCta = document.querySelector('.footer-cta');
    if (footerCta) {
        gsap.from(footerCta, { scrollTrigger: { trigger: footerCta, start: "top 85%" }, y: 60, opacity: 0, duration: 1.5, ease: "power3.out" });
    }


});
