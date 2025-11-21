import numpy as np
import collections

class MicroclimateController:
    """
    Manages the adaptive control logic for localized atmospheric modulation within the
    Adaptive Personal Weather Control Grids (APWCG).

    This controller implements a robust feedback mechanism to precisely adjust
    temperature and relative humidity towards target values, counteracting natural
    variability and achieving stable microclimates. It leverages predictive models
    and a differential control strategy to orchestrate Atmospheric Modulation Units (AMUs).
    This system is designed for unparalleled resilience against climate variability and
    to enhance habitability, ensuring that desired conditions are not merely achieved but sustained.
    """

    def __init__(self,
                 target_temperature: float = 295.15,  # Kelvin (e.g., 22 C)
                 target_humidity: float = 0.60,      # Relative Humidity (0-1, e.g., 60%)
                 control_alpha: float = 0.05,       # Proportional gain for temperature deviation
                 control_beta: float = 0.02,        # Proportional gain for humidity deviation
                 prediction_horizon_steps: int = 5,   # Number of future time steps for proactive prediction
                 history_buffer_size: int = 20):      # Size of historical data for internal predictive model
        """
        Initializes the MicroclimateController with target conditions and tunable control gains.

        Parameters:
            target_temperature (float): The desired temperature setpoint in Kelvin.
            target_humidity (float): The desired relative humidity setpoint (0.0 to 1.0).
            control_alpha (float): The proportional gain (ÃŽÂ±) for temperature deviation. Higher values
                                   result in more aggressive temperature adjustments by AMUs.
            control_beta (float): The proportional gain (ÃŽÂ²) for humidity deviation. Higher values
                                  result in more aggressive humidity adjustments by AMUs.
            prediction_horizon_steps (int): The number of future discrete time steps the internal
                                            predictive model considers for proactive control actions.
            history_buffer_size (int): The capacity of the historical data buffer, used for internal
                                       predictive modeling and trend analysis.
        """
        self.target_temperature = target_temperature
        self.target_humidity = target_humidity
        self.alpha = control_alpha
        self.beta = control_beta
        self.prediction_horizon_steps = prediction_horizon_steps

        # Initialize the current atmospheric state. In a deployed system, these values
        # would be continuously streamed from real-time sensor networks.
        self._current_temperature = target_temperature + np.random.uniform(-2.0, 2.0)
        self._current_humidity = target_humidity + np.random.uniform(-0.1, 0.1)

        # Historical data buffers to feed the internal predictive model.
        # These are crucial for building a robust `hyper-local predictive model`.
        self.temp_history = collections.deque([self._current_temperature] * history_buffer_size, maxlen=history_buffer_size)
        self.humidity_history = collections.deque([self._current_humidity] * history_buffer_size, maxlen=history_buffer_size)

    def _predict_atmospheric_state(self) -> tuple[float, float]:
        """
        Predicts the future atmospheric state (temperature and humidity) for the
        next control cycle based on historical data and internal models.

        In a production-grade APWCG, this would involve highly sophisticated
        AI models, such as Graph Neural Networks integrating data from myriad
        sensors, atmospheric physics simulations, and satellite imagery to provide
        hyper-local, real-time weather forecasts. For this conceptual framework,
        a simplified statistical model (e.g., moving average with simulated drift)
        is employed to represent dynamic atmospheric behavior.

        Returns:
            tuple[float, float]: The predicted temperature in Kelvin and predicted
                                 relative humidity (0.0 to 1.0) for the next cycle.
        """
        # A simple model: average of recent history with simulated external noise/drift
        # This is where `hyper-local predictive models` from the blueprint are conceptually applied.
        predicted_temp = (np.mean(list(self.temp_history)[-self.prediction_horizon_steps:])
                          if len(self.temp_history) >= self.prediction_horizon_steps else self._current_temperature)
        predicted_humidity = (np.mean(list(self.humidity_history)[-self.prediction_horizon_steps:])
                              if len(self.humidity_history) >= self.prediction_horizon_steps else self._current_humidity)

        # Introduce some simulated natural variability and external influences (e.g., solar flux changes, wind shifts)
        predicted_temp += np.random.normal(0, 0.1) * (self.prediction_horizon_steps / 5.0)
        predicted_humidity += np.random.normal(0, 0.005) * (self.prediction_horizon_steps / 5.0)

        return predicted_temp, predicted_humidity

    def calculate_control_output(self,
                                 current_temperature: float,
                                 current_humidity: float) -> tuple[float, float]:
        """
        Calculates the required change in atmospheric energy and moisture content
        based on the observed or predicted deviation from target conditions. This
        function directly implements the core feedback control logic as described
        by Equation 108 in the architectural blueprint:

        `dT/dt = alpha * (T_target - T_current)`
        `dRH/dt = beta * (RH_target - RH_current)`

        These calculated rates of change represent the desired "force" or "push"
        that the AMUs must exert on the atmospheric parameters to drive them
        towards the defined setpoints. This is the heart of the "real-time, dynamic
        control of atmospheric thermodynamics."

        Parameters:
            current_temperature (float): The current observed or predicted temperature in Kelvin.
            current_humidity (float): The current observed or predicted relative humidity (0.0 to 1.0).

        Returns:
            tuple[float, float]: A tuple representing the desired instantaneous rate of change
                                 for temperature (K/s) and relative humidity (unitless/s).
                                 These values dictate the magnitude and direction of AMU actions.
        """
        temp_error = self.target_temperature - current_temperature
        humidity_error = self.target_humidity - current_humidity

        # Apply proportional control: the larger the error, the stronger the desired correction.
        desired_temp_rate_of_change = self.alpha * temp_error
        desired_humidity_rate_of_change = self.beta * humidity_error

        return desired_temp_rate_of_change, desired_humidity_rate_of_change

    def _translate_to_amu_commands(self,
                                   desired_temp_rate: float,
                                   desired_humidity_rate: float) -> dict:
        """
        Translates the desired rates of change (from `calculate_control_output`) into
        concrete, actionable commands for the distributed Atmospheric Modulation Units (AMUs).
        This constitutes the effector layer of the "Climatic Loom."

        Parameters:
            desired_temp_rate (float): The desired rate of change for temperature (K/s).
            desired_humidity_rate (float): The desired rate of change for relative humidity (unitless/s).

        Returns:
            dict: A dictionary containing standardized commands for various AMU functionalities,
                  such as directed energy output, aerosol injection rates, and ionization levels.
        """
        commands = {
            "directed_energy_output_watts": 0.0,  # Positive for heating, negative for cooling/absorption
            "aerosol_injection_rate_grams_per_sec": 0.0, # Positive for moisture/cloud seeding, negative for desiccant/dissipation
            "ionization_charge_density_coulombs_per_m3": 0.0 # For inducing precipitation or dissipating fog
        }

        # Temperature modulation via Directed Energy Emitters (Heating/Cooling)
        # Conceptual scaling: Larger rate implies more energy. Max 50kW capacity per unit.
        energy_command = desired_temp_rate * 1000 # Scaling factor to convert K/s to Watts (conceptual)
        commands["directed_energy_output_watts"] = np.clip(energy_command, -50000, 50000) # Capped at +/- 50kW

        # Humidity modulation via Aerosol Injectors and Ionization & Charge Inducers
        # Conceptual scaling: Larger rate implies more aerosol/charge. Max 500 g/s or 100 C/m3.
        aerosol_command = desired_humidity_rate * 50 # Scaling factor (conceptual)
        commands["aerosol_injection_rate_grams_per_sec"] = np.clip(aerosol_command, -500, 500)

        # Ionization primarily for precipitation induction or suppression
        ionization_command = desired_humidity_rate * -100 # Inverted relationship: positive humidity error -> negative ionization
        commands["ionization_charge_density_coulombs_per_m3"] = np.clip(ionization_command, -100, 100)

        # Ensure minimal commands if deviations are negligible
        if abs(desired_temp_rate) < 0.0001: commands["directed_energy_output_watts"] = 0.0
        if abs(desired_humidity_rate) < 0.00001:
            commands["aerosol_injection_rate_grams_per_sec"] = 0.0
            commands["ionization_charge_density_coulombs_per_m3"] = 0.0

        return commands

    def _simulate_environmental_response(self,
                                        amu_commands: dict,
                                        time_step: float = 60.0) -> None:
        """
        Simulates the effect of issued AMU commands on the microclimate.
        In a fully operational APWCG, this process would be replaced by
        real-time atmospheric sensor data feedback, validated by the
        Chronospatial Data Weave. This serves as a critical conceptual forward model
        to assess command efficacy and inform further control decisions.

        Parameters:
            amu_commands (dict): The consolidated commands issued to the AMUs.
            time_step (float): The duration of the simulation step in seconds,
                               representing the interval between control cycles.
        """
        # Simplified atmospheric response model: Energy directly affects temperature
        # 100kW applied for 1 hour might change a cubic km of air by ~1K (very rough approximation)
        # Assuming our 'zone' is a conceptual volume, this scales the impact.
        # This function would be a high-fidelity atmospheric physics simulation in reality.
        temp_change_from_energy = amu_commands["directed_energy_output_watts"] / (100 * 1000) * (time_step / 3600) # kW-hours to K change

        # Aerosols and ionization affect humidity and potentially temperature (latent heat effects)
        humidity_change_from_aerosols = amu_commands["aerosol_injection_rate_grams_per_sec"] / 100000 * time_step
        humidity_change_from_ionization = amu_commands["ionization_charge_density_coulombs_per_m3"] / 10000 * time_step

        self._current_temperature += temp_change_from_energy
        self._current_humidity += (humidity_change_from_aerosols + humidity_change_from_ionization)

        # Enforce physical bounds for humidity
        self._current_humidity = np.clip(self._current_humidity, 0.01, 0.99)

        # Introduce some persistent natural "noise" or environmental drift to represent
        # the chaotic nature of weather, which the system must continuously counteract.
        self._current_temperature += np.random.normal(0, 0.02) * (time_step / 3600)
        self._current_humidity += np.random.normal(0, 0.0005) * (time_step / 3600)

        # Update historical data for the predictive model's next cycle.
        self.temp_history.append(self._current_temperature)
        self.humidity_history.append(self._current_humidity)

    def run_control_cycle(self, time_step: float = 60.0) -> dict:
        """
        Executes a single, comprehensive control cycle for the microclimate.
        This orchestration of sensing, prediction, decision-making, and action
        is what enables the APWCG to maintain precise localized weather conditions
        against the inherent unpredictability of natural atmospheric systems.

        The sequence of operations is:
        1. Capture (or refresh) the current atmospheric state.
        2. Proactively predict the atmospheric state for the near future.
        3. Calculate optimal control outputs (desired rates of change) based on deviations
           from target conditions, using the predicted state for forward-looking control.
        4. Translate these control outputs into specific commands for the distributed AMUs.
        5. Simulate the environmental response to these commands, updating the internal
           model of the microclimate.

        Parameters:
            time_step (float): The duration, in seconds, that this control cycle represents.

        Returns:
            dict: A comprehensive summary of the control cycle, including the initial
                  state, predicted state, target conditions, calculated errors,
                  desired rates of change, executed AMU commands, and the resulting
                  final state of the microclimate. This is invaluable for system diagnostics.
        """
        # Step 1: Capture the current state. In reality, this comes from an integrated sensor network.
        current_T, current_RH = self._current_temperature, self._current_humidity

        # Step 2: Proactively predict the future state to enable feedforward control and minimize lag.
        predicted_T, predicted_RH = self._predict_atmospheric_state()

        # Step 3: Calculate the control outputs (desired rates of change) using the predicted state
        # for more responsive and stable control.
        desired_temp_rate, desired_humidity_rate = self.calculate_control_output(predicted_T, predicted_RH)

        # Step 4: Translate the conceptual rates of change into concrete, deployable AMU commands.
        amu_commands = self._translate_to_amu_commands(desired_temp_rate, desired_humidity_rate)

        # Step 5: Simulate the environmental response to the AMU commands, updating the internal
        # microclimate state. This mimics the real-world atmospheric reaction.
        self._simulate_environmental_response(amu_commands, time_step)

        # Compile and return a diagnostic summary of the control cycle.
        control_summary = {
            "cycle_time_step_s": time_step,
            "initial_temperature_K": round(current_T, 2),
            "initial_humidity_RH": round(current_RH, 3),
            "predicted_temperature_K": round(predicted_T, 2),
            "predicted_humidity_RH": round(predicted_RH, 3),
            "target_temperature_K": round(self.target_temperature, 2),
            "target_humidity_RH": round(self.target_humidity, 3),
            "temp_error_K": round(self.target_temperature - current_T, 2),
            "humidity_error_RH": round(self.target_humidity - current_RH, 3),
            "desired_temp_rate_K_per_s": round(desired_temp_rate, 4),
            "desired_humidity_rate_per_s": round(desired_humidity_rate, 4),
            "amu_commands": amu_commands,
            "final_temperature_K": round(self._current_temperature, 2),
            "final_humidity_RH": round(self._current_humidity, 3)
        }
        return control_summary