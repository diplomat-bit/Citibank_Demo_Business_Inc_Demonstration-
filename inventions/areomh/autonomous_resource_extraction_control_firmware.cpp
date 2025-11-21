#pragma once // A pragmatic choice for a single-file firmware component

#include <iostream>
#include <vector>
#include <string>
#include <cmath>
#include <chrono>
#include <thread> // For simulated delays
#include <random> // For better random numbers
#include <ctime>  // For std::time

// Constants and global definitions (kept within namespace for good practice)
namespace AREOMH {
namespace Constants {
    const double GRAVITATIONAL_CONSTANT = 6.674e-11; // N(m/kg)^2 - G
    const double ASTEROID_REFERENCE_MASS = 1.0e12; // kg (example asteroid mass for F_grav calculation)
    const double ROBOT_MASS = 1500.0; // kg
    const double ASTEROID_ROTATION_STABILITY_THRESHOLD = 0.005; // rad/s (tolerance for angular velocity magnitude)
    const double EXTRACTION_DEPTH_TARGET = 5.0; // meters
    const double SCAN_RESOLUTION_METERS = 0.1; // meters per lidar scan point
    const int MATERIAL_BUFFER_CAPACITY = 1000; // units
    const double NAVIGATION_APPROACH_DISTANCE = 10.0; // meters, when to switch to fine approach
    const double NAVIGATION_TARGET_DISTANCE_TOLERANCE = 0.1; // meters, considered arrived
    const double THRUST_MAGNITUDE_NAV = 1000.0; // N for navigation
    const double THRUST_MAGNITUDE_STAB = 50.0; // N for stabilization
} // namespace Constants

// Basic geometric types
struct Vector3D {
    double x, y, z;

