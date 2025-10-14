import { useState, useCallback, useMemo, useEffect, useContext } from 'react';
import { DataContext } from '../../../context/DataContext'; // Adjust path as necessary

//region Copied Definitions from AIInsights.tsx for self-containment and strict adherence
// Expanded Insight Data Structure (conceptual, assumes DataContext provides this)
export interface ExtendedAIInsight {
    id: string;
    title: string;
    description: string;
    urgency: 'low' | 'medium' | 'high' | 'critical' | 'informational';
    type: 'general' | 'predictive' | 'actionable' | 'correlation' | 'anomaly' | 'sentiment' | 'geospatial' | 'multimedia' | 'risk' | 'opportunity' | 'efficiency' | 'compliance' | 'market' | 'customer' | 'security' | 'ethical' | 'resource' | 'sustainability' | 'trend' | 'forecasting' | 'optimization' | 'recommendation';
    timestamp: string; // ISO string
    source: string; // e.g., 'Sales Data', 'Marketing Analytics', 'IoT Sensors'
    dataPoints?: any[]; // Raw data points supporting the insight
    metrics?: { [key: string]: any }; // Key metrics related to the insight
    relatedEntities?: { type: string; id: string; name: string }[];
    recommendedActions?: { id: string; description: string; priority: 'low' | 'medium' | 'high'; status: 'pending' | 'in-progress' | 'completed' | 'deferred' }[];
    predictions?: { target: string; value: number; confidence: number; trend: 'up' | 'down' | 'stable' }[];
    visualizations?: { type: 'chart' | 'map' | 'graph'; data: any; options?: any }[];
    explanation?: string; // Explainable AI (XAI)
    feedback?: { rating: number; comment: string; timestamp: string }[];
    modelVersion?: string;
    ethicalConsiderations?: { aspect: string; score: number; details: string }[]; // Ethical AI
    tags?: string[];
    status?: 'active' | 'archived' | 'dismissed' | 'resolved';
    impactScore?: number; // Calculated impact
}

// Insight Type Icon Map (new)
const InsightTypeIconMap: { [key: string]: string } = {
    'general': '💡',
    'predictive': '🔮',
    'actionable': '🚀',
    'correlation': '🔗',
    'anomaly': '🚨',
    'sentiment': '😊',
    'geospatial': '🗺️',
    'multimedia': '🏞️',
    'risk': '⚠️',
    'opportunity': '✨',
    'efficiency': '⚙️',
    'compliance': '⚖️',
    'market': '📊',
    'customer': '👤',
    'security': '🔒',
    'ethical': '⚖️',
    'resource': '📦',
    'sustainability': '🌿',
    'trend': '📈',
    'forecasting': '🗓️',
    'optimization': '🎯',
    'recommendation': '👍',
};

// Utility for generating unique IDs (new)
export const generateUniqueId = (): string => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
//endregion

// Define the structure for AI performance metrics as used in the seed
interface AIPerformanceMetrics {
    lastHeartbeat: string;
    insightGenerationRate: number; // Insights per minute
    averageResponseTime: number; // ms
    dataProcessingVolume: number; // GB/hour
    modelAccuracyHistory: { timestamp: string; accuracy: number }[];
    resourceUtilization: { cpu: number; memory: number; gpu?: number }; // %
}

// Define the structure for AI model
interface AIModel {
    id: string;
    name: string;
    version: string;
    description: string;
}

// Define the structure for AI preferences
interface AIPreferences {
    insightTypes: string[];
    urgencyThreshold: string;
    dataSources: string[];
    realtimeUpdates: boolean;
    explanationLevel: 'none' | 'basic' | 'detailed';
    modelSelection: string;
}

// Define the structure for a collaboration user
interface CollaborationUser {
    id: string;
    name: string;
    avatar: string;
}

