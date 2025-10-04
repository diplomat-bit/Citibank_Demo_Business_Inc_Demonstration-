
**Title of Invention:** A System and Method for AI-Powered Forensic Accounting

**Abstract:**
A system for automating forensic accounting is disclosed. The system ingests a large volume of financial data, including transaction ledgers, bank statements, and expense reports. A generative AI model, trained on accounting principles and known fraud patterns, analyzes the data to identify anomalies indicative of fraudulent activity. The AI identifies suspicious patterns such as Benford's Law deviations, round-number transactions, or unusual payment timings, and generates a detailed report of high-risk transactions for a human auditor to investigate.

**Detailed Description:**
An auditor uploads a company's general ledger. The system sends the data to an LLM with the prompt: `You are an expert forensic accountant. Analyze this transaction data for patterns of potential fraud. Highlight any transactions that violate Benford's Law or involve unusual vendor payments.` The AI's response is a structured report that flags specific transactions and provides a plain-English explanation for why each one is suspicious.

**Claims:**
1. A method for forensic accounting, comprising:
   a. Ingesting a set of financial transaction data.
   b. Providing the data to a generative AI model.
   c. Prompting the model to analyze the data for patterns indicative of fraudulent activity.
   d. Displaying a list of suspicious transactions identified by the model to a user.
