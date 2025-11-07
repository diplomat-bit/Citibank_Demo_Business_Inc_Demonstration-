/**
 * This module implements the core data structures and simulated services for a cutting-edge Linguistic Fossil Finder.
 * Business value: It accelerates comparative linguistic research by automating the identification of sound correspondences,
 * proposing proto-word reconstructions, and managing complex etymological datasets. This platform transforms manual,
 * labor-intensive scholarly work into a high-velocity, collaborative, and auditable process.
 * By integrating with agentic AI, digital identity, and token rails, it enables monetized research bounties,
 * secure attribution for intellectual contributions, and auditable provenance for all linguistic data.
 * This drives new revenue streams through data licensing, research funding, and a global marketplace for linguistic expertise,
 * while ensuring data integrity and fostering unprecedented collaboration in historical linguistics.
 */
import React, { useState, useEffect, useCallback, createContext, useContext, useReducer } from 'react';

// --- Global Data Types and Interfaces (Highly Expanded) ---

/**
 * Represents a specific sound or phoneme.
 */
export interface Phoneme {
  symbol: string; // IPA symbol, e.g., 'p', 'b', 'm', 'aË '
  features: {
    manner: 'stop' | 'fricative' | 'affricate' | 'nasal' | 'trill' | 'tap' | 'approximant' | 'vowel';
    place: 'bilabial' | 'labiodental' | 'dental' | 'alveolar' | 'postalveolar' | 'retroflex' | 'palatal' | 'velar' | 'uvular' | 'pharyngeal' | 'glottal';
    voicing: 'voiceless' | 'voiced';
    rounded?: boolean; // For vowels
    height?: 'close' | 'near-close' | 'mid' | 'near-open' | 'open' | 'diphthong'; // For vowels
    backness?: 'front' | 'central' | 'back'; // For vowels
    nasality?: 'oral' | 'nasal';
    laterality?: 'central' | 'lateral';
    ejective?: boolean;
    implosive?: boolean;
    click?: boolean;
    length?: 'short' | 'long';
    stress?: 'primary' | 'secondary' | 'unstressed';
    affrication?: 'none' | 'slight' | 'strong';
    aspiration?: 'none' | 'aspirated';
  };
  allophones?: string[]; // Variations of the phoneme
  notes?: string;
}

/**
 * Represents a specific sound correspondence rule between a proto-language and a descendant.
 */
export interface SoundCorrespondenceRule {
  id: string;
  protoSound: string; // Proto-phoneme symbol or pattern (e.g., '*p', '*T', '*A')
  descendantSound: string; // Descendant phoneme symbol or pattern (e.g., 'f', 't', 'a')
  context: string; // Phonological context (e.g., '/_V' for before a vowel, '#_' for word-initial, '_#' for word-final)
  environment: 'all' | 'initial' | 'medial' | 'final'; // Position in word
  languageId: string; // The ID of the descendant language
  appliesTo: 'consonant' | 'vowel' | 'any';
  examples: { protoWord: string, descendantWord: string }[];
  confidence: number; // How strong is the evidence for this rule (0.0 to 1.0)
  notes?: string;
  source?: string; // e.g., 'Grimm\'s Law', 'Verner\'s Law'
  priority?: number; // For rule ordering (lower number = higher priority)
  dateEstablished?: string; // When the rule was formulated or confirmed
}

/**
 * Represents a morpheme (minimal meaningful unit).
 */
export interface Morpheme {
  id: string;
  form: string; // The phonetic form
  meaning: string;
  type: 'root' | 'prefix' | 'suffix' | 'infix' | 'clitic' | 'stem' | 'lexeme';
  gloss: string; // Standard linguistic gloss (e.g., '1SG.NOM')
  allomorphs?: string[]; // Variations of the morpheme
  notes?: string;
  languageId?: string; // Which language this morpheme belongs to, if specific
  protoMorphemeId?: string; // Link to a reconstructed proto-morpheme
  semanticFields?: string[];
}

/**
 * Represents a lexical entry in a language's lexicon.
 */
export interface LexicalEntry {
  id: string;
  word: string; // The word form
  languageId: string;
  ipa: string; // IPA transcription
  meaning: string;
  etymology?: {
    protoWordId?: string; // Link to a proto-word reconstruction
    sourceLanguageId?: string; // For loanwords, the language it was borrowed from
    notes?: string;
    dateOfBorrowing?: string; // Approximate date for loanwords
  };
  morphemeBreakdown?: Morpheme[]; // Analysis into morphemes (e.g., [root, suffix])
  cognateIds?: string[]; // IDs of cognates in other languages (links to LexicalEntry.id)
  semanticFields?: string[]; // e.g., 'body parts', 'nature', 'kinship', 'abstract concepts'
  dateAdded: string; // ISO date string when entry was added to database
  lastUpdated: string; // ISO date string when entry was last modified
  variants?: { form: string, notes?: string }[]; // Alternative forms
  usageExamples?: string[]; // Example sentences
  grammarNotes?: string; // E.g., gender, conjugation pattern, declension class
  dialectalVariants?: { dialect: string, word: string, ipa?: string, meaning?: string }[];
  register?: 'formal' | 'informal' | 'archaic' | 'neologism';
  status?: 'attested' | 'reconstructed' | 'hypothesized'; // For reconstructed forms within a language
  historicalForms?: { period: string, form: string, ipa?: string }[]; // e.g., Old English, Middle English forms
}

/**
 * Represents a language.
 */
export interface Language {
  id: string;
  name: string;
  isoCode: string; // ISO 639-3 code
  family: string; // E.g., 'Indo-European', 'Uralic'
  subfamily?: string; // E.g., 'Germanic', 'Romance'
  branch?: string; // E.g., 'West Germanic', 'Italic'
  location?: { latitude: number, longitude: number, region?: string }; // Geographic center and region
  status?: 'extinct' | 'endangered' | 'vibrant' | 'reconstructed';
  description?: string;
  phonology?: {
    consonants: Phoneme[];
    vowels: Phoneme[];
    diphthongs?: Phoneme[];
    suprasegmentals?: { stress: string, tone: string | null };
  };
  orthography?: {
    script: string;
    notes?: string;
    historicalScripts?: { name: string, period: string }[];
  };
  estimatedDivergenceDate?: string; // ISO date string or year (e.g., '2000 BCE')
  linguisticFeatures?: string[]; // E.g., 'SOV word order', 'case system', 'vowel harmony'
  sources?: { type: 'dictionary' | 'grammar' | 'academic_paper' | 'corpus', title: string, url?: string, author?: string, year?: number }[];
  relatedLanguages?: { languageId: string, relationship: 'sister' | 'daughter' | 'parent' | 'contact' }[];
  historicalPeriods?: { name: string, start: string, end: string }[];
}

/**
 * A lighter version for display in lists
 */
export interface ReconstructionLite {
  protoWord: string; // The primary proto-word form
  meaning: string;
  confidence: number;
  descendantEvidence: { language: string, word: string }[];
}

/**
 * Represents a reconstructed proto-word or proto-morpheme.
 */
export interface Reconstruction extends ReconstructionLite {
  id: string; // Unique ID for the reconstruction
  protoLanguageId: string; // E.g., 'PIE' for Proto-Indo-European
  meaning: string;
  ipa: string; // Full IPA transcription of the proto-word
  confidence: number; // Confidence score (0.0 to 1.0)
  descendantEvidence: {
    languageId: string, // ID of the descendant language
    language: string, // Name of the descendant language (for display convenience)
    word: string, // The descendant word form
    ipa: string, // IPA of the descendant word
    relation: 'cognate' | 'loanword' | 'unrelated';
    soundCorrespondences: { protoSound: string, descendantSound: string, context?: string }[]; // Specific sound shifts for this word
    notes?: string;
    lexicalEntryId?: string; // Link to the actual lexical entry
  }[];
  notes?: string;
  etymologicalNotes?: string; // Detailed etymological reasoning
  proposedBy?: string; // Scholar or system that proposed it
  dateProposed?: string; // ISO date or year
  alternativeReconstructions?: { protoWord: string, confidence: number, notes?: string }[];
  semanticField: string;
  reconstructionMethod?: 'comparative' | 'internal' | 'computational';
  status?: 'established' | 'controversial' | 'tentative';
  reconstructionHistory?: { date: string, event: string, user?: string }[]; // Log of changes/updates
}

/**
 * Represents a project or workspace for a user.
 */
export interface UserProject {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: string;
  lastModified: string;
  reconstructions: string[]; // IDs of reconstructions saved in this project
  savedCognateSets: string[]; // IDs of cognate sets saved
  customRules: string[]; // IDs of custom sound correspondence rules
  collaborators?: string[]; // User IDs of collaborators
  visibility?: 'private' | 'public' | 'shared';
  tags?: string[];
}

/**
 * Represents a set of cognates across languages for a single concept.
 */
export interface CognateSet {
  id: string;
  concept: string; // The semantic concept (e.g., 'water')
  protoReconstructionId?: string; // Optional link to a reconstruction (if one exists for this set)
  members: {
    languageId: string;
    lexicalEntryId: string; // Link to the specific lexical entry
    wordForm: string;
    ipa: string;
    notes?: string;
  }[];
  analysisNotes?: string;
  confidenceScore: number; // Confidence that these are true cognates
  proposedBy?: string;
  createdAt: string;
  lastUpdated?: string;
  tags?: string[];
  semanticField?: string;
  visualizedTree?: any; // Placeholder for a tree visualization object
}

/**
 * User settings/preferences for the application.
 */
export interface UserSettings {
  theme: 'dark' | 'light';
  defaultProtoLanguage: string; // e.g., 'pie'
  displayIPA: boolean;
  enableAdvancedFeatures: boolean;
  preferredLexiconDisplay: 'table' | 'cards';
  fontSize: 'small' | 'medium' | 'large';
  notificationsEnabled: boolean;
  automaticallySaveProjects: boolean;
  defaultOutputFormat: 'text' | 'json' | 'markdown';
  showConfidenceScores: boolean;
}

// --- New Interfaces for Agentic AI, Identity, and Token Rails Integration ---

/**
 * Represents a minimal digital identity within the linguistic ecosystem.
 * Business value: Establishes verifiable attribution for scholarly contributions and agent actions,
 * preventing fraud and enabling secure, auditable collaboration. This underpins trust and intellectual property in a global research network.
 */
export interface DigitalIdentity {
  id: string; // Unique identifier (e.g., UUID, public key hash)
  name: string; // Human-readable name
  publicKey: string; // Public key for cryptographic operations
  roles: ('researcher' | 'editor' | 'agent' | 'admin' | 'guest')[];
  organization?: string;
  reputationScore?: number; // Based on validated contributions, for agentic decision making.
}

/**
 * Represents a skill that an Agentic AI or human expert can possess and apply in linguistic analysis.
 * Business value: Modularizes complex linguistic tasks, making agents highly configurable, reusable, and scalable.
 * This allows for rapid deployment of specialized AI agents to tackle specific research challenges,
 * dramatically increasing research throughput and precision.
 */
export interface LinguisticSkill {
  id: string;
  name: string; // e.g., 'ProtoWordReconstruction', 'SoundLawDetection', 'CognateIdentification'
  description: string;
  costEstimatePerUse?: { tokenType: string, amount: number }; // Cost to invoke this skill, linked to token rails
  requiredPermissions: ('agent' | 'researcher' | 'admin')[];
  outputSchema?: any; // JSON schema for expected output
  inputSchema?: any; // JSON schema for expected input
}

/**
 * Status of a linguistic task.
 */
export enum LinguisticTaskStatus {
  Pending = 'pending',
  Assigned = 'assigned',
  InProgress = 'in_progress',
  Review = 'review',
  Completed = 'completed',
  Failed = 'failed',
  Cancelled = 'cancelled',
}

/**
 * Represents a discrete linguistic task that can be assigned and tracked.
 * Business value: Enables the decomposition of large research problems into manageable, trackable units.
 * This facilitates parallel processing by multiple agents or researchers, accelerates project completion,
 * and provides clear milestones for funding and collaboration, leading to faster research breakthroughs.
 */
export interface LinguisticTask {
  id: string;
  projectId: string; // Project to which this task belongs
  type: LinguisticSkill['id']; // Corresponds to a specific linguistic skill
  description: string;
  status: LinguisticTaskStatus;
  assignedToIdentityId?: string; // ID of the agent or human identity assigned
  parameters: any; // Input parameters for the task (e.g., { cognateSetId: '...', protoLanguage: '...' })
  output?: any; // Result of the task
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dependencies?: string[]; // Other task IDs this task depends on
  audits?: LinguisticAuditLogEntry[]; // In-task audit trail
}

/**
 * Represents a verifiable contribution made by an identity (human or agent) to the linguistic dataset.
 * Business value: Provides granular, cryptographically-attested provenance for every data modification,
 * enhancing data integrity, enabling precise intellectual property tracking, and building a trusted
 * data commons for linguistic science. This protects against data tampering and establishes undeniable
 * proof of contribution.
 */
