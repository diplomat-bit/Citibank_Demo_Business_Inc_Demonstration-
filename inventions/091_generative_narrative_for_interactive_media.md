**Title of Invention:** A System for Real-Time Generative Narrative in Interactive Media

**Abstract:**
A system for creating dynamic narratives in video games and other interactive media is disclosed. Instead of pre-scripted dialogue and plot points, the system uses a generative AI model that acts as a real-time "Dungeon Master." The AI receives the player's actions and the current game state as input and generates character dialogue, environmental descriptions, and new plot events on the fly, creating a unique and endlessly replayable story.

**Detailed Description of the Invention:**
The game engine maintains a summary of the game state. When a player interacts with a character, the engine prompts an LLM: `You are the character "Gandalf". The player has just [player action]. What is your response?` The AI generates dialogue in character, which is then rendered in-game.

**Claims:**
1. A method for generating a narrative in interactive media, comprising:
   a. Receiving a player's action and the current game state.
   b. Transmitting this information to a generative AI model.
   c. Prompting the model to generate a narrative event or dialogue in response to the player's action.
   d. Presenting the generated narrative event or dialogue to the player.