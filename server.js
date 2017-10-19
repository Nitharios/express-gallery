/* jshint esversion:6 */

const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 8080; //change?
const db = require('./models');
const Gallery = db.gallery;

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

/*ROUTES*/
app.get('/', (req, res) => {
  return res.render('views/partials/index');
});

//GET to view a list of gallery photos
app.get('/gallery', (req, res) => {
  return Gallery.findAll()
    .then(pictures => {
      return res.json(pictures);
    });
});

//GET/gallery/:id to see a single photo
app.get('/gallery/:id', (req, res) => {
  const id = req.params.id;
  return Gallery.findById(id) 
    .then(picture => {
      return res.json(picture);
    });
});

//GET/gallery/new to see a 'new photo' form
app.get('/gallery/new', (req, res) => {
  return res.render('/views/partials/new');
});

//GET/gallery/:id/edit : see a form to edit a gallery identified by :id
//fields are: author : text, link : Text(image URL), descrip : TextArea
app.get('/gallery/:id/edit', (req, res) => {
  const id = req.params.id;
  return Gallery.findById(id)
    .then(picture => {
      return res.json(picture);
    })
});

//POST/gallery : create a new gallery photo i
app.post('/gallery', (req, res) => {
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
      console.log('POST is done');
      return res.json(newPicture);
    });
});

//PUT/gallery/:id : updates a single gallery photo identified by :id
app.put('/gallery/:id', (req, res) => {
  const id = req.params.id;
  const data = req.body; 
  //{author: string, link: string, description: string}
  let updateObject = {};
  if (data.author) updateObject.author = data.author;
  if (data.link) updateObject.link = data.link;
  if (data.description) updateObject.description = data.description; 

  return Gallery.update({
    
  })
    .then( {

    });
});

//DELETE/gallery/:id : deletes a single gallery photo ientified by :id
app.delete('/gallery/:id', (req, res) => {
  const id = req.params.id;
});



app.listen(PORT, () => {
  console.log('Server running on ' + PORT);
});
