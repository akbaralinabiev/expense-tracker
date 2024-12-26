import React, { useEffect, useState } from "react";
import { getExpenses, saveExpense, clearExpenses } from "../utils/db";
import {
  getLocation,
  getAddressFromCoordinates,
}
from "./LocationService";
import ChartView from "./ChartView";
import Settings from "./Settings";
import "./main.css";
import {
  requestNotificationPermission,
  showNotification,
} from "../utils/NotificationService";

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [balance, setBalance] = useState(0);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [activeTab, setActiveTab] = useState("expenses");

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      const allExpenses = await getExpenses();
      setExpenses(allExpenses);
    };
    fetchExpenses();
  }, []);

  useEffect(() => {
    const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    setBalance(total);
  }, [expenses]);

  const handleAddExpense = async (e) => {
    e.preventDefault();

    getLocation(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Get the address based on the coordinates
        const locationName = await getAddressFromCoordinates(
          latitude,
          longitude
        );

        const newExpense = {
          name,
          amount: parseFloat(amount),
          date: new Date().toISOString(),
          location: locationName, // Add the location name
        };

        try {
          await saveExpense(newExpense);
          setExpenses((prev) => [newExpense, ...prev]);
          setName("");
          setAmount("");
          console.log("Showing notification for expense:", newExpense);
          showNotification(newExpense);
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
          location: "Unknown Location", // If geolocation fails, set default location
        };
        saveExpense(newExpense);
        setExpenses((prev) => [newExpense, ...prev]);
        setName("");
        setAmount("");
        console.log(
          "Showing notification for expense (with no location):",
          newExpense
        );
        showNotification(newExpense);
      }
    );
  };

  const handleClearExpenses = async () => {
    try {
      await clearExpenses();
      setExpenses([]);
      setBalance(0);
    } catch (error) {
      console.error("Error clearing expenses:", error);
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderView = () => {
    switch (activeTab) {
      case "expenses":
        return (
          <div className="expense-tracker_header">
            <div className="header">
              <div className="header-container">
                <h1 className="header-title">Add New Expense</h1>
                <p>${balance.toFixed(2)}</p>
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
            <div className="notification-container"></div>
            <button onClick={handleClearExpenses} className="clear-button">
              Clear Expenses
            </button>
          </div>
        );

      case "chart":
        return <ChartView expenses={expenses} />;

      case "settings":
        return <Settings expenses={expenses} />; 

      default:
        return null;
    }
  };

  return (
    <div className="expense-tracker">
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

      {renderView()}
    </div>
  );
}

export default ExpenseTracker;
