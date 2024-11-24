const express = require('express');
const  router = express.Router();
const controler = require('../controller/message');
const UserAuthetication = require('../middleware/auth');

router.post('/message',UserAuthetication.authenticate,controler.addMessage);


module.exports = router;
