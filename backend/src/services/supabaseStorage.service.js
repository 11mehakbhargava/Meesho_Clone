import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://supabase.hrgroupco.in';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_Cog63mSnnN3QNlVxNPvftt_XFjmviEv';
export const DEFAULT_BUCKET = 'dropshipper-assets';

// Initialize Supabase Storage Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Upload a binary buffer to Supabase Storage Bucket
 * @param {Object} params
 * @param {Buffer} params.fileBuffer - Buffer of the file
 * @param {string} params.originalFilename - Original name of the file
 * @param {string} params.mimeType - MIME Type (e.g. image/jpeg, image/png, application/pdf)
 * @param {string} params.folder - Destination subfolder (e.g. avatars, logos, kyc, disputes)
 * @param {string} [params.bucket] - Supabase bucket name (defaults to 'dropshipper-assets')
 * @returns {Promise<{ success: boolean, url: string, path: string, fullPath: string }>}
 */
export async function uploadFileToSupabase({
  fileBuffer,
  originalFilename = 'asset.png',
  mimeType = 'image/png',
  folder = 'general',
  bucket = DEFAULT_BUCKET
}) {
  try {
    const ext = path.extname(originalFilename) || '.png';
    const cleanBase = path.basename(originalFilename, ext).replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const remotePath = `${folder}/${cleanBase}_${uniqueSuffix}${ext}`;

    const { data, error } = await supabase.storage.from(bucket).upload(remotePath, fileBuffer, {
      contentType: mimeType,
      upsert: true
    });

    if (error) {
      console.error(`[SupabaseStorage] Upload error in bucket "${bucket}":`, error.message);
      throw error;
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(remotePath);
    const publicUrl = urlData?.publicUrl || `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${remotePath}`;

    return {
      success: true,
      url: publicUrl,
      path: remotePath,
      fullPath: data.fullPath || `${bucket}/${remotePath}`
    };
  } catch (err) {
    console.error('[SupabaseStorage] Upload failure:', err.message);
    throw err;
  }
}

/**
 * Upload base64 encoded data (e.g. canvas, data URLs) directly to Supabase
 * @param {Object} params
 * @param {string} params.base64Data - Data URL string (e.g. "data:image/png;base64,...")
 * @param {string} params.filename - Desired filename
 * @param {string} params.folder - Subfolder
 * @param {string} [params.bucket] - Bucket name
 */
export async function uploadBase64ToSupabase({
  base64Data,
  filename = 'upload.png',
  folder = 'general',
  bucket = DEFAULT_BUCKET
}) {
  try {
    if (!base64Data || typeof base64Data !== 'string') {
      throw new Error('Invalid base64 payload provided');
    }

    // Extract mime type and base64 body
    const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    let mimeType = 'image/png';
    let base64Body = base64Data;

    if (matches && matches.length === 3) {
      mimeType = matches[1];
      base64Body = matches[2];
    }

    const buffer = Buffer.from(base64Body, 'base64');

    return await uploadFileToSupabase({
      fileBuffer: buffer,
      originalFilename: filename,
      mimeType,
      folder,
      bucket
    });
  } catch (err) {
    console.error('[SupabaseStorage] Base64 upload failure:', err.message);
    throw err;
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFileFromSupabase(filePath, bucket = DEFAULT_BUCKET) {
  try {
    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    if (error) {
      console.warn(`[SupabaseStorage] Delete warning for "${filePath}":`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[SupabaseStorage] Delete error:', err.message);
    return false;
  }
}
