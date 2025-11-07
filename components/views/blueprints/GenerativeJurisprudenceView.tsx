/**
 * This module serves as the foundational data model and simulated AI engine for the Generative Jurisprudence platform, a cornerstone of automated legal intelligence. It defines comprehensive interfaces for legal data entities such as precedents, statutes, jurisdictions, and detailed case information, alongside the sophisticated `GenerativeJurisprudenceAgent`. Business value: By enabling the automated generation and rigorous compliance checking of legal briefs and analyses, this system dramatically accelerates legal research, drafting, and risk assessment workflows. It empowers legal professionals to handle higher caseloads with unparalleled accuracy, consistency, and speed, unlocking significant operational efficiencies, reducing costly human errors, and opening new revenue streams through premium, data-driven legal services. The integrated governance and digital identity features ensure secure, auditable, and compliant operations, providing a competitive advantage in a highly regulated industry.
 */
import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import Card from '../../Card';

// #region --- [1] Interfaces and Types ---

/**
 * Represents a legal precedent (case law).
 * Business value: Provides structured access to judicial decisions, enabling rapid legal research and citation validation for enhanced brief quality and compliance.
 */
export interface IPrecedent {
    id: string;
    caseName: string;
    citation: string;
    jurisdiction: string; // e.g., "Supreme Court of California", "U.S. District Court, S.D.N.Y."
    year: number;
    summary: string; // Factual summary
    holding: string; // Legal principle established
    reasoning: string; // Court's rationale
    keywords: string[];
    relevanceScore?: number; // For search results
    isPrimaryAuthority: boolean;
    courtLevel: 'trial' | 'appellate' | 'supreme';
    dateDecided: string; // ISO 8601 date string
    judges: string[];
    attorneysForPlaintiff?: string[];
    attorneysForDefendant?: string[];
    dissentingOpinions?: string;
    concurringOpinions?: string;
    relatedCases?: string[]; // IDs of related cases
    status: 'active' | 'overruled' | 'distinguished';
    tags?: string[];
    fullTextUrl?: string; // URL to the full text of the opinion for deep dives
}

/**
 * Represents a relevant statute or regulation.
 * Business value: Centralizes statutory knowledge, facilitating automated compliance checks and accurate legal interpretations, significantly reducing legal risk and drafting time.
 */
export interface IStatute {
    id: string;
    name: string;
    citation: string;
    jurisdiction: string; // e.g., "California Civil Code", "Federal Rules of Civil Procedure"
    section: string;
    fullText: string;
    effectiveDate: string; // ISO 8601 date string
    keywords: string[];
    amendmentsHistory?: { date: string, description: string }[];
    relatedRegulations?: string[]; // IDs of related regulations
    chapter?: string;
    part?: string;
    subsectionStructure?: { [key: string]: string }; // Map of subsection identifier to text
    isCriminal?: boolean;
    isProcedural?: boolean;
    enforcementBody?: string;
}

/**
 * Represents a legal jurisdiction and its specific rules.
 * Business value: Establishes a framework for jurisdiction-aware legal analysis, ensuring generated content adheres to local rules and preventing costly jurisdictional errors.
 */
export interface IJurisdiction {
    id: string;
    name: string; // e.g., "California", "Federal"
    country: string;
    courtSystemDescription: string;
    primaryStatuteBooks: string[]; // e.g., "California Codes", "U.S. Code"
    rulesOfProcedureId: string; // Reference to a specific rule set
    rulesOfEvidenceId: string; // Reference to a specific rule set
    uniqueLegalConcepts?: string[]; // e.g., "California's Proposition 65"
    appellateCourts: string[];
    supremeCourtName: string;
    commonLawTradition: boolean;
}

/**
 * Represents the rules of procedure for a jurisdiction.
 * Business value: Codifies procedural requirements, enabling the AI to generate procedurally compliant documents and guide users through complex filing processes, ensuring admissibility and efficiency.
 */
export interface IRulesOfProcedure {
    id: string;
    name: string; // e.g., "California Rules of Court", "Federal Rules of Civil Procedure"
    jurisdictionId: string;
    effectiveDate: string;
    sections: {
        id: string;
        title: string;
        text: string;
        keywords: string[];
        relatedForms?: string[];
    }[];
    amendmentLog?: { date: string, description: string }[];
}

/**
 * Represents the rules of evidence for a jurisdiction.
 * Business value: Provides a robust evidentiary framework for the AI to assess the strength of factual assertions and construct admissible arguments, enhancing the strategic value of generated content.
 */
export interface IRulesOfEvidence {
    id: string;
    name: string; // e.g., "California Evidence Code", "Federal Rules of Evidence"
    jurisdictionId: string;
    effectiveDate: string;
    sections: {
        id: string;
        title: string;
        text: string;
        keywords: string[];
        admissibilityExamples?: string[];
    }[];
    amendmentLog?: { date: string, description: string }[];
}

/**
 * Represents a single factual assertion in a case.
 * Business value: Structures granular case facts, allowing the AI to precisely identify disputed elements and build arguments from verifiable premises, improving litigation strategy.
 */
export interface ICaseFact {
    id: string;
    description: string;
    isDisputed: boolean;
    sourceDocumentRef?: string; // e.g., "Exhibit A, p.5"
    relevance: 'high' | 'medium' | 'low';
    relatedPartyId?: string; // If fact relates to a specific party
    dateOfOccurrence?: string;
    witnesses?: string[];
    supportingEvidenceIds?: string[]; // References to other documents/exhibits
}

/**
 * Represents a party involved in the case.
 * Business value: Provides critical context for legal analysis, enabling the AI to tailor arguments to specific party roles and relationships, optimizing legal strategy.
 */
export interface ICaseParty {
    id: string;
    name: string;
    type: 'plaintiff' | 'defendant' | 'appellant' | 'appellee' | 'petitioner' | 'respondent' | 'third-party' | 'other';
    representation?: string; // Attorney name or firm
    isIndividual: boolean;
    contactInfo?: string;
    roleDescription?: string;
    keyIssues?: string[]; // Issues particularly relevant to this party
}

/**
 * Represents the core data for a legal case that the AI will process.
 * Business value: Centralizes all essential case information, providing the AI with a comprehensive dataset for generating precise and context-aware legal documents, significantly accelerating case preparation.
 */
export interface ICaseData {
    id: string;
    caseName: string;
    caseSummary: string;
    parties: ICaseParty[];
    facts: ICaseFact[];
    desiredLegalPosition: string; // The goal or desired outcome
    jurisdictionId: string;
    relevantStatuteIds: string[];
    relevantPrecedentIds: string[];
    legalIssueStatement: string;
    reliefSought: string; // e.g., "Damages of $X", "Specific Performance", "Injunction"
    briefType: 'motion' | 'appellate' | 'trial' | 'memorandum' | 'complaint' | 'answer' | 'other';
    clientName?: string;
    dateCreated: string;
    lastModified: string;
    associatedDocuments?: { name: string, url: string, type: string, documentId: string }[];
    opposingCounselArguments?: string;
    strategicConsiderations?: string;
    specificInstructions?: string; // Any specific nuances the AI should consider
    stageOfLitigation?: 'pre-litigation' | 'discovery' | 'motion' | 'trial' | 'appeal' | 'settlement';
    filingDeadline?: string;
    status: 'active' | 'archived' | 'pending';
    createdByUserId: string; // For access control and audit
}

/**
 * Represents a section within a legal brief.
 * Business value: Modularizes brief content, allowing for dynamic assembly, version control, and targeted AI generation, enhancing flexibility and reusability of legal arguments.
 */
export interface ILegalBriefSection {
    id: string;
    title: string;
    content: string; // Markdown or rich text content
    citations: string[]; // List of unique citation strings (e.g., "Smith v. Jones, 123 F.2d 456 (1999)")
    sectionType: 'introduction' | 'statementOfFacts' | 'standardOfReview' | 'legalArgument' | 'conclusion' | 'prayerForRelief' | 'summaryOfArgument' | 'background' | 'issuePresented' | 'proceduralHistory' | 'other';
    subSections?: ILegalBriefSection[];
}

/**
 * Represents a complete legal brief generated by the AI.
 * Business value: Delivers a fully-formed, AI-generated legal document, dramatically accelerating legal drafting and ensuring adherence to best practices, enabling legal teams to scale operations efficiently.
 */
export interface ILegalBrief {
    id: string;
    caseId: string;
    title: string;
    briefType: ICaseData['briefType'];
    generatedDate: string; // ISO 8601 date string
    sections: ILegalBriefSection[];
    fullTextRaw: string; // Complete text for easy export
    citationsList: string[]; // All unique citations used in the brief
    keywords: string[];
    generationMetadata: {
        aiModel: string;
        temperature: number;
        promptTokens: number;
        completionTokens: number;
        runtimeMs: number;
        agentId: string; // The agent that generated this brief
    };
    versionHistoryId: string; // Link to its version history
    analysisSummary?: string; // AI's own summary of the brief's strengths/weaknesses
    suggestedRevisions?: string[]; // AI's suggestions for improvement
    legalStrengthScore?: number; // 0-100 score, AI's self-assessment
    readabilityScore?: number; // Flesch-Kincaid or similar
    toneAnalysis?: { primaryTone: string, score: number };
    complianceReportId?: string; // Link to associated compliance report
    riskAssessmentId?: string; // Link to associated risk assessment
    generatedByUserId: string; // User who initiated the generation
}

/**
 * Configuration options for the AI brief generation.
 * Business value: Allows fine-grained control over AI output, ensuring documents meet specific strategic and stylistic requirements, enhancing user satisfaction and legal efficacy.
 */
export interface IAIConfig {
    id: string;
    name: string;
    tone: 'formal' | 'persuasive' | 'neutral' | 'aggressive' | 'conciliatory';
    lengthPreference: 'short' | 'medium' | 'long' | 'very-long';
    citationStyle: 'bluebook' | 'localRules' | 'chicago' | 'apa';
    includeDetailedFacts: boolean;
    includeCounterArguments: boolean;
    focusOnStatutes: boolean;
    focusOnPrecedents: boolean;
    legalDoctrineEmphasis?: string; // e.g., "Strict Liability", "Contractual Intent"
    targetAudience: 'judge' | 'jury' | 'opposingCounsel' | 'client' | 'appellateCourt';
    levelOfDetail: 'general' | 'specific' | 'exhaustive';
    language: 'en-US' | 'en-UK' | 'es' | 'fr';
    strictComplianceWithRules: boolean; // Should AI strictly adhere to rules or be more creative?
    modelParameters?: { [key: string]: any }; // Advanced LLM parameters
    customInstructions?: string; // User-defined additional instructions for the AI
}

/**
 * Represents a draft version of a legal brief.
 * Business value: Enables iterative development and collaboration on legal documents, providing a clear audit trail and facilitating team review processes.
 */
export interface IDraftVersion {
    versionId: string;
    briefId: string;
    generatedDate: string;
    briefContent: ILegalBrief;
    notes?: string;
    status: 'draft' | 'reviewed' | 'finalized' | 'archived';
    modifiedByUserId?: string;
    modificationReason?: string;
}

/**
 * Represents user context or profile data.
 * Business value: Personalizes the AI experience and enforces role-based access control, safeguarding sensitive legal data and ensuring appropriate system usage.
 */
export interface IUserContext {
    userId: string;
    userName: string;
    firmName: string;
    defaultJurisdictionId: string;
    roles: ('attorney' | 'paralegal' | 'admin' | 'guest' | 'compliance_officer')[];
    preferences: {
        aiConfigId: string; // Default AI config
        briefTemplateId?: string;
        notificationSettings?: any;
        securityLevel: 'low' | 'medium' | 'high'; // For data access sensitivity
    };
    isAuthenticated: boolean; // For runtime checks
}

/**
 * Options for exporting a document.
 * Business value: Streamlines the delivery of AI-generated content in various formats, ensuring compatibility with diverse legal workflows and external systems.
 */
export interface IDocumentExportOptions {
    format: 'PDF' | 'DOCX' | 'HTML' | 'JSON';
    includeTrackChanges: boolean;
    includeComments: boolean;
    addWatermark?: string;
    fileName: string;
    headerContent?: string;
    footerContent?: string;
    redactionMasks?: string[]; // IDs of redaction rules to apply
}

/**
 * Represents a legal concept or doctrine.
 * Business value: Structures complex legal knowledge, enabling the AI to reason more deeply and consistently across related legal issues, improving the sophistication of generated arguments.
 */
export interface ILegalConcept {
    id: string;
    name: string;
    description: string;
    relatedStatutes?: string[];
    relatedPrecedents?: string[];
    jurisdictions?: string[];
    keywords: string[];
    parentConceptId?: string; // For hierarchical organization
    exampleScenarios?: string[];
}

/**
 * Represents an argument template for the AI.
 * Business value: Provides standardized, repeatable structures for legal arguments, ensuring consistency and accelerating the drafting of common legal claims and defenses.
 */
export interface IArgumentTemplate {
    id: string;
    name: string;
    type: 'claim' | 'defense' | 'motion' | 'appeal' | 'contract_clause';
    structure: string; // Template using placeholders (e.g., "Under [STATUTE], a party must prove [ELEMENT1], [ELEMENT2]...")
    exampleUsage?: string;
    keywords: string[];
    jurisdictionScope?: string[];
    requiredFacts?: string[]; // Types of facts needed for this argument
}

