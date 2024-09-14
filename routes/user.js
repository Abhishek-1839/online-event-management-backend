const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');


// Route to get all registered users
router.get('/users', userController.getAllUsers);
router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.get('/users/name/:name', userController.getUserByName);


module.exports = router;
