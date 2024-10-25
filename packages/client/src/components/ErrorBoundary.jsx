// Import React to create a component class
import React from "react";

// Define ErrorBoundary component to catch JavaScript errors in its child component tree
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // Initialize state to track if an error has occurred and store error details
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // Static lifecycle method to update state based on the error
  static getDerivedStateFromError(error) {
    // Set hasError to true to display fallback UI on error
    return { hasError: true };
  }

  // Lifecycle method to capture error and additional info about the component stack
  componentDidCatch(error, errorInfo) {
    // Update state with error details to display them in the UI
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // Optional: Log the error to an external service or console for debugging
    console.log(error);
  }

  // Render method to conditionally display fallback UI if an error has occurred
  render() {
    if (this.state.hasError) {
      // Display custom error message and detailed error information
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    // Render children components normally if no error has occurred
    return this.props.children;
  }
}

// Export the ErrorBoundary component for use in other parts of the app
export default ErrorBoundary;
