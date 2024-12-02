"use client"; // Add this at the very top

import { useState } from "react";
import TabContent from "./TabContent";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState<"individual" | "context">(
    "individual"
  );

  return (
    <div className="px-8">
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 text-lg font-medium ${
            activeTab === "individual"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("individual")}
        >
          Individual
        </button>
        <button
          className={`px-4 py-2 text-lg font-medium ${
            activeTab === "context"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("context")}
        >
          Context
        </button>
      </div>
      <TabContent activeTab={activeTab} />
    </div>
  );
};

export default Tabs;
