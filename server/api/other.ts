import { Router } from 'express';
import { Database } from 'sqlite3';
import { MOCK_MARKET_MOVERS, MOCK_API_STATUS, MOCK_PROJECTS, MOCK_COURSES, MOCK_EMPLOYEES } from '../../data';
import * as MegaDashboardData from '../../data/megadashboard';

export default (db: Database) => {
    const router = Router();
    
    // Combined endpoint for misc data
    router.get('/other/all', (req, res) => {
        res.json({
            marketMovers: MOCK_MARKET_MOVERS,
            apiStatus: MOCK_API_STATUS,
        });
    });

    router.get('/megadashboard/all', (req, res) => {
        res.json(MOCK_MEGA_DASHBOARD_DATA);
    });

    router.get('/platform/all', (req, res) => {
        res.json({
            projects: MOCK_PROJECTS,
            courses: MOCK_COURSES,
            employees: MOCK_EMPLOYEES
        });
    });
    
    return router;
};

const MOCK_MEGA_DASHBOARD_DATA = {
    ...MegaDashboardData
};