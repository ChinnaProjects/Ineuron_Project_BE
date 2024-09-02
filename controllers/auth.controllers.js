import User from "../models/user.schema.js";
import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/customError.js";
import mailHelper from "../utils/mailhelper.js";
import crypto from "crypto";

export const cookieOptions = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
  //could be in separate files in utils
};

/***********************************************************************
 * @SIGNUP
 * @route https://localhost:4000/api/auth/signup
 * @description User signup controller for creating a new user
 * @parameter name,email,password
 * @returns User Object
 ************************************************************************/

export const signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new CustomError("Please fill All Fields", 400);
  }
  //check user is exists or not
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError("User already Exists", 400);
  }
  const user = User.create({ name, email, password });
  const token = user.getJwtToken();
  user.password = undefined;
  res.cookie("token", token, cookieOptions);
  res.status(200).json({
    success: true,
    token,
    user,
  });
});

/***********************************************************************
 * @SIGNIN
 * @route https://localhost:4000/api/auth/signin
 * @description User signin controller for logging a new user
 * @parameter email,password
 * @returns User Object
 ************************************************************************/
export const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError("Please pass all fields", 400);
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new CustomError("Invalid Credentails", 400);
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (isPasswordMatch) {
    const token = user.getJwtToken();
    user.password = undefined;
    res.cookie("token", token, cookieOptions);
    res.status(200).json({
      success: true,
      token,
      user,
    });
  }
  throw new CustomError("Invalid Credentails", 400);
});

/***********************************************************************
 * @LOGOUT
 * @route https://localhost:4000/api/auth/logout
 * @description User logout by clearing user cookies
 * @parameter
 * @returns success message
 ************************************************************************/

export const logOut = asyncHandler(async (_req, res) => {
  //res.clearCookie();
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "User is Logged out SuccessFully",
  });
});

/***********************************************************************
 * @FORGOT_PASSWORD
 * @route https://localhost:4000/api/auth/password
 * @description User will submit email and we will generate a token
 * @parameter email
 * @returns success message - email send
 ************************************************************************/
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  //check emailfor null or ""
  const user = User.findOne({ email });
  if (!user) {
    throw new CustomError("User is not found", 404);
  }
  const resetToken = user.generateForgotPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/password/reset${resetToken}`;

  const text = `Your Password Reset URL is \n\n ${resetURL} \n\n`;
  try {
    await mailHelper({
      email: user.email,
      subject: "Password Reset Email for Web Site",
      text: text,
    });
    res.status(200).json({
      success: true,
      message: `Email send to ${user.email}`,
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    user.save({ validateBeforeSave: false });
    throw new CustomError(error.message || "Email Sent is failure", 500);
  }
});

/***********************************************************************
 * @RESET
 * @route https://localhost:4000/api/auth/reset/:resetPasswordToken
 * @description User will reset the password based on the url
 * @parameter token from url, password and confirm password
 * @returns User Object
 ************************************************************************/

export const resetPassword = asyncHandler(async (req, res) => {
  const { token: resetToken } = req.params;
  const { password, confirmPassword } = req.body;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: resetPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });
  if (!user) {
    throw new CustomError("Password token is invalid or expired", 400);
  }
  if (password !== confirmPassword) {
    throw new CustomError("Password and ConfirmPassword is not matched");
  }
  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();

  //create token and send it to user

  const token = user.getJwtToken();
  user.password = undefined;
  res.cookie("token", token, cookieOptions);
  res.status(200).json({
    success: true,
    user,
    token,
  });
});

//Change Password

/***********************************************************************
 * @GET_PROFILE
 * @REQUEST_TYPE
 * @route https://localhost:4000/api/auth/profile
 * @description Check for token populate req.user
 * @parameter
 * @returns User Object
 ************************************************************************/

export const getProfile = asyncHandler(async (req, res, next) => {
  const { user } = req;
  if (!user) {
    throw new CustomError("User not Found", 404);
  }
  res.status(200).json({
    success: true,
    user,
  });
});
