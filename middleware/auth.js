const isAuthenticated = (req, res, next) => {
  // Passport automatically attaches an .isAuthenticated() method to the request object
  if (req.isAuthenticated()) {
    return next();
  }
  // If no session exists, block the request immediately with a 401 Unauthorized error
  return res.status(401).json({
    message: 'Unauthorized. You must log in via /login before accessing this endpoint.',
  });
};

module.exports = {
  isAuthenticated,
};