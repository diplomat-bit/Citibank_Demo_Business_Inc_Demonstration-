import React, { useState, useEffect, createContext, useContext, useCallback, useMemo, useRef } from 'react';

// --- Global Type Definitions (Expanded) ---

// UI Personalities
export type UIPersona =
  | 'ANALYTICAL_INTROVERT'
  | 'CREATIVE_EXTRAVERT'
  | 'DEFAULT'
  | 'DECISIVE_LEADER'
  | 'COLLABORATIVE_OPTIMIZER'
  | 'EXPLORATORY_LEARNER'
  | 'MINIMALIST_EFFICIENCY'
  | 'VISUAL_ARTIST';

// Layout Density
export type UILayoutDensity = 'DENSE' | 'SPARSE' | 'HYBRID' | 'COMPACT';

// Color Themes
export type UIColorTheme = 'MONOCHROME' | 'VIBRANT' | 'DARK_MODERN' | 'LIGHT_CLASSIC' | 'HIGH_CONTRAST';

// Font Preferences
export type UIFontPreference = 'SERIF' | 'SANS_SERIF' | 'MONOSPACE' | 'READABLE_DYSLEXIA';

// Interaction Speed Preference
export type UIInteractionSpeed = 'FAST' | 'MEDIUM' | 'SLOW';

// Navigational Style
export type UINavigationalStyle = 'TABBED' | 'SIDEBAR' | 'BREADCRUMBS' | 'COMMAND_PALETTE';

// Accessibility Preferences
export type UIAccessibilityPreference = {
  fontSizeScale: number; // e.g., 1.0, 1.2, 1.5
  contrastMode: 'DEFAULT' | 'HIGH_CONTRAST' | 'DARK_MODE_ONLY';
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
};

// Component Rendering Strategy
export type UIComponentStrategy = 'LAZY_LOAD' | 'PRE_RENDER' | 'ON_DEMAND';

// Core UI State Interface (Expanded)
export interface UIState {
  persona: UIPersona;
  layout: UILayoutDensity;
  colorTheme: UIColorTheme;
  fontPreference: UIFontPreference;
  interactionSpeed: UIInteractionSpeed;
  navigationalStyle: UINavigationalStyle;
  accessibility: UIAccessibilityPreference;
  componentSet: string[]; // e.g., ["DataGrid", "Chart"] vs ["MoodBoard", "Chat"]
  componentStrategy: UIComponentStrategy;
  lastUpdated: number; // Timestamp
  debugMode: boolean;
  manualOverrides: Partial<UIState>; // User-set overrides that take precedence
}

// User Profile Interface
export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  lastLogin: number;
  createdAt: number;
  uiPreferencesHistory: UIState[]; // History of applied UI states
  behavioralLogs: UserEvent[]; // Reference or subset of behavioral events
  featureFlags: { [key: string]: boolean };
  subscriptions: string[]; // e.g., ['premium', 'pro_analytics']
  accessLevels: string[]; // e.g., ['admin', 'viewer', 'editor']
  activeABTests: { [testId: string]: string }; // { 'test_layout_v2': 'variant_A' }
  manualOverrides: Partial<UIState>; // User-set overrides that take precedence
  adaptiveLearningEnabled: boolean;
}

// User Event Interface (for behavioral logging)
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
  | 'API_CALL';

export interface UserEvent {
  eventId: string;
  timestamp: number;
  eventType: UserEventType;
  userId: string;
  componentId?: string; // Which UI component was interacted with
  actionData?: Record<string, any>; // Additional data related to the event
  context?: Record<string, any>; // e.g., { path: '/dashboard', urlParams: { ... } }
  sessionId?: string;
  duration?: number; // For VIEW or SESSION_END events
}

// Feature Flag Definition
export interface FeatureFlag {
  flagId: string;
  name: string;
  description: string;
  defaultValue: boolean;
  isEnabled: boolean;
  variants?: { [variantName: string]: any }; // For A/B testing or configuration variants
  audience?: 'ALL' | 'ADMINS' | 'PAID_USERS' | string[]; // User groups
}

// Simulated API Response Structure
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: number;
}

// Simulated Webhook Payload
export interface WebhookPayload<T> {
  eventType: string;
  timestamp: number;
  data: T;
  source: string;
}

// --- Constants & Configuration ---

const DEFAULT_UI_STATE: UIState = {
  persona: 'DEFAULT',
  layout: 'SPARSE',
  colorTheme: 'VIBRANT',
  fontPreference: 'SANS_SERIF',
  interactionSpeed: 'MEDIUM',
  navigationalStyle: 'SIDEBAR',
  accessibility: {
    fontSizeScale: 1.0,
    contrastMode: 'DEFAULT',
    reducedMotion: false,
    screenReaderOptimized: false,
  },
  componentSet: ['DashboardOverview', 'QuickAccessToolbar'],
  componentStrategy: 'LAZY_LOAD',
  lastUpdated: Date.now(),
  debugMode: false,
  manualOverrides: {},
};

const DEFAULT_USER_PROFILE: UserProfile = {
  userId: 'anonymous_user',
  username: 'Guest User',
  email: '',
  lastLogin: Date.now(),
  createdAt: Date.now(),
  uiPreferencesHistory: [DEFAULT_UI_STATE],
  behavioralLogs: [],
  featureFlags: {},
  subscriptions: ['free_tier'],
  accessLevels: ['viewer'],
  activeABTests: {},
  manualOverrides: {},
  adaptiveLearningEnabled: true,
};

const SIMULATED_API_LATENCY_MS = 100; // Simulate network delay
const MAX_LOG_ENTRIES = 500; // Max entries for in-memory/local storage logs

// --- Utility Functions (Self-contained) ---

// Simple UUID generator
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): T {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return ((...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), delay);
  }) as T;
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
      lastResult = func(...args);
    }
    return lastResult;
  }) as T;
}

