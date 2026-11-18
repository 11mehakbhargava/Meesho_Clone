import { Router } from 'express';
import { getReferralStats, applyReferralCode } from '../controllers/referral.controller.js';

const router = Router();

// GET /api/referrals/stats (Real stats, milestones, contacts, and invited friends)
router.get('/stats', getReferralStats);

// POST /api/referrals/apply (Apply referral code on signup or checkout)
router.post('/apply', applyReferralCode);

export default router;
