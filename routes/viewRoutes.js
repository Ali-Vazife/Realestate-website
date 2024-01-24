const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getLastOverview);
router.get(
  '/for_rent',
  authController.isLoggedIn,
  viewsController.getRentsOverview
);
router.get(
  '/for_sale',
  authController.isLoggedIn,
  viewsController.getSalesOverview
);
router.get('/map/:city', authController.isLoggedIn, viewsController.map);
router.get('/contact', authController.isLoggedIn, viewsController.contact);

router.get('/for_rent/:id', authController.isLoggedIn, viewsController.getRent);
router.get('/for_sale/:id', authController.isLoggedIn, viewsController.getSale);
router.get('/login', authController.isLoggedIn, viewsController.login);
router.get('/signup', authController.isLoggedIn, viewsController.signup);
router.get('/me', authController.protect, viewsController.getAccount);
router.get(
  '/me/new_house',
  authController.protect,
  viewsController.addNewHouse
);
router.get(
  '/me/delete_update_house',
  authController.protect,
  viewsController.deleteUpdateHouse
);
router.get(
  '/admin/unapproved',
  authController.protect, // Ensure the user is logged in
  authController.restrictTo('admin'), // Restrict access to admins only
  viewsController.getUnapprovedRents // Define the controller for viewing unapproved ads
);

module.exports = router;
