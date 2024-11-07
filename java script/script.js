// Initialize the map
const map = L.map('map').setView([0, 0], 2); // Initial view (global map, zoom level 2)

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch recent earthquake data from the USGS API
async function fetchEarthquakeData() {
    const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
    
    try {
        const response = await axios.get(url);
        const data = response.data;
        
        // Call function to add markers to the map
        addEarthquakeMarkers(data.features);
    } catch (error) {
        console.error("Error fetching earthquake data:", error);
    }
}

// Function to add earthquake markers on the map
function addEarthquakeMarkers(earthquakes) {
    earthquakes.forEach((quake) => {
        // Coordinates of the earthquake
        const lat = quake.geometry.coordinates[1];
        const lon = quake.geometry.coordinates[0];
        
        // Earthquake magnitude
        const magnitude = quake.properties.mag;
        
        // Popup content
        const popupContent = `
            <strong>Location:</strong> ${quake.properties.place}<br>
            <strong>Magnitude:</strong> ${magnitude}<br>
            <strong>Time:</strong> ${new Date(quake.properties.time).toLocaleString()}
        `;
        
        // Set marker color based on magnitude
        const markerColor = getMagnitudeColor(magnitude);
        
        // Create marker with custom icon
        const marker = L.circleMarker([lat, lon], {
            radius: magnitude * 2,  // Size based on magnitude
            fillColor: markerColor,
            color: "white",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.7
        }).addTo(map);
        
        // Add popup to the marker
        marker.bindPopup(popupContent);
    });
}

// Function to determine marker color based on earthquake magnitude
function getMagnitudeColor(magnitude) {
    if (magnitude >= 6) return "red";
    if (magnitude >= 5) return "orange";
    if (magnitude >= 4) return "yellow";
    return "green";  // Magnitude less than 4
}

// Call the function to fetch earthquake data when the page loads
fetchEarthquakeData();
