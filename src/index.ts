import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { Logger } from "tslog";
import { AppDataSource} from "./data-source";
import { User } from "./entity/User";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const logger = new Logger();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

app.get('/', (req, res) => res.json({status: 'OK'}));

app.get('/users', async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User)
        const result = await userRepository.find();
        res.json(result);
    } catch (error) {
        logger.error(error);
        res.status(500).json({error: 'Unknown error'});
    }
});

app.listen(PORT, () => {
    console.log(`User Service is running on port ${PORT}`);
});