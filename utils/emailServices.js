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
            from: `process.env.SMTP_FROM`, // Sender address>`,
            to,
            subject,
            html,
        };

        return this.transporter.sendMail(mailOptions);
    }
}

export const emailService = new EmailService();

emailService.transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP configuration error:', error);
    } else {
        console.log('SMTP configuration is valid. Ready to send emails.');
    }
});


const sendVerificationEmail = async (firstName, email) => {
    const subject = 'Email Verification - TIMOYA~FARMS';
    const html = generateVerificationEmail(firstName, verificationLink);
    return sendEmail(email, subject, html);
}