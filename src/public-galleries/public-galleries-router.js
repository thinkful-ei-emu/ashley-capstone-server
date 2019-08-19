const express = require('express');
const logger = require('../logger');
const xss = require('xss')
const publicGalleriesRouter = express.Router();
const bodyParser = express.json();
const PublicGalleriesService = require('./public-galleries-service')
const { requireAuth } = require('../middleware/jwt-auth');

const serializeGallery = gallery => ({
  id: gallery.id,
  name: xss(gallery.name),
  user_id: gallery.user_id  
});

publicGalleriesRouter
.route('/')
.all(requireAuth)
.get((req,res, next) => {
  
  PublicGalleriesService.getAllGalleries(req.app.get('db')) 

  .then(galleries => {     
    return res.json(galleries.map(serializeGallery));
  })
  .catch(next);   
})

.post(requireAuth, bodyParser, (req, res, next) => {
  const {name} = req.body;    
  if (!name)    {     
    logger.error(`gallery 'name' is required`);
    return res.status(400).send({
      error: { message: `gallery 'name' is required` }
    });
  }     
  const newGallery = {name};
  
  newGallery.user_id = req.user.id;
 
  PublicGalleriesService.insertGallery(
    req.app.get('db'),
    newGallery
  )
    .then(gallery => {
      logger.info(`Gallery with id ${gallery.id} was created`);
      res.status(201).location(`/api/galleries/${gallery.id}`).json(serializeGallery(gallery));
    })
    .catch(next);

});
publicGalleriesRouter
.route('/:gallery_id')
.all(requireAuth)
.all((req, res, next) => {
  const { gallery_id } = req.params;
  PublicGalleriesService.getById(req.app.get('db'), gallery_id)    
    .then(gallery => {
      if (!gallery) {
        logger.error(`Gallery with id ${gallery_id} not found.`);
        return res.status(404).json({
          error: { message: `Gallery Not Found` }
        });
      }
      
      res.gallery = gallery;
      next();        
    })
    .catch(next);
})
.get((req,res, next) => {
  res.json(serializeGallery(res.gallery));
})
.delete((req, res, next) => {
  const {gallery_id} = req.params;
  PublicGalleriesService.deleteGallery(
    req.app.get('db'),
    gallery_id
  )
    .then(() => {
      logger.info(`Gallery with id ${gallery_id} deleted`);
       res.status(204).end();
    })
    .catch(next);

})
.patch(bodyParser, (req, res, next) => {
  const {name} = req.body;
  const galleryToUpdate = {name};
  
  if (!name) {
    logger.error(`Invalid update without required fields`)
    return res.status(400).json({
      error: {
        message: `Request body must contain name`
      }
    });
  }
  
  PublicGalleriesService.updateGallery(
    req.app.get('db'),
    req.params.gallery_id,
    galleryToUpdate
  )
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
});



module.exports = publicGalleriesRouter;