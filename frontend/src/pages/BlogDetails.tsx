import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useBlog, type Blog } from "../context/BlogContext";
import { toast } from "react-toastify";

const BlogDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");
  const currentUserRole = localStorage.getItem("role");

  const {
    blogs,
    likeBlog,
    addComment,
    deleteComment,
    deleteBlog,
  } = useBlog();

  const [newComment, setNewComment] = useState("");
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    if (id) {
      const b = blogs.find((b) => b._id === id);
      setBlog(b || null);
    }
  }, [id, blogs]);

  if (!blog) return <p className="text-center mt-20 text-gray-500">Blog not found</p>;

  const likedByUser = blog.likes?.includes(currentUserId);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id) return;
    await addComment(id, newComment);
    setNewComment("");
  };

  const canEditOrDelete = currentUserId === blog.author.id || currentUserRole === "admin";

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-5">
        <Link to="/blogs" className="text-blue-600 hover:underline">
          ← Back to Blogs
        </Link>
        {canEditOrDelete && (
          <div className="flex gap-3">
            <Link
              to={`/blogs/${blog._id}/edit`}
              className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
            >
              Edit
            </Link>
            <button
              onClick={() => { deleteBlog(blog._id); navigate("/blogs"); }}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <h1 className="text-4xl font-bold text-gray-800 mb-4">{blog.title}</h1>
      <div className="flex items-center justify-between text-gray-500 text-sm mb-6">
        <span>By: {blog.author?.username || "Unknown"}</span>
        <span>{new Date(blog.createdAt).toLocaleString()}</span>
      </div>

      {blog.image && (
        <img
          src={blog.image}
          alt="Blog cover"
          className="rounded-lg mb-6 max-h-96 w-full object-cover shadow-md"
        />
      )}

      <div
        className="text-gray-700 text-lg leading-relaxed mb-6"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      ></div>

      <div className="flex items-center gap-4 mt-4 mb-6">
        <button
          onClick={() => likeBlog(blog._id)}
          className={`px-3 py-1 rounded transition ${
            likedByUser ? "bg-red-400 text-white rounded-2xl" : "bg-gray-200 text-gray-700 rounded-2xl"
          }`}
        >
          {likedByUser ? "❤️ Liked" : "🤍 Like"} ({blog.likes?.length || 0})
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Comments ({blog.comments?.length || 0})</h2>

        <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 border p-2 rounded"
            required
          />
          <button type="submit" className="bg-red-400 text-white px-4 py-2 rounded transition">
            Post
          </button>
        </form>

        <div className="space-y-4">
          {blog.comments?.map((c) => (
            <div key={c._id} className="p-2 rounded bg-gray-50 relative">
              <p className="text-gray-800 font-medium">{c.username}</p>
              <p className="text-gray-700">{c.text}</p>
              {c.userId === currentUserId && (
                <button
                  onClick={() => deleteComment(blog._id, c._id)}
                  className="absolute bg-red-400 mx-2 py-1 px-1 top-2 right-2 text-white rounded-2xl text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
