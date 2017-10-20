/* jshint esversion:6 */
const express = require('express');
const bodyParser = require('body-parser');
const handlebars= require('express-handlebars');
const methodOverride = require('method-override');
const PORT = process.env.PORT || 8080; //change?

const bcrypt = require('bcrypt');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const saltRounds = 12;

const db = require('./models');
const Gallery = db.gallery;
const User = db.user;

const app = express();

app.engine('hbs', handlebars({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({extended: true}));
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
  console.log('Serializing');
  return done(null, {
    id: user.id,
    username: user.username
  });
});

passport.deserializeUser((user, done) => {
  console.log('Deserializing');
  db.users.findOne({ where : { id : user.id}})
    .then(user => {
      return done(null, user);
    });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    db.users.findOne({ where : {username : username} })
      .then(user => {
        if (user === null) {
          return done(null, false, {message: 'bad username or password'});
        } else {
          bcrypt.compare(password, user.password)
            .then(res => {
              console.log(res);
              if (res) { return done(null, user); }
              else {
                return done(null, false, {message: 'bad username or password'});
              }
            })
        }
      })
      .catch(err => {

      });
}

/*ROUTES*/
app.get('/', (req, res) => {
  return res.render('index');
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
    /*{author: string, link: string, description: string}*/
    const author = req.body.author;
    const link = req.body.link;
    const description = req.body.description;

    return Gallery.create({
      author : author,
      link : link,
      description : description
    })
      .then(newPicture => {
        console.log('POSTED');
        return res.redirect('/gallery');
      });
  });

app.get('/gallery/new', (req, res) => {
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
  .put('/gallery/:id', (req, res) => {
    const id = req.params.id;
    const data = req.body; 
    /*{author: string, link: string, description: string}*/
    return Gallery.findById(id)
      .then(pictureInformation => {
        let updateObject = {};
        //how to handle author-gallery association in model?
        if (data.author) Gallery.update({ 
          author : data.author }, {
            where : { id : id }
          });
        if (data.link) Gallery.update({ 
          link : data.link }, {
            where : { id : id }
          });
        if (data.description) Gallery.update({ description : data.description}, {
            where : { id : id }
          });

        console.log('UPDATED');
        return res.redirect(`/gallery/${id}`);
      });
  })
  .delete('/gallery/:id', (req, res) => {
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
