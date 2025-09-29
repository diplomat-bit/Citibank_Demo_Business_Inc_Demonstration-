
**Title of Invention:** A System and Method for Providing Context-Aware Conversational Prompts in a User Interface

**Abstract:**
A system for enhancing a conversational AI interface is disclosed. The system tracks a user's navigation history within a software application to determine their most recent context or task. When the user enters the conversational AI interface, the system presents a plurality of pre-formulated, contextually relevant prompt suggestions. These suggestions are tailored to the user's immediately preceding view, providing relevant starting points for conversation and reducing the cognitive load of initiating a dialogue with the AI.

**Background of the Invention:**
Conversational AI interfaces often present users with a blank input field, creating a "blank page" problem where the user may not know what to ask or how to begin. While generic examples can be provided, they are not tailored to the user's current task and are therefore of limited utility. There is a need for a system that can provide intelligent, context-aware prompt suggestions to facilitate more natural and effective human-AI interaction.

**Brief Summary of the Invention:**
The present invention tracks the user's active view within an application. This "previous view" state is passed as a context parameter to the conversational AI view. The AI view uses this context to select a set of relevant example prompts from a predefined mapping of views to questions. For example, if the user was previously viewing a "Budgets" screen, the system suggests prompts like "How am I doing on my budgets?" This makes the AI feel more intelligent and seamlessly integrated into the application workflow.

**Detailed Description of the Invention:**
A state management system within a client-side application maintains a variable representing the `activeView` and another for the `previousView`. When a user navigates from View A to View B, the state is updated such that `previousView` becomes A and `activeView` becomes B.

When the user navigates to the conversational AI interface (e.g., `AIAdvisorView`), the `previousView` state (e.g., `View.Budgets`) is passed to it as a property. The `AIAdvisorView` contains a data structure, such as a hash map or dictionary, that maps `View` enums to an array of string-based prompt suggestions.

The component uses the `previousView` property as a key to look up the relevant list of prompts in the map. These prompts are then rendered as clickable buttons or suggestions within the UI. If the user clicks on a suggestion, its text is sent to the AI as the initial message, seamlessly starting a context-aware conversation. If no specific prompts exist for the `previousView`, a default set of suggestions is displayed.

**Claims:**
1. A method for enhancing a conversational AI, comprising:
   a. Tracking a user's navigation history to identify a most recently visited user interface view.
   b. Storing said most recently visited view as a context variable.
   c. When the user accesses the conversational AI, retrieving a set of pre-formulated questions associated with the stored context variable.
   d. Displaying the retrieved set of questions to the user as selectable prompt suggestions.

2. The method of claim 1, wherein the association between views and questions is stored in a key-value data structure.

3. The method of claim 1, further comprising:
   a. Upon user selection of a prompt suggestion, automatically sending the text of said suggestion as the initial message in the conversation with the AI.
