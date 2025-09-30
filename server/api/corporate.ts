import { Router } from 'express';
import { Database } from 'sqlite3';
import { MOCK_CORPORATE_CARDS, MOCK_CORPORATE_TRANSACTIONS, MOCK_PAYMENT_ORDERS, MOCK_INVOICES, MOCK_COMPLIANCE_CASES, MOCK_ANOMALIES, MOCK_COUNTERPARTIES, MOCK_PAY_RUNS } from '../../data';

export default (db: Database) => {
    const router = Router();

    // These will be served as mocks for now, as their DB schemas are more complex
    router.get('/corporate/dashboard', (req, res) => {
        res.json({
            corporateCards: MOCK_CORPORATE_CARDS,
            corporateTransactions: MOCK_CORPORATE_TRANSACTIONS,
            paymentOrders: MOCK_PAYMENT_ORDERS,
            invoices: MOCK_INVOICES,
            complianceCases: MOCK_COMPLIANCE_CASES,
            financialAnomalies: MOCK_ANOMALIES,
            counterparties: MOCK_COUNTERPARTIES,
        });
    });

    router.get('/corporate/payroll', (req, res) => {
        res.json({
            payRuns: MOCK_PAY_RUNS,
        });
    });

    return router;
};