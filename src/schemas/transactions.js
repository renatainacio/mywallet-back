import Joi from "joi";

export const schemaTransaction = Joi.object({
    description: Joi.string().required(),
    amount: Joi.number().required().positive()
});