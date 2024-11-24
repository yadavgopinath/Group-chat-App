require('dotenv').config();
const express =require('express');
const cors=require('cors');
const bodyParser = require('body-parser');
const app=express();
const sequelize = require('./util/database');
app.use(cors({
    origin:"*"
}));
app.use(bodyParser.json({extended:false}));
app.use(express.urlencoded({ extended: true }));
const Users = require('./models/user');
const chatMessages = require('./models/chatMessage');

const userroutes = require('./routes/user');
const textroutes = require('./routes/message');

app.use('/user',userroutes);
app.use('/text',textroutes);


Users.hasMany(chatMessages, { onDelete: 'CASCADE' });
chatMessages.belongsTo(Users);

sequelize.sync()
.then((result)=>{
    app.listen(3000,()=>{
        console.log('Server running on port 3000');
    });
})
.catch(err=>{
    console.log(err);
});

