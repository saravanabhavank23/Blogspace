const Comment = require('../models/Comment');
const Post = require('../models/Post');

// GET all comments for a specific post (public)
exports.getCommentsForPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    console.error('Get comments error:', error.message);
    res.status(500).json({ message: 'Server error fetching comments.' });
  }
};

// CREATE comment on a post (logged-in users only)
exports.createComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required.' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const comment = await Comment.create({
      text,
      post: postId,
      author: req.user.userId
    });

    const populatedComment = await comment.populate('author', 'name');

    res.status(201).json(populatedComment);

  } catch (error) {
    console.error('Create comment error:', error.message);
    res.status(500).json({ message: 'Server error creating comment.' });
  }
};

// DELETE comment (only the OWNER can delete)
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    if (comment.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only delete your own comments.' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Comment deleted successfully.' });

  } catch (error) {
    console.error('Delete comment error:', error.message);
    res.status(500).json({ message: 'Server error deleting comment.' });
  }
};