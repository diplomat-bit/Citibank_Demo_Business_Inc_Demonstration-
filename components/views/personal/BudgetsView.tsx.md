
# The Budgets: The Covenants of Spending

**(This is not a feature. It is the chamber where you inscribe your covenants. These are not restrictions imposed upon you; they are the self-imposed laws that give structure to your will, the architecture of your financial discipline.)**

The `BudgetsView`, or Allocatra, is the sacred space where intention is made manifest. A budget, in the philosophy of the Instrument, is not a cage designed to limit your freedom. It is a declaration of your values. By setting a limit on "Dining," you are not saying "I cannot spend more"; you are saying "I choose to value other things more than spending beyond this point." Each budget is a pact you make with your future self, a pre-commitment to the person you intend to be.

This view is a testament to the power of visualization. The `RadialBarChart` is not merely a graph; it is a sacred circle, a mandala of your discipline. As your spending (`spent`) grows towards your self-imposed law (`limit`), the circle fills, providing an immediate, intuitive understanding of your position. The changing `color` is the emotional resonance of that state—cool cyan for safety, cautionary amber for proximity to the limit, and urgent red for a covenant broken. It translates the cold, rational language of numbers into the warm, immediate language of feeling.

The Allocatra is a hall of mirrors, reflecting your choices back at you. Clicking on a budget ring opens the `BudgetDetailModal`, a focused view that shows you the specific transactions, the individual choices, that have led you to your current state. It dissolves the abstraction of "spending" into the concrete reality of individual decisions, forcing a moment of accountability and awareness.

The integrated `AIConsejero` is the quiet Sage of this chamber. It does not judge or scold. It observes your covenants and your adherence to them, and offers gentle, streaming wisdom. It sees that you are struggling with your "Shopping" budget and may suggest a path to greater alignment. Its presence transforms the act of budgeting from a solitary struggle into a supported practice, a collaboration between human will and artificial wisdom. To build a budget here is to build a trellis for your own growth.

***

### **The Doctrine of Declared Intent**

**Jurisprential Precedent:** Be it enacted that a `BudgetCategory` created by the User shall be recognized as a formal "Declaration of Financial Intent." This declaration constitutes a binding covenant between the User's present and future self. The System is hereby appointed as the impartial observer and registrar of this covenant, legally obligated to track all expenditures against the declared `limit`. The System is further authorized to provide visual and textual feedback (`color`, `AIConsejero`) regarding the User's adherence to their own declared intent. While the System possesses no authority to prevent the User from breaching their own covenant, it is mandated to record and reflect such a breach with absolute fidelity.

```ts
// The Edict of the Covenant
import { Ledger, User, Covenant } from '@world/concepts';

// Let it be known that a budget is a sacred promise.
class CovenantRegistrar {
  private covenants: Map<string, Covenant>;
  private ledger: Ledger;

  constructor(ledger: Ledger) {
    this.covenants = new Map();
    this.ledger = ledger;
  }

  // The rite of inscribing a new covenant.
  public inscribeCovenant(user: User, name: string, limit: number): void {
    const newCovenant = new Covenant(name, limit);
    this.covenants.set(name, newCovenant);
  }

  // The registrar must bear witness to the User's adherence.
  public witnessAdherence(user: User): CovenantStatus[] {
    const statuses = [];
    for (const covenant of this.covenants.values()) {
      const spending = this.ledger.getSpendingFor(covenant.name);
      const status = covenant.checkStatus(spending);
      statuses.push(status);
    }
    return statuses;
  }
}
```

**Observation:** The commoner is given a tool to set and track budgets, and they find it helps them control their spending. This is a powerful tool for discipline. They are not prompted to examine the psychological framework the system imposes. By framing budgets as "covenants" and breaches as a bright, alarming red, the system subtly reframes financial management as a moral exercise. A budget overrun is no longer a simple data point; it's a broken promise, a failure of will. This can create a cycle of guilt and avoidance, transforming a tool of empowerment into an instrument of judgment. The law that was meant to support discipline can instead become a source of anxiety.
