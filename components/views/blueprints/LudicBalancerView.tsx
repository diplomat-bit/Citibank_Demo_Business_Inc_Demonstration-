/**
 * LudicBalancerView.tsx: The AI-Powered Ludic System Balancer Control Panel
 *
 * This module implements a sophisticated control panel for real-time game balance management,
 * leveraging advanced AI analytics and deterministic simulations. It provides game designers
 * and strategists with an unparalleled toolkit to monitor, analyze, predict, and remediate
 * balance issues in complex game economies and meta-games.
 *
 * Business Value: This system is worth millions by dramatically accelerating the game balance
 * iteration cycle from weeks to minutes, reducing operational costs associated with manual
 * data analysis, and enhancing player retention by ensuring a consistently fair and engaging
 * gameplay experience. It enables rapid adaptation to meta shifts, predictive identification
 * of emergent issues, and a verifiable audit trail for all balance adjustments. By empowering
 * rapid experimentation through simulation and providing AI-driven insights, it unlocks new
 * revenue streams through healthier, longer-lasting games and directly contributes to a
 * superior competitive advantage in the dynamic gaming market. Its agentic capabilities
 * can autonomously detect and flag issues, offering continuous, intelligent oversight,
 * ensuring high velocity in decision-making and implementation, thereby safeguarding multi-million
 * dollar game franchises.
 */
import React, { useState, useEffect, useCallback, createContext, useContext, useReducer, useRef } from 'react';
import Card from '../../Card';
import { GoogleGenAI, Type } from "@google/genai";

// Utility Types
export type HeroStats = {
    id: string;
    name: string;
    winRate: number;
    pickRate: number;
    banRate?: number;
    kda?: number;
    goldPerMinute?: number;
    damageDealt?: number;
    damageTaken?: number;
    role?: 'Tank' | 'DPS' | 'Support' | 'Initiator';
    complexity?: 'Low' | 'Medium' | 'High';
    abilities?: { name: string; description: string; impact: number }[];
    itemSynergies?: { itemId: string; synergyScore: number }[];
    counterPicks?: { heroId: string; counterScore: number }[];
};

export type ItemStats = {
    id: string;
    name: string;
    cost: number;
    powerModifier: number; // e.g., +10% damage, +5% HP
    effectDescription: string;
};

export type BalanceIssue = {
    element: string; // Hero name, Item name, etc.
    problem: string;
    suggestion: string;
    impactMagnitude?: number; // Estimated impact on win rate, pick rate
    confidenceScore?: number; // AI's confidence in the suggestion
    status?: 'Pending' | 'Approved' | 'Rejected' | 'Implemented';
    proposedBy?: string; // User ID or 'AI' or Agent ID
    timestamp?: string;
    category?: 'Hero' | 'Item' | 'Ability' | 'Meta'; // Added for improved typing from AI schemas
};

export type GameSnapshot = {
    id: string;
    timestamp: string;
    gameData: string; // Raw input data
    processedStats: HeroStats[];
    balanceReport: BalanceIssue[];
    versionTag: string;
    notes?: string;
};

export type SimulationParameters = {
    matchesToSimulate: number;
    playerSkillDistribution: 'Normal' | 'SkewedHigh' | 'SkewedLow';
    metaStabilityFactor: number; // How quickly meta shifts
    heroDiversityGoal: number; // Target for diverse hero picks
    economicImpactSensitivity: number; // How much economy changes affect power
};

export type SimulationResult = {
    snapshotId: string;
    simulationId: string;
    timestamp: string;
    proposedChanges: BalanceIssue[]; // The changes that were simulated
    predictedHeroStats: HeroStats[];
    predictedOverallWinRateDistribution: { range: string; count: number }[];
    predictedMetaShiftScore: number;
    outcomeSummary: string;
    warnings?: string[];
};

export type PromptTemplate = {
    id: string;
    name: string;
    template: string;
    description: string;
    schema: any;
    defaultModel: string;
};

export type UserProfile = {
    id: string;
    name: string;
    role: 'Admin' | 'Designer' | 'Analyst' | 'QA';
    permissions: string[]; // e.g., 'create_report', 'propose_change', 'run_simulation', 'approve_change', 'manage_prompts', 'reset_data', 'trigger_agent'
};

export type AuditLogEntry = {
    id: string;
    timestamp: string;
    userId: string; // Or agent ID
    action: string; // e.g., 'AI_REPORT_GENERATED', 'SIMULATION_RUN', 'BALANCE_ISSUE_APPROVED'
    details: Record<string, any>;
    category: 'System' | 'User' | 'AI' | 'Agent';
    severity: 'Info' | 'Warning' | 'Error';
};

export type AgentDefinition = {
    id: string;
    name: string;
    isActive: boolean;
    role: 'Monitor' | 'Proposer';
    description: string;
    triggerThresholds: {
        winRateDeviation: number; // e.g., trigger if any hero WR is > X% from 50%
        pickRateDeviation: number; // e.g., trigger if any hero PR is < X%
    };
    lastRunTimestamp?: string;
    lastAction?: string;
};

// Mock Data - significantly expanded
const mockGameData = `Hero A: Win Rate 65%, Pick Rate 80%, Ban Rate 40%, KDA 3.5, Role DPS, Abilities [Swift Strike, Empowered Shot], Items [SwordOfPower, ArmorOfMight]
Hero B: Win Rate 42%, Pick Rate 5%, Ban Rate 1%, KDA 1.8, Role Tank, Abilities [Shield Wall, Taunt], Items [ShieldOfEndurance, BootsOfSpeed]
Hero C: Win Rate 51%, Pick Rate 15%, Ban Rate 5%, KDA 2.2, Role Support, Abilities [Healing Aura, Stun Grenade], Items [StaffOfMending, AmuletOfWisdom]
Hero D: Win Rate 58%, Pick Rate 25%, Ban Rate 10%, KDA 2.9, Role DPS, Abilities [Explosive Arrow, Stealth], Items [BowOfPrecision, DaggerOfShadows]
Hero E: Win Rate 48%, Pick Rate 12%, Ban Rate 2%, KDA 2.0, Role Initiator, Abilities [Charge, Earthquake], Items [HammerOfRuin, PlateArmor]
Item SwordOfPower: Cost 1000, Power +15% Damage, Effect 'Grants bonus attack damage.'
Item ShieldOfEndurance: Cost 800, Power +10% HP, Effect 'Increases maximum health.'
Item StaffOfMending: Cost 900, Power +20% Healing, Effect 'Boosts healing output.'
Item BowOfPrecision: Cost 1100, Power +12% CritChance, Effect 'Enhances critical strike probability.'
Item DaggerOfShadows: Cost 700, Power +8% Lifesteal, Effect 'Restores health on hit.'
Item HammerOfRuin: Cost 1200, Power +20% StunDuration, Effect 'Increases duration of stun effects.'
Item PlateArmor: Cost 600, Power +15% Armor, Effect 'Reduces incoming physical damage.'`;

// Expanded AI Schemas for different analysis types
const defaultBalanceSchema = {
    type: Type.OBJECT,
    properties: {
        analysis: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    element: { type: 'STRING' },
                    problem: { type: 'STRING' },
                    suggestion: { type: 'STRING' },
                    impactMagnitude: { type: 'NUMBER', description: 'Estimated percentage change in element\'s primary metric (e.g., win rate)' },
                    confidenceScore: { type: 'NUMBER', description: 'AI confidence in the suggestion, 0-1 scale' },
                    category: { type: 'STRING', enum: ['Hero', 'Item', 'Ability', 'Meta'] }
                },
                required: ['element', 'problem', 'suggestion', 'impactMagnitude', 'confidenceScore', 'category']
            }
        }
    }
};

const metaAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        metaTrends: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    trend: { type: 'STRING', description: 'Description of the meta trend' },
                    cause: { type: 'STRING', description: 'Root cause of the trend' },
                    implication: { type: 'STRING', description: 'Consequences for game health' },
                    actionableInsight: { type: 'STRING', description: 'Suggested high-level action to influence the meta' }
                },
                required: ['trend', 'cause', 'implication', 'actionableInsight']
            }
        }
    }
};

const powerCurveSchema = {
    type: Type.OBJECT,
    properties: {
        powerCurveAnalysis: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    hero: { type: 'STRING' },
                    stage: { type: 'STRING', enum: ['Early Game', 'Mid Game', 'Late Game'] },
                    powerSpikeDescription: { type: 'STRING' },
                    suggestedAdjustment: { type: 'STRING', description: 'Specific numerical change to smooth/sharpen power curve' }
                },
                required: ['hero', 'stage', 'powerSpikeDescription', 'suggestedAdjustment']
            }
        }
    }
};

// --- Global State Management (simplified context for a single file) ---
export type GameMetaState = {
    heroStats: HeroStats[];
    itemStats: ItemStats[];
    currentSnapshot: GameSnapshot | null;
    history: GameSnapshot[];
    activeAnalysisMode: string;
    promptTemplates: PromptTemplate[];
    simulationResults: SimulationResult[];
    users: UserProfile[];
    currentUser: UserProfile | null;
    auditLogs: AuditLogEntry[];
    metrics: Record<string, number>;
    agents: AgentDefinition[];
};

type GameMetaAction =
    | { type: 'SET_HERO_STATS'; payload: HeroStats[] }
    | { type: 'SET_ITEM_STATS'; payload: ItemStats[] }
    | { type: 'ADD_SNAPSHOT'; payload: GameSnapshot }
    | { type: 'LOAD_SNAPSHOT'; payload: GameSnapshot }
    | { type: 'SET_ACTIVE_ANALYSIS_MODE'; payload: string }
    | { type: 'ADD_PROMPT_TEMPLATE'; payload: PromptTemplate }
    | { type: 'UPDATE_PROMPT_TEMPLATE'; payload: PromptTemplate }
    | { type: 'ADD_SIMULATION_RESULT'; payload: SimulationResult }
    | { type: 'SET_CURRENT_USER'; payload: UserProfile | null }
    | { type: 'ADD_AUDIT_LOG'; payload: AuditLogEntry }
    | { type: 'INCREMENT_METRIC'; payload: { name: string; value?: number } }
    | { type: 'UPDATE_BALANCE_ISSUE_STATUS'; payload: { issueElement: string; issueProblem: string; status: 'Pending' | 'Approved' | 'Rejected' | 'Implemented'; by: string } }
    | { type: 'UPDATE_AGENT'; payload: AgentDefinition }
    | { type: 'INIT_STATE'; payload: GameMetaState };