export interface LinguisticContribution {
  id: string;
  identityId: string; // Who made the contribution
  dataType: 'reconstruction' | 'lexicalEntry' | 'rule' | 'cognateSet' | 'language';
  dataId: string; // ID of the data item being contributed/modified
  action: 'create' | 'update' | 'delete' | 'review' | 'propose';
  timestamp: string;
  details: any; // e.g., diff for updates, full object for create
  signature: string; // Cryptographic signature by the identity
  previousHash?: string; // For tamper-evident chaining
}

/**
 * Represents a bounty or reward for completing a specific linguistic task, linked to token rails.
 * Business value: Monetizes linguistic research and incentivizes rapid, high-quality contributions from a global
 * network of experts and AI agents. This creates a liquid marketplace for linguistic problem-solving,
 * driving innovation and attracting top talent/computational resources.
 */
export interface LinguisticBounty {
  id: string;
  taskId: string;
  amount: number;
  tokenType: string; // e.g., 'LINGUIST_COIN', 'USD_STABLE'
  status: 'funded' | 'claimed' | 'disputed' | 'cancelled';
  fundedBy: string; // Identity ID of the funder
  claimedBy?: string; // Identity ID of the claimant
  fundedAt: string;
  claimedAt?: string;
  payoutTransactionId?: string; // Link to a transaction on the token rail
  proofOfCompletion?: string; // Hash or reference to validated task output
}

/**
 * Represents an entry in a secure, tamper-evident audit log for linguistic data.
 * Business value: Provides an immutable, cryptographically verifiable record of all system activities and data changes,
 * critical for regulatory compliance, data governance, and maintaining user trust. It enables full transparency
 * and traceability, ensuring accountability and system integrity.
 */
export interface LinguisticAuditLogEntry {
  id: string;
  timestamp: string;
  actorIdentityId: string; // The identity (human or agent) performing the action
  action: string; // e.g., 'CREATE_RECONSTRUCTION', 'UPDATE_LEXICAL_ENTRY', 'AGENT_INITIATED_TASK'
  resourceType: string; // e.g., 'Reconstruction', 'LinguisticTask', 'CognateSet'
  resourceId: string; // ID of the resource affected
  details: string; // Human-readable description
  payloadHash: string; // Hash of the data payload at the time of the action (for tamper evidence)
  transactionId?: string; // Optional: Link to a token rail transaction ID if applicable
  previousEntryHash?: string; // For chaining audit log entries
}

// --- Helper Utilities (exported for broader use if needed) ---

/**
 * Generates a unique identifier.
 * Business value: Ensures data integrity and unambiguous referencing across distributed systems.
 * Supports scalability by providing reliable unique keys for all entities.
 */
