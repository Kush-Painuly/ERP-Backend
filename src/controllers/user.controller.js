import mongoose from "mongoose";
import { Department, User } from "../models/index.js";
import { CustomError } from "../utils/CustomError.js";

export const getusers = async (req, res) => {
  //pagination
  const limit = req.query.limit || 5;
  const page = req.query.page || 1;
  const offset = limit * (page - 1); // offset calculates how many data we have to skip to show the data.

  //Filer
  const { deptId } = req.query;

  const query = { _id: { $ne: req.user._id } };

  if (deptId) {
    query = { ...query, deptId: new mongoose.Types.ObjectId(deptId) };
  }

  const users = await User.find(query)
    .populate({ path: "role", select: "name" })
    .populate({
      path: "deptId",
      select: "name managerId",
      populate: { path: "managerId", select: "name email" },
    })
    .select(" -updatedAt -password")
    .limit(limit)
    .skip(offset);

  const userCount = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    data: users,
    totalusers: userCount,
    totalPages: Math.ceil(userCount / limit),
  });
};

export const getAvailableManagers = async (req, res) => {
  const query1 = User.find().select("name email");

  const query2 = Department.find({
    $and: [
      {
        isDeptDeleted: false,
      },
      { managerId: { $exists: true } },
    ],
  }).select("managerId -_id");

  const [users, depts] = await Promise.all([query1, query2]);

  if (depts.length === 0) {
    return res.status(200).json({ success: true, data: users });
  }

  const existingManagerIds = depts.map((item) => item.managerId.toString());

  const filteredUsers = users.filter((user) => {
    return !existingManagerIds.includes(user?._id?.toString());
  });

  res.status(200).json({ success: true, data: filteredUsers });
};

export const manageUserPermission = async (req, res) => {
  const { userId, permissions } = req.body;

  if (!userId || !permissions.length === 0) {
    throw new CustomError("please select at least 1 permission", 400);
  }

  const result = await User.findByIdAndUpdate(userId, {
    userPermissions: permissions,
  });

  if (!result) {
    throw new CustomError("User does not exist ", 404);
  }

  res.status(200).json({ success: true, message: "User permissions updated" });
};
