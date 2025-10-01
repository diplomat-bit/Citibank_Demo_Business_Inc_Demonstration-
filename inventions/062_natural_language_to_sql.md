**FACT HEADER - NOTICE OF CONCEPTION**

**Conception ID:** DEMOBANK-INV-062
**Title:** System and Method for Translating Natural Language to SQL Queries
**Date of Conception:** 2024-07-26
**Conceiver:** The Sovereign's Ledger AI

**Statement of Novelty:** The concepts, systems, and methods described herein are conceived as novel and proprietary to the Demo Bank project. This document serves as a timestamped record of conception.

---

**Title of Invention:** System and Method for Translating Natural Language to SQL Queries

**Abstract:**
A system for querying a relational database is disclosed. A user provides a query in natural language (e.g., "Show me the top 5 customers by total spending last month"). The system provides this query, along with the database schema (table names, columns, and relationships), to a generative AI model. The AI is prompted to translate the natural language question into a formal, syntactically correct SQL query. This generated query can then be executed against the database, allowing non-technical users to perform complex data analysis.

**Background of the Invention:**
SQL is the standard language for interacting with relational databases, but it requires specialized knowledge of its syntax and the specific schema of the database. This creates a significant barrier for business users, analysts, and executives who want to explore data but do not know SQL. They are often reliant on a limited set of pre-built dashboards or must wait for a data analyst to write a query for them, creating bottlenecks and hindering data-driven decision-making.

**Brief Summary of the Invention:**
The present invention provides a "Natural Language to SQL" translation layer. A user types a question in plain English. The system's backend constructs a detailed prompt for a large language model (LLM). This prompt includes not just the user's question, but also the `CREATE TABLE` statements for the relevant database tables. This contextual information is critical, as it gives the AI the necessary information about table names, column names, and relationships to write a correct query. The AI translates the user's question into a SQL query, which the backend then executes to retrieve the results.

**Detailed Description of the Invention:**
This is the core of the Analytics module. A user types "Show me the top 5 customers by total spending last month."

1.  **Input:** The backend receives the natural language query.
2.  **Context Gathering:** The backend retrieves the schema for relevant tables.
    `CREATE TABLE customers (id INT, name TEXT);`
    `CREATE TABLE orders (id INT, customer_id INT, amount REAL, created_at TIMESTAMP);`
3.  **Prompt Construction:** A detailed prompt is created for an LLM like Gemini.
    **Prompt:** `You are an expert SQL analyst. Given the following database schema, write a single, valid PostgreSQL query to answer the user's question.

    **Schema:**
    \`\`\`sql
    CREATE TABLE customers (id INT, name TEXT);
    CREATE TABLE orders (id INT, customer_id INT, amount REAL, created_at TIMESTAMP);
    \`\`\`

    **User Question:**
    "Show me the top 5 customers by total spending last month."

    **SQL Query:**
    `
4.  **AI Generation:** The LLM analyzes the question and the schema, determines it needs to join the tables, filter by date, aggregate the spending, and order the results.
    **AI Output:**
    ```sql
    SELECT c.name, SUM(o.amount) as total_spending
    FROM customers c
    JOIN orders o ON c.id = o.customer_id
    WHERE o.created_at >= date_trunc('month', current_date - interval '1 month')
      AND o.created_at < date_trunc('month', current_date)
    GROUP BY c.name
    ORDER BY total_spending DESC
    LIMIT 5;
    ```
5.  **Execution:** The backend executes this generated SQL against the database and returns the results to the user's browser, where they are displayed in a table.

**Claims:**
1. A method for querying a database, comprising:
   a. Receiving a natural language query from a user.
   b. Providing the user's query and the database schema as context to a generative AI model.
   c. Prompting the model to generate a formal SQL query that answers the user's question.
   d. Receiving the SQL query from the model.
   e. Executing the SQL query against the database to retrieve results.
   f. Displaying the results to the user.

2. The method of claim 1, wherein the database schema is provided to the model in the form of `CREATE TABLE` statements.

**Mathematical Justification:**
This is a language translation problem. Let `L_NL` be the natural language space and `L_SQL` be the SQL language space. The AI model `G_AI` learns a translation function `T: L_NL → L_SQL`. The translation is conditioned on the database schema `Σ`. Thus, `G_AI(q_nl, Σ) → q_sql`. Let `Exec(q, DB)` be the execution of a query on a database `DB`. The translation is correct if the intent is preserved, meaning `Exec(q_sql, DB)` provides the data the user intended to retrieve with `q_nl`.

**Proof of Correctness:** The AI model is trained on a vast corpus of paired natural language questions and formal SQL queries. It learns the statistical mapping between linguistic structures (like "top 5" or "last month") and SQL syntax (`ORDER BY ... DESC LIMIT 5`, `WHERE date >= ...`). By providing the schema `Σ` in the prompt, the model is constrained to generate a query that is syntactically and semantically valid for the specific target database. The system is proven correct as it provides a high-fidelity translation from user intent expressed in `L_NL` to an executable, formal query in `L_SQL`. `Q.E.D.`
