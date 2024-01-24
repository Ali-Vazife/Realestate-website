/* eslint-disable */
// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

const recieveCode = document.querySelector('.recieveCode');
const resendCode = document.querySelector('.resendCode');
const submitCode = document.querySelector('.submitCode');
const submitCodeForm = document.querySelector('.form-verifying-user');
let codeReceived = false;



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

// type is either 'password' or 'data'
const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};


const login = async (phoneNumber, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        phoneNumber,
        password
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'با موفقیت وارد حساب خود شدید!');
      window.setTimeout(() => {
        location.assign('/me');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
    });
    // if ((res.data.status = 'success')) location.reload(true);
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

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const phoneNumber = document.getElementById('phoneNumber').value;
    const password = document.getElementById('password').value;
    login(phoneNumber, password);
  });

const showSubmitCodeButton = () => {
  document.querySelector('.recieveCode').style.display = 'none';
  document.querySelector('.submitCode').style.display = 'block';
  document.querySelector('.resendCode').style.display = 'block';
};

const sendRecieveCode = async () => {
  try {
    const response = await fetch('/api/v1/users/sms', {
      method: 'POST',
    });

    if (response.status === 200) {
      codeReceived = true;
      showSubmitCodeButton();

      showAlert('success', 'با موفقیت از ارسال شد!');
    }
    else if (response.status === 429) {
      showAlert('error', 'برای ارسال مجدد کد باید 3 دقیقه صبر کنید');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};


const submitVerificationCode = async () => {

  const code = document.getElementById('code-input').value;

  if (codeReceived) {
    if (code.trim() === '') {
      showAlert('error', 'کد تایید ارسال شده را وارد کنید.');
      return;
    }
    try {
      const response = await axios.post('/api/v1/users/verify', {
        code: code
      });

      if (response.status === 200) {
        showAlert('success', 'با موفقیت انجام شد!');
        window.location.reload();
      }

    } catch (err) {
      // if (err.response && err.response.status === 401) {
      //   showAlert('error', 'کد وارد شده اشتباه است. لطفاً دوباره تلاش کنید.');
      // } else {
      // showAlert('error', 'مشکلی ایجاد شده است. لطفاً دوباره تلاش کنید.');
      // }
      showAlert('error', err.response.data.message);
    }
  } else {
    showAlert('error', 'لطفاً ابتدا روی دریافت کد بزنید.');
  }
};

if (recieveCode)
  recieveCode.addEventListener('click', () => {
    sendRecieveCode();
  });

if (resendCode)
  resendCode.addEventListener('click', () => {
    sendRecieveCode();
  });

if (submitCodeForm)
  submitCodeForm.addEventListener('submit', e => {
    e.preventDefault()
    submitVerificationCode();
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    // form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    // console.log(form);

    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });



// Rent&Sale btns HOMEPAGE
const buyButton = document.getElementById('buyButton');
const rentButton = document.getElementById('rentButton');
const rentElements = document.querySelectorAll('.search-info-text.rent-info');
const priceElement = document.querySelector('.search-info-text.price-info');
// Rent&Sale btns

// Modal
const modalBuyButton = document.getElementById('modalBuyButton');
const modalRentButton = document.getElementById('modalRentButton');
// Modal

// BID AND RENT DIV  MODAL 
const rahnRangeContainer = document.querySelector(".rahn-range-container");
const rentRangeContainer = document.querySelector(".rent-range-container");
const fullRahnContainer = document.querySelector(".full-rahn-container");

const buyRangeContainer = document.querySelector(".buy-range-container");
// BID AND RENT DIV   

//  full bid MODAL
const disableRentCheckbox = document.getElementById('disable-rent');
const minRentSelect = document.getElementById('min-rent-select-mobile');
const maxRentSelect = document.getElementById('max-rent-select-mobile');
//  full bid

// reset filter MODAL
const resetModalButton = document.querySelector('.reset-modal');
const searchAllBtn = document.querySelector('.search-button');
const selectElements = document.querySelectorAll('select');
// reset filter 
let homeBRBtn = 'rent'
// Button prevent in form MODAL


//---------- rest of code ----------

// Rent&Sale btns HOMEPAGE
if (buyButton) {
  buyButton.addEventListener('click', () => {
    rentElements.forEach(element => element.style.display = 'none');
    priceElement.style.display = 'block';
    homeBRBtn = 'buy'
    buyButton.style.backgroundColor = 'rgb(8, 194, 60)';
    buyButton.style.color = '#fff';
    rentButton.style.backgroundColor = '#fff';
    rentButton.style.color = '#a9a8a8';
  });
}

if (rentButton) {
  rentButton.addEventListener('click', () => {
    rentElements.forEach(element => element.style.display = 'block');
    priceElement.style.display = 'none';
    homeBRBtn = 'rent'
    rentButton.style.backgroundColor = 'rgb(8, 194, 60)';
    rentButton.style.color = '#fff';
    buyButton.style.backgroundColor = '#fff';
    buyButton.style.color = '#a9a8a8';
  });
}
// Rent&Sale btns

// Search All
if (searchAllBtn) {
  searchAllBtn.addEventListener('click', () => {
    if (homeBRBtn === 'rent') {
      location.href = 'for_rent'
    } else {
      location.href = 'for_sale'
    }
  })
}

// BID AND RENT DIV MODAL
if (modalBuyButton) {
  modalBuyButton.addEventListener('click', () => {
    modalBuyButton.style.backgroundColor = 'rgb(8, 194, 60)';
    modalBuyButton.style.color = '#fff';
    modalBuyButton.style.border = 'none';
    modalRentButton.style.backgroundColor = '#fff';
    modalRentButton.style.color = '#929090';
    modalRentButton.style.border = '1px solid #cecbcb';

    rahnRangeContainer.style.display = "none";
    rentRangeContainer.style.display = "none";
    fullRahnContainer.style.display = "none";
    buyRangeContainer.style.display = "block";

  });
}

if (modalRentButton) {
  modalRentButton.addEventListener('click', () => {
    modalRentButton.style.backgroundColor = 'rgb(8, 194, 60)';
    modalRentButton.style.color = '#fff';
    modalRentButton.style.border = 'none';
    modalBuyButton.style.backgroundColor = '#fff';
    modalBuyButton.style.color = '#929090';
    modalBuyButton.style.border = '1px solid #cecbcb';

    rahnRangeContainer.style.display = "block";
    rentRangeContainer.style.display = "block";
    fullRahnContainer.style.display = "block";
    buyRangeContainer.style.display = "none";

  });
}


//  full bid MODAL
if (disableRentCheckbox) {
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


// reset filter MODAL
if (resetModalButton) {
  resetModalButton.addEventListener('click', () => {
    selectElements.forEach(select => {
      select.value = '0';
    });
    disableRentCheckbox.checked = false;
    minRentSelect.disabled = false;
    maxRentSelect.disabled = false;
    minRentSelect.value = '0';
    maxRentSelect.value = '0';
  });
}