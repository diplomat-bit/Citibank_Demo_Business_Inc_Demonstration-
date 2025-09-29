
```typescript
namespace TheDocketOfTheDigitalMagistrate {
    type CaseFile = {
        readonly id: string;
        readonly reason: string;
        readonly entityType: 'PaymentOrder' | 'Counterparty';
        readonly entityId: string;
        status: 'open' | 'closed';
        readonly openedDate: string;
    };

    type Docket = ReadonlyArray<CaseFile>;
    
    class TheClerkOfTheCourt {
        public static prepareTheDocket(): Docket {
            const docket: Docket = [
              { id: 'case_1', reason: 'Transaction over $10,000', entityType: 'PaymentOrder', entityId: 'po_003', status: 'open', openedDate: '2024-07-21' },
              { id: 'case_2', reason: 'New Counterparty Requires Verification', entityType: 'Counterparty', entityId: 'cp_004', status: 'open', openedDate: '2024-07-23' },
            ];
            return docket;
        }
    }

    class TheMagistrateAI {
        private readonly bookOfLaws: any[];

        constructor() {
            this.bookOfLaws = [
                { id: 'LAW-001', condition: (tx: any) => tx.amount > 10000, reason: 'Transaction over $10,000' },
                { id: 'LAW-002', condition: (cp: any) => cp.status === 'Pending', reason: 'New Counterparty Requires Verification' }
            ];
        }

        public applyAutomatedJurisprudence(entity: any, entityType: 'PaymentOrder' | 'Counterparty'): CaseFile | null {
            const applicableLaw = this.bookOfLaws.find(law => law.condition(entity));
            if (applicableLaw) {
                const newCase: CaseFile = {
                    id: `case_${Date.now()}`,
                    reason: applicableLaw.reason,
                    entityType: entityType,
                    entityId: entity.id,
                    status: 'open',
                    openedDate: new Date().toISOString().split('T')[0]
                };
                return newCase;
            }
            return null;
        }
    }

    function upholdTheLaw(): void {
        const docket = TheClerkOfTheCourt.prepareTheDocket();
        const theAI = new TheMagistrateAI();
        const newPaymentOrder = { id: 'po_004', amount: 15000 };
        const newCase = theAI.applyAutomatedJurisprudence(newPaymentOrder, 'PaymentOrder');
    }
}
```
