const express = require('express');
const Rent = require('./../models/rentModel');
const AppError = require('./../utils/appError');
const rentController = require('./../controllers/rentController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(rentController.getAllRents)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead'),
    rentController.uploadRentImages,
    rentController.resizeRentImages,
    rentController.setApprovalStatus,
    rentController.createRent
  );

router.get('/map/:city', rentController.getAllRentOnMap);

router.get('/:id', rentController.getRent);
router
  .route('/:houseCode')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    rentController.uploadRentImages,
    rentController.resizeRentImages,
    rentController.checkApproval,
    rentController.updateRent
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    rentController.deleteRent
  );

router.get(
  '/admin/unapproved',
  authController.protect,
  authController.restrictTo('admin'),
  rentController.getUnapprovedRents
);


router.post(
  '/admin/approve-reject',
  authController.protect,
  authController.restrictTo('admin'),
  rentController.updateApprovalStatus
);

module.exports = router;
