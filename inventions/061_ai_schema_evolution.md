
**Title of Invention:** System and Method for AI-Assisted Database Schema Evolution

**Abstract:**
A system for managing database schema changes is disclosed. A developer provides a natural language description of a desired change (e.g., "Add a 'last_name' field to the users table"). The system provides this, along with the current table schema, to a generative AI model. The AI generates the formal Data Definition Language (DDL) command (e.g., `ALTER TABLE`) required to perform the migration, and can also generate the corresponding down-migration script.

**Detailed Description:**
The system is integrated into a database migration tool. A developer types a command like `db:generate-migration "Add phone number to users"`. The tool reads the current `users` table schema. It prompts an LLM: `You are a database expert. The current schema is [schema]. The user wants to "Add phone number to users". Generate the SQL ALTER TABLE statement.` The AI's response is used to create a new SQL migration file.

**Claims:**
1. A method for modifying a database schema, comprising:
   a. Receiving a natural language description of a desired schema change.
   b. Providing the description and the current schema to a generative AI model.
   c. Receiving a formal database migration script (e.g., DDL) from the model.
   d. Applying the script to the database.
