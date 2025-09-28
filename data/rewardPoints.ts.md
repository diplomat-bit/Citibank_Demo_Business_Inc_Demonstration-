```typescript
namespace TheSecondCurrency {
    type TreasuryOfMerit = {
        readonly balance: number;
        readonly lastEarned: number;
        readonly lastRedeemed: number;
        readonly currency: "Points";
    };

    class TheMintOfVirtue {
        public static establishTheInitialTreasury(): TreasuryOfMerit {
            const treasury: TreasuryOfMerit = {
                balance: 85250,
                lastEarned: 320,
                lastRedeemed: 5000,
                currency: 'Points',
            };
            return treasury;
        }
    }

    class TheAlchemistAI {
        private readonly treasury: TreasuryOfMerit;

        constructor(treasury: TreasuryOfMerit) {
            this.treasury = treasury;
        }
        
        public proofOfDisciplineProtocol(virtuousAct: { type: string, value: number }): TreasuryOfMerit {
            let pointsMinted = 0;
            if (virtuousAct.type === 'SAVING_GOAL_CONTRIBUTION') {
                pointsMinted = Math.floor(virtuousAct.value * 0.5);
            }
            if (virtuousAct.type === 'BUDGET_ADHERENCE') {
                pointsMinted = 500;
            }

            const newBalance = this.treasury.balance + pointsMinted;
            const updatedTreasury: TreasuryOfMerit = { ...this.treasury, balance: newBalance, lastEarned: pointsMinted };
            return updatedTreasury;
        }
    }
    
    function transmuteWillpowerIntoWealth(): void {
        const treasury = TheMintOfVirtue.establishTheInitialTreasury();
        const theAI = new TheAlchemistAI(treasury);
        const actOfVirtue = { type: 'SAVING_GOAL_CONTRIBUTION', value: 100 };
        const newTreasuryState = theAI.proofOfDisciplineProtocol(actOfVirtue);
    }
}
```
