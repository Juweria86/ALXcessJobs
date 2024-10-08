import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, 'First name is required'],
      maxlength: 32,
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, 'Last name is required'],
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      required: [true, 'Email is required'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must have at least 6 characters'],
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Encrypting password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Return a JWT token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: 3600,
  });
};

// Export the User model
export default mongoose.model('User', userSchema);