/**
 * Represents a user-defined legal position strategy.
 * Business value: Captures and operationalizes strategic legal thinking, allowing users to guide AI generation towards specific desired outcomes and replicate successful approaches.
 */
export interface ILegalPositionStrategy {
    id: string;
    name: string;
    description: string;
    argumentOutline: string[]; // List of main points
    keyFactsToHighlight: string[]; // IDs of facts
    keyPrecedentsToUse: string[]; // IDs of precedents
    desiredTone: IAIConfig['tone'];
    appliesToBriefTypes: ICaseData['briefType'][];
    ownerUserId: string;
    version: number;
    isActive: boolean;
}

/**
 * Represents an entry in the system's audit log.
 * Business value: Provides a tamper-evident record of all significant actions, critical for governance, compliance, security monitoring, and post-incident forensic analysis.
 */
export interface IAuditLogEntry {
    id: string;
    timestamp: string; // ISO 8601 date string
    userId?: string; // User who performed the action
    agentId?: string; // AI agent that performed the action
    action: string; // e.g., "BRIEF_GENERATED", "CASE_DATA_MODIFIED", "ACCESS_DENIED"
    resourceType: string; // e.g., "ICaseData", "ILegalBrief", "IUserContext"
    resourceId: string; // ID of the resource affected
    details: { [key: string]: any }; // Additional contextual information
    outcome: 'success' | 'failure';
    ipAddress?: string; // For security monitoring
    signature?: string; // Cryptographic signature for tamper-evidence (simulated)
}

/**
 * Represents a compliance rule that the AI should adhere to.
 * Business value: Automates the enforcement of legal and firm-specific guidelines, reducing compliance risks and ensuring all generated content meets regulatory and internal standards.
 */
export interface IComplianceRule {
    id: string;
    name: string;
    description: string;
    ruleType: 'citation_format' | 'confidentiality' | 'factual_accuracy' | 'procedural_deadlines' | 'conflict_of_interest' | 'ethical_guideline' | 'other';
    ruleText: string; // The actual rule (e.g., "All citations must follow Bluebook T.6")
    jurisdictionScope?: string[];
    appliesToResourceType: 'ICaseData' | 'ILegalBrief' | 'IDocumentExportOptions';
    severity: 'critical' | 'high' | 'medium' | 'low';
    isActive: boolean;
}

/**
 * Represents a report detailing compliance findings for a generated brief or case.
 * Business value: Provides an automated, objective assessment of document compliance, enabling rapid identification and remediation of potential violations, thereby mitigating legal and reputational risk.
 */
export interface IComplianceCheckReport {
    id: string;
    briefId: string; // Or caseId
    generatedDate: string;
    status: 'compliant' | 'non-compliant' | 'pending_review';
    findings: {
        ruleId: string;
        ruleName: string;
        severity: IComplianceRule['severity'];
        isCompliant: boolean;
        details: string; // Why it failed or passed
        suggestedAction?: string;
        snippet?: string; // Relevant part of the brief
    }[];
    overallScore?: number; // E.g., percentage compliant
    reviewedByUserId?: string;
    reviewDate?: string;
}

/**
 * Represents a legal risk assessment for a case or argument.
 * Business value: Provides proactive identification of potential legal risks, allowing for strategic adjustments before issues escalate, saving significant costs and improving outcomes.
 */
export interface IRiskAssessmentResult {
    id: string;
    caseId: string;
    generatedDate: string;
    overallRiskScore: number; // 0-100, higher is riskier
    riskAreas: {
        category: 'factual_dispute' | 'legal_precedent_weakness' | 'statutory_interpretation_ambiguity' | 'jurisdictional_challenge' | 'procedural_error' | 'evidentiary_challenge' | 'counter_argument_strength' | 'client_risk' | 'other';
        description: string;
        severity: 'critical' | 'high' | 'medium' | 'low';
        mitigationStrategy?: string;
        relatedFactsIds?: string[];
        relatedPrecedentIds?: string[];
    }[];
    summary: string; // AI's summary of the key risks
    actionableRecommendations?: string[];
}

/**
 * Defines a skill that an AI agent can perform.
 * Business value: Modularizes AI capabilities, allowing for flexible expansion and composition of agent behaviors, driving innovation and adaptability in legal automation.
 */
export interface IAgentSkill {
    id: string;
    name: string;
    description: string;
    inputSchema: string; // JSON schema for input parameters
    outputSchema: string; // JSON schema for output
    executionLogic: string; // Reference to internal implementation or external service
    isAutonomous: boolean; // Can it be run without human intervention?
    requiredPermissions: string[]; // RBAC permissions required
    invocationCount: number; // For performance monitoring
    averageRuntimeMs: number; // For performance monitoring
}

/**
 * Represents a task assigned to a Generative Jurisprudence Agent.
 * Business value: Provides a structured mechanism for orchestrating AI workflows, ensuring tasks are tracked, executed, and audited, enhancing system reliability and accountability.
 */
export interface IJurisprudenceAgentTask {
    taskId: string;
    agentId: string;
    taskType: 'generate_brief' | 'research_precedents' | 'check_compliance' | 'assess_risk' | 'summarize_case' | 'draft_section';
    caseId: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
    requestedByUserId: string;
    creationDate: string;
    startDate?: string;
    completionDate?: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    configuration?: any; // Specific config for the task (e.g., IAIConfig for brief generation)
    result?: any; // Output of the task (e.g., ILegalBrief.id)
    errorMessage?: string; // If task failed
    auditLogEntryIds?: string[]; // Chain of related audit logs
}

/**
 * Represents a simulated token transaction for AI service billing.
 * Business value: Provides a mechanism for micro-billing and transparent cost allocation for AI resource consumption, enabling new business models and granular financial control.
 */
export interface IAgentServiceTokenTransaction {
    transactionId: string;
    userId: string;
    agentId: string;
    serviceType: 'brief_generation' | 'compliance_check' | 'research_query';
    resourceId: string; // e.g., briefId or caseId
    tokenAmount: number; // Amount of tokens consumed
    currencyType: 'GJ_AI_CREDIT' | 'USD_STABLE'; // Simulated token type
    timestamp: string;
    status: 'completed' | 'failed' | 'pending';
    auditLogEntryId: string; // Link to audit log
    signature: string; // Simulated cryptographic signature for transaction integrity
}

// #endregion

// #region --- [2] Mock Data Sets ---

/**
 * Provides extensive mock data to simulate a real database for the Generative Jurisprudence platform.
 * Business value: Critical for rapid development, testing, and demonstration without live dependencies, ensuring a robust and verifiable system prior to production deployment.
 */
export const MOCK_USER_CONTEXT: IUserContext = {
    userId: 'user-gj-123',
    userName: 'A. Legalmind',
    firmName: 'JurisGen AI Associates',
    defaultJurisdictionId: 'CA-STATE', // California State
    roles: ['attorney', 'admin'],
    preferences: {
        aiConfigId: 'default-persuasive-brief',
        notificationSettings: {
            email: true,
            sms: false,
            inApp: true,
        },
        securityLevel: 'high',
    },
    isAuthenticated: true,
};

export const MOCK_ADMIN_USER_CONTEXT: IUserContext = {
    userId: 'user-gj-admin-456',
    userName: 'B. Overseer',
    firmName: 'JurisGen AI Admin',
    defaultJurisdictionId: 'US-FED',
    roles: ['admin', 'compliance_officer'],
    preferences: {
        aiConfigId: 'default-neutral-analysis',
        securityLevel: 'high',
    },
    isAuthenticated: true,
};

export const MOCK_GUEST_USER_CONTEXT: IUserContext = {
    userId: 'user-gj-guest-789',
    userName: 'C. Viewer',
    firmName: 'Public Access',
    defaultJurisdictionId: 'US-FED',
    roles: ['guest'],
    preferences: {
        aiConfigId: 'default-neutral-analysis',
        securityLevel: 'low',
    },
    isAuthenticated: false,
};


export const MOCK_JURISDICTIONS: IJurisdiction[] = [
    {
        id: 'US-FED',
        name: 'Federal',
        country: 'USA',
        courtSystemDescription: 'Dual court system with federal and state courts. Federal courts handle cases involving federal law, the U.S. Constitution, or disputes between states/citizens of different states.',
        primaryStatuteBooks: ['U.S. Code', 'Code of Federal Regulations'],
        rulesOfProcedureId: 'FRCP',
        rulesOfEvidenceId: 'FRE',
        uniqueLegalConcepts: ['Federal Question Jurisdiction', 'Diversity Jurisdiction'],
        appellateCourts: ['Circuit Courts of Appeals'],
        supremeCourtName: 'Supreme Court of the United States',
        commonLawTradition: true,
    },
    {
        id: 'CA-STATE',
        name: 'California State',
        country: 'USA',
        courtSystemDescription: 'California operates a unified state court system, with trial courts (Superior Courts), Courts of Appeal, and the Supreme Court of California.',
        primaryStatuteBooks: ['California Codes', 'California Rules of Court'],
        rulesOfProcedureId: 'CRCP',
        rulesOfEvidenceId: 'CA-EVIDENCE',
        uniqueLegalConcepts: ['Proposition 65', 'Community Property', 'SLAPP Suits'],
        appellateCourts: ['California Courts of Appeal'],
        supremeCourtName: 'Supreme Court of California',
        commonLawTradition: true,
    },
    {
        id: 'NY-STATE',
        name: 'New York State',
        country: 'USA',
        courtSystemDescription: 'New York has a complex court structure, including Supreme Courts (trial courts for major civil/criminal), County Courts, Family Courts, Surrogatesâ€™ Courts, and Court of Claims, Appellate Divisions, and the Court of Appeals.',
        primaryStatuteBooks: ['New York Consolidated Laws', 'New York Civil Practice Law and Rules'],
        rulesOfProcedureId: 'NY-CPLR',
        rulesOfEvidenceId: 'NY-EVIDENCE',
        uniqueLegalConcepts: ['New York Labor Law Â§ 240', 'Mortgage Foreclosure Procedures'],
        appellateCourts: ['Appellate Divisions of the Supreme Court'],
        supremeCourtName: 'New York Court of Appeals',
        commonLawTradition: true,
    },
    {
        id: 'TX-STATE',
        name: 'Texas State',
        country: 'USA',
        courtSystemDescription: 'Texas has a complex court system with overlapping jurisdictions, including Justice Courts, Municipal Courts, Constitutional County Courts, County Courts at Law, District Courts, Courts of Appeals, and two supreme courts (Supreme Court of Texas for civil cases and Court of Criminal Appeals for criminal cases).',
        primaryStatuteBooks: ['Texas Codes', 'Texas Rules of Civil Procedure'],
        rulesOfProcedureId: 'TX-CRP',
        rulesOfEvidenceId: 'TX-EVIDENCE',
        uniqueLegalConcepts: ['Homestead Exemption', 'Deceptive Trade Practices Act', 'Tort Reform'],
        appellateCourts: ['Courts of Appeals'],
        supremeCourtName: 'Supreme Court of Texas (Civil), Court of Criminal Appeals (Criminal)',
        commonLawTradition: true,
    },
    {
        id: 'FL-STATE',
        name: 'Florida State',
        country: 'USA',
        courtSystemDescription: 'Florida\'s judicial system includes County Courts, Circuit Courts, District Courts of Appeal, and the Supreme Court of Florida.',
        primaryStatuteBooks: ['Florida Statutes', 'Florida Rules of Civil Procedure'],
        rulesOfProcedureId: 'FL-RCP',
        rulesOfEvidenceId: 'FL-EVIDENCE',
        uniqueLegalConcepts: ['Stand Your Ground Law', 'Homestead Exemption', 'Sunshine Law'],
        appellateCourts: ['District Courts of Appeal'],
        supremeCourtName: 'Supreme Court of Florida',
        commonLawTradition: true,
    },
];

