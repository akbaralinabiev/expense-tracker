import React, { useEffect, useState } from "react";

// Import the database functions
import { getExpenses, saveExpense } from "../utils/db";

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  // Fetch expenses on initial render
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const allExpenses = await getExpenses();
        setExpenses(allExpenses);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []); // Empty array ensures it's called only once on mount

  // Handle adding a new expense
  const handleAddExpense = async (e) => {
    e.preventDefault();

    const newExpense = {
      name,
      amount: parseFloat(amount), // Convert to number
      date: new Date().toISOString(), // Store the current date
    };

    try {
      await saveExpense(newExpense); // Save to the database
      setExpenses((prevExpenses) => [...prevExpenses, newExpense]); // Update the local state
      setName(""); // Clear the input fields
      setAmount("");
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <div>
      {/* Add New Expense Form */}
      <form onSubmit={handleAddExpense}>
        <h3>Add New Expense</h3>
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

      {/* Expenses List */}
      <h2>Expenses</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.name}: ${expense.amount} on {expense.date}
          </li>
        ))}
      </ul>

      {/* Clear Expenses Button */}
    </div>
  );
}

export default ExpenseTracker;
