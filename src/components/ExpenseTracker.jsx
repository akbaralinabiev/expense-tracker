import React, { useEffect, useState } from "react";
import { getExpenses, saveExpense } from "../utils/db"; // Utility functions for interacting with the database
import { getLocation, getAddressFromCoordinates } from "./LocationService"; // Location-related services
import ChartView from "./ChartView"; // Component for displaying expenses chart
import Settings from "./Settings"; // Component for app settings
import "./main.css"; // Styles for the main component
import {
  requestNotificationPermission,
  showNotification,
} from "../utils/NotificationService"; // Notification utilities

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]); // State to store the list of expenses
  const [balance, setBalance] = useState(0); // State to store the current balance
  const [name, setName] = useState(""); // State to store the expense name
  const [amount, setAmount] = useState(""); // State to store the expense amount
  const [activeTab, setActiveTab] = useState("expenses"); // State to manage active tab (expenses, chart, settings)


  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Fetch expenses from the database on component mount
  useEffect(() => {
    const fetchExpenses = async () => {
      const allExpenses = await getExpenses();
      setExpenses(allExpenses);
    };
    fetchExpenses();
  }, []);

  // Recalculate the balance whenever the expenses list changes
  useEffect(() => {
    const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    setBalance(total);
  }, [expenses]);

  // Handle adding a new expense, including location and notification
  const handleAddExpense = async (e) => {
    e.preventDefault();

    getLocation(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const locationName = await getAddressFromCoordinates(
          latitude,
          longitude
        );

        const newExpense = {
          name,
          amount: parseFloat(amount),
          date: new Date().toISOString(),
          location: locationName,
        };

        try {
          await saveExpense(newExpense); // Save the expense to the database
          setExpenses((prev) => [newExpense, ...prev]); // Update the expenses state
          setName(""); // Clear the input fields
          setAmount("");
          showNotification(newExpense); // Show a notification for the new expense
        } catch (error) {
          console.error("Error adding expense:", error);
        }
      },
      (error) => {
        alert("Failed to get location. Expense added without location.");
        const newExpense = {
          name,
          amount: parseFloat(amount),
          date: new Date().toISOString(),
          location: "Unknown Location",
        };
        saveExpense(newExpense); // Save the expense without location
        setExpenses((prev) => [newExpense, ...prev]);
        setName("");
        setAmount("");
        showNotification(newExpense);
      }
    );
  };

  // Format the date for displaying in a readable format
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Render the appropriate view based on the active tab
  const renderView = () => {
    switch (activeTab) {
      case "expenses":
        return (
          <div className="expense-tracker_header">
            {/* Header for adding a new expense */}
            <div className="header">
              <div className="header-container">
                <h1 className="header-title">Add New Expense</h1>
                <p>${balance.toFixed(2)}</p> {/* Display the current balance */}
              </div>
              <form className="expense-form" onSubmit={handleAddExpense}>
                <input
                  type="text"
                  placeholder="Expense Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                <button type="submit">Add Expense</button>
              </form>
            </div>
            {/* Display the list of expenses */}
            <div className="expenses">
              <h2>Expenses</h2>
              {expenses.map((expense) => (
                <div className="expense-item" key={expense.id}>
                  <div className="expense-info">
                    <div className="expense-name">{expense.name}</div>
                    <span className="expense-date">
                      {formatDate(expense.date)}
                    </span>
                  </div>
                  <div className="expense-price-location-info">
                    <div className="expense-price">${expense.amount}</div>
                    <div className="expense-location">
                      {expense.location || "Location not available"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="notification-container"></div>{" "}
            {/* Placeholder for notifications */}
          </div>
        );

      case "chart":
        return <ChartView expenses={expenses} />; // Render chart view

      case "settings":
        return (
          <Settings
            expenses={expenses}
            setExpenses={setExpenses}
            setBalance={setBalance}
          />
        ); // Render settings view

      default:
        return null;
    }
  };

  return (
    <div className="expense-tracker">
      {/* Navigation tabs to switch between views */}
      <div className="tab-nav">
        <button
          className={activeTab === "expenses" ? "active" : ""}
          onClick={() => setActiveTab("expenses")}
        >
          Expenses
        </button>
        <button
          className={activeTab === "chart" ? "active" : ""}
          onClick={() => setActiveTab("chart")}
        >
          Chart
        </button>
        <button
          className={activeTab === "settings" ? "active" : ""}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </div>
      {renderView()} {/* Render the active view */}
    </div>
  );
}

export default ExpenseTracker;
