const searchSubmit = document.querySelector('.submit-modal-search')
const searchMobileSubmit = document.querySelector('.submit-mobile-modal-search')
const searchMobileForm = document.getElementById('searchFormMobile')
const resetModal = document.querySelector('.reset-modal')

function updateHouseAds(sales) {
  const container = document.querySelector('.container-fluid.row.row-cols-1.row-cols-md-2.card-buy-main');
  container.innerHTML = '';

  sales.forEach(sale => {
    const saleElement = document.createElement('div');
    saleElement.className = 'col';
    saleElement.innerHTML = `
          <div class="card">
              <div class="card-horizontal">
                  <div class="img-square-wrapper">
                      <img src="/img/sales/${sale.images[0]}" alt="${sale.buildingType}">
                  </div>
                  <div class="card-body card-buy-body">
                      <ul class="card-buy-ul">
                          <li class="mb-1 fs-4">
                              <svg class="buy-card-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                  <path d="M321.94 98L158.82 237.78a24 24 0 000 36.44L321.94 414c15.57 13.34 39.62 2.28 39.62-18.22v-279.6c0-20.5-24.05-31.56-39.62-18.18z"></path>
                              </svg>
                              <span>${getBuildingTypeText(sale.buildingType)}</span>
                          </li>
                          <li class="fs-5">
                              <svg class="buy-card-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                  <path d="M256 48c-79.5 0-144 61.39-144 137 0 87 96 224.87 131.25 272.49a15.77 15.77 0 0025.5 0C304 409.89 400 272.07 400 185c0-75.61-64.5-137-144-137z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path>
                                  <circle cx="256" cy="192" r="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></circle>
                              </svg>
                              <span class="card-text-span">آدرس: ${sale.address}</span>
                          </li>
                          <li class="fs-5">
                              <svg class="buy-card-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                  <path d="M344 280l88-88M232 216l64 64M80 320l104-104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path>
                                  <circle cx="456" cy="168" r="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></circle>
                                  <circle cx="320" cy="304" r="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></circle>
                                  <circle cx="208" cy="192" r="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></circle>
                                  <circle cx="56" cy="344" r="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></circle>
                              </svg>
                              <span class="card-text-span">${sale.size} مترمربع</span>
                          </li>
                          <li class="fs-5">
                              <svg class="buy-card-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                  <path d="M384 240H96V136a40.12 40.12 0 0140-40h240a40.12 40.12 0 0140 40v104zM48 416V304a64.19 64.19 0 0164-64h288a64.19 64.19 0 0164 64v112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path>
                                  <path d="M48 416v-8a24.07 24.07 0 0124-24h368a24.07 24.07 0 0124 24v8M112 240v-16a32.09 32.09 0 0132-32h80a32.09 32.09 0 0132 32v16M256 240v-16a32.09 32.09 0 0132-32h80a32.09 32.09 0 0132 32v16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path>
                              </svg>
                              <span class="card-text-span">${sale.room} خواب</span>
                          </li>
                          <li class="fs-5">
                              <svg class="buy-card-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                  <rect x="48" y="96" width="416" height="320" rx="56" ry="56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></rect>
                                  <path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="60" d="M48 192h416M128 300h48v20h-48z"></path>
                              </svg>
                              <span class="card-text-span">قیمت:
                                  ${sale.price >= 1000 ? `${(sale.price / 1000).toFixed(3).replace(/\.0+$/, '')} میلیارد` : `${sale.price} میلیون`}
                              </span>
                          </li>
                      </ul>
                      <a class="btn btn-success view-card-link" href="/for_sale/${sale.id}">دیدن جزییات</a>
                  </div>
              </div>
              <div class="card-footer">
                  <small class="text-muted">${getPersianDate(sale.date)}</small>
              </div>
          </div>
      `;
    container.appendChild(saleElement);
  });
}

