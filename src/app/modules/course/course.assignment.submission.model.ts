import mongoose, { Schema, Document } from "mongoose";

export interface IAssignmentSubmission extends Document {
  assignmentId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  submissionUrl: string;
  submissionText?: string;
  score?: number;
  feedback?: string;
  submittedAt: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const assignmentSubmissionSchema = new Schema<IAssignmentSubmission>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    submissionUrl: {
      type: String,
      required: true,
    },
    submissionText: {
      type: String,
    },
    score: {
      type: Number,
      min: 0,
    },
    feedback: {
      type: String,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
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

assignmentSubmissionSchema.index(
  { assignmentId: 1, userId: 1 },
  { unique: true }
);
assignmentSubmissionSchema.index({ userId: 1, isDeleted: 1 });

export const AssignmentSubmission = mongoose.model<IAssignmentSubmission>(
  "AssignmentSubmission",
  assignmentSubmissionSchema
);