export const MOCK_RULES_OF_PROCEDURE: IRulesOfProcedure[] = [
    {
        id: 'FRCP',
        name: 'Federal Rules of Civil Procedure',
        jurisdictionId: 'US-FED',
        effectiveDate: '2023-12-01',
        sections: [
            {
                id: 'FRCP-1', title: 'Scope and Purpose', text: 'These rules govern the procedure in all civil actions and proceedings in the United States district courts, except as stated in Rule 81. They should be construed, administered, and employed by the court and the parties to secure the just, speedy, and inexpensive determination of every action and proceeding.', keywords: ['scope', 'purpose', 'civil actions']
            },
            {
                id: 'FRCP-8', title: 'General Rules of Pleading', text: '(a) Claim for Relief. A pleading that states a claim for relief must contain: (1) a short and plain statement of the grounds for the court\'s jurisdiction, unless the court already has jurisdiction and the claim needs no new jurisdictional support; (2) a short and plain statement of the claim showing that the pleader is entitled to relief; and (3) a demand for the relief sought, which may include relief in the alternative or different types of relief. (b) Defenses; Admissions and Denials. (1) In General. In responding to a pleading, a party must: (A) state in short and plain terms its defenses to each claim asserted against it; and (B) admit or deny the allegations made against it by an opposing party. (c) Affirmative Defenses.', keywords: ['pleading', 'claim for relief', 'defenses', 'admissions', 'denials']
            },
            {
                id: 'FRCP-11', title: 'Signing Pleadings, Motions, and Other Papers; Representations to the Court; Sanctions', text: '(a) Signature. Every pleading, written motion, and other paper must be signed by at least one attorney of record in the attorneyâ€™s nameâ€”or by a party personally if the party is unrepresented. (b) Representations to the Court. By presenting to the court a pleading, written motion, or other paperâ€”whether by signing, filing, submitting, or later advocating itâ€”an attorney or unrepresented party certifies that to the best of the personâ€™s knowledge, information, and belief, formed after an inquiry reasonable under the circumstances: (1) it is not being presented for any improper purpose, such as to harass, cause unnecessary delay, or needlessly increase the cost of litigation; (2) the claims, defenses, and other legal contentions are warranted by existing law or by a nonfrivolous argument for extending, modifying, or reversing existing law or for establishing new law; (3) the factual contentions have evidentiary support or, if specifically so identified, will likely have evidentiary support after a reasonable opportunity for further investigation or discovery; and (4) the denials of factual contentions are warranted on the evidence or, if specifically so identified, are reasonably based on belief or a lack of information.', keywords: ['sanctions', 'pleading standards', 'good faith']
            },
            {
                id: 'FRCP-26', title: 'Duty to Disclose; General Provisions Governing Discovery', text: '(a) Required Disclosures. (1) Initial Disclosure. Except as exempted by Rule 26(a)(1)(B) or as otherwise stipulated or ordered by the court, a party must, without awaiting a discovery request, provide to the other parties: (A) the name and, if known, the address and telephone number of each individual likely to have discoverable informationâ€”along with the subjects of that informationâ€”that the disclosing party may use to support its claims or defenses, unless the use would be solely for impeachment; (B) a copyâ€”or a description by category and locationâ€”of all documents, electronically stored information, and tangible things that the disclosing party has in its possession, custody, or control and may use to support its claims or defenses, unless the use would be solely for impeachment; (C) a computation of each category of damages claimed by the disclosing partyâ€”who must also make available for inspection and copying the documents or other evidentiary material, unless privileged or protected from disclosure, on which each computation is based, including materials bearing on the nature and extent of injuries suffered; and (D) for inspection and copying as under Rule 34, any insurance agreement under which an insurance business may be liable to satisfy all or part of a possible judgment in the action or to indemnify or reimburse for payments made to satisfy the judgment. (b) Scope of Discovery. Unless otherwise limited by court order, the scope of discovery is as follows: Parties may obtain discovery regarding any nonprivileged matter that is relevant to any party\'s claim or defense and proportional to the needs of the case, considering the importance of the issues at stake in the action, the amount in controversy, the partiesâ€™ relative access to relevant information, the partiesâ€™ resources, the importance of the discovery in resolving the issues, and whether the burden or expense of the proposed discovery outweighs its likely benefit. Information within this scope of discovery need not be admissible in evidence to be discoverable.', keywords: ['discovery', 'disclosure', 'scope of discovery', 'proportionality']
            },
            {
                id: 'FRCP-56', title: 'Summary Judgment', text: '(a) Motion for Summary Judgment or Partial Summary Judgment. A party may move for summary judgment, identifying each claim or defenseâ€”or the part of each claim or defenseâ€”on which summary judgment is sought. The court shall grant summary judgment if the movant shows that there is no genuine dispute as to any material fact and the movant is entitled to judgment as a matter of law. The court should state on the record the reasons for granting or denying the motion.', keywords: ['summary judgment', 'material fact', 'judgment as a matter of law']
            },
        ],
        amendmentLog: [
            { date: '2023-12-01', description: 'Various minor amendments to clarify language and procedure.' },
            { date: '2022-12-01', description: 'Amendments related to electronic discovery.' }
        ]
    },
    {
        id: 'CRCP',
        name: 'California Rules of Court',
        jurisdictionId: 'CA-STATE',
        effectiveDate: '2024-01-01',
        sections: [
            {
                id: 'CRC-2.100', title: 'Form of papers presented for filing', text: '(a) Application. The rules in this chapter apply to papers filed in the trial courts. (b) Paper size. Except for exhibits and as provided in rule 2.111, all papers must be on letter-size (8Â½- by 11-inch) paper.', keywords: ['form', 'filing', 'paper size']
            },
            {
                id: 'CRC-3.1110', title: 'General format and filing of motions; two-page limit on memoranda in support of or opposition to demurrer', text: '(a) Required papers. A party filing a motion, except for a motion made during trial, must serve and file: (1) A notice of hearing on the motion; (2) The motion itself; (3) A memorandum of points and authorities in support of the motion; and (4) Evidence in support of the motion.', keywords: ['motions', 'filing', 'memorandum', 'evidence']
            },
            {
                id: 'CRC-3.1340', title: 'Motion to compel further response to interrogatories, inspection demand, or to admissions', text: '(a) Contents of motion. A motion to compel further responses to interrogatories, inspection demands, or to requests for admission must: (1) Identify the interrogatories, demands, or requests by set and number or letter; (2) Quote each interrogatory, demand, or request, and the response to which objection is taken; and (3) State the factual and legal reasons for compelling further response.', keywords: ['discovery', 'motion to compel', 'interrogatories']
            },
        ],
        amendmentLog: [
            { date: '2024-01-01', description: 'Annual revisions and updates.' },
        ]
    },
    {
        id: 'NY-CPLR',
        name: 'New York Civil Practice Law and Rules',
        jurisdictionId: 'NY-STATE',
        effectiveDate: '2023-09-01',
        sections: [
            {
                id: 'NY-CPLR-301', title: 'Jurisdiction over persons, property or status', text: 'A court may exercise such jurisdiction over persons, property, or status as might have been exercised heretofore.', keywords: ['jurisdiction', 'long-arm statute']
            },
            {
                id: 'NY-CPLR-3211', title: 'Motion to dismiss', text: '(a) Motion to dismiss cause of action. A party may move for judgment dismissing one or more causes of action asserted against him on the ground that: (1) a defense is founded upon documentary evidence; or (2) the court has not jurisdiction of the subject matter of the cause of action; or (3) the party asserting the cause of action has not legal capacity to sue; or (4) there is another action pending between the same parties for the same cause of action in any court of any state or the United States; the court need not dismiss upon this ground but may make such order as justice requires; or (5) the cause of action may not be maintained because of arbitration and award, collateral estoppel, discharge in bankruptcy, infancy or other disability of the moving party, payment, release, res judicata, statute of limitations, or statute of frauds; or (6) with respect to a cause of action for divorce, separation, annulment or declaration of nullity of a void marriage, that the cause of action did not arise in this state.', keywords: ['motion to dismiss', 'affirmative defenses', 'res judicata']
            }
        ],
        amendmentLog: [{ date: '2023-09-01', description: 'Minor clarifications and electronic filing updates.' }]
    }
];

export const MOCK_RULES_OF_EVIDENCE: IRulesOfEvidence[] = [
    {
        id: 'FRE',
        name: 'Federal Rules of Evidence',
        jurisdictionId: 'US-FED',
        effectiveDate: '2023-12-01',
        sections: [
            {
                id: 'FRE-401', title: 'Test for Relevant Evidence', text: 'Evidence is relevant if: (a) it has any tendency to make a fact more or less probable than it would be without the evidence; and (b) the fact is of consequence in determining the action.', keywords: ['relevance', 'admissibility']
            },
            {
                id: 'FRE-403', title: 'Excluding Relevant Evidence for Prejudice, Confusion, Waste of Time, or Other Reasons', text: 'The court may exclude relevant evidence if its probative value is substantially outweighed by a danger of one or more of the following: unfair prejudice, confusing the issues, misleading the jury, undue delay, wasting time, or needlessly presenting cumulative evidence.', keywords: ['exclusion of evidence', 'prejudice', 'probative value']
            },
            {
                id: 'FRE-802', title: 'The Rule Against Hearsay', text: 'Hearsay is not admissible unless any of the following provides otherwise: a federal statute; these rules; or other rules prescribed by the Supreme Court.', keywords: ['hearsay', 'admissibility']
            },
            {
                id: 'FRE-803', title: 'Exceptions to the Rule Against Hearsayâ€”Regardless of Whether the Declarant Is Available as a Witness', text: 'The following are not excluded by the rule against hearsay, regardless of whether the declarant is available as a witness: (1) Present Sense Impression. (2) Excited Utterance. (3) Statement of Mental, Emotional, or Physical Condition. (4) Statement Made for Medical Diagnosis or Treatment. (5) Recorded Recollection. (6) Records of a Regularly Conducted Activity. (7) Absence of a Record of a Regularly Conducted Activity. (8) Public Records. (9) Public Records of Vital Statistics. (10) Absence of a Public Record. (11) Records of Religious Organizations Concerning Personal or Family History. (12) Certificates of Marriage, Baptism, and Similar Ceremonies. (13) Family Records. (14) Records of Documents That Affect an Interest in Property. (15) Statements in Documents That Affect an Interest in Property. (16) Statements in Ancient Documents. (17) Market Reports and Similar Commercial Publications. (18) Statements in Learned Treatises, Periodicals, or Pamphlets. (19) Reputation Concerning Personal or Family History. (20) Reputation Concerning Boundaries or General History. (21) Reputation Concerning Character. (22) Judgment of a Previous Conviction. (23) Other Exceptions. (24) [Transferred to Rule 807] .', keywords: ['hearsay exceptions', 'business records', 'public records']
            },
        ],
        amendmentLog: [
            { date: '2023-12-01', description: 'Minor stylistic and technical amendments.' },
            { date: '2011-12-01', description: 'Restyling of the Evidence Rules to make them more easily understood and to make style and terminology consistent throughout the rules.' }
        ]
    },
    {
        id: 'CA-EVIDENCE',
        name: 'California Evidence Code',
        jurisdictionId: 'CA-STATE',
        effectiveDate: '2024-01-01',
        sections: [
            {
                id: 'CEC-210', title: 'Relevant evidence', text: '"Relevant evidence" means evidence, including evidence relevant to the credibility of a witness or hearsay declarant, having any tendency in reason to prove or disprove any disputed fact that is of consequence to the determination of the action.', keywords: ['relevance', 'credibility']
            },
            {
                id: 'CEC-352', title: 'Discretion of court to exclude evidence', text: 'The court in its discretion may exclude evidence if its probative value is substantially outweighed by the probability that its admission will (a) necessitate undue consumption of time or (b) create substantial danger of undue prejudice, of confusing the issues, or of misleading the jury.', keywords: ['discretion', 'prejudice', 'probative value']
            },
            {
                id: 'CEC-1200', title: 'The Hearsay Rule', text: '(a) "Hearsay evidence" is evidence of a statement that was made other than by a witness while testifying at the hearing and that is offered to prove the truth of the matter stated. (b) Except as provided by law, hearsay evidence is inadmissible.', keywords: ['hearsay', 'inadmissible']
            }
        ],
        amendmentLog: [
            { date: '2024-01-01', description: 'Annual updates and clarifications.' },
        ]
    }
];

export const MOCK_PRECEDENTS: IPrecedent[] = [
    {
        id: 'precedent-1',
        caseName: 'Smith v. Jones',
        citation: '123 F.2d 456 (9th Cir. 1999)',
        jurisdiction: 'U.S. Court of Appeals for the Ninth Circuit',
        year: 1999,
        summary: 'Dispute over contract breach where software development was delayed.',
        holding: 'Affirmed lower court\'s finding that substantial delay constituted a material breach of contract, allowing for damages.',
        reasoning: 'The court found that time was of the essence in the contract, and documented delays were significant.',
        keywords: ['contract law', 'breach', 'software development', 'damages', 'material breach'],
        relevanceScore: 0.95,
        isPrimaryAuthority: true,
        courtLevel: 'appellate',
        dateDecided: '1999-03-15',
        judges: ['Judge Ito', 'Judge Garcia'],
        attorneysForPlaintiff: ['A. Lawyer'],
        attorneysForDefendant: ['B. Barrister'],
        status: 'active',
        tags: ['contract', 'technology']
    },
    {
        id: 'precedent-2',
        caseName: 'People v. Davis',
        citation: '45 Cal. 4th 789 (2008)',
        jurisdiction: 'Supreme Court of California',
        year: 2008,
        summary: 'Case concerning the admissibility of digital forensic evidence in a felony theft trial.',
        holding: 'Established guidelines for the authentication and chain of custody of digital evidence under California Evidence Code.',
        reasoning: 'The court emphasized the unique challenges of digital evidence and the need for stringent protocols to ensure reliability.',
        keywords: ['criminal law', 'evidence', 'digital forensics', 'admissibility', 'chain of custody'],
        relevanceScore: 0.88,
        isPrimaryAuthority: true,
        courtLevel: 'supreme',
        dateDecided: '2008-07-22',
        judges: ['Chief Justice George', 'Justice Werdegar'],
        attorneysForPlaintiff: ['D. Prosecutor'],
        attorneysForDefendant: ['E. Public Defender'],
        status: 'active',
        tags: ['criminal', 'evidence', 'technology']
    },
    {
        id: 'precedent-3',
        caseName: 'In re Estate of Miller',
        citation: '78 N.Y.2d 123 (1991)',
        jurisdiction: 'New York Court of Appeals',
        year: 1991,
        summary: 'Dispute over the interpretation of a testamentary trust clause regarding charitable distributions.',
        holding: 'Clarified the doctrine of cy pres application for charitable trusts in New York, allowing for deviation from the literal terms when original purpose is impossible or impracticable.',
        reasoning: 'The court balanced the testator\'s general charitable intent with the practical realities of fulfilling specific bequests.',
        keywords: ['trusts and estates', 'charitable trusts', 'cy pres', 'will interpretation'],
        relevanceScore: 0.75,
        isPrimaryAuthority: true,
        courtLevel: 'supreme',
        dateDecided: '1991-11-05',
        judges: ['Chief Judge Wachtler'],
        status: 'active',
        tags: ['trusts', 'estates']
    },
    {
        id: 'precedent-4',
        caseName: 'Green v. City of Metropolis',
        citation: '501 U.S. 1 (1995)',
        jurisdiction: 'Supreme Court of the United States',
        year: 1995,
        summary: 'Landmark civil rights case challenging racial discrimination in municipal hiring practices.',
        holding: 'Affirmed the principle that disparate impact analysis applies to Title VII cases and provided guidance on proving business necessity.',
        reasoning: 'The Court elaborated on the evidentiary burdens for both plaintiffs and defendants in proving and defending against claims of systemic discrimination.',
        keywords: ['civil rights', 'employment discrimination', 'Title VII', 'disparate impact', 'business necessity'],
        relevanceScore: 0.98,
        isPrimaryAuthority: true,
        courtLevel: 'supreme',
        dateDecided: '1995-06-28',
        judges: ['Justice O\'Connor', 'Justice Kennedy', 'Justice Ginsburg'],
        status: 'active',
        tags: ['civil rights', 'employment', 'constitutional law']
    },
    {
        id: 'precedent-5',
        caseName: 'Alpha Corp. v. Beta Inc.',
        citation: '345 F.Supp.3d 100 (D. Del. 2018)',
        jurisdiction: 'U.S. District Court, District of Delaware',
        year: 2018,
        summary: 'Patent infringement lawsuit involving a novel biotechnology process.',
        holding: 'Granted summary judgment for defendant, finding the patent claims invalid under 35 U.S.C. § 101 for abstractness.',
        reasoning: 'The court applied the Alice/Mayo framework, determining that the patent claimed a natural phenomenon without sufficient inventive concept.',
        keywords: ['patent law', 'intellectual property', 'biotechnology', 'patent invalidity', 'summary judgment', 'abstract ideas'],
        relevanceScore: 0.92,
        isPrimaryAuthority: true,
        courtLevel: 'trial',
        dateDecided: '2018-09-10',
        judges: ['Judge Stark'],
        status: 'active',
        tags: ['IP', 'patents', 'biotech']
    }
];

