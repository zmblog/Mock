"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ThreeDGraphics from "../components/3Dgraphics"; // Import the 3D logo component

export default function Review() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<{ name: string; url: string; color: string }[]>([]);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [adIntention, setAdIntention] = useState("");
  const [canGenerateImage, setCanGenerateImage] = useState(false);

  const adIntentions = [
    { label: "Awareness", color: "bg-blue-500" },
    { label: "Engagement", color: "bg-green-500" },
    { label: "Conversions", color: "bg-red-500" },
    { label: "Lead Generation", color: "bg-yellow-500" },
  ];

  useEffect(() => {
    const promptParam = searchParams.get("prompt");
    const filesParam = searchParams.get("files");

    if (promptParam && filesParam) {
      setPrompt(promptParam);
      setFiles(JSON.parse(filesParam));
    } else {
      router.push("/");
    }
  }, [searchParams, router]);

  useEffect(() => {
    // Enable image generation if all fields are filled
    if (url && title && adIntention) {
      setCanGenerateImage(true);
    } else {
      setCanGenerateImage(false);
    }
  }, [url, title, adIntention]);

  const handleContinue = () => {
    const queryParams = new URLSearchParams({ title });
    router.push(`/next-step?${queryParams.toString()}`);
  };
  

  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen bg-black text-white p-10">
      {/* 3D Logo */}
      <div className="absolute top-4 left-4 w-20 h-20">
        <ThreeDGraphics />
      </div>

      <div className="flex w-full max-w-6xl items-start space-x-10">
        {/* Left Section */}
        <div className="flex flex-col w-1/2 space-y-6">
          <h1 className="text-4xl font-bold">Review Your Submission</h1>

          {/* Display Prompt */}
          <div>
            <h2 className="text-xl mb-4">Prompt:</h2>
            <p className="bg-black text-white border-2 border-white p-4">
              {prompt}
            </p>
          </div>

          {/* Display Files */}
          <div>
            <h2 className="text-xl mb-4">Attached Files:</h2>
            <div className="flex flex-wrap gap-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 text-black font-semibold border-2 border-white ${file.color}`}
                >
                  {file.name}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Inputs */}
          <div>
            <h2 className="text-xl mb-4">Additional Details:</h2>
            {/* URL Input */}
            <input
              type="text"
              className="w-full bg-black text-white border-2 border-white p-2 mb-4"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            {/* Title Input */}
            <input
              type="text"
              className="w-full bg-black text-white border-2 border-white p-2 mb-4"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {/* Ad Intention Dropdown */}
            <select
              className={`w-full bg-black text-white border-2 border-white p-2 ${
                adIntentions.find((opt) => opt.label === adIntention)?.color || ""
              }`}
              value={adIntention}
              onChange={(e) => setAdIntention(e.target.value)}
            >
              <option value="" className="bg-black">
                Select Ad Intention
              </option>
              {adIntentions.map((intention, index) => (
                <option
                  key={index}
                  value={intention.label}
                  className={intention.color}
                >
                  {intention.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center w-1/2">
          {/* Image Box and Continue Button Container */}
          <div className="flex flex-col items-center w-[550px] space-y-4">
            {/* Image Box */}
            <div className="relative w-full h-[445px] border-2 border-white flex items-center justify-center">
              {canGenerateImage ? (
                <img
                  src="../images/image.png"
                  alt="Generated Image"
                  className="w-full h-full object-contain"
                />
              ) : (
                <p className="text-white text-center px-4">
                  Fill in the remaining details to generate an image.
                </p>
              )}
            </div>

            {/* Continue Button */}
            <button
              onClick={() => handleContinue()} // Replace "/next-step" with your next page route
              className="w-full px-6 py-2 bg-black text-white border-2 border-white hover:bg-white hover:text-black transition"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
