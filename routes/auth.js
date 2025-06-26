import { Router } from "express";
import { requestPasswordReset, resetPassword } from "../controllers/auth.js";

const authRouter = Router();

// Request password reset
authRouter.post("/request-password-reset", requestPasswordReset);
// Reset password
authRouter.post("/reset-password", resetPassword);

export default authRouter;
