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
                { id: 'inv_3', invoiceNumber: 'INV-2024-06-003', counterpartyName: 'Client Delta', dueDate: '2024-06-25', amount: 2500, status: 'paid' },
            ];
            return ledger;
        }
    }

    class TheHarborMasterAI {
        private readonly ledger: LedgerOfPromises;

        constructor(ledger: LedgerOfPromises) {
            this.ledger = ledger;
        }

        public forecastCashFlowImpact(): string {
            const incomingTide = this.ledger.filter(p => p.status === 'unpaid').reduce((sum, p) => sum + p.amount, 0);
            const lateTide = this.ledger.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);
            
            if (lateTide > incomingTide) {
                return `Harbor Forecast: Warning. The value of late tides ($${lateTide.toFixed(2)}) now exceeds the expected incoming tide ($${incomingTide.toFixed(2)}). The harbor's water level is projected to fall. Recommend dispatching vessels to collect on the most overdue promises.`;
            }
            return `Harbor Forecast: The tides are favorable. An incoming flow of $${incomingTide.toFixed(2)} is expected on schedule. All operations can proceed as planned.`;
        }
    }

    function manageThePort(): void {
        const ledger = TheTidalCharter.chartTheTides();
        const theAI = new TheHarborMasterAI(ledger);
        const forecast = theAI.forecastCashFlowImpact();
    }
}
```