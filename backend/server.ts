import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import authRoutes from "./routes/auth";
import todoRoutes from "./routes/todos";
import adminRoutes from "./routes/admin";
import blogRoutes from "./routes/blog";

dotenv.config();

const app = express();


app.use(
  cors({
    origin: process.env.VITE_FRONTEND_URI || "http://localhost:5173",
    credentials: true,
  })
);


app.use(bodyParser.json());
app.use(cookieParser());


app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);
app.use("/admin", adminRoutes);
app.use("/blogs", blogRoutes);


app.use("/uploads", express.static("uploads"));


connectDB();


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
