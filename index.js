 // This is a JS
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

      //1.10KM
    L.circle([position.coords.latitude, position.coords.longitude], {
        radius: 10000,
        color: '#f32121',
        fillColor: '#f32121',
        fillOpacity: 0.06,
        weight: 1
    }).addTo(map);

    //2.30KM
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
        marker.bindPopup(`<div class="area-info modal popup-container">
            <h3 class="popup-title">${loc.name}</h3>
            <div class="venue-type popup-type">${loc.type}</div>
            <img src="/images/1.png" alt="Venue Image" class="popup-image">
            <button class="popup-button">View Details</button>
        </div>
        <style>
            .popup-container {
                text-align: left;
                padding: 8px; /* Reduced padding */
                width: 220px; /* Reduced width */
            }
            .popup-title {
                margin: 0 0 5px 0;
                color: #333;
                font-size: 1.1em; /* Slightly smaller font */
            }
            .popup-type {
                color: #666;
                font-size: 0.85em; /* Slightly smaller font */
                margin-bottom: 8px; /* Reduced margin */
            }
            .popup-image {
                width: 100%;
                height: 130px; /* Reduced height */
                border-radius: 5px;
                display: block;
                object-fit: cover;
                margin: 8px 0; /* Reduced margin */
            }
            .popup-button {
                background: #f32121;
                color: white;
                border: none;
                padding: 8px 16px; /* Reduced padding */
                border-radius: 4px;
                cursor: pointer;
                width: 100%;
                font-size: 0.9em; /* Slightly smaller font */
                margin-top: 8px; /* Reduced margin */
            }
        </style>
        `);
         // Clicking oustide will close the pop-up
        map.on('click', () => {
            marker.closePopup();
        });
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

        /* Hide images beyond the 6th by default */
        .image-carousel .carousel-image:nth-child(n+7) {
            display: none;
        }

        /* Show all images when .show-all is added */
        .image-carousel.show-all .carousel-image {
            display: block;
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

        .view-all:hover {
            background-color: #d81c1c;
        }

        /* Lightbox styles */
        .lightbox {
            position: fixed;
            z-index: 1001;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: none;
            align-items: center;
            justify-content: center;
        }

        .lightbox.show {
            display: flex;
        }

        .lightbox-content {
            max-width: 90%;
            max-height: 90%;
            position: relative;
        }

        .lightbox-content img,
        .lightbox-content video {
            max-width: 100%;
            max-height: 80vh;
            border-radius: 8px;
        }

        .lightbox-close {
            position: absolute;
            top: -30px;
            right: -30px;
            background: none;
            border: none;
            color: white;
            font-size: 28px;
            cursor: pointer;
        }

        .lightbox-close:hover {
            color: #f32121;
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
                <button class="view-all">View all<i class="fa-sharp-duotone fa-solid fa-angle-down"></i></button>
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

    <!-- Lightbox HTML -->
    <div class="lightbox">
        <div class="lightbox-content">
            <img src="" alt="Lightbox Image" class="lightbox-media">
            <button class="lightbox-close">&times;</button>
        </div>
    </div>
    `;

    document.body.appendChild(modalContainer);
    const modal = document.getElementById('venueModal');
    const closeButtons = modal.querySelectorAll('.modal-close');
    const imageCarousel = modal.querySelector('.image-carousel');
    const viewAllButton = modal.querySelector('.view-all');

    
    // Toggle images and button text
    viewAllButton.addEventListener('click', () => {
        imageCarousel.classList.toggle('show-all');
        const buttonText = viewAllButton.childNodes[0];
        buttonText.data = imageCarousel.classList.contains('show-all') ? 'Hide' : 'View all';
    });

    // Close modal and reset state
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('show');
            imageCarousel.classList.remove('show-all');
            const buttonText = viewAllButton.childNodes[0];
            buttonText.data = 'View all';
        });
    });

    // Lightbox functionality
    const lightbox = modal.querySelector('.lightbox');
    const lightboxMedia = modal.querySelector('.lightbox-media');
    const lightboxClose = modal.querySelector('.lightbox-close');

    // Open lightbox when an image is clicked
    imageCarousel.addEventListener('click', (e) => {
        if (e.target.classList.contains('carousel-image')) {
            lightboxMedia.src = e.target.src;
            lightboxMedia.alt = e.target.alt;
            lightbox.classList.add('show');
        }
    });

    // Close lightbox
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('show');
    });

    // Close lightbox when clicking outside the content
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('show');
        }
    });

        // Add the drawer HTML
        const drawer = document.createElement('div');
        drawer.id = 'drawer';
        drawer.innerHTML = `
        <div class="drawer-content">
        <button class="drawer-close">&times;</button>
        <h3 id="drawer-venue-name">Book Reservation for <span id="selected-venue-name"></span></h3>
        <form>
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
            
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            
            <label for="date">Date:</label>
            <input type="date" id="date" name="date" required>
            
            <label for="time">Time:</label>
            <input type="time" id="time" name="time" required>
            
            <div class="table-selection">
                <h4>Select a Table</h4>
                <div class="table-grid">
                    <!-- Example tables -->
                    <button type="button" class="table-button" data-table="101">101</button>
                    <button type="button" class="table-button" data-table="102">102</button>
                    <button type="button" class="table-button" data-table="103">103</button>
                    <button type="button" class="table-button" data-table="104">104</button>
                    <button type="button" class="table-button" data-table="105">105</button>
                    <button type="button" class="table-button" data-table="106">106</button>
                    <button type="button" class="table-button" data-table="107">107</button>
                    <button type="button" class="table-button" data-table="108">108</button>
                    <button type="button" class="table-button" data-table="109">109</button>
                    <button type="button" class="table-button" data-table="110">110</button>
                    <!-- Add more tables as needed -->
                </div>
            </div>
            
            <button type="submit">Submit</button>
        </form>
    </div>
        `;
        document.body.appendChild(drawer);
    
        // Add drawer styles
        const style = document.createElement('style');
        style.textContent = `
        /* Drawer Styles */
        #drawer {
            position: fixed;
            top: 0;
            right: -400px; /* Start off-screen */
            width: 400px;
            height: 100%;
            background-color: white;
            box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
            transition: right 0.3s ease-in-out;
            z-index: 1000;
            padding: 20px;
            box-sizing: border-box;
        }
    
        #drawer.open {
            right: 0; /* Slide in */
        }
    
        .drawer-content {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
    
        .drawer-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            position: absolute;
            top: 10px;
            right: 10px;
        }
    
        #drawer-venue-name {
            margin: 0;
            font-size: 1.5rem;
            color: #333;
        }
    
        #drawer form {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
    
        #drawer form label {
            font-size: 1rem;
            color: #555;
        }
    
        #drawer form input {
            width: 100%;
            padding: 12px;
            font-size: 1rem;
            border: 1px solid #ccc;
            border-radius: 6px;
            box-sizing: border-box;
        }
    
        #drawer form button[type="submit"] {
            background-color: #f32121;
            color: white;
            padding: 14px 36px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.2s;
            width: 100%;
            box-sizing: border-box;
        }
    
        #drawer form button[type="submit"]:hover {
            background-color: #d81c1c;
        }
    
        /* Table Selection Grid */
        .table-selection {
            margin-top: 20px;
        }
    
        .table-selection h4 {
            margin: 0 0 10px 0;
            font-size: 1.2rem;
            color: #333;
        }
    
        .table-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
            gap: 10px;
        }
    
        .table-button {
            padding: 10px;
            font-size: 1rem;
            border: 1px solid #ccc;
            border-radius: 6px;
            background-color: #f9f9f9;
            cursor: pointer;
            text-align: center;
            transition: background-color 0.2s, border-color 0.2s;
        }
    
        .table-button:hover {
            background-color: #e0e0e0;
            border-color: #999;
        }
    
        .table-button.selected {
            background-color: #f32121;
            color: white;
            border-color: #f32121;
        }
        `;
        document.head.appendChild(style); 
        
        // Drawer functionality
        const bookButton = modal.querySelector('.book-button');
        const drawerCloseButton = drawer.querySelector('.drawer-close');
        const selectedVenueName = drawer.querySelector('#selected-venue-name');
        const tableButtons = drawer.querySelectorAll('.table-button');
        
        // Open the drawer when the book button is clicked
        bookButton.addEventListener('click', () => {
            // Get the venue name from the modal title
            const venueName = modal.querySelector('#modalTitle').textContent;
            
            // Update the drawer's venue name
            selectedVenueName.textContent = venueName;
            
            // Open the drawer
            drawer.classList.add('open');
        });
        
        // Close the drawer when the close button is clicked
        drawerCloseButton.addEventListener('click', () => {
            drawer.classList.remove('open');
        });
        
        // Optional: Close the drawer when clicking outside of it
        document.addEventListener('click', (event) => {
            if (!drawer.contains(event.target) && !bookButton.contains(event.target)) {
                drawer.classList.remove('open');
            }
        });
        
        // Table selection logic
        let selectedTable = null;
        
        tableButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Deselect the previously selected table
                if (selectedTable) {
                    selectedTable.classList.remove('selected');
                }
        
                // Select the clicked table
                button.classList.add('selected');
                selectedTable = button;
        
                // Store the selected table number (optional)
                const tableNumber = button.getAttribute('data-table');
                console.log(`Selected table: ${tableNumber}`);
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
