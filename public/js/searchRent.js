document
  .getElementById('searchForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();

    // Gather the search criteria from form inputs
    const city = document.querySelector('#city').value;
    const buildingType = document.querySelector('#building-type').value;
    const minMortgage = document.querySelector('#min-rahn-select').value;
    const maxMortgage = document.querySelector('#max-rahn-select').value;
    const minRent = document.querySelector('#min-rent-select').value;
    const maxRent = document.querySelector('#max-rent-select').value;
    const fullBid = document.getElementById('disable-rent').checked;
    const minSize = document.querySelector('#min-size-select').value;
    const maxSize = document.querySelector('#max-size-select').value;

    // let newUrl = `api/v1/for_sale?city=${city}&buildingType=${buildingType}`;
    let newUrl = `for_rent?city=${city}&buildingType=${buildingType}`;

    if (fullBid === true) {
      newUrl += `&fullBid=${fullBid}`;
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

    // Construct the new URL with query parameters

    location.href = newUrl;
    // console.log(`newUrl: ${newUrl}`);

    // Update the browser's URL without reloading the page
    // history.pushState({}, '', newUrl);

    // Make an AJAX request to your API endpoint with the criteria using axios
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
  });
document
  .getElementById('searchFormMobile')
  .addEventListener('submit', function (event) {
    event.preventDefault();
    // Gather the search criteria from form inputs
    const city = document.querySelector('#city-mobile').value;
    const buildingType = document.querySelector('#building-type-mobile').value;
    const minMortgage = document.querySelector('#min-rahn-select-mobile').value;
    const maxMortgage = document.querySelector('#max-rahn-select-mobile').value;
    const minRent = document.querySelector('#min-rent-select-mobile').value;
    const maxRent = document.querySelector('#max-rent-select-mobile').value;
    const fullBid = document.getElementById('disable-rent-mobile').checked;
    const minSize = document.querySelector('#min-size-select-mobile').value;
    const maxSize = document.querySelector('#max-size-select-mobile').value;

    let newUrl = `for_rent?city=${city}&buildingType=${buildingType}`;

    if (fullBid === true) {
      newUrl += `&fullBid=${fullBid}`;
    }

    if (minMortgage !== '0' && maxMortgage !== '0') {
      newUrl += `&mortgagePrice[gte]=${minMortgage}&mortgagePrice[lte]=${maxMortgage}`;
    } else if (minMortgage !== '0') {
      newUrl += `&mortgagePrice[gte]=${minMortgage}`;
    } else if (maxMortgage !== '0') {
      newUrl += `&mortgagePrice[lte]=${maxMortgage}`;
    }
    if (fullBid === true) {
      newUrl += `&fullBid=true`;
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

    // Construct the new URL with query parameters
    // console.log(`newUrl: ${newUrl}`);

    location.href = newUrl;
    // Update the browser's URL without reloading the page
    // history.pushState({}, '', newUrl);

    // Make an AJAX request to your API endpoint with the criteria using axios
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
  });
