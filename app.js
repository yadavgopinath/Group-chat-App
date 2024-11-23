require('dotenv').config();
const express =require('express');
const cors=require('cors');
const bodyParser = require('body-parser');
const app=express();
const sequelize = require('./util/database');
app.use(cors());
app.use(bodyParser.json({extended:false}));
app.use(express.urlencoded({ extended: true }));
const Users = require('./models/user');

const userroutes = require('./routes/user');


app.use('/user',userroutes);


sequelize.sync()
.then((result)=>{
    app.listen(3000,()=>{
        console.log('Server running on port 3000');
    });
})
.catch(err=>{
    console.log(err);
});

