import { Hono } from 'hono';
import { 
  uploadAndExtractImages, 
  uploadAndExtractImagesAsFiles, 
  serveExtractedImage 
} from '../controllers/pdfController.js';

const pdfRoutes = new Hono();

// Upload PDF and extract images as base64
pdfRoutes.post('/extract-images', uploadAndExtractImages);

// Upload PDF and extract images as files (returns URLs)
pdfRoutes.post('/extract-images-files', uploadAndExtractImagesAsFiles);

// Serve extracted image files
pdfRoutes.get('/images/:extractionId/:filename', serveExtractedImage);

export default pdfRoutes;
