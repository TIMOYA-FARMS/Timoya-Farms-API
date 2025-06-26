import nodemailer from 'nodemailer';
import { generateVerificationEmail } from './emailTemplates.js';


class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendEmail(to, subject, html) {
        const mailOptions = {
            from: process.env.SMTP_FROM, // Sender address
            to,
            subject,
            html,
        };
        try {
            return await this.transporter.sendMail(mailOptions);
        } catch (err) {
            console.error('Error sending email:', err);
            throw err;
        }
    }
    // Admin low stock alert
    async sendLowStockAlertEmail(productName, stock) {
        const subject = `Low Stock Alert: ${productName}`;
        const html = `<p>Attention Admin,</p><p>The stock for <strong>${productName}</strong> is low: <strong>${stock}</strong> units remaining.</p>`;
        return this.sendEmail(process.env.SUPPORT_EMAIL, subject, html);
    }
}


export const emailService = new EmailService();

emailService.transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP configuration error:', error);
    } else {
        if (!process.env.SUPPORT_EMAIL) {
            console.warn('SUPPORT_EMAIL is not set in environment variables. Some notifications may not be delivered.');
        }
        console.log('SMTP configuration is valid. Ready to send emails.');
    }
});


const sendVerificationEmail = async (firstName, email) => {
    const subject = 'Email Verification - TIMOYA~FARMS';
    const html = generateVerificationEmail(firstName, verificationLink);
    return sendEmail(email, subject, html);
}