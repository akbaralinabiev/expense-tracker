import React from "react";
import * as XLSX from "xlsx";
import { clearExpenses } from "../utils/db";

// Function to export the expenses data as Excel
const exportToExcel = (expenses) => {
  // Convert the expenses data into a format that Excel can understand
  const worksheet = XLSX.utils.json_to_sheet(expenses);

  // Set column widths for better visibility (adjust the width as needed)
  const columnWidths = [
    { wpx: 100 }, // (Expense Name)
    { wpx: 70 }, // (Amount)
    { wpx: 300 }, // (Location or Address)
    { wpx: 130 }, // (Date)
    { wpx: 130 }, // (Time)
  ];

  // Apply column widths to the worksheet
  worksheet["!cols"] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

  // Generate a downloadable Excel file
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
            onClick={() => exportToExcel(expenses)}
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


