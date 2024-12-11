require('dotenv').config();
const path = require('path');
const express =require('express');
const cors=require('cors');
const bodyParser = require('body-parser');
const app=express();
const sequelize = require('./util/database');
const compression = require('compression');
const helmet = require('helmet');
app.use(cors({
    origin:"*"
}));
//updated finally
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
// Add the Cross-Origin-Opener-Policy (COOP) header middleware
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  next();
});

// Optional: Add Content-Security-Policy header for form action as fallback
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "script-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net;");
  next();
});


app.use(compression());
app.use(helmet());

//app.use(express.static(path.join(__dirname, 'public')));
app.use('/user',userroutes);
app.use('/text',textroutes);
app.use('/groups',grouproutes);
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  next();
});
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "script-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net;");
  next();
});
app.use((req,res)=>{
  console.log(req.url);
  res.sendFile(path.join(__dirname,`public/${req.url}`))
})


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
  .then((result) => {
  
    app.listen(process.env.PORT || 3000, () => {
      console.log('Server running on port 3000'+process.env.PORT);
    });
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

