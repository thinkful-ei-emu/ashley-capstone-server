const express = require('express');
const UsersService = require('./users-service');
const usersRouter = express.Router();
const jsonBodyParser = express.json();
const path = require('path');

usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { password, user_name, first_name, last_name, email } = req.body;
    for (const field of ['first_name', 'last_name', 'user_name', 'password', 'email'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });
    const passwordError = UsersService.validatePassword(password);
    const emailError = UsersService.validateEmail(email) 
    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }
    if (emailError) {
      return res.status(400).json({ error: emailError });
    }

    UsersService.hasUserWithEmail(
      req.app.get('db'),
      email,     
    ).then(hasUserWithEmail => {
      if (hasUserWithEmail) {
        return res.status(400).json({ error: `Email already taken` });
      }
    
    })
  
    UsersService.hasUserWithUserName(
      req.app.get('db'),
      user_name,     
    )
      .then(hasUserWithUserName => {        
        if (hasUserWithUserName) {
          return res.status(400).json({ error: `Username already taken` });

        }       
      
        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              user_name,
              password: hashedPassword,
              first_name,
              last_name,
              email
            };
            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(UsersService.serializeUser(user));
              });
          });
      })
      .catch(next);
  });

module.exports = usersRouter;