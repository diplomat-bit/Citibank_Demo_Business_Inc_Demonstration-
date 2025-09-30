import express from 'express';
import cors from 'cors';
import { initDb } from './db';
import personalRoutes from './api/personal';
import corporateRoutes from './api/corporate';
import aiRoutes from './api/ai';
import otherRoutes from './api/other';


// Load environment variables
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const port = 3001; // Using a different port from a potential dev frontend

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database
initDb().then(db => {
    console.log('Database initialized.');
    
    // All routes are now public within this application's context
    app.get('/api', (req, res) => {
        res.send('Welcome to the Demo Bank API!');
    });

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
