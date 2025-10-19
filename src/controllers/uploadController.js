const { uploadToCloudinary, deleteFromCloudinary, extractPublicId } = require('../config/cloudinary');

const uploadController = {
  // Upload a single file to Cloudinary
  uploadFile: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const file = req.file;
      const type = req.params.type || 'products';
      
      // Upload to Cloudinary
      const result = await uploadToCloudinary(file.buffer, {
        folder: `opdrape/${type}`,
        public_id: `${Date.now()}-${Math.round(Math.random() * 1E9)}`,
        resource_type: 'auto'
      });
      
      // Return success response with file details
      res.status(201).json({
        message: 'File uploaded successfully',
        file: {
          filename: result.public_id,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          url: result.secure_url,
          publicId: result.public_id,
          cloudinaryData: {
            asset_id: result.asset_id,
            width: result.width,
            height: result.height,
            format: result.format
          }
        }
      });
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
      res.status(500).json({ 
        error: 'Failed to upload file',
        details: error.message 
      });
    }
  },

  // Upload multiple files to Cloudinary
  uploadMultipleFiles: async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const type = req.params.type || 'products';
      
      // Upload all files to Cloudinary
      const uploadPromises = req.files.map(file => 
        uploadToCloudinary(file.buffer, {
          folder: `opdrape/${type}`,
          public_id: `${Date.now()}-${Math.round(Math.random() * 1E9)}`,
          resource_type: 'auto'
        }).then(result => ({
          filename: result.public_id,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          url: result.secure_url,
          publicId: result.public_id,
          cloudinaryData: {
            asset_id: result.asset_id,
            width: result.width,
            height: result.height,
            format: result.format
          }
        }))
      );

      const uploadedFiles = await Promise.all(uploadPromises);

      // Return success response with file details
      res.status(201).json({
        message: 'Files uploaded successfully',
        count: uploadedFiles.length,
        files: uploadedFiles
      });
    } catch (error) {
      console.error('Error uploading multiple files to Cloudinary:', error);
      res.status(500).json({ 
        error: 'Failed to upload files',
        details: error.message 
      });
    }
  },
  
  // Delete file from Cloudinary
  deleteFile: async (req, res) => {
    try {
      const { publicId } = req.body;
      
      if (!publicId) {
        return res.status(400).json({ error: 'Public ID is required' });
      }

      const result = await deleteFromCloudinary(publicId);
      
      res.json({
        message: 'File deleted successfully',
        result
      });
    } catch (error) {
      console.error('Error deleting file from Cloudinary:', error);
      res.status(500).json({ 
        error: 'Failed to delete file',
        details: error.message 
      });
    }
  },
  
  // Get uploaded files (Note: This would need Cloudinary Admin API to list resources)
  getUploadedFiles: async (req, res) => {
    try {
      const type = req.params.type || 'products';
      
      // This would require using Cloudinary Admin API to list resources
      // For now, return a message indicating this feature needs Cloudinary Admin API
      res.json({
        message: 'Files are now stored in Cloudinary cloud storage',
        folder: `opdrape/${type}`,
        note: 'Use Cloudinary dashboard to view all uploaded files'
      });
    } catch (error) {
      console.error('Error getting uploaded files:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = uploadController; 