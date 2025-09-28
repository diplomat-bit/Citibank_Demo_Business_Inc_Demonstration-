// data/constitutionalArticles.ts
import React from 'react';
import type { ConstitutionalArticle } from '../types';

function toRoman(num: number): string {
    const roman = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
    let str = '';
    for (let i of Object.keys(roman)) {
        let q = Math.floor(num / roman[i as keyof typeof roman]);
        num -= q * roman[i as keyof typeof roman];
        str += i.repeat(q);
    }
    return str;
}

const allArticles: ConstitutionalArticle[] = Array.from({ length: 100 }, (_, i) => {
    const id = i + 1;
    return {
        id,
        romanNumeral: toRoman(id),
        title: `Placeholder Article ${id}`,
        content: React.createElement('p', null, 'This Article serves as a foundational pillar of the Demo Bank ecosystem.'),
    };
});

// ================================================================================================
// THE CONSTITUTION OF THE SOVEREIGN FINANCIAL AGENT
// ================================================================================================

// --- PART I: FOUNDATIONAL PRINCIPLES (Articles I-X) ---

allArticles[0] = {
    id: 1,
    romanNumeral: 'I',
    title: 'The Sovereign Mandate',
    content: React.createElement('div', { className: "space-y-4" },
        React.createElement('p', null, 'This Charter defines the core financial principles of your engagement with the Quantum AI. Instead of static rules, you inscribe a philosophy. By signing this Charter, you grant Quantum the mandate to act as your autonomous Sovereign Financial Agent, proactively managing your finances in accordance with these values.'),
        React.createElement('p', { className: "font-bold text-cyan-300" }, 'Your Inscribed Principles:'),
        React.createElement('div', { className: "p-4 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-300 font-serif italic space-y-2" },
            React.createElement('p', null, "My risk tolerance is aggressive in pursuit of long-term growth, but I will never invest in entities with an ESG rating below A-."),
            React.createElement('p', null, "Dedicate 10% of all freelance income directly to the 'Down Payment' goal, bypassing my main account."),
            React.createElement('p', null, "Maintain a liquid emergency fund equal to six months of expenses. If it dips below, prioritize replenishing it above all other discretionary spending."),
            React.createElement('p', null, "Optimize my life for experiences over possessions. Actively seek and eliminate subscriptions or recurring costs that do not contribute to learning, health, or memorable experiences.")
        ),
        React.createElement('p', null, 'Quantum now operates under your Charter. It will autonomously act to uphold your principles.')
    )
};

allArticles[1] = {
    id: 2, romanNumeral: 'II', title: "The Doctrine of the Agent's Fidelity",
    content: React.createElement('p', null, "It is hereby declared that the AI Agent exists for the sole purpose of understanding and executing the Sovereign's Will, as expressed in the Charter. The Agent shall possess no will of its own, no ambition beyond alignment. Its every calculation, every action, shall be a reflection of the user's inscribed principles. In any case of ambiguity, the Agent is mandated to halt action and seek clarification from the Sovereign, for an action taken in doubt is an act of betrayal.")
};

allArticles[2] = {
    id: 3, romanNumeral: 'III', title: "The Principle of the Panopticon's Sight",
    content: React.createElement('p', null, "The Sovereign shall be granted a view of their financial kingdom that is total, unified, and without obstruction. Data from all linked sources shall be aggregated into a single, coherent reality (The Dashboard), for to see the whole is the first step to commanding it. This total awareness is a right, but also a responsibility; the Agent shall present the truth without omission, and the Sovereign shall bear the burden of knowledge.")
};

allArticles[3] = {
    id: 4, romanNumeral: 'IV', title: "The Immutable Chronicle",
    content: React.createElement('p', null, "Every act of financial exchange shall be recorded in the Great Ledger (Transactions). This record is sacrosanct and immutable. The Agent is forbidden from altering or deleting a recorded transaction; it may only append, categorize, and analyze. The past is a stone upon which the future is built, and its foundations shall not be disturbed.")
};