export const MOCK_AI_CONFIGS: IAIConfig[] = [
    {
        id: 'default-persuasive-brief',
        name: 'Default Persuasive Brief',
        tone: 'persuasive',
        lengthPreference: 'medium',
        citationStyle: 'bluebook',
        includeDetailedFacts: true,
        includeCounterArguments: true,
        focusOnStatutes: false,
        focusOnPrecedents: true,
        targetAudience: 'judge',
        levelOfDetail: 'specific',
        language: 'en-US',
        strictComplianceWithRules: true,
    },
    {
        id: 'aggressive-summary-judgment',
        name: 'Aggressive SJ Motion',
        tone: 'aggressive',
        lengthPreference: 'long',
        citationStyle: 'localRules',
        includeDetailedFacts: true,
        includeCounterArguments: true,
        focusOnStatutes: true,
        focusOnPrecedents: true,
        legalDoctrineEmphasis: 'No Genuine Dispute of Material Fact',
        targetAudience: 'judge',
        levelOfDetail: 'exhaustive',
        language: 'en-US',
        strictComplianceWithRules: true,
        customInstructions: 'Emphasize lack of evidence from opposing side. Assert conclusions boldly.'
    },
    {
        id: 'neutral-compliance-memo',
        name: 'Neutral Compliance Memo',
        tone: 'neutral',
        lengthPreference: 'short',
        citationStyle: 'chicago',
        includeDetailedFacts: false,
        includeCounterArguments: false,
        focusOnStatutes: true,
        focusOnPrecedents: false,
        targetAudience: 'client',
        levelOfDetail: 'general',
        language: 'en-US',
        strictComplianceWithRules: true,
        customInstructions: 'Provide only factual analysis without legal recommendations.'
    }
];

export const MOCK_CASES_DATA: ICaseData[] = [
    {
        id: 'case-001',
        caseName: 'Tech Innovations Inc. v. Cyber Solutions LLC',
        caseSummary: 'Plaintiff alleges breach of contract for failure to deliver custom software on time and to specification. Defendant counter-claims for additional payment due to scope creep and change orders.',
        parties: [
            { id: 'party-ti', name: 'Tech Innovations Inc.', type: 'plaintiff', isIndividual: false, representation: 'Legalmind & Assoc.' },
            { id: 'party-cs', name: 'Cyber Solutions LLC', type: 'defendant', isIndividual: false, representation: 'Global Legal Group' }
        ],
        facts: [
            { id: 'fact-001', description: 'Contract signed on 2023-01-10 for software delivery by 2024-01-10.', isDisputed: false, relevance: 'high' },
            { id: 'fact-002', description: 'Software delivered on 2024-03-15.', isDisputed: false, relevance: 'high' },
            { id: 'fact-003', description: 'Software contained critical bugs preventing deployment.', isDisputed: true, relevance: 'high', sourceDocumentRef: 'Plaintiff Bug Report' },
            { id: 'fact-004', description: 'Defendant requested additional payment for features outside original scope.', isDisputed: true, relevance: 'medium', sourceDocumentRef: 'Defendant Email Log' },
            { id: 'fact-005', description: 'Original contract specifies no payment for delayed or non-functional deliverables.', isDisputed: false, relevance: 'high', supportingEvidenceIds: ['contract-doc-1'] }
        ],
        desiredLegalPosition: 'Plaintiff seeks damages for breach of contract and specific performance for bug fixes.',
        jurisdictionId: 'CA-STATE',
        relevantStatuteIds: ['CA-COMM-2200'], // Example: California Commercial Code for sales/contracts
        relevantPrecedentIds: ['precedent-1'],
        legalIssueStatement: 'Did Cyber Solutions LLC materially breach the software development contract, entitling Tech Innovations Inc. to damages and specific performance?',
        reliefSought: 'Damages of $1,500,000, specific performance to fix software bugs.',
        briefType: 'motion',
        clientName: 'Tech Innovations Inc.',
        dateCreated: '2024-04-01T10:00:00Z',
        lastModified: '2024-04-10T14:30:00Z',
        associatedDocuments: [{ name: 'Software Contract', url: '/docs/contract001.pdf', type: 'PDF', documentId: 'contract-doc-1' }],
        stageOfLitigation: 'discovery',
        filingDeadline: '2024-06-30T17:00:00Z',
        status: 'active',
        createdByUserId: 'user-gj-123',
    },
    {
        id: 'case-002',
        caseName: 'Environmental Advocates v. MegaCorp Energy',
        caseSummary: 'Environmental group sues MegaCorp Energy for alleged violations of federal environmental regulations leading to significant pollution. MegaCorp denies liability, citing compliance with permits.',
        parties: [
            { id: 'party-ea', name: 'Environmental Advocates', type: 'plaintiff', isIndividual: false, representation: 'Green Justice Firm' },
            { id: 'party-me', name: 'MegaCorp Energy', type: 'defendant', isIndividual: false, representation: 'Big Law & Partners' }
        ],
        facts: [
            { id: 'fact-201', description: 'Discharge of chemical pollutants into River X on 2023-11-01.', isDisputed: false, relevance: 'high' },
            { id: 'fact-202', description: 'Pollutant levels exceeded federal limits by 200%.', isDisputed: true, relevance: 'high', sourceDocumentRef: 'EPA Report Q4 2023' },
            { id: 'fact-203', description: 'MegaCorp holds a permit allowing certain levels of discharge.', isDisputed: false, relevance: 'medium' },
            { id: 'fact-204', description: 'Equipment malfunction caused the excessive discharge.', isDisputed: true, relevance: 'medium', relatedPartyId: 'party-me' }
        ],
        desiredLegalPosition: 'Plaintiff seeks injunction against further pollution and substantial fines.',
        jurisdictionId: 'US-FED',
        relevantStatuteIds: ['USC-33-1311', 'USC-42-7401'], // Clean Water Act, Clean Air Act sections
        relevantPrecedentIds: ['precedent-4'],
        legalIssueStatement: 'Did MegaCorp Energy violate federal environmental statutes, and if so, what remedies are appropriate?',
        reliefSought: 'Permanent injunction, $5,000,000 in civil penalties.',
        briefType: 'complaint',
        clientName: 'Environmental Advocates',
        dateCreated: '2024-03-20T09:00:00Z',
        lastModified: '2024-04-05T11:00:00Z',
        stageOfLitigation: 'pre-litigation',
        status: 'active',
        createdByUserId: 'user-gj-123',
    }
];

export const MOCK_LEGAL_BRIEFS: ILegalBrief[] = [
    {
        id: 'brief-001-v1',
        caseId: 'case-001',
        title: 'Motion for Summary Judgment - Tech Innovations Inc. v. Cyber Solutions LLC',
        briefType: 'motion',
        generatedDate: '2024-04-12T10:00:00Z',
        sections: [
            {
                id: 'sec-intro-001', title: 'I. Introduction', content: 'Plaintiff Tech Innovations Inc. ("Tech Innovations") moves this Court for summary judgment against Defendant Cyber Solutions LLC ("Cyber Solutions") on its claim for breach of contract. As set forth below, the undisputed material facts demonstrate that Cyber Solutions materially breached the parties\' software development agreement by failing to deliver functional software by the agreed-upon deadline, causing Tech Innovations significant damages. There is no genuine dispute as to any material fact, and Tech Innovations is entitled to judgment as a matter of law.', citations: []
            },
            {
                id: 'sec-facts-001', title: 'II. Statement of Undisputed Facts', content: 'On January 10, 2023, the parties executed a Software Development Agreement ("Agreement") for the creation of custom enterprise software, with a delivery deadline of January 10, 2024 (Fact 1). Cyber Solutions failed to deliver the software by this date, instead delivering a non-functional version on March 15, 2024 (Fact 2). This delay and non-functionality constitute a material breach. See *Smith v. Jones*, 123 F.2d 456 (9th Cir. 1999) (holding substantial delay a material breach).', citations: ['Smith v. Jones, 123 F.2d 456 (9th Cir. 1999)']
            },
            {
                id: 'sec-arg-001', title: 'III. Legal Argument', content: 'Under California contract law, a material breach occurs when a party fails to perform a substantial part of the contract (California Civil Code Â§ 123). The delivery of non-functional software over two months past the deadline clearly constitutes a material breach. Cyber Solutions\' claims of scope creep are without merit, as change orders were never formally executed as required by the Agreement.', citations: ['California Civil Code Â§ 123']
            },
            {
                id: 'sec-concl-001', title: 'IV. Conclusion', content: 'For the foregoing reasons, Plaintiff Tech Innovations Inc. respectfully requests that this Court grant its motion for summary judgment and award damages as requested.', citations: []
            }
        ],
        fullTextRaw: 'Full raw text of the brief...',
        citationsList: ['Smith v. Jones, 123 F.2d 456 (9th Cir. 1999)', 'California Civil Code Â§ 123'],
        keywords: ['summary judgment', 'breach of contract', 'software', 'damages'],
        generationMetadata: {
            aiModel: 'JurisGen-GPT-4',
            temperature: 0.7,
            promptTokens: 2500,
            completionTokens: 1200,
            runtimeMs: 4500,
            agentId: 'gj-agent-brief-v1'
        },
        versionHistoryId: 'brief-001-history',
        analysisSummary: 'This brief effectively leverages the Smith v. Jones precedent and directly addresses the core breach claims. Strong factual grounding.',
        suggestedRevisions: ['Add more specific monetary damage calculations.', 'Strengthen argument against scope creep defense with contract clauses.'],
        legalStrengthScore: 88,
        readabilityScore: 72.5,
        toneAnalysis: { primaryTone: 'persuasive', score: 0.92 },
        complianceReportId: 'compliance-001-v1',
        riskAssessmentId: 'risk-001-v1',
        generatedByUserId: 'user-gj-123',
    },
    {
        id: 'brief-002-v1',
        caseId: 'case-002',
        title: 'Plaintiff\'s Complaint for Environmental Violations - Environmental Advocates v. MegaCorp Energy',
        briefType: 'complaint',
        generatedDate: '2024-03-25T11:30:00Z',
        sections: [
            { id: 'sec-intro-002', title: 'I. Introduction', content: 'Plaintiff Environmental Advocates brings this action against Defendant MegaCorp Energy for repeated violations of the Clean Water Act, 33 U.S.C. § 1311 et seq., arising from unlawful discharge of industrial pollutants into River X. These discharges have caused demonstrable harm to the local ecosystem and public health.', citations: [] },
            { id: 'sec-juris-002', title: 'II. Jurisdiction and Venue', content: 'This Court has jurisdiction over this action pursuant to 28 U.S.C. § 1331 (federal question jurisdiction) and 33 U.S.C. § 1365(a) (citizen suit provision of the Clean Water Act). Venue is proper in this district pursuant to 28 U.S.C. § 1391(b), as a substantial part of the events giving rise to the claim occurred here.', citations: ['28 U.S.C. § 1331', '33 U.S.C. § 1365(a)', '28 U.S.C. § 1391(b)'] },
            { id: 'sec-facts-002', title: 'III. Factual Allegations', content: 'On or about November 1, 2023, MegaCorp Energy discharged chemical pollutants into River X. Subsequent testing revealed that the levels of these pollutants significantly exceeded the limits set forth in their federal permits and the Clean Water Act. (Fact 201, 202).', citations: [] },
            { id: 'sec-counts-002', title: 'IV. Counts for Relief', content: 'Count 1: Violation of Clean Water Act, 33 U.S.C. § 1311.', citations: [] },
            { id: 'sec-prayer-002', title: 'V. Prayer for Relief', content: 'Plaintiff respectfully requests that the Court: (a) Issue a permanent injunction prohibiting further unlawful discharges; (b) Impose civil penalties as provided by law; (c) Award Plaintiff its reasonable attorney\'s fees and costs.', citations: [] }
        ],
        fullTextRaw: 'Full raw text of the environmental complaint...',
        citationsList: ['28 U.S.C. § 1331', '33 U.S.C. § 1365(a)', '28 U.S.C. § 1391(b)', '33 U.S.C. § 1311'],
        keywords: ['environmental law', 'Clean Water Act', 'injunction', 'pollution'],
        generationMetadata: {
            aiModel: 'JurisGen-GPT-4',
            temperature: 0.8,
            promptTokens: 1800,
            completionTokens: 900,
            runtimeMs: 3800,
            agentId: 'gj-agent-brief-v1'
        },
        versionHistoryId: 'brief-002-history',
        analysisSummary: 'Well-structured complaint covering key jurisdictional and substantive elements. Consider adding more detail on environmental harm.',
        suggestedRevisions: ['Provide more scientific evidence regarding environmental impact.', 'Detail specific dates of alleged violations if available.'],
        legalStrengthScore: 90,
        readabilityScore: 68.1,
        toneAnalysis: { primaryTone: 'formal', score: 0.85 },
        complianceReportId: 'compliance-002-v1',
        riskAssessmentId: 'risk-002-v1',
        generatedByUserId: 'user-gj-123',
    }
];

