import { UserModel } from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { emailService } from "../utils/emailServices.js";
import { generatePasswordResetEmail, generatePasswordResetConfirmationEmail } from "../utils/emailTemplates.js";

// POST /api/auth/request-password-reset
export const requestPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(200).json({ message: "If that email is registered, a reset link has been sent." }); // Do not reveal user existence
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_PRIVATE_KEY, { expiresIn: "1h" });
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
        await user.save();
        await emailService.sendEmail(
            user.email,
            "Reset Your Password - TIMOYA~FARMS",
            generatePasswordResetEmail(user.firstName, resetToken)
        );
        return res.status(200).json({ message: "If that email is registered, a reset link has been sent." });
    } catch (err) {
        next(err);
    }
};

// POST /api/auth/reset-password
export const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) return res.status(400).json({ message: "Token and new password are required." });
        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        } catch (err) {
            return res.status(400).json({ message: "Invalid or expired reset token." });
        }
        const user = await UserModel.findById(payload.id);
        if (!user || user.resetPasswordToken !== token || user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired reset token." });
        }
        user.password = bcrypt.hashSync(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        await emailService.sendEmail(
            user.email,
            "Your Password Has Been Reset - TIMOYA~FARMS",
            generatePasswordResetConfirmationEmail(user.firstName)
        );
        return res.status(200).json({ message: "Password reset successful." });
    } catch (err) {
        next(err);
    }
};
