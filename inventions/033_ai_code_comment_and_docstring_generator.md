**Title of Invention:** System and Method for Automated Generation of Code Documentation

**Abstract:**
A system for automatically generating code documentation, such as comments and docstrings, is disclosed. The system, typically implemented as an IDE extension, receives a block of source code selected by a user. The code is sent to a generative AI model that is prompted to analyze the code's function, its parameters, and its return value. The AI model generates a descriptive comment or a formatted docstring that explains the code's purpose in natural language. This generated documentation is then inserted into the source code file, improving its readability and maintainability.

**Background of the Invention:**
Writing good documentation is a critical part of software development, but it is often neglected because it is a time-consuming manual task. Poorly documented code is difficult for other developers (or the original author) to understand, leading to bugs and slower development cycles. There is a need for a tool that can automate the process of writing clear, accurate documentation for existing code.

**Brief Summary of the Invention:**
The present invention is an IDE extension that adds a "Generate Docs" command. When a developer highlights a function or method and invokes the command, the extension sends the selected code text to a large language model (LLM). The prompt instructs the LLM to act as a senior software engineer and write a docstring for the provided function, explaining its purpose, arguments, and what it returns. The LLM's response, which is the formatted docstring text, is then automatically inserted into the code editor above the function.

**Detailed Description of the Invention:**
A developer is working in an IDE (e.g., VS Code). They have written a Python function:
```python
def calculate_ema(prices, period):
    alpha = 2 / (period + 1)
    ema = [prices[0]]
    for price in prices[1:]:
        ema.append(alpha * price + (1 - alpha) * ema[-1])
    return ema
```
The developer highlights this function and right-clicks, selecting "AI: Generate Docstring".

1.  **IDE Extension Logic:** The extension gets the selected text.
2.  **Prompt Construction:** It constructs a prompt for an LLM like Gemini:
    `You are a helpful programming assistant. Write a professional Python docstring for the following function. Explain what it does, its parameters, and what it returns.

    **Function:**
    \`\`\`python
    def calculate_ema(prices, period):
        alpha = 2 / (period + 1)
        ema = [prices[0]]
        for price in prices[1:]:
            ema.append(alpha * price + (1 - alpha) * ema[-1])
        return ema
    \`\`\`
    `
3.  **AI Generation:** The LLM returns the formatted docstring as a text response.
    ```python
    """Calculates the Exponential Moving Average (EMA) for a list of prices.

    Args:
        prices (list[float]): A list of numerical price points.
        period (int): The lookback period for the EMA.

    Returns:
        list[float]: A list of the calculated EMA values.
    """
    ```
4.  **Code Insertion:** The IDE extension receives this text and uses the IDE's API to insert it directly into the document at the correct position within the function.

**Claims:**
1. A method for generating code documentation, comprising:
   a. Receiving a selection of source code from a user within a code editor.
   b. Transmitting the selected source code to a generative AI model.
   c. Prompting the model to generate a natural language description of the source code's function.
   d. Receiving the generated description from the model.
   e. Inserting the generated description into the code editor as a comment or docstring.

2. The method of claim 1, wherein the prompt instructs the model to describe the function's parameters and return value.

**Mathematical Justification:**
Let `C` be a block of source code. Let `D(C)` be the ideal, human-readable documentation for `C`. Writing this documentation has a cognitive cost `Cost(H)`, where `H` is a human developer. The generative AI model `G_AI` is a function that approximates `D`: `G_AI(C) → D'`, where `D' ≈ D(C)`. The cost of this process is `Cost(AI)`.

**Proof of Value:** The system provides value if the cost of generating and verifying the AI documentation is less than the cost of writing it manually: `Cost(AI) + Cost(Verification) < Cost(H)`. Given that `Cost(AI)` is near-zero and `D'` is a high-quality approximation, the verification cost is low. Furthermore, the existence of documentation `D'` reduces the future cognitive cost `Cost(Future_H)` for other developers to understand the code `C`. The system is proven valuable as it reduces both the initial and future costs associated with code comprehension. `Q.E.D.`