const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Online Store API',
    description: 'CSE 341 Project 2 - Products and Orders API secured with GitHub OAuth 2.0 authentication, structural data validation, and global error handling filters.',
  },
  host: 'cse341-project-f3se.onrender.com',
  schemes: ['https', 'http'],
  securityDefinitions: {
    GitHubOAuth: {
      type: 'oauth2',
      authorizationUrl: 'https://github.com/login/oauth/authorize',
      flow: 'implicit',
      scopes: {
        'user:email': 'Access to read your primary account profile email address directly from GitHub'
      }
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js'];

// Generate discovery documentation file
swaggerAutogen(outputFile, endpointsFiles, doc);