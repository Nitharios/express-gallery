/* jshint esversion:6 */

/*AUTHENTICATION*/
module.exports = function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { next(); }
  else { res.redirect('/'); }
};