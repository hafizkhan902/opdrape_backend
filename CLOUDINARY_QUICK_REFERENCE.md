# Cloudinary Quick Reference

## 🚀 Quick Start

### 1. Add to .env (REQUIRED)
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Start Server
```bash
npm run dev
```

Should see: `✅ Cloudinary connection successful`

---

## 📡 API Endpoints

### Upload Single Image
```http
POST /api/uploads/:type
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
file: <binary>
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/uploads/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@image.jpg"
```

**Response:**
```json
{
  "message": "File uploaded successfully",
  "file": {
    "url": "https://res.cloudinary.com/.../image.jpg",
    "publicId": "opdrape/products/1234-5678",
    "filename": "opdrape/products/1234-5678",
    "originalname": "image.jpg",
    "mimetype": "image/jpeg",
    "size": 123456
  }
}
```

### Upload Multiple Images
```http
POST /api/uploads/multiple/:type
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
files: <binary>
files: <binary>
files: <binary>
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/uploads/multiple/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@image1.jpg" \
  -F "files=@image2.jpg"
```

**Response:**
```json
{
  "message": "Files uploaded successfully",
  "count": 2,
  "files": [
    {
      "url": "https://res.cloudinary.com/.../image1.jpg",
      "publicId": "opdrape/products/1234-5678",
      ...
    },
    {
      "url": "https://res.cloudinary.com/.../image2.jpg",
      "publicId": "opdrape/products/1234-5679",
      ...
    }
  ]
}
```

### Delete Image
```http
DELETE /api/uploads
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "publicId": "opdrape/products/1234-5678"
}
```

**Example:**
```bash
curl -X DELETE http://localhost:8000/api/uploads \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"publicId":"opdrape/products/1234-5678"}'
```

**Response:**
```json
{
  "message": "File deleted successfully",
  "result": {
    "result": "ok"
  }
}
```

---

## 📁 Upload Types

| Type | Folder on Cloudinary | Usage |
|------|---------------------|-------|
| `products` | `opdrape/products/` | Product images |
| `users` | `opdrape/users/` | User profile pictures |
| `reviews` | `opdrape/reviews/` | Review images |
| `categories` | `opdrape/categories/` | Category images |
| Custom | `opdrape/custom/` | Any custom type |

**Example:** 
- `POST /api/uploads/products` → Saves to `opdrape/products/`
- `POST /api/uploads/users` → Saves to `opdrape/users/`

---

## 🎨 Image Transformations

Add transformations to Cloudinary URLs:

### Original
```
https://res.cloudinary.com/demo/image/upload/v1234/opdrape/products/image.jpg
```

### Resize to 400x300
```
https://res.cloudinary.com/demo/image/upload/w_400,h_300/v1234/opdrape/products/image.jpg
```

### Thumbnail 150x150 (cropped)
```
https://res.cloudinary.com/demo/image/upload/w_150,h_150,c_fill/v1234/opdrape/products/image.jpg
```

### Convert to WebP
```
https://res.cloudinary.com/demo/image/upload/f_webp/v1234/opdrape/products/image.jpg
```

### Auto Quality
```
https://res.cloudinary.com/demo/image/upload/q_auto/v1234/opdrape/products/image.jpg
```

### Multiple Transformations
```
https://res.cloudinary.com/demo/image/upload/w_400,h_300,c_fill,q_auto,f_webp/v1234/opdrape/products/image.jpg
```

Insert transformations after `/upload/` and before the version number.

---

## 💻 Frontend Integration

### JavaScript/React Example

```javascript
import axios from 'axios';

// Single upload
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post('/api/uploads/products', formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  
  const imageUrl = response.data.file.url;
  console.log('Uploaded:', imageUrl);
  return imageUrl;
};

// Multiple upload
const uploadMultipleImages = async (files) => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  
  const response = await axios.post('/api/uploads/multiple/products', formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  
  const imageUrls = response.data.files.map(f => f.url);
  console.log('Uploaded:', imageUrls);
  return imageUrls;
};

// Delete image
const deleteImage = async (publicId) => {
  await axios.delete('/api/uploads', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    data: { publicId }
  });
};
```

### HTML Form Example

```html
<!-- Single file -->
<form id="uploadForm">
  <input type="file" name="file" accept="image/*" />
  <button type="submit">Upload</button>
</form>

<script>
document.getElementById('uploadForm').onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  const response = await fetch('/api/uploads/products', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token
    },
    body: formData
  });
  
  const data = await response.json();
  console.log('Uploaded:', data.file.url);
};
</script>
```

---

## 🔧 Configuration Functions

### In Backend Code

```javascript
const { uploadToCloudinary, deleteFromCloudinary } = require('./config/cloudinary');

// Upload buffer to Cloudinary
const result = await uploadToCloudinary(fileBuffer, {
  folder: 'opdrape/products',
  public_id: 'my-custom-id',
  resource_type: 'auto'
});

console.log(result.secure_url); // Cloudinary URL

// Delete from Cloudinary
await deleteFromCloudinary('opdrape/products/my-custom-id');
```

---

## ⚠️ Common Issues

### ❌ "Cloudinary connection could not be verified"
**Fix:** Check `.env` credentials are correct

### ❌ "No file uploaded"
**Fix:** Ensure field name is `file` (single) or `files` (multiple)

### ❌ "Only image files are allowed"
**Fix:** Upload only JPEG, PNG, GIF, WebP, SVG files

### ❌ Images not loading
**Fix:** Use the full Cloudinary URL from response (don't prepend backend domain)

---

## 📊 Cloudinary Dashboard

View all uploads: [https://cloudinary.com/console/media_library](https://cloudinary.com/console/media_library)

Features:
- Browse all uploaded images
- Delete images
- View upload statistics
- Manage folders
- Generate transformations

---

## 🎯 Key Points

1. ✅ Database stores **URL strings only** (not files)
2. ✅ Use `response.data.file.url` in frontend
3. ✅ URLs work anywhere (they're full HTTPS URLs)
4. ✅ Images served from Cloudinary CDN (fast!)
5. ✅ Transformations via URL parameters (no server processing)
6. ⚠️ **Must have Cloudinary credentials in .env**

---

## 📚 More Info

- Full Documentation: [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)
- Migration Guide: [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)
- Cloudinary Docs: [https://cloudinary.com/documentation](https://cloudinary.com/documentation)

