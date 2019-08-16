require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const errorHandler = require('./error-handler');
const galleriesRouter = require('./galleries/galleries-router')
const artworkRouter = require('./artwork/artwork-router')
const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')
const app = express();

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test'
}));

app.use(cors());
app.use(helmet());
app.use(errorHandler);

app.use('/api/galleries', galleriesRouter)
app.use('/api/artwork', artworkRouter)
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

app.get('/', (req, res) => {
  res.send(`There are two top level endpoints:

  /api/galleries
  /api/artwork
  
  
  Both support GET, POST, PATCH and DELETE requests. For  PATCH and DELETE requests you must supply the respective id in the endpoint's path.
  
  For example:
  
  GET /api/galleries
  GET /api/artwork
  POST /api/artwork
  POST /api/galleries
  PATCH /api/galleries/:gallery_id
  PATCH /api/artwork/:artpiece_id
  DELETE /galleries/:gallery_id
  DELETE /artwork/:artpiece_id`);
});


module.exports = app;
