import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Joi from "joi";
import {MongoClient} from "mongodb";

const PORT=5000;

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
    try{
        const resp = await db.collection('users').findOne({email: email});
        if(resp)
            return res.status(409).send("Email já cadastrado!");
        const userRegister = await db.collection('users').insertOne({
            name: username,
            email: email,
            password: password
        });
        return res.sendStatus(201);
    }catch(err){
        console.log(err.message);
        return res.sendStatus(500);
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
        return res.status(422).send("Campo senha não pode estar vazio");
    try{
        const user = await db.collection('users').findOne({email: email});
        console.log(user);
        if(!user)
            return res.status(404).send("Usuário não cadastrado!");
        if(user.password != password)
            return res.status(401).send("Senha inválida!");
    }catch(err){
        console.log(err.message);
        return res.sendStatus(500);
    }
    res.sendStatus(200);
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))