"use client";

import { useState } from "react";
import { CohereClient } from "cohere-ai";
import { QdrantClient } from "@qdrant/js-client-rest";

const cohere = new CohereClient({
  token: "ecAd4ey68yP6hbEy07kSevtYEFHs6J4I4itGiI9J"
});

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<"input" | "context">("input");
  const [prompt, setPrompt] = useState<string>(""); // Stores the prompt text
  const [selectedAdTypes, setSelectedAdTypes] = useState<string[]>([]); // Stores selected ad types
  const [files, setFiles] = useState<File[]>([]); // Stores uploaded files


  const handleAdTypeChange = (adType: string) => {
    setSelectedAdTypes((prev) =>
      prev.includes(adType)
        ? prev.filter((type) => type !== adType)
        : [...prev, adType]
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const uploadedFiles = Array.from(event.target.files);
      setFiles((prev) => [...prev, ...uploadedFiles]);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!prompt) {
        alert("Prompt is required.");
        return;
      }

      console.log('Sending data:', {
        prompt,
        selectedAdTypes,
        files: files.map(f => f.name)
      });

      const response = await fetch('/api/qdrant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          selectedAdTypes,
          files: files.map(f => f.name)
        })
      });

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
      }

      const data = JSON.parse(responseText);
      console.log("Data successfully stored:", data);
      alert("Data successfully sent!");
    } catch (error: any) {
      console.error("Full error details:", error);
      alert(`Error: ${error.message || "An unknown error occurred"}`);
    }
  };


  return (
    <div className="bg-white min-h-screen">
      {/* Navbar */}
      <nav className="bg-white px-8 py-4 border-b border-gray-200">
        <div className="text-2xl font-bold text-gray-800">Cognition</div>
        <ul className="flex space-x-8 mt-2">
          <li>
            <a
              href="#why-better"
              className="text-lg text-gray-800 hover:text-green-600 transition-colors"
            >
              Why We're Better
            </a>
          </li>
          <li>
            <a
              href="#partner-program"
              className="text-lg text-gray-800 hover:text-green-600 transition-colors"
            >
              Partner Program
            </a>
          </li>
        </ul>
      </nav>

      {/* Header */}
      <header className="px-8 py-6 border-b border-gray-200">
        <h1 className="text-4xl font-bold text-gray-800">Get Started with Cognition</h1>
        <p className="text-lg text-gray-600 mt-4">
          Choose the right plan for you or manage your file library with ease.
        </p>
      </header>

      {/* Tabs Section */}
      <div className="flex">
        {/* Left Content */}
        <div className="w-2/3 p-8">
          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-6">
            <button
              className={`px-6 py-3 text-lg font-medium ${
                activeTab === "input"
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              onClick={() => setActiveTab("input")}
            >
              Input
            </button>
            <button
              className={`px-6 py-3 text-lg font-medium ${
                activeTab === "context"
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              onClick={() => setActiveTab("context")}
            >
              Context
            </button>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "input" && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Prompt
                </h2>
                <textarea
                  placeholder="Enter your prompt here..."
                  className="w-full p-3 border border-gray-300 bg-white mb-6"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <h3 className="text-xl font-medium text-gray-800 mb-4">
                  Ad Types
                </h3>
                <ul className="space-y-3">
                  {["Banner Ad", "Video Ad", "Text Ad", "Interactive Ad"].map(
                    (adType) => (
                      <li key={adType} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={selectedAdTypes.includes(adType)}
                          onChange={() => handleAdTypeChange(adType)}
                        />
                        <label className="text-lg">{adType}</label>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
            {activeTab === "context" && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Upload Files
                </h2>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="block w-full p-2 border border-gray-300 bg-white mb-4"
                />
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Uploaded Files:
                </h3>
                {files.length > 0 ? (
                  <ul className="space-y-2">
                    {files.map((file, index) => (
                      <li key={index} className="text-gray-700">
                        {file.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No files uploaded yet.</p>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Submit
          </button>
        </div>

        {/* Right Graphic */}
        <div className="w-1/3 p-8 border-l border-gray-700">
          <pre className="text-gray-500 text-sm">
{`
     <<<<<<
    .  . . ^-  ^+=^
   --++++++++++>k+-->
  ^+=+++++++++=++
   +++++++++++=^
`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
