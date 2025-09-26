import { Request, Response } from "express";
import Todo from "../models/Todo";

// CREATE TODO
export const createTodo = async (req: Request, res: Response) => {
  try {
    const todo = new Todo({
      text: req.body.text,
      status: req.body.status || "todo", // <-- added status with default
      user: req.user.id,
    });
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ msg: "Server error creating todo" });
  }
};

// GET TODOS
export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ msg: "Server error fetching todos" });
  }
};

// UPDATE TODO
export const updateTodo = async (req: Request, res: Response) => {
  try {
    const updateData: any = {};
    if (req.body.text !== undefined) updateData.text = req.body.text;
    if (req.body.status !== undefined) updateData.status = req.body.status; // <-- allow status update

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true }
    );

    if (!todo) return res.status(404).json({ msg: "Todo not found" });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ msg: "Server error updating todo" });
  }
};

// DELETE TODO
export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!todo) return res.status(404).json({ msg: "Todo not found" });
    res.json({ msg: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error deleting todo" });
  }
};
