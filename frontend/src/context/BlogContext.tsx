import React, { createContext, useContext, useState,  type ReactNode, useEffect } from "react";
import blogAPI from "../services/blogApi";
import { toast } from "react-toastify";

interface Comment {
  _id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  tags?: string[];
  image?: string;
  author: { id: string; username: string };
  likes?: string[];
  comments?: Comment[];
  createdAt: string;
}

interface BlogContextType {
  blogs: Blog[];
  fetchBlogs: () => Promise<void>;
  createBlog: (data: Partial<Blog>) => Promise<void>;
  updateBlog: (id: string, data: Partial<Blog>) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  likeBlog: (id: string) => Promise<void>;
  addComment: (blogId: string, text: string) => Promise<void>;
  deleteComment: (blogId: string, commentId: string) => Promise<void>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const currentUserId = localStorage.getItem("userId");

 
  const fetchBlogs = async () => {
    try {
      const res = await blogAPI.getAll();
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch blogs");
    }
  };

 
  const createBlog = async (data: Partial<Blog>) => {
    try {
      await blogAPI.create(data);
      toast.success("Blog created successfully");
      await fetchBlogs();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create blog");
    }
  };


  const updateBlog = async (id: string, data: Partial<Blog>) => {
    try {
      const res = await blogAPI.update(id, data); 
      console.log("API Response:", res.data); 
      setBlogs((prev) =>
        prev.map((b) => (b._id === id ? { ...b, ...res.data } : b))
      );
      toast.success("Blog updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update blog");
    }
  };

  
    const deleteBlog = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await blogAPI.delete(id);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      toast.success("Blog deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete blog");
    }
  };

 
  const likeBlog = async (id: string) => {
    try {
      const res = await blogAPI.like(id);
      setBlogs((prev) =>
        prev.map((b) =>
          b._id === id
            ? {
                ...b,
                likes: res.data.likedByUser
                  ? currentUserId
                    ? [...(b.likes || []), currentUserId]
                    : [...(b.likes || [])]
                  : (b.likes || []).filter((uid) => uid !== currentUserId),
              }
            : b
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to like blog");
    }
  };


  const addComment = async (blogId: string, text: string) => {
    try {
      const res = await blogAPI.addComment(blogId, text); 
      console.log("Add Comment API Response:", res.data);
      setBlogs((prev) =>
        prev.map((b) =>
          b._id === blogId
            ? { ...b, comments: res.data.comments }
            : b
        )
      );
      toast.success("Comment added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment");
    }
  };

 
  const deleteComment = async (blogId: string, commentId: string) => {
    try {
      await blogAPI.deleteComment(blogId, commentId);
      setBlogs((prev) =>
        prev.map((b) =>
          b._id === blogId
            ? { ...b, comments: (b.comments || []).filter((c) => c._id !== commentId) }
            : b
        )
      );
      toast.success("Comment deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete comment");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <BlogContext.Provider
      value={{ blogs, fetchBlogs, createBlog, updateBlog, deleteBlog, likeBlog, addComment, deleteComment }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = (): BlogContextType => {
  const context = useContext(BlogContext);
  if (!context) throw new Error("useBlog must be used within BlogProvider");
  return context;
};