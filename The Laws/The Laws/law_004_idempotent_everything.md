# Law 004: Idempotent Everything

**Principle:** An action, once performed, shall yield the same result no matter how many times it is repeated. The universe does not have a stutter.

**Justification:** In a world of unreliable networks, impatient users, and cosmic rays, an action might be sent once, twice, or a thousand times. If each attempt alters reality, we descend into chaos. A single click to "buy now" should not result in a lifetime supply of rubber chickens. Idempotency is the bulwark against accidental parallel universes spawned from a double-click.

**Implementation:**
1.  **Unique Identifiers:** Assign a unique, client-generated identifier to every command or transaction that changes state.
2.  **Processed Request Store:** Before executing a command, the system must check a log of processed identifiers. If the identifier is found, the system simply returns the original, cached success response without re-processing the request.
3.  **State-based Verbs:** Design operations to be about achieving a final state, not about the journey. `SetUserEmail('new@email.com')` is idempotent. `AddTenDollarsToAccount()` is not. The former can be repeated endlessly; the latter bankrupts the sender.

**Consequence:** The system gains profound resilience and predictability. Network retries become harmless, UI bugs less catastrophic, and distributed transactions less terrifying. We build a system that is forgiving of the chaotic nature of reality, ensuring that a single, clear intention results in a single, clear outcome, no matter how frantically the button is mashed.