// Deep merge for objects
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target };
  if (target && typeof target === 'object' && source && typeof source === 'object') {
    Object.keys(source).forEach(key => {
      if (source[key] && typeof source[key] === 'object' && !(source[key] instanceof Array)) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge((target as any)[key], source[key] as T);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

// Persistence Layer (Simulated LocalStorage Database)
export class LocalStorageDB {
  private static instance: LocalStorageDB;
  private prefix: string = 'adptive_ui_db_';

  private constructor() {}

  public static getInstance(): LocalStorageDB {
    if (!LocalStorageDB.instance) {
      LocalStorageDB.instance = new LocalStorageDB();
    }
    return LocalStorageDB.instance;
  }

  private getKey(collection: string, id: string): string {
    return `${this.prefix}${collection}_${id}`;
  }

  private getCollectionKey(collection: string): string {
    return `${this.prefix}COLLECTION_${collection}`;
  }

  public async set<T>(collection: string, id: string, data: T): Promise<ApiResponse<T>> {
    return new Promise(resolve => {
      setTimeout(() => {
        try {
          const serializedData = JSON.stringify(data);
          localStorage.setItem(this.getKey(collection, id), serializedData);

          // Update collection index
          const collectionIndex = JSON.parse(localStorage.getItem(this.getCollectionKey(collection)) || '[]');
          if (!collectionIndex.includes(id)) {
            collectionIndex.push(id);
            localStorage.setItem(this.getCollectionKey(collection), JSON.stringify(collectionIndex));
          }

          resolve({ success: true, data, timestamp: Date.now() });
        } catch (e: any) {
          resolve({ success: false, error: { code: 'PERSISTENCE_ERROR', message: e.message }, timestamp: Date.now() });
        }
      }, SIMULATED_API_LATENCY_MS);
    });
  }

  public async get<T>(collection: string, id: string): Promise<ApiResponse<T>> {
    return new Promise(resolve => {
      setTimeout(() => {
        try {
          const serializedData = localStorage.getItem(this.getKey(collection, id));
          if (serializedData) {
            resolve({ success: true, data: JSON.parse(serializedData) as T, timestamp: Date.now() });
          } else {
            resolve({ success: false, error: { code: 'NOT_FOUND', message: `${collection} with id ${id} not found` }, timestamp: Date.now() });
          }
        } catch (e: any) {
          resolve({ success: false, error: { code: 'PERSISTENCE_ERROR', message: e.message }, timestamp: Date.now() });
        }
      }, SIMULATED_API_LATENCY_MS);
    });
  }

  public async getAll<T>(collection: string): Promise<ApiResponse<T[]>> {
    return new Promise(resolve => {
      setTimeout(() => {
        try {
          const collectionIndex: string[] = JSON.parse(localStorage.getItem(this.getCollectionKey(collection)) || '[]');
          const allData: T[] = [];
          for (const id of collectionIndex) {
            const item = localStorage.getItem(this.getKey(collection, id));
            if (item) {
              allData.push(JSON.parse(item));
            }
          }
          resolve({ success: true, data: allData, timestamp: Date.now() });
        } catch (e: any) {
          resolve({ success: false, error: { code: 'PERSISTENCE_ERROR', message: e.message }, timestamp: Date.now() });
        }
      }, SIMULATED_API_LATENCY_MS);
    });
  }

  public async delete(collection: string, id: string): Promise<ApiResponse<boolean>> {
    return new Promise(resolve => {
      setTimeout(() => {
        try {
          localStorage.removeItem(this.getKey(collection, id));

          // Remove from collection index
          let collectionIndex = JSON.parse(localStorage.getItem(this.getCollectionKey(collection)) || '[]');
          collectionIndex = collectionIndex.filter((itemId: string) => itemId !== id);
          localStorage.setItem(this.getCollectionKey(collection), JSON.stringify(collectionIndex));

          resolve({ success: true, data: true, timestamp: Date.now() });
        } catch (e: any) {
          resolve({ success: false, error: { code: 'PERSISTENCE_ERROR', message: e.message }, timestamp: Date.now() });
        }
      }, SIMULATED_API_LATENCY_MS);
    });
  }

  public async clearCollection(collection: string): Promise<ApiResponse<boolean>> {
    return new Promise(resolve => {
      setTimeout(() => {
        try {
          const collectionIndex: string[] = JSON.parse(localStorage.getItem(this.getCollectionKey(collection)) || '[]');
          for (const id of collectionIndex) {
            localStorage.removeItem(this.getKey(collection, id));
          }
          localStorage.removeItem(this.getCollectionKey(collection));
          resolve({ success: true, data: true, timestamp: Date.now() });
        } catch (e: any) {
          resolve({ success: false, error: { code: 'PERSISTENCE_ERROR', message: e.message }, timestamp: Date.now() });
        }
      }, SIMULATED_API_LATENCY_MS);
    });
  }
}
export const localStorageDB = LocalStorageDB.getInstance();


// --- Simulated Services (Internal to this file) ---

// 1. User Management Service
export class UserManagementService {
  private db: LocalStorageDB = localStorageDB;
  private usersCollection = 'users';

  public async getUserProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    const response = await this.db.get<UserProfile>(this.usersCollection, userId);
    if (!response.data && response.error?.code === 'NOT_FOUND') {
      // If user not found, create a default anonymous profile
      const defaultUser = { ...DEFAULT_USER_PROFILE, userId, username: `Guest_${userId.substring(0, 8)}` };
      const createResponse = await this.createUserProfile(defaultUser);
      return createResponse;
    }
    return response;
  }

  public async createUserProfile(profile: UserProfile): Promise<ApiResponse<UserProfile>> {
    profile.userId = profile.userId || generateUUID();
    profile.createdAt = Date.now();
    profile.lastLogin = Date.now();
    return this.db.set(this.usersCollection, profile.userId, profile);
  }

  public async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    const currentProfileRes = await this.getUserProfile(userId);
    if (!currentProfileRes.success || !currentProfileRes.data) {
      return { success: false, error: { code: 'USER_NOT_FOUND', message: `User ${userId} not found.` }, timestamp: Date.now() };
    }
    const updatedProfile = deepMerge(currentProfileRes.data, updates);
    return this.db.set(this.usersCollection, userId, updatedProfile);
  }

  public async deleteUserProfile(userId: string): Promise<ApiResponse<boolean>> {
    return this.db.delete(this.usersCollection, userId);
  }
}
export const userManagementService = new UserManagementService();


// 2. Event Logging Service
export class EventLoggingService {
  private db: LocalStorageDB = localStorageDB;
  private eventsCollection = 'events';

  public async logEvent(event: Omit<UserEvent, 'eventId' | 'timestamp'>): Promise<ApiResponse<UserEvent>> {
    const newEvent: UserEvent = {
      ...event,
      eventId: generateUUID(),
      timestamp: Date.now(),
    };
    const response = await this.db.set(this.eventsCollection, newEvent.eventId, newEvent);
    // Trim old events to prevent localStorage overflow
    this.trimEvents(newEvent.userId);
    return response;
  }

  public async getEventsForUser(userId: string, limit: number = 100): Promise<ApiResponse<UserEvent[]>> {
    const response = await this.db.getAll<UserEvent>(this.eventsCollection);
    if (response.success && response.data) {
      const userEvents = response.data
        .filter(event => event.userId === userId)
        .sort((a, b) => b.timestamp - a.timestamp) // Newest first
        .slice(0, limit);
      return { success: true, data: userEvents, timestamp: Date.now() };
    }
    return response;
  }

  public async getRecentGlobalEvents(limit: number = 100): Promise<ApiResponse<UserEvent[]>> {
    const response = await this.db.getAll<UserEvent>(this.eventsCollection);
    if (response.success && response.data) {
      const recentEvents = response.data
        .sort((a, b) => b.timestamp - a.timestamp) // Newest first
        .slice(0, limit);
      return { success: true, data: recentEvents, timestamp: Date.now() };
    }
    return response;
  }

  private async trimEvents(userId: string) {
    const response = await this.getEventsForUser(userId, MAX_LOG_ENTRIES + 10); // Fetch a few more than max
    if (response.success && response.data && response.data.length > MAX_LOG_ENTRIES) {
      const eventsToRemove = response.data.slice(MAX_LOG_ENTRIES);
      for (const event of eventsToRemove) {
        await this.db.delete(this.eventsCollection, event.eventId);
      }
    }
  }
}
export const eventLoggingService = new EventLoggingService();


// 3. UI Adaptation & Prediction Service
export class UIPredictionService {
  private userSvc: UserManagementService = userManagementService;
  private eventSvc: EventLoggingService = eventLoggingService;

  private personaRules: { [key in UIPersona]: (userProfile: UserProfile, events: UserEvent[]) => number } = {
    ANALYTICAL_INTROVERT: (profile, events) => {
      let score = 0;
      const recentInputs = events.filter(e => e.eventType === 'INPUT' || e.eventType === 'SEARCH').length;
      const recentErrors = events.filter(e => e.eventType === 'ERROR').length;
      const clicksPerView = events.filter(e => e.eventType === 'CLICK').length / (events.filter(e => e.eventType === 'VIEW').length || 1);
      if (recentInputs > 20 && recentErrors < 5) score += 0.3; // Prefers data entry, less errors means focused
      if (clicksPerView < 0.5) score += 0.4; // Less exploratory clicks, more direct
      if (profile.accessLevels.includes('admin') || profile.accessLevels.includes('editor')) score += 0.2; // Power user
      return score;
    },
    CREATIVE_EXTRAVERT: (profile, events) => {
      let score = 0;
      const recentClicks = events.filter(e => e.eventType === 'CLICK').length;
      const recentNavigations = events.filter(e => e.eventType === 'NAVIGATE').length;
      if (recentClicks > 50 && recentNavigations > 10) score += 0.4; // High interaction, exploring
      if (profile.subscriptions.includes('premium')) score += 0.2; // Willing to pay for features
      return score;
    },
    DECISIVE_LEADER: (profile, events) => {
      let score = 0;
      const sessionStarts = events.filter(e => e.eventType === 'SESSION_START').length;
      const avgSessionDuration = events.filter(e => e.eventType === 'SESSION_END' && e.duration).reduce((sum, e) => sum + (e.duration || 0), 0) / (sessionStarts || 1);
      if (avgSessionDuration < 120000 && sessionStarts > 5) score += 0.5; // Short, focused sessions
      return score;
    },
    COLLABORATIVE_OPTIMIZER: (profile, events) => {
      let score = 0;
      const chatInteractions = events.filter(e => e.componentId === 'Chat' || e.componentId === 'Comments').length;
      if (chatInteractions > 10) score += 0.6; // Heavy collaboration
      return score;
    },
    EXPLORATORY_LEARNER: (profile, events) => {
      let score = 0;
      const viewEvents = events.filter(e => e.eventType === 'VIEW').length;
      const uniqueComponentsViewed = new Set(events.filter(e => e.eventType === 'VIEW' && e.componentId).map(e => e.componentId)).size;
      if (viewEvents > 100 && uniqueComponentsViewed > 15) score += 0.7; // Exploring many components
      return score;
    },
    MINIMALIST_EFFICIENCY: (profile, events) => {
      let score = 0;
      const inputToViewRatio = events.filter(e => e.eventType === 'INPUT').length / (events.filter(e => e.eventType === 'VIEW').length || 1);
      if (inputToViewRatio > 0.8) score += 0.6; // High input, low browsing
      return score;
    },
    VISUAL_ARTIST: (profile, events) => {
      let score = 0;
      const imageGalleryViews = events.filter(e => e.componentId === 'ImageGallery' || e.componentId === 'MoodBoard').length;
      if (imageGalleryViews > 5) score += 0.7; // Prefers visual content
      return score;
    },
    DEFAULT: (profile, events) => {
      return 0.1; // Baseline
    },
  };

  private uiStateMappings: { [key in UIPersona]: Partial<UIState> } = {
    ANALYTICAL_INTROVERT: {
      layout: 'DENSE',
      colorTheme: 'MONOCHROME',
      fontPreference: 'MONOSPACE',
      interactionSpeed: 'FAST',
      navigationalStyle: 'COMMAND_PALETTE',
      accessibility: { ...DEFAULT_UI_STATE.accessibility, fontSizeScale: 0.9 },
      componentSet: ['DataGrid', 'Chart', 'MetricsDashboard', 'CodeEditor', 'ExportButton', 'AuditLog'],
      componentStrategy: 'PRE_RENDER',
    },
    CREATIVE_EXTRAVERT: {
      layout: 'SPARSE',
      colorTheme: 'VIBRANT',
      fontPreference: 'SANS_SERIF',
      interactionSpeed: 'MEDIUM',
      navigationalStyle: 'SIDEBAR',
      accessibility: { ...DEFAULT_UI_STATE.accessibility, reducedMotion: false },
      componentSet: ['MoodBoard', 'ImageGallery', 'Chat', 'KanbanBoard', 'IdeaGenerator', 'TeamActivityFeed'],
      componentStrategy: 'ON_DEMAND',
    },
    DECISIVE_LEADER: {
      layout: 'COMPACT',
      colorTheme: 'DARK_MODERN',
      fontPreference: 'SANS_SERIF',
      interactionSpeed: 'FAST',
      navigationalStyle: 'TABBED',
      componentSet: ['ExecutiveDashboard', 'KPIOverview', 'ActionItems', 'ApprovalQueue', 'QuickReports'],
      componentStrategy: 'PRE_RENDER',
    },
    COLLABORATIVE_OPTIMIZER: {
      layout: 'HYBRID',
      colorTheme: 'LIGHT_CLASSIC',
      fontPreference: 'SANS_SERIF',
      interactionSpeed: 'MEDIUM',
      navigationalStyle: 'SIDEBAR',
      componentSet: ['TeamCalendar', 'ProjectStatus', 'DocumentCoEditing', 'Comments', 'Chat'],
      componentStrategy: 'LAZY_LOAD',
    },
    EXPLORATORY_LEARNER: {
      layout: 'SPARSE',
      colorTheme: 'VIBRANT',
      fontPreference: 'SANS_SERIF',
      interactionSpeed: 'SLOW',
      navigationalStyle: 'BREADCRUMBS',
      componentSet: ['Tutorials', 'KnowledgeBase', 'SandboxEnvironment', 'FeatureTour', 'GuidedWalkthrough'],
      componentStrategy: 'LAZY_LOAD',
    },
    MINIMALIST_EFFICIENCY: {
      layout: 'COMPACT',
      colorTheme: 'MONOCHROME',
      fontPreference: 'MONOSPACE',
      interactionSpeed: 'FAST',
      navigationalStyle: 'COMMAND_PALETTE',
      accessibility: { ...DEFAULT_UI_STATE.accessibility, fontSizeScale: 0.9 },
      componentSet: ['TerminalEmulator', 'HotkeysList', 'FocusModeToggle', 'TaskRunner', 'ScriptEditor'],
      componentStrategy: 'PRE_RENDER',
    },
    VISUAL_ARTIST: {
      layout: 'SPARSE',
      colorTheme: 'DARK_MODERN',
      fontPreference: 'SERIF',
      interactionSpeed: 'MEDIUM',
      navigationalStyle: 'SIDEBAR',
      componentSet: ['ImageEditor', 'VideoPlayer', 'AssetLibrary', 'MoodBoard', 'ColorPalettePicker'],
      componentStrategy: 'ON_DEMAND',
    },
    DEFAULT: DEFAULT_UI_STATE,
  };

  public async inferPersona(userId: string): Promise<ApiResponse<UIPersona>> {
    const userProfileRes = await this.userSvc.getUserProfile(userId);
    if (!userProfileRes.success || !userProfileRes.data) {
      return { success: false, error: { code: 'USER_NOT_FOUND', message: 'User profile not found for persona inference.' }, timestamp: Date.now() };
    }
    const userProfile = userProfileRes.data;

    const eventsRes = await this.eventSvc.getEventsForUser(userId, 200); // Analyze recent 200 events
    const events = eventsRes.success && eventsRes.data ? eventsRes.data : [];

    let highestScore: number = -1;
    let inferredPersona: UIPersona = 'DEFAULT';

    for (const persona in this.personaRules) {
      const typedPersona = persona as UIPersona;
      const score = this.personaRules[typedPersona](userProfile, events);
      if (score > highestScore) {
        highestScore = score;
        inferredPersona = typedPersona;
      }
    }
    return { success: true, data: inferredPersona, timestamp: Date.now() };
  }

  public async predictUIState(userId: string): Promise<ApiResponse<UIState>> {
    const userProfileRes = await this.userSvc.getUserProfile(userId);
    if (!userProfileRes.success || !userProfileRes.data) {
      return { success: false, error: { code: 'USER_NOT_FOUND', message: 'User profile not found for UI prediction.' }, timestamp: Date.now() };
    }
    const userProfile = userProfileRes.data;

    if (!userProfile.adaptiveLearningEnabled) {
      // If adaptive learning is disabled, return the last saved or default state, merged with manual overrides
      const baseState = userProfile.uiPreferencesHistory.length > 0 ? userProfile.uiPreferencesHistory[userProfile.uiPreferencesHistory.length - 1] : DEFAULT_UI_STATE;
      const finalState = deepMerge(baseState, userProfile.manualOverrides);
      return { success: true, data: { ...finalState, lastUpdated: Date.now() }, timestamp: Date.now() };
    }

    const personaRes = await this.inferPersona(userId);
    if (!personaRes.success || !personaRes.data) {
      // Fallback to default if persona inference fails
      const finalState = deepMerge(DEFAULT_UI_STATE, userProfile.manualOverrides);
      return { success: true, data: { ...finalState, lastUpdated: Date.now() }, timestamp: Date.now() };
    }
    const inferredPersona = personaRes.data;

    let predictedState = deepMerge(DEFAULT_UI_STATE, this.uiStateMappings[inferredPersona]);

    // Apply feature flags
    for (const comp of predictedState.componentSet) {
      // Assuming feature flag IDs are like 'disable_ComponentName' or 'enable_ComponentName'
      const featureEnabledRes = await featureFlagService.isFeatureEnabled(userId, comp.toUpperCase().replace(/\s/g, '_')); // Check for specific component feature flags
      if (featureEnabledRes.success && !featureEnabledRes.data) {
         predictedState.componentSet = predictedState.componentSet.filter(c => c !== comp);
      }
    }

    // Apply manual overrides (highest precedence)
    predictedState = deepMerge(predictedState, userProfile.manualOverrides);
    predictedState.persona = inferredPersona; // Ensure persona is set correctly
    predictedState.lastUpdated = Date.now();
    predictedState.manualOverrides = userProfile.manualOverrides; // Keep track of overrides in UI state itself

    // Log the predicted state to user history
    await this.userSvc.updateUserProfile(userId, {
      uiPreferencesHistory: [...userProfile.uiPreferencesHistory.slice(-10), predictedState], // Keep last 10 states
    });

    return { success: true, data: predictedState, timestamp: Date.now() };
  }

  public async recordUserFeedback(userId: string, feedback: Partial<UIState>): Promise<ApiResponse<UserProfile>> {
    const userProfileRes = await this.userSvc.getUserProfile(userId);
    if (!userProfileRes.success || !userProfileRes.data) {
      return { success: false, error: { code: 'USER_NOT_FOUND', message: 'User profile not found for feedback.' }, timestamp: Date.now() };
    }
    const userProfile = userProfileRes.data;

    // Merge feedback into manual overrides, giving user explicit control
    const updatedOverrides = deepMerge(userProfile.manualOverrides, feedback);
    return this.userSvc.updateUserProfile(userId, { manualOverrides: updatedOverrides });
  }
}
export const uiPredictionService = new UIPredictionService();


// 4. Feature Flag Service
export class FeatureFlagService {
  private db: LocalStorageDB = localStorageDB;
  private flagsCollection = 'feature_flags';
  private defaultFlags: FeatureFlag[] = [
    { flagId: 'DATA_GRID_V2', name: 'Data Grid V2', description: 'Enables the new Data Grid component with advanced filtering.', defaultValue: false, isEnabled: true, audience: ['PAID_USERS'] },
    { flagId: 'THEME_SWITCHER', name: 'Theme Switcher', description: 'Allows users to manually switch themes.', defaultValue: true, isEnabled: true, audience: 'ALL' },
    { flagId: 'AI_ASSISTANT_PROMPT', name: 'AI Assistant Prompt', description: 'Enables AI-powered contextual assistance.', defaultValue: false, isEnabled: false, audience: ['ADMINS'] },
    { flagId: 'REALTIME_COLLABORATION', name: 'Realtime Collaboration', description: 'Activates real-time document editing and comments.', defaultValue: true, isEnabled: true, audience: 'ALL' },
    { flagId: 'QUICKACCESS_TOOLBAR', name: 'Quick Access Toolbar', description: 'Quick access buttons.', defaultValue: true, isEnabled: true, audience: 'ALL' },
    { flagId: 'DASHBOARD_OVERVIEW', name: 'Dashboard Overview', description: 'Default dashboard summary.', defaultValue: true, isEnabled: true, audience: 'ALL' },
    { flagId: 'KPI_OVERVIEW', name: 'KPI Overview', description: 'Key performance indicators.', defaultValue: true, isEnabled: true, audience: ['DECISIVE_LEADER', 'PAID_USERS'] },
    { flagId: 'EXECUTIVE_DASHBOARD', name: 'Executive Dashboard', description: 'High-level executive summary.', defaultValue: false, isEnabled: true, audience: ['ADMINS'] },
  ];

  constructor() {
    this.initializeFlags();
  }

  private async initializeFlags() {
    for (const flag of this.defaultFlags) {
      const existing = await this.db.get<FeatureFlag>(this.flagsCollection, flag.flagId);
      if (!existing.success) {
        await this.db.set(this.flagsCollection, flag.flagId, flag);
      }
    }
  }

  public async getFeatureFlag(flagId: string): Promise<ApiResponse<FeatureFlag>> {
    return this.db.get(this.flagsCollection, flagId);
  }

  public async getAllFeatureFlags(): Promise<ApiResponse<FeatureFlag[]>> {
    return this.db.getAll(this.flagsCollection);
  }

  public async updateFeatureFlag(flagId: string, updates: Partial<FeatureFlag>): Promise<ApiResponse<FeatureFlag>> {
    const currentFlagRes = await this.getFeatureFlag(flagId);
    if (!currentFlagRes.success || !currentFlagRes.data) {
      return { success: false, error: { code: 'FLAG_NOT_FOUND', message: `Feature flag ${flagId} not found.` }, timestamp: Date.now() };
    }
    const updatedFlag = deepMerge(currentFlagRes.data, updates);
    return this.db.set(this.flagsCollection, flagId, updatedFlag);
  }

  public async isFeatureEnabled(userId: string, flagId: string): Promise<ApiResponse<boolean>> {
    const flagRes = await this.getFeatureFlag(flagId);
    if (!flagRes.success || !flagRes.data) {
      // If flag not found, assume disabled or default to true based on product strategy
      return { success: true, data: false, timestamp: Date.now() };
    }
    const flag = flagRes.data;

    if (!flag.isEnabled) return { success: true, data: false, timestamp: Date.now() };

    // Check audience
    if (flag.audience === 'ALL') return { success: true, data: true, timestamp: Date.now() };

    const userProfileRes = await userManagementService.getUserProfile(userId);
    if (!userProfileRes.success || !userProfileRes.data) {
      return { success: true, data: false, timestamp: Date.now(), error: { code: 'USER_PROFILE_MISSING', message: 'Cannot verify audience without user profile' } };
    }
    const userProfile = userProfileRes.data;

    if (Array.isArray(flag.audience)) {
      if (flag.audience.some(audienceType => {
        if (audienceType === 'ADMINS' && userProfile.accessLevels.includes('admin')) return true;
        if (audienceType === 'PAID_USERS' && userProfile.subscriptions.includes('premium')) return true;
        // More specific audience checks can go here, e.g., by userId or teamId
        return false;
      })) {
        return { success: true, data: true, timestamp: Date.now() };
      }
    }

    return { success: true, data: false, timestamp: Date.now() };
  }
}
export const featureFlagService = new FeatureFlagService();


// 5. Simulated API Gateway
export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type ApiRouteHandler = (req: { userId: string, params: Record<string, any>, body: Record<string, any> }) => Promise<ApiResponse<any>>;

export class SimulatedAPIGateway {
  private routes: Map<string, Map<ApiMethod, ApiRouteHandler>> = new Map();

  constructor() {
    this.registerInternalRoutes();
  }

  private registerInternalRoutes() {
    // User Routes
    this.registerRoute('GET', '/api/users/:userId', async (req) => userManagementService.getUserProfile(req.params.userId));
    this.registerRoute('POST', '/api/users', async (req) => userManagementService.createUserProfile(req.body as UserProfile));
    this.registerRoute('PUT', '/api/users/:userId', async (req) => userManagementService.updateUserProfile(req.params.userId, req.body));
    this.registerRoute('DELETE', '/api/users/:userId', async (req) => userManagementService.deleteUserProfile(req.params.userId));

    // Event Routes
    this.registerRoute('POST', '/api/events', async (req) => eventLoggingService.logEvent(req.body as Omit<UserEvent, 'eventId' | 'timestamp'>));
    this.registerRoute('GET', '/api/events/:userId', async (req) => eventLoggingService.getEventsForUser(req.params.userId, req.params.limit || 100));
    this.registerRoute('GET', '/api/events/global', async (req) => eventLoggingService.getRecentGlobalEvents(req.params.limit || 100));

    // UI Prediction Routes
    this.registerRoute('GET', '/api/ui/predict/:userId', async (req) => uiPredictionService.predictUIState(req.params.userId));
    this.registerRoute('GET', '/api/ui/persona/:userId', async (req) => uiPredictionService.inferPersona(req.params.userId));
    this.registerRoute('POST', '/api/ui/feedback/:userId', async (req) => uiPredictionService.recordUserFeedback(req.params.userId, req.body));

    // Feature Flag Routes
    this.registerRoute('GET', '/api/feature-flags', async (req) => featureFlagService.getAllFeatureFlags());
    this.registerRoute('GET', '/api/feature-flags/:flagId', async (req) => featureFlagService.getFeatureFlag(req.params.flagId));
    this.registerRoute('PUT', '/api/feature-flags/:flagId', async (req) => featureFlagService.updateFeatureFlag(req.params.flagId, req.body));
    this.registerRoute('GET', '/api/feature-flags/:flagId/enabled/:userId', async (req) => featureFlagService.isFeatureEnabled(req.params.userId, req.params.flagId));

    // Health Check Route
    this.registerRoute('GET', '/api/health', async () => ({ success: true, data: { status: 'OK', version: '1.0.0', uptime: Date.now() - startTime }, timestamp: Date.now() }));
  }

  public registerRoute(method: ApiMethod, path: string, handler: ApiRouteHandler) {
    if (!this.routes.has(path)) {
      this.routes.set(path, new Map());
    }
    this.routes.get(path)?.set(method, handler);
    // console.log(`Registered API route: ${method} ${path}`);
  }

  public async call<T>(
    method: ApiMethod,
    path: string,
    payload: Record<string, any> = {},
    authenticatedUserId: string = 'system_user'
  ): Promise<ApiResponse<T>> {
    const routeSegments = path.split('/').filter(Boolean);
    let matchedHandler: ApiRouteHandler | undefined;
    let pathParams: Record<string, any> = {};

    for (const [registeredPath, methodMap] of this.routes.entries()) {
      const registeredSegments = registeredPath.split('/').filter(Boolean);

      if (routeSegments.length !== registeredSegments.length) continue;

      let match = true;
      let currentParams: Record<string, any> = {};

      for (let i = 0; i < registeredSegments.length; i++) {
        if (registeredSegments[i].startsWith(':')) {
          currentParams[registeredSegments[i].substring(1)] = routeSegments[i];
        } else if (registeredSegments[i] !== routeSegments[i]) {
          match = false;
          break;
        }
      }

      if (match) {
        matchedHandler = methodMap.get(method);
        pathParams = currentParams;
        break;
      }
    }

    if (!matchedHandler) {
      return { success: false, error: { code: 'NOT_FOUND', message: `API route ${method} ${path} not found.` }, timestamp: Date.now() };
    }

    try {
      const request = { userId: authenticatedUserId, params: pathParams, body: payload };
      const response = await matchedHandler(request);
      return response as ApiResponse<T>;
    } catch (e: any) {
      return { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: e.message || 'An unexpected error occurred.' }, timestamp: Date.now() };
    }
  }
}
export const simulatedAPIGateway = new SimulatedAPIGateway();


