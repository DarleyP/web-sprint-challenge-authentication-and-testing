
const {findBy} = require('../auth/auth-model')



const checkUsernameExists =  async (req, res, next) => {
    
    try {
      const [user] = await findBy({username: req.body.username})
      if(!user) {
        
        next({status: 401, message: 'invalid credentials'})
      }  else {

        req.user = user
        next()
      }
    } catch(err) {
      next(err)
    }
    
  }

  const checkfields =  async (req, res, next) => {
    if (!req.body.username || !req.body.password){
      return res.status(401).json("username and password required");
  
    } else {
      next()
    }
    
  }

module.exports = {
    checkUsernameExists,
    checkfields
}