export const useAIInsightManagement = () => {
    // Attempt to get data and actions from DataContext. If not available, use local mocks.
    const context = useContext(DataContext);

    //region Core Insight Data & Actions from Context/Mocks
    const aiInsights = context?.aiInsights || [];
    const isInsightsLoading = context?.isInsightsLoading || false;
    const generateDashboardInsights = context?.generateDashboardInsights || (() => console.warn('generateDashboardInsights not provided by DataContext'));
    const dismissInsight = context?.dismissInsight || ((id: string) => console.log(`Mock: Dismiss insight ${id}`));
    const markInsightAsActioned = context?.markInsightAsActioned || ((insightId: string, actionId: string) => console.log(`Mock: Actioned ${actionId} for insight ${insightId}`));
    //endregion

    //region AI Query Interface Logic
    const [queryInput, setQueryInput] = useState('');
    const [queryResults, setQueryResults] = useState<string[]>(context?.aiQueryResults || []);
    const [isQuerying, setIsQuerying] = useState(context?.isQueryingAI || false);

    const submitAIQuery = useCallback(async (query: string) => {
        if (context?.submitAIQuery) {
            context.submitAIQuery(query);
        } else {
            setIsQuerying(true);
            setQueryResults([]);
            setTimeout(() => {
                const mockResponse = `Based on your query "${query}", the AI suggests: Key trends indicate a 15% growth in Q3. Consider reallocating resources to high-performing regions. (Mocked)`;
                setQueryResults([mockResponse]);
                setIsQuerying(false);
            }, 2000);
        }
    }, [context]);
    //endregion

    //region Preferences Manager Logic
    const availableInsightTypes = useMemo(() => Object.keys(InsightTypeIconMap), []);
    const availableDataSources = useMemo(() => ['Sales Data', 'Marketing Analytics', 'Customer Support Logs', 'IoT Sensor Data', 'Financial Reports', 'Social Media Feeds'], []);
    const availableAIModels: AIModel[] = useMemo(() => [
        { id: 'quantum-v3.2', name: 'Quantum Core', version: '3.2', description: 'Advanced general intelligence model with enhanced predictive capabilities.' },
        { id: 'symphony-v1.1', name: 'Symphony-XAI', version: '1.1', description: 'Specialized model for explainable AI, providing detailed reasoning for insights.' },
        { id: 'chronos-v2.0', name: 'Chronos-Temporal', version: '2.0', description: 'Optimized for real-time anomaly detection and temporal forecasting.' },
    ], []);

    const initialPreferences: AIPreferences = useMemo(() => ({
        insightTypes: ['predictive', 'actionable', 'anomaly'],
        urgencyThreshold: 'medium',
        dataSources: ['Sales Data', 'Marketing Analytics'],
        realtimeUpdates: true,
        explanationLevel: 'detailed',
        modelSelection: availableAIModels[0]?.id || 'quantum-v3.2', // Ensure a fallback
    }), [availableAIModels]);

    const [preferences, setPreferences] = useState<AIPreferences>(context?.aiPreferences || initialPreferences);

    useEffect(() => {
        if (context?.aiPreferences) {
            setPreferences(context.aiPreferences);
        }
    }, [context?.aiPreferences]);

    const handlePreferenceChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        if (name === 'insightTypes' || name === 'dataSources') {
            const valArray = Array.from((e.target as HTMLSelectElement).options)
                .filter(option => option.selected)
                .map(option => option.value);
            setPreferences(prev => ({ ...prev, [name]: valArray }));
        } else {
            setPreferences(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    }, []);

    const handleSavePreferences = useCallback(async () => {
        if (context?.updateAIPreferences) {
            await context.updateAIPreferences(preferences);
        } else {
            console.log("Mock: Saving new AI preferences:", preferences);
            alert('AI Preferences updated successfully! (Mock)');
        }
    }, [preferences, context]);
    //endregion

    //region Insight Feedback Module Logic
    const provideInsightFeedback = context?.provideInsightFeedback || ((insightId: string, rating: number, comment: string) => {
        console.log(`Mock Feedback for ${insightId}: Rating=${rating}, Comment="${comment}"`);
    });
    //endregion

    //region AI System Health and Performance Monitor
    const aiSystemStatus = context?.aiSystemStatus || 'operational';
    const aiPerformanceMetrics: AIPerformanceMetrics = useMemo(() => context?.aiPerformanceMetrics || {
        lastHeartbeat: new Date().toISOString(),
        insightGenerationRate: 15.3,
        averageResponseTime: 120,
        dataProcessingVolume: 5.8,
        modelAccuracyHistory: [
            { timestamp: new Date(Date.now() - 3600000).toISOString(), accuracy: 88.5 },
            { timestamp: new Date(Date.now() - 1800000).toISOString(), accuracy: 89.1 },
            { timestamp: new Date().toISOString(), accuracy: 90.2 },
        ],
        resourceUtilization: { cpu: 75.2, memory: 45.1, gpu: 88.9 },
    }, [context?.aiPerformanceMetrics]);
    //endregion

    //region Historical Insight Archive Logic
    const [historicalSearchTerm, setHistoricalSearchTerm] = useState('');
    const [historicalFilters, setHistoricalFilters] = useState({ type: 'all', urgency: 'all', status: 'all', startDate: '', endDate: '' });
    const [historicalSearchResults, setHistoricalSearchResults] = useState<ExtendedAIInsight[]>(context?.historicalInsights || []);
    const [isHistoricalLoading, setIsHistoricalLoading] = useState(context?.isHistoricalInsightsLoading || false);
    const [historicalTotalResults, setHistoricalTotalResults] = useState(context?.historicalInsightTotal || 0);

    useEffect(() => {
        if (context?.historicalInsights) {
            setHistoricalSearchResults(context.historicalInsights);
            setHistoricalTotalResults(context.historicalInsightTotal || 0);
        }
        if (typeof context?.isHistoricalInsightsLoading === 'boolean') {
            setIsHistoricalLoading(context.isHistoricalInsightsLoading);
        }
    }, [context?.historicalInsights, context?.isHistoricalInsightsLoading, context?.historicalInsightTotal]);

    const handleHistoricalFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setHistoricalFilters(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleHistoricalSearch = useCallback(async (query: string, filters: any) => {
        if (context?.fetchHistoricalInsights) {
            await context.fetchHistoricalInsights(query, filters);
        } else {
            setIsHistoricalLoading(true);
            setHistoricalSearchResults([]);
            setTimeout(() => {
                const filtered = aiInsights.filter(insight => {
                    const matchesSearch = !query || insight.title.toLowerCase().includes(query.toLowerCase()) || insight.description.toLowerCase().includes(query.toLowerCase()) || (insight.explanation?.toLowerCase().includes(query.toLowerCase()));
                    const matchesType = filters.type === 'all' || insight.type === filters.type;
                    const matchesUrgency = filters.urgency === 'all' || insight.urgency === filters.urgency;
                    const matchesStatus = filters.status === 'all' || insight.status === filters.status;
                    const insightDate = new Date(insight.timestamp).getTime();
                    const startDate = filters.startDate ? new Date(filters.startDate).getTime() : 0;
                    const endDate = filters.endDate ? new Date(filters.endDate).getTime() : Infinity;
                    const matchesDate = insightDate >= startDate && insightDate <= endDate;
                    return matchesSearch && matchesType && matchesUrgency && matchesStatus && matchesDate;
                });
                setHistoricalSearchResults(filtered);
                setHistoricalTotalResults(filtered.length);
                setIsHistoricalLoading(false);
            }, 1500);
        }
    }, [aiInsights, context]);
    //endregion

    //region Collaboration Hub Logic
    const [selectedCollaborationInsightId, setSelectedCollaborationInsightId] = useState<string | null>(null);
    const [newCommentText, setNewCommentText] = useState('');
    const [assignedUserForCollaboration, setAssignedUserForCollaboration] = useState<string>('');

    const collaborationUsers: CollaborationUser[] = useMemo(() => [
        { id: 'user-123', name: 'You (AI Lead)', avatar: 'https://i.pravatar.cc/30?img=6' },
        { id: 'user-456', name: 'Dr. Evelyn Reed (Data Scientist)', avatar: 'https://i.pravatar.cc/30?img=12' },
        { id: 'user-789', name: 'Mr. Alex Chen (Operations Manager)', avatar: 'https://i.pravatar.cc/30?img=22' },
        { id: 'user-101', name: 'Ms. Sarah Miller (Marketing Analyst)', avatar: 'https://i.pravatar.cc/30?img=34' },
    ], []);

    const addInsightComment = context?.addInsightComment || ((insightId: string, userId: string, comment: string) => {
        console.log(`Mock: User ${userId} commented on ${insightId}: "${comment}"`);
        // In a full implementation, this mock might update local state for the comment to appear.
    });

    const assignInsight = context?.assignInsight || ((insightId: string, userId: string) => {
        console.log(`Mock: Insight ${insightId} assigned to user ${userId}`);
        // In a full implementation, this mock might update local state for the assignment to appear.
    });

    const handleAddComment = useCallback(() => {
        if (selectedCollaborationInsightId && newCommentText.trim()) {
            // Assuming the current user (mocked as collaborationUsers[0]) is making the comment
            addInsightComment(selectedCollaborationInsightId, collaborationUsers[0].id, newCommentText.trim());
            setNewCommentText('');
        }
    }, [selectedCollaborationInsightId, newCommentText, addInsightComment, collaborationUsers]);

    const handleAssignInsight = useCallback(() => {
        if (selectedCollaborationInsightId && assignedUserForCollaboration) {
            assignInsight(selectedCollaborationInsightId, assignedUserForCollaboration);
            setAssignedUserForCollaboration(''); // Clear selection after assigning
        }
    }, [selectedCollaborationInsightId, assignedUserForCollaboration, assignInsight]);
    //endregion

    //region Initial Load Effect
    useEffect(() => {
        if (aiInsights.length === 0 && !isInsightsLoading) {
            generateDashboardInsights();
        }
    }, [aiInsights.length, isInsightsLoading, generateDashboardInsights]);
    //endregion

    return {
        // Core Insights
        aiInsights,
        isInsightsLoading,
        generateDashboardInsights,
        dismissInsight,
        markInsightAsActioned,

        // AI Query Interface
        queryInput,
        setQueryInput,
        queryResults,
        isQuerying,
        submitAIQuery,

        // Preferences Management
        preferences,
        handlePreferenceChange,
        handleSavePreferences,
        availableInsightTypes,
        availableDataSources,
        availableAIModels,

        // Insight Feedback
        provideInsightFeedback,

        // AI System Performance
        aiSystemStatus,
        aiPerformanceMetrics,

        // Historical Insights
        historicalSearchTerm,
        setHistoricalSearchTerm,
        historicalFilters,
        setHistoricalFilters,
        handleHistoricalFilterChange,
        handleHistoricalSearch,
        historicalSearchResults,
        isHistoricalLoading,
        historicalTotalResults,

        // Collaboration Hub
        selectedCollaborationInsightId,
        setSelectedCollaborationInsightId,
        newCommentText,
        setNewCommentText,
        assignedUserForCollaboration,
        setAssignedUserForCollaboration,
        collaborationUsers,
        handleAddComment,
        handleAssignInsight,
    };
};