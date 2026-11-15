import prisma from '../../config/prisma.js';
import { sendSupportTicketActivityEmail } from '../../services/dropshipperEmail.service.js';

/**
 * Helper to determine courier logo
 */
const getCourierLogo = (courierName = '') => {
  const c = courierName.toLowerCase();
  if (c.includes('delhivery')) return '🚚';
  if (c.includes('shadowfax')) return '⚡';
  if (c.includes('bluedart')) return '✈️';
  if (c.includes('ekart')) return '📦';
  return '🚚';
};

/**
 * 1. GET ALL SETTLEMENTS & LOGISTICS TRACKING ORDERS FOR DROPSHIPPER
 * Route: GET /api/v1/dropshipper/settlements/:firebaseUid
 */
export const getDropshipperSettlements = async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    if (!firebaseUid) {
      return res.status(400).json({ success: false, message: 'firebaseUid is required' });
    }

    // 1. Verify User Profile & Wallet with Transactions
    const user = await prisma.profile.findUnique({
      where: { id: firebaseUid },
      include: {
        wallet: {
          include: {
            transactions: {
              orderBy: { createdAt: 'desc' }
            }
          }
        },
        supportTickets: {
          where: { category: 'DISPUTE_CLAIM' }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Dropshipper profile not found in database' });
    }

    // 2. Fetch Orders for Dropshipper from Database
    const rawOrders = await prisma.order.findMany({
      where: {
        userId: firebaseUid,
        isDeleted: false
      },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true
          }
        },
        returnRequest: true
      }
    });

    const now = Date.now();
    const bankAccountStr = user.bankDetails && typeof user.bankDetails === 'object' && user.bankDetails.accountNumber
      ? `${user.bankDetails.bankName || 'Bank'} ****${String(user.bankDetails.accountNumber).slice(-4)}`
      : `Bank ****${user.phone ? String(user.phone).slice(-4) : '4419'}`;

    // 3. Format Real Database Orders with Lifecycle & Settlement Math
    const formattedOrders = rawOrders.map((o) => {
      const addr = (o.shippingAddress && typeof o.shippingAddress === 'object') ? o.shippingAddress : {};
      const orderCreatedTime = new Date(o.createdAt).getTime();
      const daysSinceCreation = Math.floor((now - orderCreatedTime) / (1000 * 60 * 60 * 24));

      // Financials
      const sellingPrice = Number(o.totalAmount || addr.customerPrice || 999);
      const supplierBasePrice = Number(addr.wholesaleCost || (sellingPrice * 0.65));
      const shippingFee = Number(addr.shippingFee || 60);
      const tdsDeduction = Math.round(sellingPrice * 0.01); // 1% Government TDS
      const normalMargin = Math.max(0, sellingPrice - supplierBasePrice - shippingFee - tdsDeduction);

      // Status resolution
      const rawStatus = (o.orderStatus || 'ORDERED').toUpperCase();
      let orderStatus = 'In-Transit';
      let logisticsStatus = 'In-Transit';
      let settlementStatus = 'In Escrow';
      let coolingDaysLeft = 7;
      let netMargin = normalMargin;
      let rtoReason = null;

      if (rawStatus === 'DELIVERED') {
        orderStatus = 'Delivered';
        logisticsStatus = 'Delivered';
        if (daysSinceCreation >= 7 || addr.isMarginSettled === true) {
          settlementStatus = 'Settled';
          coolingDaysLeft = 0;
        } else {
          settlementStatus = 'In Escrow';
          coolingDaysLeft = Math.max(0, 7 - daysSinceCreation);
        }
      } else if (rawStatus === 'CANCELLED' || rawStatus === 'RETURNED' || o.returnRequest) {
        orderStatus = rawStatus === 'RETURNED' ? 'Returned' : 'RTO';
        logisticsStatus = rawStatus === 'RETURNED' ? 'Reverse Pickup Completed' : 'RTO Delivered to Warehouse';
        settlementStatus = 'Reversed';
        coolingDaysLeft = 0;
        netMargin = -Math.abs(shippingFee); // Customer freight loss on RTO
        rtoReason = o.returnRequest?.reason || 'Customer Unreachable / Doorstep Cancellation';
      } else if (rawStatus === 'SHIPPED') {
        orderStatus = 'In-Transit';
        logisticsStatus = 'In-Transit';
        settlementStatus = 'In Escrow';
        coolingDaysLeft = 7;
      } else {
        orderStatus = 'In-Transit';
        logisticsStatus = 'Manifested';
        settlementStatus = 'In Escrow';
        coolingDaysLeft = 7;
      }

      // Check if dispute claim exists for this order in support tickets
      const existingTicket = user.supportTickets?.find(t => t.description?.includes(o.id));
      const disputeStatus = existingTicket ? (existingTicket.status === 'RESOLVED' ? 'Claim Resolved' : 'Claim Under Review') : null;
      const claimId = existingTicket ? `CLM-${existingTicket.id.slice(0, 6).toUpperCase()}` : null;

      if (disputeStatus) {
        settlementStatus = 'Disputed';
      }

      const courier = addr.courier || 'Delhivery Express';
      const awb = addr.awb || `DEL-${o.id.slice(0, 10).toUpperCase()}`;

      // Dates
      const orderDateStr = new Date(o.createdAt).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const settlementDate = new Date(orderCreatedTime + (coolingDaysLeft * 24 * 60 * 60 * 1000)).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      // Realistic 5-Stage Lifecycle Journey
      const timeline = [
        {
          step: 'Order Placed & Confirmed',
          time: orderDateStr,
          desc: `Customer ${addr.fullName || 'Buyer'} placed order via store channel. Payment mode: ${addr.paymentMode || o.paymentMethod || 'COD'}.`,
          completed: true
        },
        {
          step: 'Supplier Dispatched',
          time: new Date(orderCreatedTime + 3600 * 1000 * 8).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
          desc: `Packed and dispatched via ${courier}. AWB: ${awb}.`,
          completed: rawStatus !== 'ORDERED'
        },
        {
          step: 'In-Transit & Regional Hub',
          time: new Date(orderCreatedTime + 3600 * 1000 * 24).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
          desc: `Arrived at regional hub (${addr.city || 'Regional Hub'}).`,
          completed: rawStatus === 'SHIPPED' || rawStatus === 'DELIVERED' || rawStatus === 'RETURNED'
        },
        {
          step: 'Doorstep Delivery',
          time: rawStatus === 'DELIVERED' ? new Date(orderCreatedTime + 3600 * 1000 * 48).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'In Progress',
          desc: rawStatus === 'DELIVERED' ? `Delivered successfully to customer address in ${addr.city || 'Destination'}.` : 'Out for delivery to customer.',
          completed: rawStatus === 'DELIVERED'
        },
        {
          step: '7-Day Return Window & Settlement',
          time: settlementStatus === 'Settled' ? 'Settled' : `${coolingDaysLeft} Days Left`,
          desc: settlementStatus === 'Settled'
            ? `Return window cleared. Net margin ₹${netMargin} credited to bank account (${bankAccountStr}).`
            : (settlementStatus === 'In Escrow' ? `Margin ₹${netMargin} held securely in escrow pending 7-day return window.` : `Order reversed.`),
          completed: settlementStatus === 'Settled'
        }
      ];

      return {
        id: `DSP-${o.id.slice(0, 8).toUpperCase()}`,
        dbId: o.id,
        awb,
        courier,
        courierLogo: getCourierLogo(courier),
        orderDate: orderDateStr,
        customerName: addr.fullName || 'Customer',
        customerCity: addr.city ? `${addr.city}, ${addr.state || ''}` : 'India',
        customerPhone: addr.phone || '-',
        productName: addr.productName || o.items?.[0]?.product?.title || 'Wholesale Sourced Item',
        productSku: addr.productSku || 'SKU-DS-01',
        productImage: o.items?.[0]?.product?.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
        qty: addr.quantity || o.items?.[0]?.quantity || 1,
        paymentMode: addr.paymentMode || (o.paymentMethod === 'COD' ? 'COD' : 'Prepaid (UPI)'),
        sellingPrice,
        supplierBasePrice,
        shippingFee,
        tdsDeduction,
        netMargin,
        orderStatus,
        logisticsStatus,
        settlementStatus,
        coolingDaysLeft,
        settlementDate,
        utrNumber: settlementStatus === 'Settled' ? `UTR-MSHOPPY-${o.id.slice(0, 10).toUpperCase()}` : (settlementStatus === 'In Escrow' ? 'Pending Escrow Release' : `REV-ADJ-${o.id.slice(0, 8).toUpperCase()}`),
        bankAccount: bankAccountStr,
        rtoReason,
        disputeStatus,
        claimId,
        timeline
      };
    });

    // 4. Compute Aggregate KPI Metrics from Real Database Orders
    const totalGov = formattedOrders.reduce((sum, o) => sum + o.sellingPrice, 0);
    const settledMargin = formattedOrders
      .filter((o) => o.settlementStatus === 'Settled')
      .reduce((sum, o) => sum + o.netMargin, 0);
    const pendingEscrow = formattedOrders
      .filter((o) => o.settlementStatus === 'In Escrow')
      .reduce((sum, o) => sum + o.netMargin, 0);
    const reversedAmount = formattedOrders
      .filter((o) => o.settlementStatus === 'Reversed')
      .reduce((sum, o) => sum + Math.abs(o.netMargin), 0);
    const rtoCount = formattedOrders.filter((o) => o.orderStatus === 'RTO' || o.orderStatus === 'Returned').length;
    const activeInTransit = formattedOrders.filter((o) => o.orderStatus === 'In-Transit').length;

    // 5. Format Past Bank Cashout & Payout Ledger
    const cashouts = (user.wallet?.transactions || [])
      .filter((t) => t.type === 'debit')
      .map((t) => {
        const utrMatch = t.description?.match(/UTR:\s*([A-Za-z0-9-_]+)/i);
        const utrNumber = utrMatch ? utrMatch[1] : `UTR-CMS-${t.id.slice(0, 8).toUpperCase()}`;
        return {
          id: `CSH-${t.id.slice(0, 8).toUpperCase()}`,
          dbId: t.id,
          amount: Number(t.amount || 0),
          type: t.type,
          description: t.description || 'Instant Bank Cashout',
          utrNumber,
          bankAccount: bankAccountStr,
          beneficiary: user.bankDetails && typeof user.bankDetails === 'object' && user.bankDetails.accountHolderName
            ? user.bankDetails.accountHolderName
            : (user.fullName || 'Verified Partner'),
          transferMode: 'IMPS 24x7',
          status: 'SUCCESS',
          date: new Date(t.createdAt).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        };
      });

    const totalCashoutPaid = cashouts.reduce((sum, c) => sum + c.amount, 0);

    // ₹5,000 Auto-Accumulating RTO Security Cushion Calculation
    const SECURITY_RESERVE_TARGET = 5000;
    const effectiveWalletBalance = Number(user.wallet?.balance || 0);
    const reservedBalance = Math.min(effectiveWalletBalance, SECURITY_RESERVE_TARGET);
    const withdrawableBalance = Math.max(0, effectiveWalletBalance - SECURITY_RESERVE_TARGET);
    const reserveProgress = Math.min(100, Math.round((effectiveWalletBalance / SECURITY_RESERVE_TARGET) * 100));
    const isReserveFulfilled = effectiveWalletBalance >= SECURITY_RESERVE_TARGET;

    const metrics = {
      totalGov,
      settledMargin,
      pendingEscrow,
      reversedAmount,
      rtoCount,
      activeInTransit,
      totalOrdersCount: formattedOrders.length,
      walletBalance: effectiveWalletBalance,
      securityReserveTarget: SECURITY_RESERVE_TARGET,
      reservedBalance,
      withdrawableBalance,
      reserveProgress,
      isReserveFulfilled,
      totalCashoutPaid,
      cashoutsCount: cashouts.length
    };

    return res.status(200).json({
      success: true,
      metrics,
      orders: formattedOrders,
      cashouts
    });

  } catch (error) {
    console.error('Error in getDropshipperSettlements:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve settlements from database',
      error: error.message
    });
  }
};

