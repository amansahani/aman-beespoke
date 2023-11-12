import express from 'express';
import { findUserById } from '../models/users';

export const hello = async (req: express.Request, res: express.Response) =>{
    const userId = req.body.userId;
    const email = (await findUserById(userId)).Username;
    res.status(200).json({email: email});
} ;