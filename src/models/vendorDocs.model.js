const mongoose = require('mongoose');

const VendorDocSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    docs: {
      type: Array,
      required: true,
    },
    number: {
      type: String,
      unique: true,
    },
    comments: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      default: 'pending',
    },
    vendor: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'vendor-members',
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

VendorDocSchema.statics.isDocExist = async function (vendorId, type) {
  const vendor = await this.findOne({ vendor: vendorId, type });
  return vendor;
};

const Vendor = mongoose.model('vendor-documents', VendorDocSchema);

module.exports = Vendor;
