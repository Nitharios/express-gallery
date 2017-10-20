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
const saltRounds = 12;

const db = require('./models');
const Gallery = db.gallery;
const User = db.user;

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
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { next(); }
  else { res.redirect('/'); }
}

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

app.get('/login', (req, res) => {
  return res.render('partials/login');
})
  .post('/login', passport.authenticate('local', {
    successRedirect : '/secret',
    failureRedirect : '/'
  }));

app.get('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
  /*res.redirect('/gallery');*/
});

app.get('/secret', isAuthenticated, (req, res) => {
  console.log('req.user: ', req.user);
  console.log('req.user.id: ', req.user.id);
  console.log('req.username: ', req.user.username);
  console.log('req.user.password: ', req.user.password);
  res.send('you found the secret!');
});

app.get('/register', (req, res) => {
  return res.render('partials/register');
})
  .post('/register', (req, res) => {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        db.user.create({
          username : req.body.username,
          password : hash
        })
        .then(user => {
          console.log(user);
          res.redirect('/');
        })
        .catch(err => { return res.send('stupid username'); });
      });
    });
  });

app.get('/gallery', (req, res) => {
  return Gallery.findAll()
    .then(galleryInformation => {
      // let info = galleryInformation[0].dataValues.link;
      // console.log('here', galleryInformation);
      // console.log(info);
      return res.render('partials/gallery', { galleryInformation });
    });
  })
  .post('/gallery', (req, res) => {
    /*{user: string, link: string, description: string}*/
    const user = req.body.user;
    const link = req.body.link;
    const description = req.body.description;

    return Gallery.create({
      link : link,
      description : description,
      userId : req.user.id
    })
      .then(newPicture => {
        console.log('POSTED');
        return res.redirect('/gallery');
      });
  });

app.get('/gallery/new', isAuthenticated, (req, res) => {
  return res.render('partials/new');
});

app.get('/gallery/:id', (req, res) => {
  const id = req.params.id;
  return Gallery.findById(id) 
    .then(pictureInformation => {
      let details = pictureInformation.dataValues;

      return res.render('partials/gallery_single', details);
    });
  })
  .put('/gallery/:id', isAuthenticated, (req, res) => {
    console.log('req.id : ', req.body.id);
    const id = req.params.id;
    const data = req.body; 
    /*{user: string, link: string, description: string}*/
    return Gallery.findById(id)
      .then(pictureInformation => {
        console.log('Gallery ID: ', pictureInformation.usersId);
        let updateObject = {};
        //how to handle user-gallery association in model?
        /*if (data.user) Gallery.update({ 
          user : data.user }, {
            where : { id : id }
          });*/
        if (data.link) {
          console.log('Here: ', data.link);
          Gallery.update({ 
          link : data.link }, {
            where : { id : id }
          });
        }//end if
        if (data.description) Gallery.update({ description : data.description}, {
            where : { id : id }
          });

        console.log('UPDATED');
        return res.redirect(`/gallery/${id}`);
      });
  })
  .delete('/gallery/:id', isAuthenticated, (req, res) => {
    const id = req.params.id;
    return Gallery.findById(id)
      .then((pictureInformation) => {
        Gallery.destroy({ where : {
          id : id
        }});
        console.log('DELETED');
        return res.redirect('/gallery');
      });
  });

app.get('/gallery/:id/edit', (req, res) => {
  const id = req.params.id;
  return Gallery.findById(id)
    .then(pictureInformation => {
      let details = pictureInformation.dataValues;
      console.log(details);

      return res.render('partials/edit', details);
    });
});

app.listen(PORT, () => {
  db.sequelize.sync({ force: false });
  console.log('Server running on ' + PORT);
});
