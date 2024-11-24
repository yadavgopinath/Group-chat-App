const Users = require('../models/user');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');

exports.addUsers =async (req,res,next)=>{
 try{
 const {name,phoneno,email,password} = req.body;
 
 if (!email || !password || !name || !phoneno) {
    return res.status(400).json({ error: 'Bad Parameter: Something is missing' });
  }

  
   const existingUser = await Users.findOne({
    where: {
        [Sequelize.Op.or]: [
            { email: email },
            { phoneno: phoneno }
        ]
    }
});
if (existingUser) {
    return res.status(400).json({ message: 'User already exists with this email or phone number' });
}


     
const hashedPassword = await bcrypt.hash(password, 10); 

const newUser = await Users.create({ 
    name,
     email:email.toLowerCase(),
      phoneno,
 password:hashedPassword 
});


res.status(201).json({ message: 'User added successfully', user: newUser });

 }catch(err){
    console.log(err);
    res.status(500).json({ message: 'An error occurred', error: err });
 }
}



exports.generateAccessToken = function(id,name){
   
    return jwt.sign({userId:id,name:name},process.env.jwt_secretkey);
}




exports.userlogin = async(req,res,next)=>{
    const{email,password} = req.body;
    try{
  const UserPresent=await Users.findOne({where:{email:email}});

  if(UserPresent){
    bcrypt.compare(password,UserPresent.password,(err,result)=>{
        if(err)
        {
            throw new Error('Something Went Wrong');
        }
        if(result==true)
        {
            
            const token = exports.generateAccessToken(UserPresent.id, UserPresent.name); 
            return res.status(200).json({ message: 'Login Successfully', token: token });
          }else{
            return res.status(401).json({error:'Incorrect Password'});
        }
    })
   
}else{
    return res.status(404).json({error:'Email does not exist'});
    
}






    }catch(err){
        console.log(err);
        res.status(500).json({ message: 'An error occurred', error: err });
     }
}