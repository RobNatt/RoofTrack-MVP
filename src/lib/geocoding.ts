export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
        const apiKey = 'AIzaSyBAgEjpI9L3Wu-NJyPv--kzsuPsGx5m7nY';
        const encodedAddress = encodeURIComponent(address);
        
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`
        );
        
        const data = await response.json();
        
        if (data.status === 'OK' && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng
            };
        }
        
        console.error('Geocoding failed:', data.status);
        return null;
        
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}