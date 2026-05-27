const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./config/db');
const routes = require('./routes');
const { handleErrors } = require('./middleware/errorHandler');

// Authentication Dependencies
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

// Swagger Documentation Dependencies
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

const app = express();
const port = process.env.PORT || 8080;

// 1. Core Request Body Parsing Middleware
app.use(bodyParser.json());

// 2. Session Management Configuration Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// 3. Initialize Passport and Track Session States
app.use(passport.initialize());
app.use(passport.session());

// 4. Interactive Swagger UI API Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 5. Global Cross-Origin Resource Sharing (CORS) Security Headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// 6. Passport Strategy Configuration for GitHub OAuth 2.0
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      // Returns the authenticated GitHub user profile data down to serialization
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// 7. Primary Application Routing System
app.use('/', routes);

// 8. Centralized Global Error Handling Middleware (Must sit after all active routes)
app.use(handleErrors);

// 9. Connect to Cloud MongoDB Cluster before starting up the Express Server
mongodb.initDb((err) => {
  if (err) {
    console.log('Database connection failed:', err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to Database and running on port ${port}`);
    });
  }
});