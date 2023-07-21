import { db } from "../database/connection.js";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";

export async function postTransaction(req, res){
    const {type} = req.params;
    if(type !== "entrada" && type !== "saida")
        return res.status(422).send("Tipo de transação inválido!");
    
    const {description, amount} = req.body;

    const {session} = res.locals;
    try{

        const resp = await db.collection("transactions").insertOne({
            userId: session.userId,
            description,
            amount,
            type,
            date: dayjs(Date.now()).format('DD/MM')
        });
        return res.sendStatus(201);
    } catch(err){
        console.log(err.message);
        return res.status(500).send("Erro interno no servidor");
    }   
};

export async function getTransactions(req, res){

    //print cookie in console
    console.log(req.cookies.email);

    const {session} = res.locals;
    try{
        const transactions = (await db.collection('transactions').find({userId: session.userId}).toArray()).reverse();
        return res.send(transactions);
    }catch(err){
        return res.status(500).send("Erro interno do servidor");
    } 
}

export async function deleteTransaction(req, res){
    const {id} = req.params;
    try{
        const deleted = await db.collection('transactions').deleteOne({_id: new ObjectId(id)});
        if(deleted.deletedCount === 0) return res.sendStatus(404);
        return res.sendStatus(204);
    }catch(err){
        return res.status(500).send("Erro interno do servidor");
    }
}

export async function updateTransaction(req, res){
    const {id} = req.params;
    const {description, amount} = req.body;

    try{
        const transaction = await db.collection('transactions').findOne({_id: new ObjectId(id)});
        if(!transaction) return res.sendStatus(404);
        transaction.description = description;
        transaction.amount = amount;
        await db.collection('transactions').updateOne({_id: new ObjectId(id)}, {$set: transaction});
        return res.sendStatus(200);
    }catch(err){
        return res.status(500).send("Erro interno do servidor");
    }
}