/* jshint esversion:6 */
const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const PORT = process.env.PORT || 8080; //change?

const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;

const login = require('./routes/login');
const logout = require('./routes/logout');
const register = require('./routes/register');
const gallery = require('./routes/gallery');
const error = require('./routes/error');
const isAuthenticated = require('./scripts/authenticated');

const db = require('./models');
const Gallery = db.gallery;
const User = db.user;
const saltRounds = 12;

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
  secret: "keyboard cat",
  resave: false,
  saveInitialized: false
}));

app.use(express.static('public'));

app.use(passport.initialize());
app.use(passport.session());

/*AUTHENTICATION*/
passport.serializeUser((user, done) => {
  console.log('serializing');
  return done(null, {
    id : user.id,
    username : user.username
  });
});

passport.deserializeUser((user, done) => {
  console.log('deserializing');
  db.user.findOne({ where : { id : user.id} })
    .then(user => {
      return done(null, {
        id : user.id,
        username : user.username
      });
    });
});

passport.use(new LocalStrategy(function(username, password, done) {
  db.user.findOne({ where : { username : username }})
    .then(user => {
      if (user === null) {
        return done(null, false, { message : 'bad username or password' });
      }
      else {
        bcrypt.compare(password, user.password)
          .then(res => {
            console.log(res);
            // res 'basically' tells you TRUE or FALSE
            if (res) { return done(null, user); }
            else {
              return done(null, false, { message : 'bad username or password'});
            }
          });
      }
    })
    .catch(err => { console.log('error : ', err); });
}));

/*ROUTES*/
app.get('/', (req, res) => {
  return res.render('index', { home : true });
});

app.use('/login', login);
app.use('/logout', logout);
app.use('/register', register);
app.use('/gallery', gallery);
app.use('/error', error);

app.get('/secret', isAuthenticated, (req, res) => {
  console.log('req.user: ', req.user);
  console.log('req.user.id: ', req.user.id);
  console.log('req.username: ', req.user.username);
  console.log('req.user.password: ', req.user.password);
  res.send('you found the secret!');
});

app.listen(PORT, () => {
  db.sequelize.sync({ force: false });
  console.log('Server running on ' + PORT);
});
