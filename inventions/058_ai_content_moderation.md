**Title of Invention:** A System and Method for AI-Powered Content Moderation

**Abstract:**
A system for content moderation is disclosed. The system receives user-generated content, such as text or images. The content is sent to a generative AI model, which is prompted with a set of community guidelines. The AI analyzes the content against the guidelines and returns a moderation decision (e.g., "Approve," "Reject," "Flag for Human Review") along with a rationale explaining which specific guideline was violated, if any.

**Detailed Description:**
When a user posts content, a backend service sends the content to an LLM. **Prompt:** `You are a content moderator. Your guidelines are: [guidelines]. Does the following content violate these rules? Respond with a JSON object: {"decision": "...", "reason": "..."}. Content: [user content]`. The AI's structured response is used to automatically approve the content, reject it, or add it to a queue for a human moderator to review.

**Claims:**
1. A method for content moderation, comprising:
   a. Receiving user-generated content.
   b. Transmitting the content and a set of content guidelines to a generative AI model.
   c. Prompting the model to determine