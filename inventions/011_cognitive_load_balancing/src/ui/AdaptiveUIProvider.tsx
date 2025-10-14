import React, { useState, useEffect, useContext, createContext, useCallback, useRef } from 'react';

// --- Global Types/Interfaces ---
export enum UiElementType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  GUIDED = 'guided', // New type for elements specific to guided mode
}

export type UiMode = 'standard' | 'focus' | 'minimal' | 'guided';

export interface MouseEventData {
  x: number;
  y: number;
  button: number;
  targetId: string;
  timestamp: number;
  targetBoundingRect?: DOMRectReadOnly; // For target acquisition error
}

export interface ScrollEventData {
  scrollX: number;
  scrollY: number;
  timestamp: number;
}

export interface KeyboardEventData {
  key: string;
  code: string;
  timestamp: number;
  isModifier: boolean;
}

export interface FocusBlurEventData {
  type: 'focus' | 'blur';
  targetId: string;
  timestamp: number;
}

export interface FormEventData {
  type: 'submit' | 'input' | 'change';
  targetId: string;
  value?: string;
  timestamp: number;
  isValid?: boolean; // For validation events
}

export type RawTelemetryEvent =
  | { type: 'mousemove'; data: MouseEventData }
  | { type: 'click'; data: MouseEventData }
  | { type: 'scroll'; data: ScrollEventData }
  | { type: 'keydown'; data: KeyboardEventData }
  | { type: 'keyup'; data: KeyboardEventData }
  | { type: 'focus'; data: FocusBlurEventData }
  | { type: 'blur'; data: FocusBlurEventData }
  | { type: 'form'; data: FormEventData };

// --- Feature Vector Interfaces ---
export interface MouseKinematicsFeatures {
  mouse_velocity_avg: number; // avg px/ms
  mouse_acceleration_avg: number; // avg px/ms^2
  mouse_path_tortuosity: number; // deviation from straight line, 0-1
  mouse_dwell_time_avg: number; // avg ms over interactive elements
  fitts_law_ip_avg: number; // Index of Performance, higher is better
}

export interface ClickDynamicsFeatures {
  click_frequency: number; // clicks/sec
  click_latency_avg: number; // ms between clicks in a burst
  target_acquisition_error_avg: number; // px deviation from center
  double_click_frequency: number; // double clicks / sec
}

export interface ScrollDynamicsFeatures {
  scroll_velocity_avg: number; // px/sec
  scroll_direction_changes: number; // count
  scroll_pause_frequency: number; // pauses / sec
}

export interface KeyboardDynamicsFeatures {
  typing_speed_wpm: number;
  backspace_frequency: number; // backspaces / sec
  keystroke_latency_avg: number; // ms between keydowns
  error_correction_rate: number; // backspaces / keydowns (excluding modifiers)
}

export interface InteractionErrorFeatures {
  form_validation_errors_count: number; // count
  repeated_action_attempts_count: number; // count of same action or element interaction
  navigation_errors_count: number; // e.g., dead links, rapid back/forward
}

export interface TaskContextFeatures {
  current_task_complexity: number; // derived from TaskContextManager
  time_in_current_task_sec: number;
}

export interface TelemetryFeatureVector {
  timestamp_window_end: number;
  mouse?: MouseKinematicsFeatures;
  clicks?: ClickDynamicsFeatures;
  scroll?: ScrollDynamicsFeatures;
  keyboard?: KeyboardDynamicsFeatures;
  errors?: InteractionErrorFeatures;
  task_context?: TaskContextFeatures;
  event_density: number; // total events per second in the window
}

// --- User Profile and Context Store ---
export interface UserPreferences {
  preferredUiMode: UiMode; // User can set a preferred default mode
  cognitiveLoadThresholds: {
    high: number;
    low: number;
    critical: number;
    criticalLow: number;
    guided: number;
    guidedLow: number;
  };
  adaptationPolicySelection: {
    [mode: string]: { [elementType: string]: 'obscure' | 'deemphasize' | 'reposition' | 'summarize' | 'none' };
  };
  personalizedBaselineCLS: number; // User's typical resting CLS
}

export class UserProfileService {
  private static instance: UserProfileService;
  private currentPreferences: UserPreferences = {
    preferredUiMode: 'standard',
    cognitiveLoadThresholds: {
      high: 0.6,
      low: 0.4,
      critical: 0.8,
      criticalLow: 0.7,
      guided: 0.75,
      guidedLow: 0.65,
    },
    adaptationPolicySelection: {}, // Default empty, managed by AdaptationPolicyManager
    personalizedBaselineCLS: 0.1, // Default baseline
  };

  private constructor() {
    // Load from localStorage or backend in a real app
    const storedPrefs = localStorage.getItem('userCognitiveLoadPrefs');
    if (storedPrefs) {
      this.currentPreferences = { ...this.currentPreferences, ...JSON.parse(storedPrefs) };
    }
  }

  public static getInstance(): UserProfileService {
    if (!UserProfileService.instance) {
      UserProfileService.instance = new UserProfileService();
    }
    return UserProfileService.instance;
  }

  public getPreferences(): UserPreferences {
    return { ...this.currentPreferences };
  }

  public updatePreferences(newPrefs: Partial<UserPreferences>): void {
    this.currentPreferences = { ...this.currentPreferences, ...newPrefs };
    localStorage.setItem('userCognitiveLoadPrefs', JSON.stringify(this.currentPreferences));
  }
}

// --- Task Context Manager ---
export type TaskContext = {
  id: string;
  name: string;
  complexity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
};

export class TaskContextManager {
  private static instance: TaskContextManager;
  private currentTask: TaskContext | null = null;
  private listeners: Set<(task: TaskContext | null) => void> = new Set();

  private constructor() {
    // Initialize with a default or infer from URL
    this.setTask({ id: 'app_init', name: 'Application Initialization', complexity: 'low', timestamp: performance.now() });
  }

  public static getInstance(): TaskContextManager {
    if (!TaskContextManager.instance) {
      TaskContextManager.instance = new TaskContextManager();
    }
    return TaskContextManager.instance;
  }

