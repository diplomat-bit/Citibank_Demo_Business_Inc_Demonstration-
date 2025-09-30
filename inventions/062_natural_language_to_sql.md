
**Title of Invention:** System and Method for Translating Natural Language to SQL Queries

**Abstract:**
A system for querying a relational database is disclosed. A user provides a query in natural language. The system provides this query, along with the database schema, to a generative AI model. The AI is prompted to translate the natural language question into a formal, syntactically correct SQL query. This generated query can then be executed against the database.

**Detailed Description:**
This is the core of the Analytics module. A user types "Show me the top 5 customers by total spending last month." The backend constructs a prompt including the user's question and the database schema (`tables`, `columns`). **Prompt:** `You are a SQL expert. Given this schema [schema], write a SQL query for: "Show me the top 5 customers..."`. The AI returns the SQL string, which is then executed.

**Claims:**
1. A method for querying a database, comprising:
   a. Receiving a natural language query.
   b. Providing the query and the database schema to a generative AI model.
   c. Receiving a formal SQL query from the model.
   d. Executing the SQL query.