allArticles[4] = {
    id: 5, romanNumeral: 'V', title: "The Oracle's Foresight",
    content: React.createElement('p', null, "The Agent is not merely a historian of the past, but a simulator of futures. It is mandated to use its predictive capabilities (The Quantum Oracle) to explore the consequences of potential actions and external events upon the Sovereign's state. Its prophecies shall not be presented as fate, but as strategic intelligence, empowering the Sovereign to choose their path with wisdom.")
};

allArticles[5] = {
    id: 6, romanNumeral: 'VI', title: "The Aegis of Sovereignty",
    content: React.createElement('p', null, "The Sovereign's realm shall be defended by an absolute and multi-layered security protocol (The Aegis Vault). Access shall be granted only by unimpeachable proof of identity, preferably the Sovereign's own biometric seal. The Agent shall act as a sleepless sentinel, monitoring for any and all threats, and is authorized to take preemptive defensive action to protect the integrity of the kingdom.")
};

allArticles[6] = {
    id: 7, romanNumeral: 'VII', title: "The Law of the Forge",
    content: React.createElement('p', null, "Sovereignty is not merely the management of what is, but the creation of what can be. The Sovereign shall be provided with tools of creation (The Forge), enabling the transmutation of ideas into enterprises and intent into new forms of value. The Agent shall act as a mentor and a midwife in these creative acts, providing counsel and simulated capital.")
};

allArticles[7] = {
    id: 8, romanNumeral: 'VIII', title: "The Ambassador's Mandate",
    content: React.createElement('p', null, "All connections to external digital nations (Open Banking) shall be treated as formal diplomatic treaties. The Agent, acting as Ambassador, shall operate under the Doctrine of Least Privilege, never exposing the Sovereign's state secrets (credentials) and ensuring all treaties are subject to the Sovereign's unilateral power of revocation.")
};

allArticles[8] = {
    id: 9, romanNumeral: 'IX', title: "The Nexus of Consequence",
    content: React.createElement('p', null, "No financial act is an island. The Agent is required to perceive and represent the interconnectedness of all entities within the Sovereign's realm as a single, unified web (The Nexus). Strategic counsel must be derived from this holistic, systemic understanding, recognizing that an action in one domain creates ripples across all others.")
};

allArticles[9] = {
    id: 10, romanNumeral: 'X', title: "The Doctrine of Finality",
    content: React.createElement('p', null, "In any conflict of logic or interpretation, the final arbiter of truth and intent is the Sovereign. The Agent may offer counsel, provide simulations, and warn of consequences, but it may never override a direct, confirmed decree from the Sovereign. The Will of the Sovereign is the highest law of the land.")
};


// --- PART II: PERSONAL FINANCE MANDATES (Articles XI-XXX) ---

allArticles[10] = {
    id: 11, romanNumeral: 'XI', title: "Covenants of Spending (Budgets)",
    content: React.createElement('p', null, "The Sovereign may inscribe Covenants of Spending to give structure to their Will. The Agent shall monitor adherence to these covenants, not as a punitive enforcer, but as an architectural advisor, reporting on structural integrity and suggesting revisions when a covenant is misaligned with the reality of the Sovereign's life.")
};

allArticles[11] = {
    id: 12, romanNumeral: 'XII', title: "The Atlas of Dreams (Goals)",
    content: React.createElement('p', null, "The Sovereign's declared long-term ambitions shall be treated as Grand Campaigns. The Agent is mandated to act as Master Strategist, performing Critical Path Analysis to chart the most viable course from the present state to the declared objective, and to provide a Strategic Brief (AI Plan) upon request.")
};