    Vector3D operator+(const Vector3D& other) const { return {x + other.x, y + other.y, z + other.z}; }
    Vector3D operator-(const Vector3D& other) const { return {x - other.x, y - other.y, z - other.z}; }
    Vector3D operator*(double scalar) const { return {x * scalar, y * scalar, z * scalar}; }
    Vector3D operator/(double scalar) const { return {x / scalar, y / scalar, z / scalar}; }
    double magnitude() const { return std::sqrt(x*x + y*y + z*z); }
    Vector3D normalized() const {
        double mag = magnitude();
        return mag > 0 ? (*this) / mag : Vector3D{0,0,0};
    }
};

struct Quaternion {
    double w, x, y, z; // For orientation
    // Placeholder for actual quaternion operations for simplicity.
    // In real firmware, this would be a full library (e.g., Eigen, GLM).
};

// --- Sensor Abstractions ---
class InertialMeasurementUnit {
public:
    Vector3D getAcceleration() const {
        // Simulate some noise or actual sensor reading
        return {0.01, 0.02, 0.03};
    }
    Vector3D getAngularVelocity() const {
        // Simulating some asteroid rotation for testing stabilization
        static std::default_random_engine generator(std::time(nullptr));
        static std::uniform_real_distribution<double> distribution(-0.01, 0.01);
        return {distribution(generator), distribution(generator), distribution(generator)};
    }
    Quaternion getOrientation() const {
        return {1.0, 0.0, 0.0, 0.0}; // Identity (no rotation)
    }
    void calibrate() {
        std::cout << "[IMU] Calibrating... Expect a few g-forces. Totally normal, just ignore the sparks.\n";
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
        std::cout << "[IMU] Calibration complete. Ready for some aggressive maneuvering, or gentle floating.\n";
    }
};

class LidarScanner {
public:
    std::vector<Vector3D> scanEnvironment() const {
        std::cout << "[Lidar] Scanning environment for obstacles and terrain features... Hopefully no space-kraken.\n";
        // Simulate a scan, returning points on the asteroid surface
        std::vector<Vector3D> points;
        std::default_random_engine generator(std::time(nullptr));
        std::uniform_real_distribution<double> distribution(-5.0, 5.0);
        for (int i = 0; i < 50; ++i) { // Fewer points for faster demo
            points.push_back({distribution(generator), distribution(generator), distribution(generator)});
        }
        return points;
    }
    double measureDistanceToSurface() const {
        // Simulate surface distance
        return 5.0 + (static_cast<double>(std::rand()) / RAND_MAX * 5.0); // 5.0 to 10.0 meters
    }
};

class MaterialSpectrometer {
public:
    std::string analyzeMaterial() const {
        std::cout << "[Spectrometer] Analyzing material composition... Please hold, science in progress. Probably just rock, but maybe space diamonds!\n";
        std::this_thread::sleep_for(std::chrono::milliseconds(1000));
        std::string materials[] = {"Silicate", "Iron-Nickel", "Volatiles", "Rare Earths"};
        return materials[std::rand() % 4];
    }
};

// --- Actuator Abstractions ---
class ThrusterControl {
public:
    void applyThrust(const Vector3D& direction, double magnitude) {
        if (magnitude > 0) {
            std::cout << "[Thrusters] Applying " << magnitude << "N thrust in direction ("
                      << direction.x << ", " << direction.y << ", " << direction.z << "). Zipping along!\n";
        }
    }
    void stabilizeRotation(const Vector3D& angularVelocity) {
        if (angularVelocity.magnitude() > 0) {
            std::cout << "[Thrusters] Countering asteroid rotation ("
                      << angularVelocity.x << ", " << angularVelocity.y << ", " << angularVelocity.z << "). Keeping things steady, because nobody likes a spinning office.\n";
            applyThrust(angularVelocity.normalized() * -1.0, Constants::THRUST_MAGNITUDE_STAB); // Simplified counter-thrust
        }
    }
};

class ManipulatorArm {
public:
    void extend() { std::cout << "[Arm] Extending manipulator arm. Reaching for the stars, or at least some valuable rock.\n"; }
    void retract() { std::cout << "[Arm] Retracting manipulator arm. Safety first, then more rock.\n"; }
    void grab(const std::string& target) { std::cout << "[Arm] Grabbing " << target << ". Gotcha! Hope it's not sentient.\n"; }
    void release() { std::cout << "[Arm] Releasing. Freedom for the rock! (Into our collection, that is).\n"; }
    void drillAt(const Vector3D& target_coords, double depth) {
        std::cout << "[Arm] Initiating drilling at (" << target_coords.x << ", " << target_coords.y << ", " << target_coords.z
                  << ") to depth " << depth << "m. Prepare for impact! (Of our drill bit, that is).\n";
        std::this_thread::sleep_for(std::chrono::seconds(static_cast<int>(depth))); // Simulate drilling time
        std::cout << "[Arm] Drilling complete. We're in, and probably found something cool.\n";
    }
};

class MaterialConveyor {
public:
    void activate() { std::cout << "[Conveyor] Activating material conveyor. Flowing wealth! Or just dust, sometimes.\n"; }
    void deactivate() { std::cout << "[Conveyor] Deactivating material conveyor. Pausing the gold rush, briefly.\n"; }
    void loadMaterial(const std::string& material_type, int quantity) {
        if (current_material_buffer + quantity > Constants::MATERIAL_BUFFER_CAPACITY) {
            quantity = Constants::MATERIAL_BUFFER_CAPACITY - current_material_buffer; // Only load what fits
            std::cout << "[Conveyor Warning] Buffer full, loaded only partial amount.\n";
        }
        current_material_buffer += quantity;
        std::cout << "[Conveyor] Loaded " << quantity << " units of " << material_type
                  << ". Buffer: " << current_material_buffer << "/" << Constants::MATERIAL_BUFFER_CAPACITY << "\n";
    }
    int unloadMaterial() {
        int unloaded = current_material_buffer;
        current_material_buffer = 0;
        std::cout << "[Conveyor] Unloaded all " << unloaded << " units of material. Excellent work, team!\n";
        return unloaded;
    }
    bool isFull() const { return current_material_buffer >= Constants::MATERIAL_BUFFER_CAPACITY; }
    bool isEmpty() const { return current_material_buffer == 0; }

private:
    int current_material_buffer = 0;
};

// --- Robot State and Core Logic ---
enum class RobotState {
    IDLE,
    NAVIGATING_TO_ASTEROID,
    ATTACHING_TO_ASTEROID,
    SCANNING_SURFACE,
    ANALYZING_MATERIAL,
    DRILLING,
    EXTRACTING_MATERIAL,
    PROCESSING_MATERIAL,
    DELIVERING_MATERIAL,
    RETURNING_TO_HUB,
    UNLOADING_MATERIAL, // New state for unloading at hub
    EMERGENCY_ABORT
};

std::string toString(RobotState state) {
    switch (state) {
        case RobotState::IDLE: return "IDLE";
        case RobotState::NAVIGATING_TO_ASTEROID: return "NAVIGATING_TO_ASTEROID";
        case RobotState::ATTACHING_TO_ASTEROID: return "ATTACHING_TO_ASTEROID";
        case RobotState::SCANNING_SURFACE: return "SCANNING_SURFACE";
        case RobotState::ANALYZING_MATERIAL: return "ANALYZING_MATERIAL";
        case RobotState::DRILLING: return "DRILLING";
        case RobotState::EXTRACTING_MATERIAL: return "EXTRACTING_MATERIAL";
        case RobotState::PROCESSING_MATERIAL: return "PROCESSING_MATERIAL";
        case RobotState::DELIVERING_MATERIAL: return "DELIVERING_MATERIAL";
        case RobotState::RETURNING_TO_HUB: return "RETURNING_TO_HUB";
        case RobotState::UNLOADING_MATERIAL: return "UNLOADING_MATERIAL";
        case RobotState::EMERGENCY_ABORT: return "EMERGENCY_ABORT";
        default: return "UNKNOWN";
    }
}

class AutonomousMiningRobot {
public:
    AutonomousMiningRobot(const std::string& robot_id)
        : id_(robot_id), state_(RobotState::IDLE),
          current_position_({0.0, 0.0, 0.0}), current_velocity_({0.0, 0.0, 0.0}),
          asteroid_position_({1000.0, 0.0, 0.0}), asteroid_mass_(Constants::ASTEROID_REFERENCE_MASS) {
        std::cout << "Autonomous Mining Robot " << id_ << " initialized. Ready for duty. Or coffee. Or both, ideally.\n";
    }

