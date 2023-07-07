import { Router } from "express";
import transactionRouter from "./transactions.js";
import userRouter from "./users.js";

const router = Router();

router.use(transactionRouter);
router.use(userRouter);

export default router;