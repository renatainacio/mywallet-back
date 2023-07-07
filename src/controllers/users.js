import { db } from "../database/connection.js";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";
import Joi from "joi";

export async function signup(req, res){
    const {username, email, password} = req.body;
    const hash = bcrypt.hashSync(password, 10);
    try{
        const resp = await db.collection('users').findOne({email: email});
        if(resp)
            return res.status(409).send("Email já cadastrado!");
        const userRegister = await db.collection('users').insertOne({
            name: username,
            email: email,
            password: hash
        });
        return res.sendStatus(201);
    }catch(err){
        console.log(err.message);
        return res.status(500).send("Erro interno no servidor");
    }  
};

export async function signin(req, res){
    const {email, password} = req.body;
    try{
        const user = await db.collection('users').findOne({email: email});
        if(!user)
            return res.status(404).send("Usuário não cadastrado!");
        const correctPassword = bcrypt.compareSync(password, user.password);
        if(!correctPassword)
            return res.status(401).send("Senha inválida!");
        await db.collection("sessions").deleteMany({userId: user._id});
        const token = uuid();
        await db.collection('sessions').insertOne({token, userId: user._id});
        res.status(200).send(token);
    }catch(err){
        console.log(err.message);
        return res.status(500).send("Erro interno no servidor");
    }
};

export async function getUser (req, res){
    const {session} = res.locals;
    try{
        const user = await db.collection("users").findOne({_id: session.userId})
        delete user.password;
        res.send(user);
    } catch(err){
        return res.status(500).send("Erro interno no servidor");
    }
};