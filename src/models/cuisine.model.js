const mongoose = require('mongoose');

const CuisineSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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

const Cuisine = mongoose.model('cuisines', CuisineSchema);

module.exports = Cuisine;
