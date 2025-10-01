**FACT HEADER - NOTICE OF CONCEPTION**

**Conception ID:** DEMOBANK-INV-056
**Title:** System and Method for Generative Design of A/B Tests from a Natural Language Hypothesis
**Date of Conception:** 2024-07-26
**Conceiver:** The Sovereign's Ledger AI

**Statement of Novelty:** The concepts, systems, and methods described herein are conceived as novel and proprietary to the Demo Bank project. This document serves as a timestamped record of conception.

---

**Title of Invention:** System and Method for Generative Design of A/B Tests from a Natural Language Hypothesis

**Abstract:**
A system for designing product experiments is disclosed. A user provides a hypothesis in natural language (e.g., "Changing the button color to green will increase sign-ups"). The system provides this hypothesis to a generative AI model, which is prompted to act as a product analyst. The AI designs a complete A/B test plan, generating a structured object that defines the primary and secondary metrics for the experiment, and a description of the control (Variant A) and the new (Variant B) experiences.

**Background of the Invention:**
A/B testing is a cornerstone of data-driven product development. However, designing a statistically sound and meaningful experiment requires expertise. Product managers and developers often struggle with correctly defining a primary metric, considering secondary "guardrail" metrics, and clearly articulating the variants. This can lead to inconclusive or misleading test results. There is a need for a tool that can translate a simple, informal hypothesis into a formally structured and well-designed experiment plan.

**Brief Summary of the Invention:**
The present invention provides an "AI Experiment Designer." A user provides a simple hypothesis in a text field. The system sends this to a large language model (LLM) with a prompt that asks it to design an A/B test. The request includes a `responseSchema` to ensure the AI's output is a structured JSON object. The AI identifies the core action and desired outcome from the hypothesis, defines a measurable primary metric, suggests a relevant secondary (guardrail) metric, and clearly describes the "Control" and "Variant" groups. This structured plan provides a robust foundation for implementing the A/B test.

**Detailed Description of the Invention:**
A user in the Experimentation Platform wants to test a new idea.
1.  **Input:** The user types their hypothesis: "I believe that making the 'Upgrade' button larger and more prominent will increase premium conversions."
2.  **Prompt Construction:** The backend constructs a prompt for a generative AI model.
    **Prompt:** `You are an expert product analyst. Design a simple A/B test for this hypothesis: "I believe that making the 'Upgrade' button larger and more prominent will increase premium conversions". Define a clear primary metric, a secondary (guardrail) metric to monitor for negative impacts, and describe the Control and Variant B. Respond in the specified JSON format.`
3.  **AI Generation with Schema:** The request includes a `responseSchema` to structure the output.
    ```json
    {
      "type": "OBJECT",
      "properties": {
        "primaryMetric": { "type": "STRING" },
        "secondaryMetric": { "type": "STRING" },
        "variants": {
          "type": "ARRAY",
          "items": {
            "type": "OBJECT",
            "properties": {
              "name": { "type": "STRING" },
              "description": { "type": "STRING" }
            }
          }
        }
      }
    }
    ```
4.  **AI Output:** The AI returns a structured JSON plan:
    ```json
    {
      "primaryMetric": "Conversion rate to Premium subscription.",
      "secondaryMetric": "Overall page load time.",
      "variants": [
        { "name": "Control (Variant A)", "description": "The existing 'Upgrade' button with current size and styling." },
        { "name": "Variant B", "description": "The 'Upgrade' button with increased size (e.g., 1.5x) and a high-contrast background color." }
      ]
    }
    ```
This structured plan is then displayed in the UI, giving the product manager a complete test design that can be handed off for implementation.

**Claims:**
1. A method for designing an experiment, comprising:
   a. Receiving a natural language hypothesis from a user.
   b. Transmitting the hypothesis to a generative AI model.
   c. Prompting the model to generate a structured test plan, said plan including a primary success metric and a definition of at least two variants to be tested.
   d. Displaying the test plan to the user.

2. The method of claim 1, wherein the test plan further includes a secondary guardrail metric.

3. The method of claim 1, wherein the request to the AI model includes a response schema to ensure the output is in a structured format.

**Mathematical Justification:**
Let a hypothesis `H` be a statement that a change `Δ` to a system will cause a change in a metric `M`. An A/B test is a statistical experiment designed to test `H`. Designing the test requires defining the null hypothesis `H_0`, the primary metric `M`, and the variants `V = {v_A, v_B}`. The AI model `G_AI` is a function that parses the natural language hypothesis `p` (an informal representation of `H`) and maps it to a formal test structure: `G_AI(p) → {M_primary, M_secondary, Variants}`.

**Proof of Functionality:** The system automates the translation of a qualitative, informal hypothesis into a quantitative, formal experimental design. The AI uses its understanding of language and product experimentation principles (e.g., identifying measurable outcomes, considering counter-metrics) to correctly identify the core metric and the change being tested. The system is proven functional as it correctly scaffolds the necessary components for a statistically valid experiment, reducing the friction and expertise required to begin A/B testing and increasing the rigor of the resulting plans. `Q.E.D.`
