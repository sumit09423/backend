import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
const outputDir = path.join(__dirname, '../../temp');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

export const uploadAndExtractImages = async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body.file;

    if (!file) {
      return c.json({ error: 'No file uploaded' }, 400);
    }

    // Check if file is a PDF
    if (file.type !== 'application/pdf') {
      return c.json({ error: 'Only PDF files are allowed' }, 400);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `pdf_${timestamp}.pdf`;
    const filePath = path.join(uploadsDir, filename);

    // Save uploaded file
    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    // Use system poppler to convert PDF to images
    const outputPrefix = path.join(outputDir, `extracted_${timestamp}`);
    const command = `pdftoppm -png -r 300 "${filePath}" "${outputPrefix}"`;
    
    try {
      await execAsync(command);
    } catch (error) {
      console.error('Poppler conversion error:', error);
      throw new Error('Failed to convert PDF to images');
    }
    
    // Get all extracted image files
    const extractedImages = [];
    const files = fs.readdirSync(outputDir);
    const imageFiles = files.filter(file => 
      file.startsWith(`extracted_${timestamp}`) && 
      (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'))
    );

    // Process each extracted image
    for (let i = 0; i < imageFiles.length; i++) {
      const imageFile = imageFiles[i];
      const imagePath = path.join(outputDir, imageFile);
      
      // Get image metadata
      const stats = fs.statSync(imagePath);
      const imageBuffer = fs.readFileSync(imagePath);
      
      // Convert to base64 for response
      const base64Image = imageBuffer.toString('base64');
      
      extractedImages.push({
        pageNumber: i + 1,
        filename: imageFile,
        size: stats.size,
        base64: base64Image,
        mimeType: 'image/png'
      });
    }

    // Clean up temporary files
    try {
      fs.unlinkSync(filePath); // Remove uploaded PDF
      imageFiles.forEach(file => {
        fs.unlinkSync(path.join(outputDir, file)); // Remove extracted images
      });
    } catch (cleanupError) {
      console.warn('Cleanup warning:', cleanupError.message);
    }

    return c.json({
      success: true,
      message: 'Images extracted successfully',
      totalPages: extractedImages.length,
      images: extractedImages
    });

  } catch (error) {
    console.error('PDF processing error:', error);
    return c.json({ 
      error: 'Failed to process PDF', 
      details: error.message 
    }, 500);
  }
};

export const uploadAndExtractImagesAsFiles = async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body.file;

    if (!file) {
      return c.json({ error: 'No file uploaded' }, 400);
    }

    // Check if file is a PDF
    if (file.type !== 'application/pdf') {
      return c.json({ error: 'Only PDF files are allowed' }, 400);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `pdf_${timestamp}.pdf`;
    const filePath = path.join(uploadsDir, filename);

    // Save uploaded file
    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    // Use system poppler to convert PDF to images
    const outputPrefix = path.join(outputDir, `extracted_${timestamp}`);
    const command = `pdftoppm -png -r 300 "${filePath}" "${outputPrefix}"`;
    
    try {
      await execAsync(command);
    } catch (error) {
      console.error('Poppler conversion error:', error);
      throw new Error('Failed to convert PDF to images');
    }
    
    // Get all extracted image files
    const extractedImages = [];
    const files = fs.readdirSync(outputDir);
    const imageFiles = files.filter(file => 
      file.startsWith(`extracted_${timestamp}`) && 
      (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'))
    );

    // Create a permanent directory for this extraction
    const permanentDir = path.join(uploadsDir, `extracted_${timestamp}`);
    if (!fs.existsSync(permanentDir)) {
      fs.mkdirSync(permanentDir, { recursive: true });
    }

    // Process each extracted image
    for (let i = 0; i < imageFiles.length; i++) {
      const imageFile = imageFiles[i];
      const imagePath = path.join(outputDir, imageFile);
      const permanentPath = path.join(permanentDir, imageFile);
      
      // Move image to permanent directory
      fs.renameSync(imagePath, permanentPath);
      
      // Get image metadata
      const stats = fs.statSync(permanentPath);
      
      extractedImages.push({
        pageNumber: i + 1,
        filename: imageFile,
        filePath: permanentPath,
        url: `/uploads/extracted_${timestamp}/${imageFile}`,
        size: stats.size,
        mimeType: 'image/png'
      });
    }

    // Clean up uploaded PDF
    try {
      fs.unlinkSync(filePath);
    } catch (cleanupError) {
      console.warn('Cleanup warning:', cleanupError.message);
    }

    return c.json({
      success: true,
      message: 'Images extracted successfully',
      totalPages: extractedImages.length,
      extractionId: timestamp,
      images: extractedImages
    });

  } catch (error) {
    console.error('PDF processing error:', error);
    return c.json({ 
      error: 'Failed to process PDF', 
      details: error.message 
    }, 500);
  }
};

export const serveExtractedImage = async (c) => {
  try {
    const extractionId = c.req.param('extractionId');
    const filename = c.req.param('filename');
    
    const imagePath = path.join(uploadsDir, `extracted_${extractionId}`, filename);
    
    if (!fs.existsSync(imagePath)) {
      return c.json({ error: 'Image not found' }, 404);
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const ext = path.extname(filename).toLowerCase();
    
    let mimeType = 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') {
      mimeType = 'image/jpeg';
    }

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Length': imageBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (error) {
    console.error('Image serving error:', error);
    return c.json({ 
      error: 'Failed to serve image', 
      details: error.message 
    }, 500);
  }
};