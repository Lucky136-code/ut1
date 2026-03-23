'use strict';

// ══════════════════════════════════════════════════════════════
//  PLACEHOLDER TILE GENERATOR
//  Colored swatch + camera icon = "photo pending".
//  Replace by uploading your real stone photos.
// ══════════════════════════════════════════════════════════════

function genPlaceholder(r, g, b) {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, 0, 256, 256);
    const bright = (r * 299 + g * 587 + b * 114) / 1000;
    ctx.strokeStyle = bright > 140 ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.09)';
    ctx.lineWidth = 1;
    for (let i = -256; i < 512; i += 18) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 256, 256);
        ctx.stroke();
    }
    const ic = bright > 140 ? 'rgba(0,0,0,0.22)' : 'rgba(255,255,255,0.28)';
    ctx.strokeStyle = ic;
    ctx.fillStyle = ic;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.roundRect(86, 97, 84, 62, 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(128, 132, 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(110, 97);
    ctx.lineTo(118, 85);
    ctx.lineTo(138, 85);
    ctx.lineTo(146, 97);
    ctx.stroke();
    return c.toDataURL('image/jpeg', 0.88);
}

// ══════════════════════════════════════════════════════════════
//  STONE CATALOG — ALL REAL COLLECTIONS
//  Placeholder color swatches shown until you upload real photos.
// ══════════════════════════════════════════════════════════════

const DEFAULT_TEXTURES = [
    // ── MARBLE ──────────────────────────────────────────────
    // Italian Marble
    { id: 'dt_m01', name: 'Italy Dyna', category: 'Marble', gen: () => genPlaceholder(240, 237, 230) },
    { id: 'dt_m02', name: 'Ormanno', category: 'Marble', gen: () => genPlaceholder(237, 232, 224) },
    { id: 'dt_m03', name: 'Lawanto', category: 'Marble', gen: () => genPlaceholder(237, 233, 226) },
    // Turkish Marble
    { id: 'dt_m04', name: 'Kapaman Crema', category: 'Marble', gen: () => genPlaceholder(242, 236, 224) },
    { id: 'dt_m05', name: 'Grey Karaman', category: 'Marble', gen: () => genPlaceholder(216, 221, 228) },
    { id: 'dt_m06', name: 'Botochino Beige', category: 'Marble', gen: () => genPlaceholder(237, 229, 213) },
    { id: 'dt_m07', name: 'Moon Star', category: 'Marble', gen: () => genPlaceholder(232, 237, 244) },
    { id: 'dt_m08', name: 'Vanilla Cream', category: 'Marble', gen: () => genPlaceholder(245, 240, 226) },
    { id: 'dt_m09', name: 'Ashora Beige', category: 'Marble', gen: () => genPlaceholder(238, 229, 210) },
    // Indian / Makrana
    { id: 'dt_m10', name: 'Newton Grey', category: 'Marble', gen: () => genPlaceholder(208, 214, 222) },
    // European Import
    { id: 'dt_m11', name: 'Bulgaria Grey', category: 'Marble', gen: () => genPlaceholder(200, 208, 218) },
    { id: 'dt_m12', name: 'Blue Azul', category: 'Marble', gen: () => genPlaceholder(200, 216, 234) },
    // ── GRANITE ─────────────────────────────────────────────
    // Black Series
    { id: 'dt_g01', name: 'Markino Black', category: 'Granite', gen: () => genPlaceholder(42, 46, 53) },
    { id: 'dt_g02', name: 'Bizwad Black', category: 'Granite', gen: () => genPlaceholder(36, 40, 48) },
    { id: 'dt_g03', name: 'Rajasthan Black', category: 'Granite', gen: () => genPlaceholder(40, 44, 52) },
    { id: 'dt_g04', name: 'River Black', category: 'Granite', gen: () => genPlaceholder(46, 50, 64) },
    { id: 'dt_g05', name: 'Fish Black', category: 'Granite', gen: () => genPlaceholder(38, 42, 50) },
    // White Series
    { id: 'dt_g06', name: 'S White', category: 'Granite', gen: () => genPlaceholder(240, 242, 245) },
    { id: 'dt_g07', name: 'P White', category: 'Granite', gen: () => genPlaceholder(238, 240, 244) },
    // Red Series
    { id: 'dt_g08', name: 'Classic Red', category: 'Granite', gen: () => genPlaceholder(138, 48, 48) },
    { id: 'dt_g09', name: 'Zam Red', category: 'Granite', gen: () => genPlaceholder(146, 53, 53) },
    // Brown Series
    { id: 'dt_g10', name: 'Baghera Brown', category: 'Granite', gen: () => genPlaceholder(110, 76, 48) },
    // ── SLATE ────────────────────────────────────────────────
    { id: 'dt_s01', name: 'Ice White', category: 'Slate', gen: () => genPlaceholder(232, 237, 242) },
    // ── SANDSTONE ────────────────────────────────────────────
    { id: 'dt_n01', name: 'Asian Top', category: 'Sandstone', gen: () => genPlaceholder(201, 168, 112) },
];

const CAT_ORDER = ['Marble', 'Granite', 'Slate', 'Sandstone', 'Custom'];

function initDefaultTextures() {
    let loaded = 0;
    const total = DEFAULT_TEXTURES.length;
    DEFAULT_TEXTURES.forEach(item => {
        try {
            const dataUrl = item.gen();
            const img = new Image();
            img.onload = () => {
                const sc = document.createElement('canvas');
                sc.width = sc.height = 1;
                sc.getContext('2d').drawImage(img, 0, 0, 1, 1);
                const px = sc.getContext('2d').getImageData(0, 0, 1, 1).data;
                textureLibrary.push({
                    id: item.id,
                    name: item.name,
                    dataUrl,
                    baseColor: [px[0], px[1], px[2]],
                    category: item.category,
                    isDefault: true
                });
                if (++loaded === total) {
                    buildVaultTabs();
                    showVaultCategory(activeVaultCat, 'none');
                }
            };
            img.onerror = () => {
                if (++loaded === total) {
                    buildVaultTabs();
                    showVaultCategory(activeVaultCat, 'none');
                }
            };
            img.src = dataUrl;
        } catch (e) {
            if (++loaded === total) {
                buildVaultTabs();
                showVaultCategory(activeVaultCat, 'none');
            }
        }
    });
}

// ══════════════════════════════════════════════════════════════
//  CLIENT PATTERN RENDERER
//  'plain' = seamless, no grout (default)
// ══════════════════════════════════════════════════════════════

function generateClientPattern(texCanvas, pattern, targetW, targetH) {
    const ts = texCanvas.width;
    const out = document.createElement('canvas');
    out.width = targetW;
    out.height = targetH;
    const ctx = out.getContext('2d');

    if (pattern === 'plain') {
        for (let y = 0; y < targetH + ts; y += ts)
            for (let x = 0; x < targetW + ts; x += ts)
                ctx.drawImage(texCanvas, 0, 0, ts, ts, x, y, ts, ts);

    } else if (pattern === 'staggered') {
        const bw = ts,
            bh = Math.round(ts * 0.42),
            g = 3;
        const rows = Math.ceil(targetH / (bh + g)) + 2;
        const cols = Math.ceil(targetW / (bw + g)) + 2;
        for (let r = 0; r < rows; r++) {
            const off = (r % 2) * ((bw + g) / 2),
                y = r * (bh + g);
            for (let cl = 0; cl < cols; cl++)
                ctx.drawImage(texCanvas, 0, 0, ts, ts, cl * (bw + g) - off, y, bw, bh);
        }
        ctx.fillStyle = 'rgba(210,205,200,0.55)';
        for (let r = 0; r <= rows; r++) ctx.fillRect(0, r * (bh + g) - g / 2, targetW, g);
        for (let r = 0; r < rows; r++) {
            const off = (r % 2) * ((bw + g) / 2);
            for (let cl = 0; cl <= cols; cl++)
                ctx.fillRect(cl * (bw + g) - off - g / 2, r * (bh + g), g, bh + g);
        }

    } else if (pattern === 'diagonal') {
        ctx.save();
        ctx.translate(targetW / 2, targetH / 2);
        ctx.rotate(Math.PI / 4);
        const d = Math.ceil(Math.sqrt(targetW * targetW + targetH * targetH));
        const g = 3,
            span = Math.ceil(d / (ts + g)) + 4;
        for (let r = -span / 2; r < span / 2; r++)
            for (let cl = -span / 2; cl < span / 2; cl++)
                ctx.drawImage(texCanvas, 0, 0, ts, ts, cl * (ts + g), r * (ts + g), ts, ts);
        ctx.fillStyle = 'rgba(210,205,200,0.5)';
        for (let r = -span / 2; r <= span / 2; r++) ctx.fillRect(-d, r * (ts + g) - g / 2, d * 2, g);
        for (let cl = -span / 2; cl <= span / 2; cl++) ctx.fillRect(cl * (ts + g) - g / 2, -d, g, d * 2);
        ctx.restore();

    } else if (pattern === 'bookmatch') {
        const block = document.createElement('canvas');
        block.width = ts * 2;
        block.height = ts * 2;
        const bCtx = block.getContext('2d');
        bCtx.drawImage(texCanvas, 0, 0);
        bCtx.save();
        bCtx.translate(ts * 2, 0);
        bCtx.scale(-1, 1);
        bCtx.drawImage(texCanvas, 0, 0);
        bCtx.restore();
        bCtx.save();
        bCtx.translate(0, ts * 2);
        bCtx.scale(1, -1);
        bCtx.drawImage(texCanvas, 0, 0);
        bCtx.restore();
        bCtx.save();
        bCtx.translate(ts * 2, ts * 2);
        bCtx.scale(-1, -1);
        bCtx.drawImage(texCanvas, 0, 0);
        bCtx.restore();
        for (let y = 0; y < targetH + ts * 2; y += ts * 2)
            for (let x = 0; x < targetW + ts * 2; x += ts * 2)
                ctx.drawImage(block, x, y);

    } else {
        // Grid (stack bond) with grout
        const g = 3,
            cols = Math.ceil(targetW / (ts + g)) + 2,
            rows = Math.ceil(targetH / (ts + g)) + 2;
        for (let r = 0; r < rows; r++)
            for (let cl = 0; cl < cols; cl++)
                ctx.drawImage(texCanvas, 0, 0, ts, ts, cl * (ts + g), r * (ts + g), ts, ts);
        ctx.fillStyle = 'rgba(210,205,200,0.5)';
        for (let r = 0; r <= rows; r++) ctx.fillRect(0, r * (ts + g) - g / 2, targetW, g);
        for (let cl = 0; cl <= cols; cl++) ctx.fillRect(cl * (ts + g) - g / 2, 0, g, targetH);
    }
    return out;
}

// ══════════════════════════════════════════════════════════════
//  PARTICLE BURST — fires from tile on texture select
// ══════════════════════════════════════════════════════════════

const pCanvas = document.getElementById('particle-canvas');
const pCtx = pCanvas ? pCanvas.getContext('2d') : null;
let pAnimId = null;

function resizeParticleCanvas() {
    if (!pCanvas) return;
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
}
resizeParticleCanvas();
window.addEventListener('resize', resizeParticleCanvas, { passive: true });

function spawnParticles(sourceEl) {
    if (!pCtx || !pCanvas) return;
    const rect = sourceEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const colors = ['#5b9bd5', '#a4c8e1', '#346899', '#ffffff', '#8fc4e8'];
    const particles = [];
    for (let i = 0; i < 24; i++) {
        const angle = (Math.PI * 2 * i) / 24 + (Math.random() - 0.5) * 0.4;
        const speed = 2.5 + Math.random() * 5;
        particles.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.5,
            r: 2 + Math.random() * 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 1,
            decay: 0.025 + Math.random() * 0.02,
            square: Math.random() > 0.5
        });
    }
    if (pAnimId) cancelAnimationFrame(pAnimId);

    function frame() {
        pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
        let alive = false;
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2;
            p.vx *= 0.98;
            p.life -= p.decay;
            if (p.life > 0) {
                alive = true;
                pCtx.save();
                pCtx.globalAlpha = Math.max(0, p.life);
                pCtx.fillStyle = p.color;
                const sz = p.r * Math.max(0, p.life);
                if (p.square) {
                    pCtx.translate(p.x, p.y);
                    pCtx.rotate(p.life * 4);
                    pCtx.fillRect(-sz, -sz, sz * 2, sz * 2);
                } else {
                    pCtx.beginPath();
                    pCtx.arc(p.x, p.y, sz, 0, Math.PI * 2);
                    pCtx.fill();
                }
                pCtx.restore();
            }
        });
        if (alive) pAnimId = requestAnimationFrame(frame);
        else {
            pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
            pAnimId = null;
        }
    }
    frame();
}