    void runMissionCycle() {
        while (state_ != RobotState::EMERGENCY_ABORT && state_ != RobotState::IDLE) {
            std::cout << "\n--- Robot " << id_ << " State: " << toString(state_) << " ---\n";
            switch (state_) {
                case RobotState::NAVIGATING_TO_ASTEROID:
                    navigate(asteroid_position_, RobotState::ATTACHING_TO_ASTEROID);
                    break;
                case RobotState::ATTACHING_TO_ASTEROID:
                    attachToAsteroid();
                    break;
                case RobotState::SCANNING_SURFACE:
                    scanForExtractionSite();
                    break;
                case RobotState::ANALYZING_MATERIAL:
                    analyzeMaterialAtSite();
                    break;
                case RobotState::DRILLING:
                    performDrilling();
                    break;
                case RobotState::EXTRACTING_MATERIAL:
                    extractMaterial();
                    break;
                case RobotState::PROCESSING_MATERIAL:
                    processExtractedMaterial();
                    break;
                case RobotState::DELIVERING_MATERIAL:
                    deliverMaterialToHub();
                    break;
                case RobotState::RETURNING_TO_HUB:
                    navigate(home_base_position_, RobotState::UNLOADING_MATERIAL);
                    break;
                case RobotState::UNLOADING_MATERIAL:
                    unloadAtHub();
                    break;
                case RobotState::IDLE: // Fallthrough to allow manual state change if needed
                case RobotState::EMERGENCY_ABORT:
                    break; // Should exit loop
            }
            std::this_thread::sleep_for(std::chrono::milliseconds(500)); // Simulate time passing
        }
        std::cout << "\n--- Robot " << id_ << " Mission Cycle Concluded. Time for a well-deserved (simulated) nap. Zzzzz...\n";
    }

