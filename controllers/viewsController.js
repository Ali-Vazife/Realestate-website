const jalaliMoment = require('jalali-moment');
// const Tour = require('../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const Rent = require('./../models/rentModel');
const Sale = require('./../models/saleModel');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.getLastOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const rents = await Rent.find({ approved: true })
    .sort({ createdAt: -1 })
    .limit(4);
  const sales = await Sale.find({ approved: true })
    .sort({ createdAt: -1 })
    .limit(4);
  // 2) build template

  // 3) Render that template using tour data from 1 )
  res.status(200).render('overview', {
    title: 'Kapar Realstate',
    rents,
    sales
  });
});

exports.getRentsOverview = catchAsync(async (req, res, next) => {
  // Define the base query to find approved rents
  const baseQuery = { approved: true };

  const filter = req.params.rentsId ? { tour: req.params.rentsId } : {};

  // // Extract the fullBid boolean (true or false)
  const fullBid = req.query.fullBid === 'true'; // Automatically treated as a boolean

  // Merge the base query with the filter
  const query = { ...baseQuery, ...filter };

  // console.log(req.query);
  // const features = new APIFeatures(Rent.find(filter), req.query)
  const features = new APIFeatures(Rent.find(query), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // Modify the query based on the fullBid parameter
  if (fullBid) {
    features.query.where('fullBid').equals(true);
  }

  // Await the query result and store it in the 'rents' variable
  const rents = await features.query;
  // // 2) build template
  const persianDate = jalaliMoment(rents.createdAt)
    .locale('fa')
    .format('YYYY MMMM');

  // // 3) Render that template using tour data from 1 )
  res.status(200).render('forRent', {
    title: 'آگهی های اجاره ملک',
    rents,
    persianDate
  });
});

exports.getSalesOverview = catchAsync(async (req, res, next) => {
  const baseQuery = { approved: true };

  const filter = req.params.rentsId ? { tour: req.params.rentsId } : {};

  const query = { ...baseQuery, ...filter };

  // console.log(req.query);
  const features = new APIFeatures(Sale.find(query), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const sales = await features.query;

  const persianDate = jalaliMoment(sales.createdAt)
    .locale('fa')
    .format('YYYY MMMM');
  // 3) Render that template using tour data from 1 )
  res.status(200).render('forSale', {
    title: 'آگهی های خرید ملک',
    sales,
    persianDate
  });
});

exports.getRent = catchAsync(async (req, res, next) => {
  const rentId = req.params.id;
  const rent = await Rent.findById(rentId);

  if (!rent) {
    return next(new AppError('There is no rent with that name.', 404));
  }
  const rentImageLength = rent.images.length;
  // 2) Build template
  // 3) Render template using data from 1)

  res.status(200).render('rentInfo', {
    // title: `${rents.name} Tour`,
    title: 'جزییات ملک',
    rent,
    rentImageLength
  });
});
exports.getSale = catchAsync(async (req, res, next) => {
  const saleId = req.params.id;
  // 1) Get the data for the requested sale
  const sale = await Sale.findById(saleId);

  if (!sale) {
    return next(new AppError('There is no sale with that ID.', 404));
  }
  const saleImageLength = sale.images.length;

  // 2) Render the template using the sale data
  res.status(200).render('saleInfo', {
    title: 'جزییات ملک',
    sale,
    saleImageLength
  });
});

exports.login = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'ورود به حساب'
  });
});
exports.signup = catchAsync(async (req, res) => {
  res.status(200).render('signup', {
    title: 'ساخت حساب کاربری'
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'حساب کاربری شما'
  });
};
exports.addNewHouse = (req, res) => {
  res.status(200).render('addHouse', {
    title: 'افزودن ملک'
  });
};
exports.contact = (req, res) => {
  res.status(200).render('contactUs', {
    title: 'تماس با ما'
  });
};
exports.map = catchAsync(async (req, res, next) => {
  res.status(200).render('map', {
    title: 'نقشه املاک'
    // rents,
    // sales
  });
});

exports.deleteUpdateHouse = (req, res) => {
  res.status(200).render('deleteUpdateHouse', {
    title: 'حذف ملک'
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name
      // email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );
  res.status(200).render('account', {
    title: 'اطلاعات حساب',
    user: updatedUser
  });
});

exports.getUnapprovedRents = catchAsync(async (req, res, next) => {
  const unapprovedRents = await Rent.find({ approved: false });
  const unapprovedSales = await Sale.find({ approved: false });
  res.status(200).render('unapprovedRents', {
    title: 'Unapproved Rents',
    unapprovedRents,
    unapprovedSales
  });
});
