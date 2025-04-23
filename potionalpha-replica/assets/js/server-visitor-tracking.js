/**
 * Server-Side Visitor Tracking System
 * Tracks and stores visitor data on the server using Firebase Realtime Database
 */

// Initialize Firebase with your project config
const firebaseConfig = {
  apiKey: "AIzaSyBXH7JgXIWzi7DNwjN7LFFHnKkc_ZUQv-s",
  authDomain: "primealpha-visitor-tracking.firebaseapp.com",
  databaseURL: "https://primealpha-visitor-tracking-default-rtdb.firebaseio.com",
  projectId: "primealpha-visitor-tracking",
  storageBucket: "primealpha-visitor-tracking.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

class ServerVisitorTrackingSystem {
    constructor() {
        this.visitorId = null;
        this.sessionStart = null;
        this.initializeFirebase();
        this.initializeTracking();
    }

    /**
     * Initialize Firebase
     */
    initializeFirebase() {
        // Check if Firebase is already initialized
        if (!window.firebase) {
            console.error('Firebase SDK not loaded. Make sure to include the Firebase SDK in your HTML.');
            return;
        }
        
        // Initialize Firebase if not already initialized
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        
        this.database = firebase.database();
    }

    /**
     * Initialize the tracking system
     */
    initializeTracking() {
        // Generate a unique visitor ID if not exists
        if (!localStorage.getItem('visitorId')) {
            localStorage.setItem('visitorId', this.generateVisitorId());
        }
        
        this.visitorId = localStorage.getItem('visitorId');
        
        // Set session start time
        if (!localStorage.getItem('sessionStart')) {
            localStorage.setItem('sessionStart', Date.now().toString());
        }
        
        this.sessionStart = parseInt(localStorage.getItem('sessionStart'));
        
        // Track this visitor
        this.trackVisitor();
        
        // Update visitor status periodically
        setInterval(() => {
            this.trackVisitor();
        }, 30000); // Every 30 seconds
        
        // Track when user leaves the page
        window.addEventListener('beforeunload', () => {
            this.updateVisitorStatus('offline');
        });
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
        if (!this.database || !this.visitorId) return;
        
        // Collect visitor data
        const data = {
            id: this.visitorId,
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            currentPage: window.location.pathname,
            referrer: document.referrer || 'Direct',
            lastActive: new Date().toISOString(),
            sessionDuration: this.calculateSessionDuration(),
            status: 'online'
        };
        
        // Send to Firebase
        this.database.ref('visitors/' + this.visitorId).set(data)
            .then(() => {
                console.log('Visitor data updated in Firebase');
            })
            .catch((error) => {
                console.error('Error updating visitor data:', error);
            });
    }
    
    /**
     * Update visitor status
     */
    updateVisitorStatus(status) {
        if (!this.database || !this.visitorId) return;
        
        this.database.ref('visitors/' + this.visitorId + '/status').set(status)
            .catch((error) => {
                console.error('Error updating visitor status:', error);
            });
    }
    
    /**
     * Calculate session duration
     */
    calculateSessionDuration() {
        if (!this.sessionStart) {
            this.sessionStart = Date.now();
            localStorage.setItem('sessionStart', this.sessionStart.toString());
            return '0s';
        }
        
        const duration = Math.floor((Date.now() - this.sessionStart) / 1000);
        
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
     * Get all visitors (for admin dashboard)
     */
    static getAllVisitors(callback) {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        
        const database = firebase.database();
        
        // Get all visitors from Firebase
        database.ref('visitors').on('value', (snapshot) => {
            const visitors = snapshot.val() || {};
            callback(visitors);
        });
    }
    
    /**
     * Remove inactive visitors (older than 30 minutes)
     */
    static cleanupInactiveVisitors() {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        
        const database = firebase.database();
        const thirtyMinutesAgo = new Date();
        thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);
        
        database.ref('visitors').once('value', (snapshot) => {
            const visitors = snapshot.val() || {};
            
            Object.keys(visitors).forEach((visitorId) => {
                const visitor = visitors[visitorId];
                const lastActive = new Date(visitor.lastActive);
                
                if (lastActive < thirtyMinutesAgo || visitor.status === 'offline') {
                    database.ref('visitors/' + visitorId).remove()
                        .then(() => {
                            console.log('Removed inactive visitor:', visitorId);
                        })
                        .catch((error) => {
                            console.error('Error removing inactive visitor:', error);
                        });
                }
            });
        });
    }
}

// Initialize visitor tracking system
document.addEventListener('DOMContentLoaded', () => {
    // Load Firebase SDK
    const loadFirebaseScript = (callback) => {
        // Check if Firebase is already loaded
        if (window.firebase) {
            callback();
            return;
        }
        
        // Load Firebase scripts
        const firebaseApp = document.createElement('script');
        firebaseApp.src = 'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js';
        firebaseApp.onload = () => {
            const firebaseDatabase = document.createElement('script');
            firebaseDatabase.src = 'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js';
            firebaseDatabase.onload = callback;
            document.head.appendChild(firebaseDatabase);
        };
        document.head.appendChild(firebaseApp);
    };
    
    loadFirebaseScript(() => {
        window.serverVisitorTrackingSystem = new ServerVisitorTrackingSystem();
        console.info('Server-side visitor tracking system initialized.');
        
        // Clean up inactive visitors every 5 minutes
        setInterval(() => {
            ServerVisitorTrackingSystem.cleanupInactiveVisitors();
        }, 300000);
    });
});
