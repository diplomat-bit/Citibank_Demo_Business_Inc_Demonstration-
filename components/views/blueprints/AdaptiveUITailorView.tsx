/**
 * This module implements the core Adaptive User Interface Tailor View, a strategic component enabling dynamic and intelligent
 * personalization of the application's user experience. Business value: This system intelligently adapts the UI to individual
 * user personas, real-time behavioral patterns, and configured preferences, vastly enhancing user productivity,
 * reducing cognitive load, and improving overall engagement. By delivering a tailored experience for every user,
 * from a data scientist to a payments operator, it accelerates workflow completion, minimizes training costs,
 * and ensures compliance with accessibility standards. This level of dynamic personalization is crucial for
 * maintaining competitive advantage, driving user retention, and unlocking new operational efficiencies
 * across diverse user roles within an enterprise financial ecosystem. It turns a static application into a
 * responsive partner, worth millions in saved time, increased accuracy, and heightened user satisfaction.
 */

import React, { useState, useEffect, createContext, useContext, useCallback, useMemo, useRef } from 'react';

// --- Global Type Definitions (Expanded) ---

/**
 * @typedef UIPersona
 * @description Defines various user interface personalities, influencing UI adaptations.
 * Each persona encapsulates a set of preferred UI characteristics derived from user roles,
 * behavioral analysis, or explicit selection.
 */
export type UIPersona =
  | 'ANALYTICAL_INTROVERT'
  | 'CREATIVE_EXTRAVERT'
  | 'DEFAULT'
  | 'DECISIVE_LEADER'
  | 'COLLABORATIVE_OPTIMIZER'
  | 'EXPLORATORY_LEARNER'
  | 'MINIMALIST_EFFICIENCY'
  | 'VISUAL_ARTIST'
  | 'TASK_FOCUSED_PRAGMATIST'
  | 'SOCIAL_NETWORKER'
  | 'DATA_SCIENTIST'
  | 'BUSINESS_ANALYST'
  | 'DEVELOPER_ENGINEER'
  | 'FINANCIAL_TRADER' // Specialization for high-frequency data and quick actions
  | 'COMPLIANCE_OFFICER'; // Focus on audit trails, reporting, and security alerts

/**
 * @typedef UILayoutDensity
 * @description Defines the spacing and compactness of UI elements. Optimal density improves readability
 * and information display based on user preference and screen real estate.
 */
export type UILayoutDensity = 'DENSE' | 'SPARSE' | 'HYBRID' | 'COMPACT' | 'GRID' | 'FLEX_ADAPTIVE';

/**
 * @typedef UIColorTheme
 * @description Defines available color themes for the UI. Themes are carefully designed to reduce eye strain
 * and improve visual hierarchy, catering to diverse environmental and accessibility needs.
 */
export type UIColorTheme = 'MONOCHROME' | 'VIBRANT' | 'DARK_MODERN' | 'LIGHT_CLASSIC' | 'HIGH_CONTRAST'
  | 'OCEANIC'
  | 'FOREST_CALM'
  | 'SUNSET_GLOW'
  | 'CYBERPUNK_NEON';

/**
 * @typedef UIFontPreference
 * @description Defines font styles for readability and aesthetic. Selecting the right font
 * significantly impacts legibility and user comfort, especially in data-intensive applications.
 */
export type UIFontPreference = 'SERIF' | 'SANS_SERIF' | 'MONOSPACE' | 'READABLE_DYSLEXIA' | 'FUN_CASUAL' | 'PROFESSIONAL';

/**
 * @typedef UIInteractionSpeed
 * @description Defines the responsiveness and animation speed of UI interactions. Tailoring this
 * allows power users to work faster and provides a more accessible experience for others.
 */
export type UIInteractionSpeed = 'FAST' | 'MEDIUM' | 'SLOW' | 'VERY_FAST' | 'ACCESSIBLE';

/**
 * @typedef UINavigationalStyle
 * @description Defines how users navigate through the application. An adaptable navigation
 * system streamlines access to critical functions, reducing time-to-action for financial operations.
 */
export type UINavigationalStyle = 'TABBED' | 'SIDEBAR' | 'BREADCRUMBS' | 'COMMAND_PALETTE'
  | 'TOP_MENU_BAR'
  | 'FLOATING_ACTION_BUTTON'
  | 'MAGNIFYING_GLASS_SEARCH';

/**
 * @interface UIAccessibilityPreference
 * @description Comprehensive accessibility settings for the UI, ensuring the application is usable
 * by individuals with diverse needs. Compliance with accessibility standards is both a legal
 * and ethical imperative, expanding market reach and ensuring inclusive design.
 */
