const express = require('express');
const logger = require('../logger');
const galleryArtworkRouter = express.Router();
const GalleryArtworkService = require('./galleryArtwork-service')
const { requireAuth } = require('../middleware/jwt-auth');

const serializeGalleryArtwork = galleryArtwork => ({  
  gallery_id: galleryArtwork.gallery_id,
  artwork_id: galleryArtwork.artwork_id  
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


module.exports = publicGalleriesRouter;