# Law 001: Command Query Responsibility Segregation

**Principle:** The act of changing the world (a Command) is fundamentally different from the act of observing it (a Query). Therefore, the models and data paths used for these two acts must be separate.

**Justification:** A model optimized for writing is normalized and consistent. A model optimized for reading is denormalized and fast. A single model that tries to do both will do neither well. It becomes a place of compromise and complexity.

**Implementation:**
1.  **Commands:** Simple, verb-based objects (e.g., `ChangeUserName`) that are validated and processed by a dedicated write-model. Their only job is to change the state and publish an event.
2.  **Queries:** Read from pre-computed "read models" that are specifically shaped for the needs of a particular view. These models are updated asynchronously by listening to the events published by the command side.

**Consequence:** This separation allows us to scale the read and write sides of our system independently. It creates a system that is both highly consistent and highly available, by acknowledging that asking a question and issuing a command are different acts that require different tools.