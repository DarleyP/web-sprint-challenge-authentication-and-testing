
const {findBy} = require('../auth/auth-model')



const checkUsernameExists =  async (req, res, next) => {
    /*
      If the username in req.body does NOT exist in the database
      status 401
      {
        "message": "Invalid credentials"
      }
    */
    try {
      const [user] = await findBy({username: req.body.username})
      if(!user) {
        next({status: 401, message: 'Invalid credentials'})
      } else if(!req.body.username || !req.body.password){
        return res.status(401).json("username and password required");
      
      }  else {

        req.user = user
        next()
      }
    } catch(err) {
      next(err)
    }
    
  }

module.exports = {
    checkUsernameExists
}