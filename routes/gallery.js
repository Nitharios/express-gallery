/* jshint esversion:6 */
const express = require('express');
const router = express.Router();

const isAuthenticated = require('../lib/authenticated');
const db = require('../models');
const Gallery = db.gallery;
const User = db.user; 

router.route('/')
  .get((req, res) => {
    return Gallery.findAll({
      include : [{
        model : User
      }]
    })
    .then(galleryInformation => {
      return res.render('partials/gallery', { galleryInformation });
    })
    .catch(err => {
      return res.redirect('/error');
    });
  })
  .post(isAuthenticated, (req, res) => {
    const user = req.body.user;
    const description = req.body.description;
    const pattern = new RegExp('^(http|https)://');
    let link;

    if (pattern.test(req.body.link)) {
      link = req.body.link;
    } else {
      // NEED to notify user that an error occurred and that they were unable to add a new image to the gallery
      return res.redirect('/gallery');
    }

    return Gallery.create({
      link : link,
      description : description,
      userId : req.user.id
    })
    .then(newPicture => {
      console.log('POSTED');
      return res.redirect(`/gallery/${newPicture.dataValues.id}`);
    })
    .catch(err => {
      return res.redirect('/error');
    });
  });

router.route('/new')
  .get(isAuthenticated, (req, res) => {
    return res.render('partials/images/new');
  });

router.route('/:id')
  .get((req, res) => {
  const id = req.params.id;

  return Gallery.findById(id, { raw : true })
    .then(pictureInformation => {
      return User.findById(pictureInformation.userId, {
        include : [{
          model : Gallery
        }]
      }, { raw : true })
    .then(userInformation => {
      let data = userInformation.dataValues;
      let gallery = data.galleries.filter((element) => {
        return element.dataValues.id !== Number(id);
      });

      let locals = {
        userId : userInformation.id,
        username : userInformation.username,
        id : id,
        link : pictureInformation.link,
        description : pictureInformation.description,
        gallery : gallery
      };
        return res.render('partials/gallery_single', locals);
      });
    })
    .catch(err => {
      return res.redirect('/error');
    });
  })
  .put(isAuthenticated, (req, res) => {
    const id = req.params.id;
    const data = req.body; 
    let pattern = new RegExp('^(http|https)://');
    let link;

    if (pattern.test(data.link)) {
      link = data.link;
    } else {
      return res.redirect('/gallery');
    }

    return Gallery.findById(id)
      .then(pictureInformation => {
        // pictureInformation returns entire object
        return Gallery.update({ 
          link : data.link, 
          description : data.description 
        }, { 
            where : { id : id } 
          })
          .then(data => {
            // data will return id of image
            return res.redirect('/gallery');
          });
      })
      .catch(err => {
        return res.redirect('/error');
      });
  })
  .delete(isAuthenticated, (req, res) => {
    const id = req.params.id;

    return Gallery.findById(id)
      .then((pictureInformation) => {
        Gallery.destroy({ where : {
          id : id
        }})
        .then(() => {
          console.log('DELETED');
          return res.redirect('/gallery');
        });
      })
      .catch(err => {
        return res.redirect('/error');
      });
  });

router.route('/:id/edit')
  .get(isAuthenticated, (req, res) => {
    const id = req.params.id;

    return Gallery.findById(id, {
      include : [{
        model : User
      }]
    })
    .then(pictureInformation => {
      let details = pictureInformation.dataValues;

      if (req.user.id === pictureInformation.userId || req.user.role === 'admin') {
        return res.render('partials/images/edit', details);
      
      } else {
        return res.redirect('/gallery');
      }      
    })
    .catch(err => {
      return res.redirect('/error');
    });
  });

module.exports = router;