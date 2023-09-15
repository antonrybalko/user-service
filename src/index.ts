import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import userRouter from './controller/UserController';

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 3000;


app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

app.get('/', (req, res) => res.json({status: 'OK'}));

app.use('/users', userRouter);

app.listen(PORT, () => {
    console.log(`User Service is running on port ${PORT}`);
});