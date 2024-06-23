document
  .getElementById('searchForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();

    // Gather the search criteria from form inputs
    const city = document.querySelector('#city').value;
    const buildingType = document.querySelector('#building-type').value;
    const minBuy = document.querySelector('#min-buy-select').value;
    const maxBuy = document.querySelector('#max-buy-select').value;
    const minSize = document.querySelector('#min-size-select').value;
    const maxSize = document.querySelector('#max-size-select').value;

    // let newUrl = `api/v1/for_sale?city=${city}&buildingType=${buildingType}`;
    let newUrl = `for_sale?city=${city}&buildingType=${buildingType}`;

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
    // console.log(`minBuy: ${minBuy}, maxBuy: ${maxBuy}`);

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
    const minBuy = document.querySelector('#min-buy-select-mobile').value;
    const maxBuy = document.querySelector('#max-buy-select-mobile').value;
    const minSize = document.querySelector('#min-size-select-mobile').value;
    const maxSize = document.querySelector('#max-size-select-mobile').value;
    // console.log(`minBuy: ${minBuy}, maxBuy: ${maxBuy}`);

    let newUrl = `/api/v1/for_sale?city=${city}&buildingType=${buildingType}`;
    // let newUrl = `for_sale?city=${city}&buildingType=${buildingType}`;

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
