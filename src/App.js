import React, { useState } from "react";
import "./App.css";
import AddExpense from "./components/AddExpense";
import ChartView from "./components/ChartView";
import Settings from "./components/Settings";

export default function App() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="app-container">
      {/* Tab navigation */}
      <div className="tab-header">
        <button
          className={activeTab === 0 ? "active" : ""}
          onClick={() => handleTabClick(0)}
        >
          Expenses
        </button>
        <button
          className={activeTab === 1 ? "active" : ""}
          onClick={() => handleTabClick(1)}
        >
          Chart
        </button>
        <button
          className={activeTab === 2 ? "active" : ""}
          onClick={() => handleTabClick(2)}
        >
          Settings
        </button>
      </div>

      {/* Swipeable container */}
      <div
        className="swipeable-container"
        style={{
          transform: `translateX(-${activeTab * 100}%)`,
          transition: "transform 0.3s ease-in-out", // Added transition effect
        }}
      >
        <div className="swipeable-view">
          <AddExpense />
        </div>
        <div className="swipeable-view">
          <ChartView />
        </div>
        <div className="swipeable-view">
          <Settings />
        </div>
      </div>
    </div>
  );
}
