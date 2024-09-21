// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/auth');

// router.post('/register', authController.register);
// router.post('/login', authController.login);

// module.exports = router;
const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
    registerUser,
    activateUser,
    loginUser,
    forgotPassword,
    resetPassword,
    logoutUser
    // getMe
} = require('../controllers/auth');

const router = express.Router();


// router.get('/me', authMiddleware, getMe);
router.post('/register', registerUser);
router.get('/activate/:token', activateUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/logout', logoutUser);
module.exports = router;
