import mongoose, { Schema, Document } from "mongoose";

export interface ITodo extends Document {
  text: string;
  completed: boolean;
  status: "todo" | "in-progress" | "done";
  user: mongoose.Schema.Types.ObjectId;
}

const todoSchema = new Schema<ITodo>({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["todo","in-progress","done"], default: "todo" }

});

export default mongoose.model<ITodo>("Todo", todoSchema);
