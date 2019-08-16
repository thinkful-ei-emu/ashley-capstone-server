# L'Artiste Server

Server: [https://obscure-journey-16541.herokuapp.com/](https://obscure-journey-16541.herokuapp.com/)

## Summary

This server was built for [L'Artiste](https://ashleys-artiste-client.now.sh/), a drawing app that allows users to create artwork and add their artwork to designated galleries.

If you navigate to the base URL there will be a brief description about the server endpoints.

## API Documentation
There are two top level endpoints:

* /api/galleries
* /api/artwork


Both support GET, POST, PATCH and DELETE requests. For  PATCH and DELETE requests you must supply the respective id in the endpoint's path.

For example:

* GET /api/galleries
* GET /api/artwork
* POST /api/artwork
* POST /api/galleries
* PATCH /api/galleries/:gallery_id
* PATCH /api/artwork/:artpiece_id
* DELETE /galleries/:gallery_id
* DELETE /artwork/:artpiece_id

## Technologies

* Front-end: React, HTML, CSS, Javascript, testing with Enzyme

* API: Node.js, Express, PostgreSQL, Knex, testing with Mocha



## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.