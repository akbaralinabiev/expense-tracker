import React from "react";
import * as XLSX from "xlsx";

// Function to export the expenses data as Excel
const exportToExcel = (expenses) => {
  // Convert the expenses data into a format that Excel can understand
  const worksheet = XLSX.utils.json_to_sheet(expenses);

  // Set column widths for better visibility (adjust the width as needed)
  const columnWidths = [
    { wpx: 100 }, // (Expense Name)
    { wpx: 70 }, // (Amount)
    { wpx: 130 }, // (Location or Address)
    { wpx: 300 }, // (Date)
  ];

  // Apply column widths to the worksheet
  worksheet["!cols"] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

  // Generate a downloadable Excel file
  XLSX.writeFile(workbook, "expenses.xlsx");
};

const Settings = ({ expenses }) => {
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
      </div>
    </div>
  );
};

export default Settings;
