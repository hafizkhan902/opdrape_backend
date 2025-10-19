const multer = require('multer');

// Use memory storage to keep files in memory as Buffer objects
// This allows us to upload directly to Cloudinary without saving to disk
const storage = multer.memoryStorage();

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer upload instance with memory storage
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max file size
    fieldSize: 10 * 1024 * 1024, // 10 MB field size
  }
});

module.exports = upload; 