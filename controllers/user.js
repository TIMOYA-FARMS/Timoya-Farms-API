import { BlacklistModel, UserModel } from "../models/user.js";
import { loginUserValidator, registerUserValidator, updateUserValidator } from "../validators/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";



export const registerUser = async (req, res, next) => {
    try {
        const { error, value } = registerUserValidator.validate(req.body, { avatar: req.file?.filename });
        if (error) {
            return res.status(422).json(error.details[0].message);
        }

        const user = await UserModel.findOne({ email: value.email });
        if (user) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashPassword = bcrypt.hashSync(value.password, 10);

        const newUser = await UserModel.create({
            ...value,
            password: hashPassword
        })
        // Send verification email
        const { generateVerificationEmail } = await import('../utils/emailTemplates.js');
        const { emailService } = await import('../utils/emailServices.js');
        const verificationToken = jwt.sign({ id: newUser._id }, process.env.JWT_PRIVATE_KEY, { expiresIn: '1d' });
        await emailService.sendEmail(
            newUser.email,
            'Verify your email - TIMOYA~FARMS',
            generateVerificationEmail(newUser.firstName, verificationToken)
        );
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        next(error);

    }
};

export const userLogin = async (req, res, next) => {
    // TODO: In future, detect new device/IP and send login alert email using generateNewDeviceLoginEmail

    try {
        const { error, value } = loginUserValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error.details[0].message);
        }

        const user = await UserModel.findOne({ email: value.email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const validPassword = bcrypt.compareSync(value.password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_PRIVATE_KEY,
            { expiresIn: "1d" }
        )

        return res.status(200).json({
            message: "Login successful",
            accessToken: token,
        });

    } catch (error) {
        next(error);

    }
}



export const getUserProfile = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.auth.id).select({ password: 0, __v: 0 });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            message: "User profile retrieved successfully",
            user
        });
    } catch (error) {
        next(error);
    }
}

export const getUserProfiles = async (req, res, next) => {
    try {
        const { filter = '{}', sort = '{}', limit = 10, page = 1, skip = 0 } = req.query;

        const users = await UserModel
            .find(JSON.parse(filter))
            .sort(JSON.parse(sort))
            .limit(limit)
            .skip(skip)
            .select({ password: 0, __v: 0 });

        res.json({
            message: "User profiles retrieved successfully",
            users,
            total: await UserModel.countDocuments(JSON.parse(filter)),
            limit: (limit),
        });


    } catch (error) {
        next(error);
    }
}

export const updateUserProfile = async (req, res, next) => {
    try {
        const { error, value } = updateUserValidator.validate({
            ...req.body,
            avatar: req.file?.filename
        });
        if (error) {
            return res.status(422).json(error.details[0].message);
        }

        const updatedUser = await UserModel.findByIdAndUpdate(req.auth.id, value);
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // Send profile update email
        const { generateProfileUpdateEmail } = await import('../utils/emailTemplates.js');
        const { emailService } = await import('../utils/emailServices.js');
        await emailService.sendEmail(
            updatedUser.email,
            'Profile Updated - TIMOYA~FARMS',
            generateProfileUpdateEmail(updatedUser.firstName)
        );
        return res.status(200).json({
            message: "User profile updated successfully",
            user: {
                id: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                role: updatedUser.role
            }
        });
    } catch (error) {
        next(error);
    }

}

export const adminUpdateUserProfile = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { error, value } = updateUserValidator.validate({
            ...req.body,
            avatar: req.file?.filename
        });
        if (error) {
            return res.status(422).json(error.details[0].message);
        }

        const updatedUser = await UserModel.findByIdAndUpdate(userId, value, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        next(error);
        
    }
};


export const userLogout = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized; No Token Provided" });
        }

        const decodedToken = jwt.decode(token);
        const expiresAt = new Date(decodedToken.exp * 1000);

        await BlacklistModel.create({
            token,
            expiresAt
        });

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        next(error);
        
    }
}


export const deleteUserProfile = async (req, res, next) => {
    try {
        const user = await UserModel.findByIdAndDelete(req.auth.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Send account deletion confirmation email
        const { generateAccountDeletionEmail } = await import('../utils/emailTemplates.js');
        const { emailService } = await import('../utils/emailServices.js');
        await emailService.sendEmail(
            user.email,
            'Account Deleted - TIMOYA~FARMS',
            generateAccountDeletionEmail(user.firstName)
        );
        return res.status(200).json({
            message: "User profile deleted successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
}