const mapContainer = document.querySelector("#map");
const ipAddressBox = document.querySelector("#ip-address");
const locationBox = document.querySelector("#location");
const timezoneBox = document.querySelector("#timezone");
const ispBox = document.querySelector("#isp");
const errorBox = document.querySelector(".error-box");

// Function to search client's IP on page load
const searchClientIP = async () => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        fetchData(data.ip);
    } catch (error) {
        displayError("Failed to fetch your IP and other details.");
    }
};

// Function to handle IP address search events
const searchIPAddress = () => {
    const searchBox = document.querySelector("#search-box");
    const searchBtn = document.querySelector("#search-btn");

    document.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            fetchData(searchBox.value);
        }
    });

    searchBtn.addEventListener("click", () => {
        fetchData(searchBox.value);
    });
};

// Function to fetch data based on IP address
const fetchData = async (ipAddress) => {
    try {
        const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_z6BIkgf6uQRzUhvLIWsSm9p8TRnPt&ipAddress=${ipAddress}`);
        const data = await response.json();
        const { ip, location, isp } = data;

        updateData(ip, location, isp);
        initializeMap(location["lat"], location["lng"], location["city"]);
    } catch (error) {
        displayError("Failed to fetch data. Please check the entered IP address and try again.");
        ipAddressBox.textContent = locationBox.textContent = timezoneBox.textContent = ispBox.textContent = "N/A";
        searchClientIP();
    }
};

// Function to update UI with fetched data
const updateData = (ipValue, locationValue, ispValue) => {
    const { region, city, postalCode, timezone } = locationValue;
    ipAddressBox.textContent = ipValue || "N/A";
    locationBox.textContent = region ? region + (city ? `, ${city}` + (postalCode ? `, ${postalCode}.` : '.') : '.') : 'N/A';
    timezoneBox.textContent = timezone || "N/A";
    ispBox.textContent = ispValue || "N/A";
};

// Function to initialize Leaflet map
const initializeMap = (latitude, longitude, city) => {
    if (mapContainer._leaflet_id) {
        mapContainer._leaflet_id = null;
    }

    const map = L.map('map').setView([latitude, longitude], 16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    L.marker([latitude, longitude]).bindPopup(`<p style="margin:0;">${city}.</p>`).addTo(map);
    document.querySelector(".leaflet-control-attribution").remove();
};

// Function to display and hide errors
const displayError = (message) => {
    errorBox.style.top = "50%";
    errorBox.innerHTML = message;
    setTimeout(() => {
        errorBox.innerHTML = "";
        errorBox.style.top = "-100%";
    }, 3000);
};

// Calling the initial functions
searchClientIP();
searchIPAddress();
