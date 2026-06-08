const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { getNotes, createNote, updateNote, deleteNote } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMsg = errors.array().map(err => err.msg).join('; ');
        return res.status(400).json({ success: false, message: errorMsg });
    }
    next();
};

router.route('/')
    .get(protect, getNotes)
    .post(
        protect,
        [
            check('title', 'Title is required').notEmpty().trim(),
            check('content', 'Content is required').notEmpty(),
            validateRequest
        ],
        createNote
    );

router.route('/:id')
    .put(
        protect,
        [
            check('title', 'Title cannot be empty').optional().notEmpty().trim(),
            check('content', 'Content cannot be empty').optional().notEmpty(),
            validateRequest
        ],
        updateNote
    )
    .delete(protect, deleteNote);

module.exports = router;
