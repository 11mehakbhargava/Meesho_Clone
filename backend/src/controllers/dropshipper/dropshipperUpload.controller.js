import fs from 'fs';
import { uploadFileToSupabase, uploadBase64ToSupabase } from '../../services/supabaseStorage.service.js';

/**
 * Universal Dropshipper Asset Upload Controller (Supabase Storage)
 * Supports: Avatars, Store Logos, KYC documents, Dispute photos, and Export feeds
 * Route: POST /api/v1/dropshipper/upload/asset
 */
export const uploadDropshipperAsset = async (req, res) => {
  try {
    const { folder = 'general', filename, base64Data, firebaseUid } = req.body;

    // A. Handle Multipart File Upload (req.file from multer)
    if (req.file) {
      const fileBuffer = fs.readFileSync(req.file.path);
      const originalFilename = req.file.originalname || filename || 'asset.png';
      const mimeType = req.file.mimetype || 'image/png';

      const uploadResult = await uploadFileToSupabase({
        fileBuffer,
        originalFilename,
        mimeType,
        folder
      });

      // Cleanup local temp file if exists
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (cleanupErr) {
        console.warn('Temporary file cleanup warning:', cleanupErr.message);
      }

      return res.status(200).json({
        success: true,
        message: 'File successfully uploaded to Supabase Storage CDN',
        storage: 'supabase',
        url: uploadResult.url,
        path: uploadResult.path,
        size: req.file.size,
        mimeType
      });
    }

    // B. Handle Base64 Data URL Payload
    if (base64Data) {
      const uploadResult = await uploadBase64ToSupabase({
        base64Data,
        filename: filename || `asset_${Date.now()}.png`,
        folder
      });

      return res.status(200).json({
        success: true,
        message: 'Base64 image successfully uploaded to Supabase Storage CDN',
        storage: 'supabase',
        url: uploadResult.url,
        path: uploadResult.path
      });
    }

    return res.status(400).json({
      success: false,
      message: 'No file or base64Data provided for upload'
    });
  } catch (error) {
    console.error('Dropshipper Supabase Upload Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload asset to Supabase Storage'
    });
  }
};
