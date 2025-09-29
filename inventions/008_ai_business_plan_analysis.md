
**Title of Invention:** System and Method for Automated Business Plan Analysis and Generation of a Coaching Plan

**Abstract:**
A system for providing automated feedback and strategic guidance on a business plan is disclosed. A user submits a textual business plan. The system sends this plan to a generative AI model instructed to perform two functions: first, to provide a concise, high-level analysis of the plan's strengths and weaknesses; second, to generate a structured, multi-step coaching plan with actionable advice for the user. The system uses a structured response schema to ensure the AI's output is well-organized and easily presentable, effectively acting as an automated business consultant.

**Background of the Invention:**
Entrepreneurs, particularly first-time founders, often lack access to experienced mentors who can provide critical feedback on their business plans. Professional consulting services are expensive and time-consuming. There is a need for an accessible, automated tool that can provide instant, high-quality feedback and a strategic roadmap to help founders refine their ideas.

**Brief Summary of the Invention:**
The present invention, known as the Quantum Weaver, is an AI-powered business incubator. A user submits their business plan as a text input. The system first sends this text to a large language model (LLM) with a prompt asking for initial feedback and a set of insightful follow-up questions. This output is presented to the user. In a subsequent step, the system sends the business plan to the LLM again, this time with a prompt asking it to determine a simulated seed funding amount and to generate a detailed, multi-step coaching plan. The request specifies a JSON schema for the response, ensuring the plan is structured with fields like `title`, `summary`, and an array of `steps`, each with its own `title`, `description`, and `timeline`.

**Detailed Description of the Invention:**
The user interacts with a multi-stage interface. In the first stage (`Pitch`), they submit their business plan. The backend receives the plan and calls a generative AI model with a prompt structured to elicit initial feedback and questions, using a `responseSchema` for the output. The parsed JSON response is displayed to the user in the `Test` stage.

Upon user confirmation, the system proceeds to the `FinalReview` stage. The backend makes a second call to the AI model. This time, the prompt is: `This business plan has been approved for seed funding. Determine an appropriate seed funding amount (between $50k-$250k) and create a 4-step coaching plan... Plan: "[business plan text]"`. This request also uses a detailed `responseSchema` to structure the `loanAmount` and `coachingPlan` object.

The structured JSON response is received by the backend, stored, and then presented to the user in the final `Approved` stage. The UI can then render the coaching plan in a clear, step-by-step format.

**Claims:**
1. A method for analyzing a business plan, comprising:
   a. Receiving a business plan in text format from a user.
   b. Transmitting the business plan to a generative AI model with a first prompt to generate initial feedback and a plurality of questions.
   c. Displaying said feedback and questions to the user.
   d. Transmitting the business plan to a generative AI model with a second prompt to generate a structured coaching plan, said plan comprising multiple actionable steps.
   e. Displaying the structured coaching plan to the user.

2. The method of claim 1, wherein the request for the coaching plan includes a response schema to ensure the output is in a structured JSON format.

3. The method of claim 1, wherein the second prompt also instructs the AI model to determine a simulated funding amount.