    void startMission(const Vector3D& target_asteroid_pos, double asteroid_mass) {
        asteroid_position_ = target_asteroid_pos;
        asteroid_mass_ = asteroid_mass;
        setState(RobotState::NAVIGATING_TO_ASTEROID);
    }

    RobotState getState() const { // Public getter for main to check state
        return state_;
    }

    void setState(RobotState new_state) {
        std::cout << "[" << id_ << "] Transitioning from " << toString(state_)
                  << " to " << toString(new_state) << ".\n";
        state_ = new_state;
    }

private:
    std::string id_;
    RobotState state_;
    InertialMeasurementUnit imu_;
    LidarScanner lidar_;
    MaterialSpectrometer spectrometer_;
    ThrusterControl thrusters_;
    ManipulatorArm arm_;
    MaterialConveyor conveyor_;

    Vector3D current_position_;
    Vector3D current_velocity_;
    Vector3D asteroid_position_;
    double asteroid_mass_;
    Vector3D home_base_position_ = {0.0, 0.0, 0.0}; // Assuming the orbital hub is at the origin

    Vector3D current_drilling_site_ = {0.0, 0.0, 0.0};
    std::string current_extracted_material_ = "unknown";

    // Equation 106 related functions
    Vector3D calculateGravitationalForce(const Vector3D& target_pos, double target_mass) const {
        Vector3D relative_position = target_pos - current_position_;
        double distance = relative_position.magnitude();
        if (distance < Constants::NAVIGATION_TARGET_DISTANCE_TOLERANCE) distance = Constants::NAVIGATION_TARGET_DISTANCE_TOLERANCE; // Avoid division by zero close to target

        // F_grav = GMm/r^2. Direction is towards target.
        double force_magnitude = (Constants::GRAVITATIONAL_CONSTANT * target_mass * Constants::ROBOT_MASS) / (distance * distance);
        Vector3D force_direction = relative_position.normalized(); // Normalize direction vector
        return force_direction * force_magnitude;
    }

    void updateAsteroidStability(const Vector3D& current_asteroid_angular_velocity) {
        // This is a placeholder for actual complex angular momentum calculations,
        // vital for AREOMH's claim of 'J = sum(m_i / M_total) (r_i - r_CM)'.
        // In reality, this would involve knowing the asteroid's moment of inertia tensor,
        // changes in mass distribution due to excavation, and applying precise counter-forces/torques.
        std::cout << "[" << id_ << "] Monitoring asteroid's rotational stability... Because uncontrolled spinning is bad for business.\n";
        if (current_asteroid_angular_velocity.magnitude() > Constants::ASTEROID_ROTATION_STABILITY_THRESHOLD) {
            std::cout << "[" << id_ << "] Asteroid rotation detected! Initiating counter-thrusts. Let's make this rock sit still.\n";
            thrusters_.stabilizeRotation(current_asteroid_angular_velocity); // Thrusters handle the direction internally
            // In a real system, this would iteratively reduce angular velocity.
            std::this_thread::sleep_for(std::chrono::milliseconds(1000)); // Simulate stabilization time
        } else {
            std::cout << "[" << id_ << "] Asteroid rotational stability nominal. Proceed with operations. Smooth sailing, or rather, smooth orbiting.\n";
        }
    }

