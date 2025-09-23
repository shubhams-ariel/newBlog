import mongoose, { Schema, Document } from "mongoose";

export interface ITodo extends Document {
  text: string;
  completed: boolean;
  user: mongoose.Schema.Types.ObjectId;
}

const todoSchema = new Schema<ITodo>({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model<ITodo>("Todo", todoSchema);
