# Law 003: All Data Must Die

**Principle:** Data without a clear expiration date is an immortal tyrant. Every byte committed to storage must be accompanied by its own death warrant, a Time-To-Live (TTL), lest it become a digital lich, haunting your systems for eternity.

**Justification:** A database filled with immortal data is not a treasure trove; it's a digital landfill. Every query must sift through generations of fossilized records. Every migration becomes a fraught archaeological dig. These data-liches cling to your schemas, whispering tales of forgotten features and corrupting the purity of the present. They are a liability in storage costs, a drag on performance, and a gaping security hole waiting to be exhumed.

**Implementation:**
1.  **No Data Without a Date:** The act of writing data must require an explicit `expires_at` timestamp or a TTL value. To omit it is a cardinal sin.
2.  **Default to Dust:** The default TTL for any new data set should be aggressively, almost absurdly, short. Start with 24 hours. Justify anything longer with a formal petition.
3.  **The Archive is a Tomb:** Data that must persist for legal or historical reasons is the rare exception. It shall be mummified and moved to a designated "archive" tier—a cold, slow, and sacred place where it shall not trouble the living.

**Consequence:** Your systems will become lean, agile, and perpetually youthful. They will shed their past like a snake sheds its skin. Storage costs will plummet. Queries will return before the heat death of the universe. You will sleep soundly, knowing your kingdom is not ruled by the ghosts of data past.