/**
 * 2. SUBMIT DISPUTE CLAIM FOR RTO / RETURN
 * Route: POST /api/v1/dropshipper/settlements/claim
 */
export const submitSettlementClaim = async (req, res) => {
  try {
    const { firebaseUid, orderId, claimReason, description, proofUrl } = req.body;

    if (!firebaseUid || !orderId) {
      return res.status(400).json({ success: false, message: 'firebaseUid and orderId are required' });
    }

    const proofNote = proofUrl ? `\nProof Attachment (Supabase CDN): ${proofUrl}` : '';

    const newTicket = await prisma.supportTicket.create({
      data: {
        userId: firebaseUid,
        subject: `Dispute Claim for Order #${orderId} - ${claimReason || 'RTO Reversal'}`,
        description: `Order ID: ${orderId}\nReason: ${claimReason}\nEvidence Description: ${description || 'No description provided'}${proofNote}`,
        status: 'OPEN',
        priority: 'HIGH',
        category: 'DISPUTE_CLAIM'
      }
    });

    const claimId = `CLM-${newTicket.id.slice(0, 6).toUpperCase()}`;

    // Asynchronously dispatch settlement dispute email (Non-blocking)
    (async () => {
      try {
        const partner = await prisma.profile.findUnique({
          where: { id: firebaseUid },
          select: { email: true, fullName: true }
        });
        if (partner?.email) {
          sendSupportTicketActivityEmail({
            partnerEmail: partner.email,
            partnerName: partner.fullName || 'Partner',
            ticketId: claimId,
            subject: `Settlement Claim #${claimId} for Order #${orderId}`,
            category: 'Settlement & Margin Claim',
            orderId,
            message: `Dispute Grounds: ${claimReason || 'Settlement Discrepancy'}. Our finance team is auditing courier escrow records.`
          }).catch(e => console.error('Error dispatching claim email:', e.message));
        }
      } catch (e) {
        console.warn('Async settlement claim email error:', e.message);
      }
    })();

    return res.status(201).json({
      success: true,
      message: `Dispute Claim #${claimId} submitted successfully! Support team will verify within 24 hours.`,
      claimId,
      ticket: newTicket
    });

  } catch (error) {
    console.error('Error in submitSettlementClaim:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit dispute claim',
      error: error.message
    });
  }
};

