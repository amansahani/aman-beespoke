import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRouter from './src/routes/authRoutes';
import dbAlive from './src/utils/keepAlive'
import catalogRouter from './src/routes/catalogRoutes';

const app = express();
const port = process.env.PORT || 3000;

//PARSES BODY IN JSON OF REQUEST/RESPONSE
app.use(bodyParser.json());

//Parses COOKIE IN RESPONSE AND REQUEST (WILL BE USED FOR SESSIONS)
app.use(cookieParser());
//CORS

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000', // Replace with the actual origin of your React app
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

//CATALOG ROUTES INCLUDES SEARCH AND RECOMMENDATION
app.use('/catalog', catalogRouter);

//CATALOG ROUTES INCLUDES REGISTRATION AND LOGIN
app.use('/auth', authRouter);
app.get('/', (req: express.Request, res: express.Response)=>{
  res.send("Welcome")
})

//AS I AM USING FREE TIER COCROACH DB IT GET SLEEPS AFTER IDLE MINUTES
//TO KEEP IT ALIVE THIS FUNCTION IS USED
dbAlive();

//SERVER IS STARTED
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
