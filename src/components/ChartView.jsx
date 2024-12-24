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

  // Group expenses by day of the month
  const data = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const dayOfMonth = getDayOfMonth(date); // Get the day of the month

    // Create a key for the day (e.g., "1", "2", "3", etc.)
    acc[dayOfMonth] = (acc[dayOfMonth] || 0) + expense.amount;
    return acc;
  }, {});

  // Generate labels for the 30 or 31 days of the month
  const daysOfMonth = Array.from({ length: 31 }, (_, index) => index + 1);
  const chartLabels = daysOfMonth.map((day) => `Day ${day}`);

  // Create chart data
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Daily Expenses",
        data: daysOfMonth.map((day) => data[day] || 0), // Set value 0 for days with no expenses
        backgroundColor: "#4CAF50", // You can customize the color
        borderRadius: 5,
      },
    ],
  };

  return (
    <div className="chart-container">
      <div className="bar">
        <h2>Expense Chart</h2>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};
