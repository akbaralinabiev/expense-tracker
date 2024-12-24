import React, { useEffect, useState } from "react";
import { getExpenses, saveExpense, clearExpenses } from "../utils/db";
import ChartView from "./ChartView";
import "./main.css";

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [balance, setBalance] = useState(0);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [activeTab, setActiveTab] = useState("expenses");

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
    const newExpense = {
      name,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
    };

    try {
      await saveExpense(newExpense);
      setExpenses((prev) => [newExpense, ...prev]);
      setName("");
      setAmount("");
    } catch (error) {
      console.error("Error adding expense:", error);
    }
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

  // Render based on active tab
  const renderView = () => {
    switch (activeTab) {
      case "expenses":
        return (
          <div className="expense-tracker_header">
            <div className="header">
              <h1 className="header-title">Add New Expense</h1>
              <p>${balance.toFixed(2)}</p>
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
                   <span className="expense-date">{formatDate(expense.date)}</span>
                 </div>
                 <div className="expense-price">${expense.amount}</div>
               </div>
              ))}
            </div>

            <button onClick={handleClearExpenses} className="clear-button">
              Clear Expenses
            </button>
          </div>
        );

      case "chart":
        return <ChartView expenses={expenses} />;

      case "settings":
        return (
          <div className="settings-view">
            <h2>Settings</h2>
            <p>Feature coming soon...</p>
          </div>
        );

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

      {/* Render Current View */}
      {renderView()}
    </div>
  );
}

export default ExpenseTracker;
