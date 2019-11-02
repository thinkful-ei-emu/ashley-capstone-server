const express = require('express');
const AuthService = require('./auth-service');
const authRouter = express.Router();
const jsonBodyParser = express.json();
const {requireAuth} = require('../middleware/jwt-auth');


authRouter
  .post('/login', jsonBodyParser, (req, res, next) => {    
    const {user_name, password} = req.body.user;
    const loginUser = {user_name, password};  
   
    for(const [key, value] of Object.entries(loginUser))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });

    AuthService.getUserWithUserName(
      req.app.get('db'),
      loginUser.user_name
    )
      .then(dbUser => {
        if (!dbUser){
          return res.status(400).json({
            error: 'Incorrect user name',
          });
        }

        return AuthService.comparePasswords(loginUser.password, dbUser.password)
          .then(compareMatch => {
            if(!compareMatch){
              return res.status(400).json({
                error: 'Incorrect password'
              });
            }
            const collector_status = dbUser.collector;
            const sub = dbUser.user_name;                 
            const payload = {user_id: dbUser.id, collector: collector_status};  
            const serializeUser = {
              id: dbUser.id,
              userName: sub,
              collector: collector_status
            }                 
            res.send({
              // user: serializeUser,
              authToken: AuthService.createJwt(sub, payload)
            });
          });    
      })
      .catch(next);   
  });  

authRouter.post('/refresh', requireAuth, (req, res) => {
  const sub = req.user.user_name;
  const payload = {user_id: req.user.id};
  res.send ({
    authToken: AuthService.createJwt(sub, payload)
  });
});

module.exports = authRouter;