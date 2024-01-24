const addRentHouseForm = document.querySelector('#addRentHouseForm');
const addSaleHouseForm = document.querySelector('#addSaleHouseForm');

// Reusable function to set up the map and handle location selection

const setupMap = (mapId, coordinatesInputId) => {
  const mapContainer = L.map(mapId).setView([29.5794, 52.5891], 11.45);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapContainer);

  let marker;

  mapContainer.on('click', (e) => {
    const { lat, lng } = e.latlng;

    if (marker) {
      marker.setLatLng([lat, lng]);
    } else {
      marker = L.marker([lat, lng]).addTo(mapContainer);
    }

    document.getElementById(`${coordinatesInputId}Lng`).value = lng;
    document.getElementById(`${coordinatesInputId}Lat`).value = lat;
  });
};

// type is 'success' or 'error'
const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};

const addHouse = async (data, type) => {
  try {
    const url = type === 'rent' ? '/api/v1/for_rent' : '/api/v1/for_sale';
    const res = await axios({
      method: 'POST',
      url,
      data
    });

    if (res.data.status === 'success') {
      // console.log('success');
      showAlert('success', 'ملک اضافه شد!');
      window.setTimeout(() => {
        location.assign('/me/new_house');
      }, 1500);
    }
  } catch (err) {
    // console.log('NOT');
    showAlert('error', err.response.data.message);
  }
};

if (addSaleHouseForm)
  addSaleHouseForm.addEventListener('submit', e => {
    e.preventDefault();

    const form = new FormData();
    form.append('city', document.getElementById('saleCity').value);
    form.append(
      'buildingType',
      document.getElementById('saleBuildingType').value
    );
    form.append('price', document.getElementById('salePrice').value);
    form.append('size', document.getElementById('saleSize').value);
    form.append('room', document.getElementById('saleRoom').value);
    form.append('address', document.getElementById('saleAddress').value);
    form.append(
      'location[coordinates][0]',
      parseFloat(document.getElementById('saleAddressLng').value)
    );
    form.append(
      'location[coordinates][1]',
      parseFloat(document.getElementById('saleAddressLat').value)
    );
    form.append('phoneNumber', document.getElementById('salePhone').value);
    form.append('elevator', document.getElementById('saleElevator').checked);
    form.append('parking', document.getElementById('saleParking').checked);
    form.append(
      'buildingStatus',
      document.getElementById('saleBuildingStatus').checked
    );
    form.append('storeroom', document.getElementById('saleStoreroom').checked);
    form.append('floor', document.getElementById('saleFloor').value);
    form.append('age', document.getElementById('saleAge').value);
    form.append(
      'description',
      document.getElementById('saleDescription').value
    );
    // form.append('images', document.getElementById('saleImages').files);
    const imageInput = document.getElementById('saleImages');
    for (let i = 0; i < imageInput.files.length; i++) {
      form.append('images', imageInput.files[i]);
    }
    addHouse(form, 'sale');
  });

if (addRentHouseForm)
  addRentHouseForm.addEventListener('submit', e => {
    e.preventDefault();

    const form = new FormData();
    form.append('city', document.getElementById('rentCity').value);
    form.append(
      'buildingType',
      document.getElementById('rentBuildingType').value
    );
    form.append('rentPrice', document.getElementById('rentRentPrice').value);
    form.append('fullbid', document.getElementById('fullbid').checked);
    form.append(
      'mortgagePrice',
      document.getElementById('rentMortgagePrice').value
    );
    form.append('size', document.getElementById('rentSize').value);
    form.append('room', document.getElementById('rentRoom').value);
    form.append('address', document.getElementById('rentAddress').value);
    form.append(
      'location[coordinates][0]',
      parseFloat(document.getElementById('rentAddressLng').value)
    );
    form.append(
      'location[coordinates][1]',
      parseFloat(document.getElementById('rentAddressLat').value)
    );
    form.append('phoneNumber', document.getElementById('rentPhone').value);
    form.append('elevator', document.getElementById('rentElevator').checked);
    form.append('parking', document.getElementById('rentParking').checked);
    form.append(
      'buildingStatus',
      document.getElementById('rentBuildingStatus').checked
    );
    form.append('storeroom', document.getElementById('rentStoreroom').checked);
    form.append('floor', document.getElementById('rentFloor').value);
    form.append('age', document.getElementById('rentAge').value);
    form.append(
      'description',
      document.getElementById('rentDescription').value
    );

    const imageInput = document.getElementById('rentImages');
    for (let i = 0; i < imageInput.files.length; i++) {
      form.append('images', imageInput.files[i]);
    }

    // form.append('images', document.getElementById('rentImages').files);

    addHouse(form, 'rent');
  });

const logOutBtn = document.querySelector('.nav__el--logout');
const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
    });

    if (res.data.status === 'success') {
      showAlert('success', 'با موفقیت از حساب خود خارج شدید!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', 'خروج از حساب با مشکل رو به رو شد، بعدا امتحان کنید!');
  }
};
if (logOutBtn) logOutBtn.addEventListener('click', logout);
