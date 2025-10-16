# Law 005: The Prophetic Interface

**Principle:** An Interface is a prophecy of a future implementation. It must be declared before the concrete class that fulfills it is ever written, for one cannot build what has not yet been dreamed.

**Justification:** To write the implementation first is to let the grubby details of the present corrupt the grand vision of the future. The Interface is a pact, a sacred contract with the calling code. This pact cannot be tainted by the messy, imperfect reality of its eventual fulfillment. The needs of the caller dictate the contract, not the convenience of the implementer.

**Implementation:**
1.  **Scrying:** Gaze into the void where your calling code will live. Do not think of databases, APIs, or file systems. Think only of what the caller needs. What questions must it ask? What commands must it issue?
2.  **Inscription:** Inscribe these needs as method signatures onto the clean slate of a new Interface. Name it not for what it *is* (`MySQLUserFinder`), but for what it *promises to be* (`UserProvider`). The prophecy must be pure.
3.  **The Waiting:** The Interface now exists as an unfulfilled promise, a perfect potential. Only after this contract is established and revered may a humble programmer attempt to write a class that dares to make the prophecy come true.

**Consequence:** The system becomes one of clean contracts and noble intentions. Components are decoupled, speaking to each other through the elegant language of the prophecy, not the vulgar dialect of implementation specifics. The code is resilient to change, for the future can be rewritten by providing a new fulfillment to the same ancient promise.