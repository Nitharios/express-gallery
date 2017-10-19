/* jshint esversion:6 */
const express = require('express');
const bodyParser = require('body-parser');
const handlebars= require('express-handlebars');
const methodOverride = require('method-override');
const PORT = process.env.PORT || 8080; //change?

const db = require('./models');
const Gallery = db.gallery;
const Author = db.author;

const app = express();

app.engine('hbs', handlebars({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

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
        return res.render('partials/gallery', { newPicture });
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

        return res.render("partials/gallery_single", {pictureInformation });
      });
  })
  .delete('/gallery/:id', (req, res) => {
    const id = req.params.id;
    return Gallery.findById(id)
      .then((pictureInformation) => {
        Gallery.destroy({ where : {
          id : id
        }});
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
