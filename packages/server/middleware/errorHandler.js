// Middleware to handle errors in the application
const errorHandler = (error, req, res, next) => {
  // Set local variables to provide error details
  // Expose the error message to the response and detailed error only in development mode
  res.locals.message = error.message;
  res.locals.error = req.app.get("env") === "development" ? error : {};

  // Handle "NotFoundError"
  if (error.name === "NotFoundError") {
    // Respond with a 404 status and a descriptive error message
    return res.status(404).send({
      error: "not found",
    });
  }
  // Handle "CastError"
  else if (error.name === "CastError") {
    // Respond with a 400 status for invalid or malformed ID
    return res.status(400).send({
      error: "malformatted id",
    });
  }
  // Handle "ValidationError"
  else if (error.name === "ValidationError") {
    // Respond with a 400 status and include the validation error message
    return res.status(400).json({
      error: error.message,
    });
  }
  // Handle "JsonWebTokenError"
  else if (error.name === "JsonWebTokenError") {
    // Respond with a 401 status for invalid JSON Web Tokens
    return res.status(401).json({
      error: "invalid token",
    });
  }

  // Pass the error to the next middleware for further processing if not handled above
  next(error);
};
export default errorHandler;