import { db } from "../app.js";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";
import Joi from "joi";

const schemaUser = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(3)
});

export async function signup(req, res){
    const {username, email, password} = req.body;
    const {error, value} = schemaUser.validate({username, email, password}, {abortEarly: false});
    if(error)
        return res.status(422).send(error.message);
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
    console.log(email);
    const {error, value} = Joi.string().email().required().validate(email);
    if(error)
        return res.status(422).send("Email inválido");
    const {errorPassword, valuePassord} =  Joi.string().required().validate(password);
    if(errorPassword)
        return res.status(422).send("Campo Senha não pode estar vazio");
    try{
        const user = await db.collection('users').findOne({email: email});
        console.log(user);
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
    const {authorization} = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if(!token) return res.status(401).send("Erro de autenticação");
    try{
        const session = await db.collection("sessions").findOne({token});
        if(!session) return res.status(401).send("Erro de autenticação");
        const user = await db.collection("users").findOne({_id: session.userId})
        delete user.password;
        res.send(user);
    } catch(err){
        return res.status(500).send("Erro interno no servidor");
    }
};