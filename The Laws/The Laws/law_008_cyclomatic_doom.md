# Law 008: The Inevitability of Cyclomatic Doom

**Principle:** A function's cyclomatic complexity and a developer's remaining sanity are inversely proportional, governed by an immutable cosmic constant known as the "WTF/line" coefficient.

**Justification:** The human brain is a magnificent but finite pattern-matching engine. It can hold approximately 7 (plus or minus 2) distinct concepts at once. Every `if`, `for`, `while`, `case`, `&&`, or `||` in a function creates a new path, a new reality that must be held in the mind. A function with a single path is a clear thought. A function with ten paths is a tangled knot. A function with fifty paths is a portal to a dimension of pure chaos, from which no bug report ever truly escapes.

**Implementation:**
1.  **Declare a Sanity Threshold:** Choose a cyclomatic complexity number (e.g., 10) beyond which no function may pass without a formal inquiry and a sacrifice to the gods of refactoring. This is not a guideline; it is a firewall for your mind.
2.  **The Extraction Imperative:** When a function approaches the threshold, it is not a sign of its power, but a cry for help. Mercilessly extract logical blocks into smaller, single-purpose functions. The original function's only duty becomes to orchestrate these simpler, saner children.
3.  **Slay the Switch Statement:** A multi-case `switch` statement is a cyclomatic hydra. For every head you sever, two more appear. Replace it with polymorphism or a dictionary of strategies. Do not reason with the beast; replace it.

**Consequence:** By respecting the cognitive limits of our mortal minds, we build systems that can be understood, maintained, and safely modified. We trade the fleeting glory of a "clever" 500-line function for the enduring peace of a codebase that does not actively conspire against its creators. The goal is not just working software, but a development team that remains sane enough to build the next one.