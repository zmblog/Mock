"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController,
} from "chart.js";
import ThreeDGraphics from "../components/3Dgraphics"; // Import the 3D logo component

// Register necessary Chart.js components
ChartJS.register(
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type GraphType = 'impressions' | 'clicks' | 'cost' | 'ctr';

interface LanguageOption {
  label: string;
  color: string;
}

const languages: LanguageOption[] = [
  { label: "English", color: "bg-blue-200" },
  { label: "Spanish", color: "bg-green-200" },
  // ... other languages
];

const viewLimits = [1, 2, 3, 4, 5, 10, 15, 20]; // Add before the NextPage component

export default function NextPage() {
  const searchParams = useSearchParams();

  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [cpm, setCpm] = useState<string>("");
  const [dailyBudget, setDailyBudget] = useState<string>("");
  const [campaignDuration, setCampaignDuration] = useState<string>("");
  const [dailyViewLimit, setDailyViewLimit] = useState("");
  const [activeGraph, setActiveGraph] = useState<GraphType>('impressions'); // State to track the active graph
  const chartRef = useRef<HTMLCanvasElement>(null);

  const graphs: Record<GraphType, {
    label: string;
    data: number[];
    color: string;
    background: string;
  }> = {
    impressions: {
      label: "Impressions",
      data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 500*0)),
      color: "rgb(251, 207, 232)",
      background: "rgba(251, 207, 232, 0.2)",
    },
    clicks: {
      label: "Clicks",
      data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 50*0)),
      color: "rgb(191, 219, 254)",
      background: "rgba(191, 219, 254, 0.2)",
    },
    cost: {
      label: "Cost",
      data: Array.from({ length: 24 }, () => Math.random() * 100*0),
      color: "rgb(187, 247, 208)",
      background: "rgba(187, 247, 208, 0.2)",
    },
    ctr: {
      label: "CTR (%)",
      data: Array.from({ length: 24 }, () => Math.random() * 10*0),
      color: "rgb(254, 240, 138)",
      background: "rgba(254, 240, 138, 0.2)",
    },
  };

  const pastelColors = [
    "bg-pink-200",
    "bg-blue-200",
    "bg-green-200",
    "bg-yellow-200",
  ];

  // Add chart instance ref
  const chartInstance = useRef<ChartJS | null>(null);

  // Add state for campaign started
  const [campaignStarted, setCampaignStarted] = useState(false);

  // Add state for graph data
  const [graphData, setGraphData] = useState({
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [{
      label: graphs.impressions.label,
      data: graphs.impressions.data,
      borderColor: graphs.impressions.color,
      backgroundColor: graphs.impressions.background,
      tension: 0.4,
    }]
  });

  const handleNumericInput = (value: string, setter: (value: string) => void) => {
    // Allow empty string or numbers only
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  // Initialize chart on mount
  useEffect(() => {
    if (chartRef.current && campaignStarted) {
      const ctx = chartRef.current.getContext("2d");

      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        // Update chart options
        const chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top" as const,
              labels: {
                color: "#ffffff",
              },
            },
          },
          scales: {
            x: {
              ticks: {
                color: "#ffffff",
              },
            },
            y: {
              beginAtZero: true,
              max: 1000,
              ticks: {
                color: "#ffffff",
              },
            },
          },
        };

        // Update the chart initialization
        chartInstance.current = new ChartJS(ctx, {
          type: "line",
          data: graphData,
          options: chartOptions
        });
      }
    }
  }, [campaignStarted, graphData]);

  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen bg-black text-white p-10">
      {/* 3D Logo */}
      <div className="absolute top-4 left-4 w-20 h-20">
        <ThreeDGraphics />
      </div>

      <div className="flex w-full max-w-6xl items-start space-x-10">
        {/* Left Section: Input Fields */}
        <div className="flex flex-col w-1/2 space-y-6">
          <h1 className="text-4xl font-bold">{title}</h1>

          {/* Language Dropdown */}
          <div>
            <h2 className="text-xl mb-4">Select Language:</h2>
            <select
              className={`w-full bg-black text-white border-2 border-white p-2 ${
                languages.find((opt: LanguageOption) => opt.label === language)?.color || ""
              }`}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="" className="bg-black">
                Select Language
              </option>
              {languages.map((lang, index) => (
                <option key={index} value={lang.label} className={lang.color}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* CPM Input */}
          <div>
            <h2 className="text-xl mb-4">Cost Per Thousand Impressions (CPM):</h2>
            <input
              type="text"
              inputMode="decimal"
              className="w-full bg-black text-white border-2 border-white p-2"
              placeholder="Enter CPM"
              value={cpm}
              onChange={(e) => handleNumericInput(e.target.value, setCpm)}
            />
          </div>

          {/* Daily Budget Input */}
          <div>
            <h2 className="text-xl mb-4">Daily Budget:</h2>
            <input
              type="text"
              inputMode="decimal"
              className="w-full bg-black text-white border-2 border-white p-2"
              placeholder="Enter Daily Budget"
              value={dailyBudget}
              onChange={(e) => handleNumericInput(e.target.value, setDailyBudget)}
            />
          </div>

          {/* Campaign Duration Input */}
          <div>
            <h2 className="text-xl mb-4">Campaign Duration (in days):</h2>
            <input
              type="text"
              inputMode="numeric"
              className="w-full bg-black text-white border-2 border-white p-2"
              placeholder="Enter Campaign Duration"
              value={campaignDuration}
              onChange={(e) => handleNumericInput(e.target.value, setCampaignDuration)}
            />
          </div>

          {/* Daily View Limit Dropdown */}
          <div>
            <h2 className="text-xl mb-4">Daily View Limit per User:</h2>
            <select
              className="w-full bg-black text-white border-2 border-white p-2"
              value={dailyViewLimit}
              onChange={(e) => setDailyViewLimit(e.target.value)}
            >
              <option value="">Select View Limit</option>
              {viewLimits.map((limit: number, index: number) => (
                <option key={index} value={limit}>
                  {limit}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Section: Graph Selector and Graph */}
        {!campaignStarted ? (
          <div className="flex flex-col items-center justify-center h-[500px] w-1/2 mt-[4.5rem]">
            <p className="text-gray-400 mb-6 text-lg">Start campaign to generate your analytics</p>
            <button
              onClick={() => setCampaignStarted(true)}
              className="px-8 py-4 bg-white text-black font-semibold hover:bg-gray-200 transition text-lg"
            >
              Start Campaign
            </button>
          </div>
        ) : (
          <div className="flex flex-col w-1/2 space-y-6 mt-[4.5rem]">
            {/* Graph Selector Buttons */}
            <div className="flex space-x-4">
              {Object.keys(graphs).map((graphKey, index) => (
                <button
                  key={graphKey}
                  onClick={() => {
                    setActiveGraph(graphKey as GraphType);
                    setGraphData({
                      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
                      datasets: [{
                        label: graphs[graphKey as GraphType].label,
                        data: graphs[graphKey as GraphType].data,
                        borderColor: graphs[graphKey as GraphType].color,
                        backgroundColor: graphs[graphKey as GraphType].background,
                        tension: 0.4,
                      }]
                    });
                  }}
                  className={`px-4 py-2 text-black font-semibold ${pastelColors[index]} ${
                    activeGraph === graphKey ? "ring-4 ring-blue-300" : ""
                  }`}
                >
                  {graphs[graphKey as GraphType].label}
                </button>
              ))}
            </div>

            {/* Graph */}
            <div className="relative w-full h-[400px]">
              <canvas ref={chartRef} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
