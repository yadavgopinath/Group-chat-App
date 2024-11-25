
const { error } = require('console');
const chatMessage = require('../models/chatMessage');
const Users = require('../models/user');

exports.addMessage = async(req,res,next)=>{
  const {message} = req.body;
  const userId = req.user.id;
 
  if(!message || !userId){
    return res.status(500).json({message:'Something iS missing'});
}
  try{
    const chatMsg= await chatMessage.create({
        userId: userId, 
        message,
      });


      res.status(201).json({
        success: true,
        message: 'Message saved successfully',
        data: chatMsg,
      });


  }catch(err){
    console.log(err);
    res.status(501).json({message:'something went wrong',error:err});
  }
}

exports.getMessages = async(req,res,next)=>{
    try{
        const messages = await chatMessage.findAll({
            attributes: ['id', 'message'],
            include: [
              {
                model: Users,
                attributes: ['name'],
              },
            ],
            order: [['createdAt', 'ASC']],
            limit: 1000,
          });
      
          // Handle possible null User gracefully
          const formattedMessages = messages.map((msg) => ({
            name: msg.User ? msg.User.name : 'Unknown User', // Fallback for missing User
            message: msg.message,
          }));
      
          res.status(200).json({ messages: formattedMessages });
        

    }catch(err){
        console.log(err);
        res.status(501).json({message:'Something Went Wrong',error:err})
    }
}