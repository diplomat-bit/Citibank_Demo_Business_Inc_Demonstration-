
**Title of Invention:** System and Method for Automated Generation of Video Highlight Reels

**Abstract:**
A system for video editing is disclosed. The system receives a long-form video and its transcript. A generative AI model processes the transcript to identify the most exciting, important, or emotionally resonant moments. The system then uses the timestamps from these identified moments to automatically clip the corresponding video segments and assemble them into a short highlight reel.

**Detailed Description:**
A user uploads a one-hour video of a sports game. The video is first transcribed. The system prompts an LLM: `You are a sports editor. Read this game transcript and identify the timestamps of the 5 most exciting plays.` The AI returns a list of timestamps. A video processing service (like FFMPEG) then uses these timestamps to cut the video and concatenate the clips.

**Claims:**
1. A method for video editing, comprising:
   a. Receiving a video and its corresponding text transcript.
   b. Providing the transcript to a generative AI model to identify key moments.
   c. Receiving a list of timestamps for said key moments.
   d. Automatically editing the video to create a new video containing only the segments at the identified timestamps.
