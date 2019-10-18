const express = require('express');
const logger = require('../logger');
const xss = require('xss')
const galleriesRouter = express.Router();
const bodyParser = express.json();
const GalleriesService = require('./galleries-service')
const { requireAuth } = require('../middleware/jwt-auth');

const serializeGallery = gallery => ({
  id: gallery.id,
  name: xss(gallery.name),
  owner: gallery.owner,
  user_id: gallery.user_id  
});

galleriesRouter
.route('/')
.all(requireAuth)
.get((req,res, next) => {
  
  GalleriesService.getAllGalleries(req.app.get('db'), req.user.id) 

  .then(galleries => {    
    console.log(galleries)
    return res.json(galleries.map(serializeGallery));   
    
  })
  .catch(next);   
})

.post(requireAuth, bodyParser, (req, res, next) => {
  const {name, owner, user_id} = req.body;    
  if (!name)    {     
    logger.error(`gallery 'name' is required`);
    return res.status(400).send({
      error: { message: `gallery 'name' is required` }
    });
  }     
  const newGallery = {name, owner, user_id};
  
  newGallery.user_id = req.user.id;
  newGallery.owner = req.user.user_name; ;
 
  GalleriesService.insertGallery(
    req.app.get('db'),
    newGallery
  )
    .then(gallery => {
      logger.info(`Gallery with id ${gallery.id} was created`);
   
     res.status(201).location(`/api/galleries/${gallery.id}`).json(serializeGallery(gallery));
    })
    .catch(next);

});
galleriesRouter
.route('/:gallery-id')
.all(requireAuth)
.all((req, res, next) => {
  const { gallery_id } = req.params; 
 GalleriesService.getById(req.app.get('db'), gallery_id)    
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
  GalleriesService.deleteGallery(
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
  
  GalleriesService.updateGallery(
    req.app.get('db'),
    req.params.gallery_id,
    galleryToUpdate
  )
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
});



module.exports = galleriesRouter;