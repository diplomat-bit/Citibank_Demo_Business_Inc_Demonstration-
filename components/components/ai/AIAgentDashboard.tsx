import React, { useState, useEffect, useCallback } from 'react';
import { useAI, AIContextValue, AIAgent, AITask, AIModelConfig, AIUserProfile } from '../AIWrapper';

/**
 * Utility to generate a random ID matching the pattern in the seed file.
 */
const generateRandomId = (prefix: string = 'id'): string => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
};

/**
 * A React component providing a user interface to monitor, configure, and interact with various AI agents
 * managed by the AutonomousAgentOrchestrator.
 */
const AIAgentDashboard: React.FC = () => {
    const ai: AIContextValue = useAI();
    const {
        agentOrchestrator,
        modelManager,
        ethicalAILayer,
        aiEventLogger,
        userProfile,
        sessionId,
        userId
    } = ai;

    const [agents, setAgents] = useState<AIAgent[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // State for new task creation
    const [newTaskData, setNewTaskData] = useState<{
        name: string;
        description: string;
        priority: AITask['priority'];
        dataSensitivity: AITask['securityContext']['dataSensitivity'];
        assignToAgentId: string;
    }>({
        name: '',
        description: '',
        priority: 'medium',
        dataSensitivity: 'internal',
        assignToAgentId: ''
    });

    // State for updating selected agent
    const [updatedAgentConfig, setUpdatedAgentConfig] = useState<Partial<AIAgent>>({});

    useEffect(() => {
        aiEventLogger.logEvent({
            type: 'ai_wrapper_view_update',
            source: 'AIAgentDashboard',
            payload: { viewName: 'AIAgentDashboard', userId: ai.userId }
        });
        fetchAgents();
        // Set an interval to refresh agents periodically, simulating real-time updates
        const refreshInterval = setInterval(fetchAgents, 10000); // Refresh every 10 seconds
        return () => clearInterval(refreshInterval);
    }, [aiEventLogger, ai.userId, agentOrchestrator]);

    useEffect(() => {
        if (selectedAgent) {
            setUpdatedAgentConfig({
                persona: selectedAgent.persona,
                role: selectedAgent.role,
                status: selectedAgent.status,
                currentGoal: selectedAgent.currentGoal,
                memoryCapacity: selectedAgent.memoryCapacity,
                learningRate: selectedAgent.learningRate,
                emotionalState: selectedAgent.emotionalState,
                ethicalGuidelines: selectedAgent.ethicalGuidelines,
                securityClearance: selectedAgent.securityClearance,
                resourceAllocation: { ...selectedAgent.resourceAllocation },
                isAutonomous: selectedAgent.isAutonomous,
                trustScore: selectedAgent.trustScore,
                hardwareIntegration: selectedAgent.hardwareIntegration ? { ...selectedAgent.hardwareIntegration } : undefined,
            });
        } else {
            setUpdatedAgentConfig({});
        }
    }, [selectedAgent]);

    const fetchAgents = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedAgents = agentOrchestrator.getAllAgents();
            setAgents(fetchedAgents);
            if (selectedAgent) {
                const updatedSelectedAgent = fetchedAgents.find(a => a.id === selectedAgent.id);
                setSelectedAgent(updatedSelectedAgent || null);
            }
            aiEventLogger.logEvent({
                type: 'data_update',
                source: 'AIAgentDashboard',
                payload: { action: 'fetch_agents', count: fetchedAgents.length }
            });
        } catch (err) {
            setError(`Failed to fetch agents: ${(err as Error).message}`);
            aiEventLogger.logEvent({
                type: 'system_alert',
                source: 'AIAgentDashboard',
                payload: { message: `Failed to fetch agents: ${(err as Error).message}` },
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    }, [agentOrchestrator, selectedAgent, aiEventLogger]);

    const handleSelectAgent = useCallback((agent: AIAgent) => {
        setSelectedAgent(agent);
        setNewTaskData(prev => ({ ...prev, assignToAgentId: agent.id }));
        aiEventLogger.logEvent({
            type: 'user_interaction',
            source: 'AIAgentDashboard',
            payload: { action: 'select_agent', agentId: agent.id, agentName: agent.name }
        });
    }, [aiEventLogger]);

    const handleNewTaskChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setNewTaskData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    const handleCreateTask = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        const task: AITask = {
            id: generateRandomId('task'),
            name: newTaskData.name,
            description: newTaskData.description,
            status: 'pending',
            priority: newTaskData.priority,
            progress: 0,
            creationTimestamp: Date.now(),
            lastUpdateTimestamp: Date.now(),
            requiredResources: {},
            securityContext: {
                encryptionLevel: 'aes256',
                accessControlList: userProfile ? [userProfile.userId] : [],
                dataSensitivity: newTaskData.dataSensitivity
            },
            environmentalContext: {
                deviceType: 'desktop'
            }
        };

        try {
            if (newTaskData.assignToAgentId) {
                await agentOrchestrator.assignTask(newTaskData.assignToAgentId, task);
                setSuccessMessage(`Task "${task.name}" created and assigned to ${newTaskData.assignToAgentId}.`);
            } else {
                await agentOrchestrator.createTask(task.name, task.description, task.priority);
                setSuccessMessage(`Task "${task.name}" created (awaiting agent assignment).`);
            }
            setNewTaskData({ name: '', description: '', priority: 'medium', dataSensitivity: 'internal', assignToAgentId: selectedAgent?.id || '' });
            fetchAgents(); // Refresh agent list to show task assignment
        } catch (err) {
            setError(`Failed to create task: ${(err as Error).message}`);
            aiEventLogger.logEvent({
                type: 'system_alert',
                source: 'AIAgentDashboard',
                payload: { message: `Failed to create task: ${(err as Error).message}`, taskName: task.name },
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    }, [newTaskData, selectedAgent, agentOrchestrator, userProfile, fetchAgents, aiEventLogger]);

    const handleUpdateAgentConfigChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target;
        setUpdatedAgentConfig(prev => {
            if (name.startsWith('resourceAllocation.')) {
                const resourceKey = name.split('.')[1] as keyof AIAgent['resourceAllocation'];
                return {
                    ...prev,
                    resourceAllocation: {
                        ...prev.resourceAllocation,
                        [resourceKey]: type === 'number' ? parseFloat(value) : parseInt(value, 10)
                    }
                };
            }
            if (name.startsWith('hardwareIntegration.')) {
                const hardwareKey = name.split('.')[1] as keyof AIAgent['hardwareIntegration'];
                return {
                    ...prev,
                    hardwareIntegration: {
                        ...prev.hardwareIntegration,
                        [hardwareKey]: type === 'checkbox' ? checked : value
                    }
                };
            }
            return { ...prev, [name]: type === 'checkbox' ? checked : value };
        });
    }, []);

    const handleUpdateAgent = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAgent) return;

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        const updatedAgent: AIAgent = {
            ...selectedAgent,
            ...updatedAgentConfig,
            resourceAllocation: {
                ...selectedAgent.resourceAllocation,
                ...updatedAgentConfig.resourceAllocation
            },
            hardwareIntegration: updatedAgentConfig.hardwareIntegration ? {
                ...selectedAgent.hardwareIntegration,
                ...updatedAgentConfig.hardwareIntegration
            } : selectedAgent.hardwareIntegration
        };

        try {
            agentOrchestrator.registerAgent(updatedAgent); // registerAgent can update existing ones
            setSuccessMessage(`Agent "${updatedAgent.name}" updated successfully.`);
            setSelectedAgent(updatedAgent); // Update the local selected agent state immediately
            fetchAgents(); // Refresh the list from orchestrator
        } catch (err) {
            setError(`Failed to update agent: ${(err as Error).message}`);
            aiEventLogger.logEvent({
                type: 'system_alert',
                source: 'AIAgentDashboard',
                payload: { message: `Failed to update agent: ${(err as Error).message}`, agentId: selectedAgent.id },
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    }, [selectedAgent, updatedAgentConfig, agentOrchestrator, fetchAgents, aiEventLogger]);

    // Simplified styling based on AIWrapper's companion box
    const dashboardStyle: React.CSSProperties = {
        display: 'flex',
        fontFamily: 'Arial, sans-serif',
        color: '#e0e0e0',
        background: '#282c34',
        minHeight: '100vh',
        padding: '20px',
        gap: '20px',
    };

    const panelStyle: React.CSSProperties = {
        flex: 1,
        background: '#3c404c',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        overflowY: 'auto',
    };

    const agentListItemStyle: React.CSSProperties = {
        padding: '10px 15px',
        margin: '5px 0',
        background: '#4a4f5c',
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'background-color 0.2s',
    };

    const selectedAgentListItemStyle: React.CSSProperties = {
        ...agentListItemStyle,
        background: '#6a6f7c',
        borderLeft: '4px solid #61dafb',
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '8px',
        margin: '5px 0 10px 0',
        borderRadius: '4px',
        border: '1px solid #555',
        background: '#4a4f5c',
        color: '#e0e0e0',
        boxSizing: 'border-box',
    };

    const buttonStyle: React.CSSProperties = {
        padding: '10px 15px',
        background: '#61dafb',
        color: '#282c34',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1em',
        transition: 'background-color 0.2s',
        marginTop: '10px',
    };

    const statusColors = {
        'idle': 'green',
        'busy': 'orange',
        'offline': 'gray',
        'error': 'red',
        'learning': 'purple',
        'meditating': 'blue'
    };

    return (
        <div style={dashboardStyle}>
            {/* Agent List Panel */}
            <div style={{ ...panelStyle, flex: 0.8 }}>
                <h2>AI Agents</h2>
                {isLoading && <p>Loading agents...</p>}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                <button
                    onClick={fetchAgents}
                    style={{ ...buttonStyle, marginBottom: '20px', background: '#4CAF50' }}
                    disabled={isLoading}
                >
                    Refresh Agents
                </button>
                <div style={{ maxHeight: 'calc(100vh - 180px)', overflowY: 'auto' }}>
                    {agents.length === 0 && !isLoading && <p>No agents registered.</p>}
                    {agents.map(agent => (
                        <div
                            key={agent.id}
                            style={selectedAgent?.id === agent.id ? selectedAgentListItemStyle : agentListItemStyle}
                            onClick={() => handleSelectAgent(agent)}
                        >
                            <div>
                                <strong>{agent.name}</strong> ({agent.id})
                                <div style={{ fontSize: '0.9em', color: '#bbb' }}>{agent.persona} - {agent.role}</div>
                            </div>
                            <span style={{ color: (statusColors as any)[agent.status] || 'white', fontWeight: 'bold' }}>{agent.status.toUpperCase()}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Agent Details & Task Creation Panel */}
            <div style={{ ...panelStyle, flex: 2 }}>
                {selectedAgent ? (
                    <>
                        <h2>Agent Details: {selectedAgent.name}</h2>
                        {successMessage && <p style={{ color: 'lightgreen' }}>{successMessage}</p>}
                        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                        <form onSubmit={handleUpdateAgent}>
                            <label>
                                Persona:
                                <input
                                    type="text"
                                    name="persona"
                                    value={updatedAgentConfig.persona || ''}
                                    onChange={handleUpdateAgentConfigChange}
                                    style={inputStyle}
                                />
                            </label>
                            <label>
                                Role:
                                <select
                                    name="role"
                                    value={updatedAgentConfig.role || ''}
                                    onChange={handleUpdateAgentConfigChange}
                                    style={inputStyle}
                                >
                                    {['planner', 'executor', 'monitor', 'collaborator', 'sentient_entity'].map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Status:
                                <select
                                    name="status"
                                    value={updatedAgentConfig.status || ''}
                                    onChange={handleUpdateAgentConfigChange}
                                    style={inputStyle}
                                >
                                    {['idle', 'busy', 'offline', 'error', 'learning', 'meditating'].map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Current Goal:
                                <textarea
                                    name="currentGoal"
                                    value={updatedAgentConfig.currentGoal || ''}
                                    onChange={handleUpdateAgentConfigChange}
                                    rows={3}
                                    style={inputStyle}
                                />
                            </label>
                            <label>
                                Ethical Guidelines:
                                <select
                                    name="ethicalGuidelines"
                                    value={updatedAgentConfig.ethicalGuidelines || ''}
                                    onChange={handleUpdateAgentConfigChange}
                                    style={inputStyle}
                                >
                                    {['strict', 'adaptive', 'flexible'].map(guideline => (
                                        <option key={guideline} value={guideline}>{guideline}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Security Clearance:
                                <select
                                    name="securityClearance"
                                    value={updatedAgentConfig.securityClearance || ''}
                                    onChange={handleUpdateAgentConfigChange}
                                    style={inputStyle}
                                >
                                    {['level_1', 'level_2', 'level_3', 'level_4', 'level_5'].map(clearance => (
                                        <option key={clearance} value={clearance}>{clearance}</option>
                                    ))}
                                </select>
                            </label>
                            <div style={{ marginBottom: '15px' }}>
                                <strong>Capabilities:</strong> {selectedAgent.capabilities.join(', ')}
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <strong>Assigned Tasks:</strong> {selectedAgent.assignedTasks.length > 0 ? selectedAgent.assignedTasks.join(', ') : 'None'}
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <strong>Resource Allocation:</strong>
                                <div>Compute Units: <input type="number" name="resourceAllocation.computeUnits" value={updatedAgentConfig.resourceAllocation?.computeUnits ?? 0} onChange={handleUpdateAgentConfigChange} style={{...inputStyle, width: 'auto'}} /></div>
                                <div>Memory (GB): <input type="number" name="resourceAllocation.memoryGB" value={updatedAgentConfig.resourceAllocation?.memoryGB ?? 0} onChange={handleUpdateAgentConfigChange} style={{...inputStyle, width: 'auto'}} /></div>
                                <div>Network (Mbps): <input type="number" name="resourceAllocation.networkBandwidthMbps" value={updatedAgentConfig.resourceAllocation?.networkBandwidthMbps ?? 0} onChange={handleUpdateAgentConfigChange} style={{...inputStyle, width: 'auto'}} /></div>
                            </div>
                            <label>
                                Is Autonomous:
                                <input
                                    type="checkbox"
                                    name="isAutonomous"
                                    checked={updatedAgentConfig.isAutonomous ?? false}
                                    onChange={handleUpdateAgentConfigChange}
                                    style={{ marginLeft: '10px' }}
                                />
                            </label>
                            <button type="submit" style={buttonStyle} disabled={isLoading}>
                                {isLoading ? 'Updating...' : 'Update Agent'}
                            </button>
                        </form>

                        <hr style={{ margin: '30px 0', borderColor: '#4a4f5c' }} />

                        <h3>Create New Task for {selectedAgent.name}</h3>
                        <form onSubmit={handleCreateTask}>
                            <label>
                                Task Name:
                                <input
                                    type="text"
                                    name="name"
                                    value={newTaskData.name}
                                    onChange={handleNewTaskChange}
                                    style={inputStyle}
                                    required
                                />
                            </label>
                            <label>
                                Description:
                                <textarea
                                    name="description"
                                    value={newTaskData.description}
                                    onChange={handleNewTaskChange}
                                    rows={5}
                                    style={inputStyle}
                                    required
                                />
                            </label>
                            <label>
                                Priority:
                                <select
                                    name="priority"
                                    value={newTaskData.priority}
                                    onChange={handleNewTaskChange}
                                    style={inputStyle}
                                >
                                    {['low', 'medium', 'high', 'critical'].map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Data Sensitivity:
                                <select
                                    name="dataSensitivity"
                                    value={newTaskData.dataSensitivity}
                                    onChange={handleNewTaskChange}
                                    style={inputStyle}
                                >
                                    {['public', 'internal', 'confidential', 'secret', 'top_secret'].map(ds => (
                                        <option key={ds} value={ds}>{ds}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Assign To Agent:
                                <select
                                    name="assignToAgentId"
                                    value={newTaskData.assignToAgentId}
                                    onChange={handleNewTaskChange}
                                    style={inputStyle}
                                >
                                    <option value="">(Unassigned)</option>
                                    {agents.map(agent => (
                                        <option key={agent.id} value={agent.id}>
                                            {agent.name} ({agent.status})
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <button type="submit" style={buttonStyle} disabled={isLoading}>
                                {isLoading ? 'Creating Task...' : 'Create & Assign Task'}
                            </button>
                        </form>
                    </>
                ) : (
                    <p>Select an agent from the list to view details and manage tasks.</p>
                )}
            </div>
        </div>
    );
};

export default AIAgentDashboard;