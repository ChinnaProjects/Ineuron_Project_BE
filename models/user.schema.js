import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import config from "../config/index.js";
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
      maxLength: [50, "Name must be less than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be atleast 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(AuthRoles),
      default: AuthRoles.USER,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  {
    timestamps: true,
  }
);
//challange -1 encrypt password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods = {
  //compare password
  comparePassword: async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
  },
  getJwtToken: function () {
    return jwt.sign(
      {
        _id: this._id,
        role: this.role,
      },
      config.JWT_SECRET, //this value should come from .env file
      {
        expiresIn: config.JWT_EXPIRY, //this value should come from .env file
      }
    );
  },
  generateForgotPasswordToken: function () {
    const forgotToken = crypto.randomBytes(64).toString("hex");
    //save in DB
    this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(forgotToken)
      .digest("hex");

    this.forgotPasswordExpiry = Date.now() + 2 * 60 * 60 * 1000;
    return forgotToken;
  },
};
export default mongoose.model("User", userSchema);
