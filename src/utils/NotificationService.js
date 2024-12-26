// Request notification permission if not granted
export const requestNotificationPermission = async () => {
  try {
    // Check if notification permission is not already granted
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();

      // Handle the permission response
      if (permission !== "granted") {
        console.warn("Notification permission denied.");
      } else {
        console.log("Notification permission granted.");
        // Play a sound when permission is granted
        const permissionSound = new Audio("/sounds/notification-sound.mp3");
        permissionSound.play();
      }
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
  }
};

// Show notification for a new expense
export const showNotification = (expense) => {
  // Play sound for showing the notification
  const notificationSound = new Audio("/sounds/notification-sound.mp3"
  );
  notificationSound.play();

  // Create the notification element
  const notification = document.createElement("div");
  notification.className = "notification"; // Add notification class for styling
  notification.innerHTML = `
    <strong>${expense.name} - $${expense.amount} added</strong><br />
    Location: ${expense.location || "Unknown"}
  `;

  // Append the notification to the notification container
  const notificationContainer = document.querySelector(".notification-container");
  notificationSound.play();
  if (notificationContainer) {
    notificationContainer.appendChild(notification);

    // Remove notification after animation
    setTimeout(() => {
      notificationContainer.removeChild(notification);
    }, 4500); // Matches fade-out time of 4 seconds + some buffer
  } else {
    console.warn("Notification container not found on the page.");
  }

  if (typeof Notification !== "undefined") {
    // If notifications are supported by the browser
    if (Notification.permission === "granted") {
      // If permission is granted, display the native notification
      new Notification(`${expense.name} - $${expense.amount} added`, {
        body: `Location: ${expense.location || "Unknown"}`,
        icon: "/icons/expense.png",
      });
    } else {
      // Request permission and show native notification if granted
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(`${expense.name} - $${expense.amount} added`, {
            body: `Location: ${expense.location || "Unknown"}`,
            icon: "expense.png",
          });
        }
      }).catch((error) => {
        console.error("Error requesting notification permission:", error);
      });
    }
  } else {
    // Fallback: Show alert if notifications are not supported
    alert(`${expense.name} - $${expense.amount} added`);
  }
};