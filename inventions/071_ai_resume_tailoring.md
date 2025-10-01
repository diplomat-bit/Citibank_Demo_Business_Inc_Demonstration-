**FACT HEADER - NOTICE OF CONCEPTION**

**Conception ID:** DEMOBANK-INV-071
**Title:** A System and Method for Tailoring Resumes to Job Descriptions
**Date of Conception:** 2024-07-26
**Conceiver:** The Sovereign's Ledger AI

**Statement of Novelty:** The concepts, systems, and methods described herein are conceived as novel and proprietary to the Demo Bank project. This document serves as a timestamped record of conception.

---

**Title of Invention:** A System and Method for Tailoring Resumes to Job Descriptions Using Generative AI

**Abstract:**
A system for assisting job seekers is disclosed. A user provides their base resume and the text of a target job description. The system sends both documents to a generative AI model. The AI is prompted to analyze the job description for key skills, keywords, and qualifications. It then suggests specific, concrete edits to the user's resume, such as rephrasing bullet points, reordering sections, or highlighting different projects, to better align the resume with the target job without fabricating information.

**Background of the Invention:**
It is a well-known best practice for job seekers to tailor their resume for each specific job application. This significantly increases the chances of passing automated applicant tracking systems (ATS) and catching the eye of a human recruiter. However, this is a time-consuming, manual process that requires careful analysis of each job description and thoughtful rewriting. Many job seekers apply with a generic resume, reducing their chances of success.

**Brief Summary of the Invention:**
The present invention provides an "AI Resume Coach." A user pastes their resume and a job description into two text fields. The system prompts a large language model (LLM) to act as a professional career coach. The prompt instructs the AI to first analyze the job description and then suggest specific, line-by-line improvements to the resume to make it a stronger match. The AI does not invent skills; it reframes the user's existing experience using the language and keywords of the job description. The suggested edits are then displayed to the user.

**Detailed Description of the Invention:**
A user is applying for a job.
1.  **Input:** The user provides their resume and the target job description.
2.  **Prompt Construction:** The backend service constructs a detailed prompt for an LLM.
    **Prompt:** `You are an expert career coach and resume writer.
    **Task:** Analyze the provided Job Description and suggest specific improvements for the user's Resume to make it a stronger candidate for the role. Focus on rephrasing bullet points to include keywords from the description and highlighting the most relevant skills. Do not add any skills the user does not already have.

    **Job Description:**
    "[Full text of job description]"

    **User's Resume:**
    "[Full text of resume]"

    **Suggested Improvements:**
    `
3.  **AI Generation:** The LLM analyzes both texts. It identifies keywords like "agile development" and "CI/CD pipelines" in the job description. It finds a related bullet point in the resume ("Worked on a team to build software") and suggests a rewrite.
    **AI Output:**
    `
    Here are 3 suggested improvements:
    1. In your 'Software Engineer at Acme Corp' experience, change the bullet point "Worked on a team to build software" to "Collaborated in an agile development environment to build and deploy software using CI/CD pipelines," to better match the keywords in the job description.
    2. ...
    `
4.  **Output:** The system displays this list of actionable suggestions to the user, who can then update their resume.

**Claims:**
1. A method for resume assistance, comprising:
   a. Receiving the text of a user's resume and the text of a target job description.
   b. Transmitting both documents as context to a generative AI model.
   c. Prompting the model to generate a list of suggested edits for the resume to better align it with the key requirements of the job description.
   d. Displaying the suggested edits to the user.

2. The method of claim 1, wherein the prompt explicitly instructs the model not to invent new skills or experience for the resume.

**Mathematical Justification:**
Let a resume `R` and a job description `J` be represented as vectors in a high-dimensional semantic space, `v_R` and `v_J`. The "match score" can be defined as the cosine similarity between these vectors: `Match(R, J) = cos(v_R, v_J)`. The goal is to find a modified resume `R'` such that `Match(R', J)` is maximized, under the constraint that `R'` is factually consistent with `R`. The generative AI model `G_AI` learns a transformation function `G_AI(R, J) → R'` that attempts to solve this constrained optimization problem.

**Proof of Efficacy:** The AI, trained on a vast corpus of resumes and job descriptions, learns the semantic features that lead to a high match score (e.g., keyword alignment, skill highlighting). Its suggested transformation `R'` is designed to increase the cosine similarity between the resume and the job description vectors. By applying the suggested edits, the user increases the probability that an automated Applicant Tracking System (ATS) or a human recruiter will score their resume favorably, thus proving the system's efficacy in improving job application outcomes. `Q.E.D.`
