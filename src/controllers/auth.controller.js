import bcrypt from "bcryptjs";
import { generate } from "generate-password";
import { CustomError } from "../utils/index.js";
import { User, Role, Department, Permission } from "../models/index.js";

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
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
  const user = await User.findOne({ email });

  if (user) {
    return true;
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
};

export const registerUser = async (req, res) => {
  const { email, role, deptId } = req.body;

  //sanitize the data
  if (!email || !role || !deptId) {
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

  res.status(201).json({
    success:true,
    message:"user created successfully",
    user: result
  })
};