// 6. Simulated Webhook System
type WebhookSubscriber = (payload: WebhookPayload<any>) => void | Promise<void>;

export class SimulatedWebhookSystem {
  private subscribers: Map<string, WebhookSubscriber[]> = new Map();

  public subscribe(eventType: string, callback: WebhookSubscriber) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType)?.push(callback);
    // console.log(`Subscribed to webhook: ${eventType}`);
  }

  public unsubscribe(eventType: string, callback: WebhookSubscriber) {
    const callbacks = this.subscribers.get(eventType);
    if (callbacks) {
      this.subscribers.set(eventType, callbacks.filter(cb => cb !== callback));
    }
  }

  public async publish<T>(eventType: string, data: T, source: string = 'internal_system') {
    const payload: WebhookPayload<T> = {
      eventType,
      timestamp: Date.now(),
      data,
      source,
    };
    const callbacks = this.subscribers.get(eventType);
    if (callbacks) {
      for (const callback of callbacks) {
        try {
          await callback(payload);
          // console.log(`Webhook published to ${eventType}, callback executed.`);
        } catch (e) {
          console.error(`Error executing webhook callback for ${eventType}:`, e);
        }
      }
    }
  }
}
export const simulatedWebhookSystem = new SimulatedWebhookSystem();

// Register internal webhooks
simulatedWebhookSystem.subscribe('USER_PROFILE_UPDATED', async (payload) => {
  // console.log('Webhook: User Profile Updated', payload.data);
  // Example: Trigger re-prediction of UI state for this user
  if (payload.data && (payload.data as UserProfile).userId) {
    // A small delay to avoid re-computing immediately after every minor profile update
    // This allows related updates (e.g., multiple form fields) to complete
    setTimeout(async () => {
      await uiPredictionService.predictUIState((payload.data as UserProfile).userId);
    }, 500);
  }
});

