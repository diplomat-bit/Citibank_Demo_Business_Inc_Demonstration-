
**Title of Invention:** A System and Method for an AI-Powered Conversational Role-Playing Simulator for Corporate Training

**Abstract:**
A system for interactive corporate training is disclosed. The system provides a conversational AI agent that embodies a specific persona for a role-playing scenario (e.g., an "angry customer," a "disengaged employee"). A user, such as a sales representative or manager, interacts with this AI persona via text or voice. After each turn in the conversation, a separate AI "coach" model analyzes the user's response and provides real-time, private feedback on their performance, assessing their use of specific techniques (e.g., de-escalation, active listening).

**Background of the Invention:**
Traditional corporate training often relies on passive learning or role-playing with human colleagues, which can be expensive, difficult to scale, and inconsistent. There is a need for a scalable, on-demand training tool that allows employees to practice difficult conversations in a safe environment and receive immediate, objective feedback.

**Brief Summary of the Invention:**
The present invention is a conversational training simulator. The system is configured with a scenario and two AI models. The first AI is given a "persona" prompt (e.g., "You are an angry customer whose shipment was late"). The second AI is given a "coach" prompt (e.g., "You are a sales coach. Evaluate the user's response for empathy and de-escalation techniques."). The user speaks or types a response to the persona AI. Their response is sent to both AIs. The user receives a conversational reply from the persona AI, and separate, private feedback from the coach AI, allowing them to learn and adapt in a continuous loop.

**Detailed Description of the Invention:**
This system uses a dual-LLM architecture.
1.  **Setup:** A training scenario is selected, e.g., "Handling an Angry Customer."
    *   **Persona LLM System Prompt:** `You are an angry customer. Your delivery was late. Be difficult but not impossible. The user is a support agent trying to help you.`
    *   **Coach LLM System Prompt:** `You are a customer support coach. The user is a support agent. Evaluate their responses based on the A.P.O.L.O.G.I.Z.E. framework for de-escalation. Provide specific, constructive feedback.`
2.  **Interaction Loop:**
    *   **Persona AI:** "My package is three days late! This is unacceptable!"
    *   **User:** "I understand you're frustrated, and I'm very sorry for the delay. Can I have your order number to see what's going on?"
    *   **Backend:** The user's response is sent to both LLMs.
    *   **Persona AI Response:** "My order number is 123. You'd better fix this!"
    *   **Coach AI Response:** `{"feedback": "Excellent work. You started with empathy and an apology, and then moved to a concrete action (asking for the order number). This is a strong opening.", "score": 9}`
3.  **UI:** The user sees the persona's conversational reply in the main chat window. A separate, private "Coach's Corner" panel displays the feedback from the coach AI.

**Conceptual Code (Node.js Backend):**
```typescript
async function handleTrainingResponse(userInput: string, personaChat: Chat, coachChat: Chat) {
    // Get responses from both AIs in parallel
    const personaPromise = personaChat.sendMessage({ message: userInput });
    
    const coachPrompt = `Evaluate this agent response: "${userInput}"`;
    const coachPromise = coachChat.sendMessage({ message: coachPrompt });

    const [personaResult, coachResult] = await Promise.all([personaPromise, coachPromise]);

    return {
        personaReply: personaResult.text,
        coachFeedback: coachResult.text, // Could be structured JSON
    };
}
```

**Claims:**
1. A method for conversational training, comprising:
   a. Configuring a first generative AI model with a persona for a role-playing scenario.
   b. Configuring a second generative AI model with a set of evaluation criteria for coaching.
   c. Receiving an input from a user intended for the first AI model.
   d. Transmitting the user input to the first AI model to generate a conversational reply.
   e. Transmitting the user input to the second AI model to generate performance feedback.
   f. Displaying both the conversational reply and the performance feedback to the user.
