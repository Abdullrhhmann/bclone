import express, {Request, Response} from 'express';
import "./database/index"
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import morgan from 'morgan';
import cardRoutes from "./routes/cardRoutes";
dotenv.config();
const app = express();
const host = "0.0.0.0";
app.use(express.json());

// CORS Configuration - Restrict to specific origins in production
const corsOptions = {
  origin: process.env.CORS_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// const port = parseInt(process.env.PORT || '80', 10);
const port = parseInt(process.env.PORT || '5000', 10);
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Hello World',
    });
});
app.use(morgan('tiny'));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/cards', cardRoutes);

app.listen(port,host, () => {
    console.log(`Server is running at PORT http://${host}:${port}`);
});
