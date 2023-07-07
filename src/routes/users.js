import { getUser, signin, signup } from "../controllers/users.js";
import {Router} from "express";

const userRouter = Router()

userRouter.post("/cadastro", signup);

userRouter.post("/", signin);

userRouter.get("/user", getUser);

export default userRouter;