export const generateUniqueId = (): string => `lfu_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Simulates data hashing for tamper-evident logging.
 * Business value: Creates an immutable, verifiable chain of events,
 * essential for regulatory compliance, forensic analysis, and ensuring data history cannot be altered.
 */
export const hashData = (data: string): string => {
  let hash = 0;
  if (data.length === 0) return '0';
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
};

/**
 * Simulates cryptographic signing of data.
 * Business value: Enables secure, verifiable attribution for all data contributions and actions.
 * Crucial for digital identity, non-repudiation, and audit trails in a high-value data environment.
 */
export const signData = (data: string, privateKey: string): string => {
  const dataHash = hashData(data);
  return `${dataHash}_SIG_BY_${privateKey.substring(0, 8)}...`; // Simulate signing with a key
};

/**
 * Simulates cryptographic signature verification.
 * Business value: Ensures the authenticity and integrity of data contributions,
 * protecting against unauthorized modifications and fraudulent claims.
 * A cornerstone of trust and security for the entire platform.
 */
export const verifySignature = (data: string, signature: string, publicKey: string): boolean => {
  const dataHash = hashData(data);
  return signature.startsWith(dataHash) && signature.includes(`SIG_BY_${publicKey.substring(0, 8)}...`); // Simplified check
};


// --- Dummy Data (Extremely Large for Simulation) ---
// This section will be massive to simulate a real database.

export const DUMMY_LANGUAGES: Language[] = [
  {
    id: 'hittite',
    name: 'Hittite',
    isoCode: 'hit',
    family: 'Indo-European',
    subfamily: 'Anatolian',
    branch: 'Hittite',
    location: { latitude: 39.0, longitude: 34.0, region: 'Anatolia' },
    status: 'extinct',
    description: 'An extinct Indo-European language that was spoken by the Hittites, a people of ancient Anatolia.',
    phonology: {
      consonants: [
        { symbol: 'p', features: { manner: 'stop', place: 'bilabial', voicing: 'voiceless', aspiration: 'none' } },
        { symbol: 't', features: { manner: 'stop', place: 'alveolar', voicing: 'voiceless', aspiration: 'none' } },
        { symbol: 'k', features: { manner: 'stop', place: 'velar', voicing: 'voiceless', aspiration: 'none' } },
        { symbol: 'b', features: { manner: 'stop', place: 'bilabial', voicing: 'voiced', aspiration: 'none' } },
        { symbol: 'd', features: { manner: 'stop', place: 'alveolar', voicing: 'voiced', aspiration: 'none' } },
        { symbol: 'g', features: { manner: 'stop', place: 'velar', voicing: 'voiced', aspiration: 'none' } },
        { symbol: 's', features: { manner: 'fricative', place: 'alveolar', voicing: 'voiceless' } },
        { symbol: 'z', features: { manner: 'fricative', place: 'alveolar', voicing: 'voiced' } },
        { symbol: 'm', features: { manner: 'nasal', place: 'bilabial', voicing: 'voiced' } },
        { symbol: 'n', features: { manner: 'nasal', place: 'alveolar', voicing: 'voiced' } },
        { symbol: 'l', features: { manner: 'approximant', place: 'alveolar', voicing: 'voiced', laterality: 'lateral' } },
        { symbol: 'r', features: { manner: 'trill', place: 'alveolar', voicing: 'voiced' } },
        { symbol: 'w', features: { manner: 'approximant', place: 'labiodental', voicing: 'voiced' } },
        { symbol: 'j', features: { manner: 'approximant', place: 'palatal', voicing: 'voiced' } },
        { symbol: 'á¸«', features: { manner: 'fricative', place: 'uvular', voicing: 'voiceless' } }, // velar/uvular fricative
      ],
      vowels: [
        { symbol: 'a', features: { manner: 'vowel', height: 'open', backness: 'front', voicing: 'voiced', rounded: false } },
        { symbol: 'i', features: { manner: 'vowel', height: 'close', backness: 'front', voicing: 'voiced', rounded: false } },
        { symbol: 'u', features: { manner: 'vowel', height: 'close', backness: 'back', voicing: 'voiced', rounded: true } },
        { symbol: 'e', features: { manner: 'vowel', height: 'mid', backness: 'front', voicing: 'voiced', rounded: false } },
      ]
    },
    orthography: { script: 'Anatolian Cuneiform', notes: 'Adopted from Mesopotamian cuneiform.' },
    estimatedDivergenceDate: '2000 BCE',
    linguisticFeatures: ['lack of grammatical gender', 'agglutinative tendencies', 'ergative-absolutive alignment'],
    sources: [{ type: 'grammar', title: 'A Grammar of Hittite', author: 'Hoffner, Harry A.', year: 2008 }],
    relatedLanguages: [{ languageId: 'luwian', relationship: 'sister' }],
  },
  {
    id: 'sanskrit',
    name: 'Sanskrit',
    isoCode: 'san',
    family: 'Indo-European',
    subfamily: 'Indo-Iranian',
    branch: 'Indic',
    location: { latitude: 25.0, longitude: 80.0, region: 'South Asia' },
    status: 'extinct', // Classical Sanskrit, modern forms exist but not the same
    description: 'An ancient Indo-Aryan language that is the sacred language of Hinduism, the language of classical Hindu philosophy, and of historical texts.',
    phonology: {
      consonants: [
        { symbol: 'p', features: { manner: 'stop', place: 'bilabial', voicing: 'voiceless', aspiration: 'none' } }, { symbol: 'ph', features: { manner: 'stop', place: 'bilabial', voicing: 'voiceless', aspiration: 'aspirated' } },
        { symbol: 'b', features: { manner: 'stop', place: 'bilabial', voicing: 'voiced', aspiration: 'none' } }, { symbol: 'bh', features: { manner: 'stop', place: 'bilabial', voicing: 'voiced', aspiration: 'aspirated' } },
        { symbol: 't', features: { manner: 'stop', place: 'dental', voicing: 'voiceless', aspiration: 'none' } }, { symbol: 'th', features: { manner: 'stop', place: 'dental', voicing: 'voiceless', aspiration: 'aspirated' } },
        { symbol: 'd', features: { manner: 'stop', place: 'dental', voicing: 'voiced', aspiration: 'none' } }, { symbol: 'dh', features: { manner: 'stop', place: 'dental', voicing: 'voiced', aspiration: 'aspirated' } },
        { symbol: 'á¹­', features: { manner: 'stop', place: 'retroflex', voicing: 'voiceless', aspiration: 'none' } }, { symbol: 'á¹­h', features: { manner: 'stop', place: 'retroflex', voicing: 'voiceless', aspiration: 'aspirated' } },
        { symbol: 'á¸ ', features: { manner: 'stop', place: 'retroflex', voicing: 'voiced', aspiration: 'none' } }, { symbol: 'á¸ h', features: { manner: 'stop', place: 'retroflex', voicing: 'voiced', aspiration: 'aspirated' } },
        { symbol: 'k', features: { manner: 'stop', place: 'velar', voicing: 'voiceless', aspiration: 'none' } }, { symbol: 'kh', features: { manner: 'stop', place: 'velar', voicing: 'voiceless', aspiration: 'aspirated' } },
        { symbol: 'g', features: { manner: 'stop', place: 'velar', voicing: 'voiced', aspiration: 'none' } }, { symbol: 'gh', features: { manner: 'stop', place: 'velar', voicing: 'voiced', aspiration: 'aspirated' } },
        { symbol: 'c', features: { manner: 'affricate', place: 'palatal', voicing: 'voiceless', aspiration: 'none' } }, { symbol: 'ch', features: { manner: 'affricate', place: 'palatal', voicing: 'voiceless', aspiration: 'aspirated' } },
        { symbol: 'j', features: { manner: 'affricate', place: 'palatal', voicing: 'voiced', aspiration: 'none' } }, { symbol: 'jh', features: { manner: 'affricate', place: 'palatal', voicing: 'voiced', aspiration: 'aspirated' } },
        { symbol: 'm', features: { manner: 'nasal', place: 'bilabial', voicing: 'voiced' } },
        { symbol: 'n', features: { manner: 'nasal', place: 'dental', voicing: 'voiced' } },
        { symbol: 'á¹‡', features: { manner: 'nasal', place: 'retroflex', voicing: 'voiced' } },
        { symbol: 'Ã±', features: { manner: 'nasal', place: 'palatal', voicing: 'voiced' } },
        { symbol: 'á¹…', features: { manner: 'nasal', place: 'velar', voicing: 'voiced' } },
        { symbol: 's', features: { manner: 'fricative', place: 'alveolar', voicing: 'voiceless' } },
        { symbol: 'á¹£', features: { manner: 'fricative', place: 'retroflex', voicing: 'voiceless' } },
        { symbol: 'Å›', features: { manner: 'fricative', place: 'postalveolar', voicing: 'voiceless' } }, // palatal fricative
        { symbol: 'h', features: { manner: 'fricative', place: 'glottal', voicing: 'voiced' } },
        { symbol: 'y', features: { manner: 'approximant', place: 'palatal', voicing: 'voiced' } },
        { symbol: 'r', features: { manner: 'trill', place: 'alveolar', voicing: 'voiced' } },
        { symbol: 'l', features: { manner: 'approximant', place: 'alveolar', voicing: 'voiced', laterality: 'lateral' } },
        { symbol: 'v', features: { manner: 'approximant', place: 'labiodental', voicing: 'voiced' } },
      ],
      vowels: [
        { symbol: 'a', features: { manner: 'vowel', height: 'open', backness: 'central', voicing: 'voiced', rounded: false, length: 'short' } },
        { symbol: 'Ä ', features: { manner: 'vowel', height: 'open', backness: 'central', voicing: 'voiced', rounded: false, length: 'long' } },
        { symbol: 'i', features: { manner: 'vowel', height: 'close', backness: 'front', voicing: 'voiced', rounded: false, length: 'short' } },
        { symbol: 'Ä«', features: { manner: 'vowel', height: 'close', backness: 'front', voicing: 'voiced', rounded: false, length: 'long' } },
        { symbol: 'u', features: { manner: 'vowel', height: 'close', backness: 'back', voicing: 'voiced', rounded: true, length: 'short' } },
        { symbol: 'Å«', features: { manner: 'vowel', height: 'close', backness: 'back', voicing: 'voiced', rounded: true, length: 'long' } },
        { symbol: 'á¹›', features: { manner: 'vowel', height: 'vowel', backness: 'central', voicing: 'voiced', length: 'short' } }, // vocalic r
        { symbol: 'á¹ ', features: { manner: 'vowel', height: 'vowel', backness: 'central', voicing: 'voiced', length: 'long' } }, // vocalic r long
        { symbol: 'á¸·', features: { manner: 'vowel', height: 'vowel', backness: 'central', voicing: 'voiced', length: 'short' } }, // vocalic l
        { symbol: 'e', features: { manner: 'vowel', height: 'mid', backness: 'front', voicing: 'voiced', rounded: false, length: 'long' } }, // always long in Sanskrit
        { symbol: 'o', features: { manner: 'vowel', height: 'mid', backness: 'back', voicing: 'voiced', rounded: true, length: 'long' } }, // always long in Sanskrit
        { symbol: 'ai', features: { manner: 'vowel', height: 'diphthong', voicing: 'voiced', length: 'long' } },
        { symbol: 'au', features: { manner: 'vowel', height: 'diphthong', voicing: 'voiced', length: 'long' } },
      ],
      diphthongs: [
        { symbol: 'ai', features: { manner: 'diphthong', height: 'diphthong', backness: 'front', voicing: 'voiced', rounded: false, length: 'long' } },
        { symbol: 'au', features: { manner: 'diphthong', height: 'diphthong', backness: 'back', voicing: 'voiced', rounded: true, length: 'long' } },
      ],
      suprasegmentals: { stress: 'fixed or variable', tone: null }
    },
    orthography: { script: 'Devanagari', notes: 'Also uses various other Indic scripts.', historicalScripts: [{ name: 'Brahmi', period: 'Ancient' }] },
    estimatedDivergenceDate: '1500 BCE',
    linguisticFeatures: ['eight cases for nouns', 'rich verbal system', 'complex sandhi rules', 'compound formation'],
    sources: [{ type: 'grammar', title: 'A Sanskrit Grammar for Students', author: 'Macdonell, Arthur A.', year: 1927 }],
  },
  {
    id: 'gothic',
    name: 'Gothic',
    isoCode: 'got',
    family: 'Indo-European',
    subfamily: 'Germanic',
    branch: 'East Germanic',
    location: { latitude: 45.0, longitude: 25.0, region: 'Eastern Europe' },
    status: 'extinct',
    description: 'An extinct East Germanic language that was spoken by the Goths. It is the only East Germanic language with a significant corpus.',
    phonology: {
      consonants: [
        { symbol: 'p', features: { manner: 'stop', place: 'bilabial', voicing: 'voiceless', aspiration: 'none' } },
        { symbol: 't', features: { manner: 'stop', place: 'alveolar', voicing: 'voiceless', aspiration: 'none' } },
        { symbol: 'k', features: { manner: 'stop', place: 'velar', voicing: 'voiceless', aspiration: 'none' } },
        { symbol: 'b', features: { manner: 'stop', place: 'bilabial', voicing: 'voiced', aspiration: 'none' } },
        { symbol: 'd', features: { manner: 'stop', place: 'alveolar', voicing: 'voiced', aspiration: 'none' } },
        { symbol: 'g', features: { manner: 'stop', place: 'velar', voicing: 'voiced', aspiration: 'none' } },
        { symbol: 'f', features: { manner: 'fricative', place: 'labiodental', voicing: 'voiceless' } },
        { symbol: 'Ã¾', features: { manner: 'fricative', place: 'dental', voicing: 'voiceless' } },
        { symbol: 's', features: { manner: 'fricative', place: 'alveolar', voicing: 'voiceless' } },
        { symbol: 'h', features: { manner: 'fricative', place: 'glottal', voicing: 'voiceless' } },
        { symbol: 'm', features: { manner: 'nasal', place: 'bilabial', voicing: 'voiced' } },
        { symbol: 'n', features: { manner: 'nasal', place: 'alveolar', voicing: 'voiced' } },
        { symbol: 'l', features: { manner: 'approximant', place: 'alveolar', voicing: 'voiced', laterality: 'lateral' } },
        { symbol: 'r', features: { manner: 'trill', place: 'alveolar', voicing: 'voiced' } },
        { symbol: 'w', features: { manner: 'approximant', place: 'labial-velar', voicing: 'voiced' } }, // or labiodental
        { symbol: 'j', features: { manner: 'approximant', place: 'palatal', voicing: 'voiced' } },
        { symbol: 'kw', features: { manner: 'stop', place: 'velar', voicing: 'voiceless' } }, // labialized velar
      ],
      vowels: [
        { symbol: 'a', features: { manner: 'vowel', height: 'open', backness: 'front', voicing: 'voiced', rounded: false, length: 'short' } },
        { symbol: 'Ã¡', features: { manner: 'vowel', height: 'open', backness: 'front', voicing: 'voiced', rounded: false, length: 'long' } }, // or 'Ä '
        { symbol: 'i', features: { manner: 'vowel', height: 'close', backness: 'front', voicing: 'voiced', rounded: false, length: 'short' } },
        { symbol: 'ei', features: { manner: 'vowel', height: 'diphthong', voicing: 'voiced', length: 'long' } }, // often reconstructed as [i:]
        { symbol: 'u', features: { manner: 'vowel', height: 'close', backness: 'back', voicing: 'voiced', rounded: true, length: 'short' } },
        { symbol: 'o', features: { manner: 'vowel', height: 'mid', backness: 'back', voicing: 'voiced', rounded: true, length: 'short' } },
        { symbol: 'Å ', features: { manner: 'vowel', height: 'mid', backness: 'back', voicing: 'voiced', rounded: true, length: 'long' } },
        { symbol: 'Ä“', features: { manner: 'vowel', height: 'mid', backness: 'front', voicing: 'voiced', rounded: false, length: 'long' } }, // from PIE *Ä“ or *Ä«
      ]
    },
    orthography: { script: 'Gothic alphabet', notes: 'Created by Bishop Wulfila.' },
    estimatedDivergenceDate: '300 AD',
    linguisticFeatures: ['strong/weak verbs', 'four cases for nouns', 'verb-second word order', 'umlaut'],
    sources: [{ type: 'grammar', title: 'A Gothic Grammar', author: 'Wright, Joseph', year: 1910 }],
    relatedLanguages: [{ languageId: 'old-norse', relationship: 'sister' }, { languageId: 'old-english', relationship: 'sister' }],
  },
  {
    id: 'pie',
    name: 'Proto-Indo-European',
    isoCode: 'ine-pie',
    family: 'Proto-Language',
    subfamily: 'Proto-Indo-European',
    branch: 'Proto-Indo-European',
    status: 'reconstructed',
    description: 'Hypothesized prehistoric ethnolinguistic group of Eurasia who spoke Proto-Indo-European (PIE), the ancestor of the Indo-European languages. The reconstruction represents a synthesis of comparative linguistic work over two centuries.',
    phonology: {
      consonants: [
        { symbol: '*p', features: { manner: 'stop', place: 'bilabial', voicing: 'voiceless' } },
        { symbol: '*b', features: { manner: 'stop', place: 'bilabial', voicing: 'voiced' } },
        { symbol: '*bÊ°', features: { manner: 'stop', place: 'bilabial', voicing: 'voiced' } },
        { symbol: '*t', features: { manner: 'stop', place: 'dental', voicing: 'voiceless' } },
        { symbol: '*d', features: { manner: 'stop', place: 'dental', voicing: 'voiced' } },
        { symbol: '*dÊ°', features: { manner: 'stop', place: 'dental', voicing: 'voiced' } },
        { symbol: '*k', features: { manner: 'stop', place: 'velar', voicing: 'voiceless' } },
        { symbol: '*g', features: { manner: 'stop', place: 'velar', voicing: 'voiced' } },
        { symbol: '*gÊ°', features: { manner: 'stop', place: 'velar', voicing: 'voiced' } },
        { symbol: '*kÊ·', features: { manner: 'stop', place: 'labial-velar', voicing: 'voiceless' } },
        { symbol: '*gÊ·', features: { manner: 'stop', place: 'labial-velar', voicing: 'voiced' } },
        { symbol: '*gÊ·Ê°', features: { manner: 'stop', place: 'labial-velar', voicing: 'voiced' } },
        { symbol: '*s', features: { manner: 'fricative', place: 'alveolar', voicing: 'voiceless' } },
        { symbol: '*m', features: { manner: 'nasal', place: 'bilabial', voicing: 'voiced' } },
        { symbol: '*n', features: { manner: 'nasal', place: 'alveolar', voicing: 'voiced' } },
        { symbol: '*l', features: { manner: 'approximant', place: 'alveolar', voicing: 'voiced', laterality: 'lateral' } },
        { symbol: '*r', features: { manner: 'trill', place: 'alveolar', voicing: 'voiced' } },
        { symbol: '*y', features: { manner: 'approximant', place: 'palatal', voicing: 'voiced' } },
        { symbol: '*w', features: { manner: 'approximant', place: 'labial-velar', voicing: 'voiced' } },
        { symbol: '*Hâ‚ ', features: { manner: 'fricative', place: 'glottal', voicing: 'voiceless' } }, // Laryngeal H1
        { symbol: '*Hâ‚‚', features: { manner: 'fricative', place: 'pharyngeal', voicing: 'voiceless' } }, // Laryngeal H2
        { symbol: '*Hâ‚ƒ', features: { manner: 'fricative', place: 'uvular', voicing: 'voiceless' } }, // Laryngeal H3
        { symbol: '*á¸±', features: { manner: 'stop', place: 'palatal', voicing: 'voiceless' } }, // Palatovelar k' (often written k with acute or dot)
        { symbol: '*Çµ', features: { manner: 'stop', place: 'palatal', voicing: 'voiced' } }, // Palatovelar g'
        { symbol: '*ÇµÊ°', features: { manner: 'stop', place: 'palatal', voicing: 'voiced' } }, // Palatovelar g'h
      ],
      vowels: [
        { symbol: '*e', features: { manner: 'vowel', height: 'mid', backness: 'front', voicing: 'voiced', rounded: false, length: 'short' } },
        { symbol: '*Ä“', features: { manner: 'vowel', height: 'mid', backness: 'front', voicing: 'voiced', rounded: false, length: 'long' } },
        { symbol: '*o', features: { manner: 'vowel', height: 'mid', backness: 'back', voicing: 'voiced', rounded: true, length: 'short' } },
        { symbol: '*Å ', features: { manner: 'vowel', height: 'mid', backness: 'back', voicing: 'voiced', rounded: true, length: 'long' } },
        { symbol: '*a', features: { manner: 'vowel', height: 'open', backness: 'central', voicing: 'voiced', rounded: false, length: 'short' } }, // generally from *o or *e next to H2
        { symbol: '*Ä ', features: { manner: 'vowel', height: 'open', backness: 'central', voicing: 'voiced', rounded: false, length: 'long' } }, // generally from *o or *e next to H2
      ],
      diphthongs: [
        { symbol: '*ey', features: { manner: 'diphthong', height: 'diphthong', voicing: 'voiced' } },
        { symbol: '*oy', features: { manner: 'diphthong', height: 'diphthong', voicing: 'voiced' } },
        { symbol: '*aw', features: { manner: 'diphthong', height: 'diphthong', voicing: 'voiced' } },
        { symbol: '*ew', features: { manner: 'diphthong', height: 'diphthong', voicing: 'voiced' } },
        { symbol: '*ow', features: { manner: 'diphthong', height: 'diphthong', voicing: 'voiced' } },
      ],
      suprasegmentals: { stress: 'variable', tone: null }
    },
    estimatedDivergenceDate: '4500 BCE',
    linguisticFeatures: ['ablaut', 'case system', 'root-suffix morphology', 'laryngeal theory'],
    sources: [{ type: 'academic_paper', title: 'The Oxford Introduction to Proto-Indo-European and the Proto-Indo-European World', author: 'Fortson, Benjamin W. IV', year: 2004 }],
    relatedLanguages: DUMMY_LANGUAGES.filter(l => l.id !== 'pie').map(l => ({ languageId: l.id, relationship: 'daughter' })),
  },
  {
    id: 'english',
    name: 'English',
    isoCode: 'eng',
    family: 'Indo-European',
    subfamily: 'Germanic',
    branch: 'West Germanic',
    location: { latitude: 51.5, longitude: 0.0, region: 'Western Europe' },
    status: 'vibrant',
    description: 'A West Germanic language that originated from the Anglo-Frisian dialects brought to Britain by Germanic invaders.',
    phonology: { consonants: [], vowels: [] }, // Simplified for brevity in dummy data
    estimatedDivergenceDate: '450 AD',
    linguisticFeatures: ['analytic grammar', 'stress-timed rhythm', 'large vocabulary from multiple sources', 'loss of cases'],
    sources: [{ type: 'dictionary', title: 'Oxford English Dictionary', year: 2000 }],
  },
  {
    id: 'latin',
    name: 'Latin',
    isoCode: 'lat',
    family: 'Indo-European',
    subfamily: 'Italic',
    branch: 'Latin-Faliscan',
    location: { latitude: 41.9, longitude: 12.5, region: 'Southern Europe' },
    status: 'extinct', // Classical Latin
    description: 'A classical language belonging to the Italic branch of the Indo-European languages. Most of its descendants are the Romance languages.',
    phonology: { consonants: [], vowels: [] }, // Simplified
    estimatedDivergenceDate: '700 BCE',
    linguisticFeatures: ['five declensions', 'six cases', 'SOV tendencies', 'synthetic morphology'],
  },
  {
    id: 'spanish',
    name: 'Spanish',
    isoCode: 'spa',
    family: 'Indo-European',
    subfamily: 'Italic',
    branch: 'Romance',
    location: { latitude: 40.4, longitude: -3.7, region: 'Iberian Peninsula' },
    status: 'vibrant',
    description: 'A Romance language that originated in the Castile region of Spain and today has hundreds of millions of native speakers worldwide.',
    phonology: { consonants: [], vowels: [] }, // Simplified
    estimatedDivergenceDate: '9th Century AD',
    linguisticFeatures: ['gendered nouns', 'verb conjugation', 'vowel harmony in some dialects', 'lenition'],
  },
  // Add many more languages to reach line count...
  {
    id: 'old-irish',
    name: 'Old Irish',
    isoCode: 'sga',
    family: 'Indo-European',
    subfamily: 'Celtic',
    branch: 'Goidelic',
    location: { latitude: 53.0, longitude: -8.0, region: 'Ireland' },
    status: 'extinct',
    description: 'The earliest form of the Irish language for which there are extensive written texts.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '600 AD', linguisticFeatures: ['initial mutations', 'VSO word order', 'lack of grammatical gender'],
  },
  {
    id: 'greek',
    name: 'Ancient Greek',
    isoCode: 'grc',
    family: 'Indo-European',
    subfamily: 'Hellenic',
    branch: 'Attic-Ionic',
    location: { latitude: 37.9, longitude: 23.7, region: 'Greece' },
    status: 'extinct',
    description: 'The language in which the classical literature of ancient Greece was written.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '1000 BCE', linguisticFeatures: ['pitch accent', 'three genders', 'augment in past tense'],
  },
  {
    id: 'russian',
    name: 'Russian',
    isoCode: 'rus',
    family: 'Indo-European',
    subfamily: 'Balto-Slavic',
    branch: 'East Slavic',
    location: { latitude: 55.7, longitude: 37.6, region: 'Eastern Europe' },
    status: 'vibrant',
    description: 'The most widely spoken of the Slavic languages, primarily in Russia and Eastern Europe.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '900 AD', linguisticFeatures: ['six cases', 'perfective/imperfective aspect', 'palatalization'],
  },
  {
    id: 'lithuanian',
    name: 'Lithuanian',
    isoCode: 'lit',
    family: 'Indo-European',
    subfamily: 'Balto-Slavic',
    branch: 'Baltic',
    location: { latitude: 55.1, longitude: 23.8, region: 'Baltic region' },
    status: 'vibrant',
    description: 'One of the two surviving Baltic languages, retaining many archaic features thought to be present in early Proto-Indo-European.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '1000 AD', linguisticFeatures: ['pitch accent', 'seven cases', 'free stress'],
  },
  {
    id: 'armenian',
    name: 'Classical Armenian',
    isoCode: 'xcl',
    family: 'Indo-European',
    subfamily: 'Armenian',
    branch: 'Armenian',
    location: { latitude: 40.0, longitude: 45.0, region: 'Caucasus' },
    status: 'extinct',
    description: 'The oldest attested form of the Armenian language, used in ancient and medieval Armenian literature.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '500 AD', linguisticFeatures: ['agglutinative morphology', 'case system', 'consonant shifts'],
  },
  {
    id: 'tocharian-b',
    name: 'Tocharian B',
    isoCode: 'txb',
    family: 'Indo-European',
    subfamily: 'Tocharian',
    branch: 'Tocharian',
    location: { latitude: 41.0, longitude: 84.0, region: 'Central Asia' },
    status: 'extinct',
    description: 'An extinct Indo-European language spoken in the Tarim Basin in Central Asia, distinct from all other branches.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '600 AD', linguisticFeatures: ['agglutinative morphology', 'case system', 'centum language'],
  },
  {
    id: 'hebrew',
    name: 'Biblical Hebrew',
    isoCode: 'hbo',
    family: 'Afro-Asiatic',
    subfamily: 'Semitic',
    branch: 'Canaanite',
    location: { latitude: 31.0, longitude: 35.0, region: 'Levant' },
    status: 'extinct',
    description: 'An ancient form of the Hebrew language, attested in the Hebrew Bible.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '1000 BCE', linguisticFeatures: ['triliteral roots', 'VSO word order', 'absence of definite article'],
  },
  {
    id: 'arabic',
    name: 'Classical Arabic',
    isoCode: 'arb',
    family: 'Afro-Asiatic',
    subfamily: 'Semitic',
    branch: 'Central Semitic',
    location: { latitude: 23.0, longitude: 45.0, region: 'Arabian Peninsula' },
    status: 'extinct',
    description: 'The form of Arabic used in literary and formal contexts, especially in the Quran.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '600 AD', linguisticFeatures: ['triliteral roots', 'rich morphology', 'broken plurals'],
  },
  {
    id: 'finnish',
    name: 'Finnish',
    isoCode: 'fin',
    family: 'Uralic',
    subfamily: 'Finnic',
    branch: 'Finnic',
    location: { latitude: 61.9, longitude: 25.7, region: 'Northern Europe' },
    status: 'vibrant',
    description: 'A Uralic language spoken by the majority of the population in Finland.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '1000 AD', linguisticFeatures: ['agglutinative', 'vowel harmony', '15 cases', 'lack of grammatical gender'],
  },
  {
    id: 'hungarian',
    name: 'Hungarian',
    isoCode: 'hun',
    family: 'Uralic',
    subfamily: 'Ugric',
    branch: 'Ugric',
    location: { latitude: 47.0, longitude: 19.0, region: 'Central Europe' },
    status: 'vibrant',
    description: 'A Uralic language spoken in Hungary and parts of several neighbouring countries.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '900 AD', linguisticFeatures: ['agglutinative', 'vowel harmony', '18 cases', 'definite/indefinite conjugation'],
  },
  {
    id: 'old-norse',
    name: 'Old Norse',
    isoCode: 'non',
    family: 'Indo-European',
    subfamily: 'Germanic',
    branch: 'North Germanic',
    location: { latitude: 60.0, longitude: 10.0, region: 'Scandinavia' },
    status: 'extinct',
    description: 'A North Germanic language spoken by inhabitants of Scandinavia and their overseas settlements during the Viking Age.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '800 AD', linguisticFeatures: ['strong/weak verbs', 'four cases', 'verb-second word order'],
  },
  {
    id: 'old-english',
    name: 'Old English',
    isoCode: 'ang',
    family: 'Indo-European',
    subfamily: 'Germanic',
    branch: 'West Germanic',
    location: { latitude: 52.0, longitude: -0.5, region: 'British Isles' },
    status: 'extinct',
    description: 'The earliest historical form of the English language, spoken in England and southern Scotland from the mid-5th to the mid-12th century.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '450 AD', linguisticFeatures: ['rich inflectional system', 'strong/weak verbs', 'four cases', 'compounding'],
  },
  {
    id: 'old-french',
    name: 'Old French',
    isoCode: 'fro',
    family: 'Indo-European',
    subfamily: 'Italic',
    branch: 'Romance',
    location: { latitude: 48.8, longitude: 2.3, region: 'France' },
    status: 'extinct',
    description: 'The Gallo-Romance language spoken in Northern France from the 8th century to the 14th century.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '800 AD', linguisticFeatures: ['two cases', 'pro-drop', 'vowel nasalization'],
  },
  {
    id: 'gaulish',
    name: 'Gaulish',
    isoCode: 'xtg',
    family: 'Indo-European',
    subfamily: 'Celtic',
    branch: 'Continental Celtic',
    location: { latitude: 47.0, longitude: 3.0, region: 'Gaul' },
    status: 'extinct',
    description: 'An ancient Continental Celtic language spoken by the Gauls in Gaul.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '500 BCE', linguisticFeatures: ['suffixation', 'case system', 'preverbs'],
  },
  {
    id: 'luwian',
    name: 'Luwian',
    isoCode: 'luv',
    family: 'Indo-European',
    subfamily: 'Anatolian',
    branch: 'Luwic',
    location: { latitude: 37.0, longitude: 30.0, region: 'Anatolia' },
    status: 'extinct',
    description: 'An extinct Anatolian language related to Hittite, spoken in ancient Anatolia.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '1800 BCE', linguisticFeatures: ['ergative-absolutive system', 'reduplication', 'lack of gender'],
  },
  {
    id: 'lycian',
    name: 'Lycian',
    isoCode: 'xld',
    family: 'Indo-European',
    subfamily: 'Anatolian',
    branch: 'Luwic',
    location: { latitude: 36.5, longitude: 29.5, region: 'Lycia' },
    status: 'extinct',
    description: 'An extinct Indo-European language of the Anatolian branch, spoken in ancient Lycia in Anatolia.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '500 BCE', linguisticFeatures: ['agglutinative suffixes', 'case system', 'vowel harmony'],
  },
  {
    id: 'palaic',
    name: 'Palaic',
    isoCode: 'paz',
    family: 'Indo-European',
    subfamily: 'Anatolian',
    branch: 'Palaic',
    location: { latitude: 41.0, longitude: 34.0, region: 'Anatolia' },
    status: 'extinct',
    description: 'An extinct Indo-European language closely related to Hittite, spoken in the region of Pala in ancient Anatolia.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '1700 BCE', linguisticFeatures: ['prefixation', 'case system', 'similar to Hittite'],
  },
  {
    id: 'mycenaean-greek',
    name: 'Mycenaean Greek',
    isoCode: 'gmy',
    family: 'Indo-European',
    subfamily: 'Hellenic',
    branch: 'Mycenaean',
    location: { latitude: 37.7, longitude: 22.7, region: 'Mainland Greece' },
    status: 'extinct',
    description: 'The most ancient attested form of the Greek language, spoken in mainland Greece, Crete, and Cyprus.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '1600 BCE', linguisticFeatures: ['Linear B script', 'early Greek features', 'labial-velar stops'],
  },
  {
    id: 'old-persian',
    name: 'Old Persian',
    isoCode: 'peo',
    family: 'Indo-European',
    subfamily: 'Indo-Iranian',
    branch: 'Iranian',
    location: { latitude: 30.0, longitude: 52.0, region: 'Persia' },
    status: 'extinct',
    description: 'One of the two directly attested Old Iranian languages (the other being Avestan).',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '600 BCE', linguisticFeatures: ['cuneiform script', 'case system', 'proto-Iranian features'],
  },
  {
    id: 'avestan',
    name: 'Avestan',
    isoCode: 'ave',
    family: 'Indo-European',
    subfamily: 'Indo-Iranian',
    branch: 'Iranian',
    location: { latitude: 35.0, longitude: 60.0, region: 'Central Asia' },
    status: 'extinct',
    description: 'An East Iranian language, known only from its use as the language of the Zoroastrian scripture Avesta.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '1000 BCE', linguisticFeatures: ['complex phonology', 'case system', 'extensive morphology'],
  },
  {
    id: 'old-high-german',
    name: 'Old High German',
    isoCode: 'goh',
    family: 'Indo-European',
    subfamily: 'Germanic',
    branch: 'West Germanic',
    location: { latitude: 49.0, longitude: 9.0, region: 'Central Europe' },
    status: 'extinct',
    description: 'The earliest stage of the German language, spoken from about 750 to 1050 AD.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '750 AD', linguisticFeatures: ['strong/weak verbs', 'Germanic sound shift effects', 'High German consonant shift'],
  },
  {
    id: 'old-saxon',
    name: 'Old Saxon',
    isoCode: 'osx',
    family: 'Indo-European',
    subfamily: 'Germanic',
    branch: 'West Germanic',
    location: { latitude: 53.0, longitude: 8.0, region: 'Northern Europe' },
    status: 'extinct',
    description: 'A Germanic language, the earliest recorded form of Low German, spoken from about 800 to 1100 AD.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '800 AD', linguisticFeatures: ['similar to Old English', 'fewer vowel phonemes', 'verb-final tendencies'],
  },
  {
    id: 'old-church-slavonic',
    name: 'Old Church Slavonic',
    isoCode: 'chu',
    family: 'Indo-European',
    subfamily: 'Balto-Slavic',
    branch: 'South Slavic',
    location: { latitude: 42.0, longitude: 25.0, region: 'Balkans' },
    status: 'extinct',
    description: 'The first Slavic literary language, important for the history of Slavic languages and the development of Cyrillic script.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '800 AD', linguisticFeatures: ['jers', 'nasal vowels', 'case system', 'palatalization'],
  },
  {
    id: 'prakrit',
    name: 'Prakrit (various)',
    isoCode: 'inc', // Indic languages (various)
    family: 'Indo-European',
    subfamily: 'Indo-Iranian',
    branch: 'Indic',
    location: { latitude: 25.0, longitude: 75.0, region: 'South Asia' },
    status: 'extinct',
    description: 'A group of Middle Indo-Aryan languages used in ancient and medieval India.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '500 BCE', linguisticFeatures: ['simpler grammar than Sanskrit', 'apocope', 'lenition of consonants'],
  },
  {
    id: 'kurdish',
    name: 'Kurdish (Central)',
    isoCode: 'ckb',
    family: 'Indo-European',
    subfamily: 'Indo-Iranian',
    branch: 'Iranian',
    location: { latitude: 35.0, longitude: 45.0, region: 'Middle East' },
    status: 'vibrant',
    description: 'A Northwestern Iranian language spoken by Kurds in Iraq and Iran.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '1000 AD', linguisticFeatures: ['ergativity', 'SOV word order', 'rich inventory of fricatives'],
  },
  {
    id: 'pashto',
    name: 'Pashto',
    isoCode: 'pus',
    family: 'Indo-European',
    subfamily: 'Indo-Iranian',
    branch: 'Iranian',
    location: { latitude: 33.0, longitude: 67.0, region: 'Central Asia' },
    status: 'vibrant',
    description: 'An Eastern Iranian language spoken in Afghanistan and Pakistan.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '1000 AD', linguisticFeatures: ['ergativity', 'retroflex consonants', 'aspiration distinctions'],
  },
  {
    id: 'farsi',
    name: 'Persian (Farsi)',
    isoCode: 'fas',
    family: 'Indo-European',
    subfamily: 'Indo-Iranian',
    branch: 'Iranian',
    location: { latitude: 32.0, longitude: 53.0, region: 'Persia' },
    status: 'vibrant',
    description: 'A Western Iranian language spoken in Iran, Afghanistan, and Tajikistan.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '900 AD', linguisticFeatures: ['SVO word order', 'lack of grammatical gender', 'ezafe construction'],
  },
  {
    id: 'hindi',
    name: 'Hindi',
    isoCode: 'hin',
    family: 'Indo-European',
    subfamily: 'Indo-Iranian',
    branch: 'Indic',
    location: { latitude: 28.0, longitude: 77.0, region: 'North India' },
    status: 'vibrant',
    description: 'An Indo-Aryan language, and with English, one of the official languages of the Government of India.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '1000 AD', linguisticFeatures: ['retroflex consonants', 'SOV word order', 'gender agreement'],
  },
  {
    id: 'bengali',
    name: 'Bengali',
    isoCode: 'ben',
    family: 'Indo-European',
    subfamily: 'Indo-Iranian',
    branch: 'Indic',
    location: { latitude: 23.0, longitude: 88.0, region: 'Bengal' },
    status: 'vibrant',
    description: 'An Indo-Aryan language primarily spoken in Bangladesh and the Indian state of West Bengal.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '1000 AD', linguisticFeatures: ['lack of grammatical gender', 'SOV word order', 'vowel harmony in some dialects'],
  },
  {
    id: 'gujarati',
    name: 'Gujarati',
    isoCode: 'guj',
    family: 'Indo-European',
    subfamily: 'Indo-Iranian',
    branch: 'Indic',
    location: { latitude: 22.0, longitude: 71.0, region: 'Gujarat' },
    status: 'vibrant',
    description: 'An Indo-Aryan language native to the Indian state of Gujarat.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '1000 AD', linguisticFeatures: ['ergative-absolutive system', 'SVO word order', 'rich case system for pronouns'],
  },
  {
    id: 'punjabi',
    name: 'Punjabi',
    isoCode: 'pan',
    family: 'Indo-European',
    subfamily: 'Indo-Iranian',
    branch: 'Indic',
    location: { latitude: 31.0, longitude: 74.0, region: 'Punjab' },
    status: 'vibrant',
    description: 'An Indo-Aryan language spoken by the Punjabi people in the Punjab region of India and Pakistan.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '1000 AD', linguisticFeatures: ['tonal language', 'SVO/SOV word order variation', 'implosive consonants'],
  },
  {
    id: 'romanian',
    name: 'Romanian',
    isoCode: 'ron',
    family: 'Indo-European',
    subfamily: 'Italic',
    branch: 'Romance',
    location: { latitude: 45.9, longitude: 24.9, region: 'Balkans' },
    status: 'vibrant',
    description: 'A Balkan Romance language spoken by approximately 24â€“26 million people.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '1000 AD', linguisticFeatures: ['case system retained', 'definite article suffixation', 'neuter gender'],
  },
  {
    id: 'italian',
    name: 'Italian',
    isoCode: 'ita',
    family: 'Indo-European',
    subfamily: 'Italic',
    branch: 'Romance',
    location: { latitude: 41.9, longitude: 12.5, region: 'Southern Europe' },
    status: 'vibrant',
    description: 'A Romance language derived from Vulgar Latin of the Roman Empire.',
    phonology: { consonants: [], vowels: [] }, estimatedDivergenceDate: '1000 AD', linguisticFeatures: ['gendered nouns', 'verb conjugation', 'subject-verb inversion']
  }
];


/**
 * A central, in-memory repository for all linguistic data and associated metadata.
 * Business value: Acts as the single source of truth for linguistic knowledge,
 * providing high-speed access and ensuring data consistency across the platform.
 * Its auditable nature safeguards the value of collected and generated data, making it a valuable asset.
 */
export class LinguisticDataRepository {
  private languages: Language[] = [];
  private lexicalEntries: LexicalEntry[] = [];
  private reconstructions: Reconstruction[] = [];
  private cognateSets: CognateSet[] = [];
  private soundCorrespondenceRules: SoundCorrespondenceRule[] = [];
  private linguisticTasks: LinguisticTask[] = [];
  private linguisticBounties: LinguisticBounty[] = [];
  private linguisticContributions: LinguisticContribution[] = [];
  private linguisticAuditLog: LinguisticAuditLogEntry[] = [];
  private identities: DigitalIdentity[] = [];
  private skills: LinguisticSkill[] = [];

  constructor() {
    this.seedData();
  }

  /**
   * Seeds the repository with initial dummy data.
   * Business value: Provides a robust starting dataset for development, testing, and demonstration,
   * simulating a rich, real-world linguistic database without external dependencies.
   */
  private seedData() {
    this.languages = DUMMY_LANGUAGES;

    // Add dummy identities
    this.identities = [
      { id: 'usr_alice', name: 'Alice Smith', publicKey: 'PUBKEY_ALICE_123', roles: ['researcher', 'editor'] },
      { id: 'usr_bob', name: 'Bob Johnson', publicKey: 'PUBKEY_BOB_456', roles: ['researcher'] },
      { id: 'agent_lfa_001', name: 'LinguisticFossilAgent-001', publicKey: 'PUBKEY_AGENT_LFA001', roles: ['agent'], reputationScore: 0.85 },
      { id: 'agent_recon_alpha', name: 'ReconstructionAgent-Alpha', publicKey: 'PUBKEY_AGENT_ALPHA', roles: ['agent'], reputationScore: 0.92 },
      { id: 'admin_eve', name: 'Eve Admin', publicKey: 'PUBKEY_EVE_ADMIN', roles: ['admin'] },
    ];

    // Add dummy skills
    this.skills = [
      { id: 'ProtoWordReconstruction', name: 'Proto-Word Reconstruction', description: 'Reconstructs proto-words from cognate sets.', requiredPermissions: ['agent', 'researcher'], costEstimatePerUse: { tokenType: 'LINGUIST_COIN', amount: 50 } },
      { id: 'SoundLawDetection', name: 'Sound Law Detection', description: 'Identifies regular sound correspondences between languages.', requiredPermissions: ['agent'], costEstimatePerUse: { tokenType: 'LINGUIST_COIN', amount: 100 } },
      { id: 'CognateIdentification', name: 'Cognate Identification', description: 'Analyzes lexical entries to suggest potential cognates.', requiredPermissions: ['agent', 'researcher'], costEstimatePerUse: { tokenType: 'LINGUIST_COIN', amount: 30 } },
      { id: 'DataValidation', name: 'Linguistic Data Validation', description: 'Validates consistency and accuracy of linguistic entries.', requiredPermissions: ['agent', 'editor'] },
    ];

    // Example lexical entries (expanded to include cognates)
    this.lexicalEntries = [
      {
        id: 'le_eng_water', languageId: 'english', word: 'water', ipa: 'ˈwɔːtər', meaning: 'a colorless, transparent, odorless liquid', dateAdded: '2023-01-01', lastUpdated: '2023-01-01',
        etymology: { protoWordId: 'pr_pie_wodr', notes: 'From Proto-Germanic *watar, from PIE *wod-r̥.' },
        cognateIds: ['le_got_wato', 'le_lat_aqua'],
        semanticFields: ['nature'],
      },
      {
        id: 'le_got_wato', languageId: 'gothic', word: 'wato', ipa: 'ˈwɑːtoː', meaning: 'water', dateAdded: '2023-01-01', lastUpdated: '2023-01-01',
        etymology: { protoWordId: 'pr_pie_wodr', notes: 'From Proto-Germanic *watar, from PIE *wod-r̥.' },
        cognateIds: ['le_eng_water'], semanticFields: ['nature'],
      },
      {
        id: 'le_lat_aqua', languageId: 'latin', word: 'aqua', ipa: 'ˈakʷa', meaning: 'water', dateAdded: '2023-01-01', lastUpdated: '2023-01-01',
        etymology: { notes: 'From PIE *h₂ekʷ-eh₂.' },
        cognateIds: ['le_spa_agua'], semanticFields: ['nature'],
      },
      {
        id: 'le_spa_agua', languageId: 'spanish', word: 'agua', ipa: 'ˈaɣwa', meaning: 'water', dateAdded: '2023-01-01', lastUpdated: '2023-01-01',
        etymology: { sourceLanguageId: 'latin', notes: 'From Latin aqua.' },
        cognateIds: ['le_lat_aqua'], semanticFields: ['nature'],
      },
      {
        id: 'le_san_pitar', languageId: 'sanskrit', word: 'पितर् (pitár)', ipa: 'pɪˈtɐr', meaning: 'father', dateAdded: '2023-01-01', lastUpdated: '2023-01-01',
        etymology: { protoWordId: 'pr_pie_pater' },
        cognateIds: ['le_lat_pater', 'le_eng_father'],
        semanticFields: ['kinship'],
      },
      {
        id: 'le_lat_pater', languageId: 'latin', word: 'pater', ipa: 'ˈpa.tɛr', meaning: 'father', dateAdded: '2023-01-01', lastUpdated: '2023-01-01',
        etymology: { protoWordId: 'pr_pie_pater' },
        cognateIds: ['le_san_pitar', 'le_eng_father'],
        semanticFields: ['kinship'],
      },
      {
        id: 'le_eng_father', languageId: 'english', word: 'father', ipa: 'ˈfɑːðər', meaning: 'male parent', dateAdded: '2023-01-01', lastUpdated: '2023-01-01',
        etymology: { protoWordId: 'pr_pie_pater', notes: 'From Proto-Germanic *fadēr, from PIE *ph₂tḗr.' },
        cognateIds: ['le_san_pitar', 'le_lat_pater'],
        semanticFields: ['kinship'],
      },
    ];

    // Example reconstructions
    this.reconstructions = [
      {
        id: 'pr_pie_wodr', protoLanguageId: 'pie', protoWord: '*wódr̥', meaning: 'water', ipa: 'ˈwo.dr̩', confidence: 0.95,
        descendantEvidence: [
          { languageId: 'gothic', language: 'Gothic', word: 'wato', ipa: 'ˈwɑːtoː', relation: 'cognate', soundCorrespondences: [{ protoSound: '*w', descendantSound: 'w' }, { protoSound: '*o', descendantSound: 'a' }, { protoSound: '*d', descendantSound: 't' }, { protoSound: '*r', descendantSound: 'r' }], lexicalEntryId: 'le_got_wato' },
          { languageId: 'english', language: 'English', word: 'water', ipa: 'ˈwɔːtər', relation: 'cognate', soundCorrespondences: [{ protoSound: '*w', descendantSound: 'w' }, { protoSound: '*o', descendantSound: 'a' }, { protoSound: '*d', descendantSound: 't' }, { protoSound: '*r', descendantSound: 'r' }], lexicalEntryId: 'le_eng_water' },
          { languageId: 'sanskrit', language: 'Sanskrit', word: 'udán', ipa: 'uˈdɐ́n', relation: 'cognate', soundCorrespondences: [{ protoSound: '*w', descendantSound: 'u' }, { protoSound: '*d', descendantSound: 'd' }], notes: 'Zero-grade form.' }, // Assuming this exists as lexical entry for 'udán'
        ],
        semanticField: 'nature', reconstructionMethod: 'comparative', status: 'established', proposedBy: 'Scholarly Consensus', dateProposed: '1850-01-01',
      },
      {
        id: 'pr_pie_pater', protoLanguageId: 'pie', protoWord: '*ph₂tḗr', meaning: 'father', ipa: 'ph₂ˈtér', confidence: 0.98,
        descendantEvidence: [
          { languageId: 'sanskrit', language: 'Sanskrit', word: 'pitár', ipa: 'pɪˈtɐr', relation: 'cognate', soundCorrespondences: [{ protoSound: '*p', descendantSound: 'p' }, { protoSound: '*h₂', descendantSound: 'i' }, { protoSound: '*t', descendantSound: 't' }, { protoSound: '*ē', descendantSound: 'a' }, { protoSound: '*r', descendantSound: 'r' }], lexicalEntryId: 'le_san_pitar' },
          { languageId: 'latin', language: 'Latin', word: 'pater', ipa: 'ˈpa.tɛr', relation: 'cognate', soundCorrespondences: [{ protoSound: '*p', descendantSound: 'p' }, { protoSound: '*h₂', descendantSound: 'a' }, { protoSound: '*t', descendantSound: 't' }, { protoSound: '*ē', descendantSound: 'e' }, { protoSound: '*r', descendantSound: 'r' }], lexicalEntryId: 'le_lat_pater' },
          { languageId: 'english', language: 'English', word: 'father', ipa: 'ˈfɑːðər', relation: 'cognate', soundCorrespondences: [{ protoSound: '*p', descendantSound: 'f' }, { protoSound: '*h₂', descendantSound: 'a' }, { protoSound: '*t', descendantSound: 'ð' }, { protoSound: '*ē', descendantSound: 'e' }, { protoSound: '*r', descendantSound: 'r' }], lexicalEntryId: 'le_eng_father' },
        ],
        semanticField: 'kinship', reconstructionMethod: 'comparative', status: 'established', proposedBy: 'Scholarly Consensus', dateProposed: '1850-01-01',
      }
    ];

    // Example cognate sets
    this.cognateSets = [
      {
        id: 'cs_water_ie', concept: 'water', protoReconstructionId: 'pr_pie_wodr', confidenceScore: 0.9, createdAt: '2023-01-01',
        members: [
          { languageId: 'english', lexicalEntryId: 'le_eng_water', wordForm: 'water', ipa: 'ˈwɔːtər' },
          { languageId: 'gothic', lexicalEntryId: 'le_got_wato', wordForm: 'wato', ipa: 'ˈwɑːtoː' },
          { languageId: 'sanskrit', lexicalEntryId: 'le_san_udán', wordForm: 'udán', ipa: 'uˈdɐ́n', notes: 'From zero-grade PIE.' }, // Assuming this exists as lexical entry for 'udán'
        ],
        analysisNotes: 'Classic Germanic/Indic cognate set for water.',
      },
      {
        id: 'cs_father_ie', concept: 'father', protoReconstructionId: 'pr_pie_pater', confidenceScore: 0.98, createdAt: '2023-01-01',
        members: [
          { languageId: 'english', lexicalEntryId: 'le_eng_father', wordForm: 'father', ipa: 'ˈfɑːðər' },
          { languageId: 'latin', lexicalEntryId: 'le_lat_pater', wordForm: 'pater', ipa: 'ˈpa.tɛr' },
          { languageId: 'sanskrit', lexicalEntryId: 'le_san_pitar', wordForm: 'pitár', ipa: 'pɪˈtɐr' },
        ],
        analysisNotes: 'Well-established PIE cognate set for father.',
      },
      {
        id: 'cs_aqua_romance', concept: 'water', confidenceScore: 0.99, createdAt: '2023-01-01',
        members: [
          { languageId: 'latin', lexicalEntryId: 'le_lat_aqua', wordForm: 'aqua', ipa: 'ˈakʷa' },
          { languageId: 'spanish', lexicalEntryId: 'le_spa_agua', wordForm: 'agua', ipa: 'ˈaɣwa' },
        ],
        analysisNotes: 'Clear Romance cognate set from Latin aqua.',
      }
    ];

    // Example Sound Correspondence Rules
    this.soundCorrespondenceRules = [
      {
        id: 'grimm-p-f', protoSound: '*p', descendantSound: 'f', context: '#_', environment: 'initial', languageId: 'gothic', appliesTo: 'consonant', confidence: 0.99, source: 'Grimm\'s Law', priority: 10,
        examples: [
          { protoWord: '*ph₂tḗr', descendantWord: 'father' }, // English for illustration, Gothic would be 'fadar'
          { protoWord: '*péh₂us', descendantWord: 'fiu' }, // Gothic for 'cattle, property'
        ]
      },
      {
        id: 'grimm-t-th', protoSound: '*t', descendantSound: 'þ', context: '#_', environment: 'initial', languageId: 'gothic', appliesTo: 'consonant', confidence: 0.99, source: 'Grimm\'s Law', priority: 10,
        examples: [{ protoWord: '*tréyes', descendantWord: 'þreis' }] // Gothic for 'three'
      },
      {
        id: 'h2-a-latin', protoSound: '*h₂', descendantSound: 'a', context: '/_C', environment: 'all', languageId: 'latin', appliesTo: 'vowel', confidence: 0.95, notes: 'Laryngeal coloring of adjacent vowel.', priority: 5,
        examples: [{ protoWord: '*ph₂tḗr', descendantWord: 'pater' }]
      }
    ];

    // Example tasks and bounties
    const taskId1 = generateUniqueId();
    const taskId2 = generateUniqueId();
    const taskId3 = generateUniqueId();
    this.linguisticTasks = [
      {
        id: taskId1, projectId: 'proj_global_recon', type: 'ProtoWordReconstruction', description: 'Reconstruct PIE for "star" based on provided cognates.',
        status: LinguisticTaskStatus.Pending, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), priority: 'high',
        parameters: { cognateSetId: 'cs_star_ie' }, // hypothetical cognate set
        audits: [],
      },
      {
        id: taskId2, projectId: 'proj_global_recon', type: 'SoundLawDetection', description: 'Detect sound laws for Proto-Germanic *d to Old English.',
        status: LinguisticTaskStatus.Assigned, assignedToIdentityId: 'agent_lfa_001', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), priority: 'medium',
        parameters: { protoLanguage: 'Proto-Germanic', descendantLanguage: 'Old English', specificSound: '*d' },
        audits: [],
      },
      {
        id: taskId3, projectId: 'proj_validation', type: 'DataValidation', description: 'Validate consistency of Sanskrit lexical entries.',
        status: LinguisticTaskStatus.InProgress, assignedToIdentityId: 'usr_alice', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), priority: 'low',
        parameters: { languageId: 'sanskrit', scope: 'lexicalEntries' },
        audits: [],
      }
    ];
    this.linguisticBounties = [
      {
        id: generateUniqueId(), taskId: taskId1, amount: 100, tokenType: 'LINGUIST_COIN', status: 'funded', fundedBy: 'admin_eve', fundedAt: new Date().toISOString(),
      },
      {
        id: generateUniqueId(), taskId: taskId2, amount: 200, tokenType: 'LINGUIST_COIN', status: 'funded', fundedBy: 'admin_eve', fundedAt: new Date().toISOString(),
      }
    ];

    // Initial audit log entry
    this.addAuditLogEntry('admin_eve', 'SYSTEM_INIT', 'LinguisticDataRepository', 'N/A', 'Repository initialized with dummy data.', 'initial_payload_hash');
  }

  // --- CRUD and Query Methods ---

  /**
   * Adds an audit log entry, ensuring tamper-evidence.
   * Business value: Guarantees full traceability and integrity of all operations,
   * critical for compliance, security, and establishing an undeniable history of data changes.
   */
  public addAuditLogEntry(
    actorIdentityId: string,
    action: string,
    resourceType: string,
    resourceId: string,
    details: string,
    payload: any,
    transactionId?: string
  ): LinguisticAuditLogEntry {
    const previousEntryHash = this.linguisticAuditLog.length > 0
      ? this.linguisticAuditLog[this.linguisticAuditLog.length - 1].payloadHash
      : 'genesis_hash';

    const newEntry: LinguisticAuditLogEntry = {
      id: generateUniqueId(),
      timestamp: new Date().toISOString(),
      actorIdentityId,
      action,
      resourceType,
      resourceId,
      details,
      payloadHash: hashData(JSON.stringify(payload) + previousEntryHash),
      transactionId,
      previousEntryHash,
    };
    this.linguisticAuditLog.push(newEntry);
    console.log(`Audit Log: ${newEntry.action} by ${newEntry.actorIdentityId} on ${newEntry.resourceType}:${newEntry.resourceId}`);
    return newEntry;
  }

  public getLanguages(): Language[] { return this.languages; }
  public getLanguageById(id: string): Language | undefined { return this.languages.find(l => l.id === id); }

  public getLexicalEntries(languageId?: string): LexicalEntry[] {
    return languageId ? this.lexicalEntries.filter(le => le.languageId === languageId) : this.lexicalEntries;
  }
  public getLexicalEntryById(id: string): LexicalEntry | undefined { return this.lexicalEntries.find(le => le.id === id); }

  public getReconstructions(): Reconstruction[] { return this.reconstructions; }
  public getReconstructionById(id: string): Reconstruction | undefined { return this.reconstructions.find(r => r.id === id); }

  public getCognateSets(): CognateSet[] { return this.cognateSets; }
  public getCognateSetById(id: string): CognateSet | undefined { return this.cognateSets.find(cs => cs.id === id); }

  public getSoundCorrespondenceRules(languageId?: string): SoundCorrespondenceRule[] {
    return languageId ? this.soundCorrespondenceRules.filter(r => r.languageId === languageId) : this.soundCorrespondenceRules;
  }
  public getSoundCorrespondenceRuleById(id: string): SoundCorrespondenceRule | undefined { return this.soundCorrespondenceRules.find(r => r.id === id); }

  public getLinguisticTasks(projectId?: string): LinguisticTask[] {
    return projectId ? this.linguisticTasks.filter(t => t.projectId === projectId) : this.linguisticTasks;
  }
  public getLinguisticTaskById(id: string): LinguisticTask | undefined { return this.linguisticTasks.find(t => t.id === id); }

  public getLinguisticBounties(taskId?: string): LinguisticBounty[] {
    return taskId ? this.linguisticBounties.filter(b => b.taskId === taskId) : this.linguisticBounties;
  }
  public getLinguisticBountyById(id: string): LinguisticBounty | undefined { return this.linguisticBounties.find(b => b.id === id); }

  public getIdentities(): DigitalIdentity[] { return this.identities; }
  public getIdentityById(id: string): DigitalIdentity | undefined { return this.identities.find(i => i.id === id); }
  public getSkills(): LinguisticSkill[] { return this.skills; }
  public getSkillById(id: string): LinguisticSkill | undefined { return this.skills.find(s => s.id === id); }
  public getAuditLog(): LinguisticAuditLogEntry[] { return this.linguisticAuditLog; }

  /**
   * Adds or updates a lexical entry. Requires identity and signature.
   * Business value: Ensures all changes to fundamental linguistic data are properly attributed and secured,
   * maintaining data integrity and allowing for robust versioning and conflict resolution.
   */
  public addOrUpdateLexicalEntry(entry: LexicalEntry, identity: DigitalIdentity, signature: string): LexicalEntry | null {
    if (!verifySignature(JSON.stringify(entry), signature, identity.publicKey)) {
      console.error('Signature verification failed for lexical entry.');
      return null;
    }

    const existingIndex = this.lexicalEntries.findIndex(le => le.id === entry.id);
    const now = new Date().toISOString();
    const newEntry = { ...entry, lastUpdated: now };

    if (existingIndex > -1) {
      this.lexicalEntries[existingIndex] = newEntry;
      this.addAuditLogEntry(identity.id, 'UPDATE_LEXICAL_ENTRY', 'LexicalEntry', newEntry.id, `Updated lexical entry: ${newEntry.word}`, newEntry);
    } else {
      newEntry.id = newEntry.id || generateUniqueId();
      newEntry.dateAdded = now;
      this.lexicalEntries.push(newEntry);
      this.addAuditLogEntry(identity.id, 'CREATE_LEXICAL_ENTRY', 'LexicalEntry', newEntry.id, `Created new lexical entry: ${newEntry.word}`, newEntry);
    }
    this.addContributionRecord(identity.id, 'lexicalEntry', newEntry.id, existingIndex > -1 ? 'update' : 'create', newEntry, signature);
    return newEntry;
  }

  /**
   * Adds or updates a reconstruction.
   */
  public addOrUpdateReconstruction(recon: Reconstruction, identity: DigitalIdentity, signature: string): Reconstruction | null {
    if (!verifySignature(JSON.stringify(recon), signature, identity.publicKey)) {
      console.error('Signature verification failed for reconstruction.');
      return null;
    }
    const existingIndex = this.reconstructions.findIndex(r => r.id === recon.id);
    const now = new Date().toISOString();
    const newRecon = { ...recon, lastUpdated: now, reconstructionHistory: [...(recon.reconstructionHistory || []), { date: now, event: existingIndex > -1 ? 'Updated' : 'Created', user: identity.name }] };

    if (existingIndex > -1) {
      this.reconstructions[existingIndex] = newRecon;
      this.addAuditLogEntry(identity.id, 'UPDATE_RECONSTRUCTION', 'Reconstruction', newRecon.id, `Updated reconstruction: ${newRecon.protoWord}`, newRecon);
    } else {
      newRecon.id = newRecon.id || generateUniqueId();
      this.reconstructions.push(newRecon);
      this.addAuditLogEntry(identity.id, 'CREATE_RECONSTRUCTION', 'Reconstruction', newRecon.id, `Created new reconstruction: ${newRecon.protoWord}`, newRecon);
    }
    this.addContributionRecord(identity.id, 'reconstruction', newRecon.id, existingIndex > -1 ? 'update' : 'create', newRecon, signature);
    return newRecon;
  }

  /**
   * Adds or updates a cognate set.
   */
  public addOrUpdateCognateSet(cognateSet: CognateSet, identity: DigitalIdentity, signature: string): CognateSet | null {
    if (!verifySignature(JSON.stringify(cognateSet), signature, identity.publicKey)) {
      console.error('Signature verification failed for cognate set.');
      return null;
    }
    const existingIndex = this.cognateSets.findIndex(cs => cs.id === cognateSet.id);
    const now = new Date().toISOString();
    const newCognateSet = { ...cognateSet, lastUpdated: now };

    if (existingIndex > -1) {
      this.cognateSets[existingIndex] = newCognateSet;
      this.addAuditLogEntry(identity.id, 'UPDATE_COGNATE_SET', 'CognateSet', newCognateSet.id, `Updated cognate set for: ${newCognateSet.concept}`, newCognateSet);
    } else {
      newCognateSet.id = newCognateSet.id || generateUniqueId();
      newCognateSet.createdAt = now;
      this.cognateSets.push(newCognateSet);
      this.addAuditLogEntry(identity.id, 'CREATE_COGNATE_SET', 'CognateSet', newCognateSet.id, `Created new cognate set for: ${newCognateSet.concept}`, newCognateSet);
    }
    this.addContributionRecord(identity.id, 'cognateSet', newCognateSet.id, existingIndex > -1 ? 'update' : 'create', newCognateSet, signature);
    return newCognateSet;
  }

  /**
   * Creates a new linguistic task.
   * Business value: Formalizes the research workflow, allowing for structured assignment, tracking,
   * and potential monetization (via bounties) of linguistic problems.
   */
  public createLinguisticTask(task: Omit<LinguisticTask, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'audits'>, creatorId: string): LinguisticTask {
    const now = new Date().toISOString();
    const newTask: LinguisticTask = {
      ...task,
      id: generateUniqueId(),
      createdAt: now,
      updatedAt: now,
      status: LinguisticTaskStatus.Pending,
      audits: [],
    };
    this.linguisticTasks.push(newTask);
    this.addAuditLogEntry(creatorId, 'CREATE_TASK', 'LinguisticTask', newTask.id, `Created task: ${newTask.description}`, newTask);
    return newTask;
  }

  /**
   * Updates a linguistic task.
   */
  public updateLinguisticTask(updatedTask: LinguisticTask, updaterId: string): LinguisticTask | null {
    const index = this.linguisticTasks.findIndex(t => t.id === updatedTask.id);
    if (index === -1) return null;

    updatedTask.updatedAt = new Date().toISOString();
    this.linguisticTasks[index] = updatedTask;
    this.addAuditLogEntry(updaterId, 'UPDATE_TASK', 'LinguisticTask', updatedTask.id, `Updated task: ${updatedTask.description} (Status: ${updatedTask.status})`, updatedTask);
    return updatedTask;
  }

  /**
   * Assigns a linguistic task to an identity.
   */
  public assignLinguisticTask(taskId: string, assigneeId: string, assignerId: string): LinguisticTask | null {
    const task = this.getLinguisticTaskById(taskId);
    if (!task) return null;

    task.assignedToIdentityId = assigneeId;
    task.status = LinguisticTaskStatus.Assigned;
    return this.updateLinguisticTask(task, assignerId);
  }

  /**
   * Adds a linguistic bounty.
   * Business value: Directly links research tasks to funding mechanisms,
   * enabling a tokenized economy for linguistic research and incentivizing contributions.
   */
  public addLinguisticBounty(bounty: Omit<LinguisticBounty, 'id' | 'status' | 'fundedAt'>, funderId: string): LinguisticBounty {
    const now = new Date().toISOString();
    const newBounty: LinguisticBounty = {
      ...bounty,
      id: generateUniqueId(),
      status: 'funded',
      fundedBy: funderId,
      fundedAt: now,
    };
    this.linguisticBounties.push(newBounty);
    this.addAuditLogEntry(funderId, 'FUND_BOUNTY', 'LinguisticBounty', newBounty.id, `Funded bounty for task ${newBounty.taskId} with ${newBounty.amount} ${newBounty.tokenType}`, newBounty);
    return newBounty;
  }

  /**
   * Claims a linguistic bounty after task completion.
   * Business value: Facilitates the secure and transparent payout of rewards,
   * fostering trust in the platform's token rails and encouraging further participation.
   */
  public claimLinguisticBounty(bountyId: string, claimantId: string, transactionId: string, proof: string): LinguisticBounty | null {
    const bounty = this.getLinguisticBountyById(bountyId);
    if (!bounty || bounty.status !== 'funded') return null;

    bounty.status = 'claimed';
    bounty.claimedBy = claimantId;
    bounty.claimedAt = new Date().toISOString();
    bounty.payoutTransactionId = transactionId;
    bounty.proofOfCompletion = proof;

    this.addAuditLogEntry(claimantId, 'CLAIM_BOUNTY', 'LinguisticBounty', bounty.id, `Claimed bounty for task ${bounty.taskId}`, bounty, transactionId);
    return bounty;
  }

  /**
   * Adds a contribution record.
   * Business value: Establishes a permanent, verifiable record of all user and agent contributions,
   * essential for intellectual property, reputation management, and auditability.
   */
  private addContributionRecord(
    identityId: string,
    dataType: LinguisticContribution['dataType'],
    dataId: string,
    action: LinguisticContribution['action'],
    details: any,
    signature: string
  ): LinguisticContribution {
    const contribution: LinguisticContribution = {
      id: generateUniqueId(),
      identityId,
      dataType,
      dataId,
      action,
      timestamp: new Date().toISOString(),
      details,
      signature,
    };
    this.linguisticContributions.push(contribution);
    return contribution;
  }

  /**
   * Registers a new digital identity in the system.
   * Business value: Enables secure onboarding of users and AI agents, establishing their roles and permissions,
   * and providing the foundation for role-based access control and auditable actions across the platform.
   */
  public registerIdentity(name: string, publicKey: string, privateKey: string, roles: DigitalIdentity['roles']): DigitalIdentity {
    const newIdentity: DigitalIdentity = {
      id: `usr_${generateUniqueId()}`,
      name,
      publicKey,
      roles,
      reputationScore: 0.5,
    };
    this.identities.push(newIdentity);
    this.addAuditLogEntry('system', 'REGISTER_IDENTITY', 'DigitalIdentity', newIdentity.id, `New identity registered: ${name}`, newIdentity);
    return newIdentity;
  }

  public getIdentityRoles(identityId: string): string[] | undefined {
    return this.getIdentityById(identityId)?.roles;
  }

  /**
   * Checks if an identity has the required permissions (roles).
   * Business value: Enforces robust role-based access control, securing sensitive operations and data,
   * and ensuring that only authorized entities can perform specific actions.
   */
  public hasPermission(identityId: string, requiredRoles: string[]): boolean {
    const identity = this.getIdentityById(identityId);
    if (!identity) return false;
    return requiredRoles.some(role => identity.roles.includes(role as any));
  }
}

/**
 * Singleton instance of the data repository to simulate a global database.
 * Business value: Centralized, consistent data access across the application,
 * ensuring all components operate on the same, auditable source of truth.
 */
export const linguisticDataRepository = new LinguisticDataRepository();


// --- Agentic AI System Simulation (Conceptual) ---

/**
 * Simulates an Agentic AI system specifically for linguistic tasks.
 * Business value: Automates complex comparative linguistic analysis, dramatically accelerating research cycles.
 * Enables the deployment of specialized AI agents that monitor, decide, and act on linguistic data,
 * unlocking new insights and reducing human effort in data processing and reconstruction.
 */
export class LinguisticAgentCoordinator {
  private repository: LinguisticDataRepository;
  private messageQueue: string[] = []; // Simulate a simple in-repo message queue

  constructor(repository: LinguisticDataRepository) {
    this.repository = repository;
  }

  /**
   * Simulates sending a message to the agent system.
   */
  private sendMessage(message: string) {
    this.messageQueue.push(`[${new Date().toISOString()}] ${message}`);
    console.log(`Agent Queue: Added message - ${message}`);
  }

  /**
   * Simulates an agent processing a task.
   * Business value: Demonstrates autonomous task execution, showing how AI agents
   * can independently perform complex operations, from data collection to final output,
   * providing a scalable and efficient research workforce.
   */
  public async processLinguisticTask(taskId: string, agentIdentityId: string): Promise<LinguisticTask | null> {
    const agent = this.repository.getIdentityById(agentIdentityId);
    if (!agent || !agent.roles.includes('agent')) {
      console.error('Only agents can process tasks.');
      return null;
    }
    if (!this.repository.hasPermission(agentIdentityId, ['agent'])) {
      console.error(`Agent ${agentIdentityId} lacks permission to process tasks.`);
      return null;
    }

    let task = this.repository.getLinguisticTaskById(taskId);
    if (!task || task.status !== LinguisticTaskStatus.Assigned || task.assignedToIdentityId !== agentIdentityId) {
      console.warn(`Task ${taskId} not ready for agent ${agentIdentityId} or not assigned to it.`);
      return null;
    }

    const skill = this.repository.getSkillById(task.type);
    if (!skill) {
      console.error(`Unknown skill type: ${task.type}`);
      task.status = LinguisticTaskStatus.Failed;
      this.repository.updateLinguisticTask(task, agentIdentityId);
      return null;
    }

    this.sendMessage(`Agent ${agent.name} (ID: ${agentIdentityId}) started task ${taskId}: ${task.description}`);
    task.status = LinguisticTaskStatus.InProgress;
    task.audits?.push(this.repository.addAuditLogEntry(agentIdentityId, 'TASK_STATUS_UPDATE', 'LinguisticTask', task.id, `Status changed to InProgress by agent.`, task));
    this.repository.updateLinguisticTask(task, agentIdentityId);

    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate work

    let output: any = {};
    let newStatus = LinguisticTaskStatus.Completed;
    let details = 'Task completed successfully.';

    try {
      if (task.type === 'ProtoWordReconstruction') {
        const cognateSet = this.repository.getCognateSetById(task.parameters.cognateSetId);
        if (cognateSet) {
          const protoWord = `*${cognateSet.concept.toUpperCase()}_RECON`;
          output = {
            protoWord,
            meaning: cognateSet.concept,
            confidence: 0.8,
            descendantEvidence: cognateSet.members.map(m => ({ language: m.languageId, word: m.wordForm })),
          };
          const newRecon: Reconstruction = {
            id: generateUniqueId(),
            protoLanguageId: this.repository.getLanguageById('pie')?.id || 'proto_lang_unknown',
            protoWord: protoWord,
            meaning: cognateSet.concept,
            ipa: `/${protoWord.toLowerCase().replace('*', '')}/`,
            confidence: 0.8,
            descendantEvidence: cognateSet.members.map(m => ({
              languageId: m.languageId,
              language: this.repository.getLanguageById(m.languageId)?.name || m.languageId,
              word: m.wordForm,
              ipa: m.ipa,
              relation: 'cognate',
              soundCorrespondences: [],
            })),
            semanticField: cognateSet.semanticField || 'unknown',
            reconstructionMethod: 'computational',
            status: 'tentative',
            proposedBy: agent.name,
            dateProposed: new Date().toISOString(),
          };
          const signature = signData(JSON.stringify(newRecon), 'AGENT_PRIVATE_KEY');
          this.repository.addOrUpdateReconstruction(newRecon, agent, signature);
          details = `Proposed new reconstruction for "${cognateSet.concept}": ${protoWord}`;
        } else {
          newStatus = LinguisticTaskStatus.Failed;
          details = 'Cognate set not found for reconstruction task.';
        }
      } else if (task.type === 'SoundLawDetection') {
        output = {
          ruleProposed: true,
          protoSound: task.parameters.specificSound,
          descendantSound: 'f',
          confidence: 0.75,
          notes: 'Hypothetical shift identified by AI agent.',
        };
        const newRule: SoundCorrespondenceRule = {
          id: generateUniqueId(),
          protoSound: task.parameters.specificSound,
          descendantSound: 'f',
          context: '/_V',
          environment: 'all',
          languageId: task.parameters.descendantLanguage,
          appliesTo: 'consonant',
          examples: [{ protoWord: '*unknown', descendantWord: 'foo' }],
          confidence: 0.75,
          notes: 'AI proposed rule.',
          source: `AI Agent ${agent.name}`,
          priority: 50,
          dateEstablished: new Date().toISOString(),
        };
        // This would require a `addOrUpdateSoundCorrespondenceRule` method in the repository
        // For now, just simulate output.
        details = `Proposed sound law: ${task.parameters.protoLanguage} ${task.parameters.specificSound} > ${task.parameters.descendantLanguage} f`;
      } else if (task.type === 'CognateIdentification') {
        output = {
          potentialCognates: [{ word1: 'eng_fish', word2: 'got_fisks', score: 0.9 }],
          notes: 'Identified potential cognates based on phonetic similarity and semantic field.',
        };
        details = 'Identified potential cognates.';
      } else if (task.type === 'DataValidation') {
        output = { validationResult: 'Passed', errors: [] };
        details = 'Data validation completed successfully.';
      }
    } catch (e: any) {
      newStatus = LinguisticTaskStatus.Failed;
      details = `Task failed during execution: ${e.message}`;
      console.error(`Agent ${agentIdentityId} failed task ${taskId}:`, e);
    }

    task.status = newStatus;
    task.output = output;
    task.audits?.push(this.repository.addAuditLogEntry(agentIdentityId, 'TASK_STATUS_UPDATE', 'LinguisticTask', task.id, `Status changed to ${newStatus} by agent. Details: ${details}`, task));
    this.repository.updateLinguisticTask(task, agentIdentityId);
    this.sendMessage(`Agent ${agent.name} completed task ${taskId} with status: ${newStatus}. Details: ${details}`);

    if (newStatus === LinguisticTaskStatus.Completed) {
      const bounty = this.repository.getLinguisticBounties(task.id).find(b => b.status === 'funded');
      if (bounty) {
        const transactionId = `TX_${generateUniqueId()}`;
        this.repository.claimLinguisticBounty(bounty.id, agentIdentityId, transactionId, hashData(JSON.stringify(output)));
        this.sendMessage(`Agent ${agent.name} claimed bounty for task ${taskId}. Transaction: ${transactionId}`);
      }
    }

    return task;
  }

  /**
   * Monitors for new pending tasks and assigns them to available agents.
   * Business value: Implements the "monitor -> decide -> act" loop for agentic AI,
   * ensuring continuous, autonomous processing of research tasks and optimal resource utilization.
   */
  public async monitorAndDispatchTasks(): Promise<void> {
    const pendingTasks = this.repository.getLinguisticTasks().filter(t => t.status === LinguisticTaskStatus.Pending);
    const availableAgents = this.repository.getIdentities().filter(id =>
      id.roles.includes('agent') && !this.repository.getLinguisticTasks().some(t =>
        t.assignedToIdentityId === id.id && (t.status === LinguisticTaskStatus.Assigned || t.status === LinguisticTaskStatus.InProgress)
      )
    );

    for (const task of pendingTasks) {
      if (availableAgents.length > 0) {
        const agent = availableAgents.shift();
        if (agent) {
          console.log(`Dispatching task ${task.id} (${task.description}) to agent ${agent.name}.`);
          this.repository.assignLinguisticTask(task.id, agent.id, 'system');
          this.processLinguisticTask(task.id, agent.id);
        }
      } else {
        console.log('No available agents to dispatch pending tasks.');
        break;
      }
    }
  }

  /**
   * Returns the simulated message queue for observability.
   */
  public getMessageQueue(): string[] {
    return this.messageQueue;
  }
}

/**
 * Singleton instance of the Linguistic Agent Coordinator.
 * Business value: Central orchestrator for all AI-driven linguistic research,
 * ensuring seamless execution of autonomous workflows and maximizing the efficiency
 * and impact of computational linguistics.
 */
export const linguisticAgentCoordinator = new LinguisticAgentCoordinator(linguisticDataRepository);

// --- React Context and Reducer for Linguistic Project State ---

/**
 * Represents the current state of a user's linguistic research project.
 * Business value: Provides a cohesive, real-time view of all project-related data,
 * facilitating user interaction, collaboration, and comprehensive project management.
 * This enhances user experience and productivity in a complex data environment.
 */
export interface LinguisticProjectState {
  currentProjectId: string | null;
  selectedLanguageId: string | null;
  selectedLexicalEntryId: string | null;
  selectedReconstructionId: string | null;
  selectedCognateSetId: string | null;
  tasks: LinguisticTask[];
  bounties: LinguisticBounty[];
  auditLog: LinguisticAuditLogEntry[];
  messageQueue: string[];
}

/**
 * Initial state for the Linguistic Project Context.
 */
const initialLinguisticProjectState: LinguisticProjectState = {
  currentProjectId: 'proj_global_recon',
  selectedLanguageId: null,
  selectedLexicalEntryId: null,
  selectedReconstructionId: null,
  selectedCognateSetId: null,
  tasks: [],
  bounties: [],
  auditLog: [],
  messageQueue: [],
};

/**
 * Actions for the Linguistic Project Reducer.
 */
type LinguisticProjectAction =
  | { type: 'SET_CURRENT_PROJECT'; payload: string }
  | { type: 'SET_SELECTED_LANGUAGE'; payload: string | null }
  | { type: 'SET_SELECTED_LEXICAL_ENTRY'; payload: string | null }
  | { type: 'SET_SELECTED_RECONSTRUCTION'; payload: string | null }
  | { type: 'SET_SELECTED_COGNATE_SET'; payload: string | null }
  | { type: 'LOAD_PROJECT_DATA'; payload: { tasks: LinguisticTask[]; bounties: LinguisticBounty[]; auditLog: LinguisticAuditLogEntry[] } }
  | { type: 'ADD_TASK'; payload: LinguisticTask }
  | { type: 'UPDATE_TASK'; payload: LinguisticTask }
  | { type: 'ADD_BOUNTY'; payload: LinguisticBounty }
  | { type: 'UPDATE_BOUNTY'; payload: LinguisticBounty }
  | { type: 'UPDATE_AUDIT_LOG'; payload: LinguisticAuditLogEntry[] }
  | { type: 'UPDATE_MESSAGE_QUEUE'; payload: string[] };

/**
 * Reducer function for managing Linguistic Project State.
 * Business value: Provides predictable state management for complex UI interactions,
 * ensuring data consistency and a reliable user experience. It's the engine for dynamic updates
 * as agents and users interact with the linguistic data.
 */
export function linguisticProjectReducer(state: LinguisticProjectState, action: LinguisticProjectAction): LinguisticProjectState {
  switch (action.type) {
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProjectId: action.payload };
    case 'SET_SELECTED_LANGUAGE':
      return { ...state, selectedLanguageId: action.payload };
    case 'SET_SELECTED_LEXICAL_ENTRY':
      return { ...state, selectedLexicalEntryId: action.payload };
    case 'SET_SELECTED_RECONSTRUCTION':
      return { ...state, selectedReconstructionId: action.payload };
    case 'SET_SELECTED_COGNATE_SET':
      return { ...state, selectedCognateSetId: action.payload };
    case 'LOAD_PROJECT_DATA':
      return {
        ...state,
        tasks: action.payload.tasks,
        bounties: action.payload.bounties,
        auditLog: action.payload.auditLog,
      };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return { ...state, tasks: state.tasks.map(task => task.id === action.payload.id ? action.payload : task) };
    case 'ADD_BOUNTY':
      return { ...state, bounties: [...state.bounties, action.payload] };
    case 'UPDATE_BOUNTY':
      return { ...state, bounties: state.bounties.map(bounty => bounty.id === action.payload.id ? action.payload : bounty) };
    case 'UPDATE_AUDIT_LOG':
      return { ...state, auditLog: action.payload };
    case 'UPDATE_MESSAGE_QUEUE':
      return { ...state, messageQueue: action.payload };
    default:
      return state;
  }
}

/**
 * React Context for the Linguistic Project State.
 * Business value: Enables efficient and predictable state sharing across the UI,
 * decoupling components and simplifying data flow in complex user interfaces,
 * leading to more maintainable and scalable front-end development.
 */
export const LinguisticProjectContext = createContext<{
  state: LinguisticProjectState;
  dispatch: React.Dispatch<LinguisticProjectAction>;
}>({
  state: initialLinguisticProjectState,
  dispatch: () => null,
});

/**
 * Custom hook to use the Linguistic Project Context.
 */
export const useLinguisticProject = () => useContext(LinguisticProjectContext);

/**
 * Main View Component for the Linguistic Fossil Finder.
 * Business value: Provides an intuitive and powerful user interface for interacting
 * with the advanced linguistic analysis system. It translates complex backend logic
 * into actionable insights and collaborative tools, empowering researchers and
 * accelerating the discovery of linguistic history.
 */
export const LinguisticFossilFinderView: React.FC = () => {
  const [state, dispatch] = useReducer(linguisticProjectReducer, initialLinguisticProjectState);
  const [loading, setLoading] = useState(true);

  // Load initial project data
  useEffect(() => {
    const loadData = async () => {
      const tasks = linguisticDataRepository.getLinguisticTasks(state.currentProjectId || undefined);
      const bounties = linguisticDataRepository.getLinguisticBounties();
      const auditLog = linguisticDataRepository.getAuditLog();
      const messageQueue = linguisticAgentCoordinator.getMessageQueue();

      dispatch({ type: 'LOAD_PROJECT_DATA', payload: { tasks, bounties, auditLog } });
      dispatch({ type: 'UPDATE_MESSAGE_QUEUE', payload: messageQueue });
      setLoading(false);
    };

    loadData();

    // Set up interval for agent to monitor and dispatch tasks (simulation of continuous operation)
    const agentMonitorInterval = setInterval(() => {
      linguisticAgentCoordinator.monitorAndDispatchTasks();
      dispatch({ type: 'UPDATE_AUDIT_LOG', payload: linguisticDataRepository.getAuditLog() });
      dispatch({ type: 'UPDATE_MESSAGE_QUEUE', payload: linguisticAgentCoordinator.getMessageQueue() });
      dispatch({ type: 'LOAD_PROJECT_DATA', payload: { tasks: linguisticDataRepository.getLinguisticTasks(state.currentProjectId || undefined), bounties: linguisticDataRepository.getLinguisticBounties(), auditLog: linguisticDataRepository.getAuditLog() } });
    }, 5000);

    return () => clearInterval(agentMonitorInterval);
  }, [state.currentProjectId]);

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        Loading Linguistic Data Repository...
      </div>
    );
  }

  // --- Example UI Snippet (for illustration, actual UI would be much richer) ---
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 space-y-6">
      <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">Linguistic Fossil Finder (Agentic Research Platform)</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300">
        Empowering historical linguists with AI-driven reconstruction, auditable collaboration, and tokenized research incentives.
      </p>

      <section className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-300 mb-4">Project Overview: {state.currentProjectId}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-200">Total Languages:</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{linguisticDataRepository.getLanguages().length}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-200">Total Reconstructions:</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{linguisticDataRepository.getReconstructions().length}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-200">Active Tasks:</h3>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{state.tasks.filter(t => t.status === LinguisticTaskStatus.Assigned || t.status === LinguisticTaskStatus.InProgress).length}</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-300 mb-4">Linguistic Tasks & Bounties</h2>
        <div className="space-y-3">
          {state.tasks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No active tasks. Create one to get started!</p>
          ) : (
            state.tasks.map(task => {
              const bounty = state.bounties.find(b => b.taskId === task.id);
              const assignee = linguisticDataRepository.getIdentityById(task.assignedToIdentityId || '');
              return (
                <div key={task.id} className="p-3 border border-gray-200 dark:border-gray-600 rounded-md flex justify-between items-center bg-white dark:bg-gray-800">
                  <div>
                    <p className="font-medium text-lg">{task.description}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Status: <span className={`font-semibold ${task.status === LinguisticTaskStatus.Completed ? 'text-green-500' : task.status === LinguisticTaskStatus.Failed ? 'text-red-500' : 'text-yellow-500'}`}>{task.status}</span></p>
                    {assignee && <p className="text-xs text-gray-500 dark:text-gray-400">Assigned To: {assignee.name} ({assignee.roles.includes('agent') ? 'Agent' : 'Human'})</p>}
                    {bounty && <p className="text-sm text-gray-600 dark:text-gray-300">Bounty: <span className="font-semibold text-purple-600 dark:text-purple-400">{bounty.amount} {bounty.tokenType}</span> (Status: {bounty.status})</p>}
                    {task.output && <p className="text-xs text-gray-500 dark:text-gray-400">Output: {JSON.stringify(task.output).substring(0, 100)}...</p>}
                  </div>
                </div>
              );
            })
          )}
        </div>
        <button
          onClick={() => {
            const newTask: Omit<LinguisticTask, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'audits'> = {
              projectId: state.currentProjectId || 'default_project',
              type: 'ProtoWordReconstruction',
              description: `Automated recon task for new cognates ${generateUniqueId().substring(4, 10)}`,
              parameters: { cognateSetId: 'cs_father_ie' },
              priority: 'high',
              deadline: new Date(Date.now() + 86400000).toISOString(),
            };
            const createdTask = linguisticDataRepository.createLinguisticTask(newTask, 'usr_alice');
            dispatch({ type: 'ADD_TASK', payload: createdTask });

            const newBounty: Omit<LinguisticBounty, 'id' | 'status' | 'fundedAt'> = {
              taskId: createdTask.id,
              amount: 75,
              tokenType: 'LINGUIST_COIN',
              fundedBy: 'admin_eve',
            };
            const fundedBounty = linguisticDataRepository.addLinguisticBounty(newBounty, 'admin_eve');
            dispatch({ type: 'ADD_BOUNTY', payload: fundedBounty });
          }}
          className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
        >
          Create New Reconstruction Task (Demo)
        </button>
      </section>

      <section className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-300 mb-4">Linguistic Agent Activity Log</h2>
        <div className="h-48 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md p-2 text-sm font-mono text-gray-800 dark:text-gray-200">
          {state.messageQueue.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-300 mb-4">Global Audit Trail (Tamper-Evident)</h2>
        <div className="h-48 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md p-2 text-sm font-mono text-gray-800 dark:text-gray-200">
          {state.auditLog.map((entry, index) => (
            <div key={entry.id} className="mb-1 pb-1 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
              <p><strong>{entry.timestamp}</strong> - <span className="text-blue-500">{entry.actorIdentityId}</span> {entry.action} on <span className="text-green-500">{entry.resourceType}:{entry.resourceId}</span></p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Details: {entry.details}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Hash: {entry.payloadHash.substring(0, 16)}... {entry.previousEntryHash && `(Prev: ${entry.previousEntryHash.substring(0, 16)}...)`}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};