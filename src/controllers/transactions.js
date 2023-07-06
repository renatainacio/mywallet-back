import Joi from "joi";
import { db } from "../app.js";
import dayjs from "dayjs";

export async function postTransaction(req, res){
    const {type} = req.params;
    if(type !== "entrada" && type !== "saida")
        return res.status(422).send("Tipo de transação inválido!");
    const {authorization} = req.headers;
    const {description, amount} = req.body;
    const {error} = Joi.number().required().positive().validate(amount);
    if(error)
        return res.status(422).send("Valor inválido!");
    const {errorDesc} =  Joi.string().required().validate(description);
    if(errorDesc)
        return res.status(422).send("Campo Descrição não pode estar vazio");
    const token = authorization?.replace("Bearer ", "");
    if(!token) return res.status(401).send("Erro de autenticação");
    try{
        const session = await db.collection("sessions").findOne({token});
        if(!session) return res.status(401).send("Erro de autenticação");
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
    const {authorization} = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if(!token) return res.status(401).send("Erro de autenticação");
    try{
        const session = await db.collection("sessions").findOne({token});
        if(!session) return res.status(401).send("Erro de autenticação");
        const transactions = (await db.collection('transactions').find({userId: session.userId}).toArray()).reverse();
        return res.send(transactions);
    }catch(err){
        return res.status(500).send("Erro interno do servidor");
    } 
}