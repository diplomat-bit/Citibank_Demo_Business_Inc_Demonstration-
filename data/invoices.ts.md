```typescript
namespace TheTidesOfObligation {
    type PromiseOfPayment = {
        readonly id: string;
        readonly invoiceNumber: string;
        readonly counterpartyName: string;
        readonly dueDate: string;
        readonly amount: number;
        readonly status: 'unpaid' | 'paid' | 'overdue';
    };

    type LedgerOfPromises = ReadonlyArray<PromiseOfPayment>;

    class TheTidalCharter {
        public static chartTheTides(): LedgerOfPromises {
            const ledger: LedgerOfPromises = [
                { id: 'inv_1', invoiceNumber: 'INV-2024-07-001', counterpartyName: 'Client Bravo', dueDate: '2024-07-15', amount: 7500, status: 'overdue' },
                { id: 'inv_2', invoiceNumber: 'INV-2024-08-002', counterpartyName: 'Client Charlie', dueDate: '2024-08-10', amount: 12000, status: 'unpaid' },
                { id: 'inv_3', invoiceNumber: 'INV-2024-06-003', counterpartyName: