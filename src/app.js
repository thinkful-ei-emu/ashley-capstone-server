require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const errorHandler = require('./error-handler');
const galleriesRouter = require('./galleries/galleries-router')
const publicGalleriesRouter = require('./public-galleries/public-galleries-router')
const artworkRouter = require('./artwork/artwork-router')
const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')
const galleryArtworkRouter = require('./galleryArtwork/galleryArtwork-router')
const app = express();

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test'
}));

app.use(cors());
app.use(helmet());
app.use(errorHandler);

app.use('/api/galleries', galleriesRouter)
app.use('/api/galleries-artwork', galleryArtworkRouter)
app.use('/api/public/galleries', publicGalleriesRouter)
app.use('/api/artwork', artworkRouter)
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

app.get('/', (req, res) => {
  res.send(
    `Welcome to L'Artiste Server! There are two top level endpoints /api/galleries and /api/artwork. Check out the full documentation at: https://github.com/thinkful-ei-emu/ashley-capstone-server` 
   
  );
});


module.exports = app;
