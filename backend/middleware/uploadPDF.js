const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'blogspace/pdfs',
        resource_type: 'raw',
        allowed_formats: ['pdf']
    }
});

const uploadPDF = multer({
    storage
});

module.exports = uploadPDF;