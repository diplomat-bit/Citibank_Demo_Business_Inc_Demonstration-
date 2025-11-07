```typescript
import React, { useState, useEffect, useCallback, useReducer, createContext, useContext } from 'react';

/**
 * This module defines the core data structures and utility functions for the Chaos Theorist View,
 * a pivotal component in the Money20/20 "build phase" architecture. It provides the foundational
 * types for modeling complex, chaotic systems, identifying leverage points, simulating interventions,
 * and managing user interactions and system state.
 *
 * Business Value: This file is the bedrock for enabling enterprises to model, predict, and influence
 * high-stakes financial, operational, or environmental systems. By providing precise definitions
 * for System Definitions, Leverage Points, and Simulation Runs, it allows for the development
 * of agentic AI systems that can autonomously monitor, analyze, and recommend actions within
 * complex environments. This capability translates directly into millions in value by:
 * 1.  **Risk Mitigation:** Identifying and mitigating unforeseen risks in real-time.
 * 2.  **Strategic Optimization:** Optimizing resource allocation and intervention strategies for maximum ROI.
 * 3.  **Predictive Governance:** Establishing a robust framework for understanding and controlling
 *     the emergent behavior of interconnected financial and operational rails.
 * 4.  **Competitive Advantage:** Empowering data-driven, preemptive decision-making in volatile markets.
 * This infrastructure transforms reactive operations into proactive, intelligent management,
 * delivering unparalleled control and foresight to enterprise clients.
 */

// --- Global Type Definitions and Interfaces (START) ---

/**
 * @typedef {string} SystemIdentifier - A unique string identifier for a chaotic system.
 * @typedef {string} UserIdentifier - A unique string identifier for a user.
 * @typedef {string} Timestamp - ISO 8601 formatted string for date and time.
 * @typedef {string} ScenarioIdentifier - A unique identifier for a simulation scenario.
 * @typedef {string} SimulationRunIdentifier - A unique identifier for a specific simulation execution.
 * @typedef {string} ModelVersion - A string indicating the version of a mathematical model used.
 * @typedef {string} AgentIdentifier - A unique identifier for an AI agent.
 * @typedef {string} TransactionIdentifier - A unique identifier for a financial transaction.
 * @typedef {string} TokenIdentifier - A unique identifier for a type of token.
 * @typedef {string} AccountIdentifier - A unique identifier for an account on the token rail.
 */
export type SystemIdentifier = string;
export type UserIdentifier = string;
export type Timestamp = string;
export type ScenarioIdentifier = string;
export type SimulationRunIdentifier = string;
export type ModelVersion = string;
export type AgentIdentifier = string;
export type TransactionIdentifier = string;
export type TokenIdentifier = string;
export type AccountIdentifier = string;

/**
 * Represents a single point of leverage within a chaotic system.
 * This interface has been significantly expanded to include more detail
 * necessary for real-world application, such as impact metrics,
 * reversibility, and associated risks.
 */
export interface LeveragePoint {
  /** A unique identifier for this leverage point. */
  id: string;
  /** A clear, actionable description of the intervention. */
  action: string;
  /** Estimated monetary cost of implementing the action. */
  cost: string;
  /** The probability (0-1) of achieving the desired outcome. */
  outcomeProbability: number;
  /** The estimated time frame from implementation to observable impact. */
  timeToImpact: string;
  /** A more detailed qualitative description of the action and its mechanism. */
  description: string;
  /** Potential positive secondary effects beyond the primary goal. */
  positiveSideEffects: string[];
  /** Potential negative unintended consequences. */
  negativeSideEffects: string[];
  /** The estimated magnitude of the desired impact (e.g., "5% increase"). */
  impactMagnitude: string;
  /** A confidence score (0-1) in the accuracy of the prediction for this leverage point. */
  predictionConfidence: number;
  /** The estimated effort required to implement the action (e.g., "Low", "Medium", "High", "Very High"). */
  implementationEffort: 'Low' | 'Medium' | 'High' | 'Very High';
  /** Indicates if the action is easily reversible if unintended consequences occur. */
  reversibility: 'High' | 'Medium' | 'Low' | 'Irreversible';
  /** Associated risks, categorized (e.g., financial, ecological, social). */
  risks: { category: string; severity: 'Low' | 'Medium' | 'High'; description: string }[];
  /** A list of necessary resources for implementation. */
  requiredResources: string[];
  /** Key stakeholders who would be affected or need to be involved. */
  stakeholders: { name: string; role: string; influence: 'Low' | 'Medium' | 'High' }[];
  /** Historical success rate of similar interventions, if available. */
  historicalSuccessRate?: number;
  /** Last updated timestamp for this leverage point analysis. */
  lastUpdated: Timestamp;
  /** The AI agent responsible for identifying or proposing this leverage point. */
  proposedByAgentId?: AgentIdentifier;
  /** Link to a specific skill or capability of an agent needed to execute this leverage point. */
  requiredSkill?: string;
  /** Estimated impact on key performance indicators (KPIs), e.g., 'ROI: 15%'. */
  estimatedKpiImpact?: string[];
}

/**
 * Defines a parameter within a chaotic system, including its properties and ranges.
 */
export interface SystemParameter {
  /** Unique identifier for the parameter. */
  id: string;
  /** Display name of the parameter. */
  name: string;
  /** A brief description of what the parameter represents. */
  description: string;
  /** The current value of the parameter. */
  currentValue: number | string | boolean;
  /** The unit of measurement for the parameter (e.g., "Celsius", "ppm", "%). */
  unit: string;
  /** The minimum plausible value for the parameter. */
  minValue: number;
  /** The maximum plausible value for the parameter. */
  maxValue: number;
  /** Step size for UI controls or simulation increments. */
  step: number;
  /** Indicates if this parameter is a potential leverage point. */
  isLeverageCandidate: boolean;
  /** Data type of the parameter (e.g., 'number', 'boolean', 'enum'). */
  dataType: 'number' | 'boolean' | 'string' | 'enum';
  /** If dataType is 'enum', possible string values. */
  enumValues?: string[];
  /** A list of parameter dependencies. */
  dependencies?: { parameterId: string; type: 'influences' | 'is-influenced-by' }[];
  /** Security level required to modify this parameter (e.g., 'low', 'medium', 'high'). */
  securityLevel: 'low' | 'medium' | 'high';
}

/**
 * Represents an observable metric or output from the chaotic system.
 */
export interface SystemMetric {
  /** Unique identifier for the metric. */
  id: string;
  /** Display name of the metric. */
  name: string;
  /** A brief description of the metric. */
  description: string;
  /** The current observed value of the metric. */
  currentValue: number | string | boolean;
  /** The unit of measurement for the metric. */
  unit: string;
  /** The desired target range or value for this metric. */
  target?: { min?: number; max?: number; value?: number; unit: string };
  /** A history of values for this metric over time. */
  history: { timestamp: Timestamp; value: number | string | boolean }[];
  /** Thresholds for alerts (e.g., warning, critical). */
  alertThresholds?: {
    warning?: { operator: '>' | '<' | '=' | '!='; value: number | string };
    critical?: { operator: '>' | '<' | '=' | '!='; value: number | string };
  };
  /** Indicates if this metric is derived or directly observed. */
  isDerived: boolean;
  /** Formula or method for derivation if `isDerived` is true. */
  derivationMethod?: string;
  /** Associated data quality score (0-1). */
  dataQualityScore: number;
}

/**
 * Defines a specific feedback loop within the chaotic system.
 */
export interface FeedbackLoop {
  /** Unique identifier for the feedback loop. */
  id: string;
  /** Name of the feedback loop. */
  name: string;
  /** A description of the loop's mechanism. */
  description: string;
  /** Type of feedback: 'positive' (amplifying) or 'negative' (dampening). */
  type: 'positive' | 'negative';
  /** Source parameter/metric influencing the loop. */
  sourceId: string;
  /** Target parameter/metric influenced by the loop. */
  targetId: string;
  /** Strength of the feedback loop (e.g., a multiplier or impact factor). */
  strength: number;
  /** Delay in impact propagation for this loop (e.g., "1 week", "3 months"). */
  delay: string;
  /** Confidence score in the existence and strength of this feedback loop. */
  confidence: number;
  /** Is this loop dynamically changing? */
  isDynamic: boolean;
}

/**
 * Represents a complete definition of a chaotic system.
 * This includes its parameters, metrics, and feedback loops,
 * making it a robust model for analysis and simulation.
 */
export interface ChaoticSystemDefinition {
  /** Unique identifier for this system definition. */
  id: SystemIdentifier;
  /** User-defined name for the system (e.g., "Central Valley Rainfall System"). */
  name: string;
  /** A detailed description of the system and its boundaries. */
  description: string;
  /** Date and time when the system definition was created. */
  createdAt: Timestamp;
  /** Date and time when the system definition was last modified. */
  lastModified: Timestamp;
  /** Identifier of the user who owns/created this system definition. */
  ownerId: UserIdentifier;
  /** A list of parameters that define the state and behavior of the system. */
  parameters: SystemParameter[];
  /** A list of observable metrics derived from the system. */
  metrics: SystemMetric[];
  /** A list of identified feedback loops within the system. */
  feedbackLoops: FeedbackLoop[];
  /** Current status of the system (e.g., 'Active', 'Archived', 'Draft'). */
  status: 'Active' | 'Archived' | 'Draft' | 'Under Review' | 'Retired';
  /** Versioning of the system definition schema. */
  schemaVersion: string;
  /** Tags for categorization or search. */
  tags: string[];
  /** Geographical or contextual scope of the system. */
  scope: string;
  /** External data sources used for this system (e.g., weather APIs, economic indicators). */
  externalDataSources: { name: string; url: string; lastSync: Timestamp; status: 'active' | 'inactive' | 'error' }[];
  /** Access control settings for this system. */
  accessControl: {
    public: boolean;
    sharedWithUsers: UserIdentifier[];
    sharedWithGroups: string[];
    rbacPolicyId?: string; // Reference to a global RBAC policy
  };
  /** Reference to the mathematical model used for simulation. */
  simulationModelRef: string;
  /** Model version used. */
  modelVersion: ModelVersion;
  /** An array of agent IDs currently monitoring or managing this system. */
  monitoringAgents: AgentIdentifier[];
  /** Configuration for real-time monitoring of this system. */
  monitoringConfig: {
    intervalSeconds: number;
    alertOnAnomaly: boolean;
    anomalyDetectionModel: string;
  };
  /** Security classification for the data within this system (e.g., 'public', 'confidential', 'restricted'). */
  securityClassification: 'public' | 'confidential' | 'restricted';
  /** Compliance standards relevant to this system (e.g., 'GDPR', 'PCI-DSS', 'SOC2'). */
  complianceStandards: string[];
}

/**
 * Represents a single simulation run of a chaotic system.
 */
export interface SimulationRun {
  /** Unique identifier for this simulation run. */
  id: SimulationRunIdentifier;
  /** Identifier of the chaotic system definition used for this run. */
  systemId: SystemIdentifier;
  /** Identifier of the user or agent who initiated the simulation. */
  initiatedBy: UserIdentifier | AgentIdentifier;
  /** Timestamp when the simulation started. */
  startTime: Timestamp;
  /** Timestamp when the simulation finished. */
  endTime?: Timestamp;
  /** Status of the simulation run. */
  status: 'Pending' | 'Running' | 'Completed' | 'Failed' | 'Canceled' | 'Optimizing';
  /** Initial conditions (parameter values) at the start of the simulation. */
  initialConditions: { parameterId: string; value: number | string | boolean }[];
  /** Applied leverage points for this simulation run. */
  appliedLeveragePoints: { leveragePointId: string; timestamp: Timestamp; details: string; appliedBy: UserIdentifier | AgentIdentifier }[];
  /** Duration of the simulation in simulated time units (e.g., "365 days"). */
  simulatedDuration: string;
  /** Results of the simulation, typically time-series data for metrics. */
  results: {
    metricId: string;
    data: { timeStep: number; value: number | string | boolean }[];
  }[];
  /** Any warnings or errors encountered during the simulation. */
  logMessages: { timestamp: Timestamp; level: 'info' | 'warn' | 'error'; message: string }[];
  /** Configuration settings used for the simulation (e.g., step size, number of iterations). */
  configuration: {
    timeStepSize: string; // e.g., "1 hour", "1 day"
    iterations: number;
    stochasticityFactor: number; // 0-1, how much randomness to introduce
    seed?: number; // For reproducible stochastic simulations
    performanceMode: 'fast' | 'balanced' | 'high-fidelity';
  };
  /** Associated scenario, if applicable. */
  scenarioId?: ScenarioIdentifier;
  /** Performance metrics of the simulation itself. */
  performanceMetrics: {
    cpuUsage: number; // %
    memoryUsage: number; // MB
    realTimeDurationMs: number;
    costEstimateUSD: number; // Estimated compute cost
  };
  /** Version of the simulation engine used. */
  engineVersion: string;
  /** Hash of the simulation inputs for integrity/reproducibility verification. */
  inputHash: string;
}

/**
 * Represents a scenario for comparing different leverage points or system configurations.
 */
export interface SimulationScenario {
  /** Unique identifier for the scenario. */
  id: ScenarioIdentifier;
  /** Name of the scenario. */
  name: string;
  /** Description of the scenario's purpose. */
  description: string;
  /** Identifier of the base system definition for this scenario. */
  baseSystemId: SystemIdentifier;
  /** User or agent who created the scenario. */
  createdBy: UserIdentifier | AgentIdentifier;
  /** Creation timestamp. */
  createdAt: Timestamp;
  /** Last modification timestamp. */
  lastModified: Timestamp;
  /** List of simulation runs included in this scenario. */
  simulationRuns: SimulationRunIdentifier[];
  /** Proposed leverage points for this scenario. */
  proposedLeveragePoints: LeveragePoint[];
  /** Comparison metrics to evaluate scenario success. */
  comparisonMetrics: { metricId: string; targetValue?: number; targetRange?: [number, number]; priority: 'High' | 'Medium' | 'Low' }[];
  /** Status of the scenario (e.g., 'Draft', 'Active', 'Completed'). */
  status: 'Draft' | 'Active' | 'Completed' | 'Archived' | 'UnderReview';
  /** Notes or conclusions from the scenario analysis. */
  notes: string;
  /** Files or documents associated with the scenario (e.g., reports). */
  attachments: { fileName: string; url: string; uploadedAt: Timestamp; uploadedBy: UserIdentifier | AgentIdentifier }[];
  /** Security classification for this scenario. */
  securityClassification: 'public' | 'confidential' | 'restricted';
}

/**
 * Represents a user of the system.
 */
export interface UserProfile {
  id: UserIdentifier;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  organization: string;
  roles: ('admin' | 'analyst' | 'viewer' | 'agent-manager')[];
  lastLogin: Timestamp;
  preferences: UserPreferences;
  publicKey?: string; // For digital identity verification
}

/**
 * User-specific preferences for the application.
 */
export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  notificationSettings: {
    email: boolean;
    inApp: boolean;
    sms: boolean;
    alertOnCritical: boolean;
    alertOnWarning: boolean;
  };
  defaultSystemView: 'dashboard' | 'simulation' | 'leverage';
  timezone: string;
  dateFormat: string;
  measurementUnits: {
    temperature: 'celsius' | 'fahrenheit';
    rainfall: 'mm' | 'inches';
    cost: 'USD' | 'EUR' | 'GBP';
  };
  preferredCharts: string[]; // Array of ChartConfig IDs
}

/**
 * Represents an alert or notification generated by the system.
 */
export interface SystemAlert {
  id: string;
  systemId: SystemIdentifier;
  metricId?: string;
  type: 'info' | 'warning' | 'critical' | 'success' | 'anomaly';
  message: string;
  timestamp: Timestamp;
  isRead: boolean;
  actionRequired: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: 'monitoring' | 'simulation' | 'user-activity' | 'agent-activity' | 'system-health';
  details: { [key: string]: any };
  resolvedBy?: UserIdentifier | AgentIdentifier;
  resolutionNotes?: string;
  resolvedAt?: Timestamp;
}

/**
 * Represents an entry in the system's audit log.
 * Crucial for governance, compliance, and security, ensuring
 * a tamper-evident record of all significant actions.
 */
export interface AuditLogEntry {
  id: string;
  timestamp: Timestamp;
  userId?: UserIdentifier; // Can be null if action by agent
  agentId?: AgentIdentifier; // Can be null if action by user
  action: string; // e.g., "CREATE_SYSTEM", "UPDATE_PARAMETER", "RUN_SIMULATION", "AGENT_ACTION_APPLY_LP"
  entityType: 'SystemDefinition' | 'LeveragePoint' | 'SimulationRun' | 'UserProfile' | 'Scenario' | 'Agent' | 'TokenAccount' | 'Transaction';
  entityId: string;
  changes: { field: string; oldValue: any; newValue: any }[];
  ipAddress: string;
  userAgent: string;
  signature?: string; // Cryptographic signature for tamper evidence
  previousEntryHash?: string; // For chained hash integrity
}

/**
 * Represents a charting configuration for visualizing simulation results or metric history.
 */
export interface ChartConfig {
  id: string;
  name: string;
  chartType: 'line' | 'bar' | 'scatter' | 'area' | 'pie';
  metricsToShow: string[]; // Array of metric IDs
  parametersToShow?: string[]; // Array of parameter IDs
  xAxisLabel: string;
  yAxisLabel: string;
  title: string;
  colorScheme: string[]; // e.g., ['#FF6384', '#36A2EB']
  interpolation: 'linear' | 'spline' | 'step';
  showLegend: boolean;
  showTooltips: boolean;
  zoomEnabled: boolean;
  timeRange?: [Timestamp, Timestamp];
  isPublic: boolean;
  createdBy: UserIdentifier;
  createdAt: Timestamp;
}

/**
 * Represents an Agent in the agentic AI system.
 * These agents perform autonomous monitoring, decision-making, and action.
 */
export interface Agent {
  id: AgentIdentifier;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'error' | 'maintenance';
  ownerUserId: UserIdentifier; // User responsible for this agent
  createdAt: Timestamp;
  lastActive: Timestamp;
  skills: string[]; // e.g., 'monitor-metrics', 'simulate-system', 'propose-leverage-points', 'anomaly-detection'
  assignedSystems: SystemIdentifier[]; // Systems this agent is responsible for
  configuration: {
    autonomyLevel: 'advisory' | 'semi-autonomous' | 'fully-autonomous';
    decisionThreshold: number; // (0-1) confidence threshold for autonomous action
    notificationPreferences: string[]; // e.g., 'critical-alerts-only'
  };
  performanceMetrics: {
    tasksCompleted: number;
    errorsEncountered: number;
    uptimeMinutes: number;
    costCumulativeUSD: number;
  };
  accessKeys: string[]; // References to secure key storage for API access etc.
}

/**
 * Represents a token account in the simulated token rail.
 * Essential for tracking balances and enabling transactions.
 */
export interface TokenAccount {
  id: AccountIdentifier;
  ownerId: UserIdentifier | AgentIdentifier; // Can be owned by a user or an agent
  tokenType: TokenIdentifier; // e.g., 'USD_STABLE', 'CARBON_CREDIT'
  balance: number;
  createdAt: Timestamp;
  lastModified: Timestamp;
  status: 'active' | 'suspended';
  metadata: { [key: string]: any }; // e.g., 'bank_account_ref', 'wallet_address'
}

/**
 * Represents a transaction on the simulated token rail.
 * Includes cryptographic signature for integrity and non-repudiation.
 */
export interface TokenTransaction {
  id: TransactionIdentifier;
  senderAccountId: AccountIdentifier;
  receiverAccountId: AccountIdentifier;
  tokenType: TokenIdentifier;
  amount: number;
  timestamp: Timestamp;
  status: 'pending' | 'completed' | 'failed' | 'reverted';
  transactionHash: string; // Hash of transaction details
  signature: string; // Cryptographic signature by sender
  railId: string; // Which simulated rail was used (e.g., 'rail_fast', 'rail_batch')
  processingFee: number;
  metadata: { [key: string]: any }; // e.g., 'payment_purpose', 'reference_id'
  auditTrailId: string; // Link to audit log entry
}

/**
 * Configuration for a specific token rail in the simulator.
 */
export interface TokenRailConfig {
  id: string; // e.g., 'rail_fast', 'rail_batch'
  name: string;
  description: string;
  latencyMs: number; // Simulated latency
  costPerTransaction: number; // Simulated cost
  maxThroughputPerSecond: number;
  supportedTokenTypes: TokenIdentifier[];
  securityLevel: 'basic' | 'enhanced' | 'cryptographic';
  status: 'operational' | 'degraded' | 'offline';
  policyEngineRef: string; // Reference to the rule engine for this rail
}

/**
 * Represents a decision or recommendation made by an Agent.
 */
export interface AgentDecision {
  id: string;
  agentId: AgentIdentifier;
  timestamp: Timestamp;
  systemId: SystemIdentifier;
  decisionType: 'propose-leverage' | 'adjust-parameter' | 'initiate-simulation' | 'send-alert' | 'reconcile-transaction';
  details: { [key: string]: any }; // Contextual data for the decision
  confidenceScore: number; // Agent's confidence in the decision
  status: 'pending-approval' | 'approved' | 'rejected' | 'executed' | 'failed';
  approvedBy?: UserIdentifier;
  approvalTimestamp?: Timestamp;
  executionLogId?: string; // Link to audit log entry for execution
}

/**
 * Represents the overall application state managed by the context.
 */
export interface AppState {
  currentUser: UserProfile | null;
  currentSystemId: SystemIdentifier | null;
  systems: ChaoticSystemDefinition[];
  leveragePoints: LeveragePoint[];
  simulationRuns: SimulationRun[];
  scenarios: SimulationScenario[];
  alerts: SystemAlert[];
  auditLogs: AuditLogEntry[];
  agents: Agent[]; // New: list of AI agents
  tokenAccounts: TokenAccount[]; // New: list of token accounts
  tokenTransactions: TokenTransaction[]; // New: list of token transactions
  agentDecisions: AgentDecision[]; // New: list of agent decisions
  isLoading: boolean;
  error: string | null;
  // UI-specific state
  activeTab: 'overview' | 'definition' | 'simulate' | 'scenarios' | 'monitor' | 'settings' | 'audit' | 'help' | 'leverage' | 'agents' | 'tokens';
  showSystemDefinitionModal: boolean;
  showLeveragePointModal: boolean;
  showSimulationRunModal: boolean;
  showAgentModal: boolean; // New
  showTokenAccountModal: boolean; // New
  editingSystemId: SystemIdentifier | null;
  editingLeveragePointId: string | null;
  editingScenarioId: ScenarioIdentifier | null;
  editingAgentId: AgentIdentifier | null; // New
  editingTokenAccountId: AccountIdentifier | null; // New
}

/**
 * Defines the available actions for the AppReducer.
 */
export type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_USER'; payload: UserProfile | null }
  | { type: 'SET_CURRENT_SYSTEM'; payload: SystemIdentifier | null }
  | { type: 'ADD_SYSTEM'; payload: ChaoticSystemDefinition }
  | { type: 'UPDATE_SYSTEM'; payload: ChaoticSystemDefinition }
  | { type: 'DELETE_SYSTEM'; payload: SystemIdentifier }
  | { type: 'SET_SYSTEMS'; payload: ChaoticSystemDefinition[] }
  | { type: 'ADD_LEVERAGE_POINT'; payload: LeveragePoint }
  | { type: 'UPDATE_LEVERAGE_POINT'; payload: LeveragePoint }
  | { type: 'DELETE_LEVERAGE_POINT'; payload: string }
  | { type: 'SET_LEVERAGE_POINTS'; payload: LeveragePoint[] }
  | { type: 'ADD_SIMULATION_RUN'; payload: SimulationRun }
  | { type: 'UPDATE_SIMULATION_RUN'; payload: SimulationRun }
  | { type: 'DELETE_SIMULATION_RUN'; payload: SimulationRunIdentifier }
  | { type: 'SET_SIMULATION_RUNS'; payload: SimulationRun[] }
  | { type: 'ADD_SCENARIO'; payload: SimulationScenario }
  | { type: 'UPDATE_SCENARIO'; payload: SimulationScenario }
  | { type: 'DELETE_SCENARIO'; payload: ScenarioIdentifier }
  | { type: 'SET_SCENARIOS'; payload: SimulationScenario[] }
  | { type: 'ADD_ALERT'; payload: SystemAlert }
  | { type: 'MARK_ALERT_AS_READ'; payload: string }
  | { type: 'SET_ALERTS'; payload: SystemAlert[] }
  | { type: 'ADD_AUDIT_LOG_ENTRY'; payload: AuditLogEntry }
  | { type: 'SET_AUDIT_LOGS'; payload: AuditLogEntry[] }
  | { type: 'ADD_AGENT'; payload: Agent } // New
  | { type: 'UPDATE_AGENT'; payload: Agent } // New
  | { type: 'DELETE_AGENT'; payload: AgentIdentifier } // New
  | { type: 'SET_AGENTS'; payload: Agent[] } // New
  | { type: 'ADD_TOKEN_ACCOUNT'; payload: TokenAccount } // New
  | { type: 'UPDATE_TOKEN_ACCOUNT'; payload: TokenAccount } // New
  | { type: 'DELETE_TOKEN_ACCOUNT'; payload: AccountIdentifier } // New
  | { type: 'SET_TOKEN_ACCOUNTS'; payload: TokenAccount[] } // New
  | { type: 'ADD_TOKEN_TRANSACTION'; payload: TokenTransaction } // New
  | { type: 'SET_TOKEN_TRANSACTIONS'; payload: TokenTransaction[] } // New
  | { type: 'ADD_AGENT_DECISION'; payload: AgentDecision } // New
  | { type: 'UPDATE_AGENT_DECISION'; payload: AgentDecision } // New
  | { type: 'SET_AGENT_DECISIONS'; payload: AgentDecision[] } // New
  | { type: 'SET_ACTIVE_TAB'; payload: AppState['activeTab'] }
  | { type: 'SHOW_SYSTEM_DEFINITION_MODAL'; payload: boolean }
  | { type: 'SET_EDITING_SYSTEM_ID'; payload: SystemIdentifier | null }
  | { type: 'SHOW_LEVERAGE_POINT_MODAL'; payload: boolean }
  | { type: 'SET_EDITING_LEVERAGE_POINT_ID'; payload: string | null }
  | { type: 'SHOW_SIMULATION_RUN_MODAL'; payload: boolean }
  | { type: 'SET_EDITING_SCENARIO_ID'; payload: ScenarioIdentifier | null }
  | { type: 'SHOW_AGENT_MODAL'; payload: boolean } // New
  | { type: 'SET_EDITING_AGENT_ID'; payload: AgentIdentifier | null } // New
  | { type: 'SHOW_TOKEN_ACCOUNT_MODAL'; payload: boolean } // New
  | { type: 'SET_EDITING_TOKEN_ACCOUNT_ID'; payload: AccountIdentifier | null }; // New

// --- Global Type Definitions and Interfaces (END) ---

// --- Constants and Enums (START) ---

/**
 * Defines the roles a user can have within the application, extending for agent management.
 */
export enum UserRole {
  Admin = 'admin',
  Analyst = 'analyst',
  Viewer = 'viewer',
  AgentManager = 'agent-manager', // Role for managing AI agents
}

/**
 * Defines common alert severity levels.
 */
export enum AlertSeverity {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Critical = 'critical',
}

/**
 * Defines common notification types.
 */
export enum NotificationType {
  Email = 'email',
  InApp = 'inApp',
  SMS = 'sms',
}

/**
 * Defines the various data types for system parameters.
 */
export enum ParameterDataType {
  Number = 'number',
  Boolean = 'boolean',
  String = 'string',
  Enum = 'enum',
}

/**
 * Defines common token types for the simulated token rail.
 */
export enum TokenType {
  USD_STABLE = 'USD_STABLE',
  EUR_STABLE = 'EUR_STABLE',
  CARBON_CREDIT = 'CARBON_CREDIT',
  INTERNAL_POINTS = 'INTERNAL_POINTS',
}

/**
 * Default values and configurations.
 */
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'dark',
  notificationSettings: {
    email: true,
    inApp: true,
    sms: false,
    alertOnCritical: true,
    alertOnWarning: true,
  },
  defaultSystemView: 'dashboard',
  timezone: 'UTC',
  dateFormat: 'YYYY-MM-DD HH:mm:ss',
  measurementUnits: {
    temperature: 'celsius',
    rainfall: 'mm',
    cost: 'USD',
  },
  preferredCharts: [],
};

export const MOCK_ADMIN_USER: UserProfile = {
  id: 'user-001-admin',
  username: 'admin_user',
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User',
  organization: 'Chaos Corp',
  roles: [UserRole.Admin, UserRole.Analyst, UserRole.AgentManager],
  lastLogin: new Date().toISOString(),
  preferences: DEFAULT_USER_PREFERENCES,
  publicKey: 'MOCK_USER_ADMIN_PUBLIC_KEY', // Simulate a public key
};

export const MOCK_ANALYST_USER: UserProfile = {
  id: 'user-002-analyst',
  username: 'analyst_user',
  email: 'analyst@example.com',
  firstName: 'Analyst',
  lastName: 'User',
  organization: 'Chaos Corp',
  roles: [UserRole.Analyst],
  lastLogin: new Date().toISOString(),
  preferences: DEFAULT_USER_PREFERENCES,
  publicKey: 'MOCK_USER_ANALYST_PUBLIC_KEY',
};

export const INITIAL_APP_STATE: AppState = {
  currentUser: MOCK_ADMIN_USER, // Start with a logged-in mock user
  currentSystemId: null,
  systems: [],
  leveragePoints: [],
  simulationRuns: [],
  scenarios: [],
  alerts: [],
  auditLogs: [],
  agents: [],
  tokenAccounts: [],
  tokenTransactions: [],
  agentDecisions: [],
  isLoading: false,
  error: null,
  activeTab: 'overview',
  showSystemDefinitionModal: false,
  showLeveragePointModal: false,
  showSimulationRunModal: false,
  showAgentModal: false,
  showTokenAccountModal: false,
  editingSystemId: null,
  editingLeveragePointId: null,
  editingScenarioId: null,
  editingAgentId: null,
  editingTokenAccountId: null,
};

// --- Constants and Enums (END) ---

// --- Utility Functions (START) ---

/**
 * Generates a unique ID (UUID-like string).
 * @returns {string} A unique identifier.
 */
export const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Generates a cryptographic hash of a string using a simple non-secure method for simulation purposes.
 * For production, this should be replaced with a secure cryptographic hashing algorithm (e.g., SHA-256).
 * @param {string} input - The string to hash.
 * @returns {string} A simple hash string.
 */
export const generateHash = (input: string): string => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
};

/**
 * Simulates cryptographic signing of data. In a real system, this would involve
 * a private key and a robust signing algorithm (e.g., ECDSA).
 * @param {string} data - The data to sign.
 * @param {string} privateKeyPlaceholder - Placeholder for a private key.
 * @returns {string} A simulated signature.
 */
export const simulateSign = (data: string, privateKeyPlaceholder: string): string => {
  // In a real system, use crypto.subtle.sign or a similar library/module.
  // For simulation, we'll just hash the data with a key prefix.
  return generateHash(`${privateKeyPlaceholder}-${data}-${Date.now()}`);
};

/**
 * Simulates cryptographic verification of a signature.
 * @param {string} data - The original data.
 * @param {string} signature - The signature to verify.
 * @param {string} publicKeyPlaceholder - Placeholder for a public key.
 * @returns {boolean} True if the signature is "valid" (for simulation).
 */
export const simulateVerify = (data: string, signature: string, publicKeyPlaceholder: string): boolean => {
  // In a real system, this would involve comparing a re-computed hash or
  // using a crypto verification function. For simulation, just check for existence.
  return typeof signature === 'string' && signature.length > 10; // Very basic check
};

/**
 * Formats a timestamp string into a more readable format.
 * @param {Timestamp} timestamp - The ISO 8601 timestamp string.
 * @param {string} format - Optional format string (e.g., "YYYY-MM-DD HH:mm").
 * @returns {string} The formatted date string.
 */
export const formatTimestamp = (timestamp: Timestamp, format: string = 'YYYY-MM-DD HH:mm'): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  let formatted = format
    .replace(/YYYY/g, String(year))
    .replace(/MM/g, month)
    .replace(/DD/g, day)
    .replace(/HH/g, hours)
    .replace(/mm/g, minutes)
    .replace(/ss/g, seconds);

  return formatted;
};

/**
 * Calculates the difference between two timestamps in a human-readable format.
 * @param {Timestamp} start - Start timestamp.
 * @param {Timestamp} end - End timestamp.
 * @returns {string} Human-readable duration (e.g., "2 hours 15 minutes").
 */
export const getDuration = (start: Timestamp, end: Timestamp): string => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate.getTime() - startDate.getTime();

  if (diffMs < 0) return 'Invalid duration';

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
  if (hours % 24 > 0) parts.push(`${hours % 24} hour${hours % 24 > 1 ? 's' : ''}`);
  if (minutes % 60 > 0) parts.push(`${minutes % 60} minute${minutes % 60 > 1 ? 's' : ''}`);
  if (seconds % 60 > 0 && parts.length === 0) parts.push(`${seconds % 60} second${seconds % 60 > 1 ? 's' : ''}`); // Only show seconds if no larger unit

  return parts.length > 0 ? parts.join(' ') : 'Less than a second';
};

/**
 * Deep clones an object to prevent mutation issues.
 * @param {T} obj - The object to clone.
 * @returns {T} A deep copy of the object.
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as T;
  }
  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
};

/**
 * Validates a SystemParameter object.
 * @param {SystemParameter} param - The parameter to validate.
 * @returns {string[]} An array of error messages, or empty if valid.
 */
export const validateSystemParameter = (param: SystemParameter): string[] => {
  const errors: string[] = [];
  if (!param.name || param.name.trim() === '') errors.push('Parameter name cannot be empty.');
  if (typeof param.currentValue === 'number' && (param.currentValue < param.minValue || param.currentValue > param.maxValue)) errors.push('Current value must be within min/max range.');
  if (typeof param.currentValue === 'number' && param.minValue >= param.maxValue) errors.push('Min value must be less than max value.');
  if (typeof param.currentValue === 'number' && param.step <= 0) errors.push('Step value must be positive.');
  if (!param.unit || param.unit.trim() === '') errors.push('Parameter unit cannot be empty.');
  if (!Object.values(ParameterDataType).includes(param.dataType)) errors.push('Invalid parameter data type.');
  if (param.dataType === ParameterDataType.Enum && (!param.enumValues || param.enumValues.length === 0)) errors.push('Enum parameters must have enum values.');
  return errors;
};

/**
 * Validates a LeveragePoint object for completeness.
 * @param {LeveragePoint} lp - The leverage point to validate.
 * @returns {string[]} An array of error messages, or empty if valid.
 */
export const validateLeveragePoint = (lp: LeveragePoint): string[] => {
  const errors: string[] = [];
  if (!lp.action || lp.action.trim() === '') errors.push('Action description cannot be empty.');
  if (lp.outcomeProbability < 0 || lp.outcomeProbability > 1) errors.push('Outcome probability must be between 0 and 1.');
  if (lp.predictionConfidence < 0 || lp.predictionConfidence > 1) errors.push('Prediction confidence must be between 0 and 1.');
  if (!lp.cost || lp.cost.trim() === '') errors.push('Cost cannot be empty.');
  if (!lp.timeToImpact || lp.timeToImpact.trim() === '') errors.push('Time to impact cannot be empty.');
  if (!lp.description || lp.description.trim() === '') errors.push('Detailed description cannot be empty.');
  if (!['Low', 'Medium', 'High', 'Very High'].includes(lp.implementationEffort)) errors.push('Invalid implementation effort.');
  if (!['High', 'Medium', 'Low', 'Irreversible'].includes(lp.reversibility)) errors.push('Invalid reversibility.');
  if (lp.risks.some(r => !['Low', 'Medium', 'High'].includes(r.severity))) errors.push('Invalid risk severity.');
  return errors;
};

/**
 * Helper function to generate mock historical data for metrics.
 * @param {number} numPoints - Number of data points to generate.
 * @param {number} startValue - Initial value for the metric.
 * @param {number} maxDelta - Maximum change per step.
 * @param {string} unit - Unit of the metric.
 * @returns {{ timestamp: Timestamp; value: number }[]} An array of historical data.
 */
export const generateMockHistoricalData = (
  numPoints: number,
  startValue: number,
  maxDelta: number,
  timeStepMs: number = 3600000 // 1 hour
): { timestamp: Timestamp; value: number }[] => {
  const data: { timestamp: Timestamp; value: number }[] = [];
  let currentValue = startValue;
  let currentTimestamp = Date.now() - numPoints * timeStepMs;

  for (let i = 0; i < numPoints; i++) {
    currentValue += (Math.random() - 0.5) * 2 * maxDelta;
    currentValue = Math.max(0, currentValue); // Ensure non-negative
    data.push({
      timestamp: new Date(currentTimestamp).toISOString(),
      value: parseFloat(currentValue.toFixed(2)),
    });
    currentTimestamp += timeStepMs;
  }
  return data;
};

/**
 * Converts an object to a query string.
 * @param {Record<string, any>} params - The object containing query parameters.
 * @returns {string} The formatted query string.
 */
export const objectToQueryString = (params: Record<string, any>): string => {
  return Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
};

/**
 * Simulates a delay for async operations.
 * @param {number} ms - The delay in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the delay.
 */
export const sleep = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms));

/**
 * Helper to safely parse JSON, returning null on error.
 * @param {string} jsonString - The string to parse.
 * @returns {any | null} The parsed object or null.
 */
export const safeJsonParse = <T>(jsonString: string): T | null => {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
};

/**
 * Utility for basic input validation regex.
 */
export const validationRegex = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/, // Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special
  systemName: /^[a-zA-Z0-9\s_-]{3,50}$/,
  identifier: /^[a-z0-9_-]+$/, // For IDs, no spaces
};

/**
 * Formats a number to a currency string.
 * @param {number} amount - The numeric amount.
 * @param {string} currencyCode - The ISO 4217 currency code (e.g., 'USD').
 * @param {string} locale - The BCP 47 language tag (e.g., 'en-US').
 * @returns {string} Formatted currency string.
 */
export const formatCurrency = (amount: number, currencyCode: string = 'USD', locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode }).format(amount);
};

/**
 * Calculates the Euclidean distance between two points in N-dimensional space.
 * Useful for comparing parameter sets or simulation states.
 * @param {number[]} p1 - First point coordinates.
 * @param {number[]} p2 - Second point coordinates.
 * @returns {number} The Euclidean distance.
 */
export const euclideanDistance = (p1: number[], p2: number[]): number => {
  if (p1.length !== p2.length) {
    throw new Error('Points must have the same number of dimensions.');
  }
  let sumOfSquares = 0;
  for (let i = 0; i < p1.length; i++) {
    sumOfSquares += Math.pow(p1[i] - p2[i], 2);
  }
  return Math.sqrt(sumOfSquares);
};

/**
 * Calculates the average of an array of numbers.
 * @param {number[]} arr - The array of numbers.
 * @returns {number} The average.
 */
export const calculateAverage = (arr: number[]): number => {
  if (arr.length === 0) return 0;
  return arr.reduce((sum, current) => sum + current, 0) / arr.length;
};

/**
 * Calculates the standard deviation of an array of numbers.
 * @param {number[]} arr - The array of numbers.
 * @returns {number} The standard deviation.
 */
export const calculateStandardDeviation = (arr: number[]): number => {
  if (arr.length < 2) return 0;
  const mean = calculateAverage(arr);
  const variance = arr.reduce((sum, current) => sum + Math.pow(current - mean, 2), 0) / (arr.length - 1);
  return Math.sqrt(variance);
};

/**
 * Validates a UUID v4 string.
 * @param {string} uuid - The string to validate.
 * @returns {boolean} True if valid UUID v4, false otherwise.
 */
export const isValidUuidV4 = (uuid: string): boolean => {
  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidV4Regex.test(uuid);
};

// --- Utility Functions (END) ---

// --- Mock API Services (START) ---
// These functions simulate API calls to a backend, including delays and error handling.

export const MOCK_SYSTEM_DEFINITIONS: ChaoticSystemDefinition[] = [
  {
    id: 'system-rain-cv',
    name: 'Central Valley Rainfall System',
    description: 'Models rainfall patterns and water availability in California\'s Central Valley, influenced by Sierra Nevada weather systems.',
    createdAt: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
    lastModified: new Date(Date.now() - 3600000 * 3).toISOString(),
    ownerId: MOCK_ADMIN_USER.id,
    parameters: [
      { id: 'param-temp-ocean', name: 'Ocean Surface Temp (Pacific)', description: 'Average surface temperature of the Eastern Pacific, affecting atmospheric moisture.', currentValue: 18.5, unit: '°C', minValue: 10, maxValue: 25, step: 0.1, isLeverageCandidate: true, dataType: ParameterDataType.Number, securityLevel: 'medium' },
      { id: 'param-wind-speed', name: 'Prevailing Wind Speed', description: 'Average wind speed over the Pacific, influencing cloud movement.', currentValue: 12.0, unit: 'm/s', minValue: 5, maxValue: 30, step: 0.5, isLeverageCandidate: true, dataType: ParameterDataType.Number, securityLevel: 'low' },
      { id: 'param-aerosol-conc', name: 'Atmospheric Aerosol Conc.', description: 'Concentration of aerosols, affecting cloud nucleation.', currentValue: 150, unit: 'µg/m³', minValue: 50, maxValue: 500, step: 5, isLeverageCandidate: true, dataType: ParameterDataType.Number, securityLevel: 'high' },
      { id: 'param-cloud-seeding-budget', name: 'Cloud Seeding Budget', description: 'Annual budget allocated for cloud seeding operations.', currentValue: 100000, unit: 'USD', minValue: 0, maxValue: 1000000, step: 10000, isLeverageCandidate: true, dataType: ParameterDataType.Number, securityLevel: 'high' },
      { id: 'param-crop-demand', name: 'Agricultural Water Demand', description: 'Overall water demand from agriculture in the Central Valley.', currentValue: 0.7, unit: 'ratio', minValue: 0.1, maxValue: 1.0, step: 0.05, isLeverageCandidate: false, dataType: ParameterDataType.Number, securityLevel: 'low' },
    ],
    metrics: [
      { id: 'metric-rainfall', name: 'Monthly Rainfall (CV)', description: 'Average monthly rainfall in the Central Valley.', currentValue: 50, unit: 'mm', target: { min: 60, max: 80, unit: 'mm' }, history: generateMockHistoricalData(12, 45, 10, 3600000 * 24 * 30), alertThresholds: { warning: { operator: '<', value: 40 }, critical: { operator: '<', value: 20 } }, isDerived: false, dataQualityScore: 0.95 },
      { id: 'metric-snowpack', name: 'Sierra Nevada Snowpack', description: 'Water equivalent of snowpack in the Sierra Nevada.', currentValue: 120, unit: 'cm', target: { min: 150, unit: 'cm' }, history: generateMockHistoricalData(12, 100, 20, 3600000 * 24 * 30), isDerived: false, dataQualityScore: 0.92 },
      { id: 'metric-reservoir-level', name: 'Major Reservoir Levels', description: 'Combined storage capacity percentage of key reservoirs.', currentValue: 0.65, unit: '%', target: { min: 0.7, unit: '%' }, history: generateMockHistoricalData(12, 0.6, 0.05, 3600000 * 24 * 30), alertThresholds: { warning: { operator: '<', value: 0.55 }, critical: { operator: '<', value: 0.4 } }, isDerived: false, dataQualityScore: 0.98 },
      { id: 'metric-avg-temp', name: 'Average Air Temperature', description: 'Mean daily air temperature in the Central Valley.', currentValue: 22.5, unit: '°C', history: generateMockHistoricalData(12, 20, 5, 3600000 * 24 * 30), isDerived: false, dataQualityScore: 0.96 },
    ],
    feedbackLoops: [
      { id: 'loop-albedo-temp', name: 'Albedo-Temperature Feedback', description: 'Reduced snowpack leads to lower albedo, increasing ground absorption and temperature, further reducing snowpack.', type: 'positive', sourceId: 'metric-snowpack', targetId: 'metric-avg-temp', strength: 0.7, delay: '30 days', confidence: 0.85, isDynamic: false },
      { id: 'loop-irrigation-precip', name: 'Irrigation-Precipitation Feedback', description: 'Increased irrigation leads to higher local humidity, potentially increasing localized precipitation.', type: 'positive', sourceId: 'param-crop-demand', targetId: 'metric-rainfall', strength: 0.3, delay: '7 days', confidence: 0.6, isDynamic: true },
    ],
    status: 'Active',
    schemaVersion: '1.0.0',
    tags: ['water', 'agriculture', 'climate', 'california'],
    scope: 'California Central Valley & Sierra Nevada',
    externalDataSources: [
      { name: 'NOAA Weather API', url: 'https://api.noaa.gov/weather', lastSync: new Date().toISOString(), status: 'active' },
      { name: 'California DWR', url: 'https://water.ca.gov', lastSync: new Date().toISOString(), status: 'active' },
    ],
    accessControl: { public: false, sharedWithUsers: [], sharedWithGroups: ['analysts-group'], rbacPolicyId: 'policy-system-rain' },
    simulationModelRef: 'chaotic-rainfall-model-v2.1',
    modelVersion: '2.1.0',
    monitoringAgents: ['agent-weather-monitor'],
    monitoringConfig: {
      intervalSeconds: 3600,
      alertOnAnomaly: true,
      anomalyDetectionModel: 'z-score-threshold',
    },
    securityClassification: 'confidential',
    complianceStandards: ['CCPA'],
  },
  {
    id: 'system-market-volatility',
    name: 'Global Market Volatility Indicator',
    description: 'A simplified model for global market volatility influenced by various economic and geopolitical factors.',
    createdAt: new Date(Date.now() - 3600000 * 24 * 60).toISOString(),
    lastModified: new Date(Date.now() - 3600000 * 2).toISOString(),
    ownerId: MOCK_ADMIN_USER.id,
    parameters: [
      { id: 'param-interest-rate', name: 'Global Interest Rate', description: 'Average global interest rate, impacts investment.', currentValue: 0.03, unit: '%', minValue: 0.005, maxValue: 0.1, step: 0.001, isLeverageCandidate: true, dataType: ParameterDataType.Number, securityLevel: 'high' },
      { id: 'param-geopolitical-tension', name: 'Geopolitical Tension Index', description: 'An index reflecting global geopolitical stability.', currentValue: 0.6, unit: 'index', minValue: 0, maxValue: 1, step: 0.05, isLeverageCandidate: true, dataType: ParameterDataType.Number, securityLevel: 'medium' },
      { id: 'param-tech-innovation', name: 'Tech Innovation Pace', description: 'Rate of disruptive technological advancements.', currentValue: 0.8, unit: 'index', minValue: 0, maxValue: 1, step: 0.05, isLeverageCandidate: false, dataType: ParameterDataType.Number, securityLevel: 'low' },
    ],
    metrics: [
      { id: 'metric-vix', name: 'VIX Index (Volatility)', description: 'The CBOE Volatility Index, a measure of market expectation of near-term volatility.', currentValue: 20, unit: 'points', target: { max: 15, unit: 'points' }, history: generateMockHistoricalData(24, 25, 5, 3600000 * 24 * 15), alertThresholds: { warning: { operator: '>', value: 25 }, critical: { operator: '>', value: 40 } }, isDerived: false, dataQualityScore: 0.99 },
      { id: 'metric-gdp-growth', name: 'Global GDP Growth Rate', description: 'Annualized global GDP growth rate.', currentValue: 0.025, unit: '%', target: { min: 0.03, unit: '%' }, history: generateMockHistoricalData(24, 0.02, 0.005, 3600000 * 24 * 15), isDerived: true, derivationMethod: 'Average of national GDPs', dataQualityScore: 0.88 },
    ],
    feedbackLoops: [
      { id: 'loop-confidence-investment', name: 'Confidence-Investment Feedback', description: 'High market volatility reduces investor confidence, leading to less investment, further increasing volatility.', type: 'positive', sourceId: 'metric-vix', targetId: 'param-interest-rate', strength: 0.6, delay: '90 days', confidence: 0.7, isDynamic: false },
    ],
    status: 'Draft',
    schemaVersion: '1.0.0',
    tags: ['finance', 'economy', 'global'],
    scope: 'Global Financial Markets',
    externalDataSources: [
      { name: 'Bloomberg API', url: 'https://api.bloomberg.com', lastSync: new Date().toISOString(), status: 'active' },
    ],
    accessControl: { public: false, sharedWithUsers: [], sharedWithGroups: [], rbacPolicyId: 'policy-market-volatility' },
    simulationModelRef: 'financial-chaos-model-v1.0',
    modelVersion: '1.0.0',
    monitoringAgents: ['agent-market-analyst'],
    monitoringConfig: {
      intervalSeconds: 600,
      alertOnAnomaly: true,
      anomalyDetectionModel: 'bollinger-bands',
    },
    securityClassification: 'restricted',
    complianceStandards: ['PCI-DSS'],
  },
];

export const MOCK_LEVERAGE_POINTS: LeveragePoint[] = [
  {
    id: 'lp-cloud-seed',
    action: "Seed clouds with silver iodide via 3 drone flights over the Sierra Nevada mountain range on Tuesday.",
    cost: "~$25,000 USD",
    outcomeProbability: 0.62,
    timeToImpact: "90-120 days",
    description: "Deployment of specialized drones to release silver iodide particles into suitable cloud formations, aiming to enhance ice crystal formation and precipitation efficiency.",
    positiveSideEffects: ["Increased natural water supply", "Reduced drought severity", "Hydroelectric power generation increase"],
    negativeSideEffects: ["Potential ecological impact of silver iodide (minimal at current concentrations)", "Public perception concerns", "Risk of unwanted precipitation in other areas"],
    impactMagnitude: "5-10% increase in Q4 rainfall",
    predictionConfidence: 0.75,
    implementationEffort: 'Medium',
    reversibility: 'High',
    risks: [{ category: 'Ecological', severity: 'Low', description: 'Trace amounts of silver iodide in water systems.' }],
    requiredResources: ["3x specialized drones", "Silver iodide cartridges", "Pilots & ground crew", "Meteorological support"],
    stakeholders: [{ name: 'CA DWR', role: 'Regulatory Body', influence: 'High' }, { name: 'Farmers', role: 'Beneficiary', influence: 'Medium' }],
    historicalSuccessRate: 0.68,
    lastUpdated: new Date().toISOString(),
    proposedByAgentId: 'agent-weather-monitor',
    requiredSkill: 'execute-cloud-seeding',
    estimatedKpiImpact: ['Water Availability: +8%', 'Agricultural Output: +3%'],
  },
  {
    id: 'lp-desert-solar-farms',
    action: "Deploy large-scale solar farms in desert regions to influence local atmospheric convection.",
    cost: "~$500,000,000 USD",
    outcomeProbability: 0.05,
    timeToImpact: "5-10 years",
    description: "Installation of vast solar panel arrays to significantly alter surface albedo and heat absorption, aiming to create local thermal updrafts that could influence regional air currents and moisture transport.",
    positiveSideEffects: ["Renewable energy generation", "Reduced carbon emissions", "Potential localized microclimate changes beneficial for some areas"],
    negativeSideEffects: ["Massive land use", "Habitat destruction in desert ecosystems", "High upfront capital cost", "Unpredictable atmospheric effects"],
    impactMagnitude: "Highly uncertain, potentially 0-2% change in regional rainfall",
    predictionConfidence: 0.1,
    implementationEffort: 'Very High',
    reversibility: 'Low',
    risks: [
      { category: 'Financial', severity: 'High', description: 'Extremely high investment with low probability of desired outcome.' },
      { category: 'Ecological', severity: 'High', description: 'Irreversible habitat loss and unknown ecosystem impacts.' },
      { category: 'Social', severity: 'Medium', description: 'Land acquisition conflicts and visual pollution.' },
    ],
    requiredResources: ["Thousands of acres of land", "Solar panel manufacturing & installation infrastructure", "Billions in funding", "Environmental impact assessments"],
    stakeholders: [{ name: 'Energy Companies', role: 'Investor/Operator', influence: 'High' }, { name: 'Environmental Groups', role: 'Opposition', influence: 'High' }],
    historicalSuccessRate: 0.01,
    lastUpdated: new Date().toISOString(),
    proposedByAgentId: 'agent-weather-monitor', // Even agents can propose long-shot ideas
    requiredSkill: 'geoengineering-project-management',
    estimatedKpiImpact: ['Energy Independence: +5%', 'Local Temperature: -0.5°C'],
  },
];

export const MOCK_SIMULATION_RUNS: SimulationRun[] = [
  {
    id: 'sim-001',
    systemId: 'system-rain-cv',
    initiatedBy: MOCK_ADMIN_USER.id,
    startTime: new Date(Date.now() - 3600000 * 5).toISOString(),
    endTime: new Date(Date.now() - 3600000 * 3).toISOString(),
    status: 'Completed',
    initialConditions: [
      { parameterId: 'param-temp-ocean', value: 18.0 },
      { parameterId: 'param-wind-speed', value: 10.0 },
    ],
    appliedLeveragePoints: [
      { leveragePointId: 'lp-cloud-seed', timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), details: 'Initial cloud seeding effort.', appliedBy: MOCK_ADMIN_USER.id },
    ],
    simulatedDuration: '180 days',
    results: [
      { metricId: 'metric-rainfall', data: generateMockHistoricalData(180, 50, 5, 3600000 * 24) },
      { metricId: 'metric-snowpack', data: generateMockHistoricalData(180, 100, 10, 3600000 * 24) },
    ],
    logMessages: [{ timestamp: new Date(Date.now() - 3600000 * 4.5).toISOString(), level: 'info', message: 'Simulation initialized successfully.' }],
    configuration: {
      timeStepSize: '1 day',
      iterations: 180,
      stochasticityFactor: 0.1,
      seed: 12345,
      performanceMode: 'balanced',
    },
    engineVersion: '1.0.0',
    performanceMetrics: { cpuUsage: 75, memoryUsage: 1024, realTimeDurationMs: 7200000, costEstimateUSD: 15.75 },
    inputHash: generateHash(JSON.stringify({
      systemId: 'system-rain-cv',
      initialConditions: [{ parameterId: 'param-temp-ocean', value: 18.0 }, { parameterId: 'param-wind-speed', value: 10.0 }],
      appliedLeveragePoints: [{ leveragePointId: 'lp-cloud-seed', timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), details: 'Initial cloud seeding effort.', appliedBy: MOCK_ADMIN_USER.id }],
      configuration: {
        timeStepSize: '1 day',
        iterations: 180,
        stochasticityFactor: 0.1,
        seed: 12345,
        performanceMode: 'balanced',
      }
    })),
  },
];

export const MOCK_SCENARIOS: SimulationScenario[] = [
  {
    id: 'scenario-drought-mitigation',
    name: 'Drought Mitigation Strategy Q4',
    description: 'Compares different cloud seeding intensities and timings to mitigate predicted Q4 drought.',
    baseSystemId: 'system-rain-cv',
    createdBy: MOCK_ADMIN_USER.id,
    createdAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
    lastModified: new Date(Date.now() - 3600000 * 1).toISOString(),
    simulationRuns: ['sim-001'],
    proposedLeveragePoints: [
      { ...MOCK_LEVERAGE_POINTS[0], id: 'lp-cloud-seed-scenario-A', action: 'Increased cloud seeding intensity (x1.5 budget)' },
      { ...MOCK_LEVERAGE_POINTS[0], id: 'lp-cloud-seed-scenario-B', action: 'Cloud seeding + forest management (burns)' },
    ],
    comparisonMetrics: [
      { metricId: 'metric-rainfall', targetRange: [60, 80], priority: 'High' },
      { metricId: 'metric-reservoir-level', targetValue: 0.75, priority: 'High' },
    ],
    status: 'Active',
    notes: 'Initial findings suggest increased seeding shows promise, but cost-benefit needs further analysis.',
    attachments: [],
    securityClassification: 'confidential',
  },
];

export const MOCK_AGENTS: Agent[] = [
  {
    id: 'agent-weather-monitor',
    name: 'Weather Monitoring Agent',
    description: 'Monitors weather metrics for anomalies and proposes cloud seeding leverage points.',
    status: 'active',
    ownerUserId: MOCK_ADMIN_USER.id,
    createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    lastActive: new Date().toISOString(),
    skills: ['monitor-metrics', 'anomaly-detection', 'propose-leverage-points', 'initiate-simulation'],
    assignedSystems: ['system-rain-cv'],
    configuration: {
      autonomyLevel: 'semi-autonomous',
      decisionThreshold: 0.8,
      notificationPreferences: ['critical-alerts-only'],
    },
    performanceMetrics: {
      tasksCompleted: 150,
      errorsEncountered: 2,
      uptimeMinutes: 10080,
      costCumulativeUSD: 55.20,
    },
    accessKeys: ['aws-read-weather-api'],
  },
  {
    id: 'agent-market-analyst',
    name: 'Market Volatility Analyst',
    description: 'Analyzes global market data, predicts volatility, and suggests financial interventions.',
    status: 'active',
    ownerUserId: MOCK_ANALYST_USER.id,
    createdAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
    lastActive: new Date().toISOString(),
    skills: ['monitor-metrics', 'predict-volatility', 'simulate-system', 'propose-leverage-points'],
    assignedSystems: ['system-market-volatility'],
    configuration: {
      autonomyLevel: 'advisory',
      decisionThreshold: 0.9,
      notificationPreferences: ['all-alerts'],
    },
    performanceMetrics: {
      tasksCompleted: 80,
      errorsEncountered: 0,
      uptimeMinutes: 14400,
      costCumulativeUSD: 75.00,
    },
    accessKeys: ['bloomberg-read-api'],
  },
];

export const MOCK_TOKEN_ACCOUNTS: TokenAccount[] = [
  {
    id: 'acc-admin-usd',
    ownerId: MOCK_ADMIN_USER.id,
    tokenType: TokenType.USD_STABLE,
    balance: 1000000,
    createdAt: new Date(Date.now() - 3600000 * 24 * 365).toISOString(),
    lastModified: new Date().toISOString(),
    status: 'active',
    metadata: { 'bank_account_ref': '123456789', 'purpose': 'operational_funds' },
  },
  {
    id: 'acc-agent-weather-usd',
    ownerId: 'agent-weather-monitor',
    tokenType: TokenType.USD_STABLE,
    balance: 50000,
    createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    lastModified: new Date().toISOString(),
    status: 'active',
    metadata: { 'purpose': 'agent_operational_budget' },
  },
  {
    id: 'acc-analyst-eur',
    ownerId: MOCK_ANALYST_USER.id,
    tokenType: TokenType.EUR_STABLE,
    balance: 250000,
    createdAt: new Date(Date.now() - 3600000 * 24 * 180).toISOString(),
    lastModified: new Date().toISOString(),
    status: 'active',
    metadata: { 'bank_account_ref': '987654321', 'purpose': 'investment_funds' },
  },
];

export const MOCK_TOKEN_TRANSACTIONS: TokenTransaction[] = [
  {
    id: 'txn-001',
    senderAccountId: 'acc-admin-usd',
    receiverAccountId: 'acc-agent-weather-usd',
    tokenType: TokenType.USD_STABLE,
    amount: 10000,
    timestamp: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    status: 'completed',
    transactionHash: generateHash('acc-admin-usd-acc-agent-weather-usd-10000-USD_STABLE-2023-01-01'),
    signature: simulateSign('acc-admin-usd-acc-agent-weather-usd-10000-USD_STABLE-2023-01-01', 'MOCK_USER_ADMIN_PRIVATE_KEY'),
    railId: 'rail_fast',
    processingFee: 0.5,
    metadata: { 'purpose': 'initial_agent_funding' },
    auditTrailId: 'audit-txn-001',
  },
  {
    id: 'txn-002',
    senderAccountId: 'acc-agent-weather-usd',
    receiverAccountId: 'acc-admin-usd', // Simulate a refund or return
    tokenType: TokenType.USD_STABLE,
    amount: 2500,
    timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    status: 'completed',
    transactionHash: generateHash('acc-agent-weather-usd-acc-admin-usd-2500-USD_STABLE-2023-01-05'),
    signature: simulateSign('acc-agent-weather-usd-acc-admin-usd-2500-USD_STABLE-2023-01-05', 'MOCK_AGENT_WEATHER_PRIVATE_KEY'),
    railId: 'rail_fast',
    processingFee: 0.1,
    metadata: { 'purpose': 'unused_budget_return' },
    auditTrailId: 'audit-txn-002',
  },
];

export const MOCK_AGENT_DECISIONS: AgentDecision[] = [
  {
    id: 'decision-001',
    agentId: 'agent-weather-monitor',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    systemId: 'system-rain-cv',
    decisionType: 'propose-leverage',
    details: {
      leveragePointId: 'lp-cloud-seed',
      rationale: 'Projected Q4 rainfall below critical threshold based on current ocean temperatures and wind patterns. Cloud seeding offers highest probability of impact within acceptable cost.',
      expectedImpact: 'Increase rainfall by 7% in target regions.',
    },
    confidenceScore: 0.85,
    status: 'pending-approval',
  },
];


/**
 * Mock API for managing Chaotic System Definitions.
 */
export const SystemApiService = {
  async getSystems(): Promise<ChaoticSystemDefinition[]> {
    await sleep(800);
    return deepClone(MOCK_SYSTEM_DEFINITIONS);
  },

  async getSystemById(id: SystemIdentifier): Promise<ChaoticSystemDefinition | null> {
    await sleep(500);
    const system = MOCK_SYSTEM_DEFINITIONS.find(s => s.id === id);
    return system ? deepClone(system) : null;
  },

  async createSystem(system: ChaoticSystemDefinition): Promise<ChaoticSystemDefinition> {
    await sleep(1000);
    const newSystem = { ...system, id: generateId(), createdAt: new Date().toISOString(), lastModified: new Date().toISOString(), ownerId: system.ownerId || MOCK_ADMIN_USER.id };
    MOCK_SYSTEM_DEFINITIONS.push(newSystem);
    // Simulate audit log entry
    AuditLogService.createAuditLog({
      id: generateId(),
      timestamp: new Date().toISOString(),
      userId: newSystem.ownerId as UserIdentifier,
      action: 'CREATE_SYSTEM',
      entityType: 'SystemDefinition',
      entityId: newSystem.id,
      changes: [{ field: 'systemData', oldValue: {}, newValue: newSystem }],
      ipAddress: '127.0.0.1', // Mock IP
      userAgent: 'Mock Browser', // Mock UA
    });
    return deepClone(newSystem);
  },

  async updateSystem(system: ChaoticSystemDefinition): Promise<ChaoticSystemDefinition | null> {
    await sleep(1000);
    const index = MOCK_SYSTEM_DEFINITIONS.findIndex(s => s.id === system.id);
    if (index === -1) return null;

    const oldSystem = deepClone(MOCK_SYSTEM_DEFINITIONS[index]);
    const updatedSystem = { ...oldSystem, ...system, lastModified: new Date().toISOString() };
    MOCK_SYSTEM_DEFINITIONS[index] = updatedSystem;

    // Simulate audit log entry
    const changes = Object.keys(system).filter(key => (system as any)[key] !== (oldSystem as any)[key]).map(key => ({
      field: key,
      oldValue: (oldSystem as any)[key],
      newValue: (system as any)[key]
    }));
    if (changes.length > 0) {
      AuditLogService.createAuditLog({
        id: generateId(),
        timestamp: new Date().toISOString(),
        userId: MOCK_ADMIN_USER.id, // Assume admin for now
        action: 'UPDATE_SYSTEM',
        entityType: 'SystemDefinition',
        entityId: updatedSystem.id,
        changes: changes,
        ipAddress: '127.0.0.1',
        userAgent: 'Mock Browser',
      });
    }

    return deepClone(updatedSystem);
  },

  async deleteSystem(id: SystemIdentifier): Promise<boolean> {
    await sleep(500);
    const initialLength = MOCK_SYSTEM_DEFINITIONS.length;
    const systemToDelete = MOCK_SYSTEM_DEFINITIONS.find(s => s.id === id);
    if (!systemToDelete) return false;

    MOCK_SYSTEM_DEFINITIONS.splice(MOCK_SYSTEM_DEFINITIONS.findIndex(s => s.id === id), 1);

    // Simulate audit log entry
    AuditLogService.createAuditLog({
      id: generateId(),
      timestamp: new Date().toISOString(),
      userId: MOCK_ADMIN_USER.id,
      action: 'DELETE_SYSTEM',
      entityType: 'SystemDefinition',
      entityId: id,
      changes: [{ field: 'systemData', oldValue: systemToDelete, newValue: {} }],
      ipAddress: '127.0.0.1',
      userAgent: 'Mock Browser',
    });

    return MOCK_SYSTEM_DEFINITIONS.length < initialLength;
  },
};

/**
 * Mock API for managing Leverage Points.
 */
export const LeveragePointApiService = {
  async getLeveragePoints(systemId?: SystemIdentifier): Promise<LeveragePoint[]> {
    await sleep(600);
    let points = deepClone(MOCK_LEVERAGE_POINTS);
    // In a real system, leverage points might be associated directly with a system.
    // Here we're just returning all mock points for simplicity or filtering if a system context is given.
    if (systemId) {
      // For mock, we'll return points that *could* apply to the system.
      // A more robust mock would have LP-system mapping.
      points = points.filter(lp => lp.action.includes('cloud seeding') && systemId === 'system-rain-cv' || lp.action.includes('solar farms') && systemId === 'system-rain-cv');
    }
    return points;
  },

  async getLeveragePointById(id: string): Promise<LeveragePoint | null> {
    await sleep(300);
    const lp = MOCK_LEVERAGE_POINTS.find(l => l.id === id);
    return lp ? deepClone(lp) : null;
  },

  async createLeveragePoint(lp: LeveragePoint): Promise<LeveragePoint> {
    await sleep(700);
    const newLp = { ...lp, id: generateId(), lastUpdated: new Date().toISOString() };
    MOCK_LEVERAGE_POINTS.push(newLp);
    AuditLogService.createAuditLog({
      id: generateId(),
      timestamp: new Date().toISOString(),
      userId: MOCK_ADMIN_USER.id,
      action: 'CREATE_LEVERAGE_POINT',
      entityType: 'LeveragePoint',
      entityId: newLp.id,
      changes: [{ field: 'leveragePointData', oldValue: {}, newValue: newLp }],
      ipAddress: '127.0.0.1',
      userAgent: 'Mock Browser',
    });
    return deepClone(newLp);
  },

  async updateLeveragePoint(lp: LeveragePoint): Promise<LeveragePoint | null> {
    await sleep(700);
    const index = MOCK_LEVERAGE_POINTS.findIndex(l => l.id === lp.id);
    if (index === -1) return null;

    const oldLp = deepClone(MOCK_LEVERAGE_POINTS[index]);
    const updatedLp = { ...oldLp, ...lp, lastUpdated: new Date().toISOString() };
    MOCK_LEVERAGE_POINTS[index] = updatedLp;

    const changes = Object.keys(lp).filter(key => (lp as any)[key] !== (oldLp as any)[key]).map(key => ({
      field: key,
      oldValue: (oldLp as any)[key],
      newValue: (lp as any)[key]
    }));
    if (changes.length > 0) {
      AuditLogService.createAuditLog({
        id: generateId(),
        timestamp: new Date().toISOString(),
        userId: MOCK_ADMIN_USER.id,
        action: 'UPDATE_LEVERAGE_POINT',
        entityType: 'LeveragePoint',
        entityId: updatedLp.id,
        changes: changes,
        ipAddress: '127.0.0.1',
        userAgent: 'Mock Browser',
      });
    }
    return deepClone(updatedLp);
  },

  async deleteLeveragePoint(id: string): Promise<boolean> {
    await sleep(300);
    const initialLength = MOCK_LEVERAGE_POINTS.length;
    const lpToDelete = MOCK_LEVERAGE_POINTS.find(s => s.id === id);
    if (!lpToDelete) return false;

    MOCK_LEVERAGE_POINTS.splice(MOCK_LEVERAGE_POINTS.findIndex(l => l.id === id), 1);

    AuditLogService.createAuditLog({
      id: generateId(),
      timestamp: new Date().toISOString(),
      userId: MOCK_ADMIN_USER.id,
      action: 'DELETE_LEVERAGE_POINT',
      entityType: 'LeveragePoint',
      entityId: id,
      changes: [{ field: 'leveragePointData', oldValue: lpToDelete, newValue: {} }],
      ipAddress: '127.0.0.1',
      userAgent: 'Mock Browser',
    });

    return MOCK_LEVERAGE_POINTS.length < initialLength;
  },
};

/**
 * Mock API for managing Simulation Runs.
 */
export const SimulationRunApiService = {
  async getSimulationRuns(systemId?: SystemIdentifier): Promise<SimulationRun[]> {
    await sleep(900);
    let runs = deepClone(MOCK_SIMULATION_RUNS);
    if (systemId) {
      runs = runs.filter(r => r.systemId === systemId);
    }
    return runs;
  },

  async getSimulationRunById(id: SimulationRunIdentifier): Promise<SimulationRun | null> {
    await sleep(400);
    const run = MOCK_SIMULATION_RUNS.find(r => r.id === id);
    return run ? deepClone(run) : null;
  },

  async createSimulationRun(run: SimulationRun): Promise<SimulationRun> {
    await sleep(1500); // Simulate longer processing time for new simulation
    const newRun = { ...run, id: generateId(), startTime: new Date().toISOString(), status: 'Running' as const, logMessages: [{ timestamp: new Date().toISOString(), level: 'info', message: 'Simulation run created and started.' }] };
    MOCK_SIMULATION_RUNS.push(newRun);

    // Simulate completion
    setTimeout(() => {
      const index = MOCK_SIMULATION_RUNS.findIndex(r => r.id === newRun.id);
      if (index !== -1) {
        MOCK_SIMULATION_RUNS[index] = {
          ...MOCK_SIMULATION_RUNS[index],
          endTime: new Date().toISOString(),
          status: 'Completed',
          results: newRun.results.length > 0 ? newRun.results : MOCK_SYSTEM_DEFINITIONS.find(s => s.id === newRun.systemId)?.metrics.map(m => ({
            metricId: m.id,
            data: generateMockHistoricalData(newRun.configuration.iterations, parseFloat(String(m.currentValue || 0)), 5, 3600000 * 24 * (newRun.simulatedDuration.includes('day') ? 1 : 30)),
          })) || [],
          logMessages: [...MOCK_SIMULATION_RUNS[index].logMessages, { timestamp: new Date().toISOString(), level: 'info', message: 'Simulation completed successfully.' }],
        };
        AuditLogService.createAuditLog({
          id: generateId(),
          timestamp: new Date().toISOString(),
          userId: newRun.initiatedBy as UserIdentifier,
          action: 'COMPLETE_SIMULATION_RUN',
          entityType: 'SimulationRun',
          entityId: newRun.id,
          changes: [{ field: 'status', oldValue: 'Running', newValue: 'Completed' }],
          ipAddress: '127.0.0.1',
          userAgent: 'Mock Browser',
        });
      }
    }, 5000); // Simulate 5 seconds for simulation to run

    AuditLogService.createAuditLog({
      id: generateId(),
      timestamp: new Date().toISOString(),
      userId: newRun.initiatedBy as UserIdentifier,
      action: 'CREATE_SIMULATION_RUN',
      entityType: 'SimulationRun',
      entityId: newRun.id,
      changes: [{ field: 'simulationData', oldValue: {}, newValue: newRun }],
      ipAddress: '127.0.0.1',
      userAgent: 'Mock Browser',
    });
    return deepClone(newRun);
  },

  async updateSimulationRun(run: SimulationRun): Promise<SimulationRun | null> {
    await sleep(800);
    const index = MOCK_SIMULATION_RUNS.findIndex(r => r.id === run.id);
    if (index === -1) return null;

    const oldRun = deepClone(MOCK_SIMULATION_RUNS[index]);
    const updatedRun = { ...oldRun, ...run, lastModified: new Date().toISOString() };
    MOCK_SIMULATION_RUNS[index] = updatedRun;

    const changes = Object.keys(run).filter(key => (run as any)[key] !== (oldRun as any)[key]).map(key => ({
      field: key,
      oldValue: (oldRun as any)[key],
      newValue: (run as any)[key]
    }));
    if (changes.length > 0) {
      AuditLogService.createAuditLog({
        id: generateId(),
        timestamp: new Date().toISOString(),
        userId: MOCK_ADMIN_USER.id,
        action: 'UPDATE_SIMULATION_RUN',
        entityType: 'SimulationRun',
        entityId: updatedRun.id,
        changes: changes,
        ipAddress: '127.0.0.1',
        userAgent: 'Mock Browser',
      });
    }

    return deepClone(updatedRun);
  },

  async deleteSimulationRun(id: SimulationRunIdentifier): Promise<boolean> {
    await sleep(400);
    const initialLength = MOCK_SIMULATION_RUNS.length;
    const runToDelete = MOCK_SIMULATION_RUNS.find(s => s.id === id);
    if (!runToDelete) return false;

    MOCK_SIMULATION_RUNS.splice(MOCK_SIMULATION_RUNS.findIndex(r => r.id === id), 1);

    AuditLogService.createAuditLog({
      id: generateId(),
      timestamp: new Date().toISOString(),
      userId: MOCK_ADMIN_USER.id,
      action: 'DELETE_SIMULATION_RUN',
      entityType: 'SimulationRun',
      entityId: id,
      changes: [{ field: 'simulationData', oldValue: runToDelete, newValue: {} }],
      ipAddress: '127.0.0.1',
      userAgent: 'Mock Browser',
    });

    return MOCK_SIMULATION_RUNS.length < initialLength;
  },
};

/**
 * Mock API for managing Simulation Scenarios.
 */
export const SimulationScenarioApiService = {
  async getScenarios(systemId?: SystemIdentifier): Promise<SimulationScenario[]> {
    await sleep(700);
    let scenarios = deepClone(MOCK_SCENARIOS);
    if (systemId) {
      scenarios = scenarios.filter(s => s.baseSystemId === systemId);
    }
    return scenarios;
  },

  async getScenarioById(id: ScenarioIdentifier): Promise<SimulationScenario | null> {
    await sleep(350);
    const scenario = MOCK_SCENARIOS.find(s => s.id === id);
    return scenario ? deepClone(scenario) : null;
  },

  async createScenario(scenario: SimulationScenario): Promise<SimulationScenario> {
    await sleep(800);
    const newScenario = { ...scenario, id: generateId(), createdAt: new Date().toISOString(), lastModified: new Date().toISOString(), createdBy: scenario.createdBy || MOCK_ADMIN_USER.id };
    MOCK_SCENARIOS.push(newScenario);

    AuditLogService.createAuditLog({
      id: generateId(),
      timestamp: new Date().toISOString(),
      userId: newScenario.createdBy as UserIdentifier,
      action: 'CREATE_SCENARIO',
      entityType: 'Scenario',
      entityId: newScenario.id,
      changes: [{ field: 'scenarioData', oldValue: {}, newValue: newScenario }],
      ipAddress: '127.0.0.1',
      userAgent: 'Mock Browser',
    });
    return deepClone(newScenario);
  },

  async updateScenario(scenario: SimulationScenario): Promise<SimulationScenario | null> {
    await sleep(800);
    const index = MOCK_SCENARIOS.findIndex(s => s.id === scenario.id);
    if (index === -1) return null;

    const oldScenario = deepClone(MOCK_SCENARIOS[index]);
    const updatedScenario = { ...oldScenario, ...scenario, lastModified: new Date().toISOString() };
    MOCK_SCENARIOS[index] = updatedScenario;

    const changes = Object.keys(scenario).filter(key => (scenario as any)[key] !== (oldScenario as any)[key]).map(key => ({
      field: key,
      oldValue: (oldScenario as any)[key],
      newValue: (scenario as any)[key]
    }));
    if (changes.length > 0) {
      AuditLogService.createAuditLog({
        id: generateId(),
        timestamp: new Date().toISOString(),
        userId: MOCK_ADMIN_USER.id,
        action: 'UPDATE_SCENARIO',
        entityType: 'Scenario',
        entityId: updatedScenario.id,
        changes: changes,
        ipAddress: '127.0.0.1',
        userAgent: 'Mock Browser',
      });
    }
    return deepClone(updatedScenario);
  },

  async deleteScenario(id: ScenarioIdentifier): Promise<boolean> {
    await sleep(350);
    const initialLength = MOCK_SCENARIOS.length;
    const scenarioToDelete = MOCK_SCENARIOS.find(s => s.id === id);
    if (!scenarioToDelete) return false;

    MOCK_SCENARIOS.splice(MOCK_SCENARIOS.findIndex(s => s.id === id), 1);

    AuditLogService.createAuditLog({
      id: generateId(),
      timestamp: new Date().toISOString(),
      userId: MOCK_ADMIN_USER.id,
      action: 'DELETE_SCENARIO',
      entityType: 'Scenario',
      entityId: id,
      changes: [{ field: 'scenarioData', oldValue: scenarioToDelete, newValue: {} }],
      ipAddress: '127.0.0.1',
      userAgent: 'Mock Browser',
    });
    return MOCK_SCENARIOS.length < initialLength;
  },
};

/**
 * Mock API for managing User Profiles.
 */
export const UserProfileApiService = {
  async getUser(id: UserIdentifier): Promise<UserProfile | null> {
    await sleep(200);
    if (id === MOCK_ADMIN_USER.id) return deepClone(MOCK_ADMIN_USER);
    if (id === MOCK_ANALYST_USER.id) return deepClone(MOCK_ANALYST_USER);
    return null;
  },
  async getAllUsers(): Promise<UserProfile[]> {
    await sleep(300);
    return deepClone([MOCK_ADMIN_USER, MOCK_ANALYST_USER]);
  },
  async updateUserPreferences(userId: UserIdentifier, preferences: UserPreferences): Promise<UserProfile | null> {
    await sleep(500);
    let user = MOCK_ADMIN_USER; // Assume admin for now
    if (user.id === userId) {
      const oldPreferences = deepClone(user.preferences);
      user.preferences = { ...oldPreferences, ...preferences };
      AuditLogService.createAuditLog({
        id: generateId(),
        timestamp: new Date().toISOString(),
        userId: userId,
        action: 'UPDATE_USER_PREFERENCES',
        entityType: 'UserProfile',
        entityId: userId,
        changes: [{ field: 'preferences', oldValue: oldPreferences, newValue: preferences }],
        ipAddress: '127.0.0.1',
        userAgent: 'Mock Browser',
      });
      return deepClone(user);
    }
    return null;
  }
};

/**
 * Mock API for managing System Alerts.
 */
export const SystemAlertApiService = {
  async getAlerts(systemId?: SystemIdentifier, userId?: UserIdentifier): Promise<SystemAlert[]> {
    await sleep(300);
    const now = new Date();
    const mockAlerts: SystemAlert[] = [
      {
        id: 'alert-001', systemId: 'system-rain-cv', metricId: 'metric-rainfall', type: 'critical', message: 'Rainfall 20% below critical threshold for 3 days.',
        timestamp: new Date(now.getTime() - 3600000 * 24).toISOString(), isRead: false, actionRequired: true, severity: 'critical', source: 'monitoring',
        details: { currentValue: 25, threshold: 40, operator: '<' }
      },
      {
        id: 'alert-002', systemId: 'system-market-volatility', metricId: 'metric-vix', type: 'warning', message: 'VIX Index rising, potential for increased market volatility.',
        timestamp: new Date(now.getTime() - 3600000 * 12).toISOString(), isRead: true, actionRequired: false, severity: 'medium', source: 'monitoring',
        details: { currentValue: 30, threshold: 25, operator: '>' }
      },
      {
        id: 'alert-003', systemId: 'system-rain-cv', type: 'info', message: 'Cloud seeding operation successfully initiated.',
        timestamp: new Date(now.getTime() - 3600000 * 5).toISOString(), isRead: false, actionRequired: false, severity: 'low', source: 'user-activity',
        details: { leveragePointId: 'lp-cloud-seed' }
      },
      {
        id: 'alert-004', systemId: 'system-market-volatility', type: 'anomaly', message: 'Unusual trading volume detected in commodity futures.',
        timestamp: new Date(now.getTime() - 3600000 * 1).toISOString(), isRead: false, actionRequired: true, severity: 'high', source: 'agent-activity',
        details: { agentId: 'agent-market-analyst', anomalyScore: 0.92 }
      }
    ];

    let filteredAlerts = deepClone(mockAlerts);
    if (systemId) {
      filteredAlerts = filteredAlerts.filter(a => a.systemId === systemId);
    }
    // In a real system, alerts might be user-specific based on preferences or roles.
    // For this mock, we'll return all, assuming the UI handles user relevance.
    return filteredAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  async markAlertAsRead(alertId: string, userId: UserIdentifier): Promise<SystemAlert | null> {
    await sleep(200);
    const alerts = await SystemAlertApiService.getAlerts(); // Get all alerts to find it
    const index = alerts.findIndex(a => a.id === alertId);
    if (index === -1) return null;

    const updatedAlert = { ...alerts[index], isRead: true };
    // In a real scenario, this would update the persistent store.
    // For this mock, we'll just return the updated object without persisting to MOCK_ALERTS,
    // as MOCK_ALERTS is dynamically generated.
    AuditLogService.createAuditLog({
      id: generateId(),
      timestamp: new Date().toISOString(),
      userId: userId,
      action: 'MARK_ALERT_READ',
      entityType: 'SystemAlert',
      entityId: alertId,
      changes: [{ field: 'isRead', oldValue: false, newValue: true }],
      ipAddress: '127.0.0.1',
      userAgent: 'Mock Browser',
    });
    return updatedAlert;
  },

  async createAlert(alert: SystemAlert): Promise<SystemAlert> {
    await sleep(200);
    const newAlert = { ...alert, id: generateId(), timestamp: new Date().toISOString(), isRead: false, actionRequired: alert.actionRequired ?? true };
    // In a real system, this would add to a persistent alerts store.
    // For mock, we're just returning it.
    AuditLogService.createAuditLog({
      id: generateId(),
      timestamp: new Date().toISOString(),
      userId: alert.source === 'user-activity' ? MOCK_ADMIN_USER.id : undefined, // Example of setting userId for user-triggered
      agentId: alert.source === 'agent-activity' ? (alert.details?.agentId || 'unknown-agent') : undefined,
      action: 'CREATE_ALERT',
      entityType: 'SystemAlert',
      entityId: newAlert.id,
      changes: [{ field: 'alertData', oldValue: {}, newValue: newAlert }],
      ipAddress: '127.0.0.1',
      userAgent: 'Mock Backend Service',
    });
    return newAlert;
  }
};

/**
 * Mock API for managing Audit Logs.
 * Implements a simple chained hash for tamper evidence.
 */
export const AuditLogService = {
  // This array will hold the audit logs in memory for the session.
  privateAuditLogStorage: [] as AuditLogEntry[],

  async getAuditLogs(entityType?: AuditLogEntry['entityType'], entityId?: string): Promise<AuditLogEntry[]> {
    await sleep(400);
    let logs = deepClone(this.privateAuditLogStorage);
    if (entityType) {
      logs = logs.filter(log => log.entityType === entityType);
    }
    if (entityId) {
      logs = logs.filter(log => log.entityId === entityId);
    }
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  async createAuditLog(logEntry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'signature' | 'previousEntryHash'> & { timestamp?: Timestamp }): Promise<AuditLogEntry> {
    await sleep(100);
    const newId = generateId();
    const entryTimestamp = logEntry.timestamp || new Date().toISOString();

    let previousEntryHash: string | undefined;
    if (this.privateAuditLogStorage.length > 0) {
      const lastEntry = this.privateAuditLogStorage[this.privateAuditLogStorage.length - 1];
      previousEntryHash = lastEntry.signature; // Use the signature of the previous entry as its hash
    }

    const logDataToHash = JSON.stringify({ ...logEntry, id: newId, timestamp: entryTimestamp, previousEntryHash });
    const signature = simulateSign(logDataToHash, 'MOCK_AUDIT_SERVICE_PRIVATE_KEY'); // Simulate signing the entry

    const fullLogEntry: AuditLogEntry = {
      ...logEntry,
      id: newId,
      timestamp: entryTimestamp,
      previousEntryHash: previousEntryHash,
      signature: signature,
      userId: logEntry.userId ?? MOCK_ADMIN_USER.id, // Default to admin if no user/agent specified
      ipAddress: logEntry.ipAddress || '127.0.0.1',
      userAgent: logEntry.userAgent || 'Mock Audit Service',
    };
    this.privateAuditLogStorage.push(fullLogEntry);
    return deepClone(fullLogEntry);
  },

  // Method to verify the integrity of the audit log chain (simulation)
  async verifyAuditLogChain(): Promise<{ isValid: boolean; brokenAtIndex?: number }> {
    await sleep(500);
    for (let i = 1; i < this.privateAuditLogStorage.length; i++) {
      const currentEntry = this.privateAuditLogStorage[i];
      const previousEntry = this.privateAuditLogStorage[i - 1];

      // Reconstruct what the previous entry's data would have been to generate its hash/signature
      const previousLogDataToHash = JSON.stringify({
        id: previousEntry.id,
        timestamp: previousEntry.timestamp,
        userId: previousEntry.userId,
        agentId: previousEntry.agentId,
        action: previousEntry.action,
        entityType: previousEntry.entityType,
        entityId: previousEntry.entityId,
        changes: previousEntry.changes,
        ipAddress: previousEntry.ipAddress,
        userAgent: previousEntry.userAgent,
        previousEntryHash: previousEntry.previousEntryHash, // The previous entry's reference to *its* previous entry
      });
      const expectedPreviousSignature = simulateSign(previousLogDataToHash, 'MOCK_AUDIT_SERVICE_PRIVATE_KEY');

      if (previousEntry.signature !== expectedPreviousSignature) {
        console.error(`Tamper detected in audit log at index ${i - 1}: Previous entry signature mismatch.`);
        return { isValid: false, brokenAtIndex: i - 1 };
      }
      if (currentEntry.previousEntryHash !== previousEntry.signature) {
        console.error(`Tamper detected in audit log at index ${i}: Chained hash mismatch.`);
        return { isValid: false, brokenAtIndex: i };
      }
    }
    return { isValid: true };
  }
};

/**
 * Mock API for managing Agents.
 */
export const AgentApiService = {
  async getAgents(): Promise<Agent[]> {
    await sleep(500);
    return deepClone(MOCK_AGENTS);
  },

  async getAgentById(id: AgentIdentifier): Promise<Agent | null> {
    await sleep(250);
    const agent = MOCK_AGENTS.find(a => a.id === id);
    return agent ? deepClone(agent) : null;
  },

  async createAgent(agent: Agent): Promise<Agent> {
    await sleep(700);
    const newAgent = { ...agent, id: generateId(), createdAt: new Date().toISOString(), lastActive: new Date().toISOString() };
    MOCK_AGENTS.push(newAgent);
    AuditLogService.createAuditLog({
      id: generateId(),
      timestamp: new Date().toISOString(),
      userId: newAgent.ownerUserId,
      action: 'CREATE_AGENT',
      entityType: 'Agent',
      entityId: newAgent.id,
      changes: [{ field: 'agentData', oldValue: {}, newValue: newAgent }],
      ipAddress: '127.0.0.1',
      userAgent: 'Mock Browser',
    });
    return deepClone(newAgent);
  },

  async updateAgent(agent: Agent): Promise<Agent | null> {
    await sleep(700);
    const index = MOCK_AGENTS.findIndex(a => a.id === agent.id);
    if (index === -1) return null;

    const oldAgent = deepClone(MOCK_AGENTS[index]);
    const updatedAgent = { ...oldAgent, ...agent, lastActive: new Date().toISOString() };
    MOCK_AGENTS[index] = updatedAgent;

    const changes = Object.keys(agent).filter(key => (agent as any)[key] !== (oldAgent as any)[key]).map(key => ({
      field: key,
      oldValue: (oldAgent as any)[key],
      newValue: (agent as any)[key]
    }));
    if (changes.length > 0) {
      AuditLogService.createAuditLog({
        id: generateId(),
        timestamp: new Date().toISOString(),
        userId: updatedAgent.ownerUserId,
        action: 'UPDATE_AGENT',
        entityType: 'Agent',
        entityId: updatedAgent.id,
        changes: changes,
        ipAddress: '127.0.0.1',
        userAgent: 'Mock Browser',
      });
    }
    return deepClone(updatedAgent);
  },

  async deleteAgent(id: AgentIdentifier): Promise<boolean> {
    await sleep(250);
    const initialLength = MOCK_AGENTS.length;
    const agentToDelete = MOCK_AGENTS.find(s => s.id === id);
    if (!agentToDelete) return false;

    MOCK_AGENTS.splice(MOCK_AGENTS.findIndex(a => a.id === id), 1);
    AuditLogService.createAuditLog({
      id: generateId(),
      timestamp: new Date().toISOString(),
      userId: MOCK_ADMIN_USER.id, // Assume admin for agent deletion
      action: 'DELETE_AGENT',
      entityType: 'Agent',
      entityId: id,
      changes: [{ field: 'agentData', oldValue: agentToDelete, newValue: {} }],
      ipAddress: '127.0.0.1',
      userAgent: 'Mock Browser',
    });
    return MOCK_AGENTS.length < initialLength;
  },

  async performAgentAction(agentId: AgentIdentifier, actionType: AgentDecision['decisionType'], systemId: SystemIdentifier, details: any): Promise<AgentDecision> {
    await sleep(1000); // Simulate agent processing time
    const agent = MOCK_AGENTS.find(a => a.id === agentId);
    if (!agent) throw new Error('Agent not found.');

    const newDecision: AgentDecision = {
      id: generateId(),
      agentId: agentId,
      timestamp: new Date().toISOString(),
      systemId: systemId,
      decisionType: actionType,
      details: details,
      confidenceScore: Math.random(), // Simulate confidence
      status: agent.configuration.autonomyLevel === 'fully-autonomous' ? 'executed' : 'pending-approval',
    };
    MOCK_AGENT_DECISIONS.push(newDecision);

    AuditLogService.createAuditLog({
      id: generateId(),
      timestamp: new Date().toISOString(),
      agentId: agentId,
      action: `AGENT_DECISION_${actionType.toUpperCase().replace(/-/g, '_')}`,
      entityType: 'AgentDecision',
      entityId: newDecision.id,
      changes: [{ field: 'decisionData', oldValue: {}, newValue: newDecision }],
      ipAddress: 'N/A', // Agents don't have IP addresses in this context
      userAgent: 'Agent Service',
    });

    return deepClone(newDecision);
  }
};

/**
 * Mock API for managing Token Accounts.
 */
export const TokenAccountApiService = {
  async getTokenAccounts(ownerId?: UserIdentifier | AgentIdentifier): Promise<TokenAccount[]> {
    await sleep(300);
    let accounts = deepClone(MOCK_TOKEN_ACCOUNTS);
    if (ownerId) {
      accounts = accounts.filter(acc => acc.ownerId === ownerId);
    }
    return accounts;
  },

  async getTokenAccountById(id: AccountIdentifier): Promise<TokenAccount | null> {
    await sleep(200);
    const account = MOCK_TOKEN_ACCOUNTS.find(acc => acc.id === id);
    return account ? deepClone(account) : null;
  },

  async createTokenAccount(account: TokenAccount): Promise<TokenAccount> {
    await sleep(500);
    const newAccount = { ...account, id: generateId(), createdAt: new Date().toISOString(), lastModified: new Date().toISOString() };
    MOCK_TOKEN_ACCOUNTS.push(newAccount);
    AuditLogService.createAuditLog({
      id: generateId(),
      timestamp: new Date().toISOString(),
      userId: typeof newAccount.ownerId === 'string' && newAccount.ownerId.startsWith('user-') ? newAccount.ownerId as UserIdentifier : undefined,
      agentId: typeof newAccount.ownerId === 'string' && newAccount.ownerId.startsWith('agent-') ? newAccount.ownerId as AgentIdentifier : undefined,
      action: 'CREATE_TOKEN_ACCOUNT',
      entityType: 'TokenAccount',
      entityId: newAccount.id,
      changes: [{ field: 'accountData', oldValue: {}, newValue: newAccount }],
      ipAddress: '127.0.0.1',
      userAgent: 'Mock Browser',
    });
    return deepClone(newAccount);
  },

  async updateTokenAccount(account: TokenAccount): Promise<TokenAccount | null> {
    await sleep(500);
    const index = MOCK_TOKEN_ACCOUNTS.findIndex(acc => acc.id === account.id);
    if (index === -1) return null;

    const oldAccount = deepClone(MOCK_TOKEN_ACCOUNTS[index]);
    const updatedAccount = { ...oldAccount, ...account, lastModified: new Date().toISOString() };
    MOCK_TOKEN_ACCOUNTS[index] = updatedAccount;

    const changes = Object.keys(account).filter(key => (account as any)[key] !== (oldAccount as any)[key]).map(key => ({
      field: key,
      oldValue: (oldAccount as any)[key],
      newValue: (account as any)[key]
    }));
    if (changes.length > 0) {
      AuditLogService.createAuditLog({
        id: generateId(),
        timestamp: new Date().toISOString(),
        userId: typeof updatedAccount.ownerId === 'string' && updatedAccount.ownerId.startsWith('user-') ? updatedAccount.ownerId as UserIdentifier : undefined,
        agentId: typeof updatedAccount.ownerId === 'string' && updatedAccount.ownerId.startsWith('agent-') ? updatedAccount.ownerId as AgentIdentifier : undefined,
        action: 'UPDATE_TOKEN_ACCOUNT',
        entityType: 'TokenAccount',
        entityId: updatedAccount.id,
        changes: changes,
        ipAddress: '127.0.0.1',
        userAgent: 'Mock Browser',
      });
    }
    return deepClone(updatedAccount);
  },

  async deleteTokenAccount(id: AccountIdentifier): Promise<boolean> {
    await sleep(200);
    const initialLength = MOCK_TOKEN_ACCOUNTS.length;
    const accountToDelete = MOCK_TOKEN_ACCOUNTS.find(s => s.id === id);
    if (!accountToDelete) return false;

    MOCK_TOKEN_ACCOUNTS.splice(MOCK_TOKEN_ACCOUNTS.findIndex(acc => acc.id === id), 1);
    AuditLogService.createAuditLog({
      id: generateId(),
      timestamp: new Date().toISOString(),
      userId: MOCK_ADMIN_USER.id, // Assume admin for deletion
      action: 'DELETE_TOKEN_ACCOUNT',
      entityType: 'TokenAccount',
      entityId: id,
      changes: [{ field: 'accountData', oldValue: accountToDelete, newValue: {} }],
      ipAddress: '127.0.0.1',
      userAgent: 'Mock Browser',
    });
    return MOCK_TOKEN_ACCOUNTS.length < initialLength;
  },

  async mintTokens(accountId: AccountIdentifier, tokenType: TokenIdentifier, amount: number, mintedBy: UserIdentifier | AgentIdentifier): Promise<TokenAccount | null> {
    await sleep(600);
    const accountIndex = MOCK_TOKEN_ACCOUNTS.findIndex(acc => acc.id === accountId && acc.tokenType === tokenType);
    if (accountIndex === -1) return null;
    if (amount <= 0) throw new Error('Mint amount must be positive.');

    const oldBalance = MOCK_TOKEN_ACCOUNTS[accountIndex].balance;
    MOCK_TOKEN_ACCOUNTS[accountIndex].balance += amount;
    MOCK_TOKEN_ACCOUNTS[accountIndex].lastModified = new Date().toISOString();

    AuditLogService.createAuditLog({
      id: generateId(),
      timestamp: new Date().toISOString(),
      userId: typeof mintedBy === 'string' && mintedBy.startsWith('user-') ? mintedBy as UserIdentifier : undefined,
      agentId: typeof mintedBy === 'string' && mintedBy.startsWith('agent-') ? mintedBy as AgentIdentifier : undefined,
      action: 'MINT_TOKENS',
      entityType: 'TokenAccount',
      entityId: accountId,
      changes: [{ field: 'balance', oldValue: oldBalance, newValue: MOCK_TOKEN_ACCOUNTS[accountIndex].balance }],
      ipAddress: '127.0.0.1',
      userAgent: 'Minting Service',
    });

    return deepClone(MOCK_TOKEN_ACCOUNTS[accountIndex]);
  },

  async burnTokens(accountId: AccountIdentifier, tokenType: TokenIdentifier, amount: number, burnedBy: UserIdentifier | AgentIdentifier): Promise<TokenAccount | null> {
    await sleep(600);
    const accountIndex = MOCK_TOKEN_ACCOUNTS.findIndex(acc => acc.id === accountId && acc.tokenType === tokenType);
    if (accountIndex === -1) return null;
    if (amount <= 0) throw new Error('Burn amount must be positive.');
    if (MOCK_TOKEN_ACCOUNTS[accountIndex].balance < amount) throw new Error('Insufficient balance to burn.');

    const oldBalance = MOCK_TOKEN_ACCOUNTS[accountIndex].balance;
    MOCK_TOKEN_ACCOUNTS[accountIndex].balance -= amount;
    MOCK_TOKEN_ACCOUNTS[accountIndex].lastModified = new Date().toISOString();

    AuditLogService.createAuditLog({
      id: generateId(),
      timestamp: new Date().toISOString(),
      userId: typeof burnedBy === 'string' && burnedBy.startsWith('user-') ? burnedBy as UserIdentifier : undefined,
      agentId: typeof burnedBy === 'string' && burnedBy.startsWith('agent-') ? burnedBy as AgentIdentifier : undefined,
      action: 'BURN_TOKENS',
      entityType: 'TokenAccount',
      entityId: accountId,
      changes: [{ field: 'balance', oldValue: oldBalance, newValue: MOCK_TOKEN_ACCOUNTS[accountIndex].balance }],
      ipAddress: '127.0.0.1',
      userAgent: 'Burning Service',
    });

    return deepClone(MOCK_TOKEN_ACCOUNTS[accountIndex]);
  }
};

/**
 * Mock API for managing Token Transactions.
 * This simulates the core 'payments infrastructure' and 'token rail layer'.
 */
export const TokenTransactionApiService = {
  // Config for simulated rails
  railConfigs: new Map<string, TokenRailConfig>([
    ['rail_fast', { id: 'rail_fast', name: 'Fast Rail', description: 'Low latency, higher cost rail.', latencyMs: 50, costPerTransaction: 0.05, maxThroughputPerSecond: 100, supportedTokenTypes: [TokenType.USD_STABLE, TokenType.EUR_STABLE], securityLevel: 'cryptographic', status: 'operational', policyEngineRef: 'fast-rail-policy-v1' }],
    ['rail_batch', { id: 'rail_batch', name: 'Batch Rail', description: 'Higher latency, lower cost rail for aggregated payments.', latencyMs: 5000, costPerTransaction: 0.005, maxThroughputPerSecond: 10, supportedTokenTypes: [TokenType.USD_STABLE, TokenType.CARBON_CREDIT], securityLevel: 'cryptographic', status: 'operational', policyEngineRef: 'batch-rail-policy-v1' }],
  ]),

  async getTransactions(accountId?: AccountIdentifier): Promise<TokenTransaction[]> {
    await sleep(400);
    let transactions = deepClone(MOCK_TOKEN_TRANSACTIONS);
    if (accountId) {
      transactions = transactions.filter(txn => txn.senderAccountId === accountId || txn.receiverAccountId === accountId);
    }
    return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  async getTransactionById(id: TransactionIdentifier): Promise<TokenTransaction | null> {
    await sleep(200);
    const transaction = MOCK_TOKEN_TRANSACTIONS.find(txn => txn.id === id);
    return transaction ? deepClone(transaction) : null;
  },

  /**
   * Simulates sending a payment. Includes atomic settlement and cryptographic signing.
   * @param {Omit<TokenTransaction, 'id' | 'timestamp' | 'status' | 'transactionHash' | 'signature' | 'processingFee' | 'auditTrailId'> & { senderPrivateKey: string; selectedRailId?: string }} newTransactionDetails - Transaction details including sender's private key.
   * @returns {Promise<TokenTransaction>} The completed transaction.
   */
  async sendPayment(newTransactionDetails: Omit<TokenTransaction, 'id' | 'timestamp' | 'status' | 'transactionHash' | 'signature' | 'processingFee' | 'auditTrailId'> & { senderPrivateKey: string; selectedRailId?: string }): Promise<TokenTransaction> {
    await sleep(100); // Initial processing

    const { senderAccountId, receiverAccountId, tokenType, amount, senderPrivateKey, selectedRailId, metadata } = newTransactionDetails;

    // 1. Fetch accounts
    const senderAccount = MOCK_TOKEN_ACCOUNTS.find(acc => acc.id === senderAccountId);
    const receiverAccount = MOCK_TOKEN_ACCOUNTS.find(acc => acc.id === receiverAccountId);

    if (!senderAccount || !receiverAccount) {
      throw new Error('Sender or receiver account not found.');
    }
    if (senderAccount.tokenType !== tokenType || receiverAccount.tokenType !== tokenType) {
      throw new Error('Token type mismatch for sender or receiver account.');
    }
    if (senderAccount.balance < amount) {
      throw new Error('Insufficient funds in sender account.');
    }
    if (senderAccountId === receiverAccountId) {
      throw new Error('Cannot send funds to the same account.');
    }
    if (amount <= 0) {
      throw new Error('Transaction amount must be positive.');
    }

    // 2. Select Rail (simulated AI-enhanced routing)
    const availableRails = Array.from(this.railConfigs.values()).filter(
      rail => rail.status === 'operational' && rail.supportedTokenTypes.includes(tokenType)
    );

    let chosenRail = selectedRailId ? availableRails.find(r => r.id === selectedRailId) : null;
    if (!chosenRail) {
      // Predictive routing: pick the fastest/cheapest based on simple logic for mock
      chosenRail = availableRails.reduce((bestRail, currentRail) => {
        // Example: prioritize fast rail for small amounts, batch for large
        if (amount < 1000 && currentRail.id === 'rail_fast') return currentRail;
        if (amount >= 1000 && currentRail.id === 'rail_batch') return currentRail;
        return bestRail; // Default to the first available if no specific policy match
      }, availableRails[0]);
    }
    if (!chosenRail) {
      throw new Error('No suitable token rail available for this transaction.');
    }

    // 3. Risk Scoring/Fraud Detection (simulated)
    const fraudScore = Math.random(); // 0-1
    if (fraudScore > 0.95 && amount > 10000) {
      // Simulate blocking high-value suspicious transactions
      AuditLogService.createAuditLog({
        id: generateId(),
        timestamp: new Date().toISOString(),
        userId: senderAccount.ownerId as UserIdentifier,
        action: 'FRAUD_BLOCK',
        entityType: 'TokenTransaction',
        entityId: 'N/A', // No transaction ID yet
        changes: [{ field: 'reason', oldValue: '', newValue: `High fraud risk detected (score: ${fraudScore.toFixed(2)})` }],
        ipAddress: '127.0.0.1',
        userAgent: 'Payments Engine',
      });
      throw new Error(`Transaction blocked: High fraud risk detected (${(fraudScore * 100).toFixed(2)}%)`);
    }

    const transactionId = generateId();
    const transactionTimestamp = new Date().toISOString();
    const processingFee = chosenRail.costPerTransaction;
    const finalAmount = amount + processingFee; // Sender pays fee for simplicity

    if (senderAccount.balance < finalAmount) {
      throw new Error(`Insufficient funds: requires ${formatCurrency(finalAmount, tokenType)}, has ${formatCurrency(senderAccount.balance, tokenType)}`);
    }

    // Data to be signed (ensure deterministic order)
    const dataToSign = JSON.stringify({
      senderAccountId,
      receiverAccountId,
      tokenType,
      amount,
      railId: chosenRail.id,
      timestamp: transactionTimestamp,
      metadata,
    });
    const signature = simulateSign(dataToSign, senderPrivateKey); // Simulate signing

    const newTransaction: TokenTransaction = {
      id: transactionId,
      senderAccountId,
      receiverAccountId,
      tokenType,
      amount,
      timestamp: transactionTimestamp,
      status: 'pending',
      transactionHash: generateHash(dataToSign), // Hash of the signed data
      signature: signature,
      railId: chosenRail.id,
      processingFee: processingFee,
      metadata: metadata || {},
      auditTrailId: 'placeholder-audit-id', // Will be updated after audit log creation
    };

    // 4. Simulate Atomic Settlement
    await sleep(chosenRail.latencyMs); // Simulate rail latency

    // Debit sender
    senderAccount.balance -= finalAmount;
    senderAccount.lastModified = new Date().toISOString();

    // Credit receiver
    receiverAccount.balance += amount; // Receiver gets net amount
    receiverAccount.lastModified = new Date().toISOString();

    newTransaction.status = 'completed';
    MOCK_TOKEN_TRANSACTIONS.push(newTransaction);

    // Update mock accounts to reflect balance changes
    const senderIndex = MOCK_TOKEN_ACCOUNTS.findIndex(acc => acc.id === senderAccountId);
    if(senderIndex !== -1) MOCK_TOKEN_ACCOUNTS[senderIndex] = senderAccount;
    const receiverIndex = MOCK_TOKEN_ACCOUNTS.findIndex(acc => acc.id === receiverAccountId);
    if(receiverIndex !== -1) MOCK_TOKEN_ACCOUNTS[receiverIndex] = receiverAccount;


    // 5. Create Audit Log entry for the transaction (with chained hash)
    const auditLogEntry = await AuditLogService.createAuditLog({
      userId: typeof senderAccount.ownerId === 'string' && senderAccount.ownerId.startsWith('user-') ? senderAccount.ownerId as UserIdentifier : undefined,
      agentId: typeof senderAccount.ownerId === 'string' && senderAccount.ownerId.startsWith('agent-') ? senderAccount.ownerId as AgentIdentifier : undefined,
      action: 'INITIATE_PAYMENT',
      entityType: 'TokenTransaction',
      entityId: newTransaction.id,
      changes: [
        { field: 'senderBalanceBefore', oldValue: senderAccount.balance + finalAmount, newValue: senderAccount.balance },
        { field: 'receiverBalanceBefore', oldValue: receiverAccount.balance - amount, newValue: receiverAccount.balance },
        { field: 'transactionDetails', oldValue: {}, newValue: { ...newTransaction, signature: '[REDACTED]' } }, // Redact signature in audit log for security
      ],
      ipAddress: '127.0.0.1',
      userAgent: `Payments Engine - Rail: ${chosenRail.id}`,
    });
    newTransaction.auditTrailId = auditLogEntry.id;

    // Update the transaction in MOCK_TOKEN_TRANSACTIONS with the real auditTrailId
    const transactionIndex = MOCK_TOKEN_TRANSACTIONS.findIndex(txn => txn.id === newTransaction.id);
    if (transactionIndex !== -1) {
      MOCK_TOKEN_TRANSACTIONS[transactionIndex] = newTransaction;
    }

    return deepClone(newTransaction);
  },

  async getRailConfigs(): Promise<TokenRailConfig[]> {
    await sleep(100);
    return deepClone(Array.from(this.railConfigs.values()));
  },

  async updateRailConfig(config: TokenRailConfig): Promise<TokenRailConfig | null> {
    await sleep(300);
    if (!this.railConfigs.has(config.id)) return null;
    this.railConfigs.set(config.id, config);
    return deepClone(config);
  },
};


// --- Mock API Services (END) ---

// --- React Context and Reducer (START) ---

/**
 * Reducer function for managing the global application state.
 * This is the central state management logic for the Chaos Theorist View.
 */
export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_CURRENT_SYSTEM':
      return { ...state, currentSystemId: action.payload };

    // System Definitions
    case 'SET_SYSTEMS':
      return { ...state, systems: action.payload };
    case 'ADD_SYSTEM':
      return { ...state, systems: [...state.systems, action.payload] };
    case 'UPDATE_SYSTEM':
      return { ...state, systems: state.systems.map(s => s.id === action.payload.id ? action.payload : s) };
    case 'DELETE_SYSTEM':
      return { ...state, systems: state.systems.filter(s => s.id !== action.payload) };

    // Leverage Points
    case 'SET_LEVERAGE_POINTS':
      return { ...state, leveragePoints: action.payload };
    case 'ADD_LEVERAGE_POINT':
      return { ...state, leveragePoints: [...state.leveragePoints, action.payload] };
    case 'UPDATE_LEVERAGE_POINT':
      return { ...state, leveragePoints: state.leveragePoints.map(lp => lp.id === action.payload.id ? action.payload : lp) };
    case 'DELETE_LEVERAGE_POINT':
      return { ...state, leveragePoints: state.leveragePoints.filter(lp => lp.id !== action.payload) };

    // Simulation Runs
    case 'SET_SIMULATION_RUNS':
      return { ...state, simulationRuns: action.payload };
    case 'ADD_SIMULATION_RUN':
      return { ...state, simulationRuns: [...state.simulationRuns, action.payload] };
    case 'UPDATE_SIMULATION_RUN':
      return { ...state, simulationRuns: state.simulationRuns.map(run => run.id === action.payload.id ? action.payload : run) };
    case 'DELETE_SIMULATION_RUN':
      return { ...state, simulationRuns: state.simulationRuns.filter(run => run.id !== action.payload) };

    // Scenarios
    case 'SET_SCENARIOS':
      return { ...state, scenarios: action.payload };
    case 'ADD_SCENARIO':
      return { ...state, scenarios: [...state.scenarios, action.payload] };
    case 'UPDATE_SCENARIO':
      return { ...state, scenarios: state.scenarios.map(s => s.id === action.payload.id ? action.payload : s) };
    case 'DELETE_SCENARIO':
      return { ...state, scenarios: state.scenarios.filter(s => s.id !== action.payload) };

    // Alerts
    case 'SET_ALERTS':
      return { ...state, alerts: action.payload };
    case 'ADD_ALERT':
      return { ...state, alerts: [action.payload, ...state.alerts] }; // New alerts usually appear at the top
    case 'MARK_ALERT_AS_READ':
      return { ...state, alerts: state.alerts.map(a => a.id === action.payload ? { ...a, isRead: true } : a) };

    // Audit Logs
    case 'SET_AUDIT_LOGS':
      return { ...state, auditLogs: action.payload };
    case 'ADD_AUDIT_LOG_ENTRY':
      return { ...state, auditLogs: [action.payload, ...state.auditLogs] };

    // Agents
    case 'SET_AGENTS':
      return { ...state, agents: action.payload };
    case 'ADD_AGENT':
      return { ...state, agents: [...state.agents, action.payload] };
    case 'UPDATE_AGENT':
      return { ...state, agents: state.agents.map(a => a.id === action.payload.id ? action.payload : a) };
    case 'DELETE_AGENT':
      return { ...state, agents: state.agents.filter(a => a.id !== action.payload) };

    // Token Accounts
    case 'SET_TOKEN_ACCOUNTS':
      return { ...state, tokenAccounts: action.payload };
    case 'ADD_TOKEN_ACCOUNT':
      return { ...state, tokenAccounts: [...state.tokenAccounts, action.payload] };
    case 'UPDATE_TOKEN_ACCOUNT':
      return { ...state, tokenAccounts: state.tokenAccounts.map(acc => acc.id === action.payload.id ? action.payload : acc) };
    case 'DELETE_TOKEN_ACCOUNT':
      return { ...state, tokenAccounts: state.tokenAccounts.filter(acc => acc.id !== action.payload) };

    // Token Transactions
    case 'SET_TOKEN_TRANSACTIONS':
      return { ...state, tokenTransactions: action.payload };
    case 'ADD_TOKEN_TRANSACTION':
      return { ...state, tokenTransactions: [...state.tokenTransactions, action.payload] };

    // Agent Decisions
    case 'SET_AGENT_DECISIONS':
      return { ...state, agentDecisions: action.payload };
    case 'ADD_AGENT_DECISION':
      return { ...state, agentDecisions: [...state.agentDecisions, action.payload] };
    case 'UPDATE_AGENT_DECISION':
      return { ...state, agentDecisions: state.agentDecisions.map(d => d.id === action.payload.id ? action.payload : d) };

    // UI state
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SHOW_SYSTEM_DEFINITION_MODAL':
      return { ...state, showSystemDefinitionModal: action.payload };
    case 'SET_EDITING_SYSTEM_ID':
      return { ...state, editingSystemId: action.payload };
    case 'SHOW_LEVERAGE_POINT_MODAL':
      return { ...state, showLeveragePointModal: action.payload };
    case 'SET_EDITING_LEVERAGE_POINT_ID':
      return { ...state, editingLeveragePointId: action.payload };
    case 'SHOW_SIMULATION_RUN_MODAL':
      return { ...state, showSimulationRunModal: action.payload };
    case 'SET_EDITING_SCENARIO_ID':
      return { ...state, editingScenarioId: action.payload };
    case 'SHOW_AGENT_MODAL': // New UI state
      return { ...state, showAgentModal: action.payload };
    case 'SET_EDITING_AGENT_ID': // New UI state
      return { ...state, editingAgentId: action.payload };
    case 'SHOW_TOKEN_ACCOUNT_MODAL': // New UI state
      return { ...state, showTokenAccountModal: action.payload };
    case 'SET_EDITING_TOKEN_ACCOUNT_ID': // New UI state
      return { ...state, editingTokenAccountId: action.payload };
    default:
      return state;
  }
};

/**
 * Creates and exports the React Context for the application state.
 * This context provides global access to the application's state and dispatch function.
 */
export const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<AppAction> } | undefined>(undefined);

/**
 * Custom hook to easily access the AppContext.
 * Throws an error if used outside of an AppProvider.
 * @returns {object} The global app state and dispatch function.
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

/**
 * AppProvider component to wrap the application and provide state.
 * Initializes the global state with `INITIAL_APP_STATE` and uses `appReducer`.
 * It also handles initial data loading for mock services.
 * @param {object} props - React props for the component.
 * @param {React.ReactNode} props.children - The child components to be rendered within the provider.
 * @returns {JSX.Element} The AppProvider with its children.
 */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, INITIAL_APP_STATE);

  // Initial data loading for mock services
  useEffect(() => {
    const loadInitialData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const systems = await SystemApiService.getSystems();
        dispatch({ type: 'SET_SYSTEMS', payload: systems });

        const leveragePoints = await LeveragePointApiService.getLeveragePoints();
        dispatch({ type: 'SET_LEVERAGE_POINTS', payload: leveragePoints });

        const simulationRuns = await SimulationRunApiService.getSimulationRuns();
        dispatch({ type: 'SET_SIMULATION_RUNS', payload: simulationRuns });

        const scenarios = await SimulationScenarioApiService.getScenarios();
        dispatch({ type: 'SET_SCENARIOS', payload: scenarios });

        const alerts = await SystemAlertApiService.getAlerts();
        dispatch({ type: 'SET_ALERTS', payload: alerts });

        const auditLogs = await AuditLogService.getAuditLogs(); // Load existing logs
        dispatch({ type: 'SET_AUDIT_LOGS', payload: auditLogs });

        const agents = await AgentApiService.getAgents();
        dispatch({ type: 'SET_AGENTS', payload: agents });

        const tokenAccounts = await TokenAccountApiService.getTokenAccounts();
        dispatch({ type: 'SET_TOKEN_ACCOUNTS', payload: tokenAccounts);

        const tokenTransactions = await TokenTransactionApiService.getTransactions();
        dispatch({ type: 'SET_TOKEN_TRANSACTIONS', payload: tokenTransactions });

        const agentDecisions = await AgentApiService.getAgentDecisions(); // Assuming a new method for agents' decisions
        dispatch({ type: 'SET_AGENT_DECISIONS', payload: agentDecisions });

        // Verify audit log chain on startup (for simulation)
        const { isValid, brokenAtIndex } = await AuditLogService.verifyAuditLogChain();
        if (!isValid) {
          console.warn(`Audit log chain integrity compromised at index ${brokenAtIndex}.`);
          dispatch({ type: 'ADD_ALERT', payload: {
            id: generateId(),
            systemId: 'system-global',
            type: 'critical',
            message: `Audit log integrity compromised! Break detected at entry ${brokenAtIndex}.`,
            timestamp: new Date().toISOString(),
            isRead: false,
            actionRequired: true,
            severity: 'critical',
            source: 'system-health',
            details: { brokenAtIndex }
          }});
        }

      } catch (err: any) {
        dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to load initial data.' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadInitialData();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Assuming AgentApiService will also have a getAgentDecisions method
// For mock purposes:
AgentApiService.getAgentDecisions = async (): Promise<AgentDecision[]> => {
  await sleep(300);
  return deepClone(MOCK_AGENT_DECISIONS);
};

```