  public setTask(task: TaskContext | null): void {
    if (task && this.currentTask && task.id === this.currentTask.id) return; // Avoid redundant updates
    this.currentTask = task;
    this.listeners.forEach(listener => listener(this.currentTask));
    console.log(`TaskContextManager: Current task set to ${task?.name || 'N/A'} (Complexity: ${task?.complexity || 'N/A'})`);
  }

  public getCurrentTask(): TaskContext | null {
    return this.currentTask;
  }

  public subscribe(listener: (task: TaskContext | null) => void): () => void {
    this.listeners.add(listener);
    // Immediately notify with current task on subscription
    listener(this.currentTask);
    return () => this.listeners.delete(listener);
  }
}

// --- Interaction Error Logger ---
export interface InteractionError {
  id: string;
  type: 'validation' | 'repeatedAction' | 'navigation' | 'apiError';
  elementId?: string;
  message: string;
  timestamp: number;
}

export class InteractionErrorLogger {
  private static instance: InteractionErrorLogger;
  private errorsBuffer: InteractionError[] = [];
  private listeners: Set<(errors: InteractionError[]) => void> = new Set();
  private readonly bufferFlushRateMs: number = 1000;
  private bufferFlushInterval: ReturnType<typeof setInterval> | null = null;

  private constructor() {
    this.bufferFlushInterval = setInterval(this.flushBuffer, this.bufferFlushRateMs);
  }

  public static getInstance(): InteractionErrorLogger {
    if (!InteractionErrorLogger.instance) {
      InteractionErrorLogger.instance = new InteractionErrorLogger();
    }
    return InteractionErrorLogger.instance;
  }

