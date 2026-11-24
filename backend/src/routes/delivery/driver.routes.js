import { Router } from 'express';
import {
  getDriverDashboard,
  getAvailableTasks,
  getTaskDetails,
  acceptTask,
  startRun,
  verifyOtpAndDeliver,
  getDriverHistory,
  getDriverEarnings,
  getReversePickups,
  sendDriverOtp,
  verifyDriverOtp,
  submitDriverKyc,
  getDriverKycStatus,
  adminApproveDriver
} from '../../controllers/delivery/driver.controller.js';

const router = Router();

// Driver Authentication (Mobile OTP)
router.post('/auth/send-otp', sendDriverOtp);
router.post('/auth/verify-otp', verifyDriverOtp);

// Driver KYC Onboarding & Status
router.post('/kyc/submit', submitDriverKyc);
router.get('/kyc/status', getDriverKycStatus);

// Ops Admin Approval
router.post('/admin/approve/:driverId', adminApproveDriver);

// Driver Dashboard Stats & Active Task
router.get('/dashboard', getDriverDashboard);

// Available Tasks for Pickup
router.get('/available-tasks', getAvailableTasks);

// Task Details by ID or OrderId
router.get('/task/:taskId', getTaskDetails);

// Accept Task (Assigns to Driver)
router.post('/accept-task/:taskId', acceptTask);

// Start Run (Picked up & In-Transit, Generates Customer OTP)
router.post('/start-run/:taskId', startRun);

// Verify OTP & Mark Delivered
router.post('/verify-otp', verifyOtpAndDeliver);

// Delivery History Archive
router.get('/history', getDriverHistory);

// Driver Earnings & Payout Breakdown
router.get('/earnings', getDriverEarnings);

// Reverse Pickup QC Tasks
router.get('/reverse-pickups', getReversePickups);

export default router;
