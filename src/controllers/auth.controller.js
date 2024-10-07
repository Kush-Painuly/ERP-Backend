import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generate } from "generate-password";
import otpGenerator from "otp-generator";
import { CustomError } from "../utils/index.js";
import { User, Role, Department, Permission } from "../models/index.js";
import { sendLoginCredentials, sendOTP } from "../Services/SendMail.js";

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const generateOTP = () => {
  return otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
};

const checkPassword = async (password, actualPassword) => {
  const isMatched = await bcrypt.compare(password, actualPassword);
  if (!isMatched) {
    throw new CustomError("Your password is incorrect", 401);
  }
  return true;
};

const createAdmin = async (email, password) => {
  //create role
  const role = await Role.create({ name: "Admin" });

  //create departement
  const dept = await Department.create({ name: "Management" });

  //hash the password
  const hashedPassword = await hashPassword(password);

  //fetch admin permissions
  const permissions = await Permission.find({
    name: "Administrator Access",
  }).select("_id");

  //create adminUser
  const user = await User.create({
    email,
    password: hashedPassword,
    role: role._id,
    deptId: dept._id,
    userPermissions: permissions,
  });

  return user;
};

const checkEmail = async (email) => {
  const user = await User.findOne({ email })
    .populate({ path: "role", select: "name _id" })
    .populate({ path: "deptId", select: "name _id" })
    .populate({ path: "userPermissions", select: "name _id" });

  if (user) {
    return user;
  }
  return false;
};

const passwordGenerator = () => {
  return generate({
    length: 12,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilarCharacters: true,
  });
};

//checkPassword

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: "24h",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: "7d",
  });
};

const verifyRefreshToken = (token) => {
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);
    return decodedToken;
  } catch (err) {
    throw new CustomError("Session Expired", 403);
  }
};

const verifyAccessToken = (token) => {
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    return decodedToken;
  } catch (err) {
    throw new CustomError("Session Expired", 403);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError("Please fill all the fields", 400);
  }

  const existingUser = await User.find();
  if (existingUser.length === 0) {
    const user = await createAdmin(email, password);

    if (user) {
      return res.status(201).json({
        success: true,
        message: "Admin created Successfully",
      });
    }
  }

  //check whether email exists or not
  const user = await checkEmail(email);

  if (!user) {
    throw new CustomError("No user found with this email", 404);
  }

  //check if the password entered matches with the password in the DB
  await checkPassword(password, user.password);

  const accesstoken = generateAccessToken(user._id);
  const refreshtoken = generateRefreshToken(user._id);

  const userObj = {
    userId: user._id,
    name: user?.name,
    email: user.email,
    role: user.role,
    department: user.deptId,
    userPermissions: user.userPermissions,
  };

  res.cookie("jwt", refreshtoken, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    // secure: true,
    // sameSite: 'none',
    // domain: '.abc.com'
  });

  res.json({
    success: true,
    message: "User logged in successfully",
    accesstoken,
    user: userObj,
  });
};

export const registerUser = async (req, res) => {
  const { email, role, deptId } = req.body;

  //sanitize the data
  if (!email) {
    throw new CustomError("Please fill all the fields", 400);
  }

  //check if user exists or not
  const isUserExists = await checkEmail(email);
  if (isUserExists) {
    throw new CustomError("A user with same email already exists", 409);
  }

  //generate password
  const generatedPassword = passwordGenerator();
  console.log(generatedPassword);

  //hash Password
  const hashedpassword = await hashPassword(generatedPassword);

  //DB Store
  const user = new User();
  user.email = email;
  user.password = hashedpassword;
  user.role = role;
  user.deptId = deptId;

  const result = await user.save();

  await sendLoginCredentials(email, req.body?.name || email, generatedPassword);

  res.status(201).json({
    success: true,
    message: "user created successfully",
    user: result,
  });

  // kushpainuly180@gmail.com -> aU"TmczY+n#%

  //token key-gen - require('crypto').randomBytes(64).toString('hex')
};

//to generate new access token
export const getNewAcessToken = async (req, res) => {
  const refreshToken = req.cookies?.jwt;
  console.log(refreshToken);

  if (!refreshToken) {
    throw new CustomError("Session Expired", 403);
  }

  const decodedToken = verifyRefreshToken(refreshToken);

  const accesstoken = generateAccessToken(decodedToken.userId);

  const user = await User.findById(decodedToken.userId);

  const userObj = {
    userId: user._id,
    name: user?.name,
    email: user.email,
    role: user.role,
    department: user.deptId,
    userPermissions: user.userPermissions,
  };

  res.status(200).json({ accesstoken, user: userObj });
};

export const logout = async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    // secure: true,
    // sameSite: 'none',
    // domain: '.abc.com'
  });

  res.status(204).end();
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new CustomError("Please enter a valid email", 400);
  }

  const user = await checkEmail(email);
  if (!user) {
    throw new CustomError("Email not found", 404);
  }

  const otp = generateOTP();

  //for otp expiry
  const currentstamp = Date.now();
  const otpExpiry = new Date(currentstamp + 5 * 60 * 1000);

  user.otpVerification.otp = otp;
  user.otpVerification.otpExpiry = otpExpiry;

  await user.save();

  await sendOTP(email, user?.name || user?.email, otp);

  res.status(200).json({ success: true, message: "OTP send to email" });
};

export const verifyOTP = async (req, res) => {
  const { otp } = req.body;
  if (!otp) {
    throw new CustomError("Please enter a valid OTP", 400);
  }

  const user = await User.findOne({
    "otpVerification.otp": otp,
    "otpVerification.otpExpiry": { $gt: Date.now() },
  });

  if (!user) {
    throw new CustomError("Invalid OTP or OTP is expired ", 400);
  }

  user.otpVerification.otp = "";
  user.otpVerification.otpExpiry = "";

  await user.save();

  const token = await generateAccessToken(user._id);
  res
    .status(200)
    .json({ success: true, message: "OTP verified Successfully", token });
};

export const resetPassword = async (req, res) => {
  const { newPassword, token } = req.body;

  const decodedToken = verifyAccessToken(token);

  const hashedPassword = await hashPassword(newPassword);

  const result = await User.findByIdAndUpdate(decodedToken.userId, {
    password: hashedPassword,
  });

  if (!result) {
    throw new CustomError("user not found", 404);
  }

  res
    .status(200)
    .json({ success: true, message: "Password updated Successfully!" });
};
