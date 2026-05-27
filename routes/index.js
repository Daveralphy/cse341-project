const express = require('express');
const router = express.Router();
const passport = require('passport');

// Dynamic home route message showing session login status
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Welcome to the Online Store API! Status: Logged In as ${req.user.username || req.user.displayName}. Access documentation via /api-docs`);
  } else {
    res.send('Welcome to the Online Store API! Status: Logged Out. Access documentation via /api-docs or log in via /login');
  }
});

// Base Authentication Endpoint Handlers mapped securely to router tree
router.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/api-docs' }),
  (req, res) => {
    // Session is established successfully. Redirect user to passport status checking path.
    res.redirect('/auth/status');
  }
);

router.get('/auth/status', (req, res) => {
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
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({ authenticated: false, message: 'Successfully logged out.' });
  });
});

// Primary collection routing maps
router.use('/products', require('./products'));
router.use('/orders', require('./orders'));

module.exports = router;