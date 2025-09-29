
**Title of Invention:** A System and Method for Detecting Undisclosed Recurring Subscriptions from Transaction Data

**Abstract:**
A system for analyzing a user's financial transactions to identify potential recurring subscriptions is disclosed. The system processes a list of transactions and identifies patterns of repeated payments to the same or similar merchants. It analyzes the periodicity and amount consistency of these payments to distinguish true subscriptions from regular but non-recurring purchases. The system then presents a list of these detected subscriptions to the user, helping them identify and manage potentially forgotten recurring expenses. The analysis can be performed by a generative AI model prompted to find such patterns.

**Background of the Invention:**
Consumers often sign up for subscriptions and forget about them, leading to unnecessary expenses. Manually reviewing months of transaction data to find these recurring payments is tedious and error-prone. Existing tools may only track subscriptions that the user manually enters. There is a need for an automated system that can intelligently scan a user's transaction history to discover these "forgotten" subscriptions.

**Brief Summary of the Invention:**
The present invention provides a method to automatically detect subscriptions. A summary of a user's recent transaction history (e.g., merchant name, amount, date) is compiled. This summary is sent as context in a prompt to a large language model (LLM). The prompt instructs the LLM to act as a financial analyst and identify transactions that are likely to be recurring subscriptions, looking for payments to the same merchant with similar amounts at regular intervals (e.g., monthly, yearly). The LLM is instructed to return a structured list of these potential subscriptions, which is then presented to the user.

**Detailed Description of the Invention:**
When a user accesses the feature, a backend service fetches their transaction history for a specified period (e.g., the last 12 months). The service processes this data into a concise text format, for example: `2024-07-21 - Netflix - $15.99; 2024-07-18 - Spotify - $10.99; ...`.

This text summary is then embedded into a larger prompt for a generative AI model like Gemini. The prompt might be: "Analyze the following transaction data to find potential recurring subscriptions. Look for repeated payments to the same merchant at regular intervals. Return your findings as a JSON object containing a list of subscriptions with their name, estimated amount, and last charged date. Data: [transaction summary]".

The request to the AI model includes a `responseSchema` to ensure the output is a well-formed JSON object, making it easy to parse. The backend service receives the JSON response from the AI. The client application then fetches this list of detected subscriptions and displays it to the user in a clear, understandable format, allowing them to review and take action on any unwanted recurring payments.

**Claims:**
1. A method for detecting recurring subscriptions, comprising:
   a. Accessing a history of a user's financial transactions.
   b. Transmitting a summary of said transaction history to a generative AI model with a prompt instructing the model to identify recurring payments.
   c. Receiving a list of potential subscriptions identified by the AI model.
   d. Displaying said list to the user.

2. The method of claim 1, wherein the prompt instructs the AI model to analyze the merchant name, payment amount, and payment interval for each transaction.

3. The method of claim 1, wherein the request to the generative AI model includes a response schema, compelling the model to return the list of potential subscriptions in a structured format such as JSON.

4. A system for detecting recurring subscriptions, comprising:
   a. A data store containing user transaction history.
   b. A service configured to communicate with a generative AI model.
   c. Logic to extract transaction history, format it into a prompt, and send it to the AI model.
   d. A user interface component to display the list of potential subscriptions returned by the AI model.
