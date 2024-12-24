// db.js for managing IndexedDB (local storage of expenses)
const dbName = "expenseTrackerDB";
const storeName = "expenses";

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onerror = (event) => reject(event);
    request.onsuccess = (event) => resolve(event.target.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
      }
    };
  });
};

const saveExpense = async (expense) => {
  const db = await openDB();
  const transaction = db.transaction(storeName, "readwrite");
  const store = transaction.objectStore(storeName);
  store.add(expense);
};

const getExpenses = async () => {
  const db = await openDB();
  const transaction = db.transaction(storeName, "readonly");
  const store = transaction.objectStore(storeName);
  const request = store.getAll();
  return new Promise((resolve) => {
    request.onsuccess = () => resolve(request.result);
  });
};

export { saveExpense, getExpenses };
