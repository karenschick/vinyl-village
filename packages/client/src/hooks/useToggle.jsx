// Import the useState hook from React
import { useState } from "react";

// Custom hook that provides a boolean toggle functionality
const useToggle = (initialValue = false) => {
  // Initialize state with the provided initial value (default is false)
  const [value, setValue] = useState(initialValue);
  // Function to toggle the value between true and false
  const toggleValue = () => setValue((val) => !val);
  // Return the current value and the toggle function as an array, similar to useState
  return [value, toggleValue];
};

// Export the custom hook for use in other components
export default useToggle;
