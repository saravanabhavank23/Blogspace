const Post = require('../models/Post');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const uploadToCloudinary = (buffer, folder, resourceType) => {
    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: resourceType
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
};

// GET all posts (public)
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name').sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Get posts error:', error.message);
    res.status(500).json({ message: 'Server error fetching posts.' });
  }
};

// GET single post (public)
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name');
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error('Get post error:', error.message);
    res.status(500).json({ message: 'Server error fetching post.' });
  }
};

// CREATE post (logged-in users only)
exports.createPost = async (req, res) => {

  console.log("===== CREATE POST =====");
  console.log("req.files:", req.files);
  console.log("req.body:", req.body);

  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    let image = '';

    if (req.files?.image) {

        const result = await uploadToCloudinary(
            req.files.image[0].buffer,
            'blogspace/images',
            'image'
        );

        image = result.secure_url;
    }

    // const image = req.files?.image
    //     ? req.files.image[0].path
    //     : '';

    let pdf = '';

    if (req.files?.pdf) {

        const result = await uploadToCloudinary(
            req.files.pdf[0].buffer,
            'blogspace/pdfs',
            'raw'
        );

        pdf = result.secure_url;
    }

    // const pdf = req.files?.pdf
        // ? req.files.pdf[0].path
        // : '';

    const post = await Post.create({
      title,
      content,
      image,
      pdf,
      author: req.user.userId
    });

    res.status(201).json(post);

  } catch (error) {
    console.error('Create post error:', error.message);
    res.status(500).json({ message: 'Server error creating post.' });
  }
};

// UPDATE post (only the OWNER can edit)
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Ownership check — this is the new concept!
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only edit your own posts.' });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    await post.save();

    res.status(200).json(post);

  } catch (error) {
    console.error('Update post error:', error.message);
    res.status(500).json({ message: 'Server error updating post.' });
  }
};

// DELETE post (only the OWNER can delete)
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Ownership check again
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only delete your own posts.' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post deleted successfully.' });

  } catch (error) {
    console.error('Delete post error:', error.message);
    res.status(500).json({ message: 'Server error deleting post.' });
  }
};