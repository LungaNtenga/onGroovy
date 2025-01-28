
    let map, currentLocationMarker, circle;
    const statusDiv = document.getElementById('status');

    // Initializing the map
    function initMap() {
    map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Adding the center button
    const recenterButton = document.createElement('button');
    recenterButton.innerHTML = `
    
       <i class="fa-solid fa-map-pin"></i> Centre`;
    // This adds a map icon next to the center text on the recenter button

    recenterButton.style.cssText = `
        position: absolute;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        width: 100px; /* Increased width to fit both icon and text */
        height: 60px;
        background-color: #f32121;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 14px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px; /* Adds space between the icon and the text */
        transition: background-color 0.2s ease;
    `;
    
    document.body.appendChild(recenterButton);
    

    recenterButton.addEventListener('mouseenter', () => {
        recenterButton.style.backgroundColor = '#d91c1c';
    });

    recenterButton.addEventListener('mouseleave', () => {
        recenterButton.style.backgroundColor = '#f32121';
    });

    recenterButton.addEventListener('click', recenterMap);
    document.getElementById('map').appendChild(recenterButton);
     // Done with the center button
}
   

    // Update status message
    function updateStatus(message, isError = false) {
    statusDiv.textContent = message;
    statusDiv.className = isError ? 'error' : 'success';
}

   // Restaurant and resort markers
   const createRestaurantMarkers = (position) => {
    const beerIcon = L.divIcon({
        className: 'custom-beer-marker',
        html: `
            <div style="background-color: #f32121; border-radius: 50%; padding: 8px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="width: 24px; height: 24px;">
                    <path d="M17 11h1a3 3 0 0 1 0 6h-1"/>
                    <path d="M9 12v6"/>
                    <path d="M13 12v6"/>
                    <path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 3 11 3s2 .5 3 .5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z"/>
                    <path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"/>
                </svg>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    // Create 10km and 30km radius circles

      //10KM
    L.circle([position.coords.latitude, position.coords.longitude], {
        radius: 10000,
        color: '#f32121',
        fillColor: '#f32121',
        fillOpacity: 0.06,
        weight: 1
    }).addTo(map);

    //30KM
    L.circle([position.coords.latitude, position.coords.longitude], {
        radius: 30000,
        color: '#f32121',
        fillColor: '#f32121',
        fillOpacity: 0.02,
        weight: 1
    }).addTo(map);

    // Sample locations (Examples)
    const locations = [
        { lat: position.coords.latitude + 0.1, lng: position.coords.longitude + 0.1, name: "Downtown Brewery" },
        { lat: position.coords.latitude - 0.1, lng: position.coords.longitude - 0.1, name: "Riverside Resort" },
        { lat: position.coords.latitude + 0.05, lng: position.coords.longitude + 0.05, name: "Mountain View Bar" },
        { lat: position.coords.latitude - 0.02, lng: position.coords.longitude + 0.02, name: "Cosmo" }
    ];

    // This is a pop of evenues on the map
    locations.forEach(loc => {
        const marker = L.marker([loc.lat, loc.lng], { icon: beerIcon }).addTo(map);
        marker.bindPopup(`<div class="area-info modal" display="flex">
            <h3>${loc.name}</h3>
            <img src="path_to_your_image.jpg" alt="Image" style="width: 24px; height: 24px; border-radius: 50%;">
            <button class="view-button">View Details</button>
        </div>`);
    });
};

      // Update location function
      function updateLocation(position) {
      const { latitude, longitude, accuracy } = position.coords;

    if (!currentLocationMarker) {
        currentLocationMarker = L.marker([latitude, longitude]).addTo(map);
        circle = L.circle([latitude, longitude], { radius: accuracy }).addTo(map);
        map.setView([latitude, longitude], 13);
        
        // Adding restaurant markers after getting location
        createRestaurantMarkers(position);
    } else {
        currentLocationMarker.setLatLng([latitude, longitude]);
        circle.setLatLng([latitude, longitude]);
        circle.setRadius(accuracy);
    }

    // Update the location list
    const locationList = document.querySelector('.location-list');
    if (locationList) {
        locationList.children[0].textContent = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
    }

    currentLocationMarker.bindPopup(`Your location<br>Accuracy: ${accuracy.toFixed(2)} meters`).openPopup();
    updateStatus('Location updated successfully');
}

// Handle location errors
function handleLocationError(error) {
    let errorMessage;
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location services.";
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
        case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        default:
            errorMessage = "An unknown error occurred.";
    }
    updateStatus(errorMessage, true);
}

// Recenter map
function recenterMap() {
    if (currentLocationMarker) {
        const position = currentLocationMarker.getLatLng();
        map.setView(position, 13, {
            animate: true,
            duration: 1
        });
    } else {
        updateStatus('Location not yet available', true);
    }
}

// Start tracking location
function startLocationTracking() {
    if (!navigator.geolocation) {
        updateStatus("Geolocation is not supported by your browser", true);
        return;
    }

    updateStatus("Accessing location...");
    navigator.geolocation.getCurrentPosition(updateLocation, handleLocationError);
    navigator.geolocation.watchPosition(updateLocation, handleLocationError, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });
}

// Initialize map and start tracking
initMap();
startLocationTracking();

// Search functionality
const searchInput = document.querySelector('.search-input');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    document.querySelectorAll('.area-card').forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
});

// Modal creation and management (Main Pop-up)
function createVenueModal() {
    const modalContainer = document.createElement('div');
    modalContainer.id = 'venueModal';
    modalContainer.innerHTML = `
    <style>
    #venueModal {
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }

    #venueModal.show {
        display: flex;
    }

    .modal-content {
        background-color: #fefefe;
        border-radius: 12px;
        width: 95%;
        max-width: 800px;
        height: 90vh;
        position: relative;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .modal-header-container {
        position: sticky;
        top: 0;
        background-color: #fefefe;
        z-index: 2;
        padding: 32px;
        border-bottom: 1px solid #e0e0e0;
    }

    .modal-title-group {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 0;
    }

    .modal-title-group h2 {
        margin: 0;
        font-size: 1.5rem;
        line-height: 1.2;
    }

    .modal-number-badge {
        width: 45px;
        height: 45px;
        background-color: #f32121;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .modal-number-badge span {
        color: white;
        font-weight: bold;
        font-size: 1.2rem;
    }

    .modal-header {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0;
        padding: 0;
        border: none;
    }

    .modal-close {
        background: none;
        border: none;
        font-size: 28px;
        cursor: pointer;
        color: #888;
        position: absolute;
        right: 32px;
        top: 32px;
        transition: color 0.2s;
        padding: 0;
        line-height: 1;
    }

    .modal-close:hover {
        color: #333;
    }

    .modal-scrollable-content {
        flex: 1;
        overflow-y: scroll;
        padding: 32px;
        scrollbar-width: thin;
        scrollbar-color: #888 #f1f1f1;
    }

    .modal-scrollable-content::-webkit-scrollbar {
        width: 8px;
    }

    .modal-scrollable-content::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    .modal-scrollable-content::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;
    }

    .modal-scrollable-content::-webkit-scrollbar-thumb:hover {
        background: #555;
    }

    .venue-type-container {

    }

    .venue-type-container h3 {
        font-size: 1.2rem;
        color: #00000;
    }

    .venue-type-container p {
        line-height: 1.6;
    }

    .main-image {
        width: 100%;
        height: 400px;
        object-fit: cover;
        border-radius: 8px;
        margin: 0 0 32px 0;
    }

    .image-carousel {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 24px;
        margin: 32px 0;
    }

    .carousel-image {
        width: 100%;
        height: 150px;
        object-fit: cover;
        border-radius: 8px;
        cursor: pointer;
        transition: transform 0.2s;
    }

    .carousel-image:hover {
        transform: scale(1.05);
    }

    .modal-footer {
        position: sticky;
        bottom: 0;
        background-color: #fefefe;
        padding: 24px 32px;
        border-top: 1px solid #e0e0e0;
    }

    .footer-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .footer-left {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .social-links {
        display: flex;
        gap: 24px;
        margin: 0;
        padding: 0;
    }

    .social-links a {
        color: #333;
        font-size: 24px;
        transition: color 0.2s;
    }

    .social-links a:hover {
        color: #f32121;
    }

    .venue-info {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .venue-info p {
        margin: 0;
        color: #555;
    }

    .book-button {
        background-color: #f32121;
        color: white;
        padding: 14px 36px;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .book-button:hover {
        background-color: #d81c1c;
    }

    .view-all {
        width: 100%;
        background-color: #f32121;
        color: white;
        padding: 14px 36px;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .view-all i {
        margin-left: 8px;
    }

    .view-all:hover{
        background-color: #d81c1c;
    }
    </style>

    <div class="modal-content">
        <div class="modal-header-container">
            <div class="modal-title-group">
                <div class="modal-number-badge">
                    <span id="modalNumber"></span>
                </div>
                <h2 id="modalTitle"></h2>
            </div>
            <button class="modal-close">&times;</button>
        </div>
        
        <div class="modal-scrollable-content">
            <img id="modalImage" class="main-image" src="" alt="Venue Main Image">

            <div class="venue-type-container">
                <h3 id="modal-venue-type"></h3>
                <p id="modalDescription"></p>
                <div id="modalExtraInfo"></div>
            </div>

            <div class="image-carousel">
                <img class="carousel-image" src="images/2.1.png" alt="Venue Image 1">
                <img class="carousel-image" src="images/2.2.png" alt="Venue Image 2">
                <img class="carousel-image" src="images/2.3.png" alt="Venue Image 3">
                <img class="carousel-image" src="images/2.4.png" alt="Venue Image 4">
                <img class="carousel-image" src="images/2.5.png" alt="Venue Image 5">
                <img class="carousel-image" src="images/2.6.png" alt="Venue Image 6">
                <img class="carousel-image" src="images/2.7.png" alt="Venue Image 7">
                <img class="carousel-image" src="images/2.8.png" alt="Venue Image 8">
                <img class="carousel-image" src="images/2.9.png" alt="Venue Image 9">
            </div>
            <div>
            <button class="view-all">View all<i class="fa-sharp-duotone fa-solid fa-angle-down"></i>
            </button>
            </div>
        </div>

        <div class="modal-footer">
            <div class="footer-content">
                <div class="footer-left">
                    <div class="social-links">
                        <a href="#" aria-label="TikTok"><i class="fab fa-tiktok"></i></a>
                        <a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
                        <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                    </div>
                    <div class="venue-info">
                        <p>Opening Hours: 9:00 AM - 10:00 PM</p>
                        <p>Contact: +1 234 567 890</p>
                    </div>
                </div>
                <button class="book-button">Book Reservation Now </button>
            </div>
        </div>
    </div>
`;

    document.body.appendChild(modalContainer);
    const modal = document.getElementById('venueModal');
    const closeButtons = modal.querySelectorAll('.modal-close, .modal-btn-close');
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    });

    return modal;
}

// Initializing modal when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    const modal = createVenueModal();
    const viewButtons = document.querySelectorAll('.view-button');

    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Creating variables from html (classes + elements)
            const areaCard = button.closest('.area-card');
            const title = areaCard.querySelector('h3').textContent;
            const description = areaCard.querySelector('p').textContent;
            const imageSrc = areaCard.querySelector('.area-image').src;
            const number = areaCard.querySelector('.area-number').textContent;
            const type = areaCard.querySelector('h6').textContent;


            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalDescription').textContent = description;
            document.getElementById('modalImage').src = imageSrc;
            document.getElementById('modalNumber').textContent = number;
            document.getElementById('modal-venue-type').textContent = type;
            modal.classList.add('show');
        });
    });
});