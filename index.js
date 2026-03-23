/* ═══════════════════════════════════════════════════════════════
   INTRO CONTROLLER
═══════════════════════════════════════════════════════════════ */
(function() {
    var introEl = document.getElementById('intro-screen');
    if (!introEl) return;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    var done = false;
    var isMob = window.innerWidth <= 768;
    var HOLD = isMob ? 2400 : 4400;

    function unlock() {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.classList.add('site-ready');
        window.dispatchEvent(new Event('scroll'));
    }

    function removeIntro() {
        var el = document.getElementById('intro-screen');
        if (!el) return;
        el.style.display = 'none';
        try { if (el.parentNode) el.parentNode.removeChild(el); } catch (e) {}
    }

    function exit() {
        if (done) return;
        done = true;
        var hint = document.getElementById('intro-skip-hint');
        if (hint) hint.style.display = 'none';
        introEl.style.pointerEvents = 'none';
        unlock();
        introEl.classList.add('intro-exit');
        setTimeout(removeIntro, 1400);
    }

    var timer = setTimeout(exit, HOLD);

    setTimeout(function() {
        if (done) return;

        function skip() {
            clearTimeout(timer);
            exit();
        }
        document.addEventListener('keydown', skip, { once: true });
        introEl.addEventListener('click', skip, { once: true });
        introEl.addEventListener('touchend', skip, { once: true });
    }, isMob ? 1200 : 2000);

    setTimeout(function() {
        unlock();
        removeIntro();
    }, 8000);
}());


/* ═══════════════════════════════════════════════════════════════
   LENIS
═══════════════════════════════════════════════════════════════ */
const lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true
});

function rafLoop(t) {
    lenis.raf(t);
    requestAnimationFrame(rafLoop);
}
requestAnimationFrame(rafLoop);


/* ═══════════════════════════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════════════════════════ */
let mx = window.innerWidth / 2,
    my = window.innerHeight / 2;
let dx = mx,
    dy = my,
    rx = mx,
    ry = my,
    moved = false;
const curDot = document.getElementById('cursor-dot');
const curRing = document.getElementById('cursor-ring');

window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    moved = true;
});

function tickCursor() {
    if (moved) {
        dx += (mx - dx) * .5;
        dy += (my - dy) * .5;
        rx += (mx - rx) * .2;
        ry += (my - ry) * .2;
        if (curDot) curDot.style.transform = `translate3d(${dx-3}px,${dy-3}px,0)`;
        if (curRing) curRing.style.transform = `translate3d(${rx-18}px,${ry-18}px,0)`;
        if (Math.abs(rx - mx) < .5 && Math.abs(ry - my) < .5) moved = false;
    }
    requestAnimationFrame(tickCursor);
}
tickCursor();

document.body.addEventListener('mouseover', e => {
    document.body.classList.toggle('cursor-hover', !!e.target.closest('.hover-target'));
});


/* ═══════════════════════════════════════════════════════════════
   WAVE TEXT
═══════════════════════════════════════════════════════════════ */
document.querySelectorAll('.wave-text').forEach(el => {
    const raw = el.textContent.trim();
    if (raw.length > 120) return;
    el.innerHTML = '';
    let ci = 0;
    raw.split(' ').forEach((word, wi, arr) => {
        const ws = document.createElement('span');
        ws.className = 'word';
        [...word].forEach(ch => {
            const cs = document.createElement('span');
            cs.className = 'char';
            cs.textContent = ch;
            cs.style.animationDelay = `${ci * .04}s`;
            ws.appendChild(cs);
            ci++;
        });
        el.appendChild(ws);
        if (wi < arr.length - 1) {
            el.appendChild(document.createTextNode(' '));
            ci++;
        }
    });
});


/* ═══════════════════════════════════════════════════════════════
   HERO BACKGROUND
═══════════════════════════════════════════════════════════════ */
const isMobile = window.innerWidth <= 768;
const scrollCont = document.getElementById('video-scroll-container');
const dockEl = document.getElementById('bottom-dock');
let lenisY = 0;

lenis.on('scroll', ({ scroll }) => {
    lenisY = scroll;
    const heroHeight = window.innerHeight * 1.5;
    if (window.innerWidth > 768) dockEl.classList.toggle('docked', scroll > heroHeight);
    const headerEl = document.getElementById('main-header');
    headerEl.classList.toggle('show-header', scroll > heroHeight);
    headerEl.classList.toggle('scrolled', scroll > heroHeight + 80);
});

if (isMobile) {
    const cvs = document.getElementById('parallax-canvas');
    if (cvs) cvs.style.display = 'none';

    const heroSec = document.getElementById('hero-section');
    const vWrap = heroSec ? heroSec.querySelector('.hero-video-container') : null;

    if (vWrap) {
        const vid = document.createElement('video');
        vid.setAttribute('autoplay', '');
        vid.setAttribute('muted', '');
        vid.setAttribute('loop', '');
        vid.setAttribute('playsinline', '');
        vid.setAttribute('preload', 'auto');
        vid.setAttribute('aria-hidden', 'true');
        Object.assign(vid.style, {
            position: 'absolute',
            inset: '0',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: '-2',
            pointerEvents: 'none',
            opacity: '0',
            transition: 'opacity .8s ease',
            willChange: 'opacity',
        });
        const src = document.createElement('source');
        src.src = 'hero.mp4';
        src.type = 'video/mp4';
        vid.appendChild(src);
        vWrap.appendChild(vid);

        let videoOk = false;

        function startVideo() {
            if (videoOk) return;
            videoOk = true;
            vid.muted = true;
            const p = vid.play();
            if (p && p.catch) p.catch(() => {});
            vid.style.opacity = '1';
            clearTimeout(fallbackTimer);
        }

        vid.addEventListener('canplay', startVideo, { once: true });
        vid.addEventListener('canplaythrough', startVideo, { once: true });

        const fallbackTimer = setTimeout(() => {
            if (!videoOk) {
                if (vid.parentNode) vid.parentNode.removeChild(vid);
                buildCrossfade(vWrap);
            }
        }, 2500);

        vid.addEventListener('error', () => {
            if (!videoOk) {
                clearTimeout(fallbackTimer);
                if (vid.parentNode) vid.parentNode.removeChild(vid);
                buildCrossfade(vWrap);
            }
        });
    }
}

