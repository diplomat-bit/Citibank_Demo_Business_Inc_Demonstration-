# The Investment Snapshot
*A Guide to the Portfolio Widget*

---

## The Concept

The `InvestmentPortfolio.tsx` component provides a clear, high-level snapshot of the user's investment world. It's designed to answer two key questions quickly: "What do I own?" and "How is it doing?"

---

### A Simple Metaphor: A Garden Overview

Think of this widget as a quick glance at your financial garden.

-   **The Pie Chart (`composition`)**: This shows you the layout of your garden—how much space is dedicated to each type of plant (Stocks, Bonds, Crypto, etc.). It gives you an immediate sense of the balance and diversity of your holdings.

-   **The Total Value (`totalValue`)**: This is the total harvest value of your entire garden at this moment.

-   **The Performance (`weightedVelocity`)**: This tells you how fast your garden is growing overall. It's not just the growth of one plant, but the combined, weighted average growth of everything together.

---

### How It Works

1.  **Gathering the Assets**: The component receives the list of all the user's `assets` from the `DataContext`.

2.  **Calculating the Whole**: It then performs a few key calculations:
    -   It sums the `value` of all assets to get the **totalValue**.
    -   It calculates the **weightedPerformance** by taking each asset's value, multiplying it by its year-to-date performance, summing those up, and then dividing by the total value. This gives a true picture of the portfolio's overall performance.

3.  **Visualizing the Parts**: It uses the `PieChart` component from the `recharts` library to visualize the composition. Each asset is a "slice" of the pie, sized according to its value relative to the whole. The colors help to distinguish each part clearly.

---

### The Philosophy: Clarity Breeds Confidence

The world of investing can often feel complex and intimidating. The purpose of this widget is to cut through that complexity. By presenting a simple, visual overview of the user's holdings and their performance, it aims to replace anxiety with clarity. A user who understands their portfolio at a glance is a user who can make confident, informed decisions about its future.