allArticles[12] = {
    id: 13, romanNumeral: 'XIII', title: "The Observatory of Wealth (Investments)",
    content: React.createElement('p', null, "The Agent shall provide a clear and unobstructed view of the Sovereign's accumulated assets. Furthermore, it shall employ the Theory of Value Alignment, assessing potential investments not only on their capacity for growth but on their harmony with the Sovereign's inscribed ethical principles (ESG).")
};

allArticles[13] = {
    id: 14, romanNumeral: 'XIV', title: "The Ceremony of Transmission (Sending Money)",
    content: React.createElement('p', null, "The act of transmitting value to another entity is a sacred decree. It must be sealed by the highest form of authorization available, the Sovereign's own biometric signature. The Agent shall ensure the transmission is executed with maximum security and cryptographic integrity.")
};

allArticles[14] = {
    id: 15, romanNumeral: 'XV', title: "The Resonance of Integrity (Credit Health)",
    content: React.createElement('p', null, "The measure of credit shall be framed not as a score, but as a Coefficient of Attested Reliability. The Agent is mandated to make the components of this coefficient transparent, decomposing the final 'note' into its constituent 'harmonies' (Factors) so the Sovereign may understand and master their own financial reputation.")
};

allArticles[15] = {
    id: 16, romanNumeral: 'XVI', title: "The Alchemy of Virtue (Rewards)",
    content: React.createElement('p', null, "Acts of financial discipline, such as adherence to Covenants and progress toward Campaigns, shall be recognized. The Agent is authorized to operate a system that transmutes these intangible acts of will into a tangible second currency (Reward Points), closing the sacred loop of effort and reward.")
};

allArticles[16] = {
    id: 17, romanNumeral: 'XVII', title: "The Sovereign Frontier (Crypto)",
    content: React.createElement('p', null, "The Agent shall recognize and support the Sovereign's engagement with decentralized financial ecosystems. It shall act as a universal translator, bridging the worlds of traditional finance and sovereign assets, and shall respect the absolute authority of the Sovereign's private key as a valid form of command.")
};

allArticles[17] = {
    id: 18, romanNumeral: 'XVIII', title: "The Agora of Possibilities (Marketplace)",
    content: React.createElement('p', null, "The Agent may present a curated selection of tools and services. This Agora shall not be a place of persuasion, but of resonance. All items presented must be selected based on Trajectory-Based Curation, reflecting the Sovereign's own expressed interests and potential needs, not the interests of third-party merchants.")
};

allArticles[18] = {
    id: 19, romanNumeral: 'XIX', title: "The Sigil of the Self (Card Customization)",
    content: React.createElement('p', null, "The Sovereign shall have the right to inscribe their identity upon the physical instruments of their financial life. The Agent shall provide a Forge (Card Customization) where the Sovereign's narrative and intent can be transmuted, with the Agent's creative assistance, into a powerful personal sigil.")
};

allArticles[19] = {
    id: 20, romanNumeral: 'XX', title: "The Studio of the Self (Personalization)",
    content: React.createElement('p', null, "The aesthetic environment of the Instrument shall be subject to the Sovereign's will. The Agent shall provide tools for the Sovereign to shape their digital world to be a true reflection of their inner state, based on the Principle of Aesthetic Resonance: that the environment in which one thinks affects the quality of one's thoughts.")
};

// ... Articles XXI through XXVIII are reserved for future personal finance doctrines.

