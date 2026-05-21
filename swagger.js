const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Online Store API',
    description: 'CSE 341 Project 2 Part 1 - Products and Orders API with validation and error handling.',
  },
  host: 'cse341-project-f3se.onrender.com',
  schemes: ['http', 'https'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js'];

// Generate discovery documentation file
swaggerAutogen(outputFile, endpointsFiles, doc);