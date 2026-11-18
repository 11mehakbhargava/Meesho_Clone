import {
  sendDropshipperOrderPushEmail,
  sendCustomerWhiteLabelConfirmationEmail,
  sendOrderDispatchedEmail,
  sendOrderDeliveredMarginReleasedEmail,
  sendRotWaiverAlertEmail,
  sendSupportTicketActivityEmail,
  sendDropshipperKycStatusEmail
} from '../../services/dropshipperEmail.service.js';

/**
 * Controller to trigger and test Dropshipper Email Templates live
 * POST /api/v1/dropshipper/email/test
 */
export const testDropshipperEmail = async (req, res) => {
  try {
    const {
      to,
      templateType = 'ORDER_PUSH',
      partnerName = 'Partner Seller',
      storeName = 'Partner Store',
      customerName = 'Valued Customer'
    } = req.body;

    if (!to || !to.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'A valid email address ("to") is required'
      });
    }

    let sent = false;
    const testOrderId = `DSP-${Math.floor(10000000 + Math.random() * 90000000)}`;

    switch (templateType.toUpperCase()) {
      case 'ORDER_PUSH':
        sent = await sendDropshipperOrderPushEmail({
          partnerEmail: to,
          partnerName,
          storeName,
          orderId: testOrderId,
          productTitle: 'Kids Boys Printed Cotton Kurta Set',
          quantity: 1,
          customerPrice: 999,
          resellMargin: 468,
          escrowAmount: 468,
          destinationCity: 'Gwalior, Madhya Pradesh'
        });
        break;

      case 'CUSTOMER_CONFIRMATION':
        sent = await sendCustomerWhiteLabelConfirmationEmail({
          customerEmail: to,
          customerName,
          storeBrandName: storeName,
          orderId: testOrderId,
          productTitle: 'Kids Boys Printed Cotton Kurta Set',
          quantity: 1,
          totalAmount: 999,
          shippingAddress: 'Flat 402, Royal Palms, City Center, Gwalior - 474011',
          supportPhone: '+91 98765 43210'
        });
        break;

      case 'DISPATCH':
        sent = await sendOrderDispatchedEmail({
          to,
          recipientName: partnerName,
          storeName,
          orderId: testOrderId,
          courierName: 'Delhivery Express Air',
          awbNumber: `DEL-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          productTitle: 'Kids Boys Printed Cotton Kurta Set',
          destinationCity: 'Gwalior, MP'
        });
        break;

      case 'DELIVERED':
        sent = await sendOrderDeliveredMarginReleasedEmail({
          partnerEmail: to,
          partnerName,
          storeName,
          orderId: testOrderId,
          productTitle: 'Kids Boys Printed Cotton Kurta Set',
          resellMargin: 468,
          newWalletBalance: 14200
        });
        break;

      case 'ROT_WAIVER':
        sent = await sendRotWaiverAlertEmail({
          partnerEmail: to,
          partnerName,
          storeName,
          orderId: testOrderId,
          returnReason: 'Customer Refused at Doorstep',
          waivedFreight: 120,
          tierName: 'Platinum 100% Shield'
        });
        break;

      case 'TICKET':
        sent = await sendSupportTicketActivityEmail({
          partnerEmail: to,
          partnerName,
          ticketId: 'TCK-DE423ABF',
          subject: 'Courier stuck in transit > 48 hours',
          category: 'Courier Delivery Delay',
          orderId: testOrderId,
          message: 'Our logistics escalation team has raised a priority NDR resolution with Delhivery hub.',
          isReply: true
        });
        break;

      case 'KYC':
        sent = await sendDropshipperKycStatusEmail({
          partnerEmail: to,
          partnerName,
          storeName,
          status: 'APPROVED'
        });
        break;

      default:
        return res.status(400).json({
          success: false,
          message: `Unknown templateType: ${templateType}. Valid types: ORDER_PUSH, CUSTOMER_CONFIRMATION, DISPATCH, DELIVERED, ROT_WAIVER, TICKET, KYC`
        });
    }

    if (sent) {
      return res.status(200).json({
        success: true,
        message: `Test email (${templateType}) sent successfully to ${to}! Check your inbox.`,
        templateType,
        recipient: to
      });
    } else {
      return res.status(500).json({
        success: false,
        message: `Failed to deliver email. Please check SMTP configuration in .env.`,
        recipient: to
      });
    }

  } catch (error) {
    console.error('Error in testDropshipperEmail controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while dispatching test email',
      error: error.message
    });
  }
};

