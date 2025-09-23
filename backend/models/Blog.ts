// models/Blog.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IComment {
  userId: string;
  username: string;
  text: string;
  createdAt: Date;
}

export interface IBlog extends Document {
  title: string;
  content: string;
  tags?: string[];
  image?: string;
  author: {
    id: string;
    username: string;
  };
  likes: string[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    image: { type: String },
    author: {
      id: { type: Schema.Types.ObjectId, ref: "User", required: true },
      username: { type: String, required: true },
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    comments: [CommentSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IBlog>("Blog", BlogSchema);
