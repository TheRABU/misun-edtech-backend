import mongoose, { Schema, Document } from "mongoose";

interface IModule {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
}

interface IBatch {
  batchId: string;
  startDate: Date;
  endDate?: Date;
  maxStudents?: number;
}

export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: string;
  price: number;
  category: string;
  tags: string[];
  thumbnail?: string;
  modules: IModule[];
  batches: IBatch[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const moduleSchema = new Schema<IModule>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { _id: true }
);

const batchSchema = new Schema<IBatch>(
  {
    batchId: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    maxStudents: {
      type: Number,
    },
  },
  { _id: false }
);

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      type: String,
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    tags: [
      {
        type: String,
        index: true,
      },
    ],
    thumbnail: {
      type: String,
    },
    modules: [moduleSchema],
    batches: [batchSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

courseSchema.index({ title: "text", description: "text" });
courseSchema.index({ category: 1, price: 1 });
courseSchema.index({ isDeleted: 1 });

export const Course = mongoose.model<ICourse>("Course", courseSchema);
