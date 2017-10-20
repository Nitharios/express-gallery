/* jshint esversion:6 */
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const router = express.Router();

const db = require('../models');
const Gallery = db.gallery;

const saltRounds = 12;

/*AUTHENTICATION*/
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { next(); }
  else { res.redirect('/'); }
}

router.route('/')
  .get((req, res) => {
    return Gallery.findAll()
      .then(galleryInformation => {
        console.log('in gallery root');

        return res.render('partials/gallery', { galleryInformation });
    });
  })
  .post(isAuthenticated, (req, res) => {
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

router.route('/new')
  .get(isAuthenticated, (req, res) => {
    return res.render('partials/new');
  });

router.route('/:id')
  .get((req, res) => {
  const id = req.params.id;

  return Gallery.findById(id) 
    .then(pictureInformation => {
      let details = pictureInformation.dataValues;
      console.log('details', details);

      return res.render('partials/gallery_single', details);
    });
  })
  .put(isAuthenticated, (req, res) => {
    console.log('req.id : ', req.body.id);

    const id = req.params.id;
    const data = req.body; 
    /*{user: string, link: string, description: string}*/
    return Gallery.findById(id)
      .then(pictureInformation => {
        // pictureInformation returns entire object
        return Gallery.update({ 
          link : data.link, 
          description : data.description 
        }, { 
          
          where : { id: id } 
          })
          .then(data => {
            // data will return id of image
            return res.redirect('/gallery');
          });
      });
  })
  .delete(isAuthenticated, (req, res) => {
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

router.route('/:id/edit')
  .get(isAuthenticated, (req, res) => {
    const id = req.params.id;

    return Gallery.findById(id)
      .then(pictureInformation => {
        let details = pictureInformation.dataValues;

        if (req.user.id === pictureInformation.id) {

          console.log('details', details);
          return res.render('partials/edit', details);
        
        } else {
          return res.redirect('gallery');
        }      
      });
  });

module.exports = router;