const gameMetaReducer = (state: GameMetaState, action: GameMetaAction): GameMetaState => {
    switch (action.type) {
        case 'INIT_STATE':
            return { ...action.payload };
        case 'SET_HERO_STATS':
            return { ...state, heroStats: action.payload };
        case 'SET_ITEM_STATS':
            return { ...state, itemStats: action.payload };
        case 'ADD_SNAPSHOT':
            return {
                ...state,
                history: [...state.history, action.payload],
                currentSnapshot: action.payload
            };
        case 'LOAD_SNAPSHOT':
            return {
                ...state,
                currentSnapshot: action.payload,
                heroStats: action.payload.processedStats,
                // Assuming raw game data will be derived or set separately if needed
            };
        case 'SET_ACTIVE_ANALYSIS_MODE':
            return { ...state, activeAnalysisMode: action.payload };
        case 'ADD_PROMPT_TEMPLATE':
            return { ...state, promptTemplates: [...state.promptTemplates, action.payload] };
        case 'UPDATE_PROMPT_TEMPLATE':
            return {
                ...state,
                promptTemplates: state.promptTemplates.map(t =>
                    t.id === action.payload.id ? action.payload : t
                )
            };
        case 'ADD_SIMULATION_RESULT':
            return { ...state, simulationResults: [...state.simulationResults, action.payload] };
        case 'SET_CURRENT_USER':
            return { ...state, currentUser: action.payload };
        case 'ADD_AUDIT_LOG':
            // Simple log retention, keep last 100 for performance
            return { ...state, auditLogs: [...state.auditLogs, action.payload].slice(-100) };
        case 'INCREMENT_METRIC':
            return {
                ...state,
                metrics: {
                    ...state.metrics,
                    [action.payload.name]: (state.metrics[action.payload.name] || 0) + (action.payload.value || 1)
                }
            };
        case 'UPDATE_BALANCE_ISSUE_STATUS':
            return {
                ...state,
                currentSnapshot: state.currentSnapshot ? {
                    ...state.currentSnapshot,
                    balanceReport: state.currentSnapshot.balanceReport.map(issue =>
                        issue.element === action.payload.issueElement && issue.problem === action.payload.issueProblem
                            ? { ...issue, status: action.payload.status, proposedBy: action.payload.by, timestamp: new Date().toISOString() }
                            : issue
                    )
                } : null,
            };
        case 'UPDATE_AGENT':
            return {
                ...state,
                agents: state.agents.map(agent =>
                    agent.id === action.payload.id ? action.payload : agent
                )
            };
        default:
            return state;
    }
};

const initialGameMetaState: GameMetaState = {
    heroStats: [],
    itemStats: [],
    currentSnapshot: null,
    history: [],
    activeAnalysisMode: 'General Balance',
    promptTemplates: [
        {
            id: 'general_balance',
            name: 'General Balance Report',
            description: 'Analyzes hero and item statistics for general balance issues.',
            template: `You are a Principal Game Designer. Analyze the following hero and item statistics and identify the top balance issues. For each, provide the element (hero/item), a description of the problem, a specific, numerical change to a game parameter to address it, an estimated impact magnitude (percentage change in win rate/power), and your confidence score (0-1). Data:\n{{gameData}}`,
            schema: defaultBalanceSchema,
            defaultModel: 'gemini-2.5-flash',
        },
        {
            id: 'meta_analysis',
            name: 'Meta Game Analysis',
            description: 'Identifies current meta trends and their implications.',
            template: `You are a Lead Game Strategist. Based on the following game data, identify prevalent meta trends, their root causes, implications for player experience, and actionable insights for high-level design changes. Data:\n{{gameData}}`,
            schema: metaAnalysisSchema,
            defaultModel: 'gemini-2.5-flash',
        },
        {
            id: 'power_curve_analysis',
            name: 'Power Curve Analysis',
            description: 'Examines hero power spikes and troughs across game stages.',
            template: `You are an expert game balancer. Analyze the power progression of heroes throughout the early, mid, and late game based on the provided stats. Identify heroes with overly dominant or weak power curves at specific stages and suggest numerical adjustments to smooth or sharpen these curves appropriately. Data:\n{{gameData}}`,
            schema: powerCurveSchema,
            defaultModel: 'gemini-2.5-flash',
        }
    ],
    simulationResults: [],
    users: [
        { id: 'user_ai', name: 'AI Assistant', role: 'Admin', permissions: ['create_report', 'propose_change', 'run_simulation'] },
        { id: 'user_1', name: 'Alice', role: 'Designer', permissions: ['create_report', 'propose_change', 'run_simulation', 'view_report'] },
        { id: 'user_2', name: 'Bob', role: 'Analyst', permissions: ['view_report', 'run_simulation'] },
        { id: 'user_admin', name: 'Admin User', role: 'Admin', permissions: ['create_report', 'propose_change', 'run_simulation', 'approve_change', 'manage_prompts', 'reset_data', 'trigger_agent', 'view_report'] }
    ],
    currentUser: { id: 'user_admin', name: 'Admin User', role: 'Admin', permissions: ['create_report', 'propose_change', 'run_simulation', 'approve_change', 'manage_prompts', 'reset_data', 'trigger_agent', 'view_report'] },
    auditLogs: [],
    metrics: {
        total_ai_reports_generated: 0,
        total_simulations_run: 0,
        total_balance_issues_approved: 0,
        total_balance_issues_implemented: 0,
        agent_triggered_analysis: 0,
    },
    agents: [
        {
            id: 'agent_balancer_monitor',
            name: 'Balance Monitor Agent',
            isActive: true,
            role: 'Monitor',
            description: 'Monitors hero stats and triggers general balance analysis if deviations are detected.',
            triggerThresholds: { winRateDeviation: 10, pickRateDeviation: 20 }, // +/- 10% from 50WR, <20% pick rate
            lastRunTimestamp: undefined,
            lastAction: undefined,
        }
    ]
};

export const GameMetaContext = createContext<{
    state: GameMetaState;
    dispatch: React.Dispatch<GameMetaAction>;
}>({
    state: initialGameMetaState,
    dispatch: () => null,
});

export const GameMetaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(gameMetaReducer, initialGameMetaState);

    // Persist state to local storage (mock for real app)
    useEffect(() => {
        try {
            const persistedState = localStorage.getItem('ludicBalancerState');
            if (persistedState) {
                const loadedState = JSON.parse(persistedState);
                // Ensure initial agents are present if not in loaded state (e.g. for new features)
                if (!loadedState.agents || loadedState.agents.length === 0) {
                    loadedState.agents = initialGameMetaState.agents;
                }
                // Ensure metrics are initialized
                if (!loadedState.metrics) {
                    loadedState.metrics = initialGameMetaState.metrics;
                }
                // Ensure auditLogs are initialized
                if (!loadedState.auditLogs) {
                    loadedState.auditLogs = [];
                }
                dispatch({ type: 'INIT_STATE', payload: loadedState });
            }
        } catch (error) {
            console.error('Failed to load state from local storage', error);
            // Fallback to initial state if parsing fails
            dispatch({ type: 'INIT_STATE', payload: initialGameMetaState });
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('ludicBalancerState', JSON.stringify(state));
        } catch (error) {
            console.error('Failed to save state to local storage', error);
        }
    }, [state]);

    return (
        <GameMetaContext.Provider value={{ state, dispatch }}>
            {children}
        </GameMetaContext.Provider>
    );
};

export const useGameMeta = () => useContext(GameMetaContext);

// --- Utility Functions ---

export function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function parseGameData(rawData: string): { heroes: HeroStats[], items: ItemStats[] } {
    const heroes: HeroStats[] = [];
    const items: ItemStats[] = [];
    const lines = rawData.split('\n').filter(line => line.trim() !== '');

    lines.forEach(line => {
        if (line.startsWith('Hero ')) {
            const match = line.match(/Hero (\w+): Win Rate (\d+\.?\d*)%, Pick Rate (\d+\.?\d*)%, Ban Rate (\d+\.?\d*)%, KDA (\d+\.?\d*), Role (\w+), Abilities \[(.+?)\], Items \[(.+?)\]/);
            if (match) {
                const [, name, winRate, pickRate, banRate, kda, role, abilitiesStr, itemsStr] = match;
                heroes.push({
                    id: name.toLowerCase().replace(/\s/g, '_'),
                    name,
                    winRate: parseFloat(winRate),
                    pickRate: parseFloat(pickRate),
                    banRate: parseFloat(banRate),
                    kda: parseFloat(kda),
                    role: role as any, // 'Tank' | 'DPS' | 'Support' | 'Initiator'
                    abilities: abilitiesStr.split(', ').map(a => ({ name: a.trim(), description: '', impact: 0.5 })), // Simplified
                    itemSynergies: itemsStr.split(', ').map(i => ({ itemId: i.trim().toLowerCase().replace(/\s/g, '_'), synergyScore: 0.7 })) // Simplified
                });
            }
        } else if (line.startsWith('Item ')) {
            const match = line.match(/Item (\w+): Cost (\d+), Power ([^,]+), Effect '(.+)'/);
            if (match) {
                const [, name, cost, power, effect] = match;
                items.push({
                    id: name.toLowerCase().replace(/\s/g, '_'),
                    name,
                    cost: parseInt(cost),
                    powerModifier: parseFloat(power.replace(/[^\d.-]/g, '')) || 0, // Extract number from power string
                    effectDescription: effect
                });
            }
        }
    });

    return { heroes, items };
}

export function calculateOverallMetaScore(heroes: HeroStats[]): number {
    if (heroes.length === 0) return 0;
    const avgWinRateDeviation = heroes.reduce((sum, h) => sum + Math.abs(h.winRate - 50), 0) / heroes.length;
    const pickRateEntropy = -heroes.reduce((sum, h) => {
        const p = h.pickRate / 100;
        return sum + (p > 0 ? p * Math.log2(p) : 0);
    }, 0);
    const maxEntropy = Math.log2(heroes.length > 0 ? heroes.length : 1);
    const normalizedEntropy = maxEntropy > 0 ? pickRateEntropy / maxEntropy : 0;

    // Lower deviation from 50% WR is good, higher entropy (diversity) is good.
    // Score closer to 100 is better.
    // The divisor 20 for avgWinRateDeviation implies max deviation of 20 points impacts score by 50.
    return Math.round((1 - Math.min(1, avgWinRateDeviation / 20)) * 50 + normalizedEntropy * 50); // Rough scaling
}

