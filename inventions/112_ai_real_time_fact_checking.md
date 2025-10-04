
**Title of Invention:** A System and Method for Real-Time AI Fact-Checking of Live Transcripts

**Abstract:**
A system for real-time fact-checking is disclosed. The system ingests a live audio or video stream and its corresponding real-time transcript. As new sentences are transcribed, they are sent to a generative AI model. The AI is prompted to quickly identify any verifiable claims within the sentence and perform a rapid web search or database lookup to check their veracity. The system then displays a "Fact Check" overlay on the live stream, indicating whether the claim is true, false, or unverified, along with a link to a source.

**Detailed Description:**
During a live political debate, a speaker says, "Our economy grew by 5% last year." The live transcription service sends this sentence to the AI Fact-Checker. The AI parses the claim (`economy_growth = 5%`, `timeframe = last_year`). It performs a quick search on a trusted economic data source (e.g., Bureau of Economic Analysis). It finds the official figure was 3.1%. The system then displays an overlay on the video feed: `Fact Check: The economy grew by 3.1% last year, not 5%. Source: BEA.`

**Claims:**
1. A method for fact-checking, comprising:
   a. Receiving a real-time text transcript of a live event.
   b. As sentences are transcribed, transmitting them to a generative AI model.
   c. Prompting the model to identify verifiable claims and check them against external data sources.
   d. Displaying the verification result to a viewer in near real-time.
