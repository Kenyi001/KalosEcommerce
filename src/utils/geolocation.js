export class GeolocationService {
    constructor() {
        this.watchId = null;
        this.lastKnownPosition = null;
        this.isWatching = false;
        
        // Try to load last position from localStorage
        this.loadLastPosition();
    }

    loadLastPosition() {
        try {
            const stored = localStorage.getItem('kalos_last_position');
            if (stored) {
                const position = JSON.parse(stored);
                const age = Date.now() - position.timestamp;
                // Use cached position if less than 1 hour old
                if (age < 3600000) {
                    this.lastKnownPosition = position;
                }
            }
        } catch (error) {
            console.warn('Error loading cached position:', error);
        }
    }

    saveLastPosition(position) {
        try {
            const positionData = {
                lat: position.lat,
                lng: position.lng,
                accuracy: position.accuracy,
                timestamp: Date.now()
            };
            localStorage.setItem('kalos_last_position', JSON.stringify(positionData));
            this.lastKnownPosition = positionData;
        } catch (error) {
            console.warn('Error saving position to localStorage:', error);
        }
    }

    async getCurrentPosition(options = {}) {
        const defaultOptions = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 300000, // 5 minutes
            ...options
        };

        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'));
                return;
            }

            // If we have a recent cached position and user doesn't want high accuracy, use it
            if (this.lastKnownPosition && !options.forceNew && !defaultOptions.enableHighAccuracy) {
                resolve({
                    lat: this.lastKnownPosition.lat,
                    lng: this.lastKnownPosition.lng,
                    accuracy: this.lastKnownPosition.accuracy,
                    fromCache: true
                });
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        fromCache: false
                    };
                    
                    this.saveLastPosition(coords);
                    resolve(coords);
                },
                (error) => {
                    // If we have cached position, fall back to it
                    if (this.lastKnownPosition && !options.forceNew) {
                        resolve({
                            lat: this.lastKnownPosition.lat,
                            lng: this.lastKnownPosition.lng,
                            accuracy: this.lastKnownPosition.accuracy,
                            fromCache: true,
                            fallback: true
                        });
                        return;
                    }
                    
                    reject(this.getGeolocationError(error));
                },
                defaultOptions
            );
        });
    }

    watchPosition(callback, options = {}) {
        if (!navigator.geolocation) {
            throw new Error('Geolocation is not supported by this browser');
        }

        if (this.isWatching) {
            this.stopWatchingPosition();
        }

        const defaultOptions = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000, // 1 minute
            ...options
        };

        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                const coords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: Date.now()
                };
                
                this.saveLastPosition(coords);
                callback(coords, null);
            },
            (error) => {
                callback(null, this.getGeolocationError(error));
            },
            defaultOptions
        );

        this.isWatching = true;
        return this.watchId;
    }

    stopWatchingPosition() {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
            this.isWatching = false;
        }
    }

    getGeolocationError(error) {
        let message = 'Error desconocido al obtener la ubicación';
        let code = 'UNKNOWN_ERROR';

        switch (error.code) {
            case error.PERMISSION_DENIED:
                message = 'El usuario denegó el permiso de geolocalización. Por favor, permite el acceso a la ubicación en la configuración de tu navegador.';
                code = 'PERMISSION_DENIED';
                break;
            case error.POSITION_UNAVAILABLE:
                message = 'La ubicación no está disponible en este momento. Verifica tu conexión GPS/internet.';
                code = 'POSITION_UNAVAILABLE';
                break;
            case error.TIMEOUT:
                message = 'Se agotó el tiempo de espera para obtener la ubicación. Intenta nuevamente.';
                code = 'TIMEOUT';
                break;
        }

        return {
            code,
            message,
            originalError: error
        };
    }

    async getLocationPermissionStatus() {
        if (!navigator.permissions) {
            return 'unknown';
        }

        try {
            const permission = await navigator.permissions.query({ name: 'geolocation' });
            return permission.state; // 'granted', 'denied', 'prompt'
        } catch (error) {
            return 'unknown';
        }
    }

    async requestLocationPermission() {
        try {
            // This will trigger the permission prompt
            const position = await this.getCurrentPosition({ timeout: 5000 });
            return { granted: true, position };
        } catch (error) {
            return { 
                granted: false, 
                error: error.code === 'PERMISSION_DENIED' ? 'denied' : 'unavailable'
            };
        }
    }

    getLastKnownPosition() {
        return this.lastKnownPosition;
    }

    clearLastKnownPosition() {
        this.lastKnownPosition = null;
        try {
            localStorage.removeItem('kalos_last_position');
        } catch (error) {
            console.warn('Error clearing cached position:', error);
        }
    }

    // Calculate distance between two points using Haversine formula (already implemented in SearchService)
    static calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    // Check if browser supports geolocation
    static isSupported() {
        return 'geolocation' in navigator;
    }

    // Get accuracy level description
    static getAccuracyDescription(accuracy) {
        if (!accuracy) return 'Desconocida';
        
        if (accuracy < 10) return 'Muy alta (< 10m)';
        if (accuracy < 50) return 'Alta (< 50m)';
        if (accuracy < 100) return 'Media (< 100m)';
        if (accuracy < 500) return 'Baja (< 500m)';
        return 'Muy baja (> 500m)';
    }
}

// Location utility functions
export const LocationUtils = {
    // Format coordinates for display
    formatCoordinates(lat, lng, precision = 4) {
        return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
    },

    // Get city name from coordinates (simplified - in production would use reverse geocoding API)
    getCityFromCoordinates(lat, lng) {
        // Simplified mapping for Bolivia's main cities
        const cities = [
            { name: 'La Paz', lat: -16.5000, lng: -68.1500, radius: 0.5 },
            { name: 'Cochabamba', lat: -17.3895, lng: -66.1568, radius: 0.3 },
            { name: 'Santa Cruz', lat: -17.7833, lng: -63.1667, radius: 0.4 },
            { name: 'Sucre', lat: -19.0196, lng: -65.2619, radius: 0.2 },
            { name: 'Tarija', lat: -21.5355, lng: -64.7296, radius: 0.2 },
            { name: 'Oruro', lat: -17.9833, lng: -67.1167, radius: 0.2 },
            { name: 'Potosí', lat: -19.5836, lng: -65.7531, radius: 0.2 }
        ];

        for (const city of cities) {
            const distance = GeolocationService.calculateDistance(lat, lng, city.lat, city.lng);
            if (distance <= city.radius * 100) { // Convert to km
                return city.name;
            }
        }

        return 'Ubicación desconocida';
    },

    // Check if coordinates are within Bolivia
    isInBolivia(lat, lng) {
        // Approximate bounding box for Bolivia
        return (
            lat >= -22.9 && lat <= -9.7 &&
            lng >= -69.6 && lng <= -57.5
        );
    },

    // Get distance description
    getDistanceDescription(distance) {
        if (distance < 0.1) return 'Muy cerca';
        if (distance < 0.5) return 'A menos de 500m';
        if (distance < 1) return 'A menos de 1 km';
        if (distance < 2) return 'A menos de 2 km';
        if (distance < 5) return 'A menos de 5 km';
        if (distance < 10) return 'A menos de 10 km';
        if (distance < 20) return 'A menos de 20 km';
        return `A ${Math.round(distance)} km`;
    }
};

// Create singleton instance
const geolocationService = new GeolocationService();
export default geolocationService;