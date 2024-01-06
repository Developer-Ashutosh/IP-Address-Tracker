const mapContainer = document.querySelector("#map");
const ipAddressBox = document.querySelector("#ip-address");
const locationBox = document.querySelector("#location");
const timezoneBox = document.querySelector("#timezone");
const ispBox = document.querySelector("#isp");
const errorBox = document.querySelector(".error-box");

// Function to search client's IP on page load
const searchClientIP = async () => {
    try {
        loader.style.display = 'inline-block';
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
            loader.style.display = "inline-block";
            fetchData(searchBox.value);
        }
    });

    searchBtn.addEventListener("click", () => {
        loader.style.display = "inline-block";
        fetchData(searchBox.value);
    });
};

// Function to fetch data based on IP address
const fetchData = async (ipAddress) => {
    try {
        const response = await fetch(`http://ip-api.com/json/${ipAddress}`);
        const data = await response.json();
        const { query, lat, lon, city, regionName, countryCode, timezone, isp } = data;
        loader.style.display = 'none';

        updateData(query, city, regionName, countryCode, timezone, isp);
        initializeMap(lat, lon, city);
    } catch (error) {
        displayError("Failed to fetch data. Please check the entered IP address and try again.");
        ipAddressBox.textContent = locationBox.textContent = timezoneBox.textContent = ispBox.textContent = "N/A";
        searchClientIP();
    }
};

// Function to update UI with fetched data
const updateData = (ipValue, city, regionName, countryCode, timezone, ispValue) => {
    ipAddressBox.textContent = ipValue || "N/A";
    locationBox.textContent = regionName ? regionName + (city ? `, ${city}` + (countryCode ? `, ${countryCode}.` : '.') : '.') : 'N/A';
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
    loader.style.display = 'none';
};

// Calling the initial functions
searchClientIP();
searchIPAddress();
