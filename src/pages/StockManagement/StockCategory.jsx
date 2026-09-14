import React, { useState } from "react";
import TotalAvailableStock from "./TotalAvailableStock";
import TotalAssignedStock from "./TotalAssignedStock";
import AssignToEngineer from "./AssignToEngineer";
import AssignToUser from "./AssignToUser";

export default function StockCategory() {
  const [activeTab, setActiveTab] = useState("available");

  const renderContent = () => {
    switch (activeTab) {
      case "available":
        return <TotalAvailableStock />;
      case "assigned":
        return <TotalAssignedStock />;
      case "assign-engineer":
        return <AssignToEngineer />;
      case "assign-user":
        return <AssignToUser />;
      default:
        return <TotalAvailableStock />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">Stock Category</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and assign your stock items efficiently</p>
        
        <div className="flex space-x-6 mt-6">
          <button
            onClick={() => setActiveTab("available")}
            className={`pb-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "available" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Total Available Stock
          </button>
          <button
            onClick={() => setActiveTab("assigned")}
            className={`pb-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "assigned" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Total Assigned Stock
          </button>
          <button
            onClick={() => setActiveTab("assign-engineer")}
            className={`pb-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "assign-engineer" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Assign to Engineer
          </button>
          <button
            onClick={() => setActiveTab("assign-user")}
            className={`pb-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "assign-user" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Assign to User
          </button>
        </div>
      </div>
      
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
}