    // --- State-specific logic ---
    void navigate(const Vector3D& target_position, RobotState next_state_on_arrival) {
        std::cout << "[" << id_ << "] Navigating to target coordinates ("
                  << target_position.x << ", " << target_position.y << ", " << target_position.z << "). Calculating optimal trajectory, which is usually 'straight at it'.\n";

        Vector3D navigation_vector = target_position - current_position_;
        double distance_to_target = navigation_vector.magnitude();

        if (distance_to_target < Constants::NAVIGATION_TARGET_DISTANCE_TOLERANCE) { // Close enough
            std::cout << "[" << id_ << "] Arrived at target zone. Nailed it.\n";
            current_position_ = target_position; // Snap to target for precision
            current_velocity_ = {0.0, 0.0, 0.0}; // Stop
            setState(next_state_on_arrival);
            return;
        }

        // Apply corrective thrust
        Vector3D desired_direction = navigation_vector.normalized();
        double thrust_magnitude = Constants::THRUST_MAGNITUDE_NAV;
        thrusters_.applyThrust(desired_direction, thrust_magnitude);

        // Simulate gravitational influence if navigating near a large body (like asteroid or planet)
        Vector3D gravitational_force = {0.0, 0.0, 0.0};
        if (next_state_on_arrival == RobotState::ATTACHING_TO_ASTEROID) {
            gravitational_force = calculateGravitationalForce(asteroid_position_, asteroid_mass_);
        } else if (next_state_on_arrival == RobotState::UNLOADING_MATERIAL) {
            // If returning to hub at origin, we might simulate Earth's (or orbital station's) gravity
            // For simplicity, let's assume negligible gravity near home base or it's handled by a higher-level system
        }

        // Update position using basic physics integration
        Vector3D net_force = (desired_direction * thrust_magnitude) + gravitational_force;
        Vector3D acceleration = net_force / Constants::ROBOT_MASS;
        
        current_velocity_ = current_velocity_ + acceleration; // Assuming dt=1 for simplicity
        current_position_ = current_position_ + current_velocity_; // Assuming dt=1 for simplicity

        std::cout << "[" << id_ << "] Current Pos: (" << current_position_.x << ", " << current_position_.y << ", " << current_position_.z
                  << "), Vel: (" << current_velocity_.x << ", " << current_velocity_.y << ", " << current_velocity_.z
                  << "), Dist: " << distance_to_target << "m.\n";
        std::this_thread::sleep_for(std::chrono::milliseconds(200)); // Simulate flight time
    }

    void attachToAsteroid() {
        std::cout << "[" << id_ << "] Deploying anchoring clamps and engaging magnetic grapples. A firm handshake with a giant space rock.\n";
        arm_.extend(); // Simulate some arm action for attachment
        arm_.grab("asteroid surface");
        std::this_thread::sleep_for(std::chrono::seconds(2));
        updateAsteroidStability(imu_.getAngularVelocity()); // Check and stabilize rotation, critical for 'J' in equation 106
        std::cout << "[" << id_ << "] Successfully attached to the asteroid. We're not going anywhere, unless we want to, which we do.\n";
        setState(RobotState::SCANNING_SURFACE);
    }

    void scanForExtractionSite() {
        std::cout << "[" << id_ << "] Scanning surface for optimal extraction sites. Looking for that sweet spot of resources and structural integrity.\n";
        std::vector<Vector3D> scan_data = lidar_.scanEnvironment();
        // In a real scenario, analyze scan_data for suitable drilling locations (flatness, material proximity)
        // For simulation, we just pick one from the scan data.
        if (!scan_data.empty()) {
            current_drilling_site_ = scan_data[std::rand() % scan_data.size()];
            std::cout << "[" << id_ << "] Identified potential drilling site at ("
                      << current_drilling_site_.x << ", " << current_drilling_site_.y << ", " << current_drilling_site_.z << "). Looks promising.\n";
        } else {
            std::cout << "[" << id_ << "] No suitable drilling sites found. This asteroid is surprisingly boring. Trying again.\n";
            std::this_thread::sleep_for(std::chrono::seconds(1));
            return; // Stay in scanning state
        }
        setState(RobotState::ANALYZING_MATERIAL);
    }

    void analyzeMaterialAtSite() {
        std::cout << "[" << id_ << "] Deploying spectrometer to analyze material at proposed site. Because guessing is for amateurs.\n";
        current_extracted_material_ = spectrometer_.analyzeMaterial();
        std::cout << "[" << id_ << "] Analysis complete: Detected primarily " << current_extracted_material_ << " at this site. Excellent choice, robot!\n";
        setState(RobotState::DRILLING);
    }

