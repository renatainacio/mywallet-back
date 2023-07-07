import Joi from "joi";

export const schemaUser = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(3)
});