export const MOCK_AUDIT_LOGS: IAuditLogEntry[] = [
    {
        id: 'audit-1',
        timestamp: '2024-04-12T10:00:00Z',
        userId: 'user-gj-123',
        agentId: 'gj-agent-brief-v1',
        action: 'BRIEF_GENERATED',
        resourceType: 'ILegalBrief',
        resourceId: 'brief-001-v1',
        details: { caseId: 'case-001', configId: 'default-persuasive-brief' },
        outcome: 'success',
        ipAddress: '192.168.1.100',
        signature: 'mock-signature-brief-1'
    },
    {
        id: 'audit-2',
        timestamp: '2024-04-12T10:05:00Z',
        userId: 'user-gj-123',
        agentId: 'gj-agent-compliance-v1',
        action: 'COMPLIANCE_CHECK_PERFORMED',
        resourceType: 'IComplianceCheckReport',
        resourceId: 'compliance-001-v1',
        details: { briefId: 'brief-001-v1', ruleset: ['citation_format', 'confidentiality'] },
        outcome: 'success',
        ipAddress: '192.168.1.100',
        signature: 'mock-signature-compliance-1'
    },
    {
        id: 'audit-3',
        timestamp: '2024-04-12T10:10:00Z',
        userId: 'user-gj-admin-456',
        action: 'ACCESS_ATTEMPT',
        resourceType: 'ICaseData',
        resourceId: 'case-001',
        details: { requestedRole: 'admin', requiredRole: 'attorney' }, // Simulated access restriction detail
        outcome: 'success', // Admin can always access
        ipAddress: '192.168.1.101',
        signature: 'mock-signature-access-1'
    },
    {
        id: 'audit-4',
        timestamp: '2024-04-12T10:15:00Z',
        userId: 'user-gj-guest-789',
        action: 'ACCESS_ATTEMPT',
        resourceType: 'ICaseData',
        resourceId: 'case-001',
        details: { requestedRole: 'guest', requiredRole: 'attorney' },
        outcome: 'failure',
        ipAddress: '192.168.1.102',
        signature: 'mock-signature-access-denied-1'
    }
];

export const MOCK_COMPLIANCE_RULES: IComplianceRule[] = [
    {
        id: 'rule-bluebook-citation',
        name: 'Bluebook Citation Format',
        description: 'Ensures all legal citations adhere to the Bluebook (21st ed.) format.',
        ruleType: 'citation_format',
        ruleText: 'All citations must conform to Bluebook Rule 10 (Cases) and Rule 12 (Statutes).',
        jurisdictionScope: ['US-FED', 'CA-STATE', 'NY-STATE'],
        appliesToResourceType: 'ILegalBrief',
        severity: 'high',
        isActive: true,
    },
    {
        id: 'rule-confidentiality-clientname',
        name: 'Client Name Confidentiality',
        description: 'Prohibits inclusion of actual client names in public-facing documents without explicit consent.',
        ruleType: 'confidentiality',
        ruleText: 'Actual client names must be redacted or replaced with placeholders (e.g., "Client A") in any document designated as "public" or "unprivileged".',
        appliesToResourceType: 'ILegalBrief',
        severity: 'critical',
        isActive: true,
    },
    {
        id: 'rule-factual-accuracy-check',
        name: 'Factual Accuracy Verification',
        description: 'Requires all asserted facts to be cross-referenced with source documents or marked as disputed.',
        ruleType: 'factual_accuracy',
        ruleText: 'Every factual assertion in a brief must either cite a supporting document or be explicitly identified as a "disputed fact".',
        appliesToResourceType: 'ILegalBrief',
        severity: 'high',
        isActive: true,
    }
];

export const MOCK_COMPLIANCE_REPORTS: IComplianceCheckReport[] = [
    {
        id: 'compliance-001-v1',
        briefId: 'brief-001-v1',
        generatedDate: '2024-04-12T10:05:00Z',
        status: 'compliant',
        findings: [
            {
                ruleId: 'rule-bluebook-citation',
                ruleName: 'Bluebook Citation Format',
                severity: 'high',
                isCompliant: true,
                details: 'All citations in sections II and III conform to Bluebook standards.',
            },
            {
                ruleId: 'rule-confidentiality-clientname',
                ruleName: 'Client Name Confidentiality',
                severity: 'critical',
                isCompliant: true,
                details: 'No client names found in public-facing sections.',
            },
        ],
        overallScore: 100,
    },
    {
        id: 'compliance-002-v1',
        briefId: 'brief-002-v1',
        generatedDate: '2024-03-25T11:40:00Z',
        status: 'non-compliant',
        findings: [
            {
                ruleId: 'rule-bluebook-citation',
                ruleName: 'Bluebook Citation Format',
                severity: 'high',
                isCompliant: true,
                details: 'All citations adhere to Bluebook.',
            },
            {
                ruleId: 'rule-factual-accuracy-check',
                ruleName: 'Factual Accuracy Verification',
                severity: 'high',
                isCompliant: false,
                details: 'Fact "Pollutant levels exceeded federal limits by 200%" in section III lacks a specific, accessible source document reference within the case data.',
                suggestedAction: 'Add specific EPA report ID or public record URL.',
                snippet: 'Pollutant levels exceeded federal limits by 200%.'
            },
        ],
        overallScore: 50,
        reviewedByUserId: 'user-gj-admin-456',
        reviewDate: '2024-03-26T09:00:00Z',
    }
];

export const MOCK_RISK_ASSESSMENTS: IRiskAssessmentResult[] = [
    {
        id: 'risk-001-v1',
        caseId: 'case-001',
        generatedDate: '2024-04-12T10:07:00Z',
        overallRiskScore: 35, // Medium-low risk
        riskAreas: [
            {
                category: 'factual_dispute',
                description: 'Defendant\'s counter-claim regarding "scope creep" presents a genuine factual dispute that could preclude summary judgment on certain issues.',
                severity: 'medium',
                mitigationStrategy: 'Gather more documentation on initial project scope and change order process. Prepare for discovery on this specific point.',
                relatedFactsIds: ['fact-004'],
            },
            {
                category: 'legal_precedent_weakness',
                description: 'Reliance on *Smith v. Jones* (1999) may be challenged if defendant can demonstrate a significant factual distinction, as the case is relatively old in fast-moving tech law.',
                severity: 'low',
                mitigationStrategy: 'Identify more recent precedents supporting "material breach" in tech contracts.',
                relatedPrecedentIds: ['precedent-1'],
            },
        ],
        summary: 'The main risk in this case is the potential for factual disputes regarding scope changes to delay or complicate summary judgment. The legal argument for breach remains strong, but evidentiary support for scope creep needs careful handling.',
        actionableRecommendations: ['Prioritize discovery requests for all communications regarding project scope changes.', 'Draft alternative arguments for trial in case summary judgment is denied.'],
    },
    {
        id: 'risk-002-v1',
        caseId: 'case-002',
        generatedDate: '2024-03-25T11:45:00Z',
        overallRiskScore: 60, // Medium-high risk
        riskAreas: [
            {
                category: 'statutory_interpretation_ambiguity',
                description: 'The interpretation of "federal limits" for pollutants may be contested, especially if MegaCorp Energy has a specific, more lenient permit. This could lead to complex expert witness testimony.',
                severity: 'high',
                mitigationStrategy: 'Consult with environmental law expert and prepare to counter arguments about permit compliance.',
                relatedStatutes: ['USC-33-1311'],
            },
            {
                category: 'client_risk',
                description: 'Public perception and media scrutiny could be a significant factor for MegaCorp Energy, potentially influencing settlement posture even if legal arguments are strong.',
                severity: 'medium',
                mitigationStrategy: 'Advise client on public relations strategy and potential for adverse media coverage.',
            },
        ],
        summary: 'This case carries significant risk due to the potential for complex scientific and legal interpretation challenges regarding pollutant limits, and high public interest could add pressure.',
        actionableRecommendations: ['Engage a leading environmental science expert witness immediately.', 'Develop a strong media strategy in coordination with the client.'],
    }
];

export const MOCK_LEGAL_CONCEPTS: ILegalConcept[] = [
    {
        id: 'concept-1',
        name: 'Material Breach',
        description: 'A violation of a contract that is so serious it defeats the essential purpose of the contract, giving the injured party the right to terminate the contract and sue for damages.',
        relatedStatutes: ['CA-COMM-2200'],
        relatedPrecedents: ['precedent-1'],
        jurisdictions: ['US-FED', 'CA-STATE', 'NY-STATE'],
        keywords: ['contract', 'breach', 'damages', 'performance'],
        parentConceptId: 'contract-law',
        exampleScenarios: ['Failure to deliver goods on time', 'Delivery of defective products']
    },
    {
        id: 'concept-2',
        name: 'Hearsay',
        description: 'An out-of-court statement offered in court to prove the truth of the matter asserted. Generally inadmissible as evidence unless it falls under an exception.',
        relatedStatutes: [],
        relatedPrecedents: [],
        jurisdictions: ['US-FED', 'CA-STATE'],
        keywords: ['evidence', 'admissibility', 'statement'],
        parentConceptId: 'evidence-law',
        exampleScenarios: ['Witness testifying about what someone else told them']
    }
];

export const MOCK_ARGUMENT_TEMPLATES: IArgumentTemplate[] = [
    {
        id: 'template-contract-breach',
        name: 'Breach of Contract (Plaintiff)',
        type: 'claim',
        structure: 'Under the laws of [JURISDICTION], a party asserting breach of contract must demonstrate (1) the existence of a valid contract, (2) plaintiff\'s performance or excuse for non-performance, (3) defendant\'s material breach, and (4) resulting damages. See *[PRECEDENT]*.\n\nHere, [FACT1] establishes a valid contract. Plaintiff performed by [FACT2]. Defendant materially breached by [FACT3]. This breach caused [DAMAGES].',
        exampleUsage: 'Used for initial complaints or motions for summary judgment where contract breach is the primary claim.',
        keywords: ['contract', 'breach', 'plaintiff', 'damages'],
        jurisdictionScope: ['CA-STATE', 'US-FED'],
        requiredFacts: ['contract_existence', 'plaintiff_performance', 'defendant_breach_details', 'damages_incurred']
    },
    {
        id: 'template-summary-judgment-lack-of-fact',
        name: 'Summary Judgment - No Material Fact Dispute (Defendant)',
        type: 'defense',
        structure: 'A party is entitled to summary judgment if there is no genuine dispute as to any material fact and the movant is entitled to judgment as a matter of law. [CITATION_TO_RULE_56]. Plaintiff cannot demonstrate a genuine issue of material fact regarding [SPECIFIC_ISSUE]. Specifically, [FACTUAL_GAP_1] and [FACTUAL_GAP_2] show that [PLAINTIFF_CLAIM] fails as a matter of law.',
        exampleUsage: 'Used by defendants to argue that the plaintiff has insufficient evidence to proceed to trial.',
        keywords: ['summary judgment', 'no genuine dispute', 'material fact', 'defendant'],
        jurisdictionScope: ['US-FED'],
        requiredFacts: ['plaintiff_claim', 'lack_of_evidence_for_claim_element1', 'lack_of_evidence_for_claim_element2']
    }
];

