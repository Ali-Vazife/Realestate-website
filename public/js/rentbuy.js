document.addEventListener('DOMContentLoaded', function () {
  // Modal
  const modalBuyButton = document.getElementById('modalBuyButton');
  const modalRentButton = document.getElementById('modalRentButton');
  // Modal

  // BID AND RENT DIV MODAL 
  const rahnRangeContainer = document.querySelector(".rahn-range-container");
  const rentRangeContainer = document.querySelector(".rent-range-container");
  const fullRahnContainer = document.querySelector(".full-rahn-container");

  const buyRangeContainer = document.querySelector(".buy-range-container");
  // BID AND RENT DIV   

  // full bid MODAL
  const disableRentCheckbox = document.getElementById('disable-rent');
  const minRentSelect = document.getElementById('min-rent-select');
  const maxRentSelect = document.getElementById('max-rent-select');
  // full bid

  // reset filter MODAL
  const resetModalButton = document.querySelector('.reset-modal');
  const selectElements = document.querySelectorAll('select');
  // reset filter 

  // Button prevent in form MODAL
  const modalForm = document.querySelector("form");
  // Button prevent in form

  // full bid MODAL
  if (disableRentCheckbox && minRentSelect && maxRentSelect) {
    disableRentCheckbox.addEventListener('change', () => {
      if (disableRentCheckbox.checked) {
        minRentSelect.value = '777';
        maxRentSelect.value = '777';
        minRentSelect.disabled = true;
        maxRentSelect.disabled = true;
      } else {
        minRentSelect.disabled = false;
        maxRentSelect.disabled = false;
        minRentSelect.value = '0';
        maxRentSelect.value = '0';
      }
    });
  }
  // full bid

  // reset filter MODAL
  if (resetModalButton && selectElements) {
    resetModalButton.addEventListener('click', () => {
      selectElements.forEach(select => {
        select.value = '0';
        if (this.getElementById('building-type')) {
          document.getElementById('building-type').value = 'apartment';
        }
        if (this.getElementById('city')) {
          document.getElementById('city').value = 'Shiraz';
        }
      });

      if (disableRentCheckbox) {
        disableRentCheckbox.checked = false;
      }

      if (minRentSelect && maxRentSelect) {
        minRentSelect.disabled = false;
        maxRentSelect.disabled = false;
        minRentSelect.value = '0';
        maxRentSelect.value = '0';
      }
    });
  }
  // reset filter 

  // Button prevent in form MODAL
  if (modalForm) {
    modalForm.addEventListener("submit", (event) => {
      event.preventDefault();
    });
  }
});

// // Modal
// const modalBuyButton = document.getElementById('modalBuyButton');
// const modalRentButton = document.getElementById('modalRentButton');
// // Modal

// // BID AND RENT DIV  MODAL
// const rahnRangeContainer = document.querySelector(".rahn-range-container");
// const rentRangeContainer = document.querySelector(".rent-range-container");
// const fullRahnContainer = document.querySelector(".full-rahn-container");

// const buyRangeContainer = document.querySelector(".buy-range-container");
// // BID AND RENT DIV

// //  full bid MODAL
// const disableRentCheckbox = document.getElementById('disable-rent');
// const minRentSelect = document.getElementById('min-rent-select');
// const maxRentSelect = document.getElementById('max-rent-select');
// //  full bid

// // reset filter MODAL
// const resetModalButton = document.querySelector('.reset-modal');
// const selectElements = document.querySelectorAll('select');
// // reset filter

// // Button prevent in form MODAL
// const modalForm = document.querySelector("form");
// // Button prevent in form

// //  full bid MODAL
// disableRentCheckbox.addEventListener('change', () => {
//   if (disableRentCheckbox.checked) {
//     minRentSelect.value = '777';
//     maxRentSelect.value = '777';
//     minRentSelect.disabled = true;
//     maxRentSelect.disabled = true;
//   } else {
//     minRentSelect.disabled = false;
//     maxRentSelect.disabled = false;
//     minRentSelect.value = '0';
//     maxRentSelect.value = '0';
//   }
// });
// //  full bid


// // reset filter MODAL
// resetModalButton.addEventListener('click', () => {
//   selectElements.forEach(select => {
//     select.value = '0';
//   });

//   disableRentCheckbox.checked = false;
//   minRentSelect.disabled = false;
//   maxRentSelect.disabled = false;
//   minRentSelect.value = '0';
//   maxRentSelect.value = '0';

// });
// // reset filter


// // Button prevent in form MODAL
// modalForm.addEventListener("submit", (event) => {
//   event.preventDefault()
// })
