const API_KEY = api_key; // MapTiler API key

const fullLocation = `${locationName}, ${country}`;
async function loadMap() {
  const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(fullLocation)}.json?key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
    if (data && data.features.length > 0) {
    const [lng, lat] = data.features[0].geometry.coordinates;

    const map = L.map('map').setView([lat, lng], 9);
    L.tileLayer(`https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${API_KEY}`, {
      attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a>',
    }).addTo(map);
      
    const customIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
        });

    L.marker([lat, lng] , { icon: customIcon }).addTo(map);
    } else {
      document.getElementById('map').innerHTML = '<p>Location not found.</p>';
    }
  }

  loadMap();
