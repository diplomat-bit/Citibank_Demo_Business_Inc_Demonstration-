export enum UiElementType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  GUIDED = 'guided',
}

export type UiMode = 'standard' | 'focus' | 'minimal' | 'guided';

export interface MouseEventData {
  x: number;
  y: number;
  button: number;
  targetId: string;
  timestamp: number;
  targetBoundingRect?: DOMRectReadOnly;
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
  isValid?: boolean;
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

export interface MouseKinematicsFeatures {
  mouse_velocity_avg: number;
  mouse_acceleration_avg: number;
  mouse_path_tortuosity: number;
  mouse_dwell_time_avg: number;
  fitts_law_ip_avg: number;
}

export interface ClickDynamicsFeatures {
  click_frequency: number;
  click_latency_avg: number;
  target_acquisition_error_avg: number;
  double_click_frequency: number;
}

export interface ScrollDynamicsFeatures {
  scroll_velocity_avg: number;
  scroll_direction_changes: number;
  scroll_pause_frequency: number;
}

export interface KeyboardDynamicsFeatures {
  typing_speed_wpm: number;
  backspace_frequency: number;
  keystroke_latency_avg: number;
  error_correction_rate: number;
}

export interface InteractionErrorFeatures {
  form_validation_errors_count: number;
  repeated_action_attempts_count: number;
  navigation_errors_count: number;
}

export interface TaskContextFeatures {
  current_task_complexity: number;
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
  event_density: number;
}

export interface UserPreferences {
  preferredUiMode: UiMode;
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
  personalizedBaselineCLS: number;
}

export type TaskContext = {
  id: string;
  name: string;
  complexity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
};

/**
 * Interface for the Cognitive Load Predictor, enabling different ML models
 * to be swapped out if they adhere to this contract.
 */
export interface ICognitiveLoadPredictor {
  /**
   * Predicts the cognitive load score based on the given feature vector,
   * user preferences, and current task context.
   * @param features - The processed telemetry feature vector.
   * @param userPrefs - User-specific preferences including baseline CLS.
   * @param currentTask - The current task context.
   * @returns A normalized cognitive load score (0.0 to 1.0).
   */
  predict(
    features: TelemetryFeatureVector,
    userPrefs: UserPreferences,
    currentTask: TaskContext | null
  ): number;
  // In a real scenario, this might include methods for loading models, updating weights, etc.
  // updateModel?(modelPath: string): Promise<void>;
  // setWeights?(weights: any): void;
}

/**
 * Implements a sophisticated mock machine learning model for inferring cognitive load.
 * This class replaces a simple linear sum with a more robust, non-linear
 * combination of features, simulating a real-world ML prediction mechanism.
 *
 * The prediction logic incorporates:
 * - Personalized baseline from user preferences.
 * - Non-linear scaling of individual features.
 * - Interaction terms between related features.
 * - Stronger influence for direct error indicators.
 * - Impact of current task complexity.
 * - Sigmoid activation for final score normalization [0, 1].
 */
export class CognitiveLoadPredictor implements ICognitiveLoadPredictor {

  // Configuration for feature scaling and weights, mimicking trained model parameters
  private featureConfig = {
    // Scaling factors to normalize features, assume typical max values for a 1-second window
    scaling: {
      mouse_velocity_avg: 20, // px/ms
      mouse_acceleration_avg: 5, // px/ms^2
      mouse_path_tortuosity: 5, // ratio, e.g., 5x longer path than straight
      fitts_law_ip_avg: 10, // Max reasonable Index of Performance, higher is better (inverse relationship to load)
      target_acquisition_error_avg: 100, // px deviation from center
      click_frequency: 10, // clicks/sec
      click_latency_avg: 500, // ms between clicks (higher latency indicates struggle)
      double_click_frequency: 2, // double clicks / sec (can indicate hurriedness)
      scroll_velocity_avg: 2000, // px/sec
      scroll_direction_changes: 10, // count per second (high for erratic scrolling)
      scroll_pause_frequency: 5, // pauses per second (high for confusion/search)
      typing_speed_wpm: 120, // wpm (deviation from optimal affects load)
      backspace_frequency: 3, // backspaces / sec
      keystroke_latency_avg: 200, // ms between keydowns
      error_correction_rate: 1, // ratio (0-1), higher means more corrections
      form_validation_errors_count: 5, // count in window
      repeated_action_attempts_count: 3, // count in window
      navigation_errors_count: 3, // count in window
      event_density: 100, // total events per sec in window
    },
    // Weights for different components / feature groups
    weights: {
      baseline: 0.1,
      mouseComponent: 0.2,
      clickComponent: 0.25,
      keyboardComponent: 0.15,
      scrollComponent: 0.1,
      errorComponent: 0.35, // Errors are strong indicators, higher weight
      taskComplexity: 0.15,
      eventDensity: 0.05,
    },
    // Thresholds for non-linear impacts (e.g., very high backspace freq, low WPM)
    thresholds: {
      highBackspace: 1.5, // backspaces/sec
      lowWPM: 20, // Words Per Minute
      highTargetError: 50, // px
      lowFittsIP: 1, // Low Fitts' Law Index of Performance
    }
  };

  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  /**
   * Helper function to safely normalize a feature value between 0 and 1.
   * Clamps values to the expected max and handles potential division by zero.
   * @param value - The raw feature value.
   * @param maxValue - The maximum expected value for normalization.
   * @param invert - If true, normalize such that higher value means lower load (e.g., Fitts' IP).
   */
  private safeNormalize(value: number | undefined, maxValue: number, invert: boolean = false): number {
    if (value === undefined || maxValue === 0) {
      return 0;
    }
    let normalized = Math.min(1, Math.max(0, value / maxValue));
    return invert ? (1 - normalized) : normalized;
  }

