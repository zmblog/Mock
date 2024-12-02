"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ThreeDGraphics from "./3Dgraphics"; // Import the 3D logo component

export default function MainPrompt() {
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<{ id: number; name: string; color: string }[]>([]);
  const router = useRouter();

  const handleAttachContext = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const colors = ["bg-blue-500", "bg-red-500", "bg-green-500", "bg-pink-300", "bg-yellow-300"];
      const newFiles = Array.from(e.target.files).map((file, index) => ({
        id: files.length + index,
        name: file.name,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setFiles([...files, ...newFiles]);
    }
  };

  const handleRenameFile = (id: number, newName: string) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === id ? { ...file, name: newName } : file
      )
    );
  };

  const handleView = () => {
    const searchParams = new URLSearchParams({
      prompt,
      files: JSON.stringify(files),
    });
    router.push(`/review?${searchParams.toString()}`);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white p-10">
      {/* 3D Logo */}
      <div className="absolute top-4 left-4 w-20 h-20">
        <ThreeDGraphics />
      </div>

      <h1 className="text-4xl font-bold mb-4">We're building the Admob for AI</h1>
      <h2 className="text-xl mb-6">Provide your prompt and attach context to generate your add!</h2>
      <div className="flex flex-col space-y-6 w-1/2">
        {/* Prompt Box */}
        <textarea
          className="w-full h-40 bg-black text-white border-2 border-white p-4 focus:outline-none"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
        ></textarea>

        <div className="flex items-center space-x-4">
          {/* Attach Files Button */}
          <label className="flex items-center justify-start px-4 py-2 bg-black border-2 border-white text-white cursor-pointer hover:bg-white hover:text-black transition">
            <input
              type="file"
              className="hidden"
              onChange={handleAttachContext}
              multiple
            />
            Attach Context
          </label>

          {/* Attached Files Boxes */}
          <div className="flex flex-wrap gap-2">
            {files.map((file) => (
              <div
                key={file.id}
                className={`px-4 py-2 text-black font-semibold border-2 border-white rounded-sm ${file.color}`}
              >
                <input
                  type="text"
                  value={file.name}
                  className="bg-transparent border-none focus:outline-none text-sm w-full"
                  onChange={(e) => handleRenameFile(file.id, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* View Button */}
        <button
          onClick={handleView}
          className="px-4 py-2 bg-black text-white border-2 border-white hover:bg-white hover:text-black transition"
        >
          View
        </button>
      </div>
    </div>
  );
}
