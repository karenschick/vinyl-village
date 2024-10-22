// Import the FaSpinner icon from the react-icons library's FontAwesome set for use in the spinner component.
// Import custom CSS styles from the LoadingSpinner.css file to apply styling to the spinner.
import { FaSpinner } from "react-icons/fa";
import "./LoadingSpinner.css";

// Define the LoadingSpinner functional component, which accepts a 'full' prop to determine
// whether to display a full-page spinner or a smaller, inline spinner.
function LoadingSpinner({ full }) {
  // Render a div with a conditional class name. If the 'full' prop is true, it applies the "FullPageSpinner" class,
  // otherwise it applies the "Spinner" class. The FaSpinner component renders the actual spinner icon inside the div.
  return (
    <div className={`${full ? "FullPageSpinner" : "Spinner"}`}>
      <FaSpinner />
    </div>
  );
}

// Export the LoadingSpinner component for use in other parts of the application.
export default LoadingSpinner;
