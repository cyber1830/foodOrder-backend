import { MONGO_URI } from '../config/db';
import mongoose from 'mongoose';

export default async () => {
    try {
        mongoose.connect(MONGO_URI, {
        }).then(() => {
            console.log("Connected to MongoDB");
        }).catch((err) => {
            console.error("Error connecting to MongoDB", err);
        });

    } catch (error) {
        console.error("Error connecting to MongoDB", error);
    }
}