function buildCrossfade(vWrap) {
    const FRAMES = [1, 30, 60, 90, 120, 150, 180, 210, 240];
    const layers = [];

    const clip = document.createElement('div');
    Object.assign(clip.style, {
        position: 'absolute',
        inset: '0',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: '-2',
        pointerEvents: 'none',
    });

    FRAMES.forEach((n, i) => {
        const img = document.createElement('img');
        img.src = `frames/frame_${n.toString().padStart(4,'0')}.jpg`;
        img.setAttribute('aria-hidden', 'true');
        img.alt = '';
        img.setAttribute('loading', i === 0 ? 'eager' : 'lazy');
        Object.assign(img.style, {
            position: 'absolute',
            inset: '0',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: i === 0 ? '1' : '0',
            transition: 'opacity .6s ease-in-out',
            willChange: 'opacity',
            pointerEvents: 'none',
        });
        clip.appendChild(img);
        layers.push(img);
    });
    vWrap.appendChild(clip);

    let activeIdx = 0,
        scrollIdx = 0,
        slideshowIdx = 0;

    setInterval(() => {
        slideshowIdx = (slideshowIdx + 1) % FRAMES.length;
        const next = Math.max(slideshowIdx, scrollIdx);
        if (next !== activeIdx) {
            layers[activeIdx].style.opacity = '0';
            layers[next].style.opacity = '1';
            activeIdx = next;
        }
    }, 1800);

    lenis.on('scroll', ({ scroll }) => {
        const max = scrollCont.offsetHeight - window.innerHeight;
        const prog = max > 0 ? Math.max(0, Math.min(scroll / max, 1)) : 0;
        scrollIdx = Math.min(Math.floor(prog * (FRAMES.length - 1)), FRAMES.length - 1);
        if (scrollIdx > activeIdx) {
            layers[activeIdx].style.opacity = '0';
            layers[scrollIdx].style.opacity = '1';
            activeIdx = scrollIdx;
        }
    });
}

if (!isMobile) {
    const cvs = document.getElementById('parallax-canvas');
    const ctx = cvs.getContext('2d');
    const TOTAL = 240;
    const imgs = [];
    for (let i = 0; i < TOTAL; i++) {
        const img = new Image();
        img.src = `frames/frame_${(i+1).toString().padStart(4,'0')}.jpg`;
        imgs.push(img);
    }
    imgs[0].onload = () => {
        cvs.width = imgs[0].naturalWidth || 1920;
        cvs.height = imgs[0].naturalHeight || 1080;
        ctx.drawImage(imgs[0], 0, 0, cvs.width, cvs.height);
    };
    let curF = 0,
        lastIdx = -1;

    function tickCanvas() {
        const max = scrollCont.offsetHeight - window.innerHeight;
        const prog = max > 0 ? Math.max(0, Math.min(lenisY / max, 1)) : 0;
        curF += (prog * (TOTAL - 1) - curF) * .08;
        const idx = Math.min(Math.floor(curF), TOTAL - 1);
        if (idx !== lastIdx && imgs[idx] && imgs[idx].complete && imgs[idx].naturalWidth > 0) {
            if (!cvs.width) {
                cvs.width = imgs[idx].naturalWidth || 1920;
                cvs.height = imgs[idx].naturalHeight || 1080;
            }
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            ctx.drawImage(imgs[idx], 0, 0, cvs.width, cvs.height);
            lastIdx = idx;
        }
        requestAnimationFrame(tickCanvas);
    }
    tickCanvas();
}


