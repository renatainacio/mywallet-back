import { getUser, signin, signup } from "../controllers/users.js";
import {Router} from "express";
import validadeSchema from "../middlewares/validateSchema.js";
import {schemaUser} from "../schemas/users.js"
import validateAuth from "../middlewares/validateAuth.js";
import schemaAuth from "../schemas/auth.js";

const userRouter = Router()

userRouter.post("/cadastro", validadeSchema(schemaUser), signup);

userRouter.post("/", validadeSchema(schemaAuth), signin);

userRouter.get("/user", validateAuth, getUser);

export default userRouter;