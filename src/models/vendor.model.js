const mongoose = require('mongoose');
const { vendorTypes } = require('../config/vendorTypes');

const VendorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [vendorTypes.RESTAURANT, vendorTypes.FAST_FOOD, vendorTypes.HOMEMADE, vendorTypes.GROCERY],
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      minlength: 11,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    open_time: {
      type: String,
      required: true,
    },
    close_time: {
      type: String,
      required: true,
    },
    is_online: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: false,
    },
    commission: {
      type: mongoose.Types.Decimal128,
      default: 0.2,
    },
  },
  {
    timestamps: true,
  }
);

VendorSchema.statics.isEmailTaken = async function (email, excludeVendorId) {
  const vendor = await this.findOne({ email, _id: { $ne: excludeVendorId } });
  return !!vendor;
};

VendorSchema.statics.isMobileExist = async function (mobile, excludeVendorId) {
  const vendor = await this.findOne({ mobile, _id: { $ne: excludeVendorId } });
  return !!vendor;
};

const Vendor = mongoose.model('vendor-members', VendorSchema);

module.exports = Vendor;