/* ═══════════════════════════════════════════════════════════════
   COLLECTIONS DATA
═══════════════════════════════════════════════════════════════ */
const collectionsData = {
    marble: {
        label: 'Marble',
        title: 'Marble Collection',
        groups: [{
            groupName: 'Premium Italian Marble',
            stones: [
                { name: 'Italy Dyna', price: '&#8377;180/sq ft', img: 'stones/italy-dyna.jpg', gradient: 'linear-gradient(135deg,#f0ede6,#e8e0d0)', description: 'Elegant Italian marble with warm beige tones and subtle veining. Perfect for luxury residential interiors with exceptional durability and timeless appeal.' },
                { name: 'Ormanno', price: '&#8377;210/sq ft', img: 'stones/ormanno.jpg', gradient: 'linear-gradient(135deg,#ede8e0,#ddd5c8)', description: 'Premium grade marble featuring soft cream undertones with delicate grey veins. Ideal for sophisticated flooring and wall cladding in high-end projects.' },
                { name: 'Lawanto', price: '&#8377;155/sq ft', img: 'stones/lawanto.jpg', gradient: 'linear-gradient(135deg,#ede9e2,#e2dbd0)', description: 'Versatile cream marble with minimal patterning. Offers excellent durability and aesthetic appeal for modern and classic architectural designs.' }
            ]
        }, {
            groupName: 'Turkish Marble Excellence',
            stones: [
                { name: 'Kapaman Crema', price: '&#8377;195/sq ft', img: 'stones/kapaman-crema.jpg', gradient: 'linear-gradient(135deg,#f2ece0,#e8dcc8)', description: 'Luxurious cream marble from Turkish quarries with refined texture and subtle patterns. Outstanding choice for premium interiors and commercial spaces.' },
                { name: 'Grey Karaman', price: '&#8377;175/sq ft', img: 'stones/grey-karaman.jpg', gradient: 'linear-gradient(135deg,#d8dde4,#c8cfd8)', description: 'Sophisticated grey marble with delicate veining. Perfect for creating elegant, contemporary designs in residential and office environments.' },
                { name: 'Botochino Beige', price: '&#8377;185/sq ft', img: 'stones/botochino-beige.jpg', gradient: 'linear-gradient(135deg,#ede5d5,#dfd5c0)', description: 'Rich beige marble with warm golden undertones. Exceptional for luxury kitchens, bathrooms, and statement walls in high-end properties.' },
                { name: 'Moon Star', price: '&#8377;230/sq ft', img: 'stones/moon-star.jpg', gradient: 'linear-gradient(135deg,#e8edf4,#d5dde8)', description: 'Exclusive pale marble with ethereal blue-grey veining resembling starlight. Premium choice for sophisticated and artistic interior designs.' },
                { name: 'Vanilla Cream', price: '&#8377;165/sq ft', img: 'stones/vanilla-cream.jpg', gradient: 'linear-gradient(135deg,#f5f0e2,#ede5cc)', description: 'Soft cream marble with minimal veining and warm undertones. Perfect for creating bright, elegant spaces with timeless sophistication.' },
                { name: 'Ashora Beige', price: '&#8377;170/sq ft', img: 'stones/ashora-beige.jpg', gradient: 'linear-gradient(135deg,#eee5d2,#e0d4bc)', description: 'Premium beige marble with subtle grey veins creating depth and character. Ideal for luxury residential projects and upscale commercial spaces.' }
            ]
        }, {
            groupName: 'Indian Makrana Marvel',
            stones: [
                { name: 'Newton Grey', price: '&#8377;160/sq ft', img: 'stones/newton-grey.jpg', gradient: 'linear-gradient(135deg,#d0d6de,#bcc5cf)', description: 'Elegant grey marble from Makrana with consistent veining. Renowned for durability and beauty, perfect for temples, residences, and modern structures.' }
            ]
        }, {
            groupName: 'European Imports',
            stones: [
                { name: 'Bulgaria Grey', price: '&#8377;150/sq ft', img: 'stones/bulgaria-grey.jpg', gradient: 'linear-gradient(135deg,#c8d0da,#b8c2ce)', description: 'Subtle grey European marble with refined finish. Excellent durability and aesthetic appeal for contemporary and classical architectural projects.' },
                { name: 'Blue Azul', price: '&#8377;260/sq ft', img: 'stones/blue-azul.jpg', gradient: 'linear-gradient(135deg,#c8d8ea,#a8bcd5)', description: 'Stunning blue-veined marble with oceanic beauty. Premium statement stone for luxury interiors, creating dramatic focal points and artistic installations.' }
            ]
        }]
    },

    granite: {
        label: 'Granite',
        title: 'Granite Collection',
        groups: [{
            groupName: 'Premium Black Series',
            stones: [
                { name: 'Markino Grey', price: '&#8377;140/sq ft', img: 'stones/markino-grey.jpg', gradient: 'linear-gradient(135deg,#2a2e35,#1e2228)', description: 'Sophisticated grey-black granite with uniform color and subtle sparkle. Perfect for modern kitchens, bathrooms, and commercial applications.' },
                { name: 'Bizwad Black', price: '&#8377;85/sq ft', img: 'stones/bizwad-black.jpg', gradient: 'linear-gradient(135deg,#242830,#1a1e24)', description: 'Deep pure black granite with exceptional durability. Ideal for creating bold, contemporary designs in residential and commercial spaces.' },
                { name: 'Rajasthan Black', price: '&#8377;75/sq ft', img: 'stones/rajasthan-black.jpg', gradient: 'linear-gradient(135deg,#282c34,#1c2028)', description: 'Premium Indian black granite with rich color and fine grain. Excellent choice for flooring, countertops, and architectural features.' },
                { name: 'River Black', price: '&#8377;85/sq ft', img: 'stones/river-black.jpg', gradient: 'linear-gradient(135deg,#2e3240,#222638)', description: 'Elegant black granite with subtle grey undertones creating depth. Perfect for luxury interiors and high-traffic commercial applications.' },
                { name: 'Fish Black', price: '&#8377;80/sq ft', img: 'stones/fish-black.jpg', gradient: 'linear-gradient(135deg,#262a32,#1c2028)', description: 'Pure black granite with fine texture and exceptional polish. Outstanding durability for kitchen counters, flooring, and wall cladding.' }
            ]
        }, {
            groupName: 'Pure White Series',
            stones: [
                { name: 'S White', price: '&#8377;95/sq ft', img: 'stones/s-white.jpg', gradient: 'linear-gradient(135deg,#f0f2f5,#e2e6ec)', description: 'Pristine white granite with subtle grey veining. Perfect for creating bright, clean aesthetic in modern residential and commercial interiors.' },
                { name: 'P White', price: '&#8377;90/sq ft', img: 'stones/p-white.jpg', gradient: 'linear-gradient(135deg,#eef0f4,#e0e4ea)', description: 'Premium white granite with minimal patterns and consistent color. Ideal for sophisticated kitchen islands and statement countertops.' },
                { name: 'Ice White', price: '&#8377;110/sq ft', img: 'stones/ice-white.jpg', gradient: 'linear-gradient(135deg,#f5f5f8,#e8e8ec)', description: 'Cool-toned white granite with icy appearance and fine grain. Excellent for contemporary minimalist designs and professional spaces.' },
                { name: 'Asian Top', price: '&#8377;105/sq ft', img: 'stones/asian-top.jpg', gradient: 'linear-gradient(135deg,#f0f0f3,#e5e5eb)', description: 'Premium Asian white granite with uniform texture and subtle grey accents. Perfect for luxury residential and high-end commercial projects.' }
            ]
        }, {
            groupName: 'Rich Red Series',
            stones: [
                { name: 'Classic Red', price: '&#8377;105/sq ft', img: 'stones/classic-red.jpg', gradient: 'linear-gradient(135deg,#8a3030,#6a2020)', description: 'Striking red granite with consistent color and fine sparkle. Creates bold statements in luxury residences and premium commercial spaces.' },
                { name: 'Zem Red', price: '&#8377;115/sq ft', img: 'stones/zem-red.jpg', gradient: 'linear-gradient(135deg,#923535,#722525)', description: 'Deep rich red granite with uniform finish and excellent durability. Perfect for dramatic kitchen islands and luxury bathroom counters.' }
            ]
        }, {
            groupName: 'Warm Brown Series',
            stones: [
                { name: 'Baghera Brown', price: '&#8377;100/sq ft', img: 'stones/baghera-brown.jpg', gradient: 'linear-gradient(135deg,#6e4c30,#5a3c24)', description: 'Warm brown granite with earthy tones and subtle variations. Excellent for creating warm, inviting spaces in kitchens and living areas.' }
            ]
        }]
    },

    tiles: {
        label: 'Tiles',
        title: 'Tiles Collection',
        groups: [{
            groupName: 'Bathroom Tiles',
            stones: [
                { name: 'Aqua Pearl White', price: '&#8377;75/sq ft', img: 'stones/tiles/bath-aqua-pearl.jpg', gradient: 'linear-gradient(135deg,#e8f4f8,#d0e8f0)' },
                { name: 'Charcoal Slate', price: '&#8377;90/sq ft', img: 'stones/tiles/bath-charcoal-slate.jpg', gradient: 'linear-gradient(135deg,#3e454e,#2a3038)' },
                { name: 'Ivory Gloss', price: '&#8377;68/sq ft', img: 'stones/tiles/bath-ivory-gloss.jpg', gradient: 'linear-gradient(135deg,#f8f4ec,#ede8dc)' },
                { name: 'Mosaic Ocean', price: '&#8377;115/sq ft', img: 'stones/tiles/bath-mosaic-ocean.jpg', gradient: 'linear-gradient(135deg,#a8c8d8,#7aaabf)' },
                { name: 'Midnight Onyx', price: '&#8377;125/sq ft', img: 'stones/tiles/bath-midnight-onyx.jpg', gradient: 'linear-gradient(135deg,#1a1e28,#12161e)' }
            ]
        }, {
            groupName: 'Kitchen Tiles',
            stones: [
                { name: 'Metro Bright White', price: '&#8377;58/sq ft', img: 'stones/tiles/kitchen-metro-white.jpg', gradient: 'linear-gradient(135deg,#f8f8f6,#eeecea)' },
                { name: 'Terracotta Rust', price: '&#8377;65/sq ft', img: 'stones/tiles/kitchen-terracotta.jpg', gradient: 'linear-gradient(135deg,#c27850,#a85e38)' },
                { name: 'Sage Green', price: '&#8377;85/sq ft', img: 'stones/tiles/kitchen-sage-green.jpg', gradient: 'linear-gradient(135deg,#8fa886,#708068)' },
                { name: 'Stone Beige Matt', price: '&#8377;78/sq ft', img: 'stones/tiles/kitchen-stone-beige.jpg', gradient: 'linear-gradient(135deg,#d8cbb8,#c4b49e)' },
                { name: 'Coal Black Gloss', price: '&#8377;95/sq ft', img: 'stones/tiles/kitchen-coal-black.jpg', gradient: 'linear-gradient(135deg,#28282e,#1e1e24)' }
            ]
        }, {
            groupName: 'Floor Tiles',
            stones: [
                { name: 'Rustic Oak Wood', price: '&#8377;92/sq ft', img: 'stones/tiles/floor-rustic-oak.jpg', gradient: 'linear-gradient(135deg,#8c6438,#6e4c24)' },
                { name: 'Antique Beige', price: '&#8377;82/sq ft', img: 'stones/tiles/floor-antique-beige.jpg', gradient: 'linear-gradient(135deg,#d4c4a8,#c0ae90)' },
                { name: 'Slate Grey Matt', price: '&#8377;75/sq ft', img: 'stones/tiles/floor-slate-grey.jpg', gradient: 'linear-gradient(135deg,#7a8490,#626e7a)' },
                { name: 'Ivory Natural Stone', price: '&#8377;88/sq ft', img: 'stones/tiles/floor-ivory-stone.jpg', gradient: 'linear-gradient(135deg,#e8e0cc,#d8cebc)' },
                { name: 'Dune Sand', price: '&#8377;70/sq ft', img: 'stones/tiles/floor-dune-sand.jpg', gradient: 'linear-gradient(135deg,#c8b080,#b09860)' }
            ]
        }, {
            groupName: 'Wall Tiles',
            stones: [
                { name: 'Arctic White Gloss', price: '&#8377;62/sq ft', img: 'stones/tiles/wall-arctic-white.jpg', gradient: 'linear-gradient(135deg,#f8f8fa,#eeeef2)' },
                { name: 'Desert Sand Matt', price: '&#8377;68/sq ft', img: 'stones/tiles/wall-desert-sand.jpg', gradient: 'linear-gradient(135deg,#d8c8a0,#c4b088)' },
                { name: 'Ocean Blue', price: '&#8377;88/sq ft', img: 'stones/tiles/wall-ocean-blue.jpg', gradient: 'linear-gradient(135deg,#4a7a9b,#2e5e7e)' },
                { name: 'Latte Beige Textured', price: '&#8377;72/sq ft', img: 'stones/tiles/wall-latte-beige.jpg', gradient: 'linear-gradient(135deg,#cfc0a8,#b8a88e)' },
                { name: 'Forest Green Matt', price: '&#8377;92/sq ft', img: 'stones/tiles/wall-forest-green.jpg', gradient: 'linear-gradient(135deg,#4a6848,#384e36)' }
            ]
        }]
    },

    handicraft: {
        label: 'Handicraft',
        title: 'Handicraft Collection',
        groups: [{
            groupName: 'Stone Sculptures',
            stones: [
                { name: 'Ganesh Idol – Makrana', price: 'On Request', img: 'stones/craft/ganesh-makrana.jpg', gradient: 'linear-gradient(135deg,#f0ede6,#e4dfd4)' },
                { name: 'Nandi Bull Carving', price: 'On Request', img: 'stones/craft/nandi-bull.jpg', gradient: 'linear-gradient(135deg,#e8e0d2,#d8cfc0)' },
                { name: 'Elephant Pair – White', price: 'On Request', img: 'stones/craft/elephant-white.jpg', gradient: 'linear-gradient(135deg,#f4f2ee,#e8e4de)' },
                { name: 'Abstract Stone Figure', price: 'On Request', img: 'stones/craft/abstract-figure.jpg', gradient: 'linear-gradient(135deg,#d0ccc4,#bcb8ae)' },
                { name: 'Lion Pillar Statue', price: 'On Request', img: 'stones/craft/lion-pillar.jpg', gradient: 'linear-gradient(135deg,#c8b890,#b4a078)' }
            ]
        }, {
            groupName: 'Decorative Wall Panels',
            stones: [
                { name: 'Floral Jali Panel', price: '&#8377;850/sq ft', img: 'stones/craft/floral-jali.jpg', gradient: 'linear-gradient(135deg,#f0ece4,#e4ddd0)' },
                { name: 'Geometric Lattice', price: '&#8377;780/sq ft', img: 'stones/craft/geometric-lattice.jpg', gradient: 'linear-gradient(135deg,#e8e0d4,#d8cec0)' },
                { name: 'Mughal Arch Panel', price: '&#8377;1200/sq ft', img: 'stones/craft/mughal-arch.jpg', gradient: 'linear-gradient(135deg,#ddd4c0,#ccc0a8)' },
                { name: 'Peacock Relief Panel', price: '&#8377;950/sq ft', img: 'stones/craft/peacock-relief.jpg', gradient: 'linear-gradient(135deg,#c0d4c8,#a8c0b4)' },
                { name: 'Vine & Leaf Carving', price: '&#8377;720/sq ft', img: 'stones/craft/vine-leaf.jpg', gradient: 'linear-gradient(135deg,#c8d4b0,#b0bc98)' }
            ]
        }, {
            groupName: 'Carved Artifacts',
            stones: [
                { name: 'Marble Inlay Box', price: '&#8377;2,400', img: 'stones/craft/inlay-box.jpg', gradient: 'linear-gradient(135deg,#f4f0e8,#e8e2d8)' },
                { name: 'Stone Urli Bowl', price: '&#8377;3,200', img: 'stones/craft/stone-urli.jpg', gradient: 'linear-gradient(135deg,#d4c8b0,#c0b098)' },
                { name: 'Carved Candle Holder', price: '&#8377;1,800', img: 'stones/craft/candle-holder.jpg', gradient: 'linear-gradient(135deg,#e8dcc8,#d4c8b0)' },
                { name: 'Pietra Dura Plate', price: '&#8377;4,500', img: 'stones/craft/pietra-dura.jpg', gradient: 'linear-gradient(135deg,#f0e8d8,#e0d4c0)' },
                { name: 'Marble Mortar & Pestle', price: '&#8377;1,200', img: 'stones/craft/mortar-pestle.jpg', gradient: 'linear-gradient(135deg,#ede8e0,#ddd8ce)' }
            ]
        }, {
            groupName: 'Temple & Religious Crafts',
            stones: [
                { name: 'Temple Pillar Set (4)', price: 'On Request', img: 'stones/craft/temple-pillars.jpg', gradient: 'linear-gradient(135deg,#e8e0cc,#d8ceb8)' },
                { name: 'Chhatri Dome Piece', price: 'On Request', img: 'stones/craft/chhatri-dome.jpg', gradient: 'linear-gradient(135deg,#f0ece4,#e4ddd4)' },
                { name: 'Shivling – Makrana', price: 'On Request', img: 'stones/craft/shivling.jpg', gradient: 'linear-gradient(135deg,#d4d0c8,#c4c0b8)' },
                { name: 'Jaali Window Screen', price: '&#8377;1,100/sq ft', img: 'stones/craft/jaali-window.jpg', gradient: 'linear-gradient(135deg,#ddd8cc,#ccc8bc)' },
                { name: 'Pooja Thali Set', price: '&#8377;3,800', img: 'stones/craft/pooja-thali.jpg', gradient: 'linear-gradient(135deg,#e8e0d0,#d8d0c0)' }
            ]
        }, {
            groupName: 'Home Décor Pieces',
            stones: [
                { name: 'Marble Chess Set', price: '&#8377;5,500', img: 'stones/craft/chess-set.jpg', gradient: 'linear-gradient(135deg,#f0ede6,#e0ddd4)' },
                { name: 'Stone Photo Frame', price: '&#8377;1,600', img: 'stones/craft/photo-frame.jpg', gradient: 'linear-gradient(135deg,#d8d0c0,#c8c0b0)' },
                { name: 'Inlay Coaster Set (6)', price: '&#8377;2,200', img: 'stones/craft/coaster-set.jpg', gradient: 'linear-gradient(135deg,#e8e4dc,#d8d4cc)' },
                { name: 'Decorative Vase – Grey', price: '&#8377;4,200', img: 'stones/craft/deco-vase.jpg', gradient: 'linear-gradient(135deg,#b8bcc4,#a8acb4)' },
                { name: 'Wall Clock – Marble', price: '&#8377;3,600', img: 'stones/craft/marble-clock.jpg', gradient: 'linear-gradient(135deg,#ede8e0,#ddd8ce)' }
            ]
        }]
    }
};

