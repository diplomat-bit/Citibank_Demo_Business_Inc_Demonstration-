# Law 003: The Saga Pattern (Choreography)

**Principle:** In a world of independent services, we cannot enforce a single transaction across them all. We cannot lock the whole world to perform one action. Instead, we must choreograph a dance.

**Justification:** Two-phase commits create brittle, tightly-coupled systems. A single service failure can halt a global transaction. A saga allows for resilience and autonomy.

**Implementation:**
1.  A business transaction that spans multiple services is a "Saga."
2.  Each step of the saga is a local transaction within a single service.
3.  When a service completes its step, it publishes an event.
4.  The next service in the choreography listens for this event and performs its own local transaction.
5.  For every step, there is a corresponding "compensating action." If a step fails, the saga executes the compensating actions for all previous steps, effectively dancing backward to a consistent state.

**Consequence:** This creates a resilient, eventually consistent system. It allows services to remain autonomous while still participating in complex, system-wide workflows.