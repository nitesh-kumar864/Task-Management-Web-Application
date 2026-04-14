import express from "express";
import { connectDB } from "./db/connectDb.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors';


import authRoute from "./routes/authRoute.js";
import taskRoute from './routes/taskRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000

const corsOptions = {
  origin: [
    "http://localhost:5173",
    process.env.CLIENT_URL,
  ],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("hello world 132");
});

app.use("/api/auth", authRoute);
app.use("/api/tasks",taskRoute);

app.listen(PORT, () => {
    connectDB(); 
    console.log("Server running on port 4000");
});

 