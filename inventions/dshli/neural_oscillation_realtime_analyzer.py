import numpy as np
from scipy.signal import butter, lfilter, hilbert
from collections import deque
import time

# Constants for brainwave frequency bands (Hz)
# From Equation (105) and DSHLI description: various neural oscillations (Delta, Theta, Alpha, Beta, Gamma)
DELTA_BAND = (0.5, 4)
THETA_BAND = (4, 8)
ALPHA_BAND = (8, 13)
BETA_BAND = (13, 30)
GAMMA_BAND = (30, 50) # The ~40 Hz gamma band is highlighted for lucidity

class NeuralOscillationRealtimeAnalyzer:
    """
    Implements real-time brainwave signal processing and phase-locking algorithms
    to detect sleep stages and induce targeted lucid dream states, as specified
    for the Dream State Harmonizer & Lucid Interface (DSHLI).

    This class continuously analyzes incoming EEG-like data, identifies dominant
    neural oscillations, and calculates their instantaneous amplitude and phase,
    critical for generating phase-locked stimulation signals.
    """

    def __init__(self, sampling_rate: int = 256, buffer_duration: float = 5.0, history_size: int = 10):
        """
        Initializes the brainwave analyzer.

        Args:
            sampling_rate (int): The sampling rate of the EEG data in Hz.
            buffer_duration (float): The duration of the data buffer to analyze in seconds.
            history_size (int): Number of past analysis results to keep for trend detection.
        """
        self.sampling_rate = sampling_rate
        self.buffer_size = int(sampling_rate * buffer_duration)
        self.data_buffer = deque(maxlen=self.buffer_size)

        # Pre-compute filter coefficients for common brainwave bands
        self.filter_coeffs = {}
        for band_name, (lowcut, highcut) in [
            ("delta", DELTA_BAND),
            ("theta", THETA_BAND),
            ("alpha", ALPHA_BAND),
            ("beta", BETA_BAND),
            ("gamma", GAMMA_BAND)
        ]:
            b, a = butter(3, [lowcut, highcut], fs=sampling_rate, btype='band')
            self.filter_coeffs[band_name] = (b, a)

        self.analysis_history = deque(maxlen=history_size)
        print(f"DSHLI Neural Analyzer initialized. Buffer size: {self.buffer_size} samples ({buffer_duration}s).")
        print("Ready to decode the subtle whispers of the subconscious. Or at least, their electrical signatures.")

    def _apply_bandpass_filter(self, data: np.ndarray, band_name: str) -> np.ndarray:
        """
        Applies a Butterworth bandpass filter to the data for a specified band.

        Args:
            data (np.ndarray): The raw EEG data segment.
            band_name (str): Name of the frequency band (e.g., "alpha", "gamma").

        Returns:
            np.ndarray: Filtered data for the specified band.
        """
        b, a = self.filter_coeffs[band_name]
        return lfilter(b, a, data)

    def _get_instantaneous_properties(self, filtered_data: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
        """
        Computes instantaneous amplitude, phase, and frequency using the Hilbert transform.

        Args:
            filtered_data (np.ndarray): Single-band filtered data.

        Returns:
            tuple[np.ndarray, np.ndarray, np.ndarray]:
                - Instantaneous amplitude (envelope).
                - Instantaneous phase (in radians).
                - Instantaneous frequency (in Hz).
        """
        analytic_signal = hilbert(filtered_data)
        amplitude = np.abs(analytic_signal)
        phase = np.unwrap(np.angle(analytic_signal)) # Unwrap phase to avoid jumps
        # Instantaneous frequency is the derivative of the unwrapped phase
        # d(phase)/dt = 2*pi*f_inst -> f_inst = (1/2*pi) * d(phase)/dt
        frequency = (np.diff(phase) / (2.0 * np.pi)) * self.sampling_rate
        return amplitude, phase, np.insert(frequency, 0, frequency[0]) # Pad frequency to match length

    def add_data_chunk(self, new_data: np.ndarray):
        """
        Adds a new chunk of EEG data to the internal buffer.

        Args:
            new_data (np.ndarray): A 1D numpy array of new EEG samples.
        """
        for sample in new_data:
            self.data_buffer.append(sample)

    def analyze_brainwaves(self) -> dict:
        """
        Analyzes the current data buffer to determine the instantaneous properties
        (amplitude, phase, frequency) for all predefined brainwave bands.
        This provides the A_k, phi_k, omega_k for each oscillation.

        Returns:
            dict: A dictionary containing analysis results for each band,
                  or None if the buffer is not full.
        """
        if len(self.data_buffer) < self.buffer_size:
            # print("Buffer not full yet, waiting for more data...")
            return None

        current_data = np.array(self.data_buffer)
        results = {"timestamp": time.time()}

        for band_name, _ in self.filter_coeffs.items():
            filtered_data = self._apply_bandpass_filter(current_data, band_name)
            amp, phase, freq = self._get_instantaneous_properties(filtered_data)

            # We care about the *average* or *dominant* amplitude/phase/frequency
            # in the current buffer, but for phase-locking we need the *last* phase.
            results[band_name] = {
                "avg_amplitude": np.mean(amp),
                "avg_frequency": np.mean(freq) if band_name != "gamma" else np.mean(freq[freq > GAMMA_BAND[0]]), # More specific for gamma
                "last_phase": phase[-1] if len(phase) > 0 else 0.0, # The phase to synchronize with
                "data_segment": filtered_data # For potential external use or debugging
            }
        
        # Add analysis to history
        self.analysis_history.append(results)
        return results

    def detect_sleep_stage(self, brainwave_analysis: dict) -> str:
        """
        Detects a simplified sleep stage based on brainwave activity.
        This is a conceptual implementation following the DSHLI blueprint.

        Args:
            brainwave_analysis (dict): The output from analyze_brainwaves.

        Returns:
            str: The detected sleep stage (e.g., "Awake", "Light Sleep", "REM", "Lucid").
        """
        if brainwave_analysis is None:
            return "Analyzing..."

        # Simplified rules, inspired by the DSHLI description's focus on REM and Gamma
        theta_amp = brainwave_analysis["theta"]["avg_amplitude"]
        delta_amp = brainwave_analysis["delta"]["avg_amplitude"]
        alpha_amp = brainwave_analysis["alpha"]["avg_amplitude"]
        gamma_amp = brainwave_analysis["gamma"]["avg_amplitude"]

        # REM sleep is characterized by low amplitude, mixed frequency EEG,
        # with prominent theta and desynchronized alpha.
        # Lucidity is associated with increased gamma activity and coherence.

        if alpha_amp > 0.5 * beta_amp: # Arbitrary threshold, needs empirical tuning
             return "Awake/Relaxed"
        if delta_amp > 1.5 * theta_amp:
            return "Deep Sleep"
        if theta_amp > 1.2 * alpha_amp and gamma_amp < 0.8 * beta_amp:
            return "REM Sleep Detected" # Thresholds need empirical validation
        if gamma_amp > 1.5 * (alpha_amp + beta_amp) and theta_amp > 1.0 * alpha_amp:
            # This is the "money shot" for DSHLI, targeting that ~40 Hz gamma coherence
            return "Lucid State Potential (High Gamma Coherence)"

        return "Light Sleep/Undetermined"

    def generate_phase_locked_stimulus(self, target_frequency: float, target_phase_offset: float = 0.0,
                                      amplitude: float = 1.0, duration: float = 0.1) -> np.ndarray:
        """
        Generates a short, phase-locked electromagnetic or auditory stimulus.
        This represents the DSHLI's "targeted electromagnetic fields or precisely timed
        auditory/olfactory cues" that are "phase-locked with endogenous neural oscillations".

        Args:
            target_frequency (float): The frequency (in Hz) of the desired brainwave band
                                      to phase-lock with (e.g., 40 Hz for Gamma).
            target_phase_offset (float): Desired phase offset (in radians) from the
                                         detected neural oscillation's phase.
            amplitude (float): Amplitude of the generated stimulus signal.
            duration (float): Duration of the stimulus in seconds.

        Returns:
            np.ndarray: The phase-locked stimulus signal.
        """
        # Determine the current phase to lock to. For lucidity, often gamma.
        # We need the most recent analysis for this.
        if not self.analysis_history:
            print("No brainwave analysis history to derive phase from. Generating a generic stimulus.")
            # Fallback to a simple sine wave if no phase can be derived
            t = np.linspace(0, duration, int(self.sampling_rate * duration), endpoint=False)
            return amplitude * np.sin(2 * np.pi * target_frequency * t)

        latest_analysis = self.analysis_history[-1]
        
        # Find the closest band to the target frequency, and use its last phase
        closest_band_name = "gamma" # Default to gamma for lucidity, as per DSHLI
        if target_frequency > BETA_BAND[1] and target_frequency < GAMMA_BAND[1]:
            closest_band_name = "gamma"
        elif target_frequency > ALPHA_BAND[1] and target_frequency < BETA_BAND[1]:
            closest_band_name = "beta"
        # ... more robust band selection logic could be added here.

        detected_phase = latest_analysis.get(closest_band_name, {}).get("last_phase", 0.0)

        # Generate stimulus based on the detected phase and target frequency
        num_samples = int(self.sampling_rate * duration)
        t = np.linspace(0, duration, num_samples, endpoint=False)
        
        # S(t) = A_k cos(omega_k t + phi_k)
        # We are generating a signal with the same omega_k (target_frequency),
        # and aligned with the detected phi_k.
        stimulus_signal = amplitude * np.sin(2 * np.pi * target_frequency * t + detected_phase + target_phase_offset)
        print(f"Generating {target_frequency}Hz phase-locked stimulus. Locked to {closest_band_name} phase ({np.degrees(detected_phase):.2f} deg).")
        return stimulus_signal

    def get_brainwave_oscillations(self) -> dict:
        """
        Returns the most recent calculated instantaneous amplitude, frequency, and phase
        for all defined brainwave bands, directly mapping to A_k, omega_k, and phi_k.
        """
        if not self.analysis_history:
            return {}
        
        latest_analysis = self.analysis_history[-1]
        oscillations = {}
        for band_name, data in latest_analysis.items():
            if isinstance(data, dict): # Skip timestamp
                oscillations[band_name] = {
                    "amplitude": data["avg_amplitude"],
                    "frequency": data["avg_frequency"],
                    "phase": data["last_phase"]
                }
        return oscillations

# Example Usage
if __name__ == "__main__":
    # Simulate EEG data acquisition
    def generate_eeg_chunk(sampling_rate: int, duration: float, noise_level: float = 0.1,
                           dominant_freq: float = 10, amplitude: float = 0.5) -> np.ndarray:
        """Generates a synthetic EEG-like data chunk with some dominant frequency."""
        t = np.linspace(0, duration, int(sampling_rate * duration), endpoint=False)
        
        # Base signal (e.g., alpha rhythm for relaxed state)
        signal = amplitude * np.sin(2 * np.pi * dominant_freq * t + np.random.rand() * np.pi * 2)
        
        # Add some other bands to make it more complex
        signal += 0.2 * np.sin(2 * np.pi * THETA_BAND[0] * t + np.random.rand() * np.pi * 2) # Theta for REM
        signal += 0.1 * np.sin(2 * np.pi * GAMMA_BAND[0] * t + np.random.rand() * np.pi * 2) # Gamma for lucidity
        
        # Add random noise
        signal += noise_level * np.random.randn(len(t))
        return signal

    SR = 256  # Sampling rate
    BUFFER_DUR = 2.0 # Analyze 2 seconds of data at a time
    CHUNK_DUR = 0.1 # Simulate receiving data in 0.1 second chunks

    analyzer = NeuralOscillationRealtimeAnalyzer(sampling_rate=SR, buffer_duration=BUFFER_DUR)

    print("\n--- Simulating Real-time EEG Data Stream ---")
    print("Watching for REM sleep and potential lucid states...")

    simulation_time = 0
    total_sim_duration = 30 # seconds

    while simulation_time < total_sim_duration:
        # Simulate different brain states over time
        if simulation_time < 5:
            # Awake/Relaxed state (dominant alpha)
            eeg_chunk = generate_eeg_chunk(SR, CHUNK_DUR, dominant_freq=10, amplitude=1.0)
            print(f"\nSim Time: {simulation_time:.1f}s - State: Awake/Relaxed")
        elif simulation_time < 15:
            # Transition to REM-like state (more theta, less alpha)
            eeg_chunk = generate_eeg_chunk(SR, CHUNK_DUR, dominant_freq=6, amplitude=0.8, noise_level=0.2)
            print(f"\nSim Time: {simulation_time:.1f}s - State: Entering REM")
        elif simulation_time < 25:
            # Lucid state (strong gamma with theta)
            eeg_chunk = generate_eeg_chunk(SR, CHUNK_DUR, dominant_freq=40, amplitude=0.7, noise_level=0.1) # Simulate strong gamma
            eeg_chunk += 0.5 * generate_eeg_chunk(SR, CHUNK_DUR, dominant_freq=6, amplitude=0.5, noise_level=0.0) # Add strong theta
            print(f"\nSim Time: {simulation_time:.1f}s - State: Lucid Dream Inducement Attempted!")
        else:
            # Back to deep sleep (more delta)
            eeg_chunk = generate_eeg_chunk(SR, CHUNK_DUR, dominant_freq=2, amplitude=1.2, noise_level=0.3)
            print(f"\nSim Time: {simulation_time:.1f}s - State: Deep Sleep")

        analyzer.add_data_chunk(eeg_chunk)
        current_analysis = analyzer.analyze_brainwaves()

        if current_analysis:
            stage = analyzer.detect_sleep_stage(current_analysis)
            print(f"  Detected Stage: {stage}")

            # Example of how DSHLI would use this:
            # If REM or Lucid state is detected, generate a phase-locked stimulus.
            if "REM" in stage or "Lucid" in stage:
                # Target the 40Hz gamma for lucidity enhancement, as per the blueprint
                lucid_stimulus = analyzer.generate_phase_locked_stimulus(
                    target_frequency=40.0,
                    target_phase_offset=np.pi/2, # A common offset for entrainment, needs empirical tuning
                    amplitude=0.5,
                    duration=0.2 # Short stimulus burst
                )
                print(f"  Generated {len(lucid_stimulus)} samples of lucid stimulus signal.")
                # In a real system, this signal would be sent to EM field emitters or auditory cues.
            
            # Print the most recent oscillation parameters for one band as an example
            oscillations = analyzer.get_brainwave_oscillations()
            if "gamma" in oscillations:
                gamma_data = oscillations["gamma"]
                print(f"  Gamma: Amp={gamma_data['amplitude']:.2f}, Freq={gamma_data['frequency']:.2f}Hz, Phase={np.degrees(gamma_data['phase']):.2f} deg")

        time.sleep(CHUNK_DUR / 2) # Simulate processing time slightly faster than data chunks
        simulation_time += CHUNK_DUR

    print("\n--- Simulation Complete ---")
    print("The DSHLI relentlessly seeks to unlock the mind's ultimate canvas. Truly, an engineering optimism with a caffeine problem.")