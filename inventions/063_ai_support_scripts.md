
**Title of Invention:** System and Method for Generating Personalized Customer Support Scripts

**Abstract:**
A system for assisting customer support agents is disclosed. When an agent opens a support ticket, the system provides the customer's history and the ticket's subject to a generative AI model. The AI is prompted to generate a personalized opening script for the agent, which can include empathetic statements referencing the customer's specific issue and history.

**Detailed Description:**
In the Support Desk module, an agent opens a ticket. The system prompts an LLM: `You are a support expert. A customer's issue is "[subject]". They are a VIP customer. Draft a friendly, empathetic opening for the support agent.` The AI's response is displayed in the agent's text editor as a starting point.

**Claims:**
1. A method for assisting a support agent, comprising:
   a. Receiving data associated with a customer support ticket.
   b. Providing the data to a generative AI model.
   c. Prompting the model to generate a personalized communication script.
   d. Displaying the script to the agent.
