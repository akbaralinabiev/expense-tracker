import Dexie from "dexie";

// Initialize a new Dexie database called "ExpenseDB"
export const db = new Dexie("ExpenseDB");

// Define the schema for the database, specifically the "expenses" store
db.version(1).stores({
  expenses: "++id, name, amount, date", // Define primary key as "id" and other fields
});

// Function to get all expenses from the database
export const getExpenses = async () => {
  return await db.expenses.toArray(); // Return all expenses as an array
};

// Function to save a new expense in the database
export const saveExpense = async (expense) => {
  return await db.expenses.add(expense); // Add a new expense to the "expenses" store
};

// Function to clear the entire database
export const clearExpenses = async () => {
  try {
    // Delete the entire "ExpenseDB" database
    await Dexie.delete("ExpenseDB");
    // Recreate the database and store structure after deletion
    db.version(1).stores({
      expenses: "++id, name, amount, date", // Re-define the schema for the expenses store
    });
    console.log("Database cleared completely!"); // Log success message
  } catch (error) {
    console.error("Error clearing the database:", error); // Log error if the database clearing fails
  }
};
