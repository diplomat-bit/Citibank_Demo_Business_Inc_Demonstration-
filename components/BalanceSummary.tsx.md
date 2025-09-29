# The Main Snapshot
*A Guide to the Balance Summary Widget*

---

## The Concept

The `BalanceSummary.tsx` component is the most important single piece of information on the user's dashboard. It's the "main snapshot" or the "financial headline," designed to answer two simple questions immediately: "Where am I now?" and "Which way am I heading?"

---

### A Simple Metaphor: The Compass

Think of this widget as the compass on the dashboard of a ship.

-   **The Large Number (`absoluteBalance`)**: This is the compass needle pointing to your current heading—your exact financial position right now. It's big, clear, and unambiguous.

-   **The Change (`recentMomentum`)**: This tells you if you're moving forward or backward. It's your speed and direction, showing your momentum over the last 30 days.

-   **The Chart (`historicalTrajectory`)**: This is the wake behind your ship. It shows the path you've taken over the last few months, giving context to your current position and momentum.

---

### How It Works

1.  **The Alchemist's Work**: The component doesn't just display a number; it calculates it. It takes the entire list of `transactions` (the ledger) and "distills" it into a single, cohesive story.

2.  **Calculating the Present**: It starts with an assumed balance and then walks through every single transaction in chronological order, adding the income and subtracting the expenses, to arrive at the final, current balance. This is the **absoluteBalance**.

3.  **Distilling Momentum**: It then looks back 30 days into this calculated history to find out what the balance was then. By comparing that past value to the present, it calculates the **recentMomentum**.

4.  **Mapping the Journey**: Finally, it takes the full history of the running balance and groups it by month to create the simple, clear data points needed to draw the **historicalTrajectory** chart.

---

### The Philosophy: A Grounding in Reality

The purpose of this component is to provide a single, truthful, and grounding piece of information. Before you can plan your future journey, you must know your exact location. The Balance Summary provides this anchor in the present moment. The AI Partner also uses this "snapshot of now" as the foundation for all its reasoning and advice, ensuring its counsel is always relevant to the user's current reality.