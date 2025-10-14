
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
    const storedPrefs = typeof window !== 'undefined' ? localStorage.getItem('userCognitiveLoadPrefs') : null;
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
    if (typeof window !== 'undefined') {
      localStorage.setItem('userCognitiveLoadPrefs', JSON.stringify(this.currentPreferences));
    }
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
    if (typeof performance !== 'undefined') {
      this.setTask({ id: 'app_init', name: 'Application Initialization', complexity: 'low', timestamp: performance.now() });
    } else {
      this.setTask({ id: 'app_init', name: 'Application Initialization', complexity: 'low', timestamp: 0 });
    }
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
    // console.log(`TaskContextManager: Current task set to ${task?.name || 'N/A'} (Complexity: ${task?.complexity || 'N/A'})`);
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
    if (typeof setInterval !== 'undefined') {
      this.bufferFlushInterval = setInterval(this.flushBuffer, this.bufferFlushRateMs);
    }
  }

  public static getInstance(): InteractionErrorLogger {
    if (!InteractionErrorLogger.instance) {
      InteractionErrorLogger.instance = new InteractionErrorLogger();
    }
    return InteractionErrorLogger.instance;
  }

  public logError(error: Omit<InteractionError, 'id' | 'timestamp'>): void {
    if (typeof performance === 'undefined') return; // Skip if no performance API

    const newError: InteractionError = {
      id: `error-${performance.now()}-${Math.random().toString(36).substring(7)}`,
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

  private interactionErrorLogger = InteractionErrorLogger.getInstance();
  private taskContextManager = TaskContextManager.getInstance();

  constructor(featureProcessingCallback: (features: TelemetryFeatureVector) => void) {
    this.featureProcessingCallback = featureProcessingCallback;
  }

  public initListeners(): void {
    if (typeof window === 'undefined' || typeof performance === 'undefined') return;

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
        // const duration = timestamp - focusTime!;
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
    if (typeof performance === 'undefined') {
        return { timestamp_window_end: Date.now(), event_density: 0 };
    }
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
    // let mouseDwellTimeAvg = 0; // Needs more complex tracking over specific elements
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
    let prevScrollYValue: number | null = null;
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
          if (prevScrollYValue !== null && prevScrollYValue === s2.scrollY) {
            scrollPauseCount++;
          }
        }
        prevScrollYValue = s2.scrollY;
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
    if (typeof window !== 'undefined') {
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
    }
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

  constructor(onUpdate: (load: number) => void) {
    this.onCognitiveLoadUpdate = onUpdate;
    if (typeof setInterval !== 'undefined') {
      this.predictionTimer = setInterval(this.inferLoad, this.predictionIntervalMs);
    }
  }

  public processFeatures(featureVector: TelemetryFeatureVector): void {
    this.latestFeatureVector = featureVector;
  }

  // A more sophisticated mock machine learning model for cognitive load prediction
  private mockPredict(features: TelemetryFeatureVector): number {
    const prefs = this.userProfileService.getPreferences();
    let score = prefs.personalizedBaselineCLS; // Start with baseline

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
    // console.log('CognitiveLoadEngine: Model weights updated (mock)');
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
  private static instance: AdaptationPolicyPolicyManager;
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

// --- Cognitive Load Balancer Service ---
export class CognitiveLoadBalancerService {
  private static instance: CognitiveLoadBalancerService;

  private userProfileService: UserProfileService;
  private taskContextManager: TaskContextManager;
  private interactionErrorLogger: InteractionErrorLogger;
  private adaptationPolicyManager: AdaptationPolicyManager;
  private telemetryAgent: TelemetryAgent;
  private cognitiveLoadEngine: CognitiveLoadEngine;

  private _cognitiveLoad: number = 0.0;
  private _uiMode: UiMode = 'standard';
  private _currentTask: TaskContext | null = null;
  private _loadThresholds: UserPreferences['cognitiveLoadThresholds'];

  private _sustainedLoadCounter: number = 0;
  private readonly _checkIntervalMs: number = 500;
  private readonly _sustainedLoadDurationMs: number = 1500;
  private _modeTransitionInterval: ReturnType<typeof setInterval> | null = null;

  private _loadSubscribers: Set<(load: number) => void> = new Set();
  private _modeSubscribers: Set<(mode: UiMode) => void> = new Set();
  private _taskSubscribers: Set<(task: TaskContext | null) => void> = new Set();

  private constructor() {
    this.userProfileService = UserProfileService.getInstance();
    this.taskContextManager = TaskContextManager.getInstance();
    this.interactionErrorLogger = InteractionErrorLogger.getInstance();
    this.adaptationPolicyManager = AdaptationPolicyManager.getInstance();

    this._loadThresholds = this.userProfileService.getPreferences().cognitiveLoadThresholds;

    this.telemetryAgent = new TelemetryAgent(this._handleFeatureVector);
    this.cognitiveLoadEngine = new CognitiveLoadEngine(this._handleCognitiveLoad);

    this.taskContextManager.subscribe(this._handleTaskContext);
  }

  public static getInstance(): CognitiveLoadBalancerService {
    if (!CognitiveLoadBalancerService.instance) {
      CognitiveLoadBalancerService.instance = new CognitiveLoadBalancerService();
    }
    return CognitiveLoadBalancerService.instance;
  }

  private _handleFeatureVector = (features: TelemetryFeatureVector): void => {
    this.cognitiveLoadEngine.processFeatures(features);
  };

  private _handleCognitiveLoad = (load: number): void => {
    if (load !== this._cognitiveLoad) {
      this._cognitiveLoad = load;
      this._loadSubscribers.forEach(callback => callback(this._cognitiveLoad));
    }
  };

  private _handleTaskContext = (task: TaskContext | null): void => {
    if (task !== this._currentTask) {
      this._currentTask = task;
      this._taskSubscribers.forEach(callback => callback(this._currentTask));
    }
  };

  private _setUiMode = (newMode: UiMode): void => {
    if (newMode !== this._uiMode) {
      this._uiMode = newMode;
      this._modeSubscribers.forEach(callback => callback(this._uiMode));
      // console.log(`UI Mode changed to: ${this._uiMode}`);
    }
  };

  private _checkUiModeTransition = (): void => {
    const currentMode = this._uiMode;
    const cognitiveLoad = this._cognitiveLoad;
    const thresholds = this._loadThresholds;
    const taskComplexity = this._currentTask?.complexity === 'critical' || this._currentTask?.complexity === 'high'; // Simplified check

    let nextMode: UiMode = currentMode;
    let shouldIncrementCounter = false;

    if (cognitiveLoad > thresholds.critical && currentMode !== 'minimal') {
      nextMode = 'minimal';
      shouldIncrementCounter = true;
    } else if (cognitiveLoad < thresholds.criticalLow && currentMode === 'minimal') {
      nextMode = 'focus';
      shouldIncrementCounter = true;
    } else if (cognitiveLoad > thresholds.guided && taskComplexity && currentMode !== 'guided') {
      nextMode = 'guided';
      shouldIncrementCounter = true;
    } else if (cognitiveLoad < thresholds.guidedLow && currentMode === 'guided' && !taskComplexity) {
      nextMode = 'focus';
      shouldIncrementCounter = true;
    } else if (cognitiveLoad > thresholds.high && currentMode === 'standard') {
      nextMode = 'focus';
      shouldIncrementCounter = true;
    } else if (cognitiveLoad < thresholds.low && currentMode === 'focus') {
      nextMode = 'standard';
      shouldIncrementCounter = true;
    }

    if (shouldIncrementCounter && nextMode === currentMode) {
        // Only increment if the *conditions for the current mode* are still met
        // to prevent false positives when load fluctuates around a threshold.
        // Or, if the intended next mode is different, we increment towards it.
        // The logic below ensures counter only increments if the target nextMode has been stable.
    }


    if (nextMode !== currentMode) {
      this._sustainedLoadCounter += this._checkIntervalMs;
      if (this._sustainedLoadCounter >= this._sustainedLoadDurationMs) {
        this._setUiMode(nextMode);
        this._sustainedLoadCounter = 0; // Reset after transition
      }
    } else {
      this._sustainedLoadCounter = 0; // Reset if conditions for transition are no longer met
    }
  };

  public start(): void {
    // console.log('CognitiveLoadBalancerService starting...');
    this.telemetryAgent.initListeners();
    if (typeof setInterval !== 'undefined') {
      this._modeTransitionInterval = setInterval(this._checkUiModeTransition, this._checkIntervalMs);
    }
    // Initial notifications
    this._loadSubscribers.forEach(callback => callback(this._cognitiveLoad));
    this._modeSubscribers.forEach(callback => callback(this._uiMode));
    this._taskSubscribers.forEach(callback => callback(this._currentTask));
  }

  public stop(): void {
    // console.log('CognitiveLoadBalancerService stopping...');
    this.telemetryAgent.stop();
    this.cognitiveLoadEngine.stop();
    this.interactionErrorLogger.stop();
    if (this._modeTransitionInterval) {
      clearInterval(this._modeTransitionInterval);
    }
    this._loadSubscribers.clear();
    this._modeSubscribers.clear();
    this._taskSubscribers.clear();
  }

  public getCognitiveLoad(): number {
    return this._cognitiveLoad;
  }

  public getUiMode(): UiMode {
    return this._uiMode;
  }

  public getCurrentTask(): TaskContext | null {
    return this._currentTask;
  }

  public subscribeToLoad(callback: (load: number) => void): () => void {
    this._loadSubscribers.add(callback);
    callback(this._cognitiveLoad); // Immediate notification
    return () => this._loadSubscribers.delete(callback);
  }

  public subscribeToUiMode(callback: (mode: UiMode) => void): () => void {
    this._modeSubscribers.add(callback);
    callback(this._uiMode); // Immediate notification
    return () => this._modeSubscribers.delete(callback);
  }

  public subscribeToTaskContext(callback: (task: TaskContext | null) => void): () => void {
    this._taskSubscribers.add(callback);
    callback(this._currentTask); // Immediate notification
    return () => this._taskSubscribers.delete(callback);
  }

  /**
   * Provides UI adaptation state for a given element type based on the current UI mode.
   * Frameworks can use this to apply dynamic styling or conditional rendering.
   * @param uiType The type of the UI element (e.g., PRIMARY, SECONDARY, TERTIARY).
   * @returns An object indicating visibility and appropriate CSS class name.
   */
  public getUiElementAdaptationState(uiType: UiElementType): { isVisible: boolean; className: string } {
    return this.adaptationPolicyManager.getUiElementState(this._uiMode, uiType);
  }

  // Expose TaskContextManager for external task setting (e.g., from UI components)
  public getTaskContextManager(): TaskContextManager {
    return this.taskContextManager;
  }

  // Expose InteractionErrorLogger for external error logging (e.g., from validation logic)
  public getInteractionErrorLogger(): InteractionErrorLogger {
    return this.interactionErrorLogger;
  }

  // Expose UserProfileService for external preference management
  public getUserProfileService(): UserProfileService {
    return this.userProfileService;
  }
}