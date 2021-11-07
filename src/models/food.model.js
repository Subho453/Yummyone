const mongoose = require('mongoose');

const FoodSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    mrp: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    vendor: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'vendor-members',
    },
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'categories',
    },
    cuisine: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'cuisines',
    },
    portions: {
      type: Array,
    },
    addons: {
      type: Array,
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

const Food = mongoose.model('food', FoodSchema);

module.exports = Food;
