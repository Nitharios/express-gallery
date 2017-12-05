/* jshint esversion:6 */
/*AUTHENTICATION*/
module.exports = function isAuthenticated(req, res, next) {
  // will pass on to the next middleware if successfully authenticated
  if (req.isAuthenticated()) { next(); }
  // need to redirect to error page or notify user somehow that permission has been denied
  else { res.redirect('/error'); }
};