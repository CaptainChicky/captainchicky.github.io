// popup-manager.js - Drop-in popup notification system

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
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 999999;
                pointer-events: none;
                animation: fadeIn 0.3s ease-out;
            }
            
            .popup-manager-overlay iframe {
                width: 100%;
                height: 100%;
                border: none;
                background: transparent;
                display: block;
                pointer-events: none;
            }
            
            .popup-manager-overlay .click-zone {
                position: absolute;
                pointer-events: auto;
                cursor: pointer;
                z-index: 9999999;
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
            if (event.data === 'closePopup') {
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
    
    show(popupPath, options = {}) {
        const popupData = {
            id: this.nextId++,
            path: popupPath,
            duration: options.duration || 0,
            clickSelector: options.clickSelector || null
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
        
        iframe.addEventListener('load', () => {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                
                // Setup clickable zone if selector provided
                if (popupData.clickSelector) {
                    const clickableElement = iframeDoc.querySelector(popupData.clickSelector);
                    
                    if (clickableElement) {
                        const updateClickZone = () => {
                            const rect = clickableElement.getBoundingClientRect();
                            
                            // Remove old click zone if exists
                            const oldZone = overlay.querySelector('.click-zone');
                            if (oldZone) oldZone.remove();
                            
                            // Create new click zone overlay
                            const clickZone = document.createElement('div');
                            clickZone.className = 'click-zone';
                            clickZone.style.top = rect.top + 'px';
                            clickZone.style.left = rect.left + 'px';
                            clickZone.style.width = rect.width + 'px';
                            clickZone.style.height = rect.height + 'px';
                            
                            // Forward click to iframe element
                            clickZone.addEventListener('click', () => {
                                clickableElement.click();
                            });
                            
                            overlay.appendChild(clickZone);
                        };
                        
                        updateClickZone();
                        
                        // Update on resize
                        window.addEventListener('resize', updateClickZone);
                    }
                }
                
                // Handle links
                const links = iframeDoc.querySelectorAll('a');
                links.forEach(link => {
                    link.addEventListener('click', (e) => {
                        const href = link.getAttribute('href');
                        
                        if (!href || href === '#' || href === '') {
                            e.preventDefault();
                            this.close(popupData.id);
                        } else {
                            setTimeout(() => this.close(popupData.id), 50);
                        }
                    });
                });
            } catch (e) {
                console.log('Cannot access iframe content (cross-origin):', e);
            }
        });
        
        overlay.appendChild(iframe);
        document.body.appendChild(overlay);
        
        this.activePopups.push(popupData);
        
        if (popupData.duration > 0) {
            setTimeout(() => {
                this.close(popupData.id);
            }, popupData.duration);
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