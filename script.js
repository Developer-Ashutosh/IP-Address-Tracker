const mapContainer = document.querySelector("#map");
const ipAddressBox = document.querySelector("#ip-address");
const locationBox = document.querySelector("#location");
const timezoneBox = document.querySelector("#timezone");
const ispBox = document.querySelector("#isp");

// Function to handle IP address search
const searchIPAddress = () => {
    const searchBox = document.querySelector("#search-box");
    const searchBtn = document.querySelector("#search-btn");

    document.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            initiateSearch(searchBox.value);
        }
    });

    searchBtn.addEventListener("click", () => {
        initiateSearch(searchBox.value);
    });
};

const initiateSearch = (ipAddress) => {
    if (ipAddress.trim() !== "") {
        fetchData(ipAddress);
    } else {
        displayError("Please enter a valid IP Address.");
    }
};

const fetchData = async (ipAddress) => {
    try {
        const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_z6BIkgf6uQRzUhvLIWsSm9p8TRnPt&ipAddress=${ipAddress}`);
        const data = await response.json();
        const { ip, location, isp } = data;

        updateData(ip, location, isp);
        initializeMap(location["lat"], location["lng"], location["city"]);
    } catch (error) {
        console.error("Error while fetching data!");
        displayError("Oops! Something went wrong. Please try again.");
    }
};

const updateData = (ipValue, locationValue, ispValue) => {
    ipAddressBox.textContent = (ipValue != "") ? ipValue : "N/A";
    locationBox.textContent = (locationValue["region"]) ? locationValue["region"] + ((locationValue["city"]) ? ', ' + locationValue["city"] + ((locationValue["postalCode"]) ? ', ' + locationValue["postalCode"] + "." : ".") : ".") : "N/A";
    timezoneBox.textContent = (locationValue["timezone"]) ? locationValue["timezone"] : "N/A";
    ispBox.textContent = (ispValue) ? ispValue : "N/A";
};

const initializeMap = (latitude, longitude, city) => {
    if (mapContainer._leaflet_id) {
        mapContainer._leaflet_id = null;
    }

    const map = L.map('map').setView([latitude, longitude], 16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    L.marker([latitude, longitude]).bindPopup(`<p style="margin:0;">${city}.</p>`).addTo(map);
    document.querySelector(".leaflet-control-attribution").remove();
};

const displayError = (message) => {
    const errorBox = document.querySelector(".error-box");

    errorBox.style.top = "50%";
    errorBox.textContent = message;
    setTimeout(() => {
        errorBox.textContent = "";
        errorBox.style.top = "-100%";
    }, 3000);

    mapContainer.innerHTML = "";
    ipAddressBox.textContent = locationBox.textContent = timezoneBox.textContent = ispBox.textContent = "N/A";
    mapContainer.innerHTML = ""
};

searchIPAddress();