function getBuildingTypeText(buildingType) {
  switch (buildingType) {
    case 'all':
      return 'نوع: همه';
    case 'apartment':
      return 'نوع: آپارتمان';
    case 'edari':
      return 'نوع: اداری';
    case 'tejari':
      return 'نوع: تجاری';
    case 'villa':
      return 'نوع: ویلایی';
    case 'zeraei':
      return 'نوع: زراعی';
    case 'other':
      return 'نوع: غیره';
    default:
      return '';
  }
}

function getPersianDate(date) {
  const persianDate = new Date(date); // Convert to Persian date here if needed
  return persianDate.toLocaleDateString('fa-IR'); // Example for converting to Persian date
}

function resetForm() {
  document.querySelector('#city').value = 'Shiraz';
  document.querySelector('#building-type').value = 'default';
  document.querySelector('#min-buy-select').value = 'default';
  document.querySelector('#max-buy-select').value = 'default';
  document.querySelector('#min-size-select').value = 'default';
  document.querySelector('#max-size-select').value = 'default';
  document.querySelector('#city-mobile').value = 'Shiraz';
  document.querySelector('#building-type-mobile').value = 'default';
  document.querySelector('#min-buy-select-mobile').value = 'default';
  document.querySelector('#max-buy-select-mobile').value = 'default';
  document.querySelector('#min-size-select-mobile').value = 'default';
  document.querySelector('#max-size-select-mobile').value = 'default';
}

function removeFilter() {
  const newUrl = '/api/v1/for_sale';

  axios
    .get(newUrl)
    .then(res => {
      const rents = res.data.data.data;
      console.log('response:', res.data.data.data);

      updateHouseAds(rents);
      resetForm()
    })
    .catch(error => {
      console.error(error);
    });
}

resetModal.addEventListener('click', () => {
  removeFilter();
})

function setQueryParameters(city,
  buildingType,
  minBuy,
  maxBuy,
  minSize,
  maxSize) {
  const params = new URLSearchParams();
  if (city !== 'default') params.append('city', city);
  if (buildingType !== 'default') params.append('buildingType', buildingType);
  if (minBuy !== 'default') params.append('price[gte]', minBuy);
  if (maxBuy !== 'default') params.append('price[lte]', maxBuy);
  if (minSize !== 'default') params.append('size[gte]', minSize);
  if (maxSize !== 'default') params.append('size[lte]', maxSize);

  const queryStr = params.toString();
  return queryStr
}

searchSubmit.addEventListener('click', function (event) {
  event.preventDefault();

  const city = document.querySelector('#city').value;
  const buildingType = document.querySelector('#building-type').value;
  const minBuy = document.querySelector('#min-buy-select').value;
  const maxBuy = document.querySelector('#max-buy-select').value;
  const minSize = document.querySelector('#min-size-select').value;
  const maxSize = document.querySelector('#max-size-select').value;

  const queryStr = setQueryParameters(city,
    buildingType,
    minBuy,
    maxBuy,
    minSize,
    maxSize);
  // console.log(queryStr);
  const newUrl = `/api/v1/for_sale?${queryStr}`;

  axios.get(newUrl)
    .then(response => {
      const sales = response.data.data.data;

      updateHouseAds(sales);
    })
    .catch(error => {
      console.error(error);
    });
});

searchMobileForm.addEventListener('click', function (event) {
  event.preventDefault();

  const city = document.querySelector('#city-mobile').value;
  const buildingType = document.querySelector('#building-type-mobile').value;
  const minBuy = document.querySelector('#min-buy-select-mobile').value;
  const maxBuy = document.querySelector('#max-buy-select-mobile').value;
  const minSize = document.querySelector('#min-size-select-mobile').value;
  const maxSize = document.querySelector('#max-size-select-mobile').value;

  const queryStr = setQueryParameters(city,
    buildingType,
    minBuy,
    maxBuy,
    minSize,
    maxSize);
  console.log(queryStr);
  const newUrl = `/api/v1/for_sale?${queryStr}`;

  axios.get(newUrl)
    .then(response => {
      const sales = response.data.data.data;

      updateHouseAds(sales);
    })
    .catch(error => {
      console.error(error);
    });
});