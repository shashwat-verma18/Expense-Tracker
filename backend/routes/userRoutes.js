const express = require('express');

const userController = require('../controllers/user.js');
const passwordController = require('../controllers/password.js');


const router = express.Router();

router.post('/addUser', userController.addUser);

router.post('/loginUser', userController.loginUser);

router.post('/password/getUser', passwordController.getUser);

router.post('/password/resetPassword', passwordController.resetPassword);

module.exports = router;