function addRipple(tileEl, e) {
    const rect = tileEl.getBoundingClientRect();
    const x = (e.clientX || rect.left + rect.width / 2) - rect.left;
    const y = (e.clientY || rect.top + rect.height / 2) - rect.top;
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.cssText = `left:${x}px;top:${y}px;width:20px;height:20px;margin:-10px 0 0 -10px;`;
    tileEl.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

// ══════════════════════════════════════════════════════════════
//  BEFORE/AFTER COMPARISON SLIDER
// ══════════════════════════════════════════════════════════════

let basPct = 50;
let basDragging = false;
let basHasRender = false;
let basHintShown = false;

const basViewer = () => document.getElementById('comparison-viewer');
const basClipEl = () => document.getElementById('bas-clip');
const basHandleEl = () => document.getElementById('bas-handle');
const basRendImg = () => document.getElementById('img-rendered');

function initBASSlider() {
    const viewer = basViewer();
    if (!viewer) return;
    const handle = basHandleEl();

    const startDrag = e => {
        if (!basHasRender) return;
        basDragging = true;
        const btn = handle.querySelector('.bas-handle-btn');
        if (btn) btn.classList.add('dragging');
        e.preventDefault();
    };
    const onMove = e => {
        if (!basDragging) return;
        const rect = viewer.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        setBASPosition(Math.max(2, Math.min(98, (clientX - rect.left) / rect.width * 100)));
    };
    const endDrag = () => {
        if (!basDragging) return;
        basDragging = false;
        const btn = handle.querySelector('.bas-handle-btn');
        if (btn) btn.classList.remove('dragging');
    };

    handle.addEventListener('mousedown', startDrag, { passive: false });
    handle.addEventListener('touchstart', startDrag, { passive: false });
    viewer.addEventListener('mousemove', onMove, { passive: true });
    viewer.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
    window.addEventListener('resize', syncBASRendered, { passive: true });
}

function syncBASRendered() {
    const viewer = basViewer();
    const rendered = basRendImg();
    if (!viewer || !rendered) return;
    rendered.style.width = viewer.offsetWidth + 'px';
    rendered.style.height = viewer.offsetHeight + 'px';
}

function setBASPosition(pct) {
    basPct = pct;
    const clip = basClipEl();
    const handle = basHandleEl();
    if (clip) clip.style.width = pct + '%';
    if (handle) handle.style.left = pct + '%';
    syncBASRendered();
}

function animateBAS(from, to, duration) {
    const start = performance.now();
    const step = now => {
        const t = Math.min(1, (now - start) / duration);
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        setBASPosition(from + (to - from) * ease);
        if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

function showBASRender() {
    basHasRender = true;
    const clip = basClipEl();
    const handle = basHandleEl();
    const labelAf = document.getElementById('ba-label-after');
    const es = document.getElementById('viewer-empty-state');

    if (clip) clip.classList.add('has-render');
    if (handle) {
        handle.style.opacity = '1';
        handle.style.pointerEvents = 'all';
    }
    if (labelAf) labelAf.style.opacity = '1';
    if (es) es.classList.add('hidden');

    animateBAS(100, 50, 650);

    if (!basHintShown) {
        const hint = document.getElementById('bas-drag-hint');
        if (hint) {
            hint.style.animation = 'none';
            void hint.offsetWidth;
            hint.style.animation = '';
        }
        basHintShown = true;
    }
    triggerShimmer();
}

function hideBASRender() {
    basHasRender = false;
    const clip = basClipEl();
    const handle = basHandleEl();
    const labelAf = document.getElementById('ba-label-after');

    if (clip) {
        clip.classList.remove('has-render');
        clip.style.width = '100%';
    }
    if (handle) {
        handle.style.left = '100%';
        handle.style.opacity = '0';
        handle.style.pointerEvents = 'none';
    }
    if (labelAf) labelAf.style.opacity = '0';
    syncBASRendered();
}

function triggerShimmer() {
    const viewer = basViewer();
    if (!viewer) return;
    const shimmer = document.createElement('div');
    shimmer.className = 'render-shimmer';
    viewer.appendChild(shimmer);
    setTimeout(() => shimmer.remove(), 1000);
}

// ══════════════════════════════════════════════════════════════
//  LOADER MESSAGES — cycling during AI render
// ══════════════════════════════════════════════════════════════

const LOADER_MSGS = [
    'Analyzing your space...',
    'Detecting surfaces...',
    'Mapping stone pattern...',
    'Applying textures...',
    'Calibrating lighting...',
    'Adding natural realism...',
    'Polishing final render...',
    'Almost there...'
];
let loaderMsgIdx = 0,
    loaderMsgTimer = null,
    loaderBarTimer = null;

function startLoaderAnimation() {
    loaderMsgIdx = 0;
    const msgEl = document.getElementById('loader-msg');
    const barEl = document.getElementById('loader-progress-bar');
    if (msgEl) msgEl.textContent = LOADER_MSGS[0];
    if (barEl) barEl.style.width = '0%';

    loaderMsgTimer = setInterval(() => {
        loaderMsgIdx = (loaderMsgIdx + 1) % LOADER_MSGS.length;
        if (msgEl) {
            msgEl.style.opacity = '0';
            setTimeout(() => {
                msgEl.textContent = LOADER_MSGS[loaderMsgIdx];
                msgEl.style.opacity = '1';
            }, 200);
        }
    }, 1800);

    let progress = 0;
    loaderBarTimer = setInterval(() => {
        progress = Math.min(90, progress + Math.random() * 8);
        if (barEl) barEl.style.width = progress + '%';
    }, 420);
}

function stopLoaderAnimation() {
    clearInterval(loaderMsgTimer);
    clearInterval(loaderBarTimer);
    const barEl = document.getElementById('loader-progress-bar');
    if (barEl) {
        barEl.style.width = '100%';
        setTimeout(() => { barEl.style.width = '0%'; }, 600);
    }
}

// ══════════════════════════════════════════════════════════════
//  CURSOR + WATCHER ROBOT
// ══════════════════════════════════════════════════════════════

let mx = innerWidth / 2,
    my = innerHeight / 2,
    dx = mx,
    dy = my,
    rx = mx,
    ry = my;
const dotEl = document.getElementById('cursor-dot');
const ringEl = document.getElementById('cursor-ring');
const headEl = document.getElementById('watcher-head');
const pupils = document.querySelectorAll('.pupil');
let headRect = null;

function refreshHeadRect() {
    if (headEl && headEl.offsetParent) {
        const r = headEl.getBoundingClientRect();
        headRect = { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
    } else headRect = null;
}
window.addEventListener('resize', refreshHeadRect);
window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
}, { passive: true });

(function tick() {
    dx += (mx - dx) * 0.5;
    dy += (my - dy) * 0.5;
    rx += (mx - rx) * 0.2;
    ry += (my - ry) * 0.2;
    dotEl.style.transform = `translate3d(${dx-3}px,${dy-3}px,0)`;
    ringEl.style.transform = `translate3d(${rx-18}px,${ry-18}px,0)`;
    if (headRect && headEl.offsetParent) {
        const aX = Math.max(-25, Math.min(25, (my - headRect.cy) / 10));
        const aY = Math.max(-35, Math.min(35, (mx - headRect.cx) / 10));
        headEl.style.transform = `rotateX(${-aX}deg) rotateY(${aY}deg) translateZ(0)`;
        pupils.forEach(p => {
            const ddx = mx - headRect.cx,
                ddy = my - headRect.cy;
            const ang = Math.atan2(ddy, ddx),
                dist = Math.min(4, Math.sqrt(ddx * ddx + ddy * ddy) / 80);
            p.style.transform = `translate3d(${Math.cos(ang)*dist}px,${Math.sin(ang)*dist}px,0)`;
        });
    }
    requestAnimationFrame(tick);
})();

document.addEventListener('fullscreenchange', () => {
    const viewer = document.getElementById('comparison-viewer');
    const exitBtn = document.getElementById('exit-fullscreen-btn');
    if (document.fullscreenElement) {
        viewer.appendChild(dotEl);
        viewer.appendChild(ringEl);
        exitBtn.style.display = 'flex';
        setTimeout(syncBASRendered, 120);
    } else {
        document.body.appendChild(dotEl);
        document.body.appendChild(ringEl);
        exitBtn.style.display = 'none';
        setTimeout(syncBASRendered, 120);
    }
});

// ══════════════════════════════════════════════════════════════
//  KEYBOARD SHORTCUTS
// ══════════════════════════════════════════════════════════════

window.addEventListener('keydown', e => {
    const tag = document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const tiles = Array.from(document.querySelectorAll('.tex-tile'));
        if (!tiles.length) return;
        const activeIdx = tiles.findIndex(t => t.dataset.id === S.surfaceTextures[S.activeSurface]);
        let next = activeIdx + (e.key === 'ArrowLeft' ? -1 : 1);
        next = Math.max(0, Math.min(tiles.length - 1, next));
        if (next !== activeIdx) tiles[next].click();
        tiles[next].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        e.preventDefault();
    }
    if (e.key === 'c' || e.key === 'C') clearActiveSurface();
    if (e.key === 'f' || e.key === 'F') toggleFullScreen();
    if (e.key === 'Escape' && document.fullscreenElement) document.exitFullscreen();
});

// ══════════════════════════════════════════════════════════════
//  APP STATE
// ══════════════════════════════════════════════════════════════

const API_BASE = (location.port === '8000' || location.port === '') ? '' : 'http://' + location.hostname + ':8000';

const S = {
    baseImage: null,
    category: null,
    stream: null,
    currentRenderUrl: null,
    currentMaskUrl: null,
    activeSurface: null,
    activeLabel: null,
    wallCoverage: 1.0,
    floorPattern: 'plain', // ← plain default; no grout until user picks a pattern
    surfaceTextures: {},
    usedFallback: false
};

let textureLibrary = [];
let nextTexId = 1;
let _creationId = 0;
let _creationCount = 0;
const _creationStore = {};
let historyStack = ['screen-category'];
let activeVaultCat = 'Marble';
let _slideAnimating = false;

// ══════════════════════════════════════════════════════════════
//  NAVIGATION
// ══════════════════════════════════════════════════════════════

function switchView(id, back = false) {
    document.querySelectorAll('.view-screen').forEach(v => v.classList.remove('active'));
    if (!back && historyStack[historyStack.length - 1] !== id) historyStack.push(id);
    setTimeout(() => {
        document.getElementById(id).classList.add('active');
        setTimeout(refreshHeadRect, 100);
        if (id === 'screen-workspace') setTimeout(syncBASRendered, 200);
    }, 50);
}

function stopCamera() {
    if (S.stream) {
        S.stream.getTracks().forEach(t => t.stop());
        S.stream = null;
    }
    const v = document.getElementById('camera-feed');
    if (v) v.srcObject = null;
}

function navigateBack() {
    if (historyStack.length > 1) {
        historyStack.pop();
        const prev = historyStack[historyStack.length - 1];
        if (prev !== 'screen-camera') stopCamera();
        switchView(prev, true);
    } else {
        stopCamera();
        window.location.href = 'index.html';
    }
}

// ══════════════════════════════════════════════════════════════
//  SURFACE CONFIG
// ══════════════════════════════════════════════════════════════

const SURFACES = {
    hall: [{ id: 'floor', label: 'Floor' }, { id: 'wall', label: 'Walls' }],
    kitchen: [{ id: 'countertop', label: 'Countertops' }, { id: 'cabinet', label: 'Cabinets' }],
    bathroom: [{ id: 'wall', label: 'Walls' }, { id: 'floor', label: 'Floor' },
        { id: 'vanity', label: 'Vanity' }, { id: 'shower', label: 'Shower' }
    ]
};

function updateClearBtn() {
    const btn = document.getElementById('clear-surface-btn');
    const txt = document.getElementById('clear-btn-text');
    S.surfaceTextures[S.activeSurface] ? btn.classList.add('active') : btn.classList.remove('active');
    txt.innerText = 'Revert ' + (S.activeLabel || 'Area');
}

function showPatternSelector(show) {
    const el = document.getElementById('pattern-selector');
    if (!el) return;
    // Use setProperty to safely override any existing CSS rule
    el.style.setProperty('display', show ? 'flex' : 'none', 'important');
}

function selectPattern(pid, el) {
    document.querySelectorAll('#pattern-selector .pattern-pill').forEach(p => p.classList.remove('active'));
    if (el) el.classList.add('active');
    S.floorPattern = pid;
    if (S.surfaceTextures[S.activeSurface]) triggerRender();
}

function selectCategory(cat) {
    S.category = cat;
    S.surfaceTextures = {};
    SURFACES[cat].forEach(sf => { S.surfaceTextures[sf.id] = null; });
    S.activeSurface = SURFACES[cat][0].id;
    S.activeLabel = SURFACES[cat][0].label;
    S.wallCoverage = 1.0;
    S.floorPattern = 'plain';
    document.getElementById('wall-coverage-slider').value = 100;
    document.getElementById('wall-coverage-val').innerText = '100%';
    // Reset pattern pills — activate Plain (first)
    document.querySelectorAll('#pattern-selector .pattern-pill').forEach((p, i) => p.classList.toggle('active', i === 0));
    const tips = {
        hall: 'Ensure maximum floor and wall visibility.',
        kitchen: 'Ensure a clear view of countertops and cabinets.',
        bathroom: 'Ensure clear view of vanity, walls, floors, and shower.'
    };
    document.getElementById('input-title').innerText = cat.charAt(0).toUpperCase() + cat.slice(1);
    document.getElementById('capture-tip').innerText = tips[cat] || '';
    buildSurfacePills(cat);
    switchView('screen-input');
}

function buildSurfacePills(cat) {
    const sel = document.getElementById('surface-selector');
    sel.innerHTML = '';
    SURFACES[cat].forEach(sf => {
        const pill = document.createElement('div');
        pill.className = 'surface-pill hover-target' + (sf.id === S.activeSurface ? ' active' : '');
        pill.innerText = sf.label;
        pill.onclick = () => {
            document.querySelectorAll('.surface-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            S.activeSurface = sf.id;
            S.activeLabel = sf.label;
            updateClearBtn();
            refreshVaultSelection();
            document.getElementById('wall-slider-container').style.display = sf.id === 'wall' ? 'block' : 'none';
            showPatternSelector(sf.id === 'floor');
        };
        sel.appendChild(pill);
    });
    document.getElementById('wall-slider-container').style.display = S.activeSurface === 'wall' ? 'block' : 'none';
    showPatternSelector(S.activeSurface === 'floor');
    updateClearBtn();
}

document.getElementById('wall-coverage-slider').addEventListener('input', e => {
    document.getElementById('wall-coverage-val').innerText = e.target.value + '%';
}, { passive: true });

document.getElementById('wall-coverage-slider').addEventListener('change', e => {
    S.wallCoverage = parseInt(e.target.value) / 100;
    if (S.surfaceTextures[S.activeSurface]) triggerRender();
});

// ══════════════════════════════════════════════════════════════
//  VAULT — CATEGORY TABS + SLIDE ANIMATION
// ══════════════════════════════════════════════════════════════

function buildVaultTabs() {
    const strip = document.getElementById('vault-cat-strip');
    if (!strip) return;
    strip.innerHTML = '';
    const available = CAT_ORDER.filter(cat => textureLibrary.some(t => t.category === cat));
    if (!available.includes(activeVaultCat)) activeVaultCat = available[0] || 'Marble';

    available.forEach(cat => {
        const count = textureLibrary.filter(t => t.category === cat).length;
        const btn = document.createElement('button');
        btn.className = 'vault-cat-tab' + (cat === activeVaultCat ? ' active' : '');
        btn.textContent = cat;
        btn.title = `${count} stone${count !== 1 ? 's' : ''}`;
        btn.dataset.cat = cat;
        btn.onclick = () => {
            if (_slideAnimating || cat === activeVaultCat) return;
            const oldIdx = available.indexOf(activeVaultCat);
            const newIdx = available.indexOf(cat);
            const dir = newIdx > oldIdx ? 'left' : 'right';
            document.querySelectorAll('.vault-cat-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeVaultCat = cat;
            showVaultCategory(cat, dir);
        };
        strip.appendChild(btn);
    });
}

function showVaultCategory(cat, direction) {
    const track = document.getElementById('vault-slide-track');
    const emptyEl = document.getElementById('vault-empty-state');
    if (!track) return;
    const tiles = textureLibrary.filter(t => t.category === cat);
    if (tiles.length === 0) { track.innerHTML = ''; if (emptyEl) emptyEl.style.display = 'flex'; return; }
    if (emptyEl) emptyEl.style.display = 'none';
    const renderTiles = () => {
        track.innerHTML = '';
        tiles.forEach(tex => track.appendChild(buildTexTileEl(tex)));
    };
    if (direction === 'none') { renderTiles(); return; }
    _slideAnimating = true;
    const outClass = direction === 'left' ? 'slide-out-left' : 'slide-out-right';
    const inClass = direction === 'left' ? 'slide-in-right' : 'slide-in-left';
    track.classList.add(outClass);
    setTimeout(() => {
        track.classList.remove(outClass);
        renderTiles();
        track.getBoundingClientRect();
        track.classList.add(inClass);
        requestAnimationFrame(() => requestAnimationFrame(() => {
            track.classList.remove(inClass);
            setTimeout(() => { _slideAnimating = false; }, 350);
        }));
    }, 260);
}

function buildTexTileEl(tex) {
    const tile = document.createElement('div');
    tile.className = 'tex-tile hover-target';
    tile.dataset.id = tex.id;
    if (S.surfaceTextures[S.activeSurface] === tex.id) tile.classList.add('tex-tile--active');

    const delHtml = tex.isDefault ? '' :
        `<button class="tex-delete-btn hover-target" title="Remove">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
             <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
           </svg>
         </button>`;

    tile.innerHTML = `
        <div class="tex-img-wrap">
            <img class="tex-thumb" src="${tex.dataUrl}" alt="${tex.name}" loading="lazy">
            <div class="tex-check-overlay">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            </div>
        </div>
        <span class="tex-tile-name">${tex.name}</span>
        ${delHtml}`;

    tile.addEventListener('click', e => {
        if (e.target.closest('.tex-delete-btn')) return;
        addRipple(tile, e);
        spawnParticles(tile);
        applyTexture(tex.id);
        updateSelectedBanner(tex.name);
    });
    if (!tex.isDefault) {
        const db = tile.querySelector('.tex-delete-btn');
        if (db) db.addEventListener('click', e => {
            e.stopPropagation();
            removeTexture(tex.id);
        });
    }
    return tile;
}

function updateSelectedBanner(name) {
    const banner = document.getElementById('vault-selected-name');
    if (!banner) return;
    banner.classList.remove('banner-pop');
    void banner.offsetWidth;
    banner.textContent = name;
    banner.classList.add('banner-pop');
}

function rebuildVaultGrid() {
    buildVaultTabs();
    showVaultCategory(activeVaultCat, 'none');
    const texId = S.activeSurface && S.surfaceTextures[S.activeSurface];
    if (texId) { const t = textureLibrary.find(x => x.id === texId); if (t) updateSelectedBanner(t.name); }
}

// ── Texture upload ──
document.getElementById('texture-upload-input').addEventListener('change', e => {
    Array.from(e.target.files).forEach(f => { if (f.type.startsWith('image/')) loadTextureFile(f); });
    e.target.value = '';
});

const vaultWrap = document.getElementById('texture-vault-wrap');
if (vaultWrap) {
    vaultWrap.addEventListener('dragover', e => {
        e.preventDefault();
        vaultWrap.classList.add('drag-over');
    });
    vaultWrap.addEventListener('dragleave', () => vaultWrap.classList.remove('drag-over'));
    vaultWrap.addEventListener('drop', e => {
        e.preventDefault();
        vaultWrap.classList.remove('drag-over');
        Array.from(e.dataTransfer.files).forEach(f => { if (f.type.startsWith('image/')) loadTextureFile(f); });
    });
}

function loadTextureFile(file) {
    const reader = new FileReader();
    reader.onload = ev => {
        const dataUrl = ev.target.result;
        const id = 'tex_' + (nextTexId++);
        const name = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').slice(0, 22);
        const img = new Image();
        img.onload = () => {
            const sc = document.createElement('canvas');
            sc.width = sc.height = 1;
            sc.getContext('2d').drawImage(img, 0, 0, 1, 1);
            const px = sc.getContext('2d').getImageData(0, 0, 1, 1).data;
            textureLibrary.push({ id, name, dataUrl, baseColor: [px[0], px[1], px[2]], category: 'Custom' });
            activeVaultCat = 'Custom';
            rebuildVaultGrid();
            showToast(`✓ "${name}" added to vault`);
        };
        img.src = dataUrl;
    };
    reader.readAsDataURL(file);
}

function applyTexture(texId) {
    S.surfaceTextures[S.activeSurface] = texId;
    updateClearBtn();
    refreshVaultSelection();
    triggerRender();
}

function refreshVaultSelection() {
    document.querySelectorAll('.tex-tile').forEach(tile =>
        tile.classList.toggle('tex-tile--active', tile.dataset.id === S.surfaceTextures[S.activeSurface])
    );
}

function removeTexture(texId) {
    const tex = textureLibrary.find(t => t.id === texId);
    if (!tex || tex.isDefault) return;
    textureLibrary = textureLibrary.filter(t => t.id !== texId);
    Object.keys(S.surfaceTextures).forEach(sf => { if (S.surfaceTextures[sf] === texId) S.surfaceTextures[sf] = null; });
    updateClearBtn();
    rebuildVaultGrid();
    showToast('Texture removed.');
}

// ══════════════════════════════════════════════════════════════
//  CAMERA / FILE INPUT
// ══════════════════════════════════════════════════════════════

document.getElementById('file-upload').addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f) return;
    e.target.value = '';
    const reader = new FileReader();
    reader.onload = ev => {
        S.baseImage = ev.target.result;
        initWorkspace();
    };
    reader.readAsDataURL(f);
});

