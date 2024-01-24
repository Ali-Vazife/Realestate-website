const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'نام خودرا وارد کنید!']
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'lead', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'پسورد خود را وارد کنید.'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'پسورد خود را دوباره وار کنید.'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
  verifiedCode: {
    type: String,
    select: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  smsSentAt: {
    type: Date
  },
  phoneNumber: {
    type: String,
    unique: true,
    select: false
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modiffied.
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12.
  this.password = await bcrypt.hash(this.password, 12);

  // delete the passwordconfirm field.
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this point to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.createVerificationCode = function () {
  const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

  this.verifiedCode = crypto
    .createHash('sha256')
    .update(verificationCode)
    .digest('hex');

  this.smsSentAt = Date.now();
  return verificationCode;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
