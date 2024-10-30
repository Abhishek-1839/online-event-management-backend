
const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
    registerUser,
    activateUser,
    loginUser,
    forgotPassword,
    resetPassword,
    logoutUser

} = require('../controllers/auth');

const router = express.Router();



router.post('/register', registerUser);
router.get('/activate/:token', activateUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/logout', logoutUser);
module.exports = router;
