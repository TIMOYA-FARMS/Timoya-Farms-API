import Joi from "joi";



export const registerUserValidator = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    address: Joi.string().optional().allow(''),
    phone: Joi.string().optional().allow(''),
    role: Joi.string().valid('User', 'Farmer', 'Admin').default('User'),
    avatar: Joi.string().optional().allow(''),
});

export const loginUserValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

export const updateUserValidator = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    email: Joi.string().email().optional(),
    address: Joi.string().optional().allow(''),
    phone: Joi.string().optional().allow(''),
    role: Joi.string().valid('User', 'Farmer', 'Admin').optional(),
    avatar: Joi.string().optional().allow(''),
});