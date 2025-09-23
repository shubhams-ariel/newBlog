
import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { createTodo, getTodos, updateTodo, deleteTodo } from "../controllers/todoController";

const router = Router();

router.post("/", authMiddleware, createTodo);
router.get("/", authMiddleware, getTodos);  
router.put("/:id", authMiddleware, updateTodo);
router.delete("/:id", authMiddleware, deleteTodo);

export default router;

