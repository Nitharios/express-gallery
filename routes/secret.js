/* jshint esversion:6 */
app.get('/secret', isAuthenticated, (req, res) => {
  console.log('req.user: ', req.user);
  console.log('req.user.id: ', req.user.id);
  console.log('req.username: ', req.user.username);
  console.log('req.user.password: ', req.user.password);
  res.send('you found the secret!');
});