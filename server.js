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

//GET to view a list of gallery photos
app.get('/gallery', (req, res) => {
  return Gallery.findAll()
    .then(galleryInformation => {
      return res.render('/partials/gallery', galleryInformation);
    });
  })
  //POST/gallery : create a new gallery photo
  .post('/gallery', (req, res) => {
    //{author: string, link: string, description: string}
    const author = req.body.author;
    const link = req.body.link;
    const description = req.body.description;

    return Gallery.create({
      author : author,
      link : link,
      description : description
    })
      .then(newPicture => {
        return res.render('/partials/gallery', newPicture);
      });
  });

//GET/gallery/new to see a 'new photo' form
app.get('/gallery/new', (req, res) => {
  return res.render('/partials/new');
});

//GET/gallery/:id to see a single photo
app.get('/gallery/:id', (req, res) => {
  const id = req.params.id;
  return Gallery.findById(id) 
    .then(pictureInformation => {
      return res.render('/partials/gallery_single', pictureInformation);
    });
  })
//]PUT/gallery/:id : updates a single gallery photo identified by :id
  .put('/gallery/:id', (req, res) => {
    const id = req.params.id;
    const data = req.body; 
    //{author: string, link: string, description: string}

    return Gallery.findById(id)
      .then(pictureInformation => {
        let updateObject = {};
        //change this to be able to handle author-gallery association
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

        console.log('Picture edited');
        return res.render('/partials/gallery_single', pictureInformation);
      });
  })
  //DELETE/gallery/:id : deletes a single gallery photo ientified by :id
  .delete('/gallery/:id', (req, res) => {
    const id = req.params.id;

    return Gallery.findById(id)
      .then((pictureInformation) => {
        Gallery.destroy({ where : {
          id : id
        }});

        console.log('Picture deleted');
        return res.render('/partials/gallery');
      });
  });

//GET/gallery/:id/edit : see a form to edit a gallery identified by :id
//fields are: author : text, link : Text(image URL), descrip : TextArea
app.get('/gallery/:id/edit', (req, res) => {
  const id = req.params.id;
  return Gallery.findById(id)
    .then(pictureInformation => {
      return res.render('/partials/edit', { pictureInformation });
    });
});

app.listen(PORT, () => {
  db.sequelize.sync({ force: true });
  console.log('Server running on ' + PORT);
});
