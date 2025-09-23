import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import multer from "multer";
import path from "path";
import nodemailer from "nodemailer";


const generateTokens = (user: any) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role,username: user.username },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_SECRET!,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || "7d" }
  );

  return { accessToken, refreshToken };
};


export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ msg: "Missing fields" });

    if (await User.findOne({ email }))
      return res.status(400).json({ msg: "User already exists" });

    const hasAdmin = await User.exists({ role: "admin" });
    const role = hasAdmin ? "user" : "admin";

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashed, role });
    await newUser.save();

    const { accessToken, refreshToken } = generateTokens(newUser);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      role: newUser.role,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profilePic: newUser.profilePic || "",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    const { accessToken, refreshToken } = generateTokens(user);

     res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, 
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      // accessToken,
      role: user.role,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic || "",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ msg: "No refresh token" });

    jwt.verify(token, process.env.REFRESH_SECRET!, (err: any, decoded: any) => {
      if (err) return res.status(403).json({ msg: "Invalid refresh token" });

      const accessToken = jwt.sign(
        { id: decoded.id },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "15m" }
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false, 
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, 
      });

      res.json({ msg: "Access token refreshed" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
export const upload = multer({ storage });

export const uploadProfilePic = async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.profilePic = req.file.filename;
    await user.save();

    res.json({ msg: "Profile uploaded", profilePic: user.profilePic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


let transporterPromise = nodemailer.createTestAccount().then((testAccount) => {
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
});
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "15m" });

    
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    const transporter = await transporterPromise;
    const info = await transporter.sendMail({
      to: email,
      subject: "Password Reset",
      html: `<p>Click the link to reset password:</p><a href="${resetLink}">${resetLink}</a>`,
    });

    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    res.json({ msg: "Password reset link sent!", previewURL: nodemailer.getTestMessageUrl(info) });
  } catch (err: any) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    res.json({ msg: "Password reset successful" });
  } catch (err: any) {
    console.error("Reset Password Error:", err);
    res.status(400).json({ msg: "Invalid or expired token" });
  }
};
