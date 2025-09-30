
**Title of Invention:** A System and Method for Summarizing Academic and Scientific Papers

**Abstract:**
A system for summarizing academic papers is disclosed. A user uploads a PDF of a scientific paper. The system extracts the text and sends it to a generative AI model. The AI is prompted to read the entire paper and generate a structured summary, including a one-paragraph abstract, a bulleted list of key findings, and an explanation of the methodology used. This allows researchers to quickly assess a paper's relevance and key contributions.

**Detailed Description:**
A user uploads a PDF. The backend extracts the text. It prompts an LLM: `You are a research assistant. Read this paper and provide a structured summary including "Abstract", "Key Findings", and "Methodology".` A `responseSchema` is used to structure the output, which is then displayed to the user.

**Claims:**
1. A method for summarizing a document, comprising:
   a. Receiving an academic or scientific paper.
   b. Extracting the text content.
   c. Providing the text to a generative AI model.
   d. Prompting the model to generate a structured summary including key findings.
   e. Displaying the summary to a user.
