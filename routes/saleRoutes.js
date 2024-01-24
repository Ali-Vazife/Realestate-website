const express = require('express');
const saleController = require('./../controllers/saleController');
const authController = require('./../controllers/authController');
const Sale = require('./../models/saleModel');
const AppError = require('./../utils/appError');

// const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

router
  .route('/')
  .get(saleController.getAllSales)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead'),
    saleController.uploadSaleImages,
    saleController.resizeSaleImages,
    saleController.setApprovalStatus,
    saleController.createSale
  );

router.get('/:id', saleController.getSale);

router
  .route('/:houseCode')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    saleController.uploadSaleImages,
    saleController.resizeSaleImages,
    saleController.checkApproval,
    saleController.updateSale
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    saleController.deleteSale
  );

router.get(
  '/admin/unapproved',
  authController.protect,
  authController.restrictTo('admin'),
  saleController.getUnapprovedSales
);

router.get('/map/:city', saleController.getAllSaleOnMap);

router.post(
  '/admin/approve-reject',
  authController.protect,
  authController.restrictTo('admin'),
  saleController.updateApprovalStatus
);

module.exports = router;
