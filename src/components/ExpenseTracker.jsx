import React, { useEffect, useState } from "react";
import { getExpenses, saveExpense, clearExpenses } from "../utils/db";
import "./ExpenseTracker.css";

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [balance, setBalance] = useState(0);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

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
      setExpenses();
      setBalance(0);
    } catch (error) {
      console.error("Error clearing expenses:", error);
    }
  };

  // Function to format date and time
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleString(undefined, options);
  };

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
        <div className="list-title">
          <h2>Expenses</h2>
        </div>
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
      {/* Button to clear all expenses */}
      <button onClick={handleClearExpenses} className="clear-button">
        Clear Expenses
      </button>
    </div>
  );
}

export default ExpenseTracker;