async function openCamera() {
    try {
        S.stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
        });
        document.getElementById('camera-feed').srcObject = S.stream;
        switchView('screen-camera');
    } catch { alert('Camera access denied or unavailable on this device.'); }
}

function capturePhoto() {
    const v = document.getElementById('camera-feed');
    const c = document.getElementById('capture-canvas');
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext('2d').drawImage(v, 0, 0);
    S.baseImage = c.toDataURL('image/jpeg', 0.92);
    stopCamera();
    initWorkspace();
}

function initWorkspace() {
    document.getElementById('img-original').src = S.baseImage;
    document.getElementById('img-rendered').src = S.baseImage;
    S.currentRenderUrl = null;
    S.currentMaskUrl = null;
    S.usedFallback = false;
    if (S.category) SURFACES[S.category].forEach(sf => { S.surfaceTextures[sf.id] = null; });
    updateClearBtn();
    rebuildVaultGrid();
    document.getElementById('visual-watermark-canvas').style.opacity = '0';
    document.getElementById('fallback-badge').style.display = 'none';
    const banner = document.getElementById('vault-selected-name');
    if (banner) banner.textContent = '— Select a material —';
    hideBASRender();
    const es = document.getElementById('viewer-empty-state');
    if (es) es.classList.remove('hidden');
    switchView('screen-workspace');
    setTimeout(() => {
        refreshHeadRect();
        syncBASRendered();
    }, 300);
}