simulatedWebhookSystem.subscribe('USER_EVENT_LOGGED', async (payload) => {
  // console.log('Webhook: User Event Logged', payload.data);
  // Example: Could trigger a real-time analytics update or anomaly detection
});


// 7. Component Registry & Renderer (Internal to this file)
interface RenderableComponentProps {
  // Generic props that any dynamically rendered component might need
  userId: string;
  uiState: UIState;
  onEvent: (event: Omit<UserEvent, 'eventId' | 'timestamp' | 'userId'>) => void;
  // ... any other global context
}

export interface ComponentDefinition {
  name: string;
  description: string;
  render: React.FC<RenderableComponentProps>;
  defaultProps?: Record<string, any>;
  supportedPersonas: UIPersona[] | 'ALL';
  priority: number; // For layout engine, higher means more prominent
}

// Simulated dynamic components (implemented as simple React FCs within this file)
const DataGridComponent: React.FC<RenderableComponentProps> = ({ userId, onEvent }) => {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setData([{ id: 1, name: 'Item A', value: 100 }, { id: 2, name: 'Item B', value: 200 }, { id: 3, name: 'Item C', value: 350 }]);
      onEvent({ eventType: 'VIEW', componentId: 'DataGrid', actionData: { rowCount: 3 } });
    }, 50);
  }, [userId, onEvent]);
  return (
    <div className="p-3 bg-gray-600 rounded-md text-sm">
      <h4 className="font-semibold mb-2">DataGrid for {userId}</h4>
      <table className="min-w-full divide-y divide-gray-500">
        <thead><tr><th className="px-2 py-1 text-left">ID</th><th className="px-2 py-1 text-left">Name</th><th className="px-2 py-1 text-left">Value</th></tr></thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id}>
              <td className="px-2 py-1">{row.id}</td>
              <td className="px-2 py-1">{row.name}</td>
              <td className="px-2 py-1">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="mt-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-xs" onClick={() => onEvent({ eventType: 'CLICK', componentId: 'DataGrid', actionData: { action: 'refresh' } })}>Refresh</button>
    </div>
  );
};

const ChartComponent: React.FC<RenderableComponentProps> = ({ userId, onEvent }) => {
  useEffect(() => {
    onEvent({ eventType: 'VIEW', componentId: 'Chart', actionData: { chartType: 'bar' } });
  }, [userId, onEvent]);
  return (
    <div className="p-3 bg-gray-600 rounded-md">
      <h4 className="font-semibold mb-2">Chart for {userId}</h4>
      <div className="w-full h-24 bg-blue-400 flex items-end rounded overflow-hidden">
        <div className="h-2/3 w-1/4 bg-blue-500 m-1"></div>
        <div className="h-1/2 w-1/4 bg-blue-500 m-1"></div>
        <div className="h-5/6 w-1/4 bg-blue-500 m-1"></div>
        <div className="h-3/4 w-1/4 bg-blue-500 m-1"></div>
      </div>
      <p className="text-xs text-gray-300 mt-2">Simulated Bar Chart</p>
    </div>
  );
};

const ChatComponent: React.FC<RenderableComponentProps> = ({ userId, onEvent }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, `You: ${input}`]);
      onEvent({ eventType: 'INPUT', componentId: 'Chat', actionData: { message: input, type: 'send' } });
      setInput('');
      // Simulate response
      setTimeout(() => {
        setMessages(prev => [...prev, `AI: Received "${input}"`]);
      }, 500);
    }
  };
  useEffect(() => {
    onEvent({ eventType: 'VIEW', componentId: 'Chat' });
  }, [userId, onEvent]);
  return (
    <div className="p-3 bg-gray-600 rounded-md flex flex-col h-48">
      <h4 className="font-semibold mb-2">Chat with {userId}</h4>
      <div className="flex-grow overflow-y-auto mb-2 text-sm space-y-1">
        {messages.map((msg, i) => <p key={i} className="break-words">{msg}</p>)}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-grow p-1 bg-gray-700 text-white rounded-l text-sm"
          placeholder="Type a message..."
        />
        <button onClick={handleSend} className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded-r text-sm">Send</button>
      </div>
    </div>
  );
};

const MoodBoardComponent: React.FC<RenderableComponentProps> = ({ userId, onEvent }) => {
  useEffect(() => {
    onEvent({ eventType: 'VIEW', componentId: 'MoodBoard' });
  }, [userId, onEvent]);
  return (
    <div className="p-3 bg-gray-600 rounded-md">
      <h4 className="font-semibold mb-2">MoodBoard for {userId}</h4>
      <div className="grid grid-cols-2 gap-2">
        <div className="h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded"></div>
        <div className="h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded"></div>
        <div className="h-16 bg-gradient-to-br from-green-400 to-blue-400 rounded"></div>
        <div className="h-16 bg-gradient-to-br from-red-500 to-gray-500 rounded"></div>
      </div>
      <p className="text-xs text-gray-300 mt-2">Expressive color palette</p>
    </div>
  );
};

