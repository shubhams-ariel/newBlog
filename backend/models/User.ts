import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
  profilePic: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: number;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  profilePic: { type: String, default: "" },

resetPasswordToken: { type: String },
resetPasswordExpire: { type: Number }
});

export default mongoose.model<IUser>("User", userSchema);