// Make collectionsData globally accessible
window.collectionsData = collectionsData;

const categoryKeys = ['marble', 'granite', 'tiles', 'handicraft'];
let catIdx = 0;
const track = document.getElementById('collections-track');
const backBtn = document.getElementById('collections-back');
const stoneList = document.getElementById('stone-list');
const detCatLbl = document.getElementById('detail-cat-label');
const detTitle = document.getElementById('detail-title');
const detCount = document.getElementById('detail-count');
const detQuoteBtn = document.getElementById('detail-quote-btn');
const stoneWrap = document.querySelector('.stone-list-wrap');
const prevBtn = document.getElementById('cat-prev-btn');
const nextBtn = document.getElementById('cat-next-btn');

function updateCatNav() {
    if (prevBtn) prevBtn.disabled = catIdx === 0;
    if (nextBtn) nextBtn.disabled = catIdx === categoryKeys.length - 1;
    document.querySelectorAll('.cat-nav-pill').forEach((p, i) => p.classList.toggle('active', i === catIdx));
}

function renderStones(key) {
    const d = collectionsData[key];
    if (!d) return;
    const tot = d.groups.reduce((s, g) => s + g.stones.length, 0);
    detCatLbl.textContent = d.label;
    detTitle.textContent = d.title;
    detCount.textContent = `${tot} ${tot===1?'variety':'varieties'} available`;

    stoneList.innerHTML = d.groups.map(g => `
        <div class="stone-group">
            <div class="stone-group-header">
                <span class="stone-group-label">${g.groupName}</span>
                <div class="stone-group-line"></div>
            </div>
            <div class="stone-group-grid">
                ${g.stones.map(s => `
                    <div class="stone-item" data-stone-name="${s.name}" data-stone-price="${s.price.replace(/&.*?;/g,'₹')}">
                        <div class="stone-card-photo" style="background:${s.gradient};">
                            <div class="stone-card-photo-inner" style="background-image:url('${s.img}');"
                                 onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"></div>
                            <div class="stone-photo-placeholder" style="display:none;background:${s.gradient};position:absolute;inset:0;">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5a6e82" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
                                <span>Add Photo</span>
                            </div>
                        </div>
                        <div class="stone-card-info">
                            <span class="stone-name">${s.name}</span>
                            <div class="stone-rating-inline">
                                <span class="stars-inline">★★★★★</span>
                                <span class="rating-inline">4.8</span>
                            </div>
                            <p class="stone-description">${s.description || ''}</p>
                            <div class="stone-meta">
                                <span class="stone-quote-tag hover-target">WhatsApp →</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    stoneWrap.scrollTop = 0;
    stoneList.querySelectorAll('.stone-group-header,.stone-item').forEach((el, i) => {
        setTimeout(() => el.classList.add('stone-visible'), 180 + i * 30);
    });
}

function openCategory(key) {
    catIdx = categoryKeys.indexOf(key);
    if (catIdx < 0) catIdx = 0;
    renderStones(key);
    track.classList.add('show-detail');
    updateCatNav();
}

function closeCategory() {
    track.classList.remove('show-detail');
    setTimeout(() => stoneList.querySelectorAll('.stone-item,.stone-group-header').forEach(el => el.classList.remove('stone-visible')), 550);
}

document.querySelectorAll('.category-card').forEach(c => c.addEventListener('click', () => {
    const catKey = c.getAttribute('data-cat');
    openCategory(catKey);
}));
backBtn.addEventListener('click', closeCategory);

prevBtn && prevBtn.addEventListener('click', () => {
    if (catIdx > 0) {
        stoneList.querySelectorAll('.stone-item,.stone-group-header').forEach(el => el.classList.remove('stone-visible'));
        catIdx--;
        setTimeout(() => renderStones(categoryKeys[catIdx]), 80);
        updateCatNav();
    }
});

nextBtn && nextBtn.addEventListener('click', () => {
    if (catIdx < categoryKeys.length - 1) {
        stoneList.querySelectorAll('.stone-item,.stone-group-header').forEach(el => el.classList.remove('stone-visible'));
        catIdx++;
        setTimeout(() => renderStones(categoryKeys[catIdx]), 80);
        updateCatNav();
    }
});

document.querySelectorAll('.cat-nav-pill').forEach(pill => {
    pill.addEventListener('click', () => {
        const newCat = pill.getAttribute('data-nav-cat');
        if (categoryKeys.includes(newCat)) {
            stoneList.querySelectorAll('.stone-item,.stone-group-header').forEach(el => el.classList.remove('stone-visible'));
            openCategory(newCat);
        }
    });
});

detQuoteBtn.addEventListener('click', e => {
    e.preventDefault();
    closeCategory();
    setTimeout(() => document.getElementById('contact-id').scrollIntoView({ behavior: 'smooth' }), 400);
});

stoneList.addEventListener('click', e => {
    const tag = e.target.closest('.stone-quote-tag');
    if (!tag) {
        const item = e.target.closest('.stone-item');
        if (item) openStoneDetail(item);
        return;
    }
    const item = tag.closest('.stone-item');
    if (!item) return;
    const msg = encodeURIComponent(`*Quote — Uma Traders*\n\n*Item:* ${item.dataset.stoneName}\n*Category:* ${detCatLbl.textContent}\n*Price:* ${item.dataset.stonePrice}\n\nPlease share availability & bulk pricing.`);
    window.open(`https://wa.me/919304277935?text=${msg}`, '_blank');
});


/* ═══════════════════════════════════════════════════════════════
   STONE DETAIL MODAL
═══════════════════════════════════════════════════════════════ */
const stoneDetailModal = document.getElementById('stone-detail-modal');
const stoneDetailClose = document.querySelector('.stone-detail-close');
const stoneDetailWhatsapp = document.getElementById('stone-detail-whatsapp');
let currentStonePhotos = ['', '', ''];
let currentPhotoIdx = 0;
let stoneAutoSlideInterval = null;
const currentCategory = { key: '', stoneName: '', stonePrice: '' };

function updateStonePhotoDisplay() {
    const photoMain = document.getElementById('stone-photo-main');
    const photoCurrent = document.getElementById('stone-photo-current');
    const photoThumb = document.querySelector('.stone-photo-thumb.active');
    if (photoThumb) photoThumb.classList.remove('active');
    
    const img = currentStonePhotos[currentPhotoIdx] || currentStonePhotos[0];
    photoMain.style.backgroundImage = `url('${img}')`;
    photoCurrent.textContent = currentPhotoIdx + 1;
    
    const thumbs = document.querySelectorAll('.stone-photo-thumb');
    if (thumbs[currentPhotoIdx]) thumbs[currentPhotoIdx].classList.add('active');
}

function nextStonePhoto() {
    currentPhotoIdx = (currentPhotoIdx + 1) % currentStonePhotos.length;
    updateStonePhotoDisplay();
}

function prevStonePhoto() {
    currentPhotoIdx = (currentPhotoIdx - 1 + currentStonePhotos.length) % currentStonePhotos.length;
    updateStonePhotoDisplay();
}

function startAutoSlide() {
    stoneAutoSlideInterval = setInterval(nextStonePhoto, 4000);
}

function stopAutoSlide() {
    if (stoneAutoSlideInterval) clearInterval(stoneAutoSlideInterval);
}

function openStoneDetail(stoneElement) {
    const stoneName = stoneElement.dataset.stoneName;
    const stonePrice = stoneElement.dataset.stonePrice;
    
    const currentKey = categoryKeys[catIdx];
    const stoneData = collectionsData[currentKey].groups
        .flatMap(g => g.stones)
        .find(s => s.name === stoneName);
    
    if (!stoneData) return;
    
    currentCategory.key = currentKey;
    currentCategory.stoneName = stoneName;
    currentCategory.stonePrice = stonePrice;
    currentStonePhotos = [stoneData.img, stoneData.img, stoneData.img];
    currentPhotoIdx = 0;
    
    document.getElementById('stone-detail-name').textContent = stoneName;
    document.getElementById('stone-detail-desc').textContent = stoneData.description || '';
    document.getElementById('stone-photo-total').textContent = 3;
    
    const photoThumbsContainer = document.getElementById('stone-photo-thumbs');
    photoThumbsContainer.innerHTML = currentStonePhotos.map((img, idx) => 
        `<div class="stone-photo-thumb ${idx === 0 ? 'active' : ''}" style="background-image:url('${img}');" data-idx="${idx}"></div>`
    ).join('');
    
    photoThumbsContainer.querySelectorAll('.stone-photo-thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
            currentPhotoIdx = parseInt(thumb.dataset.idx);
            updateStonePhotoDisplay();
            stopAutoSlide();
            startAutoSlide();
        });
    });
    
    updateStonePhotoDisplay();
    stoneDetailModal.classList.add('active');
    lenis.stop();
    startAutoSlide();
}

