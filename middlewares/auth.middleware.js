import User from "../models/user.schema.js";
import JWT from "jsonwebtoken";
import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/customError.js";
import config from "../config/index.js";

export const isLoggedIn = asyncHandler(async (req, _res, next) => {
  let token;
  if (
    req.cookies.token ||
    (req.header.authorization && req.header.authorization.startsWith("Bearer"))
  ) {
    token = req.cookies.token || req.header.authorization.split(" ")[1];
  }
  if (!token) {
    throw new CustomError("Not authorized to access the route", 401);
  }
  try {
    const decodedJwtPayload = JWT.verify(token, config.JWT_SECRET);
    req.user = await User.findById(decodedJwtPayload._id, "name email role");
    next();
  } catch (error) {}
});
