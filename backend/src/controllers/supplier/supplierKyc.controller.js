import fs from 'fs';
import path from 'path';
import prisma from '../../config/prisma.js';
import supabase from '../../config/supabaseClient.js';

// Helper to save base64 data URLs as static files in uploads/
const saveBase64Image = (base64Str, baseUrl) => {
  try {
    if (!base64Str || typeof base64Str !== 'string' || !base64Str.startsWith('data:image/')) {
      return base64Str;
    }
    const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return base64Str;
    }
    const mimeType = matches[1];
    const dataBuffer = Buffer.from(matches[2], 'base64');
    let ext = '.jpg';
    if (mimeType.includes('png')) ext = '.png';
    else if (mimeType.includes('webp')) ext = '.webp';
    else if (mimeType.includes('jpeg')) ext = '.jpeg';

    const uploadDir = path.resolve('uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `kyc_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, dataBuffer);

    return `${baseUrl}/uploads/${filename}`;
  } catch (err) {
    console.warn('Failed to save KYC base64 image to disk:', err.message);
    return base64Str;
  }
};

/**
 * 1. Get Current Supplier's KYC Application & Status
 * GET /api/supplier/kyc
 * Strict Database Persistence - No In-Memory Fallbacks
 */
export const getSupplierKyc = async (req, res, next) => {
  try {
    const supplierId = req.supplierId || req.user?.id;

    if (!supplierId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Supplier session missing',
      });
    }

    // Direct database query from KYCApplication
    const kyc = await prisma.kYCApplication.findFirst({
      where: {
        userId: supplierId,
        type: 'supplier',
      },
      orderBy: { createdAt: 'desc' },
    });

    // Fetch verified profile details from PostgreSQL
    const profile = await prisma.profile.findUnique({
      where: { id: supplierId },
      select: {
        storeName: true,
        gstin: true,
        pan: true,
        bankDetails: true,
      },
    });

    return res.status(200).json({
      success: true,
      kyc,
      isVerified: kyc?.status === 'APPROVED',
      profile: profile || null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 2. Submit or Re-submit Supplier KYC Application
 * POST /api/supplier/kyc
 * Strict Database Persistence - Stores in PostgreSQL and uploads directory
 */
export const submitSupplierKyc = async (req, res, next) => {
  try {
    const supplierId = req.supplierId || req.user?.id;

    if (!supplierId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Supplier session missing',
      });
    }

    const hostBaseUrl = `${req.protocol}://${req.get('host')}`;

    const {
      businessName,
      tradeName,
      businessType,
      businessAddress,
      city,
      state,
      pincode,
      gstin,
      panNumber,
      panName,
      aadhaarNumber,
      aadhaarName,
      bankName,
      accountNumber,
      ifsc,
      accountHolder,
      upiId,
      warehouseAddress,
      warehousePincode,
      warehouseContactPerson,
      warehousePhone,
    } = req.body;

    // Process uploaded/base64 document proofs to physical storage
    const gstCertificate = saveBase64Image(req.body.gstCertificate, hostBaseUrl);
    const panImage = saveBase64Image(req.body.panImage, hostBaseUrl);
    const aadhaarFrontImage = saveBase64Image(req.body.aadhaarFrontImage, hostBaseUrl);
    const aadhaarBackImage = saveBase64Image(req.body.aadhaarBackImage, hostBaseUrl);
    const chequeImage = saveBase64Image(req.body.chequeImage, hostBaseUrl);

    if (!businessName && !tradeName) {
      return res.status(400).json({
        success: false,
        message: 'Business Legal Name or Trade Name is required',
      });
    }
    if (!gstin && !panNumber) {
      return res.status(400).json({
        success: false,
        message: 'GSTIN or Business PAN number is required for supplier verification',
      });
    }

    // Structured Documents matching Admin Review Modal expectations
    const documents = {
      businessName: (businessName || tradeName || '').trim(),
      tradeName: (tradeName || businessName || '').trim(),
      storeType: businessType || 'Proprietorship',
      businessType: businessType || 'Proprietorship',
      businessAddress: (businessAddress || '').trim(),
      city: (city || '').trim(),
      state: (state || '').trim(),
      pincode: (pincode || '').trim(),
      gstin: (gstin || '').toUpperCase().trim(),
      gstCertificate: gstCertificate || null,
      pan: {
        number: (panNumber || '').toUpperCase().trim(),
        nameOnDoc: (panName || businessName || '').trim(),
        image: panImage || null,
        status: 'Submitted',
      },
      aadhaar: {
        number: (aadhaarNumber || '').trim(),
        nameOnDoc: (aadhaarName || '').trim(),
        image: aadhaarFrontImage || null,
        backImage: aadhaarBackImage || null,
        status: aadhaarNumber ? 'Submitted' : 'Optional',
      },
      bank: {
        bankName: (bankName || '').trim(),
        accountNumber: (accountNumber || '').trim(),
        ifsc: (ifsc || '').toUpperCase().trim(),
        holderName: (accountHolder || businessName || '').trim(),
        chequeImage: chequeImage || null,
        upiId: (upiId || '').trim(),
      },
      warehouse: {
        address: (warehouseAddress || businessAddress || '').trim(),
        pincode: (warehousePincode || pincode || '').trim(),
        contactPerson: (warehouseContactPerson || '').trim(),
        phone: (warehousePhone || '').trim(),
      },
      submittedAt: new Date().toISOString(),
    };

    // Update Profile in PostgreSQL with latest business & bank details
    await prisma.profile.upsert({
      where: { id: supplierId },
      update: {
        storeName: documents.tradeName,
        gstin: documents.gstin || undefined,
        pan: documents.pan.number || undefined,
        bankDetails: documents.bank,
      },
      create: {
        id: supplierId,
        role: 'SUPPLIER',
        fullName: documents.pan.nameOnDoc || documents.businessName,
        storeName: documents.tradeName,
        gstin: documents.gstin || undefined,
        pan: documents.pan.number || undefined,
        bankDetails: documents.bank,
      },
    });

    // Create new KYC Application record in PostgreSQL database
    const kycApplication = await prisma.kYCApplication.create({
      data: {
        userId: supplierId,
        type: 'supplier',
        status: 'PENDING',
        documents,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
          },
        },
      },
    });

    // Optional sync to Supabase if configured
    if (supabase) {
      try {
        await supabase.from('kyc_applications').insert([
          {
            id: kycApplication.id,
            user_id: supplierId,
            type: 'supplier',
            status: 'PENDING',
            documents,
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (sbErr) {
        console.warn('Optional Supabase sync skipped:', sbErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'KYC documents submitted successfully! Application is currently Under Review by Compliance Team.',
      kyc: kycApplication,
    });
  } catch (error) {
    next(error);
  }
};
