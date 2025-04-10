import dotenv from "dotenv";
// import gitRepoName from "git-repo-name"; // If you need it back later

dotenv.config();

// Export the configuration object for the application
export default {
  app: {
    // Set the application name to the repository name
    // name: repoName, // Uncomment and modify if using gitRepoName
    name: process.env.APP_NAME || "MyApp",
    // Define the API endpoint, defaulting to "/api" if the environment variable is not set
    apiEndpoint: process.env.API_URL ? `/${process.env.API_URL}` : "/api",
  },
  database: {
    // Define the database connection URL, defaulting to a MongoDB Atlas URL if not provided via an environment variable
    url: process.env.MONGODB_URI,

    // Set the database name, defaulting to "albumDataBase" if not provided
    name: process.env.MONGODB_NAME || "albumDataBase",
  },
  jwt: {
    // Set the JWT secret key, defaulting to "jwt-secret" if not provided
    secret: process.env.JWT_SECRET,

    // Define the lifespan of the JWT token
    tokenLife: "7d",
  },
};
