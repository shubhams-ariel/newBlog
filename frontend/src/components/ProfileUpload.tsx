import React, { useRef, useState } from "react";
import API from "../services/api";

const ProfileUpload: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click(); 
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return alert("Select a file first!");

    const formData = new FormData();
    formData.append("profile", file);

    try {
      const token = localStorage.getItem("token");
      const res = await API.post("/upload-profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Upload successful!");
      localStorage.setItem("profilePic", res.data.profilePic);
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert("Upload failed!");
    }
  };

  return (
    <div className="p-4 border rounded  shadow max-w-md mx-auto mt-10 text-center gap-3">
      <h2 className="text-xl font-bold mb-4">Upload Profile Picture</h2>

     
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

     <div className="flex flex-col items-center justify-center gap-2">
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-blue-600 "
      >
        Choose File
      </button>

      {preview && <img src={preview} alt="preview" className="w-24 h-24 rounded-full mt-2" />}

      <button
        onClick={handleUpload}
        className="mt-2 px-4 py-2 bg-green-900 text-white rounded hover:bg-green-600"
      >
        Upload
      </button>
      </div>
    </div>
  );
};

export default ProfileUpload;
