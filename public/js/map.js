const searchForSales = document.querySelector('.searchForSales');
const searchForRents = document.querySelector('.searchForRents');

let defaultHouseSearch = 'rents';

// Default map
const map = L.map('map', {
  minZoom: 11,
  maxZoom: 16
}).setView([29.5794, 52.5891], 11.45);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let markersLayer = L.layerGroup(); // Create a layer group for markers

const greenIcon = L.icon({
  iconUrl: '../img/map-pin-fill.svg',
  iconSize: [45, 45],
  iconAnchor: [22, 43],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Dynamic for rents and sales ads
function addMarker(getData) {
  getData.forEach(house => {
    console.log(house.location.coordinates);
    const { coordinates } = house.location;
    const marker = L.marker([coordinates[1], coordinates[0]]);
    const circle = L.circle([coordinates[1], coordinates[0]], {
      color: '#68696e',
      fillColor: '#68696e',
      fillOpacity: 0.4,
      radius: 100
    });
    if (house.mortgagePrice) {
      const popupContent = `
        <span class='house-info-map'>رهن:${house.mortgagePrice} - اجاره:${house.rentPrice}</span><br>
        <a class='house-link-map' href='/for_rent/${house._id}'>برای جزییات بیشتر اینجا کلیک کنید!</a>
      `;
      marker.bindPopup(popupContent); // Bind the popup to the marker
    } else {
      const popupContent = `
        <span class='house-info-map'>قیمت:${house.price}</span><br>
        <a class='house-link-map' href='/for_sale/${house._id}'>برای جزییات بیشتر ایجا کلیک کنید!</a>
        `;
      marker.bindPopup(popupContent); // Bind the popup to the marker
    }
    marker.addTo(markersLayer);
    circle.addTo(markersLayer);
  });

  markersLayer.addTo(map); // Add the layer group to the map
}

// Cached data
const cachedData = {
  rents: null,
  sales: null
};

const getLocations = async houseType => {
  try {
    markersLayer.clearLayers();

    // Check if data is already cached
    if (cachedData[houseType]) {
      addMarker(cachedData[houseType]);
    } else {
      const url =
        houseType === 'rents'
          ? '/api/v1/for_rent/map/shiraz'
          : '/api/v1/for_sale/map/shiraz';
      const res = await axios({
        method: 'GET',
        url
      });

      // console.log(res);

      const getData =
        houseType === 'rents' ? res.data.data.rents : res.data.data.sales;

      cachedData[houseType] = getData;

      addMarker(getData);
    }
  } catch (err) {
    console.log(err);
  }
};

getLocations(defaultHouseSearch);

searchForRents.addEventListener('click', e => {
  e.preventDefault();
  defaultHouseSearch = 'rents';

  searchForRents.style.backgroundColor = 'rgb(8, 194, 60)';
  searchForRents.style.color = '#fff';
  searchForSales.style.backgroundColor = '#fff';
  searchForSales.style.color = '#a9a8a8';

  getLocations(defaultHouseSearch);
});

searchForSales.addEventListener('click', e => {
  e.preventDefault();
  defaultHouseSearch = 'sales';

  searchForSales.style.backgroundColor = 'rgb(8, 194, 60)';
  searchForSales.style.color = '#fff';
  searchForRents.style.backgroundColor = '#fff';
  searchForRents.style.color = '#a9a8a8';

  getLocations(defaultHouseSearch);
});
