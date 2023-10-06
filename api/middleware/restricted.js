const {SECRET} = require('../auth/secrets/index')
const jwt = require('jsonwebtoken')



module.exports = (req, res, next) => {

      const token = req.headers.authorization
      if(!token) {
       return next({status: 401, message: 'token required'})
      }
      jwt.verify(token,SECRET, (err, decodedToken) => {
       if(err) { 
         next({status: 401, message: 'token invalid'})
       } else {
         req.decodedToken = decodedToken
         next()
       }
      })
};