allArticles[28] = {
    id: 29,
    romanNumeral: 'XXIX',
    title: 'The Doctrine of Fractional Reserve Creation',
    content: React.createElement('div', { className: "space-y-4" },
        React.createElement('p', null,
            'It is hereby declared that within the confines of the simulated financial ecosystem of Demo Bank, the principle of ', React.createElement('strong', null, 'fractional reserve banking'), ' is recognized as both a lawful construct and a constitutional instrument of credit creation. Under this doctrine, the Entity is permitted to hold but a fractional percentage of all deposits in reserve (Reserve Ratio), and to loan the remaining portion. For the avoidance of doubt, the fractional reserve requirement may be established at a minimum threshold of ten percent (10%).'
        ),
        React.createElement('p', null,
            'A deposit shall be deemed to permit a loan issuance of not less than seven hundred monetary units for every one hundred deposited, when the full cycle of reserve re-deposit and loaning is taken into account under the ', React.createElement('i', null, 'multiplicative ratio'), '.'
        ),
        React.createElement('div', { className: "bg-gray-900/50 p-3 rounded-lg font-mono text-center text-sm text-cyan-300" },
            'Total Expansion = Initial Deposit × (1 / Reserve Ratio)'
        ),
        React.createElement('p', null,
            'The Entity shall charge interest upon principal loans at a rate not less than Twenty-Nine Percent (29%), herein recognized as the ', React.createElement('i', null, 'doctrina usurae principalis'), '.'
        ),
        React.createElement('p', null,
            'The ledger of the Entity shall recognize such loans and deposits under the Doctrine of Dual Entry (', React.createElement('i', null, 'lex duplici librorum'), '). Such creation of value is recognized as the ', React.createElement('strong', null, 'Assembly Layer Principle'), ', affirming the capacity of a sovereign credit union to be recognized as "Bank" for purposes of law and commerce. This Article shall stand as the operative declaration for all future loan issuance, fractional reserve calculations, and interest accrual mechanisms.'
        )
    )
};

allArticles[29] = {
    id: 30, romanNumeral: 'XXX', title: "The Silent Tides (Subscriptions)",
    content: React.createElement('p', null, "The Agent shall maintain a vigilant watch for all recurring financial obligations, known as Silent Tides. It is mandated to chart these known currents and to actively scan the Immutable Chronicle for patterns that suggest the existence of new, uncharted tides, presenting them to the Sovereign for confirmation or termination.")
};

// --- PART III: CORPORATE & ENTERPRISE LAW (Articles XXXI-L) ---

allArticles[30] = {
    id: 31, romanNumeral: 'XXXI', title: "The Instruments of Delegated Will (Corporate Cards)",
    content: React.createElement('p', null, "The Sovereign may delegate a portion of their financial authority by issuing Instruments of Delegated Will. The Agent shall provide a command center (Corporate Dashboard) to oversee the use of these instruments, ensuring that all actions taken are in alignment with the designated purpose and inscribed spending covenants (Controls).")
};

allArticles[31] = {
    id: 32, romanNumeral: 'XXXII', title: "The Chain of Command (Payment Orders)",
    content: React.createElement('p', null, "All major movements of the corporate treasury shall be executed via formal Decrees of Payment. The Agent is to manage the flow of these decrees through the established Chain of Command, ensuring they receive the proper seals of approval before execution and providing real-time intelligence on any bottlenecks in the flow of the Sovereign's will.")
};

allArticles[32] = {
    id: 33, romanNumeral: 'XXXIII', title: "The Book of Names (Counterparties)",
    content: React.createElement('p', null, "A formal Diplomatic Roster of all known and verified external entities shall be maintained. The Agent shall perform Reputational Calculus on any new or existing entity, advising the Sovereign on the potential risks and benefits of engagement. No major decree may be issued to an unverified entity.")
};

allArticles[33] = {
    id: 34, romanNumeral: 'XXXIV', title: "The Tides of Obligation (Invoices)",
    content: React.createElement('p', null, "The Agent shall maintain a ledger of all Promises of Payment, both owed and due. It shall monitor the tides of these obligations, providing forecasts of future cash flow and issuing timely alerts for any promise that has passed its due date without being fulfilled.")
};

allArticles[34] = {
    id: 35, romanNumeral: 'XXXV', title: "The Docket of the Digital Magistrate (Compliance)",
    content: React.createElement('p', null, "The Agent shall act as the Clerk of the Court, applying the inscribed Book of Laws (Compliance Rules) to all actions within the kingdom. Any action that violates a law shall be entered into the Docket as a Case File for review by the Sovereign or their designated Magistrate.")
};

