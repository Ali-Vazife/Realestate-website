const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { Smsir } = require('smsir-js');
const axios = require('axios');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });

  // Remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, phoneNumber, password, passwordConfirm } = req.body;

  const normalizedPhoneNumber = phoneNumber.startsWith('98')
    ? `0${phoneNumber.slice(2)}`
    : phoneNumber;

  const isValidPhoneNumber = validator.isMobilePhone(
    normalizedPhoneNumber,
    'fa-IR'
  );
  if (!isValidPhoneNumber) {
    return next(new AppError('شماره وارد شده اشتباه است!', 400));
  }
  const existingUser = await User.findOne({
    phoneNumber: normalizedPhoneNumber
  });

  // console.log(existingUser);

  if (existingUser) {
    return next(new AppError('این شماره قبلا ثبت نام شده است.', 400));
  }

  const newUser = await User.create({
    name,
    phoneNumber: normalizedPhoneNumber,
    password,
    passwordConfirm
  });

  createSendToken(newUser, 201, req, res);
});

exports.sendSMS = catchAsync(async (req, res, next) => {
  const loggedUser = res.locals.user;
  const currentUser = loggedUser._id;

  const user = await User.findById(currentUser).select(
    '+phoneNumber +verifiedCode'
  );

  if (!user) {
    // Check if the user is authenticated before applying the rate limit
    return next(new AppError('You must be logged in to send SMS.', 401));
  }

  const userPhoneNum = user.phoneNumber;
  const userSMSSentAt = user.smsSentAt;

  const minWaitTime = 1 * 60 * 1000;

  if (userSMSSentAt) {
    const currentTime = new Date();
    const timeDifference = currentTime - userSMSSentAt;

    if (timeDifference < minWaitTime) {
      // const remainingTime = minWaitTime - timeDifference;
      return next(
        new AppError(
          'Too many requests. Please wait 3 minutes before trying again.',
          429
        )
      );
    }
  }
  const verificationCode = user.createVerificationCode();
  try {
    const smsir = new Smsir(process.env.API_KEY, process.env.PHONE_NUMBER);

    const data = JSON.stringify({
      "mobile": userPhoneNum,
      "templateId": process.env.TEMPLATE_ID,
      parameters: [{ name: 'code', value: verificationCode }]
    });

    const config = {
      method: 'post',
      url: 'url',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain',
        'x-api-key': process.env.API_KEY
      },
      data: data
    };

    await axios(config);

    // user.verifiedCode = verificationCode;
    user.smsSentAt = new Date();
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: "Verification code sent to the user's phone."
    });
  } catch (err) {
    user.smsSentAt = undefined;
    user.verifiedCode = undefined;
    await user.save({ validateBeforeSave: false });
  }
});

exports.verify = catchAsync(async (req, res, next) => {
  const { code } = req.body;

  const hashedToken = crypto
    .createHash('sha256')
    .update(code)
    .digest('hex');

  const user = await User.findOne({
    verifiedCode: hashedToken
  });

  if (!user) {
    return next(new AppError(' کد وارد شده اشتباه است.', 404));
  }

  // Calculate the time difference in milliseconds
  const currentTime = new Date();
  const timeDifference = currentTime - user.smsSentAt;

  if (timeDifference >= 3 * 60 * 1000) {
    return next(new AppError('کد منقضی شده است.', 401));
  }

  // If the code matches and the time window is valid, set the verified flag to true
  user.role = 'lead';
  user.verified = true;
  user.verifiedCode = undefined;
  user.smsSentAt = undefined;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: 'success',
    message: 'Verification successful!'
  });

});

exports.login = catchAsync(async (req, res, next) => {
  const { phoneNumber, password } = req.body;

  // 1) Check if email and password exist
  if (!phoneNumber || !password) {
    return next(new AppError('Please provide phonenumber and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ phoneNumber }).select(
    '+phoneNumber +password'
  );

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect phonenumber or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, req, res);
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 3) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.logout = (user, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ phoneNumber: req.body.phoneNumber });
  if (!user) {
    return next(new AppError('There is no user with phoneNumber.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;


  try {
    // await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res);
});