function closeStoneDetail() {
    stoneDetailModal.classList.remove('active');
    stopAutoSlide();
    lenis.start();
}

stoneDetailClose.addEventListener('click', closeStoneDetail);
stoneDetailModal.addEventListener('click', (e) => {
    if (e.target === stoneDetailModal) closeStoneDetail();
});

document.querySelector('.stone-carousel-prev').addEventListener('click', () => {
    prevStonePhoto();
    stopAutoSlide();
    startAutoSlide();
});

document.querySelector('.stone-carousel-next').addEventListener('click', () => {
    nextStonePhoto();
    stopAutoSlide();
    startAutoSlide();
});

stoneDetailWhatsapp.addEventListener('click', () => {
    const msg = encodeURIComponent(`*Quote — Uma Traders*\n\n*Item:* ${currentCategory.stoneName}\n*Category:* ${collectionsData[currentCategory.key].label}\n*Price:* ${currentCategory.stonePrice}\n\nPlease share availability & bulk pricing.`);
    window.open(`https://wa.me/919304277935?text=${msg}`, '_blank');
});

document.addEventListener('keydown', (e) => {
    if (!stoneDetailModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeStoneDetail();
    if (e.key === 'ArrowRight') { nextStonePhoto(); stopAutoSlide(); startAutoSlide(); }
    if (e.key === 'ArrowLeft') { prevStonePhoto(); stopAutoSlide(); startAutoSlide(); }
});


/* ═══════════════════════════════════════════════════════════════
   LIGHTBOX
═══════════════════════════════════════════════════════════════ */
const gallery = {
    jaipur: ['work1.jpg', 'jaipur_alt1.jpg', 'jaipur_alt2.jpg'],
    corporate: ['work2.jpg', 'corp_alt1.jpg', 'corp_alt2.jpg'],
    residential: ['work3.jpg', 'res_alt1.jpg', 'res_alt2.jpg']
};
let curProj = '', pIdx = 0;
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');

document.querySelectorAll('.blog-item').forEach(item => {
    item.addEventListener('click', () => {
        curProj = item.getAttribute('data-project');
        pIdx = 0;
        lbImg.src = gallery[curProj][0];
        lb.classList.add('active');
        lenis.stop();
    });
});

lbImg.addEventListener('click', e => {
    e.stopPropagation();
    pIdx = (pIdx + 1) % gallery[curProj].length;
    lbImg.src = gallery[curProj][pIdx];
});

const hideLB = () => { lb.classList.remove('active'); lenis.start(); };
document.querySelector('.close-lightbox').addEventListener('click', hideLB);
lb.addEventListener('click', hideLB);


/* ═══════════════════════════════════════════════════════════════
   CONTACT → WHATSAPP
═══════════════════════════════════════════════════════════════ */
document.getElementById('ajax-contact').addEventListener('submit', e => {
    e.preventDefault();
    const n = document.getElementById('name').value,
          em = document.getElementById('email').value,
          s = document.getElementById('subject').value,
          m = document.getElementById('message').value;
    window.open(`https://wa.me/919304277935?text=*Inquiry: Uma Traders*%0A%0A*Name:* ${n}%0A*Email:* ${em}%0A*Subject:* ${s}%0A*Message:* ${m}`, '_blank');
});


/* ═══════════════════════════════════════════════════════════════
   MAP PINS
═══════════════════════════════════════════════════════════════ */
const locDB = {
    jodhpur: { title: 'Flagship Showroom', desc: 'Our main showroom in Kishangarh, Ajmer, Rajasthan — the marble capital of India. Visit Mon–Sat, 9AM–7PM.' },
    gorakhpur: { title: 'Processing & Polishing Unit', desc: 'Our stone processing facility — precision cutting, polishing, and quality inspection for all orders.' },
    nepal: { title: 'Nepal Export Operations', desc: 'We supply premium Makrana and Indian marble to architects and builders across Nepal with certified export packaging.' }
};
const locCard = document.getElementById('location-card'),
      locTit = document.getElementById('loc-title'),
      locDesc = document.getElementById('loc-desc');

document.querySelectorAll('.map-pin').forEach(pin => {
    pin.addEventListener('click', () => {
        document.querySelectorAll('.map-pin').forEach(p => p.classList.remove('active'));
        pin.classList.add('active');
        const d = locDB[pin.getAttribute('data-loc')];
        locTit.textContent = d.title;
        locDesc.textContent = d.desc;
        locCard.classList.add('active');
    });
});


/* ═══════════════════════════════════════════════════════════════
   SEARCH
═══════════════════════════════════════════════════════════════ */
const sModal = document.getElementById('search-modal'),
      sInput = document.getElementById('search-input'),
      sResults = document.getElementById('search-results'),
      sIcon = document.getElementById('search-icon-btn'),
      sClose = document.getElementById('search-close');

const sIndex = [
    { label: 'Marble Collection', target: '#collections-id', category: 'marble' },
    { label: 'Italy Dyna Marble', target: '#collections-id', category: 'marble' }, 
    { label: 'Ormanno Marble', target: '#collections-id', category: 'marble' }, 
    { label: 'Newton Grey Marble', target: '#collections-id', category: 'marble' },
    { label: 'Ashora Beige Marble', target: '#collections-id', category: 'marble' }, 
    { label: 'Kapaman Crema Marble', target: '#collections-id', category: 'marble' }, 
    { label: 'Moon Star Marble', target: '#collections-id', category: 'marble' },
    { label: 'Blue Azul Marble', target: '#collections-id', category: 'marble' }, 
    { label: 'Vanilla Cream Marble', target: '#collections-id', category: 'marble' },
    { label: 'Granite Collection', target: '#collections-id', category: 'granite' },
    { label: 'Markino Black Granite', target: '#collections-id', category: 'granite' }, 
    { label: 'S White Granite', target: '#collections-id', category: 'granite' }, 
    { label: 'Classic Red Granite', target: '#collections-id', category: 'granite' },
    { label: 'Baghera Brown Granite', target: '#collections-id', category: 'granite' }, 
    { label: 'River Black Granite', target: '#collections-id', category: 'granite' },
    { label: 'Tiles Collection', target: '#collections-id', category: 'tiles' },
    { label: 'Bathroom Tiles', target: '#collections-id', category: 'tiles' }, 
    { label: 'Kitchen Tiles', target: '#collections-id', category: 'tiles' }, 
    { label: 'Floor Tiles', target: '#collections-id', category: 'tiles' }, 
    { label: 'Wall Tiles', target: '#collections-id', category: 'tiles' },
    { label: 'Aqua Pearl White Tile', target: '#collections-id', category: 'tiles' }, 
    { label: 'Charcoal Slate Tile', target: '#collections-id', category: 'tiles' }, 
    { label: 'Ivory Gloss Tile', target: '#collections-id', category: 'tiles' },
    { label: 'Mosaic Ocean Tile', target: '#collections-id', category: 'tiles' }, 
    { label: 'Midnight Onyx Tile', target: '#collections-id', category: 'tiles' },
    { label: 'Metro Bright White Tile', target: '#collections-id', category: 'tiles' }, 
    { label: 'Terracotta Rust Tile', target: '#collections-id', category: 'tiles' }, 
    { label: 'Sage Green Tile', target: '#collections-id', category: 'tiles' },
    { label: 'Rustic Oak Wood Floor Tile', target: '#collections-id', category: 'tiles' }, 
    { label: 'Antique Beige Floor Tile', target: '#collections-id', category: 'tiles' }, 
    { label: 'Slate Grey Floor Tile', target: '#collections-id', category: 'tiles' },
    { label: 'Arctic White Wall Tile', target: '#collections-id', category: 'tiles' }, 
    { label: 'Ocean Blue Wall Tile', target: '#collections-id', category: 'tiles' }, 
    { label: 'Forest Green Wall Tile', target: '#collections-id', category: 'tiles' },
    { label: 'Handicraft Collection', target: '#collections-id', category: 'handicraft' },
    { label: 'Stone Sculptures', target: '#collections-id', category: 'handicraft' }, 
    { label: 'Decorative Wall Panels', target: '#collections-id', category: 'handicraft' }, 
    { label: 'Carved Artifacts', target: '#collections-id', category: 'handicraft' },
    { label: 'Temple Crafts', target: '#collections-id', category: 'handicraft' }, 
    { label: 'Home Décor Pieces', target: '#collections-id', category: 'handicraft' },
    { label: 'Ganesh Idol Makrana', target: '#collections-id', category: 'handicraft' }, 
    { label: 'Floral Jali Panel', target: '#collections-id', category: 'handicraft' }, 
    { label: 'Mughal Arch Panel', target: '#collections-id', category: 'handicraft' },
    { label: 'Marble Inlay Box', target: '#collections-id', category: 'handicraft' }, 
    { label: 'Pietra Dura Plate', target: '#collections-id', category: 'handicraft' }, 
    { label: 'Marble Chess Set', target: '#collections-id', category: 'handicraft' },
    { label: 'Temple Pillar Set', target: '#collections-id', category: 'handicraft' }, 
    { label: 'Marble Wall Clock', target: '#collections-id', category: 'handicraft' },
    { label: 'How We Work', target: '#process-id' }, 
    { label: 'Our Process', target: '#process-id' },
    { label: 'Global Footprint & Reach', target: '#areas-id' }, 
    { label: 'Kishangarh Showroom', target: '#areas-id' }, 
    { label: 'Nepal Exports', target: '#areas-id' },
    { label: 'Project Journal', target: '#blog-id' }, 
    { label: 'Client Testimonials', target: '#reviews-id' }, 
    { label: 'Contact & Consultation', target: '#contact-id' }, 
    { label: '3D Visualizer', target: 'visualizer.html' }
];

const openS = () => { sModal.classList.add('active'); setTimeout(() => sInput.focus(), 200); lenis.stop(); };
const closeS = () => { sModal.classList.remove('active'); sInput.value = ''; sResults.innerHTML = ''; lenis.start(); };

sIcon && sIcon.addEventListener('click', openS);
sClose.addEventListener('click', closeS);

window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (sModal.classList.contains('active')) closeS();
        else if (track.classList.contains('show-detail')) closeCategory();
        else hideLB();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openS(); }
});