  public logError(error: Omit<InteractionError, 'id' | 'timestamp'>): void {
    const newError: InteractionError = {
      id: `error-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: performance.now(),
      ...error,
    };
    this.errorsBuffer.push(newError);
  }

  private flushBuffer = (): void => {
    if (this.errorsBuffer.length > 0) {
      this.listeners.forEach(listener => listener([...this.errorsBuffer])); // Send a copy
      this.errorsBuffer = []; // Clear after notifying
    }
  };

  public subscribe(listener: (errors: InteractionError[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public stop(): void {
    if (this.bufferFlushInterval) {
      clearInterval(this.bufferFlushInterval);
    }
  }
}


// --- Core Telemetry Agent ---
export class TelemetryAgent {
  private eventBuffer: RawTelemetryEvent[] = [];
  private bufferInterval: ReturnType<typeof setInterval> | null = null;
  private readonly bufferFlushRateMs: number = 200; // Flush data every 200ms
  private readonly featureProcessingCallback: (features: TelemetryFeatureVector) => void;
  private lastMouseCoord: { x: number; y: number; timestamp: number } | null = null;
  private lastScrollY: { y: number; timestamp: number } | null = null;
  private clickTimestamps: number[] = [];
  private keydownTimestamps: number[] = [];
  private lastKeyboardActivityTime: number = 0;
  private formInputTimes: Map<string, number> = new Map(); // track time spent on form fields
  private lastErrorCount: number = 0; // for error feature comparison

  private interactionErrorLogger = InteractionErrorLogger.getInstance();
  private taskContextManager = TaskContextManager.getInstance();

  constructor(featureProcessingCallback: (features: TelemetryFeatureVector) => void) {
    this.featureProcessingCallback = featureProcessingCallback;
    this.initListeners();
  }

  private initListeners(): void {
    window.addEventListener('mousemove', this.handleMouseMoveEvent, { passive: true });
    window.addEventListener('click', this.handleClickEvent, { passive: true });
    window.addEventListener('scroll', this.handleScrollEvent, { passive: true });
    window.addEventListener('keydown', this.handleKeyboardEvent, { passive: true });
    window.addEventListener('keyup', this.handleKeyboardEvent, { passive: true });
    window.addEventListener('focusin', this.handleFocusBlurEvent, { passive: true });
    window.addEventListener('focusout', this.handleFocusBlurEvent, { passive: true });
    window.addEventListener('input', this.handleFormEvent, { passive: true });
    window.addEventListener('change', this.handleFormEvent, { passive: true });
    window.addEventListener('submit', this.handleFormEvent, { passive: true }); // Captures form submission
    this.bufferInterval = setInterval(this.flushBuffer, this.bufferFlushRateMs);
  }

  private addEvent = (event: RawTelemetryEvent): void => {
    this.eventBuffer.push(event);
  };

  private handleMouseMoveEvent = (event: MouseEvent): void => {
    const timestamp = performance.now();
    this.addEvent({
      type: 'mousemove',
      data: {
        x: event.clientX,
        y: event.clientY,
        button: event.button,
        targetId: (event.target as HTMLElement)?.id || '',
        timestamp,
      },
    });
  };

  private handleClickEvent = (event: MouseEvent): void => {
    const timestamp = performance.now();
    const targetElement = event.target as HTMLElement;
    this.addEvent({
      type: 'click',
      data: {
        x: event.clientX,
        y: event.clientY,
        button: event.button,
        targetId: targetElement?.id || '',
        timestamp,
        targetBoundingRect: targetElement?.getBoundingClientRect ? new DOMRectReadOnly(targetElement.getBoundingClientRect().x, targetElement.getBoundingClientRect().y, targetElement.getBoundingClientRect().width, targetElement.getBoundingClientRect().height) : undefined,
      },
    });
    this.clickTimestamps.push(timestamp);
  };

  private handleScrollEvent = (event: Event): void => {
    const timestamp = performance.now();
    this.addEvent({
      type: 'scroll',
      data: {
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        timestamp,
      },
    });
  };

  private handleKeyboardEvent = (event: KeyboardEvent): void => {
    const timestamp = performance.now();
    this.addEvent({
      type: event.type === 'keydown' ? 'keydown' : 'keyup',
      data: {
        key: event.key,
        code: event.code,
        timestamp,
        isModifier: event.ctrlKey || event.shiftKey || event.altKey || event.metaKey,
      },
    });
    if (event.type === 'keydown') {
      this.keydownTimestamps.push(timestamp);
      this.lastKeyboardActivityTime = timestamp;
    }
  };

  private handleFocusBlurEvent = (event: FocusEvent): void => {
    const timestamp = performance.now();
    const targetId = (event.target as HTMLElement)?.id;
    this.addEvent({
      type: event.type === 'focusin' ? 'focus' : 'blur',
      data: {
        type: event.type === 'focusin' ? 'focus' : 'blur',
        targetId: targetId || '',
        timestamp,
      },
    });

    if (targetId && (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)) {
      if (event.type === 'focusin') {
        this.formInputTimes.set(targetId, timestamp);
      } else if (event.type === 'focusout' && this.formInputTimes.has(targetId)) {
        const focusTime = this.formInputTimes.get(targetId);
        const duration = timestamp - focusTime!;
        // console.log(`User spent ${duration.toFixed(0)}ms on input ${targetId}`);
        this.formInputTimes.delete(targetId); // Clear after processing
      }
    }
  };

  private handleFormEvent = (event: Event): void => {
    const timestamp = performance.now();
    const targetElement = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLFormElement;
    const type = event.type === 'submit' ? 'submit' : event.type === 'input' ? 'input' : 'change';

    // Basic validation check - would be more sophisticated in a real app
    let isValid: boolean | undefined = undefined;
    if ('checkValidity' in targetElement && typeof targetElement.checkValidity === 'function') {
      isValid = targetElement.checkValidity();
      if (!isValid && type === 'change') { // Log validation error on change if invalid
        this.interactionErrorLogger.logError({
          type: 'validation',
          elementId: targetElement.id || targetElement.name,
          message: `Form field validation failed: ${targetElement.validationMessage}`
        });
      }
    }

    this.addEvent({
      type: 'form',
      data: {
        type: type,
        targetId: targetElement?.id || targetElement?.name || '',
        value: 'value' in targetElement ? String(targetElement.value) : undefined,
        timestamp,
        isValid,
      },
    });
  };

  private calculateMouseAcceleration(prevV: number, currentV: number, timeDelta: number): number {
    return timeDelta > 0 ? (currentV - prevV) / timeDelta : 0;
  }

  private calculateMousePathTortuosity(events: MouseEventData[]): number {
    if (events.length < 3) return 0;
    let totalDistance = 0;
    let straightLineDistance = 0;

    for (let i = 1; i < events.length; i++) {
      const p1 = events[i - 1];
      const p2 = events[i];
      totalDistance += Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }
    const start = events[0];
    const end = events[events.length - 1];
    straightLineDistance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));

    return straightLineDistance > 0 ? totalDistance / straightLineDistance : 0; // Ratio > 1 indicates tortuosity
  }

  private calculateTargetAcquisitionError(clicks: MouseEventData[]): number {
    let totalError = 0;
    let validClicks = 0;
    for (const click of clicks) {
      if (click.targetBoundingRect) {
        const rect = click.targetBoundingRect;
        const centerX = rect.x + rect.width / 2;
        const centerY = rect.y + rect.height / 2;
        const error = Math.sqrt(Math.pow(click.x - centerX, 2) + Math.pow(click.y - centerY, 2));
        totalError += error;
        validClicks++;
      }
    }
    return validClicks > 0 ? totalError / validClicks : 0;
  }


  private extractFeatures = (events: RawTelemetryEvent[]): TelemetryFeatureVector => {
    const windowStart = performance.now() - this.bufferFlushRateMs;
    const windowEnd = performance.now();
    const durationSeconds = this.bufferFlushRateMs / 1000;

    let mouseMoveEvents: MouseEventData[] = [];
    let clickEvents: MouseEventData[] = [];
    let scrollEvents: ScrollEventData[] = [];
    let keydownEvents: KeyboardEventData[] = [];
    let formEvents: FormEventData[] = [];

    // Filter events for the current window and categorize
    for (const event of events) {
      if (event.data.timestamp < windowStart) continue;

      switch (event.type) {
        case 'mousemove': mouseMoveEvents.push(event.data); break;
        case 'click': clickEvents.push(event.data); break;
        case 'scroll': scrollEvents.push(event.data); break;
        case 'keydown': keydownEvents.push(event.data); break;
        case 'form': formEvents.push(event.data); break;
        // Other events like keyup, focus/blur are captured but may not directly contribute to these features.
      }
    }

    // --- Mouse Kinematics ---
    let totalMouseVelocity = 0;
    let totalMouseAcceleration = 0;
    let prevMouseVelocity = 0;
    let mouseDwellTimeAvg = 0; // Needs more complex tracking over specific elements
    if (mouseMoveEvents.length > 1) {
      for (let i = 1; i < mouseMoveEvents.length; i++) {
        const p1 = mouseMoveEvents[i - 1];
        const p2 = mouseMoveEvents[i];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const timeDelta = p2.timestamp - p1.timestamp;
        if (timeDelta > 0) {
          const velocity = distance / timeDelta; // px/ms
          totalMouseVelocity += velocity;
          totalMouseAcceleration += this.calculateMouseAcceleration(prevMouseVelocity, velocity, timeDelta);
          prevMouseVelocity = velocity;
        }
      }
    }

    // --- Click Dynamics ---
    let totalClickLatency = 0;
    let doubleClickCount = 0;
    if (clickEvents.length > 1) {
      for (let i = 1; i < clickEvents.length; i++) {
        const latency = clickEvents[i].timestamp - clickEvents[i-1].timestamp;
        totalClickLatency += latency;
        if (latency < 500) { // arbitrary threshold for potential double click
          doubleClickCount++;
        }
      }
    }

    // --- Scroll Dynamics ---
    let totalScrollYDelta = 0;
    let scrollDirectionChanges = 0;
    let prevScrollY: number | null = null;
    let lastScrollDirection: 'up' | 'down' | null = null;
    let scrollPauseCount = 0;
    if (scrollEvents.length > 1) {
      for (let i = 1; i < scrollEvents.length; i++) {
        const s1 = scrollEvents[i - 1];
        const s2 = scrollEvents[i];
        const deltaY = s2.scrollY - s1.scrollY;
        if (Math.abs(deltaY) > 0) {
          totalScrollYDelta += Math.abs(deltaY);
          const currentDirection = deltaY > 0 ? 'down' : 'up';
          if (lastScrollDirection && currentDirection !== lastScrollDirection) {
            scrollDirectionChanges++;
          }
          lastScrollDirection = currentDirection;
        } else {
          // A pause is indicated by no scroll movement between consecutive scroll events
          // This is a simplistic definition; a more robust one would involve gaps in scroll events themselves
          if (prevScrollY !== null && prevScrollY === s2.scrollY) {
            scrollPauseCount++;
          }
        }
        prevScrollY = s2.scrollY;
      }
    }


    // --- Keyboard Dynamics ---
    let totalKeystrokeLatency = 0;
    let backspaceCount = 0;
    let wordCount = 0; // For WPM
    let lastTypedWordTime: number = 0;
    let nonModifierKeydownCount = 0;
    if (keydownEvents.length > 0) {
      for (let i = 0; i < keydownEvents.length; i++) {
        const keyEvent = keydownEvents[i];
        if (!keyEvent.isModifier) {
          nonModifierKeydownCount++;
          if (i > 0 && !keydownEvents[i-1].isModifier) { // only count latency between non-modifier keys
            totalKeystrokeLatency += (keyEvent.timestamp - keydownEvents[i-1].timestamp);
          }
          if (keyEvent.key === 'Backspace') {
            backspaceCount++;
          } else if (keyEvent.key === ' ' && keyEvent.timestamp - lastTypedWordTime > 100) { // debounce words
            wordCount++;
            lastTypedWordTime = keyEvent.timestamp;
          }
        }
      }
    }
    const errorCorrectionRate = nonModifierKeydownCount > 0 ? backspaceCount / nonModifierKeydownCount : 0;


    // --- Interaction Errors (from IEL) ---
    const errorsInWindow = this.interactionErrorLogger.errorsBuffer.filter(err => err.timestamp >= windowStart);
    let formValidationErrors = errorsInWindow.filter(err => err.type === 'validation').length;
    let repeatedActionAttempts = errorsInWindow.filter(err => err.type === 'repeatedAction').length;
    let navigationErrors = errorsInWindow.filter(err => err.type === 'navigation').length;

    // Task Context
    const currentTask = this.taskContextManager.getCurrentTask();
    const taskComplexityMap: { [key in TaskContext['complexity']]: number } = {
      'low': 0.2, 'medium': 0.5, 'high': 0.7, 'critical': 0.9
    };
    const taskContextFeatures: TaskContextFeatures = {
      current_task_complexity: currentTask ? taskComplexityMap[currentTask.complexity] : 0,
      time_in_current_task_sec: currentTask ? (windowEnd - currentTask.timestamp) / 1000 : 0,
    };

    const featureVector: TelemetryFeatureVector = {
      timestamp_window_end: windowEnd,
      event_density: events.length / durationSeconds,
      task_context: taskContextFeatures,
    };

    if (mouseMoveEvents.length > 0) {
      featureVector.mouse = {
        mouse_velocity_avg: mouseMoveEvents.length > 1 ? totalMouseVelocity / (mouseMoveEvents.length - 1) : 0,
        mouse_acceleration_avg: mouseMoveEvents.length > 2 ? totalMouseAcceleration / (mouseMoveEvents.length - 2) : 0,
        mouse_path_tortuosity: this.calculateMousePathTortuosity(mouseMoveEvents),
        mouse_dwell_time_avg: 0, // More complex calculation needed involving UI element IDs
        fitts_law_ip_avg: 0, // Requires target acquisition time and target size
      };
    }

    if (clickEvents.length > 0) {
      featureVector.clicks = {
        click_frequency: clickEvents.length / durationSeconds,
        click_latency_avg: clickEvents.length > 1 ? totalClickLatency / (clickEvents.length - 1) : 0,
        target_acquisition_error_avg: this.calculateTargetAcquisitionError(clickEvents),
        double_click_frequency: doubleClickCount / durationSeconds,
      };
    }

    if (scrollEvents.length > 0) {
      featureVector.scroll = {
        scroll_velocity_avg: totalScrollYDelta / durationSeconds,
        scroll_direction_changes: scrollDirectionChanges,
        scroll_pause_frequency: scrollPauseCount / durationSeconds,
      };
    }

    if (keydownEvents.length > 0) {
      featureVector.keyboard = {
        typing_speed_wpm: wordCount / (durationSeconds / 60),
        backspace_frequency: backspaceCount / durationSeconds,
        keystroke_latency_avg: nonModifierKeydownCount > 1 ? totalKeystrokeLatency / (nonModifierKeydownCount - 1) : 0,
        error_correction_rate: errorCorrectionRate,
      };
    }

    featureVector.errors = {
      form_validation_errors_count: formValidationErrors,
      repeated_action_attempts_count: repeatedActionAttempts,
      navigation_errors_count: navigationErrors,
    };

    // Update last known states for next window (already done by flushing buffers in IEL)
    this.lastMouseCoord = mouseMoveEvents.length > 0 ? mouseMoveEvents[mouseMoveEvents.length - 1] : this.lastMouseCoord;
    this.lastScrollY = scrollEvents.length > 0 ? { y: scrollEvents[scrollEvents.length - 1].scrollY, timestamp: scrollEvents[scrollEvents.length - 1].timestamp } : this.lastScrollY;

    return featureVector;
  };

  private flushBuffer = (): void => {
    if (this.eventBuffer.length > 0) {
      const features = this.extractFeatures(this.eventBuffer);
      this.featureProcessingCallback(features);
      this.eventBuffer = []; // Clear buffer
    }
  };

  public stop(): void {
    window.removeEventListener('mousemove', this.handleMouseMoveEvent);
    window.removeEventListener('click', this.handleClickEvent);
    window.removeEventListener('scroll', this.handleScrollEvent);
    window.removeEventListener('keydown', this.handleKeyboardEvent);
    window.removeEventListener('keyup', this.handleKeyboardEvent);
    window.removeEventListener('focusin', this.handleFocusBlurEvent);
    window.removeEventListener('focusout', this.handleFocusBlurEvent);
    window.removeEventListener('input', this.handleFormEvent);
    window.removeEventListener('change', this.handleFormEvent);
    window.removeEventListener('submit', this.handleFormEvent);
    if (this.bufferInterval) {
      clearInterval(this.bufferInterval);
    }
    this.interactionErrorLogger.stop();
  }
}

// --- Cognitive Load Inference Engine ---
export class CognitiveLoadEngine {
  private latestFeatureVector: TelemetryFeatureVector | null = null;
  private loadHistory: number[] = [];
  private readonly historyLength: number = 20; // For smoothing
  private readonly predictionIntervalMs: number = 500;
  private predictionTimer: ReturnType<typeof setInterval> | null = null;
  private onCognitiveLoadUpdate: (load: number) => void;
  private userProfileService = UserProfileService.getInstance();
  private taskContextManager = TaskContextManager.getInstance();

  constructor(onUpdate: (load: number) => void) {
    this.onCognitiveLoadUpdate = onUpdate;
    this.predictionTimer = setInterval(this.inferLoad, this.predictionIntervalMs);
  }

  public processFeatures(featureVector: TelemetryFeatureVector): void {
    this.latestFeatureVector = featureVector;
  }

  // A more sophisticated mock machine learning model for cognitive load prediction
  private mockPredict(features: TelemetryFeatureVector): number {
    const prefs = this.userProfileService.getPreferences();
    let score = prefs.personalizedBaselineCLS; // Start with baseline
    let featureWeightSum = 0; // Sum of weights for normalization

    // Basic feature weights (can be tuned via ML model)
    const weights = {
      mouse_velocity_avg: 0.1, mouse_acceleration_avg: 0.15, mouse_path_tortuosity: 0.2,
      click_frequency: 0.1, click_latency_avg: 0.15, target_acquisition_error_avg: 0.25, double_click_frequency: 0.1,
      scroll_velocity_avg: 0.05, scroll_direction_changes: 0.1, scroll_pause_frequency: 0.05,
      typing_speed_wpm: 0.15, backspace_frequency: 0.3, keystroke_latency_avg: 0.1, error_correction_rate: 0.2,
      form_validation_errors_count: 0.4, repeated_action_attempts_count: 0.3, navigation_errors_count: 0.2,
      task_complexity: 0.2, time_in_task: 0.05,
      event_density: 0.1
    };

    // Contribution from Mouse Features
    if (features.mouse) {
      score += Math.min(1, Math.max(0, features.mouse.mouse_velocity_avg / 10)) * weights.mouse_velocity_avg;
      score += Math.min(1, Math.max(0, features.mouse.mouse_acceleration_avg / 0.5)) * weights.mouse_acceleration_avg; // Assume avg accel around 0.5
      score += Math.min(1, features.mouse.mouse_path_tortuosity / 5) * weights.mouse_path_tortuosity; // Tortuosity ratio
    }

    // Contribution from Click Features
    if (features.clicks) {
      score += Math.min(1, Math.max(0, features.clicks.click_frequency / 5)) * weights.click_frequency;
      score += Math.min(1, features.clicks.click_latency_avg / 200) * weights.click_latency_avg; // Higher latency -> higher load
      score += Math.min(1, features.clicks.target_acquisition_error_avg / 50) * weights.target_acquisition_error_avg; // Larger error -> higher load
      score += Math.min(1, features.clicks.double_click_frequency / 1) * weights.double_click_frequency; // Higher freq -> more hurried/stressed
    }

    // Contribution from Scroll Features
    if (features.scroll) {
      score += Math.min(1, Math.max(0, features.scroll.scroll_velocity_avg / 1000)) * weights.scroll_velocity_avg;
      score += Math.min(1, features.scroll.scroll_direction_changes / 5) * weights.scroll_direction_changes;
      score += Math.min(1, features.scroll.scroll_pause_frequency / 2) * weights.scroll_pause_frequency;
    }

    // Contribution from Keyboard Features
    if (features.keyboard) {
      const optimalWPM = 60;
      const wpmDeviation = Math.abs(features.keyboard.typing_speed_wpm - optimalWPM) / optimalWPM;
      score += Math.min(1, wpmDeviation * 0.5) * weights.typing_speed_wpm;
      score += Math.min(1, features.keyboard.backspace_frequency / 2) * weights.backspace_frequency;
      score += Math.min(1, features.keyboard.keystroke_latency_avg / 100) * weights.keystroke_latency_avg;
      score += Math.min(1, features.keyboard.error_correction_rate * 2) * weights.error_correction_rate;
    }

    // Contribution from Error Features (strong indicators of load)
    if (features.errors) {
      score += Math.min(1, features.errors.form_validation_errors_count * 0.5) * weights.form_validation_errors_count;
      score += Math.min(1, features.errors.repeated_action_attempts_count * 0.5) * weights.repeated_action_attempts_count;
      score += Math.min(1, features.errors.navigation_errors_count * 0.5) * weights.navigation_errors_count;
    }

    // Contribution from Task Context
    if (features.task_context && features.task_context.current_task_complexity > 0) {
      score += features.task_context.current_task_complexity * weights.task_complexity;
      // Time in task could increase or decrease load, depending on task. Simplistic for now.
      // score += Math.min(1, features.task_context.time_in_current_task_sec / 300) * weights.time_in_task;
    }

    score += Math.min(1, features.event_density / 50) * weights.event_density; // Very high event density could indicate frustration

    // Ensure score is within [0, 1]
    return Math.min(1.0, Math.max(0.0, score));
  }

  private inferLoad = (): void => {
    if (!this.latestFeatureVector) {
      // If no features, assume low load or previous load, or baseline
      const lastLoad = this.loadHistory.length > 0 ? this.loadHistory[this.loadHistory.length - 1] : this.userProfileService.getPreferences().personalizedBaselineCLS;
      this.onCognitiveLoadUpdate(lastLoad);
      return;
    }

    const rawLoad = this.mockPredict(this.latestFeatureVector);

    // Apply Exponential Moving Average for smoothing
    if (this.loadHistory.length === 0) {
      this.loadHistory.push(rawLoad);
    } else {
      const alpha = 2 / (this.historyLength + 1); // Smoothing factor
      const smoothed = this.loadHistory[this.loadHistory.length - 1] * (1 - alpha) + rawLoad * alpha;
      this.loadHistory.push(smoothed);
    }

    if (this.loadHistory.length > this.historyLength) {
      this.loadHistory.shift();
    }
    const currentSmoothedLoad = this.loadHistory[this.loadHistory.length - 1];

    this.onCognitiveLoadUpdate(currentSmoothedLoad);
    this.latestFeatureVector = null; // Clear features processed
  };

  public updateModelWeights(newWeights: { [key: string]: number }): void {
    // In a real system, this would involve retraining or updating ML model parameters
    console.log('CognitiveLoadEngine: Model weights updated (mock)');
    // this.weights = { ...this.weights, ...newWeights };
  }

  public stop(): void {
    if (this.predictionTimer) {
      clearInterval(this.predictionTimer);
    }
  }
}

// --- Adaptation Policy Manager ---
// This class defines concrete policies for UI elements based on the current UI mode.
export class AdaptationPolicyManager {
  private static instance: AdaptationPolicyManager;
  private userProfileService = UserProfileService.getInstance();

  private constructor() {}

  public static getInstance(): AdaptationPolicyManager {
    if (!AdaptationPolicyManager.instance) {
      AdaptationPolicyManager.instance = new AdaptationPolicyManager();
    }
    return AdaptationPolicyManager.instance;
  }

  // Define default or A/B testable policies.
  // In a real system, these would be fetched from a configuration service or derived from ML models.
  private getPolicyForMode(mode: UiMode, elementType: UiElementType) {
    // User-defined policies take precedence
    const userPolicy = this.userProfileService.getPreferences().adaptationPolicySelection[mode]?.[elementType];
    if (userPolicy) return userPolicy;

    // Default policies
    switch (mode) {
      case 'standard':
        return 'none'; // All visible, fully interactive
      case 'focus':
        if (elementType === UiElementType.SECONDARY) return 'deemphasize';
        if (elementType === UiElementType.TERTIARY) return 'obscure';
        return 'none';
      case 'minimal':
        if (elementType === UiElementType.SECONDARY) return 'obscure';
        if (elementType === UiElementType.TERTIARY) return 'obscure';
        return 'none'; // Primary elements still shown
      case 'guided': // New mode
        if (elementType === UiElementType.SECONDARY || elementType === UiElementType.TERTIARY) return 'obscure';
        if (elementType === UiElementType.GUIDED) return 'none'; // Guided elements are prominent
        return 'none';
      default:
        return 'none';
    }
  }

  public getUiElementState(mode: UiMode, elementType: UiElementType): { isVisible: boolean; className: string } {
    const policy = this.getPolicyForMode(mode, elementType);
    let isVisible = true;
    let className = `${elementType}-element`;

    switch (policy) {
      case 'obscure':
        isVisible = false; // Completely hide
        break;
      case 'deemphasize':
        className += ` mode-${mode}-deemphasize`;
        break;
      case 'reposition':
        className += ` mode-${mode}-reposition`; // Placeholder for repositioning logic
        break;
      case 'summarize':
        className += ` mode-${mode}-summarize`; // Placeholder for summarization logic
        break;
      case 'none':
      default:
        // Default visibility and class name
        break;
    }

    return { isVisible, className };
  }
}


// --- Adaptive UI Orchestrator (React Context/Hook) ---
interface CognitiveLoadContextType {
  cognitiveLoad: number;
  uiMode: UiMode;
  setUiMode: React.Dispatch<React.SetStateAction<UiMode>>; // Exposed for potential explicit user override or debug
  currentTask: TaskContext | null; // Expose current task
  registerUiElement: (id: string, uiType: UiElementType) => void;
  unregisterUiElement: (id: string) => void;
  isElementVisible: (id: string, uiType: UiElementType) => boolean;
  getUiModeClassName: (uiType: UiElementType) => string;
}

const CognitiveLoadContext = createContext<CognitiveLoadContextType | undefined>(undefined);

// Hook to provide cognitive load and UI mode throughout the application
export const useCognitiveLoadBalancer = (): CognitiveLoadContextType => {
  const context = useContext(CognitiveLoadContext);
  if (context === undefined) {
    throw new Error('useCognitiveLoadBalancer must be used within a CognitiveLoadProvider');
  }
  return context;
};

// Hook for individual UI elements to adapt
export const useUiElement = (id: string, uiType: UiElementType) => {
  const { registerUiElement, unregisterUiElement, isElementVisible, getUiModeClassName } = useCognitiveLoadBalancer();

  useEffect(() => {
    registerUiElement(id, uiType);
    return () => {
      unregisterUiElement(id);
    };
  }, [id, uiType, registerUiElement, unregisterUiElement]);

  const isVisible = isElementVisible(id, uiType);
  const className = getUiModeClassName(uiType);

  return { isVisible, className };
};


// Provider component for the Cognitive Load Balancing system
export const CognitiveLoadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cognitiveLoad, setCognitiveLoad] = useState<number>(0.0);
  const [uiMode, setUiMode] = useState<UiMode>('standard');
  const [currentTask, setCurrentTask] = useState<TaskContext | null>(null);

  const registeredUiElements = useRef(new Map<string, UiElementType>());
  const userProfileService = UserProfileService.getInstance();
  const taskContextManager = TaskContextManager.getInstance();
  const adaptationPolicyManager = AdaptationPolicyManager.getInstance();

  const loadThresholds = userProfileService.getPreferences().cognitiveLoadThresholds;
  const sustainedLoadCounter = useRef(0);
  const readonly sustainedLoadDurationMs = 1500;
  const readonly checkIntervalMs = 500;

  // Initialize Telemetry Agent and Cognitive Load Engine
  useEffect(() => {
    let telemetryAgent: TelemetryAgent | null = null;
    let cognitiveLoadEngine: CognitiveLoadEngine | null = null;

    const featureProcessingCallback = (features: TelemetryFeatureVector) => {
      cognitiveLoadEngine?.processFeatures(features);
    };

    telemetryAgent = new TelemetryAgent(featureProcessingCallback);
    cognitiveLoadEngine = new CognitiveLoadEngine(setCognitiveLoad);

    // Subscribe to task context changes
    const unsubscribeTask = taskContextManager.subscribe(setCurrentTask);

    return () => {
      telemetryAgent?.stop();
      cognitiveLoadEngine?.stop();
      unsubscribeTask();
    };
  }, []); // Empty dependency array means this runs once on mount

  // Effect to manage UI mode transitions based on cognitive load with hysteresis and sustained duration
  useEffect(() => {
    const interval = setInterval(() => {
      const currentMode = uiMode;
      const taskComplexity = currentTask?.complexity === 'critical' || currentTask?.complexity === 'high'; // Simplified check

      if (cognitiveLoad > loadThresholds.critical && currentMode !== 'minimal') {
        sustainedLoadCounter.current += checkIntervalMs;
        if (sustainedLoadCounter.current >= sustainedLoadDurationMs) {
          setUiMode('minimal');
          sustainedLoadCounter.current = 0;
        }
      } else if (cognitiveLoad < loadThresholds.criticalLow && currentMode === 'minimal') {
        sustainedLoadCounter.current += checkIntervalMs;
        if (sustainedLoadCounter.current >= sustainedLoadDurationMs) {
          setUiMode('focus');
          sustainedLoadCounter.current = 0;
        }
      } else if (cognitiveLoad > loadThresholds.guided && taskComplexity && currentMode !== 'guided') {
        // High load AND complex task -> Guided mode
        sustainedLoadCounter.current += checkIntervalMs;
        if (sustainedLoadCounter.current >= sustainedLoadDurationMs) {
          setUiMode('guided');
          sustainedLoadCounter.current = 0;
        }
      } else if (cognitiveLoad < loadThresholds.guidedLow && currentMode === 'guided') {
        // Low load or task no longer complex -> revert from Guided
        sustainedLoadCounter.current += checkIntervalMs;
        if (sustainedLoadCounter.current >= sustainedLoadDurationMs) {
          setUiMode('focus'); // Typically Guided -> Focus, then Focus -> Standard
          sustainedLoadCounter.current = 0;
        }
      }
      else if (cognitiveLoad > loadThresholds.high && currentMode === 'standard') {
        sustainedLoadCounter.current += checkIntervalMs;
        if (sustainedLoadCounter.current >= sustainedLoadDurationMs) {
          setUiMode('focus');
          sustainedLoadCounter.current = 0;
        }
      } else if (cognitiveLoad < loadThresholds.low && currentMode === 'focus') {
        sustainedLoadCounter.current += checkIntervalMs;
        if (sustainedLoadCounter.current >= sustainedLoadDurationMs) {
          setUiMode('standard');
          sustainedLoadCounter.current = 0;
        }
      } else {
        sustainedLoadCounter.current = 0; // Reset counter if conditions change or load is not sustained
      }
    }, checkIntervalMs);

    return () => clearInterval(interval);
  }, [cognitiveLoad, uiMode, currentTask, loadThresholds, sustainedLoadDurationMs]);

  const registerUiElement = useCallback((id: string, type: UiElementType) => {
    registeredUiElements.current.set(id, type);
  }, []);

  const unregisterUiElement = useCallback((id: string) => {
    registeredUiElements.current.delete(id);
  }, []);

  const isElementVisible = useCallback((id: string, type: UiElementType): boolean => {
    const { isVisible } = adaptationPolicyManager.getUiElementState(uiMode, type);
    return isVisible;
  }, [uiMode, adaptationPolicyManager]);

  const getUiModeClassName = useCallback((uiType: UiElementType): string => {
    const { className } = adaptationPolicyManager.getUiElementState(uiMode, uiType);
    return className;
  }, [uiMode, adaptationPolicyManager]);


  const contextValue = {
    cognitiveLoad,
    uiMode,
    setUiMode,
    currentTask,
    registerUiElement,
    unregisterUiElement,
    isElementVisible,
    getUiModeClassName,
  };

  return (
    <CognitiveLoadContext.Provider value={contextValue}>
      <div className={`app-container mode-${uiMode}`}>
        {children}
        {/* Global styles for UI modes, dynamically inserted */}
        <style>{`
          .app-container.mode-focus .secondary-element.mode-focus-deemphasize {
            opacity: 0.15;
            pointer-events: none; /* Disable interaction */
            filter: blur(2px) grayscale(80%);
            transition: opacity 0.5s ease-in-out, filter 0.5s ease-in-out;
          }
          .app-container.mode-minimal .secondary-element,
          .app-container.mode-guided .secondary-element {
            opacity: 0;
            pointer-events: none;
            height: 0;
            overflow: hidden;
            margin: 0;
            padding: 0;
            transition: opacity 0.5s ease-in-out, height 0.5s ease-in-out, margin 0.5s ease-in-out, padding 0.5s ease-in-out;
          }
          .app-container.mode-focus .tertiary-element,
          .app-container.mode-minimal .tertiary-element,
          .app-container.mode-guided .tertiary-element {
            display: none; /* Fully hide tertiary elements */
            transition: display 0.5s ease-in-out;
          }
          .app-container.mode-guided .guided-element {
            border: 2px solid #28a745;
            background-color: #e6ffed;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            box-shadow: 0 0 8px rgba(40, 167, 69, 0.5);
            transition: all 0.3s ease-in-out;
          }
          /* Add more sophisticated styling rules as needed for different modes and element types */
        `}</style>
      </div>
    </CognitiveLoadContext.Provider>
  );
};

// Component that adapts based on the UI mode
export const AdaptableComponent: React.FC<{ id: string; uiType?: UiElementType; children: React.ReactNode }> = ({ id, uiType = UiElementType.PRIMARY, children }) => {
  const { isVisible, className } = useUiElement(id, uiType);

  if (!isVisible) return null;

  return <div id={id} className={className}>{children}</div>;
};

// Example usage of the provider and adaptable components
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cognitiveLoad, uiMode, currentTask } = useCognitiveLoadBalancer();
  const taskContextManager = TaskContextManager.getInstance();
  const interactionErrorLogger = InteractionErrorLogger.getInstance();


  const handleSetTask = (taskName: string, complexity: TaskContext['complexity']) => {
    taskContextManager.setTask({
      id: taskName.toLowerCase().replace(/\s/g, '-'),
      name: taskName,
      complexity: complexity,
      timestamp: performance.now(),
    });
  };

  const simulateFormError = () => {
    interactionErrorLogger.logError({
      type: 'validation',
      elementId: 'user-input',
      message: 'Simulated form validation error: Input cannot be empty.'
    });
    alert('Simulated a form validation error. This should contribute to cognitive load!');
  };

  return (
    <>
      <header style={{ padding: '10px', background: '#f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <AdaptableComponent id="main-logo" uiType={UiElementType.PRIMARY}>
          <h1>Demo Bank</h1>
        </AdaptableComponent>
        <AdaptableComponent id="user-info" uiType={UiElementType.SECONDARY}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>User: John Doe</span>
            <button style={{ marginLeft: '10px', padding: '5px 10px' }} onClick={() => alert('User Profile')}>Profile</button>
          </div>
        </AdaptableComponent>
        <AdaptableComponent id="global-nav-buttons" uiType={UiElementType.PRIMARY}>
          <nav>
            <button style={{ margin: '0 5px', padding: '5px 10px' }}>Dashboard</button>
            <button style={{ margin: '0 5px', padding: '5px 10px' }}>Accounts</button>
            <button style={{ margin: '0 5px', padding: '5px 10px' }}>Transfers</button>
          </nav>
        </AdaptableComponent>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 100px)' }}> {/* Assuming header/footer height */}
        <AdaptableComponent id="sidebar" uiType={UiElementType.SECONDARY}>
          <aside style={{ width: '200px', padding: '20px', background: '#e0e0e0', borderRight: '1px solid #ccc' }}>
            <h3>Secondary Menu</h3>
            <ul>
              <li><a href="#settings">Settings</a></li>
              <li><a href="#reports">Reports</a></li>
              <li><a href="#support">Support</a></li>
            </ul>
            <AdaptableComponent id="sidebar-ad" uiType={UiElementType.TERTIARY}>
              <div style={{ background: '#ccc', padding: '10px', marginTop: '20px', fontSize: '0.8em', textAlign: 'center' }}>
                Promotion: Get 0.5% Cashback!
              </div>
            </AdaptableComponent>
            <div style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
              <h4>Task Context Controls (Demo)</h4>
              <button onClick={() => handleSetTask('Browse Products', 'medium')} style={{ margin: '5px', padding: '5px' }}>Browse</button>
              <button onClick={() => handleSetTask('Complete Payment', 'critical')} style={{ margin: '5px', padding: '5px' }}>Payment</button>
              <button onClick={() => handleSetTask('Review Statement', 'low')} style={{ margin: '5px', padding: '5px' }}>Review</button>
              <button onClick={() => taskContextManager.setTask(null)} style={{ margin: '5px', padding: '5px' }}>Clear Task</button>
            </div>
          </aside>
        </AdaptableComponent>

        <main style={{ flexGrow: 1, padding: '20px', background: '#f9f9f9' }}>
          <h2>Current Cognitive Load: {cognitiveLoad.toFixed(2)} (UI Mode: {uiMode})</h2>
          <h3>Current Task: {currentTask?.name || 'N/A'} (Complexity: {currentTask?.complexity || 'N/A'})</h3>
          <p>This is the main content area. Interact with the application to observe UI adaptation.</p>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="user-input">Type here rapidly to increase load:</label>
            <input id="user-input" type="text" placeholder="Start typing..." style={{ margin: '10px 0', padding: '8px', width: '300px' }} />
            <button onClick={simulateFormError} style={{ marginLeft: '10px', padding: '8px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Simulate Form Error
            </button>
          </div>
          <button style={{ margin: '10px 0', padding: '10px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => console.log('Primary Action')}>Process Transaction</button>

          <AdaptableComponent id="optional-widget" uiType={UiElementType.SECONDARY}>
            <div style={{ background: '#f0f8ff', padding: '15px', border: '1px solid #add8e6', borderRadius: '5px', marginTop: '20px' }}>
              <h4>Optional Widget: Quick Stats</h4>
              <p>Balance: $12,345.67</p>
              <p>Last Login: 2 hours ago</p>
            </div>
          </AdaptableComponent>

          {uiMode === 'guided' && (
            <AdaptableComponent id="guided-steps" uiType={UiElementType.GUIDED}>
              <div style={{ background: '#e6ffed', padding: '20px', border: '2px solid #28a745', borderRadius: '5px', marginTop: '20px' }}>
                <h3>Step-by-Step Guidance for {currentTask?.name || 'Your Task'}</h3>
                <p>1. Review account details.</p>
                <p>2. Confirm recipient information.</p>
                <p>3. Authorize with your password.</p>
                <button style={{ marginTop: '10px', padding: '8px 15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
                  Next Step
                </button>
              </div>
            </AdaptableComponent>
          )}

          <div style={{ height: '500px', background: '#fafafa', overflowY: 'scroll', border: '1px solid #ddd', marginTop: '20px', resize: 'vertical' }}>
            <p>Scrollable Content: Scroll quickly up and down to simulate load from navigation/exploration.</p>
            {Array.from({ length: 50 }).map((_, i) => (
              <p key={i}>Item {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            ))}
          </div>
        </main>
      </div>

      <AdaptableComponent id="footer" uiType={UiElementType.SECONDARY}>
        <footer style={{ padding: '15px', background: '#f0f0f0', textAlign: 'center', borderTop: '1px solid #ccc' }}>
          &copy; 2024 Demo Bank. All rights reserved.
          <AdaptableComponent id="privacy-link" uiType={UiElementType.TERTIARY}>
            <span style={{ marginLeft: '20px', fontSize: '0.9em' }}><a href="#privacy">Privacy Policy</a></span>
          </AdaptableComponent>
        </footer>
      </AdaptableComponent>
    </>
  );
};

// Main application entry point
export const RootApp: React.FC = () => (
  <CognitiveLoadProvider>
    <AppLayout>
      {/* Children of AppLayout are rendered within the main content area */}
    </AppLayout>
  </CognitiveLoadProvider>
);