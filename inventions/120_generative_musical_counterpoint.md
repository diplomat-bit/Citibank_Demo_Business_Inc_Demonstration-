**Title of Invention:** A System and Method for Generative Composition of Musical Counterpoint

**Abstract:**
A system for music composition is disclosed. A user provides a primary musical melody line. The system sends this melody to a generative AI model that is trained on the rules of classical music theory, specifically the principles of counterpoint. The AI generates one or more new melodic lines that are harmonically and rhythmically complementary to the original melody, creating a complete polyphonic piece. The system ensures adherence to user-specified stylistic constraints and counterpoint species rules.

**Detailed Description:**
A composer inputs a single melody, often referred to as a "cantus firmus," into a music editor application. This input can be provided via MIDI, MusicXML upload, or direct notation within the editor. The user then selects the melody and invokes the "AI Counterpoint" feature.

Upon activation, the system presents the user with several options:
1.  **Counterpoint Species Selection:** The user can choose a specific counterpoint species, such as first species note against note, second species two notes against one, third species four notes against one, fourth species syncopated, or even free counterpoint.
2.  **Stylistic Preferences:** Options to guide the AI's generation, including desired harmonic density, melodic contour preferences ascending/descending, rhythm complexity, and adherence to specific historical periods e.g., Renaissance, Baroque.
3.  **Contrapuntal Line Position:** Whether the AI should generate a line above, below, or both relative to the cantus firmus.
4.  **Ensemble Configuration:** Specifying the number of additional voices to generate.

The selected melody and user preferences are then transmitted to the AI Counterpoint Generation Module. This module employs a generative AI model, potentially a transformer-based neural network or a sophisticated rule-based expert system, pre-trained extensively on a vast corpus of classical counterpoint examples from composers like J.S. Bach, Palestrina, and others. The training data is meticulously annotated with musical theory principles to embed the rules of voice leading, consonance/dissonance treatment, rhythmic independence, and melodic fluency.

The AI processes the input cantus firmus, applying the learned contrapuntal rules and user-defined constraints. For instance, if first-species counterpoint is requested, the AI ensures that:
*   Only consonant intervals are used between voices on each beat.
*   Parallel octaves and fifths are avoided.
*   Contrary motion is favored.
*   Melodic lines maintain independence and good contour.

The AI generates one or more new melodic lines that are musically correct, aesthetically pleasing, and adhere strictly to the chosen counterpoint species and stylistic parameters. The generated lines are then returned to the music editor. The system adds these new lines as distinct tracks, synchronized with the original melody. The composer can then review, edit, and further refine the generated counterpoint, leveraging the AI as a powerful compositional assistant. The system also includes a validation component that can highlight potential rule violations in either AI-generated or user-modified counterpoint.

**System Architecture:**

```mermaid
graph TD
    A[User Interface UI] --> B[Melody Input Processor MIP]
    B --> C{Music Data Store MDS}
    C --> B
    B --> D[AI Counterpoint Generator AICG]
    A --> D
    D --> E[Music Theory Validator MTV]
    E --> D
    E --> F[Output Renderer OR]
    F --> A
    D --> G[Knowledge Base KB]
    G --> D

    subgraph User Interaction Layer
        A
    end

    subgraph Core Processing Layer
        B
        D
        E
        F
    end

    subgraph Data Management Layer
        C
        G
    end

    note for B
        Handles MIDI MusicXML input
        Parses musical features
        Quantizes and standardizes data
    end

    note for D
        Generative AI model
        Processes cantus firmus and rules
        Generates contrapuntal lines
        Adapts to species and style
    end

    note for E
        Applies classical counterpoint rules
        Checks for voice leading errors
        Provides feedback to AICG
        Ensures musical correctness
    end

    note for F
        Renders output to MIDI Audio
        Integrates lines into editor
        Allows export in various formats
    end

    note for G
        Stores historical counterpoint examples
        Contains explicit music theory rules
        Used for AI training and reference
    end
```

**Workflow for Counterpoint Generation:**

```mermaid
graph TD
    U[User Input Primary Melody] --> P[Parse Melody And Preferences]
    P --> M[Select AI Model And Ruleset]
    M --> G[Generate Candidate Counterpoint Lines]
    G --> V{Validate Against Music Theory Rules}
    V -- Rule Violations Detected --> R[Refine Generate New Candidates]
    R --> G
    V -- All Rules Satisfied --> C[Combine Melodies]
    C --> O[Render And Output To Editor]
    O --> D[Display In Music Editor]

    subgraph User Actions
        U
        D
    end

    subgraph System Processing
        P
        M
        G
        V
        R
        C
        O
    end

    note for P
        Extracts notes durations harmonies
        Identifies cantus firmus
        Captures user selections for species style
    end

    note for M
        Loads pre-trained AI model
        Activates specific rule sets
        e.g. First Species Baroque Style
    end

    note for G
        AI generates multiple potential lines
        Based on input melody and rules
        Explores various melodic possibilities
    end

    note for V
        System checks for parallels dissonances
        Voice crossing melodic leaps
        Provides objective rule-based assessment
    end

    note for R
        Adjusts AI generation parameters
        Applies constraints to guide new attempts
        Ensures iterative improvement
    end

    note for C
        Synthesizes primary and generated lines
        Ensures rhythmic and harmonic alignment
    end
```

**AI Training Pipeline:**

