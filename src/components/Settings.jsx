import React from "react";
import * as XLSX from "xlsx";
import { clearExpenses } from "../utils/db";

// Function to export the expenses data as Excel
const exportToExcel = (expenses) => {
  console.log("Expenses:", expenses); // Check what the expenses array contains
  if (!Array.isArray(expenses)) {
    console.error("Invalid expenses data");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(
    expenses.map(({ name, amount, date, location }) => ({
      Name: name,
      Amount: `$${amount.toFixed(2)}`,
      Date: new Date(date).toLocaleDateString(),
      Location: location || "Unknown",
    }))
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
  XLSX.writeFile(workbook, "expenses.xlsx");
};


const Settings = ({ expenses, setExpenses, setBalance }) => {
  // Function to handle clearing expenses with sound
  const handleClearExpenses = async () => {
    try {
      // Clear expenses (adjust this based on how you save data)
      await clearExpenses();
      setExpenses([]); // Clear the expenses state
      setBalance(0); // Reset the balance to 0

      // Play a sound when expenses are cleared
      const clearSound = new Audio("/sounds/clear-sound.mp3");
      clearSound.play();
    } catch (error) {
      console.error("Error clearing expenses:", error);
    }
  };

  return (
    <div className="settings-view">
      <div className="settings-container">
        <div className="export-button-field">
          <h3>Export Expenses to Excel</h3>
          <button
            onClick={() => exportToExcel(expenses)} // Directly call the exportToExcel function
            className="export-button"
          >
            Export to Excel
          </button>
        </div>
        <div className="clear-button-field">
          <h3>Clear All Expenses Data</h3>
          <button onClick={handleClearExpenses} className="clear-button">
            Clear Expenses
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
