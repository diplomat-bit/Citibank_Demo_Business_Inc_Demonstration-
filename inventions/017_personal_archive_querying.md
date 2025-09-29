
**Title of Invention:** A System and Method for Natural Language Querying of a Unified Personal Digital Archive

**Abstract:**
A system for searching and retrieving information from a user's personal data is disclosed. The system ingests and indexes data from a plurality of disparate sources, such as emails, photos, documents, and calendar events, creating a unified, time-series archive. A user can query this archive using natural language prompts (e.g., "What was I working on during my trip to Italy in 2018?"). The system uses a large language model (LLM) to perform a semantic search across the indexed data, retrieve the most relevant assets, and synthesize a coherent, narrative summary that directly answers the user's query.

**Background of the Invention:**
An individual's digital life is typically fragmented across many different applications and services. Finding information related to a specific past event often requires manually searching through multiple, disconnected archives (e.g., a photo library, an email client, a document folder). There is a need for a unified system that can be queried with a single, natural language question to retrieve and summarize all relevant information about a past event.

**Brief Summary of the Invention:**
The present invention, the Personal Historian AI, first creates a unified index of a user's personal data. When a user enters a natural language query, the system uses an embedding model to convert the query and the indexed data into a common vector space. It performs a vector search to find the most relevant documents, emails, and photos. These retrieved assets, along with the original query, are then passed as context to a generative AI model. The model is prompted to synthesize the information from the retrieved assets into a direct, narrative answer to the user's question, and to provide links to the source assets.

**Detailed Description of the Invention:**
The system comprises a data ingestion pipeline that connects to various user data sources via APIs. It extracts text and metadata from documents, emails, and images (using OCR). This data is chunked and converted into vector embeddings, which are stored in a vector database.

When a user submits a query like "My first marathon," the query is also converted into an embedding. The system performs a similarity search in the vector database to retrieve the top N most relevant data chunks.

These retrieved chunks are compiled into a context block. A prompt is constructed for a generative AI model, such as: `You are a personal historian. Based on the following retrieved documents, answer the user's question. Question: "My first marathon". Context: [Retrieved data chunks including training log entries, photos with dates, and a confirmation email]. Synthesize a summary.`

The AI model processes the prompt and generates a summary, such as "You ran your first marathon in New York on November 5th, 2017. Key assets related to this memory include your training plan document and a photo album from the event." The system displays this summary to the user, along with links to the source documents it referenced.

**Claims:**
1. A method for retrieving personal information, comprising:
   a. Indexing data from a plurality of personal data sources into a unified archive.
   b. Receiving a natural language query from a user regarding a past event.
   c. Performing a semantic search on the unified archive to retrieve data chunks relevant to the query.
   d. Providing the retrieved data chunks and the user's query as context to a generative AI model.
   e. Receiving a synthesized, narrative summary from the AI model that answers the user's query.
   f. Displaying the summary to the user.

2. The method of claim 1, wherein indexing the data comprises creating vector embeddings of the data.

3. The method of claim 1, wherein the summary displayed to the user includes links to the source data from which the summary was synthesized.
