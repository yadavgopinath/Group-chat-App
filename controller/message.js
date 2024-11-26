
const { error } = require('console');
const chatMessage = require('../models/chatMessage');
const Users = require('../models/user');
const sequelize = require('../util/database');
const Sequelize = require('sequelize');

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
     // If lastMessageId is not provided, treat it as 0 (or undefined)
     let lastMessageId = req.query.lastMessageId;
     // If lastMessageId is undefined or NaN, treat it as -1 to fetch latest messages
  if (lastMessageId === undefined || isNaN(lastMessageId)) {
    lastMessageId = -1;
  } else {
    // Otherwise, parse it as an integer
    lastMessageId = parseInt(lastMessageId);
  }

  console.log('lastMessageId:', lastMessageId);

    console.log(lastMessageId+"dete hai kya ataa");
    try{
        let messages;
        if (lastMessageId === -1) {

            messages = await chatMessage.findAll({
                attributes: ['id', 'message'],
                include: [
                  {
                    model: Users,
                    attributes: ['id', 'name'],
                  },
                ],
                order: [['createdAt', 'DESC']], // Latest first
                limit: 10, // Limit to 10 messages
              });
        }else{
            // If lastMessageId is greater than 0, fetch messages with id greater than lastMessageId
      messages = await chatMessage.findAll({
        where: {
          id: {
            [Sequelize.Op.gt]: lastMessageId, // Get messages where ID > lastMessageId
          },
        },
        include: [
          {
            model: Users,
            attributes: ['id', 'name'],
          },
        ],
        order: [['id', 'ASC']], // Order by ID in ascending order (to maintain the correct sequence)
        limit: 10, // Limit to 10 messages
      });
    }
      
          // Format the messages
          const formattedMessages = messages.map((msg) => ({
            name: msg.user ? msg.user.name : 'Unknown User', // Corrected user reference
            message: msg.message,
            id:msg.id
          }));
      
          res.status(200).json({ messages: formattedMessages });
        

    }catch(err){
        console.log(err);
        res.status(501).json({message:'Something Went Wrong',error:err})
    }
}