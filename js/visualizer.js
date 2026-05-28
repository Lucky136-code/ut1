document.addEventListener("DOMContentLoaded", () => {
    // === ROOM VISUALIZER (AI-Powered Luxury Workstation Client) ===
    (function() {
        const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://127.0.0.1:8000'
            : 'https://lucky1362002-umatraders-ai.hf.space';

        // Expanded Geology Monolith Telemetry Registry
        const MATERIALS = [
            { 
                id: 'obsidian-noir',   
                cat: 'marble',     
                name: 'Obsidian Noir',   
                img: 'assets/marble_dark_texture.png?v=15',
                texture: 'assets/marble_dark_texture.png?v=15',
                taxonomy: 'Volcanic Glass Silicate',
                origin: 'Jalisco, Mexico',
                hardness: '5.5 Mohs',
                desc: 'Deep black canvas pierced by brilliant golden veins. A striking statement of modern luxury.'
            },
            { 
                id: 'onyx-gold',   
                cat: 'marble',     
                name: 'Onyx Gold',   
                img: 'assets/onyx_gold.jpg?v=15',
                texture: 'assets/onyx_gold.jpg?v=15',
                taxonomy: 'Translucent Hydrated Calcite',
                origin: 'Yazd, Iran',
                hardness: '3.0 Mohs',
                desc: 'Stunning translucent golden onyx characterized by thick amber clouds and crystalline quartz bands.'
            },
            { 
                id: 'tiles-pattern',   
                cat: 'granite',     
                name: 'Geometric Mosaic',   
                img: 'assets/tiles_pattern.jpg?v=15',
                texture: 'assets/tiles_pattern.jpg?v=15',
                taxonomy: 'Ornamental Inlaid Stone',
                origin: 'Studio Custom Cut',
                hardness: '4.5 Mohs',
                desc: 'High-precision geometric inlaid pattern featuring alternating light calcite and dark slate lines.'
            },
            { 
                id: 'travertine-beige',   
                cat: 'granite',     
                name: 'Travertine Beige',   
                img: 'assets/travertine_beige.jpg?v=15',
                texture: 'assets/travertine_beige.jpg?v=15',
                taxonomy: 'Banded Travertine Limestone',
                origin: 'Tivoli, Italy',
                hardness: '3.5 Mohs',
                desc: 'Linear, porous banded travertine with natural warm beige tones. Adds a high-end organic modern vibe.'
            },
            { 
                id: 'travertine-cream',   
                cat: 'granite',     
                name: 'Travertine Cream',   
                img: 'assets/travertine_cream.jpg?v=15',
                texture: 'assets/travertine_cream.jpg?v=15',
                taxonomy: 'Light Calcified Travertine',
                origin: 'Pamukkale, Turkey',
                hardness: '3.5 Mohs',
                desc: 'Flawless soft cream linear banded travertine. Excellent for luxury minimalist flooring.'
            },
            { 
                id: 'sample-5',   
                cat: 'handicraft',     
                name: 'Sample 5',   
                img: 'https://images.unsplash.com/photo-1590483736622-39da8af75bba?auto=format&fit=crop&q=80&w=400',
                texture: 'assets/statuario_pure.png?v=15',
                taxonomy: 'Unassigned Sample',
                origin: 'Agra School Artisan Lab',
                hardness: '— Mohs',
                desc: 'Artisanal masterpiece. Hand-polished Makrana accent piece designed by hereditary masters.'
            },
            { 
                id: 'sample-6',   
                cat: 'handicraft',     
                name: 'Sample 6',   
                img: 'https://images.unsplash.com/photo-1590483736622-39da8af75bba?auto=format&fit=crop&q=80&w=400',
                texture: 'assets/statuario_pure.png?v=15',
                taxonomy: 'Unassigned Sample',
                origin: 'Agra School Artisan Lab',
                hardness: '— Mohs',
                desc: 'Artisanal masterpiece. Hand-polished Makrana accent piece designed by hereditary masters.'
            },
            { 
                id: 'sample-7',   
                cat: 'handicraft',     
                name: 'Sample 7',   
                img: 'https://images.unsplash.com/photo-1590483736622-39da8af75bba?auto=format&fit=crop&q=80&w=400',
                texture: 'assets/statuario_pure.png?v=15',
                taxonomy: 'Unassigned Sample',
                origin: 'Agra School Artisan Lab',
                hardness: '— Mohs',
                desc: 'Artisanal masterpiece. Hand-polished Makrana accent piece designed by hereditary masters.'
            },
        ];

        // Core UI DOM elements
        const modal          = document.getElementById('viz-modal');
        const grid           = document.getElementById('viz-mat-grid');
        const searchInput    = document.getElementById('search-input');
        const trigger        = document.getElementById('viz-trigger');
        const closeBtn       = document.getElementById('viz-close');
        
        // Slab Meta Viewport Elements
        const slabThumb      = document.getElementById('viz-slab');
        const selName        = document.getElementById('viz-sel-name');
        const monolithCat    = document.getElementById('monolith-cat');
        const monolithDesc   = document.getElementById('monolith-desc');
        
        // Upload / Preset Elements
        const uploadZoneWrap = document.getElementById('upload-zone-wrapper');
        const fileInput      = document.getElementById('viz-file-input');
        const resultImg      = document.getElementById('viz-result-img');
        const activeMetaPill = document.getElementById('active-metadata-pill');
        const sourceSwitcher = document.getElementById('viewport-source-switcher');
        const switchUpload = document.getElementById('switch-to-upload');
        const switchCamera = document.getElementById('switch-to-camera');
        const floatingChangeScene = document.getElementById('floating-change-trigger');
        
        // Viewport Loading elements
        const loadingOverlay = document.getElementById('viz-loading');
        const loadingText    = document.getElementById('viz-loading-text');
        
        // Viewport Actions
        const btnScan        = document.getElementById('btn-scan');
        const btnCompare     = document.getElementById('btn-compare');
        const btnReset       = document.getElementById('btn-reset');
        const btnDownload    = document.getElementById('btn-download');
        const laserScan      = document.getElementById('scan-laser');
        
        // Compare View Elements
        const compareWrap    = document.getElementById('compare-viewport-wrap');
        const compareImgOrig = document.getElementById('compare-img-original');
        const compareImgRend = document.getElementById('compare-img-rendered');
        const compareSlider  = document.getElementById('compare-range-slider');

        // Pipeline Nodes
        const nodeIngest     = document.getElementById('node-ingest');
        const nodeSegment    = document.getElementById('node-segment');
        const nodeWarp       = document.getElementById('node-warp');
        const nodeBlend      = document.getElementById('node-blend');

        // History Container
        const historyContainer = document.getElementById('history-container');

        // Header Telemetry API Label
        const apiDot         = document.getElementById('viz-api-dot');
        const apiLabel       = document.getElementById('viz-api-label');
        const telDevice      = document.getElementById('tel-device');
        const telLatency     = document.getElementById('tel-latency');
        const telCache       = document.getElementById('tel-cache');

        // HUD SVG Gauge Elements
        const hudArc         = document.getElementById('hud-arc');
        const hudPct         = document.getElementById('hud-pct');
        const hudDetected    = document.getElementById('hud-detected');
        const hudVram        = document.getElementById('hud-vram');
        const hudStatus      = document.getElementById('hud-status');

        // Sliders & Labels
        const sliderRotation = document.getElementById('slider-rotation');
        const lblRotation    = document.getElementById('lbl-rotation');
        const sliderScale    = document.getElementById('slider-scale');
        const lblScale       = document.getElementById('lbl-scale');
        const sliderExposure = document.getElementById('slider-exposure');
        const lblExposure    = document.getElementById('lbl-exposure');
        const sliderShadow   = document.getElementById('slider-shadow');
        const lblShadow      = document.getElementById('lbl-shadow');
        const sliderBlur     = document.getElementById('slider-blur');
        const lblBlur        = document.getElementById('lbl-blur');
        const sliderWall     = document.getElementById('slider-wall');
        const lblWall        = document.getElementById('lbl-wall');
        const groupWallGroup = document.getElementById('group-wall-coverage');
        const sliderOpacity  = document.getElementById('slider-opacity');
        const lblOpacity     = document.getElementById('lbl-opacity');

        if (!modal) return;

        // --- Workstation Memory State ---
        let roomImageB64   = null;
        let scannedMaskB64 = null;
        let scanDone       = false;
        let selectedMat    = null;
        let currentRoomType= 'hall';
        let currentPattern = 'grid';
        let apiOnline      = false;
        let isComparing    = false;
        let isRendering    = false;
        let isScanning     = false;
        let renderHistory  = []; // Array of render state snapshots
        let sliderTimer    = null; // Throttled sliders render loop timer

        // SVG circle gauge circumference
        const HUD_CIRCUMFERENCE = 213.6;

        // Initialize materials cards
        function initMaterialGrid() {
            if (!grid) return;
            grid.innerHTML = '';
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

        // --- Viewport State Tracers ---
        function updatePipelineProgress(step) {
            const nodes = [nodeIngest, nodeSegment, nodeWarp, nodeBlend];
            nodes.forEach((node, idx) => {
                if (!node) return;
                node.classList.remove('active', 'completed');
                if (idx < step) {
                    node.classList.add('completed');
                } else if (idx === step) {
                    node.classList.add('active');
                }
            });
        }

        function updateHudGauge(percent, statusText, detectedText) {
            if (hudArc) {
                // Calculate dash offset: 213.6 represents full circle
                const offset = HUD_CIRCUMFERENCE - (HUD_CIRCUMFERENCE * percent / 100);
                hudArc.style.strokeDashoffset = offset;
            }
            if (hudPct) hudPct.textContent = percent.toFixed(1) + '%';
            if (hudStatus) hudStatus.textContent = statusText;
            if (hudDetected) hudDetected.textContent = detectedText;
        }

        // --- Helper: Conversion & File Operations ---
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

        // --- Main Operations: SCAN ---
        async function triggerScan() {
            if (!roomImageB64 || !apiOnline || isScanning) return;
            
            isScanning = true;
            btnScan.disabled = true;
            btnScan.classList.add('viz-btn-scan-active');
            btnScan.innerHTML = '<span class="viz-viewport-spinner" style="width:10px;height:10px;display:inline-block;margin-right:6px;"></span> SCANNING...';
            
            if (loadingOverlay && loadingText) {
                loadingOverlay.style.display = 'flex';
                loadingText.textContent = 'Analysing Room Architecture...';
            }
            if (laserScan) laserScan.classList.add('active');
            updatePipelineProgress(1); // at Segmenting stage
            updateHudGauge(45.0, 'AI_INFERENCE', 'Analyzing...');

            const startTime = performance.now();

            try {
                const resp = await fetch(`${API_BASE}/api/scan`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        room_image: roomImageB64,
                        room_type: currentRoomType
                    })
                });

                if (!resp.ok) throw new Error(await resp.text());
                const data = await resp.json();

                const endTime = performance.now();
                if (telLatency) telLatency.textContent = Math.round(endTime - startTime) + ' ms';

                scannedMaskB64 = data.floor_mask_url;
                window._scanToken = data.scan_token;
                scanDone = true;

                // Show scan overlay image
                if (resultImg) {
                    resultImg.src = data.scan_image_url;
                    resultImg.style.display = 'block';
                }
                if (compareImgOrig) compareImgOrig.src = roomImageB64;
                if (compareImgRend) compareImgRend.src = data.scan_image_url;
                
                if (uploadZoneWrap) uploadZoneWrap.style.display = 'none';

                // Unlock compare, reset, download
                btnCompare.disabled = false;
                btnReset.disabled = false;
                btnDownload.disabled = false;

                // Update HUD metrics
                updateHudGauge(98.4, 'SUCCESS', data.coverage_pct + '%');
                updatePipelineProgress(2); // Ingest -> Segment done

                if (activeMetaPill) {
                    activeMetaPill.textContent = `Surface Detected: ${data.coverage_pct}% coverage. Select material →`;
                    activeMetaPill.style.display = 'block';
                }

                // If user pre-selected a material, execute the render pipeline immediately
                if (selectedMat) {
                    executeRenderPipeline(selectedMat);
                }

            } catch (err) {
                console.error('Scan failed:', err);
                updateHudGauge(12.0, 'ERROR', 'FAILED');
                if (activeMetaPill) {
                    activeMetaPill.textContent = 'Neural scanning failed. Check server status.';
                }
            } finally {
                isScanning = false;
                if (laserScan) laserScan.classList.remove('active');
                if (loadingOverlay) loadingOverlay.style.display = 'none';
                btnScan.disabled = false;
                btnScan.classList.remove('viz-btn-scan-active');
                btnScan.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Scan Surface';
            }
        }

        // --- Main Operations: RENDER ---
        async function executeRenderPipeline(mat) {
            if (!roomImageB64 || isRendering) return;

            // Enforce scanning phase first
            if (!scanDone && apiOnline) {
                selectedMat = mat;
                triggerScan();
                return;
            }

            isRendering = true;
            if (loadingOverlay && loadingText) {
                loadingOverlay.style.display = 'flex';
                loadingText.textContent = `Applying ${mat.name} Monolith...`;
            }
            updatePipelineProgress(2); // Warp/Perspective stage active
            updateHudGauge(80.0, 'PERSPECTIVE', 'Warping...');

            // Gather all precision slider multipliers
            const rotationDeg = parseFloat(sliderRotation.value);
            const scaleMult   = parseFloat(sliderScale.value) / 100;
            const exposureMult = parseFloat(sliderExposure.value) / 100;
            const shadowMult   = parseFloat(sliderShadow.value) / 100;
            const blurMult     = parseFloat(sliderBlur.value) / 100;
            const wallCoverage = parseFloat(sliderWall.value) / 100;
            const opacityMult  = sliderOpacity ? parseFloat(sliderOpacity.value) / 100 : 1.0;

            const startTime = performance.now();

            try {
                const texB64 = await urlToBase64(mat.texture || mat.img);
                const surfaceMap = { hall: 'floor', kitchen: 'countertop', bathroom: 'wall' };
                const surface = surfaceMap[currentRoomType] || 'floor';

                const body = {
                    room_image:          roomImageB64,
                    room_type:           currentRoomType,
                    surface_textures:    { [surface]: mat.id },
                    floor_pattern:       currentPattern,
                    texture_data:        { [mat.id]: texB64 },
                    tile_rotation:       rotationDeg,
                    tile_scale:          scaleMult,
                    brightness_exposure: exposureMult,
                    shadow_intensity:    shadowMult,
                    blur_softness:       blurMult,
                    wall_coverage:       wallCoverage,
                    texture_opacity:     opacityMult
                };

                if (window._scanToken) body.scan_token = window._scanToken;

                const resp = await fetch(`${API_BASE}/api/render`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body)
                });

                if (!resp.ok) throw new Error(await resp.text());
                const data = await resp.json();

                const endTime = performance.now();
                if (telLatency) telLatency.textContent = Math.round(endTime - startTime) + ' ms';

                // Display final image
                if (resultImg) {
                    resultImg.src = data.final_image_url;
                    resultImg.style.display = 'block';
                }
                
                // Set layers for split slider comparison
                if (compareImgOrig) compareImgOrig.src = roomImageB64;
                if (compareImgRend) compareImgRend.src = data.final_image_url;

                if (activeMetaPill) {
                    activeMetaPill.textContent = `Slab: ${mat.name} • Scale: ${scaleMult}x • Angle: ${rotationDeg}°`;
                    activeMetaPill.style.display = 'block';
                }

                updatePipelineProgress(4); // Fully completed
                updateHudGauge(99.1, 'RENDERED', 'READY');

                // Save snapshot to history
                addSnapshotToHistory(data.final_image_url, mat);

            } catch (err) {
                console.error('Rendering failed:', err);
                updateHudGauge(15.0, 'ERROR', 'FAILED');
            } finally {
                isRendering = false;
                if (loadingOverlay) loadingOverlay.style.display = 'none';
            }
        }

        // --- Slider Throttling / Debouncing Engine (sub-100ms real time updates) ---
        function queueThrottledRender() {
            if (!roomImageB64 || !scanDone || !selectedMat || !apiOnline) return;
            
            // Clear any active timers to debounce sliding movements
            if (sliderTimer) clearTimeout(sliderTimer);
            
            sliderTimer = setTimeout(() => {
                executeRenderPipeline(selectedMat);
            }, 100); // 100ms debounce window
        }

        // --- Material Selection & Active Monolith ---
        function selectMaterial(mat, cardEl) {
            selectedMat = mat;
            
            // Highlight selected card
            document.querySelectorAll('.viz-mat-card').forEach(c => c.classList.remove('selected'));
            if (cardEl) cardEl.classList.add('selected');

            // Render monolith detailed description metadata panel
            if (slabThumb) {
                slabThumb.style.backgroundImage = `url('${mat.img}')`;
                slabThumb.classList.add('loaded');
            }
            if (selName) selName.textContent = mat.name;
            if (monolithCat) monolithCat.textContent = mat.cat.toUpperCase();
            if (monolithDesc) {
                monolithDesc.innerHTML = `<strong>Taxonomy:</strong> ${mat.taxonomy}<br>
                                          <strong>Origin:</strong> ${mat.origin}<br>
                                          <strong>Hardness:</strong> ${mat.hardness}<br><br>
                                          ${mat.desc}`;
            }

            // Execute render immediately if image exists
            if (roomImageB64) {
                if (apiOnline) {
                    executeRenderPipeline(mat);
                } else {
                    // Fallback to pure original room if API offline
                    if (resultImg) resultImg.src = roomImageB64;
                }
            }
        }

        // --- Room presets & Image Loading ---
        async function loadRoomImage(b64) {
            roomImageB64 = b64;
            scanDone = false;
            scannedMaskB64 = null;
            window._scanToken = null;

            if (uploadZoneWrap) uploadZoneWrap.style.display = 'none';
            if (sourceSwitcher) sourceSwitcher.style.display = 'none';
            if (floatingChangeScene) floatingChangeScene.style.display = 'inline-flex';
            if (resultImg) {
                resultImg.src = roomImageB64;
                resultImg.style.display = 'block';
            }

            // Reset comparison view
            deactivateCompareMode();
            btnCompare.disabled = true;
            btnReset.disabled = false;
            btnDownload.disabled = true;

            // Reset Sliders
            resetSliders();

            updatePipelineProgress(0); // at Ingest stage
            updateHudGauge(0.0, 'INGESTED', '0%');

            if (activeMetaPill) {
                activeMetaPill.textContent = 'Scene loaded. Trigger "Scan Floor" to initialize neural segmentation.';
                activeMetaPill.style.display = 'block';
            }

            btnScan.disabled = false;
        }

        // --- History Snapshots (Undo / Redo Configuration) ---
        function addSnapshotToHistory(finalImageB64, mat) {
            // Avoid duplicate contiguous captures
            if (renderHistory.length > 0 && renderHistory[renderHistory.length - 1].finalImage === finalImageB64) {
                return;
            }

            const snapshot = {
                roomImageB64: roomImageB64,
                scannedMaskB64: scannedMaskB64,
                scanToken: window._scanToken,
                selectedMat: mat,
                currentRoomType: currentRoomType,
                currentPattern: currentPattern,
                sliderVals: {
                    rotation: sliderRotation.value,
                    scale: sliderScale.value,
                    exposure: sliderExposure.value,
                    shadow: sliderShadow.value,
                    blur: sliderBlur.value,
                    wall: sliderWall.value,
                    opacity: sliderOpacity ? sliderOpacity.value : 100
                },
                finalImage: finalImageB64
            };

            renderHistory.push(snapshot);
            if (renderHistory.length > 8) renderHistory.shift(); // Max 8 history files

            renderHistoryTrackUI();
        }

        function restoreSnapshot(snapshot, thumbIndex) {
            roomImageB64 = snapshot.roomImageB64;
            scannedMaskB64 = snapshot.scannedMaskB64;
            window._scanToken = snapshot.scanToken;
            scanDone = true;
            selectedMat = snapshot.selectedMat;
            currentRoomType = snapshot.currentRoomType;
            currentPattern = snapshot.currentPattern;

            // Restore sliders values
            sliderRotation.value = snapshot.sliderVals.rotation;
            sliderScale.value = snapshot.sliderVals.scale;
            sliderExposure.value = snapshot.sliderVals.exposure;
            sliderShadow.value = snapshot.sliderVals.shadow;
            sliderBlur.value = snapshot.sliderVals.blur;
            sliderWall.value = snapshot.sliderVals.wall;
            if (sliderOpacity && snapshot.sliderVals.opacity !== undefined) {
                sliderOpacity.value = snapshot.sliderVals.opacity;
            }

            updateSliderLabels();

            // Highlight preset buttons
            document.querySelectorAll('.viz-rt').forEach(b => b.classList.toggle('active', b.dataset.rt === currentRoomType));
            document.querySelectorAll('.viz-pat').forEach(b => b.classList.toggle('active', b.dataset.pat === currentPattern));

            // Select card visual
            const card = document.querySelector(`.viz-mat-card[data-id="${selectedMat.id}"]`);
            selectMaterial(selectedMat, card);

            // Set main screen
            if (resultImg) {
                resultImg.src = snapshot.finalImage;
                resultImg.style.display = 'block';
            }
            if (compareImgOrig) compareImgOrig.src = roomImageB64;
            if (compareImgRend) compareImgRend.src = snapshot.finalImage;

            if (uploadZoneWrap) uploadZoneWrap.style.display = 'none';
            btnCompare.disabled = false;
            btnReset.disabled = false;
            btnDownload.disabled = false;

            // Set active highlight on thumb
            document.querySelectorAll('.viz-history-thumb').forEach((t, i) => {
                t.classList.toggle('active', i === thumbIndex);
            });

            updatePipelineProgress(4);
            updateHudGauge(99.1, 'RESTORED', 'READY');
        }

        function renderHistoryTrackUI() {
            if (!historyContainer) return;
            historyContainer.innerHTML = '';
            
            if (renderHistory.length === 0) {
                historyContainer.innerHTML = '<div style="font-family: var(--font-mono); font-size: 0.6rem; color:#888;">-- Workspace Empty --</div>';
                return;
            }

            renderHistory.forEach((snap, idx) => {
                const thumb = document.createElement('div');
                thumb.className = 'viz-history-thumb';
                thumb.style.backgroundImage = `url('${snap.finalImage}')`;
                thumb.title = `Restore: ${snap.selectedMat.name} (${snap.currentRoomType})`;
                
                if (idx === renderHistory.length - 1) {
                    thumb.classList.add('active');
                }

                thumb.addEventListener('click', () => {
                    restoreSnapshot(snap, idx);
                });

                historyContainer.appendChild(thumb);
            });
        }

        // --- Custom Slider Utilities ---
        function updateSliderLabels() {
            if (lblRotation) lblRotation.textContent = sliderRotation.value + '°';
            if (lblScale) lblScale.textContent = (parseFloat(sliderScale.value)/100).toFixed(1) + 'x';
            if (lblExposure) lblExposure.textContent = (parseFloat(sliderExposure.value)/100).toFixed(2) + 'x';
            if (lblShadow) lblShadow.textContent = (parseFloat(sliderShadow.value)/100).toFixed(2);
            if (lblBlur) lblBlur.textContent = (parseFloat(sliderBlur.value)/100).toFixed(1);
            if (lblWall) lblWall.textContent = sliderWall.value + '%';
            if (lblOpacity && sliderOpacity) lblOpacity.textContent = sliderOpacity.value + '%';

            // Show/Hide wall cutoff slider dynamically based on room presets
            if (groupWallGroup) {
                if (currentRoomType === 'bathroom' || currentRoomType === 'kitchen') {
                    groupWallGroup.style.display = 'block';
                } else {
                    groupWallGroup.style.display = 'none';
                }
            }
        }

        function resetSliders() {
            sliderRotation.value = 0;
            sliderScale.value = 100;
            sliderExposure.value = 100;
            sliderShadow.value = 100;
            sliderBlur.value = 100;
            sliderWall.value = 100;
            if (sliderOpacity) sliderOpacity.value = 100;
            updateSliderLabels();
        }

        // --- Workspace Clean ---
        function triggerReset() {
            roomImageB64 = null;
            scannedMaskB64 = null;
            window._scanToken = null;
            scanDone = false;
            selectedMat = null;
            renderHistory = [];
            
            deactivateCompareMode();
            resetSliders();

            if (resultImg) {
                resultImg.style.display = 'none';
                resultImg.src = '';
            }
            if (uploadZoneWrap) uploadZoneWrap.style.display = 'flex';
            if (sourceSwitcher) sourceSwitcher.style.display = 'flex';
            if (floatingChangeScene) floatingChangeScene.style.display = 'none';
            if (switchUpload) switchUpload.classList.add('active');
            if (switchCamera) switchCamera.classList.remove('active');
            if (activeMetaPill) activeMetaPill.style.display = 'none';

            btnScan.disabled = true;
            btnCompare.disabled = true;
            btnReset.disabled = true;
            btnDownload.disabled = true;

            // Reset Monolith details widget
            if (slabThumb) {
                slabThumb.style.backgroundImage = '';
                slabThumb.classList.remove('loaded');
            }
            if (selName) selName.textContent = '— Select a material —';
            if (monolithCat) monolithCat.textContent = 'CLASSIFICATION';
            if (monolithDesc) monolithDesc.textContent = 'Select a material card above to inspect physical stone attributes and query origin quarry telemetry.';

            document.querySelectorAll('.viz-mat-card').forEach(c => c.classList.remove('selected'));
            renderHistoryTrackUI();

            updatePipelineProgress(0);
            updateHudGauge(0.0, 'STANDBY', '0%');
        }

        // --- Split Screen Comparison Handling (60FPS native range slider) ---
        function toggleCompareView() {
            if (!roomImageB64) return;
            if (isComparing) {
                deactivateCompareMode();
            } else {
                activateCompareMode();
            }
        }

        function activateCompareMode() {
            isComparing = true;
            if (btnCompare) btnCompare.classList.add('active');
            if (compareWrap) compareWrap.style.display = 'block';
            if (resultImg) resultImg.style.visibility = 'hidden'; // Hide main img, comparison handles it
        }

        function deactivateCompareMode() {
            isComparing = false;
            if (btnCompare) btnCompare.classList.remove('active');
            if (compareWrap) compareWrap.style.display = 'none';
            if (resultImg) resultImg.style.visibility = 'visible';
        }

        // Compare position slider listener
        if (compareSlider && compareWrap) {
            compareSlider.addEventListener('input', () => {
                compareWrap.style.setProperty('--compare-pos', compareSlider.value);
            });
        }

        // --- Download high-res export ---
        function triggerDownload() {
            const link = document.createElement('a');
            const activeImg = isComparing ? compareImgRend.src : resultImg.src;
            if (!activeImg) return;
            link.href = activeImg;
            link.download = `umaders_render_${currentRoomType}_${selectedMat ? selectedMat.id : 'design'}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // --- File Uploader Listeners ---
        function handleFileSelection() {
            if (fileInput.files && fileInput.files[0]) {
                const file = fileInput.files[0];
                if (file.type.startsWith('image/')) {
                    fileToBase64(file).then(loadRoomImage);
                }
            }
        }

        if (uploadZoneWrap) {
            // Prevent default drag over behavior
            uploadZoneWrap.addEventListener('dragover', e => { 
                e.preventDefault(); 
                uploadZoneWrap.classList.add('drag-over'); 
            });
            uploadZoneWrap.addEventListener('dragleave', () => {
                uploadZoneWrap.classList.remove('drag-over');
            });
            uploadZoneWrap.addEventListener('drop', e => {
                e.preventDefault(); 
                uploadZoneWrap.classList.remove('drag-over');
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const file = e.dataTransfer.files[0];
                    if (file.type.startsWith('image/')) {
                        fileToBase64(file).then(loadRoomImage);
                    }
                }
            });

            // Bind triggers inside upload zone
            const btnTriggerUpload = document.getElementById('btn-trigger-upload');
            const btnTriggerCamera = document.getElementById('btn-trigger-camera');
            
            if (btnTriggerUpload) {
                btnTriggerUpload.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (fileInput) fileInput.click();
                });
            }

            // --- Premium Web Camera Capture Pipeline ---
            const cameraOverlay    = document.getElementById('camera-overlay');
            const cameraVideo      = document.getElementById('camera-video');
            const btnCameraCapture = document.getElementById('camera-btn-capture');
            const btnCameraCancel  = document.getElementById('camera-btn-cancel');
            let cameraStream       = null;

            async function startCamera(e) {
                if (e) e.stopPropagation();
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    alert('Camera access is not supported on this device/browser.');
                    return;
                }
                
                try {
                    cameraStream = await navigator.mediaDevices.getUserMedia({
                        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
                    });
                    if (cameraVideo) {
                        cameraVideo.srcObject = cameraStream;
                        cameraVideo.play();
                    }
                    if (cameraOverlay) cameraOverlay.style.display = 'flex';
                } catch (err) {
                    console.error('Camera access failed:', err);
                    alert('Could not access camera. Please check browser permissions.');
                }
            }

            function stopCamera(e) {
                if (e) e.stopPropagation();
                if (cameraStream) {
                    cameraStream.getTracks().forEach(track => track.stop());
                    cameraStream = null;
                }
                if (cameraVideo) cameraVideo.srcObject = null;
                if (cameraOverlay) cameraOverlay.style.display = 'none';
            }

            function captureCameraImage(e) {
                if (e) e.stopPropagation();
                if (!cameraVideo || !cameraStream) return;
                
                const canvas = document.createElement('canvas');
                canvas.width = cameraVideo.videoWidth || 640;
                canvas.height = cameraVideo.videoHeight || 480;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);
                
                const dataUrl = canvas.toDataURL('image/png');
                stopCamera();
                loadRoomImage(dataUrl);
            }

            // Segmented Switcher Controls
            if (switchUpload) {
                switchUpload.addEventListener('click', (e) => {
                    e.stopPropagation();
                    switchUpload.classList.add('active');
                    switchCamera.classList.remove('active');
                    stopCamera();
                    if (uploadZoneWrap) uploadZoneWrap.style.display = 'flex';
                });
            }

            if (switchCamera) {
                switchCamera.addEventListener('click', (e) => {
                    e.stopPropagation();
                    switchCamera.classList.add('active');
                    switchUpload.classList.remove('active');
                    if (uploadZoneWrap) uploadZoneWrap.style.display = 'none';
                    startCamera();
                });
            }

            // Hover Change Scene Trigger
            if (floatingChangeScene) {
                floatingChangeScene.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (uploadZoneWrap) uploadZoneWrap.style.display = 'flex';
                    if (sourceSwitcher) sourceSwitcher.style.display = 'flex';
                    floatingChangeScene.style.display = 'none';
                    
                    // Activate upload tab by default when reopening
                    switchUpload.classList.add('active');
                    switchCamera.classList.remove('active');
                    stopCamera();
                });
            }

            if (btnTriggerCamera) {
                btnTriggerCamera.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (switchCamera) switchCamera.click();
                });
            }
            if (btnCameraCancel) {
                btnCameraCancel.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (switchUpload) switchUpload.click();
                });
            }
            if (btnCameraCapture) btnCameraCapture.addEventListener('click', captureCameraImage);
        }

        if (fileInput) fileInput.addEventListener('change', handleFileSelection);

        // --- Workspace Trigger Bindings ---
        if (btnScan) btnScan.addEventListener('click', triggerScan);
        if (btnCompare) btnCompare.addEventListener('click', toggleCompareView);
        if (btnReset) btnReset.addEventListener('click', triggerReset);
        if (btnDownload) btnDownload.addEventListener('click', triggerDownload);

        // --- Room preset and Pattern Alignment switchers ---
        document.querySelectorAll('.viz-rt').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.viz-rt').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentRoomType = btn.dataset.rt;
                updateSliderLabels(); // update dynamically wall cutoff group
                
                if (selectedMat && roomImageB64 && apiOnline) {
                    executeRenderPipeline(selectedMat);
                }
            });
        });

        document.querySelectorAll('.viz-pat').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.viz-pat').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentPattern = btn.dataset.pat;
                
                if (selectedMat && roomImageB64 && apiOnline) {
                    executeRenderPipeline(selectedMat);
                }
            });
        });

        // --- Custom Polished Gloss & Ambient Tone selector bindings ---
        document.querySelectorAll('.viz-gloss').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.viz-gloss').forEach(b => b.classList.remove('active'));
                const target = e.target.closest('.viz-segment-btn');
                if (!target) return;
                target.classList.add('active');
                
                const gloss = target.dataset.gloss;
                if (gloss === 'matte') {
                    sliderShadow.value = 40; // softer shadows
                    sliderBlur.value = 150;  // softer seams
                } else if (gloss === 'satin') {
                    sliderShadow.value = 100;
                    sliderBlur.value = 100;
                } else {
                    sliderShadow.value = 160; // rich glossy highlights
                    sliderBlur.value = 60;
                }
                updateSliderLabels();
                if (selectedMat && roomImageB64 && apiOnline) {
                    executeRenderPipeline(selectedMat);
                }
            });
        });

        document.querySelectorAll('.viz-tone').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.viz-tone').forEach(b => b.classList.remove('active'));
                const target = e.target.closest('.viz-segment-btn');
                if (!target) return;
                target.classList.add('active');
                
                const tone = target.dataset.tone;
                if (tone === 'warm') {
                    sliderExposure.value = 120; // warmer exposure
                } else if (tone === 'cool') {
                    sliderExposure.value = 85;  // cooler exposure
                } else {
                    sliderExposure.value = 100;
                }
                updateSliderLabels();
                if (selectedMat && roomImageB64 && apiOnline) {
                    executeRenderPipeline(selectedMat);
                }
            });
        });

        // --- Stone Class category tabs filter ---
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

        // --- Real-time Search Index filter ---
        if (searchInput) {
            searchInput.addEventListener('keyup', () => {
                const query = searchInput.value.toLowerCase().trim();
                document.querySelectorAll('.viz-mat-card').forEach(card => {
                    const cardId = card.dataset.id;
                    const mat = MATERIALS.find(m => m.id === cardId);
                    if (mat) {
                        const matchesName = mat.name.toLowerCase().includes(query);
                        const matchesCat  = mat.cat.toLowerCase().includes(query);
                        const matchesTax  = mat.taxonomy.toLowerCase().includes(query);
                        card.classList.toggle('viz-mat-hidden', !matchesName && !matchesCat && !matchesTax);
                    }
                });
            });
        }

        // --- Precision Sliders Input bindings (throttled rendering loop) ---
        const sliderList = [sliderRotation, sliderScale, sliderExposure, sliderShadow, sliderBlur, sliderWall, sliderOpacity];
        sliderList.forEach(slider => {
            if (slider) {
                slider.addEventListener('input', () => {
                    updateSliderLabels();
                    queueThrottledRender();
                });
            }
        });

        // --- API Engine Connection Check ---
        async function checkApiEngineHealth() {
            if (!apiDot) return;
            apiDot.className = 'viz-api-dot checking';
            apiLabel.textContent = 'Connecting to AI engine…';
            try {
                const r = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
                const d = await r.json();
                apiOnline = true;
                
                apiDot.className = 'viz-api-dot online';
                apiLabel.textContent = `AI Engine Online`;
                
                if (telDevice) telDevice.textContent = d.device?.toUpperCase() + ' MODE';
                if (telCache) telCache.textContent = `${d.seg_cache} / ${d.cache_limit} cached`;
                if (hudVram) hudVram.textContent = `${d.seg_cache} / ${d.cache_limit}`;

            } catch (err) {
                apiOnline = false;
                apiDot.className = 'viz-api-dot offline';
                apiLabel.textContent = 'AI Engine Offline';
                if (telDevice) telDevice.textContent = 'OFFLINE MODE';
                if (hudVram) hudVram.textContent = '0 / 0';
                console.warn('API is offline, running client fallbacks.');
            }
        }

        // --- Workstation modal entry check ---
        function checkWorkstationAccess() {
            checkApiEngineHealth();
        }

        if (modal.classList.contains('active')) {
            checkWorkstationAccess();
        }

        // Initialize materials on load
        initMaterialGrid();
        updateSliderLabels();

    })();
});
