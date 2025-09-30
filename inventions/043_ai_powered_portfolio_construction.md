**Title of Invention:** System and Method for AI-Driven Investment Portfolio Construction

**Abstract:**
A system for generating a personalized investment portfolio is disclosed. A user provides their financial goals, risk tolerance, and investment horizon. This information is sent to a generative AI model prompted to act as an investment advisor. The AI analyzes the user's profile and, using its knowledge of financial principles, generates a recommended asset allocation and a specific, diversified portfolio of securities (e.g., stocks, ETFs) designed to meet the user's objectives.

**Background of the Invention:**
Constructing a well-diversified investment portfolio that aligns with an individual's specific goals and risk tolerance requires significant financial expertise. While robo-advisors exist, they often use rigid, template-based models. There is a need for a more dynamic system that can generate truly bespoke portfolios based on a nuanced, conversational understanding of a user's needs.

**Detailed Description of the Invention:**
A user completes a short questionnaire about their investment goals. The system sends this data to an LLM with a prompt: `You are a fiduciary investment advisor. A client has a 'High Growth' risk tolerance and a 10-year investment horizon. Their goal is to maximize long-term returns. Generate a sample portfolio allocation across asset classes (Equities, Bonds, Alternatives) and suggest 5 specific ETFs that would form a good core for this portfolio.` The AI's structured response is then used to populate a "Recommended Portfolio" view for the user.

**Claims:**
1. A method for constructing an investment portfolio, comprising:
   a. Receiving a user's financial goals and risk tolerance.
   b. Transmitting this information to a generative AI model.
   c. Prompting the model to generate a recommended asset allocation and a list of specific securities.
   d. Displaying the generated portfolio to the user.

**Mathematical Justification:**
Let a user's profile be a vector `U = (risk, horizon, goals)`. Let a portfolio `P` be a set of assets with corresponding weights `{ (a_1, w_1), ..., (a_n, w_n) }`. The goal is to find an optimal portfolio `P*` that maximizes the user's utility function `Util(P, U)`. This is a classic portfolio optimization problem. The generative AI `G_AI` acts as a heuristic function that solves this, mapping a user profile directly to a near-optimal portfolio: `G_AI(U) → P' ≈ P*`.

**Proof of Utility:** The AI model is trained on a vast corpus of financial theory (e.g., Modern Portfolio Theory) and market data. Its function `G_AI` is an approximation of the complex optimization that a human advisor would perform. The system is proven useful because it automates this expert task, providing users with a high-quality, personalized portfolio that is likely to have a higher utility `Util(P', U)` than a naive or self-constructed portfolio, at a fraction of the cost of a human advisor. `Q.E.D.`