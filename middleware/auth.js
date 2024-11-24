const jwt = require('jsonwebtoken');
const Users = require('../models/user');

exports.authenticate = async(req,res,next)=>{
try{
    const token=  req.header('Authorization');
   
    
    const   user = jwt.verify(token,process.env. jwt_secretkey);
    
  
    Users.findByPk(user.userId).then(user=>{
        req.user = user;
        next();
    }).catch(err=>{throw new Error(err)})



}catch(err){
    console.log(err);
    return res.status(501).json({
       
        message:'unable to authenticate the token',
        error:err
    })
}
}