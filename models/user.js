import { model, Schema } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json"


const userSchema = new Schema({
    avatar: {
        type: String,
        required: false,
        trim: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    address: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: ['User', 'Farmer', 'Admin'],
        default: 'User'
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const blackListSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true,
    }

});

blackListSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3 });

userSchema.plugin(toJSON);

export const UserModel = model('User', userSchema);
export const BlacklistModel = model('Blacklist', blackListSchema);
