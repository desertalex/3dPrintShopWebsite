const express = require('express');
const { check, body } = require('express-validator/check');
const authController = require('../controllers/auth');
const User = require('../models/user');
const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', [
    body('email').isEmail().withMessage('Email not valid').normalizeEmail(),
    body('password').isLength({ min: 5 }).withMessage('Password too short').trim()
],
    authController.postLogin
);
router.post('/logout', authController.postLogout);

router.post(
    '/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('Email already in use');
                    }
                });
            })
            .normalizeEmail(),
        body('password', 'Please use valid password')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword').trim().custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password does not match');
            }
            return true;
        })],
    authController.postSignup
);

router.get('/signup', authController.getSignup);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router