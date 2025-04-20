import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors());
app.use(express.json());

// Ensure photos directory exists
const photosDir = path.join(__dirname, '../photos');
console.log('Photos directory path:', photosDir);

if (!fs.existsSync(photosDir)) {
  console.log('Creating photos directory...');
  fs.mkdirSync(photosDir, { recursive: true });
}

// Endpoint to save photos
app.post('/api/photos', async (req, res) => {
  try {
    console.log('Received photo upload request');
    const { base64Image } = req.body;
    
    if (!base64Image) {
      throw new Error('No image data received');
    }
    
    // Remove the data URL prefix
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    
    // Create a unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `photo-${timestamp}.jpg`;
    const filePath = path.join(photosDir, filename);
    
    console.log('Saving photo to:', filePath);
    
    // Convert base64 to buffer and write to file
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, buffer);
    
    console.log('Photo saved successfully');
    
    res.json({ 
      success: true, 
      filePath: filename 
    });
  } catch (error) {
    console.error('Error saving photo:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save photo' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 