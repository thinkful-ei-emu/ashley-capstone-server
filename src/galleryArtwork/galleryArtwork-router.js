const express = require('express');
const galleryArtworkRouter = express.Router();
const GalleryArtworkService = require('./galleryArtwork-service')
const { requireAuth } = require('../middleware/jwt-auth');

const serializeGalleryArtwork = galleryArtwork => ({  
  gallery_id: galleryArtwork.gallery_id,
  gallery_name: galleryArtwork.gallery_name,
  gallery_owner: galleryArtwork.gallery_owner,
  artpiece_title: galleryArtwork.artpiece_title,
  artpiece_artist: galleryArtwork.artpiece_artist,
  artpiece_uploaded: galleryArtwork.artpiece_uploaded,
  artpiece_image: galleryArtwork.artpiece_image,
  public: galleryArtwork.public 
});

galleryArtworkRouter
.route('/')
.all(requireAuth)
.get((req,res, next) => {
  GalleryArtworkService.getAllGalleries(req.app.get('db')) 

  .then(galleries => { 
    console.log(galleries)    
    return res.json(galleries.map(serializeGalleryArtwork));
  })
  .catch(next);   
})


module.exports = galleryArtworkRouter;