  /**
   * Predicts the cognitive load score based on the given feature vector,
   * user preferences, and current task context.
   *
   * @param features - The processed telemetry feature vector.
   * @param userPrefs - User-specific preferences including baseline CLS.
   * @param currentTask - The current task context.
   * @returns A normalized cognitive load score (0.0 to 1.0).
   */
  public predict(
    features: TelemetryFeatureVector,
    userPrefs: UserPreferences,
    currentTask: TaskContext | null
  ): number {
    let rawLoadAccumulator = 0; // Accumulate raw contributions, then normalize with sigmoid

    // 1. Start with personalized baseline, scaled by its weight
    rawLoadAccumulator += userPrefs.personalizedBaselineCLS * this.featureConfig.weights.baseline * 2; // Scale baseline to have some initial impact

    // 2. Mouse Kinematics Component
    let mouseLoadContribution = 0;
    if (features.mouse) {
      const mouse = features.mouse;
      mouseLoadContribution += this.safeNormalize(mouse.mouse_velocity_avg, this.featureConfig.scaling.mouse_velocity_avg) * 0.4;
      mouseLoadContribution += this.safeNormalize(mouse.mouse_acceleration_avg, this.featureConfig.scaling.mouse_acceleration_avg) * 0.3;
      mouseLoadContribution += this.safeNormalize(mouse.mouse_path_tortuosity, this.featureConfig.scaling.mouse_path_tortuosity) * 0.3;
      // Inverse contribution from Fitts' Law IP: lower IP means higher load
      mouseLoadContribution += this.safeNormalize(mouse.fitts_law_ip_avg, this.featureConfig.scaling.fitts_law_ip_avg, true) * 0.2;

      // Interaction term: high tortuosity with low Fitts' Law IP (poor performance)
      if (mouse.mouse_path_tortuosity > 2 && mouse.fitts_law_ip_avg < this.featureConfig.thresholds.lowFittsIP) {
        mouseLoadContribution += 0.5; // Significant boost
      }
    }
    rawLoadAccumulator += mouseLoadContribution * this.featureConfig.weights.mouseComponent;

    // 3. Click Dynamics Component
    let clickLoadContribution = 0;
    if (features.clicks) {
      const clicks = features.clicks;
      clickLoadContribution += this.safeNormalize(clicks.click_frequency, this.featureConfig.scaling.click_frequency) * 0.3;
      clickLoadContribution += this.safeNormalize(clicks.click_latency_avg, this.featureConfig.scaling.click_latency_avg) * 0.2;
      clickLoadContribution += this.safeNormalize(clicks.target_acquisition_error_avg, this.featureConfig.scaling.target_acquisition_error_avg) * 0.5;
      clickLoadContribution += this.safeNormalize(clicks.double_click_frequency, this.featureConfig.scaling.double_click_frequency) * 0.2; // Double clicks might mean hurried interaction

      // Strong impact if target acquisition error is very high
      if (clicks.target_acquisition_error_avg > this.featureConfig.thresholds.highTargetError) {
        clickLoadContribution += 0.7; // Significant load increase
      }
    }
    rawLoadAccumulator += clickLoadContribution * this.featureConfig.weights.clickComponent;

    // 4. Keyboard Dynamics Component
    let keyboardLoadContribution = 0;
    if (features.keyboard) {
      const keyboard = features.keyboard;
      // Deviation from optimal WPM could indicate effort or struggle
      const optimalWPM = 60; // Example optimal WPM
      const wpmDeviationScore = Math.min(1, Math.abs(keyboard.typing_speed_wpm - optimalWPM) / optimalWPM) * 0.5;
      keyboardLoadContribution += wpmDeviationScore * 0.2;

      keyboardLoadContribution += this.safeNormalize(keyboard.backspace_frequency, this.featureConfig.scaling.backspace_frequency) * 0.4;
      keyboardLoadContribution += this.safeNormalize(keyboard.keystroke_latency_avg, this.featureConfig.scaling.keystroke_latency_avg) * 0.2;
      keyboardLoadContribution += this.safeNormalize(keyboard.error_correction_rate, this.featureConfig.scaling.error_correction_rate) * 0.5;

      // Interaction term: high backspace with high error correction rate
      if (keyboard.backspace_frequency > this.featureConfig.thresholds.highBackspace && keyboard.error_correction_rate > 0.5) {
        keyboardLoadContribution += 0.8; // Strong signal of frustration/load
      }
      // Very low WPM also indicates struggle
      if (keyboard.typing_speed_wpm > 0 && keyboard.typing_speed_wpm < this.featureConfig.thresholds.lowWPM) {
        keyboardLoadContribution += 0.6;
      }
    }
    rawLoadAccumulator += keyboardLoadContribution * this.featureConfig.weights.keyboardComponent;

    // 5. Scroll Dynamics Component
    let scrollLoadContribution = 0;
    if (features.scroll) {
      const scroll = features.scroll;
      scrollLoadContribution += this.safeNormalize(scroll.scroll_velocity_avg, this.featureConfig.scaling.scroll_velocity_avg) * 0.2;
      scrollLoadContribution += this.safeNormalize(scroll.scroll_direction_changes, this.featureConfig.scaling.scroll_direction_changes) * 0.4;
      scrollLoadContribution += this.safeNormalize(scroll.scroll_pause_frequency, this.featureConfig.scaling.scroll_pause_frequency) * 0.2;
      // High direction changes and pauses could indicate searching/confusion
      if (scroll.scroll_direction_changes > 5 && scroll.scroll_pause_frequency > 1) {
        scrollLoadContribution += 0.4;
      }
    }
    rawLoadAccumulator += scrollLoadContribution * this.featureConfig.weights.scrollComponent;

    // 6. Interaction Error Component (strongest and most direct indicators of load)
    let errorLoadContribution = 0;
    if (features.errors) {
      const errors = features.errors;
      errorLoadContribution += this.safeNormalize(errors.form_validation_errors_count, this.featureConfig.scaling.form_validation_errors_count) * 0.5;
      errorLoadContribution += this.safeNormalize(errors.repeated_action_attempts_count, this.featureConfig.scaling.repeated_action_attempts_count) * 0.4;
      errorLoadContribution += this.safeNormalize(errors.navigation_errors_count, this.featureConfig.scaling.navigation_errors_count) * 0.3;
      // Add a significant boost if any critical error occurs
      if (errors.form_validation_errors_count > 0 || errors.repeated_action_attempts_count > 0 || errors.navigation_errors_count > 0) {
        errorLoadContribution += 1.0; // Very strong impact
      }
    }
    rawLoadAccumulator += errorLoadContribution * this.featureConfig.weights.errorComponent;

    // 7. Task Context Contribution
    if (features.task_context) {
      rawLoadAccumulator += features.task_context.current_task_complexity * this.featureConfig.weights.taskComplexity;
      // Time in task can sometimes increase load (if task is complex and long)
      if (features.task_context.current_task_complexity > 0.5 && features.task_context.time_in_current_task_sec > 120) {
        rawLoadAccumulator += Math.min(0.5, (features.task_context.time_in_current_task_sec - 120) / 300) * 0.5; // Max 0.25 increase after 2 min, peaking at 5 min
      }
    }

    // 8. Event Density Contribution
    if (features.event_density !== undefined) {
      rawLoadAccumulator += this.safeNormalize(features.event_density, this.featureConfig.scaling.event_density) * this.featureConfig.weights.eventDensity;
    }

    // Final sigmoid activation to scale the entire score to [0, 1]
    // The 'bias' (e.g., -2.5) should be tuned based on what rawLoadAccumulator values typically signify low/high load.
    // A larger negative bias pushes the curve to the right, meaning higher raw scores are needed for a high CLS.
    const finalScore = this.sigmoid(rawLoadAccumulator - 2.5);

    return Math.min(1.0, Math.max(0.0, finalScore)); // Ensure it's strictly within 0 and 1
  }

  /**
   * Updates the internal model configuration. In a real ML system, this would
   * involve loading new model weights or updating hyperparameters.
   * For this mock, it directly updates the `featureConfig` object.
   * @param newConfig - A partial object containing new configuration values.
   */
  public updateModelConfig(newConfig: Partial<typeof CognitiveLoadPredictor.prototype.featureConfig>): void {
    if (newConfig.scaling) {
      this.featureConfig.scaling = { ...this.featureConfig.scaling, ...newConfig.scaling };
    }
    if (newConfig.weights) {
      this.featureConfig.weights = { ...this.featureConfig.weights, ...newConfig.weights };
    }
    if (newConfig.thresholds) {
      this.featureConfig.thresholds = { ...this.featureConfig.thresholds, ...newConfig.thresholds };
    }
    console.log("CognitiveLoadPredictor: Model configuration updated (mock)");
  }
}