sInput.addEventListener('input', () => {
    const q = sInput.value.trim().toLowerCase();
    sResults.innerHTML = '';
    if (!q) return;
    const hits = sIndex.filter(i => i.label.toLowerCase().includes(q));
    if (!hits.length) {
        sResults.innerHTML = '<div class="search-result-item" style="color:#aab5c0;cursor:default;">No results found</div>';
        return;
    }
    hits.slice(0, 6).forEach(item => {
        const div = document.createElement('div');
        div.className = 'search-result-item hover-target';
        div.textContent = item.label;
        div.addEventListener('click', () => {
            closeS();
            if (item.target.startsWith('#')) {
                // If it's a collections item with a category, open that category
                if (item.category && item.target === '#collections-id') {
                    document.querySelector('#collections-id').scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => openCategory(item.category), 500);
                } else {
                    document.querySelector(item.target).scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                window.location.href = item.target;
            }
        });
        sResults.appendChild(div);
    });
});

document.getElementById('search-submit-btn').addEventListener('click', () => sInput.dispatchEvent(new Event('input')));


/* ═══════════════════════════════════════════════════════════════
   INTERSECTION OBSERVER — reveal on scroll
   Handles: .pop-box, .blog-obs, and .process-card
═══════════════════════════════════════════════════════════════ */
(function() {
    var targets = document.querySelectorAll('.pop-box:not(.process-card), .blog-obs');
    var processCards = document.querySelectorAll('.process-card');

    if (!('IntersectionObserver' in window)) {
        targets.forEach(el => el.classList.add('visible'));
        processCards.forEach(el => el.classList.add('visible'));
        return;
    }

    /* Observer for about boxes and blog items */
    var io = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => io.observe(el));

    /* Observer for process cards */
    var ioProcess = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                ioProcess.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    processCards.forEach(el => ioProcess.observe(el));

    /* Re-evaluate on scroll once */
    window.addEventListener('scroll', function checkOnce() {
        [...targets, ...processCards].forEach(function(el) {
            var r = el.getBoundingClientRect();
            if (r.top < window.innerHeight - 40) {
                el.classList.add('visible');
                io.unobserve(el);
                ioProcess.unobserve(el);
            }
        });
        window.removeEventListener('scroll', checkOnce);
    }, { once: true });
}());


