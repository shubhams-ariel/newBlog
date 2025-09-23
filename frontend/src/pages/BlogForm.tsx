import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EditorState, RichUtils, convertToRaw, ContentState } from "draft-js";
import { Editor } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import blogAPI from "../services/blogApi";
import { toast } from "react-toastify";
import "draft-js/dist/Draft.css";

const BlogForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(""); 

 const toolbarButtons = [
  { label: "B", action: () => toggleInlineStyle("BOLD") },
  { label: "I", action: () => toggleInlineStyle("ITALIC") },
  { label: "U", action: () => toggleInlineStyle("UNDERLINE") },
  { label: "UL", action: () => toggleBlockType("unordered-list-item") },
  { label: "OL", action: () => toggleBlockType("ordered-list-item") },
  { label: "Link", action: () => promptForLink() },
];
  useEffect(() => {
    if (isEdit) {
      blogAPI.getById(id!).then((res) => {
        setTitle(res.data.title || "");
        setTags(res.data.tags?.join(", ") || "");
        setImage(res.data.image || ""); 
        if (res.data.content) {
          const blocksFromHtml = htmlToDraft(res.data.content);
          const contentState = ContentState.createFromBlockArray(
            blocksFromHtml.contentBlocks
          );
          setEditorState(EditorState.createWithContent(contentState));
        }
      });
    }
  }, [id, isEdit]);

  
  const toggleInlineStyle = (style: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (type: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, type));
  };

  const promptForLink = () => {
    const selection = editorState.getSelection();
    const url = window.prompt("Enter URL");
    if (!url) return;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "LINK",
      "MUTABLE",
      { url }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    setEditorState(RichUtils.toggleLink(editorState, selection, entityKey));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const contentHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    try {
      if (isEdit) {
        await blogAPI.update(id!, {
          title,
          content: contentHtml,
          tags: tags.split(",").map((t) => t.trim()),
          image, 
        });
        toast.success("Blog updated successfully!");
      } else {
        await blogAPI.create({ title, content: contentHtml, tags: tags.split(",").map((t) => t.trim()), image });
        toast.success("Blog created successfully!");
      }
      navigate("/blogs");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">{isEdit ? "Edit Blog" : "Create Blog"}</h2>

     
        <div className="flex gap-2 mb-3">
  {toolbarButtons.map((btn, id) => (
    <button
      key={id}
      type="button"
      onClick={btn.action}
      className="px-2 py-1 border rounded hover:bg-blue-200"
    >
      {btn.label}
    </button>
  ))}
</div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border p-2 rounded"
          required
        />

        <div className="border p-2 rounded min-h-[150px]">
          <Editor
            editorState={editorState}
            onChange={setEditorState}
            placeholder="Write your blog content..."
          />
        </div>

        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags..."
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="image"
          placeholder="Paste image URl"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          {isEdit ? "Update Blog" : "Create Blog"}
        </button>
      </form>
    </div>
  );
};

export default BlogForm;