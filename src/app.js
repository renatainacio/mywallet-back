import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
//using cookie parser library
app.use(cookieParser());
app.use(cors());
app.use(router);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))