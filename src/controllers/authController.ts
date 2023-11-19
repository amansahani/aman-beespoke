import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByUsername, updateUserToken } from '../models/users';
import 'dotenv';

//Loading SECRET KEY FROM ENVIRONMENT

const secretKey = process.env.PRIVATE_KEY;

//REGISTER USER

export const registerUser = async (req: Request, res: Response) => {
  let { Username, Customer_name, Gender, Preffered_category, Password }  = req.body;
  if(!Username || !Customer_name || !Gender || Password){
    return res.status(400).json({message : "Bad Request"});
  }
  Username = Username.trim().toLowerCase();
  //Adding SALTS to PASSWORD

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(Password, saltRounds);
  
  const existingUser = await findUserByUsername(Username);
  //EXISTING USER 
  if(existingUser){
    return res.status(303).json({error: "An existingUser is already in use."});
  }
  //CREATE USER
  try {
    const user = await createUser({
      Username: Username, 
      Customer_name: Customer_name,
      Gender: Gender,
      Preffered_category: Preffered_category,
      Password: hashedPassword});

    return res.status(200).json({ message: `User ${user.Customer_name} registered successfully` });
  } catch (error) {
    return res.status(400).json({ error: 'Registration failed' });
  }
};

//LOGIN USER
export const loginUser = async (req: Request, res: Response) => { 
  let { Username, Password } = req.body;
  
  if(!Username || !Password){
    return res.status(400).json({message : "Bad Request"});
  }
  Username = Username.trim().toLowerCase();
  
  const user = await findUserByUsername(Username);
  //Account is not available
  if (!user) {
    return res.status(403).json({ error: 'User not found' });
  }

  const passwordMatch = await bcrypt.compare(Password, user.Password);
  //Incorrect Credentials
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Incorrect Credentials' });
  }
  //LOGGED IN
  try {
    const token = jwt.sign({ userId: user.Id }, secretKey, { expiresIn: '1w' });
    await updateUserToken(user.Id, token);
    res.cookie('sessionToken', token, 
    {maxAge: 1000 * 60 * 60 * 24 * 7, 
      sameSite: 'strict',
      
    httpOnly: true });

  return res.status(200).json({ "message" : "Success" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ "error" : "Login Failed"});
  }

  // Save the token in the database
  
};
