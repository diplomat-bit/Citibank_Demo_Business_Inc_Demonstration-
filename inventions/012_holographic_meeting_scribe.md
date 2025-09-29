
**Title of Invention:** System and Method for Generating a 3D Mind Map Visualization from Meeting Transcripts

**Abstract:**
A system for processing and visualizing conversations is disclosed. The system ingests a transcript from a meeting, either in real-time or from a recording. A generative AI model processes the transcript to identify key concepts, speakers, decisions, and action items. The AI then structures this information hierarchically. This structured data is used to generate a three-dimensional, navigable mind map, where concepts are represented as nodes and their relationships as links in 3D space. This provides a more intuitive and spatially organized summary of a meeting compared to a linear text document.

**Background of the Invention:**
Traditional meeting summaries, in the form of minutes or transcripts, are linear and text-based. They can be difficult to scan for key information and do not effectively represent the non-linear, interconnected nature of conversations. There is a need for a system that can automatically summarize a meeting and present that summary in a more intuitive, visual, and spatially explorable format.

**Brief Summary of the Invention:**
The present invention provides a service that takes a meeting transcript as input. The transcript is sent to a large language model (LLM) with a prompt instructing it to act as a meeting summarizer and to extract key entities (concepts, action items, decisions) and the relationships between them. The prompt specifies that the output should be a structured format, such as a JSON object representing a graph with nodes and edges. This graph data is then passed to a 3D rendering engine, such as one using Three.js or a similar library, which dynamically generates and displays an interactive 3D mind map. Users can navigate this 3D space, clicking on nodes to see more details.

**Detailed Description of the Invention:**
A meeting transcript, including speaker identification, is provided to the system. A backend service constructs a prompt for a generative AI model, such as: `Analyze the following meeting transcript. Identify the main topics, sub-topics, decisions made, and action items assigned. Structure this as a hierarchical graph in JSON format, with nodes for each item and edges representing their relationships. Transcript: [transcript text]`.

The request to the AI includes a `responseSchema` defining the graph structure, e.g., `{ "nodes": [{"id": "...", "label": "...", "type": "..."}, ...], "edges": [{"source": "...", "target": "..."}] }`.

The backend receives the structured JSON graph data. This data is then passed to a client-side component. This component utilizes a 3D graphics library like Three.js. It iterates through the nodes and edges of the graph data, programmatically creating 3D objects (e.g., spheres for nodes, cylinders for edges) and positioning them in a 3D scene using a force-directed layout algorithm to prevent overlap. The final result is a navigable 3D mind map of the conversation, which is rendered in a `<canvas>` element.

**Claims:**
1. A method for visualizing a conversation, comprising:
   a. Receiving a text transcript of a conversation.
   b. Transmitting the transcript to a generative AI model with a prompt to extract key concepts and their relationships.
   c. Receiving a structured data object from the model representing the concepts and relationships as a graph.
   d. Using said graph data to programmatically generate a three-dimensional visual representation of the conversation.
   e. Displaying the three-dimensional representation to a user.

2. The method of claim 1, wherein the three-dimensional representation is an interactive mind map.

3. The method of claim 1, wherein the generative AI model is further prompted to extract action items, and said action items are distinctly visualized in the three-dimensional representation.
