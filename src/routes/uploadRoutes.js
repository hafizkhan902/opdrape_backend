const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const upload = require('../middleware/uploadMiddleware');
const auth = require('../middleware/auth');

// Single file upload route to Cloudinary
router.post('/:type?', auth, upload.single('file'), uploadController.uploadFile);

// Multiple files upload route to Cloudinary
router.post('/multiple/:type?', auth, upload.array('files', 20), uploadController.uploadMultipleFiles);

// Delete file from Cloudinary
router.delete('/', auth, uploadController.deleteFile);

// Get uploaded files info
router.get('/:type?', auth, uploadController.getUploadedFiles);

module.exports = router; 