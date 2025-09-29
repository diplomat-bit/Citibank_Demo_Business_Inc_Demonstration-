# Our Shared Impact
*A Guide to the Green Impact Widget*

---

## The Concept

The `ImpactTracker.tsx` component is a simple, beautiful monument to the positive echo of our collective actions. It's a testament to the idea that small, everyday financial choices can add up to create a real, tangible good in the world.

---

### A Simple Metaphor: A Community Garden

Think of this widget as a small community garden that we all tend to together.

-   **The Garden (`TreeIcon`)**: The central tree symbol represents the living, growing result of our collective effort.

-   **The Harvest (`treesPlanted`)**: This number shows the total harvest from our garden so far—the total number of trees we've planted together.

-   **The Next Seedling (`progress`)**: The progress bar shows how close we are to planting the next tree. It visualizes our shared effort in real-time, making the act of contribution feel immediate and tangible.

---

### How It Works

1.  **Receiving the Data**: The `DataContext` is responsible for the core logic. It keeps track of a special counter (`spendingForNextTree`). Every time a user adds an expense transaction, a portion of that amount is added to this counter.

2.  **Planting a Tree**: When the counter reaches the `COST_PER_TREE` threshold, the `DataContext` increases the `treesPlanted` count by one and resets the counter, carrying over any remainder.

3.  **Visualizing Progress**: The `ImpactTracker` component simply receives the current `treesPlanted` count and the `progress` (which is `(spendingForNextTree / COST_PER_TREE) * 100`) from the `DataContext`.

4.  **A Simple Display**: The component then displays this information in a clean, elegant, and celebratory way. The progress bar filling up provides a satisfying sense of accomplishment and encourages continued participation.

---

### The Philosophy: A Positive Echo

This component is a core part of our mission. We believe that finance can be a force for good. The Impact Tracker is a simple, beautiful way to make that belief tangible. It connects everyday actions to a positive, shared outcome, transforming the mundane act of spending into a collaborative act of creation and healing. It's a constant, gentle reminder that our choices have an echo in the world, and that we can choose to make that echo a beautiful one.