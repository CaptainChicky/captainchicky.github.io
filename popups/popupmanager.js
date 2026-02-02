// popup-manager.js - Popup notification system with flexible sizing and positioning

class PopupManager {
    constructor(config = {}) {
        this.activePopups = [];
        this.nextId = 0;
        
        this.injectStyles();
        this.setupMessageListener();
    }
    
    injectStyles() {
        if (document.getElementById('popup-manager-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'popup-manager-styles';
        style.textContent = `
            .popup-manager-overlay {
                position: fixed;
                z-index: 999999;
                pointer-events: auto;
                animation: fadeIn 0.3s ease-out;
            }
            
            .popup-manager-overlay iframe {
                border: none;
                background: transparent;
                display: block;
                pointer-events: auto;
            }
            
            .popup-manager-overlay.closing {
                animation: fadeOut 0.3s ease-in forwards;
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    setupMessageListener() {
        window.addEventListener('message', (event) => {
            if (event.data === 'closePopup' || event.data?.type === 'closePopup') {
                this.handleCloseMessage(event.source);
            }
        });
    }
    
    handleCloseMessage(source) {
        const iframes = document.querySelectorAll('.popup-manager-overlay iframe');
        for (const iframe of iframes) {
            if (iframe.contentWindow === source) {
                const overlay = iframe.closest('.popup-manager-overlay');
                const popupId = parseInt(overlay.dataset.popupId);
                this.close(popupId);
                break;
            }
        }
    }
    
    /**
     * Show a popup
     * @param {string} popupPath - Path to the popup HTML file
     * @param {Object} options - Configuration options
     * @param {number} options.duration - Auto-close duration in ms (0 = manual close)
     * 
     * SIZE OPTIONS (choose one):
     * @param {string} options.sizeSelector - CSS selector to match element size in iframe
     * @param {string} options.width - Manual width (e.g., '300px', '20rem', '50vw')
     * @param {string} options.height - Manual height (e.g., '200px', '15rem', '30vh')
     * @param {boolean} options.fullPage - Render fullscreen (100% x 100%)
     * 
     * POSITION OPTIONS (choose one):
     * @param {string} options.corner - 'top-left', 'top-right', 'bottom-left', 'bottom-right'
     * @param {string} options.edge - 'top', 'bottom', 'left', 'right' (centered on edge)
     * @param {Object} options.center - {x: number, y: number} - position iframe center at coords
     * @param {string} options.offset - Offset from edges (e.g., '20px', '1rem'). Default: '20px'
     */
    show(popupPath, options = {}) {
        const popupData = {
            id: this.nextId++,
            path: popupPath,
            duration: options.duration || 0,
            sizeSelector: options.sizeSelector || null,
            width: options.width || null,
            height: options.height || null,
            fullPage: options.fullPage || false,
            corner: options.corner || null,
            edge: options.edge || null,
            center: options.center || null,
            offset: options.offset || '20px'
        };
        
        this.createPopup(popupData);
        return popupData.id;
    }
    
    createPopup(popupData) {
        const overlay = document.createElement('div');
        overlay.className = 'popup-manager-overlay';
        overlay.dataset.popupId = popupData.id;
        
        const iframe = document.createElement('iframe');
        iframe.src = popupData.path;
        iframe.scrolling = 'no';
        
        // Hide initially if using sizeSelector (prevent flash)
        if (popupData.sizeSelector) {
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
        }
        
        // Apply sizing immediately if manual or fullPage
        if (popupData.fullPage) {
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
        } else if (popupData.width && popupData.height) {
            iframe.style.width = popupData.width;
            iframe.style.height = popupData.height;
            this.applyPosition(overlay, popupData);
        }
        
        // Handle sizeSelector (need to wait for iframe load)
        if (popupData.sizeSelector) {
            iframe.addEventListener('load', () => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    const targetElement = iframeDoc.querySelector(popupData.sizeSelector);
                    
                    if (targetElement) {
                        // Get computed dimensions
                        const rect = targetElement.getBoundingClientRect();
                        iframe.style.width = rect.width + 'px';
                        iframe.style.height = rect.height + 'px';
                        
                        this.applyPosition(overlay, popupData);
                        
                        // Show after positioning is complete
                        overlay.style.opacity = '1';
                        overlay.style.visibility = 'visible';
                    } else {
                        console.warn(`Element not found: ${popupData.sizeSelector}`);
                        overlay.style.opacity = '1';
                        overlay.style.visibility = 'visible';
                    }
                } catch (e) {
                    console.error('Cannot access iframe content (cross-origin):', e);
                    overlay.style.opacity = '1';
                    overlay.style.visibility = 'visible';
                }
            });
        }
        
        overlay.appendChild(iframe);
        document.body.appendChild(overlay);
        
        this.activePopups.push(popupData);
        
        if (popupData.duration > 0) {
            setTimeout(() => {
                this.close(popupData.id);
            }, popupData.duration);
        }
    }
    
    applyPosition(overlay, popupData) {
        const offset = popupData.offset;
        
        if (popupData.corner) {
            // Position at corner
            switch (popupData.corner) {
                case 'top-left':
                    overlay.style.top = offset;
                    overlay.style.left = offset;
                    break;
                case 'top-right':
                    overlay.style.top = offset;
                    overlay.style.right = offset;
                    break;
                case 'bottom-left':
                    overlay.style.bottom = offset;
                    overlay.style.left = offset;
                    break;
                case 'bottom-right':
                    overlay.style.bottom = offset;
                    overlay.style.right = offset;
                    break;
            }
        } else if (popupData.edge) {
            // Position centered on edge
            switch (popupData.edge) {
                case 'top':
                    overlay.style.top = offset;
                    overlay.style.left = '50%';
                    overlay.style.transform = 'translateX(-50%)';
                    break;
                case 'bottom':
                    overlay.style.bottom = offset;
                    overlay.style.left = '50%';
                    overlay.style.transform = 'translateX(-50%)';
                    break;
                case 'left':
                    overlay.style.left = offset;
                    overlay.style.top = '50%';
                    overlay.style.transform = 'translateY(-50%)';
                    break;
                case 'right':
                    overlay.style.right = offset;
                    overlay.style.top = '50%';
                    overlay.style.transform = 'translateY(-50%)';
                    break;
            }
        } else if (popupData.center) {
            // Position center at specific coordinates
            overlay.style.left = popupData.center.x + 'px';
            overlay.style.top = popupData.center.y + 'px';
            overlay.style.transform = 'translate(-50%, -50%)';
        } else {
            // Default: center of screen
            overlay.style.left = '50%';
            overlay.style.top = '50%';
            overlay.style.transform = 'translate(-50%, -50%)';
        }
    }
    
    close(popupId) {
        const overlay = document.querySelector(`[data-popup-id="${popupId}"]`);
        if (!overlay) return;
        
        overlay.classList.add('closing');
        
        setTimeout(() => {
            overlay.remove();
            
            // Remove from active popups
            const index = this.activePopups.findIndex(p => p.id === popupId);
            if (index !== -1) {
                this.activePopups.splice(index, 1);
            }
        }, 300);
    }
    
    closeAll() {
        const popupIds = this.activePopups.map(p => p.id);
        popupIds.forEach(id => this.close(id));
    }
}

// Create global instance
window.popupManager = new PopupManager();