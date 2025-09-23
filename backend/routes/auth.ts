import { Router } from "express";
import {
  signup,
  login,
  upload,
  uploadProfilePic,
  refreshToken,   
 
} from "../controllers/authControllers";
import { forgotPassword, resetPassword } from "../controllers/authControllers";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/refresh", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post(
  "/upload-profile",
  authMiddleware,
  upload.single("profile"),
  uploadProfilePic
);

export default router;

