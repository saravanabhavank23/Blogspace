const upload = require('../middleware/upload');
const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', authMiddleware, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
]), createPost);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;