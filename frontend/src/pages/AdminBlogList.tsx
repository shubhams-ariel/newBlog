import React, { useEffect, useState } from "react";
import blogAPI from "../services/blogApi";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const AdminBlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await blogAPI.getAll(); 
        setBlogs(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await blogAPI.delete(id);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      toast.success("Blog deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete blog");
    }
  };

  if (loading) return <p className="text-center mt-20">Loading blogs...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Manage Blogs</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Title</th>
            <th className="p-2">Author</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id} className="border-t">
              <td className="p-2">{blog.title}</td>
              <td className="p-2">{blog.author?.username}</td>
              <td className="p-2 flex gap-2">
                <Link
                  to={`/blogs/${blog._id}/edit`}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBlogList;
