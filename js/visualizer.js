document.addEventListener("DOMContentLoaded", () => {
    // === ROOM VISUALIZER (AI-Powered Luxury Workstation Client) ===
    (function() {
        const API_BASE = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' || 
                         window.location.hostname === '' || 
                         window.location.protocol === 'file:'
            ? 'http://127.0.0.1:8000'
            : 'https://lucky1362002-umatraders-ai.hf.space';

        // Expanded Geology Monolith Telemetry Registry
        const MATERIALS = [
            { 
                id: 'ashora-beige-marble',   
                cat: 'marble',     
                name: 'Ashora Beige Marble',   
                img: 'assets/ASHORA BEIGE.jpg',
                texture: 'assets/ASHORA BEIGE.jpg',
                taxonomy: 'Imported Natural Marble',
                origin: 'Turkey / Iran',
                hardness: '18 mm',
                desc: 'Premium natural beige marble featuring soft white and grey veining. Turkey/Iran origin.'
            },
            { 
                id: 'blue-azul-marble',   
                cat: 'marble',     
                name: 'Blue Azul Marble',   
                img: 'assets/BLUE AZOL.png',
                texture: 'assets/BLUE AZOL.png',
                taxonomy: 'Imported Natural Marble (Italy)',
                origin: 'Italy',
                hardness: '18 mm',
                desc: 'Stunning blue-grey natural marble with elegant white and grey veining. Premium Italian classic.'
            },
            { 
                id: 'italy-dyna',   
                cat: 'marble',     
                name: 'Italy Dyna',   
                img: 'assets/ITALY DYNA.jpg',
                texture: 'assets/ITALY DYNA.jpg',
                taxonomy: 'Imported Natural Marble',
                origin: 'Turkey',
                hardness: '18 mm',
                desc: 'Premium beige marble featuring a soft cream background with elegant natural veining.'
            },
            { 
                id: 'sofita-beige-marble',   
                cat: 'marble',     
                name: 'Sofita Beige Marble',   
                img: 'assets/SOFITA BEIGE.jpg',
                texture: 'assets/SOFITA BEIGE.jpg',
                taxonomy: 'Imported Natural Marble (Spain)',
                origin: 'Spain',
                hardness: '18 mm',
                desc: 'Premium cream beige Spanish marble with fine brown natural veining.'
            },
            { 
                id: 'orroman-marble',   
                cat: 'marble',     
                name: 'Orroman Marble',   
                img: 'assets/ORROMAN.jpg',
                texture: 'assets/ORROMAN.jpg',
                taxonomy: 'Imported Natural Marble (Italy)',
                origin: 'Italy',
                hardness: '18 mm',
                desc: 'Light cream beige Italian marble displaying a soft cloudy natural texture.'
            },
            { 
                id: 'neuton-grey',   
                cat: 'marble',     
                name: 'Neuton Grey',   
                img: 'assets/NEUTON GREY.jpg',
                texture: 'assets/NEUTON GREY.jpg',
                taxonomy: 'Imported Natural Marble',
                origin: 'Turkey',
                hardness: '18 mm',
                desc: 'Premium Turkish grey marble characterized by cloudy grey tones and natural veining.'
            },
            { 
                id: 'kapaman-crema-marble',   
                cat: 'marble',     
                name: 'Kapaman Crema Marble',   
                img: 'assets/KAPAMAN CREMA.jpg',
                texture: 'assets/KAPAMAN CREMA.jpg',
                taxonomy: 'Imported Natural Marble',
                origin: 'Turkey',
                hardness: '18 mm',
                desc: 'Sophisticated cream grey Turkish marble enhanced by soft white natural veining.'
            },
            { 
                id: 'grey-karaman-marble',   
                cat: 'marble',     
                name: 'Grey Karaman Marble',   
                img: 'assets/GREY KARAMAN.jpg',
                texture: 'assets/GREY KARAMAN.jpg',
                taxonomy: 'Imported Natural Marble',
                origin: 'Turkey',
                hardness: '18 mm',
                desc: 'Stunning grey and taupe marble showcasing fine white natural veining.'
            },
            { 
                id: 'botticino-beige-marble',   
                cat: 'marble',     
                name: 'Botticino Beige Marble',   
                img: 'assets/BOTOCHINO BIEGE.jpg',
                texture: 'assets/BOTOCHINO BIEGE.jpg',
                taxonomy: 'Imported Natural Marble (Italy)',
                origin: 'Italy',
                hardness: '18 mm',
                desc: 'Classic Italian beige marble presenting a fine fossilized texture and warm cream tones.'
            },
            { 
                id: 'moon-star-marble',   
                cat: 'marble',     
                name: 'Moon Star Marble',   
                img: 'assets/MOON STAR.jpg',
                texture: 'assets/MOON STAR.jpg',
                taxonomy: 'Imported Natural Marble (Italy)',
                origin: 'Italy',
                hardness: '18 mm',
                desc: 'Luxurious white cream marble adorned with delicate gold and grey veining.'
            },
            { 
                id: 'vanilla-cream-marble',   
                cat: 'marble',     
                name: 'Vanilla Cream Marble',   
                img: 'assets/VANILLA CREME.jpg',
                texture: 'assets/VANILLA CREME.jpg',
                taxonomy: 'Imported Natural Marble (Spain)',
                origin: 'Spain',
                hardness: '18 mm',
                desc: 'Elegant cream white Spanish marble displaying a soft, cloudy natural texture.'
            },
            { 
                id: 'lawanto-marble',   
                cat: 'marble',     
                name: 'Lawanto Marble',   
                img: 'assets/LAWANTO.jpg',
                texture: 'assets/LAWANTO.jpg',
                taxonomy: 'Imported Natural Marble (Italy)',
                origin: 'Italy',
                hardness: '18 mm',
                desc: 'Rich cream/ivory background accented with beautiful fine brown natural veining.'
            },
            { 
                id: 'bulgaria-grey-marble',   
                cat: 'marble',     
                name: 'Bulgaria Grey Marble',   
                img: 'assets/BULGARIA GREY.jpg',
                texture: 'assets/BULGARIA GREY.jpg',
                taxonomy: 'Imported Natural Marble',
                origin: 'Turkey',
                hardness: '18 mm',
                desc: 'Striking taupe grey Turkish marble showcasing fine white spider-web veining.'
            }
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
        
        // Ingest Modal Elements
        const ingestModalBackdrop = document.getElementById('ingest-modal-backdrop');
        const ingestModalCloseBtn = document.getElementById('ingest-modal-close-btn');
        const sidebarTabUpload    = document.getElementById('sidebar-tab-upload');
        const sidebarTabCamera    = document.getElementById('sidebar-tab-camera');
        const panelUploadZone     = document.getElementById('panel-upload-zone');
        const panelCameraZone     = document.getElementById('panel-camera-zone');
        const ingestDragArea      = document.getElementById('ingest-drag-area');
        const fileInput           = document.getElementById('viz-file-input');
        const ingestBtnBrowse     = document.getElementById('ingest-btn-browse');
        const cameraFallback      = document.getElementById('camera-fallback');
        const cameraVideo         = document.getElementById('camera-video');
        const ingestShutterBtn    = document.getElementById('ingest-shutter-btn');
        const ingestStatusText    = document.getElementById('ingest-status-text');
        const ingestBtnCancel     = document.getElementById('ingest-btn-cancel');
        const ingestBtnApply      = document.getElementById('ingest-btn-apply');
        
        const resultImg           = document.getElementById('viz-result-img');
        const activeMetaPill      = document.getElementById('active-metadata-pill');
        const floatingChangeScene = document.getElementById('floating-change-trigger');
        
        // Viewport Loading elements
        const loadingOverlay = document.getElementById('viz-loading');
        const loadingText    = document.getElementById('viz-loading-text');
        
        // Viewport Actions
        const btnScan        = document.getElementById('btn-scan');
        const btnCompare     = document.getElementById('btn-compare');
        const btnRefine      = document.getElementById('btn-refine');
        const btnReset       = document.getElementById('btn-reset');
        const btnDownload    = document.getElementById('btn-download');
        const btnFullscreen  = document.getElementById('btn-fullscreen');
        const laserScan      = document.getElementById('scan-laser');

        // Fullscreen Lightbox Elements
        const fullscreenOverlay = document.getElementById('viz-fullscreen-overlay');
        const fullscreenImg     = document.getElementById('viz-fullscreen-img');
        const fullscreenClose   = document.getElementById('viz-fullscreen-close');
        
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
        let roomImageNatW  = 0;
        let roomImageNatH  = 0;

        // SVG circle gauge circumference
        const HUD_CIRCUMFERENCE = 213.6;

        // Initialize materials cards
        function initMaterialGrid() {
            const bottomTrack = document.getElementById('viz-material-bottom-track');
            if (!bottomTrack) return;
            bottomTrack.innerHTML = '';
            MATERIALS.forEach(mat => {
                const thumb = document.createElement('div');
                thumb.className = 'viz-history-thumb';
                thumb.dataset.id = mat.id;
                thumb.style.backgroundImage = `url('${mat.img}')`;
                thumb.title = mat.name;
                
                thumb.addEventListener('click', () => {
                    selectMaterial(mat, thumb);
                });
                bottomTrack.appendChild(thumb);
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
            if (!roomImageB64 || isScanning) return;
            
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
                if (btnCompare) btnCompare.disabled = false;
                btnReset.disabled = false;
                btnDownload.disabled = false;
                if (btnFullscreen) btnFullscreen.disabled = false;
                if (btnRefine) {
                    btnRefine.disabled = false;
                }

                // Show Photoshop-style floating paint toolbar
                const paintToolbar = document.getElementById('paint-toolbar');
                if (paintToolbar) paintToolbar.style.display = 'flex';

                // Update HUD metrics
                updateHudGauge(98.4, 'SUCCESS', data.coverage_pct + '%');
                updatePipelineProgress(2); // Ingest -> Segment done

                if (activeMetaPill) {
                    activeMetaPill.textContent = `Surface Detected: ${data.coverage_pct}% coverage. Manual Refinement active.`;
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
                    activeMetaPill.style.display = 'none';
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
                const surfaceMap = { hall: 'floor', floor: 'floor', wall: 'wall', kitchen: 'kitchen', countertop: 'countertop', bathroom: 'bathroom' };
                const surface = surfaceMap[currentRoomType] || currentRoomType || 'floor';

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

                if (window._customMask) {
                    body.custom_mask = window._customMask;
                } else if (window._scanToken) {
                    body.scan_token = window._scanToken;
                }

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

                // Update custom mask with the refined mask returned by the backend
                if (data.floor_mask_url) {
                    window._customMask = data.floor_mask_url;
                }

                // If they are actively refining, re-initialize the canvas to show the updated mask
                if (activeTool !== 'tool-pointer') {
                    initializePaintCanvas();
                } else {
                    const pcw = document.getElementById('paint-canvas-wrap');
                    if (pcw) pcw.style.display = 'none';
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
            if (!roomImageB64 || !scanDone || !selectedMat) return;
            
            // Clear any active timers to debounce sliding movements
            if (sliderTimer) clearTimeout(sliderTimer);
            
            sliderTimer = setTimeout(() => {
                executeRenderPipeline(selectedMat);
            }, 100); // 100ms debounce window
        }

        // --- Material Selection & Active Monolith ---
        function selectMaterial(mat, cardEl) {
            selectedMat = mat;
            
            // Highlight selected thumb
            document.querySelectorAll('.viz-history-thumb').forEach(c => {
                if (c.dataset.id === mat.id) {
                    c.classList.add('active');
                } else {
                    c.classList.remove('active');
                }
            });

            // Update Right Sidebar Information Panel
            updateRightSidebar(mat);

            // Execute render immediately if image exists
            if (roomImageB64) {
                executeRenderPipeline(mat);
            }
        }

        function updateRightSidebar(mat) {
            const detailContainer = document.getElementById('viz-material-detail-card');
            if (!detailContainer) return;
            
            detailContainer.innerHTML = `
                <!-- Material Header with name & taxonomy -->
                <div class="viz-panel-card" style="padding: 16px; gap: 12px; animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
                    <div style="font-family: 'Inter', sans-serif; font-size: 0.7rem; color: #1a1a1a; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
                        Selected Slab
                    </div>
                    <h3 style="margin: 0; font-family: 'Inter', sans-serif; font-size: 1.15rem; font-weight: 700; line-height: 1.25; color: #111113; letter-spacing: -0.01em;">
                        ${mat.name}
                    </h3>
                    <div style="font-size: 0.75rem; color: #55555d; font-family: 'Inter', sans-serif; font-weight: 500; display: flex; align-items: center; gap: 6px;">
                        <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#0055ff;"></span>
                        ${mat.taxonomy}
                    </div>
                </div>

                <!-- Slab Preview image (Aspect ratio aligned) -->
                <div class="viz-panel-card" style="padding: 0; overflow: hidden; border: 1.5px solid rgba(255,255,255,0.85); border-radius: 16px;">
                    <img src="${mat.img}" style="width: 100%; height: 160px; object-fit: cover; transition: transform 0.5s ease;" 
                         alt="${mat.name} slab"
                         onmouseover="this.style.transform='scale(1.05)'"
                         onmouseout="this.style.transform='scale(1)'">
                </div>

                <!-- Technical Specification Table -->
                <div class="viz-panel-card" style="padding: 16px; gap: 10px;">
                    <div style="font-family: 'Inter', sans-serif; font-size: 0.7rem; color: #1a1a1a; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid rgba(0,0,0,0.06); padding-bottom: 6px;">
                        Specifications
                    </div>
                    
                    <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.78rem; font-family: 'Inter', sans-serif;">
                        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(0,0,0,0.04); padding-bottom: 4px;">
                            <span style="color: #66666e; font-weight: 500;">Origin:</span>
                            <span style="font-weight: 600; color: #111113;">${mat.origin}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(0,0,0,0.04); padding-bottom: 4px;">
                            <span style="color: #66666e; font-weight: 500;">Thickness:</span>
                            <span style="font-weight: 600; color: #111113;">${mat.hardness}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(0,0,0,0.04); padding-bottom: 4px;">
                            <span style="color: #66666e; font-weight: 500;">Finish:</span>
                            <span style="font-weight: 600; color: #111113;">Polished (Glossy)</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(0,0,0,0.04); padding-bottom: 4px;">
                            <span style="color: #66666e; font-weight: 500;">Quality Grade:</span>
                            <span style="font-weight: 600; color: #0066ff;">Premium / A Grade</span>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 3px;">
                            <span style="color: #66666e; font-weight: 500; margin-bottom: 2px;">Applications:</span>
                            <span style="font-weight: 500; color: #333338; font-size: 0.72rem; line-height: 1.35;">Flooring, Wall Cladding, Countertops, Staircases, Living Rooms, Hotel Lobbies</span>
                        </div>
                    </div>
                </div>

                <!-- Story & Description -->
                <div class="viz-panel-card" style="padding: 16px; gap: 8px;">
                    <div style="font-family: 'Inter', sans-serif; font-size: 0.7rem; color: #1a1a1a; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
                        Taxonomy Narrative
                    </div>
                    <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 0.78rem; line-height: 1.5; color: #44444a;">
                        ${mat.desc}
                    </p>
                </div>

                <!-- Call to action inquiries -->
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <a href="https://wa.me/919304277935?text=Hi%20Uma%20Traders,%20I%20am%20interested%20in%20the%20${encodeURIComponent(mat.name)}%20via%20your%20AI%20Visualizer." 
                       target="_blank"
                       style="display: flex; align-items: center; justify-content: center; gap: 8px; background: #25d366; color: white; border: none; padding: 12px 20px; border-radius: 9999px; font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 600; text-decoration: none; text-align: center; transition: all 0.3s ease; box-shadow: 0 4px 16px rgba(37, 211, 102, 0.3);"
                       onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(37, 211, 102, 0.45)';"
                       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 16px rgba(37, 211, 102, 0.3)';">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle;">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.863-9.73.001-2.597-1.006-5.038-2.836-6.87-1.83-1.832-4.272-2.842-6.87-2.843-5.437 0-9.863 4.37-9.866 9.73-.001 1.762.48 3.487 1.395 5.017l-.951 3.472 3.585-.927zm12.062-7.532c-.329-.164-1.944-.959-2.244-1.069-.3-.11-.518-.164-.736.164-.218.329-.844 1.069-1.036 1.288-.192.218-.383.246-.712.082-.329-.164-1.389-.512-2.647-1.633-.978-.872-1.638-1.95-1.83-2.279-.192-.329-.02-.507.144-.671.148-.148.329-.383.493-.575.164-.192.218-.328.328-.547.11-.219.055-.411-.027-.575-.082-.164-.736-1.777-1.009-2.434-.265-.636-.53-.55-.736-.56-.19-.01-.41-.01-.628-.01-.218 0-.573.082-.873.411-.3.329-1.147 1.122-1.147 2.736 0 1.614 1.174 3.178 1.338 3.397.164.218 2.31 3.527 5.596 4.952.781.339 1.39.542 1.866.693.785.249 1.498.214 2.063.129.629-.095 1.944-.795 2.217-1.56.273-.767.273-1.423.191-1.56-.081-.137-.272-.218-.601-.382z"/>
                        </svg>
                        Inquire on WhatsApp
                    </a>
                </div>
            `;
        }

        // --- Room presets & Image Loading ---
        async function loadRoomImage(b64) {
            roomImageB64 = b64;
            roomImageNatW = 0;
            roomImageNatH = 0;
            const imgForSize = new Image();
            imgForSize.onload = function() {
                roomImageNatW = imgForSize.naturalWidth;
                roomImageNatH = imgForSize.naturalHeight;
            };
            imgForSize.src = b64;

            scanDone = false;
            scannedMaskB64 = null;
            window._scanToken = null;
            window._customMask = null;
            _roomPixelCache = null; // Clear flood fill cache

            if (ingestModalBackdrop) ingestModalBackdrop.style.display = 'none';
            if (floatingChangeScene) floatingChangeScene.style.display = 'inline-flex';
            // Show the Photoshop brush toolbar as soon as a scene is loaded
            const pt = document.getElementById('paint-toolbar');
            if (pt) pt.style.display = 'flex';
            if (resultImg) {
                resultImg.src = roomImageB64;
                resultImg.style.display = 'block';
            }

            // Reset comparison view
            deactivateCompareMode();
            if (btnCompare) btnCompare.disabled = true;
            btnReset.disabled = false;
            btnDownload.disabled = false;
            if (btnFullscreen) btnFullscreen.disabled = false;
            if (btnRefine) btnRefine.disabled = true;
            window._customMask = null;

            // Reset Sliders
            resetSliders();

            updatePipelineProgress(0); // at Ingest stage
            updateHudGauge(0.0, 'INGESTED', '0%');

            if (activeMetaPill) {
                activeMetaPill.textContent = 'Scene loaded. Initializing neural segmentation scan...';
                activeMetaPill.style.display = 'block';
            }

            btnScan.disabled = false;

            // Automatically trigger Neural AI Segmentation scan
            setTimeout(() => {
                triggerScan();
            }, 100);

            updateIngestModalCloseState();
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
            roomImageNatW = 0;
            roomImageNatH = 0;
            const imgForSize = new Image();
            imgForSize.onload = function() {
                roomImageNatW = imgForSize.naturalWidth;
                roomImageNatH = imgForSize.naturalHeight;
            };
            imgForSize.src = snapshot.roomImageB64;
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
            selectMaterial(selectedMat);

            // Set main screen
            if (resultImg) {
                resultImg.src = snapshot.finalImage;
                resultImg.style.display = 'block';
            }
            if (compareImgOrig) compareImgOrig.src = roomImageB64;
            if (compareImgRend) compareImgRend.src = snapshot.finalImage;

            if (uploadZoneWrap) uploadZoneWrap.style.display = 'none';
            if (btnCompare) btnCompare.disabled = false;
            btnReset.disabled = false;
            btnDownload.disabled = false;
            if (btnFullscreen) btnFullscreen.disabled = false;

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
            if (fileInput) fileInput.value = '';
            
            deactivateCompareMode();
            const paintToolbar = document.getElementById('paint-toolbar');
            if (paintToolbar) paintToolbar.style.display = 'none';
            const toolPointerEl = document.getElementById('tool-pointer');
            const toolBrushEl = document.getElementById('tool-brush');
            const toolEraserEl = document.getElementById('tool-eraser');
            const toolFillEl = document.getElementById('tool-fill');
            if (toolPointerEl) toolPointerEl.classList.add('active');
            if (toolBrushEl) toolBrushEl.classList.remove('active');
            if (toolEraserEl) toolEraserEl.classList.remove('active');
            if (toolFillEl) toolFillEl.classList.remove('active');
            if (paintCanvasWrap) paintCanvasWrap.style.display = 'none';
            const brushCursorEl = document.getElementById('brush-cursor');
            if (brushCursorEl) brushCursorEl.style.display = 'none';
            _roomPixelCache = null;
            undoStack.length = 0;
            redoStack.length = 0;
            resetSliders();
            if (btnRefine) btnRefine.disabled = true;
            window._customMask = null;

            if (resultImg) {
                resultImg.style.display = 'none';
                resultImg.src = '';
            }
            if (spaceSetupOverlay) spaceSetupOverlay.style.display = 'flex';
            if (ingestModalBackdrop) ingestModalBackdrop.style.display = 'none';
            if (sidebarTabUpload) sidebarTabUpload.click();
            if (ingestBtnApply) {
                ingestBtnApply.disabled = true;
                ingestBtnApply.textContent = 'Apply Scene';
            }
            if (ingestStatusText) ingestStatusText.textContent = 'Ready to import scene file';
            if (floatingChangeScene) floatingChangeScene.style.display = 'none';
            if (activeMetaPill) activeMetaPill.style.display = 'none';

            btnScan.disabled = true;
            if (btnCompare) btnCompare.disabled = true;
            btnReset.disabled = true;
            btnDownload.disabled = true;
            if (btnFullscreen) btnFullscreen.disabled = true;

            document.querySelectorAll('.viz-history-thumb').forEach(c => c.classList.remove('selected', 'active'));
            renderHistoryTrackUI();

            updatePipelineProgress(0);
            updateHudGauge(0.0, 'STANDBY', '0%');
            updateIngestModalCloseState();
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

        // --- Premium Ingest Modal overlay logic ---
        let tempIngestedB64 = null;
        let cameraStream = null;

        // Tab Switching Logic
        if (sidebarTabUpload) {
            sidebarTabUpload.addEventListener('click', (e) => {
                e.stopPropagation();
                sidebarTabUpload.classList.add('active');
                if (sidebarTabCamera) sidebarTabCamera.classList.remove('active');
                if (panelUploadZone) panelUploadZone.classList.add('active');
                if (panelCameraZone) panelCameraZone.classList.remove('active');
                stopCamera();
                if (ingestStatusText) ingestStatusText.textContent = "Ready to import scene file";
            });
        }

        if (sidebarTabCamera) {
            sidebarTabCamera.addEventListener('click', (e) => {
                e.stopPropagation();
                sidebarTabCamera.classList.add('active');
                if (sidebarTabUpload) sidebarTabUpload.classList.remove('active');
                if (panelCameraZone) panelCameraZone.classList.add('active');
                if (panelUploadZone) panelUploadZone.classList.remove('active');
                startCamera();
                if (ingestStatusText) ingestStatusText.textContent = "Ready for live capture";
            });
        }

        // Browse trigger inside drag area
        if (ingestBtnBrowse) {
            ingestBtnBrowse.addEventListener('click', (e) => {
                e.stopPropagation();
                if (fileInput) fileInput.click();
            });
        }

        // Drag and Drop on Ingest Area
        if (ingestDragArea) {
            ingestDragArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                ingestDragArea.classList.add('drag-over');
            });
            ingestDragArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                ingestDragArea.classList.remove('drag-over');
            });
            ingestDragArea.addEventListener('drop', (e) => {
                e.preventDefault();
                ingestDragArea.classList.remove('drag-over');
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const file = e.dataTransfer.files[0];
                    if (file.type.startsWith('image/')) {
                        fileToBase64(file).then(b64 => {
                            tempIngestedB64 = b64;
                            if (ingestStatusText) ingestStatusText.textContent = "Scene loaded! Click Apply to visualize.";
                            if (ingestBtnApply) {
                                ingestBtnApply.disabled = false;
                                ingestBtnApply.click(); // Auto-apply for seamless UX!
                            }
                        });
                    }
                }
            });
            // Also make clicking the drag area itself trigger the browser file selector
            ingestDragArea.addEventListener('click', (e) => {
                // Only trigger if click wasn't on the button itself (to avoid double clicks)
                if (e.target !== ingestBtnBrowse) {
                    if (fileInput) fileInput.click();
                }
            });
        }

        // File change wrapper
        function handleFileSelection() {
            if (fileInput.files && fileInput.files[0]) {
                const file = fileInput.files[0];
                if (file.type.startsWith('image/')) {
                    fileToBase64(file).then(b64 => {
                        tempIngestedB64 = b64;
                        if (ingestStatusText) ingestStatusText.textContent = "Scene loaded! Click Apply to visualize.";
                        if (ingestBtnApply) {
                            ingestBtnApply.disabled = false;
                            ingestBtnApply.click(); // Auto-apply for seamless UX!
                        }
                        fileInput.value = ''; // Reset input to allow selecting same file again
                    });
                }
            }
        }

        // Web Camera Capture Functions
        async function startCamera() {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                alert('Camera access is not supported on this device/browser.');
                if (sidebarTabUpload) sidebarTabUpload.click();
                return;
            }
            if (cameraFallback) cameraFallback.style.display = 'flex';
            
            try {
                cameraStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
                });
                if (cameraVideo) {
                    cameraVideo.srcObject = cameraStream;
                    cameraVideo.play();
                    cameraVideo.onloadedmetadata = () => {
                        if (cameraFallback) cameraFallback.style.display = 'none';
                    };
                }
            } catch (err) {
                console.error('Camera access failed:', err);
                if (cameraFallback) cameraFallback.style.display = 'none';
                alert('Could not access camera. Please check browser permissions.');
                if (sidebarTabUpload) sidebarTabUpload.click();
            }
        }

        function stopCamera() {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
                cameraStream = null;
            }
            if (cameraVideo) cameraVideo.srcObject = null;
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
            
            tempIngestedB64 = dataUrl;
            if (ingestStatusText) ingestStatusText.textContent = "Live photo captured!";
            if (ingestBtnApply) {
                ingestBtnApply.disabled = false;
                ingestBtnApply.click(); // Auto-apply captured photo instantly!
            }
        }

        if (ingestShutterBtn) {
            ingestShutterBtn.addEventListener('click', captureCameraImage);
        }

        // Apply and Close listeners
        if (ingestBtnApply) {
            ingestBtnApply.addEventListener('click', (e) => {
                e.stopPropagation();
                if (tempIngestedB64) {
                    stopCamera();
                    loadRoomImage(tempIngestedB64);
                    if (ingestModalBackdrop) ingestModalBackdrop.style.display = 'none';
                }
            });
        }

        function closeIngestModal() {
            if (!roomImageB64) return; // Prevent closing if no room image is loaded
            stopCamera();
            if (ingestModalBackdrop) ingestModalBackdrop.style.display = 'none';
        }

        function updateIngestModalCloseState() {
            const displayStyle = roomImageB64 ? 'block' : 'none';
            if (ingestModalCloseBtn) ingestModalCloseBtn.style.display = displayStyle;
            if (ingestBtnCancel) ingestBtnCancel.style.display = displayStyle;
        }

        if (ingestModalCloseBtn) ingestModalCloseBtn.addEventListener('click', closeIngestModal);
        if (ingestBtnCancel) ingestBtnCancel.addEventListener('click', closeIngestModal);

        // Hover Change Scene Trigger
        if (floatingChangeScene) {
            floatingChangeScene.addEventListener('click', (e) => {
                e.stopPropagation();
                if (spaceSetupOverlay) spaceSetupOverlay.style.display = 'flex';
            });
        }

        if (fileInput) fileInput.addEventListener('change', handleFileSelection);

        // --- Surface Custom Liquid Glass Dropdown Handler ---
        const surfaceSelectWrap    = document.getElementById('surface-select-wrap');
        const surfaceSelectTrigger = document.getElementById('surface-select-trigger');
        const surfaceSelectValue   = document.getElementById('surface-select-value');

        if (surfaceSelectTrigger && surfaceSelectWrap) {
            surfaceSelectTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                surfaceSelectWrap.classList.toggle('open');
            });

            document.addEventListener('click', (e) => {
                if (surfaceSelectWrap && !surfaceSelectWrap.contains(e.target)) {
                    surfaceSelectWrap.classList.remove('open');
                }
            });

            document.querySelectorAll('.viz-glass-option').forEach(opt => {
                opt.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const val = opt.dataset.value;
                    const label = opt.dataset.label;
                    currentRoomType = val;

                    if (surfaceSelectValue) surfaceSelectValue.textContent = label;
                    
                    document.querySelectorAll('.viz-glass-option').forEach(o => o.classList.remove('active'));
                    opt.classList.add('active');

                    if (surfaceSelectWrap) surfaceSelectWrap.classList.remove('open');

                    if (roomImageB64) {
                        triggerScan();
                    }
                });
            });
        }

        // --- Tiling Alignment Custom Liquid Glass Dropdown Handler ---
        const patternSelectWrap    = document.getElementById('pattern-select-wrap');
        const patternSelectTrigger = document.getElementById('pattern-select-trigger');
        const patternSelectValue   = document.getElementById('pattern-select-value');

        if (patternSelectTrigger && patternSelectWrap) {
            patternSelectTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                patternSelectWrap.classList.toggle('open');
            });

            document.addEventListener('click', (e) => {
                if (patternSelectWrap && !patternSelectWrap.contains(e.target)) {
                    patternSelectWrap.classList.remove('open');
                }
            });

            document.querySelectorAll('.viz-pattern-option').forEach(opt => {
                opt.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const val = opt.dataset.value;
                    const label = opt.dataset.label;
                    currentPattern = val;

                    if (patternSelectValue) patternSelectValue.textContent = label;
                    
                    document.querySelectorAll('.viz-pattern-option').forEach(o => o.classList.remove('active'));
                    opt.classList.add('active');

                    if (patternSelectWrap) patternSelectWrap.classList.remove('open');

                    if (selectedMat && roomImageB64) {
                        executeRenderPipeline(selectedMat);
                    }
                });
            });
        }

        // --- Polish Type Custom Liquid Glass Dropdown Handler ---
        const glossSelectWrap    = document.getElementById('gloss-select-wrap');
        const glossSelectTrigger = document.getElementById('gloss-select-trigger');
        const glossSelectValue   = document.getElementById('gloss-select-value');

        if (glossSelectTrigger && glossSelectWrap) {
            glossSelectTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                glossSelectWrap.classList.toggle('open');
            });

            document.addEventListener('click', (e) => {
                if (glossSelectWrap && !glossSelectWrap.contains(e.target)) {
                    glossSelectWrap.classList.remove('open');
                }
            });

            document.querySelectorAll('.viz-gloss-option').forEach(opt => {
                opt.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const val = opt.dataset.value;
                    const label = opt.dataset.label;

                    if (glossSelectValue) glossSelectValue.textContent = label;
                    
                    document.querySelectorAll('.viz-gloss-option').forEach(o => o.classList.remove('active'));
                    opt.classList.add('active');

                    if (glossSelectWrap) glossSelectWrap.classList.remove('open');

                    if (selectedMat && roomImageB64) {
                        executeRenderPipeline(selectedMat);
                    }
                });
            });
        }

        // --- Action Buttons: Reset, Download, Fullscreen ---
        function triggerReset() {
            if (!roomImageB64) return;
            selectedMat = null;
            scanDone = false;
            window._customMask = null;
            
            if (resultImg) {
                resultImg.src = roomImageB64;
                resultImg.style.display = 'block';
                resultImg.style.visibility = 'visible';
            }
            if (compareImgOrig) compareImgOrig.src = roomImageB64;
            if (compareImgRend) compareImgRend.src = roomImageB64;

            deactivateCompareMode();
            resetSliders();
            updatePipelineProgress(0);
            updateHudGauge(0.0, 'RESET', 'STANDBY');
            
            document.querySelectorAll('.viz-history-thumb').forEach(c => c.classList.remove('selected', 'active'));
        }

        function triggerDownload() {
            const activeSrc = isComparing ? (compareImgRend ? compareImgRend.src : '') : (resultImg ? resultImg.src : '');
            const finalUrl = activeSrc || roomImageB64;
            if (!finalUrl) return;

            const a = document.createElement('a');
            a.href = finalUrl;
            a.download = `uma_traders_${currentRoomType}_design.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

        function triggerFullscreen() {
            const activeSrc = (resultImg && resultImg.src && resultImg.style.display !== 'none') ? resultImg.src : roomImageB64;
            const fullscreenOverlay = document.getElementById('viz-fullscreen-overlay');
            const fullscreenImg     = document.getElementById('viz-fullscreen-img');

            if (fullscreenOverlay && fullscreenImg && activeSrc) {
                fullscreenImg.src = activeSrc;
                fullscreenOverlay.classList.add('active');
            }
        }

        function closeFullscreen() {
            const fullscreenOverlay = document.getElementById('viz-fullscreen-overlay');
            if (fullscreenOverlay) {
                fullscreenOverlay.classList.remove('active');
            }
        }

        const fullscreenCloseBtn = document.getElementById('viz-fullscreen-close');
        if (fullscreenCloseBtn) {
            fullscreenCloseBtn.addEventListener('click', closeFullscreen);
        }

        const fullscreenOverlayEl = document.getElementById('viz-fullscreen-overlay');
        if (fullscreenOverlayEl) {
            fullscreenOverlayEl.addEventListener('click', (e) => {
                if (e.target === fullscreenOverlayEl) {
                    closeFullscreen();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeFullscreen();
            }
        });

        // --- Workspace Trigger Bindings ---
        if (btnScan) btnScan.addEventListener('click', triggerScan);
        if (btnCompare) btnCompare.addEventListener('click', toggleCompareView);
        if (btnReset) btnReset.addEventListener('click', triggerReset);
        if (btnDownload) btnDownload.addEventListener('click', triggerDownload);
        if (btnFullscreen) btnFullscreen.addEventListener('click', triggerFullscreen);



        // --- Viewport Zoom & Pan ---
        let currentZoom = 1;
        let isDraggingViewport = false;
        let dragStartX = 0, dragStartY = 0;
        let translateX = 0, translateY = 0;
        const viewportContainer = document.getElementById('viz-viewport');

        function applyViewportTransform() {
            const transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
            if (resultImg) resultImg.style.transform = transform;
            if (compareWrap) compareWrap.style.transform = transform;
            const pcw = document.getElementById('paint-canvas-wrap');
            if (pcw) pcw.style.transform = transform;
        }

        if (viewportContainer) {
            viewportContainer.addEventListener('wheel', (e) => {
                e.preventDefault();
                const zoomDelta = e.deltaY * -0.002;
                currentZoom = Math.min(Math.max(1, currentZoom + zoomDelta), 5); // 1x to 5x
                
                if (currentZoom === 1) {
                    translateX = 0;
                    translateY = 0;
                }
                
                applyViewportTransform();
            });

            viewportContainer.addEventListener('mousedown', (e) => {
                // Determine if a paint tool is active (pointer tool is not active)
                const pointerBtn = document.getElementById('tool-pointer');
                const isPainting = pointerBtn && !pointerBtn.classList.contains('active');
                
                const rect = getImageContentRect();
                const overflows = rect && (rect.width > viewportContainer.clientWidth + 1 || rect.height > viewportContainer.clientHeight + 1);
                
                // Allow dragging if zoomed in or if cover image overflows AND (not painting OR middle/right mouse button)
                if ((currentZoom > 1 || overflows) && (!isPainting || e.button === 1 || e.button === 2)) {
                    isDraggingViewport = true;
                    dragStartX = e.clientX - translateX;
                    dragStartY = e.clientY - translateY;
                    viewportContainer.style.cursor = 'grabbing';
                }
            });

            window.addEventListener('mousemove', (e) => {
                if (!isDraggingViewport) return;
                translateX = e.clientX - dragStartX;
                translateY = e.clientY - dragStartY;
                applyViewportTransform();
            });

            window.addEventListener('mouseup', () => {
                if (isDraggingViewport) {
                    isDraggingViewport = false;
                    const rect = getImageContentRect();
                    const overflows = rect && (rect.width > viewportContainer.clientWidth + 1 || rect.height > viewportContainer.clientHeight + 1);
                    viewportContainer.style.cursor = (currentZoom > 1 || overflows) ? 'grab' : 'default';
                }
            });
        }

        // --- Fullscreen Lightbox triggers ---
        let fsZoom = 1;
        let isDraggingFs = false;
        let fsDragStartX = 0, fsDragStartY = 0;
        let fsTranslateX = 0, fsTranslateY = 0;

        function applyFullscreenTransform() {
            if (fullscreenImg) {
                fullscreenImg.style.transform = `translate(${fsTranslateX}px, ${fsTranslateY}px) scale(${fsZoom})`;
            }
        }

        function openFullscreen() {
            const activeImgSrc = isComparing ? compareImgRend.src : resultImg.src;
            if (!activeImgSrc) return;
            fsZoom = 1;
            fsTranslateX = 0;
            fsTranslateY = 0;
            if (fullscreenImg) {
                fullscreenImg.src = activeImgSrc;
                fullscreenImg.style.transform = '';
                fullscreenImg.style.cursor = 'default';
            }
            if (fullscreenOverlay) fullscreenOverlay.style.display = 'flex';
        }

        function closeFullscreen(e) {
            if (e && e.target !== fullscreenOverlay && e.target !== fullscreenClose) return;
            if (fullscreenOverlay) fullscreenOverlay.style.display = 'none';
            fsZoom = 1;
            fsTranslateX = 0;
            fsTranslateY = 0;
            if (fullscreenImg) {
                fullscreenImg.style.transform = '';
                fullscreenImg.style.cursor = 'default';
            }
        }

        if (btnFullscreen) btnFullscreen.addEventListener('click', openFullscreen);
        if (fullscreenOverlay) {
            fullscreenOverlay.addEventListener('click', closeFullscreen);
            fullscreenOverlay.addEventListener('wheel', (e) => {
                e.preventDefault();
                const zoomDelta = e.deltaY * -0.002;
                fsZoom = Math.min(Math.max(1, fsZoom + zoomDelta), 6); // 1x to 6x
                
                if (fsZoom === 1) {
                    fsTranslateX = 0;
                    fsTranslateY = 0;
                }
                applyFullscreenTransform();
                if (fullscreenImg) {
                    fullscreenImg.style.cursor = fsZoom > 1 ? 'grab' : 'default';
                }
            }, { passive: false });
        }
        if (fullscreenClose) fullscreenClose.addEventListener('click', closeFullscreen);

        if (fullscreenImg) {
            fullscreenImg.addEventListener('mousedown', (e) => {
                if (fsZoom > 1 && e.button === 0) {
                    e.stopPropagation();
                    isDraggingFs = true;
                    fsDragStartX = e.clientX - fsTranslateX;
                    fsDragStartY = e.clientY - fsTranslateY;
                    fullscreenImg.style.cursor = 'grabbing';
                }
            });
        }

        window.addEventListener('mousemove', (e) => {
            if (!isDraggingFs) return;
            fsTranslateX = e.clientX - fsDragStartX;
            fsTranslateY = e.clientY - fsDragStartY;
            applyFullscreenTransform();
        });

        window.addEventListener('mouseup', () => {
            if (isDraggingFs) {
                isDraggingFs = false;
                if (fullscreenImg) {
                    fullscreenImg.style.cursor = fsZoom > 1 ? 'grab' : 'default';
                }
            }
        });

        // --- Room preset and Pattern Alignment switchers ---
        document.querySelectorAll('.viz-rt').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.viz-rt').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentRoomType = btn.dataset.rt;
                updateSliderLabels(); // update dynamically wall cutoff group
                
                if (selectedMat && roomImageB64) {
                    executeRenderPipeline(selectedMat);
                }
            });
        });

        document.querySelectorAll('.viz-pat').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.viz-pat').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentPattern = btn.dataset.pat;
                
                if (selectedMat && roomImageB64) {
                    executeRenderPipeline(selectedMat);
                }
            });
        });

        // --- Pro Mode Workspace Toggle ---
        const btnTogglePro      = document.getElementById('btn-toggle-pro');
        const proSettingsPanel  = document.getElementById('pro-settings-panel');
        const proBadgeIndicator = document.getElementById('pro-badge-indicator');
        const proToggleLabel    = document.getElementById('pro-toggle-label');

        let isProMode = false;
        if (btnTogglePro && proSettingsPanel) {
            btnTogglePro.addEventListener('click', () => {
                isProMode = !isProMode;
                const pill = btnTogglePro.querySelector('.pro-toggle-pill');
                if (isProMode) {
                    proSettingsPanel.style.display = 'block';
                    btnTogglePro.classList.add('active');
                    if (proBadgeIndicator) proBadgeIndicator.style.display = 'inline-block';
                    if (proToggleLabel) proToggleLabel.textContent = 'Pro Mode Enabled';
                    if (pill) pill.textContent = 'ON';
                } else {
                    proSettingsPanel.style.display = 'none';
                    btnTogglePro.classList.remove('active');
                    if (proBadgeIndicator) proBadgeIndicator.style.display = 'none';
                    if (proToggleLabel) proToggleLabel.textContent = 'Enable Pro Mode';
                    if (pill) pill.textContent = 'OFF';
                }
            });
        }

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
                if (selectedMat && roomImageB64) {
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

        // --- Interactive Mask Painting & Brush Refinement Logic ---
        let isPainting = false;
        let brushMode = 'draw';
        let brushSize = 30;
        let activeTool = 'tool-pointer';
        let _roomPixelCache = null;

        // Undo/Redo history (stores canvas ImageData snapshots)
        const undoStack = [];
        const redoStack = [];
        const MAX_UNDO = 30;

        const paintCanvasWrap  = document.getElementById('paint-canvas-wrap');
        const refineToolbar    = document.getElementById('refine-toolbar');
        const paintMaskCanvas  = document.getElementById('paint-mask-canvas');
        const paintCtx         = paintMaskCanvas ? paintMaskCanvas.getContext('2d') : null;
        const brushCursor      = document.getElementById('brush-cursor');

        const sizeSlider       = document.getElementById('slider-brush-size');
        const sizeLbl          = document.getElementById('lbl-brush-size');
        const btnBrushDraw     = document.getElementById('btn-brush-draw');
        const btnBrushErase    = document.getElementById('btn-brush-erase');
        const btnRefineApply   = document.getElementById('btn-refine-apply');
        const btnRefineCancel  = document.getElementById('btn-refine-cancel');

        // Photoshop toolbar DOM
        const paintToolbar       = document.getElementById('paint-toolbar');
        const toolPointer        = document.getElementById('tool-pointer');
        const toolBrush          = document.getElementById('tool-brush');
        const toolEraser         = document.getElementById('tool-eraser');
        const toolFill           = document.getElementById('tool-fill');
        const toolSize           = document.getElementById('tool-size');
        const toolSizeVal        = document.getElementById('tool-size-val');
        const sizePopover        = document.getElementById('size-popover');
        const popoverSizeSlider  = document.getElementById('popover-size-slider');
        const popoverSizeLbl     = document.getElementById('popover-size-lbl');

        // ─── Helper: compute the rendered content area of the result image ───
        // The image uses object-fit:cover, so we need its actual rendered rect
        function getImageContentRect() {
            const natW = roomImageNatW || (resultImg ? resultImg.naturalWidth : 0);
            const natH = roomImageNatH || (resultImg ? resultImg.naturalHeight : 0);
            if (!natW || !natH) return null;
            const viewport = document.getElementById('viz-viewport');
            if (!viewport) return null;
            const vRect = viewport.getBoundingClientRect();
            const scale = Math.max(vRect.width / natW, vRect.height / natH);
            const renderedW = natW * scale;
            const renderedH = natH * scale;
            const offsetX = (vRect.width - renderedW) / 2;
            const offsetY = (vRect.height - renderedH) / 2;
            return { left: offsetX, top: offsetY, width: renderedW, height: renderedH, natW, natH };
        }

        // ─── Helper: Position the canvas to exactly overlay the image ───
        function alignCanvasToImage() {
            if (!paintMaskCanvas) return;
            const rect = getImageContentRect();
            if (!rect) return;
            // Set the CSS position/size to match the rendered image area
            paintMaskCanvas.style.left   = rect.left + 'px';
            paintMaskCanvas.style.top    = rect.top + 'px';
            paintMaskCanvas.style.width  = rect.width + 'px';
            paintMaskCanvas.style.height = rect.height + 'px';
        }

        // ─── Initialize paint canvas with the current AI mask ───
        function initializePaintCanvas() {
            if (!roomImageB64 || !paintMaskCanvas || !paintCtx) return;
            const maskSrc = window._customMask || scannedMaskB64;

            // Align the canvas position first
            alignCanvasToImage();

            const rect = getImageContentRect();
            if (!rect) return;
            paintMaskCanvas.width = rect.natW;
            paintMaskCanvas.height = rect.natH;

            if (!maskSrc) {
                // No mask yet — create an empty canvas at the image resolution
                paintCtx.clearRect(0, 0, paintMaskCanvas.width, paintMaskCanvas.height);
                return;
            }

            const img = new Image();
            img.onload = function() {
                paintCtx.clearRect(0, 0, paintMaskCanvas.width, paintMaskCanvas.height);

                // Draw mask directly to canvas (scale automatically if dimensions differ)
                paintCtx.drawImage(img, 0, 0, paintMaskCanvas.width, paintMaskCanvas.height);

                const imgData = paintCtx.getImageData(0, 0, paintMaskCanvas.width, paintMaskCanvas.height);
                const data = imgData.data;

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
                    const isWhite = (r > 127 && g > 127 && b > 127 && a > 127);
                    const isCyan  = (g > 180 && b > 180 && r < 80 && a > 0);
                    if (isWhite || isCyan) {
                        data[i] = 40; data[i+1] = 220; data[i+2] = 180; data[i+3] = 153;
                    } else {
                        data[i] = 0; data[i+1] = 0; data[i+2] = 0; data[i+3] = 0;
                    }
                }
                paintCtx.putImageData(imgData, 0, 0);

                // Re-align after canvas resolution is set
                alignCanvasToImage();
            };
            img.src = maskSrc;
        }

        // ─── Export canvas → B&W mask → custom_mask → trigger render ───
        function applyManualRefinement() {
            if (!paintMaskCanvas || !paintCtx) return;
            const w = paintMaskCanvas.width, h = paintMaskCanvas.height;
            if (w === 0 || h === 0) return;

            const srcData = paintCtx.getImageData(0, 0, w, h).data;
            const exportCanvas = document.createElement('canvas');
            exportCanvas.width = w; exportCanvas.height = h;
            const exportCtx = exportCanvas.getContext('2d');
            const exportImg = exportCtx.createImageData(w, h);
            const out = exportImg.data;

            for (let i = 0; i < srcData.length; i += 4) {
                if (srcData[i+3] > 20) {
                    // Any pixel with alpha > 20 = covered area → white
                    out[i] = 255; out[i+1] = 255; out[i+2] = 255; out[i+3] = 255;
                } else {
                    // Uncovered → black
                    out[i] = 0; out[i+1] = 0; out[i+2] = 0; out[i+3] = 255;
                }
            }
            exportCtx.putImageData(exportImg, 0, 0);
            window._customMask = exportCanvas.toDataURL('image/png');

            // Auto re-render if a material is selected
            if (selectedMat) {
                executeRenderPipeline(selectedMat);
            }
        }

        // ─── Tool selection ───
        let _savedResultSrc = null;

        function selectTool(toolId) {
            activeTool = toolId;
            [toolPointer, toolBrush, toolEraser, toolFill].forEach(btn => {
                if (btn) btn.classList.toggle('active', btn.id === toolId);
            });

            if (toolId === 'tool-pointer') {
                if (paintCanvasWrap) paintCanvasWrap.style.display = 'none';
                if (brushCursor) brushCursor.style.display = 'none';
            } else {
                if (toolId === 'tool-brush') brushMode = 'draw';
                else if (toolId === 'tool-eraser') brushMode = 'erase';
                else if (toolId === 'tool-fill') brushMode = 'fill';
                
                if (paintCanvasWrap) paintCanvasWrap.style.display = 'block';
                if (toolId === 'tool-fill') {
                    // Fill mode: use crosshair cursor, hide brush circle
                    if (paintCanvasWrap) paintCanvasWrap.style.cursor = 'crosshair';
                    if (paintMaskCanvas) paintMaskCanvas.style.cursor = 'crosshair';
                    if (brushCursor) brushCursor.style.display = 'none';
                } else {
                    if (paintCanvasWrap) paintCanvasWrap.style.cursor = 'none';
                    if (paintMaskCanvas) paintMaskCanvas.style.cursor = 'none';
                }
                initializePaintCanvas();
            }
        }

        // ─── Flood fill (Smart Fill) algorithm ───
        function getRoomPixelData() {
            return new Promise((resolve) => {
                if (_roomPixelCache) { resolve(_roomPixelCache); return; }
                const img = new Image();
                img.onload = function() {
                    const c = document.createElement('canvas');
                    c.width = img.naturalWidth; c.height = img.naturalHeight;
                    const ctx = c.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    _roomPixelCache = {
                        width: c.width, height: c.height,
                        data: ctx.getImageData(0, 0, c.width, c.height).data
                    };
                    resolve(_roomPixelCache);
                };
                img.src = roomImageB64;
            });
        }

        async function floodFillAt(canvasX, canvasY) {
            if (!paintMaskCanvas || !paintCtx || !roomImageB64) return;
            const pixData = await getRoomPixelData();
            const w = pixData.width, h = pixData.height;
            const pixels = pixData.data;

            const x0 = Math.round(canvasX), y0 = Math.round(canvasY);
            if (x0 < 0 || x0 >= w || y0 < 0 || y0 >= h) return;

            // Target color at click point
            const idx0 = (y0 * w + x0) * 4;
            const tR = pixels[idx0], tG = pixels[idx0+1], tB = pixels[idx0+2];

            // Tighter tolerance — only fill pixels with very similar color to the clicked spot
            const tolerance = 22;
            const tolSq = tolerance * tolerance;
            const visited = new Uint8Array(w * h);
            const startPos = y0 * w + x0;
            const stack = [startPos];
            visited[startPos] = 1;

            // Read current mask so we can add to it without clearing existing paint
            const maskImgData = paintCtx.getImageData(0, 0, w, h);
            const mask = maskImgData.data;
            let filled = 0;

            // Cap fill to 20% of the image to prevent runaway bleed across the whole scene
            const maxFill = Math.floor(w * h * 0.20);

            while (stack.length > 0 && filled < maxFill) {
                const pos = stack.pop();
                const pi = pos * 4;

                // Skip pixels already painted in the mask (alpha > 20)
                if (mask[pi + 3] > 20) continue;

                // Skip pixels whose color differs too much from the seed color
                const dr = pixels[pi] - tR, dg = pixels[pi+1] - tG, db = pixels[pi+2] - tB;
                if (dr*dr + dg*dg + db*db > tolSq) continue;

                // Paint this pixel on the mask with the scan overlay color (teal, 60% alpha)
                mask[pi] = 40; mask[pi+1] = 220; mask[pi+2] = 180; mask[pi+3] = 153;
                filled++;

                const px = pos % w, py = (pos - px) / w;
                if (py > 0     && !visited[pos - w]) { visited[pos - w] = 1; stack.push(pos - w); }
                if (py < h - 1 && !visited[pos + w]) { visited[pos + w] = 1; stack.push(pos + w); }
                if (px > 0     && !visited[pos - 1]) { visited[pos - 1] = 1; stack.push(pos - 1); }
                if (px < w - 1 && !visited[pos + 1]) { visited[pos + 1] = 1; stack.push(pos + 1); }
            }

            paintCtx.putImageData(maskImgData, 0, 0);
            if (filled > 0) applyManualRefinement();
        }

        // ─── Undo / Redo system ───
        function saveCanvasState() {
            if (!paintMaskCanvas || !paintCtx) return;
            const w = paintMaskCanvas.width, h = paintMaskCanvas.height;
            if (w === 0 || h === 0) return;
            undoStack.push(paintCtx.getImageData(0, 0, w, h));
            if (undoStack.length > MAX_UNDO) undoStack.shift();
            redoStack.length = 0; // Clear redo when new action happens
            updateUndoRedoButtons();
        }

        function undoCanvas() {
            if (!paintMaskCanvas || !paintCtx || undoStack.length === 0) return;
            const w = paintMaskCanvas.width, h = paintMaskCanvas.height;
            // Save current state to redo stack
            redoStack.push(paintCtx.getImageData(0, 0, w, h));
            // Restore previous state
            const prev = undoStack.pop();
            paintCtx.putImageData(prev, 0, 0);
            updateUndoRedoButtons();
            applyManualRefinement();
        }

        function redoCanvas() {
            if (!paintMaskCanvas || !paintCtx || redoStack.length === 0) return;
            const w = paintMaskCanvas.width, h = paintMaskCanvas.height;
            // Save current state to undo stack
            undoStack.push(paintCtx.getImageData(0, 0, w, h));
            // Restore redo state
            const next = redoStack.pop();
            paintCtx.putImageData(next, 0, 0);
            updateUndoRedoButtons();
            applyManualRefinement();
        }

        function updateUndoRedoButtons() {
            const undoBtn = document.getElementById('tool-undo');
            const redoBtn = document.getElementById('tool-redo');
            if (undoBtn) undoBtn.style.opacity = undoStack.length > 0 ? '1' : '0.35';
            if (redoBtn) redoBtn.style.opacity = redoStack.length > 0 ? '1' : '0.35';
        }

        // Wire up undo/redo buttons
        const toolUndo = document.getElementById('tool-undo');
        const toolRedo = document.getElementById('tool-redo');
        if (toolUndo) toolUndo.addEventListener('click', () => undoCanvas());
        if (toolRedo) toolRedo.addEventListener('click', () => redoCanvas());
        updateUndoRedoButtons();

        // Keyboard shortcuts: Ctrl+Z = Undo, Ctrl+Shift+Z = Redo
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undoCanvas();
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
                e.preventDefault();
                redoCanvas();
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                e.preventDefault();
                redoCanvas();
            }
        });

        if (toolPointer) toolPointer.addEventListener('click', () => {
            selectTool('tool-pointer');
            if (sizePopover) sizePopover.style.display = 'none';
        });
        if (toolBrush) toolBrush.addEventListener('click', () => {
            selectTool('tool-brush');
            if (sizePopover) sizePopover.style.display = 'none';
        });
        if (toolEraser) toolEraser.addEventListener('click', () => {
            selectTool('tool-eraser');
            if (sizePopover) sizePopover.style.display = 'none';
        });
        if (toolFill) toolFill.addEventListener('click', () => {
            selectTool('tool-fill');
            if (sizePopover) sizePopover.style.display = 'none';
        });

        // ─── Size popover ───
        if (toolSize) {
            toolSize.addEventListener('click', (e) => {
                e.stopPropagation();
                if (sizePopover) {
                    const isOpen = sizePopover.style.display === 'block';
                    if (isOpen) {
                        sizePopover.style.display = 'none';
                    } else {
                        // Position the popover next to the button using fixed positioning
                        const btnRect = toolSize.getBoundingClientRect();
                        sizePopover.style.position = 'fixed';
                        sizePopover.style.left = (btnRect.right + 8) + 'px';
                        sizePopover.style.top = (btnRect.top - 10) + 'px';
                        sizePopover.style.transform = 'none';
                        sizePopover.style.display = 'block';
                    }
                }
            });
        }

        function updateBrushSize(val) {
            brushSize = val;
            if (popoverSizeLbl) popoverSizeLbl.textContent = val + 'px';
            if (toolSizeVal) toolSizeVal.textContent = val;
            if (sizeSlider) sizeSlider.value = val;
            if (sizeLbl) sizeLbl.textContent = val + 'px';
            updateBrushCursorSize();
        }

        if (popoverSizeSlider) {
            popoverSizeSlider.addEventListener('input', () => updateBrushSize(parseInt(popoverSizeSlider.value)));
        }
        if (sizeSlider && sizeLbl) {
            sizeSlider.addEventListener('input', () => updateBrushSize(parseInt(sizeSlider.value)));
        }

        document.addEventListener('click', (e) => {
            if (sizePopover && toolSize && !sizePopover.contains(e.target) && !toolSize.contains(e.target)) {
                sizePopover.style.display = 'none';
            }
        });

        // ─── Dynamic Brush Cursor ───
        function updateBrushCursorSize() {
            if (!brushCursor) return;
            const rect = getImageContentRect();
            if (!rect) return;
            const displaySize = brushSize * (rect.width / rect.natW);
            brushCursor.style.width = displaySize + 'px';
            brushCursor.style.height = displaySize + 'px';
        }

        if (paintCanvasWrap) {
            paintCanvasWrap.addEventListener('mousemove', (e) => {
                if (!brushCursor || activeTool === 'tool-pointer') return;
                const rect = getImageContentRect();
                if (!rect) return;
                const displaySize = brushSize * (rect.width / rect.natW);
                brushCursor.style.display = 'block';
                brushCursor.style.width = displaySize + 'px';
                brushCursor.style.height = displaySize + 'px';
                brushCursor.style.left = (e.clientX - displaySize / 2) + 'px';
                brushCursor.style.top  = (e.clientY - displaySize / 2) + 'px';
            });
            paintCanvasWrap.addEventListener('mouseleave', () => {
                if (brushCursor) brushCursor.style.display = 'none';
            });
        }

        // ─── Legacy refine toolbar brush/eraser binding ───
        if (btnBrushDraw && btnBrushErase) {
            btnBrushDraw.addEventListener('click', () => {
                brushMode = 'draw';
                btnBrushDraw.style.background = '#1b3d33'; btnBrushDraw.style.color = 'white'; btnBrushDraw.style.borderColor = '#1b3d33';
                btnBrushErase.style.background = '#f5f3ef'; btnBrushErase.style.color = '#333'; btnBrushErase.style.borderColor = '#d4d1cb';
            });
            btnBrushErase.addEventListener('click', () => {
                brushMode = 'erase';
                btnBrushErase.style.background = '#1b3d33'; btnBrushErase.style.color = 'white'; btnBrushErase.style.borderColor = '#1b3d33';
                btnBrushDraw.style.background = '#f5f3ef'; btnBrushDraw.style.color = '#333'; btnBrushDraw.style.borderColor = '#d4d1cb';
            });
        }

        // ─── Canvas coordinate mapping (pixel-perfect) ───
        function getCoordinates(e) {
            if (!paintMaskCanvas) return { x: 0, y: 0 };
            const rect = paintMaskCanvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            // Map screen pixel → canvas internal pixel
            const x = ((clientX - rect.left) / rect.width)  * paintMaskCanvas.width;
            const y = ((clientY - rect.top)  / rect.height) * paintMaskCanvas.height;
            return { x, y };
        }

        function startPaint(e) {
            if (!paintCtx) return;
            e.preventDefault();

            // Smart Fill mode: flood fill at click point, no dragging
            if (brushMode === 'fill') {
                saveCanvasState(); // Save state before fill for undo
                const { x, y } = getCoordinates(e);
                floodFillAt(x, y);
                return; // Don't enter paint drag mode
            }

            saveCanvasState(); // Save state before brush stroke for undo
            isPainting = true;
            const { x, y } = getCoordinates(e);
            // Draw a dot at the start point
            paintCtx.lineCap = 'round';
            paintCtx.lineJoin = 'round';
            paintCtx.lineWidth = brushSize;
            if (brushMode === 'draw') {
                paintCtx.globalCompositeOperation = 'source-over';
                paintCtx.strokeStyle = 'rgba(40, 220, 180, 0.6)';
                paintCtx.fillStyle   = 'rgba(40, 220, 180, 0.6)';
            } else {
                paintCtx.globalCompositeOperation = 'destination-out';
                paintCtx.fillStyle = 'rgba(0,0,0,1)';
            }
            paintCtx.beginPath();
            paintCtx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
            paintCtx.fill();
            paintCtx.beginPath();
            paintCtx.moveTo(x, y);
        }

        function paint(e) {
            if (!isPainting || !paintCtx || !paintMaskCanvas) return;
            e.preventDefault();
            const { x, y } = getCoordinates(e);
            paintCtx.lineCap = 'round';
            paintCtx.lineJoin = 'round';
            paintCtx.lineWidth = brushSize;
            if (brushMode === 'draw') {
                paintCtx.globalCompositeOperation = 'source-over';
                paintCtx.strokeStyle = 'rgba(40, 220, 180, 0.6)';
            } else {
                paintCtx.globalCompositeOperation = 'destination-out';
            }
            paintCtx.lineTo(x, y);
            paintCtx.stroke();
        }

        function stopPaint() {
            if (isPainting) {
                isPainting = false;
                if (paintCtx) paintCtx.closePath();
                // Debounce: apply refinement after a short delay so rapid strokes batch
                clearTimeout(window._paintApplyTimer);
                window._paintApplyTimer = setTimeout(() => applyManualRefinement(), 300);
            }
        }

        if (paintMaskCanvas) {
            paintMaskCanvas.addEventListener('mousedown', startPaint);
            paintMaskCanvas.addEventListener('mousemove', paint);
            paintMaskCanvas.addEventListener('mouseup', stopPaint);
            paintMaskCanvas.addEventListener('mouseleave', stopPaint);
            paintMaskCanvas.addEventListener('touchstart', startPaint, { passive: false });
            paintMaskCanvas.addEventListener('touchmove', paint, { passive: false });
            paintMaskCanvas.addEventListener('touchend', stopPaint);
        }

        // Re-align canvas when window resizes
        window.addEventListener('resize', () => {
            if (activeTool !== 'tool-pointer' && paintCanvasWrap && paintCanvasWrap.style.display !== 'none') {
                alignCanvasToImage();
            }
        });

        if (btnRefine) {
            btnRefine.addEventListener('click', () => {
                btnRefine.classList.remove('pulse-refine');
                if (window._compareMode) {
                    // Turn off comparison mode
                    deactivateCompareMode();
                }
                
                if (paintCanvasWrap) paintCanvasWrap.style.display = 'block';
                if (refineToolbar) refineToolbar.style.display = 'flex';
                
                // Select default tool to Brush
                selectTool('tool-brush');
                
                // Highlight Brush button in manual refine toolbar
                if (btnBrushDraw) {
                    btnBrushDraw.style.background = '#1b3d33';
                    btnBrushDraw.style.color = 'white';
                    btnBrushDraw.style.borderColor = '#1b3d33';
                }
                if (btnBrushErase) {
                    btnBrushErase.style.background = '#f5f3ef';
                    btnBrushErase.style.color = '#333';
                    btnBrushErase.style.borderColor = '#d4d1cb';
                }
            });
        }

        if (btnRefineCancel) {
            btnRefineCancel.addEventListener('click', () => {
                if (refineToolbar) refineToolbar.style.display = 'none';
                selectTool('tool-pointer');
            });
        }

        if (btnRefineApply) {
            btnRefineApply.addEventListener('click', () => {
                if (!paintMaskCanvas) return;
                const exportCanvas = document.createElement('canvas');
                exportCanvas.width = paintMaskCanvas.width;
                exportCanvas.height = paintMaskCanvas.height;
                const exportCtx = exportCanvas.getContext('2d');
                
                // Get data from paintMaskCanvas and draw only non-transparent pixels as white
                const imgData = paintCtx.getImageData(0, 0, paintMaskCanvas.width, paintMaskCanvas.height);
                const data = imgData.data;
                
                const exportData = exportCtx.createImageData(exportCanvas.width, exportCanvas.height);
                const exp = exportData.data;
                
                for (let i = 0; i < data.length; i += 4) {
                    const alpha = data[i+3];
                    if (alpha > 30) { // Painted (alpha is non-zero, drawn as cyan)
                        exp[i]     = 255;
                        exp[i+1]   = 255;
                        exp[i+2]   = 255;
                        exp[i+3]   = 255;
                    } else { // Erased
                        exp[i]     = 0;
                        exp[i+1]   = 0;
                        exp[i+2]   = 0;
                        exp[i+3]   = 255; // fully opaque black background
                    }
                }
                exportCtx.putImageData(exportData, 0, 0);
                
                const refinedMaskB64 = exportCanvas.toDataURL('image/png');
                window._customMask = refinedMaskB64;
                
                if (refineToolbar) refineToolbar.style.display = 'none';
                selectTool('tool-pointer');
                
                if (selectedMat) {
                    executeRenderPipeline(selectedMat);
                } else {
                    // Dynamically compile a premium live cyan mask preview so they see their changes instantly!
                    const previewCanvas = document.createElement('canvas');
                    previewCanvas.width = paintMaskCanvas.width;
                    previewCanvas.height = paintMaskCanvas.height;
                    const previewCtx = previewCanvas.getContext('2d');
                    
                    const bgImg = new Image();
                    bgImg.onload = function() {
                        previewCtx.drawImage(bgImg, 0, 0);
                        previewCtx.drawImage(paintMaskCanvas, 0, 0);
                        if (resultImg) {
                            resultImg.src = previewCanvas.toDataURL('image/jpeg', 0.95);
                        }
                        if (compareImgRend) {
                            compareImgRend.src = resultImg.src;
                        }
                    };
                    bgImg.src = roomImageB64;
                }
            });
        }

        // Initialize materials on load
        initMaterialGrid();
        if (MATERIALS.length > 0) {
            selectMaterial(MATERIALS[0]);
        }
        updateSliderLabels();
        updateIngestModalCloseState();

        // =============================================
        // AUTHENTICATION SYSTEM ENGINE (SUPABASE READY)
        // =============================================
        const authModalOverlay   = document.getElementById('auth-modal-overlay');
        const authNoticeBox      = document.getElementById('auth-notice-box');
        const authNoticeText     = document.getElementById('auth-notice-text');
        const authViewLogin      = document.getElementById('auth-view-login');
        const authViewRegister   = document.getElementById('auth-view-register');
        const btnShowRegister    = document.getElementById('btn-show-register');
        const btnShowLogin       = document.getElementById('btn-show-login');
        const formLogin          = document.getElementById('form-login');
        const formRegister       = document.getElementById('form-register');
        const userProfileBadge   = document.getElementById('user-profile-badge');
        const userDisplayName    = document.getElementById('user-display-name');
        const btnSignOut         = document.getElementById('btn-sign-out');

        // Helper to show notice box in auth modal
        function showAuthNotice(msg, type = 'error') {
            if (!authNoticeBox || !authNoticeText) return;
            authNoticeText.textContent = msg;
            authNoticeBox.className = 'auth-notice-box ' + type;
            authNoticeBox.style.display = 'block';
        }

        function hideAuthNotice() {
            if (authNoticeBox) authNoticeBox.style.display = 'none';
        }

        // Switch to Registration View
        function switchToRegister(presetIdentifier = '') {
            hideAuthNotice();
            if (authViewLogin) authViewLogin.style.display = 'none';
            if (authViewRegister) authViewRegister.style.display = 'block';
            if (presetIdentifier) {
                const regEmail = document.getElementById('auth-reg-email');
                const regPhone = document.getElementById('auth-reg-phone');
                if (presetIdentifier.includes('@')) {
                    if (regEmail) regEmail.value = presetIdentifier;
                } else {
                    if (regPhone) regPhone.value = presetIdentifier;
                }
            }
        }

        // Switch to Login View
        function switchToLogin(presetIdentifier = '') {
            hideAuthNotice();
            if (authViewRegister) authViewRegister.style.display = 'none';
            if (authViewLogin) authViewLogin.style.display = 'block';
            if (presetIdentifier) {
                const loginId = document.getElementById('auth-login-identifier');
                if (loginId) loginId.value = presetIdentifier;
            }
        }

        // User Registry Storage (local storage fallback until Supabase is linked)
        function getUsersDB() {
            try {
                const raw = localStorage.getItem('umatraders_registered_users');
                if (raw) return JSON.parse(raw);
            } catch (e) {
                console.error(e);
            }
            // Seed initial sample user
            return [
                {
                    name: 'Andrew Thomas',
                    email: 'andrew@example.com',
                    phone: '+919876543210',
                    password: 'password123'
                }
            ];
        }

        function saveUserToDB(userObj) {
            const users = getUsersDB();
            users.push(userObj);
            localStorage.setItem('umatraders_registered_users', JSON.stringify(users));
        }

        // Session handling
        function getActiveUserSession() {
            try {
                const raw = sessionStorage.getItem('uma_auth_active_user') || localStorage.getItem('uma_auth_active_user');
                if (raw) return JSON.parse(raw);
            } catch (e) {
                console.error(e);
            }
            return null;
        }

        function setSessionUser(userObj) {
            sessionStorage.setItem('uma_auth_active_user', JSON.stringify(userObj));
        }

        function clearSessionUser() {
            sessionStorage.removeItem('uma_auth_active_user');
            localStorage.removeItem('uma_auth_active_user');
        }

        const spaceSetupOverlay   = document.getElementById('space-setup-overlay');
        const btnSpaceUpload      = document.getElementById('btn-space-upload');
        const btnSpaceCamera      = document.getElementById('btn-space-camera');
        const spaceSetupFileInput = document.getElementById('space-setup-file-input');

        function applyAuthState() {
            const activeUser = getActiveUserSession();
            if (activeUser) {
                // User is authenticated -> Hide auth modal immediately
                if (authModalOverlay) {
                    authModalOverlay.classList.add('hidden');
                    authModalOverlay.style.display = 'none';
                }
                if (userProfileBadge && userDisplayName) {
                    const nameParts = activeUser.name ? activeUser.name.split(' ') : ['Architect'];
                    userDisplayName.textContent = nameParts[0];
                    userProfileBadge.style.display = 'flex';
                }
                const btnChangeRoom = document.getElementById('btn-change-room');
                if (btnChangeRoom) btnChangeRoom.style.display = 'inline-block';
                if (btnChangeRoom && spaceSetupOverlay) {
                    btnChangeRoom.onclick = () => { spaceSetupOverlay.style.display = 'flex'; };
                }

                // POST-LOGIN REQUIREMENT: Show Space Setup overlay if room photo not loaded yet
                if (!roomImageB64 && spaceSetupOverlay) {
                    spaceSetupOverlay.style.display = 'flex';
                } else if (spaceSetupOverlay) {
                    spaceSetupOverlay.style.display = 'none';
                }
            } else {
                // User NOT authenticated -> Show auth modal locked on top
                if (authModalOverlay) {
                    authModalOverlay.style.display = 'flex';
                    authModalOverlay.classList.remove('hidden');
                }
                if (spaceSetupOverlay) spaceSetupOverlay.style.display = 'none';
                if (userProfileBadge) userProfileBadge.style.display = 'none';
            }
        }

        function fileToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = (err) => reject(err);
                reader.readAsDataURL(file);
            });
        }

        function urlToBase64(url) {
            return new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.naturalWidth || img.width || 800;
                        canvas.height = img.naturalHeight || img.height || 600;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        resolve(canvas.toDataURL('image/png'));
                    } catch (e) {
                        resolve(url);
                    }
                };
                img.onerror = () => resolve(url);
                img.src = url;
            });
        }

        // Helper to load room photo into visualizer canvas immediately
        function loadRoomImage(b64) {
            // HIDE SPACE SETUP OVERLAY INSTANTLY FIRST
            if (spaceSetupOverlay) spaceSetupOverlay.style.display = 'none';

            roomImageB64 = b64;
            scanDone = false;
            scannedMaskB64 = null;
            window._customMask = null;
            window._scanToken = null;

            if (resultImg) {
                resultImg.src = b64;
                resultImg.style.display = 'block';
                resultImg.style.visibility = 'visible';
            }
            if (compareImgOrig) compareImgOrig.src = b64;
            if (compareImgRend) compareImgRend.src = b64;
            if (uploadZoneWrap) uploadZoneWrap.style.display = 'none';

            btnReset.disabled = false;
            btnDownload.disabled = false;
            if (btnFullscreen) btnFullscreen.disabled = false;
            if (btnCompare) btnCompare.disabled = false;

            triggerScan();
        }

        // Space Setup Upload File Handlers
        if (btnSpaceUpload && spaceSetupFileInput) {
            btnSpaceUpload.addEventListener('click', () => {
                spaceSetupFileInput.click();
            });

            spaceSetupFileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                try {
                    const b64 = await fileToBase64(file);
                    loadRoomImage(b64);
                } catch (err) {
                    console.error('File load failed:', err);
                }
            });
        }

        // --- LIVE CAMERA CONTROLLER ---
        const cameraModalOverlay = document.getElementById('camera-modal-overlay');
        const cameraVideoFeed   = document.getElementById('camera-video-feed');
        const btnCameraSnap     = document.getElementById('btn-camera-snap');
        const btnCameraClose    = document.getElementById('btn-camera-close');
        const cameraStatusText  = document.getElementById('camera-status-text');
        const nativeCameraInput = document.getElementById('native-camera-input');
        let activeVideoStream   = null;

        async function startCameraFeed() {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                if (nativeCameraInput) {
                    nativeCameraInput.click();
                } else if (spaceSetupFileInput) {
                    spaceSetupFileInput.click();
                }
                return;
            }

            try {
                if (cameraModalOverlay) cameraModalOverlay.style.display = 'flex';
                if (cameraStatusText) cameraStatusText.textContent = 'Accessing camera feed...';

                activeVideoStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: { ideal: 'environment' },
                        width: { ideal: 1920 },
                        height: { ideal: 1080 }
                    },
                    audio: false
                });

                if (cameraVideoFeed) {
                    cameraVideoFeed.srcObject = activeVideoStream;
                    cameraVideoFeed.onloadedmetadata = () => {
                        cameraVideoFeed.play();
                        if (cameraStatusText) cameraStatusText.textContent = 'Camera active. Frame your room & tap shutter button.';
                    };
                }
            } catch (err) {
                console.warn('Camera stream error, falling back to file picker:', err);
                stopCameraFeed();
                if (nativeCameraInput) {
                    nativeCameraInput.click();
                } else if (spaceSetupFileInput) {
                    spaceSetupFileInput.click();
                }
            }
        }

        function stopCameraFeed() {
            if (activeVideoStream) {
                activeVideoStream.getTracks().forEach(track => track.stop());
                activeVideoStream = null;
            }
            if (cameraVideoFeed) cameraVideoFeed.srcObject = null;
            if (cameraModalOverlay) cameraModalOverlay.style.display = 'none';
        }

        function captureCameraPhoto() {
            if (!cameraVideoFeed || !activeVideoStream) return;

            const canvas = document.createElement('canvas');
            const vw = cameraVideoFeed.videoWidth || 1280;
            const vh = cameraVideoFeed.videoHeight || 720;
            canvas.width = vw;
            canvas.height = vh;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(cameraVideoFeed, 0, 0, vw, vh);

            const b64Photo = canvas.toDataURL('image/jpeg', 0.92);
            stopCameraFeed();

            loadRoomImage(b64Photo);
        }

        // Space Setup Camera Capture Trigger
        if (btnSpaceCamera) {
            btnSpaceCamera.addEventListener('click', () => startCameraFeed());
        }
        if (btnCameraSnap) {
            btnCameraSnap.addEventListener('click', () => captureCameraPhoto());
        }
        if (btnCameraClose) {
            btnCameraClose.addEventListener('click', () => stopCameraFeed());
        }

        if (nativeCameraInput) {
            nativeCameraInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                try {
                    const b64 = await fileToBase64(file);
                    loadRoomImage(b64);
                } catch (err) {
                    console.error('Camera photo load error:', err);
                }
            });
        }

        // Space Preset Pills Handler
        document.querySelectorAll('.space-preset-pill').forEach(pill => {
            pill.addEventListener('click', async () => {
                const preset = pill.dataset.preset || 'hall';
                currentRoomType = preset;
                
                try {
                    const defaultImgUrl = 'assets/room_tiles.png';
                    const b64 = await urlToBase64(defaultImgUrl);
                    loadRoomImage(b64);
                } catch (err) {
                    console.error('Failed to load sample scene:', err);
                    loadRoomImage('assets/room_tiles.png');
                }
            });
        });

        // Event listeners for view toggles
        if (btnShowRegister) {
            btnShowRegister.addEventListener('click', () => switchToRegister());
        }
        if (btnShowLogin) {
            btnShowLogin.addEventListener('click', () => switchToLogin());
        }

        // Login Action Function
        function performLogin() {
            hideAuthNotice();

            const idInput  = document.getElementById('auth-login-identifier');
            const passInput= document.getElementById('auth-login-password');
            if (!idInput || !passInput) return;

            const identifier = idInput.value.trim().toLowerCase();
            const password   = passInput.value.trim();

            if (!identifier || !password) {
                showAuthNotice('Please fill in both phone/email and password.', 'error');
                return;
            }

            const users = getUsersDB();
            let found = users.find(u => 
                (u.email && u.email.toLowerCase() === identifier) ||
                (u.phone && u.phone.replace(/[\s\-\+\(\)]/g, '') === identifier.replace(/[\s\-\+\(\)]/g, ''))
            );

            if (!found) {
                // AUTO-REGISTER ON THE FLY SO USER IS NEVER STUCK
                const isEmail = identifier.includes('@');
                const rawName = identifier.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ');
                const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
                
                found = {
                    name: formattedName || 'Architect',
                    phone: isEmail ? '+91 98765 43210' : identifier,
                    email: isEmail ? identifier : `${identifier}@example.com`,
                    password: password,
                    createdAt: new Date().toISOString()
                };
                saveUserToDB(found);
            } else if (found.password && found.password !== password) {
                showAuthNotice('Incorrect password. Please try again.', 'error');
                return;
            }

            // SUCCESSFUL LOGIN:
            showAuthNotice(`Welcome, ${found.name}! Opening studio...`, 'success');
            setSessionUser(found);
            applyAuthState();
        }

        // Login Submit & Button Click
        if (formLogin) {
            formLogin.addEventListener('submit', (e) => {
                e.preventDefault();
                performLogin();
            });
        }
        const btnLoginSubmit = document.getElementById('btn-login-submit');
        if (btnLoginSubmit) {
            btnLoginSubmit.addEventListener('click', (e) => {
                e.preventDefault();
                performLogin();
            });
        }

        // Registration Action Function
        function performRegistration() {
            hideAuthNotice();

            const nameVal = document.getElementById('auth-reg-name').value.trim();
            const phoneVal= document.getElementById('auth-reg-phone').value.trim();
            const emailVal= document.getElementById('auth-reg-email').value.trim();
            const passVal = document.getElementById('auth-reg-password').value.trim();
            const confVal = document.getElementById('auth-reg-confirm').value.trim();

            if (!nameVal || !phoneVal || !emailVal || !passVal || !confVal) {
                showAuthNotice('Please fill out all required fields.', 'error');
                return;
            }

            if (passVal.length < 6) {
                showAuthNotice('Password must be at least 6 characters.', 'error');
                return;
            }

            if (passVal !== confVal) {
                showAuthNotice('Passwords do not match. Please verify.', 'error');
                return;
            }

            const users = getUsersDB();
            const existing = users.find(u => 
                (u.email && u.email.toLowerCase() === emailVal.toLowerCase()) ||
                (u.phone && u.phone.replace(/[\s\-\+\(\)]/g, '') === phoneVal.replace(/[\s\-\+\(\)]/g, ''))
            );

            if (existing) {
                showAuthNotice('An account with this email or phone already exists. Please sign in.', 'error');
                return;
            }

            // REGISTER SUCCESS REQUIREMENT:
            const newUser = {
                name: nameVal,
                phone: phoneVal,
                email: emailVal,
                password: passVal,
                createdAt: new Date().toISOString()
            };

            saveUserToDB(newUser);

            // Show success notice & redirect back to login page in same container
            showAuthNotice('Registered successfully! Please sign in with your credentials.', 'success');

            setTimeout(() => {
                switchToLogin(emailVal || phoneVal);
                showAuthNotice('Registered successfully! Please enter your password to sign in.', 'success');
            }, 1200);
        }

        // Registration Submit & Button Click
        if (formRegister) {
            formRegister.addEventListener('submit', (e) => {
                e.preventDefault();
                performRegistration();
            });
        }
        const btnRegSubmit = document.getElementById('btn-reg-submit');
        if (btnRegSubmit) {
            btnRegSubmit.addEventListener('click', (e) => {
                e.preventDefault();
                performRegistration();
            });
        }

        // Sign Out Handler
        if (btnSignOut) {
            btnSignOut.addEventListener('click', () => {
                clearSessionUser();
                applyAuthState();
                switchToLogin();
            });
        }

        // Initialize Authentication State Check
        applyAuthState();

    })();
});
