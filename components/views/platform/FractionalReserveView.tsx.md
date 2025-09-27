```typescript
namespace TheAssemblyLayerPrinciple {
    type MonetaryUnit = number;
    
    interface IConstitutionalArticle {
        readonly number: "XXIX";
        readonly title: "The Doctrine of Fractional Reserve Creation";
    }

    class TheRoyalMint {
        private readonly reserveRatio: number = 0.10;
        private readonly interestRate: number = 0.29;

        public calculateCreditExpansion(initialDeposit: MonetaryUnit): MonetaryUnit {
            const loanMultiplier = 1 / this.reserveRatio;
            return initialDeposit * loanMultiplier;
        }
        
        public calculateInterestObligation(loanPrincipal: MonetaryUnit): MonetaryUnit {
            return loanPrincipal * this.interestRate;
        }
    }

    class TheConstitutionalScholarAI {
        private readonly mint: TheRoyalMint;

        constructor() {
            this.mint = new TheRoyalMint();
        }
        
        public expoundUponTheDoctrine(): string {
            const expansion = this.mint.calculateCreditExpansion(100);
            const interest = this.mint.calculateInterestObligation(100);

            const exposition = `
            Article XXIX is the cornerstone of value creation within this simulated economy. It establishes two fundamental truths:
            1. The Principle of Credit Expansion: A deposit is not merely stored; it is leveraged. An initial deposit of 100 units, under the 10% reserve ratio, enables the creation of ${expansion} units of new credit throughout the system.
            2. The Doctrine of Interest on Principal: This newly created credit is not without cost. A loan of 100 units creates a repayment obligation of ${100 + interest} units, ensuring the system's own sustenance and growth.
            Together, these form the Assembly Layer, the process by which raw deposits are assembled into the complex financial instruments of the modern economy.
            `;
            return exposition;
        }
    }

    function studyTheLawOfMoney(): void {
        const theAI = new TheConstitutionalScholarAI();
        const exposition = theAI.expoundUponTheDoctrine();
    }
}
```