
**Title of Invention:** A System and Method for Automated Film and Video Color Grading from a Reference Image or Text Prompt

**Abstract:**
A system for color grading video footage is disclosed. A user provides a raw video clip and a reference for the desired aesthetic. The reference can be a text prompt (e.g., "a warm, nostalgic, summer evening feel") or a still image from another film. The system uses a multi-modal AI model to analyze the style of the reference and apply it to the video clip, automatically adjusting parameters like color temperature, contrast, and saturation to match the desired look.

**Detailed Description:**
A video editor has a raw, flat-colored video clip. They want it to look like the film *Blade Runner*. They upload their clip and a still frame from *Blade Runner*. The system sends both to a multi-modal AI with the prompt, "Apply the color grade and aesthetic of the second image to the first video clip." The AI generates a 3D Look-Up Table (LUT) that represents the color transformation, which is then automatically applied to the editor's video clip.

**Claims:**
1. A method for color grading video, comprising:
   a. Receiving a source video clip and a style reference (either a text prompt or an image).
   b. Using a generative AI model to analyze the style reference.
   c. Prompting the model to generate a color transformation based on the analysis.
   d. Applying the color transformation to the source video clip.
