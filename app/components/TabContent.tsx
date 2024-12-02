interface TabContentProps {
    activeTab: "individual" | "context";
  }
  
  const TabContent = ({ activeTab }: TabContentProps) => {
    return (
      <div
        className={`rounded-lg p-6 ${
          activeTab === "individual" ? "bg-red-100" : "bg-green-100"
        }`}
      >
        {activeTab === "individual" ? (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Prompt</h2>
            <textarea
              placeholder="Enter your prompt here..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-6"
            />
            <h3 className="text-xl font-medium text-gray-800 mb-4">Ad Types</h3>
            <ul className="space-y-3">
              {["Banner Ad", "Video Ad", "Text Ad", "Interactive Ad"].map(
                (adType) => (
                  <li key={adType} className="flex items-center space-x-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <label className="text-lg text-gray-700">{adType}</label>
                  </li>
                )
              )}
            </ul>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Upload and Manage Context Files
            </h2>
            <input
              type="file"
              multiple
              className="block w-full border border-gray-300 rounded-lg mb-4"
            />
            <p className="text-gray-600">No files uploaded yet.</p>
          </div>
        )}
      </div>
    );
  };
  
  export default TabContent;
  