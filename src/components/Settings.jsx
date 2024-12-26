import React from "react";
import * as XLSX from "xlsx";
import { clearExpenses } from "../utils/db";

// Function to export the expenses data as Excel
const exportToExcel = (expenses) => {
  console.log("Expenses:", expenses); // Check what the expenses array contains
  if (!Array.isArray(expenses)) {
    // Validate if expenses is an array
    console.error("Invalid expenses data"); // Log error if not an array
    return;
  }

  // Convert expenses data to a worksheet format, formatting each entry
  const worksheet = XLSX.utils.json_to_sheet(
    expenses.map(({ name, amount, date, location }) => ({
      Name: name,
      Amount: `$${amount.toFixed(2)}`, // Format amount to 2 decimal places
      Date: new Date(date).toLocaleDateString(), // Format the date to locale format
      Location: location || "Unknown", // Use 'Unknown' if no location is provided
    }))
  );

  // Create a new workbook and append the worksheet to it
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

  // Export the workbook as an Excel file named 'expenses.xlsx'
  XLSX.writeFile(workbook, "expenses.xlsx");
};

const Settings = ({ expenses, setExpenses, setBalance }) => {
  // Function to handle clearing expenses with sound
  const handleClearExpenses = async () => {
    try {
      // Clear expenses (adjust this based on how you save data)
      await clearExpenses(); // Call the function to clear expenses from storage
      setExpenses([]); // Clear the expenses state in the app
      setBalance(0); // Reset the balance to 0

      // Play a sound when expenses are cleared
      const clearSound = new Audio("/sounds/clear-sound.mp3");
      clearSound.play(); // Play the sound to indicate clearing
    } catch (error) {
      console.error("Error clearing expenses:", error); // Log error if clearing fails
    }
  };

  return (
    <div className="settings-view">
      <div className="settings-container">
        {/* Export Expenses Section */}
        <div className="export-button-field">
          <h3>Export Expenses to Excel</h3>
          <button
            onClick={() => exportToExcel(expenses)} // Directly call the exportToExcel function
            className="export-button"
          >
            Export to Excel
          </button>
        </div>

        {/* Clear Expenses Section */}
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
