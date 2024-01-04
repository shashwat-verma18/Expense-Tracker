const express = require('express');

const userController = require('../controllers/user.js');

const router = express.Router();

router.post('/addUser', userController.addUser);

router.post('/loginUser', userController.loginUser);

module.exports = router;