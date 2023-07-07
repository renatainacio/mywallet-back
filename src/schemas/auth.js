import Joi from "joi";

const schemaAuth = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(3)
});

export default schemaAuth;