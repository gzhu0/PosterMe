const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

// Enable CORS
app.use(cors());

// Create photos directory if it doesn't exist
const photosDir = path.join(__dirname, '../photos');
if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir);
}

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, photosDir);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'photo-' + uniqueSuffix + '.jpg');
  }
});

const upload = multer({ storage: storage });

// Endpoint to handle photo uploads
app.post('/api/photos', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  res.json({
    success: true,
    filePath: req.file.path
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 