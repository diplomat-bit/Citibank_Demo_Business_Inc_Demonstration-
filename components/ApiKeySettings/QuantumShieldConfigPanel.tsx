import React, { useState, useEffect, useCallback } from 'react';
import { useApiKeyManagement } from '../ApiKeyPrompt';
import { LoadingSpinner } from '../ApiKeyPrompt';

// Re-importing types to ensure strict typing within this new file
import { QuantumSecureVaultConfig } from '../ApiKeyPrompt';

const QuantumShieldConfigPanel: React.FC = () => {
    const {
        quantumVaultConfig,
        fetchQuantumVaultConfig,
        updateQuantumVaultConfig,
        isLoading,
        error
    } = useApiKeyManagement();

    const [editMode, setEditMode] = useState(false);
    const [tempConfig, setTempConfig] = useState<Partial<QuantumSecureVaultConfig>>({});

    useEffect(() => {
        fetchQuantumVaultConfig();
    }, [fetchQuantumVaultConfig]);

    useEffect(() => {
        if (quantumVaultConfig) {
            setTempConfig(quantumVaultConfig); // Initialize temp config with current values when fetched
        }
    }, [quantumVaultConfig]);

    const handleUpdateConfig = useCallback(async () => {
        if (!tempConfig) return; // Should not happen with current logic, but for safety
        const updated = await updateQuantumVaultConfig(tempConfig);
        if (updated) {
            setEditMode(false);
            // The context should re-fetch or update its state, which will then update this component's `quantumVaultConfig`
        }
    }, [tempConfig, updateQuantumVaultConfig]);

    const handleToggleEditMode = () => {
        setEditMode(prev => !prev);
        if (!editMode) { // If entering edit mode
            // Populate tempConfig with current config or sensible defaults if not yet configured
            setTempConfig(quantumVaultConfig || {
                isEnabled: false,
                encryptionAlgorithm: 'post_quantum_hybrid_aes', // Default algorithm
                keyRotationFrequencyHours: 24, // Default rotation
                recoveryMethods: 'multi_party_computation', // Default recovery
            });
        }
    };

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target;
        setTempConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'keyRotationFrequencyHours' ? parseInt(value, 10) : value)
        }));
    }, []);

    // Helper for rendering select options, matching style from seed file
    const renderSelectOptions = (options: string[]) => {
        return options.map(option => (
            <option key={option} value={option}>{option.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
        ));
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-inner mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Quantum Shield & Secure Vault Configuration</h3>
            <p className="text-gray-400 mb-4">
                Manage your organization's post-quantum cryptography settings and secure vault recovery methods.
                Ensure your data is protected against future quantum threats.
            </p>
            {error && <p className="text-red-400 mb-4">{error}</p>}

            {isLoading && !quantumVaultConfig && (
                <div className="flex items-center text-gray-400"><LoadingSpinner /> Loading Quantum Shield settings...</div>
            )}

            {quantumVaultConfig || editMode ? ( // Show config or edit form if config exists or we're in edit mode to create
                <div className="space-y-4">
                    {!editMode ? (
                        <>
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm font-bold mb-2">Status</label>
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                    quantumVaultConfig?.isEnabled ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'
                                }`}>
                                    {quantumVaultConfig?.isEnabled ? 'Enabled' : 'Disabled'}
                                </span>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm font-bold mb-2">Encryption Algorithm</label>
                                <p className="text-white bg-gray-700 p-2 rounded">{quantumVaultConfig?.encryptionAlgorithm.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm font-bold mb-2">Key Rotation Frequency</label>
                                <p className="text-white bg-gray-700 p-2 rounded">{quantumVaultConfig?.keyRotationFrequencyHours} hours</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm font-bold mb-2">Recovery Method</label>
                                <p className="text-white bg-gray-700 p-2 rounded">{quantumVaultConfig?.recoveryMethods.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</p>
                            </div>
                        </>
                    ) : (
                        // Edit Mode Form
                        <>
                            <div className="mb-4">
                                <label className="flex items-center text-gray-300">
                                    <input
                                        type="checkbox"
                                        name="isEnabled"
                                        checked={tempConfig.isEnabled || false}
                                        onChange={handleInputChange}
                                        className="form-checkbox h-5 w-5 text-purple-600 bg-gray-700 border-gray-600 rounded"
                                    />
                                    <span className="ml-2 text-gray-400 text-sm font-bold">Enable Quantum Shield</span>
                                </label>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm font-bold mb-2">Encryption Algorithm</label>
                                <select
                                    name="encryptionAlgorithm"
                                    value={tempConfig.encryptionAlgorithm || ''}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-cyan-500 focus:outline-none"
                                >
                                    {renderSelectOptions(['post_quantum_hybrid_aes', 'post_quantum_saber'])}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm font-bold mb-2">Key Rotation Frequency (Hours)</label>
                                <input
                                    type="number"
                                    name="keyRotationFrequencyHours"
                                    value={tempConfig.keyRotationFrequencyHours || ''}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-cyan-500 focus:outline-none"
                                    min="1"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm font-bold mb-2">Recovery Method</label>
                                <select
                                    name="recoveryMethods"
                                    value={tempConfig.recoveryMethods || ''}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-cyan-500 focus:outline-none"
                                >
                                    {renderSelectOptions(['multi_party_computation', 'physical_hardware_token'])}
                                </select>
                            </div>
                        </>
                    )}
                    <div className="flex justify-end gap-2 mt-6">
                        {!editMode ? (
                            <button onClick={handleToggleEditMode} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                                Edit Configuration
                            </button>
                        ) : (
                            <>
                                <button onClick={handleToggleEditMode} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleUpdateConfig} disabled={isLoading} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center">
                                    {isLoading && <LoadingSpinner />} Save Changes
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ) : ( // If no config and not in edit mode (implies initial setup needed)
                <div className="text-center p-8 bg-gray-700 rounded-md">
                    <p className="text-gray-300 mb-4">Quantum Shield is not yet configured for your account.</p>
                    <button onClick={handleToggleEditMode} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors">
                        Activate Quantum Shield Now
                    </button>
                </div>
            )}

            <p className="text-gray-500 text-xs mt-4">
                OmniBank Global's Quantum Shield utilizes advanced cryptographic primitives designed to resist attacks from future quantum computers.
                For enterprise-grade security and custom policy definitions, contact your OmniBank Global account manager.
            </p>
        </div>
    );
};

export default QuantumShieldConfigPanel;