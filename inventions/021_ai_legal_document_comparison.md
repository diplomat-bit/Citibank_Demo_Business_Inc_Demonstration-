**Title of Invention:** A System and Method for Semantic Comparison and Analysis of Legal Documents

**Abstract:**
A system for analyzing legal documents is disclosed. The system receives two text-based legal documents, such as two versions of a contract. It sends both documents to a generative AI model with a prompt instructing it to perform a semantic comparison. The AI model is prompted to identify not just the literal text changes, but the material differences in legal meaning and their potential implications. The system then returns a concise, plain-English summary of these differences, allowing a non-lawyer to quickly understand the changes between document versions.

**Background of the Invention:**
Comparing two versions of a legal contract is a critical but tedious task. Traditional "diff" tools can only show literal text changes, but cannot interpret the legal meaning or significance of those changes. A small wording change can have major legal implications that are not obvious to a layperson. Legal review is expensive and time-consuming. There is a need for a tool that can automate the initial analysis, highlighting the most important changes in a way that is easy to understand.

**Brief Summary of the Invention:**
The present invention provides an interface where a user can input the text of two documents ("Document A" and "Document B"). The system constructs a prompt for a large language model (LLM) that includes the full text of both documents. The prompt instructs the AI to act as a legal analyst, compare the two, and generate a summary of the material differences. The AI identifies changes in obligations, liabilities, timelines, and other key legal terms, and explains their potential impact. The resulting summary is then displayed to the user.

**Detailed Description of the Invention:**
A user accesses the legal analysis module. The UI provides two large text areas, one for the original document and one for the revised document. The user pastes the respective content into these fields.

Upon submission, the backend service constructs a single, comprehensive prompt for a generative AI model like Gemini. The prompt is structured as follows:
`You are an expert legal analyst. Compare Document A and Document B below. Provide a summary of the material differences in legal meaning, focusing on changes to liability, obligations, and financial terms. Do not just list the text changes; explain their implications.

--- DOCUMENT A ---
[Full text of Document A]

--- DOCUMENT B ---
[Full text of Document B]

--- ANALYSIS ---
`
The backend service receives the generated text analysis from the AI model. This text is then parsed (e.g., if formatted as markdown) and displayed to the user in a clear, easy-to-read format, often as a bulleted list of key changes.

**Conceptual Code (Python Backend):**
```python
from google.generativeai import GenerativeModel

async def compare_contracts(doc_a: str, doc_b: str) -> str:
    """
    Uses a generative AI to compare two legal documents and summarize the differences.
    """
    model = GenerativeModel('gemini-2.5-flash')
    
    prompt = f"""
    You are an expert legal analyst. Compare Document A and Document B below.
    Provide a summary of the material differences in legal meaning, focusing on
    changes to liability, obligations, and financial terms.
    Explain their implications in plain English.

    --- DOCUMENT A ---
    {doc_a}

    --- DOCUMENT B ---
    {doc_b}

    --- ANALYSIS ---
    """

    response = await model.generate_content_async(prompt)
    return response.text
```

**Claims:**
1. A method for analyzing legal documents, comprising:
   a. Receiving the text content of a first document and a second document.
   b. Constructing a prompt for a generative AI model that includes the content of both documents and an instruction to identify and explain the material differences in their legal meaning.
   c. Transmitting said prompt to the generative AI model.
   d. Receiving a text summary from the model detailing the implications of the differences.
   e. Displaying the summary to the user.

2. The method of claim 1, wherein the prompt instructs the AI model to explain the differences in plain, non-legal English.

**Mathematical Justification:**
Let `D_A` and `D_B` be two documents. A traditional diff function is `f_diff(D_A, D_B) → Δ_text`, which operates on the text space. Let `L(D)` be a function that maps a document to its set of legal implications or semantic meaning. The goal is to compute `Δ_legal = L(D_B) \ L(D_A)`. This function `L` is not formally defined. The generative AI model `G_AI` acts as a powerful approximation of this function. The system computes `Summary ≈ G_AI(D_A, D_B)`.

**Proof of Utility:** The manual process requires a human expert `H` to compute `L(D_A)` and `L(D_B)` and then find the difference, a process with high cost `C_H`. The AI provides an approximation of this difference in a single step. The system is proven useful if the cost of using the AI and verifying its output is significantly less than the cost of the manual process: `Cost(G_AI) + Cost(Verification) ≪ C_H`. By automating the initial discovery of material changes, the system dramatically reduces the required human expert time. `Q.E.D.`