export interface UIAccessibilityPreference {
  fontSizeScale: number;
  contrastMode: 'DEFAULT' | 'HIGH_CONTRAST' | 'DARK_MODE_ONLY' | 'LIGHT_MODE_ONLY';
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
  colorBlindMode: 'NONE' | 'PROTANOMALY' | 'DEUTERANOMALY' | 'TRITANOMALY';
  keyboardNavigationOnly: boolean;
  audioCuesEnabled: boolean;
}

/**
 * @typedef UIComponentStrategy
 * @description Defines how UI components are loaded and rendered. Optimizing component
 * loading strategies improves perceived performance and resource utilization.
 */
export type UIComponentStrategy = 'LAZY_LOAD' | 'PRE_RENDER' | 'ON_DEMAND' | 'HYBRID_PRELOAD' | 'STREAMING';

/**
 * @typedef UIComponentSize
 * @description Defines the preferred size variant for components, allowing for optimal use
 * of screen space and touch target sizing.
 */
export type UIComponentSize = 'SMALL' | 'MEDIUM' | 'LARGE' | 'FLEXIBLE';

/**
 * @typedef UINotificationLevel
 * @description Defines the verbosity and intrusiveness of notifications. Configurable notification
 * levels ensure users receive critical alerts without being overwhelmed, crucial for real-time payments.
 */
export type UINotificationLevel = 'NONE' | 'MINIMAL' | 'NORMAL' | 'OPTIONAL_SOUND' | 'AGGRESSIVE';

/**
 * @typedef UIInformationDensity
 * @description Defines how much information is displayed per screen area. High density is
 * often preferred by expert users for rapid data scanning, while low density can improve clarity.
 */
export type UIInformationDensity = 'LOW' | 'MEDIUM' | 'HIGH' | 'DYNAMIC'; // Added DYNAMIC for AI adjustment

/**
 * @typedef UIAnimationPreference
 * @description Defines the preference for UI animations, balancing engaging visuals with
 * performance and accessibility concerns.
 */
export type UIAnimationPreference = 'FULL' | 'REDUCED' | 'NONE';

/**
 * @typedef UIIconographyStyle
 * @description Defines the visual style of icons used in the UI, contributing to brand identity
 * and visual clarity.
 */
export type UIIconographyStyle = 'FLAT' | 'OUTLINE' | 'FILLED' | 'SKEUMORPHIC' | 'DUOTONE'; // Added DUOTONE

/**
 * @interface UIState
 * @description Represents the comprehensive state of the User Interface preferences and dynamic adaptations.
 * This interface is central to how the application's UI is rendered and behaves, acting as the blueprint
 * for the current user experience.
 */
export interface UIState {
  persona: UIPersona;
  layout: UILayoutDensity;
  colorTheme: UIColorTheme;
  fontPreference: UIFontPreference;
  interactionSpeed: UIInteractionSpeed;
  navigationalStyle: UINavigationalStyle;
  accessibility: UIAccessibilityPreference;
  componentSet: string[];
  componentStrategy: UIComponentStrategy;
  lastUpdated: number;
  debugMode: boolean;
  manualOverrides: Partial<UIState>;
  componentSize: UIComponentSize;
  notificationLevel: UINotificationLevel;
  informationDensity: UIInformationDensity;
  animationPreference: UIAnimationPreference;
  iconographyStyle: UIIconographyStyle;
  dataRefreshRate: 'REALTIME' | 'HIGH' | 'MEDIUM' | 'LOW' | 'MANUAL';
  language: string;
  timezone: string;
  metricSystem: 'IMPERIAL' | 'METRIC';
  showHelpTips: boolean; // Added: Control visibility of inline help
  smartDefaultsEnabled: boolean; // Added: AI-driven default settings
  adaptiveContentPrioritization: boolean; // Added: AI-driven content relevance
  workspaceLayout: { // Added: Customizable workspace layout for complex tasks
    primaryPanel: string; // e.g., 'Dashboard', 'Transactions'
    secondaryPanel?: string; // e.g., 'Alerts', 'Chat'
    layoutPreset: 'SINGLE_PANEL' | 'DUAL_COLUMN' | 'TABBED_WORKSPACES';
  };
}

/**
 * @interface UIRecommendation
 * @description Represents a recommendation generated by an AI agent for adapting the UI state.
 * This can be a full state or a partial update, enabling granular adjustments.
 */
