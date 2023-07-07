import { deleteTransaction, getTransactions, postTransaction, updateTransaction } from "../controllers/transactions.js";
import {Router} from "express";
import validadeSchema from "../middlewares/validateSchema.js";
import { schemaTransaction } from "../schemas/transactions.js";

const transactionRouter = Router()

transactionRouter.post("/nova-transacao/:type", validateAuth, validadeSchema(schemaTransaction), postTransaction);

transactionRouter.get("/transacoes", getTransactions);

transactionRouter.delete("/transacoes/:id", deleteTransaction);

transactionRouter.put("/transacoes/:id", validadeSchema(schemaTransaction), updateTransaction);

export default transactionRouter;