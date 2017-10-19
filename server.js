/* jshint esversion:6 */

const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 8080; //change?

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

/*ROUTES*/
app.get('/', (req, res) => {
  res.json('Hello World!');
});

//GET to view a list of gallery photos
app.get('/gallery', (req, res) => {

});

//GET/gallery/:id to see a single photo
app.get('/gallery/:id', (req, res) => {
  const id = req.params.id;
});

//GET/gallery/new to see a 'new photo' form
app.get('/gallery/new');

//POST/gallery : create a new gallery photo i
app.post('/gallery', (req, res) => {

});

//GET/gallery/:id/edit : see a form to edit a gallery identified by :id
//fields are: author : text, link : Text(image URL), descrip : TextArea
app.get('/gallery/:id/edit', (req, res) => {
  const id = req.params.id;
});

//PUT/gallery/:id : updates a single gallery photo identified by :id
app.put('/gallery/:id', (req, res) => {
  const id = req.params.id;
});

//DELETE/gallery/:id : deletes a single gallery photo ientified by :id
app.delete('/gallery/:id', (req, res) => {
  const id = req.params.id;
});

app.listen(PORT, () => {
  console.log('Server running on ' + PORT);
});