const ExportButtonComponent: React.FC<RenderableComponentProps> = ({ userId, onEvent }) => {
  const handleExport = () => {
    alert('Simulating data export...');
    onEvent({ eventType: 'CLICK', componentId: 'ExportButton', actionData: { format: 'CSV' } });
  };
  useEffect(() => {
    onEvent({ eventType: 'VIEW', componentId: 'ExportButton' });
  }, [userId, onEvent]);
  return (
    <button onClick={handleExport} className="p-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md text-sm">
      Export Data
    </button>
  );
};

const KPIOverviewComponent: React.FC<RenderableComponentProps> = ({ userId, onEvent }) => {
  useEffect(() => {
    onEvent({ eventType: 'VIEW', componentId: 'KPIOverview' });
  }, [userId, onEvent]);
  return (
    <div className="p-3 bg-gray-600 rounded-md">
      <h4 className="font-semibold mb-2">KPI Overview for {userId}</h4>
      <div className="grid grid-cols-2 gap-2 text-center text-sm">
        <div className="bg-gray-700 p-2 rounded">Sales: <span className="font-bold text-green-400">$1.2M</span></div>
        <div className="bg-gray-700 p-2 rounded">Growth: <span className="font-bold text-green-400">+15%</span></div>
        <div className="bg-gray-700 p-2 rounded">Users: <span className="font-bold text-yellow-400">12K</span></div>
        <div className="bg-gray-700 p-2 rounded">Churn: <span className="font-bold text-red-400">2%</span></div>
      </div>
      <p className="text-xs text-gray-300 mt-2">Key Performance Indicators</p>
    </div>
  );
};

const ExecutiveDashboardComponent: React.FC<RenderableComponentProps> = ({ userId, onEvent }) => {
  useEffect(() => {
    onEvent({ eventType: 'VIEW', componentId: 'ExecutiveDashboard' });
  }, [userId, onEvent]);
  return (
    <div className="p-3 bg-gray-600 rounded-md">
      <h4 className="font-semibold mb-2">Executive Dashboard for {userId}</h4>
      <p className="text-sm">Summary of critical business metrics.</p>
      <div className="flex justify-between mt-2 text-xs">
        <span>Revenue: <span className="text-green-400 font-bold">$5.5M</span></span>
        <span>Profit: <span className="text-green-400 font-bold">$1.8M</span></span>
      </div>
      <button className="mt-3 px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-xs" onClick={() => onEvent({ eventType: 'CLICK', componentId: 'ExecutiveDashboard', actionData: { action: 'drilldown' } })}>View Detail</button>
    </div>
  );
};

const QuickAccessToolbarComponent: React.FC<RenderableComponentProps> = ({ userId, onEvent }) => {
  const handleClick = (action: string) => {
    alert(`Quick action: ${action}`);
    onEvent({ eventType: 'CLICK', componentId: 'QuickAccessToolbar', actionData: { action } });
  };
  useEffect(() => {
    onEvent({ eventType: 'VIEW', componentId: 'QuickAccessToolbar' });
  }, [userId, onEvent]);
  return (
    <div className="p-3 bg-gray-600 rounded-md flex gap-2">
      <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm" onClick={() => handleClick('New Task')}>New Task</button>
      <button className="px-3 py-1 bg-purple-500 hover:bg-purple-600 rounded text-sm" onClick={() => handleClick('Quick Search')}>Search</button>
      <button className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 rounded text-sm" onClick={() => handleClick('Settings')}>Settings</button>
    </div>
  );
};

const DashboardOverviewComponent: React.FC<RenderableComponentProps> = ({ userId, onEvent }) => {
  useEffect(() => {
    onEvent({ eventType: 'VIEW', componentId: 'DashboardOverview' });
  }, [userId, onEvent]);
  return (
    <div className="p-3 bg-gray-600 rounded-md">
      <h4 className="font-semibold mb-2">Dashboard Overview for {userId}</h4>
      <p className="text-sm">Welcome to your personalized dashboard! Here's a summary of your activities.</p>
      <ul className="list-disc list-inside mt-2 text-xs">
        <li>5 new notifications</li>
        <li>3 pending tasks</li>
        <li>Last login: {new Date(Date.now() - 3600000).toLocaleString()}</li>
      </ul>
      <button className="mt-3 px-3 py-1 bg-teal-500 hover:bg-teal-600 rounded text-xs" onClick={() => onEvent({ eventType: 'CLICK', componentId: 'DashboardOverview', actionData: { action: 'view_details' } })}>View Details</button>
    </div>
  );
};


export const componentRegistry: { [key: string]: ComponentDefinition } = {
  DataGrid: {
    name: 'DataGrid',
    description: 'Displays tabular data.',
    render: DataGridComponent,
    supportedPersonas: ['ANALYTICAL_INTROVERT', 'DECISIVE_LEADER', 'MINIMALIST_EFFICIENCY'],
    priority: 80,
  },
  Chart: {
    name: 'Chart',
    description: 'Visualizes data trends.',
    render: ChartComponent,
    supportedPersonas: ['ANALYTICAL_INTROVERT', 'CREATIVE_EXTRAVERT', 'DECISIVE_LEADER', 'EXPLORATORY_LEARNER', 'VISUAL_ARTIST'],
    priority: 75,
  },
  Chat: {
    name: 'Chat',
    description: 'Real-time communication panel.',
    render: ChatComponent,
    supportedPersonas: ['CREATIVE_EXTRAVERT', 'COLLABORATIVE_OPTIMIZER'],
    priority: 90,
  },
  MoodBoard: {
    name: 'MoodBoard',
    description: 'Visual space for creative inspiration.',
    render: MoodBoardComponent,
    supportedPersonas: ['CREATIVE_EXTRAVERT', 'VISUAL_ARTIST'],
    priority: 60,
  },
  ExportButton: {
    name: 'ExportButton',
    description: 'Exports current view data.',
    render: ExportButtonComponent,
    supportedPersonas: ['ANALYTICAL_INTROVERT', 'DECISIVE_LEADER', 'MINIMALIST_EFFICIENCY'],
    priority: 70,
  },
  KPIOverview: {
    name: 'KPIOverview',
    description: 'Key Performance Indicators at a glance.',
    render: KPIOverviewComponent,
    supportedPersonas: ['DECISIVE_LEADER', 'ANALYTICAL_INTROVERT'],
    priority: 85,
  },
  ExecutiveDashboard: {
    name: 'ExecutiveDashboard',
    description: 'High-level business overview for leadership.',
    render: ExecutiveDashboardComponent,
    supportedPersonas: ['DECISIVE_LEADER'],
    priority: 95,
  },
  QuickAccessToolbar: {
    name: 'QuickAccessToolbar',
    description: 'Provides quick access to common actions.',
    render: QuickAccessToolbarComponent,
    supportedPersonas: 'ALL',
    priority: 65,
  },
  DashboardOverview: {
    name: 'DashboardOverview',
    description: 'Personalized summary of user activity and key information.',
    render: DashboardOverviewComponent,
    supportedPersonas: 'ALL',
    priority: 88,
  }
};


// 8. Theming Engine (Internal to this file)
export const uiThemeDefinitions: { [key in UIColorTheme]: {
  name: string;
  className: string; // Tailwind CSS classes
  primary: string;
  secondary: string;
  text: string;
  background: string;
  border: string;
} } = {
  MONOCHROME: {
    name: 'Monochrome',
    className: 'bg-gray-900 text-gray-100',
    primary: 'bg-gray-700',
    secondary: 'bg-gray-800',
    text: 'text-gray-100',
    background: 'bg-gray-900',
    border: 'border-gray-700',
  },
  VIBRANT: {
    name: 'Vibrant',
    className: 'bg-blue-900 text-white',
    primary: 'bg-blue-700',
    secondary: 'bg-blue-800',
    text: 'text-white',
    background: 'bg-blue-900',
    border: 'border-blue-700',
  },
  DARK_MODERN: {
    name: 'Dark Modern',
    className: 'bg-zinc-900 text-zinc-100',
    primary: 'bg-zinc-700',
    secondary: 'bg-zinc-800',
    text: 'text-zinc-100',
    background: 'bg-zinc-900',
    border: 'border-zinc-700',
  },
  LIGHT_CLASSIC: {
    name: 'Light Classic',
    className: 'bg-gray-100 text-gray-900',
    primary: 'bg-gray-200',
    secondary: 'bg-gray-300',
    text: 'text-gray-900',
    background: 'bg-gray-100',
    border: 'border-gray-300',
  },
  HIGH_CONTRAST: {
    name: 'High Contrast',
    className: 'bg-black text-white',
    primary: 'bg-yellow-400 text-black',
    secondary: 'bg-yellow-200 text-black',
    text: 'text-white',
    background: 'bg-black',
    border: 'border-white',
  },
};

export const applyThemeClasses = (theme: UIColorTheme, baseClasses: string = ''): string => {
  const themeDef = uiThemeDefinitions[theme];
  return `${baseClasses} ${themeDef.className}`;
};


// --- React Context for UI State and Services ---
interface AdaptiveUIContextType {
  currentUserId: string;
  setCurrentUserId: (id: string) => void;
  uiState: UIState;
  setUiState: (state: UIState) => void; // Direct state setter, primarily for dev/admin
  userProfile: UserProfile | null;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<ApiResponse<UserProfile>>;
  logUserEvent: (event: Omit<UserEvent, 'eventId' | 'timestamp' | 'userId'>) => Promise<void>;
  simulateApiCall: (method: ApiMethod, path: string, payload?: Record<string, any>) => Promise<ApiResponse<any>>;
  triggerWebhook: (eventType: string, data: any) => Promise<void>;
  recomputeUIState: () => Promise<void>;
  featureFlagEnabled: (flagId: string) => boolean;
}

const AdaptiveUIContext = createContext<AdaptiveUIContextType | undefined>(undefined);

export const useAdaptiveUI = () => {
  const context = useContext(AdaptiveUIContext);
  if (!context) {
    throw new Error('useAdaptiveUI must be used within an AdaptiveUIProvider');
  }
  return context;
};

// --- AdaptiveUIProvider Component ---
interface AdaptiveUIProviderProps {
  children: React.ReactNode;
  initialUserId?: string;
}