/* ═══════════════════════════════════════════════════════════════
   REVIEWS
═══════════════════════════════════════════════════════════════ */
const RK = 'uma_traders_reviews_v1';
const getRv = () => { try { return JSON.parse(localStorage.getItem(RK) || '[]'); } catch { return []; } };
const saveRv = a => localStorage.setItem(RK, JSON.stringify(a));

function buildCard(r) {
    const ini = r.name.trim().split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    const stars = Array.from({ length: 5 }, (_, i) => `<span style="${i < r.rating ? '' : 'opacity:.22'}">★</span>`).join('');
    return `<div class="review-card hover-target"><div class="review-stars">${stars}</div><p class="review-text">"${r.text}"</p><div class="review-author"><div class="review-avatar">${ini}</div><div class="review-author-info"><h5>${r.name}</h5><span>${r.role || 'Valued Customer'}</span></div></div></div>`;
}

function renderRv() {
    const rv = getRv(), rt = document.getElementById('reviews-track'),
          em = document.getElementById('reviews-empty'), wr = document.getElementById('reviews-wrapper');
    if (!rt) return;
    if (!rv.length) {
        wr && (wr.style.display = 'none');
        em && (em.style.display = 'flex');
        return;
    }
    wr && (wr.style.display = 'block');
    em && (em.style.display = 'none');
    const show = rv.length >= 4 ? [...rv, ...rv] : rv;
    rt.innerHTML = show.map(buildCard).join('');
    rt.style.animationPlayState = rv.length >= 4 ? 'running' : 'paused';
}

