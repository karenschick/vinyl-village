// Function to log information to the console
const info = (...params) => {
  // Check if the current environment is not "test"
  if (process.env.NODE_ENV !== "test") {
    // Log the provided parameters to the console
    console.log(...params);
  }
};

// Middleware function to log incoming requests
const requestLogger = (request, response, next) => {
  // Log the HTTP method of the incoming request
  info("Method:", request.method);
  // Log the path of the incoming request
  info("Path:  ", request.path);
  // Log the body of the incoming request
  info("Body:  ", request.body);
  // Log a separator for clarity in the console output
  info("---");
  // Pass control to the next middleware or route handler
  next();
};

// Export the requestLogger middleware for use in other parts of the application
export default requestLogger;
