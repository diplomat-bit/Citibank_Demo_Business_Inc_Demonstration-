
**Title of Invention:** System and Method for AI-Assisted Database Schema and Query Migration

**Abstract:**
A system for assisting in database migrations is disclosed. The system receives a source database schema (e.g., a PostgreSQL `CREATE TABLE` statement) and a target database dialect (e.g., "Google Cloud Spanner"). A generative AI model, prompted with knowledge of both database systems, translates the source schema into the equivalent schema for the target system. The system can further receive an application-level SQL query written for the source database and use the AI to rewrite it to be syntactically and semantically correct for the target database.

**Background of the Invention:**
Migrating a software application from one database technology to another is a notoriously complex and error-prone process. Database systems have different data types, indexing strategies, and SQL dialects. Manually translating schemas and rewriting every SQL query in a large application is a massive undertaking that requires specialized expertise.

**Brief Summary of the Invention:**
The present invention provides a "Database Migration Assistant." A developer provides their original schema and selects a target database. The system sends this information to an LLM with a prompt like, "Translate this PostgreSQL schema to Google Cloud Spanner DDL." The AI, with its knowledge of both systems, generates the new schema. Similarly, a developer can input a PostgreSQL query, and the AI will be prompted to "Rewrite this query for Spanner," handling changes in function names, data types, and syntax.

**Detailed Description of the Invention:**
The system has two main functions: Schema Translation and Query Rewriting.

**1. Schema Translation:**
*   **Input:** The user pastes a PostgreSQL schema:
    `CREATE TABLE users (id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE, created_at TIMESTAMPTZ DEFAULT now());`
*   **Prompt:** `You are an expert database administrator. Translate the following PostgreSQL DDL to Google Cloud Spanner DDL.

    **PostgreSQL:**
    \`\`\`sql
    CREATE TABLE users (id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE, created_at TIMESTAMPTZ DEFAULT now());
    \`\`\`
    `
*   **AI Output:** The LLM generates the equivalent Spanner DDL:
    `CREATE TABLE users (id INT64 NOT NULL, email STRING(255), created_at TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp=true)) PRIMARY KEY (id);`

**2. Query Rewriting:**
*   **Input:** A user pastes a PostgreSQL query:
    `SELECT date_trunc('month', created_at), count(*) FROM users GROUP BY 1;`
*   **Prompt:** `You are an expert database administrator. Rewrite the following PostgreSQL query to be compatible with Google Cloud Spanner's SQL dialect.

    **PostgreSQL Query:**
    \`\`\`sql
    SELECT date_trunc('month', created_at), count(*) FROM users GROUP BY 1;
    \`\`\`
    `
*   **AI Output:** The LLM rewrites the query using Spanner's functions:
    `SELECT TIMESTAMP_TRUNC(created_at, MONTH), count(*) FROM users GROUP BY 1;`

The UI presents a side-by-side view, showing the source code on the left and the AI-generated target code on the right, allowing the developer to quickly copy and use the translated assets.

**Claims:**
1. A method for assisting in database migration, comprising:
   a. Receiving a source database schema in a first database dialect.
   b. Receiving a selection of a target database dialect.
   c. Transmitting the source schema and target dialect to a generative AI model with a prompt to translate the schema.
   d. Receiving a translated schema in the target dialect from the model.
   e. Displaying the translated schema to a user.

2. The method of claim 1, further comprising:
   a. Receiving a source SQL query compatible with the first dialect.
   b. Transmitting the source query to the generative AI model with a prompt to rewrite it for the target dialect.
   c. Receiving a rewritten query from the model.
   d. Displaying the rewritten query to the user.