export interface UIRecommendation {
  id: string;
  timestamp: number;
  recommendedChanges: Partial<UIState>;
  reason: string; // e.g., "Frequent error clicks detected", "User is an Analytical Introvert"
  confidenceScore: number; // e.g., 0.75
  sourceAgentId: string; // Identifier for the AI agent providing the recommendation
  appliesToUserIds?: string[]; // Optional: if a recommendation applies to a group
}

/**
 * @interface UIAdaptationRule
 * @description Defines a declarative rule for how the UI should adapt under certain conditions.
 * These rules can be predefined or dynamically updated by governance agents.
 */
export interface UIAdaptationRule {
  ruleId: string;
  name: string;
  description: string;
  condition: string; // A string-based condition, e.g., "user.persona == 'DATA_SCIENTIST' && user.deviceType == 'DESKTOP'"
  // For a real system, this would be an AST or a function reference
  action: Partial<UIState>; // The UI state changes to apply if the condition is met
  priority: number; // Rules with higher priority override lower ones
  isEnabled: boolean;
  createdBy: string;
  createdAt: number;
  lastModified: number;
}

/**
 * @interface UserPermission
 * @description Defines a single permission entry for a user, granting specific action on a resource.
 * Permissions are granular controls that determine what a user or agent can view, modify, or execute.
 */
export interface UserPermission {
  permissionId: string;
  resource: string;
  action: 'read' | 'write' | 'delete' | 'execute' | 'manage' | 'approve' | 'audit'; // Added 'approve', 'audit'
  grantedAt: number;
  expiresAt?: number;
}

/**
 * @interface UserRole
 * @description Represents a role assigned to a user, which aggregates a set of permissions.
 * Roles simplify permission management, allowing for efficient assignment of capabilities
 * across user groups and aligning with organizational hierarchies.
 */
export interface UserRole {
  roleId: string;
  name: string;
  description: string;
  permissions: string[];
  inheritsRoles?: string[]; // Added: Roles can inherit permissions from other roles
}

/**
 * @interface UserProfile
 * @description Comprehensive user profile extending basic information with adaptive UI and application preferences.
 * This profile serves as the central identity record, enabling personalized experiences, secure access,
 * and compliance tracking across the entire financial ecosystem.
 */
export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  organizationId?: string;
  department?: string;
  jobTitle?: string;
  avatarUrl?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'LOCKED' | 'ARCHIVED'; // Added 'ARCHIVED'
  lastLogin: number;
  createdAt: number;
  uiPreferencesHistory: UIState[];
  behavioralLogs: UserEvent[]; // Potentially a subset or summary for performance
  featureFlags: { [key: string]: boolean };
  subscriptions: string[];
  accessLevels: string[];
  roles: string[];
  explicitPermissions: UserPermission[];
  activeABTests: { [testId: string]: string };
  manualOverrides: Partial<UIState>;
  adaptiveLearningEnabled: boolean;
  personalizationEnabled: boolean;
  notificationSettings: {
    email: boolean;
    inApp: boolean;
    push: boolean;
    level: UINotificationLevel;
    doNotDisturb: {
      enabled: boolean;
      startTime?: string;
      endTime?: string;
    };
    channels: { [channel: string]: boolean }; // Added: e.g., { 'critical_alerts': true, 'marketing': false }
  };
  languagePreference: string;
  timezonePreference: string;
  onboardingStatus: {
    completedSteps: string[];
    lastStep: string;
    isComplete: boolean;
    lastUpdated: number; // Added: Timestamp for onboarding progress
  };
  dataRetentionPolicy?: '30_DAYS' | '90_DAYS' | '1_YEAR' | 'NEVER';
  settingsVersion: number;
  lastActivityTimestamp: number; // Added: Track last user activity for session management/AI
  deviceInfo: { // Added: Device context for better adaptation
    deviceType: 'DESKTOP' | 'TABLET' | 'MOBILE';
    os: string;
    browser: string;
    screenResolution: string;
  };
}

/**
 * @enum UserEventType
 * @description Enumeration of various types of user interactions and system events for logging.
 * These events are critical data points for behavioral analytics, security auditing,
 * and driving AI-powered adaptive UI adjustments.
 */
export type UserEventType =
  | 'CLICK'
  | 'VIEW'
  | 'INPUT'
  | 'SEARCH'
  | 'ERROR'
  | 'NAVIGATE'
  | 'SCROLL'
  | 'SESSION_START'
  | 'SESSION_END'
  | 'UI_CHANGE'
  | 'API_CALL'
  | 'DATA_EXPORT'
  | 'DATA_IMPORT'
  | 'DRAG_AND_DROP'
  | 'FORM_SUBMIT'
  | 'FILE_UPLOAD'
  | 'AUTHENTICATION'
  | 'PERMISSION_CHANGE'
  | 'SYSTEM_ALERT'
  | 'RECOMMENDATION_INTERACTION'
  | 'WORKFLOW_ACTION'
  | 'SETTINGS_UPDATE'
  | 'INACTIVITY_TIMEOUT';