    void performDrilling() {
        std::cout << "[" << id_ << "] Initiating drilling operations. Making holes, making history, and hopefully making money (or post-scarcity credits).\n";
        arm_.drillAt(current_drilling_site_, Constants::EXTRACTION_DEPTH_TARGET);
        std::cout << "[" << id_ << "] Drilling to target depth (" << Constants::EXTRACTION_DEPTH_TARGET << "m) complete. That's a big hole.\n";
        setState(RobotState::EXTRACTING_MATERIAL);
    }

    void extractMaterial() {
        std::cout << "[" << id_ << "] Activating extraction mechanisms and conveyor for " << current_extracted_material_ << ". Let the cosmic bounty flow!\n";
        conveyor_.activate();
        // Simulate extraction over time until buffer is full
        int extracted_total = 0;
        while (!conveyor_.isFull() && extracted_total < Constants::MATERIAL_BUFFER_CAPACITY * 2) { // Allow for over-extraction logic
            conveyor_.loadMaterial(current_extracted_material_, 50); // Load in chunks
            extracted_total += 50;
            std::this_thread::sleep_for(std::chrono::milliseconds(100));
            if (extracted_total >= Constants::MATERIAL_BUFFER_CAPACITY) { // Force full for demo
                 std::cout << "[" << id_ << "] Buffer is now full. Efficiency at its peak!\n";
                 break;
            }
        }
        conveyor_.deactivate();
        std::cout << "[" << id_ << "] Extraction complete. Conveyor buffer at capacity or site depleted. Time to process.\n";
        setState(RobotState::PROCESSING_MATERIAL);
    }

    void processExtractedMaterial() {
        std::cout << "[" << id_ << "] Processing extracted " << current_extracted_material_
                  << ". Refining raw space-stuff into shiny future-stuff. This is where the magic (and a lot of energy) happens.\n";
        // This would involve a complex refinery module (thermal decomposition, magnetic separation, electrolysis),
        // as described in the AREOMH blueprint.
        // For firmware, we simulate the outcome.
        std::this_thread::sleep_for(std::chrono::seconds(3));
        std::cout << "[" << id_ << "] Material refined. Ready for transport to orbital manufacturing hub. One step closer to self-replicating robots!\n";
        setState(RobotState::DELIVERING_MATERIAL);
    }

    void deliverMaterialToHub() {
        std::cout << "[" << id_ << "] Detaching from asteroid and preparing to deliver material to orbital hub. Smooth disengagement initiated.\n";
        arm_.release();
        arm_.retract();
        std::this_thread::sleep_for(std::chrono::seconds(1));
        std::cout << "[" << id_ << "] Detachment complete. Heading home.\n";
        setState(RobotState::RETURNING_TO_HUB);
    }

    void unloadAtHub() {
        std::cout << "[" << id_ << "] Arrived at orbital hub. Initiating material transfer. The moment of truth for our cargo.\n";
        if (!conveyor_.isEmpty()) {
            int quantity = conveyor_.unloadMaterial();
            std::cout << "[" << id_ << "] Successfully transferred " << quantity << " units to the hub. Mission accomplished, and the inventory count looks good!\n";
        } else {
            std::cout << "[" << id_ << "] Nothing to unload. Did we just come for the view? (Self-correction needed).\n";
        }
        setState(RobotState::IDLE); // Mission complete, await new orders.
    }
};

} // namespace AREOMH

// Main function for demonstration purposes
int main() {
    std::srand(static_cast<unsigned int>(std::time(nullptr))); // Seed random for simulations
    AREOMH::AutonomousMiningRobot robot1("Pioneer-7");

    std::cout << "\nStarting mission for Pioneer-7 to asteroid 'Iron Giant' at (1000, 0, 0) with 1e12 kg mass.\n";
    robot1.startMission({1000.0, 0.0, 0.0}, AREOMH::Constants::ASTEROID_REFERENCE_MASS);
    robot1.runMissionCycle();

    std::cout << "\nSimulation ended. The future is bright, and full of processed asteroid-derived resources.\n";

    return 0;
}