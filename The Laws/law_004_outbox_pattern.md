# Law 004: The Outbox Pattern (The Reliable Messenger)

**Principle:** The act of changing a system's state and the act of announcing that change to the world must be a single, atomic, unbreakable act.

**Justification:** A "dual write"—writing to the database and then publishing an event—is a race condition. The database write can succeed while the event publish fails, leaving the world in an inconsistent state.

**Implementation:**
1.  In a single database transaction, a service will:
    a. `UPDATE` its own state.
    b. `INSERT` a