let selRating = 5;
const sp = document.getElementById('star-picker');

function updStars(v) {
    sp && sp.querySelectorAll('span').forEach((s, i) => {
        s.classList.toggle('sel', i < v);
        s.style.color = i < v ? 'var(--sky-main)' : '#ccc';
    });
}

if (sp) {
    updStars(5);
    sp.querySelectorAll('span').forEach(star => {
        star.addEventListener('click', () => { selRating = +star.dataset.val; updStars(selRating); });
        star.addEventListener('mouseenter', () => sp.querySelectorAll('span').forEach((s, i) => { s.style.color = i < +star.dataset.val ? 'var(--sky-main)' : '#ccc'; }));
    });
    sp.addEventListener('mouseleave', () => updStars(selRating));
}

const wrBtn = document.getElementById('write-review-btn'), rvForm = document.getElementById('review-form-wrap');
wrBtn && rvForm && wrBtn.addEventListener('click', () => {
    const op = rvForm.classList.toggle('active');
    wrBtn.innerHTML = op ? '<span>✕ Cancel</span>' : '<span>✦ Write a Review</span>';
});

const postBtn = document.getElementById('review-post-btn');
postBtn && postBtn.addEventListener('click', () => {
    const name = (document.getElementById('rv-name').value || '').trim(),
          role = (document.getElementById('rv-role').value || '').trim(),
          text = (document.getElementById('rv-text').value || '').trim(),
          sp2 = postBtn.querySelector('span');
    if (!name || !text) {
        postBtn.style.background = '#c0392b';
        if (sp2) sp2.textContent = 'Name & review required';
        setTimeout(() => { postBtn.style.background = ''; if (sp2) sp2.textContent = 'Post Review'; }, 2000);
        return;
    }
    const rv = getRv();
    rv.unshift({ name, role, text, rating: selRating, date: Date.now() });
    saveRv(rv);
    renderRv();
    document.getElementById('rv-name').value = '';
    document.getElementById('rv-role').value = '';
    document.getElementById('rv-text').value = '';
    selRating = 5;
    updStars(5);
    rvForm && rvForm.classList.remove('active');
    wrBtn && (wrBtn.innerHTML = '<span>✦ Write a Review</span>');
    if (sp2) sp2.textContent = '✓ Posted!';
    setTimeout(() => { if (sp2) sp2.textContent = 'Post Review'; }, 2500);
    document.getElementById('reviews-id').scrollIntoView({ behavior: 'smooth' });
});

renderRv();