export const AdaptiveUIProvider: React.FC<AdaptiveUIProviderProps> = ({ children, initialUserId = 'default_user_001' }) => {
  const [currentUserId, setCurrentUserIdState] = useState<string>(initialUserId);
  const [uiState, setInternalUiState] = useState<UIState>(DEFAULT_UI_STATE);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [featureFlagsCache, setFeatureFlagsCache] = useState<{ [flagId: string]: boolean }>({});

  const isInitializing = useRef(true);

  // Memoized services to avoid re-instantiation
  const userSvc = useMemo(() => userManagementService, []);
  const eventSvc = useMemo(() => eventLoggingService, []);
  const uiPredictionSvc = useMemo(() => uiPredictionService, []);
  const flagSvc = useMemo(() => featureFlagService, []);
  const apiGateway = useMemo(() => simulatedAPIGateway, []);
  const webhookSystem = useMemo(() => simulatedWebhookSystem, []);

  // Function to log user events
  const logUserEvent = useCallback(async (event: Omit<UserEvent, 'eventId' | 'timestamp' | 'userId'>) => {
    const response = await eventSvc.logEvent({ ...event, userId: currentUserId });
    if (response.success) {
      webhookSystem.publish('USER_EVENT_LOGGED', response.data);
    } else {
      console.error('Failed to log event:', response.error);
    }
  }, [currentUserId, eventSvc, webhookSystem]);


  // Function to update user profile
  const updateUserProfile = useCallback(async (updates: Partial<UserProfile>) => {
    const response = await userSvc.updateUserProfile(currentUserId, updates);
    if (response.success && response.data) {
      setUserProfile(response.data);
      webhookSystem.publish('USER_PROFILE_UPDATED', response.data);
      // Recompute UI state if relevant profile data changed, or adaptive learning is enabled
      // recomputeUIState is called by webhook in this case, preventing double call
    } else {
      console.error('Failed to update user profile:', response.error);
    }
    return response;
  }, [currentUserId, userSvc, webhookSystem]);

  // Function to recompute UI state based on current user profile and events
  const recomputeUIState = useCallback(async () => {
    const response = await uiPredictionSvc.predictUIState(currentUserId);
    if (response.success && response.data) {
      setInternalUiState(response.data);
      webhookSystem.publish('UI_STATE_CHANGED', { userId: currentUserId, newState: response.data });
      // Re-fetch feature flags specific to this user/state after recomputation
      const allFlagsRes = await flagSvc.getAllFeatureFlags();
      if (allFlagsRes.success && allFlagsRes.data) {
        const flagStatuses: { [key: string]: boolean } = {};
        for (const flag of allFlagsRes.data) {
          const isEnabledRes = await flagSvc.isFeatureEnabled(currentUserId, flag.flagId);
          flagStatuses[flag.flagId] = isEnabledRes.success ? isEnabledRes.data || false : false;
        }
        setFeatureFlagsCache(flagStatuses);
      }
    } else {
      console.error('Failed to predict UI state:', response.error);
    }
  }, [currentUserId, uiPredictionSvc, webhookSystem, flagSvc]);

  // Helper for simulated API calls
  const simulateApiCall = useCallback(async (method: ApiMethod, path: string, payload?: Record<string, any>) => {
    return apiGateway.call(method, path, payload, currentUserId);
  }, [apiGateway, currentUserId]);

  // Helper for triggering webhooks
  const triggerWebhook = useCallback(async (eventType: string, data: any) => {
    await webhookSystem.publish(eventType, data, currentUserId);
  }, [currentUserId, webhookSystem]);

  // Load initial user profile and UI state on mount or user change
  useEffect(() => {
    const loadUserData = async () => {
      // Fetch user profile
      const profileRes = await userSvc.getUserProfile(currentUserId);
      let user = profileRes.success && profileRes.data ? profileRes.data : DEFAULT_USER_PROFILE;
      if (!profileRes.success && profileRes.error?.code === 'NOT_FOUND') {
        // First-time user, create profile
        const createRes = await userSvc.createUserProfile({ ...DEFAULT_USER_PROFILE, userId: currentUserId });
        if (createRes.success) user = createRes.data!;
      }
      setUserProfile(user);

      // Load initial UI State based on prediction
      const uiStateRes = await uiPredictionSvc.predictUIState(currentUserId);
      if (uiStateRes.success && uiStateRes.data) {
        setInternalUiState(uiStateRes.data);
      } else {
        setInternalUiState(DEFAULT_UI_STATE); // Fallback
      }

      // Pre-load feature flags for this user
      const allFlagsRes = await flagSvc.getAllFeatureFlags();
      if (allFlagsRes.success && allFlagsRes.data) {
        const flagStatuses: { [key: string]: boolean } = {};
        for (const flag of allFlagsRes.data) {
          const isEnabledRes = await flagSvc.isFeatureEnabled(currentUserId, flag.flagId);
          flagStatuses[flag.flagId] = isEnabledRes.success ? isEnabledRes.data || false : false;
        }
        setFeatureFlagsCache(flagStatuses);
      }
      isInitializing.current = false;
      logUserEvent({ eventType: 'SESSION_START', context: { currentUserId } });
    };

    loadUserData();

    return () => {
      // Log session end on unmount or user change
      logUserEvent({ eventType: 'SESSION_END', duration: Date.now() - (userProfile?.lastLogin || Date.now()), context: { currentUserId } });
    };
  }, [currentUserId, userSvc, uiPredictionSvc, flagSvc, logUserEvent, userProfile?.lastLogin]);

  // Feature Flag Checker
  const featureFlagEnabled = useCallback((flagId: string): boolean => {
    return featureFlagsCache[flagId] || false;
  }, [featureFlagsCache]);

  // Function to set current user ID, triggering a full reload
  const handleSetCurrentUserId = useCallback((id: string) => {
    // Before changing user, save current user's last login
    if (userProfile && userProfile.userId === currentUserId) {
      userSvc.updateUserProfile(currentUserId, { lastLogin: Date.now() });
    }
    setCurrentUserIdState(id);
    setFeatureFlagsCache({}); // Clear cache for new user
  }, [currentUserId, userProfile, userSvc]);


  const contextValue = useMemo(() => ({
    currentUserId,
    setCurrentUserId: handleSetCurrentUserId,
    uiState,
    setUiState: setInternalUiState, // Expose for direct overrides (e.g., admin panel)
    userProfile,
    updateUserProfile,
    logUserEvent: debounce(logUserEvent, 100), // Debounce event logging
    simulateApiCall,
    triggerWebhook,
    recomputeUIState,
    featureFlagEnabled,
  }), [
    currentUserId, handleSetCurrentUserId, uiState, setInternalUiState, userProfile, updateUserProfile,
    logUserEvent, simulateApiCall, triggerWebhook, recomputeUIState, featureFlagEnabled
  ]);

  if (isInitializing.current || !userProfile) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-gray-200 text-lg">
        Initializing Adaptive UI System... Please wait.
      </div>
    );
  }

  return (
    <AdaptiveUIContext.Provider value={contextValue}>
      {children}
    </AdaptiveUIContext.Provider>
  );
};


// --- Core AdaptiveUITailorView Component (Greatly Expanded) ---