/**
 * @interface UserEvent
 * @description Represents a single, timestamped user or system event, crucial for auditing,
 * analytics, and driving adaptive UI logic.
 */
export interface UserEvent {
  eventId: string;
  userId: string;
  timestamp: number;
  type: UserEventType;
  details: { [key: string]: any }; // Arbitrary details relevant to the event
  sessionId: string; // Associates events within a user session
}

// --- Default UI State and Profile for Initialization ---

/**
 * @constant DEFAULT_ACCESSIBILITY_PREFERENCES
 * @description Baseline accessibility settings applied when no specific preferences are found.
 * Ensures a reasonable default for all users.
 */
export const DEFAULT_ACCESSIBILITY_PREFERENCES: UIAccessibilityPreference = {
  fontSizeScale: 1.0,
  contrastMode: 'DEFAULT',
  reducedMotion: false,
  screenReaderOptimized: false,
  colorBlindMode: 'NONE',
  keyboardNavigationOnly: false,
  audioCuesEnabled: false,
};

/**
 * @constant DEFAULT_UI_STATE
 * @description The initial, baseline UI configuration. This ensures a consistent starting point
 * before any user-specific or adaptive adjustments are applied.
 */
export const DEFAULT_UI_STATE: UIState = {
  persona: 'DEFAULT',
  layout: 'SPARSE',
  colorTheme: 'LIGHT_CLASSIC',
  fontPreference: 'SANS_SERIF',
  interactionSpeed: 'MEDIUM',
  navigationalStyle: 'SIDEBAR',
  accessibility: DEFAULT_ACCESSIBILITY_PREFERENCES,
  componentSet: [],
  componentStrategy: 'LAZY_LOAD',
  lastUpdated: Date.now(),
  debugMode: false,
  manualOverrides: {},
  componentSize: 'MEDIUM',
  notificationLevel: 'NORMAL',
  informationDensity: 'MEDIUM',
  animationPreference: 'FULL',
  iconographyStyle: 'FLAT',
  dataRefreshRate: 'HIGH',
  language: 'en-US',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  metricSystem: 'METRIC',
  showHelpTips: true,
  smartDefaultsEnabled: true,
  adaptiveContentPrioritization: true,
  workspaceLayout: {
    primaryPanel: 'Dashboard',
    layoutPreset: 'DUAL_COLUMN',
  },
};

/**
 * @constant DEFAULT_USER_PROFILE
 * @description A default, anonymous user profile used for initial state or unauthenticated access.
 * This provides a fallback for critical system operations and guest user experiences.
 */
export const DEFAULT_USER_PROFILE: UserProfile = {
  userId: 'anonymous-user',
  username: 'Guest User',
  email: 'guest@example.com',
  status: 'ACTIVE',
  lastLogin: Date.now(),
  createdAt: Date.now(),
  uiPreferencesHistory: [DEFAULT_UI_STATE],
  behavioralLogs: [],
  featureFlags: {},
  subscriptions: ['free_tier'],
  accessLevels: ['viewer'],
  roles: ['guest'],
  explicitPermissions: [],
  activeABTests: {},
  manualOverrides: {},
  adaptiveLearningEnabled: true,
  personalizationEnabled: true,
  notificationSettings: {
    email: false,
    inApp: true,
    push: false,
    level: 'MINIMAL',
    doNotDisturb: { enabled: false },
    channels: {},
  },
  languagePreference: 'en-US',
  timezonePreference: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  onboardingStatus: {
    completedSteps: [],
    lastStep: '',
    isComplete: false,
    lastUpdated: Date.now(),
  },
  settingsVersion: 1,
  lastActivityTimestamp: Date.now(),
  deviceInfo: {
    deviceType: 'DESKTOP',
    os: 'Unknown',
    browser: 'Unknown',
    screenResolution: 'Unknown',
  },
};

// --- AI Adaptation Simulation Logic ---

/**
 * @function simulateAIRecommendation
 * @description A high-fidelity simulator for an AI agent's UI recommendations. This function
 * analyzes a user's profile and recent behavioral events to suggest adaptive UI changes.
 * This deterministic simulation demonstrates the potential of AI to enhance user workflows
 * and drive efficiency, delivering a superior user experience worth millions in productivity gains.
 * In a production system, this would interface with a sophisticated agentic AI service.
 * @param profile The current UserProfile for context.
 * @param recentEvents A log of recent UserEvents to infer behavior.
 * @returns A Partial<UIState> representing recommended changes, or an empty object if no strong recommendations.
 */
