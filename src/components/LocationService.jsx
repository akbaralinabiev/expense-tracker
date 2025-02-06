// Function to get the user's current geolocation
export const getLocation = (onSuccess, onError) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    onError("Geolocation is not supported by this browser.");
  }
};

// Function to get address from latitude and longitude using OpenCage API
export const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    // Use the OpenCage Geocoder API
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=c46e26ea7963407cbc9a37a163bb0caa`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const address = data.results[0].formatted; // The full address
      return address; // You can also refine this to only return the city or other details
    } else {
      return "Unknown Location"; // Fallback if no address found
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Unknown Location";
  }
};
