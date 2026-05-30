/**
 * ═══════════════════════════════════════════════════════════════
 *  UMA TRADERS — SHIELD.JS  ·  Anti-Theft & Source Protection
 *  © 2024–2026 Uma Traders. All rights reserved.
 *  Unauthorized copying, modification, or distribution of this
 *  website's source code is strictly prohibited.
 * ═══════════════════════════════════════════════════════════════
 */
(function () {
    'use strict';

    // ─── 1. Disable Right-Click Context Menu ───────────────────
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        _showShieldToast('⛔ Right-click is disabled on this website.');
        return false;
    });

    // ─── 2. Block Dangerous Keyboard Shortcuts ─────────────────
    const BLOCKED_COMBOS = [
        // DevTools
        { ctrl: true, shift: true, key: 'I' },   // Ctrl+Shift+I
        { ctrl: true, shift: true, key: 'i' },
        { ctrl: true, shift: true, key: 'J' },   // Ctrl+Shift+J (Console)
        { ctrl: true, shift: true, key: 'j' },
        { ctrl: true, shift: true, key: 'C' },   // Ctrl+Shift+C (Inspect)
        { ctrl: true, shift: true, key: 'c' },
        // View Source
        { ctrl: true, key: 'U' },                 // Ctrl+U
        { ctrl: true, key: 'u' },
        // Save Page
        { ctrl: true, key: 'S' },                 // Ctrl+S
        { ctrl: true, key: 's' },
        // F12
        { key: 'F12' },
    ];

    document.addEventListener('keydown', function (e) {
        for (const combo of BLOCKED_COMBOS) {
            const ctrlMatch = combo.ctrl ? (e.ctrlKey || e.metaKey) : true;
            const shiftMatch = combo.shift ? e.shiftKey : !e.shiftKey;
            const keyMatch = e.key === combo.key;

            if (ctrlMatch && shiftMatch && keyMatch) {
                e.preventDefault();
                e.stopPropagation();
                _showShieldToast('⛔ This action is not allowed.');
                return false;
            }
        }
    });

    // ─── 3. Disable Text Selection ─────────────────────────────
    document.addEventListener('selectstart', function (e) {
        // Allow selection inside input/textarea for usability
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        e.preventDefault();
    });

    // CSS-level selection prevention
    const noSelectStyle = document.createElement('style');
    noSelectStyle.textContent = `
        *:not(input):not(textarea) {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
        }
    `;
    document.head.appendChild(noSelectStyle);

    // ─── 4. Disable Image & Content Dragging ───────────────────
    document.addEventListener('dragstart', function (e) {
        e.preventDefault();
        return false;
    });

    // ─── 5. Disable Copy / Cut ─────────────────────────────────
    document.addEventListener('copy', function (e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        _showShieldToast('⛔ Copying content is not allowed.');
    });
    document.addEventListener('cut', function (e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        e.preventDefault();
    });

    // ─── 6. DevTools Detection (Timing-based) ──────────────────
    let _devToolsOpen = false;
    const _dtThreshold = 160;

    function _checkDevTools() {
        const start = performance.now();
        // debugger statement adds ~100ms+ when DevTools is open
        // We use a less intrusive image-based check instead
        const el = new Image();
        Object.defineProperty(el, 'id', {
            get: function () {
                _devToolsOpen = true;
            }
        });
        console.log('%c', el);
        console.clear();

        if (_devToolsOpen) {
            _onDevToolsDetected();
            _devToolsOpen = false;
        }
    }

    function _onDevToolsDetected() {
        // Log a stern warning
        _logCopyrightWarning();
    }

    // Check periodically
    setInterval(_checkDevTools, 3000);

    // ─── 7. Console Copyright Warning ──────────────────────────
    function _logCopyrightWarning() {
        console.log(
            '%c⚠️ STOP!',
            'color:#ff4444; font-size:48px; font-weight:900; text-shadow:2px 2px 0 #000;'
        );
        console.log(
            '%cThis website and all its source code, designs, and assets are the intellectual property of Uma Traders.\n' +
            'Unauthorized copying, modification, reverse engineering, or redistribution is strictly prohibited\n' +
            'and may result in legal action under the Copyright Act & IT Act.\n\n' +
            '© 2024–2026 Uma Traders. All Rights Reserved.',
            'color:#c5a880; font-size:14px; font-family:monospace; line-height:1.6;'
        );
        console.log(
            '%cIf you are a developer interested in working with us, contact us at: umatraders@contact.com',
            'color:#5b8e88; font-size:12px; font-family:monospace;'
        );
    }

    // Fire warning on initial load
    _logCopyrightWarning();

    // ─── 8. Toast Notification System ──────────────────────────
    let _toastTimeout = null;

    function _showShieldToast(message) {
        let toast = document.getElementById('uma-shield-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'uma-shield-toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%) translateY(20px);
                background: rgba(15, 14, 12, 0.95);
                color: #c5a880;
                font-family: 'Space Mono', monospace;
                font-size: 0.75rem;
                font-weight: 700;
                letter-spacing: 0.08em;
                padding: 14px 28px;
                border-radius: 50px;
                border: 1px solid rgba(197, 168, 128, 0.3);
                z-index: 999999;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                backdrop-filter: blur(10px);
                text-align: center;
                max-width: 90vw;
            `;
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';

        clearTimeout(_toastTimeout);
        _toastTimeout = setTimeout(function () {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
        }, 2500);
    }

    // ─── 9. Disable "Save Image As" via pointer-events on images ─
    document.addEventListener('DOMContentLoaded', function () {
        const imgs = document.querySelectorAll('img');
        imgs.forEach(function (img) {
            // Wrap images in a protective container if not already wrapped
            if (!img.closest('.uma-img-shield')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'uma-img-shield';
                wrapper.style.cssText = 'position:relative; display:inline-block;';
                
                // Create a transparent overlay to block direct image interaction
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                    background: transparent;
                `;
                
                if (img.parentNode) {
                    img.parentNode.insertBefore(wrapper, img);
                    wrapper.appendChild(img);
                    wrapper.appendChild(overlay);
                }
            }
        });
    });

    // ─── 10. Disable Print (Ctrl+P) ────────────────────────────
    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
            e.preventDefault();
            _showShieldToast('⛔ Printing is disabled for this website.');
            return false;
        }
    });

    // Block print via media query
    const noPrintStyle = document.createElement('style');
    noPrintStyle.textContent = `
        @media print {
            html, body {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(noPrintStyle);

    // ─── 11. Disable Page Source via "view-source:" protocol ───
    // (Prevents opening view-source from address bar detection)
    if (window.location.protocol === 'view-source:') {
        window.location.href = 'about:blank';
    }

})();