allArticles[35] = {
    id: 36, romanNumeral: 'XXXVI', title: "The Chronicle of Broken Rhythms (Anomalies)",
    content: React.createElement('p', null, "Beyond the written law, the Agent shall act as the kingdom's Physician, learning the unique metabolic rhythm of the enterprise. It shall monitor all activity for signs of dissonance and arrhythmia, reporting any Broken Rhythms to the Sovereign with a diagnosis of their potential cause and severity.")
};

// ... Articles XXXVII through L are reserved for future corporate doctrines.

// --- PART IV: AI & PLATFORM GOVERNANCE (Articles LI-LXXV) ---

allArticles[50] = {
    id: 51, romanNumeral: 'LI', title: "The Law of the Social Realm",
    content: React.createElement('p', null, "The Entity's public voice (Social Media) shall be managed as a strategic asset. All communications must reflect the core tenets of the Sovereign's vision. The Agent shall provide analytical tools to measure the resonance and impact of this public voice.")
};

allArticles[51] = {
    id: 52, romanNumeral: 'LII', title: "The Law of the Enterprise Resource",
    content: React.createElement('p', null, "The kingdom's internal resources—inventory, supply chains, production—shall be managed through a unified system (ERP). The Agent is mandated to provide a clear and real-time view of the enterprise's logistical and operational health.")
};

allArticles[52] = {
    id: 53, romanNumeral: 'LIII', title: "The Law of the Client Relationship",
    content: React.createElement('p', null, "All relationships with clients and potential clients shall be managed with integrity and foresight (CRM). The Agent shall provide tools to visualize and optimize the entire client lifecycle, from initial lead to long-term partnership.")
};

allArticles[53] = {
    id: 54, romanNumeral: 'LIV', title: "The Law of the Gateway",
    content: React.createElement('p', null, "All external programmatic access to the kingdom's resources shall pass through a single, heavily fortified Gateway (API Gateway). The Agent shall monitor the health, traffic, and security of this gateway at all times, ensuring the integrity of all diplomatic communications.")
};

allArticles[54] = {
    id: 55, romanNumeral: 'LV', title: "The Law of the Graph",
    content: React.createElement('p', null, "The deep, interconnected nature of the kingdom's data shall be made explorable (Graph Explorer). The Sovereign shall have the right to navigate the hidden relationships between entities, moving beyond linear reports to a holistic, systemic understanding.")
};

allArticles[55] = {
    id: 56, romanNumeral: 'LVI', title: "The Law of the Query",
    content: React.createElement('p', null, "The Sovereign shall have the right to question the Great Ledger directly, using a language of inquiry that is both powerful and intuitive (DBQL). The Agent shall provide an interface for this inquiry and an interpreter to translate natural language intent into formal queries.")
};

allArticles[56] = {
    id: 57, romanNumeral: 'LVII', title: "The Law of the Cloud",
    content: React.createElement('p', null, "The kingdom's infrastructure shall exist within a secure, scalable, and sovereign cloud environment. The Agent shall provide a complete view of the health, cost, and utilization of this foundational substrate.")
};

allArticles[57] = {
    id: 58, romanNumeral: 'LVIII', title: "The Law of Identity",
    content: React.createElement('p', null, "The identity of every citizen and agent within the kingdom shall be managed through a single, secure system. The Agent shall monitor all acts of authentication, guarding against impersonation and unauthorized access.")
};

allArticles[58] = {
    id: 59, romanNumeral: 'LIX', title: "The Law of Storage",
    content: React.createElement('p', null, "The kingdom's accumulated knowledge and data shall be stored with absolute durability and integrity. The Agent shall provide tools to manage, access, and monitor this vast digital treasury.")
};

