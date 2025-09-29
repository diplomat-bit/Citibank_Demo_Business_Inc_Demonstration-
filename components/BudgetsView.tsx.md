# The Spending Plan
*A Guide to the Budgets View*

---

## The Concept

The `BudgetsView.tsx`, nicknamed "Allocatra," is a friendly and visual workspace for managing financial intentions. It features interactive budget rings, detailed transaction views, and an integrated "AI Sage" for conversational, streaming budget analysis.

---

### A Simple Metaphor: An Architect's Workshop

Think of this view as an architect's workshop for your finances. A budget is not a cage; it's a blueprint you design for how you want to build your life.

-   **The Blueprints (`Budget Rings`)**: Each circular chart represents a blueprint for a part of your life (e.g., "Dining," "Shopping"). The ring filling up shows how much of that blueprint you've completed for the month. The color change (from cool cyan to warning amber to alert red) is a gentle indicator of your progress.

-   **The AI Sage (`AIConsejero`)**: This is your friendly and wise architectural partner. It reviews your blueprints and your progress and offers gentle, helpful advice. It doesn't scold; it provides insights to help you build better.

-   **The Materials List (`BudgetDetailModal`)**: Clicking on a blueprint opens a detailed view showing all the "materials" (transactions) that have gone into that part of the project. It provides complete transparency.

-   **The Drafting Table (`NewBudgetModal`)**: This is where you can draft a new blueprint, creating a new plan for a new area of your life.

---

### How It Works

1.  **Visualizing the Blueprints**: For each `budget`, the component calculates the percentage of the limit that has been spent. It uses a `RadialBarChart` to create the beautiful "ring" visualization, which is a very intuitive way to see progress towards a limit.

2.  **The AI Sage's Wisdom**: The `AIConsejero` component is a powerful feature. When it loads, it:
    -   Creates a simple text summary of all your budgets.
    -   Sends this summary to the Gemini API with a prompt asking for "one key insight or piece of advice."
    -   Crucially, it uses the `sendMessageStream` method. This means the AI's response types out word-by-word, which feels much more conversational and alive than waiting for a whole paragraph to appear at once.

3.  **Managing the Plans**: The view makes it easy to manage your plans. You can see all your blueprints at a glance, click to see the details, and use the "New Budget" button to open a modal and add a new one to your workshop.

---

### The Philosophy: Intentional, Not Restrictive

This view is designed to completely reframe the concept of budgeting. It's not about restriction; it's about *intention*. It's a creative space where the user, with the help of a friendly AI partner, can design a financial life that truly reflects their values and priorities. The goal is to make budgeting feel empowering, insightful, and even joyful.