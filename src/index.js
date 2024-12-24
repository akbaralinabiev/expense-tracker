// index.js (PWA Integration)
import React from "react";
import ReactDOM from "react-dom/client";
import ExpenseTracker from "./components/ExpenseTracker";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/serviceWorker.js")
    .then(() => console.log("Service Worker Registered"))
    .catch((err) => console.error("Service Worker Error:", err));
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ExpenseTracker />
  </React.StrictMode>
);