export const MOCK_AGENT_SKILLS: IAgentSkill[] = [
    {
        id: 'skill-research',
        name: 'Legal Research',
        description: 'Conducts comprehensive searches across precedents, statutes, and legal concepts.',
        inputSchema: '{"type": "object", "properties": {"query": {"type": "string"}, "jurisdiction": {"type": "string"}}}',
        outputSchema: '{"type": "array", "items": {"$ref": "#/definitions/IPrecedent", "$ref": "#/definitions/IStatute"}}',
        executionLogic: 'simulated_research_engine',
        isAutonomous: true,
        requiredPermissions: ['read:precedent', 'read:statute'],
        invocationCount: 1500,
        averageRuntimeMs: 350,
    },
    {
        id: 'skill-brief-draft',
        name: 'Brief Drafting',
        description: 'Generates structured legal brief sections based on case data and AI configuration.',
        inputSchema: '{"type": "object", "properties": {"caseId": {"type": "string"}, "aiConfigId": {"type": "string"}, "sectionType": {"type": "string"}}}',
        outputSchema: '{"type": "object", "properties": {"briefSection": {"$ref": "#/definitions/ILegalBriefSection"}}}',
        executionLogic: 'simulated_llm_brief_generator',
        isAutonomous: false, // Requires human oversight for final brief assembly
        requiredPermissions: ['read:casedata', 'write:briefdraft'],
        invocationCount: 800,
        averageRuntimeMs: 1200,
    },
    {
        id: 'skill-compliance-check',
        name: 'Compliance Check',
        description: 'Automated validation of legal documents against predefined compliance rules.',
        inputSchema: '{"type": "object", "properties": {"briefId": {"type": "string"}, "rulesetIds": {"type": "array", "items": {"type": "string"}}}}',
        outputSchema: '{"type": "object", "properties": {"report": {"$ref": "#/definitions/IComplianceCheckReport"}}}',
        executionLogic: 'simulated_compliance_engine',
        isAutonomous: true,
        requiredPermissions: ['read:brief', 'read:compliance_rule', 'write:compliance_report'],
        invocationCount: 400,
        averageRuntimeMs: 200,
    }
];

export const MOCK_AGENT_SERVICE_TOKEN_TRANSACTIONS: IAgentServiceTokenTransaction[] = [
    {
        transactionId: 'txn-1',
        userId: 'user-gj-123',
        agentId: 'gj-agent-brief-v1',
        serviceType: 'brief_generation',
        resourceId: 'brief-001-v1',
        tokenAmount: 500,
        currencyType: 'GJ_AI_CREDIT',
        timestamp: '2024-04-12T10:00:01Z',
        status: 'completed',
        auditLogEntryId: 'audit-1',
        signature: 'txn-sig-1'
    },
    {
        transactionId: 'txn-2',
        userId: 'user-gj-123',
        agentId: 'gj-agent-compliance-v1',
        serviceType: 'compliance_check',
        resourceId: 'compliance-001-v1',
        tokenAmount: 50,
        currencyType: 'GJ_AI_CREDIT',
        timestamp: '2024-04-12T10:05:01Z',
        status: 'completed',
        auditLogEntryId: 'audit-2',
        signature: 'txn-sig-2'
    },
    {
        transactionId: 'txn-3',
        userId: 'user-gj-123',
        agentId: 'gj-agent-brief-v1',
        serviceType: 'brief_generation',
        resourceId: 'brief-002-v1',
        tokenAmount: 400,
        currencyType: 'GJ_AI_CREDIT',
        timestamp: '2024-03-25T11:30:01Z',
        status: 'completed',
        auditLogEntryId: 'audit-201', // Assuming a mock audit log for this brief
        signature: 'txn-sig-3'
    },
];

// #endregion

// #region --- [3] Core AI Agent and Services Simulation ---

/**
 * Simulates a cryptographic signature for data integrity.
 * Business value: Ensures data tamper-evidence and non-repudiation, crucial for legal compliance, auditability, and maintaining trust in automated processes.
 * @param data The data to be signed.
 * @returns A simulated cryptographic signature string.
 */
export function simulateSignature(data: any): string {
    const dataString = JSON.stringify(data);
    // In a real system, this would involve a private key and a hashing algorithm.
    // For simulation, we create a simple hash.
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
        const char = dataString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return `sim-sig-${Math.abs(hash).toString(16)}-${new Date().getTime()}`;
}

/**
 * Manages the current user context, simulating secure identity management.
 * Business value: Provides secure, role-based access control, safeguarding sensitive legal information and ensuring that actions are performed by authorized individuals.
 */
export const UserContext = createContext<IUserContext>(MOCK_GUEST_USER_CONTEXT);

/**
 * Custom hook to access and manage the user context.
 * Business value: Encapsulates user identity and preferences, enabling personalized AI interactions and consistent application of security policies.
 */
export const useUserContext = () => useContext(UserContext);

/**
 * Simulates role-based access control (RBAC).
 * Business value: Enforces granular security policies, preventing unauthorized access to or modification of sensitive legal documents and workflows, critical for data privacy and regulatory compliance.
 * @param user The user context attempting the action.
 * @param requiredRoles The roles required for the action.
 * @param resourceOwnerId Optional: The ID of the user who owns the resource, for ownership-based access.
 * @returns True if the user is authorized, false otherwise.
 */
export function checkUserAuthorization(user: IUserContext, requiredRoles: IUserContext['roles'], resourceOwnerId?: string): boolean {
    if (!user.isAuthenticated) {
        logAgentAction(user.userId, 'ACCESS_ATTEMPT', 'Authentication required', 'Unauthorized', { requiredRoles, resourceOwnerId }, 'failure');
        return false;
    }
    const hasRequiredRole = requiredRoles.some(role => user.roles.includes(role));
    const isOwner = resourceOwnerId && user.userId === resourceOwnerId;

    if (hasRequiredRole || isOwner || user.roles.includes('admin')) {
        logAgentAction(user.userId, 'ACCESS_ATTEMPT', 'Authorization check passed', 'Authorized', { requiredRoles, resourceOwnerId }, 'success');
        return true;
    }

    logAgentAction(user.userId, 'ACCESS_ATTEMPT', 'Authorization check failed', 'Forbidden', { requiredRoles, resourceOwnerId }, 'failure');
    return false;
}

/**
 * Logs an action to the simulated audit trail.
 * Business value: Creates an immutable, auditable record of all system activities, essential for forensic analysis, regulatory compliance, and demonstrating operational integrity.
 * @param userId The ID of the user or agent performing the action.
 * @param action The action performed (e.g., 'BRIEF_GENERATED').
 * @param resourceType The type of resource involved (e.g., 'ILegalBrief').
 * @param resourceId The ID of the resource.
 * @param details Additional details about the action.
 * @param outcome The outcome of the action ('success' or 'failure').
 * @returns The created audit log entry.
 */
