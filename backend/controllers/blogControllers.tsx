import { Request, Response } from "express";
import Blog from "../models/Blog";
import { AuthRequest } from "../middleware/auth";

export const createBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, tags, image } = req.body; 
    if (!title || !content) 
      return res.status(400).json({ msg: "Title & content required" });

    if (!req.user) return res.status(401).json({ msg: "Unauthorized" });

    const newBlog = new Blog({
      title,
      content,
      image: image || "",  
      tags: tags || [],
      author: {
        id: req.user.id,
        username: req.user.username || "Unknown",
      },
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getBlogs = async (_req: Request, res: Response) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const updateBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, tags, image } = req.body; 

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    if (blog.author.id.toString() !== req.user?.id && req.user?.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.tags = tags || blog.tags;
    blog.image = image !== undefined ? image : blog.image; 

    await blog.save();

    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    if (blog.author.id.toString() !== req.user?.id && req.user?.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await blog.deleteOne();
    res.json({ msg: "Blog deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Like/unlike a blog
export const toggleLikeBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.user) return res.status(401).json({ msg: "Unauthorized" });

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    blog.likes = blog.likes || []; // Ensure array exists
    const userId = req.user.id;
    let likedByUser = false;

    if (blog.likes.includes(userId)) {
      // Unlike
      blog.likes = blog.likes.filter((uid) => uid.toString() !== userId);
      likedByUser = false;
    } else {
      // Like
      blog.likes.push(userId);
      likedByUser = true;
    }

    await blog.save();
    res.json({ likes: blog.likes.length, likedByUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// controllers/blogControllers.ts

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // blog id
    const { text } = req.body;

    if (!req.user) return res.status(401).json({ msg: "Unauthorized" });
    if (!text) return res.status(400).json({ msg: "Comment cannot be empty" });

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    blog.comments.push({
      userId: req.user.id,
      username: req.user.username || "Unknown",
      text,
      createdAt: new Date(),
    });

    await blog.save();
    res.status(201).json(blog.comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id, commentId } = req.params; 
    if (!req.user) return res.status(401).json({ msg: "Unauthorized" });

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    const comment = blog.comments.find(c => c._id.toString() === commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    // ✅ Convert userId to string for comparison
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "You can only delete your own comment" });
    }

    blog.comments = blog.comments.filter(c => c._id.toString() !== commentId);
    await blog.save();

    res.json({ msg: "Comment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