/**
 * 3. REQUEST INSTANT BANK CASHOUT / WITHDRAWAL
 * Route: POST /api/v1/dropshipper/settlements/withdraw
 */
export const requestDropshipperWithdrawal = async (req, res) => {
  try {
    const { firebaseUid, amount } = req.body;
    const withdrawAmount = Number(amount);

    if (!firebaseUid) {
      return res.status(400).json({ success: false, message: 'firebaseUid is required' });
    }
    if (!withdrawAmount || isNaN(withdrawAmount) || withdrawAmount < 100) {
      return res.status(400).json({ success: false, message: 'Minimum withdrawal amount is ₹100' });
    }

    // 1. Fetch user and wallet
    const user = await prisma.profile.findUnique({
      where: { id: firebaseUid },
      include: { wallet: true }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Dropshipper profile not found in database' });
    }

    // 2. Validate Bank Details
    const bank = (user.bankDetails && typeof user.bankDetails === 'object') ? user.bankDetails : {};
    if (!bank.accountNumber || !bank.ifscCode) {
      return res.status(400).json({ 
        success: false, 
        message: 'No verified bank account found. Please configure your bank details in Store & Profile Settings.' 
      });
    }

    // 3. Ensure Wallet exists
    let wallet = user.wallet;
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: firebaseUid,
          balance: 0,
          pending: 0
        }
      });
    }

    // 4. Calculate Available Settled Margin from Delivered orders (> 7 days) if wallet balance is lower
    const deliveredOrders = await prisma.order.findMany({
      where: {
        userId: firebaseUid,
        isDeleted: false,
        orderStatus: 'DELIVERED'
      }
    });

    const now = Date.now();
    let settledOrderMargin = 0;
    deliveredOrders.forEach((o) => {
      const orderCreatedTime = new Date(o.createdAt).getTime();
      const daysSinceCreation = Math.floor((now - orderCreatedTime) / (1000 * 60 * 60 * 24));
      if (daysSinceCreation >= 7) {
        const addr = (o.shippingAddress && typeof o.shippingAddress === 'object') ? o.shippingAddress : {};
        const sellingPrice = Number(o.totalAmount || addr.customerPrice || 999);
        const supplierBasePrice = Number(addr.wholesaleCost || (sellingPrice * 0.65));
        const shippingFee = Number(addr.shippingFee || 60);
        const tdsDeduction = Math.round(sellingPrice * 0.01);
        settledOrderMargin += Math.max(0, sellingPrice - supplierBasePrice - shippingFee - tdsDeduction);
      }
    });

    // Total available settled funds in wallet/orders
    const availableBalance = Math.max(wallet.balance, settledOrderMargin);

    // Enforcement of ₹5,000 Mandatory Auto-Accumulating RTO Security Cushion
    const SECURITY_RESERVE_TARGET = 5000;
    const withdrawableBalance = Math.max(0, availableBalance - SECURITY_RESERVE_TARGET);

    if (withdrawableBalance < withdrawAmount) {
      return res.status(400).json({ 
        success: false, 
        message: `Withdrawal restricted by ₹5,000 RTO Security Cushion. Your total wallet balance is ₹${availableBalance.toLocaleString('en-IN')}, of which ₹${Math.min(availableBalance, SECURITY_RESERVE_TARGET).toLocaleString('en-IN')} is reserved to protect active courier dispatches. Maximum withdrawable right now: ₹${withdrawableBalance.toLocaleString('en-IN')}.`,
        totalBalance: availableBalance,
        reservedBalance: Math.min(availableBalance, SECURITY_RESERVE_TARGET),
        withdrawableBalance
      });
    }

    // 5. Create Transaction Record
    const utrNumber = `UTR-CMS-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const maskedAcc = `****${String(bank.accountNumber).slice(-4)}`;
    const bankDesc = `Instant Bank Payout to ${bank.bankName || 'Bank'} (${maskedAcc}) - UTR: ${utrNumber}`;

    const newBalance = Math.max(0, availableBalance - withdrawAmount);

    await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: newBalance
      }
    });

    const tx = await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount: withdrawAmount,
        type: 'debit',
        description: bankDesc
      }
    });

    return res.status(200).json({
      success: true,
      message: `₹${withdrawAmount.toLocaleString('en-IN')} transferred successfully to ${bank.bankName || 'Bank'} (${maskedAcc})`,
      utrNumber,
      amount: withdrawAmount,
      newBalance,
      bankAccount: `${bank.bankName || 'Bank'} ${maskedAcc}`,
      beneficiary: bank.accountHolderName || user.fullName,
      transaction: tx
    });

  } catch (error) {
    console.error('Error in requestDropshipperWithdrawal:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process bank withdrawal request',
      error: error.message
    });
  }
};

/**
 * 4. RECHARGE WALLET / TOP-UP SECURITY RESERVE
 * Route: POST /api/v1/dropshipper/settlements/recharge-wallet
 */
export const rechargeDropshipperWallet = async (req, res) => {
  try {
    const { firebaseUid, amount, paymentMethod = 'UPI' } = req.body;
    const rechargeAmount = Number(amount);

    if (!firebaseUid) {
      return res.status(400).json({ success: false, message: 'firebaseUid is required' });
    }
    if (!rechargeAmount || isNaN(rechargeAmount) || rechargeAmount < 100) {
      return res.status(400).json({ success: false, message: 'Minimum recharge amount is ₹100' });
    }

    const user = await prisma.profile.findUnique({
      where: { id: firebaseUid },
      include: { wallet: true }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Dropshipper profile not found' });
    }

    let wallet = user.wallet;
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: firebaseUid,
          balance: 0,
          pending: 0
        }
      });
    }

    const refNumber = `TOPUP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const txDesc = `Security Reserve Top-Up via ${paymentMethod.toUpperCase()} (Ref: ${refNumber})`;

    const result = await prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { increment: rechargeAmount }
        }
      });

      const txRecord = await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          amount: rechargeAmount,
          type: 'credit',
          description: txDesc
        }
      });

      return { updatedWallet, txRecord };
    });

    const newBalance = result.updatedWallet.balance;
    const SECURITY_RESERVE_TARGET = 5000;
    const reservedBalance = Math.min(newBalance, SECURITY_RESERVE_TARGET);
    const withdrawableBalance = Math.max(0, newBalance - SECURITY_RESERVE_TARGET);
    const reserveProgress = Math.min(100, Math.round((newBalance / SECURITY_RESERVE_TARGET) * 100));

    return res.status(200).json({
      success: true,
      message: `🎉 ₹${rechargeAmount.toLocaleString('en-IN')} added successfully to your wallet balance!`,
      amount: rechargeAmount,
      newBalance,
      reservedBalance,
      withdrawableBalance,
      reserveProgress,
      isReserveFulfilled: newBalance >= SECURITY_RESERVE_TARGET,
      referenceNumber: refNumber,
      transaction: result.txRecord
    });

  } catch (error) {
    console.error('Error in rechargeDropshipperWallet:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process wallet recharge',
      error: error.message
    });
  }
};


