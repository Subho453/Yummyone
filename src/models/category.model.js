const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
    vendor: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'vendor-members',
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

const Category = mongoose.model('categories', CategorySchema);

module.exports = Category;
