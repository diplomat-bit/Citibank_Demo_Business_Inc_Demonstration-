
**Title of Invention:** A System and Method for AI-Powered Document Analysis in Legal E-Discovery

**Abstract:**
A system for legal document review is disclosed. The system ingests a large corpus of documents related to a legal case. A lawyer can then perform a natural language, semantic search for concepts, not just keywords (e.g., "Find all documents discussing the 'Project X' budget"). A generative AI model is used to analyze retrieved documents and automatically tag them for relevance, privilege, or specific legal issues, dramatically accelerating the discovery process.

**Detailed Description:**
A law firm uploads thousands of documents. The system indexes them in a vector database. A lawyer searches for a concept. The system retrieves relevant documents and, for each one, prompts an LLM: `You are a paralegal. Read this document and determine if it is relevant to a case about "Project X budget overruns". Respond with a JSON object: {"is_relevant": true/false, "reason": "..."}`. The UI then allows the lawyer to filter for all AI-tagged relevant documents.

**Claims:**
1. A method for legal discovery, comprising:
   a. Indexing a large corpus of documents.
   b. Receiving a natural language query for a concept.
   c. Retrieving relevant documents via semantic search.
   d. Using a generative AI to automatically tag the retrieved documents for relevance to the case.
