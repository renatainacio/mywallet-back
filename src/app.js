import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {MongoClient} from "mongodb";
import { getUser, signin, signup } from "./controllers/users.js";
import { deleteTransaction, getTransactions, postTransaction } from "./controllers/transactions.js";

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL);
try{
    await mongoClient.connect();
} catch(err){
    console.log(err);
}

export const db = mongoClient.db();

app.post("/cadastro", signup);

app.post("/", signin);

app.get("/user", getUser);

app.post("/nova-transacao/:type", postTransaction);

app.get("/transacoes", getTransactions);

app.delete("/:id", deleteTransaction);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))