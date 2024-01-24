const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema(
  {
    houseCode: {
      type: Number,
      unique: true,
      min: 10000, // Minimum 5-digit number
      max: 99999 // Maximum 5-digit number
    },
    city: {
      type: String,
      required: [true, 'شهر رو انتخاب کنید.'],
      enum: {
        values: ['Shiraz'],
        message: 'در حال حاضر شهر شیراز در دسترس است.'
      }
    },
    buildingType: {
      type: String,
      required: [
        true,
        'apartment',
        'edari',
        'tejari',
        'villa',
        'zeraei',
        'other'
      ]
    },
    price: {
      type: Number,
      required: [true, 'مقدار قیمت مورد نظر را وارد کنید.'],
      trim: true
    },
    size: {
      type: Number,
      trim: true
    },
    room: Number,
    address: {
      type: String,
      trim: true,
      required: [true, 'آدرس ملک را وارد کنید']
    },
    elevator: {
      type: Boolean,
      default: false
    },
    parking: {
      type: Boolean,
      default: false
    },
    buildingStatus: {
      type: Boolean,
      default: false
    },
    floor: {
      type: Number,
      required: [true, 'طبقه را مشخص کنید.']
    },
    storeroom: {
      type: Boolean,
      default: false
    },
    age: Number,
    description: {
      type: String,
      maxlength: [270, 'اکثر تعداد کاراکتر وارد شده 270 است..']
    },
    images: {
      type: [String],
      default: 'default.png'
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    phoneNumber: {
      type: Number,
      required: true,
      select: false
    },
    approved: {
      type: Boolean,
      default: false // By default, ads are not approved
    },
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number]
    },
    author: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

saleSchema.index({ location: '2dsphere' });

function generateRandom5DigitNumber() {
  const min = 10000; // Minimum 5-digit number (inclusive)
  const max = 99999; // Maximum 5-digit number (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a unique 5-digit number code for each house before saving
saleSchema.pre('save', async function (next) {
  const generateHouseCode = async () => {
    const existingCodes = await mongoose.model('Sale').find({}, 'houseCode');
    const codes = existingCodes.map(item => item.houseCode);
    let newCode;
    do {
      newCode = generateRandom5DigitNumber();
    } while (codes.includes(newCode));
    return newCode;
  };

  if (!this.houseCode) {
    this.houseCode = await generateHouseCode();
  }

  next();
});
saleSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'author',
    select: 'name photo role'
  });
  next();
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