// ══════════════════════════════════════════════════════════════
//  CLEAR SURFACE
// ══════════════════════════════════════════════════════════════

function clearActiveSurface() {
    if (!S.surfaceTextures[S.activeSurface]) return;
    S.surfaceTextures[S.activeSurface] = null;
    updateClearBtn();
    refreshVaultSelection();
    const banner = document.getElementById('vault-selected-name');
    if (banner) banner.textContent = '— Select a material —';
    const anyLeft = Object.values(S.surfaceTextures).some(v => v);
    if (!anyLeft) {
        document.getElementById('img-rendered').src = S.baseImage;
        document.getElementById('visual-watermark-canvas').style.opacity = '0';
        document.getElementById('fallback-badge').style.display = 'none';
        S.currentRenderUrl = null;
        S.currentMaskUrl = null;
        S.usedFallback = false;
        hideBASRender();
        const es = document.getElementById('viewer-empty-state');
        if (es) es.classList.remove('hidden');
    } else triggerRender(true);
}

// ══════════════════════════════════════════════════════════════
//  TOAST
// ══════════════════════════════════════════════════════════════

let _toastTimer = null;

function showToast(msg, isError = false) {
    const t = document.getElementById('render-toast');
    t.textContent = msg;
    t.className = isError ? 'toast-error show' : 'show';
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => t.classList.remove('show'), 5000);
}

