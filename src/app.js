import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Joi from "joi";
import {MongoClient} from "mongodb";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";

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

const db = mongoClient.db();

const schemaUser = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(3)
});

app.post("/cadastro", async(req, res) => {
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
});

app.post("/", async(req, res) => {
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
});

app.get("/user", async(req, res) => {
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
});

app.post("/nova-transacao/:tipo", async(req, res) => {
    const {type} = req.params;
    if(type !== "entrada" || type !== "saida")
        return res.status(422).send("Tipo de transação inválido!");
    const {authorization} = req.headers;
    const {description, amount} = req.body;
    const {error} = Joi.number().required().validate(amount);
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
            userdId: session.userId,
            description,
            amount,
            type
        });
    } catch(err){
        return res.status(500).send("Erro interno no servidor");
    }   
});

app.get("/transacoes", async(req, res) => {
    const {authorization} = req.headers;
    try{

    }catch(err){
        return res.status(500).send("Erro interno do servidor");
    } 
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))