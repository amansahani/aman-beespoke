import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv';
import { findUserById } from '../models/users';

//LOADS PRIVATE KEY FROM THE ENVIRONMENT
const secretKey = process.env.PRIVATE_KEY;

//VERIFIES THE USER SESSION THROUGH TOKEN
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.sessionToken;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided' });
  }

  try {
    //UNECRYPTS THE TOKEN TO GET USERID
    const decoded: any = jwt.verify(token, secretKey);
    const realToken =  (await findUserById(decoded.userId)).Token
    //PASSES ON THE TOKEN TO THE NEXT METHODS
    if(token === realToken ){
      req.body.userId = decoded.userId;
    }else{
      return res.status(403).json({'error': "forbidden"})
    }
    //NEXT or next() pushes to the next ROUTES
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token'});
  }
};
