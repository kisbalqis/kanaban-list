"use client";
import { useState } from "react";
import KanbanTable from "@/components/KanbanTable";
import KanbanList from "@/components/KanbanList";

export default function Home() {
  
  const [activeTab, setActiveTab] = useState("mainTable");
  const tabs = [
    { id: "mainTable", label: "Main Table" },
    { id: "kanban", label: "Kanban" },
  ];

  return (
    <main className="min-h-screen w-full bg-[#010409] text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex space-x-4 border-b border-gray-700 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`py-2 px-4 text-sm font-medium border-b-2 transition duration-200 ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-white hover:border-gray-500"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="transition-all duration-300 ease-in-out">
          {activeTab === "mainTable" && <KanbanTable />}
          {activeTab === "kanban" && <KanbanList />}
        </div>
      </div>
    </main>
  
  );
}