export function simulateAIRecommendation(profile: UserProfile, recentEvents: UserEvent[]): Partial<UIState> {
  const recommendations: Partial<UIState> = {};
  let personaInferred: UIPersona = profile.persona;

  // Rule 1: Adapt based on explicit persona
  switch (profile.persona) {
    case 'ANALYTICAL_INTROVERT':
      recommendations.informationDensity = 'HIGH';
      recommendations.navigationalStyle = 'COMMAND_PALETTE';
      recommendations.componentSet = ['DataGrid', 'AdvancedCharts', 'QueryBuilder'];
      recommendations.colorTheme = 'DARK_MODERN';
      break;
    case 'CREATIVE_EXTRAVERT':
      recommendations.colorTheme = 'VIBRANT';
      recommendations.animationPreference = 'FULL';
      recommendations.navigationalStyle = 'TABBED';
      recommendations.componentSet = ['MoodBoard', 'CollaborativeCanvas', 'Chat'];
      break;
    case 'DECISIVE_LEADER':
      recommendations.informationDensity = 'MEDIUM';
      recommendations.notificationLevel = 'AGGRESSIVE';
      recommendations.dataRefreshRate = 'REALTIME';
      recommendations.navigationalStyle = 'TOP_MENU_BAR';
      recommendations.componentSet = ['ExecutiveDashboard', 'ApprovalWorkflows'];
      break;
    case 'FINANCIAL_TRADER':
      recommendations.dataRefreshRate = 'REALTIME';
      recommendations.informationDensity = 'HIGH';
      recommendations.layout = 'DENSE';
      recommendations.componentSet = ['LiveMarketFeed', 'OrderBook', 'TradeBlotter'];
      recommendations.notificationLevel = 'AGGRESSIVE';
      recommendations.colorTheme = 'HIGH_CONTRAST';
      break;
    case 'COMPLIANCE_OFFICER':
      recommendations.dataRefreshRate = 'HIGH';
      recommendations.informationDensity = 'MEDIUM';
      recommendations.componentSet = ['AuditLogViewer', 'RegulatoryReports', 'AlertManagement'];
      recommendations.notificationLevel = 'NORMAL';
      recommendations.colorTheme = 'MONOCHROME';
      recommendations.showHelpTips = false;
      break;
    case 'DEVELOPER_ENGINEER':
      recommendations.informationDensity = 'HIGH';
      recommendations.colorTheme = 'DARK_MODERN';
      recommendations.fontPreference = 'MONOSPACE';
      recommendations.componentSet = ['CodeEditor', 'Terminal', 'LogViewer'];
      recommendations.notificationLevel = 'OPTIONAL_SOUND';
      break;
  }

  // Rule 2: Behavioral adaptation from recent events
  const errorCount = recentEvents.filter(e => e.type === 'ERROR').length;
  const searchCount = recentEvents.filter(e => e.type === 'SEARCH').length;
  const uiChangeCount = recentEvents.filter(e => e.type === 'UI_CHANGE').length;
  const frequentFormSubmits = recentEvents.filter(e => e.type === 'FORM_SUBMIT').length > 5;
  const manyNavigationEvents = recentEvents.filter(e => e.type === 'NAVIGATE').length > 10;
  const highScrollActivity = recentEvents.filter(e => e.type === 'SCROLL').length > 20;

  if (errorCount > 3) {
    recommendations.notificationLevel = 'AGGRESSIVE';
    recommendations.showHelpTips = true;
    recommendations.accessibility = { ...recommendations.accessibility, contrastMode: 'HIGH_CONTRAST' };
    recommendations.animationPreference = 'REDUCED';
    if (profile.adaptiveLearningEnabled) {
      personaInferred = 'TASK_FOCUSED_PRAGMATIST';
    }
  }

  if (searchCount > 5 && profile.navigationalStyle !== 'MAGNIFYING_GLASS_SEARCH') {
    recommendations.navigationalStyle = 'MAGNIFYING_GLASS_SEARCH';
    recommendations.showHelpTips = true;
    if (profile.adaptiveLearningEnabled) {
      personaInferred = 'EXPLORATORY_LEARNER';
    }
  }

  if (uiChangeCount > 0 && !profile.adaptiveLearningEnabled) {
    recommendations.showHelpTips = true;
  }

  if (frequentFormSubmits && profile.layout !== 'COMPACT') {
    recommendations.layout = 'COMPACT';
  }

  if (manyNavigationEvents && profile.navigationalStyle === 'BREADCRUMBS') {
    if (profile.adaptiveLearningEnabled) {
      recommendations.navigationalStyle = 'SIDEBAR';
    }
  }

  if (highScrollActivity && profile.informationDensity !== 'HIGH') {
    recommendations.informationDensity = 'HIGH';
  }

  // Override persona if a stronger behavioral inference is made and adaptive learning is on
  if (profile.adaptiveLearningEnabled && personaInferred !== profile.persona) {
    recommendations.persona = personaInferred;
  }

  // Apply manual overrides from the profile last, ensuring user's explicit choices are respected
  return { ...recommendations, ...profile.manualOverrides };
}

