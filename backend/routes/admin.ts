import { Router } from "express";
import { authMiddleware, adminMiddleware } from "../middleware/auth";
import {
  getUsers,
  updateUserRole,
  deleteUser,
  getTodos,
  deleteTodo,
} from "../controllers/adminControllers";



const router = Router();

router.get("/users", authMiddleware, adminMiddleware, getUsers);
router.put("/users/:id/role", authMiddleware, adminMiddleware, updateUserRole);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);
router.get("/todos", authMiddleware, adminMiddleware, getTodos);
router.delete("/todos/:id", authMiddleware, adminMiddleware, deleteTodo);

export default router;
