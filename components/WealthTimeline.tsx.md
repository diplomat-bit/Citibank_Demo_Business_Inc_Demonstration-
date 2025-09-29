# The Journey Map
*A Guide to the Wealth Timeline Widget*

---

## The Concept

The `WealthTimeline.tsx` component is a "journey map." It's a special chart designed to give the user foresight, providing a view not just of their financial past, but also a glimpse into their potential future.

---

### A Simple Metaphor: A Topographical Map

Think of this widget as a topographical map of your financial journey.

-   **The Path You've Walked (`Area` chart)**: The solid, colored area of the chart represents the past. It's the terrain you've already covered, showing the highs and lows of your journey so far. It's a firm, solid foundation.

-   **The Projected Path (`Line` chart)**: The dashed line represents a possible future path. It's not a prediction of fate, but a projection based on your recent momentum. It's the trail marker showing where you're likely to go if you continue on your current heading.

-   **The Legend**: The legend clearly explains the two parts of the map: "History" (the solid ground you've covered) and "Projection" (the potential path ahead).

---

### How It Works

1.  **Charting the Past**: The component first calculates the user's historical balance. It sorts all `transactions` by date, starts with an assumed balance, and then walks through the history, adding income and subtracting expenses to create a running total over time. This becomes the data for the solid `Area` chart.

2.  **Calculating Momentum**: To create the projection, it needs to understand the user's recent momentum. It calculates the average net flow (income minus expenses) over the last three months. This average becomes the "financial velocity."

3.  **Projecting the Future**: It takes the very last known balance and then projects it forward for the next six months by adding the calculated "financial velocity" for each month. This creates the data for the dashed `Line` chart.

4.  **Combining the Views**: The component uses a `ComposedChart` from the `recharts` library. This special chart type allows us to layer two different kinds of charts—an Area and a Line—on top of each other, seamlessly blending the past and the future into a single, unified view.

---

### The Philosophy: From History to Horizon

The purpose of this component is to connect the past to the future. By seeing their historical journey and a data-driven projection of their path forward on the same map, users can gain a powerful sense of perspective. It helps them understand how their recent actions are shaping their destiny and empowers them to make conscious choices today to create a better tomorrow. It's a tool for looking back at the horizon you've crossed to better navigate the one ahead.