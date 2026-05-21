const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./config/db');
const routes = require('./routes');
const { handleErrors } = require('./middleware/errorHandler');

// Swagger Documentation Dependencies
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

const app = express();
const port = process.env.PORT || 8080;

// 1. Core Request Body Parsing Middleware
app.use(bodyParser.json());

// 2. Interactive Swagger UI API Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 3. Global Cross-Origin Resource Sharing (CORS) Security Headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// 4. Primary Application Routing System
app.use('/', routes);

// 5. Centralized Global Error Handling Middleware (Must sit after all active routes)
app.use(handleErrors);

// 6. Connect to Cloud MongoDB Cluster before starting up the Express Server
mongodb.initDb((err) => {
  if (err) {
    console.log('Database connection failed:', err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to Database and running on port ${port}`);
    });
  }
});