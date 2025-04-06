// Initialize map
let map;
let userMarker;
let userPosition;

// Initialize the map when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    setupEventListeners();
    startLocationTracking();
});

function initializeMap() {
    // Create the map centered on a default location (will be updated with user's location)
    map = L.map('map').setView([0, 0], 13);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

function setupEventListeners() {
    // SOS Button
    const sosButton = document.getElementById('sosButton');
    sosButton.addEventListener('click', handleEmergency);

    // Contact Modal
    const addContactBtn = document.getElementById('addContact');
    const modal = document.getElementById('contactModal');
    const closeBtn = document.querySelector('.close');
    const contactForm = document.getElementById('contactForm');

    addContactBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    contactForm.addEventListener('submit', handleNewContact);

    // Quick call buttons
    document.querySelectorAll('.quick-call').forEach(button => {
        if (button.dataset.number) {
            button.addEventListener('click', () => initiateCall(button.dataset.number));
        }
    });
}

function startLocationTracking() {
    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(
            position => updateUserLocation(position),
            error => console.error("Error getting location:", error),
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    } else {
        alert("Geolocation is not supported by your browser");
    }
}

function updateUserLocation(position) {
    userPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };

    // Center map on user's location
    map.setView([userPosition.lat, userPosition.lng], 15);

    // Update or create user marker
    if (userMarker) {
        userMarker.setLatLng([userPosition.lat, userPosition.lng]);
    } else {
        userMarker = L.marker([userPosition.lat, userPosition.lng]).addTo(map);
    }
}

function handleEmergency() {
    if (!userPosition) {
        alert("Unable to determine your location. Please enable location services.");
        return;
    }

    // Visual feedback
    const sosButton = document.getElementById('sosButton');
    sosButton.style.animation = 'none';
    sosButton.offsetHeight; // Trigger reflow
    sosButton.style.animation = null;

    // Find nearest emergency services
    findNearestEmergencyServices();

    // Attempt to send emergency alert
    sendEmergencyAlert();
}

function findNearestEmergencyServices() {
    // In a real application, this would query a backend service
    // For demonstration, we'll show some mock safe routes
    const routeDetails = document.getElementById('routeDetails');
    routeDetails.innerHTML = `
        <div class="safe-route">
            <h4>Nearest Hospital</h4>
            <p>City General Hospital - 0.8 miles away</p>
            <p>Estimated arrival: 5 minutes</p>
        </div>
        <div class="safe-route">
            <h4>Nearest Police Station</h4>
            <p>Central Police Department - 1.2 miles away</p>
            <p>Estimated arrival: 7 minutes</p>
        </div>
    `;
}

function sendEmergencyAlert() {
    // In a real application, this would send alerts to emergency services and contacts
    console.log("Emergency alert sent with location:", userPosition);
}

function handleNewContact(e) {
    e.preventDefault();
    const name = document.getElementById('contactName').value;
    const number = document.getElementById('contactNumber').value;

    // Add new contact to the grid
    const contactsGrid = document.querySelector('.contacts-grid');
    const newContact = document.createElement('div');
    newContact.className = 'contact-card';
    newContact.innerHTML = `
        <button class="quick-call" data-number="${number}">
            <span class="icon">👤</span>
            <span class="label">${name}</span>
            <span class="number">${number}</span>
        </button>
    `;

    // Add click event to the new contact
    newContact.querySelector('.quick-call').addEventListener('click', () => initiateCall(number));

    // Insert before the "Add Contact" card
    contactsGrid.insertBefore(newContact, document.getElementById('addContact').parentNode);

    // Close modal and reset form
    document.getElementById('contactModal').style.display = 'none';
    e.target.reset();
}

function initiateCall(number) {
    // In a real application, this would integrate with the device's phone system
    window.location.href = `tel:${number}`;
}