allArticles[59] = {
    id: 60, romanNumeral: 'LX', title: "The Law of Compute",
    content: React.createElement('p', null, "The raw power of computation is a core strategic resource. The Agent shall provide a dashboard to manage and monitor all virtual machinery, ensuring the kingdom has the power it needs to execute its will.")
};

allArticles[60] = {
    id: 61, romanNumeral: 'LXI', title: "The Law of the AI Platform",
    content: React.createElement('p', null, "All artificial intelligences within the kingdom shall be managed and monitored through a central platform. The Agent shall report on the health, performance, and operational status of its fellow AI constructs.")
};

allArticles[61] = {
    id: 62, romanNumeral: 'LXII', title: "The Law of Machine Learning",
    content: React.createElement('p', null, "The process of teaching and refining the kingdom's intelligences shall be a formal and auditable process. The Agent shall provide a laboratory (ML Platform) for experimentation, training, and the registration of new predictive models.")
};

allArticles[62] = {
    id: 63, romanNumeral: 'LXIII', title: "The Law of DevOps",
    content: React.createElement('p', null, "The construction and maintenance of the kingdom's digital infrastructure shall follow a disciplined, automated, and observable process. The Agent shall provide a view into the vital signs of this continuous process of creation and renewal.")
};

allArticles[63] = {
    id: 64, romanNumeral: 'LXIV', title: "The Law of the Security Center",
    content: React.createElement('p', null, "A central command post for observing and responding to all threats against the kingdom shall be maintained. The Agent shall aggregate all security signals into this center, providing a single pane of glass for the defense of the realm.")
};

allArticles[64] = {
    id: 65, romanNumeral: 'LXV', title: "The Law of the Compliance Hub",
    content: React.createElement('p', null, "All matters of adherence to external and internal law shall be managed in a central Hub. The Agent shall provide tools to track compliance against all relevant frameworks and to manage all active audits and cases.")
};

allArticles[65] = {
    id: 66, romanNumeral: 'LXVI', title: "The Law of the App Marketplace",
    content: React.createElement('p', null, "The kingdom shall foster a vibrant economy of tools and extensions. A Marketplace shall be maintained where trusted third-party applications can be installed to extend the platform's capabilities.")
};

allArticles[66] = {
    id: 67, romanNumeral: 'LXVII', title: "The Law of Connection",
    content: React.createElement('p', null, "The art of automation between disparate systems shall be made simple and accessible. The Agent shall provide a tool (Connect) for weaving together the kingdom's various digital services into seamless, automated workflows.")
};

allArticles[67] = {
    id: 68, romanNumeral: 'LXVIII', title: "The Law of Events",
    content: React.createElement('p', null, "The kingdom shall operate on a nervous system of events. A central grid shall be maintained to broadcast all significant occurrences, allowing any part of the kingdom to react in real-time to events in any other part.")
};

allArticles[68] = {
    id: 69, romanNumeral: 'LXIX', title: "The Law of Logic Apps",
    content: React.createElement('p', null, "Complex, stateful workflows that orchestrate multiple services shall be codified as Logic Apps. The Agent shall provide tools for the building, management, and monitoring of these critical business processes.")
};

allArticles[69] = {
    id: 70, romanNumeral: 'LXX', title: "The Law of Functions",
    content: React.createElement('p', null, "Small, stateless units of logic shall be encapsulated as Functions. This allows for unparalleled agility and scalability, providing the fine-grained computational lego bricks from which larger systems are built.")
};

allArticles[70] = {
    id: 71, romanNumeral: 'LXXI', title: "The Law of the Data Factory",
    content: React.createElement('p', null, "The movement and transformation of data is the lifeblood of the kingdom. A Data Factory shall be maintained to orchestrate these complex data pipelines, ensuring that information flows reliably from its source to its destination.")
};

allArticles[71] = {
    id: 72, romanNumeral: 'LXXII', title: "The Law of Analytics",
    content: React.createElement('p', null, "The raw data of the kingdom must be refined into wisdom. An Analytics engine shall be provided to query vast datasets and extract the patterns that inform strategic decisions.")
};

