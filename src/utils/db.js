import Dexie from "dexie";

export const db = new Dexie("ExpenseDB");
db.version(1).stores({
  expenses: "++id, name, amount, date",
});

export const getExpenses = async () => {
  return await db.expenses.toArray();
};

export const saveExpense = async (expense) => {
  return await db.expenses.add(expense);
};

// utils/db.js (or wherever you handle the database)
// utils/db.js
export const clearExpenses = async () => {
  try {
    await Dexie.delete("ExpenseDB");  // Delete the entire database
    // Recreate the database and store structure
    db.version(1).stores({
      expenses: "++id, name, amount, date",
    });
    console.log("Database cleared completely!");
  } catch (error) {
    console.error("Error clearing the database:", error);
  }
};

