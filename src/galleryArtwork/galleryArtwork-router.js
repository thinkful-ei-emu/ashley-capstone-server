const express = require('express');
const galleryArtworkRouter = express.Router();
const logger = require('../logger');
const GalleryArtworkService = require('./galleryArtwork-service')
const { requireAuth } = require('../middleware/jwt-auth');

const serializeGalleryArtwork = galleryArtwork => ({  
  gallery_id: galleryArtwork.gallery_id,
  gallery_name: galleryArtwork.gallery_name,
  gallery_owner: galleryArtwork.gallery_owner,
  artpiece_title: galleryArtwork.artpiece_title,
  artpiece_artist: galleryArtwork.artpiece_artist,
  artpiece_uploaded: galleryArtwork.artpiece_uploaded,
  artpiece_image: galleryArtwork.artpiece_image
});

galleryArtworkRouter
.route('/')
.all(requireAuth)
.get((req,res, next) => {
  GalleryArtworkService.getAllGalleries(req.app.get('db'))
  .then(galleries => { 
    return res.json(galleries.map(serializeGalleryArtwork));
  })
  .catch(next);   
})

galleryArtworkRouter
.route('/:gallery_id')
.all(requireAuth)
.get((req, res, next) => {
  const { gallery_id } = req.params;
  GalleryArtworkService.getById(req.app.get('db'), gallery_id)    
    .then(galleryArtwork => {  
      console.log('gallery in then', galleryArtwork) 
        
      if (galleryArtwork.length === 0) {
        logger.error(`Gallery with id ${gallery_id} not found.`);
        return res.status(404).json({
          error: { message: `Gallery Not Found` }
        });
      }
      return res.json(galleryArtwork.map(serializeGalleryArtwork));  
   
    })
    .catch(next);
})


galleryArtworkRouter
.route('/owner/:gallery_owner')
.all(requireAuth)
.get((req, res, next) => {
  const { gallery_owner } = req.params; 
  console.log('owner before', gallery_owner)
  GalleryArtworkService.getByOwner(req.app.get('db'), gallery_owner)    
    .then(galleryArtwork => {      
      if (galleryArtwork.length === 0) {
        logger.error(`Gallery with owner ${gallery_owner} not found.`);
        return res.status(404).json({
          error: { message: `Gallery Not Found` }
        });
      }
      return res.json(galleryArtwork.map(serializeGalleryArtwork));  
            
    })
    .catch(next);
})
galleryArtworkRouter
.route('/name/:gallery_name')
.all(requireAuth)
.get((req, res, next) => {
  console.log(req.params)
  const { gallery_name } = req.params; 
  GalleryArtworkService.getByName(req.app.get('db'), gallery_name)    
    .then(galleryArtwork => {       
      if (galleryArtwork.length === 0) {
        logger.error(`Gallery with name ${gallery_name} not found.`);
        return res.status(404).json({
          error: { message: `Gallery Not Found` }
        });
      }
      return res.json(serializeGalleryArtwork(gallery));  
             
    })
    .catch(next);
})
galleryArtworkRouter
.route('/artist/:artist')
.all(requireAuth)
.get((req, res, next) => {
  const { artist } = req.params; 
  GalleryArtworkService.getByArtist(req.app.get('db'), artist)    
    .then(galleryArtwork => {       
      if (galleryArtwork.length === 0) {
        logger.error(`Gallery with artist ${artist} not found.`);
        return res.status(404).json({
          error: { message: `Gallery Not Found` }
        });
      }
      return res.json(galleryArtwork.map(serializeGalleryArtwork));  
        
    })
    .catch(next);
})
galleryArtworkRouter
.route('/title/:artpiece_title')
.all(requireAuth)
.get((req, res, next) => {
  const { artpiece_title } = req.params; 
  GalleryArtworkService.getByTitle(req.app.get('db'), artpiece_title)    
    .then(galleryArtwork => {       
      if (galleryArtwork.length === 0) {
        logger.error(`Gallery with artpiece title ${artpiece_title} not found.`);
        return res.status(404).json({
          error: { message: `Gallery Not Found` }
        });
      }
      return res.json(galleryArtwork.map(serializeGalleryArtwork));  
          
    })
    .catch(next);
})



module.exports = galleryArtworkRouter;