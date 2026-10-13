import prisma from '../../config/prisma.js';
import admin from '../../config/firebaseAdmin.js';

// 1. GET LOGGED IN PROFILE
export const getMyProfile = async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: req.user.id },
      include: { addresses: true }
    });

    if (!profile) {
      return res.status(404).json({ success: false, error: "Profile not found" });
    }

    return res.status(200).json({ success: true, profile });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 2. UPDATE PROFILE DETAILS (Name, Phone, Avatar, Address)
export const updateMyProfile = async (req, res) => {
  try {
    const { fullName, phone, avatarUrl, addressLine, city, state, pincode } = req.body;

    const updatedProfile = await prisma.profile.update({
      where: { id: req.user.id },
      data: {
        fullName: fullName || undefined,
        phone: phone || undefined,
        avatarUrl: avatarUrl || undefined
      }
    });

    // Agar address update bheja hai
    if (addressLine || city || pincode) {
      await prisma.address.upsert({
        where: { id: req.body.addressId || 'non-existent-id' },
        update: { fullName: fullName || updatedProfile.fullName, phone: phone || updatedProfile.phone || '', addressLine, city: city || '', state: state || '', pincode: pincode || '' },
        create: { userId: req.user.id, fullName: fullName || updatedProfile.fullName, phone: phone || updatedProfile.phone || '', addressLine: addressLine || '', city: city || '', state: state || '', pincode: pincode || '' }
      }).catch(() => {});
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedProfile
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 3. CHANGE PASSWORD (Firebase Admin SDK se)
export const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, error: "Password must be at least 6 characters" });
    }

    // Firebase Auth mein password update
    await admin.auth().updateUser(req.user.id, {
      password: newPassword
    });

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
