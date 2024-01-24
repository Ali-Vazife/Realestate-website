// Modal
const modalBuyButton1 = document.getElementById('modalBuyButton');
const modalRentButton1 = document.getElementById('modalRentButton');
const searchForms = document.getElementById('searchFormMobile');

let btnStatus = 'rent';
let newUrl;

const filterSearch = (
  city,
  buildingType,
  minBuy,
  maxBuy,
  minSize,
  maxSize,
  minMortgage,
  maxMortgage,
  fullBid,
  minRent,
  maxRent
) => {
  if (btnStatus === 'buy') {
    newUrl = `for_sale?city=${city}&buildingType=${buildingType}`;

    if (minBuy !== '0' && maxBuy !== '0') {
      newUrl += `&price[gte]=${minBuy}&price[lte]=${maxBuy}`;
    } else if (minBuy !== '0') {
      newUrl += `&price[gte]=${minBuy}`;
    } else if (maxBuy !== '0') {
      newUrl += `&price[lte]=${maxBuy}`;
    }

    if (minSize !== '0' && maxSize !== '0') {
      newUrl += `&size[gte]=${minSize}&size[lte]=${maxSize}`;
    } else if (minSize !== '0') {
      newUrl += `&size[gte]=${minSize}`;
    } else if (maxSize !== '0') {
      newUrl += `&size[lte]=${maxSize}`;
    }
  } else if (btnStatus === 'rent') {
    newUrl = `for_rent?city=${city}&buildingType=${buildingType}`;
    if (fullBid === true) {
      newUrl += `&fullBid=true`;
    }

    if (minMortgage !== '0' && maxMortgage !== '0') {
      newUrl += `&mortgagePrice[gte]=${minMortgage}&mortgagePrice[lte]=${maxMortgage}`;
    } else if (minMortgage !== '0') {
      newUrl += `&mortgagePrice[gte]=${minMortgage}`;
    } else if (maxMortgage !== '0') {
      newUrl += `&mortgagePrice[lte]=${maxMortgage}`;
    }
    if (minRent !== '0' && maxRent !== '0') {
      if (minRent !== '' || maxRent !== '') {
        newUrl += `&rentPrice[gte]=${minRent}&rentPrice[lte]=${maxRent}`;
      }
    } else if (minRent !== '0') {
      newUrl += `&rentPrice[gte]=${minRent}`;
    } else if (maxRent !== '0') {
      newUrl += `&rentPrice[lte]=${maxRent}`;
    }

    if (minSize !== '0' && maxSize !== '0') {
      newUrl += `&size[gte]=${minSize}&size[lte]=${maxSize}`;
    } else if (minSize !== '0') {
      newUrl += `&size[gte]=${minSize}`;
    } else if (maxSize !== '0') {
      newUrl += `&size[lte]=${maxSize}`;
    }
  }
  location.href = newUrl;

  axios
    .get(newUrl)
    .then(response => {
      // Handle the API response and update the UI with the filtered data
      // console.log(response.data); // Replace with your data handling code
    })
    .catch(error => {
      // Handle errors, display an error message, or handle them as needed
      // console.error(error);
    });
};

// BID AND RENT DIV MODAL
modalBuyButton1.addEventListener('click', e => {
  e.preventDefault();

  btnStatus = 'buy';
});

modalRentButton1.addEventListener('click', e => {
  e.preventDefault();

  btnStatus = 'rent';
});

if (searchForms)
  searchForms.addEventListener('submit', e => {
    e.preventDefault();
    // Gather the search criteria from form inputs
    const city = document.querySelector('#city-mobile').value;
    const buildingType = document.querySelector('#building-type-mobile').value;
    const minBuy = document.querySelector('#min-buy-select-mobile').value;
    const maxBuy = document.querySelector('#max-buy-select-mobile').value;
    const minMortgage = document.querySelector('#min-rahn-select-mobile').value;
    const maxMortgage = document.querySelector('#max-rahn-select-mobile').value;
    const fullBid = document.getElementById('disable-rent').checked;
    const minRent = document.querySelector('#min-rent-select-mobile').value;
    const maxRent = document.querySelector('#max-rent-select-mobile').value;
    const minSize = document.querySelector('#min-size-select-mobile').value;
    const maxSize = document.querySelector('#max-size-select-mobile').value;

    filterSearch(
      city,
      buildingType,
      minBuy,
      maxBuy,
      minSize,
      maxSize,
      minMortgage,
      maxMortgage,
      fullBid,
      minRent,
      maxRent
    );
  });
