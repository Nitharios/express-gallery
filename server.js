const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 8080; //change?

app.use(bodyParser.urlencoded({extended: true}));

/*ROUTES*/

//GET to view a list of gallery photos

//GET/gallery/:id to see a single photo

//GET/gallery/new to see a 'new photo' form

//POST/gallery : create a new gallery photo i

//GET/gallery/:id/edit : see a form to edit a gallery identified by :id
//fields are: author : text, link : Text(image URL), descrip : TextArea

//PUT/gallery/:id : updates a single gallery photo identified by :id

//DELETE/gallery/:id : deletes a single gallery photo ientified by :id

app.listen(port, () => {
  console.log('Server running on ' + PORT);
});
