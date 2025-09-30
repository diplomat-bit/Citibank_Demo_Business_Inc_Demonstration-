import express from 'express';
import cors from 'cors';
import { initDb } from './db';
import personalRoutes from './api/personal';
import corporateRoutes from './api/corporate';
import aiRoutes from './api/ai';
import otherRoutes from './api/other';
import authRoutes from './api/auth';


// Load environment variables
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const port = 3001; // Using a different port from a potential dev frontend

// Middleware
app.use(cors());
app.use(express.json());

// API Key Middleware - This secures all subsequent /api routes
const apiKeyMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    // In a real app, you'd have a DB of keys. Here we have one static key for the demo.
    const validApiKey = process.env.DEMO_API_KEY_STATIC || 'db_sk_live_XXXXXXXXXXXXXXXXXXXX';

    if (token == null || token !== validApiKey) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing API Key. Please generate one in the app.' });
    }
    
    next();
};

// Initialize Database
initDb().then(db => {
    console.log('Database initialized.');
    
    // === PUBLIC ROUTES === (Do not require API Key)
    app.use('/api/auth', authRoutes());
    app.get('/api', (req, res) => {
        res.send('Welcome to the Demo Bank API! Most endpoints are protected by an API key.');
    });


    // === PROTECTED ROUTES === (All routes below this line require an API key)
    app.use('/api', apiKeyMiddleware);

    // Pass db instance to routes
    app.use('/api', personalRoutes(db));
    app.use('/api', corporateRoutes(db));
    app.use('/api/ai', aiRoutes(db));
    app.use('/api', otherRoutes(db));


    // Start server
    app.listen(port, () => {
        console.log(`Demo Bank server listening at http://localhost:${port}`);
    });

}).catch(err => {
    console.error('Failed to initialize database:', err);
    (process as any).exit(1);
});