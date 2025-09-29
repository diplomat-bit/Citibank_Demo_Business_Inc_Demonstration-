# The Greenhouse
*A Guide to the Investments View*

---

## The Concept

The `InvestmentsView.tsx` component, nicknamed "CapitalVista," is a full-featured "greenhouse" for nurturing and growing wealth. It combines portfolio visualization, performance analysis, a growth simulator, and a focus on ethical investing into a single, comprehensive view.

---

### A Simple Metaphor: Tending Your Garden

Think of this view as the main workshop for your financial garden, where you can see how your plants are doing, plan for future growth, and choose which seeds to plant next.

-   **The Garden Overview (`InvestmentPortfolio`)**: This is the main view of your garden, showing the overall health and composition of your plants (assets).

-   **The Growth Simulator (`AI Growth Simulator`)**: This is your "time machine" or planning tool. By adjusting the "Monthly Contribution" slider (the amount of water and sunlight), you can see a projection of how your garden might grow over the next 10 years. It helps you visualize the power of consistent care.

-   **The Seed Catalog (`Social Impact Investing`)**: This is a special catalog of "seeds" (companies) that are known to be good for the world. The `ESGScore` is like a rating on the seed packet, showing how much positive impact that plant can have. It allows you to grow a garden that is not only prosperous but also beautiful and beneficial to the ecosystem.

-   **The Planting Tool (`InvestmentModal`)**: When you decide to plant a new seed from the catalog, this modal appears. It's the simple tool that lets you confirm how much you want to invest (plant) in that new opportunity.

---

### How It Works

1.  **Displaying the Garden**: The view starts by showing the main `InvestmentPortfolio` component, which provides the high-level summary.

2.  **Simulating the Future**: The `projectionData` is calculated using a `useMemo` hook. This is a performance optimization that ensures the 10-year growth projection is only recalculated when the inputs (the `totalValue` of the portfolio or the `monthlyContribution` slider) actually change.

3.  **Performance Analysis**: It uses a `BarChart` to show the year-to-date performance of each individual asset, making it easy to see which plants in the garden are growing the fastest.

4.  **Ethical Choices**: It displays the list of `impactInvestments` from the `DataContext`. Each one has an `ESGScore` component that visually represents its ethical rating. Clicking "Invest Now" on one of these opens the `InvestmentModal`.

5.  **Making the Investment**: When a user confirms an investment in the modal, the `handleInvest` function is called. It doesn't actually move money, but it does add a new `transaction` to the user's history with the category "Investments." This makes the action feel real and ensures it's reflected in the user's overall financial picture.

---

### The Philosophy: Intentional Growth

This view is designed to change the user's relationship with investing from one of passive speculation to one of active, intentional gardening. It provides tools not just to track wealth, but to consciously cultivate it in a way that aligns with their financial goals and personal values.