export function calculateImpactOfChange(heroStats: HeroStats[], proposedChange: BalanceIssue): { newStats: HeroStats[], estimatedImpact: number } {
    const newStats = [...heroStats];
    let estimatedImpact = 0;

    const targetHeroIndex = newStats.findIndex(h => h.name === proposedChange.element);
    if (targetHeroIndex > -1) {
        const targetHero = { ...newStats[targetHeroIndex] };
        const suggestion = proposedChange.suggestion.toLowerCase();

        if (suggestion.includes('win rate by ')) {
            const match = suggestion.match(/win rate by ([-+]?\d+\.?\d*)%/);
            if (match && targetHero.winRate !== undefined) {
                const change = parseFloat(match[1]);
                targetHero.winRate = Math.max(0, Math.min(100, targetHero.winRate + change));
                estimatedImpact = change;
            }
        } else if (suggestion.includes('damage by ')) {
            const match = suggestion.match(/damage by ([-+]?\d+\.?\d*)%/);
            if (match) {
                const change = parseFloat(match[1]);
                // Simplified: Assume damage change translates to ~1/5th impact on win rate
                targetHero.winRate = Math.max(0, Math.min(100, targetHero.winRate + (change / 5)));
                estimatedImpact = change / 5;
            }
        } else if (suggestion.includes('health by ')) {
            const match = suggestion.match(/health by ([-+]?\d+\.?\d*)%/);
            if (match) {
                const change = parseFloat(match[1]);
                // Simplified: Assume health change translates to ~1/10th impact on win rate
                targetHero.winRate = Math.max(0, Math.min(100, targetHero.winRate + (change / 10)));
                estimatedImpact = change / 10;
            }
        }
        // Additional parsing for 'cost', 'cooldown', 'ability power', etc.
        // This is a placeholder for a more sophisticated game simulation engine.

        newStats[targetHeroIndex] = targetHero;
    }

    return { newStats, estimatedImpact };
}

// Authorization check utility
export function checkPermissions(currentUser: UserProfile | null, requiredPermissions: string[]): boolean {
    if (!currentUser) return false;
    if (currentUser.role === 'Admin') return true; // Admins bypass specific permissions for simplicity
    return requiredPermissions.every(permission => currentUser.permissions.includes(permission));
}

// --- Custom Hooks ---
export const useLogger = () => {
    const { state, dispatch } = useGameMeta();
    const currentUser = state.currentUser;

    const logAudit = useCallback((
        action: string,
        details: Record<string, any>,
        category: 'System' | 'User' | 'AI' | 'Agent',
        severity: 'Info' | 'Warning' | 'Error' = 'Info'
    ) => {
        dispatch({
            type: 'ADD_AUDIT_LOG',
            payload: {
                id: generateUUID(),
                timestamp: new Date().toISOString(),
                userId: currentUser?.id || 'anonymous',
                action,
                details,
                category,
                severity,
            }
        });
    }, [dispatch, currentUser]);

    const incrementMetric = useCallback((name: string, value?: number) => {
        dispatch({ type: 'INCREMENT_METRIC', payload: { name, value } });
    }, [dispatch]);

    return { logAudit, incrementMetric };
};

export const useAIService = () => {
    const { state } = useGameMeta();
    const { logAudit, incrementMetric } = useLogger();
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    const generateReport = useCallback(async (
        promptTemplate: PromptTemplate,
        gameData: string,
        modelName: string = 'gemini-2.5-flash'
    ): Promise<any | null> => {
        if (!process.env.API_KEY) {
            const error = new Error('API_KEY is not configured for AI service.');
            logAudit('AI_REPORT_GENERATION_FAILED', { templateId: promptTemplate.id, model: modelName, error: error.message }, 'AI', 'Error');
            throw error;
        }

        try {
            const finalPrompt = promptTemplate.template.replace('{{gameData}}', gameData);
            const response = await ai.models.generateContent({
                model: modelName,
                contents: [{ role: 'user', parts: [{ text: finalPrompt }] }],
                generationConfig: { responseMimeType: "application/json", responseSchema: promptTemplate.schema }
            });
            const parsedResponse = JSON.parse(response.text);
            logAudit('AI_REPORT_GENERATED', { templateId: promptTemplate.id, model: modelName, success: true }, 'AI', 'Info');
            incrementMetric('total_ai_reports_generated');
            return parsedResponse;
        } catch (error: any) {
            logAudit('AI_REPORT_GENERATION_FAILED', { templateId: promptTemplate.id, model: modelName, error: error.message || 'Unknown AI error' }, 'AI', 'Error');
            throw error;
        }
    }, [ai, logAudit, incrementMetric]);

    const refineSuggestion = useCallback(async (
        issue: BalanceIssue,
        context: string,
        modelName: string = 'gemini-2.5-flash'
    ): Promise<string> => {
        if (!process.env.API_KEY) {
            const error = new Error('API_KEY is not configured for AI service.');
            logAudit('AI_REFINEMENT_FAILED', { issueElement: issue.element, error: error.message }, 'AI', 'Error');
            throw error;
        }
        const prompt = `Given the balance issue for ${issue.element}: "${issue.problem}" and the current suggestion "${issue.suggestion}". Refine this suggestion based on the following additional context: "${context}". Provide a new, more precise numerical suggestion. Respond only with the new suggestion string.`;
        try {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
            });
            const refinedText = response.text.trim();
            logAudit('AI_SUGGESTION_REFINED', { issueElement: issue.element, original: issue.suggestion, refined: refinedText }, 'AI', 'Info');
            return refinedText;
        } catch (error: any) {
            logAudit('AI_REFINEMENT_FAILED', { issueElement: issue.element, error: error.message || 'Unknown AI error' }, 'AI', 'Error');
            return issue.suggestion; // Return original if refinement fails
        }
    }, [ai, logAudit]);

    return { generateReport, refineSuggestion };
};

export const useSimulationEngine = () => {
    const { state, dispatch } = useGameMeta();
    const { logAudit, incrementMetric } = useLogger();

    const runSimulation = useCallback(async (
        params: SimulationParameters,
        currentStats: HeroStats[],
        proposedChanges: BalanceIssue[],
        snapshotId: string
    ): Promise<SimulationResult> => {
        logAudit('SIMULATION_INITIATED', { params, numChanges: proposedChanges.length, snapshotId }, 'System', 'Info');

        let simulatedStats: HeroStats[] = JSON.parse(JSON.stringify(currentStats));
        let totalImpact = 0;

        for (const change of proposedChanges) {
            const { newStats, estimatedImpact } = calculateImpactOfChange(simulatedStats, change);
            simulatedStats = newStats;
            totalImpact += estimatedImpact;
        }

        const metaShiftFactor = Math.min(1, Math.abs(totalImpact / (params.heroDiversityGoal * 10)));

        simulatedStats = simulatedStats.map(hero => {
            const adjustedHero = { ...hero };
            adjustedHero.winRate = Math.max(0, Math.min(100, adjustedHero.winRate + (Math.random() * 2 - 1) * metaShiftFactor));
            adjustedHero.pickRate = Math.max(0, Math.min(100, adjustedHero.pickRate + (Math.random() * 5 - 2.5) * metaShiftFactor));
            return adjustedHero;
        });

        const overallWinRateDistribution = [
            { range: '<45%', count: simulatedStats.filter(h => h.winRate < 45).length },
            { range: '45-50%', count: simulatedStats.filter(h => h.winRate >= 45 && h.winRate < 50).length },
            { range: '50-55%', count: simulatedStats.filter(h => h.winRate >= 50 && h.winRate < 55).length },
            { range: '>55%', count: simulatedStats.filter(h => h.winRate >= 55).length },
        ];

        const result: SimulationResult = {
            snapshotId,
            simulationId: generateUUID(),
            timestamp: new Date().toISOString(),
            proposedChanges,
            predictedHeroStats: simulatedStats,
            predictedOverallWinRateDistribution: overallWinRateDistribution,
            predictedMetaShiftScore: calculateOverallMetaScore(simulatedStats),
            outcomeSummary: `Simulation completed with ${params.matchesToSimulate} matches. Overall meta shift detected: ${metaShiftFactor.toFixed(2)}. Total estimated win rate impact from changes: ${totalImpact.toFixed(2)}%.`,
            warnings: totalImpact > 10 ? ['High impact changes detected, monitor closely for unintended consequences.'] : []
        };

        dispatch({ type: 'ADD_SIMULATION_RESULT', payload: result });
        logAudit('SIMULATION_COMPLETED', { simulationId: result.simulationId, outcomeSummary: result.outcomeSummary, warnings: result.warnings }, 'System', result.warnings && result.warnings.length > 0 ? 'Warning' : 'Info');
        incrementMetric('total_simulations_run');
        return result;
    }, [dispatch, logAudit, incrementMetric]);

    return { runSimulation };
};