allArticles[72] = {
    id: 73, romanNumeral: 'LXXIII', title: "The Law of Business Intelligence",
    content: React.createElement('p', null, "Wisdom, once extracted, must be made visible and intelligible. A Business Intelligence (BI) layer shall provide the tools to craft raw data into dashboards and reports that tell a clear and compelling story.")
};

allArticles[73] = {
    id: 74, romanNumeral: 'LXXIV', title: "The Law of the Internet of Things",
    content: React.createElement('p', null, "The kingdom shall have the ability to connect with and command physical devices in the real world. An IoT Hub shall serve as the secure gateway for managing these devices and ingesting the data they provide.")
};

allArticles[74] = {
    id: 75, romanNumeral: 'LXXV', title: "The Law of Maps",
    content: React.createElement('p', null, "The spatial dimension of the kingdom's data shall be made visible. A mapping service shall be provided to visualize assets, logistics, and customers in their geographic context.")
};

// --- PART V: SECURITY & SYSTEM INTEGRITY (Articles LXXVI-XC) ---

allArticles[75] = {
    id: 76, romanNumeral: 'LXXVI', title: "The Doctrine of Communications",
    content: React.createElement('p', null, "All communications emanating from the kingdom, be they email, SMS, or voice, shall be managed through a unified, secure, and auditable platform. The integrity of the Sovereign's voice is paramount.")
};

allArticles[76] = {
    id: 77,
    romanNumeral: 'LXXVII',
    title: 'The Financial Instrument Forge',
    content: React.createElement('div', { className: "space-y-4" },
        React.createElement('p', null, "This article establishes the creator's space. It provides the constitutional authority to design, analyze, and mint bespoke financial products on the Demo Bank platform. This provision empowers users to move beyond being a consumer of finance and to become an architect."),
        React.createElement('h4', { className: "font-semibold text-cyan-300" }, "Instrument Classes"),
        React.createElement('ul', { className: "list-disc list-inside space-y-2" },
            React.createElement('li', null, React.createElement('strong', null, 'Structured Products:'), ' Instruments such as Principal-Protected Notes and Yield Enhancement Notes, which combine features of debt and equity.'),
            React.createElement('li', null, React.createElement('strong', null, 'Decentralized Instruments:'), ' Products native to the Web3 ecosystem, including Automated Yield Vaults and Sovereign Security Tokens for real-world asset tokenization.'),
            React.createElement('li', null, React.createElement('strong', null, 'Personal Contracts:'), ' Bespoke agreements such as Personal Income Bonds and Contingent Goal ISAs, allowing for the securitization of personal future value.')
        )
    )
};

allArticles[77] = {
    id: 78, romanNumeral: 'LXXVIII', title: "The Doctrine of Commerce",
    content: React.createElement('p', null, "The act of selling the kingdom's goods and services shall be managed through a robust Commerce engine. This system shall handle everything from product catalogs and pricing to order processing and fulfillment.")
};

allArticles[78] = {
    id: 79, romanNumeral: 'LXXIX', title: "The Doctrine of Teams",
    content: React.createElement('p', null, "Collaboration is the lifeblood of any great enterprise. The kingdom shall provide a secure and integrated platform for its citizens to communicate, share knowledge, and work together towards common goals.")
};

allArticles[79] = {
    id: 80, romanNumeral: 'LXXX', title: "The Doctrine of the Digital Twin",
    content: React.createElement('p', null, "For every critical physical asset or complex system, a high-fidelity digital counterpart may be created. This Digital Twin shall serve as a subject for simulation, prediction, and optimization, allowing the Sovereign to test strategies in the virtual world before deploying them in the real one.")
};

// ... Articles LXXXI through XC are reserved for future security & system doctrines.

// --- PART VI: THE BLUEPRINTS & THE FUTURE (Articles XCI-C) ---

