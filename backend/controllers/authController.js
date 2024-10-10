import User from '../models/userModel.js';
import ErrorResponse from '../utils/errorResponse.js';

// Signup function
export const signup = async (req, res, next) => {
  const { email } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new ErrorResponse('E-mail already registered', 400));
  }

  try {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Signin function
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email) {
      return next(new ErrorResponse('Please add an email', 403));
    }
    if (!password) {
      return next(new ErrorResponse('Please add a password', 403));
    }

    // Check if user exists with given email
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 400));
    }

    // Check if password matches
    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
      return next(new ErrorResponse('Invalid credentials', 400));
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Function to send JWT token and set cookie
const sendTokenResponse = async (user, codeStatus, res) => {
  const token = await user.getJwtToken();
  res
    .status(codeStatus)
    .cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true }) // 1-hour token expiration
    .json({ success: true, token, user });
};

// Logout function
export const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({
    success: true,
    message: 'Logged out',
  });
};