// ══════════════════════════════════════════════════════════════
//  CLIENT FALLBACK RENDER
// ══════════════════════════════════════════════════════════════

function doComposite(ctx, patternCanvas, w, h, maskY, maskH) {
    ctx.save();
    ctx.globalAlpha = 0.65;
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(patternCanvas, 0, maskY, w, maskH, 0, maskY, w, maskH);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    const sh = ctx.createLinearGradient(0, 0, w, h);
    sh.addColorStop(0, 'rgba(255,255,255,0.04)');
    sh.addColorStop(0.5, 'rgba(255,255,255,0.10)');
    sh.addColorStop(1, 'rgba(255,255,255,0.02)');
    ctx.fillStyle = sh;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
}

function clientFallback() {
    return new Promise(resolve => {
        const activeTex = Object.values(S.surfaceTextures).find(v => v);
        const texObj = textureLibrary.find(t => t.id === activeTex);
        const img = new Image();
        img.onload = () => {
            const c = document.createElement('canvas');
            c.width = img.naturalWidth;
            c.height = img.naturalHeight;
            const ctx = c.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const surf = S.activeSurface,
                w = c.width,
                h = c.height;
            let maskY = 0,
                maskH = h;
            if (surf === 'floor') {
                maskY = Math.floor(h * 0.55);
                maskH = h - maskY;
            } else if (surf === 'wall') { maskH = Math.floor(h * 0.55 * S.wallCoverage); } else if (surf === 'countertop' || surf === 'vanity') {
                maskY = Math.floor(h * 0.35);
                maskH = Math.floor(h * 0.30);
            } else if (surf === 'cabinet') { maskH = Math.floor(h * 0.50); } else if (surf === 'shower') {
                maskY = Math.floor(h * 0.15);
                maskH = Math.floor(h * 0.70);
            }
            const ts = Math.round(Math.min(w, h) * 0.22);
            if (texObj && texObj.dataUrl) {
                const ti = new Image();
                ti.onload = () => {
                    const tc = document.createElement('canvas');
                    tc.width = ts;
                    tc.height = ts;
                    tc.getContext('2d').drawImage(ti, 0, 0, ts, ts);
                    const patCanvas = generateClientPattern(tc, surf === 'floor' ? S.floorPattern : 'plain', w, maskH);
                    const fullPat = document.createElement('canvas');
                    fullPat.width = w;
                    fullPat.height = h;
                    fullPat.getContext('2d').drawImage(patCanvas, 0, maskY);
                    doComposite(ctx, fullPat, w, h, maskY, maskH);
                    resolve(c.toDataURL('image/jpeg', 0.92));
                };
                ti.onerror = () => resolve(S.baseImage);
                ti.src = texObj.dataUrl;
            } else resolve(S.baseImage);
        };
        img.onerror = () => resolve(S.baseImage);
        img.src = S.baseImage;
    });
}

