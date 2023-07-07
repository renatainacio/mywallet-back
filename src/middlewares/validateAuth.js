
//post transaction

async function validateAuth(req, res, next){
    const {authorization} = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if(!token) return res.status(401).send("Erro de autenticação");
    try{
        const session = await db.collection("sessions").findOne({token});
        if(!session) return res.status(401).send("Erro de autenticação");
        next()
    } catch(err){
        console.log(err.message);
        return res.status(500).send("Erro interno no servidor");
    }
}
