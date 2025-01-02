// Import the "git-repo-name" package to retrieve the name of the Git repository
let gitRepoName = require("git-repo-name");
// Get the repository name synchronously from two directory levels above the current file
let repoName = gitRepoName.sync("../../");

// Export the configuration object for the application
module.exports = {
  app: {
    // Set the application name to the repository name
    name: repoName,
    // Define the API endpoint, defaulting to "/api" if the environment variable is not set
    apiEndpoint: process.env.API_URL ? `/${process.env.API_URL}` : "/api",
  },
  database: {
    // Define the database connection URL, defaulting to a MongoDB Atlas URL if not provided via an environment variable
    url:
      process.env.MONGODB_URI ||
      `mongodb+srv://karenSchick:karen@cluster0.rnexktn.mongodb.net/?retryWrites=true`,
    // Set the database name, defaulting to "albumDataBase" if not provided
    name: process.env.MONGODB_NAME || "albumDataBase",
  },
  jwt: {
    // Set the JWT secret key, defaulting to "jwt-secret" if not provided
    secret: process.env.JWT_SECRET || "jwt-secret",
    // Define the lifespan of the JWT token
    tokenLife: "7d",
  },
};
