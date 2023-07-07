import { deleteTransaction, getTransactions, postTransaction, updateTransaction } from "../controllers/transactions.js";
import {Router} from "express";

const transactionRouter = Router()

transactionRouter.post("/nova-transacao/:type", postTransaction);

transactionRouter.get("/transacoes", getTransactions);

transactionRouter.delete("/transacoes/:id", deleteTransaction);

transactionRouter.put("/transacoes/:id", updateTransaction);

export default transactionRouter;