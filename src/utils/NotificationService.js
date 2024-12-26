// Function to request notification permission if not already granted
export const requestNotificationPermission = async () => {
  try {
    // Check if notification permission is not granted yet
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission(); // Request permission

      // Handle the permission response
      if (permission !== "granted") {
        console.warn("Notification permission denied."); // Warn if permission denied
      } else {
        console.log("Notification permission granted."); // Log if permission granted
        // Play a sound when permission is granted
        const permissionSound = new Audio("/sounds/notification-sound.mp3");
        permissionSound.play(); // Play sound on permission grant
      }
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error); // Log error if permission request fails
  }
};

// Function to show a notification for a new expense
export const showNotification = (expense) => {
  // Play sound when showing the notification
  const notificationSound = new Audio("/sounds/notification-sound.mp3");
  notificationSound.play();

  // Create the notification element
  const notification = document.createElement("div");
  notification.className = "notification"; // Add notification class for styling
  notification.innerHTML = `
    <strong>${expense.name} - $${expense.amount} added</strong><br />
    Location: ${
      expense.location || "Unknown"
    } // Display expense location or fallback to "Unknown"
  `;

  // Append the notification to the notification container
  const notificationContainer = document.querySelector(
    ".notification-container"
  );
  if (notificationContainer) {
    notificationContainer.appendChild(notification);

    // Remove the notification after 4.5 seconds (matching fade-out time)
    setTimeout(() => {
      notificationContainer.removeChild(notification);
    }, 4500);
  } else {
    console.warn("Notification container not found on the page."); // Warn if notification container is not found
  }

  if (typeof Notification !== "undefined") {
    // If the browser supports notifications
    if (Notification.permission === "granted") {
      // If permission is granted, display the native notification
      new Notification(`${expense.name} - $${expense.amount} added`, {
        body: `Location: ${expense.location || "Unknown"}`, // Show location info in the notification body
        icon: "/icons/expense.png", // Set icon for the notification
      });
    } else {
      // If permission is not granted, request permission and show the notification if granted
      Notification.requestPermission()
        .then((permission) => {
          if (permission === "granted") {
            new Notification(`${expense.name} - $${expense.amount} added`, {
              body: `Location: ${expense.location || "Unknown"}`,
              icon: "/icons/expense.png", // Set icon for the notification
            });
          }
        })
        .catch((error) => {
          console.error("Error requesting notification permission:", error); // Log error if permission request fails
        });
    }
  } else {
    // Fallback: If notifications are not supported, show an alert instead
    alert(`${expense.name} - $${expense.amount} added`);
  }
};
