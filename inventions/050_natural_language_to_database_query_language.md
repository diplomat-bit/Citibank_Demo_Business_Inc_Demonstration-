
**Title of Invention:** System and Method for Translating Natural Language to a Domain-Specific Query Language

**Abstract:**
A system for querying data using a proprietary, domain-specific query language (DSQL) is disclosed. A user enters a query in natural language. A generative AI model, provided with the DSQL's grammar and the database schema, translates the user's intent into a syntactically correct DSQL query. This generated query is then executed, allowing non-expert users to leverage the power of the DSQL without learning its specific syntax.

**Background of the Invention:**
Many platforms develop their own powerful, domain-specific query languages (e.g., Splunk's SPL, LogiQL). While powerful, these languages have a steep learning curve. This limits their use to a small number of expert users. There is a need for a translation layer that can bridge the gap between natural language and these specialized query languages.

**Detailed Description of the Invention:**
The DBQL module sends a user's natural language question to an LLM. The system prompt for the AI is extensive, containing the full grammar and syntax rules of DBQL, along with examples. **Prompt:** `You are an expert in DBQL. Its syntax is... Translate the user's question into a valid DBQL query. Question: "Show me transactions over $100."` The AI returns the formatted query, `FROM transactions SELECT * WHERE amount > 100;`, which is then executed by the DBQL engine.

**Claims:**
1. A method for generating a query in a domain-specific query language (DSQL), comprising:
   a. Receiving a natural language query from a user.
   b. Providing the query, the DSQL's grammar, and a database schema to a generative AI model.
   c. Prompting the model to generate a formal query in the DSQL.
   d. Executing the generated query.
