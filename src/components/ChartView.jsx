import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart elements with ChartJS
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ChartView({ expenses }) {
  // Function to get the day of the month from a date
  const getDayOfMonth = (date) => {
    return date.getDate(); // Get the day of the month (1-31)
  };

  // Group expenses by day of the month and calculate the total for each day
  const data = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const dayOfMonth = getDayOfMonth(date); // Get the day of the month

    // Create a key for the day (e.g., "1", "2", "3", etc.)
    acc[dayOfMonth] = (acc[dayOfMonth] || 0) + expense.amount; // Accumulate the expense for the same day
    return acc;
  }, {});

  // Generate labels for the 30 or 31 days of the month
  const daysOfMonth = Array.from({ length: 31 }, (_, index) => index + 1); // Create an array with days of the month
  const chartLabels = daysOfMonth.map((day) => `Day ${day}`); // Label each day

  // Create chart data
  const chartData = {
    labels: chartLabels, // Set the chart labels (days of the month)
    datasets: [
      {
        label: "Daily Expenses", // Label for the dataset
        data: daysOfMonth.map((day) => data[day] || 0), // Set value 0 for days with no expenses
        backgroundColor: "#4CAF50", // Set the color for the chart bars
        borderRadius: 5, // Rounded corners for the bars
      },
    ],
  };

  return (
    <div className="chart-container">
      <div className="bar">
        <h2>Expense Chart</h2>
        <Bar data={chartData} options={options} />{" "}
        {/* Render the Bar chart with data and options */}
      </div>
    </div>
  );
}

// Chart options for customization (e.g., enabling the legend and setting Y-axis to start from zero)
const options = {
  responsive: true, // Make the chart responsive to screen size
  plugins: {
    legend: {
      display: true, // Display the legend in the chart
    },
  },
  scales: {
    y: {
      beginAtZero: true, // Start the Y-axis at 0
    },
  },
};
