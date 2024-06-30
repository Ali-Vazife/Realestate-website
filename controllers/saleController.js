const multer = require('multer');
const sharp = require('sharp');
const Sale = require('./../models/saleModel');
const AppError = require('./../utils/appError');
// const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage(); //keep image in the memory
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});
exports.uploadSaleImages = upload.fields([{ name: 'images', maxCount: 6 }]);
exports.resizeSaleImages = catchAsync(async (req, res, next) => {
  // console.log('1:', req.files.images);
  // console.log('2:', req.files.image);
  if (!req.files.images) return next();
  // console.log('omad 2');

  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `house-forsale-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(900, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 70 })
        .toFile(`public/img/sales/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

exports.getAllSales = factory.getAll(Sale);
exports.getSale = factory.getOne(Sale);
exports.createSale = factory.createOne(Sale);
exports.updateSale = factory.updateOne(Sale);

exports.deleteSale = catchAsync(async (req, res, next) => {
  try {
    const { houseCode } = req.params;
    // console.log('houseCode:', houseCode);

    // Find the document by houseCode and select only the _id field
    const sale = await Sale.findOne({ houseCode });

    if (!sale) {
      // Handle the case where the document with the given houseCode doesn't exist
      return res
        .status(404)
        .json({ status: 'fail', message: 'Sale not found' });
    }

    // Now you have the _id of the document based on the houseCode
    const saleId = sale._id;

    // You can use rentId for further operations, such as deletion
    const deletedSale = await Sale.findByIdAndDelete(saleId);

    if (!deletedSale) {
      // Handle the case where the document couldn't be deleted
      return res
        .status(404)
        .json({ status: 'fail', message: 'Failed to delete sale' });
    }

    // Successfully deleted the document
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    // Handle other errors
    next(error);
  }
});

exports.setApprovalStatus = (req, res, next) => {
  // Set the approved field based on user's role
  if (req.user.role === 'admin') {
    req.body.approved = true; // Automatically approve ads by admins
  } else {
    req.body.approved = false; // Mark ads by leaders as not approved by default
  }
  next();
};

exports.checkApproval = catchAsync(async (req, res, next) => {
  const sale = await Sale.findById(req.params.houseCode);

  if (!sale) {
    return next(new AppError('Sale not found', 404));
  }

  if (!sale.approved && req.user.role !== 'admin') {
    return next(new AppError('This sale is not approved', 403));
  }

  next();
});

exports.getUnapprovedSales = catchAsync(async (req, res, next) => {
  const unapprovedSales = await Sale.find({ approved: false });

  if (!unapprovedSales) {
    return next(new AppError('موردی برای مشاهده ساخته نشده است.', 404));
  }

  res.status(200).json({
    status: 'success',
    unapprovedSales
  });
});

exports.updateApprovalStatus = catchAsync(async (req, res, next) => {
  const { houseCode, approvalStatus } = req.body;

  const sale = await Sale.findOne({ houseCode });

  if (!sale) {
    return next(new AppError('موردی برای مشاهده ساخته نشده است.', 404));
  }

  if (approvalStatus === 'approve') {
    sale.approved = true;
  } else if (approvalStatus === 'reject') {
    // Optionally, you can add a field to store the rejection reason
    // rent.rejectionReason = 'Your ad is rejected because...';
    sale.approved = false;
  }

  await sale.save();
  res.status(200).json({
    status: 'success',
    data: {
      sale
    }
  });
});
exports.getAllSaleOnMap = catchAsync(async (req, res, next) => {
  const cityMap = 'Shiraz';

  const sales = await Sale.find({ approved: true, city: cityMap }).select(
    'location price _id'
  );

  res.status(200).json({
    status: 'success',
    data: {
      sales
    }
  });
});
