
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
      if(!req.body.username || !req.body.password){
        return res.status(400).json("username and password required");
      } else {
        const [user] = await findBy({username: req.body.username})
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