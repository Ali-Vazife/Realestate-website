const multer = require('multer');
const sharp = require('sharp');
const Rent = require('./../models/rentModel');
const AppError = require('./../utils/appError');
// const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

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

exports.uploadRentImages = upload.fields([{ name: 'images', maxCount: 6 }]);

exports.resizeRentImages = catchAsync(async (req, res, next) => {
  // console.log('1:', req.files.images);
  // console.log('2:', req.files.image);

  if (!req.files.images) return next();
  // console.log('omad 2');

  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `house-forrent-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(900, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 70 })
        .toFile(`public/img/rents/${filename}`);

      req.body.images.push(filename);
    })
  );
  next();
});

exports.getAllRents = factory.getAll(Rent);
exports.getRent = factory.getOne(Rent);
exports.createRent = factory.createOne(Rent);
exports.updateRent = factory.updateOne(Rent);

exports.deleteRent = catchAsync(async (req, res, next) => {
  try {
    const { houseCode } = req.params;

    // Find the document by houseCode and select only the _id field
    const rent = await Rent.findOne({ houseCode });

    if (!rent) {
      // Handle the case where the document with the given houseCode doesn't exist
      return res
        .status(404)
        .json({ status: 'fail', message: 'Rent not found' });
    }

    // Now you have the _id of the document based on the houseCode
    const rentId = rent._id;

    // You can use rentId for further operations, such as deletion
    const deletedRent = await Rent.findByIdAndDelete(rentId);

    if (!deletedRent) {
      // Handle the case where the document couldn't be deleted
      return res
        .status(404)
        .json({ status: 'fail', message: 'Failed to delete rent' });
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
  const rent = await Rent.findById(req.params.houseCode);

  if (!rent) {
    return next(new AppError('Rent not found', 404));
  }

  if (!rent.approved && req.user.role !== 'admin') {
    return next(new AppError('This rent is not approved', 403));
  }

  next();
});

exports.getUnapprovedRents = catchAsync(async (req, res, next) => {
  const unapprovedRents = await Rent.find({ approved: false });

  if (!unapprovedRents) {
    return next(new AppError('موردی برای مشاهده ساخته نشده است.', 404));
  }

  res.status(200).json({
    status: 'success',
    unapprovedRents
  });
  // res.status(200).render('unapprovedRents', {
  //   title: 'Unapproved Rents',
  //   unapprovedRents
  // });
});

exports.updateApprovalStatus = catchAsync(async (req, res, next) => {
  const { houseCode, approvalStatus } = req.body;

  const rent = await Rent.findOne({ houseCode });

  if (!rent) {
    return next(new AppError('موردی برای مشاهده ساخته نشده است.', 404));
  }

  if (approvalStatus === 'approve') {
    rent.approved = true;
  } else if (approvalStatus === 'reject') {
    // Optionally, you can add a field to store the rejection reason
    // rent.rejectionReason = 'Your ad is rejected because...';
    rent.approved = false;
  }

  await rent.save();
  res.status(200).json({
    status: 'success',
    data: {
      rent
    }
  });
});

exports.getAllRentOnMap = catchAsync(async (req, res, next) => {
  const cityMap = 'Shiraz';

  const rents = await Rent.find({ approved: true, city: cityMap }).select(
    'location mortgagePrice rentPrice _id'
  );

  res.status(200).json({
    status: 'success',
    data: {
      rents
    }
  });
});
