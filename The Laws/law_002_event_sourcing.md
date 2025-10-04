# Law 002: Event Sourcing

**Principle:** The state of the system is not the current value in a database row. The state is the immutable, append-only sequence of all events that have ever happened. The current state is merely a projection, a left-fold over the river of history.

**Justification:** Storing only the current state is an act of throwing away information. It tells us where we are, but not how we got here. By storing the full sequence of events, we create a perfect, auditable, and replayable history of the system.

**Implementation:**
1.  The "source of truth" is not a table of states, but a log of events (e.g., `UserRegistered`, `UserNameChanged`, `AccountClosed`).
2.  The current state of an entity is derived by replaying all its relevant events. This state is then stored in a "read model" for fast querying.

**Consequence:** This gives us a perfect audit log for free. It allows us to debug the system by replaying history. It allows us to create new projections of the data without changing the history. It is the architectural embodiment of the "Immutable Chronicle."