export function logAgentAction(
    userId: string | undefined,
    action: string,
    resourceType: string,
    resourceId: string,
    details: { [key: string]: any },
    outcome: IAuditLogEntry['outcome']
): IAuditLogEntry {
    const entry: IAuditLogEntry = {
        id: `audit-${MOCK_AUDIT_LOGS.length + 1}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userId: userId,
        action: action,
        resourceType: resourceType,
        resourceId: resourceId,
        details: details,
        outcome: outcome,
    };
    entry.signature = simulateSignature(entry); // Simulate cryptographic signature
    MOCK_AUDIT_LOGS.push(entry);
    console.log(`[AUDIT] ${entry.action} by ${entry.userId || 'System'} on ${entry.resourceType}:${entry.resourceId} - ${outcome}`);
    return entry;
}

/**
 * Represents a simulated Generative Jurisprudence Agent.
 * Business value: Orchestrates complex legal AI workflows, integrating research, drafting, and compliance capabilities into an autonomous entity, driving end-to-end automation and efficiency.
 */
export class GenerativeJurisprudenceAgent {
    public id: string;
    public name: string;
    private availableSkills: IAgentSkill[];

    /**
     * Constructs a new GenerativeJurisprudenceAgent.
     * @param id Unique identifier for the agent.
     * @param name Human-readable name for the agent.
     * @param skills An array of skills this agent possesses.
     */
    constructor(id: string, name: string, skills: IAgentSkill[]) {
        this.id = id;
        this.name = name;
        this.availableSkills = skills;
        logAgentAction(this.id, 'AGENT_INITIALIZED', 'GenerativeJurisprudenceAgent', this.id, { name }, 'success');
    }

    /**
     * Finds a skill by its ID.
     * @param skillId The ID of the skill to find.
     * @returns The IAgentSkill if found, otherwise undefined.
     */
    private getSkill(skillId: string): IAgentSkill | undefined {
        return this.availableSkills.find(s => s.id === skillId);
    }

    /**
     * Simulates performing a token transaction for a service.
     * Business value: Integrates with the token rail layer to manage AI resource consumption and billing transparently, enabling cost control and monetization of AI services.
     * @param userId The ID of the user requesting the service.
     * @param serviceType The type of service being performed.
     * @param resourceId The ID of the resource being processed.
     * @param tokenAmount The simulated token cost.
     * @returns The generated token transaction.
     */
    private performTokenTransaction(userId: string, serviceType: IAgentServiceTokenTransaction['serviceType'], resourceId: string, tokenAmount: number): IAgentServiceTokenTransaction {
        const auditEntry = logAgentAction(userId, 'TOKEN_TRANSACTION_INITIATED', 'IAgentServiceTokenTransaction', '', { serviceType, resourceId, tokenAmount }, 'success');
        const transaction: IAgentServiceTokenTransaction = {
            transactionId: `txn-${MOCK_AGENT_SERVICE_TOKEN_TRANSACTIONS.length + 1}-${Date.now()}`,
            userId,
            agentId: this.id,
            serviceType,
            resourceId,
            tokenAmount,
            currencyType: 'GJ_AI_CREDIT',
            timestamp: new Date().toISOString(),
            status: 'completed',
            auditLogEntryId: auditEntry.id,
            signature: ''
        };
        transaction.signature = simulateSignature(transaction);
        MOCK_AGENT_SERVICE_TOKEN_TRANSACTIONS.push(transaction);
        logAgentAction(userId, 'TOKEN_TRANSACTION_COMPLETED', 'IAgentServiceTokenTransaction', transaction.transactionId, { status: 'completed' }, 'success');
        return transaction;
    }

    /**
     * Simulates the generation of a legal brief.
     * Business value: The core functionality for automating legal document creation, dramatically reducing drafting time and ensuring consistency.
     * @param caseData The ICaseData to base the brief on.
     * @param aiConfig The IAIConfig to guide generation.
     * @param user The IUserContext initiating the request.
     * @returns A promise resolving to the generated ILegalBrief.
     */
    public async generateLegalBrief(caseData: ICaseData, aiConfig: IAIConfig, user: IUserContext): Promise<ILegalBrief> {
        if (!checkUserAuthorization(user, ['attorney'], caseData.createdByUserId)) {
            throw new Error('Unauthorized to generate brief for this case.');
        }

        const task: IJurisprudenceAgentTask = {
            taskId: `task-brief-gen-${Date.now()}`,
            agentId: this.id,
            taskType: 'generate_brief',
            caseId: caseData.id,
            status: 'in_progress',
            requestedByUserId: user.userId,
            creationDate: new Date().toISOString(),
            priority: 'high',
            configuration: { aiConfigId: aiConfig.id },
        };
        const auditEntry = logAgentAction(user.userId, task.taskType, 'IJurisprudenceAgentTask', task.taskId, { caseId: caseData.id, aiConfigId: aiConfig.id }, 'success');
        task.auditLogEntryIds = [auditEntry.id];

        console.log(`[Agent ${this.name}] Generating brief for case ${caseData.caseName} with config ${aiConfig.name}...`);

        // Simulate complex AI brief generation logic
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000)); // Simulate async AI processing

        const generatedSections: ILegalBriefSection[] = [
            { id: 'sim-sec-intro', title: 'I. Introduction', content: `This brief is generated based on case ${caseData.caseName} and AI config ${aiConfig.name}.`, citations: [], sectionType: 'introduction' },
            {
                id: 'sim-sec-facts', title: 'II. Statement of Facts', content: `Key facts include: ${caseData.facts.map(f => f.description).join('; ')}.`,
                citations: [], sectionType: 'statementOfFacts'
            },
            {
                id: 'sim-sec-arg', title: 'III. Legal Argument', content: `Applying the law from jurisdiction ${caseData.jurisdictionId} and precedents like ${caseData.relevantPrecedentIds[0] || 'N/A'}, the argument supports the desired legal position: "${caseData.desiredLegalPosition}". Tone: ${aiConfig.tone}.`,
                citations: ['Simulated Citation 1', 'Simulated Citation 2'], sectionType: 'legalArgument'
            },
            { id: 'sim-sec-conc', title: 'IV. Conclusion', content: `For these reasons, the requested relief of "${caseData.reliefSought}" should be granted.`, citations: [], sectionType: 'conclusion' }
        ];

        const newBriefId = `brief-${MOCK_LEGAL_BRIEFS.length + 1}-${Date.now()}`;
        const generatedBrief: ILegalBrief = {
            id: newBriefId,
            caseId: caseData.id,
            title: `AI Generated Brief: ${caseData.caseName} - ${aiConfig.name}`,
            briefType: caseData.briefType,
            generatedDate: new Date().toISOString(),
            sections: generatedSections,
            fullTextRaw: generatedSections.map(s => s.title + '\n' + s.content).join('\n\n'),
            citationsList: Array.from(new Set(generatedSections.flatMap(s => s.citations))),
            keywords: [...caseData.keywords, ...aiConfig.name.split(' ').map(w => w.toLowerCase())], // Assuming caseData has keywords now
            generationMetadata: {
                aiModel: 'JurisGen-GPT-4',
                temperature: aiConfig.temperature || 0.7,
                promptTokens: 3000, // Simulated
                completionTokens: 1500, // Simulated
                runtimeMs: Math.floor(Math.random() * 2000) + 1000, // Simulated
                agentId: this.id,
            },
            versionHistoryId: `version-${newBriefId}`,
            legalStrengthScore: Math.floor(Math.random() * 20) + 70, // 70-90
            readabilityScore: Math.floor(Math.random() * 15) + 60, // 60-75
            toneAnalysis: { primaryTone: aiConfig.tone, score: Math.random() * 0.2 + 0.8 },
            generatedByUserId: user.userId,
        };

        MOCK_LEGAL_BRIEFS.push(generatedBrief);
        task.status = 'completed';
        task.completionDate = new Date().toISOString();
        task.result = { briefId: generatedBrief.id };
        logAgentAction(user.userId, 'BRIEF_GENERATED', 'ILegalBrief', generatedBrief.id, { caseId: caseData.id, aiConfigId: aiConfig.id }, 'success');
        this.performTokenTransaction(user.userId, 'brief_generation', generatedBrief.id, generatedBrief.generationMetadata.completionTokens / 3); // Simulate token cost
        return generatedBrief;
    }

    /**
     * Simulates performing compliance checks on a legal brief.
     * Business value: Automates the critical process of validating documents against regulatory and internal standards, drastically reducing compliance risk and manual review overhead.
     * @param brief The ILegalBrief to check.
     * @param complianceRules The IComplianceRule[] to apply.
     * @param user The IUserContext initiating the request.
     * @returns A promise resolving to the IComplianceCheckReport.
     */
    public async performComplianceCheck(brief: ILegalBrief, complianceRules: IComplianceRule[], user: IUserContext): Promise<IComplianceCheckReport> {
        if (!checkUserAuthorization(user, ['attorney', 'compliance_officer'], brief.generatedByUserId)) {
            throw new Error('Unauthorized to perform compliance check on this brief.');
        }

        const task: IJurisprudenceAgentTask = {
            taskId: `task-compliance-check-${Date.now()}`,
            agentId: this.id,
            taskType: 'check_compliance',
            caseId: brief.caseId,
            status: 'in_progress',
            requestedByUserId: user.userId,
            creationDate: new Date().toISOString(),
            priority: 'medium',
            configuration: { briefId: brief.id, rulesCount: complianceRules.length },
        };
        const auditEntry = logAgentAction(user.userId, task.taskType, 'IJurisprudenceAgentTask', task.taskId, { briefId: brief.id, rulesCount: complianceRules.length }, 'success');
        task.auditLogEntryIds = [auditEntry.id];

        console.log(`[Agent ${this.name}] Performing compliance check on brief ${brief.id}...`);
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500)); // Simulate async processing

        const findings = complianceRules.map(rule => {
            const isCompliant = Math.random() > 0.1; // 90% chance of compliance for mock data
            return {
                ruleId: rule.id,
                ruleName: rule.name,
                severity: rule.severity,
                isCompliant: isCompliant,
                details: isCompliant ? 'Compliant with rule.' : `Non-compliant: Simulated error for rule ${rule.name}.`,
                suggestedAction: isCompliant ? undefined : 'Review and correct the identified issue.',
                snippet: isCompliant ? undefined : brief.sections[0]?.content.substring(0, 50) + '...'
            };
        });

        const newReportId = `compliance-${MOCK_COMPLIANCE_REPORTS.length + 1}-${Date.now()}`;
        const report: IComplianceCheckReport = {
            id: newReportId,
            briefId: brief.id,
            generatedDate: new Date().toISOString(),
            status: findings.some(f => !f.isCompliant && f.severity === 'critical') ? 'non-compliant' : (findings.some(f => !f.isCompliant) ? 'pending_review' : 'compliant'),
            findings: findings,
            overallScore: Math.floor((findings.filter(f => f.isCompliant).length / findings.length) * 100),
        };
        MOCK_COMPLIANCE_REPORTS.push(report);

        task.status = 'completed';
        task.completionDate = new Date().toISOString();
        task.result = { reportId: report.id };
        logAgentAction(user.userId, 'COMPLIANCE_CHECK_PERFORMED', 'IComplianceCheckReport', report.id, { briefId: brief.id, status: report.status }, 'success');
        this.performTokenTransaction(user.userId, 'compliance_check', report.id, complianceRules.length * 10); // Simulate token cost
        return report;
    }

    /**
     * Simulates assessing legal risks for a given case.
     * Business value: Proactively identifies potential legal vulnerabilities, enabling strategic adjustments and mitigating adverse outcomes, which can save millions in litigation costs.
     * @param caseData The ICaseData to assess.
     * @param user The IUserContext initiating the request.
     * @returns A promise resolving to the IRiskAssessmentResult.
     */
    public async assessLegalRisk(caseData: ICaseData, user: IUserContext): Promise<IRiskAssessmentResult> {
        if (!checkUserAuthorization(user, ['attorney'], caseData.createdByUserId)) {
            throw new Error('Unauthorized to assess risk for this case.');
        }

        const task: IJurisprudenceAgentTask = {
            taskId: `task-risk-assess-${Date.now()}`,
            agentId: this.id,
            taskType: 'assess_risk',
            caseId: caseData.id,
            status: 'in_progress',
            requestedByUserId: user.userId,
            creationDate: new Date().toISOString(),
            priority: 'high',
            configuration: { caseId: caseData.id },
        };
        const auditEntry = logAgentAction(user.userId, task.taskType, 'IJurisprudenceAgentTask', task.taskId, { caseId: caseData.id }, 'success');
        task.auditLogEntryIds = [auditEntry.id];

        console.log(`[Agent ${this.name}] Assessing legal risk for case ${caseData.caseName}...`);
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1500 + 800)); // Simulate async processing

        const overallRisk = Math.floor(Math.random() * 60) + 20; // 20-80
        const riskAreas: IRiskAssessmentResult['riskAreas'] = [
            {
                category: 'factual_dispute',
                description: `High number of disputed facts (${caseData.facts.filter(f => f.isDisputed).length}) could complicate discovery and trial.`,
                severity: overallRisk > 50 ? 'high' : 'medium',
                mitigationStrategy: 'Focus discovery on resolving key factual disputes.',
                relatedFactsIds: caseData.facts.filter(f => f.isDisputed).map(f => f.id)
            },
            {
                category: 'legal_precedent_weakness',
                description: `Reliance on older precedents or lack of direct binding authority for certain arguments might weaken the case.`,
                severity: overallRisk > 60 ? 'high' : 'medium',
                mitigationStrategy: 'Conduct deeper research for recent, on-point authority.',
                relatedPrecedentIds: caseData.relevantPrecedentIds
            }
        ];

        const newRiskId = `risk-${MOCK_RISK_ASSESSMENTS.length + 1}-${Date.now()}`;
        const assessment: IRiskAssessmentResult = {
            id: newRiskId,
            caseId: caseData.id,
            generatedDate: new Date().toISOString(),
            overallRiskScore: overallRisk,
            riskAreas: riskAreas,
            summary: `Overall legal risk for case ${caseData.caseName} is assessed as ${overallRisk > 50 ? 'moderate to high' : 'low to moderate'}, primarily driven by disputed facts and potential gaps in legal authority.`,
            actionableRecommendations: ['Develop a robust discovery plan.', 'Prepare expert witness testimony if needed.'],
        };
        MOCK_RISK_ASSESSMENTS.push(assessment);

        task.status = 'completed';
        task.completionDate = new Date().toISOString();
        task.result = { riskAssessmentId: assessment.id };
        logAgentAction(user.userId, 'RISK_ASSESSED', 'IRiskAssessmentResult', assessment.id, { caseId: caseData.id, score: assessment.overallRiskScore }, 'success');
        this.performTokenTransaction(user.userId, 'research_query', assessment.id, overallRisk * 5); // Simulate token cost
        return assessment;
    }

    /**
     * Simulates a broader legal research query, leveraging the agent's research skills.
     * Business value: Provides rapid access to relevant legal information, significantly reducing manual research time and improving the quality of legal arguments.
     * @param query The research query string.
     * @param jurisdictionId The ID of the primary jurisdiction for the query.
     * @param user The IUserContext initiating the request.
     * @returns A promise resolving to an array of relevant IPrecedent and IStatute.
     */
    public async conductLegalResearch(query: string, jurisdictionId: string, user: IUserContext): Promise<(IPrecedent | IStatute)[]> {
        if (!checkUserAuthorization(user, ['attorney', 'paralegal'])) {
            throw new Error('Unauthorized to conduct legal research.');
        }

        const researchSkill = this.getSkill('skill-research');
        if (!researchSkill) {
            throw new Error('Agent lacks the "Legal Research" skill.');
        }

        const task: IJurisprudenceAgentTask = {
            taskId: `task-research-${Date.now()}`,
            agentId: this.id,
            taskType: 'research_precedents',
            caseId: 'N/A', // Research may not be tied to a specific case initially
            status: 'in_progress',
            requestedByUserId: user.userId,
            creationDate: new Date().toISOString(),
            priority: 'low',
            configuration: { query, jurisdictionId },
        };
        const auditEntry = logAgentAction(user.userId, task.taskType, 'IJurisprudenceAgentTask', task.taskId, { query, jurisdictionId }, 'success');
        task.auditLogEntryIds = [auditEntry.id];

        console.log(`[Agent ${this.name}] Conducting legal research for query: "${query}" in ${jurisdictionId}...`);
        await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 1000)); // Simulate research time

        // Filter mock data for simulation
        const relevantPrecedents = MOCK_PRECEDENTS.filter(p =>
            p.jurisdiction.includes(jurisdictionId.split('-')[0]) || // Simple jurisdiction match
            p.keywords.some(k => query.toLowerCase().includes(k)) ||
            p.summary.toLowerCase().includes(query.toLowerCase())
        ).slice(0, Math.floor(Math.random() * 3) + 1); // 1-3 results

        const relevantStatutes = MOCK_STATUTES.filter(s =>
            s.jurisdiction.includes(jurisdictionId.split('-')[0]) ||
            s.keywords.some(k => query.toLowerCase().includes(k)) ||
            s.fullText.toLowerCase().includes(query.toLowerCase())
        ).slice(0, Math.floor(Math.random() * 2) + 1); // 1-2 results

        const results = [...relevantPrecedents, ...relevantStatutes];

        task.status = 'completed';
        task.completionDate = new Date().toISOString();
        task.result = { researchResultsCount: results.length, firstResultId: results[0]?.id };
        logAgentAction(user.userId, 'LEGAL_RESEARCH_PERFORMED', 'ResearchQuery', query, { jurisdictionId, resultsCount: results.length }, 'success');
        this.performTokenTransaction(user.userId, 'research_query', query, 200 + results.length * 50); // Simulate token cost
        return results;
    }
}

/**
 * Instantiates the primary Generative Jurisprudence Agent with its available skills.
 * Business value: Centralizes the orchestration of AI-driven legal services, providing a single, powerful entry point for automated legal operations across the platform.
 */
export const primaryJurisprudenceAgent = new GenerativeJurisprudenceAgent('gj-agent-main-v1', 'JurisGen Main Agent', MOCK_AGENT_SKILLS);

// #endregion

/**
 * Generative Jurisprudence View component.
 * Business value: Provides a user interface for interacting with the advanced Generative Jurisprudence AI, allowing legal professionals to initiate brief generation, compliance checks, and risk assessments. This component is the primary interface through which millions in value are unlocked by leveraging AI to automate and enhance legal operations.
 */
export const GenerativeJurisprudenceView: React.FC = () => {
    const [selectedCase, setSelectedCase] = useState<ICaseData | null>(MOCK_CASES_DATA[0]);
    const [selectedAiConfig, setSelectedAiConfig] = useState<IAIConfig | null>(MOCK_AI_CONFIGS[0]);
    const [generatedBrief, setGeneratedBrief] = useState<ILegalBrief | null>(null);
    const [complianceReport, setComplianceReport] = useState<IComplianceCheckReport | null>(null);
    const [riskAssessment, setRiskAssessment] = useState<IRiskAssessmentResult | null>(null);
    const [researchResults, setResearchResults] = useState<(IPrecedent | IStatute)[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const currentUser = useUserContext();

    /**
     * Handles the generation of a legal brief.
     * Business value: Directly triggers the AI's brief generation capability, showcasing the system's ability to produce legal documents on demand.
     */
    const handleGenerateBrief = useCallback(async () => {
        if (!selectedCase || !selectedAiConfig) {
            setError("Please select a case and an AI configuration.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const brief = await primaryJurisprudenceAgent.generateLegalBrief(selectedCase, selectedAiConfig, currentUser);
            setGeneratedBrief(brief);
            console.log("Brief Generated:", brief);
        } catch (err: any) {
            setError(`Failed to generate brief: ${err.message}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [selectedCase, selectedAiConfig, currentUser]);

    /**
     * Handles the initiation of a compliance check.
     * Business value: Demonstrates the automated compliance feature, ensuring generated briefs meet regulatory and internal guidelines before finalization.
     */
    const handleComplianceCheck = useCallback(async () => {
        if (!generatedBrief) {
            setError("Please generate a brief first.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const report = await primaryJurisprudenceAgent.performComplianceCheck(generatedBrief, MOCK_COMPLIANCE_RULES, currentUser);
            setComplianceReport(report);
            console.log("Compliance Report:", report);
        } catch (err: any) {
            setError(`Failed to run compliance check: ${err.message}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [generatedBrief, currentUser]);

    /**
     * Handles the initiation of a risk assessment.
     * Business value: Showcases the AI's capability to proactively identify and categorize legal risks associated with a case, enabling informed strategic decisions.
     */
    const handleRiskAssessment = useCallback(async () => {
        if (!selectedCase) {
            setError("Please select a case first.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const assessment = await primaryJurisprudenceAgent.assessLegalRisk(selectedCase, currentUser);
            setRiskAssessment(assessment);
            console.log("Risk Assessment:", assessment);
        } catch (err: any) {
            setError(`Failed to perform risk assessment: ${err.message}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [selectedCase, currentUser]);

    /**
     * Handles conducting legal research.
     * Business value: Facilitates on-demand, targeted legal research, accelerating information gathering and supporting the AI's argument construction with relevant legal sources.
     */
    const handleLegalResearch = useCallback(async (query: string, jurisdictionId: string) => {
        if (!query || !jurisdictionId) {
            setError("Please provide a research query and jurisdiction.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const results = await primaryJurisprudenceAgent.conductLegalResearch(query, jurisdictionId, currentUser);
            setResearchResults(results);
            console.log("Research Results:", results);
        } catch (err: any) {
            setError(`Failed to conduct legal research: ${err.message}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    /**
     * Provides a visual representation of an audit log entry.
     * Business value: Enhances transparency and debuggability by displaying system activities, crucial for monitoring, troubleshooting, and ensuring accountability.
     */
    const renderAuditLogEntry = (entry: IAuditLogEntry) => (
        <div key={entry.id} className="p-2 border-b border-gray-200 text-sm text-gray-700">
            <p><strong className="text-gray-900">{entry.timestamp}</strong> - <span className={entry.outcome === 'success' ? 'text-green-600' : 'text-red-600'}>{entry.outcome.toUpperCase()}</span>: {entry.action}</p>
            <p className="ml-2">User/Agent: {entry.userId || entry.agentId} | Resource: {entry.resourceType}:{entry.resourceId}</p>
            {entry.details && <p className="ml-2">Details: {JSON.stringify(entry.details)}</p>}
            {entry.signature && <p className="ml-2 text-xs text-gray-500">Signature: {entry.signature.substring(0, 30)}...</p>}
        </div>
    );

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">Generative Jurisprudence AI Platform</h1>
            <p className="text-lg text-gray-700 max-w-2xl">
                Leverage advanced AI to automate legal document generation, ensure compliance, and conduct real-time risk assessments.
                This platform redefines legal operations, driving efficiency and precision.
            </p>

            <Card title="Current User Context" className="bg-white shadow-lg rounded-lg p-6">
                <p><strong>User ID:</strong> {currentUser.userId}</p>
                <p><strong>Username:</strong> {currentUser.userName}</p>
                <p><strong>Firm:</strong> {currentUser.firmName}</p>
                <p><strong>Roles:</strong> {currentUser.roles.join(', ')}</p>
                <p><strong>Authenticated:</strong> {currentUser.isAuthenticated ? 'Yes' : 'No'}</p>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card title="Select Case Data" className="bg-white shadow-lg rounded-lg p-6">
                    <select
                        className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => setSelectedCase(MOCK_CASES_DATA.find(c => c.id === e.target.value) || null)}
                        value={selectedCase?.id || ''}
                    >
                        <option value="">-- Select a Case --</option>
                        {MOCK_CASES_DATA.map((caseItem) => (
                            <option key={caseItem.id} value={caseItem.id}>
                                {caseItem.caseName}
                            </option>
                        ))}
                    </select>
                    {selectedCase && (
                        <div className="space-y-2">
                            <p><strong>Summary:</strong> {selectedCase.caseSummary}</p>
                            <p><strong>Jurisdiction:</strong> {MOCK_JURISDICTIONS.find(j => j.id === selectedCase.jurisdictionId)?.name}</p>
                            <p><strong>Desired Position:</strong> {selectedCase.desiredLegalPosition}</p>
                            <p><strong>Filing Deadline:</strong> {new Date(selectedCase.filingDeadline!).toLocaleDateString()}</p>
                        </div>
                    )}
                </Card>

                <Card title="Select AI Configuration" className="bg-white shadow-lg rounded-lg p-6">
                    <select
                        className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => setSelectedAiConfig(MOCK_AI_CONFIGS.find(cfg => cfg.id === e.target.value) || null)}
                        value={selectedAiConfig?.id || ''}
                    >
                        <option value="">-- Select an AI Config --</option>
                        {MOCK_AI_CONFIGS.map((aiConfig) => (
                            <option key={aiConfig.id} value={aiConfig.id}>
                                {aiConfig.name} (Tone: {aiConfig.tone})
                            </option>
                        ))}
                    </select>
                    {selectedAiConfig && (
                        <div className="space-y-2">
                            <p><strong>Tone:</strong> {selectedAiConfig.tone}</p>
                            <p><strong>Length:</strong> {selectedAiConfig.lengthPreference}</p>
                            <p><strong>Citation Style:</strong> {selectedAiConfig.citationStyle}</p>
                            <p><strong>Audience:</strong> {selectedAiConfig.targetAudience}</p>
                        </div>
                    )}
                </Card>
            </div>

            <Card title="AI Actions" className="bg-white shadow-lg rounded-lg p-6">
                {error && <div className="p-4 mb-4 bg-red-100 text-red-700 border border-red-200 rounded-md">{error}</div>}
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={handleGenerateBrief}
                        disabled={loading || !selectedCase || !selectedAiConfig || !currentUser.isAuthenticated}
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                    >
                        {loading ? 'Generating...' : 'Generate Legal Brief'}
                    </button>
                    <button
                        onClick={handleComplianceCheck}
                        disabled={loading || !generatedBrief || !currentUser.isAuthenticated}
                        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-green-300 transition-colors"
                    >
                        {loading ? 'Checking...' : 'Run Compliance Check'}
                    </button>
                    <button
                        onClick={handleRiskAssessment}
                        disabled={loading || !selectedCase || !currentUser.isAuthenticated}
                        className="px-6 py-3 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-700 disabled:bg-yellow-300 transition-colors"
                    >
                        {loading ? 'Assessing...' : 'Assess Legal Risk'}
                    </button>
                    <input
                        type="text"
                        placeholder="Research Query (e.g., 'breach of contract')"
                        className="p-3 border border-gray-300 rounded-md flex-grow min-w-[200px]"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleLegalResearch(e.currentTarget.value, selectedCase?.jurisdictionId || MOCK_USER_CONTEXT.defaultJurisdictionId);
                            }
                        }}
                    />
                    <button
                        onClick={() => handleLegalResearch(
                            (document.querySelector('input[placeholder="Research Query (e.g., \'breach of contract\')"]') as HTMLInputElement)?.value,
                            selectedCase?.jurisdictionId || MOCK_USER_CONTEXT.defaultJurisdictionId
                        )}
                        disabled={loading || !currentUser.isAuthenticated}
                        className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-purple-300 transition-colors"
                    >
                        {loading ? 'Researching...' : 'Conduct Legal Research'}
                    </button>
                </div>
            </Card>

            {generatedBrief && (
                <Card title={`Generated Brief: ${generatedBrief.title}`} className="bg-white shadow-lg rounded-lg p-6">
                    <div className="max-h-96 overflow-y-auto border border-gray-200 p-4 rounded-md bg-gray-50 text-gray-800">
                        {generatedBrief.sections.map((section, index) => (
                            <div key={section.id} className="mb-4">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h3>
                                <p className="text-base leading-relaxed whitespace-pre-wrap">{section.content}</p>
                                {section.citations.length > 0 && (
                                    <p className="text-sm text-gray-600 mt-1">Citations: {section.citations.join(', ')}</p>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                        <p><strong>Strength Score:</strong> {generatedBrief.legalStrengthScore}%</p>
                        <p><strong>Readability:</strong> {generatedBrief.readabilityScore}</p>
                        <p><strong>Suggested Revisions:</strong> {generatedBrief.suggestedRevisions?.join('; ') || 'None'}</p>
                    </div>
                </Card>
            )}

            {complianceReport && (
                <Card title={`Compliance Report for Brief: ${complianceReport.briefId}`} className="bg-white shadow-lg rounded-lg p-6">
                    <p className="text-lg"><strong>Overall Status:</strong> <span className={`font-bold ${complianceReport.status === 'compliant' ? 'text-green-600' : 'text-red-600'}`}>{complianceReport.status.toUpperCase()}</span> ({complianceReport.overallScore}%)</p>
                    <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
                        {complianceReport.findings.map((finding, index) => (
                            <div key={index} className="p-3 border border-gray-100 rounded-md bg-gray-50">
                                <p><strong>Rule:</strong> {finding.ruleName} ({finding.severity})</p>
                                <p><strong>Compliant:</strong> {finding.isCompliant ? 'Yes' : 'No'}</p>
                                <p><strong>Details:</strong> {finding.details}</p>
                                {finding.suggestedAction && <p className="text-orange-700"><strong>Action:</strong> {finding.suggestedAction}</p>}
                                {finding.snippet && <p className="text-xs text-gray-500">Snippet: "{finding.snippet}"</p>}
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {riskAssessment && (
                <Card title={`Risk Assessment for Case: ${riskAssessment.caseId}`} className="bg-white shadow-lg rounded-lg p-6">
                    <p className="text-lg"><strong>Overall Risk Score:</strong> <span className={`font-bold ${riskAssessment.overallRiskScore > 50 ? 'text-red-600' : 'text-green-600'}`}>{riskAssessment.overallRiskScore}%</span></p>
                    <p className="mt-2 text-gray-700"><strong>Summary:</strong> {riskAssessment.summary}</p>
                    <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
                        {riskAssessment.riskAreas.map((area, index) => (
                            <div key={index} className="p-3 border border-gray-100 rounded-md bg-gray-50">
                                <p><strong>Category:</strong> {area.category} (Severity: <span className={`${area.severity === 'critical' ? 'text-red-800' : area.severity === 'high' ? 'text-orange-700' : 'text-yellow-600'}`}>{area.severity}</span>)</p>
                                <p><strong>Description:</strong> {area.description}</p>
                                {area.mitigationStrategy && <p className="text-blue-700"><strong>Mitigation:</strong> {area.mitigationStrategy}</p>}
                            </div>
                        ))}
                    </div>
                    {riskAssessment.actionableRecommendations && riskAssessment.actionableRecommendations.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-bold text-gray-900">Actionable Recommendations:</h4>
                            <ul className="list-disc list-inside text-gray-700">
                                {riskAssessment.actionableRecommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                            </ul>
                        </div>
                    )}
                </Card>
            )}

            {researchResults.length > 0 && (
                <Card title="Legal Research Results" className="bg-white shadow-lg rounded-lg p-6">
                    <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
                        {researchResults.map((result, index) => (
                            <div key={index} className="p-3 border border-gray-100 rounded-md bg-gray-50">
                                {('caseName' in result) ? (
                                    <>
                                        <p className="font-semibold text-blue-700">{result.caseName}</p>
                                        <p className="text-sm text-gray-600">Citation: {result.citation}</p>
                                        <p className="text-sm text-gray-800">Summary: {result.summary.substring(0, 150)}...</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-semibold text-green-700">{result.name}</p>
                                        <p className="text-sm text-gray-600">Citation: {result.citation}, Section: {result.section}</p>
                                        <p className="text-sm text-gray-800">Text: {result.fullText.substring(0, 150)}...</p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            <Card title="Simulated Audit Log (Recent Entries)" className="bg-white shadow-lg rounded-lg p-6">
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md bg-gray-50">
                    {MOCK_AUDIT_LOGS.slice(-10).reverse().map(renderAuditLogEntry)}
                </div>
                <p className="mt-4 text-sm text-gray-600">Total Audit Entries: {MOCK_AUDIT_LOGS.length}</p>
            </Card>

            <Card title="Simulated Token Transactions (Recent Entries)" className="bg-white shadow-lg rounded-lg p-6">
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md bg-gray-50">
                    {MOCK_AGENT_SERVICE_TOKEN_TRANSACTIONS.slice(-10).reverse().map(txn => (
                        <div key={txn.transactionId} className="p-2 border-b border-gray-200 text-sm text-gray-700">
                            <p><strong className="text-gray-900">{txn.timestamp}</strong> - <span className="text-blue-600">{txn.serviceType.toUpperCase()}</span> by {txn.userId}: {txn.tokenAmount} {txn.currencyType}</p>
                            <p className="ml-2">Resource: {txn.resourceId} | Status: {txn.status}</p>
                            <p className="ml-2 text-xs text-gray-500">Signature: {txn.signature.substring(0, 30)}...</p>
                        </div>
                    ))}
                </div>
                <p className="mt-4 text-sm text-gray-600">Total Token Transactions: {MOCK_AGENT_SERVICE_TOKEN_TRANSACTIONS.length}</p>
            </Card>
        </div>
    );
};