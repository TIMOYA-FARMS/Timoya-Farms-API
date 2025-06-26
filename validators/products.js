import Joi from "joi";

export const createProductValidator = Joi.object({
    productName: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    stock: Joi.number().required().min(0),
    // category: Joi.string().optional().allow(''),
    stockStatus: Joi.string().valid('In Stock', 'Out of Stock', 'Pre-order').default('In Stock'),
    image: Joi.string().optional().allow(''),
    imagePublicId: Joi.string().optional().allow(''),
    quantity: Joi.number().required().min(0)

});

export const updateProductValidator = Joi.object({
    productName: Joi.string().optional(),
    description: Joi.string().optional(),
    price: Joi.number().optional().min(0),
    stock: Joi.number().optional().min(0),
    // category: Joi.string().optional().allow(''),
    stockStatus: Joi.string().valid('In Stock', 'Out of Stock', 'Pre-order').optional(),
    image: Joi.string().optional().allow(''),
    imagePublicId: Joi.string().optional().allow(''),
    quantity: Joi.number().optional().min(0)
});
