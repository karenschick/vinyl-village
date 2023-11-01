let gitRepoName = require('git-repo-name');
let repoName = gitRepoName.sync("../../");
module.exports = {
  app: {
    name: repoName,
    apiEndpoint: (process.env.API_URL) ? `/${process.env.API_URL}` : '/api',
  },
  database: {
    url: process.env.MONGODB_URI || `mongodb+srv://karenSchick:kenzieDOD082223@cluster0.rnexktn.mongodb.net/?retryWrites=true` + repoName,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'jwt-secret',
    tokenLife: '7d',
  },
}
