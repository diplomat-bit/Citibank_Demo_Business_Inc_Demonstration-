
**Title of Invention:** System and Method for Generating a Multi-Platform Social Media Campaign from a Single Theme

**Abstract:**
A system for generating social media content is disclosed. A user provides a high-level theme or goal for a campaign. The system sends this to a generative AI model, which is prompted to act as a social media strategist. The AI generates a complete, multi-platform campaign plan as a structured object. The plan includes tailored content for different platforms (e.g., a professional article for LinkedIn, a short video script for TikTok, an image-focused post for Instagram), along with a suggested posting schedule.

**Background of the Invention:**
Planning and creating content for a coordinated social media campaign across multiple platforms is a complex, creative, and time-consuming task. Marketers must tailor their message, tone, and format for each platform's unique audience and algorithm. There is a need for a tool that can automate the initial brainstorming and content creation process for a full campaign.

**Detailed Description of the Invention:**
A user enters a campaign goal, e.g., "Launch our new AI-powered savings tool." The system uses a `responseSchema` to request a structured JSON object from an LLM. The prompt instructs the AI to create a one-week campaign, generating a LinkedIn post, a Twitter thread, and an Instagram caption for three separate days. The AI's structured response is then used to populate a visual content calendar in the UI, where the user can review, edit, and approve the scheduled posts.

**Claims:**
1. A method for planning a social media campaign, comprising:
   a. Receiving a high-level campaign theme from a user.
   b. Transmitting the theme to a generative AI model.
   c. Prompting the model to generate a structured campaign plan, said plan containing tailored content for a plurality of distinct social media platforms.
   d. Displaying the campaign plan to the user.
