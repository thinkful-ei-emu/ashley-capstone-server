const express = require('express');
const galleryArtworkRouter = express.Router();
const logger = require('../logger');
const GalleryArtworkService = require('./galleryArtwork-service')
const { requireAuth } = require('../middleware/jwt-auth');

const serializeGalleryArtwork = galleryArtwork => ({  
  // galleryId: galleryArtwork.gallery_id,
  // galleryName: galleryArtwork.gallery_name,
  // galleryOwner: galleryArtwork.gallery_owner,
  artpieceId: galleryArtwork.artpiece_id,  
  artpieceTitle: galleryArtwork.artpiece_title,
  artpieceArtist: galleryArtwork.artpiece_artist,
  artpieceUploaded: galleryArtwork.artpiece_uploaded,
  artpieceImage: galleryArtwork.artpiece_image
});

galleryArtworkRouter
.route('/')
.all(requireAuth)
.get((req,res, next) => {
  GalleryArtworkService.getAllGalleries(req.app.get('db'))
  .then(galleries => {    
    if (galleries.length === 0) {
      logger.error(`Galleries Not found.`);
      return res.status(404).json({
        error: { message: `Galleries Not Found` }
      });
    }

    let publicGalleries = {};

    for(let i=0; i < galleries.length; i++){

      if(publicGalleries[galleries[i].gallery_id]){
        publicGalleries[galleries[i].gallery_id].artwork = [...publicGalleries[galleries[i].gallery_id].artwork, serializeGalleryArtwork(galleries[i])]
      }
      else{
        publicGalleries[galleries[i].gallery_id] = {galleryId: galleries[i].gallery_id, galleryName: galleries[i].gallery_name, galleryOwner: galleries[i].gallery_owner, artwork: [serializeGalleryArtwork(galleries[i])]}
      }
    }
    
    
    return res.json(Object.values(publicGalleries));
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
          
      if (galleryArtwork.length === 0) {
        logger.error(`Gallery with id ${gallery_id} not found.`);
        return res.status(404).json({
          error: { message: `Gallery Not Found` }
        });
      }
      
      return res.json({
        galleryId: galleryArtwork[0].gallery_id, 
        galleryName: galleryArtwork[0].gallery_name,
        galleryOwner: galleryArtwork[0].gallery_owner,
        artwork: galleryArtwork.map(serializeGalleryArtwork)
       });  
   
    })
    .catch(next);
})


galleryArtworkRouter
.route('/owner/:gallery_owner')
.all(requireAuth)
.get((req, res, next) => {
  const { gallery_owner } = req.params; 
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
galleryArtworkRouter
.route('/private/galleries')
.all(requireAuth)
.get((req,res, next) => {

  GalleryArtworkService.getUserGalleries(req.app.get('db'), req.user.id)
  .then(galleries => {    
    if (galleries.length === 0) {
      logger.error(`Galleries Not found.`);
      return res.status(404).json({
        error: { message: `Galleries Not Found` }
      });
    }

    let privateGalleries = {};

    for(let i=0; i < galleries.length; i++){      

      if(privateGalleries[galleries[i].gallery_id]){
        privateGalleries[galleries[i].gallery_id].artwork = [...privateGalleries[galleries[i].gallery_id].artwork, serializeGalleryArtwork(galleries[i])]
      }
      else{
        privateGalleries[galleries[i].gallery_id] = {galleryId: galleries[i].gallery_id, galleryName: galleries[i].gallery_name, galleryOwner: galleries[i].gallery_owner, artwork: galleries[i].artpiece_id != null ? [serializeGalleryArtwork(galleries[i])] : []}
      }
    }
    
    return res.json(Object.values(privateGalleries));
  })
  .catch(next);   
})
galleryArtworkRouter
.route('/private/galleries/:gallery_id')
.all(requireAuth)
.get((req, res, next) => {
  const { gallery_id } = req.params;
  GalleryArtworkService.getUserGalleryById(req.app.get('db'), gallery_id, req.user.id)    
    .then(galleryArtwork => {  
        if (galleryArtwork.length === 0) {
        logger.error(`Gallery with id ${gallery_id} not found.`);
        return res.status(404).json({
          error: { message: `Gallery Not Found` }
        });
      }
      return res.json({
        galleryId: galleryArtwork[0].gallery_id, 
        galleryName: galleryArtwork[0].gallery_name,
        galleryOwner: galleryArtwork[0].gallery_owner,
        artwork: galleryArtwork.map(serializeGalleryArtwork)
       });    
   
    })
    .catch(next);
})



module.exports = galleryArtworkRouter;