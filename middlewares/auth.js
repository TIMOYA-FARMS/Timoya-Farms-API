import { expressjwt } from "express-jwt";
import { BlacklistModel, UserModel } from "../models/user.js";
import { permissions } from "../utils/rbac.js";



export const isAuthenticated = expressjwt({
    secret: process.env.JWT_PRIVATE_KEY,
    algorithms: ["HS256"],
});

export const hasPermission = (action) => {
    return async (req, res, next) => {
        try {
            const user = await UserModel.findById(req.auth.id);

            const permission = permissions.find(value => value.role === user.role);
            if (!permission) {
                return res.status(403).json({ message: "Forbidden: No permission" });
            }

            if (permission.actions.includes(action)) {
                next();
            } else {
                return res.status(403).json({ message: "Action currently unavailable" });
            }
        } catch (error) {
            next(error);
        }
    }
}

export const checkBlacklist = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized; No Token Provided" });
        }

        const blacklistedToken = await BlacklistModel.findOne({ token });
        if (blacklistedToken) {
            return res.status(401).json({ message: "Token expired" });
        }
        next();
    } catch (error) {
        next(error);
    }
}

export const removeExpiredTokens = async () => {
    await BlacklistModel.deleteMany({
        expiresAt: { $lt: new Date() }
    });
}

