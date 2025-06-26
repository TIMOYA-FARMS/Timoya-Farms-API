export const generateEmailTemplate = (content, action = null) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Notification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                line-height: 1.6;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background-color: #4CAF50;
                color: white;
                padding: 10px 0;
                text-align: center;
                border-radius: 5px;
                margin-bottom: 20px;
            }
            .content {
                background-color: white;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 0.8em;
                color: #777;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #4CAF50;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
            }
            .button:hover {
                background-color: #45a049;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>TIMOYA~FARMS</h1>
        </div>
        <div class="content">
            ${content}
            ${action ? `<div style='text-align:center;'>${action}</div>` : ''}
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} TIMOYA~FARMS. All rights reserved.</p>
            <p>If you have any questions, feel free to contact us at <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a>.</p>
            <p>If you wish to unsubscribe from future emails, click <a href="${process.env.UNSUBSCRIBE_URL || '#'}">here</a>.</p>
        </div>
    </body>
    </html>
    `;       
};


export const generateVerificationEmail = (firstName, verificationLink) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationLink}`;
    return generateEmailTemplate(`
    <h2>Email Verification</h2>
    <p>Dear ${firstName},</p>
    <p>Thank you for registering with TIMOYA~FARMS! To complete your registration, please verify your email address by clicking the button below:</p>
    <div style="text-align: center; margin: 20px 0;">
        <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; class="button">Verify Email</a>
    </div>
    <p>If the button above does not work, you can copy and paste the following link into your browser:</p>
    <p><a href="${verificationUrl}">${verificationUrl}</a></p>
    <p>If you did not create an account, please ignore this email.</p>
    <p>Thank you for choosing TIMOYA~FARMS!</p>
    <p>Best regards,<br>TIMOYA~FARMS Team</p>
    `);
};


export const generatePasswordResetEmail = (firstName, resetLink) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetLink}`;
    return generateEmailTemplate(`
    <h2>Password Reset Request</h2>
    <p>Dear ${firstName},</p>
    <p>We received a request to reset your password. If you did not make this request, please ignore this email.</p>
    <p>To reset your password, please click the button below:</p>
    <div style="text-align: center; margin: 20px 0;">
        <a href="${resetUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
    </div>
    <p>If the button above does not work, you can copy and paste the following link into your browser:</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>Thank you for using TIMOYA~FARMS!</p>
    <p>Best regards,<br>TIMOYA~FARMS Team</p>
    `);
};


export const generatePasswordResetConfirmationEmail = (firstName) => {
    return generateEmailTemplate(`
    <h2>Password Reset Successful</h2>
    <p>Dear ${firstName},</p>
    <p>Your password has been successfully reset. If you did not initiate this change, please contact our support team immediately.</p>
    <p>Thank you for using TIMOYA~FARMS!</p>
    <p>Best regards,<br>TIMOYA~FARMS Team</p>
    `);
}

export const orderConfirmationEmail = (firstName, order) => {
    return generateEmailTemplate(`
    <h2>Order Confirmation</h2>
    <p>Dear ${firstName},</p>
    <p>Thank you for your order! Here are the details:</p>
    <p><strong>Order ID:</strong> ${order._id}</p>
    <ul>
        ${order.products.map(item => `<li>${item.product.productName} - Quantity: ${item.quantity} - Price: GHS ${item.price}</li>`).join('')}
    </ul>
    <p><strong>Total Amount:</strong> GHS ${order.totalPrice}</p>
    ${order.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${order.estimatedDelivery}</p>` : ''}
    <p>We appreciate your business and look forward to serving you again!</p>
    <p>Best regards,<br>TIMOYA~FARMS Team</p>
    `);
}


export const orderStatusUpdateEmail = (firstName, order, status) => {
    return generateEmailTemplate(`
    <h2>Order Status Update</h2>
    <p>Dear ${firstName},</p>
    <p>Your order with ID <strong>${order._id}</strong> has been updated to the following status: <strong>${status}</strong>.</p>
    <p>If you have any questions or concerns, please feel free to contact our support team.</p>
    <p>Thank you for choosing TIMOYA~FARMS!</p>
    <p>Best regards,<br>TIMOYA~FARMS Team</p>
    `);
}