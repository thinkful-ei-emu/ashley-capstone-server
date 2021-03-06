const xss = require('xss');
const bcrypt = require('bcryptjs');
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]/;
const UsersService = {
  hasUserWithUserName(db, user_name) {
    return db('users')
      .where({ user_name})
      .first()
      .then(user => !!user);
  },
  hasUserWithEmail(db, email) {
    return db('users')
      .where({ email})
      .first()
      .then(user => !!user);
  },  
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(([user]) => user);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password be longer than 8 characters';     
    }
    if (password.length > 72) {
      return  'Password be less than 72 characters';      
    }
    if(password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain 1 upper case, lower case, number and special character';
    }    
    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  validateEmail(email) {
    if(!email.includes('@')){
      return 'Must provide a valid email'
    }
  },
 
  serializeUser(user) {
    return {
      id: user.id,
      first_name: xss(user.first_name),
      last_name: xss(user.last_name),
      user_name: xss(user.user_name),
      email: xss(user.email),
      collector: user.collector     
    };
  },
  serializeUserName(user){
    return{
      id: user.id,      
      userName: xss(user.userName),     
      collector: user.collector     
    }; 
  }, 
  getUser(db, id) {
    return db('users')
      .select(
        'id',
        'user_name As userName',
        'collector'
        )
      .where({ id })
      .first();
  }, 
};

module.exports = UsersService;