// ══════════════════════════════════════════════════════════════
//  WATERMARK
// ══════════════════════════════════════════════════════════════

function buildWatermarkPattern() {
    const pc = document.getElementById('watermark-pattern-canvas');
    const pCtx = pc.getContext('2d');
    pc.width = 400;
    pc.height = 200;
    pCtx.fillStyle = 'rgba(255,255,255,0.65)';
    pCtx.font = 'bold 21px Cinzel, serif';
    pCtx.textAlign = 'center';
    pCtx.textBaseline = 'middle';
    pCtx.translate(200, 100);
    pCtx.rotate(-Math.PI / 6);
    pCtx.fillText('umatraders.net', 0, 0);
    return pCtx.createPattern(pc, 'repeat');
}
const WM_PATTERN = buildWatermarkPattern();

async function applyWatermark(renderedImg, canvas, maskUrl) {
    const ctx = canvas.getContext('2d');
    const w = renderedImg.naturalWidth || renderedImg.width;
    const h = renderedImg.naturalHeight || renderedImg.height;
    canvas.width = w;
    canvas.height = h;
    const pc = document.createElement('canvas');
    pc.width = w;
    pc.height = h;
    pc.getContext('2d').fillStyle = WM_PATTERN;
    pc.getContext('2d').fillRect(0, 0, w, h);
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(pc, 0, 0);
    if (maskUrl) {
        const mask = new Image();
        mask.crossOrigin = 'Anonymous';
        await new Promise(r => {
            mask.onload = r;
            mask.onerror = r;
            mask.src = maskUrl;
        });
        if (mask.naturalWidth > 0) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.drawImage(mask, 0, 0, w, h);
            ctx.globalCompositeOperation = 'source-over';
        }
    }
    canvas.style.opacity = '1';
}

