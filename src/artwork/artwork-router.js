const express = require('express');
const logger = require('../logger');
const xss = require('xss');
const artworkRouter = express.Router();
const bodyParser = express.json({limit:"3MB"});
const ArtworkService = require('../artwork/artwork-service');
const { requireAuth } = require('../middleware/jwt-auth');

const serializeArtpiece = artpiece => ({
  id: artpiece.id,
  title: xss(artpiece.title),
  artpiece_image: artpiece.artpiece_image,
  uploaded: artpiece.uploaded,
  gallery_id: Number(artpiece.gallery_id),  
});

artworkRouter
  .route('/')
  .get((req, res, next) => {   
    ArtworkService.getAllArtwork(req.app.get('db')) 
      .then(artwork => {
        return res.json(artwork.map(serializeArtpiece));
      })
      .catch(next);   
  })
  .post(requireAuth, bodyParser, (req, res, next) => {
    const {title, artpiece_image, gallery_id, user_id} = req.body;
    // const galleryNumCheck = Number(gallery_id);
    for(const field of ['title', 'artpiece_image', 'gallery_id']){
      if(!req.body[field]) {       
        logger.error(`'${field}' is required`);
        return res.status(400).send({
          error: {message: `'${field}' is required`}
        });
      }      
    }

    // if(gallery_id && (!Number.isInteger(galleryNumCheck))){      
    //   logger.error(`A valid 'gallery_id' is required`);
    //   return res.status(400).send({
    //     error: {message: `A valid 'gallery_id' is required`}
    //   });
    // }      
    
    const newArtpiece = {title, artpiece_image, gallery_id, user_id};
    newArtpiece.user_id = req.user.id;
    ArtworkService.insertArtpiece(
      req.app.get('db'),
      newArtpiece
    )
      .then(artpiece => {
        logger.info(`artpiece with id ${artpiece.id} was created`);
        res.status(201).location(`/api/artwork/${artpiece.id}`).json(serializeArtpiece(artpiece));
      })
      .catch(next);
  });

artworkRouter
  .route('/:artpiece_id')
  .all((req, res, next) => {
    const { artpiece_id } = req.params;
    ArtworkService.getById(req.app.get('db'), artpiece_id)    
      .then(artpiece => {
        if (!artpiece) {
          logger.error(`artpiece with id ${artpiece_id} not found.`);
          return res.status(404).json({
            error: { message: `artpiece Not Found` }
          });
        }        
        res.artpiece = artpiece;
        next();        
      })
      .catch(next);
  })
  .get((req,res, next) => {
    res.json(serializeArtpiece(res.artpiece));
  })
  .delete((req, res, next) => {
    const {artpiece_id} = req.params;
    ArtworkService.deleteArtpiece(
      req.app.get('db'),
      artpiece_id
    )
      .then(() => {
        logger.info(`Gallery with id ${artpiece_id} deleted`);
        res.status(204).end();
      })
      .catch(next);

  })
  .patch(bodyParser, (req, res, next) => {
    const {title, artpiece_image, gallery_id} = req.body;  
    const artpieceToUpdate = {title, artpiece_image, gallery_id};  
    const numberOfValues = Object.values(artpieceToUpdate).filter(Boolean).length;
    const galleryNumCheck = Number(gallery_id);
    
    if (numberOfValues === 0) {
      logger.error(`Invalid update without required fields`)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'title' or 'artpiece_image''`
        }
      });
    }
    if(gallery_id && (!Number.isInteger(galleryNumCheck))){
      logger.error(`Invalid update with 'gallery_id'`);
      return res.status(400).send({
        error: {message: `Request body must contain a valid 'gallery_id'`}
      });
    }     
    
    ArtworkService.updateArtpiece(
      req.app.get('db'),
      req.params.artpiece_id,
      artpieceToUpdate
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = artworkRouter;