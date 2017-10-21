/* jshint esversion:6 */
const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const redis = require('connect-redis')(session); 

const authenticatePassport = require('./scripts/auth-pass');
const login = require('./routes/login');
const logout = require('./routes/logout');
const register = require('./routes/register');
const gallery = require('./routes/gallery');
const error = require('./routes/error');
// const isAuthenticated = require('./scripts/authenticated');
const db = require('./models');

const PORT = process.env.PORT || 8080; //change?
// const saltRounds = 12;

const app = express();

app.engine('hbs', handlebars({ 
  defaultLayout : 'main', 
  extname: '.hbs' 
}));

app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(session({
  store: new redis(),
  secret: "keyboard cat",
  resave: false,
  saveInitialized: false
}));

app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

/*ROUTES*/
app.get('/', (req, res) => {
  return res.render('index', { home : true });
});

app.use('/login', login);
app.use('/logout', logout);
app.use('/register', register);
app.use('/gallery', gallery);
app.use('/error', error);

app.listen(PORT, () => {
  db.sequelize.sync({ force: false });
  console.log(`Server running on ${PORT}`);
});