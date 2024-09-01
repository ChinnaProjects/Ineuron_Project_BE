import User from "../models/user.schema.js";
import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/customError.js";

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
