const Users = require('../models/user');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');

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