// --- Adaptive UI Context and Provider ---

/**
 * @interface AdaptiveUIContextType
 * @description Defines the structure of the Adaptive UI Context, providing the current
 * UI state and functions to modify it. This context is the central nervous system
 * for UI personalization across the application.
 */
export interface AdaptiveUIContextType {
  uiState: UIState;
  currentProfile: UserProfile;
  updateUIState: (newPartialState: Partial<UIState>, bypassAI?: boolean) => void;
  applyRecommendation: (recommendation: UIRecommendation) => void;
  trackUserEvent: (type: UserEventType, details?: { [key: string]: any }) => void;
  permissions: { [key: string]: boolean }; // Flattened map of effective permissions
}

/**
 * @constant AdaptiveUIContext
 * @description React Context for managing and providing the global Adaptive UI State.
 * This allows any component in the application to access and react to UI preferences.
 */
export const AdaptiveUIContext = createContext<AdaptiveUIContextType | undefined>(undefined);

/**
 * @function useAdaptiveUI
 * @description A custom React hook to consume the Adaptive UI Context. This hook
 * simplifies access to the current UI state and adaptation functions for any
 * component within the AdaptiveUIProvider's scope.
 * @returns The AdaptiveUIContextType object.
 * @throws Error if used outside of an AdaptiveUIProvider.
 */
export const useAdaptiveUI = (): AdaptiveUIContextType => {
  const context = useContext(AdaptiveUIContext);
  if (context === undefined) {
    throw new Error('useAdaptiveUI must be used within an AdaptiveUIProvider');
  }
  return context;
};

/**
 * @interface AdaptiveUIProviderProps
 * @description Properties for the AdaptiveUIProvider component.
 * Allows initial user profile to be passed in, enabling server-side rendering
 * or initial client-side data loading.
 */
export interface AdaptiveUIProviderProps {
  children: React.ReactNode;
  initialProfile?: UserProfile;
  aiSimulationEnabled?: boolean;
  aiSimulationIntervalMs?: number;
  maxBehavioralLogs?: number;
}

/**
 * @function AdaptiveUIProvider
 * @description A React Context Provider that manages and supplies the adaptive UI state
 * to its children components. This provider orchestrates UI personalization by
 * integrating user preferences, behavioral data, and AI-driven recommendations.
 * It's a key infrastructure component that delivers dynamic, high-value user experiences.
 * @param props The AdaptiveUIProviderProps, including children and optional initial profile.
 * @returns A React Provider component.
 */
