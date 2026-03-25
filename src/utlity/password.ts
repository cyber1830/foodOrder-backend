import bcrypt, { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { VendorPayload } from '../dto';
import { JWT_SECRET } from '../config/db';
import express, { Request, Response, NextFunction } from 'express';
import { AuthPayload } from '../dto/auth-dto';

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}


export const validatePassword = async (enteredPassword: string, savedPassword: string) => {
    return await bcrypt.compare(enteredPassword, savedPassword);
}

export const generateSignature = (payload: AuthPayload) => {
   const signature = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
   return signature;
}

export const validateSignature = async (req: Request) => {
    const signature = req.get('Authorization');
    if (!signature) {
        return false;
    }
    try {
        const token = signature.split(' ')[1];
        const decoded = jwt.verify(token as string, JWT_SECRET);
        if(typeof decoded !== 'object' || decoded === null) {
            return false;
        }
        const payload = decoded as AuthPayload;
        req.user = payload;
        return true;
    } catch {
        return false;
    }
}
