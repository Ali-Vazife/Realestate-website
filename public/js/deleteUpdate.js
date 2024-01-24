const deleteHouseForm = document.querySelector('#deleteHouseForm');

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

const deleteHouse = async (houseCode, houseType) => {
  try {
    const baseUrl =
      houseType === 'sale' ? '/api/v1/for_sale' : '/api/v1/for_rent';

    const url = `${baseUrl}/${houseCode}`;

    const res = await axios({
      method: 'DELETE',
      url
    });

    console.log(res.data.status);
    if (res.data.status === undefined) {
      showAlert('success', 'Deleted successfully!');
      window.setTimeout(() => {
        location.assign('/me');
      }, 1500);
    }
  } catch (err) {
    // console.log('NOT');
    showAlert('error', err.response.data.message);
  }
};


if (deleteHouseForm) {
  deleteHouseForm.addEventListener('submit', e => {
    e.preventDefault();
    const houseCode = document.getElementById('houseCode').value;
    const houseType = document.querySelector('input[name="houseType"]:checked').value;

    deleteHouse(houseCode, houseType);
  });
}


const logOutBtn = document.querySelector('.nav__el--logout');
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
    // console.log(err.response);
    showAlert('error', 'خروج از حساب با مشکل رو به رو شد، بعدا امتحان کنید!');
  }
};
if (logOutBtn) logOutBtn.addEventListener('click', logout);