export const AdaptiveUIProvider: React.FC<AdaptiveUIProviderProps> = ({
  children,
  initialProfile,
  aiSimulationEnabled = true,
  aiSimulationIntervalMs = 5000,
  maxBehavioralLogs = 100,
}) => {
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(initialProfile || DEFAULT_USER_PROFILE);
  const [uiState, setUiState] = useState<UIState>(() => {
    const baseState = initialProfile?.uiPreferencesHistory?.[0] || DEFAULT_UI_STATE;
    return { ...baseState, ...initialProfile?.manualOverrides, lastUpdated: Date.now() };
  });

  const behavioralLogsRef = useRef<UserEvent[]>(currentProfile.behavioralLogs || []);

  /**
   * @constant permissions
   * @description Memoized calculation of the effective permissions for the current user profile.
   * This aggregation combines permissions from assigned roles and any explicit permissions,
   * providing a flattened map for efficient access control checks across the UI.
   * Business value: Ensures granular and dynamic security enforcement, restricting access to
   * sensitive features and data based on real-time user privileges, which is critical for
   * financial operations compliance and data integrity.
   */
  const permissions = useMemo(() => {
    const effectivePermissions: { [key: string]: boolean } = {};
    const rolesMap: { [roleId: string]: UserRole } = {};

    const mockRoles: UserRole[] = [
      { roleId: 'admin', name: 'Administrator', description: 'Full access', permissions: ['resource:*:*:*', 'admin_panel:*:*'] },
      { roleId: 'project_manager', name: 'Project Manager', description: 'Manage projects', permissions: ['project:*:write', 'project:*:read', 'task:*:write'] },
      { roleId: 'guest', name: 'Guest User', description: 'Read-only access', permissions: ['resource:*:read'] },
      { roleId: 'financial_analyst', name: 'Financial Analyst', description: 'Access to financial reports', permissions: ['report:financial:read', 'data:transactions:read'] },
      { roleId: 'payments_operator', name: 'Payments Operator', description: 'Manage payment transactions', permissions: ['payment:transaction:execute', 'payment:transaction:read', 'payment:transaction:approve'] },
    ];
    mockRoles.forEach(role => (rolesMap[role.roleId] = role));

    const allPermissions = new Set<string>();

    const resolveRolePermissions = (roleIds: string[]) => {
      roleIds.forEach(roleId => {
        const role = rolesMap[roleId];
        if (role) {
          role.permissions.forEach(perm => allPermissions.add(perm));
          if (role.inheritsRoles) {
            resolveRolePermissions(role.inheritsRoles);
          }
        }
      });
    };

    resolveRolePermissions(currentProfile.roles);
    currentProfile.explicitPermissions.forEach(p => allPermissions.add(`${p.resource}:${p.action}`));

    allPermissions.forEach(perm => {
      if (perm.includes(':*:*')) {
        const baseResource = perm.split(':')[0];
        effectivePermissions[`${baseResource}:*`] = true;
      } else if (perm.includes(':*')) {
        const [resourceType, resourceId] = perm.split(':');
        effectivePermissions[`${resourceType}:${resourceId}:*`] = true;
      }
      effectivePermissions[perm] = true;
    });

    return effectivePermissions;
  }, [currentProfile.roles, currentProfile.explicitPermissions]);


  /**
   * @function updateUIState
   * @description Merges a partial UI state into the current state, updating it globally.
   * This is the primary mechanism for UI components or external logic to request UI adjustments.
   * Business value: Provides a single, controlled point of modification for the UI, ensuring consistency
   * and enabling sophisticated adaptation logic.
   * @param newPartialState A partial UIState object containing the properties to update.
   * @param bypassAI If true, this update will not immediately trigger an AI re-evaluation.
   */
  const updateUIState = useCallback((newPartialState: Partial<UIState>, bypassAI: boolean = false) => {
    setUiState(prev => {
      const updatedState = {
        ...prev,
        ...newPartialState,
        lastUpdated: Date.now(),
        manualOverrides: { ...prev.manualOverrides, ...newPartialState.manualOverrides },
      };
      trackUserEvent('UI_CHANGE', { previousState: prev, newState: updatedState });
      return updatedState;
    });

    if (aiSimulationEnabled && !bypassAI && currentProfile.adaptiveLearningEnabled) {
      // In a real application, this would debounce or use a dedicated worker/agent
      // For simulation, we might trigger a re-evaluation soon
    }
  }, [aiSimulationEnabled, currentProfile.adaptiveLearningEnabled]);

  /**
   * @function applyRecommendation
   * @description Applies an AI-generated UI recommendation to the current UI state.
   * This function integrates the insights from agentic AI directly into the user experience.
   * Business value: Automates UI optimization, reducing user effort and accelerating task completion
   * by proactively adapting the interface based on intelligent analysis.
   * @param recommendation The UIRecommendation object to apply.
   */
  const applyRecommendation = useCallback((recommendation: UIRecommendation) => {
    if (currentProfile.adaptiveLearningEnabled) {
      updateUIState(recommendation.recommendedChanges, true);
      trackUserEvent('RECOMMENDATION_INTERACTION', {
        recommendationId: recommendation.id,
        reason: recommendation.reason,
        changes: recommendation.recommendedChanges,
        action: 'APPLIED',
      });
    }
  }, [updateUIState, currentProfile.adaptiveLearningEnabled]);

  /**
   * @function trackUserEvent
   * @description Records a user interaction or system event. These logs are vital for
   * behavioral analytics, security audits, and as input for the adaptive AI engine.
   * Business value: Creates a rich dataset for optimizing user journeys, detecting anomalies,
   * and proving regulatory compliance, turning user activity into actionable intelligence.
   * @param type The type of event.
   * @param details Additional key-value pairs describing the event.
   */
  const trackUserEvent = useCallback((type: UserEventType, details: { [key: string]: any } = {}) => {
    const newEvent: UserEvent = {
      eventId: crypto.randomUUID(),
      userId: currentProfile.userId,
      timestamp: Date.now(),
      type,
      details,
      sessionId: 'simulated-session-id',
    };
    behavioralLogsRef.current = [...behavioralLogsRef.current, newEvent].slice(-maxBehavioralLogs);
    // In a real system, this would also send the event to a backend logging service for persistence and analysis.
  }, [currentProfile.userId, maxBehavioralLogs]);


  // Effect for AI-driven adaptation (simulation)
  useEffect(() => {
    if (!aiSimulationEnabled || !currentProfile.adaptiveLearningEnabled) {
      return;
    }

    const interval = setInterval(() => {
      const recentEvents = behavioralLogsRef.current.slice(-20);
      const aiRecommendation = simulateAIRecommendation(currentProfile, recentEvents);

      if (Object.keys(aiRecommendation).length > 0) {
        applyRecommendation({
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          recommendedChanges: aiRecommendation,
          reason: 'AI inferred adaptation from behavior',
          confidenceScore: 0.8,
          sourceAgentId: 'AdaptiveUI-Agent-v1',
        });
      }
    }, aiSimulationIntervalMs);

    return () => clearInterval(interval);
  }, [aiSimulationEnabled, aiSimulationIntervalMs, currentProfile, applyRecommendation]);

  // Effect to update currentProfile if initialProfile changes (e.g., user logs in/out)
  useEffect(() => {
    if (initialProfile && initialProfile.userId !== currentProfile.userId) {
      setCurrentProfile(initialProfile);
      const baseState = initialProfile.uiPreferencesHistory?.[0] || DEFAULT_UI_STATE;
      setUiState({ ...baseState, ...initialProfile.manualOverrides, lastUpdated: Date.now() });
      behavioralLogsRef.current = initialProfile.behavioralLogs || [];
      trackUserEvent('AUTHENTICATION', { action: 'LOGIN', userId: initialProfile.userId });
    }
  }, [initialProfile, currentProfile.userId, trackUserEvent]);


  const contextValue = useMemo(() => ({
    uiState,
    currentProfile,
    updateUIState,
    applyRecommendation,
    trackUserEvent,
    permissions,
  }), [uiState, currentProfile, updateUIState, applyRecommendation, trackUserEvent, permissions]);

  return (
    <AdaptiveUIContext.Provider value={contextValue}>
      {children}
    </AdaptiveUIContext.Provider>
  );
};

