// Function to extract the token from the incoming request
export const getTokenFrom = (request) => {
  // Retrieve the 'authorization' header from the request
  const authorization = request.get("authorization");
  // Check if the authorization header exists and starts with 'Bearer '
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    // Extract and return the token by removing the 'Bearer ' prefix (7 characters)
    return authorization.substring(7);
  }
  // If the authorization header is missing or does not have a valid format, return null
  return null;
};
