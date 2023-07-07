import { deleteTransaction, getTransactions, postTransaction, updateTransaction } from "../controllers/transactions.js";
import {Router} from "express";
import validadeSchema from "../middlewares/validateSchema.js";
import { schemaTransaction } from "../schemas/transactions.js";
import validateAuth from "../middlewares/validateAuth.js";

const transactionRouter = Router()

transactionRouter.use(validateAuth);

transactionRouter.post("/nova-transacao/:type", validadeSchema(schemaTransaction), postTransaction);

transactionRouter.get("/transacoes", getTransactions);

transactionRouter.delete("/transacoes/:id", deleteTransaction);

transactionRouter.put("/transacoes/:id", validadeSchema(schemaTransaction), updateTransaction);

export default transactionRouter;