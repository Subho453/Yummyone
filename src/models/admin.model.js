// Import mongoose
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Declare schema and assign Schema class
const { Schema } = mongoose;

// Create Schema Instance and add schema propertise
const adminMembersSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    default: 'admin',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
  },
  is_active: {
    type: Boolean,
    default: true,
  }
},
{
  timestamps: true,
});

adminMembersSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

adminMembersSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

adminMembersSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
// create and export model
module.exports = mongoose.model('admin-members', adminMembersSchema);