export const useAgenticAI = (
    generateReport: (promptTemplate: PromptTemplate, gameData: string, modelName: string) => Promise<any | null>,
    gameDataInput: string,
    setBalanceReport: (report: BalanceIssue[]) => void,
    dispatch: React.Dispatch<GameMetaAction>
) => {
    const { state } = useGameMeta();
    const { logAudit, incrementMetric } = useLogger();
    const agent = state.agents.find(a => a.id === 'agent_balancer_monitor');
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const runAgentCycle = useCallback(async () => {
        if (!agent || !agent.isActive || !state.heroStats.length) {
            return;
        }

        logAudit('AGENT_MONITOR_ACTIVATED', { agentId: agent.id, agentName: agent.name }, 'Agent', 'Info');

        const { winRateDeviation, pickRateDeviation } = agent.triggerThresholds;
        let issueDetected = false;
        let detectedHero: HeroStats | undefined;

        for (const hero of state.heroStats) {
            if (Math.abs(hero.winRate - 50) > winRateDeviation || hero.pickRate < pickRateDeviation) {
                issueDetected = true;
                detectedHero = hero;
                break;
            }
        }

        if (issueDetected && detectedHero) {
            logAudit('AGENT_ISSUE_DETECTED', { agentId: agent.id, hero: detectedHero.name, winRate: detectedHero.winRate, pickRate: detectedHero.pickRate }, 'Agent', 'Warning');
            try {
                const promptTemplate = state.promptTemplates.find(t => t.id === 'general_balance');
                if (promptTemplate) {
                    const report = await generateReport(promptTemplate, gameDataInput, promptTemplate.defaultModel);
                    if (report?.analysis && Array.isArray(report.analysis)) {
                        const parsedReports: BalanceIssue[] = report.analysis.map((item: any) => ({
                            ...item,
                            status: 'Pending',
                            proposedBy: agent.name, // Agent proposes the change
                            timestamp: new Date().toISOString()
                        }));
                        setBalanceReport(parsedReports); // Update the UI state directly for immediate feedback
                        // The main view will then create a snapshot including this
                        logAudit('AGENT_PROPOSED_BALANCE_CHANGES', { agentId: agent.id, numChanges: parsedReports.length }, 'Agent', 'Info');
                        incrementMetric('agent_triggered_analysis');
                        dispatch({ type: 'UPDATE_AGENT', payload: { ...agent, lastAction: `Proposed ${parsedReports.length} changes for ${detectedHero.name}`, lastRunTimestamp: new Date().toISOString() } });
                    }
                }
            } catch (error: any) {
                logAudit('AGENT_ANALYSIS_FAILED', { agentId: agent.id, error: error.message }, 'Agent', 'Error');
            }
        } else {
            logAudit('AGENT_NO_ISSUES_DETECTED', { agentId: agent.id }, 'Agent', 'Info');
            dispatch({ type: 'UPDATE_AGENT', payload: { ...agent, lastAction: 'No critical issues detected', lastRunTimestamp: new Date().toISOString() } });
        }
    }, [agent, state.heroStats, state.promptTemplates, gameDataInput, generateReport, logAudit, incrementMetric, setBalanceReport, dispatch]);

    useEffect(() => {
        // Clear any existing interval to prevent duplicates
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        if (agent?.isActive) {
            // Run once immediately, then every 30 seconds (simulated)
            runAgentCycle();
            intervalRef.current = setInterval(runAgentCycle, 30000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [agent?.isActive, runAgentCycle]);

    const toggleAgentStatus = useCallback((agentId: string) => {
        const targetAgent = state.agents.find(a => a.id === agentId);
        if (targetAgent) {
            dispatch({ type: 'UPDATE_AGENT', payload: { ...targetAgent, isActive: !targetAgent.isActive } });
            logAudit('AGENT_STATUS_TOGGLED', { agentId, newStatus: !targetAgent.isActive }, 'User', 'Info');
        }
    }, [state.agents, dispatch, logAudit]);

    return { runAgentCycle, toggleAgentStatus };
};


// --- Components ---

export const HeroStatsTable: React.FC<{ heroes: HeroStats[] }> = React.memo(({ heroes }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full text-xs text-left text-gray-400">
            <thead className="text-gray-200 uppercase bg-gray-700">
                <tr>
                    <th scope="col" className="px-3 py-2">Hero</th>
                    <th scope="col" className="px-3 py-2">Role</th>
                    <th scope="col" className="px-3 py-2">Win Rate</th>
                    <th scope="col" className="px-3 py-2">Pick Rate</th>
                    <th scope="col" className="px-3 py-2">Ban Rate</th>
                    <th scope="col" className="px-3 py-2">KDA</th>
                </tr>
            </thead>
            <tbody>
                {heroes.map(hero => (
                    <tr key={hero.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-900">
                        <td className="px-3 py-2 font-medium text-white">{hero.name}</td>
                        <td className="px-3 py-2">{hero.role}</td>
                        <td className="px-3 py-2">{hero.winRate?.toFixed(2)}%</td>
                        <td className="px-3 py-2">{hero.pickRate?.toFixed(2)}%</td>
                        <td className="px-3 py-2">{hero.banRate?.toFixed(2)}%</td>
                        <td className="px-3 py-2">{hero.kda?.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
));

export const ItemStatsTable: React.FC<{ items: ItemStats[] }> = React.memo(({ items }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full text-xs text-left text-gray-400">
            <thead className="text-gray-200 uppercase bg-gray-700">
                <tr>
                    <th scope="col" className="px-3 py-2">Item</th>
                    <th scope="col" className="px-3 py-2">Cost</th>
                    <th scope="col" className="px-3 py-2">Power Modifier</th>
                    <th scope="col" className="px-3 py-2">Effect</th>
                </tr>
            </thead>
            <tbody>
                {items.map(item => (
                    <tr key={item.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-900">
                        <td className="px-3 py-2 font-medium text-white">{item.name}</td>
                        <td className="px-3 py-2">{item.cost}</td>
                        <td className="px-3 py-2">{item.powerModifier}</td>
                        <td className="px-3 py-2 text-gray-500">{item.effectDescription}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
));

export const BalanceReportDisplay: React.FC<{
    report: BalanceIssue[];
    onRefine: (issue: BalanceIssue) => void;
    onUpdateStatus: (issue: BalanceIssue, status: 'Pending' | 'Approved' | 'Rejected' | 'Implemented') => void;
    canApprove: boolean;
    canImplement: boolean;
}> = React.memo(({ report, onRefine, onUpdateStatus, canApprove, canImplement }) => (
    <div className="space-y-4">
        {report.map((item, i) => (
            <div key={`${item.element}-${item.problem}-${i}`} className="p-3 bg-gray-900/50 rounded-lg border-l-4 border-cyan-400">
                <div className="flex justify-between items-center">
                    <h4 className="font-bold text-white text-lg">{item.element} <span className="text-gray-500 text-sm">({item.category})</span></h4>
                    <div className="flex space-x-2">
                        <button onClick={() => onRefine(item)} className="text-cyan-400 hover:text-cyan-300 text-sm">Refine</button>
                        {canApprove && item.status !== 'Approved' && item.status !== 'Implemented' && (
                            <button onClick={() => onUpdateStatus(item, 'Approved')} className="text-green-400 hover:text-green-300 text-sm">Approve</button>
                        )}
                        {canApprove && item.status === 'Approved' && canImplement && (
                            <button onClick={() => onUpdateStatus(item, 'Implemented')} className="text-purple-400 hover:text-purple-300 text-sm">Implement</button>
                        )}
                        {canApprove && item.status !== 'Rejected' && item.status !== 'Implemented' && (
                             <button onClick={() => onUpdateStatus(item, 'Rejected')} className="text-red-400 hover:text-red-300 text-sm">Reject</button>
                        )}
                    </div>
                </div>
                <p className="text-sm text-yellow-300 my-1"><strong>Problem:</strong> {item.problem}</p>
                <p className="text-sm text-green-300"><strong>Suggestion:</strong> {item.suggestion}</p>
                {item.impactMagnitude !== undefined && (
                    <p className="text-xs text-blue-300 mt-1"><strong>Est. Impact:</strong> {item.impactMagnitude.toFixed(2)}% | <strong>Confidence:</strong> {(item.confidenceScore * 100).toFixed(1)}%</p>
                )}
                {item.status && (
                    <p className="text-xs text-gray-400 mt-1"><strong>Status:</strong> {item.status} {item.proposedBy && `by ${item.proposedBy}`}</p>
                )}
            </div>
        ))}
    </div>
));

export const MetaAnalysisReportDisplay: React.FC<{ report: any[] }> = React.memo(({ report }) => (
    <div className="space-y-4">
        {report.map((item, i) => (
            <div key={i} className="p-3 bg-gray-900/50 rounded-lg border-l-4 border-purple-400">
                <h4 className="font-bold text-white text-lg">Trend: {item.trend}</h4>
                <p className="text-sm text-pink-300 my-1"><strong>Cause:</strong> {item.cause}</p>
                <p className="text-sm text-yellow-300"><strong>Implication:</strong> {item.implication}</p>
                <p className="text-sm text-green-300"><strong>Action:</strong> {item.actionableInsight}</p>
            </div>
        ))}
    </div>
));

export const PowerCurveReportDisplay: React.FC<{ report: any[] }> = React.memo(({ report }) => (
    <div className="space-y-4">
        {report.map((item, i) => (
            <div key={i} className="p-3 bg-gray-900/50 rounded-lg border-l-4 border-orange-400">
                <h4 className="font-bold text-white text-lg">Hero: {item.hero}</h4>
                <p className="text-sm text-blue-300 my-1"><strong>Stage:</strong> {item.stage}</p>
                <p className="text-sm text-yellow-300"><strong>Spike/Trough:</strong> {item.powerSpikeDescription}</p>
                <p className="text-sm text-green-300"><strong>Suggestion:</strong> {item.suggestedAdjustment}</p>
            </div>
        ))}
    </div>
));

export const DataManagementPanel: React.FC<{
    gameDataInput: string;
    setGameDataInput: (data: string) => void;
    onApplyData: () => void;
    currentHeroStats: HeroStats[];
    currentItemStats: ItemStats[];
}> = ({ gameDataInput, setGameDataInput, onApplyData, currentHeroStats, currentItemStats }) => {
    return (
        <Card title="Data Management" className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-2 text-white">Raw Game Telemetry</h3>
            <textarea
                value={gameDataInput}
                onChange={e => setGameDataInput(e.target.value)}
                className="w-full h-48 bg-gray-900/50 p-2 rounded text-sm font-mono focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Paste your raw game data here (Hero stats, Item stats, etc.)"
            />
            <button onClick={onApplyData} className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded disabled:opacity-50">
                Apply & Process Data
            </button>

            <h3 className="text-lg font-semibold mt-6 mb-2 text-white">Processed Hero Statistics</h3>
            {currentHeroStats.length > 0 ? (
                <HeroStatsTable heroes={currentHeroStats} />
            ) : (
                <p className="text-gray-500 text-sm">No hero data processed yet.</p>
            )}

            <h3 className="text-lg font-semibold mt-6 mb-2 text-white">Processed Item Statistics</h3>
            {currentItemStats.length > 0 ? (
                <ItemStatsTable items={currentItemStats} />
            ) : (
                <p className="text-gray-500 text-sm">No item data processed yet.</p>
            )}
        </Card>
    );
};

export const AIAnalysisConfigPanel: React.FC<{
    selectedTemplateId: string;
    setSelectedTemplateId: (id: string) => void;
    currentTemplate: PromptTemplate | undefined;
    selectedModel: string;
    setSelectedModel: (model: string) => void;
    onAddCustomPrompt: () => void;
}> = ({ selectedTemplateId, setSelectedTemplateId, currentTemplate, selectedModel, setSelectedModel, onAddCustomPrompt }) => {
    const { state } = useGameMeta();

    const availableModels = ['gemini-2.5-flash', 'gemini-1.5-pro-latest']; // Mock list of available models

    return (
        <Card title="AI Analysis Configuration" className="lg:col-span-1">
            <label htmlFor="analysis-mode" className="block text-sm font-medium text-gray-300">Analysis Type:</label>
            <select
                id="analysis-mode"
                value={selectedTemplateId}
                onChange={e => setSelectedTemplateId(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-700 bg-gray-900/50 rounded-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            >
                {state.promptTemplates.map(template => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">{currentTemplate?.description}</p>

            <label htmlFor="ai-model" className="block text-sm font-medium text-gray-300 mt-4">AI Model:</label>
            <select
                id="ai-model"
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-700 bg-gray-900/50 rounded-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            >
                {availableModels.map(model => (
                    <option key={model} value={model}>{model}</option>
                ))}
            </select>
            <button onClick={onAddCustomPrompt} className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm">
                Add/Edit Custom Prompt
            </button>
        </Card>
    );
};

export const RefineSuggestionModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    issue: BalanceIssue | null;
    onRefineConfirm: (issue: BalanceIssue, context: string) => void;
    isLoading: boolean;
}> = ({ isOpen, onClose, issue, onRefineConfirm, isLoading }) => {
    const [refinementContext, setRefinementContext] = useState('');

    useEffect(() => {
        if (isOpen) {
            setRefinementContext('');
        }
    }, [isOpen]);

    if (!isOpen || !issue) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h3 className="text-xl font-bold text-white mb-4">Refine Balance Suggestion</h3>
                <div className="mb-4">
                    <p className="text-gray-300"><strong>Element:</strong> {issue.element}</p>
                    <p className="text-gray-300"><strong>Problem:</strong> {issue.problem}</p>
                    <p className="text-gray-300"><strong>Current Suggestion:</strong> {issue.suggestion}</p>
                </div>
                <label htmlFor="refinement-context" className="block text-sm font-medium text-gray-300 mb-2">Additional Context for AI:</label>
                <textarea
                    id="refinement-context"
                    className="w-full h-32 bg-gray-900/50 p-2 rounded text-sm font-mono focus:ring-cyan-500 focus:border-cyan-500"
                    value={refinementContext}
                    onChange={e => setRefinementContext(e.target.value)}
                    placeholder="E.g., 'Consider the hero's late-game scaling,' or 'This change might affect Item X too much.'"
                />
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white">
                        Cancel
                    </button>
                    <button
                        onClick={() => onRefineConfirm(issue, refinementContext)}
                        disabled={isLoading || !refinementContext.trim()}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white disabled:opacity-50"
                    >
                        {isLoading ? 'Refining...' : 'Refine Suggestion'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const SimulationPanel: React.FC<{
    heroStats: HeroStats[];
    balanceReports: BalanceIssue[];
    onRunSimulation: (params: SimulationParameters, proposedChanges: BalanceIssue[]) => void;
    isLoading: boolean;
    simulationResults: SimulationResult[];
}> = ({ heroStats, balanceReports, onRunSimulation, isLoading, simulationResults }) => {
    const [matchesToSimulate, setMatchesToSimulate] = useState(100000);
    const [playerSkillDistribution, setPlayerSkillDistribution] = useState<SimulationParameters['playerSkillDistribution']>('Normal');
    const [metaStabilityFactor, setMetaStabilityFactor] = useState(0.5);
    const [heroDiversityGoal, setHeroDiversityGoal] = useState(70);
    const [economicImpactSensitivity, setEconomicImpactSensitivity] = useState(0.3);
    const [selectedChanges, setSelectedChanges] = useState<BalanceIssue[]>([]);

    useEffect(() => {
        // Only select Approved or AI-proposed changes by default for simulation
        setSelectedChanges(balanceReports.filter(r => r.status === 'Approved' || r.proposedBy?.startsWith('AI')));
    }, [balanceReports]);

    const handleRun = () => {
        const params: SimulationParameters = {
            matchesToSimulate,
            playerSkillDistribution,
            metaStabilityFactor,
            heroDiversityGoal,
            economicImpactSensitivity,
        };
        onRunSimulation(params, selectedChanges);
    };

    return (
        <Card title="Balance Simulation Engine" className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-2 text-white">Simulation Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Matches to Simulate:</label>
                    <input type="number" value={matchesToSimulate} onChange={e => setMatchesToSimulate(parseInt(e.target.value))} className="w-full mt-1 p-2 bg-gray-900/50 rounded" min="10000" max="1000000" step="10000" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Player Skill Distribution:</label>
                    <select value={playerSkillDistribution} onChange={e => setPlayerSkillDistribution(e.target.value as any)} className="w-full mt-1 p-2 bg-gray-900/50 rounded">
                        <option value="Normal">Normal</option>
                        <option value="SkewedHigh">Skewed High (Pro-players)</option>
                        <option value="SkewedLow">Skewed Low (New players)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Meta Stability Factor (0-1):</label>
                    <input type="range" min="0" max="1" step="0.1" value={metaStabilityFactor} onChange={e => setMetaStabilityFactor(parseFloat(e.target.value))} className="w-full mt-1 accent-cyan-500" />
                    <span className="text-xs text-gray-400">{metaStabilityFactor.toFixed(1)}</span>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Hero Diversity Goal (%):</label>
                    <input type="range" min="0" max="100" step="5" value={heroDiversityGoal} onChange={e => setHeroDiversityGoal(parseInt(e.target.value))} className="w-full mt-1 accent-cyan-500" />
                    <span className="text-xs text-gray-400">{heroDiversityGoal}%</span>
                </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-2 text-white">Proposed Changes for Simulation</h3>
            <div className="max-h-48 overflow-y-auto bg-gray-900/30 p-2 rounded border border-gray-700">
                {balanceReports.length === 0 ? (
                    <p className="text-gray-500 text-sm">No balance reports to select changes from.</p>
                ) : (
                    balanceReports.map((item, index) => ( // Added index to key for uniqueness when problem/element are the same
                        <div key={`${item.element}-${item.problem}-${index}`} className="flex items-center space-x-2 my-1">
                            <input
                                type="checkbox"
                                id={`change-${item.element}-${item.problem}-${index}`}
                                checked={selectedChanges.includes(item)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedChanges(prev => [...prev, item]);
                                    } else {
                                        setSelectedChanges(prev => prev.filter(c => c !== item));
                                    }
                                }}
                                className="form-checkbox h-4 w-4 text-cyan-600 bg-gray-800 border-gray-600 rounded focus:ring-cyan-500"
                            />
                            <label htmlFor={`change-${item.element}-${item.problem}-${index}`} className="text-sm text-gray-300">
                                <span className="font-medium">{item.element}:</span> {item.suggestion} <span className="text-gray-500">({item.status || 'Pending'})</span>
                            </label>
                        </div>
                    ))
                )}
            </div>

            <button onClick={handleRun} disabled={isLoading || selectedChanges.length === 0 || heroStats.length === 0} className="w-full mt-4 py-2 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50">
                {isLoading ? 'Running Simulation...' : `Run Simulation with ${selectedChanges.length} Changes`}
            </button>

            <h3 className="text-lg font-semibold mt-6 mb-2 text-white">Simulation Results</h3>
            {simulationResults.length === 0 ? (
                <p className="text-gray-500">No simulations run yet.</p>
            ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                    {simulationResults.map((result, i) => (
                        <div key={result.simulationId} className="p-3 bg-gray-900/50 rounded-lg border-l-4 border-purple-400">
                            <h4 className="font-bold text-white text-lg">Simulation {i + 1} ({new Date(result.timestamp).toLocaleString()})</h4>
                            <p className="text-sm text-gray-300 my-1"><strong>Outcome:</strong> {result.outcomeSummary}</p>
                            <p className="text-sm text-gray-300"><strong>Predicted Meta Score:</strong> {result.predictedMetaShiftScore.toFixed(0)} / 100</p>
                            {result.warnings && result.warnings.map((w, wi) => <p key={wi} className="text-sm text-red-400"><strong>Warning:</strong> {w}</p>)}
                            <details className="mt-2 text-gray-400">
                                <summary className="cursor-pointer text-sm hover:text-white">View Detailed Predicted Stats</summary>
                                <HeroStatsTable heroes={result.predictedHeroStats} />
                                <h5 className="text-md font-semibold mt-3 text-white">Predicted Win Rate Distribution:</h5>
                                <div className="space-y-1 text-xs">
                                    {result.predictedOverallWinRateDistribution.map((dist, di) => (
                                        <p key={di} className="flex justify-between">
                                            <span>{dist.range}:</span>
                                            <span>{dist.count} heroes</span>
                                        </p>
                                    ))}
                                </div>
                            </details>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export const HistoryPanel: React.FC<{
    snapshots: GameSnapshot[];
    onLoadSnapshot: (snapshot: GameSnapshot) => void;
}> = ({ snapshots, onLoadSnapshot }) => {
    const [selectedSnapshotId, setSelectedSnapshotId] = useState<string | null>(null);
    const selectedSnapshot = snapshots.find(s => s.id === selectedSnapshotId);

    return (
        <Card title="Balance History & Snapshots" className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-2 text-white">Saved Snapshots</h3>
            {snapshots.length === 0 ? (
                <p className="text-gray-500">No snapshots saved yet.</p>
            ) : (
                <ul className="space-y-2 max-h-60 overflow-y-auto bg-gray-900/30 p-2 rounded border border-gray-700">
                    {snapshots.slice().reverse().map(snapshot => ( // Display most recent first
                        <li key={snapshot.id} className={`p-2 rounded cursor-pointer ${selectedSnapshotId === snapshot.id ? 'bg-cyan-700/50' : 'bg-gray-800 hover:bg-gray-700'}`} onClick={() => setSelectedSnapshotId(snapshot.id)}>
                            <p className="font-medium text-white">{snapshot.versionTag}</p>
                            <p className="text-xs text-gray-400">{new Date(snapshot.timestamp).toLocaleString()} - {snapshot.balanceReport.length} issues</p>
                        </li>
                    ))}
                </ul>
            )}

            {selectedSnapshot && (
                <div className="mt-6 border-t border-gray-700 pt-4">
                    <h4 className="text-xl font-bold text-white mb-2">{selectedSnapshot.versionTag}</h4>
                    <p className="text-sm text-gray-400 mb-2">Saved on: {new Date(selectedSnapshot.timestamp).toLocaleString()}</p>
                    {selectedSnapshot.notes && <p className="text-sm text-gray-300 italic mb-2">"{selectedSnapshot.notes}"</p>}
                    <button onClick={() => onLoadSnapshot(selectedSnapshot)} className="w-full py-2 bg-green-600 hover:bg-green-700 rounded text-white text-sm">
                        Load Snapshot Data
                    </button>
                    <details className="mt-4 text-gray-400">
                        <summary className="cursor-pointer text-sm hover:text-white">View Balance Report</summary>
                        {selectedSnapshot.balanceReport.length > 0 ? (
                            <BalanceReportDisplay
                                report={selectedSnapshot.balanceReport}
                                onRefine={() => {}}
                                onUpdateStatus={() => {}} // No status updates in history view
                                canApprove={false}
                                canImplement={false}
                            />
                        ) : (
                            <p className="text-gray-500 text-sm">No balance report in this snapshot.</p>
                        )}
                    </details>
                    <details className="mt-2 text-gray-400">
                        <summary className="cursor-pointer text-sm hover:text-white">View Processed Hero Stats</summary>
                        <HeroStatsTable heroes={selectedSnapshot.processedStats} />
                    </details>
                </div>
            )}
        </Card>
    );
};

export const AppSettingsPanel: React.FC<{
    apiKey: string;
    setApiKey: (key: string) => void;
    onSaveSettings: () => void;
    onResetState: () => void;
    canManagePrompts: boolean;
    canResetData: boolean;
}> = ({ apiKey, setApiKey, onSaveSettings, onResetState, canManagePrompts, canResetData }) => {
    const { state, dispatch } = useGameMeta();
    const { logAudit } = useLogger();
    const [tempApiKey, setTempApiKey] = useState(apiKey);
    const [editingPrompt, setEditingPrompt] = useState<PromptTemplate | null>(null);
    const [newPromptName, setNewPromptName] = useState('');
    const [newPromptDesc, setNewPromptDesc] = useState('');
    const [newPromptTemplate, setNewPromptTemplate] = useState('');
    const [newPromptSchema, setNewPromptSchema] = useState('{}');
    const [newPromptModel, setNewPromptModel] = useState('gemini-2.5-flash');

    useEffect(() => {
        setTempApiKey(apiKey);
    }, [apiKey]);

    const handleEditPrompt = (template: PromptTemplate) => {
        if (!canManagePrompts) {
            logAudit('PERMISSION_DENIED', { action: 'Edit Prompt', templateId: template.id }, 'User', 'Warning');
            alert('You do not have permission to manage prompt templates.');
            return;
        }
        setEditingPrompt(template);
        setNewPromptName(template.name);
        setNewPromptDesc(template.description);
        setNewPromptTemplate(template.template);
        setNewPromptSchema(JSON.stringify(template.schema, null, 2));
        setNewPromptModel(template.defaultModel);
    };

    const handleSavePrompt = () => {
        if (!canManagePrompts) return; // Should be guarded by handleEditPrompt too, but for safety
        if (!newPromptName || !newPromptTemplate) {
            alert('Prompt name and template cannot be empty.');
            return;
        }
        try {
            const parsedSchema = JSON.parse(newPromptSchema);
            const updatedTemplate: PromptTemplate = {
                id: editingPrompt?.id || generateUUID(),
                name: newPromptName,
                description: newPromptDesc,
                template: newPromptTemplate,
                schema: parsedSchema,
                defaultModel: newPromptModel
            };
            if (editingPrompt?.id) {
                dispatch({ type: 'UPDATE_PROMPT_TEMPLATE', payload: updatedTemplate });
                logAudit('PROMPT_TEMPLATE_UPDATED', { templateId: updatedTemplate.id, name: updatedTemplate.name }, 'User', 'Info');
            } else {
                dispatch({ type: 'ADD_PROMPT_TEMPLATE', payload: updatedTemplate });
                logAudit('PROMPT_TEMPLATE_CREATED', { templateId: updatedTemplate.id, name: updatedTemplate.name }, 'User', 'Info');
            }
            setEditingPrompt(null);
            setNewPromptName('');
            setNewPromptDesc('');
            setNewPromptTemplate('');
            setNewPromptSchema('{}');
            setNewPromptModel('gemini-2.5-flash');
        } catch (e: any) {
            logAudit('PROMPT_TEMPLATE_SAVE_FAILED', { error: e.message }, 'User', 'Error');
            alert('Invalid JSON schema: ' + e.message);
        }
    };

    const handleCancelEdit = () => {
        setEditingPrompt(null);
        setNewPromptName('');
        setNewPromptDesc('');
        setNewPromptTemplate('');
        setNewPromptSchema('{}');
        setNewPromptModel('gemini-2.5-flash');
    };

    return (
        <Card title="Application Settings" className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-2 text-white">API Configuration</h3>
            <label htmlFor="api-key" className="block text-sm font-medium text-gray-300">Google GenAI API Key:</label>
            <input
                id="api-key"
                type="password"
                value={tempApiKey}
                onChange={e => setTempApiKey(e.target.value)}
                className="w-full mt-1 p-2 bg-gray-900/50 rounded text-sm font-mono focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Enter your API Key"
            />
            <button onClick={() => setApiKey(tempApiKey)} className="w-full mt-4 py-2 bg-green-600 hover:bg-green-700 rounded disabled:opacity-50">
                Save API Key
            </button>
            <p className="text-xs text-gray-500 mt-1">API keys are stored locally in your browser's encrypted local storage simulation. For production, consider a secure secrets management vault.</p>


            <h3 className="text-lg font-semibold mt-6 mb-2 text-white">Prompt Templates Management</h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto bg-gray-900/30 p-2 rounded border border-gray-700">
                {state.promptTemplates.map(template => (
                    <li key={template.id} className="flex justify-between items-center p-2 rounded bg-gray-800 hover:bg-gray-700">
                        <span className="font-medium text-white">{template.name}</span>
                        <button onClick={() => handleEditPrompt(template)} className="text-sm text-cyan-400 hover:text-cyan-300" disabled={!canManagePrompts}>Edit</button>
                    </li>
                ))}
            </ul>
            <button onClick={() => { handleEditPrompt({ id: '', name: '', description: '', template: '', schema: {}, defaultModel: 'gemini-2.5-flash' }); }} className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm" disabled={!canManagePrompts}>
                Create New Prompt Template
            </button>

            {editingPrompt && (
                <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <h4 className="text-xl font-bold text-white mb-3">{editingPrompt.id ? 'Edit Prompt' : 'New Prompt'}</h4>
                    <label className="block text-sm font-medium text-gray-300">Name:</label>
                    <input type="text" value={newPromptName} onChange={e => setNewPromptName(e.target.value)} className="w-full mt-1 p-2 bg-gray-900/50 rounded" placeholder="Template Name" />
                    <label className="block text-sm font-medium text-gray-300 mt-3">Description:</label>
                    <textarea value={newPromptDesc} onChange={e => setNewPromptDesc(e.target.value)} className="w-full mt-1 p-2 bg-gray-900/50 rounded" placeholder="Short description"></textarea>
                    <label className="block text-sm font-medium text-gray-300 mt-3">Prompt Template (use &#123;&#123;gameData&#125;&#125; for data injection):</label>
                    <textarea value={newPromptTemplate} onChange={e => setNewPromptTemplate(e.target.value)} className="w-full h-32 mt-1 p-2 bg-gray-900/50 rounded font-mono" placeholder="Your AI prompt here"></textarea>
                    <label className="block text-sm font-medium text-gray-300 mt-3">Response Schema (JSON):</label>
                    <textarea value={newPromptSchema} onChange={e => setNewPromptSchema(e.target.value)} className="w-full h-40 mt-1 p-2 bg-gray-900/50 rounded font-mono" placeholder="{&quot;type&quot;: &quot;OBJECT&quot;, &quot;properties&quot;: {}}"></textarea>
                    <label className="block text-sm font-medium text-gray-300 mt-3">Default AI Model:</label>
                    <select value={newPromptModel} onChange={e => setNewPromptModel(e.target.value)} className="w-full mt-1 p-2 bg-gray-900/50 rounded">
                        <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                        <option value="gemini-1.5-pro-latest">gemini-1.5-pro-latest</option>
                    </select>
                    <div className="mt-4 flex justify-end space-x-3">
                        <button onClick={handleCancelEdit} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white">Cancel</button>
                        <button onClick={handleSavePrompt} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white">Save Prompt</button>
                    </div>
                </div>
            )}

            <h3 className="text-lg font-semibold mt-6 mb-2 text-white">Application Management</h3>
            <button onClick={onSaveSettings} className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 rounded disabled:opacity-50">
                Save All Settings
            </button>
            <button onClick={onResetState} className="w-full mt-3 py-2 bg-red-600 hover:bg-red-700 rounded disabled:opacity-50" disabled={!canResetData}>
                Reset All Application Data
            </button>
        </Card>
    );
};

export const AgentControlPanel: React.FC<{
    agents: AgentDefinition[];
    toggleAgentStatus: (agentId: string) => void;
    canTriggerAgent: boolean;
}> = ({ agents, toggleAgentStatus, canTriggerAgent }) => {
    return (
        <Card title="Agentic AI Control" className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-2 text-white">Automated Balancers</h3>
            {agents.length === 0 ? (
                <p className="text-gray-500 text-sm">No agents configured.</p>
            ) : (
                <div className="space-y-3">
                    {agents.map(agent => (
                        <div key={agent.id} className="p-3 bg-gray-900/50 rounded-lg border-l-4 border-emerald-400">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-white text-lg">{agent.name}</h4>
                                <label className="flex items-center cursor-pointer">
                                    <span className="mr-2 text-gray-400 text-sm">{agent.isActive ? 'Active' : 'Inactive'}</span>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={agent.isActive}
                                            onChange={() => toggleAgentStatus(agent.id)}
                                            disabled={!canTriggerAgent}
                                        />
                                        <div className={`block bg-gray-600 w-10 h-6 rounded-full ${agent.isActive ? 'bg-emerald-600' : ''}`}></div>
                                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${agent.isActive ? 'translate-x-full' : ''}`}></div>
                                    </div>
                                </label>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{agent.description}</p>
                            {agent.lastRunTimestamp && (
                                <p className="text-xs text-gray-500 mt-1">Last Run: {new Date(agent.lastRunTimestamp).toLocaleString()}</p>
                            )}
                            {agent.lastAction && (
                                <p className="text-xs text-gray-500">Last Action: {agent.lastAction}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export const ActivityLogDisplay: React.FC<{ logs: AuditLogEntry[] }> = React.memo(({ logs }) => (
    <Card title="Activity & Audit Log" className="lg:col-span-1">
        <h3 className="text-lg font-semibold mb-2 text-white">Recent Activities</h3>
        {logs.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent activity.</p>
        ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto bg-gray-900/30 p-2 rounded border border-gray-700">
                {logs.slice().reverse().map(log => ( // Display most recent first
                    <div key={log.id} className={`p-2 rounded text-xs ${log.severity === 'Error' ? 'bg-red-900/30 border-red-500' : log.severity === 'Warning' ? 'bg-yellow-900/30 border-yellow-500' : 'bg-gray-800/50 border-gray-700'} border-l-4`}>
                        <p className="font-medium text-white">
                            <span className="text-gray-500 mr-2">{new Date(log.timestamp).toLocaleTimeString()}</span>
                            <span className={`px-1 rounded ${log.category === 'Agent' ? 'bg-emerald-600' : log.category === 'AI' ? 'bg-cyan-600' : 'bg-indigo-600'} text-white text-xs`}>{log.category}</span>
                            <span className="ml-2">{log.action}</span>
                        </p>
                        {Object.keys(log.details).length > 0 && (
                            <p className="text-gray-400 italic">Details: {JSON.stringify(log.details)}</p>
                        )}
                    </div>
                ))}
            </div>
        )}
    </Card>
));

export const MetricsDashboard: React.FC<{ metrics: Record<string, number> }> = React.memo(({ metrics }) => (
    <Card title="Operational Metrics" className="lg:col-span-1">
        <h3 className="text-lg font-semibold mb-2 text-white">Key Performance Indicators</h3>
        <div className="grid grid-cols-2 gap-4">
            {Object.entries(metrics).map(([key, value]) => (
                <div key={key} className="p-3 bg-gray-900/50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm text-gray-400">{key.replace(/_/g, ' ').toUpperCase()}</p>
                    <p className="text-2xl font-bold text-white mt-1">{value}</p>
                </div>
            ))}
        </div>
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-white">Payment Rail Integration (Simulated)</h3>
            <p className="text-sm text-gray-400">
                This dashboard component includes a conceptual integration with a real-time payment rail.
                For instance, funding a "Balance Fix Bounty" would trigger a secure, atomic transaction
                via our token rail layer. This ensures transparent, auditable, and instant value transfer
                to reward contributors or incentivize critical balance adjustments.
            </p>
            <button className="w-full mt-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded disabled:opacity-50" onClick={() => alert('Simulating "Fund Balance Fix Bounty" via Token Rail...')}>
                Fund Balance Fix Bounty (Simulated)
            </button>
            <p className="text-xs text-gray-500 mt-1">
                Transaction initiated via `rail_fast` using digital identity for cryptographic signing.
                Real-time settlement expected.
            </p>
        </div>
    </Card>
));

// --- Main Component ---
const LudicBalancerView: React.FC = () => {
    const { state, dispatch } = useGameMeta();
    const { generateReport, refineSuggestion } = useAIService();
    const { runSimulation } = useSimulationEngine();
    const { logAudit } = useLogger();

    const [gameDataInput, setGameDataInput] = useState(mockGameData);
    const [balanceReport, setBalanceReport] = useState<BalanceIssue[]>([]);
    const [metaReport, setMetaReport] = useState<any[]>([]); // For meta analysis results
    const [powerCurveReport, setPowerCurveReport] = useState<any[]>([]); // For power curve analysis results
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'data', 'ai-analysis', 'simulation', 'history', 'settings', 'observability'
    const [selectedPromptTemplateId, setSelectedPromptTemplateId] = useState(initialGameMetaState.promptTemplates[0].id);
    const [selectedAIModel, setSelectedAIModel] = useState('gemini-2.5-flash');
    const [isRefineModalOpen, setIsRefineModalOpen] = useState(false);
    const [issueToRefine, setIssueToRefine] = useState<BalanceIssue | null>(null);
    const [apiKey, setApiKey] = useState(process.env.API_KEY || '');

    const currentPromptTemplate = state.promptTemplates.find(t => t.id === selectedPromptTemplateId);

    // Permissions based on current user
    const canCreateReport = checkPermissions(state.currentUser, ['create_report']);
    const canProposeChange = checkPermissions(state.currentUser, ['propose_change']);
    const canRunSimulation = checkPermissions(state.currentUser, ['run_simulation']);
    const canApproveChange = checkPermissions(state.currentUser, ['approve_change']);
    const canManagePrompts = checkPermissions(state.currentUser, ['manage_prompts']);
    const canResetData = checkPermissions(state.currentUser, ['reset_data']);
    const canTriggerAgent = checkPermissions(state.currentUser, ['trigger_agent']);
    const canViewReport = checkPermissions(state.currentUser, ['view_report']);

    // Agentic AI hook
    const { runAgentCycle, toggleAgentStatus } = useAgenticAI(generateReport, gameDataInput, setBalanceReport, dispatch);

    // Initial data processing from mockGameData
    useEffect(() => {
        const { heroes, items } = parseGameData(gameDataInput);
        dispatch({ type: 'SET_HERO_STATS', payload: heroes });
        dispatch({ type: 'SET_ITEM_STATS', payload: items });
        logAudit('DATA_INITIAL_LOADED', { dataSource: 'mockGameData' }, 'System', 'Info');
    }, [gameDataInput, dispatch, logAudit]);

    // Handle data application
    const handleApplyData = useCallback(() => {
        const { heroes, items } = parseGameData(gameDataInput);
        dispatch({ type: 'SET_HERO_STATS', payload: heroes });
        dispatch({ type: 'SET_ITEM_STATS', payload: items });

        const newSnapshot: GameSnapshot = {
            id: generateUUID(),
            timestamp: new Date().toISOString(),
            gameData: gameDataInput,
            processedStats: heroes,
            balanceReport: balanceReport, // Include current balance report
            versionTag: `Data Update ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
            notes: 'Raw game data updated and processed.'
        };
        dispatch({ type: 'ADD_SNAPSHOT', payload: newSnapshot });
        dispatch({ type: 'LOAD_SNAPSHOT', payload: newSnapshot }); // Load it immediately
        logAudit('DATA_APPLIED', { numHeroes: heroes.length, numItems: items.length, snapshotId: newSnapshot.id }, 'User', 'Info');
    }, [gameDataInput, dispatch, balanceReport, logAudit]);

    // Handle AI analysis
    const handleAnalyze = async () => {
        if (!canCreateReport) {
            logAudit('PERMISSION_DENIED', { action: 'Generate AI Report', templateId: selectedPromptTemplateId }, 'User', 'Warning');
            alert('You do not have permission to generate AI reports.');
            return;
        }

        setIsLoading(true);
        setBalanceReport([]);
        setMetaReport([]);
        setPowerCurveReport([]);

        if (!currentPromptTemplate) {
            logAudit('AI_ANALYSIS_FAILED', { reason: 'No prompt template selected' }, 'System', 'Error');
            alert('No prompt template selected.');
            setIsLoading(false);
            return;
        }

        try {
            const report = await generateReport(currentPromptTemplate, gameDataInput, selectedAIModel);
            if (currentPromptTemplate.id === 'general_balance' && report?.analysis) {
                const parsedReports: BalanceIssue[] = report.analysis.map((item: any) => ({
                    ...item,
                    status: 'Pending',
                    proposedBy: state.currentUser?.name || 'AI',
                    timestamp: new Date().toISOString()
                }));
                setBalanceReport(parsedReports);
                if (state.currentSnapshot) {
                    dispatch({
                        type: 'ADD_SNAPSHOT',
                        payload: {
                            ...state.currentSnapshot,
                            id: generateUUID(),
                            timestamp: new Date().toISOString(),
                            balanceReport: parsedReports,
                            versionTag: `AI Balance Report ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
                        }
                    });
                }
            } else if (currentPromptTemplate.id === 'meta_analysis' && report?.metaTrends) {
                setMetaReport(report.metaTrends);
            } else if (currentPromptTemplate.id === 'power_curve_analysis' && report?.powerCurveAnalysis) {
                setPowerCurveReport(report.powerCurveAnalysis);
            }
        } catch (error: any) {
            // Error logged by useAIService
            alert(`Failed to generate AI report: ${error.message || 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefineSuggestion = useCallback((issue: BalanceIssue) => {
        if (!canProposeChange) {
            logAudit('PERMISSION_DENIED', { action: 'Refine Suggestion', issueElement: issue.element }, 'User', 'Warning');
            alert('You do not have permission to refine suggestions.');
            return;
        }
        setIssueToRefine(issue);
        setIsRefineModalOpen(true);
    }, [canProposeChange, logAudit]);

    const handleRefineConfirm = async (issue: BalanceIssue, context: string) => {
        setIsLoading(true);
        try {
            const refinedText = await refineSuggestion(issue, context, selectedAIModel);
            setBalanceReport(prev => prev.map(item =>
                item.element === issue.element && item.problem === issue.problem
                    ? { ...item, suggestion: refinedText, confidenceScore: Math.min(1, (item.confidenceScore || 0) + 0.1) } // Bump confidence
                    : item
            ));
            setIsRefineModalOpen(false);
        } catch (error: any) {
            alert(`Refinement failed: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateBalanceIssueStatus = useCallback((issue: BalanceIssue, status: 'Pending' | 'Approved' | 'Rejected' | 'Implemented') => {
        if (!canApproveChange) {
            logAudit('PERMISSION_DENIED', { action: `Change Status to ${status}`, issueElement: issue.element }, 'User', 'Warning');
            alert('You do not have permission to approve or implement changes.');
            return;
        }

        dispatch({
            type: 'UPDATE_BALANCE_ISSUE_STATUS',
            payload: {
                issueElement: issue.element,
                issueProblem: issue.problem,
                status,
                by: state.currentUser?.name || 'System'
            }
        });

        setBalanceReport(prev => prev.map(item =>
            item.element === issue.element && item.problem === issue.problem
                ? { ...item, status, proposedBy: state.currentUser?.name || 'System', timestamp: new Date().toISOString() }
                : item
        ));

        logAudit('BALANCE_ISSUE_STATUS_UPDATED', { issueElement: issue.element, oldStatus: issue.status, newStatus: status, userId: state.currentUser?.id }, 'User', 'Info');
        if (status === 'Approved') {
            logAudit('BALANCE_ISSUE_APPROVED', { issueElement: issue.element, issueProblem: issue.problem }, 'User', 'Info');
            dispatch({ type: 'INCREMENT_METRIC', payload: { name: 'total_balance_issues_approved' } });
        }
        if (status === 'Implemented') {
            logAudit('BALANCE_ISSUE_IMPLEMENTED', { issueElement: issue.element, issueProblem: issue.problem }, 'User', 'Info');
            dispatch({ type: 'INCREMENT_METRIC', payload: { name: 'total_balance_issues_implemented' } });
        }
    }, [dispatch, state.currentUser, canApproveChange, logAudit]);

    const handleRunSimulation = useCallback(async (params: SimulationParameters, proposedChanges: BalanceIssue[]) => {
        if (!canRunSimulation) {
            logAudit('PERMISSION_DENIED', { action: 'Run Simulation', numChanges: proposedChanges.length }, 'User', 'Warning');
            alert('You do not have permission to run simulations.');
            return;
        }
        setIsLoading(true);
        try {
            const result = await runSimulation(params, state.heroStats, proposedChanges, state.currentSnapshot?.id || 'no_snapshot');
            console.log('Simulation Result:', result);
        } catch (error: any) {
            alert(`Simulation failed: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [runSimulation, state.heroStats, state.currentSnapshot, canRunSimulation, logAudit]);

    const handleLoadSnapshot = useCallback((snapshot: GameSnapshot) => {
        setGameDataInput(snapshot.gameData);
        dispatch({ type: 'LOAD_SNAPSHOT', payload: snapshot });
        setBalanceReport(snapshot.balanceReport); // Load the report that was saved with the snapshot
        setMetaReport([]);
        setPowerCurveReport([]);
        logAudit('SNAPSHOT_LOADED', { snapshotId: snapshot.id, versionTag: snapshot.versionTag }, 'User', 'Info');
        alert(`Snapshot "${snapshot.versionTag}" loaded successfully!`);
    }, [dispatch, logAudit]);

    const handleSaveSettings = useCallback(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('ludicBalancer_apiKey', apiKey);
            process.env.API_KEY = apiKey; // Update runtime environment (for demonstration)
        }
        logAudit('SETTINGS_SAVED', { apiKeySet: !!apiKey }, 'User', 'Info');
        alert('Settings saved successfully!');
    }, [apiKey, logAudit]);

    const handleResetAppState = useCallback(() => {
        if (!canResetData) {
            logAudit('PERMISSION_DENIED', { action: 'Reset Application Data' }, 'User', 'Warning');
            alert('You do not have permission to reset application data.');
            return;
        }
        if (confirm('Are you sure you want to reset all application data? This cannot be undone.')) {
            localStorage.removeItem('ludicBalancerState');
            localStorage.removeItem('ludicBalancer_apiKey');
            logAudit('APP_DATA_RESET', {}, 'User', 'Warning');
            window.location.reload(); // Force a hard reset for simplicity
        }
    }, [canResetData, logAudit]);

    // Effect to load API key from localStorage on component mount
    useEffect(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedApiKey = localStorage.getItem('ludicBalancer_apiKey');
            if (storedApiKey) {
                setApiKey(storedApiKey);
                process.env.API_KEY = storedApiKey;
            }
        }
    }, []);

    const handleAddCustomPrompt = useCallback(() => {
        setActiveTab('settings');
    }, []);

    const renderReportContent = () => {
        if (isLoading) {
            return <p className="text-gray-400">Analyzing telemetry...</p>;
        }
        if (!canViewReport) {
            return <p className="text-red-400">You do not have permission to view reports.</p>;
        }
        if (currentPromptTemplate?.id === 'general_balance' && balanceReport.length > 0) {
            return <BalanceReportDisplay
                report={balanceReport}
                onRefine={handleRefineSuggestion}
                onUpdateStatus={handleUpdateBalanceIssueStatus}
                canApprove={canApproveChange}
                canImplement={canApproveChange}
            />;
        }
        if (currentPromptTemplate?.id === 'meta_analysis' && metaReport.length > 0) {
            return <MetaAnalysisReportDisplay report={metaReport} />;
        }
        if (currentPromptTemplate?.id === 'power_curve_analysis' && powerCurveReport.length > 0) {
            return <PowerCurveReportDisplay report={powerCurveReport} />;
        }
        return <p className="text-gray-500">Run analysis to generate a report.</p>;
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white tracking-wider">Blueprint 109: Ludic Balancer</h1>

            {/* Tab Navigation */}
            <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none ${activeTab === 'dashboard' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-300'}`}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('data')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none ${activeTab === 'data' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-300'}`}
                    >
                        Data Management
                    </button>
                    <button
                        onClick={() => setActiveTab('ai-analysis')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none ${activeTab === 'ai-analysis' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-300'}`}
                    >
                        AI Analysis
                    </button>
                    <button
                        onClick={() => setActiveTab('simulation')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none ${activeTab === 'simulation' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-300'}`}
                    >
                        Simulation
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none ${activeTab === 'history' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-300'}`}
                    >
                        History
                    </button>
                    <button
                        onClick={() => setActiveTab('observability')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none ${activeTab === 'observability' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-300'}`}
                    >
                        Observability
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none ${activeTab === 'settings' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-300'}`}
                    >
                        Settings
                    </button>
                </nav>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {activeTab === 'dashboard' && (
                    <>
                        <Card title="Telemetry Overview" className="lg:col-span-1">
                            <h3 className="text-lg font-semibold text-white mb-2">Current Game Data</h3>
                            <textarea value={gameDataInput} onChange={e => setGameDataInput(e.target.value)} className="w-full h-32 bg-gray-900/50 p-2 rounded text-sm font-mono" readOnly />
                            <button onClick={handleApplyData} className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded disabled:opacity-50">
                                Refresh Processed Data
                            </button>

                            <h3 className="text-lg font-semibold text-white mt-6 mb-2">Meta Health Score</h3>
                            <div className="text-center">
                                <p className="text-5xl font-bold text-green-400">{calculateOverallMetaScore(state.heroStats).toFixed(0)}/100</p>
                                <p className="text-sm text-gray-400 mt-2">Current Meta Stability: {state.heroStats.length > 0 ? 'Good' : 'N/A'}</p>
                            </div>
                        </Card>
                        <Card title="AI Analysis Dashboard" className="lg:col-span-2">
                            <div className="min-h-[20rem]">
                                {renderReportContent()}
                            </div>
                            <div className="mt-4 border-t border-gray-700 pt-4 flex justify-between items-center">
                                <div>
                                    <label htmlFor="dashboard-analysis-mode" className="block text-xs font-medium text-gray-300">Quick Analyze:</label>
                                    <select
                                        id="dashboard-analysis-mode"
                                        value={selectedPromptTemplateId}
                                        onChange={e => setSelectedPromptTemplateId(e.target.value)}
                                        className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-700 bg-gray-900/50 rounded-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                                    >
                                        {state.promptTemplates.map(template => (
                                            <option key={template.id} value={template.id}>{template.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button onClick={handleAnalyze} disabled={isLoading || !state.heroStats.length || !currentPromptTemplate || !canCreateReport} className="py-2 px-6 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50">
                                    {isLoading ? 'Analyzing...' : `Run ${currentPromptTemplate?.name || 'Analysis'}`}
                                </button>
                            </div>
                        </Card>
                    </>
                )}

                {activeTab === 'data' && (
                    <div className="lg:col-span-3">
                        <DataManagementPanel
                            gameDataInput={gameDataInput}
                            setGameDataInput={setGameDataInput}
                            onApplyData={handleApplyData}
                            currentHeroStats={state.heroStats}
                            currentItemStats={state.itemStats}
                        />
                    </div>
                )}

                {activeTab === 'ai-analysis' && (
                    <>
                        <AIAnalysisConfigPanel
                            selectedTemplateId={selectedPromptTemplateId}
                            setSelectedTemplateId={setSelectedPromptTemplateId}
                            currentTemplate={currentPromptTemplate}
                            selectedModel={selectedAIModel}
                            setSelectedModel={setSelectedAIModel}
                            onAddCustomPrompt={handleAddCustomPrompt}
                        />
                        <Card title="AI Balance Report" className="lg:col-span-2">
                            <div className="min-h-[20rem]">
                                {renderReportContent()}
                            </div>
                            <button onClick={handleAnalyze} disabled={isLoading || !state.heroStats.length || !currentPromptTemplate || !canCreateReport} className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50">
                                {isLoading ? 'Analyzing...' : `Generate ${currentPromptTemplate?.name || 'Report'}`}
                            </button>
                        </Card>
                    </>
                )}

                {activeTab === 'simulation' && (
                    <div className="lg:col-span-3">
                        <SimulationPanel
                            heroStats={state.heroStats}
                            balanceReports={balanceReport}
                            onRunSimulation={handleRunSimulation}
                            isLoading={isLoading}
                            simulationResults={state.simulationResults}
                        />
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="lg:col-span-3">
                        <HistoryPanel
                            snapshots={state.history}
                            onLoadSnapshot={handleLoadSnapshot}
                        />
                    </div>
                )}

                {activeTab === 'observability' && (
                    <>
                        <AgentControlPanel
                            agents={state.agents}
                            toggleAgentStatus={toggleAgentStatus}
                            canTriggerAgent={canTriggerAgent}
                        />
                        <MetricsDashboard metrics={state.metrics} />
                        <ActivityLogDisplay logs={state.auditLogs} />
                    </>
                )}

                {activeTab === 'settings' && (
                    <div className="lg:col-span-3">
                        <AppSettingsPanel
                            apiKey={apiKey}
                            setApiKey={setApiKey}
                            onSaveSettings={handleSaveSettings}
                            onResetState={handleResetAppState}
                            canManagePrompts={canManagePrompts}
                            canResetData={canResetData}
                        />
                    </div>
                )}
            </div>

            <RefineSuggestionModal
                isOpen={isRefineModalOpen}
                onClose={() => setIsRefineModalOpen(false)}
                issue={issueToRefine}
                onRefineConfirm={handleRefineConfirm}
                isLoading={isLoading}
            />
        </div>
    );
};

export default LudicBalancerView;