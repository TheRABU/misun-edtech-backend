import mongoose, { Schema, Document } from "mongoose";

export interface IAssignment extends Document {
  courseId: mongoose.Types.ObjectId;
  moduleId: string;
  title: string;
  description: string;
  dueDate?: Date;
  maxScore: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const assignmentSchema = new Schema<IAssignment>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    moduleId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
    },
    maxScore: {
      type: Number,
      default: 100,
      min: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

assignmentSchema.index({ courseId: 1, moduleId: 1 });

export const Assignment = mongoose.model<IAssignment>(
  "Assignment",
  assignmentSchema
);
