
**Title of Invention:** System and Method for Translating Natural Language to Graph Database Queries

**Abstract:**
A system for querying a graph database is disclosed. A user enters a query in natural language (e.g., "Find all customers who bought Product A and were referred by the Q2 marketing campaign"). The system sends this query, along with the graph schema, to a generative AI model. The AI is prompted to translate the natural language question into a formal graph query language (e.g., Cypher, Gremlin). The generated query is then executed against the graph database.

**Background of the Invention:**
Graph databases are powerful but require knowledge of specialized query languages. This creates a barrier for non-technical users who may want to explore the relationships in their data. There is a need for an interface that allows users to query a graph using plain English.

**Detailed Description of the Invention:**
A user types a question into the Graph Explorer's search bar. The backend receives this question. It constructs a prompt for an LLM that includes the user's question and a simplified representation of the graph schema. **Prompt:** `You are a Cypher query expert. Given this schema (Nodes: User, Product, Campaign; Relationships: BOUGHT, REFERRED_BY), translate the following question into a Cypher query. Question: "Find all customers who bought Product A..."` The AI returns the Cypher query, which the backend then executes against the Neo4j database. The results are used to highlight the relevant nodes and edges in the UI.

**Claims:**
1. A method for querying a graph database, comprising:
   a. Receiving a natural language query from a user.
   b. Providing the query and a schema of the graph database to a generative AI model.
   c. Prompting the model to generate a formal query in a graph query language.
   d. Executing the generated formal query against the database.
