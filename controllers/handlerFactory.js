const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document find with that ID.', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    req.body.author = req.user._id; // Assuming req.user._id is the correct field
    // console.log('req.body.author:', req.body.author); // Check this value
    const doc = await Model.create({
      ...req.body,
      author: req.body.author // Explicitly set the author field
    });
    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const docId = req.params.id;
    const doc = await Model.findById(docId);

    if (!doc) {
      return next(new AppError('There is no document with that ID.', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // To allow for nested Get reviews on tour (hack)
    let filter = {};
    let reqQuery = req.query;
    if (req.params.rentsId) filter = { tour: req.params.rentsId };

    if (reqQuery.city) {
      const baseQuery = { approved: true };
      reqQuery = { ...baseQuery, ...reqQuery };
    }

    const features = new APIFeatures(Model.find(filter), reqQuery)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc
      }
    });
  });