// ══════════════════════════════════════════════════════════════
//  MAIN RENDER PIPELINE
// ══════════════════════════════════════════════════════════════

async function triggerRender(isErase = false) {
    const loader = document.getElementById('render-loader');
    const wmCanvas = document.getElementById('visual-watermark-canvas');
    const fbBadge = document.getElementById('fallback-badge');
    const resultImg = document.getElementById('img-rendered');

    loader.classList.add('visible');
    startLoaderAnimation();
    resultImg.style.opacity = '0';
    wmCanvas.style.opacity = '0';
    fbBadge.style.display = 'none';

    const activeTextures = {},
        textureData = {};
    for (const [surf, texId] of Object.entries(S.surfaceTextures)) {
        if (!texId) continue;
        const t = textureLibrary.find(x => x.id === texId);
        if (t) {
            activeTextures[surf] = texId;
            textureData[texId] = t.dataUrl;
        }
    }

    let finalUrl = null,
        finalMaskUrl = null,
        usedFallback = false;

    try {
        const ctrl = new AbortController();
        const timeout = setTimeout(() => ctrl.abort(), 30000);
        const res = await fetch(`${API_BASE}/api/render`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: ctrl.signal,
            body: JSON.stringify({
                room_image: S.baseImage,
                room_type: S.category,
                surface_textures: activeTextures,
                texture_data: textureData,
                wall_coverage: S.wallCoverage,
                floor_pattern: S.floorPattern
            })
        });
        clearTimeout(timeout);
        if (!res.ok) {
            let detail = `Server error ${res.status}`;
            try { detail = (await res.json()).detail || detail; } catch {}
            throw new Error(detail);
        }
        const data = await res.json();
        if (!data.final_image_url || !data.final_image_url.startsWith('data:image'))
            throw new Error('Backend returned invalid image data.');
        finalUrl = data.final_image_url;
        finalMaskUrl = data.floor_mask_url || null;
    } catch (err) {
        usedFallback = true;
        console.warn('[Uma Visualizer] Backend unavailable:', err.message);
        if (!isErase && Object.values(S.surfaceTextures).some(v => v)) {
            finalUrl = await clientFallback();
            fbBadge.style.display = 'block';
            showToast(err.name === 'AbortError' ?
                '⚡ AI timed out — showing live preview.' :
                '⚡ AI server offline — showing live preview.', false);
        } else finalUrl = S.baseImage;
    }

    stopLoaderAnimation();

    if (finalUrl) {
        S.currentRenderUrl = finalUrl;
        S.currentMaskUrl = finalMaskUrl;
        S.usedFallback = usedFallback;
        await new Promise(resolve => {
            resultImg.onload = resolve;
            resultImg.onerror = resolve;
            resultImg.src = finalUrl;
        });
        syncBASRendered();
        resultImg.style.opacity = '1';
        if (finalMaskUrl && !usedFallback) applyWatermark(resultImg, wmCanvas, finalMaskUrl);
        showBASRender();
        if (!isErase) addCreation(finalUrl, usedFallback);
    }

    loader.classList.remove('visible');
}

// ══════════════════════════════════════════════════════════════
//  CREATIONS GALLERY
// ══════════════════════════════════════════════════════════════

function updateCreationsCount() {
    const el = document.getElementById('creations-count');
    if (!el) return;
    el.textContent = _creationCount === 0 ?
        'No designs yet — start visualizing!' :
        `${_creationCount} design${_creationCount !== 1 ? 's' : ''} saved this session`;
}

