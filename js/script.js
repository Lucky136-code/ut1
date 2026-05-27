document.addEventListener("DOMContentLoaded", () => {
    // === PRELOADER ===
    const preloader = document.getElementById('preloader');
    const preloaderTl = gsap.timeline();
    preloaderTl
        .to('.preloader-logo', { opacity: 1, duration: 0.8, ease: "power2.out" })
        .to('.preloader-tagline', { opacity: 1, duration: 0.6 }, "-=0.3")
        .to('.preloader-progress', { width: '100%', duration: 1.5, ease: "power2.inOut" }, "-=0.5")
        .to(preloader, { yPercent: -100, duration: 0.8, ease: "power3.inOut", delay: 0.2, onComplete: () => { preloader.style.display = 'none'; } });

    // === CUSTOM CURSOR ===
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('cursor-follower');
    if (cursor && follower && window.matchMedia("(hover: hover)").matches) {
        let mx = 0, my = 0, fx = 0, fy = 0;
        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; });
        function animateFollower() { fx += (mx - fx) * 0.12; fy += (my - fy) * 0.12; follower.style.left = fx + 'px'; follower.style.top = fy + 'px'; requestAnimationFrame(animateFollower); }
        animateFollower();
        document.querySelectorAll('a, button, .product-card, .bento-item, .cta-button').forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
                if (el.classList.contains('product-card')) {
                    document.body.classList.add('cursor-view');
                    follower.setAttribute('data-label', 'View');
                } else if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.classList.contains('cta-button')) {
                    document.body.classList.add('cursor-view');
                    follower.setAttribute('data-label', 'Click');
                }
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover', 'cursor-view');
                follower.removeAttribute('data-label');
            });
        });
        document.body.style.cursor = 'none';
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

    // === DYNAMIC NAV ===
    const dynamicNav = document.getElementById('dynamic-nav');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = ['collections', 'projects', 'how-we-work', 'about'].map(id => document.getElementById(id));
    const navGlow = document.querySelector('.nav-glow');

    ScrollTrigger.create({ trigger: ".collections-v3", start: "top 80%", onEnter: () => dynamicNav.classList.add('visible'), onLeaveBack: () => dynamicNav.classList.remove('visible') });

    if (dynamicNav && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        dynamicNav.addEventListener('mousemove', e => {
            const r = dynamicNav.getBoundingClientRect();
            const x = e.clientX - r.left, y = e.clientY - r.top;
            const rx = ((y - r.height/2) / (r.height/2)) * -15, ry = ((x - r.width/2) / (r.width/2)) * 15;
            dynamicNav.style.transform = `translateX(-50%) perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.05,1.05,1.05)`;
            navGlow.style.width = '120px'; navGlow.style.height = '120px'; navGlow.style.left = x+'px'; navGlow.style.top = y+'px';
        });
        dynamicNav.addEventListener('mouseleave', () => {
            dynamicNav.style.transform = `translateX(-50%) perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`;
            navGlow.style.width = '0'; navGlow.style.height = '0';
        });
    }

    const sectionObs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { const id = e.target.id; navItems.forEach(l => { if (!l.classList.contains('search-btn')) { l.classList.remove('active'); if (l.getAttribute('href') === '#'+id) l.classList.add('active'); } }); } });
    }, { rootMargin: "-20% 0px -70% 0px" });
    sections.forEach(s => { if (s) sectionObs.observe(s); });

    navItems.forEach(link => {
        if (!link.classList.contains('search-btn')) {
            link.addEventListener('click', e => { e.preventDefault(); const t = document.querySelector(link.getAttribute('href')); if (t) lenis.scrollTo(t, { offset: -100, duration: 1.5 }); });
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

    // === ROOM VISUALIZER (AI-Powered — Two-Stage Scan+Apply) ===
    (function() {
        const API_BASE = 'http://localhost:8000';

        const MATERIALS = [
            { id: 'obsidian-noir',   cat: 'marble',     name: 'Obsidian Noir',   img: '/assets/marble_dark_texture.png' },
            { id: 'calacatta-oro',   cat: 'marble',     name: 'Calacatta Oro',   img: '/assets/marble_gold.png' },
            { id: 'statuario-pure',  cat: 'marble',     name: 'Statuario Pure',  img: '/assets/statuario_pure.png' },
            { id: 'emperador-dark',  cat: 'marble',     name: 'Emperador Dark',  img: '/assets/emperador_dark.png' },
            { id: 'cosmic-black',    cat: 'granite',    name: 'Cosmic Black',    img: '/assets/cosmic_black.png' },
            { id: 'blue-pearl',      cat: 'granite',    name: 'Blue Pearl',      img: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=400' },
            { id: 'kashmir-white',   cat: 'granite',    name: 'Kashmir White',   img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=400' },
            { id: 'sculpted-vases',  cat: 'handicraft', name: 'Sculpted Vases',  img: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=400' },
            { id: 'inlay-tabletops', cat: 'handicraft', name: 'Inlay Tabletops', img: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=400' },
            { id: 'figurines',       cat: 'handicraft', name: 'Marble Figurines',img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=400' },
        ];

        const LOADING_MSGS = [
            'Segmenting your room…',
            'Detecting surfaces…',
            'Applying material texture…',
            'Lighting & blending…',
            'Almost done…'
        ];

        // DOM refs
        const modal        = document.getElementById('viz-modal');
        const trigger      = document.getElementById('viz-trigger');
        const closeBtn     = document.getElementById('viz-close');
        const grid         = document.getElementById('viz-mat-grid');
        const slab         = document.getElementById('viz-slab');
        const selName      = document.getElementById('viz-sel-name');
        const uploadZone   = document.getElementById('viz-upload-zone');
        const fileInput    = document.getElementById('viz-file-input');
        const uploadBtn    = document.getElementById('viz-upload-btn');
        const resultImg    = document.getElementById('viz-result-img');
        const loading      = document.getElementById('viz-loading');
        const loadingText  = document.getElementById('viz-loading-text');
        const resultBar    = document.getElementById('viz-result-bar');
        const resultLabel  = document.getElementById('viz-result-label');
        const reuploadBtn  = document.getElementById('viz-reupload-btn');
        const apiDot       = document.getElementById('viz-api-dot');
        const apiLabel     = document.getElementById('viz-api-label');
        if (!modal || !trigger) return;

        let roomImageB64   = null;
        let scannedMaskB64 = null;   // result of /api/scan
        let scanDone       = false;
        let selectedMat    = null;
        let currentRoomType= 'hall';
        let currentPattern = 'grid';
        let apiOnline      = false;
        let loadMsgTimer   = null;

        // Inject scan button + scan overlay elements into the DOM
        (function injectScanUI() {
            // Scan button next to upload
            const scanBtn = document.createElement('button');
            scanBtn.id = 'viz-scan-btn';
            scanBtn.className = 'viz-scan-btn';
            scanBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg> Scan Floor';
            scanBtn.style.cssText = 'display:none;margin-top:10px;padding:10px 22px;border-radius:50px;border:none;background:linear-gradient(135deg,#00c6ff,#0072ff);color:#fff;font-weight:600;cursor:pointer;font-size:13px;letter-spacing:.5px;transition:opacity .2s;';
            const resultBar = document.getElementById('viz-result-bar');
            if (resultBar) resultBar.parentNode.insertBefore(scanBtn, resultBar);

            // Scan status badge
            const badge = document.createElement('div');
            badge.id = 'viz-scan-badge';
            badge.style.cssText = 'display:none;padding:6px 14px;border-radius:50px;background:rgba(0,198,255,.15);border:1px solid rgba(0,198,255,.4);color:#00c6ff;font-size:12px;font-weight:600;margin-top:8px;text-align:center;';
            badge.textContent = '✓ Floor scanned — select a texture to apply';
            if (resultBar) resultBar.parentNode.insertBefore(badge, resultBar);
        })();

        const scanBtn   = document.getElementById('viz-scan-btn');
        const scanBadge = document.getElementById('viz-scan-badge');

        // ── Build material cards ──────────────────
        MATERIALS.forEach(mat => {
            const card = document.createElement('div');
            card.className = 'viz-mat-card';
            card.dataset.cat = mat.cat;
            card.dataset.id  = mat.id;
            card.innerHTML = `
                <div class="viz-mat-thumb" style="background-image:url('${mat.img}')"></div>
                <div class="viz-mat-info">
                    <span class="viz-mat-tag">${mat.cat}</span>
                    <h4>${mat.name}</h4>
                </div>`;
            card.addEventListener('click', () => selectMaterial(mat, card));
            grid.appendChild(card);
        });

        // ── Utilities ─────────────────────────────
        async function urlToBase64(url) {
            const resp = await fetch(url);
            const blob = await resp.blob();
            return new Promise(res => {
                const r = new FileReader();
                r.onload = () => res(r.result);
                r.readAsDataURL(blob);
            });
        }

        function fileToBase64(file) {
            return new Promise(res => {
                const r = new FileReader();
                r.onload = () => res(r.result);
                r.readAsDataURL(file);
            });
        }

        function showLoading(show) {
            loading.style.display = show ? 'flex' : 'none';
            if (show) {
                let i = 0;
                loadingText.textContent = LOADING_MSGS[0];
                loadMsgTimer = setInterval(() => {
                    i = (i + 1) % LOADING_MSGS.length;
                    loadingText.textContent = LOADING_MSGS[i];
                }, 2200);
            } else {
                clearInterval(loadMsgTimer);
            }
        }

        function showResult(src, matName, roomType) {
            resultImg.src = src;
            resultImg.style.display = 'block';
            uploadZone.style.display = 'none';
            resultBar.style.display  = 'flex';
            resultLabel.textContent  = matName + ' • ' + roomType;
        }

        function resetToUpload() {
            roomImageB64 = null;
            selectedMat  = null;
            resultImg.style.display  = 'none';
            resultBar.style.display  = 'none';
            uploadZone.style.display = '';
            if (slab) { slab.style.backgroundImage = ''; slab.classList.remove('loaded'); }
            if (selName) selName.textContent = '— select a material —';
            document.querySelectorAll('.viz-mat-card').forEach(c => c.classList.remove('selected'));
        }

        // ── SCAN floor — runs ONCE per image, stores scan_token ────────────────
        async function runScan() {
            if (!roomImageB64 || !apiOnline) return;
            // If already scanned for this image, skip re-scan
            if (scanDone && scannedMaskB64) {
                if (selectedMat) runRender(selectedMat);
                return;
            }
            scanBtn.disabled = true;
            scanBtn.textContent = '⏳ Scanning…';
            showLoading(true);
            try {
                const resp = await fetch(`${API_BASE}/api/scan`, {
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({room_image: roomImageB64, room_type: currentRoomType})
                });
                if (!resp.ok) throw new Error(await resp.text());
                const data = await resp.json();
                showLoading(false);
                scannedMaskB64   = data.floor_mask_url;
                window._scanToken= data.scan_token;   // store for render calls
                scanDone = true;
                // Show the scan preview (teal overlay)
                resultImg.src = data.scan_image_url;
                resultImg.style.display = 'block';
                uploadZone.style.display = 'none';
                resultBar.style.display = 'flex';
                resultLabel.textContent = `Floor detected — ${data.coverage_pct}% coverage · Now select a texture →`;
                scanBadge.style.display = 'block';
                scanBtn.style.display = 'none';
            } catch(err) {
                showLoading(false);
                scanBtn.disabled = false;
                scanBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Retry Scan';
                console.error('Scan error:', err);
            }
        }

        if (scanBtn) scanBtn.addEventListener('click', runScan);

        // ── RENDER with texture — uses scan_token so NO re-scan ────────────────
        async function runRender(mat) {
            if (!roomImageB64) return;
            // Gate: must scan first
            if (!scanDone && apiOnline) { runScan(); selectedMat = mat; return; }
            showLoading(true);
            try {
                const texB64     = await urlToBase64(mat.img);
                const surfaceMap = {hall:'floor',kitchen:'countertop',bathroom:'wall'};
                const surface    = surfaceMap[currentRoomType] || 'floor';
                const body       = {
                    room_image:       roomImageB64,
                    room_type:        currentRoomType,
                    surface_textures: {[surface]: mat.id},
                    floor_pattern:    currentPattern,
                    texture_data:     {[mat.id]: texB64},
                };
                // Key fix: pass scan_token so server uses cached floor mask
                if (window._scanToken) body.scan_token = window._scanToken;
                const resp = await fetch(`${API_BASE}/api/render`, {
                    method:'POST', headers:{'Content-Type':'application/json'},
                    body: JSON.stringify(body)
                });
                if (!resp.ok) throw new Error(await resp.text());
                const data = await resp.json();
                showLoading(false);
                showResult(data.final_image_url, mat.name, surface);
            } catch(err) {
                showLoading(false);
                loadingText.textContent = 'Render failed — '+(err.message||'check server');
                loading.style.display = 'flex';
                setTimeout(()=>{loading.style.display='none';}, 3500);
                console.error('Render error:', err);
            }
        }

        // ── Material selection (instant after scan — no re-scan) ───────────────
        function selectMaterial(mat, cardEl) {
            selectedMat = mat;
            document.querySelectorAll('.viz-mat-card').forEach(c => c.classList.remove('selected'));
            cardEl.classList.add('selected');
            if (slab)    { slab.style.backgroundImage=`url('${mat.img}')`;slab.classList.add('loaded'); }
            if (selName) selName.textContent = mat.name;

            if (!roomImageB64) {
                uploadZone.classList.add('drag-over');
                setTimeout(()=>uploadZone.classList.remove('drag-over'),800);
                return;
            }
            if (!apiOnline) {
                showResult(roomImageB64, mat.name+' (AI offline)', currentRoomType); return;
            }
            // Floor already scanned → render immediately (no re-scan)
            if (scanDone) { runRender(mat); }
            else          { runScan();      }   // will auto-render after scan
        }

        // ── Room photo upload ─────────────────────
        async function handleImageFile(file) {
            if (!file || !file.type.startsWith('image/')) return;
            roomImageB64 = await fileToBase64(file);
            scanDone = false; scannedMaskB64 = null;
            if (scanBadge) scanBadge.style.display = 'none';
            uploadZone.style.display = 'none';
            resultImg.src = roomImageB64;
            resultImg.style.display = 'block';
            resultBar.style.display = 'flex';
            resultLabel.textContent = 'Room loaded — click Scan Floor to detect the floor area';
            // Show scan button
            if (scanBtn) { scanBtn.style.display = 'inline-flex'; scanBtn.disabled = false;
                scanBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg> Scan Floor'; }
        }

        uploadBtn.addEventListener('click', e => { e.stopPropagation(); fileInput.click(); });
        fileInput.addEventListener('change', () => { if (fileInput.files[0]) handleImageFile(fileInput.files[0]); });

        // Drag-drop on upload zone
        uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
        uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
        uploadZone.addEventListener('drop', e => {
            e.preventDefault(); uploadZone.classList.remove('drag-over');
            if (e.dataTransfer.files[0]) handleImageFile(e.dataTransfer.files[0]);
        });
        uploadZone.addEventListener('click', () => fileInput.click());

        // Preset buttons
        document.querySelectorAll('.viz-preset').forEach(btn => {
            btn.addEventListener('click', async e => {
                e.stopPropagation();
                const rt  = btn.dataset.presetRt;
                const url = btn.dataset.presetImg;
                currentRoomType = rt;
                scanDone = false; scannedMaskB64 = null;
                if (scanBadge) scanBadge.style.display = 'none';
                document.querySelectorAll('.viz-rt').forEach(b => b.classList.toggle('active', b.dataset.rt === rt));
                roomImageB64 = await urlToBase64(url);
                uploadZone.style.display = 'none';
                resultImg.src = roomImageB64;
                resultImg.style.display = 'block';
                resultBar.style.display = 'flex';
                resultLabel.textContent = 'Room loaded — click Scan Floor to detect surfaces';
                if (scanBtn) { scanBtn.style.display = 'inline-flex'; scanBtn.disabled = false;
                    scanBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg> Scan Floor'; }
            });
        });

        // Re-upload button
        if (reuploadBtn) reuploadBtn.addEventListener('click', () => {
            scanDone = false; scannedMaskB64 = null; window._scanToken = null;
            if (scanBadge) scanBadge.style.display = 'none';
            if (scanBtn)   scanBtn.style.display = 'none';
            resetToUpload();
        });

        // ── Room type + Pattern selectors ─────────
        document.querySelectorAll('.viz-rt').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.viz-rt').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentRoomType = btn.dataset.rt;
                if (selectedMat && roomImageB64 && apiOnline) runRender(selectedMat);
            });
        });
        document.querySelectorAll('.viz-pat').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.viz-pat').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentPattern = btn.dataset.pat;
                if (selectedMat && roomImageB64 && apiOnline) runRender(selectedMat);
            });
        });

        // ── Category tabs ─────────────────────────
        document.querySelectorAll('.viz-cat').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.viz-cat').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const cat = btn.dataset.cat;
                document.querySelectorAll('.viz-mat-card').forEach(card => {
                    card.classList.toggle('viz-mat-hidden', cat !== 'all' && card.dataset.cat !== cat);
                });
            });
        });

        // ── Backend health check ──────────────────
        async function checkApi() {
            if (!apiDot) return;
            apiDot.className = 'viz-api-dot checking';
            apiLabel.textContent = 'Connecting to AI engine…';
            try {
                const r = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
                const d = await r.json();
                apiOnline = true;
                apiDot.className = 'viz-api-dot online';
                apiLabel.textContent = `AI Engine Online · ${d.device?.toUpperCase()} · ${d.seg_cache}/${d.cache_limit} cached`;
            } catch {
                apiOnline = false;
                apiDot.className = 'viz-api-dot offline';
                apiLabel.textContent = 'AI Engine Offline — start server.py to enable';
            }
        }

        // ── Open / Close ──────────────────────────
        function openViz() {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            checkApi();
        }
        function closeViz() {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        trigger.addEventListener('click', e => { e.preventDefault(); openViz(); });
        closeBtn.addEventListener('click', closeViz);
        modal.addEventListener('click', e => { if (e.target === modal) closeViz(); });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && modal.classList.contains('active')) closeViz();
        });

        // Wire up any data-open-viz CTAs on the page
        document.querySelectorAll('[data-open-viz]').forEach(el => {
            el.addEventListener('click', e => { e.preventDefault(); openViz(); });
        });
    })();
});

