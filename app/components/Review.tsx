"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Review() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);

  useEffect(() => {
    const promptParam = searchParams.get('prompt');
    const filesParam = searchParams.get('files');

    if (promptParam && filesParam) {
      setPrompt(promptParam);
      setFiles(JSON.parse(filesParam));
    } else {
      router.push("/");
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen bg-black text-white p-10 font-raleway">
      {/* Left Section */}
      <div className="flex flex-col w-1/2 space-y-6">
        <h1 className="text-4xl font-bold mb-4">Review Your Submission</h1>

        {/* Display Prompt */}
        <div>
          <h2 className="text-xl mb-4">Prompt:</h2>
          <p className="bg-gray-800 p-4 rounded-md border border-white">
            {prompt}
          </p>
        </div>

        {/* Display Files */}
        <div>
          <h2 className="text-xl mb-4">Attached Files:</h2>
          <div className="flex flex-col space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="bg-gray-800 text-white px-4 py-2 rounded-md border border-white"
              >
                {file.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex justify-center items-center w-1/2">
        {files.find((file) => file.url.endsWith("png") || file.url.endsWith("jpg")) && (
          <div className="relative w-96 h-96 border-2 border-white">
            <img
              src={
                files.find((file) =>
                  file.url.endsWith("png") || file.url.endsWith("jpg")
                )?.url || ""
              }
              alt="Preview"
              className="w-full h-full object-contain"
            />
            <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md">
              <span className="text-black font-bold">Cursor.sh</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
