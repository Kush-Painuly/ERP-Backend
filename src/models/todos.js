import { Schema, model } from "mongoose";

const todoSchema = new Schema(
  {
    task: {
      type: String,
      required: true,
    },
    deadLine: {
      type: Date,
      required: false,
    },
    assignedBy: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: [
      {
        type: String.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);


export const Todo = model("Todo", todoSchema);