// // type is 'success' or 'error'
const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// // type is 'success' or 'error'
const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};

// // Add a click event listener to the Submit buttons
// document.querySelectorAll('.submit-button').forEach(button => {
//   button.addEventListener('click', async () => {
//     const houseCode = +button.getAttribute('data-house-code');
//     const approvalStatus = document.querySelector(
//       `#approve-reject-form-${houseCode} select[name="approvalStatus"]`
//     ).value;

//     try {
//       if (approvalStatus === 'approve') {
//         const res = await axios.post('/api/v1/for_rent/admin/approve-reject', {
//           houseCode,
//           approvalStatus
//         });

//         if (res.data.status === 'success') {
//           // Handle success (e.g., show a success message)
//           showAlert('success', 'Approval status updated successfully.');
//           window.setTimeout(() => {
//             location.assign('/admin/unapproved');
//           }, 1500);

//           // Optionally, you can reload or update the UI to reflect the change
//         }
//       } else if (approvalStatus === 'reject') {
//         const deleteRes = await axios.delete(`/api/v1/for_rent/${houseCode}`); // Adjust the endpoint as needed

//         if (deleteRes.data.status === undefined) {
//           // Handle success (e.g., show a success message)
//           showAlert('success', 'Ad rejected and deleted successfully.');
//           window.setTimeout(() => {
//             location.assign('/admin/unapproved');
//           }, 1500);
//           // Optionally, you can reload or update the UI to reflect the deletion
//         }
//       }
//     } catch (err) {
//       // Handle errors (e.g., show an error message)
//       showAlert('error', err.response.data.message);
//     }
//   });
// });

document.addEventListener('DOMContentLoaded', function () {
  const approveButtons = document.querySelectorAll('.approve-button');
  const rejectButtons = document.querySelectorAll('.reject-button');

  approveButtons.forEach(button => {
    button.addEventListener('click', async function () {
      const houseCode = this.getAttribute('data-house-code');

      try {
        const res = await axios.post('/api/v1/for_rent/admin/approve-reject', {
          houseCode,
          approvalStatus: 'approve'
        });

        if (res.data.status === 'success') {
          // Handle success (e.g., show a success message)
          showAlert('success', 'آگهی با موفقیت تایید شد!');
          window.setTimeout(() => {
            location.assign('/admin/unapproved');
          }, 1500);

          // Optionally, you can reload or update the UI to reflect the change
        }
      } catch (err) {
        // Handle errors (e.g., show an error message)
        showAlert('error', err.response.data.message);
      }
    });
  });

  rejectButtons.forEach(button => {
    button.addEventListener('click', async function () {
      const houseCode = this.getAttribute('data-house-code');

      try {
        const deleteRes = await axios.delete(`/api/v1/for_rent/${houseCode}`); // Adjust the endpoint as needed

        if (deleteRes.data.status === undefined) {
          // Handle success (e.g., show a success message)
          showAlert('success', 'آگهی تایید نشد و حذف شد!');
          window.setTimeout(() => {
            location.assign('/admin/unapproved');
          }, 1500);
          // Optionally, you can reload or update the UI to reflect the deletion
        }
      } catch (err) {
        // Handle errors (e.g., show an error message)
        showAlert('error', err.response.data.message);
      }
    });
  });
});
document.addEventListener('DOMContentLoaded', function () {
  const approveButtons = document.querySelectorAll('.approve-sale-button');
  const rejectButtons = document.querySelectorAll('.reject-sale-button');

  approveButtons.forEach(button => {
    button.addEventListener('click', async function () {
      const houseCode = this.getAttribute('data-house-code');

      try {
        const res = await axios.post('/api/v1/for_sale/admin/approve-reject', {
          houseCode,
          approvalStatus: 'approve'
        });

        if (res.data.status === 'success') {
          // Handle success (e.g., show a success message)
          showAlert('success', 'آگهی با موفقیت تایید شد!');
          window.setTimeout(() => {
            location.assign('/admin/unapproved');
          }, 1500);

          // Optionally, you can reload or update the UI to reflect the change
        }
      } catch (err) {
        // Handle errors (e.g., show an error message)
        showAlert('error', err.response.data.message);
      }
    });
  });

  rejectButtons.forEach(button => {
    button.addEventListener('click', async function () {
      const houseCode = this.getAttribute('data-house-code');

      try {
        const deleteRes = await axios.delete(`/api/v1/for_sale/${houseCode}`); // Adjust the endpoint as needed

        if (deleteRes.data.status === undefined) {
          // Handle success (e.g., show a success message)
          showAlert('success', 'آگهی تایید نشد و حذف شد!');
          window.setTimeout(() => {
            location.assign('/admin/unapproved');
          }, 1500);
          // Optionally, you can reload or update the UI to reflect the deletion
        }
      } catch (err) {
        // Handle errors (e.g., show an error message)
        showAlert('error', err.response.data.message);
      }
    });
  });
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
