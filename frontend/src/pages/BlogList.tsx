import React from "react";
import { Link } from "react-router-dom";
import { useBlog } from "../context/BlogContext";

const BlogList: React.FC = () => {
  const { blogs, likeBlog } = useBlog();
  const currentUserId = localStorage.getItem("userId");

  if (!blogs) return <p className="text-center mt-20 text-gray-500">Loading blogs...</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Latest Blogs</h1>
        <Link
          to="/blogs/new"
          className="bg-red-400 text-white px-5 py-2 rounded-2xl shadow transition "
        >
          ➕ Create Blog
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.length === 0 ? (
          <p className="text-gray-500 col-span-full">
            No blogs available yet. Be the first to create one!
          </p>
        ) : (
          blogs.map((blog) => {
            const isLiked = blog.likes?.includes(currentUserId);

            return (
              <div
                key={blog._id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition overflow-hidden flex flex-col h-full"
              >
                <Link to={`/blogs/${blog._id}`} className="flex-1 p-5">
                  <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition">
                    {blog.title}
                  </h2>
                  <p
                    className="text-gray-600 mt-3 flex-1"
                    dangerouslySetInnerHTML={{
                      __html: blog.content.slice(0, 170) + "...",
                    }}
                  ></p>

                  <div className="mt-4 flex justify-between items-center text-gray-500 text-sm">
                    <span>By: {blog.author?.username || "Unknown"}</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>

                  {blog.tags?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {blog.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="bg-gray-200 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>

                <div className="p-5 flex items-center gap-2">
                  <button
                    onClick={() => likeBlog(blog._id)}
                    className={`px-3 py-1 rounded ${
                      isLiked
                        ? "bg-red-400 text-white rounded-2xl"
                        : "bg-gray-200 text-gray-700 rounded-2xl"
                    }`}
                  >
                    {isLiked ? "❤️ Liked" : "🤍 Like"} ({blog.likes?.length || 0})
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BlogList;
