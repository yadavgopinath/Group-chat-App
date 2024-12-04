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
const Group = require('./models/group');
const  GroupMember = require('./models/group-members');
const GroupMessage = require('./models/group-message');

const userroutes = require('./routes/user');
const textroutes = require('./routes/message');
const grouproutes = require('./routes/group');

app.use('/user',userroutes);
app.use('/text',textroutes);
app.use('/groups',grouproutes);


Users.hasMany(chatMessages, { foreignKey: 'userId', onDelete: 'CASCADE' });
chatMessages.belongsTo(Users, { foreignKey: 'userId' });
// User-Group relationship
// Define relationships
Group.belongsTo(Users, { foreignKey: 'createdBy', as: 'creator' });
Users.hasMany(Group, { foreignKey: 'createdBy', as: 'createdGroups' });

Group.belongsToMany(Users, { through: GroupMember });
Users.belongsToMany(Group, { through: GroupMember });

GroupMessage.belongsTo(Group, { foreignKey: 'groupId' });
Group.hasMany(GroupMessage, { foreignKey: 'groupId' });

GroupMessage.belongsTo(Users, { foreignKey: 'userId' });
Users.hasMany(GroupMessage, { foreignKey: 'userId' });

sequelize.sync()
.then((result)=>{
    app.listen(3000,()=>{
        console.log('Server running on port 3000');
    });
})
.catch(err=>{
    console.log(err);
});

