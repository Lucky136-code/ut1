document.addEventListener("DOMContentLoaded", () => {
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
        if (!modal) return;

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
        if (grid) {
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
        }

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
            if (!loading || !loadingText) return;
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
            if (resultImg) {
                resultImg.src = src;
                resultImg.style.display = 'block';
            }
            if (uploadZone) uploadZone.style.display = 'none';
            if (resultBar) resultBar.style.display  = 'flex';
            if (resultLabel) resultLabel.textContent  = matName + ' • ' + roomType;
        }

        function resetToUpload() {
            roomImageB64 = null;
            selectedMat  = null;
            if (resultImg) resultImg.style.display  = 'none';
            if (resultBar) resultBar.style.display  = 'none';
            if (uploadZone) uploadZone.style.display = '';
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
            if (scanBtn) {
                scanBtn.disabled = true;
                scanBtn.textContent = '⏳ Scanning…';
            }
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
                if (resultImg) {
                    resultImg.src = data.scan_image_url;
                    resultImg.style.display = 'block';
                }
                if (uploadZone) uploadZone.style.display = 'none';
                if (resultBar) resultBar.style.display = 'flex';
                if (resultLabel) resultLabel.textContent = `Floor detected — ${data.coverage_pct}% coverage · Now select a texture →`;
                if (scanBadge) scanBadge.style.display = 'block';
                if (scanBtn) scanBtn.style.display = 'none';
            } catch(err) {
                showLoading(false);
                if (scanBtn) {
                    scanBtn.disabled = false;
                    scanBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Retry Scan';
                }
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
                if (loadingText && loading) {
                    loadingText.textContent = 'Render failed — '+(err.message||'check server');
                    loading.style.display = 'flex';
                    setTimeout(()=>{loading.style.display='none';}, 3500);
                }
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
                if (uploadZone) {
                    uploadZone.classList.add('drag-over');
                    setTimeout(()=>uploadZone.classList.remove('drag-over'),800);
                }
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
            if (uploadZone) uploadZone.style.display = 'none';
            if (resultImg) {
                resultImg.src = roomImageB64;
                resultImg.style.display = 'block';
            }
            if (resultBar) resultBar.style.display = 'flex';
            if (resultLabel) resultLabel.textContent = 'Room loaded — click Scan Floor to detect the floor area';
            // Show scan button
            if (scanBtn) {
                scanBtn.style.display = 'inline-flex';
                scanBtn.disabled = false;
                scanBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg> Scan Floor';
            }
        }

        if (uploadBtn) uploadBtn.addEventListener('click', e => { e.stopPropagation(); if (fileInput) fileInput.click(); });
        if (fileInput) fileInput.addEventListener('change', () => { if (fileInput.files[0]) handleImageFile(fileInput.files[0]); });

        // Drag-drop on upload zone
        if (uploadZone) {
            uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
            uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
            uploadZone.addEventListener('drop', e => {
                e.preventDefault(); uploadZone.classList.remove('drag-over');
                if (e.dataTransfer.files[0]) handleImageFile(e.dataTransfer.files[0]);
            });
            uploadZone.addEventListener('click', () => { if (fileInput) fileInput.click(); });
        }

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
                if (uploadZone) uploadZone.style.display = 'none';
                if (resultImg) {
                    resultImg.src = roomImageB64;
                    resultImg.style.display = 'block';
                }
                if (resultBar) resultBar.style.display = 'flex';
                if (resultLabel) resultLabel.textContent = 'Room loaded — click Scan Floor to detect surfaces';
                if (scanBtn) {
                    scanBtn.style.display = 'inline-flex';
                    scanBtn.disabled = false;
                    scanBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg> Scan Floor';
                }
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

        if (trigger) {
            trigger.addEventListener('click', e => { e.preventDefault(); openViz(); });
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', e => {
                // If on standalone page, go back to home page
                if (window.location.pathname.includes('visualizer.html')) {
                    e.preventDefault();
                    window.location.href = '/';
                } else {
                    closeViz();
                }
            });
        }
        modal.addEventListener('click', e => { if (e.target === modal) { if (window.location.pathname.includes('visualizer.html')) { window.location.href = '/'; } else { closeViz(); } } });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                if (window.location.pathname.includes('visualizer.html')) {
                    window.location.href = '/';
                } else {
                    closeViz();
                }
            }
        });

        // Wire up any data-open-viz CTAs on the page
        document.querySelectorAll('[data-open-viz]').forEach(el => {
            el.addEventListener('click', e => {
                e.preventDefault();
                if (window.location.pathname.includes('visualizer.html')) {
                    // Do nothing or open since it's already open
                } else {
                    openViz();
                }
            });
        });

        // Run checkApi immediately if the page starts with the visualizer modal active
        if (modal.classList.contains('active')) {
            checkApi();
        }
    })();
});
