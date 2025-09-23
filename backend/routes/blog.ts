import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { createBlog, getBlogs, getBlogById,updateBlog, deleteBlog,toggleLikeBlog,addComment,deleteComment } from "../controllers/blogControllers";

const router = Router();

router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.post("/", authMiddleware, createBlog);
router.put("/:id", authMiddleware, updateBlog); 
router.delete("/:id", authMiddleware, deleteBlog);
router.post("/:id/like", authMiddleware, toggleLikeBlog);
router.post("/:id/comments", authMiddleware, addComment);
router.delete("/:id/comments/:commentId", authMiddleware, deleteComment);


export default router;