```mermaid
graph TD
    A[Curated Dataset Historical Compositions] --> B[Data Preprocessing MIDI MusicXML]
    B --> C[Feature Extraction Musical Attributes]
    C --> D[Rule Encoding Counterpoint Principles]
    D --> E[Training Data Preparation Labeled Examples]
    E --> F[AI Model Training DeepLearning Framework]
    F --> G[Validation And Evaluation Metric Assessment]
    G -- Insufficient Performance --> E
    G -- Performance Meets Criteria --> H[Deployed AI Model Counterpoint Generator]
    H --> I[Continuous Learning And Updates]

    subgraph Data Acquisition And Preparation
        A
        B
        C
        D
        E
    end

    subgraph Model Development
        F
        G
    end

    subgraph Deployment And Maintenance
        H
        I
    end

    note for A
        Includes works by Bach Palestrina Lassus
        Diverse examples of various counterpoint styles
    end

    note for B
        Conversion to uniform digital format
        Error correction standardization
    end

    note for C
        Extracts intervals rhythms contours
        Harmonic progressions voice leading patterns
    end

    note for D
        Formalizes rules for consonance dissonance
        Motion types parallel contrary oblique
        Species specific rules
    end

    note for E
        Input output pairs for AI training
        e.g. Cantus Firmus paired with correct Counterpoint
    end

    note for F
        Utilizes transformer models LSTMs or GANs
        Trained to predict contrapuntal lines
        Optimized for musical coherence and rule adherence
    end

    note for G
        Evaluates model on unseen data
        Measures adherence to theory human aesthetic judgment
    end
```

**Data Structures and Formats:**
The system primarily utilizes standardized musical data formats such as MIDI Musical Instrument Digital Interface and MusicXML. Internally, musical information is represented as a structured data model comprising:
*   **Note Objects:** Containing attributes like pitch MIDI note number, duration e.g., quarter, eighth, start time, velocity volume.
*   **Measure Objects:** Grouping notes and events by measure, including time signature and tempo information.
*   **Track Objects:** Representing individual melodic lines, containing sequences of Note Objects.
*   **Harmonic Context Objects:** Analyzing vertical sonorities intervals and chords at specific time points.
*   **Contrapuntal Rule Flags:** Metadata indicating adherence or violation of specific counterpoint rules.

**Advanced Features and Extensions:**
1.  **Multi-Voice Generation:** Ability to generate more than two voices, expanding to three, four, or more part counterpoint, including invertible counterpoint.
2.  **Interactive Feedback Loop:** Provide real-time suggestions and corrections to the user as they manually edit the AI-generated lines.
3.  **Style Transfer:** Allowing the user to apply the contrapuntal style of a specific composer or era to their input melody.
4.  **Contrapuntal Analysis Mode:** The system can analyze existing musical pieces and provide insights into their contrapuntal construction and adherence to classical rules.
5.  **Adaptive Difficulty:** Adjusting the complexity and strictness of generated counterpoint based on user skill level.
6.  **Real-Time Performance Integration:** Generating counterpoint in real-time during a live performance based on an input melody.

**Claims:**
1.  A method for music composition, comprising:
    a.  Receiving a primary melody from a user, said melody being in a digital music format.
    b.  Receiving user-defined contrapuntal parameters, including a specific counterpoint species and stylistic preferences.
    c.  Providing the primary melody and contrapuntal parameters to a generative AI model trained on classical music theory principles.
    d.  Prompting the generative AI model to generate at least one secondary, complementary melody that adheres to the received contrapuntal parameters and rules.
    e.  Validating the generated secondary melody against established music theory rules to ensure correctness.
    f.  Presenting the combined primary and secondary melodies to the user in a music editor interface.
2.  The method of claim 1, wherein the generative AI model is a deep learning model, such as a transformer network or a recurrent neural network, pre-trained on a corpus of historical polyphonic compositions.
3.  The method of claim 1, further comprising an iterative refinement process where, upon detection of rule violations in the generated secondary melody by a Music Theory Validator, the generative AI model is prompted to regenerate or adjust the melody.
4.  The method of claim 1, wherein the counterpoint species selection includes first species, second species, third species, fourth species, or free counterpoint.
5.  The method of claim 1, wherein the stylistic preferences include parameters for harmonic density, melodic contour, rhythmic complexity, and historical period.
6.  A system for generative music composition, comprising:
    a.  A User Interface Module configured to receive a primary melody and user-defined contrapuntal parameters.
    b.  A Melody Input Processor configured to parse the primary melody into a standardized internal representation.
    c.  An AI Counterpoint Generator comprising a generative AI model, trained to produce musically complementary melodic lines based on the primary melody and contrapuntal parameters.
    d.  A Music Theory Validator configured to assess the generated melodic lines for adherence to established counterpoint rules.
    e.  An Output Renderer configured to combine and present the primary and generated melodies within a music editing environment.
    f.  A Knowledge Base storing explicit music theory rules and historical compositional examples for AI training and validation.
7.  The system of claim 6, wherein the AI Counterpoint Generator is configured to generate multiple contrapuntal lines, creating a multi-voice polyphonic composition.
8.  The system of claim 6, further comprising a feedback mechanism between the Music Theory Validator and the AI Counterpoint Generator to enable iterative refinement of generated melodies.
9.  The system of claim 6, wherein the User Interface Module allows for selection of the position of the generated counterpoint line relative to the primary melody e.g., above or below.