// --- Security and Utility Functions (Exported for broader use) ---

/**
 * @function hasPermission
 * @description Checks if a user has a specific permission. This function is essential for
 * enforcing role-based access control (RBAC) and ensuring that UI elements are only
 * visible or actionable to authorized users or agents.
 * Business value: Centralized access control enhances security, prevents unauthorized operations,
 * and maintains regulatory compliance, protecting sensitive financial data and operations.
 * @param effectivePermissions A map of flattened effective permissions (e.g., from useAdaptiveUI hook).
 * @param requiredPermission The specific permission string to check (e.g., 'payment:transaction:execute').
 * @returns True if the permission is granted, false otherwise.
 */
export function hasPermission(effectivePermissions: { [key: string]: boolean }, requiredPermission: string): boolean {
  if (effectivePermissions[requiredPermission]) {
    return true;
  }

  const parts = requiredPermission.split(':');
  if (parts.length === 3) {
    const [resourceType, resourceId, action] = parts;
    if (effectivePermissions[`${resourceType}:${resourceId}:*`]) return true;
    if (effectivePermissions[`${resourceType}:*:*`]) return true;
    if (effectivePermissions[`resource:*:*:*`]) return true;
  } else if (parts.length === 2) {
    const [resource, actionOrId] = parts;
    if (effectivePermissions[`${resource}:*`]) return true;
    if (effectivePermissions[`resource:*:*`]) return true;
  }

  return false;
}

declare global {
  interface Crypto {
    randomUUID(): string;
  }
  interface Window {
    crypto: Crypto;
  }
}

if (typeof crypto === 'undefined' || !crypto.randomUUID) {
  // A minimal, non-cryptographically secure fallback for UUID generation
  // for environments that might not natively support `crypto.randomUUID`.
  // This is primarily for ensuring testability or compatibility in diverse JavaScript runtimes.
  // In a production environment, `crypto.randomUUID` is expected to be available
  // or a robust polyfill/library should be used if not.
  (globalThis as any).crypto = {
    randomUUID: () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  };
}