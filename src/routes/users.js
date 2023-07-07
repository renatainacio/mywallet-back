import { getUser, signin, signup } from "../controllers/users.js";
import {Router} from "express";
import validadeSchema from "../middlewares/validateSchema.js";
import {schemaUser} from "../schemas/users.js"

const userRouter = Router()

userRouter.post("/cadastro", validadeSchema(schemaUser), signup);

userRouter.post("/", signin);

userRouter.get("/user", getUser);

export default userRouter;