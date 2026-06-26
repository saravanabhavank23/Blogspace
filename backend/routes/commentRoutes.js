const express = require('express');
const router = express.Router();
const {
  getCommentsForPost,
  createComment,
  deleteComment
} = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/post/:postId', getCommentsForPost);
router.post('/post/:postId', authMiddleware, createComment);
router.delete('/:id', authMiddleware, deleteComment);

module.exports = router;