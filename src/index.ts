import "reflect-metadata";
import express from 'express';
import expressApp from './services/expressApp';
import dbConnect from './services/database';
import { PORT } from "./config/db";
import dotenv from "dotenv";

dotenv.config();
const StartServer = async () => {
    const app = express();
    await dbConnect();
    await expressApp(app);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

StartServer();