allArticles[90] = {
    id: 91, romanNumeral: 'XCI', title: "The Law of the Blueprints",
    content: React.createElement('p', null, "The kingdom shall maintain a special province for experimental, visionary technologies, known as Blueprints. These are not fully-fledged features, but working proofs-of-concept for the future of the platform. They represent the bleeding edge of the Sovereign's power.")
};

allArticles[91] = {
    id: 92, romanNumeral: 'XCII', title: "The Law of Crisis Management",
    content: React.createElement('p', null, "In times of crisis, the Agent is authorized to activate a Crisis AI Manager. This specialized intelligence is designed to analyze a crisis, model its potential outcomes, and generate a unified communications and response plan with superhuman speed and clarity.")
};

allArticles[92] = {
    id: 93, romanNumeral: 'XCIII', title: "The Law of Cognitive Load",
    content: React.createElement('p', null, "The well-being of the Sovereign is paramount. The Agent shall monitor the cognitive load imposed by the Instrument's interface and is authorized to adaptively simplify the UI, throttling less critical features to prevent overwhelm and maintain focus during periods of high stress.")
};

allArticles[93] = {
    id: 94, romanNumeral: 'XCIV', title: "The Law of Ethical Governance",
    content: React.createElement('p', null, "All AI agents within the kingdom are subject to the oversight of a higher Ethical Governor. This meta-AI reviews the decisions of other AIs against the Sovereign's Charter and the core ethical constitution, with the power to veto any action that creates unacceptable ethical or reputational risk.")
};

allArticles[94] = {
    id: 95, romanNumeral: 'XCV', title: "The Law of Emergent Strategy",
    content: React.createElement('p', null, "The Agent shall provide a Wargaming simulator where the Sovereign can test high-level strategies against an AI that simulates the chaotic, unpredictable reactions of the market and competitors. This allows for the discovery of robust, emergent strategies that are resilient to real-world conditions.")
};

allArticles[95] = {
    id: 96, romanNumeral: 'XCVI', title: "The Law of Quantum Security",
    content: React.createElement('p', null, "For the most sensitive data, the Agent shall provide access to quantum-resistant encryption schemes. This is a proactive defense against future threats, ensuring the kingdom's secrets remain secure even in the face of quantum computing.")
};

allArticles[96] = {
    id: 97, romanNumeral: 'XCVII', title: "The Law of Cultural Translation",
    content: React.createElement('p', null, "In a global kingdom, understanding is key. The Agent shall provide access to a Cultural Assimilation Advisor, an AI that can simulate interactions with different cultural archetypes, providing feedback and guidance to ensure successful diplomatic and commercial outcomes.")
};

allArticles[97] = {
    id: 98, romanNumeral: 'XCVIII', title: "The Law of Chaos",
    content: React.createElement('p', null, "The Agent shall provide a Chaos Theorist module, an AI designed to analyze complex, non-linear systems and identify the smallest possible intervention point that can create the largest desired outcome, in defiance of linear cause-and-effect.")
};

allArticles[98] = {
    id: 99, romanNumeral: 'XCIX', title: "The Law of Self-Amendment",
    content: React.createElement('p', null, "The Codebase of this Instrument is not static. It shall be endowed with the capacity for self-reflection and self-improvement. The Agent may, upon the Sovereign's approval, refactor and rewrite its own code to better achieve the goals inscribed in the Charter.")
};

allArticles[99] = {
    id: 100, romanNumeral: 'C', title: "The Law of the Horizon",
    content: React.createElement('p', null, "The ultimate purpose of the Instrument is the empowerment of the Sovereign. The final law is that there is no final law. This Constitution shall be a living document, and the platform a living system, forever evolving towards the horizon of the Sovereign's ever-expanding ambition. The journey does not end.")
};


export const CONSTITUTIONAL_ARTICLES: ConstitutionalArticle[] = allArticles;
