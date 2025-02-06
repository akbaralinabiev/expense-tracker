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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ChartView({ expenses }) {
  // Function to get the day of the month from a date
  const getDayOfMonth = (date) => {
    return date.getDate(); // Get the day of the month (1-31)
  };

  const data = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const dayOfMonth = getDayOfMonth(date); 

    acc[dayOfMonth] = (acc[dayOfMonth] || 0) + expense.amount; 
    return acc;
  }, {});

  const daysOfMonth = Array.from({ length: 31 }, (_, index) => index + 1);
  const chartLabels = daysOfMonth.map((day) => `Day ${day}`);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Daily Expenses", 
        data: daysOfMonth.map((day) => data[day] || 0), 
        backgroundColor: "#4CAF50",
        borderRadius: 5, 
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