function addCreation(imgUrl, isFallback) {
    const cid = 'c' + (++_creationId);
    _creationCount++;
    updateCreationsCount();
    const name = Object.entries(S.surfaceTextures)
        .filter(([, v]) => v)
        .map(([surf, texId]) => {
            const t = textureLibrary.find(tx => tx.id === texId);
            return surf + ': ' + (t ? t.name : texId);
        }).join(', ') || 'Custom';
    _creationStore[cid] = { url: imgUrl, name };

    const grid = document.getElementById('creations-grid');
    const fbTag = isFallback ?
        `<span style="font-size:.55rem;color:var(--sky-main);font-weight:700;letter-spacing:1px;margin-left:6px;text-transform:uppercase;">Preview</span>` : '';
    const card = document.createElement('div');
    card.className = 'creation-card hover-target';
    card.id = 'creation-' + cid;
    card.innerHTML = `
        <div style="position:absolute;top:12px;right:12px;display:flex;gap:8px;z-index:10;">
            <button onclick="viewCreation('${cid}')" title="View" style="background:rgba(13,27,42,.8);border:1px solid rgba(255,255,255,.3);color:#fff;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);cursor:pointer;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
            </button>
            <button onclick="dlCreation('${cid}')" title="Download" style="background:rgba(13,27,42,.8);border:1px solid rgba(255,255,255,.3);color:#fff;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);cursor:pointer;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            </button>
        </div>
        <div style="position:absolute;bottom:62px;right:14px;color:rgba(255,255,255,.75);font-family:'Cinzel',serif;font-size:.62rem;font-weight:700;text-shadow:0 2px 8px rgba(0,0,0,.9);pointer-events:none;z-index:5;">umatraders.net</div>
        <img class="creation-img" src="${imgUrl}" alt="${name}" loading="lazy">
        <div style="padding:14px 16px 18px;">
            <h4 style="font-family:'Cinzel',serif;color:var(--sky-deep);letter-spacing:1.5px;font-size:.78rem;">${name}${fbTag}</h4>
            <p style="font-size:.62rem;color:#5a6e82;margin-top:5px;letter-spacing:1px;font-weight:600;">${S.category.toUpperCase()} — UMA TRADERS</p>
        </div>`;
    grid.prepend(card);
}

function viewCreation(cid) { const e = _creationStore[cid]; if (e) viewFullscreen(e.url); }

function dlCreation(cid) { const e = _creationStore[cid]; if (e) dlImage(e.url, e.name); }

function dlImage(url, name) {
    const a = document.createElement('a');
    a.download = 'UmaTraders_' + name.replace(/\s+/g, '_') + '.jpg';
    a.href = url;
    a.click();
}

function viewFullscreen(url) {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,.96);display:flex;align-items:center;justify-content:center;';
    const img = document.createElement('img');
    img.src = url;
    img.style.cssText = 'max-width:95%;max-height:95vh;object-fit:contain;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.6);';
    const btn = document.createElement('button');
    btn.textContent = '✕ Close';
    btn.style.cssText = 'position:absolute;top:24px;right:24px;padding:10px 22px;background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.25);border-radius:20px;cursor:pointer;font-family:"Montserrat",sans-serif;font-size:.72rem;letter-spacing:2px;font-weight:700;backdrop-filter:blur(8px);';
    btn.onclick = () => document.body.removeChild(wrap);
    wrap.appendChild(btn);
    wrap.appendChild(img);
    wrap.addEventListener('click', e => { if (e.target === wrap) document.body.removeChild(wrap); });
    document.body.appendChild(wrap);
}

// ══════════════════════════════════════════════════════════════
//  FULLSCREEN + HQ DOWNLOAD
// ══════════════════════════════════════════════════════════════

function toggleFullScreen() {
    const v = document.getElementById('comparison-viewer');
    if (!document.fullscreenElement) v.requestFullscreen().catch(console.error);
    else document.exitFullscreen();
}

async function downloadHQRender() {
    if (!S.currentRenderUrl) { showToast('Apply a texture first, then download.', true); return; }
    const loader = document.getElementById('render-loader');
    const loaderMsg = document.getElementById('loader-msg');
    loader.classList.add('visible');
    if (loaderMsg) loaderMsg.textContent = 'Preparing HQ Download...';
    try {
        const sc = document.getElementById('secure-canvas');
        const sCtx = sc.getContext('2d');
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        await new Promise(r => {
            img.onload = r;
            img.src = S.currentRenderUrl;
        });
        sc.width = img.naturalWidth || img.width;
        sc.height = img.naturalHeight || img.height;
        sCtx.drawImage(img, 0, 0);
        const wc = document.createElement('canvas');
        wc.width = sc.width;
        wc.height = sc.height;
        const wCtx = wc.getContext('2d');
        const fs = Math.floor(sc.height * 0.042);
        wCtx.font = `bold ${fs}px Cinzel, serif`;
        wCtx.fillStyle = 'rgba(255,255,255,0.62)';
        wCtx.textAlign = 'center';
        wCtx.textBaseline = 'middle';
        const stepX = Math.floor(sc.width * 0.28),
            stepY = Math.floor(sc.height * 0.16);
        wCtx.save();
        wCtx.translate(sc.width / 2, sc.height / 2);
        wCtx.rotate(-Math.PI / 6);
        wCtx.translate(-sc.width / 2, -sc.height / 2);
        for (let x = -sc.width; x < sc.width * 2; x += stepX)
            for (let y = -sc.height; y < sc.height * 2; y += stepY)
                wCtx.fillText('umatraders.net', x, y);
        wCtx.restore();
        sCtx.drawImage(wc, 0, 0);
        const a = document.createElement('a');
        a.download = 'UmaTraders_Premium_Design.jpg';
        a.href = sc.toDataURL('image/jpeg', 0.95);
        a.click();
        showToast('✓ High-quality image downloaded!');
    } catch (e) {
        console.error(e);
        showToast('Download failed. Please try again.', true);
    } finally {
        loader.classList.remove('visible');
        if (loaderMsg) loaderMsg.textContent = 'Sculpting Reality...';
    }
}

// ══════════════════════════════════════════════════════════════
//  WHATSAPP QUOTE
// ══════════════════════════════════════════════════════════════

function sendQuoteWhatsApp() {
    const selected = Object.entries(S.surfaceTextures)
        .filter(([, v]) => v)
        .map(([surf, texId]) => {
            const t = textureLibrary.find(tx => tx.id === texId);
            return `${surf}: ${t ? t.name : texId}`;
        }).join(', ');
    const msg = encodeURIComponent(
        `*Quote Request — Uma Traders*\n\n*Room Type:* ${S.category ? S.category.toUpperCase() : 'N/A'}\n*Materials:* ${selected || 'Not selected yet'}\n\nPlease share pricing and availability.`
    );
    window.open('https://wa.me/919336366388?text=' + msg, '_blank');
}

// ══════════════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════════════

initDefaultTextures();
initBASSlider();