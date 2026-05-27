const express = require('express');
const router = express.Router();
const passport = require('passport');

// Dynamic home route message showing session login status
router.get('/', (req, res) => {
  // #swagger.ignore = true
  if (req.isAuthenticated()) {
    res.send(`Welcome to the Online Store API! Status: Logged In as ${req.user.username || req.user.displayName}. Access documentation via /api-docs`);
  } else {
    res.send('Welcome to the Online Store API! Status: Logged Out. Access documentation via /api-docs or log in via /login');
  }
});

// Base Authentication Endpoint Handlers (Hidden from Swagger UI display)
router.get('/login', (req, res, next) => {
  // #swagger.ignore = true
  next();
}, passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/auth/github/callback',
  (req, res, next) => {
    // #swagger.ignore = true
    next();
  },
  passport.authenticate('github', { failureRedirect: '/api-docs' }),
  (req, res) => {
    res.redirect('/auth/status');
  }
);

router.get('/auth/status', (req, res) => {
  // #swagger.ignore = true
  if (req.isAuthenticated()) {
    res.status(200).json({
      authenticated: true,
      user: {
        username: req.user.username,
        displayName: req.user.displayName,
        id: req.user.id,
      },
    });
  } else {
    res.status(200).json({ authenticated: false, message: 'No active session found.' });
  }
});

router.get('/logout', (req, res, next) => {
  // #swagger.ignore = true
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({ authenticated: false, message: 'Successfully logged out.' });
  });
});

// Primary collection routing maps (Visible and testable in Swagger UI)
router.use('/products', require('./products'));
router.use('/orders', require('./orders'));

module.exports = router;