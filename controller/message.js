
const chatMessage = require('../models/chatMessage');

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