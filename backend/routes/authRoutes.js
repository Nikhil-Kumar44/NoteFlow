const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { signup, login, getMe, getUsers } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMsg = errors.array().map(err => err.msg).join('; ');
        return res.status(400).json({ success: false, message: errorMsg });
    }
    next();
};

router.post(
    '/signup',
    [
        check('name', 'Name is required').notEmpty().trim(),
        check('email', 'Please include a valid email').isEmail().normalizeEmail(),
        check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
        validateRequest
    ],
    signup
);

router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail().normalizeEmail(),
        check('password', 'Password is required').exists(),
        validateRequest
    ],
    login
);

router.get('/me', protect, getMe);
router.get('/users', protect, authorize('admin'), getUsers);

module.exports = router;
