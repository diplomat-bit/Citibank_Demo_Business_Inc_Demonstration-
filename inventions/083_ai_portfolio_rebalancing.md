
**Title of Invention:** System and Method for AI-Driven Investment Portfolio Rebalancing

**Abstract:**
A system for managing investment portfolios is disclosed. The system receives a user's target asset allocation. It monitors the portfolio's current allocation, which drifts due to market movements. When the drift exceeds a threshold, a generative AI model is prompted to create a specific set of trades (buy and sell orders) required to bring the portfolio back to its target allocation, potentially optimizing for tax efficiency.

**Detailed Description:**
A user has a target of 60% stocks, 40% bonds. The system detects the current allocation is 65/35. It prompts an LLM: `A portfolio's target is 60/40. The current state is [state]. Generate the minimum set of trades to rebalance, considering that selling Stock XYZ will incur capital gains.` The AI returns a list of trades, which are then presented to the user for execution.

**Claims:**
1. A method for rebalancing an investment portfolio, comprising:
   a. Comparing a portfolio's current asset allocation to a target allocation.
   b. If a deviation exceeds a threshold, providing the current and target allocations to a generative AI.
   c. Prompting the AI to generate a set of trades to correct the deviation.
   d. Presenting the trades to a user.
