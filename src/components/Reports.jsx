import React from "react";

function Reports({ expenses }) {
  return (
    <div>
      <h3>Expense Report</h3>
      <ul>
        {expenses.map((expense, index) => (
          <li key={index}>
            {expense.name}: ${expense.amount} on {expense.date}
          </li>
        ))}
      </ul>
      <h4>
        Total Expenses: $
        {expenses
          .reduce((total, expense) => total + expense.amount, 0)
          .toFixed(2)}
      </h4>
    </div>
  );
}

export default Reports;
