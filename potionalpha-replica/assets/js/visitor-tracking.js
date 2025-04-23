/**
 * Real-time Visitor Tracking System
 * Tracks and displays information about current website visitors
 */

class VisitorTrackingSystem {
    constructor() {
        this.visitors = {};
        this.adminPanelCreated = false;
        this.initializeTracking();
    }

    /**
     * Initialize the tracking system
     */
    initializeTracking() {
        // Generate a unique visitor ID if not exists
        if (!localStorage.getItem('visitorId')) {
            localStorage.setItem('visitorId', this.generateVisitorId());
        }
        
        // Track this visitor
        this.trackVisitor();
        
        // Set up admin panel keyboard shortcut (Ctrl+Alt+V)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.altKey && e.key === 'v') {
                this.toggleAdminPanel();
            }
        });
        
        // Update visitor status periodically
        setInterval(() => {
            this.trackVisitor();
        }, 30000); // Every 30 seconds
        
        // Create admin panel (hidden by default)
        this.createAdminPanel();
    }
    
    /**
     * Generate a unique visitor ID
     */
    generateVisitorId() {
        return 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Track current visitor
     */
    trackVisitor() {
        const visitorId = localStorage.getItem('visitorId');
        if (!visitorId) return;
        
        // Collect visitor data
        const data = {
            id: visitorId,
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            currentPage: window.location.pathname,
            referrer: document.referrer || 'Direct',
            lastActive: new Date().toISOString(),
            sessionDuration: this.calculateSessionDuration()
        };
        
        // Store visitor data
        this.visitors[visitorId] = data;
        
        // Update admin panel if visible
        if (this.adminPanelCreated && document.getElementById('visitor-admin-panel').style.display === 'block') {
            this.updateAdminPanelContent();
        }
        
        // Send to server (simulated)
        this.sendVisitorDataToServer(data);
    }
    
    /**
     * Calculate session duration
     */
    calculateSessionDuration() {
        const sessionStart = localStorage.getItem('sessionStart');
        if (!sessionStart) {
            localStorage.setItem('sessionStart', Date.now().toString());
            return '0s';
        }
        
        const duration = Math.floor((Date.now() - parseInt(sessionStart)) / 1000);
        
        if (duration < 60) {
            return `${duration}s`;
        } else if (duration < 3600) {
            return `${Math.floor(duration / 60)}m ${duration % 60}s`;
        } else {
            const hours = Math.floor(duration / 3600);
            const minutes = Math.floor((duration % 3600) / 60);
            return `${hours}h ${minutes}m`;
        }
    }
    
    /**
     * Send visitor data to server (simulated)
     */
    sendVisitorDataToServer(data) {
        // In a real implementation, this would send data to a server
        console.log('Visitor data updated:', data);
        
        // For demonstration, we'll just store in localStorage
        try {
            const allVisitors = JSON.parse(localStorage.getItem('allVisitors') || '{}');
            allVisitors[data.id] = data;
            localStorage.setItem('allVisitors', JSON.stringify(allVisitors));
        } catch (error) {
            console.error('Error storing visitor data:', error);
        }
    }
    
    /**
     * Create admin panel for viewing visitor data
     */
    createAdminPanel() {
        if (this.adminPanelCreated) return;
        
        // Create panel container
        const panel = document.createElement('div');
        panel.id = 'visitor-admin-panel';
        panel.className = 'visitor-admin-panel';
        panel.style.display = 'none';
        panel.style.position = 'fixed';
        panel.style.zIndex = '10000';
        panel.style.top = '20px';
        panel.style.right = '20px';
        panel.style.width = '400px';
        panel.style.maxWidth = '90vw';
        panel.style.maxHeight = '80vh';
        panel.style.backgroundColor = 'rgba(19, 14, 28, 0.95)';
        panel.style.borderRadius = '8px';
        panel.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        panel.style.padding = '15px';
        panel.style.color = 'white';
        panel.style.fontFamily = 'Arial, sans-serif';
        panel.style.fontSize = '14px';
        panel.style.overflowY = 'auto';
        panel.style.border = '1px solid rgba(156, 68, 255, 0.5)';
        
        // Add header
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '15px';
        header.style.paddingBottom = '10px';
        header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        
        const title = document.createElement('h3');
        title.textContent = 'Real-time Visitor Tracking';
        title.style.margin = '0';
        title.style.fontSize = '18px';
        title.style.fontWeight = 'bold';
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.color = 'white';
        closeBtn.style.fontSize = '24px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.padding = '0';
        closeBtn.style.lineHeight = '1';
        closeBtn.onclick = () => {
            document.getElementById('visitor-admin-panel').style.display = 'none';
        };
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        panel.appendChild(header);
        
        // Add visitor count
        const visitorCount = document.createElement('div');
        visitorCount.id = 'visitor-count';
        visitorCount.style.marginBottom = '15px';
        visitorCount.style.padding = '10px';
        visitorCount.style.backgroundColor = 'rgba(156, 68, 255, 0.2)';
        visitorCount.style.borderRadius = '4px';
        visitorCount.style.textAlign = 'center';
        visitorCount.style.fontWeight = 'bold';
        panel.appendChild(visitorCount);
        
        // Add visitor list container
        const visitorList = document.createElement('div');
        visitorList.id = 'visitor-list';
        panel.appendChild(visitorList);
        
        // Add to document
        document.body.appendChild(panel);
        
        this.adminPanelCreated = true;
        this.updateAdminPanelContent();
    }
    
    /**
     * Update admin panel content with current visitor data
     */
    updateAdminPanelContent() {
        if (!this.adminPanelCreated) return;
        
        // Get all visitors from localStorage
        let allVisitors = {};
        try {
            allVisitors = JSON.parse(localStorage.getItem('allVisitors') || '{}');
        } catch (error) {
            console.error('Error parsing visitor data:', error);
        }
        
        // Update visitor count
        const visitorCount = document.getElementById('visitor-count');
        if (visitorCount) {
            const count = Object.keys(allVisitors).length;
            visitorCount.textContent = `Current Visitors: ${count}`;
        }
        
        // Update visitor list
        const visitorList = document.getElementById('visitor-list');
        if (visitorList) {
            visitorList.innerHTML = '';
            
            // Sort visitors by last active time (most recent first)
            const sortedVisitors = Object.values(allVisitors).sort((a, b) => {
                return new Date(b.lastActive) - new Date(a.lastActive);
            });
            
            sortedVisitors.forEach(visitor => {
                const visitorCard = document.createElement('div');
                visitorCard.className = 'visitor-card';
                visitorCard.style.marginBottom = '15px';
                visitorCard.style.padding = '10px';
                visitorCard.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                visitorCard.style.borderRadius = '4px';
                visitorCard.style.borderLeft = '3px solid #9c44ff';
                
                // Format last active time
                const lastActive = new Date(visitor.lastActive);
                const timeAgo = this.getTimeAgo(lastActive);
                
                visitorCard.innerHTML = `
                    <div style="margin-bottom: 8px; font-weight: bold; color: #9c44ff;">Visitor ID: ${visitor.id.substring(0, 10)}...</div>
                    <div style="margin-bottom: 5px;"><strong>Page:</strong> ${visitor.currentPage}</div>
                    <div style="margin-bottom: 5px;"><strong>Referrer:</strong> ${visitor.referrer}</div>
                    <div style="margin-bottom: 5px;"><strong>Device:</strong> ${this.getDeviceInfo(visitor.userAgent)}</div>
                    <div style="margin-bottom: 5px;"><strong>Screen:</strong> ${visitor.screenSize}</div>
                    <div style="margin-bottom: 5px;"><strong>Session:</strong> ${visitor.sessionDuration}</div>
                    <div style="color: rgba(255,255,255,0.6); font-size: 12px; text-align: right;">Last active: ${timeAgo}</div>
                `;
                
                visitorList.appendChild(visitorCard);
            });
            
            // Show message if no visitors
            if (sortedVisitors.length === 0) {
                visitorList.innerHTML = '<div style="text-align: center; color: rgba(255,255,255,0.6);">No visitor data available</div>';
            }
        }
    }
    
    /**
     * Get time ago in human readable format
     */
    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        if (seconds < 60) {
            return 'just now';
        } else if (seconds < 120) {
            return '1 minute ago';
        } else if (seconds < 3600) {
            return Math.floor(seconds / 60) + ' minutes ago';
        } else if (seconds < 7200) {
            return '1 hour ago';
        } else if (seconds < 86400) {
            return Math.floor(seconds / 3600) + ' hours ago';
        } else if (seconds < 172800) {
            return 'yesterday';
        } else {
            return Math.floor(seconds / 86400) + ' days ago';
        }
    }
    
    /**
     * Get device information from user agent
     */
    getDeviceInfo(userAgent) {
        let deviceInfo = 'Unknown';
        
        if (/iPhone|iPad|iPod/i.test(userAgent)) {
            deviceInfo = 'iOS';
        } else if (/Android/i.test(userAgent)) {
            deviceInfo = 'Android';
        } else if (/Windows Phone/i.test(userAgent)) {
            deviceInfo = 'Windows Phone';
        } else if (/Windows/i.test(userAgent)) {
            deviceInfo = 'Windows';
        } else if (/Macintosh/i.test(userAgent)) {
            deviceInfo = 'Mac';
        } else if (/Linux/i.test(userAgent)) {
            deviceInfo = 'Linux';
        }
        
        // Add browser info
        if (/Chrome/i.test(userAgent) && !/Chromium|Edge/i.test(userAgent)) {
            deviceInfo += ' / Chrome';
        } else if (/Firefox/i.test(userAgent)) {
            deviceInfo += ' / Firefox';
        } else if (/Safari/i.test(userAgent) && !/Chrome|Chromium|Edge/i.test(userAgent)) {
            deviceInfo += ' / Safari';
        } else if (/Edge/i.test(userAgent)) {
            deviceInfo += ' / Edge';
        } else if (/Opera|OPR/i.test(userAgent)) {
            deviceInfo += ' / Opera';
        }
        
        return deviceInfo;
    }
    
    /**
     * Toggle admin panel visibility
     */
    toggleAdminPanel() {
        if (!this.adminPanelCreated) {
            this.createAdminPanel();
        }
        
        const panel = document.getElementById('visitor-admin-panel');
        if (panel) {
            if (panel.style.display === 'none') {
                panel.style.display = 'block';
                this.updateAdminPanelContent();
            } else {
                panel.style.display = 'none';
            }
        }
    }
}

// Initialize visitor tracking system
document.addEventListener('DOMContentLoaded', () => {
    window.visitorTrackingSystem = new VisitorTrackingSystem();
    
    // Add info about keyboard shortcut to console
    console.info('Visitor tracking system initialized. Press Ctrl+Alt+V to view the admin panel.');
});
