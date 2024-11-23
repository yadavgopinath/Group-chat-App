const express = require('express');
const  router = express.Router();
const controler = require('../controller/user');

router.post('/signup',controler.addUsers);

module.exports = router;
