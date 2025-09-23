
import { Request, Response } from "express";
import User from "../models/User";
import Todo from "../models/Todo";


export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error fetching users" });
  }
};


export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ msg: "Invalid role" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ msg: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: "Server error updating role" });
  }
};


export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    await Todo.deleteMany({ user: user._id }); 
    res.json({ msg: "User and their todos deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error deleting user" });
  }
};


export const getTodos = async (_req: Request, res: Response) => {
  try {
    const todos = await Todo.find()
      .populate("user", "username email") 
      .sort({ createdAt: -1 });

    res.json(todos);
  } catch (err) {
    res.status(500).json({ msg: "Server error fetching todos" });
  }
};


export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ msg: "Todo not found" });

    res.json({ msg: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error deleting todo" });
  }
};