export const AdaptiveUITailorView: React.FC = () => {
  const {
    currentUserId,
    setCurrentUserId,
    uiState,
    setUiState,
    userProfile,
    updateUserProfile,
    logUserEvent,
    simulateApiCall,
    triggerWebhook,
    recomputeUIState,
    featureFlagEnabled,
  } = useAdaptiveUI();

  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showEventsViewer, setShowEventsViewer] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showFeatureFlagsEditor, setShowFeatureFlagsEditor] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  const containerRef = useRef<HTMLDivElement>(null);

  // Apply theme classes to the body or a top-level container
  useEffect(() => {
    if (containerRef.current) {
      const themeDef = uiThemeDefinitions[uiState.colorTheme];
      // Remove previous theme classes and add new ones
      Object.values(uiThemeDefinitions).forEach(def => {
        containerRef.current?.classList.remove(...def.className.split(' '));
      });
      containerRef.current.classList.add(...themeDef.className.split(' '));
    }
  }, [uiState.colorTheme]);

  // Log UI state changes
  useEffect(() => {
    logUserEvent({ eventType: 'UI_CHANGE', actionData: { newState: uiState, persona: uiState.persona } });
    setMessage(`UI adapted to ${uiState.persona} persona!`);
    setMessageType('info');
    const timer = setTimeout(() => setMessage(''), 3000);
    return () => clearTimeout(timer);
  }, [uiState, logUserEvent]);


  // Helper to render components based on current UIState
  const renderDynamicComponents = useCallback(() => {
    const componentsToRender = uiState.componentSet
      .map(compName => componentRegistry[compName])
      .filter(Boolean) // Filter out undefined components
      .sort((a, b) => b.priority - a.priority); // Higher priority first

    if (componentsToRender.length === 0) {
      return <p className="text-gray-400">No components defined for this UI state.</p>;
    }

    return componentsToRender.map(compDef => {
      const Comp = compDef.render;
      const key = compDef.name;
      // Filter components based on persona compatibility if not 'ALL'
      if (compDef.supportedPersonas !== 'ALL' && !compDef.supportedPersonas.includes(uiState.persona)) {
          return null; // Don't render if persona is not supported
      }
      return (
        <div key={key} className={`p-4 ${uiThemeDefinitions[uiState.colorTheme].primary} rounded-lg shadow-md`}>
          <Comp
            userId={currentUserId}
            uiState={uiState}
            onEvent={logUserEvent}
            {...compDef.defaultProps}
          />
        </div>
      );
    });
  }, [uiState, currentUserId, logUserEvent]);

  // --- Admin/Debug Panels (Nested Components for code organization) ---

  const AdminPanel: React.FC = () => {
    const { uiState, setUiState, currentUserId, recomputeUIState, simulateApiCall, triggerWebhook } = useAdaptiveUI();
    const [customComponent, setCustomComponent] = useState('');

    const handleManualOverride = (key: keyof UIState, value: any) => {
      setUiState(prev => ({ ...prev, [key]: value, manualOverrides: { ...prev.manualOverrides, [key]: value } as Partial<UIState> }));
      setMessage(`Manually set ${key} to ${value}`);
      setMessageType('success');
    };

    const handleAddComponent = () => {
      if (customComponent && !uiState.componentSet.includes(customComponent)) {
        setUiState(prev => ({
          ...prev,
          componentSet: [...prev.componentSet, customComponent],
          manualOverrides: { ...prev.manualOverrides, componentSet: [...(prev.manualOverrides.componentSet || []), customComponent] }
        }));
        setCustomComponent('');
        setMessage(`Added component: ${customComponent}`);
        setMessageType('success');
      }
    };

    const handleRemoveComponent = (comp: string) => {
      setUiState(prev => ({
        ...prev,
        componentSet: prev.componentSet.filter(c => c !== comp),
        manualOverrides: { ...prev.manualOverrides, componentSet: (prev.manualOverrides.componentSet || prev.componentSet).filter(c => c !== comp) }
      }));
      setMessage(`Removed component: ${comp}`);
      setMessageType('success');
    };

    const handleTestWebhook = async () => {
      await triggerWebhook('ADMIN_TEST_EVENT', { message: 'This is a test webhook from the admin panel.', timestamp: Date.now() });
      setMessage('Admin test webhook triggered!');
      setMessageType('success');
    };

    const handleClearLocalStorage = async () => {
      if (confirm('Are you sure you want to clear ALL adaptive UI data from local storage? This cannot be undone.')) {
        await localStorageDB.clearCollection('users');
        await localStorageDB.clearCollection('events');
        await localStorageDB.clearCollection('feature_flags');
        setMessage('Local storage data cleared. Please refresh.');
        setMessageType('success');
        setTimeout(() => window.location.reload(), 1500);
      }
    };


    return (
      <div className={`${uiThemeDefinitions[uiState.colorTheme].secondary} p-6 rounded-lg shadow-inner mt-6`}>
        <h2 className="text-xl font-bold mb-4">Admin/Debug Panel</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="p-3 border border-gray-600 rounded">
            <h3 className="font-semibold mb-2">Current UI State</h3>
            <pre className="text-xs bg-gray-700 p-2 rounded overflow-x-auto h-32">{JSON.stringify(uiState, null, 2)}</pre>
          </div>
          <div className="p-3 border border-gray-600 rounded">
            <h3 className="font-semibold mb-2">User Profile Summary</h3>
            <pre className="text-xs bg-gray-700 p-2 rounded overflow-x-auto h-32">{JSON.stringify(userProfile, null, 2)}</pre>
            <button className="mt-2 text-xs text-blue-400 hover:underline" onClick={() => setShowProfileEditor(true)}>Edit Profile</button>
          </div>
          <div className="p-3 border border-gray-600 rounded">
            <h3 className="font-semibold mb-2">Feature Flags</h3>
            <button className="text-xs text-blue-400 hover:underline" onClick={() => setShowFeatureFlagsEditor(true)}>Manage Feature Flags</button>
            <p className="text-xs mt-2">Data Grid V2 Enabled: {featureFlagEnabled('DATA_GRID_V2') ? 'Yes' : 'No'}</p>
            <p className="text-xs">AI Assistant Prompt Enabled: {featureFlagEnabled('AI_ASSISTANT_PROMPT') ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Manual UI Overrides</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Persona:</label>
              <select
                value={uiState.persona}
                onChange={(e) => handleManualOverride('persona', e.target.value as UIPersona)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              >
                {(Object.keys(uiPredictionService.personaRules) as UIPersona[]).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Layout:</label>
              <select
                value={uiState.layout}
                onChange={(e) => handleManualOverride('layout', e.target.value as UILayoutDensity)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              >
                {['DENSE', 'SPARSE', 'HYBRID', 'COMPACT'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Color Theme:</label>
              <select
                value={uiState.colorTheme}
                onChange={(e) => handleManualOverride('colorTheme', e.target.value as UIColorTheme)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              >
                {(Object.keys(uiThemeDefinitions) as UIColorTheme[]).map(c => (
                  <option key={c} value={c}>{uiThemeDefinitions[c].name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={recomputeUIState} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm">
              Re-predict UI State
            </button>
            <button onClick={() => setUiState(DEFAULT_UI_STATE)} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-md text-sm">
              Reset UI to Default
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Component Management</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {uiState.componentSet.map(comp => (
              <span key={comp} className="inline-flex items-center bg-gray-700 text-gray-200 text-xs px-2 py-1 rounded-full">
                {comp}
                <button onClick={() => handleRemoveComponent(comp)} className="ml-1 text-red-400 hover:text-red-500">x</button>
              </span>
            ))}
          </div>
          <div className="flex">
            <select
              value={customComponent}
              onChange={(e) => setCustomComponent(e.target.value)}
              className="flex-grow p-2 bg-gray-700 border border-gray-600 rounded-l text-white text-sm"
            >
              <option value="">Add Component...</option>
              {Object.keys(componentRegistry)
                .filter(compName => !uiState.componentSet.includes(compName))
                .map(compName => <option key={compName} value={compName}>{compName}</option>)}
            </select>
            <button onClick={handleAddComponent} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-md text-sm">Add</button>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Simulated API & Webhooks</h3>
          <button onClick={handleTestWebhook} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-sm mr-2">
            Trigger Test Webhook
          </button>
          <button onClick={() => simulateApiCall('GET', '/api/health')} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm">
            Test API Health
          </button>
        </div>
        <div className="mt-6 border-t border-gray-700 pt-4">
          <h3 className="font-semibold mb-2">Danger Zone</h3>
          <button onClick={handleClearLocalStorage} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm">
            Clear All Local Storage Data
          </button>
        </div>
      </div>
    );
  };

  const EventsViewer: React.FC = () => {
    const { currentUserId, simulateApiCall, uiState } = useAdaptiveUI();
    const [events, setEvents] = useState<UserEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchEvents = async () => {
        setLoading(true);
        const response = await simulateApiCall('GET', `/api/events/${currentUserId}`, { limit: 200 });
        if (response.success && response.data) {
          setEvents(response.data);
        } else {
          console.error('Failed to fetch events:', response.error);
        }
        setLoading(false);
      };
      fetchEvents();
      const interval = setInterval(fetchEvents, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }, [currentUserId, simulateApiCall]);

    return (
      <div className={`${uiThemeDefinitions[uiState.colorTheme].secondary} p-6 rounded-lg shadow-inner mt-6`}>
        <h2 className="text-xl font-bold mb-4">User Events Log ({currentUserId})</h2>
        {loading ? (
          <p>Loading events...</p>
        ) : (
          <div className="h-96 overflow-y-scroll bg-gray-700 p-3 rounded text-sm font-mono">
            {events.length === 0 ? (
              <p>No events logged yet.</p>
            ) : (
              events.map((event, index) => (
                <div key={event.eventId} className={`mb-2 p-2 rounded ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}`}>
                  <p><span className="text-gray-400">{new Date(event.timestamp).toLocaleTimeString()}</span> - <span className="font-semibold text-yellow-300">{event.eventType}</span></p>
                  {event.componentId && <p className="ml-4 text-xs text-blue-300">Component: {event.componentId}</p>}
                  {event.actionData && <pre className="ml-4 text-xs text-green-300">Action: {JSON.stringify(event.actionData, null, 2)}</pre>}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  const ProfileEditor: React.FC = () => {
    const { userProfile, updateUserProfile, uiState, recomputeUIState } = useAdaptiveUI();
    const [editableProfile, setEditableProfile] = useState<UserProfile | null>(userProfile);

    useEffect(() => {
      setEditableProfile(userProfile);
    }, [userProfile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type, checked } = e.target as HTMLInputElement;
      if (!editableProfile) return;

      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setEditableProfile(prev => ({
          ...prev!,
          [parent]: {
            ...((prev as any)?.[parent] || {}),
            [child]: type === 'checkbox' ? checked : value,
          }
        }));
      } else if (name === 'adaptiveLearningEnabled') {
        setEditableProfile(prev => ({ ...prev!, [name]: checked }));
      }
      else {
        setEditableProfile(prev => ({ ...prev!, [name]: value }));
      }
    };

    const handleSave = async () => {
      if (editableProfile) {
        const response = await updateUserProfile(editableProfile);
        if (response.success) {
          setMessage('User profile updated successfully!');
          setMessageType('success');
          setShowProfileEditor(false);
          recomputeUIState(); // Re-evaluate UI state after profile change
        } else {
          setMessage(`Error updating profile: ${response.error?.message}`);
          setMessageType('error');
        }
      }
    };

    if (!editableProfile) return null;

    return (
      <div className={`${uiThemeDefinitions[uiState.colorTheme].secondary} p-6 rounded-lg shadow-inner mt-6`}>
        <h2 className="text-xl font-bold mb-4">Edit User Profile ({editableProfile.userId})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username:</label>
            <input type="text" name="username" value={editableProfile.username} onChange={handleChange} className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input type="email" name="email" value={editableProfile.email} onChange={handleChange} className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm" />
          </div>
          <div className="col-span-full">
            <label className="block text-sm font-medium mb-1">Access Levels (comma separated):</label>
            <input type="text" name="accessLevels" value={editableProfile.accessLevels.join(', ')} onChange={(e) => setEditableProfile(prev => ({ ...prev!, accessLevels: e.target.value.split(',').map(s => s.trim()) }))} className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm" />
          </div>
          <div className="col-span-full">
            <label className="block text-sm font-medium mb-1">Subscriptions (comma separated):</label>
            <input type="text" name="subscriptions" value={editableProfile.subscriptions.join(', ')} onChange={(e) => setEditableProfile(prev => ({ ...prev!, subscriptions: e.target.value.split(',').map(s => s.trim()) }))} className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm" />
          </div>
          <div className="col-span-full flex items-center">
            <input
              type="checkbox"
              name="adaptiveLearningEnabled"
              checked={editableProfile.adaptiveLearningEnabled}
              onChange={handleChange}
              id="adaptiveLearningEnabled"
              className="mr-2"
            />
            <label htmlFor="adaptiveLearningEnabled" className="text-sm font-medium">Enable Adaptive Learning (AI tailors UI)</label>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={() => setShowProfileEditor(false)} className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-md text-sm">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm">Save Profile</button>
        </div>
      </div>
    );
  };

  const FeatureFlagsEditor: React.FC = () => {
    const { uiState, simulateApiCall, recomputeUIState } = useAdaptiveUI();
    const [flags, setFlags] = useState<FeatureFlag[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFlags = useCallback(async () => {
      setLoading(true);
      const response = await simulateApiCall('GET', '/api/feature-flags');
      if (response.success && response.data) {
        setFlags(response.data);
      } else {
        console.error('Failed to fetch feature flags:', response.error);
      }
      setLoading(false);
    }, [simulateApiCall]);

    useEffect(() => {
      fetchFlags();
    }, [fetchFlags]);

    const handleFlagUpdate = async (flagId: string, updates: Partial<FeatureFlag>) => {
      const response = await simulateApiCall('PUT', `/api/feature-flags/${flagId}`, updates);
      if (response.success) {
        setMessage(`Feature flag "${flagId}" updated.`);
        setMessageType('success');
        fetchFlags(); // Refresh list
        recomputeUIState(); // Re-evaluate UI state as flags might affect it
      } else {
        setMessage(`Error updating flag: ${response.error?.message}`);
        setMessageType('error');
      }
    };

    return (
      <div className={`${uiThemeDefinitions[uiState.colorTheme].secondary} p-6 rounded-lg shadow-inner mt-6`}>
        <h2 className="text-xl font-bold mb-4">Feature Flag Management</h2>
        {loading ? (
          <p>Loading feature flags...</p>
        ) : (
          <div className="space-y-4">
            {flags.map(flag => (
              <div key={flag.flagId} className="flex items-center justify-between p-3 bg-gray-700 rounded-md">
                <div>
                  <h3 className="font-semibold">{flag.name} ({flag.flagId})</h3>
                  <p className="text-xs text-gray-400">{flag.description}</p>
                  <p className="text-xs text-gray-400">Audience: {Array.isArray(flag.audience) ? flag.audience.join(', ') : flag.audience}</p>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <span className="mr-2 text-sm">Enabled:</span>
                  <input
                    type="checkbox"
                    checked={flag.isEnabled}
                    onChange={(e) => handleFlagUpdate(flag.flagId, { isEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <button onClick={() => setShowFeatureFlagsEditor(false)} className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-md text-sm">Close</button>
        </div>
      </div>
    );
  };


  // Main component render
  return (
    <div ref={containerRef} className={`${applyThemeClasses(uiState.colorTheme, 'min-h-screen p-6 transition-colors duration-500')}`}>
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
          <h1 className={`text-3xl font-bold ${uiThemeDefinitions[uiState.colorTheme].text}`}>
            Adaptive UI Tailor ({uiState.persona})
          </h1>
          <div className="flex items-center gap-4">
            <select
              value={currentUserId}
              onChange={(e) => setCurrentUserId(e.target.value)}
              className="p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            >
              <option value="default_user_001">User 001 (Default)</option>
              <option value="analytical_alice">Analytical Alice</option>
              <option value="creative_bob">Creative Bob</option>
              <option value="leader_charlie">Leader Charlie</option>
              <option value="new_explorer_eve">New Explorer Eve</option>
            </select>
            <button
              onClick={() => setShowAdminPanel(!showAdminPanel)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white text-sm"
            >
              {showAdminPanel ? 'Hide Admin' : 'Show Admin'}
            </button>
            <button
              onClick={() => setShowEventsViewer(!showEventsViewer)}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-md text-white text-sm"
            >
              {showEventsViewer ? 'Hide Events' : 'Show Events'}
            </button>
          </div>
        </header>

        {message && (
          <div className={`p-3 mb-4 rounded-md text-sm ${
            messageType === 'success' ? 'bg-green-500' :
            messageType === 'error' ? 'bg-red-500' : 'bg-blue-500'
          } text-white`}>
            {message}
          </div>
        )}

        <p className="text-gray-400 mb-6">
          Your interface has been dynamically tailored by the Adaptive UI System.
          Detected Persona: <span className="font-semibold text-white">{uiState.persona}</span>.
          Layout: <span className="font-semibold text-white">{uiState.layout}</span>.
          Color Theme: <span className="font-semibold text-white">{uiThemeDefinitions[uiState.colorTheme].name}</span>.
          Last Adapted: {new Date(uiState.lastUpdated).toLocaleTimeString()}.
        </p>

        {showAdminPanel && <AdminPanel />}
        {showEventsViewer && <EventsViewer />}
        {showProfileEditor && <ProfileEditor />}
        {showFeatureFlagsEditor && <FeatureFlagsEditor />}

        <div className={`mt-8 p-6 ${uiThemeDefinitions[uiState.colorTheme].secondary} rounded-lg border ${uiThemeDefinitions[uiState.colorTheme].border} shadow-lg`}>
          <h3 className="text-xl font-semibold mb-4">Rendered Components:</h3>
          <div className={`grid gap-4 ${uiState.layout === 'DENSE' ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 lg:grid-cols-2'}`}>
              {renderDynamicComponents()}
          </div>
        </div>
      </div>
    </div>
  );
};


// Main App Wrapper (if this file were the entry point for a simulated app)
// This would typically be in an App.tsx or index.tsx.
// To make this file "callable in the terminal when you installs the app"
// a custom script would need to wrap this. For a React component, this means
// providing a root to render it into.
// We export this as a named component. If it were truly standalone and executable
// via `node somefile.ts`, it would need a non-React entry point.
// Since the prompt specifies it's a TSX component, I'm sticking to React's rendering model.

// We will add a wrapper default export that renders the provider and the view.
// This allows the file to be treated as a self-contained "application" entry point
// when consumed by a simple ReactDOM.render call in an actual index.tsx.

const startTime = Date.now(); // For API health check uptime

export default function RootAdaptiveApp() {
  return (
    <AdaptiveUIProvider>
      <AdaptiveUITailorView />
    </AdaptiveUIProvider>
  );
}

// Simulated CLI Interface for direct terminal calls (if this were a Node.js script)
// This part is illustrative of how the services *could* be called directly
// if the environment allowed for a Node.js execution without React.
// Given the constraint of "only the complete, updated code for this file" and
// "do NOT change or remove existing import statements" (React ones),
// I will just add an illustrative function that *could* be run.

export async function runSimulatedCliCommand(command: string, ...args: string[]) {
  // Check if running in a Node.js-like environment
  if (typeof process === 'undefined' || !process.argv) {
      console.error("This CLI simulation is intended for Node.js environments. Not running in browser.");
      return;
  }
  const [serviceName, methodName, ...methodArgs] = args;
  console.log(`\n--- Running Simulated CLI Command: ${command} ${args.join(' ')} ---`);

  // Basic authentication simulation
  const cliUserId = 'cli_admin_user_001';
  // Ensure the admin user profile exists for CLI operations
  await userManagementService.createUserProfile({ ...DEFAULT_USER_PROFILE, userId: cliUserId, username: "CLI Admin", accessLevels: ['admin', 'cli'] });

  try {
    switch (command) {
      case 'api':
        const method = methodName.toUpperCase() as ApiMethod;
        const path = methodArgs[0];
        const payloadStr = methodArgs[1];
        const payload = payloadStr ? JSON.parse(payloadStr) : {};
        const apiResponse = await simulatedAPIGateway.call(method, path, payload, cliUserId);
        console.log('API Response:', JSON.stringify(apiResponse, null, 2));
        break;
      case 'user':
        if (methodName === 'get') {
          const userRes = await userManagementService.getUserProfile(methodArgs[0]);
          console.log('User Profile:', JSON.stringify(userRes, null, 2));
        } else if (methodName === 'update') {
          const userId = methodArgs[0];
          const updates = JSON.parse(methodArgs[1]);
          const updateRes = await userManagementService.updateUserProfile(userId, updates);
          console.log('Update User Response:', JSON.stringify(updateRes, null, 2));
        } else if (methodName === 'create') {
            const userData = JSON.parse(methodArgs[0]);
            const createRes = await userManagementService.createUserProfile(userData);
            console.log('Create User Response:', JSON.stringify(createRes, null, 2));
        }
        break;
      case 'predict-ui':
        const uiStateRes = await uiPredictionService.predictUIState(methodArgs[0] || cliUserId);
        console.log('Predicted UI State:', JSON.stringify(uiStateRes, null, 2));
        break;
      case 'log-event':
        const eventType = methodName as UserEventType;
        const eventData = JSON.parse(methodArgs[0] || '{}');
        const logRes = await eventLoggingService.logEvent({ userId: cliUserId, eventType, ...eventData });
        console.log('Logged Event:', JSON.stringify(logRes, null, 2));
        break;
      case 'feature-flag':
        if (methodName === 'get') {
          const flagRes = await featureFlagService.getFeatureFlag(methodArgs[0]);
          console.log('Feature Flag:', JSON.stringify(flagRes, null, 2));
        } else if (methodName === 'enable') {
          await featureFlagService.updateFeatureFlag(methodArgs[0], { isEnabled: true });
          console.log(`Enabled feature flag: ${methodArgs[0]}`);
        } else if (methodName === 'disable') {
          await featureFlagService.updateFeatureFlag(methodArgs[0], { isEnabled: false });
          console.log(`Disabled feature flag: ${methodArgs[0]}`);
        } else if (methodName === 'list') {
            const allFlags = await featureFlagService.getAllFeatureFlags();
            console.log('All Feature Flags:', JSON.stringify(allFlags, null, 2));
        }
        break;
      case 'clear-db':
        // In a real CLI, you'd confirm this more robustly
        if (true || confirm('Confirm clearing ALL simulated DB data?')) { // Bypassing confirm for direct CLI execution
          await localStorageDB.clearCollection('users');
          await localStorageDB.clearCollection('events');
          await localStorageDB.clearCollection('feature_flags');
          console.log('All simulated DB collections cleared. Reload application to re-initialize defaults.');
        } else {
          console.log('Clear operation cancelled.');
        }
        break;
      default:
        console.log(`Unknown command: ${command}`);
        console.log('Available commands:');
        console.log('  api <method> <path> [payload_json]');
        console.log('  user <get|create|update> <id> [data_json]');
        console.log('  predict-ui [userId]');
        console.log('  log-event <eventType> [eventData_json]');
        console.log('  feature-flag <get|enable|disable|list> <flagId>');
        console.log('  clear-db');
    }
  } catch (e: any) {
    console.error('CLI Command Error:', e.message);
  }
  console.log('--- CLI Command Finished ---');
}

// Example of how to "call this in the terminal" (if this file was run by Node directly)
// This block is typically commented out in a browser-targeted .tsx file,
// as it relies on Node.js-specific global variables like `process`.
// If this file were compiled and run by Node, uncommenting this would enable CLI.
/*
if (typeof process !== 'undefined' && process.argv && require.main === module) {
  // This block only runs if the script is executed directly via Node.
  // In a browser context, this condition is false.
  // We'd typically use `process.argv` here for CLI parsing.
  // For a .tsx file, this is highly unusual and would require a custom runner.
  // This is just to illustrate the 'terminal callable' aspect.
  const command = process.argv[2];
  const args = process.argv.slice(3);
  runSimulatedCliCommand(command, ...args);
}
*/