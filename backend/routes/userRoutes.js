const express = require('express');

const userController = require('../controllers/user.js');

const router = express.Router();

// router.get('/getUser/:email', userController.getUser);

router.post('/addUser', userController.addUser);

module.exports = router;